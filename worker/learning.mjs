function learningTables(demo) {
  const prefix = demo ? 'demo_' : '';
  return { rooms:prefix+'rooms', members:prefix+'members', notes:prefix+'notebooks',
    history:prefix+'attempt_history', assignments:prefix+'assignments', attempts:prefix+'attempts' };
}

function quizScore(videoId, answers) {
  const keys = quizCatalog[videoId].keys;
  const total = Math.min(answers.length,keys.length);
  return { score:keys.slice(0,total).reduce((score,key,index)=>score+Number(key===answers[index]),0), total };
}

async function enrollStudent(db, tables, user, roomCode) {
  await db.prepare(`INSERT INTO ${tables.members}(room_code,student_id,student_name) VALUES(?,?,?)
    ON CONFLICT(room_code,student_id) DO UPDATE SET student_name=excluded.student_name`)
    .bind(roomCode,user.id,cleanName(user.user_metadata?.atlas_name)||'—').run();
}

async function learningApi(request,env,session,url) {
  const {user,role,demo} = session;
  const db=env.DB, tables=learningTables(demo);
  const path=url.pathname, post=request.method==='POST';
  if(path==='/api/teacher-request' && post && role==='student' && !demo){
    const requested=await supabase(env,'user',{method:'PUT',token:session.token,body:{data:{atlas_teacher_requested:true}}});
    if(!requested.ok)return json({error:'unavailable'},503);
    await db.prepare("INSERT INTO teacher_requests(user_id,email,display_name) VALUES(?,?,?) ON CONFLICT(user_id) DO NOTHING")
      .bind(user.id,user.email,cleanName(user.user_metadata?.atlas_name)).run();
    return json({saved:true});
  }
  if (path === '/api/rooms' && role==='teacher') {
    if (request.method==='GET') {
      const {results}=await db.prepare(`SELECT r.*, (SELECT COUNT(*) FROM ${tables.members} m WHERE m.room_code=r.code) AS students
        FROM ${tables.rooms} r WHERE owner_id=? ORDER BY class_name`).bind(user.id).all();
      return json({rooms:results});
    }
    if (post) {
      const data=await request.json().catch(()=>null);
      const name=cleanName(data?.name);
      if (!name||name.length>40) return json({error:'invalid'},400);
      await db.prepare(`INSERT INTO ${tables.rooms}(code,class_name,owner_id) VALUES(?,?,?) ON CONFLICT(owner_id,class_name) DO NOTHING`)
        .bind(crypto.randomUUID().slice(0,8).toUpperCase(),name,user.id).run();
      return json({saved:true},201);
    }
  }
  if (path === '/api/enroll' && post && role==='student') {
    const data=await request.json().catch(()=>null);
    const code=String(data?.code||'').trim().toUpperCase();
    if (!classCode(code)) return json({error:'notfound'},404);
    const assigned=await db.prepare(`SELECT room_code,archived FROM ${tables.assignments} WHERE code=?`).bind(code).first();
    const room=await db.prepare(`SELECT * FROM ${tables.rooms} WHERE code=?`).bind(assigned?.room_code||code).first();
    if (!room||assigned?.archived||demo&&room.owner_id!==demo.id) return json({error:'notfound'},404);
    await enrollStudent(db,tables,user,room.code);
    return json({saved:true,room:room.class_name});
  }
  if (path === '/api/student-overview' && request.method==='GET' && role==='student') {
    const {results}=await db.prepare(`SELECT a.code,a.class_name,a.video_id,a.quiz_open,a.due_date,a.archived,a.allow_late,
      t.answers,n.updated_at AS notebook_saved FROM ${tables.assignments} a
      JOIN ${tables.members} m ON m.room_code=a.room_code AND m.student_id=?
      LEFT JOIN ${tables.attempts} t ON t.assignment_code=a.code AND t.student_id=m.student_id
      LEFT JOIN ${tables.notes} n ON n.assignment_code=a.code AND n.student_id=m.student_id
      ORDER BY a.created_at DESC,a.code DESC`).bind(user.id).all();
    const history=await db.prepare(`SELECT h.assignment_code,h.answers,h.created_at,a.video_id FROM ${tables.history} h
      JOIN ${tables.assignments} a ON a.code=h.assignment_code WHERE h.student_id=? ORDER BY h.created_at DESC`).bind(user.id).all();
    return json({assignments:results.map(({answers,...row})=>({...row,result:answers?quizScore(row.video_id,JSON.parse(answers)):null})),
      history:history.results.map(({answers,...row})=>({...row,...quizScore(row.video_id,JSON.parse(answers))}))});
  }
  if (path.startsWith('/api/admin-')) {
    if (demo||user.app_metadata?.chemistry_atlas_admin!==true) return json({error:'forbidden'},403);
    if (path==='/api/admin-requests' && request.method==='GET') {
      const {results}=await db.prepare("SELECT user_id,email,display_name,status FROM teacher_requests ORDER BY created_at").bind().all();
      return json({requests:results,canApprove:true});
    }
    if (path==='/api/admin-decision' && post) {
      const data=await request.json().catch(()=>null);
      if (!['approved','rejected'].includes(data?.decision)) return json({error:'invalid'},400);
      const application=await db.prepare("SELECT user_id FROM teacher_requests WHERE user_id=? AND status='pending'").bind(data.userId).first();
      if (!application) return json({error:'notfound'},404);
      if (data.decision==='approved') {
        const target=new URL('/functions/v1/teacher-approval',env.SUPABASE_URL);
        const headers={apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+session.token,'Content-Type':'application/json'};
        const changed=await fetch(target,{method:'POST',headers,body:JSON.stringify({userId:data.userId}),signal:AbortSignal.timeout(8000)});
        if (!changed.ok) return json({error:'unavailable'},503);
      }
      await db.prepare('UPDATE teacher_requests SET status=? WHERE user_id=?').bind(data.decision,data.userId).run();
      return json({saved:true});
    }
  }
  return null;
}

async function assignmentLearningApi(request,env,session,url,assignment) {
  const {user,role,demo}=session;
  const tables=learningTables(demo), db=env.DB, code=assignment.code;
  const path=url.pathname, post=request.method==='POST';
  if (path==='/api/assignment-edit' && post && role==='teacher') {
    const data=await request.json().catch(()=>null);
    if (!data || typeof data.archived!=='boolean'||typeof data.allowLate!=='boolean'||
      (data.dueDate!==null&&!validDueDate(data.dueDate))) return json({error:'invalid'},400);
    await db.prepare(`UPDATE ${tables.assignments} SET due_date=?,archived=?,allow_late=?,quiz_open=CASE WHEN ?=1 THEN 0 ELSE quiz_open END WHERE code=? AND owner_id=?`)
      .bind(data.dueDate,Number(data.archived),Number(data.allowLate),Number(data.archived),code,user.id).run();
    return json({saved:true});
  }
  if (path==='/api/roster' && request.method==='GET' && role==='teacher') {
    const {results}=await db.prepare(`SELECT m.student_id,m.student_name,t.answers,n.cells,n.feedback,n.updated_at
      FROM ${tables.members} m LEFT JOIN ${tables.attempts} t ON t.assignment_code=? AND t.student_id=m.student_id
      LEFT JOIN ${tables.notes} n ON n.assignment_code=? AND n.student_id=m.student_id
      WHERE m.room_code=? ORDER BY m.student_name,m.student_id`).bind(code,code,assignment.room_code).all();
    return json({students:results.map(({answers,cells,...row})=>({...row,result:answers?quizScore(assignment.video_id,JSON.parse(answers)):null,cells:cells?JSON.parse(cells):{}}))});
  }
  if (path==='/api/retake' && post && role==='teacher') {
    const data=await request.json().catch(()=>null);
    const id=typeof data?.studentId==='string'?data.studentId:'';
    await db.batch([
      db.prepare(`INSERT INTO ${tables.history}(id,assignment_code,student_id,answers) SELECT ?,assignment_code,student_id,answers FROM ${tables.attempts} WHERE assignment_code=? AND student_id=?`).bind(crypto.randomUUID(),code,id),
      db.prepare(`DELETE FROM ${tables.attempts} WHERE assignment_code=? AND student_id=?`).bind(code,id)
    ]);
    return json({saved:true});
  }
  if (path==='/api/notebook') {
    const studentId=role==='teacher'?url.searchParams.get('student'):user.id;
    if (role==='teacher' && !studentId) return json({error:'invalid'},400);
    if (request.method==='GET') {
      const row=await db.prepare(`SELECT cells,feedback,updated_at FROM ${tables.notes} WHERE assignment_code=? AND student_id=?`).bind(code,studentId).first();
      return json({cells:row?JSON.parse(row.cells):{},feedback:row?.feedback||'',updated_at:row?.updated_at||null});
    }
    if (post&&role==='student') {
      const data=await request.json().catch(()=>null), cells=data?.cells;
      if (!cells||typeof cells!=='object'||Array.isArray(cells)||Object.keys(cells).length>100||
        Object.entries(cells).some(([key,value])=>!quizCatalog[assignment.video_id].readingKeys.includes(key)||typeof value!=='string'||value.length>160)) return json({error:'invalid'},400);
      await enrollStudent(db,tables,user,assignment.room_code);
      await db.prepare(`INSERT INTO ${tables.notes}(assignment_code,student_id,cells) VALUES(?,?,?)
        ON CONFLICT(assignment_code,student_id) DO UPDATE SET cells=excluded.cells,updated_at=CURRENT_TIMESTAMP`).bind(code,user.id,JSON.stringify(cells)).run();
      return json({saved:true});
    }
    if (post&&role==='teacher') {
      const data=await request.json().catch(()=>null);
      if (typeof data?.feedback!=='string'||data.feedback.length>2000) return json({error:'invalid'},400);
      await db.prepare(`UPDATE ${tables.notes} SET feedback=? WHERE assignment_code=? AND student_id=?`).bind(data.feedback,code,studentId).run();
      return json({saved:true});
    }
  }
  return null;
}
