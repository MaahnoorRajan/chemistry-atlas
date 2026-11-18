const roles = { teacher: 'LAB-TEACH', student: 'LAB-LEARN' };
const sessionName = 'chemistry_demo_role';
const sessionAge = 8 * 60 * 60;
const encode = new TextEncoder();

function language(value) {
  return ['ky', 'ru', 'en'].includes(value) ? value : 'ky';
}

function route(lang, options = {}) {
  return '/?' + new URLSearchParams({ lang, ...options });
}

function redirect(location, cookie) {
  const headers = { Location: location, 'Cache-Control': 'no-store' };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(null, { status: 303, headers });
}

function cookie(value, maxAge) {
  return sessionName + '=' + value + '; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=' + maxAge;
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encode.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  return { key, bytes: encode.encode(value) };
}

function roleCookie(request) {
  return (request.headers.get('Cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(sessionName + '='))?.slice(sessionName.length + 1);
}

async function sessionRole(request, secret) {
  const token = roleCookie(request);
  const match = /^(teacher|student)\.(\d+)\.([a-f0-9]{64})$/.exec(token || '');
  if (!match || Number(match[2]) <= Date.now() / 1000 || !secret) return '';
  const [, role, expires, hex] = match;
  const signature = Uint8Array.from(hex.match(/../g), byte => parseInt(byte, 16));
  const { key, bytes } = await sign(role + '.' + expires, secret);
  return await crypto.subtle.verify('HMAC', key, signature, bytes) ? role : '';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const lang = language(url.searchParams.get('lang'));
    const secret = env.DEMO_SESSION_KEY;
    if (url.pathname.startsWith('/api/')) {
      try { return await classroom(request, env, await sessionRole(request, secret), url); }
      catch { return json({ error:'unavailable' }, 503); }
    }
    const assignment = url.searchParams.get('class');
    const assignmentQuery = classCode(assignment) ? { class:assignment } : {};
    if (request.method === 'POST' && ['/role-login', '/role-logout'].includes(url.pathname)) {
      if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return new Response('Forbidden', { status: 403 });
      if (url.pathname === '/role-logout') return redirect(route(lang), cookie('', 0));
      if (!secret) return new Response('Demo sign-in is unavailable.', { status: 503 });
      const data = await request.formData().catch(() => null);
      const role = data?.get('role');
      if (!Object.hasOwn(roles, role)) return redirect(route(lang));
      if (data.get('code')?.toString().trim() !== roles[role]) {
        return redirect(route(lang, { as: role, error: '1', ...(url.searchParams.has('quiz') && { quiz: '1', ...assignmentQuery }) }));
      }
      const value = role + '.' + (Math.floor(Date.now() / 1000) + sessionAge);
      const { key, bytes } = await sign(value, secret);
      const signature = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
      return redirect(route(lang, role === 'student' && url.searchParams.has('quiz') ? { quiz: '1', ...assignmentQuery } : {}), cookie(value + '.' + signature, sessionAge));
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
    const asset = Object.hasOwn(assets, url.pathname) && assets[url.pathname];
    if (asset) {
      const body = request.method === 'HEAD' ? null :
        asset.base64 ? Uint8Array.from(atob(asset.base64), char => char.charCodeAt(0)) : asset.body;
      return new Response(body, { headers: { 'Content-Type': asset.type, 'Cache-Control': 'no-cache' } });
    }
    if (!['/', '/index.html'].includes(url.pathname)) return new Response('Not found', { status: 404 });

    const role = await sessionRole(request, secret);
    return new Response(request.method === 'HEAD' ? null : page.replace('data-role=""', 'data-role="' + role + '"'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' }
    });
  }
};
