const accessCopy = {
  ky: {
    title:'Лабораторияга кирүү', intro:'Сизге ылайыктуу кирүү жолун тандаңыз.',
    teacher:['Мугалим','Сабакты, тажрыйбаны жана тестти бөлүшүү куралдарын ачыңыз.','Мугалим катары кирүү'],
    student:['Окуучу','Тестти тапшырып, жыйынтыгын дароо көрүңүз.','Окуучу катары кирүү'],
    code:'Демо кирүү коду', demo:'Сыноо үчүн код', error:'Код туура эмес. Көрсөтүлгөн демо кодду киргизиңиз.', logout:'Чыгуу'
  },
  ru: {
    title:'Вход в лабораторию', intro:'Выберите подходящий способ входа.',
    teacher:['Учитель','Откройте урок, опыт и инструменты для выдачи теста.','Войти как учитель'],
    student:['Ученик','Пройдите тест и сразу узнайте результат.','Войти как ученик'],
    code:'Код для входа в демо', demo:'Код для знакомства с демо', error:'Неверный код. Введите указанный демо-код.', logout:'Выйти'
  },
  en: {
    title:'Sign in to the lab', intro:'Choose how you want to sign in.',
    teacher:['Teacher','Open the lesson, experiment, and quiz assignment tools.','Sign in as teacher'],
    student:['Student','Take the quiz and see your results right away.','Sign in as student'],
    code:'Demo access code', demo:'Code to try the demo', error:'That code did not match. Enter the demo code shown below.', logout:'Sign out'
  }
};

function renderAccess(t, locale, isQuiz) {
  const labels = accessCopy[locale];
  const options = new URLSearchParams(location.search);
  const assignment = options.get('class')?.toUpperCase();
  const classQuery = /^[A-F0-9]{8}$/.test(assignment || '') ? '&amp;class=' + assignment : '';
  const preferred = isQuiz ? 'student' : 'teacher';
  const heading = isQuiz ? 'h1' : 'h2';
  const roles = [preferred, preferred === 'teacher' ? 'student' : 'teacher'];
  return `<section class="access">
    <div class="access-head">${icon}<${heading}>${labels.title}</${heading}><p>${labels.intro}</p></div>
    <div class="access-grid">${roles.map(role => {
      const [name, description, action] = labels[role];
      const error = options.has('error') && options.get('as') === role;
      return `<article class="access-card"><div class="access-symbol ${role}" aria-hidden="true">${role === 'teacher' ? '⚗' : '◉'}</div>
        <h2>${name}</h2><p>${description}</p>
        <form method="post" action="./role-login?lang=${locale}${isQuiz ? '&amp;quiz=1' : ''}${classQuery}">
          <input type="hidden" name="role" value="${role}">
          <label for="code-${role}">${labels.code}</label>
          <input id="code-${role}" name="code" type="text" maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="hint-${role}" ${error ? 'aria-invalid="true"' : ''} required>
          ${error ? `<p class="access-error" role="alert">${labels.error}</p>` : ''}
          <p class="small" id="hint-${role}">${labels.demo} · <code>${role === 'teacher' ? 'LAB-TEACH' : 'LAB-LEARN'}</code></p>
          <button class="button ${role === 'student' ? 'outline' : ''}" type="submit">${action} <span aria-hidden="true">→</span></button>
        </form></article>`;
    }).join('')}</div>
  </section>`;
}
