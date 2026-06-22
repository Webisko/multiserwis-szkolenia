import React from "react";
import SectionHeader from "../SectionHeader";
import {
  ChevronRight,
  Settings,
  Wrench,
  Truck,
  FileText,
  ShieldCheck,
  Clock,
  ArrowRight,
  Phone,
  CheckCircle,
} from "lucide-react";

interface Props {
  setView: (view: any) => void;
  importBaseUrl: string;
}

const ServicesView: React.FC<Props> = ({ setView, importBaseUrl }) => {
  return (
    <div className="animate-fade-in font-body">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-primary via-brand-primary/95 to-brand-secondary min-h-[500px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${importBaseUrl}serwis-i-koserwacja.webp`}
            alt="Usługi serwisowe"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-transparent"></div>
        </div>

        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 py-20">
          <button
            onClick={() => setView("HOME")}
            className="flex items-center gap-1 text-white/80 hover:text-white mb-8 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" /> Wróć do strony
            głównej
          </button>

          <div className="max-w-3xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
              Kompleksowa obsługa
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
              Usługi Serwisowe
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Profesjonalny serwis i konserwacja maszyn budowlanych. Przeglądy
              okresowe UDT, naprawy, modernizacje oraz mobilny serwis z dojazdem
              do klienta na terenie całej Polski.
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle size={24} className="text-brand-accent" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Doświadczenie</div>
                  <div className="font-bold text-white">15+ lat</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 backdrop-blur-sm flex items-center justify-center">
                  <Settings size={24} className="text-brand-accent" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Zrealizowanych</div>
                  <div className="font-bold text-white">2000+ serwisów</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 backdrop-blur-sm flex items-center justify-center">
                  <Clock size={24} className="text-brand-accent" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Czas reakcji</div>
                  <div className="font-bold text-white">24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-brand-surface py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeader subtitle="Zakres usług" title="Czym się zajmujemy?" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Settings size={32} />,
                title: "Przeglądy UDT",
                desc: "Kompleksowe przeglądy okresowe zgodne z wymogami UDT. Dokumentacja i certyfikaty.",
              },
              {
                icon: <Wrench size={32} />,
                title: "Naprawy bieżące",
                desc: "Szybkie reakcje na awarie. Diagnostyka i naprawa układów hydraulicznych, elektrycznych i mechanicznych.",
              },
              {
                icon: <Truck size={32} />,
                title: "Mobilny serwis",
                desc: "Dojazd do klienta na terenie całej Polski. Serwis w miejscu użytkowania maszyny.",
              },
              {
                icon: <FileText size={32} />,
                title: "Resursy i modernizacje",
                desc: "Kompleksowe remonty kapitalne. Modernizacja starszych maszyn do aktualnych norm.",
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Certyfikacja",
                desc: "Pomoc w uzyskaniu certyfikatów UDT. Kompletowanie dokumentacji technicznej.",
              },
              {
                icon: <Clock size={32} />,
                title: "Serwis gwarancyjny",
                desc: "Obsługa gwarancyjna maszyn. Współpraca z producentami i autoryzowanymi serwisami.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-sm shadow-sm hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center mb-6 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-brand-dark mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeader subtitle="Jak to działa?" title="Proces realizacji" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Kontakt",
                desc: "Zgłoszenie telefoniczne lub mailowe",
              },
              {
                step: "02",
                title: "Diagnostyka",
                desc: "Wstępna ocena zakresu prac",
              },
              {
                step: "03",
                title: "Wycena",
                desc: "Przygotowanie szczegółowej oferty",
              },
              {
                step: "04",
                title: "Realizacja",
                desc: "Wykonanie serwisu i dokumentacja",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 rounded-full bg-brand-primary text-white font-heading font-black text-3xl flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading font-bold text-brand-dark mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-6">
            Potrzebujesz serwisu swojej maszyny?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Skontaktuj się z nami – odpowiemy na wszystkie pytania i
            przygotujemy ofertę dopasowaną do Twoich potrzeb.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setView("CONTACT")}
              className="px-8 py-4 bg-brand-accent hover:bg-brand-accentHover text-white font-bold uppercase tracking-wider rounded-sm shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Skontaktuj się <ArrowRight size={20} />
            </button>
            <a
              href="tel:+48730101000"
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-brand-primary font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone size={20} /> +48 730 101 000
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-brand-surface py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeader
            subtitle="Pytania i odpowiedzi"
            title="Najczęściej zadawane pytania"
          />

          <div className="space-y-4">
            {[
              {
                q: "Jak często należy wykonywać przeglądy UDT?",
                a: "Częstotliwość przeglądów zależy od typu maszyny i intensywności użytkowania. Zazwyczaj przeglądy wykonuje się raz w roku lub co określoną liczbę motogodzin.",
              },
              {
                q: "Czy wykonujecie serwis na miejscu u klienta?",
                a: "Tak, dysponujemy mobilnym serwisem, który może dojechać do klienta na terenie całej Polski. Większość napraw i przeglądów wykonujemy bezpośrednio w miejscu użytkowania maszyny.",
              },
              {
                q: "Jakie maszyny serwisujecie?",
                a: "Serwisujemy szeroki zakres maszyn: wózki widłowe, podnośniki koszowe, ładowarki teleskopowe, koparki, zwyżki i inne maszyny budowlane wymagające przeglądów UDT.",
              },
              {
                q: "Czy otrzymam dokumentację po przeglądzie?",
                a: "Tak, po każdym przeglądzie wydajemy komplet dokumentacji zgodnej z wymogami UDT, w tym protokoły z badań i certyfikaty.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-sm shadow-sm group"
              >
                <summary className="p-6 cursor-pointer font-bold text-brand-dark hover:text-brand-primary transition-colors flex items-center justify-between">
                  {faq.q}
                  <ChevronRight
                    size={20}
                    className="transform group-open:rotate-90 transition-transform text-brand-accent"
                  />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
