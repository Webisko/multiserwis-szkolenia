import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const otherTrainings: TrainingItem[] = [
  {
    id: "kontrola-zawiesi",
    title: "Specjalista ds. kontroli zawiesi",
    price: "600 zł",
    description:
      "Uprawnienia do kontroli stanu technicznego zawiesi i osprzętu dźwigowego.",
    features: ["Kryteria brakowania", "Dokumentacja kontroli", "Zaświadczenie"],
  },
  {
    id: "pilarki",
    title: "Operator pilarek mechanicznych",
    price: "500 zł",
    description:
      "Obsługa pilarek spalinowych i elektrycznych do ścinki i pielęgnacji drzew.",
    features: [
      "BHP przy pracy pilarką",
      "Konserwacja układu tnącego",
      "Zaświadczenie",
    ],
  },
  {
    id: "kosy",
    title: "Operator kos spalinowych",
    price: "450 zł",
    description: "Obsługa wykaszarek i kos spalinowych.",
    features: ["Bezpieczeństwo pracy", "Eksploatacja", "Zaświadczenie"],
  },
  {
    id: "podesty-zaladowcze",
    title: "Podesty załadowcze (windy)",
    price: "450 zł",
    description: "Obsługa burt samowyładowczych montowanych na pojazdach.",
    features: [
      "Dla kierowców i dostawców",
      "Bezpieczna obsługa",
      "Zaświadczenie",
    ],
  },
  {
    id: "urzadzenia-hakowe",
    title: "Urządzenia hakowe i bramowe",
    price: "500 zł",
    description: "Obsługa hakowców i bramowców (systemy wymienne nadwozi).",
    features: ["Transport kontenerów", "Egzamin UDT/TDT", "Zaświadczenie"],
  },
  {
    id: "hakowy",
    title: "Hakowy – Sygnalista",
    price: "400 zł",
    description: "Szkolenie dla osób współpracujących z operatorem dźwigu.",
    features: ["Mocowanie ładunków", "Sygnały dźwigowe", "Bezpieczeństwo"],
  },
];

export const OtherSection = ({
  setView,
}: {
  setView?: (view: any) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia Pozostałe"
      description="Specjalistyczne kursy techniczne uzupełniające kwalifikacje zawodowe. Od obsługi pilarek po uprawnienia hakowego."
      trainings={otherTrainings}
      heroImage="https://images.unsplash.com/photo-1542838132-92c53300491e" // General industry / construction
      setView={setView}
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
