import React from "react";
import { MACHINES } from "../../constants";
import { ChevronRight, Truck, CheckCircle, Wrench } from "lucide-react";

interface Props {
  selectedMachineId: string | null;
  setView: (view: any) => void;
}

const MachineDetailView: React.FC<Props> = ({ selectedMachineId, setView }) => {
  const machine = MACHINES.find((m) => m.id === selectedMachineId);
  if (!machine) return null;

  return (
    <div className="animate-fade-in font-body">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-primary via-brand-primary/95 to-brand-secondary min-h-[500px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={machine.image}
            alt={machine.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-transparent"></div>
        </div>

        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 py-20">
          <button
            onClick={() => setView("RENTALS")}
            className="flex items-center gap-1 text-white/80 hover:text-white mb-8 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" /> Wróć do wynajmu
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
                {machine.type}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
                {machine.name}
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl">
                Profesjonalna maszyna budowlana dostępna do wynajmu. Idealna do
                prac na wysokości i w trudno dostępnych miejscach.
              </p>

              <div className="flex flex-wrap gap-8">
                {Object.entries(machine.specs).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-accent/20 backdrop-blur-sm flex items-center justify-center">
                      <Truck size={24} className="text-brand-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-white/70 capitalize">
                        {key}
                      </div>
                      <div className="font-bold text-white">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-2xl p-8 sticky top-24">
                <div className="text-sm text-slate-500 uppercase font-bold mb-2">
                  Od
                </div>
                <div className="text-4xl font-heading font-black text-brand-primary mb-2">
                  250 PLN
                </div>
                <p className="text-slate-500 text-sm mb-8">za dobę / netto</p>

                <button className="w-full bg-brand-primary text-white py-4 font-bold uppercase text-sm rounded-sm hover:bg-brand-dark transition-colors mb-4">
                  Zapytaj o dostępność
                </button>
                <button className="w-full border-2 border-brand-primary text-brand-primary py-3 font-bold uppercase text-sm rounded-sm hover:bg-slate-50 transition-colors">
                  Pobierz ofertę PDF
                </button>

                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-slate-700">
                      Możliwość transportu
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-slate-700">
                      Ubezpieczenie w cenie
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-slate-700">
                      Obsługa operatora opcjonalnie
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-brand-surface py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* O maszynie */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-primary mb-6">
                  Opis maszyny
                </h2>
                <p className="text-base text-slate-600 leading-relaxed mb-4">
                  {machine.name} to profesjonalna maszyna budowlana z najwyższej
                  półki. Zapewnia maksymalne bezpieczeństwo pracy oraz komfort
                  obsługi dzięki nowoczesnym systemom sterowania.
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Idealna do prac budowlanych, instalacyjnych i konserwacyjnych
                  na wysokości. Kompaktowa konstrukcja pozwala na pracę w trudno
                  dostępnych miejscach.
                </p>
              </div>

              {/* Specyfikacja */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-primary mb-6">
                  Specyfikacja techniczna
                </h2>
                <div className="bg-white rounded-sm shadow-sm p-6 space-y-4">
                  {Object.entries(machine.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="text-slate-600 capitalize font-medium">
                        {key}
                      </span>
                      <span className="font-bold text-brand-dark text-lg">
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-slate-600 font-medium">
                      Typ napędu
                    </span>
                    <span className="font-bold text-brand-dark text-lg">
                      Elektryczny
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">
                      Certyfikaty
                    </span>
                    <span className="font-bold text-brand-dark text-lg">
                      CE, UDT
                    </span>
                  </div>
                </div>
              </div>

              {/* Zastosowanie */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-primary mb-6">
                  Zastosowanie
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Prace budowlane",
                    "Instalacje elektryczne",
                    "Konserwacja budynków",
                    "Prace magazynowe",
                    "Montaż konstrukcji",
                    "Prace wykończeniowe",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-4 rounded-sm border-l-4 border-brand-accent"
                    >
                      <Wrench
                        size={20}
                        className="text-brand-accent flex-shrink-0"
                      />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-sm p-8 sticky top-24 space-y-6">
                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold mb-2">
                    Maszyna
                  </p>
                  <p className="text-lg font-bold text-brand-primary">
                    {machine.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold mb-2">
                    Typ
                  </p>
                  <p className="text-lg font-bold text-brand-primary">
                    {machine.type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold mb-2">
                    Cena najmu
                  </p>
                  <p className="text-2xl font-heading font-black text-brand-primary">
                    250 PLN/doba
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Rabat przy dłuższym najmie
                  </p>
                </div>

                <button className="w-full bg-brand-primary text-white py-3 font-bold uppercase text-sm rounded-sm hover:bg-brand-dark transition-colors">
                  Zarezerwuj
                </button>

                <div className="bg-brand-accent/10 p-4 rounded-sm border-l-4 border-brand-accent">
                  <p className="text-sm font-bold text-brand-primary mb-2">
                    📞 Potrzebujesz pomocy?
                  </p>
                  <p className="text-sm text-slate-600">
                    Zadzwoń: +48 730 101 000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailView;
