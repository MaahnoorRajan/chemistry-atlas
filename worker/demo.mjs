const demoCookie = '__Host-atlas-demo';
const demoLifetime = 3 * 60 * 60;
const demoVideo = '4TlaSEUIjuA';

async function demoSession(request, env) {
  const token = readCookie(request, demoCookie);
  const match = token?.match(/^([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\.(student|teacher)\.(\d{10})\.([A-F0-9]{8})\.([a-f0-9]{64})$/);
  if (!match || !env.DEMO_SESSION_KEY) return null;
  const [, id, role, expires, code, signature] = match;
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return null;
  const {key, bytes} = await sign('demo:' + [id,role,expires,code].join('.'),env.DEMO_SESSION_KEY);
  const mac = Uint8Array.from(signature.match(/../g), value => parseInt(value,16));
  if (!await crypto.subtle.verify('HMAC',key,mac,bytes)) return null;
  const name = role === 'teacher' ? 'Demo Teacher' : 'Demo Student';
  const user = { id:role === 'teacher' ? id : id + '-student', email:'', user_metadata:{atlas_name:name} };
  return { user, role, demo:{id, expires:Number(expires), code}, cookies:[] };
}

async function siteSession(request, env) {
  return await demoSession(request, env) || await accountSession(request, env);
}

async function seedDemo(db, now) {
  const id = crypto.randomUUID();
  const code = crypto.randomUUID().slice(0,8).toUpperCase();
  const other = crypto.randomUUID().slice(0,8).toUpperCase();
  const expires = now + demoLifetime;
  const due = new Date((now + 3 * 86400) * 1000).toISOString().slice(0,10);
  const insert = db.prepare('INSERT INTO demo_assignments (code,class_name,video_id,owner_id,due_date) VALUES (?, ?, ?, ?, ?)');
  const attempt = db.prepare('INSERT INTO demo_attempts (assignment_code,student_id,student_name,answers) VALUES (?, ?, ?, ?)');
  const keys = quizCatalog[demoVideo].keys;
  const room=crypto.randomUUID().slice(0,8).toUpperCase();
  await db.batch([
    db.prepare('DELETE FROM demo_sessions WHERE expires_at <= ?').bind(now),
    db.prepare('INSERT INTO demo_sessions (id, expires_at) VALUES (?, ?)').bind(id,expires),
    insert.bind(code,'8A',demoVideo,id,due),
    insert.bind(other,'8A','jNfgGh-aL2g',id,null),
    db.prepare('INSERT INTO demo_rooms(code,class_name,owner_id) VALUES(?,?,?)').bind(room,'8A',id),
    db.prepare('UPDATE demo_assignments SET room_code=? WHERE owner_id=?').bind(room,id),
    db.prepare('INSERT INTO demo_members(room_code,student_id,student_name) VALUES(?,?,?)').bind(room,'sample-a','Aida'),
    db.prepare('INSERT INTO demo_members(room_code,student_id,student_name) VALUES(?,?,?)').bind(room,'sample-b','Bek'),
    attempt.bind(code,'sample-a','Aida',JSON.stringify(keys)),
    attempt.bind(code,'sample-b','Bek',JSON.stringify(keys.map((answer,i) => i === 0 ? (answer+1)%3 : answer)))
  ]);
  return { id, code, expires };
}

async function demoAction(request,env,url) {
  if (request.method !== 'POST') return new Response(null,{status:405});
  if (!sameOrigin(request,url) || request.headers.get('Origin') !== url.origin) return new Response(null,{status:403});
  const lang = language(url.searchParams.get('lang'));
  if (url.pathname === '/demo/end') return redirect(route(lang,{auth:'login'}),clearCookies(demoCookie));
  if (url.pathname !== '/demo/start') return new Response(null,{status:404});
  const role = url.searchParams.get('as');
  if (!['student','teacher'].includes(role)) return new Response(null,{status:400});
  const back = () => redirect(route(lang,{auth:'login',as:role,status:'demoUnavailable'}));
  if (!env.DB || !env.DEMO_SESSION_KEY) return back();
  const now = Math.floor(Date.now() / 1000);
  let sandbox;
  try {
    sandbox = (await demoSession(request,env))?.demo || await seedDemo(env.DB,now);
  } catch {
    return back();
  }
  const value = [sandbox.id,role,sandbox.expires,sandbox.code].join('.');
  const {key,bytes} = await sign('demo:' + value,env.DEMO_SESSION_KEY);
  const signature = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,bytes)), b => b.toString(16).padStart(2,'0')).join('');
  const destination = role === 'teacher' ? {dashboard:'1'} : {video:demoVideo,class:sandbox.code};
  return redirect(route(lang,destination),[cookie(demoCookie,value + '.' + signature,sandbox.expires-now)]);
}
