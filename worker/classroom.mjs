const legacyQuizVideo = 'jNfgGh-aL2g';
const requiredVideoSeconds = 663;
const classCode = value => /^[A-F0-9]{8}$/.test(value || '');

function validDueDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '2000-01-01') return false;
  const date = new Date(value);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0,10) === value;
}

function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function watchSignature(userId, env, code, stage, time) {
  const { key, bytes } = await sign([userId, code, stage, time].join(':'), env.DEMO_SESSION_KEY);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, bytes));
  return Array.from(signature, byte => byte.toString(16).padStart(2,'0')).join('');
}

async function watchToken(userId, env, code, stage) {
  const time = Date.now();
  return time + '.' + await watchSignature(userId,env,code,stage,time);
}

async function watchAge(userId, env, code, stage, token) {
  const valid = typeof token === 'string' && /^(\d{13})\.([a-f0-9]{64})$/.exec(token);
  if (!valid) return -1;
  const [, time, signature] = valid;
  const age = Date.now() - Number(time);
  if (age < 0 || age > 2 * 60 * 60 * 1000) return -1;
  const { key, bytes } = await sign([userId,code,stage,time].join(':'),env.DEMO_SESSION_KEY);
  const data = Uint8Array.from(signature.match(/../g), byte => parseInt(byte,16));
  return await crypto.subtle.verify('HMAC',key,data,bytes) ? age : -1;
}

async function classroom(request, env, session, url) {
  const { role, user, demo } = session;
  if (!role) return json({ error:'signin' }, 401);
  if (!env.DB) return json({ error:'unavailable' }, 503);
  const db = env.DB;
  const classroomTable = demo ? 'demo_assignments' : 'assignments';
  const attemptsTable = demo ? 'demo_attempts' : 'attempts';
  const endpoint = url.pathname;
  const method = request.method;
  const isWrite = method === 'POST';
  const learning = await learningApi(request,env,session,url);
  if (learning) return learning;

  if (endpoint === '/api/teacher-overview' && method === 'GET') {
    if (role !== 'teacher') return json({ error:'forbidden' }, 403);
    const [assignments, students, recent] = await Promise.all([
      db.prepare(`SELECT a.code, a.class_name, a.quiz_open, a.video_id, a.due_date,
        (SELECT COUNT(*) FROM ${attemptsTable} t WHERE t.assignment_code = a.code) AS submissions
        FROM ${classroomTable} a WHERE a.owner_id = ? ORDER BY a.created_at DESC, a.code DESC`).bind(user.id).all(),
      db.prepare(`SELECT COUNT(DISTINCT m.student_id) AS total FROM ${learningTables(demo).members} m
        JOIN ${learningTables(demo).rooms} r ON m.room_code=r.code WHERE r.owner_id = ?`).bind(user.id).first(),
      db.prepare(`SELECT t.student_name, t.created_at, a.code, a.class_name, a.video_id FROM ${attemptsTable} t
        JOIN ${classroomTable} a ON t.assignment_code = a.code WHERE a.owner_id = ?
        ORDER BY t.created_at DESC, a.code DESC, t.student_id DESC LIMIT 6`).bind(user.id).all()
    ]);
    return json({ name:accountName(user), assignments:assignments.results,
      students:students.total, recent:recent.results });
  }

  if (endpoint === '/api/assignments') {
    if (role !== 'teacher') return json({ error:'forbidden' }, 403);
    if (method === 'GET') {
      const { results } = await db.prepare(`SELECT code, class_name, video_id, archived, due_date, allow_late FROM ${classroomTable} WHERE owner_id = ? ORDER BY created_at DESC, code DESC`).bind(user.id).all();
      return json({ assignments:results });
    }
    if (isWrite) {
      const data = await request.json().catch(() => null);
      const name = typeof data?.name === 'string' ? data.name.trim() : '';
      const videoId = data?.videoId ?? legacyQuizVideo;
      const dueDate = data?.dueDate ?? null;
      if (!name || name.length > 40 || !Object.hasOwn(quizCatalog,videoId) ||
          (dueDate !== null && !validDueDate(dueDate))) return json({ error:'invalid' }, 400);
      const code = crypto.randomUUID().slice(0,8).toUpperCase();
      const rooms=learningTables(demo).rooms;
      await db.prepare(`INSERT INTO ${rooms}(code,class_name,owner_id) VALUES(?,?,?) ON CONFLICT(owner_id,class_name) DO NOTHING`).bind(crypto.randomUUID().slice(0,8).toUpperCase(),name,user.id).run();
      const room=await db.prepare(`SELECT code FROM ${rooms} WHERE owner_id=? AND class_name=?`).bind(user.id,name).first();
      await db.prepare(`INSERT INTO ${classroomTable} (code, class_name, video_id, owner_id, due_date,room_code,quiz_open) VALUES (?, ?, ?, ?, ?, ?, 0)`).bind(code,name,videoId,user.id,dueDate,room.code).run();
      return json({ code, class_name:name, video_id:videoId, due_date:dueDate }, 201);
    }
  }

  const code = url.searchParams.get('code')?.toUpperCase();
  if (!classCode(code)) return json({ error:'notfound' }, 404);
  const assignment = await db.prepare(`SELECT code, class_name, quiz_open, video_id, owner_id, due_date,room_code,archived,allow_late FROM ${classroomTable} WHERE code = ?`).bind(code).first();
  const owner = demo?.id || (role === 'teacher' ? user.id : null);
  if (!assignment?.owner_id || (owner && assignment.owner_id !== owner)) return json({ error:'notfound' }, 404);
  const answerKey = quizCatalog[assignment.video_id].keys;
  const extra = await assignmentLearningApi(request,env,session,url,assignment);
  if (extra) return extra;
  if (role==='student' && assignment.archived && !['/api/attempt','/api/notebook'].includes(endpoint)) return json({error:'archived'},403);

  if (endpoint === '/api/assignment' && method === 'GET') {
    const { class_name, quiz_open, video_id, due_date,room_code,archived,allow_late } = assignment;
    return json({ code, class_name, quiz_open, video_id, due_date,room_code,archived,allow_late });
  }
  if (endpoint === '/api/quiz-state' && isWrite) {
    if (role !== 'teacher') return json({ error:'forbidden' },403);
    const data = await request.json().catch(() => null);
    if (typeof data?.open !== 'boolean'||assignment.archived&&data.open) return json({error:'invalid'},400);
    await db.prepare(`UPDATE ${classroomTable} SET quiz_open = ? WHERE code = ? AND owner_id = ?`).bind(Number(data.open),code,user.id).run();
    return json({quiz_open:Number(data.open)});
  }
  if (isWrite && ['/api/watch-start','/api/watch-finish','/api/watch-check'].includes(endpoint)) {
    if (role !== 'student') return json({error:'forbidden'},403);
    if (!assignment.quiz_open) return json({error:'closed'},403);
    if (endpoint === '/api/watch-start') {
      await enrollStudent(db,learningTables(demo),user,assignment.room_code);
      return json({token:await watchToken(user.id,env,code,'start')});
    }
    const data = await request.json().catch(() => null);
    if (endpoint === '/api/watch-check') {
      const age = await watchAge(user.id,env,code,'finished',data?.receipt);
      return age >= 0 ? json({finished:true,video_id:assignment.video_id}) : json({error:'watch'},403);
    }
    const age = await watchAge(user.id,env,code,'start',data?.token);
    const duration = data?.duration;
    const trustedDuration=quizCatalog[assignment.video_id].duration;
    if (!Number.isFinite(duration) || Math.abs(duration-trustedDuration)>2 ||
        (assignment.video_id !== (data.videoId ?? legacyQuizVideo)) ||
        age < Math.max(0,trustedDuration * 500 - 1500)) {
      return json({error:'watch'},403);
    }
    return json({receipt:await watchToken(user.id,env,code,'finished')});
  }
  if (endpoint === '/api/results' && method === 'GET') {
    if (role !== 'teacher') return json({ error:'forbidden' }, 403);
    const { results } = await db.prepare(`SELECT student_id, student_name, answers FROM ${attemptsTable} WHERE assignment_code = ? ORDER BY created_at, student_id`).bind(code).all();
    const missed = answerKey.map(() => 0);
    const answered = answerKey.map(() => 0);
    const attempts = results.map(row => {
      const answers = JSON.parse(row.answers);
      const total = Math.min(answers.length,answerKey.length);
      const score = answerKey.slice(0,total).reduce((sum, correct, i) => {
        answered[i]++;
        if (answers[i] === correct) return sum + 1;
        missed[i]++;
        return sum;
      }, 0);
      return { student_name:row.student_name || row.student_id, score, total };
    });
    return json({ attempts, missed, answered, quiz_open:assignment.quiz_open, video_id:assignment.video_id });
  }
  if (endpoint === '/api/attempt' && method === 'GET') {
    if (role !== 'student') return json({error:'forbidden'},403);
    const attempt = await db.prepare(`SELECT answers FROM ${attemptsTable} WHERE assignment_code = ? AND student_id = ?`).bind(code,user.id).first();
    if (!attempt) return json({ saved:false });
    const answers = JSON.parse(attempt.answers);
    const score = answers.reduce((sum, answer, index) => sum + Number(answer === answerKey[index]), 0);
    return json({ saved:true, score, total:answers.length });
  }
  if (endpoint === '/api/attempt' && isWrite) {
    if (role !== 'student') return json({ error:'forbidden' }, 403);
    if (!assignment.quiz_open) return json({error:'closed'},403);
    if (assignment.archived) return json({error:'archived'},403);
    if (!assignment.allow_late&&assignment.due_date&&Date.now()>Date.parse(assignment.due_date+'T23:59:59+06:00')) return json({error:'late'},403);
    const data = await request.json().catch(() => null);
    if (await watchAge(user.id,env,code,'finished',data?.receipt) < 0) return json({error:'watch'},403);
    const name = accountName(user) || '—';
    const answers = data?.answers;
    if (!Array.isArray(answers) || answers.length !== answerKey.length ||
        !answers.every(value => Number.isInteger(value) && value >= 0 && value <= 2)) {
      return json({ error:'invalid' }, 400);
    }
    const result = await db.prepare(`INSERT INTO ${attemptsTable} (assignment_code, student_id, answers, student_name) SELECT code, ?, ?, ? FROM ${classroomTable} WHERE code = ? AND quiz_open = 1 ON CONFLICT DO NOTHING`).bind(user.id,JSON.stringify(answers),name,code).run();
    if (!result.meta.changes) {
      const existing = await db.prepare(`SELECT 1 AS found FROM ${attemptsTable} WHERE assignment_code = ? AND student_id = ?`).bind(code,user.id).first();
      return json({error:existing ? 'duplicate' : 'closed'},existing ? 409 : 403);
    }
    return json({ saved:true }, 201);
  }
  return json({ error:'notfound' }, 404);
}
