import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const imbigsTrainings: TrainingItem[] = [
  {
    id: "koparko-ladowarki",
    title: "Koparko-ładowarki (Kl. III)",
    price: "2350 zł",
    description:
      "Obsługa koparko-ładowarek wszystkich typów. Najpopularniejsze uprawnienia w branży budowlanej.",
    features: ["Wszystkie typy maszyn", "Egzamin ŚBŁ-WIT", "Książka operatora", "Cena zwolniona z VAT"],
  },
  {
    id: "koparki",
    title: "Koparki jednonaczyniowe (Kl. III)",
    price: "2350 zł",
    description:
      "Uprawnienia na koparki jednonaczyniowe do 25 ton masy całkowitej (Kl. III).",
    features: ["Prace ziemne i wykopy", "Wymiana osprzętu roboczego", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
  {
    id: "ladowarki",
    title: "Ładowarki jednonaczyniowe (Kl. III)",
    price: "2350 zł",
    description:
      "Obsługa ładowarek jednonaczyniowych do 20 ton masy całkowitej w robotach ziemnych.",
    features: ["Załadunek materiałów", "Transport bliski na budowie", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
  {
    id: "walce",
    title: "Walce drogowe (Kl. II)",
    price: "2500 zł",
    description: "Uprawnienia na wszystkie typy walców drogowych w budownictwie infrastrukturalnym.",
    features: ["Zagęszczanie gruntu i asfaltu", "Techniki drogowe", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
  {
    id: "spycharki",
    title: "Spycharki (Kl. III)",
    price: "2500 zł",
    description: "Obsługa spycharek gąsienicowych i kołowych do 110 kW mocy silnika.",
    features: ["Niwelacja terenu i skarpowanie", "Prace lemieszem", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
  {
    id: "rowniarki",
    title: "Równiarki drogowe",
    price: "2500 zł",
    description: "Specjalistyczne maszyny do precyzyjnego profilowania podłoża i nasypów.",
    features: ["Budownictwo drogowe", "Precyzyjne profilowanie", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
  {
    id: "frezarki",
    title: "Frezarki do nawierzchni dróg",
    price: "2500 zł",
    description: "Frezowanie warstw asfaltowych i przygotowanie nawierzchni drogowej pod remont.",
    features: ["Obsługa frezarki", "Bezpieczeństwo robót drogowych", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
  {
    id: "rozkladarki",
    title: "Rozkładarki mas bitumicznych",
    price: "2600 zł",
    description: "Układanie mieszanek mineralno-asfaltowych przy budowie dróg i autostrad.",
    features: ["Układanie mas asfaltowych", "Kontrola jakości nawierzchni", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
  {
    id: "pompy-beton",
    title: "Pompy do betonu",
    price: "2600 zł",
    description:
      "Obsługa wysięgnikowych i stacjonarnych pomp do mieszanki betonowej na budowie.",
    features: ["Podawanie mieszanki betonowej", "Mycie i konserwacja", "Egzamin ŚBŁ-WIT", "Cena zwolniona z VAT"],
  },
];

export const IMBIGSSection = ({
  setView,
  setSelectedCourseId,
}: {
  setView?: (view: any) => void;
  setSelectedCourseId?: (id: string | null) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia Maszyny Budowlane (ŚBŁ-WIT / IMBiGS)"
      description="Kursy operatorów maszyn budowlanych i drogowych certyfikowane przez Warszawski Instytut Technologiczny – Sieć Badawcza Łukasiewicz (ŚBŁ-WIT). Uzyskaj państwowe zaświadczenie kwalifikacyjne i książkę operatora."
      trainings={imbigsTrainings}
      heroImage="https://images.unsplash.com/photo-1541625602330-2277a4c46182" // Construction excavator
      setView={setView}
      setSelectedCourseId={setSelectedCourseId}
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
