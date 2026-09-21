import { StudentUser } from "../types";

export const JOB_PROGRAMS: {
  [key: string]: { title: string; details: string[] }[];
} = {
  c1: [
    {
      title: "Bezpieczeństwo pracy",
      details: [
        "BHP w zakresie obsługi wózków widłowych",
        "Zasady poruszania się po placu manewrowym i w magazynie",
        "Bezpieczne techniki podnoszenia i transportu ładunków",
        "Procedury awaryjne i zasady postępowania w sytuacjach niebezpiecznych",
        "Środki ochrony indywidualnej operatora",
      ],
    },
    {
      title: "Obsługa maszyn",
      details: [
        "Budowa i zasada działania wózka widłowego",
        "Codzienne czynności kontrolne przed rozpoczęciem pracy",
        "Prawidłowa technika jazdy i manewrowania",
        "Obsługa układu hydraulicznego i mechanizmu podnoszenia",
        "Wymiana butli gazowych (dla wózków LPG)",
      ],
    },
    {
      title: "Przepisy UDT",
      details: [
        "Ustawa o dozorze technicznym - zakres i interpretacja",
        "Wymagania techniczne dla wózków jezdniowych",
        "Przeglądy okresowe i dokumentacja eksploatacyjna",
        "Obowiązki operatora i pracodawcy według przepisów UDT",
        "Odpowiedzialność prawna w przypadku wykroczeń",
      ],
    },
    {
      title: "Praktyka na placu manewrowym",
      details: [
        "Jazda slalomem i jazda tyłem",
        "Precyzyjne ustawianie wideł i manipulacja ładunkiem",
        "Układanie palet na różnych wysokościach",
        "Jazda z ładunkiem po pochylni i nierównym terenie",
        "Wykonanie parkingu i bezpieczne pozostawienie wózka",
        "Praktyka trwa minimum 20 godzin pod okiem instruktora",
      ],
    },
    {
      title: "Przygotowanie do egzaminu",
      details: [
        "Omówienie struktury egzaminu państwowego UDT",
        "Test próbny z pytań teoretycznych (identyczny z państwowym)",
        "Symulacja egzaminu praktycznego",
        "Najczęstsze błędy i jak ich unikać",
        "Wskazówki dotyczące dokumentacji egzaminacyjnej",
      ],
    },
  ],
  c2: [
    {
      title: "Bezpieczeństwo pracy",
      details: [
        "BHP przy pracy z ładowarkami teleskopowymi",
        "Bezpieczna praca na wysokościach",
        "Ocena warunków gruntu i stabilności maszyny",
        "Zasady bezpiecznej wymiany osprzętu",
        "Procedury awaryjne i ewakuacja z kabiny",
      ],
    },
    {
      title: "Obsługa maszyn",
      details: [
        "Budowa i elementy ładowarki teleskopowej",
        "System hydrauliczny i sterowanie proporcjonalne",
        "Obsługa wysięgnika teleskopowego i mechanizmów",
        "Montaż i demontaż różnych rodzajów osprzętu (widelce, łyżka, kosz)",
        "Codzienne kontrole i konserwacja podstawowa",
      ],
    },
    {
      title: "Przepisy UDT",
      details: [
        "Przepisy UDT dla wielozadaniowych nośników osprzętu",
        "Wymagania dla operatorów ładowarek teleskopowych",
        "Dokumentacja techniczna i książka maszyny",
        "Przeglądy i badania techniczne",
        "Certyfikacja osprzętu zamiennego",
      ],
    },
    {
      title: "Praktyka na placu manewrowym",
      details: [
        "Jazda z wysięgnikiem w różnych pozycjach",
        "Praca na wysokościach z koszem osobowym",
        "Załadunek i manipulacja materiałami budowlanymi",
        "Precyzyjna praca łyżką przy robotach ziemnych",
        "Transport ładunków na terenie nierównym i pochyłym",
        "Szkolenie trwa 40 godzin, w tym 30 godzin praktyki",
      ],
    },
    {
      title: "Przygotowanie do egzaminu",
      details: [
        "Testy przykładowe zgodne z wymaganiami UDT",
        "Symulacja egzaminu praktycznego z każdym rodzajem osprzętu",
        "Przegląd najważniejszych zagadnień technicznych",
        "Analiza typowych błędów egzaminacyjnych",
        "Wsparcie instruktora do dnia egzaminu",
      ],
    },
  ],
  c3: [
    {
      title: "BHP i zasady bezpieczeństwa na budowie",
      details: [
        "Przepisy BHP przy wykonywaniu robót ziemnych i wykopów",
        "Praca w pobliżu instalacji podziemnych (gaz, prąd, woda, telekomunikacja)",
        "Stateczność maszyny na skarpach i w grząskim gruncie",
        "Procedury awaryjne i bezpieczna ewakuacja",
        "Środki ochrony indywidualnej operatora maszyn budowlanych",
      ],
    },
    {
      title: "Budowa i obsługa koparko-ładowarki",
      details: [
        "Konstrukcja podwozia, układu jezdnego i napędu 4x4",
        "Układ hydrauliczny: pompy, rozdzielacze, siłowniki osprzętu",
        "Obsługa osprzętu ładowarkowego (łyżka przednia 4w1, widły)",
        "Obsługa osprzętu koparkowego (ramię teleskopowe, podpory)",
        "Codzienna obsługa techniczna i punkty smarne (Daily Check)",
      ],
    },
    {
      title: "Technologia i technika robót ziemnych",
      details: [
        "Kategorie gruntów i dobór parametrów pracy",
        "Wykonywanie wykopów liniowych, jamistych i szerokoprzestrzennych",
        "Zdejmowanie warstwy humusu i niwelacja terenu",
        "Załadunek urobku na środki transportu wywrotkami",
        "Zasypywanie wykopów i zagęszczanie podłoża osprzętem",
      ],
    },
    {
      title: "Zajęcia praktyczne na poligonie",
      details: [
        "Jazda manewrowa i praca w trudnych warunkach terenowych",
        "Precyzyjne kopanie wykopu pod fundamenty i rurociągi",
        "Wymiana osprzętu (łyżki skarpowe, młot hydrauliczny)",
        "Bezpieczne parkowanie i zabezpieczenie maszyny po pracy",
        "Praktyka prowadzona na maszynach JCB 3CX i CAT",
      ],
    },
    {
      title: "Przygotowanie do egzaminu państwowego IMBiGS",
      details: [
        "Wymagania formalne komisji Instytutu Mechanizacji Budownictwa",
        "Część teoretyczna: testy i pytania ustne z budowy oraz technologii",
        "Część praktyczna: wykonanie zadania egzaminacyjnego na placu",
        "Omówienie najczęstszych błędów dyskwalifikujących",
      ],
    },
  ],
  c4: [
    {
      title: "Bezpieczeństwo pracy i BHP",
      details: [
        "BHP przy obsłudze suwnic, wciągników i wciągarek",
        "Zasady bezpiecznego transportu ładunków w halach",
        "Dobór atestowanych zawiesi linowych, łańcuchowych i pasowych",
        "Sygnalizacja i komunikacja z hakowym-sygnalistą",
        "Procedury awaryjne przy zaniku napięcia lub awarii hamulca",
      ],
    },
    {
      title: "Budowa urządzeń i sterowanie",
      details: [
        "Budowa suwnic natorowych, podwieszanych i bramowych",
        "Mechanizmy podnoszenia, jazdy mostu i wózka suwnicowego",
        "Sterowanie z poziomu roboczego (kaseta sterownicza, pilot radiowy)",
        "Sterowanie z kabiny operatora",
        "Aparatura zabezpieczająca: wyłączniki krańcowe, ograniczniki udźwigu",
      ],
    },
    {
      title: "Wymagania i przepisy UDT",
      details: [
        "Ustawa o dozorze technicznym dla urządzeń transportu bliskiego",
        "Kategorie uprawnień: IS (z kabiny i robocze) oraz IIS (poziom roboczy)",
        "Księga rewizyjna urządzenia i wpisy w dzienniku konserwacji",
        "Zakres codziennych przeglądów przed rozpoczęciem zmiany",
      ],
    },
    {
      title: "Praktyka na suwnicy",
      details: [
        "Jazda suwnicą z ładunkiem gabarytowym i nieforemnym",
        "Tłumienie kołysania ładunku podczas ruszania i hamowania",
        "Precyzyjne osadzanie ładunku na stanowiskach montażowych",
        "Ćwiczenia na hali przemysłowej pod okiem instruktora",
      ],
    },
    {
      title: "Egzamin państwowy UDT",
      details: [
        "Pytania egzaminacyjne UDT z budowy, eksploatacji i BHP",
        "Symulacja egzaminu praktycznego przed inspektorem UDT",
        "Wydanie bezterminowego zaświadczenia kwalifikacyjnego",
      ],
    },
  ],
  c5: [
    {
      title: "BHP i stabilność podestów ruchomych",
      details: [
        "BHP przy pracach na wysokości z kosza roboczego",
        "Wykresy stateczności, dopuszczalny udźwig i siła wiatru",
        "Stosowanie szelek bezpieczeństwa i punktów asekuracyjnych",
        "Ocena nośności podłoża i prawidłowe rozstawianie podpór",
      ],
    },
    {
      title: "Budowa podestów nożycowych, przegubowych i teleskopowych",
      details: [
        "Konstrukcja masztu, wysięgnika teleskopowego i nożyc",
        "Układy hydrauliczne, napędy spalinowe i elektryczne",
        "Pulpity sterownicze w koszu oraz sterowanie awaryjne z dołu",
        "Układy awaryjnego opuszczania platformy",
      ],
    },
    {
      title: "Praktyka manewrowa i obsługa kosza",
      details: [
        "Jazda podestem w pozycji transportowej i roboczej",
        "Precyzyjne manewrowanie koszem w pobliżu przeszkód i konstrukcji",
        "Ewakuacja z wysokości i procedury zjazdu awaryjnego",
      ],
    },
    {
      title: "Przygotowanie do egzaminu UDT (kategoria I P)",
      details: [
        "Testy UDT na podesty ruchome przejezdne",
        "Zadanie praktyczne przed komisją Dozoru Technicznego",
        "Międzynarodowy certyfikat ukończenia",
      ],
    },
  ],
  c6: [
    {
      title: "Bezpieczeństwo i przepisy dla żurawi HDS",
      details: [
        "BHP przy przeładunku materiałów z pojazdów",
        "Wykresy udźwigu żurawia przenośnego (HDS)",
        "Strefy niebezpieczne i praca w pobliżu linii elektroenergetycznych",
        "Prawidłowe podparcie pojazdu na stopach hydraulicznych",
      ],
    },
    {
      title: "Budowa i osprzęt żurawi przeładunkowych",
      details: [
        "Konstrukcja kolumny, wysięgników teleskopowych i zbloczy",
        "Sterowanie mechaniczne, hydrauliczne i radiowe",
        "Zabezpieczenia przeciążeniowe i zawory zamkowe",
        "Obsługa chwytaków, wideł do palet i haków",
      ],
    },
    {
      title: "Praktyka i egzamin UDT",
      details: [
        "Przeładunek palet i ładunków przestrzennych na samochód",
        "Składanie żurawia do pozycji transportowej",
        "Egzamin państwowy UDT na żurawie przenośne i przewoźne",
      ],
    },
  ],
  c7: [
    {
      title: "Podstawy elektrotechniki i przepisy SEP",
      details: [
        "Ustawa Prawo Energetyczne i rozporządzenia wykonawcze",
        "Struktura uprawnień Grupy G1: Eksploatacja (E) i Dozór (D)",
        "Prawa elektrotechniki, układy sieciowe TN-C, TN-S, TT, IT",
      ],
    },
    {
      title: "Ochrona przeciwporażeniowa i BHP",
      details: [
        "Środki ochrony podstawowej i dodatkowej (RCD, wyłączniki nadprądowe)",
        "Pierwsza pomoc przy porażeniu prądem elektrycznym i oparzeniach",
        "Sprzęt ochronny, drążki izolacyjne i pomiary rezystancji izolacji",
      ],
    },
    {
      title: "Obsługa, konserwacja i pomiary instalacji do 1 kV",
      details: [
        "Rozdzielnice elektryczne, aparatura łączeniowa i transformatory",
        "Instalacje oświetleniowe, siłowe i odgromowe",
        "Prowadzenie książki eksploatacji i protokołów pomiarowych",
      ],
    },
    {
      title: "Przygotowanie do państwowego egzaminu komisji kwalifikacyjnej",
      details: [
        "Pytania egzaminacyjne i typowe zagadnienia komisji SEP",
        "Wydanie państwowego świadectwa kwalifikacji ważnego 5 lat",
      ],
    },
  ],
  c8: [
    {
      title: "BHP i ochrona przeciwpożarowa przy pracach spawalniczych",
      details: [
        "Zagrożenia: dymy spawalnicze, promieniowanie UV/IR, pole elektromagnetyczne",
        "Wentylacja stanowiskowa i środki ochrony spawalniczej",
        "Bezpieczeństwo butli z gazami osłonowymi (Argon, CO2, mieszanki)",
      ],
    },
    {
      title: "Technologia spawania MIG/MAG (metoda 131/135) oraz TIG (141)",
      details: [
        "Dobór drutów spawalniczych, gazów i parametrów prądowych",
        "Przygotowanie złączy: rowkowanie, ukosowanie, sczepianie",
        "Prowadzenie uchwytu spawalniczego w różnych pozycjach (PA, PB, PC, PF)",
      ],
    },
    {
      title: "Intensywny warsztat praktyczny",
      details: [
        "Spawanie blach i rur ze stali czarnej oraz nierdzewnej",
        "Ocena wizualna i badania nieniszczące (VT) złączy spawanych",
        "Eliminacja wad spawalniczych (porowatości, przyklejenia, podtopienia)",
      ],
    },
    {
      title: "Egzamin i Certyfikacja Instytutu Spawalnictwa",
      details: [
        "Wykonanie próbki egzaminacyjnej pod nadzorem rzeczoznawcy",
        "Badania łamania i próby zginania próbek",
        "Wydanie Międzynarodowej Książeczki Spawacza i Certyfikatu wg normy EN ISO 9606",
      ],
    },
  ],
};

// Aliases for string IDs used in category landings
JOB_PROGRAMS["wozki-widlowe"] = JOB_PROGRAMS["c1"];
JOB_PROGRAMS["ladowarki-teleskopowe"] = JOB_PROGRAMS["c2"];
JOB_PROGRAMS["koparko-ladowarki"] = JOB_PROGRAMS["c3"];
JOB_PROGRAMS["koparki"] = JOB_PROGRAMS["c3"];
JOB_PROGRAMS["ladowarki"] = JOB_PROGRAMS["c3"];
JOB_PROGRAMS["spycharki"] = JOB_PROGRAMS["c3"];
JOB_PROGRAMS["suwnice"] = JOB_PROGRAMS["c4"];
JOB_PROGRAMS["podesty"] = JOB_PROGRAMS["c5"];
JOB_PROGRAMS["podesty-ruchome"] = JOB_PROGRAMS["c5"];
JOB_PROGRAMS["zurawie"] = JOB_PROGRAMS["c6"];
JOB_PROGRAMS["sep-g1"] = JOB_PROGRAMS["c7"];
JOB_PROGRAMS["g1-elektryczne"] = JOB_PROGRAMS["c7"];
JOB_PROGRAMS["spawanie"] = JOB_PROGRAMS["c8"];
JOB_PROGRAMS["mig-mag"] = JOB_PROGRAMS["c8"];
JOB_PROGRAMS["tig"] = JOB_PROGRAMS["c8"];

export const MOCK_USERS: {
  [key: string]: { password: string; user: StudentUser };
} = {
  "admin@test.com": {
    password: "admin123",
    user: {
      id: "u1",
      email: "admin@test.com",
      name: "Administrator",
      phone: "+48 123 456 789",
      role: "ADMIN",
    },
  },
  "manager@test.com": {
    password: "manager123",
    user: {
      id: "u2",
      email: "manager@test.com",
      name: "Manager Platformy",
      phone: "+48 234 567 890",
      role: "MANAGER",
    },
  },
  "student@test.com": {
    password: "student123",
    user: {
      id: "u3",
      email: "student@test.com",
      name: "Jan Kowalski",
      phone: "+48 730 101 000",
      company: "ABC Transport Sp. z o.o.",
      role: "STUDENT",
      certifications: [
        {
          id: "cert1",
          name: "Operator wózków jezdniowych",
          courseId: "c1",
          courseName: "Operator Wózków Jezdniowych UDT",
          issueDate: "2020-03-12",
          expirationDate: "2025-03-12",
          status: "expiring-soon",
          certificateUrl: "/certificates/cert1.pdf",
        },
        {
          id: "cert2",
          name: "Operator suwnic",
          courseId: "c2",
          courseName: "Operator Suwnic i Wciągników UDT",
          issueDate: "2021-06-18",
          expirationDate: "2026-06-18",
          status: "expiring-soon",
          certificateUrl: "/certificates/cert2.pdf",
        },
        {
          id: "cert3",
          name: "Operator koparek i ładowarek",
          courseId: "c3",
          courseName: "Obsługa Maszyn Budowlanych",
          issueDate: "2022-09-05",
          expirationDate: "2027-09-05",
          status: "active",
          certificateUrl: "/certificates/cert3.pdf",
        },
        {
          id: "cert4",
          name: "Uprawnienia SEP do 1kV",
          courseId: "c4",
          courseName: "Uprawnienia Elektryczne SEP",
          issueDate: "2019-11-22",
          expirationDate: "2024-11-22",
          status: "expired",
          certificateUrl: "/certificates/cert4.pdf",
        },
        {
          id: "cert5",
          name: "BHP dla pracowników biurowych",
          courseId: "c5",
          courseName: "Szkolenie BHP Podstawowe",
          issueDate: "2023-01-15",
          expirationDate: "2026-01-15",
          status: "active",
          certificateUrl: "/certificates/cert5.pdf",
        },
      ],
      examHistory: [
        {
          id: "exam1",
          courseId: "c1",
          courseName: "Operator Wózków Jezdniowych UDT",
          examType: "final",
          score: 14,
          maxScore: 15,
          passed: true,
          date: "2020-03-10",
          questionsAnswered: [],
        },
        {
          id: "exam2",
          courseId: "c1",
          courseName: "Operator Wózków Jezdniowych UDT",
          examType: "module",
          moduleId: "m1",
          moduleName: "Podstawy BHP",
          score: 19,
          maxScore: 20,
          passed: true,
          date: "2020-02-28",
          questionsAnswered: [],
        },
        {
          id: "exam3",
          courseId: "c2",
          courseName: "Operator Suwnic i Wciągników UDT",
          examType: "final",
          score: 13,
          maxScore: 15,
          passed: true,
          date: "2021-06-15",
          questionsAnswered: [],
        },
        {
          id: "exam4",
          courseId: "c2",
          courseName: "Operator Suwnic i Wciągników UDT",
          examType: "module",
          moduleId: "m2",
          moduleName: "Przepisy eksploatacji",
          score: 17,
          maxScore: 20,
          passed: true,
          date: "2021-06-10",
          questionsAnswered: [],
        },
        {
          id: "exam5",
          courseId: "c3",
          courseName: "Obsługa Maszyn Budowlanych",
          examType: "final",
          score: 15,
          maxScore: 15,
          passed: true,
          date: "2022-09-01",
          questionsAnswered: [],
        },
        {
          id: "exam6",
          courseId: "c4",
          courseName: "Uprawnienia Elektryczne SEP",
          examType: "final",
          score: 11,
          maxScore: 15,
          passed: false,
          date: "2019-11-18",
          questionsAnswered: [],
        },
        {
          id: "exam7",
          courseId: "c4",
          courseName: "Uprawnienia Elektryczne SEP",
          examType: "final",
          score: 14,
          maxScore: 15,
          passed: true,
          date: "2019-11-20",
          questionsAnswered: [],
        },
        {
          id: "exam8",
          courseId: "c5",
          courseName: "Szkolenie BHP Podstawowe",
          examType: "module",
          moduleId: "m1",
          moduleName: "Przepisy BHP",
          score: 20,
          maxScore: 20,
          passed: true,
          date: "2023-01-12",
          questionsAnswered: [],
        },
      ],
    },
  },
  "guardian@test.com": {
    password: "guardian123",
    user: {
      id: "u4",
      email: "guardian@test.com",
      name: "Opiekun Firmy ABC",
      phone: "+48 345 678 901",
      role: "COMPANY_GUARDIAN",
      company: "ABC Sp. z o.o.",
      employeeLimit: 10,
      employees: [
        {
          id: "emp1",
          email: "mateusz.kowalski@abc.pl",
          name: "Mateusz Kowalski",
          phone: "+48 500 111 222",
          status: "active",
          createdDate: "2025-11-15",
          assignedCourses: ["c1"],
        },
        {
          id: "emp2",
          email: "anna.lewandowska@abc.pl",
          name: "Anna Lewandowska",
          phone: "+48 500 222 333",
          status: "active",
          createdDate: "2025-10-20",
          assignedCourses: ["c2"],
        },
        {
          id: "emp3",
          email: "pawel.zawisza@abc.pl",
          name: "Paweł Zawisza",
          phone: "+48 500 333 444",
          status: "pending",
          inviteToken: "token123",
          createdDate: "2026-01-03",
          assignedCourses: ["c1"],
        },
      ],
    },
  },
};
