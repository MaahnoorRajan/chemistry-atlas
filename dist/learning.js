const learningCopy = {
 en:{student:'My assignments',join:'Join a class',code:'Class or assignment code',enroll:'Join class',empty:'Join a class to see your assignments.',pending:'Not submitted',completed:'Completed',archived:'Archived',open:'Open lesson',closed:'Quiz closed',due:'Due',sheet:'Download lesson sheet (.html)',print:'Print / Save PDF',save:'Save notebook',saved:'Saved to your account.',feedback:'Teacher feedback',classes:'Manage classrooms',newClass:'Create class',roster:'Class roster and notebooks',refresh:'Refresh',edit:'Assignment settings',dueDate:'Due date',allowLate:'Accept late submissions',archive:'Archive assignment',saveSettings:'Save settings',retake:'Allow retake',review:'Review notebook',sendFeedback:'Save feedback',noStudents:'No students have joined this class yet.',missing:'Not submitted',noNotebook:'No saved notebook.',select:'Choose an assignment above.',retry:'Try another class code',late:'The submission deadline has passed.',error:'Could not complete the request. Try again.',admin:'Teacher approvals',approve:'Approve teacher',reject:'Decline request',adminSetup:'Approval requires the server administrator key.',requestTeacher:'Request teacher access',requested:'Your teacher request has been submitted.',emailSetup:'Email registration is being configured. You can explore Student Demo or Teacher Demo now.',confirm:'Save these assignment settings?',history:'Previous scores',name:'Class name',owner:'Teacher'},
 ru:{student:'Мои задания',join:'Присоединиться к классу',code:'Код класса или задания',enroll:'Присоединиться',empty:'Присоединитесь к классу, чтобы увидеть задания.',pending:'Не сдано',completed:'Выполнено',archived:'В архиве',open:'Открыть урок',closed:'Тест закрыт',due:'Срок',sheet:'Скачать лист урока (.html)',print:'Печать / Сохранить PDF',save:'Сохранить тетрадь',saved:'Сохранено в аккаунте.',feedback:'Комментарий учителя',classes:'Управление классами',newClass:'Создать класс',roster:'Список учеников и тетради',refresh:'Обновить',edit:'Настройки задания',dueDate:'Срок сдачи',allowLate:'Принимать после срока',archive:'Архивировать задание',saveSettings:'Сохранить настройки',retake:'Разрешить пересдачу',review:'Открыть тетрадь',sendFeedback:'Сохранить комментарий',noStudents:'К классу пока никто не присоединился.',missing:'Не сдано',noNotebook:'Тетрадь не сохранена.',select:'Выберите задание выше.',retry:'Ввести другой код',late:'Срок сдачи истёк.',error:'Не удалось выполнить запрос. Попробуйте снова.',admin:'Подтверждение учителей',approve:'Одобрить учителя',reject:'Отклонить',adminSetup:'Нужен ключ администратора на сервере.',requestTeacher:'Запросить доступ учителя',requested:'Запрос отправлен.',emailSetup:'Регистрация по почте настраивается. Пока доступны демо ученика и учителя.',confirm:'Сохранить настройки?',history:'Предыдущие результаты',name:'Название класса',owner:'Учитель'},
 ky:{student:'Менин тапшырмаларым',join:'Класска кошулуу',code:'Класстын же тапшырманын коду',enroll:'Кошулуу',empty:'Тапшырмаларды көрүү үчүн класска кошулуңуз.',pending:'Тапшырыла элек',completed:'Аткарылды',archived:'Архивде',open:'Сабакты ачуу',closed:'Тест жабык',due:'Мөөнөтү',sheet:'Сабак барагын жүктөө (.html)',print:'Басып чыгаруу / PDF сактоо',save:'Дептерди сактоо',saved:'Аккаунтуңузга сакталды.',feedback:'Мугалимдин пикири',classes:'Класстарды башкаруу',newClass:'Класс түзүү',roster:'Окуучулар жана дептерлер',refresh:'Жаңыртуу',edit:'Тапшырманын жөндөөлөрү',dueDate:'Тапшыруу мөөнөтү',allowLate:'Кеч тапшырганды кабыл алуу',archive:'Архивге жылдыруу',saveSettings:'Жөндөөлөрдү сактоо',retake:'Кайра тапшырууга уруксат',review:'Дептерди көрүү',sendFeedback:'Пикирди сактоо',noStudents:'Класска азырынча эч ким кошула элек.',missing:'Тапшырыла элек',noNotebook:'Дептер сакталган эмес.',select:'Жогорудан тапшырманы тандаңыз.',retry:'Башка код киргизүү',late:'Тапшыруу мөөнөтү бүттү.',error:'Сурам аткарылган жок. Кайра аракет кылыңыз.',admin:'Мугалимдерди ырастоо',approve:'Мугалимди ырастоо',reject:'Четке кагуу',adminSetup:'Серверде администратор ачкычы керек.',requestTeacher:'Мугалим укугун сурануу',requested:'Сурамыңыз жөнөтүлдү.',emailSetup:'Почта аркылуу катталуу жөндөлүүдө. Азыр демолорду сынап көрүңүз.',confirm:'Жөндөөлөр сакталсынбы?',history:'Мурунку упайлар',name:'Класстын аталышы',owner:'Мугалим'}
};

function escapeText(value) {
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function studentDashboard(lang) {
 const l=learningCopy[lang];
 return `<section class="student-work"><h1>${l.student}</h1>
 <form id="join-room" class="class-fields"><label>${l.code}<input name="code" pattern="[A-Fa-f0-9]{8}" maxlength="8" required></label><button class="button">${l.enroll}</button></form>
 <p id="learning-status" role="status"></p><div id="student-work-list"></div></section>`;
}

async function learningRequest(endpoint,code,data,student) {
 const query=new URLSearchParams();
 if(code) query.set('code',code);
 if(student) query.set('student',student);
 const response=await fetch('/api/'+endpoint+'?'+query,{method:data?'POST':'GET',
  headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});
 const result=await response.json();
 if(!response.ok) throw new Error(result.error||'unavailable');
 return result;
}

function learningError(error,lang) {
 return learningCopy[lang][error.message]||classCopy[lang][error.message]||learningCopy[lang].error;
}

function setupStudentWork(lang) {
 const l=learningCopy[lang], status=document.getElementById('learning-status');
 async function load() {
  try {
   const {assignments,history}=await learningRequest('student-overview');
   const root=document.getElementById('student-work-list');
   root.replaceChildren();
   if(!assignments.length) root.textContent=l.empty;
   for(const item of assignments) {
    const video=atlasVideos.find(v=>v.id===item.video_id);
    const card=document.createElement('article');card.className='card work-item';
    const heading=document.createElement('h2');heading.textContent=videoWords(video,lang)[0];
    const details=document.createElement('p');
    details.textContent=[item.class_name,item.result?l.completed+' · '+item.result.score+'/'+item.result.total:l.pending,
     item.archived?l.archived:item.quiz_open?'':l.closed,item.due_date?l.due+' '+calendarDate(lang,item.due_date):''].filter(Boolean).join(' · ');
    const link=document.createElement('a');link.className='button outline';link.textContent=l.open;
    link.href=videoPageUrl(video,lang,item.code);
    card.append(heading,details,link);
    const previous=history.filter(attempt=>attempt.assignment_code===item.code);
    if(previous.length){const p=document.createElement('p');p.textContent=l.history+' · '+previous.map(attempt=>attempt.score+'/'+attempt.total).join(' · ');card.append(p);}
    root.append(card);
   }
  }catch(error){status.textContent=learningError(error,lang);}
 }
 document.getElementById('join-room').addEventListener('submit',async event=>{
  event.preventDefault();status.textContent='';
  try{await learningRequest('enroll',null,{code:new FormData(event.target).get('code')});event.target.reset();await load();}
  catch(error){status.textContent=learningError(error,lang);}
 });
 load();
}

function teacherManagement(lang) {
 const l=learningCopy[lang];
 return `<section class="card" id="room-management"><h2>${l.classes}</h2>
 <form id="new-room" class="class-fields"><label>${l.name}<input name="name" maxlength="40" required></label><button class="button">${l.newClass}</button></form><div id="room-list"></div></section>
 <section class="card" id="assignment-management"><h2>${l.edit}</h2>
 <p id="manage-status" role="status">${l.select}</p>
 <form id="assignment-settings" class="class-fields" hidden>
 <label>${l.dueDate}<input type="date" name="dueDate"></label>
 <label><input type="checkbox" name="allowLate" checked> ${l.allowLate}</label>
 <label><input type="checkbox" name="archived"> ${l.archive}</label>
 <button class="button">${l.saveSettings}</button></form>
 <h2>${l.roster}</h2><button class="button outline" id="refresh-roster" type="button">${l.refresh}</button>
 <div id="roster-list"></div></section>`;
}

function setupTeacherManagement(lang) {
 const l=learningCopy[lang],status=document.getElementById('manage-status'), form=document.getElementById('assignment-settings');
 if(!form)return;
 let code='',revision=0;
 async function rooms() {
  const {rooms}=await learningRequest('rooms');
  const root=document.getElementById('room-list');root.replaceChildren();
  for(const room of rooms){const p=document.createElement('p');p.textContent=room.class_name+' · '+classCopy[lang].code+' '+room.code+' · '+room.students;p.className='room-code';root.append(p);}
 }
 async function load() {
  code=document.getElementById('class-select')?.value;
  if(!code)return;
  const request=++revision;
  try {
   const [assignment,{students}]=await Promise.all([learningRequest('assignment',code),learningRequest('roster',code)]);
   if(request!==revision)return;
   form.hidden=false;form.elements.dueDate.value=assignment.due_date||'';
   form.elements.allowLate.checked=!!assignment.allow_late;form.elements.archived.checked=!!assignment.archived;
   status.textContent='';
   const root=document.getElementById('roster-list');root.replaceChildren();
   if(!students.length)root.textContent=l.noStudents;
   for(const student of students){
    const article=document.createElement('article');article.className='roster-item';
    const title=document.createElement('h3');title.textContent=student.student_name;
    const score=document.createElement('p');score.textContent=student.result?student.result.score+'/'+student.result.total:l.missing;
    article.append(title,score);
    if(student.result){
     const retake=document.createElement('button');retake.type='button';retake.className='button outline';retake.textContent=l.retake;
     retake.addEventListener('click',async()=>{retake.disabled=true;try{await learningRequest('retake',code,{studentId:student.student_id});await load();}catch(error){status.textContent=learningError(error,lang);retake.disabled=false;}});
     article.append(retake);
    }
    const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=l.review;details.append(summary);
    const video=atlasVideos.find(v=>v.id===assignment.video_id);
    const sheet=labSheets[video.id][lang];const rows=sheet[3].split(' | '),headers=sheet[2].split(' | ');
    const values=Object.entries(student.cells);
    if(!values.length){const p=document.createElement('p');p.textContent=l.noNotebook;details.append(p);}
    for(const [key,value] of values){const [row,col]=key.split('-').map(Number);const p=document.createElement('p');p.textContent=[rows[row],headers[col+1],value].join(' · ');details.append(p);}
    const label=document.createElement('label');label.textContent=l.feedback;
    const input=document.createElement('textarea');input.value=student.feedback||'';input.maxLength=2000;label.append(input);
    const save=document.createElement('button');save.type='button';save.className='button outline';save.textContent=l.sendFeedback;
    save.addEventListener('click',async()=>{save.disabled=true;try{await learningRequest('notebook',code,{feedback:input.value},student.student_id);status.textContent=l.saved;}catch(error){status.textContent=learningError(error,lang);}finally{save.disabled=false;}});
    if(values.length)details.append(label,save);
    article.append(details);root.append(article);
   }
  }catch(error){status.textContent=learningError(error,lang);}
 }
 document.getElementById('new-room').addEventListener('submit',async event=>{
  event.preventDefault();try{await learningRequest('rooms',null,{name:new FormData(event.target).get('name')});event.target.reset();await rooms();}catch(error){status.textContent=learningError(error,lang);}
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();const data=new FormData(form);
  try{await learningRequest('assignment-edit',code,{dueDate:data.get('dueDate')||null,archived:form.elements.archived.checked,allowLate:form.elements.allowLate.checked});location.reload();}
  catch(error){status.textContent=learningError(error,lang);}
 });
 document.getElementById('refresh-roster').addEventListener('click',load);
 window.addEventListener('assignment-selected',load);
 rooms().catch(error=>{status.textContent=learningError(error,lang);});
 if(document.getElementById('class-select')?.value)load();
}

function setupNotebook(lang,video,code) {
 const save=document.getElementById('save-notebook'),status=document.getElementById('notebook-status'),feedback=document.getElementById('notebook-feedback');
 if(!save)return;
 const inputs=[...document.querySelectorAll('[data-reading]')];
 async function load() {
  try {
   await learningRequest('enroll',null,{code});
   const data=await learningRequest('notebook',code);
   for(const input of inputs)if(Object.hasOwn(data.cells,input.dataset.reading)){
    input.value=data.cells[input.dataset.reading];input.nextElementSibling.textContent=input.value;
   }
   feedback.textContent=data.feedback?learningCopy[lang].feedback+' · '+data.feedback:'';
  }catch(error){status.textContent=learningError(error,lang);}
 }
 save.addEventListener('click',async()=>{save.disabled=true;try{await learningRequest('notebook',code,{cells:Object.fromEntries(inputs.map(input=>[input.dataset.reading,input.value]))});status.textContent=learningCopy[lang].saved;}catch(error){status.textContent=learningError(error,lang);}finally{save.disabled=false;}});
 load();
}

function downloadLesson(video,lang) {
 const t=copy[lang],l=learningCopy[lang],sheet=labSheets[video.id][lang];
 const [summary,steps]=video.id===legacyQuizVideo?indicatorTestSteps[lang]:lessonDetails[video.id][lang];
 const columns=sheet[2].split(' | '),rows=sheet[3].split(' | ');
 const html=`<!doctype html><html lang="${lang}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeText(videoWords(video,lang)[0])}</title>
 <style>body{font:16px/1.6 system-ui,sans-serif;max-width:850px;margin:36px auto;padding:0 20px;color:#17364b}h1{line-height:1.2}table{border-collapse:collapse;width:100%}td,th{border:1px solid #8295a2;padding:10px;min-width:70px}td{height:32px}li{margin-bottom:10px}a{color:#006b7b}@media print{button{display:none}body{margin:0;font-size:12pt}h2{break-after:avoid}tr{break-inside:avoid}}</style>
 <button onclick="window.print()">${l.print}</button><h1>${escapeText(videoWords(video,lang)[0])}</h1><p>Chemistry Atlas</p><p>${escapeText(summary)}</p>
 <h2>${t.materials}</h2><p>${escapeText(sheet[0])}</p><h2>${t.safety}</h2><p>${escapeText(sheet[1])}</p>
 <h2>${guideLabels[lang].steps}</h2><ol>${steps.split(' | ').map(step=>'<li>'+escapeText(step)+'</li>').join('')}</ol>
 <table><thead><tr>${columns.map(text=>'<th>'+escapeText(text)+'</th>').join('')}</tr></thead><tbody>${rows.map(text=>'<tr><th>'+escapeText(text)+'</th>'+columns.slice(1).map(()=>'<td></td>').join('')+'</tr>').join('')}</tbody></table>
 <h2>${t.quizTitle}</h2><ol>${questionsFor(video.id,lang).map(([title,options])=>'<li>'+escapeText(title)+'<ul>'+options.map(option=>'<li>□ '+escapeText(option)+'</li>').join('')+'</ul></li>').join('')}</ol>
 <p><a href="https://youtu.be/${video.id}">YouTube</a> · <a href="https://www.experimentium.org/student-resources/">Experimentium</a></p><p>${footerCopy.rights}</p></html>`;
 const blob=new Blob([html],{type:'text/html;charset=utf-8'}),href=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=href;link.download='chemistry-atlas-'+video.id+'-'+lang+'.html';link.click();
 setTimeout(()=>URL.revokeObjectURL(href),1000);
}

function adminPage(lang) {
 const l=learningCopy[lang];
 return `<section class="card"><h1>${l.admin}</h1><p id="admin-status" role="status"></p><div id="admin-requests"></div></section>`;
}
async function setupAdmin(lang) {
 const l=learningCopy[lang],status=document.getElementById('admin-status');
 try{
  const {requests,canApprove}=await learningRequest('admin-requests');
  if(!canApprove)status.textContent=l.adminSetup;
  const root=document.getElementById('admin-requests');
  for(const request of requests){
   const row=document.createElement('article');row.className='roster-item';
   const p=document.createElement('p');p.textContent=[request.display_name,request.email,request.status].join(' · ');row.append(p);
   if(request.status==='pending')for(const decision of ['approved','rejected']){
    const button=document.createElement('button');button.type='button';button.className='button outline';button.textContent=decision==='approved'?l.approve:l.reject;button.disabled=!canApprove;
    button.addEventListener('click',async()=>{try{await learningRequest('admin-decision',null,{userId:request.user_id,decision});location.reload();}catch(error){status.textContent=learningError(error,lang);}});
    row.append(button);
   }
   root.append(row);
  }
 }catch(error){status.textContent=learningError(error,lang);}
}
