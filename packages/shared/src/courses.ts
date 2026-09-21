import type { Course, Machine } from "./types";

export const COURSES: Course[] = [
  {
    id: "c1",
    slug: "wozki-widlowe",
    title: "Operator Wózków Widłowych (UDT)",
    category: "UDT",
    duration: "35h",
    price: "1 000 PLN",
    image: "/operator-wozki-widlowe.webp",
    isPopular: true,
    hasOnline: true,
    description:
      "Ucz się teorii w domu, przyjedź tylko na jazdy i egzamin państwowy UDT. Uprawnienia UDT ważne 10 lat. Egzamin do 30 dni roboczych.",
  },
  {
    id: "c2",
    slug: "ladowarki-teleskopowe",
    title: "Ładowarki Teleskopowe i Wózki z Podnoszoną Kabiną",
    category: "UDT",
    duration: "40h",
    price: "1 500 PLN",
    image: "/ladowarki-teleskopowe.webp",
    isPopular: true,
    hasOnline: true,
    description:
      "Szkolenie na wózki ze zmiennym wysięgiem oraz z osobą obsługującą podnoszoną wraz z ładunkiem. Najwyższa kategoria UDT. Uprawnienia na 5 lat.",
  },
  {
    id: "c3",
    slug: "koparko-ladowarki",
    title: "Koparko-Ładowarki (Kl. III)",
    category: "IMBiGS",
    duration: "60h",
    price: "2 350 PLN",
    image: "/koparki.webp",
    isPopular: true,
    hasOnline: true,
    description:
      "Obsługa maszyn do robót ziemnych wszystkich typów. Certyfikacja Sieć Badawcza Łukasiewicz – Warszawski Instytut Technologiczny (ŚBŁ-WIT). Książka operatora.",
  },
  {
    id: "c4",
    slug: "suwnice",
    title: "Suwnice, Wciągniki i Wciągarki",
    category: "UDT",
    duration: "24h",
    price: "1 130 PLN",
    image: "/suwnice-wciagniki.webp",
    hasOnline: true,
    description:
      "Obsługa suwnic sterowanych z poziomu roboczego oraz z kabiny. Ogólnego przeznaczenia (1130 zł, 10 lat) / specjalnego (1380 zł, 5 lat).",
  },
  {
    id: "c5",
    slug: "podesty-ruchome",
    title: "Podesty Ruchome Przejezdne - Zwyżki (UDT)",
    category: "UDT",
    duration: "24h",
    price: "1 130 PLN",
    image: "/genie-z-4525j.webp",
    hasOnline: true,
    description:
      "Szkolenie na podesty nożycowe, przegubowe i teleskopowe do prac na wysokościach. Ważność uprawnień 5 lat.",
  },
  {
    id: "c6",
    slug: "zurawie",
    title: "Żurawie Przenośne HDS i Samojezdne",
    category: "UDT",
    duration: "35h",
    price: "1 130 PLN",
    image: "/serwis-i-koserwacja.webp",
    hasOnline: true,
    description:
      "Uprawnienia UDT na żurawie przewoźne HDS (1130 zł, 10 lat), stacjonarne (1080 zł) oraz samojezdne i wieżowe (2480 zł, 5 lat).",
  },
  {
    id: "c7",
    slug: "sep-g1",
    title: "Uprawnienia Elektryczne SEP G1 (E + D)",
    category: "SEP",
    duration: "1 dzień",
    price: "860 PLN",
    image: "/uprawnienia-energetyczne-g1.webp",
    hasOnline: true,
    description:
      "Kurs i egzamin SEP G1 (eksploatacja 860 zł / dozór 860 zł). Uprawnienia do i powyżej 1 kV ważne 5 lat.",
  },
  {
    id: "c8",
    slug: "spawanie",
    title: "Kurs Spawania (MIG/MAG, TIG, MMA)",
    category: "Spawalnictwo",
    duration: "32h",
    price: "2 400 PLN",
    image: "/wynajem-maszyn.webp",
    description:
      "Praktyczny kurs spawalniczy w 3 modułach. Stal czarna od 2400 zł, nierdzewna 2700 zł, aluminium 2900 zł. Norma PN-EN ISO 9606-1, Certyfikat SGS.",
  },
];

export const MACHINES: Machine[] = [
  {
    id: "m1",
    name: "Manitou MRT 2150",
    type: "Ładowarka Teleskopowa",
    specs: { height: "21m", capacity: "5000kg" },
    image: "/manitou-mrt-2150.webp",
  },
  {
    id: "m2",
    name: "Genie Z-45/25J",
    type: "Podnośnik Przegubowy",
    specs: { height: "16m", weight: "6500kg" },
    image: "/genie-z-4525j.webp",
  },
  {
    id: "m3",
    name: "JCB 3CX",
    type: "Koparko-ładowarka",
    specs: { weight: "8000kg", capacity: "1.2m³" },
    image: "/jcb-3cx.webp",
  },
];
