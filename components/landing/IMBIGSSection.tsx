import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const imbigsTrainings: TrainingItem[] = [
  {
    id: "koparko-ladowarki",
    title: "Koparko-ładowarki (Kl. III)",
    price: "2250 zł",
    description:
      "Obsługa koparko-ładowarek, najpopularniejszych maszyn na budowach.",
    features: ["Wszystkie typy", "Egzamin IMBiGS", "Cena zwolniona z VAT"],
  },
  {
    id: "koparki",
    title: "Koparki jednonaczyniowe (Kl. III)",
    price: "2250 zł",
    description:
      "Uprawnienia na koparki jednonaczyniowe do 25 ton masy całkowitej (Kl. III).",
    features: ["Prace ziemne", "Wymiana osprzętu", "Egzamin IMBiGS"],
  },
  {
    id: "ladowarki",
    title: "Ładowarki jednonaczyniowe (Kl. III)",
    price: "2250 zł",
    description:
      "Obsługa ładowarek jednonaczyniowych do 20 ton masy całkowitej.",
    features: ["Załadunek materiałów", "Transport bliski", "Egzamin IMBiGS"],
  },
  {
    id: "walce",
    title: "Walce drogowe (Kl. II)",
    price: "2300 zł",
    description: "Uprawnienia na wszystkie typy walców drogowych.",
    features: ["Zagęszczanie gruntu", "Budowa dróg", "Egzamin IMBiGS"],
  },
  {
    id: "spycharki",
    title: "Spycharki (Kl. III)",
    price: "Zapytaj o cenę",
    description: "Obsługa spycharek do 110 kW mocy silnika.",
    features: ["Niwelacja terenu", "Prace ziemne", "Egzamin IMBiGS"],
  },
  {
    id: "rowniarki",
    title: "Równiarki drogowe",
    price: "2300 zł",
    description: "Specjalistyczne maszyny do profilowania podłoża.",
    features: ["Budownictwo drogowe", "Precyzyjne prace", "Egzamin IMBiGS"],
  },
  {
    id: "frezarki",
    title: "Frezarki do nawierzchni",
    price: "2300 zł",
    description: "Usuwanie starych nawierzchni bitumicznych.",
    features: ["Obsługa frezarki", "Eksploatacja", "Egzamin IMBiGS"],
  },
  {
    id: "rozkladarki",
    title: "Rozkładarki mas bitumicznych",
    price: "2300 zł",
    description: "Układanie nawierzchni asfaltowych.",
    features: ["Budowa dróg", "Obsługa rozściełacza", "Egzamin IMBiGS"],
  },
  {
    id: "pompy-beton",
    title: "Pompy do betonu",
    price: "2300 zł",
    description:
      "Obsługa pomp do mieszanki betonowej (mobilnych i stacjonarnych).",
    features: ["Pompowanie betonu", "Bezpieczna praca", "Egzamin IMBiGS"],
  },
];

export const IMBIGSSection = ({
  setView,
}: {
  setView?: (view: any) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia IMBiGS"
      description="Kursy na maszyny budowlane i drogowe certyfikowane przez Instytut Mechanizacji Budownictwa i Górnictwa Skalnego. Zdobądź zawód operatora maszyn budowlanych."
      trainings={imbigsTrainings}
      heroImage="https://images.unsplash.com/photo-1541625602330-2277a4c46182" // Construction excavator
      setView={setView}
      servicePromo={{
        title: "Realizujemy inwestycje budowlane",
        description:
          "Multiserwis to nie tylko szkolenia. Świadczymy kompleksowe usługi budowlane dla sektora przemysłowego, w tym roboty ziemne i drogowe.",
        linkText: "Zobacz ofertę usług budowlanych",
        linkUrl: "https://multiserwis-kutno.pl/budownictwo",
      }}
    />
  );
};
