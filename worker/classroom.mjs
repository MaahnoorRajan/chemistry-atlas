const legacyQuizVideo = 'jNfgGh-aL2g';
const requiredVideoSeconds = 663;
const classCode = value => /^[A-F0-9]{8}$/.test(value || '');
const studentId = value => /^[A-Z0-9-]{2,20}$/.test(value || '');

function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function watchSignature(request, env, code, stage, time) {
  const { key, bytes } = await sign([roleCookie(request), code, stage, time].join(':'), env.DEMO_SESSION_KEY);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, bytes));
  return Array.from(signature, byte => byte.toString(16).padStart(2,'0')).join('');
}

async function watchToken(request, env, code, stage) {
  const time = Date.now();
  return time + '.' + await watchSignature(request,env,code,stage,time);
}

async function watchAge(request, env, code, stage, token) {
  const valid = typeof token === 'string' && /^(\d{13})\.([a-f0-9]{64})$/.exec(token);
  if (!valid) return -1;
  const [, time, signature] = valid;
  const age = Date.now() - Number(time);
  if (age < 0 || age > 2 * 60 * 60 * 1000) return -1;
  const { key, bytes } = await sign([roleCookie(request),code,stage,time].join(':'),env.DEMO_SESSION_KEY);
  const data = Uint8Array.from(signature.match(/../g), byte => parseInt(byte,16));
  return await crypto.subtle.verify('HMAC',key,data,bytes) ? age : -1;
}

async function classroom(request, env, role, url) {
  if (!role) return json({ error:'signin' }, 401);
  if (!env.DB) return json({ error:'unavailable' }, 503);
  const db = env.DB;
  const endpoint = url.pathname;
  const method = request.method;
  const isWrite = method === 'POST';
  if (isWrite && request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({ error:'forbidden' }, 403);

  if (endpoint === '/api/assignments') {
    if (role !== 'teacher') return json({ error:'forbidden' }, 403);
    if (method === 'GET') {
      const { results } = await db.prepare('SELECT code, class_name, video_id FROM assignments ORDER BY created_at DESC, code DESC').all();
      return json({ assignments:results });
    }
    if (isWrite) {
      const data = await request.json().catch(() => null);
      const name = typeof data?.name === 'string' ? data.name.trim() : '';
      const videoId = data?.videoId ?? legacyQuizVideo;
      if (!name || name.length > 40 || !Object.hasOwn(quizCatalog,videoId)) return json({ error:'invalid' }, 400);
      const code = crypto.randomUUID().slice(0,8).toUpperCase();
      await db.prepare('INSERT INTO assignments (code, class_name, video_id) VALUES (?, ?, ?)').bind(code,name,videoId).run();
      return json({ code, class_name:name, video_id:videoId }, 201);
    }
  }

  const code = url.searchParams.get('code')?.toUpperCase();
  if (!classCode(code)) return json({ error:'notfound' }, 404);
  const assignment = await db.prepare('SELECT code, class_name, quiz_open, video_id FROM assignments WHERE code = ?').bind(code).first();
  if (!assignment) return json({ error:'notfound' }, 404);
  const answerKey = quizCatalog[assignment.video_id].keys;

  if (endpoint === '/api/assignment' && method === 'GET') return json(assignment);
  if (endpoint === '/api/quiz-state' && isWrite) {
    if (role !== 'teacher') return json({ error:'forbidden' },403);
    const data = await request.json().catch(() => null);
    if (typeof data?.open !== 'boolean') return json({error:'invalid'},400);
    await db.prepare('UPDATE assignments SET quiz_open = ? WHERE code = ?').bind(Number(data.open),code).run();
    return json({quiz_open:Number(data.open)});
  }
  if (isWrite && ['/api/watch-start','/api/watch-finish','/api/watch-check'].includes(endpoint)) {
    if (role !== 'student') return json({error:'forbidden'},403);
    if (!assignment.quiz_open) return json({error:'closed'},403);
    if (endpoint === '/api/watch-start') return json({token:await watchToken(request,env,code,'start')});
    const data = await request.json().catch(() => null);
    if (endpoint === '/api/watch-check') {
      const age = await watchAge(request,env,code,'finished',data?.receipt);
      return age >= 0 ? json({finished:true,video_id:assignment.video_id}) : json({error:'watch'},403);
    }
    const age = await watchAge(request,env,code,'start',data?.token);
    const duration = data?.duration;
    if (!Number.isFinite(duration) || duration < 1 || duration > 7200 ||
        (assignment.video_id !== (data.videoId ?? legacyQuizVideo)) ||
        (assignment.video_id === legacyQuizVideo && Math.abs(duration - requiredVideoSeconds) > 2) ||
        age < Math.max(0,duration * 500 - 1500)) {
      return json({error:'watch'},403);
    }
    return json({receipt:await watchToken(request,env,code,'finished')});
  }
  if (endpoint === '/api/results' && method === 'GET') {
    if (role !== 'teacher') return json({ error:'forbidden' }, 403);
    const { results } = await db.prepare('SELECT student_id, answers FROM attempts WHERE assignment_code = ? ORDER BY created_at, student_id').bind(code).all();
    const missed = answerKey.map(() => 0);
    const attempts = results.map(row => {
      const answers = JSON.parse(row.answers);
      const score = answerKey.reduce((sum, correct, i) => {
        if (answers[i] === correct) return sum + 1;
        missed[i]++;
        return sum;
      }, 0);
      return { student_id:row.student_id, score };
    });
    return json({ attempts, missed, quiz_open:assignment.quiz_open, video_id:assignment.video_id });
  }
  if (endpoint === '/api/attempt' && isWrite) {
    if (role !== 'student') return json({ error:'forbidden' }, 403);
    if (!assignment.quiz_open) return json({error:'closed'},403);
    const data = await request.json().catch(() => null);
    if (await watchAge(request,env,code,'finished',data?.receipt) < 0) return json({error:'watch'},403);
    const id = typeof data?.id === 'string' ? data.id.trim().toUpperCase() : '';
    const answers = data?.answers;
    if (!studentId(id) || !Array.isArray(answers) || answers.length !== answerKey.length ||
        !answers.every(value => Number.isInteger(value) && value >= 0 && value <= 2)) {
      return json({ error:'invalid' }, 400);
    }
    const result = await db.prepare('INSERT INTO attempts (assignment_code, student_id, answers) SELECT code, ?, ? FROM assignments WHERE code = ? AND quiz_open = 1 ON CONFLICT DO NOTHING').bind(id,JSON.stringify(answers),code).run();
    if (!result.meta.changes) {
      const existing = await db.prepare('SELECT 1 AS found FROM attempts WHERE assignment_code = ? AND student_id = ?').bind(code,id).first();
      return json({error:existing ? 'duplicate' : 'closed'},existing ? 409 : 403);
    }
    return json({ saved:true }, 201);
  }
  return json({ error:'notfound' }, 404);
}
