import type { Course } from "./types";

export const COURSES: Course[] = [
  {
    id: "c1",
    title: "Operator Wózków Widłowych (I WJO)",
    category: "UDT",
    duration: "35h",
    price: "650 PLN",
    image: "operator-wozki-widlowe.webp",
    isPopular: true,
    description:
      "Ucz się teorii w domu, przyjedź tylko na egzamin praktyczny. Oszczędź czas i pieniądze dzięki naszej platformie e-learningowej. Gwarantujemy materiały wideo 4K, testy próbne identyczne z państwowymi oraz 100% wsparcia instruktora.",
  },
  {
    id: "c2",
    title: "Ładowarki Teleskopowe - Pełne Uprawnienia",
    category: "UDT",
    duration: "40h",
    price: "850 PLN",
    image: "ladowarki-teleskopowe.webp",
    isPopular: true,
    description:
      "Szkolenie na wielozadaniowe nośniki osprzętu. Najbardziej poszukiwane uprawnienia w budownictwie.",
  },
  {
    id: "c3",
    title: "Uprawnienia Energetyczne G1 (Eksploatacja)",
    category: "SEP",
    duration: "8h",
    price: "400 PLN",
    image: "uprawnienia-energetyczne-g1.webp",
    description:
      "Kurs przygotowawczy do egzaminu kwalifikacyjnego na stanowisku Eksploatacji.",
  },
  {
    id: "c4",
    title: "Suwnice i Wciągniki",
    category: "UDT",
    duration: "24h",
    price: "600 PLN",
    image: "suwnice-wciagniki.webp",
    description: "Obsługa suwnic sterowanych z poziomu roboczego oraz kabiny.",
  },
];
