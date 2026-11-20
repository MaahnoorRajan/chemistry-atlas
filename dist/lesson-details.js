const legacyQuizVideo = 'jNfgGh-aL2g';

// Each localized row contains the overview, steps, then two questions.
// For each question the first answer is correct, followed by two distractors.
const lessonDetails = {
  'u3L5_2rOKDU': {
    en:['Red cabbage contains anthocyanins. Water extracts these pigments to make a liquid that changes color with pH.','Have the teacher cover chopped red cabbage with hot water. | Wait for the liquid to turn purple. | Strain out the cabbage and let the liquid cool before using it.',
      'Which part do you keep as the indicator? | The purple liquid | The cabbage pieces | The strainer',
      'What gives the extract its color? | Anthocyanins | Table salt | Air bubbles'],
    ru:['Краснокочанная капуста содержит антоцианы. Вода извлекает эти пигменты, и полученная жидкость меняет цвет в зависимости от pH.','Учитель заливает нарезанную капусту горячей водой. | Подождите, пока вода станет фиолетовой. | Процедите жидкость и дайте ей остыть.',
      'Что используют как индикатор? | Фиолетовую жидкость | Кусочки капусты | Сито',
      'Что окрашивает экстракт? | Антоцианы | Поваренная соль | Пузырьки воздуха'],
    ky:['Кызыл капустада антоциандар бар. Алар сууга өтүп, pH өзгөргөндө түсүн өзгөрткөн эритме пайда болот.','Мугалим тууралган капустага ысык суу куят. | Суу кызгылт көк түскө өзгөргөнчө күтүңүз. | Суюктукту чыпкалап, муздатыңыз.',
      'Индикатор катары эмнени колдонобуз? | Кызгылт көк суюктукту | Капустанын бөлүктөрүн | Чыпканы',
      'Суюктуктун түсүн эмне берет? | Антоциандар | Аш тузу | Аба көбүкчөлөрү']
  },
  '2WIR-1CVG38': {
    en:['Density tells you how much mass is packed into a unit of volume. Measuring both lets you compare samples of different sizes.','Measure the sample’s mass on a balance. | Determine its volume using a method suited to the sample, such as water displacement for an insoluble irregular solid. | Divide mass by volume and write the units, such as g/mL.',
      'How do you calculate density? | Mass divided by volume | Volume divided by mass | Mass times volume',
      'A sample weighs 24 g and occupies 8 mL. What is its density? | 3 g/mL | 8 g/mL | 192 g/mL'],
    ru:['Плотность показывает массу вещества в единице объёма. По массе и объёму можно сравнивать образцы разных размеров.','Взвесьте образец. | Определите объём подходящим способом, например вытеснением воды для нерастворимого тела неправильной формы. | Разделите массу на объём и запишите единицы, например г/мл.',
      'Как находят плотность? | Массу делят на объём | Объём делят на массу | Массу умножают на объём',
      'Масса образца 24 г, объём 8 мл. Какова плотность? | 3 г/мл | 8 г/мл | 192 г/мл'],
    ky:['Тыгыздык көлөмдүн бирдигине канча масса туура келерин көрсөтөт. Бул чоңдук ар кандай өлчөмдөгү үлгүлөрдү салыштырууга жардам берет.','Үлгүнүн массасын тараза менен өлчөңүз. | Көлөмдү ылайыктуу ыкма менен табыңыз, мисалы сууда эрибеген нерсе сүрүп чыгарган суунун көлөмү аркылуу. | Массаны көлөмгө бөлүп, бирдигин жазыңыз, мисалы г/мл.',
      'Тыгыздык кантип эсептелет? | Масса көлөмгө бөлүнөт | Көлөм массага бөлүнөт | Масса көлөмгө көбөйтүлөт',
      'Үлгүнүн массасы 24 г, көлөмү 8 мл. Тыгыздыгы канча? | 3 г/мл | 8 г/мл | 192 г/мл']
  },
  '-Csx5DNtE84': {
    en:['Water curves slightly where it meets a graduated cylinder. Reading that curve at eye level makes the volume measurement more reliable.','Set a graduated cylinder on a level surface. | Bring your eyes level with the curved water surface, called the meniscus. | Read the scale at the bottom of the curve and record the volume in mL.',
      'Where do you read a water meniscus? | At the bottom of the curve | At the top of the curve | At the rim of the cylinder',
      'Why read the scale at eye level? | To avoid an angle-dependent reading error | To make water less dense | To flatten the water surface'],
    ru:['В мерном цилиндре поверхность воды немного изгибается. Отсчёт на уровне глаз уменьшает ошибку измерения объёма.','Поставьте цилиндр на ровную поверхность. | Расположите глаза на уровне мениска. | Снимите показание у нижней точки изгиба и запишите объём в мл.',
      'Где считывают мениск воды? | В нижней точке изгиба | В верхней точке изгиба | У края цилиндра',
      'Зачем смотреть на шкалу на уровне глаз? | Чтобы избежать ошибки из-за угла взгляда | Чтобы уменьшить плотность воды | Чтобы выровнять поверхность воды'],
    ky:['Өлчөөчү цилиндрдеги суунун бети бир аз ийилет. Аны көз деңгээлинде окуу көлөмдү так өлчөөгө жардам берет.','Цилиндрди тегиз жерге коюңуз. | Көзүңүздү мениск деп аталган ийри беттин деңгээлине келтириңиз. | Ийри сызыктын төмөнкү чекитинен көрсөткүчтү окуп, көлөмдү мл менен жазыңыз.',
      'Суунун менискин кайсы жерден окуйбуз? | Ийри сызыктын төмөнкү чекитинен | Ийри сызыктын жогорку чекитинен | Цилиндрдин четинен',
      'Шкала эмне үчүн көз деңгээлинде окулат? | Кыйгач карагандагы катаны азайтуу үчүн | Суунун тыгыздыгын азайтуу үчүн | Суунун бетин тегиздөө үчүн']
  },
  '6z9fqGlLT64': {
    en:['Gravity filtration separates an insoluble solid from a liquid. Try the method with sand and water. The liquid collected below the filter is called the filtrate.','Place folded filter paper in a funnel above a clean container. | Stir a sand-and-water mixture and pour it gently into the funnel, below the edge of the paper. | Let the water drain. Compare the sand left in the paper with the liquid collected below.',
      'What stays on the filter paper in this example? | Sand | Dissolved salt | All the water',
      'What is the name for the liquid that passes through the filter? | Filtrate | Residue | Precipitate'],
    ru:['Фильтрование под действием силы тяжести отделяет нерастворимое твёрдое вещество от жидкости. Для примера возьмите песок и воду. Жидкость под фильтром называется фильтратом.','Вложите сложенный бумажный фильтр в воронку над чистой ёмкостью. | Перемешайте песок с водой и осторожно налейте смесь ниже края бумаги. | Дождитесь стекания воды. Сравните песок на фильтре с собранной жидкостью.',
      'Что остаётся на фильтре в этом примере? | Песок | Растворённая соль | Вся вода',
      'Как называется жидкость, прошедшая через фильтр? | Фильтрат | Остаток | Осадок'],
    ky:['Гравитациялык чыпкалоо эрибеген катуу затты суюктуктан бөлөт. Мисал катары кум менен сууну колдонуңуз. Чыпкадан өткөн суюктук фильтрат деп аталат.','Бүктөлгөн чыпка кагазын таза идиштин үстүндөгү воронкага салыңыз. | Кум менен сууну аралаштырып, кагаздын четинен ашырбай акырын куюңуз. | Суунун агып бүтүшүн күтүңүз. Кагазда калган кумду жана идиштеги суюктукту салыштырыңыз.',
      'Бул мисалда чыпка кагазында эмне калат? | Кум | Эриген туз | Бардык суу',
      'Чыпкадан өткөн суюктук кандай аталат? | Фильтрат | Калдык | Чөкмө']
  },
  '3LLPN-f19lc': {
    en:['Crystals form when dissolved particles arrange themselves in a repeating pattern. A salt solution left to evaporate is a simple classroom example.','Dissolve table salt in water until no more dissolves, then transfer a little clear solution to a shallow dish. | Leave the dish undisturbed as the water slowly evaporates. | Observe the remaining crystals and record their shape.',
      'What leaves the dish during evaporation? | Water | Solid salt crystals | The dish itself',
      'What arrangement gives a crystal its shape? | A repeating pattern of particles | Completely random particles | A hollow shell of air'],
    ru:['Кристаллы образуются, когда растворённые частицы выстраиваются в повторяющийся узор. Пример для класса — испарение солевого раствора.','Добавляйте соль в воду, пока она не перестанет растворяться. Перелейте немного прозрачного раствора в блюдце. | Оставьте блюдце в покое, пока вода испаряется. | Рассмотрите оставшиеся кристаллы и запишите их форму.',
      'Что покидает блюдце при испарении? | Вода | Твёрдые кристаллы соли | Само блюдце',
      'Что определяет форму кристалла? | Повторяющееся расположение частиц | Полностью случайное расположение | Пустая оболочка из воздуха'],
    ky:['Эриген бөлүкчөлөр кайталанган тартипте жайгашканда кристалл пайда болот. Муну туздуу суунун бууланышы аркылуу байкоого болот.','Туз эрибей калганча сууга кошуңуз. Тунук эритмеден бир азын жалпак идишке куюңуз. | Суу бууланганча идишти кыймылдатпай коюңуз. | Калган кристаллдарды карап, формасын жазыңыз.',
      'Бууланганда идиштен эмне кетет? | Суу | Катуу туз кристаллдары | Идиштин өзү',
      'Кристаллдын формасын эмне аныктайт? | Бөлүкчөлөрдүн кайталанган тартиби | Бөлүкчөлөрдүн туш келди жайгашуусу | Абага толгон көңдөй кабык']
  },
  '4TlaSEUIjuA': {
    en:['The Bohr model places electrons at specific energy levels around the nucleus. Use the diagram to follow how the model represents an electron changing levels.','Find the nucleus at the center of the diagram. | Compare the energy levels shown around it. | Trace what happens when an electron gains energy and moves to a higher level.',
      'Where is the nucleus in the model? | At the center | On the outermost level | Between two levels',
      'What must an electron gain to jump to a higher level? | Energy | A proton | A neutron'],
    ru:['Модель Бора показывает электроны на определённых энергетических уровнях вокруг ядра. По схеме проследите переход между уровнями.','Найдите ядро в центре. | Сравните уровни вокруг ядра. | Проследите, как электрон получает энергию и переходит на более высокий уровень.',
      'Где находится ядро? | В центре | На внешнем уровне | Между двумя уровнями',
      'Что должен получить электрон для перехода выше? | Энергию | Протон | Нейтрон'],
    ky:['Бордун модели электрондорду ядронун айланасындагы белгилүү энергия деңгээлдеринде көрсөтөт. Электрон деңгээлди кантип өзгөртөрүн схема аркылуу караңыз.','Борбордон ядрону табыңыз. | Ядронун айланасындагы деңгээлдерди салыштырыңыз. | Электрон энергия алып, жогорку деңгээлге кантип өтөрүн байкаңыз.',
      'Ядро моделдин кайсы жеринде? | Борборунда | Эң сырткы деңгээлде | Эки деңгээлдин ортосунда',
      'Жогорку деңгээлге өтүү үчүн электрон эмне алышы керек? | Энергия | Протон | Нейтрон']
  },
  '2p5KJWW-hrw': {
    en:['A chemical reaction rearranges atoms to form new substances. Look for changes in the video and connect them to the starting substances and products.','List the substances present before the reaction. | Record an observation, such as a color change, a solid forming, or gas bubbles. | Identify the products shown and distinguish them from the reactants.',
      'What are substances present before a reaction called? | Reactants | Products | Filtrates',
      'What happens to atoms during a chemical reaction? | They are rearranged | They all vanish | They all become the same element'],
    ru:['В химической реакции атомы перегруппировываются, образуя новые вещества. Свяжите наблюдения в видео с исходными веществами и продуктами.','Перечислите вещества до реакции. | Запишите наблюдение, например изменение цвета, образование осадка или пузырьков газа. | Назовите показанные продукты и отличите их от реагентов.',
      'Как называются исходные вещества реакции? | Реагенты | Продукты | Фильтраты',
      'Что происходит с атомами при реакции? | Они перегруппировываются | Они исчезают | Все становятся одним элементом'],
    ky:['Химиялык реакцияда атомдор кайра иреттелип, жаңы заттар пайда болот. Видеодогу өзгөрүүлөрдү баштапкы заттар жана продуктулар менен байланыштырыңыз.','Реакцияга чейинки заттарды жазыңыз. | Түстүн өзгөрүшүн, чөкмөнү же газ көбүкчөлөрүн байкасаңыз, белгилеңиз. | Пайда болгон продуктуларды баштапкы заттардан айырмалаңыз.',
      'Реакцияга чейинки заттар кандай аталат? | Реагенттер | Продуктулар | Фильтраттар',
      'Реакцияда атомдор эмне болот? | Кайра иреттелет | Баары жок болот | Баары бир элементке айланат']
  },
  'Ihje16_R00U': {
    en:['The ideal gas law, PV = nRT, connects pressure, volume, temperature, and amount of gas. It helps predict how a gas responds when one condition changes.','Identify P, V, n, and T in the example. | Convert any temperature in degrees Celsius to kelvin. | Hold the stated conditions constant and use the equation to predict or calculate the unknown quantity.',
      'What temperature scale is used in PV = nRT? | Kelvin | Celsius | Fahrenheit',
      'At constant temperature and amount, what happens to pressure if volume doubles? | It halves | It doubles | It stays unchanged'],
    ru:['Уравнение PV = nRT связывает давление, объём, температуру и количество газа. Оно позволяет предсказывать изменения при изменении условий.','Определите P, V, n и T в примере. | Переведите температуру из градусов Цельсия в кельвины. | При заданных постоянных величинах найдите неизвестную по уравнению.',
      'В какой шкале берут температуру в PV = nRT? | Кельвина | Цельсия | Фаренгейта',
      'При постоянной температуре и количестве газа объём удвоили. Что с давлением? | Уменьшится вдвое | Удвоится | Не изменится'],
    ky:['PV = nRT теңдемеси газдын басымын, көлөмүн, температурасын жана заттын санын байланыштырат. Ал шарт өзгөргөндө эмне болорун алдын ала айтууга жардам берет.','Мисалдан P, V, n жана T чоңдуктарын табыңыз. | Цельсийдеги температураны кельвинге которуңуз. | Берилген шарттар туруктуу болгондо, теңдеме менен белгисиз чоңдукту табыңыз.',
      'PV = nRT теңдемесинде температура кайсы шкалада берилет? | Кельвин | Цельсий | Фаренгейт',
      'Температура жана газдын саны туруктуу. Көлөм эки эселенсе, басым эмне болот? | Эки эсе азаят | Эки эселенет | Өзгөрбөйт']
  },
  'o-nizzfTLhw': {
    en:['A visible spectrum shows how light intensity changes with wavelength. A spectrometer turns this into a graph so you can compare bright and dim regions.','Watch how the instructor positions the light source and records the spectrum. | Find wavelength on the horizontal axis and intensity on the vertical axis. | Locate the tallest peak and read its wavelength.',
      'What does the horizontal axis show? | Wavelength | Sample mass | Temperature',
      'What does the tallest peak represent? | The strongest measured intensity | The shortest wavelength in every spectrum | The total mass of the light source'],
    ru:['Видимый спектр показывает, как интенсивность света зависит от длины волны. Спектрометр строит график для сравнения участков спектра.','Проследите, как преподаватель устанавливает источник и записывает спектр. | Найдите длину волны по горизонтали и интенсивность по вертикали. | Определите длину волны самого высокого пика.',
      'Что показывает горизонтальная ось? | Длину волны | Массу образца | Температуру',
      'Что означает самый высокий пик? | Наибольшую измеренную интенсивность | Самую короткую волну в любом спектре | Общую массу источника света'],
    ky:['Көрүнүүчү спектр жарыктын күчү толкун узундугуна жараша кантип өзгөрөрүн көрсөтөт. Спектрометр бул өзгөрүүнү графикке чыгарат.','Мугалим жарык булагын коюп, спектрди кантип жазарын көрүңүз. | Туурасынан толкун узундугун, тигинен интенсивдүүлүктү табыңыз. | Эң бийик чокунун толкун узундугун окуңуз.',
      'Туурасынан кеткен ок эмнени көрсөтөт? | Толкун узундугун | Үлгүнүн массасын | Температураны',
      'Эң бийик чоку эмнени билдирет? | Өлчөнгөн эң жогорку интенсивдүүлүктү | Бардык спектрлердеги эң кыска толкунду | Жарык булагынын жалпы массасын']
  }
};
Object.assign(lessonDetails, {
  'PQVxycMraAk': {
    en:['Bond polarity comes from unequal sharing of electrons. The atom that attracts electrons more strongly carries a partial negative charge.','Identify the two bonded atoms. | Compare their electronegativities. | Mark the more electronegative atom δ− and the other δ+ if the bond is polar.',
      'Which atom in a polar bond is partially negative? | The more electronegative one | The less electronegative one | Neither atom',
      'Why is the bond in Cl₂ nonpolar? | Both atoms attract electrons equally | Chlorine has no electrons | The atoms have opposite full charges'],
    ru:['Полярность связи возникает при неравномерном распределении электронов. Атом, который притягивает электроны сильнее, получает частичный отрицательный заряд.','Определите два связанных атома. | Сравните их электроотрицательности. | Для полярной связи отметьте более электроотрицательный атом δ−, другой δ+.',
      'Какой атом в полярной связи имеет частичный отрицательный заряд? | Более электроотрицательный | Менее электроотрицательный | Ни один',
      'Почему связь в Cl₂ неполярна? | Оба атома одинаково притягивают электроны | У хлора нет электронов | Атомы имеют противоположные полные заряды'],
    ky:['Байланыш электрондор тең эмес бөлүштүрүлгөндө уюлдуу болот. Электрондорду күчтүүрөөк тарткан атом жарым-жартылай терс заряд алат.','Байланышкан эки атомду аныктаңыз. | Электртерстүүлүгүн салыштырыңыз. | Уюлдуу байланышта электртерстүүлүгү жогору атомду δ−, экинчисин δ+ деп белгилеңиз.',
      'Уюлдуу байланышта кайсы атом жарым-жартылай терс заряддуу? | Электртерстүүлүгү жогору атом | Электртерстүүлүгү төмөн атом | Эч бири',
      'Cl₂ байланышы эмне үчүн уюлсуз? | Эки атом электрондорду бирдей тартат | Хлордо электрон жок | Атомдордун толук заряддары карама-каршы']
  },
  '80HpbSjD-ZU': {
    en:['A molecule’s polarity depends on both its bonds and its shape. Polar bonds can cancel in a symmetric molecule.','Draw the shape of the molecule. | Mark the direction of each bond dipole. | Decide whether the dipoles cancel. Compare bent H₂O with linear CO₂.',
      'Why is linear CO₂ nonpolar overall? | Its two bond dipoles cancel | Its bonds contain no electrons | Its bonds are both nonpolar',
      'Which shape helps make H₂O polar? | Bent | Linear | A straight line of four atoms'],
    ru:['Полярность молекулы зависит от связей и формы. В симметричной молекуле диполи полярных связей могут компенсироваться.','Нарисуйте форму молекулы. | Отметьте направление диполя каждой связи. | Проверьте, компенсируются ли диполи. Сравните угловую H₂O с линейной CO₂.',
      'Почему линейная CO₂ в целом неполярна? | Диполи двух связей компенсируются | В связях нет электронов | Обе связи неполярны',
      'Какая форма способствует полярности H₂O? | Угловая | Линейная | Прямая цепочка из четырёх атомов'],
    ky:['Молекуланын уюлдуулугу байланыштарга жана формага көз каранды. Симметриялуу молекулада байланыштардын диполдору бири-бирин жокко чыгарышы мүмкүн.','Молекуланын формасын чийиңиз. | Ар бир байланыштын диполунун багытын белгилеңиз. | Алар бири-бирин жокко чыгарабы, текшериңиз. Ийилген H₂O менен түз CO₂ни салыштырыңыз.',
      'Түз CO₂ эмне үчүн жалпысынан уюлсуз? | Эки байланыштын диполдору бири-бирин жокко чыгарат | Байланыштарда электрон жок | Эки байланыш тең уюлсуз',
      'H₂Oнун уюлдуулугуна кайсы форма өбөлгө түзөт? | Ийилген | Түз | Төрт атомдон турган түз чынжыр']
  },
  'UALzuFMjAxE': {
    en:['Solubility is how much of a substance can dissolve in a given amount of solvent at a specified temperature. A saturated solution has reached that limit.','Add small portions of table salt to water at room temperature, stirring each time. | Wait after each addition and note whether the salt fully dissolves. | When solid remains even after stirring and waiting, record that the liquid is saturated.',
      'In salt water, what is the solvent? | Water | Salt | The container',
      'What does solid salt remaining after stirring suggest? | The solution is saturated | The water has become a gas | The salt has all dissolved'],
    ru:['Растворимость показывает, сколько вещества растворяется в заданном количестве растворителя при определённой температуре. Насыщенный раствор достиг этого предела.','Добавляйте соль небольшими порциями в воду комнатной температуры, перемешивая. | После каждой порции подождите и проверьте, растворилась ли соль. | Если после перемешивания и ожидания соль остаётся, отметьте, что раствор насыщен.',
      'Что служит растворителем в солёной воде? | Вода | Соль | Ёмкость',
      'Что означает соль, оставшаяся после перемешивания? | Раствор насыщен | Вода превратилась в газ | Вся соль растворилась'],
    ky:['Эригичтик белгилүү температурада белгилүү өлчөмдөгү эриткичте канча зат эрий турганын көрсөтөт. Каныккан эритме бул чекке жеткен болот.','Бөлмө температурасындагы сууга тузду аз-аздан кошуп, аралаштырыңыз. | Ар бир кошкондон кийин күтүп, туз толук эригенин текшериңиз. | Аралаштырып күткөндөн кийин туз калса, эритме каныкканын белгилеңиз.',
      'Туздуу сууда эриткич эмне? | Суу | Туз | Идиш',
      'Аралаштыргандан кийин туз калса, бул эмнени билдирет? | Эритме каныккан | Суу газга айланган | Туз толук эриген']
  },
  'm6y6kDwRMfg': {
    en:['Soap helps water carry away oil. One part of a soap molecule interacts with water while another part associates with grease.','Compare oil and water after mixing and letting them settle. | In a separate cup, repeat with a drop of liquid soap. | Compare the size and persistence of oil droplets in the two cups.',
      'Which parts of a soap molecule help remove oil? | Its water-friendly head and oil-friendly tail | Two identical water-only ends | A metal core and a gas shell',
      'Why compare with a cup that has no soap? | To see the effect of adding soap | To measure the room temperature | To change the kind of oil'],
    ru:['Мыло помогает воде смывать жир. Одна часть молекулы взаимодействует с водой, другая — с жиром.','Смешайте масло и воду и дайте смеси отстояться. | В отдельном стакане повторите с каплей жидкого мыла. | Сравните размер и устойчивость капель масла в обоих стаканах.',
      'Какие части молекулы мыла помогают удалять жир? | Головка, взаимодействующая с водой, и хвост, взаимодействующий с жиром | Два одинаковых конца, взаимодействующих только с водой | Металлическое ядро и газовая оболочка',
      'Зачем нужен стакан без мыла? | Чтобы увидеть эффект добавления мыла | Чтобы измерить температуру комнаты | Чтобы изменить вид масла'],
    ky:['Самын суунун майды кетиришине жардам берет. Молекуланын бир бөлүгү суу менен, экинчиси май менен аракеттенет.','Май менен сууну аралаштырып, тынч коюңуз. | Башка стаканда бир тамчы суюк самын кошуп кайталаңыз. | Эки стакандагы май тамчыларынын өлчөмүн жана канча убакыт сакталарын салыштырыңыз.',
      'Самындын кайсы бөлүктөрү майды кетирүүгө жардам берет? | Суу менен аракеттенген башы жана май менен аракеттенген куйругу | Суу менен гана аракеттенген эки бирдей учу | Металл өзөк жана газ кабыгы',
      'Самынсыз стакан эмне үчүн керек? | Самын кошуунун таасирин көрүү үчүн | Бөлмөнүн температурасын өлчөө үчүн | Майдын түрүн өзгөртүү үчүн']
  },
  'y0RGTbexhps': {
    en:['Line-angle drawings are a compact way to represent organic molecules. Unlabeled corners and line ends stand for carbon atoms, and many hydrogens are left implicit.','Trace the carbon skeleton by counting unlabeled corners and ends. | Mark any other atoms that are written explicitly. | At each carbon, count bonds and infer the hydrogens needed to complete four bonds in total.',
      'What does an unlabeled corner usually represent? | A carbon atom | An oxygen atom | An empty space',
      'How many total bonds should a typical neutral carbon have? | Four | Two | Six'],
    ru:['Скелетные формулы компактно изображают органические молекулы. Необозначенные углы и концы линий — атомы углерода, многие атомы водорода подразумеваются.','Проследите углеродный скелет, считая необозначенные углы и концы линий. | Отметьте другие явно записанные атомы. | У каждого углерода посчитайте связи и добавьте подразумеваемые атомы водорода до четырёх связей.',
      'Что обычно означает необозначенный угол? | Атом углерода | Атом кислорода | Пустое место',
      'Сколько связей обычно образует нейтральный углерод? | Четыре | Две | Шесть'],
    ky:['Скелеттик формула органикалык молекуланы кыскача көрсөтөт. Белгиси жок бурчтар жана сызыктын учтары көмүртекти билдирет, суутек көп учурда жазылбайт.','Белгисиз бурчтарды жана учтарды санап, көмүртек каркасын табыңыз. | Өзүнчө жазылган башка атомдорду белгилеңиз. | Ар бир көмүртектин байланыштарын санап, төрт байланыш болушу үчүн канча суутек керектигин аныктаңыз.',
      'Белгиси жок бурч адатта эмнени билдирет? | Көмүртек атомун | Кычкылтек атомун | Бош жерди',
      'Нейтралдуу көмүртекте адатта канча байланыш болот? | Төрт | Эки | Алты']
  },
  'DpiuQJSL-XE': {
    en:['Stoichiometry uses the coefficients of a balanced equation to connect the amounts of reactants and products. The coefficients give mole ratios.','Check that the equation is balanced. | Convert the given amount to moles when needed. | Multiply by the mole ratio from the coefficients, then convert to the units requested.',
      'Where does the mole ratio come from? | The coefficients of the balanced equation | The colors of the substances | The temperature scale',
      'In 2H₂ + O₂ → 2H₂O, how many moles of H₂O can form from 2 mol H₂ with excess O₂? | 2 mol | 1 mol | 4 mol'],
    ru:['Стехиометрия связывает количества реагентов и продуктов через коэффициенты уравненной реакции. Коэффициенты задают мольные соотношения.','Убедитесь, что уравнение уравнено. | При необходимости переведите данное количество в моли. | Умножьте на мольное отношение из коэффициентов и переведите результат в нужные единицы.',
      'Откуда берётся мольное соотношение? | Из коэффициентов уравненной реакции | Из цвета веществ | Из температурной шкалы',
      'В 2H₂ + O₂ → 2H₂O сколько воды получится из 2 моль H₂ при избытке O₂? | 2 моль | 1 моль | 4 моль'],
    ky:['Стехиометрия теңделген реакциянын коэффициенттери аркылуу реагенттер менен продуктулардын санын байланыштырат. Коэффициенттер молдук катышты берет.','Теңдеме теңделгенин текшериңиз. | Зарыл болсо, берилген өлчөмдү молго которуңуз. | Коэффициенттерден алынган молдук катышка көбөйтүп, керектүү бирдикке которуңуз.',
      'Молдук катыш кайдан алынат? | Теңделген теңдеменин коэффициенттеринен | Заттардын түсүнөн | Температура шкаласынан',
      '2H₂ + O₂ → 2H₂O теңдемесинде O₂ ашык болсо, 2 моль H₂ден канча суу чыгат? | 2 моль | 1 моль | 4 моль']
  },
  'nLrr2NV_ocs': {
    en:['A chemical equation is shorthand for a reaction. The arrow separates the starting substances from the products, and coefficients tell you how many units of each are involved.','Read the reactants on the left and products on the right. | Count the atoms of each element, multiplying subscripts by coefficients. | Compare both sides and explain whether the equation is balanced.',
      'Where are the products written? | To the right of the arrow | To the left of the arrow | In the subscripts only',
      'What can you change when balancing an equation without changing the substances? | Coefficients | Subscripts in chemical formulas | Element symbols'],
    ru:['Химическое уравнение кратко описывает реакцию. Стрелка отделяет реагенты от продуктов, а коэффициенты показывают относительное число частиц.','Прочитайте реагенты слева и продукты справа. | Посчитайте атомы каждого элемента, умножая индексы на коэффициенты. | Сравните обе стороны и объясните, уравнена ли реакция.',
      'Где записаны продукты? | Справа от стрелки | Слева от стрелки | Только в индексах',
      'Что можно менять при уравнивании реакции без замены веществ? | Коэффициенты | Индексы в формулах | Символы элементов'],
    ky:['Химиялык теңдеме реакцияны кыскача көрсөтөт. Жебе реагенттерди продуктулардан бөлөт, коэффициенттер алардын катышын көрсөтөт.','Сол жактагы реагенттерди, оң жактагы продуктуларды окуңуз. | Индексти коэффициентке көбөйтүп, ар бир элементтин атомдорун санаңыз. | Эки тарапты салыштырып, теңдеме теңделгенин түшүндүрүңүз.',
      'Продуктулар кайда жазылат? | Жебенин оң жагында | Жебенин сол жагында | Индекстерде гана',
      'Заттарды өзгөртпөй теңдөө үчүн эмнени өзгөртүүгө болот? | Коэффициенттерди | Формулалардагы индекстерди | Элементтердин белгилерин']
  },
  'j1oEp-X6VGI': {
    en:['Percent yield compares how much product you collected with the maximum predicted by the balanced equation. It is a way to quantify losses during a reaction or collection.','Identify the actual amount collected. | Calculate the theoretical amount from the limiting reactant, in the same units. | Divide actual by theoretical yield and multiply by 100.',
      'What is the formula for percent yield? | Actual ÷ theoretical × 100 | Theoretical ÷ actual × 100 | Actual + theoretical',
      'You collect 8 g from a theoretical 10 g. What is the percent yield? | 80% | 125% | 2%'],
    ru:['Процентный выход сравнивает собранное количество продукта с расчётным максимумом. Он помогает оценить потери в реакции и при выделении продукта.','Определите фактически собранное количество. | Рассчитайте теоретический выход по лимитирующему реагенту в тех же единицах. | Разделите фактический выход на теоретический и умножьте на 100.',
      'Какова формула процентного выхода? | Фактический ÷ теоретический × 100 | Теоретический ÷ фактический × 100 | Фактический + теоретический',
      'Получили 8 г при теоретических 10 г. Каков процентный выход? | 80% | 125% | 2%'],
    ky:['Пайыздык чыгыш алынган продуктуну эсептелген эң жогорку өлчөм менен салыштырат. Ал реакцияда же чогултууда канча продукт жоголгонун баалоого жардам берет.','Чынында алынган продуктунун өлчөмүн табыңыз. | Чектөөчү реагент боюнча теориялык өлчөмдү ошол эле бирдикте эсептеңиз. | Чыныгы өлчөмдү теориялык өлчөмгө бөлүп, 100гө көбөйтүңүз.',
      'Пайыздык чыгыштын формуласы кандай? | Чыныгы ÷ теориялык × 100 | Теориялык ÷ чыныгы × 100 | Чыныгы + теориялык',
      'Теориялык 10 г ордуна 8 г алынды. Пайыздык чыгыш канча? | 80% | 125% | 2%']
  }
});

function questionsFor(videoId, lang) {
  const sheet = labSheets[videoId]?.[lang];
  if (!sheet) return [];
  const legacy = videoId === legacyQuizVideo;
  const original = legacy ? copy[lang].questions : [];
  const lines = legacy ? sheet.slice(4) : [...lessonDetails[videoId][lang].slice(2), ...sheet.slice(4)];
  const offset = Object.keys(lessonDetails).indexOf(videoId);
  return [...original,...lines.map((line,i) => {
    const [title,correct,...options] = line.split(' | ');
    const key = legacy ? 2 : (offset + i) % 3;
    options.splice(key,0,correct);
    return [title,options,key,''];
  })];
}
