import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const udtTrainings: TrainingItem[] = [
  {
    id: "wozki-widlowe",
    title: "Wózki widłowe (UDT)",
    price: "1000 zł",
    description:
      "Operator wózków jezdniowych podnośnikowych z napędem silnikowym z wyłączeniem wózków z wysięgnikiem.",
    features: [
      "Teoria i zajęcia praktyczne",
      "Ważność uprawnień: 10 lat",
      "Egzamin UDT do 30 dni roboczych",
      "Cena zwolniona z VAT",
    ],
  },
  {
    id: "ladowarki-teleskopowe",
    title: "Ładowarki teleskopowe i wózki z podnoszoną kabiną",
    price: "1500 zł",
    description:
      "Wózki jezdniowe podnośnikowe z mechanicznym napędem podnoszenia z wysięgnikiem oraz z osobą obsługującą podnoszoną wraz z ładunkiem (najwyższa kategoria UDT).",
    features: [
      "Wysięgnik zmienny i podnoszenie operatora",
      "Ważność uprawnień: 5 lat",
      "Egzamin państwowy UDT w cenie",
      "Cena zwolniona z VAT",
    ],
  },
  {
    id: "zurawie",
    title: "Żurawie (HDS, samojezdne, wieżowe)",
    price: "od 1080 zł",
    description:
      "Kompleksowe uprawnienia UDT na żurawie przewoźne (HDS), samojezdne, stacjonarne, wieżowe i szynowe.",
    features: [
      "HDS / przewoźne: 1130 zł (10 lat)",
      "Samojezdne / wieżowe: 2480 zł (5 lat)",
      "Stacjonarne: 1080 zł (10 lat)",
      "Ceny zwolnione z VAT",
    ],
  },
  {
    id: "suwnice",
    title: "Suwnice, wciągniki i wciągarki",
    price: "od 1130 zł",
    description:
      "Obsługa suwnic sterowanych z poziomu roboczego (radiowo/przewodowo) lub z kabiny operatora.",
    features: [
      "Ogólnego przeznaczenia: 1130 zł (10 lat)",
      "Ogólnego i specjalnego: 1380 zł (5 lat)",
      "Zajęcia praktyczne i hakowanie",
      "Ceny zwolnione z VAT",
    ],
  },
  {
    id: "podesty-ruchome",
    title: "Podesty ruchome przejezdne (zwyżki)",
    price: "1130 zł",
    description:
      "Podesty nożycowe, teleskopowe i przegubowe do bezpiecznych prac na wysokościach.",
    features: [
      "Podesty wolnobieżne i samojezdne",
      "Ważność uprawnień: 5 lat",
      "Egzamin UDT do 30 dni roboczych",
      "Cena zwolniona z VAT",
    ],
  },
  {
    id: "wciagarki",
    title: "Wciągarki i wciągniki",
    price: "930 zł",
    description:
      "Obsługa wciągników i wciągarek mechanicznych ogólnego i specjalnego przeznaczenia.",
    features: [
      "Praktyczna obsługa i osprzęt",
      "Bezpieczna eksploatacja i BHP",
      "Egzamin państwowy UDT",
      "Cena zwolniona z VAT",
    ],
  },
  {
    id: "odnowienie-udt",
    title: "Przedłużenie uprawnień UDT",
    price: "0 zł (pomoc doradcza)",
    description:
      "Pomagamy w prawidłowym wypełnieniu i złożeniu wniosku o przedłużenie ważności zaświadczenia UDT przed upływem terminu.",
    features: [
      "Bezpłatna pomoc doradcza",
      "Wymagany wniosek przed wygaśnięciem",
      "W razie utraty ważności: ponowny kurs i egzamin",
      "Pełne wsparcie formalne",
    ],
  },
];

export const UDTSection = ({
  setView,
  setSelectedCourseId,
}: {
  setView?: (view: any) => void;
  setSelectedCourseId?: (id: string | null) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia UDT"
      description="Kompleksowe kursy na urządzenia transportu bliskiego. Zdobądź oficjalne uprawnienia Urzędu Dozoru Technicznego ważne 5 lub 10 lat zgodnie z przepisami UDT."
      trainings={udtTrainings}
      heroImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" // Placeholder warehouse
      setView={setView}
      setSelectedCourseId={setSelectedCourseId}
      servicePromo={{
        title: "Potrzebujesz sprzętu do pracy?",
        description:
          "Wynajmujemy wózki widłowe, ładowarki i podesty ruchome z operatorem lub bez. Zapewniamy również autoryzowany serwis i konserwację urządzeń UDT.",
        linkText: "Zobacz ofertę wynajmu i serwisu",
        linkUrl: "https://multiserwis-kutno.pl/wynajem", // External link
      }}
    />
  );
};
