import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const weldingTrainings: TrainingItem[] = [
  {
    id: "spawanie-mig-mag",
    title: "Spawanie MIG/MAG",
    price: "Zapytaj o cenę",
    description:
      "Najpopularniejsza metoda spawania w osłonie gazów (metody 131, 135, 136). Spawanie stali czarnej, nierdzewnej i aluminium.",
    features: [
      "Norma PN-EN ISO 9606-1",
      "Zajęcia praktyczne",
      "Książeczka spawacza",
    ],
  },
  {
    id: "spawanie-tig",
    title: "Spawanie TIG",
    price: "Zapytaj o cenę",
    description:
      "Metoda 141 - spawanie elektrodą nietopliwą w osłonie argonu. Najwyższa jakość spoin, głównie do rur i materiałów cienkościennych.",
    features: [
      "Stal nierdzewna, aluminium",
      "Wysoka precyzja",
      "Certyfikat spawacza",
    ],
  },
  {
    id: "spawanie-elektryczne",
    title: "Spawanie elektryczne (MMA)",
    price: "Zapytaj o cenę",
    description:
      "Metoda 111 - spawanie elektrodą otuloną. Uniwersalna metoda montażowa, sprawdzająca się w trudnych warunkach terenowych.",
    features: [
      "Spawanie w każdej pozycji",
      "Szkolenie od podstaw",
      "Egzamin kwalifikacyjny",
    ],
  },
];

export const WeldingSection = ({
  setView,
}: {
  setView?: (view: any) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia Spawalnicze"
      description="Zdobądź ceniony zawód spawacza. Oferujemy kursy na wszystkie najpopularniejsze metody spawania, kończące się uzyskaniem Książeczki Spawacza i Certyfikatu zgodnego z normami europejskimi."
      trainings={weldingTrainings}
      heroImage="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1" // Welding sparks
      setView={setView}
      servicePromo={{
        title: "Usługi spawalnicze i ślusarskie",
        description:
          "Wykonujemy konstrukcje stalowe, rurociągi przemysłowe oraz naprawy elementów maszyn. Spawamy metodami MIG/MAG, TIG i MMA.",
        linkText: "Zobacz usługi spawalnicze",
        linkUrl: "https://multiserwis-kutno.pl/spawalnictwo",
      }}
    />
  );
};
