import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const sepTrainings: TrainingItem[] = [
  {
    id: "sep-g1",
    title: "SEP G1 – Elektryczne (E + D)",
    price: "860 zł / upr.",
    description:
      "Uprawnienia dla elektryków i monterów. Eksploatacja (E) i Dozór (D) urządzeń, instalacji i sieci elektroenergetycznych.",
    features: [
      "Cena: 860 zł Eksploatacja / 860 zł Dozór",
      "Do 1 kV (nn) oraz powyżej 1 kV (SN, WN)",
      "Czas trwania: 1 dzień (termin telefonicznie)",
      "Ważność uprawnień: 5 lat (zwolnione z VAT)",
    ],
  },
  {
    id: "sep-g2",
    title: "SEP G2 – Cieplne i Energetyczne (E + D)",
    price: "860 zł / upr.",
    description:
      "Uprawnienia energetyczne. Eksploatacja (E) i Dozór (D) urządzeń wytwarzających, przetwarzających i zużywających ciepło.",
    features: [
      "Cena: 860 zł Eksploatacja / 860 zł Dozór",
      "Kotły, piece, turbiny, sieci ciepłownicze",
      "Czas trwania: 1 dzień (termin telefonicznie)",
      "Ważność uprawnień: 5 lat (zwolnione z VAT)",
    ],
  },
  {
    id: "sep-g3",
    title: "SEP G3 – Gazowe (E + D)",
    price: "860 zł / upr.",
    description:
      "Uprawnienia gazowe. Eksploatacja (E) i Dozór (D) urządzeń, instalacji i sieci gazowych paliw gazowych.",
    features: [
      "Cena: 860 zł Eksploatacja / 860 zł Dozór",
      "Sieci, instalacje i odbiorniki gazowe",
      "Czas trwania: 1 dzień (termin telefonicznie)",
      "Ważność uprawnień: 5 lat (zwolnione z VAT)",
    ],
  },
];

export const SEPSection = ({
  setView,
  setSelectedCourseId,
}: {
  setView?: (view: any) => void;
  setSelectedCourseId?: (id: string | null) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia SEP (G1, G2, G3)"
      description="Kursy przygotowujące do egzaminów kwalifikacyjnych Stowarzyszenia Elektryków Polskich. Zdobądź uprawnienia w zakresie eksploatacji (E) i dozoru (D) urządzeń, instalacji i sieci."
      trainings={sepTrainings}
      heroImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e" // Electrical cabling / work
      setView={setView}
      setSelectedCourseId={setSelectedCourseId}
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
