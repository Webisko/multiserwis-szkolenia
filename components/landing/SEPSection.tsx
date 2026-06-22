import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const sepTrainings: TrainingItem[] = [
  {
    id: "sep-g1",
    title: "SEP G1 – Elektryczne",
    price: "Zapytaj o cenę",
    description:
      "Uprawnienia dla elektryków. Obsługa, konserwacja, remonty i montaż urządzeń, instalacji i sieci elektroenergetycznych.",
    features: [
      "Do 1 kV (nn)",
      "Powyżej 1 kV (SN, WN)",
      "Pomiary elektryczne",
      "Egzamin SEP",
    ],
  },
  {
    id: "sep-g2",
    title: "SEP G2 – Energetyczne",
    price: "Zapytaj o cenę",
    description:
      "Uprawnienia dla energetyków. Eksploatacja urządzeń, instalacji i sieci cieplnych oraz energetycznych.",
    features: ["Kotły, turbiny, sieci", "Dozór i eksploatacja", "Egzamin SEP"],
  },
  {
    id: "sep-g3",
    title: "SEP G3 – Gazowe",
    price: "Zapytaj o cenę",
    description:
      "Uprawnienia gazowe. Obsługa, konserwacja, remonty i montaż urządzeń i instalacji gazowych.",
    features: ["Sieci gazowe", "Urządzenia i instalacje", "Egzamin SEP"],
  },
];

export const SEPSection = ({ setView }: { setView?: (view: any) => void }) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia SEP (G1, G2, G3)"
      description="Kursy przygotowujące do egzaminów kwalifikacyjnych Stowarzyszenia Elektryków Polskich. Zdobądź uprawnienia w zakresie eksploatacji (E) i dozoru (D) urządzeń, instalacji i sieci."
      trainings={sepTrainings}
      heroImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e" // Electrical cabling / work
      setView={setView}
      servicePromo={{
        title: "Usługi elektryczne i energetyczne",
        description:
          "Wykonujemy kompleksowe pomiary elektryczne, instalacje przemysłowe, uruchomienia i rozruch technologiczny. Działamy w branży energetycznej i gazowej.",
        linkText: "Sprawdź usługi elektryczne",
        linkUrl: "https://multiserwis-kutno.pl/elektryka",
      }}
    />
  );
};
