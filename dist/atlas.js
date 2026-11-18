const atlasCopy = {
  ky:{
    library:'Видео китепкана', intro:'Теманы тандап, химиялык тажрыйбаларды жана алардын түшүндүрмөлөрүн көрүңүз.',
    topics:'Химиянын темалары', all:'Бардык темалар', play:'Видеону көрүү', source:'Булак', lesson:'Сабактын планы', length:'Видео', code:'Мугалим берген класс кодун киргизиңиз.',
    watch:'Тестти ачуу үчүн видеону башынан аягына чейин ушул жерден көрүңүз.', done:'Видео аяктады. Тест ачылды.', skip:'Улантуу үчүн көрүлбөй калган жерден баштаңыз.',
    error:'Видео жүктөлгөн жок. Интернет байланышын текшерип, кайра аракет кылыңыз.', retry:'Кайра жүктөө', closed:'Мугалим бул тестти азырынча ача элек.', openQuiz:'Тестти ачуу', closeQuiz:'Тестти жабуу', open:'Тест ачык', shut:'Тест жабык',
    topicNames:['Кычкылдар жана негиздер','Өлчөө жана заттар','Аралашмаларды бөлүү','Атомдор жана реакциялар','Газдар жана жарык','Химиялык байланыштар','Кристаллдар жана эритмелер','Органикалык химия','Стехиометрия']
  },
  ru:{
    library:'Видеотека', intro:'Выберите тему и смотрите химические опыты и объяснения.',
    topics:'Темы по химии', all:'Все темы', play:'Смотреть видео', source:'Источник', lesson:'План урока', length:'Видео', code:'Введите код класса, который дал учитель.',
    watch:'Посмотрите видео здесь от начала до конца, чтобы открыть тест.', done:'Видео просмотрено. Тест открыт.', skip:'Продолжите с того места, которое пропустили.',
    error:'Не удалось загрузить видео. Проверьте подключение и попробуйте снова.', retry:'Перезагрузить', closed:'Учитель пока не открыл этот тест.', openQuiz:'Открыть тест', closeQuiz:'Закрыть тест', open:'Тест открыт', shut:'Тест закрыт',
    topicNames:['Кислоты и основания','Измерения и свойства веществ','Разделение смесей','Атомы и реакции','Газы и свет','Химические связи','Кристаллы и растворы','Органическая химия','Стехиометрия']
  },
  en:{
    library:'Video library', intro:'Choose a topic to explore chemistry experiments and the ideas behind them.',
    topics:'Explore by topic', all:'All topics', play:'Watch video', source:'Source', lesson:'Lesson plan', length:'Videos', code:'Enter the class code from your teacher to access an assigned quiz.',
    watch:'Watch this video here from beginning to end to unlock the quiz.', done:'Video complete. The quiz is unlocked.', skip:'Continue from the point you skipped.',
    error:'The video could not load. Check your connection and try again.', retry:'Reload', closed:'Your teacher has not opened this quiz.', openQuiz:'Open quiz', closeQuiz:'Close quiz', open:'Quiz open', shut:'Quiz closed',
    topicNames:['Acids and bases','Matter and measurement','Separating mixtures','Atoms and reactions','Gases and light','Chemical bonding','Crystals and solutions','Organic chemistry','Stoichiometry']
  }
};

const atlasTopics = ['acids-bases','matter-measurement','separating-mixtures','atoms-reactions','gases-light','chemical-bonding','crystals-solutions','organic-chemistry','stoichiometry'];
const atlasSymbols = ['pH','ρ','⧖','◎','λ','δ','◇','C','mol'];
const topicIcons = [
  '<path fill="#d5efff" d="M16 15h13v36a6.5 6.5 0 0 1-13 0zM35 15h13v36a6.5 6.5 0 0 1-13 0z"/><path fill="#ff789b" d="M16 33h13v18a6.5 6.5 0 0 1-13 0z"/><path fill="#a391ff" d="M35 27h13v24a6.5 6.5 0 0 1-13 0z"/><path d="M13 15h19m0 0h19"/><circle cx="22.5" cy="43" r="2" fill="#fff"/><circle cx="41.5" cy="38" r="2" fill="#fff"/>',
  '<path fill="#ffc66e" d="M11 47 45 13l10 10-34 34z"/><path d="m20 39 5 5m2-12 4 4m4-12 5 5m2-12 4 4"/><path fill="#7bdcff" d="m8 26 5-10 10-3 3 9-7 8z"/><path d="m13 16 3 8 7-11m-7 11-8 2"/>',
  '<path fill="#d5efff" d="M11 12h42L38 31v12l-12 6V31z"/><path fill="#ffc66e" d="M18 21h28l-8 10H26z"/><path fill="#75ddf8" d="M32 47s-5 6-5 9a5 5 0 0 0 10 0c0-3-5-9-5-9Z"/>',
  '<g fill="none" stroke="#78deff"><ellipse cx="32" cy="32" rx="26" ry="10"/><ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)"/></g><circle cx="32" cy="32" r="6" fill="#ff8f9f"/><circle cx="55" cy="28" r="4" fill="#ffc66e"/><circle cx="21" cy="51" r="4" fill="#ffc66e"/>',
  '<path d="m6 38 15-6" stroke="#e8f8ff"/><path d="m42 31 16-10" stroke="#ff8f9f"/><path d="m43 35 16-3" stroke="#ffc66e"/><path d="m43 39 16 5" stroke="#84ebcb"/><path d="m42 43 16 12" stroke="#b6a7ff"/><path fill="#a5e6fc" d="m32 13 19 36H13z"/><path fill="#dff8ff" d="M32 13v36H13z"/>'
];
topicIcons.push(
  '<path d="M15 43 32 23l17 20" fill="none" stroke="#d5efff" stroke-width="7"/><circle cx="32" cy="22" r="11" fill="#ff899f"/><circle cx="14" cy="44" r="8" fill="#d5efff"/><circle cx="50" cy="44" r="8" fill="#d5efff"/>',
  '<path fill="#a391ff" d="m33 7 17 12v26L33 57 15 45V19z"/><path fill="#d5efff" d="m33 7 17 12-17 10-18-10z"/><path fill="#75ddf8" d="M33 29 50 19v26L33 57z"/>',
  '<path d="m32 13 17 10v20L32 53 15 43V23Z" fill="none" stroke="#b7eaff" stroke-width="4"/><circle cx="32" cy="13" r="6" fill="#ffc66e"/><circle cx="49" cy="43" r="6" fill="#84ebcb"/><circle cx="15" cy="43" r="6" fill="#ff789b"/>',
  '<path d="M32 12v39M12 23h40M20 53h24" fill="none" stroke="#d5efff" stroke-width="4"/><path fill="#ffc66e" d="m13 23-8 16h16zM51 23l-8 16h16z"/><circle cx="32" cy="20" r="5" fill="#75ddf8"/>'
);
const atlasVideos = [
  {id:'u3L5_2rOKDU',topic:0,n:[['Индикатор жасоо','Кызыл капустадан табигый рН индикаторун даярдоо.'],['Приготовление индикатора','Как получить природный индикатор pH из краснокочанной капусты.'],['Make a cabbage indicator','Prepare a natural pH indicator from red cabbage.']]},
  {id:'jNfgGh-aL2g',topic:0,n:[['рН индикаторлорун сыноо','Эритменин кычкылдуулугу өзгөргөндө индикатордун түсүн байкаңыз.'],['Проверка индикаторов pH','Проследите, как меняется цвет индикатора при разной кислотности.'],['Test pH indicators','Compare indicator colors across acidic, neutral, and basic solutions.']]},
  {id:'2WIR-1CVG38',topic:1,n:[['Тыгыздыкты аныктоо','Масса менен көлөмдүн тыгыздыкка кандай байланышы бар экенин көрүңүз.'],['Определение плотности','Посмотрите, как масса и объём связаны с плотностью.'],['Determine density','See how mass and volume are used to find density.']]},
  {id:'-Csx5DNtE84',topic:1,n:[['Көлөмдү өлчөө','Өлчөөчү идиш менен суюктуктун көлөмүн аныктаңыз.'],['Измерение объёма','Посмотрите, как измеряют объём жидкости.'],['Measure volume','Learn how to read the volume of a liquid in the lab.']]},
  {id:'6z9fqGlLT64',topic:2,n:[['Чыпкалоо','Катуу бөлүкчөлөрдү суюктуктан чыпка менен бөлүүнү көрүңүз.'],['Фильтрование','Посмотрите, как фильтр отделяет твёрдые частицы от жидкости.'],['Gravity filtration','See how a filter separates solid particles from a liquid.']]},
  {id:'3LLPN-f19lc',topic:2,n:[['Кристаллдашуу','Эритмеден кристаллдар кантип пайда болорун билиңиз.'],['Кристаллизация','Узнайте, как кристаллы образуются из раствора.'],['Crystallization','Explore how crystals form from a solution.']]},
  {id:'4TlaSEUIjuA',topic:3,n:[['Бордун атом модели','Атомдогу электрондорду түшүндүргөн моделди изилдеңиз.'],['Модель атома Бора','Изучите модель расположения электронов в атоме.'],['The Bohr model','Explore a model for how electrons are arranged in an atom.']]},
  {id:'2p5KJWW-hrw',topic:3,n:[['Химиялык реакциялар','Реакцияда баштапкы заттардан жаңы заттар кантип пайда болорун билиңиз.'],['Химические реакции','Узнайте, как исходные вещества превращаются в продукты.'],['Chemical reactions','Learn how reactants change into products.']]},
  {id:'Ihje16_R00U',topic:4,n:[['Идеал газдын мыйзамы','Басым, көлөм жана температуранын байланышын караңыз.'],['Закон идеального газа','Изучите связь между давлением, объёмом и температурой газа.'],['The ideal gas law','Connect gas pressure, volume, and temperature.']]},
  {id:'o-nizzfTLhw',topic:4,n:[['Көрүнүүчү жарыктын спектри','Көрүнүүчү жарыктын спектри лабораторияда кантип жазыларын көрүңүз.'],['Спектр видимого света','Посмотрите, как в лаборатории регистрируют спектр света.'],['Record a visible spectrum','Watch how a visible-light spectrum is recorded in the lab.']]}
];

const expandedVideos = [
  ['PQVxycMraAk',5,'bond dipole electronegativity связь электроотрицательность байланыш',
    ['Байланыштын уюлдуулугу','Электрондор кандай бөлүштүрүлөрүн караңыз.','Кайсы атом электрондорду күчтүүрөөк тартарын табыңыз.'],
    ['Полярность связи','Узнайте, как распределяются электроны в связи.','Определите, какой атом сильнее притягивает электроны.'],
    ['Bond polarity','See how electrons are shared in a bond.','Identify which atom pulls the shared electrons more strongly.']],
  ['80HpbSjD-ZU',5,'molecule dipole H2O CO2 polar geometry полярность молекула',
    ['Молекуланын уюлдуулугу','Молекуланын формасы менен уюлдуулугун салыштырыңыз.','Байланыштардын багыты бири-бирин теңдейби, байкаңыз.'],
    ['Полярность молекул','Свяжите форму молекулы с её полярностью.','Посмотрите, компенсируют ли диполи связей друг друга.'],
    ['Molecular polarity','Connect molecular shape and polarity.','Check whether the bond dipoles cancel each other.']],
  ['UALzuFMjAxE',6,'solute solvent water H2O solution растворимость эригичтик',
    ['Эригичтик','Эриткичте зат канча эрий аларын билиңиз.','Эриген зат менен эриткичти айырмалаңыз.'],
    ['Растворимость','Узнайте, сколько вещества может раствориться.','Различите растворённое вещество и растворитель.'],
    ['Solubility','Explore how much of a substance can dissolve.','Identify the solute and the solvent in the example.']],
  ['m6y6kDwRMfg',7,'soap oil grease surfactant мыло май самын',
    ['Самын','Самын майды кетирүүгө кантип жардам берерин билиңиз.','Самын молекуласынын суу жана май менен аракеттенген бөлүктөрүн табыңыз.'],
    ['Мыло','Узнайте, как мыло помогает смывать жир.','Найдите части молекулы мыла, взаимодействующие с водой и жиром.'],
    ['Soap','See how soap helps wash away grease.','Identify which parts of a soap molecule interact with water and oil.']],
  ['y0RGTbexhps',7,'carbon organic formula углерод көмүртек',
    ['Органикалык молекулалар','Көмүртек камтыган молекулаларды чиймеден окуңуз.','Молекуланын көмүртек каркасын табыңыз.'],
    ['Изображение органических молекул','Научитесь читать схемы органических молекул.','Найдите углеродный скелет на схеме.'],
    ['Drawing organic molecules','Learn to read diagrams of organic molecules.','Trace the carbon skeleton in the diagram.']],
  ['DpiuQJSL-XE',8,'mole mol ratio stoechiometry моль катыш',
    ['Стехиометрия','Химиялык теңдемедеги заттардын катышын түшүнүңүз.','Теңдеменин коэффициенттеринен молдук катышты табыңыз.'],
    ['Стехиометрия','Разберитесь в соотношениях веществ в реакции.','Используйте коэффициенты, чтобы найти мольное соотношение.'],
    ['Stoichiometry','Use a balanced equation to relate amounts of substances.','Read the coefficients to find the mole ratio.']],
  ['nLrr2NV_ocs',8,'balanced chemical equation reactant product уравнение теңдеме',
    ['Химиялык теңдемени окуу','Теңдемеден баштапкы жана пайда болгон заттарды табыңыз.','Реакциянын эки жагындагы атомдорду салыштырыңыз.'],
    ['Чтение химических уравнений','Найдите реагенты и продукты в уравнении.','Сравните число атомов каждого элемента по обе стороны стрелки.'],
    ['Reading chemical equations','Identify reactants and products in an equation.','Compare the number of atoms of each element on either side of the arrow.']],
  ['j1oEp-X6VGI',8,'percent yield actual theoretical выход түшүм',
    ['Пайыздык чыгым','Алынган өлчөмдү теориялык өлчөм менен салыштырыңыз.','Чыныгы өлчөмдү теориялык өлчөмгө бөлүп, 100гө көбөйтүңүз.'],
    ['Выход продукта','Сравните фактический и теоретический выход.','Разделите фактический выход на теоретический и умножьте на 100.'],
    ['Percent yield','Compare actual and theoretical yield.','Divide actual yield by theoretical yield and multiply by 100.']]
];
for (const [id,topic,tags,...translations] of expandedVideos) {
  atlasVideos.push({id,topic,tags,n:translations.map(entry => entry.slice(0,2)),
    tutorial:true});
}

const atlasUrl = (lang, values = {}) => '?' + new URLSearchParams({lang,...values});
const videoWords = (video, lang) => video.n[['ky','ru','en'].indexOf(lang)];
const thumbnail = id => 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
const libraryCopy = {
  ky:{title:'Химияны тажрыйба аркылуу үйрөнүңүз', intro:'Chemistry Atlas — окуучулар жана мугалимдер үчүн химия видеолорунун китепканасы. Ар бир видеонун астында кыргызча, орусча жана англисче кыскача нускама бар.', browse:'Темаларды көрүү', search:'Видеолорду издөө', placeholder:'Аталышы, зат же формула: мисалы, уксус, H₂O, pH', filters:'Тема боюнча чыпкалоо', all:'Бардык видеолор', results:'Табылган видеолор', empty:'Видео табылган жок. Башка сөз же тема тандаңыз.'},
  ru:{title:'Изучайте химию на опытах', intro:'Chemistry Atlas — видеотека по химии для учеников и учителей. Под каждым видео есть краткие пояснения на кыргызском, русском и английском.', browse:'Смотреть темы', search:'Поиск видео', placeholder:'Название, вещество или формула: например, уксус, H₂O, pH', filters:'Фильтр по темам', all:'Все видео', results:'Найдено видео', empty:'Видео не найдены. Попробуйте другое слово или тему.'},
  en:{title:'Explore chemistry through experiments', intro:'Chemistry Atlas is a video library for students and teachers. Watch lab demonstrations and chemistry tutorials, with short guides in Kyrgyz, Russian, and English below each video.', browse:'Browse topics', search:'Search videos', placeholder:'Search by title, reagent, or formula, e.g. vinegar, H₂O, pH', filters:'Filter by topic', all:'All videos', results:'Videos found', empty:'No videos found. Try another term or topic.'}
};
const searchTags = {
  'u3L5_2rOKDU':'red cabbage anthocyanin pH H2O капуста капуста антоциан',
  'jNfgGh-aL2g':'red cabbage pH vinegar acetic acid CH3COOH baking soda sodium bicarbonate NaHCO3 H2O уксус аш содасы уксусная кислота пищевая сода',
  '2WIR-1CVG38':'mass density rho volume масса объём тыгыздык',
  '-Csx5DNtE84':'H2O water graduated cylinder meniscus вода суу мениск',
  '6z9fqGlLT64':'filter funnel filtration чыпка воронка фильтр',
  '3LLPN-f19lc':'crystal solution evaporation кристалл эритме испарение'
};
const inTopic = (video, topic) => video.topic === topic || (topic === 6 && video.id === '3LLPN-f19lc');

function videoTiles(videos,lang,topic) {
  return videos.map(video => {
    const [title,desc] = videoWords(video,lang);
    return `<a class="video-tile" href="${atlasUrl(lang,{topic:atlasTopics[topic ?? video.topic],video:video.id})}">
      <div class="video-thumb"><b aria-hidden="true">${atlasSymbols[video.topic]}</b><img src="${thumbnail(video.id)}" alt="" loading="lazy" width="480" height="360"><span aria-hidden="true">▶</span></div>
      <div class="video-info"><h2>${title}</h2><p>${desc}</p></div></a>`;
  }).join('');
}

function libraryHome(lang) {
  const l = libraryCopy[lang];
  const a = atlasCopy[lang];
  const { acid, neutral, base } = copy[lang];
  return `<div class="atlas-heading library-welcome">
    <div class="welcome-copy"><h1>${l.title}</h1><p>${l.intro}</p><a class="button" href="#topics">${l.browse} ↓</a></div>
    <div class="lab-art welcome-lab" aria-hidden="true"><div class="orbit one"></div><div class="orbit two"></div>
    <div class="tube-rack">${[acid,neutral,base].map((label,i)=>`
      <div class="sample"><div class="tube tube-${i}"><span></span><i></i><b></b></div><span>${label}</span></div>`).join('')}</div>
    <span class="ph">pH</span></div></div>
    <section class="library-controls" aria-label="${l.search}">
      <label for="library-search">${l.search}</label>
      <div class="library-input"><span aria-hidden="true">⌕</span><input type="search" id="library-search" placeholder="${l.placeholder}" autocomplete="off"></div>
      <div class="library-filters" role="group" aria-label="${l.filters}">
        <button type="button" data-filter="all" aria-pressed="false">${l.all} (${atlasVideos.length})</button>
        ${a.topicNames.map((name,i)=>`<button type="button" data-filter="${i}" aria-pressed="false">${name}</button>`).join('')}
      </div>
    </section>
    <section id="library-results" hidden><p id="library-count" role="status"></p><div class="atlas-videos" id="library-matches"></div></section>`;
}

function setupLibrarySearch(lang) {
  const input = document.getElementById('library-search');
  if (!input) return;
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const results = document.getElementById('library-results');
  const tiles = document.getElementById('library-matches');
  const topics = document.getElementById('topics');
  const normalize = value => value.normalize('NFKC').toLowerCase().replace(/[‐‑–—]/g,'-');
  const index = atlasVideos.map(video => normalize([
    ...video.n.flat(), video.tags, searchTags[video.id],
    ...Object.values(atlasCopy).flatMap(words => words.topicNames.filter((_,i)=>inTopic(video,i)))
  ].filter(Boolean).join(' ')));
  let filter = null;
  let lastKey;
  function update() {
    const query = normalize(input.value).trim();
    const key = JSON.stringify([filter,query]);
    if (key === lastKey) return;
    lastKey = key;
    const active = filter !== null || !!query;
    results.hidden = !active;
    buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filter === filter)));
    if (!active) return;
    const terms = query.split(/\s+/).filter(Boolean);
    const matches = atlasVideos.filter((video,i) => (filter === null || filter === 'all' || inTopic(video,Number(filter))) &&
      terms.every(term => index[i].includes(term)));
    const l = libraryCopy[lang];
    document.getElementById('library-count').textContent = matches.length ? l.results + ' · ' + matches.length : l.empty;
    tiles.innerHTML = videoTiles(matches,lang,filter === null || filter === 'all' ? undefined : Number(filter));
  }
  tiles.addEventListener('error',event => { if (event.target.matches('img')) event.target.hidden = true; },true);
  input.addEventListener('input',update);
  buttons.forEach(button => button.addEventListener('click',() => {
    filter = filter === button.dataset.filter ? null : button.dataset.filter;
    update();
  }));
  topics.querySelector('h2').tabIndex = -1;
  const scroller = document.getElementById('topic-scroller');
  const arrows = topics.querySelectorAll('[data-topic-scroll]');
  function updateArrows() {
    arrows[0].disabled = scroller.scrollLeft < 1;
    arrows[1].disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
  }
  arrows.forEach(button => button.addEventListener('click', () => {
    const tile = scroller.querySelector('.topic-tile');
    const stride = tile.offsetWidth + parseFloat(getComputedStyle(tile.parentElement).columnGap);
    scroller.scrollBy({left:Number(button.dataset.topicScroll) * stride,
      behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }));
  scroller.addEventListener('scroll',updateArrows,{passive:true});
  window.addEventListener('resize',updateArrows);
  updateArrows();
  update();
}

const topicScrollCopy = {
  ky:['Темаларды көрүү үчүн оңго жылдырыңыз','Мурунку темалар','Кийинки темалар'],
  ru:['Листайте вправо, чтобы увидеть больше тем','Предыдущие темы','Следующие темы'],
  en:['Scroll sideways to explore more topics','Previous topics','Next topics']
};
const guideLabels = {
  ky:{steps:'Жөнөкөй кадамдар', observe:'Видеону көрүп, байкаңыз', quiz:'Тестке өтүү'},
  ru:{steps:'Простые шаги', observe:'На что обратить внимание', quiz:'Перейти к тесту'},
  en:{steps:'Simple steps', observe:'Follow along', quiz:'Go to quiz'}
};

function atlasPlayer(video,lang) {
  return `<div class="atlas-player" id="video"><iframe src="https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&amp;hl=${lang}&amp;cc_load_policy=1&amp;cc_lang_pref=${lang}" title="${videoWords(video,lang)[0]}" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
}

function atlasLibrary(lang, params, role) {
  const a = atlasCopy[lang];
  const video = atlasVideos.find(item => item.id === params.get('video'));
  const requestedTopic = atlasTopics.indexOf(params.get('topic'));
  const topic = video ? (inTopic(video,requestedTopic) ? requestedTopic : video.topic) : requestedTopic;
  const heading = topic >= 0 ? a.topicNames[topic] : a.library;
  const tutorial = video?.tutorial || ['3LLPN-f19lc','4TlaSEUIjuA','2p5KJWW-hrw','Ihje16_R00U'].includes(video?.id);
  const source = 'https://www.experimentium.org/' + (topic === 0 ? 'view-experiment/?exp_id=130' : tutorial ? 'student-resources/' : 'technique-videos/');
  return `<section class="atlas">${topic < 0 ? libraryHome(lang) : `<div class="atlas-heading">
    ${topic >= 0 ? `<a class="atlas-back" href="${atlasUrl(lang)}">← ${a.all}</a>` : ''}
    ${video ? `<a class="atlas-back" href="${atlasUrl(lang,{topic:atlasTopics[topic]})}">← ${heading}</a>` : ''}
    <h1>${video ? videoWords(video,lang)[0] : heading}</h1><p>${video ? videoWords(video,lang)[1] : a.intro}</p></div>`}
    ${video ? `${trackingVideo ? watchMarkup(lang) : atlasPlayer(video,lang)}
      ${video.id === legacyQuizVideo ? renderIndicatorProcedure() : renderVideoGuide(video,lang)}
      ${role === 'teacher' ? renderAssignmentControls(video) : `<a class="button" id="open-quiz" href="${url(true)}" ${trackingVideo ? 'hidden' : ''}>${guideLabels[lang].quiz} →</a>`}
      <div class="actions atlas-links"><a class="button outline" href="https://youtu.be/${video.id}" target="_blank" rel="noopener">YouTube ↗</a>
      <a class="button outline" href="${source}">${a.source} · Experimentium ↗</a></div>`
    : topic >= 0 ? `<div class="atlas-videos">${videoTiles(atlasVideos.filter(item => inTopic(item,topic)),lang,topic)}</div>` : `<section id="topics">
      <div class="topic-toolbar"><div><h2 id="topic-title">${a.topics}</h2><p id="topic-scroll-hint">${topicScrollCopy[lang][0]}</p></div>
      <div class="topic-arrows"><button type="button" data-topic-scroll="-1" aria-label="${topicScrollCopy[lang][1]}" aria-controls="topic-scroller">←</button>
      <button type="button" data-topic-scroll="1" aria-label="${topicScrollCopy[lang][2]}" aria-controls="topic-scroller">→</button></div></div>
      <div class="atlas-honeycomb" id="topic-scroller" role="region" aria-labelledby="topic-title" aria-describedby="topic-scroll-hint" tabindex="0"><div class="atlas-topics">${atlasTopics.map((slug,i)=>`
      <a class="topic-tile" href="${atlasUrl(lang,{topic:slug})}"><svg class="topic-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false" stroke="#062e51" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${topicIcons[i]}</svg><strong>${a.topicNames[i]}</strong><span>${atlasVideos.filter(item=>inTopic(item,i)).length} · ${a.length} →</span></a>`).join('')}</div></div></section>`}
  </section>`;
}

function watchMarkup(lang) {
  const a = atlasCopy[lang];
  return `<section class="card watch-gate" id="video"><p id="student-class" class="small"></p><p id="watch-status" role="status">${a.watch}</p>
    <div class="atlas-player" id="required-player" hidden></div><progress id="watch-progress" max="100" value="0" hidden></progress>
    <button type="button" class="button outline" id="watch-retry" hidden>${a.retry}</button></section>`;
}

function storedWatchReceipt(code) {
  try { return sessionStorage.getItem('chemistry-atlas-watch-' + code); } catch { return null; }
}

function youtubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve,reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => reject(new Error('youtube')),12000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      resolve(window.YT);
    };
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => { clearTimeout(timeout); reject(new Error('youtube')); };
    document.head.append(script);
  });
}

async function startAssignedVideo(lang, code, video, unlock) {
  const a = atlasCopy[lang];
  const status = document.getElementById('watch-status');
  const container = document.getElementById('required-player');
  const progress = document.getElementById('watch-progress');
  const retry = document.getElementById('watch-retry');
  retry.addEventListener('click', () => location.reload());

  function showError(error) {
    status.textContent = error.message === 'closed' ? a.closed : error.message === 'notfound' ? classCopy[lang].notfound : a.error;
    retry.hidden = false;
  }

  try {
    const assignment = await classRequest('assignment',code);
    if (assignment.video_id !== video.id) {
      const required = atlasVideos.find(item => item.id === assignment.video_id);
      if (!required) throw new Error('notfound');
      location.replace(videoPageUrl(required,lang,code));
      return;
    }
    document.getElementById('student-class').textContent = classCopy[lang].assignment + ' · ' + assignment.class_name + ' · ' + code;
    if (!assignment.quiz_open) throw new Error('closed');
    const receiptKey = 'chemistry-atlas-watch-' + code;
    const previous = storedWatchReceipt(code);
    if (previous) {
      const verified = await classRequest('watch-check',code,{receipt:previous}).catch(() => null);
      if (verified?.finished) {
        container.insertAdjacentHTML('afterend', atlasPlayer(video,lang).replace(' id="video"',''));
        status.textContent = a.done;
        unlock(previous);
        return;
      }
    }
    const [{token},yt] = await Promise.all([classRequest('watch-start',code,{}),youtubeAPI()]);
    const frame = document.createElement('iframe');
    frame.title = videoWords(video,lang)[0];
    frame.src = 'https://www.youtube-nocookie.com/embed/' + video.id + '?' + new URLSearchParams({
      enablejsapi:'1', origin:location.origin, playsinline:'1', hl:lang, cc_load_policy:'1', cc_lang_pref:lang, rel:'0'
    });
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    container.append(frame);
    container.hidden = false;
    progress.hidden = false;
    let frontier = 0;
    let lastTime = 0;
    let sampledAt = 0;
    let timer;
    let confirming = false;
    let complete = false;
    const ready = setTimeout(() => showError(new Error('youtube')),12000);

    function update(player) {
      const duration = player.getDuration();
      const time = player.getCurrentTime();
      const now = performance.now();
      if (!duration || !Number.isFinite(time)) return;
      const elapsed = sampledAt ? (now - sampledAt) / 1000 : 0;
      const advance = time - lastTime;
      const rate = Math.min(2,player.getPlaybackRate() || 1);
      if (time > frontier + 0.8 && (lastTime > frontier + .5 || advance > Math.min(elapsed,2) * rate + .55)) {
        player.seekTo(Math.max(0,frontier - .3),true);
        status.textContent = a.skip;
        lastTime = frontier;
      } else {
        frontier = Math.max(frontier,time);
        lastTime = time;
        progress.value = Math.min(100,Math.floor(frontier / duration * 100));
      }
      sampledAt = now;
    }

    async function ended(player) {
      update(player);
      const duration = player.getDuration();
      if (confirming || complete || !duration) return;
      if (frontier < duration - 0.8) {
        player.seekTo(Math.max(0,frontier - .3),true);
        status.textContent = a.skip;
        return;
      }
      confirming = true;
      try {
        const {receipt} = await classRequest('watch-finish',code,{token,duration,videoId:video.id});
        status.textContent = a.done;
        progress.value = 100;
        complete = true;
        try { sessionStorage.setItem(receiptKey,receipt); } catch {}
        unlock(receipt);
      } catch (error) {
        showError(error);
      } finally {
        confirming = false;
      }
    }

    new yt.Player(frame,{
      events:{
        onReady:() => clearTimeout(ready),
        onError:() => { clearTimeout(ready); clearInterval(timer); showError(new Error('youtube')); },
        onStateChange:({data,target}) => {
          clearInterval(timer);
          if (complete) return;
          if (data === yt.PlayerState.PLAYING) {
            sampledAt = performance.now();
            update(target);
            timer = setInterval(() => update(target),250);
          } else if (data === yt.PlayerState.ENDED) {
            ended(target);
          } else if (data === yt.PlayerState.PAUSED) {
            update(target);
          }
        }
      }
    });
  } catch (error) {
    if (error.message === 'closed') container.insertAdjacentHTML('afterend', atlasPlayer(video,lang).replace(' id="video"',''));
    showError(error);
  }
}
