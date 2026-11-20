const classCopy = {
  ky: {
    dashboard:'Класстын жыйынтыктары', create:'Тестти дайындоо', className:'Класстын аталышы', assignment:'Дайындалган тест', pick:'Классты тандаңыз', refresh:'Жаңыртуу',
    code:'Класс коду', link:'Окуучулар үчүн шилтеме', copied:'Шилтеме көчүрүлдү.', copy:'Шилтемени көчүрүү', submitted:'Тапшырды', student:'Окуучу', score:'Упай',
    missed:'Эң көп ката кеткен суроо', perfect:'Бардык жооптор туура.', empty:'Азырынча жооп жок.', join:'Класс коду менен кошулуу',
    saved:'Жообуңуз сакталды.', duplicate:'Бул окуучунун жообу мурда сакталган.', notfound:'Мындай класс коду табылган жок.', unavailable:'Сактоо же жүктөө мүмкүн болгон жок. Кайра аракет кылыңыз.',
    invalid:'Маалыматты текшерип, кайра аракет кылыңыз.', noSets:'Жыйынтыктарды көрүү үчүн класска тест дайындаңыз.'
  },
  ru: {
    dashboard:'Результаты класса', create:'Назначить тест', className:'Название класса', assignment:'Назначенный тест', pick:'Выберите класс', refresh:'Обновить',
    code:'Код класса', link:'Ссылка для учеников', copied:'Ссылка скопирована.', copy:'Скопировать ссылку', submitted:'Сдали', student:'Ученик', score:'Баллы',
    missed:'Самый трудный вопрос', perfect:'Все ответы правильные.', empty:'Ответов пока нет.', join:'Присоединиться по коду класса',
    saved:'Ответ сохранён.', duplicate:'Ответ этого ученика уже сохранён.', notfound:'Класс с таким кодом не найден.', unavailable:'Не удалось сохранить или загрузить данные. Попробуйте снова.',
    invalid:'Проверьте введённые данные и попробуйте снова.', noSets:'Назначьте тест классу, чтобы увидеть результаты.'
  },
  en: {
    dashboard:'Class results', create:'Assign quiz', className:'Class name', assignment:'Assigned quiz', pick:'Choose a class', refresh:'Refresh results',
    code:'Class code', link:'Student link', copied:'Link copied.', copy:'Copy student link', submitted:'Submitted', student:'Student', score:'Score',
    missed:'Most-missed question', perfect:'All answers are correct.', empty:'No submissions yet.', join:'Join with a class code',
    saved:'Your submission was saved.', duplicate:'You have already submitted this quiz.', notfound:'That class code was not found.', unavailable:'Could not save or load the data. Try again.',
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

function classroomMarkup(c, a, dashboard) {
  return `<section id="classroom" class="card classroom"><h2>${dashboard?.newAssignment || c.dashboard}</h2>
    <form id="create-class" class="class-fields"><label>${c.className}<input name="name" maxlength="40" placeholder="8A" required></label>
    ${dashboard ? `<label>${dashboard.lesson}<select name="video" required>${atlasVideos.map(video => `<option value="${video.id}">${videoWords(video,locale)[0]}</option>`).join('')}</select></label>
    <label>${dashboard.dueOptional}<input name="dueDate" type="date" min="2000-01-01"></label>` : ''}
    <button class="button" type="submit">${c.create}</button></form>
    <p id="class-status" role="status"></p>
    ${dashboard ? `<h2 id="teacher-progress">${dashboard.progress}</h2>` : ''}
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


function setupClassroom(c, locale, lesson, onChange) {
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
      const { attempts, missed, answered, quiz_open, video_id } = await classRequest('results',code);
      if (current !== revision) return;
      const questions = questionsFor(video_id,locale);
      quizOpen = !!quiz_open;
      el('release-status').textContent = quizOpen ? a.open : a.shut;
      release.textContent = quizOpen ? a.closeQuiz : a.openQuiz;
      release.disabled = false;
      el('class-count').textContent = c.submitted + ' · ' + attempts.length;
      const peak = Math.max(...missed);
      const hardest = missed.flatMap((count,index) => count === peak ? [questions[index][0] + ' (' + count + '/' + answered[index] + ')'] : []);
      el('class-missed').textContent = !attempts.length ? c.empty : peak ? c.missed + ' · ' + hardest.join(' / ') : c.perfect;
      const rows = attempts.map(attempt => {
        const row = document.createElement('tr');
        row.insertCell().textContent = attempt.student_name;
        row.insertCell().textContent = attempt.score + ' / ' + attempt.total;
        return row;
      });
      scores.tBodies[0].replaceChildren(...rows);
      scores.hidden = !attempts.length;
      window.dispatchEvent(new CustomEvent('assignment-selected'));
    } catch {
      if (revision === current) status.textContent = c.unavailable;
    }
  }

  async function load() {
    try {
      const { assignments } = await classRequest('assignments');
      select.replaceChildren(...assignments.map(assignment => new Option(label(assignment), assignment.code)));
      const requested = new URLSearchParams(location.search).get('assignment');
      const preferred = assignments.find(assignment => assignment.code === requested) ||
        assignments.find(assignment => assignment.video_id === lesson?.id);
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
      onChange?.();
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
      const data = new FormData(form);
      const created = await classRequest('assignments',null,{
        name:data.get('name'), videoId:lesson?.id || data.get('video'),
        dueDate:data.get('dueDate') || null
      });
      if (!select.querySelector('option[value="' + created.code + '"]')) {
        select.prepend(new Option(label(created),created.code));
      }
      select.value = created.code;
      controls.hidden = false;
      form.reset();
      await refresh();
      onChange?.();
    } catch (error) { status.textContent = c[error.message] || c.unavailable; }
    finally { send.disabled = false; }
  });
  send.disabled = true;
  const ready = load().finally(() => { send.disabled = false; });
  return async code => {
    await ready;
    if (![...select.options].some(option => option.value === code)) return;
    select.value = code;
    await refresh();
    select.focus();
  };
}
