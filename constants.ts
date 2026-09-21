import { Course, Machine, UserCourse, Module, Student, SEOMetadata, Language } from './types';

// Helper function for image paths - works both locally and on GitHub Pages
const getImagePath = (filename: string) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${filename}`.replace('//', '/');
};

export const TRANSLATIONS = {
  PL: {
    nav: {
      home: 'Start',
      catalog: 'Szkolenia',
      rentals: 'Wynajem',
      contact: 'Kontakt',
      admin: 'Panel Managera',
      lms: 'Strefa Kursanta'
    },
    hero: {
      badge: 'Nowe terminy szkoleń 2026',
      title: 'Zdobądź uprawnienia operatora',
      subtitle: 'online i stacjonarnie',
      desc: 'Kompleksowe kursy UDT z dostępem do teorii w e-learningu. Praktyka na nowoczesnym sprzęcie.',
      cta1: 'Przeglądaj szkolenia',
      cta2: 'Usługi serwisowe'
    }
  },
  EN: {
    nav: {
      home: 'Home',
      catalog: 'Courses',
      rentals: 'Rentals',
      contact: 'Contact',
      admin: 'Manager Panel',
      lms: 'Student Zone'
    },
    hero: {
      badge: 'New training dates 2026',
      title: 'Get operator certification',
      subtitle: 'online and on-site',
      desc: 'Comprehensive UDT courses with e-learning theory access. Practice on modern equipment.',
      cta1: 'Browse Courses',
      cta2: 'Service & Repairs'
    }
  },
  UA: {
    nav: {
      home: 'Головна',
      catalog: 'Навчання',
      rentals: 'Оренда',
      contact: 'Контакти',
      admin: 'Панель менеджера',
      lms: 'Зона курсанта'
    },
    hero: {
      badge: 'Нові терміни навчання 2026',
      title: 'Отримайте посвідчення оператора',
      subtitle: 'онлайн та очно',
      desc: 'Комплексні курси UDT з доступом до теорії в e-learning. Практика на сучасному обладнанні.',
      cta1: 'Переглянути навчання',
      cta2: 'Сервісні послуги'
    }
  }
};

// SEO Structure for Telescopic Loader (Ładowarki)
export const SEO_DATA: Record<Language, SEOMetadata> = {
  PL: {
    title: 'Kurs na Ładowarki Teleskopowe UDT (I WJO) | MultiSerwis Kutno',
    description: 'Zrób uprawnienia na ładowarki teleskopowe w Kutnie. Teoria online, egzamin państwowy UDT. Najwyższa zdawalność w regionie.',
    keywords: 'kurs ładowarki teleskopowe, szkolenia udt kutno, uprawnienia na ładowarki, operator ładowarki cena',
    ogTitle: 'Zdobądź uprawnienia na Ładowarki Teleskopowe - Szybko i Skutecznie',
    ogDescription: 'Szkolenie hybrydowe: teoria w domu, praktyka na placu. Zapisz się już dziś!'
  },
  EN: {
    title: 'Telescopic Handler Training UDT (I WJO) | MultiSerwis Poland',
    description: 'Get certified for telescopic loaders in Kutno, Poland. Online theory, UDT state exam. Highest pass rate in the region.',
    keywords: 'telescopic handler training, udt poland, loader certification, heavy machinery course',
    ogTitle: 'Get your Telescopic Loader License - Fast & Effective',
    ogDescription: 'Hybrid training: theory at home, practice on site. Sign up today!'
  },
  UA: {
    title: 'Курс на телескопічні навантажувачі UDT (I WJO) | MultiSerwis Кутно',
    description: 'Отримайте посвідчення на телескопічні навантажувачі в Кутно. Теорія онлайн, державний іспит UDT. Найвища прохідність у регіоні.',
    keywords: 'курс телескопічні навантажувачі, навчання udt польща, посвідчення навантажувача, оператор навантажувача ціна',
    ogTitle: 'Отримайте посвідчення на телескопічні навантажувачі - швидко і ефективно',
    ogDescription: 'Гібридне навчання: теорія вдома, практика на майданчику. Записуйтесь сьогодні!'
  }
};

export const COURSES: Course[] = [
  {
    id: 'c1',
    slug: 'wozki-widlowe',
    title: 'Operator Wózków Widłowych (UDT)',
    category: 'UDT',
    duration: '35h',
    price: '1 000 PLN',
    image: getImagePath('operator-wozki-widlowe.webp'),
    isPopular: true,
    hasOnline: true,
    hasStationary: true,
    description: "Kompleksowy kurs na wózki jezdniowe podnośnikowe z napędem silnikowym. Teoria online w LMS, praktyka w Kutnie. Uprawnienia UDT ważne 10 lat. Egzamin państwowy do 30 dni roboczych."
  },
  {
    id: 'c2',
    slug: 'ladowarki-teleskopowe',
    title: 'Ładowarki Teleskopowe i Wózki z Podnoszoną Kabiną',
    category: 'UDT',
    duration: '40h',
    price: '1 500 PLN',
    image: getImagePath('ladowarki-teleskopowe.webp'),
    isPopular: true,
    hasOnline: true,
    hasStationary: true,
    description: "Uprawnienia na wózki ze zmiennym wysięgiem oraz z osobą obsługującą podnoszoną wraz z ładunkiem. Najwyższa kategoria UDT. Uprawnienia ważne 5 lat."
  },
  {
    id: 'c3',
    slug: 'koparko-ladowarki',
    title: 'Koparko-Ładowarki (Kl. III)',
    category: 'IMBiGS',
    duration: '60h',
    price: '2 350 PLN',
    image: getImagePath('koparki.webp'),
    isPopular: true,
    hasOnline: true,
    hasStationary: true,
    description: "Obsługa maszyn do robót ziemnych wszystkich typów. Certyfikacja Sieć Badawcza Łukasiewicz – Warszawski Instytut Technologiczny (ŚBŁ-WIT). Książka operatora."
  },
  {
    id: 'c4',
    slug: 'suwnice',
    title: 'Suwnice, Wciągniki i Wciągarki',
    category: 'UDT',
    duration: '24h',
    price: '1 130 PLN',
    image: getImagePath('suwnice-wciagniki.webp'),
    hasOnline: true,
    hasStationary: true,
    description: "Obsługa suwnic sterowanych z poziomu roboczego (radiowo/przewodowo) oraz z kabiny. Szkolenie ogólnego przeznaczenia (1130 zł, 10 lat) lub specjalnego (1380 zł, 5 lat)."
  },
  {
    id: 'c5',
    slug: 'podesty-ruchome',
    title: 'Podesty Ruchome Przejezdne - Zwyżki (UDT)',
    category: 'UDT',
    duration: '24h',
    price: '1 130 PLN',
    image: getImagePath('genie-z-4525j.webp'),
    hasOnline: true,
    hasStationary: true,
    description: "Szkolenie na podesty nożycowe, przegubowe i teleskopowe do prac na wysokościach. Egzamin UDT do 30 dni roboczych. Uprawnienia ważne 5 lat."
  },
  {
    id: 'c6',
    slug: 'zurawie',
    title: 'Żurawie Przenośne HDS i Samojezdne',
    category: 'UDT',
    duration: '35h',
    price: '1 130 PLN',
    image: getImagePath('serwis-i-koserwacja.webp'),
    hasOnline: true,
    hasStationary: true,
    description: "Uprawnienia UDT na żurawie przewoźne i przenośne HDS (1130 zł, 10 lat), stacjonarne (1080 zł) oraz samojezdne i wieżowe (2480 zł, 5 lat)."
  },
  {
    id: 'c7',
    slug: 'sep-g1',
    title: 'Uprawnienia Elektryczne SEP G1 (E + D)',
    category: 'SEP',
    duration: '1 dzień',
    price: '860 PLN',
    image: getImagePath('uprawnienia-energetyczne-g1.webp'),
    hasOnline: true,
    hasStationary: true,
    description: "Kurs i egzamin SEP G1 (eksploatacja 860 zł / dozór 860 zł, zwolnione z VAT). Uprawnienia do i powyżej 1 kV ważne 5 lat."
  },
  {
    id: 'c8',
    slug: 'spawanie',
    title: 'Kurs Spawania (MIG/MAG, TIG, MMA)',
    category: 'Spawalnictwo',
    duration: '32h',
    price: '2 400 PLN',
    image: getImagePath('wynajem-maszyn.webp'),
    hasStationary: true,
    description: "Praktyczny kurs spawalniczy w 3 modułach (pachwiny, doczołowe blach, rury). Stal czarna (od 2400 zł), nierdzewna (2700 zł), aluminium (2900 zł). Norma PN-EN ISO 9606-1, Certyfikat SGS."
  },
  {
    id: 'c9',
    slug: 'koparki-jednonaczyniowe',
    title: 'Koparki Jednonaczyniowe (Kl. III)',
    category: 'IMBiGS',
    duration: '60h',
    price: '2 350 PLN',
    image: getImagePath('koparki.webp'),
    hasStationary: true,
    description: "Uprawnienia operatora koparek do 25 ton masy całkowitej. Egzamin państwowy ŚBŁ-WIT (dawniej IMBiGS), wydanie książki operatora."
  },
  {
    id: 'c10',
    slug: 'walce-drogowe',
    title: 'Walce Drogowe (Kl. II)',
    category: 'IMBiGS',
    duration: '50h',
    price: '2 500 PLN',
    image: getImagePath('koparki.webp'),
    hasStationary: true,
    description: "Obsługa wszystkich typów walców drogowych. Praktyka na placu manewrowym w Kutnie, egzamin państwowy ŚBŁ-WIT."
  },
  {
    id: 'c11',
    slug: 'spycharki',
    title: 'Spycharki (Kl. III)',
    category: 'IMBiGS',
    duration: '50h',
    price: '2 500 PLN',
    image: getImagePath('koparki.webp'),
    hasStationary: true,
    description: "Szkolenie na spycharki do 110 kW mocy silnika. Niwelacja terenu i roboty ziemne. Egzamin państwowy ŚBŁ-WIT."
  },
  {
    id: 'c12',
    slug: 'sep-g2',
    title: 'Uprawnienia Cieplne i Energetyczne SEP G2',
    category: 'SEP',
    duration: '1 dzień',
    price: '860 PLN',
    image: getImagePath('uprawnienia-energetyczne-g1.webp'),
    hasStationary: true,
    description: "Eksploatacja i dozór urządzeń wytwarzających i zużywających ciepło, kotłów, turbin i sieci ciepłowniczych. Uprawnienia na 5 lat."
  },
  {
    id: 'c13',
    slug: 'sep-g3',
    title: 'Uprawnienia Gazowe SEP G3',
    category: 'SEP',
    duration: '1 dzień',
    price: '860 PLN',
    image: getImagePath('uprawnienia-energetyczne-g1.webp'),
    hasStationary: true,
    description: "Obsługa, konserwacja i montaż urządzeń, instalacji i sieci gazowych. Eksploatacja (860 zł) / Dozór (860 zł)."
  },
  {
    id: 'c14',
    slug: 'kontrola-zawiesi',
    title: 'Specjalista ds. Kontroli Zawiesi',
    category: 'Inne',
    duration: '1 dzień',
    price: '600 PLN',
    image: getImagePath('suwnice-wciagniki.webp'),
    hasStationary: true,
    description: "Szkolenie z zakresu okresowej i bieżącej kontroli stanu technicznego zawiesi linowych, pasowych i łańcuchowych."
  },
  {
    id: 'c15',
    slug: 'pilarki-mechaniczne',
    title: 'Operator Pilarek Mechanicznych',
    category: 'Inne',
    duration: '1 dzień',
    price: '550 PLN',
    image: getImagePath('operator-wozki-widlowe.webp'),
    hasStationary: true,
    description: "Bezpieczna obsługa pilarek spalinowych i elektrycznych, techniki ścinki drzew oraz konserwacja łańcucha tnącego."
  }
];

export const MACHINES: Machine[] = [
  {
    id: 'm1',
    name: 'Manitou MRT 2150',
    type: 'Ładowarka Teleskopowa',
    specs: { height: '21m', capacity: '5000kg' },
    image: getImagePath('manitou-mrt-2150.webp'),
  },
  {
    id: 'm2',
    name: 'Genie Z-45/25J',
    type: 'Podnośnik Przegubowy',
    specs: { height: '16m', weight: '6500kg' },
    image: getImagePath('genie-z-4525j.webp'),
  },
  {
    id: 'm3',
    name: 'JCB 3CX',
    type: 'Koparko-ładowarka',
    specs: { weight: '8000kg', capacity: '1.2m³' },
    image: getImagePath('jcb-3cx.webp'),
  }
];

export const MY_COURSES: UserCourse[] = [
  {
    id: 'uc1',
    courseId: 'c1',
    progress: 45,
    status: 'active',
    nextLesson: 'Bezpieczeństwo wymiany butli LPG',
  },
  {
    id: 'uc2',
    courseId: 'c3',
    progress: 100,
    status: 'completed',
    nextLesson: 'Egzamin zakończony',
  }
];

export const COURSE_CURRICULUM: Module[] = [
  // Operator Wózków Widłowych (c1)
  {
    id: 'c1m1',
    courseId: 'c1',
    title: 'Moduł 1: Budowa i Zasady Pracy',
    lessons: [
      { id: 'c1l1', title: 'Wprowadzenie i typy wózków widłowych', duration: '15:00', isCompleted: true, isLocked: false, type: 'video' },
      { id: 'c1l2', title: 'Układ napędowy i mechanizm podnoszenia', duration: '22:30', isCompleted: true, isLocked: false, type: 'video' },
      { id: 'c1l6a', title: 'Przepisy BHP i normy bezpieczeństwa', duration: '8:00', isCompleted: false, isLocked: false, type: 'text' },
      { id: 'c1l7', title: 'Test wiedzy - Moduł 1', duration: '8 pytań', isCompleted: false, isLocked: false, type: 'test', questions: [
        {
          id: 'q1',
          question: 'Jakie bezpieczeństwo jest najważniejsze przy wymianie butli LPG?',
          type: 'single',
          options: ['Bezpieczeństwo elektryczne', 'Bezpieczeństwo mechaniczne', 'Bezpieczeństwo chemiczne', 'Wszystkie wyżej wymienione'],
          correctAnswer: 3,
          explanation: 'Przy wymianie butli LPG wszystkie rodzaje bezpieczeństwa są ważne.'
        },
        {
          id: 'q2',
          question: 'Wybierz wszystkie czynności, które należy wykonać przed rozpoczęciem pracy:',
          type: 'multiple',
          options: ['Sprawdzić hamulce', 'Sprawdzić stan psychiczny operatora', 'Sprawdzić widoczność', 'Sprawdzić opony', 'Zatankować paliwo'],
          correctAnswer: [0, 2, 3],
          explanation: 'Należy sprawdzić hamulce, widoczność i opony. Stan psychiczny i tankowanie nie są częścią rutynowej kontroli przedstartowej.'
        },
        {
          id: 'q3',
          question: 'Opisz procedurę bezpiecznego zatrzymania wózka widłowego:',
          type: 'open',
          explanation: 'Prawidłowa odpowiedź powinna zawierać: redukcję prędkości, płynne hamowanie, obniżenie ładunku do poziomu jazdy i wyłączenie silnika.'
        },
        {
          id: 'q4',
          question: 'Ile wynosi maksymalny kąt nachylenia terenu, na którym można bezpiecznie pracować wózkiem widłowym?',
          type: 'single',
          options: ['5 stopni', '10 stopni', '15 stopni', '20 stopni'],
          correctAnswer: 1,
          explanation: 'Maksymalny bezpieczny kąt nachylenia terenu to około 10 stopni, aby uniknąć przechylenia wózka.'
        }
      ]},
    ]
  },
  {
    id: 'c1m2',
    courseId: 'c1',
    title: 'Moduł 2: Eksploatacja i Dokumentacja',
    lessons: [
      { id: 'c1l4', title: 'Czynności przed rozpoczęciem pracy', duration: '12:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c1l5', title: 'Bezpieczeństwo wymiany butli LPG', duration: '25:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c1l6b', title: 'Dokumentacja techniczna wózka', duration: '5:00', isCompleted: false, isLocked: false, type: 'text' },
      { id: 'c1l6', title: 'Diagram udźwigu - czytanie wykresów', duration: '30:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c1l2test', title: 'Test wiedzy - Moduł 2', duration: '10 pytań', isCompleted: false, isLocked: false, type: 'test', questions: [
        {
          id: 'q2_1',
          question: 'Jak często należy wykonywać przegląd przed rozpoczęciem pracy?',
          type: 'single',
          options: ['Raz w tygodniu', 'Przed każdą zmianą roboczą', 'Raz w miesiącu', 'Tylko gdy pojawi się usterka'],
          correctAnswer: 1,
          explanation: 'Przegląd przedstartowy należy wykonywać przed każdą zmianą roboczą, aby zapewnić bezpieczną eksploatację.'
        },
        {
          id: 'q2_2',
          question: 'Wybierz wszystkie elementy, które należy sprawdzić przed wymianą butli LPG:',
          type: 'multiple',
          options: ['Szczelność instalacji', 'Kolor butli', 'Stan zaworów', 'Datę ważności butli', 'Markę butli'],
          correctAnswer: [0, 2, 3],
          explanation: 'Należy sprawdzić szczelność instalacji, stan zaworów i datę ważności butli. Kolor i marka nie są kluczowe dla bezpieczeństwa.'
        },
        {
          id: 'q2_3',
          question: 'Opisz, co oznaczają poszczególne linie na wykresie diagramu udźwigu:',
          type: 'open',
          explanation: 'Diagram udźwigu przedstawia maksymalne obciążenie w zależności od wysokości podnoszenia i odległości środka ciężkości ładunku. Linie pokazują granice bezpiecznego udźwigu.'
        }
      ]},
    ]
  },
  {
    id: 'c1m3',
    courseId: 'c1',
    title: 'Moduł 3: Dozór Techniczny i Egzamin',
    lessons: [
      { id: 'c1l8', title: 'Przepisy prawne i obowiązki pracodawcy', duration: '20:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c1l8a', title: 'Wymagania formalne i prawne UDT', duration: '10:00', isCompleted: false, isLocked: false, type: 'text' },
      { id: 'c1l9', title: 'Dokumentacja techniczno-ruchowa', duration: '15:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c1l10', title: 'Egzamin końcowy', duration: '12 pytań', isCompleted: false, isLocked: false, type: 'test', questions: [
        {
          id: 'eq1',
          question: 'Które przepisy prawne regulują obsługę wózków widłowych w Polsce?',
          type: 'multiple',
          options: ['Kodeks pracy', 'Przepisy BHP', 'Rozporządzenie Ministra Gospodarki', 'Ustawa o ochronie konkurencji', 'Norma PN-EN 16307-1'],
          correctAnswer: [0, 1, 2, 4],
          explanation: 'Obsługę wózków widłowych regulują Kodeks pracy, przepisy BHP, rozporządzenie Ministra Gospodarki oraz norma PN-EN 16307-1. Ustawa o ochronie konkurencji nie dotyczy tej kwestii.'
        },
        {
          id: 'eq2',
          question: 'Co zawiera dokumentacja techniczno-ruchowa wózka widłowego?',
          type: 'single',
          options: ['Tylko mapę tras jazdy', 'Dane techniczne, historię remontów i przeglądy', 'Tylko aktualne przeglądy UDT', 'Numer seryjny i kolor'],
          correctAnswer: 1,
          explanation: 'Dokumentacja techniczno-ruchowa zawiera pełne dane techniczne, historię przeprowadzonych remontów i wszystkie wykonane przeglądy.'
        },
        {
          id: 'eq3',
          question: 'Opisz rolę inspektora UDT przy zatwierdzaniu wózka do pracy:',
          type: 'open',
          explanation: 'Inspektor UDT sprawdza stan techniczny wózka, weryfikuje bezpieczeństwo eksploatacji i zgodność z obowiązującymi normami. Po pozytywnym wyniku kontroli wydaje zaświadczenie o przydatności do użytkowania.'
        },
        {
          id: 'eq4',
          question: 'Jaki jest okres ważności przeglądu UDT dla wózków widłowych objętych dozorem?',
          type: 'single',
          options: ['6 miesięcy', '1 rok', '2 lata', '3 lata'],
          correctAnswer: 1,
          explanation: 'Przegląd UDT dla wózków widłowych objętych dozorem technicznym należy przeprowadzać co 12 miesięcy.'
        },
        {
          id: 'eq5',
          question: 'Wybierz wszystkie dokumenty, które powinny towarzyszyć wózkowi widłowemu objętemu dozorem:',
          type: 'multiple',
          options: ['Dowód rejestracyjny pojazdu', 'Karta przeglądu okresowego', 'Zaświadczenie UDT o dopuszczeniu do eksploatacji', 'Karta tankowania paliwa', 'Książka rewizyjna UDT'],
          correctAnswer: [1, 2, 4],
          explanation: 'Wózkowi objętemu dozorem powinny towarzyszyć: karta przeglądu okresowego, zaświadczenie UDT i książka rewizyjna. Dowód rejestracyjny dotyczy pojazdów drogowych, a karta tankowania nie jest dokumentem obowiązkowym.'
        },
        {
          id: 'eq6',
          question: 'Od jakiego wieku można uzyskać uprawnienia do obsługi wózków widłowych?',
          type: 'single',
          options: ['16 lat', '18 lat', '21 lat', '25 lat'],
          correctAnswer: 1,
          explanation: 'Minimalna wymagana wiek do uzyskania uprawnień to 18 lat (dla niektórych kategorii wózków może być wymagane 21 lat).'
        },
        {
          id: 'eq7',
          question: 'Jakie badania musi przejść kandydat na operatora wózka widłowego?',
          type: 'multiple',
          options: ['Badania lekarskie', 'Badania psychologiczne', 'Badania techniczne', 'Badania chemiczne', 'Test wiedzy teoretycznej'],
          correctAnswer: [0, 1, 4],
          explanation: 'Kandydat musi przejść badania lekarskie, psychologiczne oraz test wiedzy teoretycznej. Badania techniczne i chemiczne nie są wymagane.'
        },
        {
          id: 'eq8',
          question: 'Wyjaśnij, co to jest tabela znamionowa wózka widłowego i jakie informacje zawiera:',
          type: 'open',
          explanation: 'Tabela znamionowa to trwale przymocowana tabliczka zawierająca kluczowe dane: nazwę producenta, typ, numer seryjny, rok produkcji, udźwig nominalny (Q), odległość środka ciężkości ładunku (c), maksymalną wysokość podnoszenia i masę własną wózka. Jest to podstawowy dokument identyfikacyjny.'
        }
      ]},
    ]
  },
  // Ładowarki Teleskopowe (c2)
  {
    id: 'c2m1',
    courseId: 'c2',
    title: 'Moduł 1: Budowa i Funkcje',
    lessons: [
      { id: 'c2l1', title: 'Wprowadzenie do ładowarek teleskopowych', duration: '20:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c2l2', title: 'Układ hydrauliczny i teleskop', duration: '28:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c2l3', title: 'Wymienne osprzęty', duration: '22:00', isCompleted: false, isLocked: false, type: 'video' },
    ]
  },
  {
    id: 'c2m2',
    courseId: 'c2',
    title: 'Moduł 2: Obsługa i Bezpieczeństwo',
    lessons: [
      { id: 'c2l4', title: 'Zasady bezpiecznej pracy', duration: '18:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c2l5', title: 'Stabilność ładowarki', duration: '24:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c2l6', title: 'Praca na wysokości', duration: '26:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c2l7', title: 'Test praktyczny - symulacja', duration: '30 min', isCompleted: false, isLocked: false, type: 'test' },
    ]
  },
  {
    id: 'c2m3',
    courseId: 'c2',
    title: 'Moduł 3: Konserwacja',
    lessons: [
      { id: 'c2l8', title: 'Przeglądy okresowe', duration: '16:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c2l9', title: 'Typowe awarie i ich eliminacja', duration: '20:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c2l10', title: 'Egzamin końcowy', duration: '25 pytań', isCompleted: false, isLocked: false, type: 'quiz' },
    ]
  },
  // Uprawnienia Energetyczne G1 (c3)
  {
    id: 'c3m1',
    courseId: 'c3',
    title: 'Moduł 1: Podstawy Elektrotechniki',
    lessons: [
      { id: 'c3l1', title: 'Prawo Ohma i Kirchhoffa', duration: '25:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l2', title: 'Obwody prądu stałego i zmiennego', duration: '30:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l3', title: 'Bezpieczeństwo pracy z prądem', duration: '35:00', isCompleted: false, isLocked: false, type: 'video' },
    ]
  },
  {
    id: 'c3m2',
    courseId: 'c3',
    title: 'Moduł 2: Urządzenia i Instalacje',
    lessons: [
      { id: 'c3l4', title: 'Rozdzielnice i tablice', duration: '28:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l5', title: 'Zabezpieczenia nadprądowe', duration: '32:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l6', title: 'Ochrona przeciwporażeniowa', duration: '40:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l7', title: 'Test wiedzy - Moduł 2', duration: '20 pytań', isCompleted: false, isLocked: false, type: 'quiz' },
    ]
  },
  {
    id: 'c3m3',
    courseId: 'c3',
    title: 'Moduł 3: Eksploatacja',
    lessons: [
      { id: 'c3l8', title: 'Przepisy i normy', duration: '22:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l9', title: 'Pomiary elektryczne', duration: '35:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l10', title: 'Dokumentacja eksploatacyjna', duration: '18:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c3l11', title: 'Egzamin końcowy', duration: '30 pytań', isCompleted: false, isLocked: false, type: 'quiz' },
    ]
  },
  // Suwnice i Wciągniki (c4)
  {
    id: 'c4m1',
    courseId: 'c4',
    title: 'Moduł 1: Budowa Suwnic',
    lessons: [
      { id: 'c4l1', title: 'Typy i konstrukcja suwnic', duration: '24:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c4l2', title: 'Mechanizmy podnoszenia', duration: '28:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c4l3', title: 'Wciągniki i zawiesia', duration: '20:00', isCompleted: false, isLocked: false, type: 'video' },
    ]
  },
  {
    id: 'c4m2',
    courseId: 'c4',
    title: 'Moduł 2: Obsługa Suwnic',
    lessons: [
      { id: 'c4l4', title: 'Sterowanie i manewrowanie', duration: '26:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c4l5', title: 'Bezpieczeństwo przy podnoszeniu', duration: '30:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c4l6', title: 'Sygnały i komunikacja', duration: '16:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c4l7', title: 'Test praktyczny', duration: '25 min', isCompleted: false, isLocked: false, type: 'test' },
    ]
  },
  {
    id: 'c4m3',
    courseId: 'c4',
    title: 'Moduł 3: Konserwacja i UDT',
    lessons: [
      { id: 'c4l8', title: 'Przeglądy techniczne', duration: '22:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c4l9', title: 'Przepisy UDT dla dźwignic', duration: '28:00', isCompleted: false, isLocked: false, type: 'video' },
      { id: 'c4l10', title: 'Egzamin końcowy', duration: '25 pytań', isCompleted: false, isLocked: false, type: 'quiz' },
    ]
  }
];

export const ADMIN_STUDENTS: Student[] = [
  // Operator Wózków Widłowych (I WJO) - c1 ma 10 lekcji
  { id: 's1', name: 'Adam Nowak', email: 'adam.n@firma.pl', company: 'LogiTrans Sp. z o.o.', course: 'c1', progress: 85, expirationDays: 12, status: 'active', 
    completedLessons: ['c1l1', 'c1l2', 'c1l3', 'c1l4', 'c1l5', 'c1l6', 'c1l7', 'c1l8', 'c1l9'] }, // 9/10
  { id: 's1-c3', name: 'Adam Nowak', email: 'adam.n@firma.pl', company: 'LogiTrans Sp. z o.o.', course: 'c3', progress: 35, expirationDays: 45, status: 'active', 
    completedLessons: ['c3l1', 'c3l2', 'c3l3'] }, // Adam ma też kurs SEP
  { id: 's3', name: 'Anna Wiśniewska', email: 'a.wisniewska@logistics.com', company: 'DHL Supply Chain', course: 'c1', progress: 95, expirationDays: 2, status: 'warning', 
    completedLessons: ['c1l1', 'c1l2', 'c1l3', 'c1l4', 'c1l5', 'c1l6', 'c1l7', 'c1l8', 'c1l9'] }, // 9/10 - brakuje egzaminu
  { id: 's6', name: 'Tomasz Lewandowski', email: 't.lewandowski@magazyn.pl', company: 'Amazon Fulfillment Poland', course: 'c1', progress: 45, expirationDays: 28, status: 'active', 
    completedLessons: ['c1l1', 'c1l2', 'c1l3', 'c1l4', 'c1l5'] }, // 5/10
  { id: 's7', name: 'Katarzyna Kaczmarek', email: 'k.kaczmarek@transport.eu', company: 'Trans-Evropa Sp. z o.o.', course: 'c1', progress: 100, expirationDays: 90, status: 'active', 
    completedLessons: ['c1l1', 'c1l2', 'c1l3', 'c1l4', 'c1l5', 'c1l6', 'c1l7', 'c1l8', 'c1l9', 'c1l10'] }, // 10/10
  { id: 's7-c2', name: 'Katarzyna Kaczmarek', email: 'k.kaczmarek@transport.eu', company: 'Trans-Evropa Sp. z o.o.', course: 'c2', progress: 60, expirationDays: 85, status: 'active', 
    completedLessons: ['c2l1', 'c2l2', 'c2l3', 'c2l4', 'c2l5', 'c2l6'] }, // Katarzyna ma też ładowarki
  { id: 's8', name: 'Michał Szymański', email: 'm.szymanski@logistyka.com', company: 'LogiTrans Sp. z o.o.', course: 'c1', progress: 30, expirationDays: 55, status: 'active', 
    completedLessons: ['c1l1', 'c1l2', 'c1l3'] }, // 3/10 - zmieniono z Raben na LogiTrans
  
  // Ładowarki Teleskopowe - Pełne Uprawnienia - c2 ma 10 lekcji
  { id: 's2', name: 'Krzysztof Kowalczyk', email: 'k.kowalczyk@budimex.pl', company: 'Budimex S.A.', course: 'c2', progress: 20, expirationDays: 45, status: 'active', 
    completedLessons: ['c2l1', 'c2l2'] }, // 2/10
  { id: 's2-c4', name: 'Krzysztof Kowalczyk', email: 'k.kowalczyk@budimex.pl', company: 'Budimex S.A.', course: 'c4', progress: 15, expirationDays: 60, status: 'active', 
    completedLessons: ['c4l1'] }, // Krzysztof ma też suwnice
  { id: 's9', name: 'Paweł Woźniak', email: 'p.wozniak@budowa.pl', company: 'DHL Supply Chain', course: 'c2', progress: 70, expirationDays: 18, status: 'active', 
    completedLessons: ['c2l1', 'c2l2', 'c2l3', 'c2l4', 'c2l5', 'c2l6', 'c2l7'] }, // 7/10 - zmieniono ze Skanska na DHL
  { id: 's10', name: 'Magdalena Dąbrowska', email: 'm.dabrowska@construction.eu', company: 'LogiTrans Sp. z o.o.', course: 'c2', progress: 55, expirationDays: 34, status: 'active', 
    completedLessons: ['c2l1', 'c2l2', 'c2l3', 'c2l4', 'c2l5'] }, // 5/10 - zmieniono z Hochtief na LogiTrans
  { id: 's11', name: 'Bartosz Kamiński', email: 'b.kaminski@sprzet.com', company: 'Trans-Evropa Sp. z o.o.', course: 'c2', progress: 100, expirationDays: 75, status: 'active', 
    completedLessons: ['c2l1', 'c2l2', 'c2l3', 'c2l4', 'c2l5', 'c2l6', 'c2l7', 'c2l8', 'c2l9', 'c2l10'] }, // 10/10 - zmieniono z Ramirent na Trans-Evropa
  { id: 's11-c1', name: 'Bartosz Kamiński', email: 'b.kaminski@sprzet.com', company: 'Trans-Evropa Sp. z o.o.', course: 'c1', progress: 100, expirationDays: 120, status: 'active', 
    completedLessons: ['c1l1', 'c1l2', 'c1l3', 'c1l4', 'c1l5', 'c1l6', 'c1l7', 'c1l8', 'c1l9', 'c1l10'] }, // Bartosz ma też wózki
  
  // Uprawnienia Energetyczne G1 (Eksploatacja) - c3 ma 11 lekcji
  { id: 's4', name: 'Piotr Zieliński', email: 'p.zielinski@serwis.pl', company: 'DHL Supply Chain', course: 'c3', progress: 0, expirationDays: 60, status: 'active', 
    completedLessons: [] }, // 0/11 - zmieniono z Elektromontaż na DHL
  { id: 's12', name: 'Łukasz Jankowski', email: 'l.jankowski@elektro.pl', company: 'Amazon Fulfillment Poland', course: 'c3', progress: 80, expirationDays: 25, status: 'active', 
    completedLessons: ['c3l1', 'c3l2', 'c3l3', 'c3l4', 'c3l5', 'c3l6', 'c3l7', 'c3l8', 'c3l9'] }, // 9/11 - zmieniono z Energa na Amazon
  { id: 's13', name: 'Joanna Mazur', email: 'j.mazur@energetyka.com', company: 'Budimex S.A.', course: 'c3', progress: 40, expirationDays: 48, status: 'active', 
    completedLessons: ['c3l1', 'c3l2', 'c3l3', 'c3l4'] }, // 4/11 - zmieniono z PGE na Budimex
  { id: 's14', name: 'Robert Wieczorek', email: 'r.wieczorek@zakład.pl', company: 'Tauron Dystrybucja', course: 'c3', progress: 90, expirationDays: 3, status: 'warning', 
    completedLessons: ['c3l1', 'c3l2', 'c3l3', 'c3l4', 'c3l5', 'c3l6', 'c3l7', 'c3l8', 'c3l9', 'c3l10'] }, // 10/11 - brakuje egzaminu
  
  // Suwnice i Wciągniki - c4 ma 10 lekcji
  { id: 's15', name: 'Grzegorz Piotrowski', email: 'g.piotrowski@przemysl.pl', company: 'ArcelorMittal Poland', course: 'c4', progress: 65, expirationDays: 40, status: 'active', 
    completedLessons: ['c4l1', 'c4l2', 'c4l3', 'c4l4', 'c4l5', 'c4l6'] }, // 6/10
  { id: 's16', name: 'Ewa Grabowska', email: 'e.grabowska@fabryka.com', company: 'KGHM Polska Miedź', course: 'c4', progress: 100, expirationDays: 120, status: 'active', 
    completedLessons: ['c4l1', 'c4l2', 'c4l3', 'c4l4', 'c4l5', 'c4l6', 'c4l7', 'c4l8', 'c4l9', 'c4l10'] }, // 10/10
  { id: 's16-c3', name: 'Ewa Grabowska', email: 'e.grabowska@fabryka.com', company: 'KGHM Polska Miedź', course: 'c3', progress: 55, expirationDays: 100, status: 'active', 
    completedLessons: ['c3l1', 'c3l2', 'c3l3', 'c3l4', 'c3l5', 'c3l6'] }, // Ewa ma też SEP
  { id: 's17', name: 'Daniel Król', email: 'd.krol@hala.eu', company: 'Volkswagen Poznań', course: 'c4', progress: 25, expirationDays: 50, status: 'active', 
    completedLessons: ['c4l1', 'c4l2'] }, // 2/10
  { id: 's18', name: 'Monika Sikora', email: 'm.sikora@magazyn.pl', company: 'Indywidualny', course: 'c4', progress: 0, expirationDays: 0, status: 'expired', 
    completedLessons: [] }, // 0/10
];

export const POPULARITY_DATA = [
  { name: 'Wózki Widłowe', value: 45, color: '#003d4d' }, // brand-primary
  { name: 'Ładowarki', value: 30, color: '#ff6600' },    // brand-accent
  { name: 'Koparki', value: 15, color: '#005c73' },      // brand-secondary
  { name: 'SEP', value: 10, color: '#94a3b8' },          // slate-400
];