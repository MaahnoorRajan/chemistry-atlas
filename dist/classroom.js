const classCopy = {
  ky: {
    dashboard:'Класстын жыйынтыктары', create:'Тестти дайындоо', className:'Класстын аталышы', assignment:'Дайындалган тест', pick:'Классты тандаңыз', refresh:'Жаңыртуу',
    code:'Класс коду', link:'Окуучулар үчүн шилтеме', copied:'Шилтеме көчүрүлдү.', copy:'Шилтемени көчүрүү', submitted:'Тапшырды', student:'Окуучунун коду', score:'Упай',
    missed:'Эң көп ката кеткен суроо', perfect:'Бардык жооптор туура.', empty:'Азырынча жооп жок.', join:'Класс коду менен кошулуу', idHint:'Мугалим берген кодду жазыңыз, мисалы A01.',
    saved:'Жообуңуз сакталды.', duplicate:'Бул окуучунун жообу мурда сакталган.', notfound:'Мындай класс коду табылган жок.', unavailable:'Сактоо же жүктөө мүмкүн болгон жок. Кайра аракет кылыңыз.',
    invalid:'Маалыматты текшерип, кайра аракет кылыңыз.', noSets:'Жыйынтыктарды көрүү үчүн класска тест дайындаңыз.'
  },
  ru: {
    dashboard:'Результаты класса', create:'Назначить тест', className:'Название класса', assignment:'Назначенный тест', pick:'Выберите класс', refresh:'Обновить',
    code:'Код класса', link:'Ссылка для учеников', copied:'Ссылка скопирована.', copy:'Скопировать ссылку', submitted:'Сдали', student:'Код ученика', score:'Баллы',
    missed:'Самый трудный вопрос', perfect:'Все ответы правильные.', empty:'Ответов пока нет.', join:'Присоединиться по коду класса', idHint:'Введите выданный учителем код, например A01.',
    saved:'Ответ сохранён.', duplicate:'Ответ этого ученика уже сохранён.', notfound:'Класс с таким кодом не найден.', unavailable:'Не удалось сохранить или загрузить данные. Попробуйте снова.',
    invalid:'Проверьте введённые данные и попробуйте снова.', noSets:'Назначьте тест классу, чтобы увидеть результаты.'
  },
  en: {
    dashboard:'Class results', create:'Assign quiz', className:'Class name', assignment:'Assigned quiz', pick:'Choose a class', refresh:'Refresh results',
    code:'Class code', link:'Student link', copied:'Link copied.', copy:'Copy student link', submitted:'Submitted', student:'Student ID', score:'Score',
    missed:'Most-missed question', perfect:'All answers are correct.', empty:'No submissions yet.', join:'Join with a class code', idHint:'Enter the ID your teacher gave you, such as A01.',
    saved:'Your submission was saved.', duplicate:'This student ID has already submitted.', notfound:'That class code was not found.', unavailable:'Could not save or load the data. Try again.',
    invalid:'Check the information and try again.', noSets:'Assign a quiz to see class results here.'
  }
};

async function classRequest(endpoint, code, data) {
  const query = code ? '?' + new URLSearchParams({code}) : '';
  const response = await fetch('/api/' + endpoint + query, data ? {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
  } : {});
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'unavailable');
  return payload;
}

function classroomMarkup(c, a) {
  return `<section id="classroom" class="card classroom"><h2>${c.dashboard}</h2>
    <form id="create-class" class="class-fields"><label>${c.className}<input name="name" maxlength="40" placeholder="8A" required></label>
    <button class="button" type="submit">${c.create}</button></form>
    <p id="class-status" role="status"></p>
    <div id="class-controls" hidden><div class="class-fields"><label>${c.assignment}<select id="class-select"></select></label>
      <button class="button outline" type="button" id="class-refresh">${c.refresh}</button></div>
      <div class="release-row"><p class="class-code">${c.code} <strong id="class-code"></strong></p>
      <span id="release-status" role="status"></span><button class="button outline" id="release-toggle" type="button" disabled>${a.closeQuiz}</button></div>
      <div class="class-fields"><label>${c.link}<input id="class-link" readonly></label><button class="button outline" type="button" id="class-copy">${c.copy}</button></div>
      <p id="class-count" class="class-count"></p><p id="class-missed"></p>
      <table id="class-scores" hidden><thead><tr><th scope="col">${c.student}</th><th scope="col">${c.score}</th></tr></thead><tbody></tbody></table>
    </div></section>`;
}

function classStudentMarkup(c, assigned, locale) {
  if (assigned) return `<p id="student-class" role="status"></p>`;
  return `<form class="class-fields class-join" method="get"><input type="hidden" name="lang" value="${locale}"><input type="hidden" name="quiz" value="1">
    <label>${c.code}<input name="class" required maxlength="8" pattern="[A-Fa-f0-9]{8}" autocapitalize="characters"></label>
    <button class="button outline" type="submit">${c.join}</button></form>`;
}

function idMarkup(c) {
  return `<label class="student-id" for="student-id">${c.student}</label>
    <input id="student-id" name="studentId" required pattern="[A-Za-z0-9\\-]{2,20}" maxlength="20" autocapitalize="characters" aria-describedby="id-hint">
    <p id="id-hint" class="small">${c.idHint}</p><p id="save-status" role="status"></p>`;
}

function setupClassroom(c, locale, lesson) {
  const a = atlasCopy[locale];
  const el = id => document.getElementById(id);
  const select = el('class-select');
  const controls = el('class-controls');
  const status = el('class-status');
  const scores = el('class-scores');
  const form = el('create-class');
  const send = form.querySelector('button');
  const release = el('release-toggle');
  let quizOpen;
  let revision = 0;
  const label = assignment => {
    const video = atlasVideos.find(item => item.id === assignment.video_id);
    return [assignment.class_name, video && videoWords(video,locale)[0], assignment.code].filter(Boolean).join(' · ');
  };

  async function refresh() {
    const code = select.value;
    const current = ++revision;
    el('class-code').textContent = code;
    el('class-link').value = new URL('?' + new URLSearchParams({lang:locale,quiz:'1',class:code}), location.href).href;
    el('class-count').textContent = '';
    el('class-missed').textContent = '';
    scores.hidden = true;
    release.disabled = true;
    el('release-status').textContent = '';
    status.textContent = '';
    try {
      const { attempts, missed, quiz_open, video_id } = await classRequest('results',code);
      if (current !== revision) return;
      const questions = questionsFor(video_id,locale);
      quizOpen = !!quiz_open;
      el('release-status').textContent = quizOpen ? a.open : a.shut;
      release.textContent = quizOpen ? a.closeQuiz : a.openQuiz;
      release.disabled = false;
      el('class-count').textContent = c.submitted + ' · ' + attempts.length;
      const peak = Math.max(...missed);
      const hardest = missed.flatMap((count,index) => count === peak ? [questions[index][0]] : []);
      el('class-missed').textContent = !attempts.length ? c.empty : peak ? c.missed + ' · ' + hardest.join(' / ') + ' (' + peak + '/' + attempts.length + ')' : c.perfect;
      const rows = attempts.map(attempt => {
        const row = document.createElement('tr');
        row.insertCell().textContent = attempt.student_id;
        row.insertCell().textContent = attempt.score + ' / ' + questions.length;
        return row;
      });
      scores.tBodies[0].replaceChildren(...rows);
      scores.hidden = !attempts.length;
    } catch {
      if (revision === current) status.textContent = c.unavailable;
    }
  }

  async function load() {
    try {
      const { assignments } = await classRequest('assignments');
      select.replaceChildren(...assignments.map(assignment => new Option(label(assignment), assignment.code)));
      const preferred = assignments.find(assignment => assignment.video_id === lesson.id);
      if (preferred) select.value = preferred.code;
      controls.hidden = !assignments.length;
      if (assignments.length) await refresh();
      else status.textContent = c.noSets;
    } catch { status.textContent = c.unavailable; }
  }

  select.addEventListener('change', refresh);
  el('class-refresh').addEventListener('click', refresh);
  release.addEventListener('click', async () => {
    const code = select.value;
    release.disabled = true;
    try {
      await classRequest('quiz-state',code,{open:!quizOpen});
      if (select.value === code) await refresh();
    } catch (error) {
      if (select.value === code) {
        status.textContent = c[error.message] || c.unavailable;
        release.disabled = false;
      }
    }
  });
  el('class-copy').addEventListener('click', async () => {
    const link = el('class-link');
    try { await navigator.clipboard.writeText(link.value); status.textContent = c.copied; }
    catch { link.focus(); link.select(); }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    send.disabled = true;
    try {
      const created = await classRequest('assignments',null,{ name:new FormData(form).get('name'), videoId:lesson.id });
      if (!select.querySelector('option[value="' + created.code + '"]')) {
        select.prepend(new Option(label(created),created.code));
      }
      select.value = created.code;
      controls.hidden = false;
      form.reset();
      await refresh();
    } catch (error) { status.textContent = c[error.message] || c.unavailable; }
    finally { send.disabled = false; }
  });
  send.disabled = true;
  load().finally(() => { send.disabled = false; });
}
