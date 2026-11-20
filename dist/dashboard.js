const dashboardCopy = {
  en: {
    title:'Teacher dashboard', intro:'Assign lessons and review your students’ quiz results.',
    welcome:'Welcome back, {name}', classrooms:'My classrooms', assignments:'Assignments',
    progress:'Student progress', lesson:'Lesson', newAssignment:'Create assignment',
    dueOptional:'Due date (optional)', open:'Open quizzes', students:'Enrolled students',
    classes:'Classes with assignments', activity:'Recent activity', deadlines:'Upcoming deadlines',
    quick:'Quick actions', noClasses:'Create your first assignment to see your classes here.',
    noActivity:'Student submissions will appear here.', noDeadlines:'No upcoming due dates.',
    submitted:'{count} submitted', today:'Due {date}', closed:'Closed', released:'Open',
    denied:'Sign in with an approved teacher account to open the dashboard.', student:'Student'
  },
  ru: {
    title:'Кабинет учителя', intro:'Назначайте уроки и просматривайте результаты тестов учеников.',
    welcome:'С возвращением, {name}', classrooms:'Мои классы', assignments:'Задания',
    progress:'Успеваемость учеников', lesson:'Урок', newAssignment:'Создать задание',
    dueOptional:'Срок сдачи (необязательно)', open:'Открытые тесты', students:'Ученики класса',
    classes:'Классы с заданиями', activity:'Последние действия', deadlines:'Ближайшие сроки',
    quick:'Быстрые действия', noClasses:'Создайте первое задание, и здесь появятся ваши классы.',
    noActivity:'Здесь появятся сданные тесты.', noDeadlines:'Ближайших сроков сдачи нет.',
    submitted:'Сдали: {count}', today:'До {date}', closed:'Закрыт', released:'Открыт',
    denied:'Войдите через подтверждённый аккаунт учителя, чтобы открыть кабинет.', student:'Ученик'
  },
  ky: {
    title:'Мугалимдин кабинети', intro:'Сабактарды дайындап, окуучулардын тест жыйынтыктарын көрүңүз.',
    welcome:'Кош келиңиз, {name}', classrooms:'Менин класстарым', assignments:'Тапшырмалар',
    progress:'Окуучулардын жетишкендиктери', lesson:'Сабак', newAssignment:'Тапшырма түзүү',
    dueOptional:'Тапшыруу мөөнөтү (милдеттүү эмес)', open:'Ачык тесттер', students:'Класстагы окуучулар',
    classes:'Тапшырмасы бар класстар', activity:'Акыркы аракеттер', deadlines:'Жакынкы мөөнөттөр',
    quick:'Ыкчам аракеттер', noClasses:'Класстар бул жерде көрүнүшү үчүн биринчи тапшырманы түзүңүз.',
    noActivity:'Тапшырылган тесттер бул жерде көрүнөт.', noDeadlines:'Жакынкы тапшыруу мөөнөттөрү жок.',
    submitted:'Тапшырды: {count}', today:'Мөөнөтү: {date}', closed:'Жабык', released:'Ачык',
    denied:'Кабинетти ачуу үчүн ырасталган мугалим аккаунту менен кириңиз.', student:'Окуучу'
  }
};

function dashboardUrl(lang) {
  return '?' + new URLSearchParams({ lang, dashboard: '1' });
}

function calendarDate(lang, date) {
  return new Intl.DateTimeFormat(lang, { dateStyle:'medium', timeZone:'UTC' }).format(new Date(date + 'T00:00:00Z'));
}

function renderDashboard(lang, c, a) {
  const d = dashboardCopy[lang];
  if (role !== 'teacher') {
    return `<section class="card dashboard-denied"><h1>${d.title}</h1><p>${d.denied}</p><a href="${atlasUrl(lang)}">${a.library}</a></section>`;
  }
  return `<div class="teacher-dashboard">
    <aside class="teacher-sidebar">
      <nav aria-label="${d.title}">
        <a class="teacher-home" href="${dashboardUrl(lang)}" aria-current="page">${d.title}</a>
        <a href="#teacher-classes">${d.classrooms}</a>
        <a href="#classroom">${d.assignments}</a>
        <a href="#teacher-progress">${d.progress}</a>
        <a href="${atlasUrl(lang)}">${a.library}</a>
        <a href="${accountHref('/', lang, 'profile', 'teacher')}">${accessCopy[lang].profile}</a>
      </nav>
      <form method="post" action="/account/logout?lang=${lang}"><button type="submit">${accessCopy[lang].logout}</button></form>
    </aside>
    <div class="teacher-content">
      <header class="teacher-greeting"><h1 id="teacher-greeting">${d.title}</h1><p>${d.intro}</p></header>
      <div class="teacher-overview-status" id="teacher-overview-status" hidden>
        <p role="status">${c.unavailable}</p><button class="button outline" id="teacher-retry" type="button">${c.refresh}</button>
      </div>
      <dl class="teacher-stats" aria-label="${d.title}">
        ${[['classes',d.classes],['students',d.students],['open',d.open]].map(([id,label]) =>
          `<div><dt>${label}</dt><dd id="teacher-stat-${id}">—</dd></div>`).join('')}
      </dl>
      <div class="teacher-grid">
        <div class="teacher-primary">
          <section id="teacher-classes"><h2>${d.classrooms}</h2><div id="teacher-class-list" class="teacher-panel"></div></section>
          ${classroomMarkup(c, a, d)}
          ${teacherManagement(lang)}
        </div>
        <div class="teacher-secondary">
          <section><h2>${d.quick}</h2><div class="teacher-actions"><a class="button" href="#create-class">${d.newAssignment}</a><a class="button outline" href="${atlasUrl(lang)}">${a.library}</a></div></section>
          <section><h2>${d.activity}</h2><div id="teacher-recent" class="teacher-panel"></div></section>
          <section><h2>${d.deadlines}</h2><div id="teacher-deadlines" class="teacher-panel"></div></section>
        </div>
      </div>
    </div>
  </div>`;
}

function setupTeacherDashboard(lang, c) {
  const d = dashboardCopy[lang];
  const el = id => document.getElementById(id);
  const localeNumber = new Intl.NumberFormat(lang);
  const activityDate = new Intl.DateTimeFormat(lang, { month:'short', day:'numeric', hour:'numeric', minute:'2-digit', timeZone:'Asia/Bishkek' });
  const videoNames = new Map(atlasVideos.map(video => [video.id, videoWords(video,lang)[0]]));
  const localDate = new Intl.DateTimeFormat('en', {year:'numeric', month:'2-digit', day:'2-digit', timeZone:'Asia/Bishkek'});
  const parts = Object.fromEntries(localDate.formatToParts(new Date()).map(part => [part.type,part.value]));
  const today = [parts.year,parts.month,parts.day].join('-');
  let revision = 0;
  const select = setupClassroom(c, lang, null, loadOverview);

  function assignmentButton(name, code) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'teacher-assignment-link';
    button.textContent = name;
    button.addEventListener('click', () => select(code));
    return button;
  }

  function list(container, entries, empty) {
    if (!entries.length) {
      const p = document.createElement('p');
      p.className = 'teacher-empty';
      p.textContent = empty;
      container.replaceChildren(p);
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'teacher-list';
    for (const [title, detail] of entries) {
      const li = document.createElement('li');
      const description = document.createElement('span');
      description.textContent = detail;
      li.append(title, description);
      ul.append(li);
    }
    container.replaceChildren(ul);
  }

  async function loadOverview() {
    const request = ++revision;
    try {
      const {name, assignments, students, recent} = await classRequest('teacher-overview');
      if (request !== revision) return;
      const groups = new Map();
      for (const assignment of assignments) {
        const name = assignment.class_name;
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(assignment);
      }
      if (name) el('teacher-greeting').textContent = d.welcome.replace('{name}', () => name);
      el('teacher-stat-classes').textContent = localeNumber.format(groups.size);
      el('teacher-stat-students').textContent = localeNumber.format(students);
      el('teacher-stat-open').textContent = localeNumber.format(assignments.filter(item => item.quiz_open).length);
      const classes = el('teacher-class-list');
      if (!groups.size) list(classes, [], d.noClasses);
      else classes.replaceChildren(...Array.from(groups, ([name, assigned]) => {
        const group = document.createElement('section');
        group.className = 'teacher-class-group';
        const heading = document.createElement('h3');
        heading.textContent = name;
        const rows = document.createElement('div');
        list(rows, assigned.map(item => [
          assignmentButton(videoNames.get(item.video_id), item.code),
          [item.quiz_open ? d.released : d.closed, d.submitted.replace('{count}', localeNumber.format(item.submissions))].join(' · ')
        ]), '');
        group.append(heading, rows);
        return group;
      }));
      list(el('teacher-recent'), recent.map(item => [
        assignmentButton(item.student_name || d.student, item.code),
        [videoNames.get(item.video_id), activityDate.format(new Date(item.created_at.replace(' ', 'T') + 'Z'))].join(' · ')
      ]), d.noActivity);
      const upcoming = assignments.filter(item => item.quiz_open && item.due_date >= today)
        .sort((left,right) => left.due_date.localeCompare(right.due_date)).slice(0,6);
      list(el('teacher-deadlines'), upcoming.map(item => [
        assignmentButton(videoNames.get(item.video_id), item.code),
        [item.class_name, d.today.replace('{date}', calendarDate(lang,item.due_date))].join(' · ')
      ]), d.noDeadlines);
      el('teacher-overview-status').hidden = true;
    } catch {
      if (request === revision) el('teacher-overview-status').hidden = false;
    }
  }
  el('teacher-retry').addEventListener('click', loadOverview);
  loadOverview();
}
