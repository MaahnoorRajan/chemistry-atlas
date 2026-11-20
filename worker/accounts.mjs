const accessCookie = '__Host-atlas-access';
const refreshCookie = '__Host-atlas-refresh';
const resetCookie = '__Host-atlas-reset';
const flowCookie = '__Host-atlas-flow';
const sessionAge = 7 * 24 * 60 * 60;
const encode = new TextEncoder();

function language(value) {
  return ['ky', 'ru', 'en'].includes(value) ? value : 'ky';
}

function route(lang, options = {}) {
  return '/?' + new URLSearchParams({ lang, ...options });
}

function cookie(name, value, age) {
  return name + '=' + value + '; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=' + age;
}

function readCookie(request, name) {
  return (request.headers.get('Cookie') || '').split(';').map(part => part.trim())
    .find(part => part.startsWith(name + '='))?.slice(name.length + 1);
}

function clearCookies(...names) {
  return names.map(name => cookie(name, '', 0));
}

function withCookies(response, cookies) {
  for (const value of cookies) response.headers.append('Set-Cookie', value);
  return response;
}

function redirect(location, cookies = []) {
  return withCookies(new Response(null, {
    status: 303,
    headers: { Location: location, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }
  }), cookies);
}

function sameOrigin(request, url) {
  const origin = request.headers.get('Origin');
  return request.headers.get('Sec-Fetch-Site') !== 'cross-site' && (!origin || origin === url.origin);
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encode.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  return { key, bytes: encode.encode(value) };
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function supabase(env, path, { method = 'GET', token, body } = {}) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) return { ok: false, status: 503, data: {} };
  const headers = { apikey: env.SUPABASE_PUBLISHABLE_KEY, 'X-Supabase-Api-Version': '2024-01-01' };
  if (token) headers.Authorization = 'Bearer ' + token;
  if (body) headers['Content-Type'] = 'application/json';
  try {
    const response = await fetch(new URL('/auth/v1/' + path, env.SUPABASE_URL), {
      method, headers, body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(8000)
    });
    return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
  } catch {
    return { ok: false, status: 503, data: {} };
  }
}

function accountRole(user) {
  if (!user?.id || !user.email_confirmed_at || user.is_anonymous) return '';
  return user.app_metadata?.chemistry_atlas_role === 'teacher' ? 'teacher' : 'student';
}

function sessionCookies(data) {
  return [
    cookie(accessCookie, data.access_token, sessionAge),
    cookie(refreshCookie, data.refresh_token, sessionAge)
  ];
}

async function accountSession(request, env) {
  const token = readCookie(request, accessCookie);
  const refresh = readCookie(request, refreshCookie);
  if (token) {
    const current = await supabase(env, 'user', { token });
    if (current.ok) return { user: current.data, role: accountRole(current.data), token, cookies: [] };
    if (current.status >= 500 || current.status === 429) return { cookies: [], unavailable: true };
  }
  if (!refresh) return { cookies: [] };
  const next = await supabase(env, 'token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: refresh } });
  if (next.ok && next.data.access_token && next.data.refresh_token) {
    return {
      user: next.data.user, role: accountRole(next.data.user),
      token: next.data.access_token, cookies: sessionCookies(next.data)
    };
  }
  // A parallel request may already have rotated this token. Avoid clearing its newer cookies.
  return { cookies: [], unavailable: next.status >= 500 || next.status === 429 };
}

function accountContext(url) {
  const params = url.searchParams;
  const context = {};
  if (params.has('quiz')) context.quiz = '1';
  if (params.has('dashboard')) context.dashboard = '1';
  if (params.has('student')) context.student = '1';
  const code = params.get('class')?.toUpperCase();
  if (classCode(code)) context.class = code;
  const video = params.get('video');
  if (Object.hasOwn(quizCatalog, video)) context.video = video;
  const role = params.get('as') === 'teacher' ? 'teacher' : 'student';
  return { lang: language(params.get('lang')), role, context };
}

function accountLocation(info, form = '', status = '') {
  const { lang, role, context } = info;
  return route(lang, {
    ...context, ...(form && { auth: form, as: role }), ...(status && { status })
  });
}

function storeFlow(verifier, info, kind) {
  return encodeURIComponent(JSON.stringify({ verifier, info, kind }));
}

function getFlow(request) {
  try {
    return JSON.parse(decodeURIComponent(readCookie(request, flowCookie) || ''));
  } catch {
    return null;
  }
}

function authError(response) {
  if (response.status === 429 || /rate_limit/.test(response.data.code || '')) return 'rate';
  if (response.data.code === 'email_address_invalid') return 'invalidEmail';
  if (response.data.code === 'email_address_not_authorized') return 'delivery';
  if (response.data.code === 'email_not_confirmed') return 'unconfirmed';
  if (['weak_password', 'same_password'].includes(response.data.code)) return 'weak';
  if (response.data.code === 'invalid_credentials') return 'credentials';
  return 'unavailable';
}

async function accountCallback(request, env, url) {
  const flow = getFlow(request);
  const code = url.searchParams.get('code');
  const info = flow?.info ?? accountContext(url);
  const cleared = clearCookies(flowCookie);
  if (flow?.kind === 'google' && url.searchParams.has('error')) {
    return redirect(accountLocation(info,'login','googleCancelled'),cleared);
  }
  if (!code || !flow?.verifier) return redirect(accountLocation(info, 'login', 'expired'), cleared);
  const response = await supabase(env, 'token?grant_type=pkce', {
    method: 'POST', body: { auth_code: code, code_verifier: flow.verifier }
  });
  if (!response.ok || !accountRole(response.data.user) || !response.data.access_token || !response.data.refresh_token) {
    return redirect(accountLocation(info, 'login', 'expired'), cleared);
  }
  if (flow.kind === 'forgot') {
    return redirect(accountLocation(info, 'reset'), [
      ...cleared, cookie(resetCookie, response.data.access_token, 10 * 60)
    ]);
  }
  if (flow.kind === 'google') {
    const user=response.data.user;
    if(info.role==='teacher' && accountRole(user)==='student') {
      const updated=await supabase(env,'user',{method:'PUT',token:response.data.access_token,
        body:{data:{atlas_teacher_requested:true}}});
      if(!updated.ok) {
        await supabase(env,'logout?scope=local',{method:'POST',token:response.data.access_token});
        return redirect(accountLocation(info,'login','unavailable'),cleared);
      }
      await trackTeacherRequest(updated.data,env);
      return redirect(route(info.lang,{...info.context,auth:'profile',as:'student',status:'teacherPending'}),
        [...cleared,...sessionCookies(response.data),...clearCookies(demoCookie)]);
    }
    if(!info.context.video && !info.context.quiz) {
      delete info.context.dashboard;
      delete info.context.student;
      info.context[accountRole(user)==='teacher'?'dashboard':'student']='1';
    }
    return redirect(accountLocation(info),[...cleared,...sessionCookies(response.data),...clearCookies(demoCookie)]);
  }
  await trackTeacherRequest(response.data.user,env);
  await supabase(env, 'logout?scope=local', { method: 'POST', token: response.data.access_token });
  if (info.role === 'teacher' && accountRole(response.data.user) === 'student') {
    return redirect(accountLocation(info, 'login', 'teacherPending'), cleared);
  }
  return redirect(accountLocation(info, 'login', 'confirmed'), cleared);
}

function cleanName(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, 60) : '';
}

function accountName(user) {
  return cleanName(user?.user_metadata?.atlas_name || user?.user_metadata?.full_name || user?.user_metadata?.name);
}

async function trackTeacherRequest(user,env) {
  if (!env.DB||!user?.email_confirmed_at||!user.user_metadata?.atlas_teacher_requested||accountRole(user)==='teacher') return;
  await env.DB.prepare('INSERT INTO teacher_requests(user_id,email,display_name) VALUES(?,?,?) ON CONFLICT(user_id) DO NOTHING')
    .bind(user.id,user.email,accountName(user)).run();
}

async function accountAction(request, env, url) {
  if (request.method !== 'POST' || !sameOrigin(request, url) || request.headers.get('Origin') !== url.origin) {
    return new Response(null, { status: request.method !== 'POST' ? 405 : 403 });
  }
  const action = url.pathname.slice('/account/'.length);
  const info = accountContext(url);
  if(action==='google') {
    const settings=await supabase(env,'settings');
    if(!settings.ok) return redirect(accountLocation(info,'login','unavailable'));
    if(!settings.data.external?.google) return redirect(accountLocation(info,'login','googleSetup'));
    const verifier=base64url(crypto.getRandomValues(new Uint8Array(32)));
    const challenge=base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',encode.encode(verifier))));
    const callback=new URL('/account/callback',env.SITE_AUTH_ORIGIN||url.origin);
    const destination=new URL('/auth/v1/authorize',env.SUPABASE_URL);
    destination.search=new URLSearchParams({provider:'google',redirect_to:callback.href,code_challenge:challenge,
      code_challenge_method:'s256',scopes:'openid email profile',prompt:'select_account'}).toString();
    return redirect(destination.href,[cookie(flowCookie,storeFlow(verifier,info,'google'),60*60)]);
  }
  if (action === 'logout') {
    if (await demoSession(request,env)) return redirect(route(info.lang,{auth:'login'}),clearCookies(demoCookie));
    const session = await accountSession(request, env);
    if (session.token) await supabase(env, 'logout?scope=local', { method: 'POST', token: session.token });
    return redirect(route(info.lang), clearCookies(accessCookie, refreshCookie, resetCookie, flowCookie, 'chemistry_demo_role'));
  }
  if (!['login', 'register', 'forgot', 'reset', 'profile'].includes(action)) return new Response(null, { status: 404 });
  if(env.AUTH_MODE==='google' && action!=='profile') return redirect(accountLocation(info,'login'));
  if (['register','forgot'].includes(action)&&env.AUTH_EMAIL_READY==='false') {
    return redirect(accountLocation(info,action,'emailSetup'));
  }
  const data = await request.formData().catch(() => null);
  const email = String(data?.get('email') || '').trim().toLowerCase();
  const password = String(data?.get('password') || '');
  const name = cleanName(data?.get('name'));
  const validEmail = email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPassword = password.length >= 10 && encode.encode(password).length <= 72;
  const back = (status, cookies) => redirect(accountLocation(info, action, status), cookies);

  if (action === 'profile') {
    if (await demoSession(request,env)) return new Response(null,{status:403});
    const session = await accountSession(request, env);
    if (!session.role) return redirect(accountLocation(info, 'login', session.unavailable ? 'unavailable' : ''), session.cookies);
    if (!name) return back('invalid', session.cookies);
    const saved = await supabase(env, 'user', { method: 'PUT', token: session.token, body: { data: { atlas_name: name } } });
    return back(saved.ok ? 'saved' : authError(saved), session.cookies);
  }
  if (action === 'reset') {
    const token = readCookie(request, resetCookie);
    if (!token) return redirect(accountLocation(info, 'forgot', 'expired'));
    if (!validPassword || password !== data.get('confirm')) return back('invalid');
    const saved = await supabase(env, 'user', { method: 'PUT', token, body: { password } });
    if (!saved.ok) {
      if ([401, 403].includes(saved.status)) return redirect(accountLocation(info, 'forgot', 'expired'), clearCookies(resetCookie));
      return back(authError(saved));
    }
    await supabase(env, 'logout', { method: 'POST', token });
    return redirect(accountLocation(info, 'login', 'resetDone'), clearCookies(resetCookie, accessCookie, refreshCookie));
  }
  if (!validEmail) return back('invalidEmail');
  if (action === 'register' && (!name || !validPassword || password !== data.get('confirm'))) return back('invalid');
  if (action === 'login') {
    if (!password || encode.encode(password).length > 72) return back('invalid');
    const response = await supabase(env, 'token?grant_type=password', { method: 'POST', body: { email, password } });
    if (!response.ok) return back(authError(response));
    const role = accountRole(response.data.user);
    await trackTeacherRequest(response.data.user,env);
    if (role !== info.role || !response.data.access_token || !response.data.refresh_token) {
      if (response.data.access_token) await supabase(env, 'logout?scope=local', { method: 'POST', token: response.data.access_token });
      return back(role === 'student' ? 'teacherPending' : role === 'teacher' ? 'teacherLogin' : 'unconfirmed');
    }
    if (role === 'teacher' && !info.context.video && !info.context.quiz) info.context.dashboard = '1';
    if (role === 'student' && !info.context.video && !info.context.quiz) info.context.student = '1';
    return redirect(accountLocation(info), [...sessionCookies(response.data), ...clearCookies(demoCookie)]);
  }

  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', encode.encode(verifier))));
  const callback = new URL('/account/callback', env.SITE_AUTH_ORIGIN || url.origin);
  const endpoint = action === 'register' ? 'signup' : 'recover';
  const body = { email, code_challenge: challenge, code_challenge_method: 's256' };
  if (action === 'register') {
    body.password = password;
    body.data = { atlas_name: name, atlas_teacher_requested: info.role === 'teacher' };
  }
  const response = await supabase(env, endpoint + '?' + new URLSearchParams({ redirect_to: callback.href }), { method: 'POST', body });
  if (!response.ok && !['user_already_exists', 'email_exists', 'user_not_found'].includes(response.data.code)) return back(authError(response));
  if (response.data.access_token && response.data.refresh_token) {
    await supabase(env, 'logout?scope=local', { method: 'POST', token: response.data.access_token });
  }
  return back('sent', [cookie(flowCookie, storeFlow(verifier, info, action), 60 * 60)]);
}
