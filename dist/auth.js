const accessCopy = {
  ky: {
    title:'Лабораторияга кирүү', intro:'Мугалим же окуучу катары улантыңыз.',
    teacher:'Мугалим', student:'Окуучу', teacherHelp:'Тесттерди дайындап, класстын жыйынтыгын көрүңүз.',
    studentHelp:'Мугалим дайындаган тесттерди тапшырып, упайыңызды көрүңүз.',
    login:'Кирүү', register:'Катталуу', forgot:'Сырсөздү унуттуңузбу?', reset:'Жаңы сырсөз коюу',
    profile:'Аккаунт', logout:'Чыгуу', email:'Электрондук почта', name:'Көрсөтүлүүчү ысым',
    password:'Сырсөз', confirm:'Сырсөздү кайталаңыз', save:'Сактоо', send:'Шилтеме жөнөтүү',
    passwordHint:'Кеминде 10 белги колдонуңуз.', back:'Кирүү бетине кайтуу',
    teacherNote:'Мугалимдин аккаунтун сайттын администратору ырастайт.',
    emailNote:'Каттагы шилтемени ушул эле браузерден ачыңыз.',
    messages:{
      invalidEmail:'Жарактуу электрондук почта дарегин киргизип, ката кеткен жокпу текшериңиз.',
      sent:'Эгер дарек жарактуу болсо, шилтеме почтаңызга келет. Спам папкасын да текшериңиз.',
      delivery:'Бул дарекке кат жөнөтүлгөн жок. Сайттын администраторуна кайрылыңыз.', confirmed:'Электрондук почтаңыз ырасталды. Эми кирсеңиз болот.', credentials:'Почта же сырсөз туура эмес.',
      teacherPending:'Мугалим катары кирүү үчүн администратордун ырастоосу керек.',
      teacherLogin:'Бул аккаунт менен мугалим бөлүмү аркылуу кириңиз.',
      unconfirmed:'Алгач электрондук почтаңызды ырастап алыңыз.',
      expired:'Шилтеме жараксыз же мөөнөтү бүттү. Жаңы шилтеме сурап, аны ушул браузерден ачыңыз.',
      invalid:'Маалыматты текшериңиз. Сырсөздөр бирдей болушу керек.',
      weak:'Башка, күчтүүрөөк сырсөз тандаңыз.', resetDone:'Сырсөз жаңырды. Жаңы сырсөз менен кириңиз.',
      saved:'Маалымат сакталды.', unavailable:'Кызмат убактылуу жеткиликсиз. Кийинчерээк кайра аракет кылыңыз.',
      rate:'Аракеттер өтө көп. Бир аз күтө туруп кайра аракет кылыңыз.'
    }
  },
  ru: {
    title:'Вход в лабораторию', intro:'Продолжите как учитель или ученик.',
    teacher:'Учитель', student:'Ученик', teacherHelp:'Назначайте тесты и смотрите результаты своего класса.',
    studentHelp:'Проходите назначенные тесты и смотрите свои результаты.',
    login:'Войти', register:'Создать аккаунт', forgot:'Забыли пароль?', reset:'Установить новый пароль',
    profile:'Аккаунт', logout:'Выйти', email:'Электронная почта', name:'Отображаемое имя',
    password:'Пароль', confirm:'Повторите пароль', save:'Сохранить', send:'Отправить ссылку',
    passwordHint:'Используйте не менее 10 символов.', back:'Вернуться ко входу',
    teacherNote:'Аккаунт учителя должен одобрить администратор сайта.',
    emailNote:'Откройте ссылку из письма в этом же браузере.',
    messages:{
      invalidEmail:'Введите действительный адрес электронной почты и проверьте, нет ли опечаток.',
      sent:'Если адрес действителен, вам придёт письмо со ссылкой. Проверьте также папку «Спам».',
      delivery:'Не удалось отправить письмо на этот адрес. Обратитесь к администратору сайта.', confirmed:'Почта подтверждена. Теперь можно войти.', credentials:'Неверная почта или пароль.',
      teacherPending:'Для входа учителя требуется одобрение администратора.',
      teacherLogin:'Войдите в этот аккаунт через раздел для учителей.',
      unconfirmed:'Сначала подтвердите адрес электронной почты.',
      expired:'Ссылка недействительна или устарела. Запросите новую и откройте её в этом браузере.',
      invalid:'Проверьте введённые данные. Пароли должны совпадать.',
      weak:'Выберите другой, более надёжный пароль.', resetDone:'Пароль обновлён. Войдите с новым паролем.',
      saved:'Данные сохранены.', unavailable:'Сервис временно недоступен. Попробуйте позже.',
      rate:'Слишком много попыток. Подождите и попробуйте ещё раз.'
    }
  },
  en: {
    title:'Sign in to the lab', intro:'Continue as a teacher or a student.',
    teacher:'Teacher', student:'Student', teacherHelp:'Assign quizzes and view your class results.',
    studentHelp:'Take assigned quizzes and view your scores.',
    login:'Sign in', register:'Create an account', forgot:'Forgot password?', reset:'Set a new password',
    profile:'Account', logout:'Sign out', email:'Email address', name:'Display name',
    password:'Password', confirm:'Confirm password', save:'Save changes', send:'Send link',
    passwordHint:'Use at least 10 characters.', back:'Back to sign in',
    teacherNote:'A site administrator approves teacher accounts.',
    emailNote:'Open the email link in this same browser.',
    messages:{
      invalidEmail:'Enter a valid email address and check it for typos.',
      sent:'If the address is eligible, you’ll receive an email with a link. Check your spam folder too.',
      delivery:'Email could not be sent to this address. Contact the site administrator.', confirmed:'Your email is confirmed. You can sign in now.', credentials:'The email or password is incorrect.',
      teacherPending:'A site administrator needs to approve this account for teacher access.',
      teacherLogin:'Use the teacher sign-in for this account.',
      unconfirmed:'Confirm your email address first.',
      expired:'This link is invalid or has expired. Request a new link and open it in this browser.',
      invalid:'Check the details you entered and make sure your passwords match.',
      weak:'Choose a different, stronger password.', resetDone:'Your password was updated. Sign in with your new password.',
      saved:'Your changes were saved.', unavailable:'The account service is temporarily unavailable. Try again later.',
      rate:'Too many attempts. Wait a little and try again.'
    }
  }
};

const demoCopy = {
  en:{try:'Try a demo account',student:'Student Demo',teacher:'Teacher Demo',notice:'Demo workspace · Sample classroom data · Expires after 3 hours',exit:'Exit demo',switch:'Switch demo role',unavailable:'The demo could not be opened. Please try again.'},
  ru:{try:'Попробуйте демо-аккаунт',student:'Демо ученика',teacher:'Демо учителя',notice:'Демо · Учебные данные · Срок действия 3 часа',exit:'Выйти из демо',switch:'Сменить роль',unavailable:'Не удалось открыть демо. Попробуйте снова.'},
  ky:{try:'Демо аккаунтту сынап көрүңүз',student:'Окуучу демосу',teacher:'Мугалим демосу',notice:'Демо · Үлгү маалыматтар · Мөөнөтү 3 саат',exit:'Демодон чыгуу',switch:'Ролду алмаштыруу',unavailable:'Демону ачуу мүмкүн болгон жок. Кайра аракет кылыңыз.'}
};

const googleCopy = {
  en:{continue:'Continue with Google',intro:'Use your Google account to save assignments and classroom progress.',
    setup:'Google sign-in is being configured. You can explore either demo while setup is completed.',
    cancelled:'Google sign-in was cancelled or could not be completed. Please try again.',
    profile:'Your account is managed through Google.'},
  ru:{continue:'Продолжить с Google',intro:'Используйте аккаунт Google, чтобы сохранять задания и результаты.',
    setup:'Вход через Google настраивается. Пока можно попробовать демо.',
    cancelled:'Вход через Google отменён или не завершён. Попробуйте снова.',
    profile:'Вход в ваш аккаунт осуществляется через Google.'},
  ky:{continue:'Google аркылуу улантуу',intro:'Тапшырмаларды жана жыйынтыктарды сактоо үчүн Google аккаунтун колдонуңуз.',
    setup:'Google аркылуу кирүү жөндөлүүдө. Азырынча демолорду сынап көрүңүз.',
    cancelled:'Google аркылуу кирүү токтотулду же аяктаган жок. Кайра аракет кылыңыз.',
    profile:'Аккаунтуңузга Google аркылуу киресиз.'}
};

function demoButtons(lang) {
  const d = demoCopy[lang];
  return `<div class="demo-choices">${['student','teacher'].map(kind =>
    `<form method="post" action="/demo/start?lang=${lang}&amp;as=${kind}"><button class="button outline" type="submit">${d[kind]}</button></form>`).join('')}</div>`;
}

function renderDemoBanner(lang) {
  const d = demoCopy[lang];
  return `<aside class="demo-banner" aria-label="${d.try}"><div><strong>${d.notice}</strong><span>${d.switch}</span></div>
    ${demoButtons(lang)}<form method="post" action="/demo/end?lang=${lang}"><button class="button outline" type="submit">${d.exit}</button></form></aside>`;
}

function accountHref(path, locale, form, preferred) {
  const query = new URLSearchParams({lang:locale});
  if (form) query.set('auth', form);
  if (preferred) query.set('as', preferred);
  if (params.has('quiz')) query.set('quiz', '1');
  if (params.has('dashboard')) query.set('dashboard', '1');
  if (params.has('student')) query.set('student','1');
  const assignment = params.get('class')?.toUpperCase();
  if (/^[A-F0-9]{8}$/.test(assignment || '')) query.set('class', assignment);
  const video = atlasVideos.find(item => item.id === params.get('video'));
  if (video) query.set('video', video.id);
  return path + '?' + query.toString().replace(/&/g, '&amp;');
}

function renderAccess(locale, form) {
  const labels = accessCopy[locale];
  const preferred = params.get('as') === 'teacher' || !params.has('as') && params.has('dashboard') || form === 'profile' && role === 'teacher' ? 'teacher' : 'student';
  const link = (mode, nextRole = preferred) => accountHref('/', locale, mode, nextRole);
  const statusKey = params.get('status');
  const message = statusKey === 'googleSetup' ? googleCopy[locale].setup : statusKey === 'googleCancelled' ? googleCopy[locale].cancelled :
    statusKey === 'emailSetup' ? learningCopy[locale].emailSetup : statusKey === 'demoUnavailable' ? demoCopy[locale].unavailable :
    Object.hasOwn(labels.messages, statusKey) ? labels.messages[statusKey] : '';
  const hasPassword = ['login', 'register', 'reset'].includes(form);
  const newPassword = ['register', 'reset'].includes(form);
  const emailInput = form !== 'reset';
  const showName = ['register', 'profile'].includes(form);
  const actionLabel = { forgot:labels.send, profile:labels.save }[form] || labels[form];
  const heading = form === 'login' ? labels.title : labels[form];
  if(form!=='profile') {
    const g=googleCopy[locale];
    return `<section class="access account-page" id="access">
      <div class="access-head">${icon}<h1>${labels.title}</h1><p>${g.intro}</p></div>
      <nav class="account-roles" aria-label="${labels.intro}">${['student','teacher'].map(kind=>
        `<a href="${link('login',kind)}" ${kind===preferred?'aria-current="page"':''}><strong>${labels[kind]}</strong><span>${labels[kind+'Help']}</span></a>`).join('')}</nav>
      <div class="access-card account-form">
        ${message?`<p class="account-message" role="status">${message}</p>`:''}
        ${preferred==='teacher'?`<p class="small">${labels.teacherNote}</p>`:''}
        <form method="post" action="${accountHref('/account/google',locale,'',preferred)}"><button type="submit" class="button google-signin">${g.continue}</button></form>
        <section class="try-demo"><h2>${demoCopy[locale].try}</h2>${demoButtons(locale)}</section>
      </div></section>`;
  }
  if (form === 'profile' && document.body.dataset.demo) return `<section class="access account-page"><h1>${labels.profile}</h1>
    <p>${demoCopy[locale].notice}</p>${demoButtons(locale)}</section>`;
  return `<section class="access account-page" id="access">
    <div class="access-head">${icon}<h1>${heading}</h1><p>${form === 'profile' ? labels[role] : form === 'login' ? labels.intro : ''}</p></div>
    ${['login','register'].includes(form) ? `<nav class="account-roles" aria-label="${labels.intro}">
      ${['student','teacher'].map(kind => `<a href="${link(form,kind)}" ${kind === preferred ? 'aria-current="page"' : ''}><strong>${labels[kind]}</strong><span>${labels[kind + 'Help']}</span></a>`).join('')}
    </nav>` : ''}
    <div class="access-card account-form">
      ${message ? `<p class="account-message" role="status">${message}</p>` : ''}
      ${preferred === 'teacher' && ['login','register'].includes(form) ? `<p class="small">${labels.teacherNote}</p>` : ''}
      <form method="post" action="${accountHref('/account/' + form, locale, '', preferred)}" ${form === 'profile' ? 'id="profile-form"' : ''}>
        ${emailInput ? `<label for="account-email">${labels.email}</label><input id="account-email" name="email" type="email" maxlength="254" autocomplete="username" autocapitalize="none" spellcheck="false" ${form === 'profile' ? 'readonly' : 'required'}>` : ''}
        ${showName ? `<label for="account-name">${labels.name}</label><input id="account-name" name="name" maxlength="60" autocomplete="nickname" required>` : ''}
        ${hasPassword ? `<label for="account-password">${labels.password}</label><input id="account-password" name="password" type="password" maxlength="72" autocomplete="${newPassword ? 'new-password' : 'current-password'}" ${newPassword ? 'minlength="10" aria-describedby="password-hint"' : ''} required>` : ''}
        ${newPassword ? `<p class="small" id="password-hint">${labels.passwordHint}</p>
        <label for="account-confirm">${labels.confirm}</label><input id="account-confirm" name="confirm" type="password" maxlength="72" minlength="10" autocomplete="new-password" required>` : ''}
        ${['register','forgot'].includes(form) ? `<p class="small">${labels.emailNote}</p>` : ''}
        <button class="button" type="submit" ${form === 'profile' ? 'disabled' : ''}>${actionLabel}</button>
        <p id="account-load-status" role="status" hidden></p>
      </form>
      ${['login','register','profile'].includes(form) ? `<section class="try-demo"><h2>${demoCopy[locale].try}</h2>${demoButtons(locale)}</section>` : ''}
      <div class="account-links">${form === 'login' ? `<a href="${link('register')}">${labels.register}</a><a href="${link('forgot')}">${labels.forgot}</a>` :
        form === 'profile' ? `<span class="small">${googleCopy[locale].profile}</span>
        <form class="logout" method="post" action="/account/logout?lang=${locale}"><button class="button outline" type="submit">${labels.logout}</button></form>` :
        `<a href="${link('login')}">${labels.back}</a>`}</div>
      ${form==='profile' && role==='student' ? `<button class="button outline" id="request-teacher" type="button">${learningCopy[locale].requestTeacher}</button><p id="teacher-request-status" role="status"></p>` : ''}
    </div>
  </section>`;
}

async function loadProfile(locale) {
  const form = document.getElementById('profile-form');
  if (!form) return;
  try {
    const response = await fetch('/api/profile');
    if (!response.ok) throw new Error();
    const profile = await response.json();
    form.elements.email.value = profile.email;
    form.elements.name.value = profile.name;
    form.querySelector('button').disabled = false;
    if(profile.admin) {
      const link=document.createElement('a');link.href='?lang='+locale+'&admin=1';link.textContent=learningCopy[locale].admin;link.className='button outline';form.after(link);
    }
    document.getElementById('request-teacher')?.addEventListener('click',async()=>{
      const status=document.getElementById('teacher-request-status');
      try{await learningRequest('teacher-request',null,{});status.textContent=learningCopy[locale].requested;}
      catch(error){status.textContent=learningError(error,locale);}
    });
  } catch {
    const status = document.getElementById('account-load-status');
    status.textContent = accessCopy[locale].messages.unavailable;
    status.hidden = false;
  }
}
