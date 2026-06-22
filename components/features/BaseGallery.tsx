import React from "react";
import { MapPin, Navigation, Info } from "lucide-react";

export const BaseGallery: React.FC = () => {
  // Mock Images from Unsplash
  const images = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", // Warehouse
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80", // Construction site
    "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80", // Training room (generic)
    "https://images.unsplash.com/photo-1581092160562-4042b6a2b252?w=800&q=80", // Forklift
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-slate-800 mb-6">
          Nasza Baza Szkoleniowa
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Description */}
          <div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Dysponujemy nowoczesną bazą szkoleniową w Kutnie, wyposażoną w
              profesjonalny sprzęt oraz komfortowe sale wykładowe. Nasz plac
              manewrowy pozwala na praktyczną naukę obsługi maszyn w
              bezpiecznych warunkach.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-start gap-3 text-slate-700">
                <span className="bg-brand-accent/10 text-brand-accent p-1 rounded mt-0.5">
                  <Info size={16} />
                </span>
                <span>
                  <strong>Hala szkoleniowa:</strong> Ogrzewana hala warsztatowa
                  z dostępem do suwnic i wózków.
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="bg-brand-accent/10 text-brand-accent p-1 rounded mt-0.5">
                  <Info size={16} />
                </span>
                <span>
                  <strong>Plac manewrowy:</strong> Utwardzony teren do ćwiczeń
                  na koparkach i ładowarkach.
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="bg-brand-accent/10 text-brand-accent p-1 rounded mt-0.5">
                  <Info size={16} />
                </span>
                <span>
                  <strong>Sale wykładowe:</strong> Klimatyzowane, wyposażone w
                  multimedia (projektory, materiały dydaktyczne).
                </span>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-slate-50 rounded border border-slate-200">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <MapPin className="text-brand-accent" size={18} /> Lokalizacja
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                ul. Siemieradzkiego 18, 99-300 Kutno
              </p>
              <a
                href="https://maps.google.com/?q=Kutno+Siemieradzkiego+18"
                target="_blank"
                rel="noreferrer"
                className="text-brand-primary text-sm font-bold flex items-center gap-1 hover:underline"
              >
                <Navigation size={14} /> Prowadź do celu
              </a>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${idx === 0 ? "col-span-2 h-48 md:h-64" : "h-32 md:h-40"}`}
              >
                <img
                  src={img}
                  alt={`Baza szkoleniowa ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
