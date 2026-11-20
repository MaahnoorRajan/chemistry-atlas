const params = new URLSearchParams(location.search);
const locale = Object.hasOwn(copy, params.get('lang')) ? params.get('lang') : 'ky';
const t = copy[locale];
const role = document.body.dataset.role;
try {
  const account = document.body.dataset.account || 'guest';
  const previous = sessionStorage.getItem('atlas-tab-account') || 'guest';
  if (previous !== account) {
    for (const key of Object.keys(sessionStorage)) {
      if (/^(lab-reading-|observation-|chemistry-atlas-watch-)/.test(key)) sessionStorage.removeItem(key);
    }
    sessionStorage.setItem('atlas-tab-account', account);
  }
} catch {}
window.addEventListener('pageshow', event => {
  if (event.persisted) location.reload();
});
const isQuiz = params.has('quiz');
const dashboardPage = params.has('dashboard') && !isQuiz;
const studentPage = params.has('student') && !isQuiz;
const adminView = params.has('admin');
const requestedAccount = params.get('auth');
const accountView = ['forgot','reset'].includes(requestedAccount) ? requestedAccount :
  role && requestedAccount ? 'profile' : !role && (requestedAccount || isQuiz || dashboardPage || studentPage || adminView) ?
    (requestedAccount === 'register' ? 'register' : 'login') : '';
const a = atlasCopy[locale];
const brand = 'Chemistry Atlas';
if (!isQuiz && !params.has('video') && (params.has('lesson') || ['#classroom','#assign','#watch','#experiment','#log'].includes(location.hash))) {
  params.set('video','jNfgGh-aL2g');
}
const selectedVideo = !isQuiz && atlasVideos.find(video => video.id === params.get('video'));
const c = classCopy[locale];
const ui = {
  ky: { skip:'Негизги мазмунга өтүү', quick:'Ыкчам шилтемелер', signIn:'Кирүү' },
  ru: { skip:'К основному содержанию', quick:'Быстрые ссылки', signIn:'Войти' },
  en: { skip:'Skip to main content', quick:'Quick links', signIn:'Sign in' }
}[locale];
const code = params.get('class')?.trim().toUpperCase() || '';
const validClass = /^[A-F0-9]{8}$/.test(code);
let assigned = role === 'student' && isQuiz && validClass;
let quizVideo = atlasVideos.find(video => video.id === params.get('video')) || atlasVideos.find(video => video.id === legacyQuizVideo);
const url = (quiz, language = locale, print = false) =>
  '?' + new URLSearchParams({lang:language, ...(quiz && {quiz:1}), ...(quiz && (selectedVideo || params.has('video') || assigned) && {video:(selectedVideo || quizVideo).id}), ...(print && {print:1}), ...(quiz && /^[A-F0-9]{8}$/.test(code) && {class:code})});
const trackingVideo = role === 'student' && !!selectedVideo && validClass;
function videoPageUrl(video,lang,classCode) {
  return atlasUrl(lang,{topic:atlasTopics[video.topic],video:video.id,...(classCode && {class:classCode})});
}
const localizedUrl = key => accountView ? accountHref('/', key, accountView, params.get('as') === 'teacher' || dashboardPage ? 'teacher' : 'student') : adminView ? '?lang='+key+'&admin=1' : studentPage ? '?lang='+key+'&student=1' : dashboardPage ? dashboardUrl(key) : isQuiz ? url(true,key) :
  atlasUrl(key,{...Object.fromEntries(['topic','video'].filter(name => params.has(name)).map(name => [name,params.get(name)])), ...(validClass && {class:code})});
const icon = '<img class="chem-mark" src="./atom-logo.png" alt="" width="42" height="42">';
const wordmark = `${icon}<span class="brand-name">Chemistry <span>Atlas</span></span>`;
const footerCopy = {
  ky:{credits:'Булактар жана авторлор', videos:'Видеолор жана окуу материалдары', activity:'Кызыл капуста боюнча тажрыйба', design:'Дизайн үлгүсү', artwork:'Атом сүрөтү, фон алынып салынган', copyright:'Сайттын дизайны жана оригиналдуу тесттер.', rights:'Үчүнчү тараптын материалдарына тиешелүү автордук укуктар жана лицензиялар колдонулат.'},
  ru:{credits:'Источники и авторство', videos:'Видео и учебные материалы', activity:'Опыт с краснокочанной капустой', design:'Источник вдохновения для дизайна', artwork:'Иллюстрация атома, фон удалён', copyright:'Дизайн сайта и оригинальные тесты.', rights:'На сторонние материалы распространяются права и лицензии их авторов.'},
  en:{credits:'Sources and credits', videos:'Videos and learning resources', activity:'Red cabbage indicator activity', design:'Design reference', artwork:'Atom illustration, background removed', copyright:'Site design and original quizzes.', rights:'Third-party materials retain their respective copyrights and licenses.'}
}[locale];

function renderFooter() {
  const f = footerCopy;
  const credits = [
    ['Experimentium','https://www.experimentium.org/experiments/',f.videos],
    ['American Chemical Society','https://www.acs.org/education/activities/red-cabbage-indicator.html',f.activity],
    ['LabXchange','https://www.labxchange.org/library/clusters/lx-cluster:ChemistryResources',f.design],
    ['Vecteezy','https://www.vecteezy.com/',f.artwork]
  ];
  return `<footer class="site-footer"><div class="wrap footer-content">
    <div class="footer-columns"><nav aria-labelledby="footer-links"><h2 id="footer-links">${ui.quick}</h2>
      <ul><li><a href="${url(false)}">${a.library}</a></li><li><a href="${url(false)}#topics">${a.topics}</a></li><li><a href="${url(true)}">${t.quiz}</a></li>
      ${role === 'teacher' ? `<li><a href="${dashboardUrl(locale)}">${dashboardCopy[locale].title}</a></li>` : ''}</ul></nav>
      <section aria-labelledby="footer-credits"><h2 id="footer-credits">${f.credits}</h2><ul>
      ${credits.map(([name,href,description]) => `<li><a href="${href}">${name}</a><span>${description}</span></li>`).join('')}
      </ul></section></div>
    <div class="footer-legal"><p>© 2026 ${f.copyright}</p><p>${f.rights}</p></div>
    </div></footer>`;
}
function renderPage() {
document.documentElement.lang = locale;
document.title = (studentPage ? learningCopy[locale].student : adminView ? learningCopy[locale].admin : accountView ? accessCopy[locale][accountView] : dashboardPage ? dashboardCopy[locale].title : isQuiz ? t.quizTitle : selectedVideo ? videoWords(selectedVideo,locale)[0] : a.library) + ' · ' + brand;
document.getElementById('app').innerHTML = `
<a class="skip-link" href="#main">${ui.skip}</a>
<header class="site-header"><div class="wrap navbar">
<a class="brand" href="${url(false)}">${wordmark}</a>
<nav class="nav" aria-label="${brand}"><a href="${url(false)}" ${!isQuiz && !dashboardPage ? 'aria-current="page"' : ''}>${a.library}</a>${role === 'teacher' ? `<a href="${dashboardUrl(locale)}" ${dashboardPage && !accountView ? 'aria-current="page"' : ''}>${dashboardCopy[locale].title}</a>` : `<a href="${url(true)}" ${isQuiz ? 'aria-current="page"' : ''}>${t.quiz}</a>`}</nav>
${role==='student' ? '<a class="student-nav" href="?lang='+locale+'&amp;student=1">'+learningCopy[locale].student+'</a>' : ''}
<nav class="languages" aria-label="${t.lang}">${[['ky','КЫР','Кыргызча'],['ru','РУС','Русский'],['en','EN','English']].map(([key, short, name]) => `<a href="${localizedUrl(key)}" lang="${key}" aria-label="${name}" ${locale === key ? 'aria-current="true"' : ''}>${short}</a>`).join('')}</nav>
<a class="button ${role ? 'outline' : ''} header-sign-in" href="${accountHref('/', locale, role ? 'profile' : 'login', role || 'student')}">${role ? accessCopy[locale].profile : ui.signIn}</a>
</div></header>
${document.body.dataset.demo ? renderDemoBanner(locale) : ''}
<main class="${dashboardPage && !accountView && role === 'teacher' ? 'dashboard-main' : 'wrap'}" id="main" tabindex="-1">${accountView ? renderAccess(locale, accountView) : adminView ? adminPage(locale) : studentPage && role==='student' ? studentDashboard(locale) : dashboardPage ? renderDashboard(locale,c,a) : isQuiz ? renderQuiz() : atlasLibrary(locale,params,role)}</main>
${renderFooter()}`;

if (accountView) loadProfile(locale);
else if(adminView) setupAdmin(locale);
else if(studentPage && role==='student') setupStudentWork(locale);
else if (dashboardPage && role === 'teacher') { setupTeacherDashboard(locale,c); setupTeacherManagement(locale); }
else if (dashboardPage) return;
else wirePage();
}

function renderVideoGuide(video,lang) {
  const [summary,steps] = video.id === legacyQuizVideo ? indicatorTestSteps[lang] : lessonDetails[video.id][lang];
  const [materials,safety,headers,rows] = labSheets[video.id][lang];
  const columns = headers.split(' | ');
  const readings = { en:'Lab reading collection table', ru:'Таблица измерений и наблюдений', ky:'Өлчөө жана байкоо жадыбалы' }[lang];
  return `<section class="card procedure" id="experiment"><p>${summary}</p>
    <div class="info-grid"><aside><h2>${t.materials}</h2><p>${materials}</p></aside>
    <aside class="safety"><h2>${t.safety}</h2><p>${safety}</p></aside></div>
    <h2>${guideLabels[lang].steps}</h2><ol>${steps.split(' | ').map(step=>`<li>${step}</li>`).join('')}</ol>
    <section class="log" id="log"><h2>${readings}</h2>
      <div class="reading-scroll"><table><thead><tr>${columns.map(label=>`<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>
        ${rows.split(' | ').map((label,row)=>`<tr><th scope="row">${label}</th>${columns.slice(1).map((column,col)=>`<td>
          <input type="text" data-reading="${row}-${col}" aria-label="${label} · ${column}" maxlength="160"><span class="print-only log-value"></span></td>`).join('')}</tr>`).join('')}
      </tbody></table></div><button type="button" class="button outline" id="print-log">${t.printLog}</button>
      <button type="button" class="button outline" id="download-lesson">${learningCopy[lang].sheet}</button>
      ${trackingVideo ? `<button type="button" class="button" id="save-notebook">${learningCopy[lang].save}</button><p role="status" id="notebook-status"></p><p id="notebook-feedback"></p>` : ''}
    </section></section>`;
}
function renderAssignmentControls(video) {
  return `<section class="card assignment" id="assign"><h2>${t.labels[2]}</h2><p>${videoWords(video,locale)[0]}</p>
  <div class="actions"><a class="button" href="#classroom">${c.dashboard} ↓</a><a class="button outline" href="${url(true)}">${t.preview} ↗</a><a class="button outline" href="${url(true,locale,true)}">${t.print}</a></div></section>
  ${classroomMarkup(c,a)}`;
}

function renderQuiz() {
  return `<section class="quiz">
  <a class="back" href="${role === 'teacher' ? videoPageUrl(quizVideo,locale) + '#assign' : assigned ? videoPageUrl(quizVideo,locale,code) : url(false)}">← ${role === 'teacher' || assigned ? t.back : a.library}</a>
  <div class="quiz-head"><h1>${t.quizTitle}</h1><p>${videoWords(quizVideo,locale)[0]}</p></div>
  ${role === 'student' && !assigned ? `<div class="card"><p>${a.code}</p>${classStudentMarkup(c,false,locale)}</div></section>` : `
  ${assigned ? `<p id="quiz-access-status" role="status"></p>` : ''}
  <div class="card quiz-body" id="quiz-body" ${assigned ? 'hidden' : ''}><p>${t.quizLead}</p>${role === 'teacher' ? `<button class="button outline" id="print-quiz" type="button">${t.print}</button>` : ''}
  <p class="print-only">${t.name} ____________________________________</p>
  <form id="quizform">${assigned ? '<p id="save-status" role="status"></p>' : ''}${questionsFor(quizVideo.id,locale).map(([title, options],index) => `<fieldset><legend>${index+1}. ${title}</legend>${options.map((option,i) => `<label><input type="radio" name="q${index}" value="${i}" required><span>${option}</span></label>`).join('')}<p class="answer" hidden></p></fieldset>`).join('')}<button class="button" type="submit">${t.check}</button></form>
  <aside id="result" tabindex="-1" aria-live="polite" hidden><h2></h2><button class="button outline" id="retry" type="button">${t.retry}</button></aside></div></section>`}`;
}

const byId = id => document.getElementById(id);
function wirePage() {
setupLibrarySearch(locale);
document.querySelectorAll('.video-thumb img').forEach(image => {
  image.addEventListener('error',() => { image.hidden = true; });
  if (image.complete && !image.naturalWidth) image.hidden = true;
});
if (isQuiz && (role === 'teacher' || assigned)) {
  const questions = questionsFor(quizVideo.id,locale);
  const watchUrl = videoPageUrl(quizVideo,locale,code);
  const form = byId('quizform');
  const fields = [...form.querySelectorAll('fieldset')];
  const submit = form.querySelector('[type=submit]');
  const result = byId('result');
  let receipt;
  function showScore(score, total) {
    result.querySelector('h2').textContent = t.score + ' · ' + score + ' / ' + total;
    if (assigned) byId('retry').hidden = true;
    result.hidden = false;
    result.focus();
  }
  if (assigned) {
    const status = byId('quiz-access-status');
    const openQuiz = async () => {
      const prior = await classRequest('attempt', code);
      if (prior.saved) {
        form.hidden = true;
        byId('quiz-body').firstElementChild.hidden = true;
        byId('quiz-body').hidden = false;
        showScore(prior.score, prior.total);
        return;
      }
      receipt = storedWatchReceipt(code);
      if (!receipt) return location.replace(watchUrl);
      const {video_id} = await classRequest('watch-check',code,{receipt});
      if (video_id !== quizVideo.id) return location.replace(watchUrl);
      byId('quiz-body').hidden = false;
    };
    openQuiz().catch(error => {
      if (['watch','closed'].includes(error.message)) location.replace(watchUrl);
      else status.textContent = c[error.message] || c.unavailable;
    });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(form);
    if (assigned) {
      if (!receipt) return;
      submit.disabled = true;
      byId('save-status').textContent = '';
      try {
        await classRequest('attempt', code, {
          receipt,
          answers: questions.map((_, i) => Number(data.get('q' + i)))
        });
        byId('save-status').textContent = c.saved;
      } catch (error) {
        byId('save-status').textContent = a[error.message] || c[error.message] || c.unavailable;
        return;
      } finally {
        submit.disabled = false;
      }
    }
    let score = 0;
    questions.forEach(([,options,key,why],i) => {
      const correct = data.get('q'+i) === String(key);
      score += Number(correct);
      const answer = fields[i].querySelector('.answer');
      answer.className = 'answer ' + (correct ? 'correct' : 'incorrect');
      answer.textContent = (correct ? t.right : t.correct + ' — ' + options[key] + '.') + ' ' + why;
      answer.hidden = false;
      fields[i].disabled = true;
    });
    submit.hidden = true;
    showScore(score, questions.length);
  });
  byId('retry').addEventListener('click', () => {
    form.reset();
    fields.forEach(field => {
      field.disabled = false;
      field.querySelector('.answer').hidden = true;
    });
    result.hidden = true;
    submit.hidden = false;
    form.querySelector('input').focus();
  });
  byId('print-quiz')?.addEventListener('click', () => window.print());
  if (role === 'teacher' && params.has('print')) window.addEventListener('load', () => window.print(), {once:true});
} else if (selectedVideo) {
  byId('download-lesson')?.addEventListener('click',()=>downloadLesson(selectedVideo,locale));
  if(trackingVideo) setupNotebook(locale,selectedVideo,code);
  if (role === 'teacher') setupClassroom(c, locale, selectedVideo);
  if (trackingVideo) startAssignedVideo(locale,code,selectedVideo,() => { byId('open-quiz').hidden = false; });
  document.querySelectorAll('[data-reading]').forEach(input => {
    const key = 'lab-reading-' + selectedVideo.id + '-' + input.dataset.reading;
    const output = input.nextElementSibling;
    try {
      const saved = sessionStorage.getItem(key);
      if (saved !== null) input.value = saved;
      else if (selectedVideo.id === legacyQuizVideo) {
        const [row,col] = input.dataset.reading.split('-');
        const previous = Number(col) < 2 && sessionStorage.getItem('observation-' + row + '-' + (Number(col) + 1));
        if (previous) input.value = t.colors[previous] || '';
      }
    } catch {}
    output.textContent = input.value;
    input.addEventListener('input',() => {
      output.textContent = input.value;
      try { sessionStorage.setItem(key,input.value); } catch {}
    });
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('printing-log'));
  byId('print-log')?.addEventListener('click', () => {
    document.body.classList.add('printing-log');
    window.print();
  });
}
if (location.hash) document.getElementById(location.hash === '#watch' ? 'video' : location.hash.slice(1))?.scrollIntoView();
}

if (assigned) {
  classRequest('assignment',code).then(assignment => {
    quizVideo = atlasVideos.find(video => video.id === assignment.video_id);
    if (!quizVideo) throw new Error('notfound');
    renderPage();
  }).catch(error => {
    params.delete('class');
    assigned=false;
    renderPage();
    const notice=document.createElement('p');notice.role='alert';notice.textContent=c[error.message]||c.unavailable;
    byId('main').prepend(notice);
  });
} else {
  renderPage();
}
