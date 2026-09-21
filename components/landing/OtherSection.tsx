import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const otherTrainings: TrainingItem[] = [
  {
    id: "kontrola-zawiesi",
    title: "Specjalista ds. kontroli zawiesi",
    price: "600 zł",
    description:
      "Uprawnienia do kontroli stanu technicznego zawiesi linowych, łańcuchowych i pasowych oraz osprzętu dźwigowego.",
    features: ["Kryteria zużycia i brakowania", "Dokumentacja i rejestr kontroli", "Czas trwania: 1 dzień", "Cena zwolniona z VAT"],
  },
  {
    id: "pilarki",
    title: "Operator pilarek mechanicznych",
    price: "550 zł",
    description:
      "Obsługa pilarek łańcuchowych spalinowych i elektrycznych przy pracach leśnych, ogrodniczych i budowlanych.",
    features: [
      "BHP i techniki bezpiecznej ścinki",
      "Konserwacja i ostrzenie układu tnącego",
      "Czas trwania: 1 dzień",
      "Cena zwolniona z VAT",
    ],
  },
  {
    id: "kosy",
    title: "Operator kos spalinowych i wykaszarek",
    price: "600 zł",
    description: "Obsługa, konserwacja i bezpieczna praca wykaszarkami oraz kosami spalinowymi.",
    features: ["BHP przy pracach komunalnych", "Wymiana elementów tnących", "Czas trwania: 1 dzień", "Cena zwolniona z VAT"],
  },
  {
    id: "podesty-zaladowcze",
    title: "Podesty załadowcze (windy samochodowe)",
    price: "500 zł",
    description: "Obsługa burt samowyładowczych i wind montowanych na samochodach ciężarowych i dostawczych.",
    features: [
      "Niezbędne dla kierowców i kurierów",
      "Obsługa sterownic i awaryjne opuszczanie",
      "Czas trwania: 1 dzień",
      "Cena zwolniona z VAT",
    ],
  },
  {
    id: "urzadzenia-hakowe",
    title: "Urządzenia hakowe i bramowe",
    price: "550 zł",
    description: "Obsługa pojazdów z systemami załadunku hakowego i bramowego (przewóz kontenerów i odpadów).",
    features: ["Techniki załadunku i zabezpieczenia", "Eksploatacja hydrauliki", "Czas trwania: 1 dzień", "Cena zwolniona z VAT"],
  },
  {
    id: "hakowy",
    title: "Hakowy – Sygnalista",
    price: "kontakt tel.",
    description: "Szkolenie dla pracowników współpracujących z operatorami dźwigów, żurawi i suwnic.",
    features: ["Mocowanie i stabilizacja ładunków", "Sygnalizacja ręczna i radiowa", "Czas trwania: 1 dzień", "Zajęcia praktyczne"],
  },
];

export const OtherSection = ({
  setView,
  setSelectedCourseId,
}: {
  setView?: (view: any) => void;
  setSelectedCourseId?: (id: string | null) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia Pozostałe"
      description="Specjalistyczne kursy techniczne uzupełniające kwalifikacje zawodowe. Od obsługi pilarek po uprawnienia hakowego."
      trainings={otherTrainings}
      heroImage="https://images.unsplash.com/photo-1542838132-92c53300491e" // General industry / construction
      setView={setView}
      setSelectedCourseId={setSelectedCourseId}
      servicePromo={{
        title: "Kompleksowa obsługa techniczna",
        description:
          "Zapewniamy przeglądy techniczne zawiesi, konserwację urządzeń dźwigowych oraz specjalistyczne usługi leśne i komunalne.",
        linkText: "Zobacz pełną ofertę usług",
        linkUrl: "https://multiserwis-kutno.pl/uslugi",
      }}
    />
  );
};
