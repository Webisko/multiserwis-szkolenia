import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const udtTrainings: TrainingItem[] = [
  {
    id: "wozki-widlowe",
    title: "Wózki widłowe (II WJO)",
    price: "950 zł",
    description:
      "Uprawnienia na wózki jezdniowe podnośnikowe z napędem silnikowym. Obejmuje wymianę butli gazowych.",
    features: [
      "Teoria i praktyka",
      "Egzamin UDT w cenie",
      "Bezterminowe uprawnienia",
    ],
  },
  {
    id: "ladowarki-teleskopowe",
    title: "Ładowarki teleskopowe (I WJO)",
    price: "Zapytaj o cenę",
    description:
      "Specjalizowane wózki podnośnikowe ze zmiennym wysięgiem. Najwyższa kategoria uprawnień na wózki.",
    features: [
      "Uprawnia także do zwykłych wózków",
      "Praca na wysokości",
      "Egzamin UDT",
    ],
  },
  {
    id: "wozki-podnoszone",
    title: "Wózki z podnoszonym operatorem",
    price: "1550 zł",
    description:
      "Wózki kompletacyjne, gdzie operator podnosi się wraz z ładunkiem.",
    features: [
      "Praca w regałach wysokiego składowania",
      "Bezpieczna obsługa",
      "Egzamin UDT",
    ],
  },
  {
    id: "zurawie",
    title: "Żurawie (HDS, samojezdne)",
    price: "od 1100 zł",
    description:
      "Szkolenia na żurawie przenośne (HDS), przewoźne i samojezdne.",
    features: ["HDS: 1100 zł", "Samojezdne: 2450 zł", "Uprawnienia UDT"],
  },
  {
    id: "suwnice",
    title: "Suwnice (IS / IIS)",
    price: "1100 zł",
    description:
      "Obsługa suwnic sterowanych z poziomu roboczego (IIS) lub z kabiny (IS).",
    features: [
      "Suwnice ogólnego przeznaczenia",
      "Hakowe, wciągniki",
      "Egzamin UDT",
    ],
  },
  {
    id: "podesty-ruchome",
    title: "Podesty ruchome (zwyżki)",
    price: "1100 zł",
    description:
      "Podesty nożycowe i teleskopowe (tzw. zwyżki). Niezbędne do prac na wysokości.",
    features: ["Podesty wolnobieżne", "Podesty przewoźne", "Egzamin UDT"],
  },
  {
    id: "wciagarki",
    title: "Wciągarki i wciągniki",
    price: "900 zł",
    description:
      "Obsługa wciągników i wciągarek sterowanych z poziomu roboczego lub kabiny.",
    features: ["Zajęcia praktyczne", "Bezpieczna eksploatacja", "Egzamin UDT"],
  },
  {
    id: "odnowienie-udt",
    title: "Odnowienie uprawnień UDT",
    price: "Kontakt",
    description:
      "Dla osób, którym kończy się ważność zaświadczeń kwalifikacyjnych.",
    features: [
      "Przedłużenie ważności",
      "Weryfikacja wiedzy",
      "Pomoc w formalnościach",
    ],
  },
];

export const UDTSection = ({ setView }: { setView?: (view: any) => void }) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia UDT"
      description="Kompleksowe kursy na urządzenia transportu bliskiego. Zdobądź oficjalne uprawnienia Urzędu Dozoru Technicznego ważne bezterminowo lub terminowo zgodnie z przepisami."
      trainings={udtTrainings}
      heroImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" // Placeholder warehouse
      setView={setView}
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
