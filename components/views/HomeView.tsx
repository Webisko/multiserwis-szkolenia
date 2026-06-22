import React from "react";
import { TRANSLATIONS } from "../../constants";
import SectionHeader from "../SectionHeader";
import {
  ArrowRight,
  Wrench,
  Users,
  BookOpen,
  Clock,
  Award,
  MonitorPlay,
  ChevronRight,
  Truck,
  Settings,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";

import { Language, ViewState } from "../../types";

interface Props {
  language: Language;
  setView: (view: ViewState) => void;
  setSelectedCourseId: (id: string | null) => void;
  importBaseUrl: string;
}

const HomeView: React.FC<Props> = ({
  language,
  setView,
  setSelectedCourseId,
  importBaseUrl,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="animate-fade-in font-body">
      {/* 1. HERO SECTION */}
      <div className="relative h-[85vh] min-h-[600px] flex items-center bg-brand-dark overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${importBaseUrl}hero.webp`}
            alt="Workers with UDT Equipment"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                {t.hero.badge}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-[1.1] mb-6">
              {t.hero.title} <br />
              <span className="text-brand-accent">{t.hero.subtitle}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              {t.hero.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setView("CATALOG")}
                className="px-8 py-4 bg-brand-accent hover:bg-brand-accentHover text-white font-bold uppercase tracking-wider rounded-sm shadow-lg shadow-brand-accent/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {t.hero.cta1} <ArrowRight size={20} />
              </button>
              <button
                onClick={() => setView("SERVICES")}
                className="px-8 py-4 border-2 border-slate-300 text-white hover:bg-white hover:text-brand-dark font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2"
              >
                <Wrench size={20} /> {t.hero.cta2}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SOCIAL PROOF */}
      <div className="bg-brand-primary border-y border-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Item 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-r border-brand-secondary/50 last:border-0 md:pr-8">
              <Users size={40} className="text-brand-accent mb-4" />
              <div className="text-3xl md:text-4xl font-heading font-black text-white mb-1">
                5000+
              </div>
              <div className="text-sm uppercase tracking-widest text-slate-300 font-semibold">
                Przeszkolonych Osób
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-r border-brand-secondary/50 last:border-0 md:pr-8">
              <BookOpen size={40} className="text-brand-accent mb-4" />
              <div className="text-3xl md:text-4xl font-heading font-black text-white mb-1">
                40+
              </div>
              <div className="text-sm uppercase tracking-widest text-slate-300 font-semibold">
                Dostępnych Szkoleń
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-r border-brand-secondary/50 last:border-0 md:pr-8">
              <Clock size={40} className="text-brand-accent mb-4" />
              <div className="text-3xl md:text-4xl font-heading font-black text-white mb-1">
                15 Lat
              </div>
              <div className="text-sm uppercase tracking-widest text-slate-300 font-semibold">
                Doświadczenia
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Award size={40} className="text-brand-accent mb-4" />
              <div className="text-3xl md:text-4xl font-heading font-black text-white mb-1">
                98%
              </div>
              <div className="text-sm uppercase tracking-widest text-slate-300 font-semibold">
                Zdawalność Egzaminów
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEKCJA SZKOLEŃ (GRID) */}
      <div className="py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeader
            title="Najpopularniejsze Szkolenia"
            subtitle="Rozwiń swoją karierę"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Wózki Widłowe (Updated Copy) */}
            <div
              onClick={() => {
                setSelectedCourseId("c1");
                setView("COURSE_DETAIL");
              }}
              className="group bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 right-4 z-20 bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
                  <MonitorPlay size={12} /> Dostępna Teoria Online
                </div>
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/0 transition-colors z-10"></div>
                <img
                  src={`${importBaseUrl}operator-wozki-widlowe.webp`}
                  alt="Wózki Widłowe"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-heading font-bold text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">
                  Wózki Widłowe (I WJO)
                </h3>
                <p className="text-slate-600 text-base mb-6 leading-relaxed flex-grow">
                  {/* Specific Sales Copy Highlight */}
                  <span className="font-bold text-brand-primary block mb-2">
                    Ucz się teorii w domu, przyjedź tylko na egzamin praktyczny!
                  </span>
                  Oszczędź czas i pieniądze. Dzięki platformie e-learningowej
                  przyswoisz wiedzę w domowym zaciszu. 100% wsparcia
                  instruktora.
                </p>
                <div className="flex items-center text-brand-accent font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Zobacz szczegóły <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>

            {/* Card 2: Ładowarki */}
            <div
              onClick={() => {
                setSelectedCourseId("c2");
                setView("COURSE_DETAIL");
              }}
              className="group bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 right-4 z-20 bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
                  <MonitorPlay size={12} /> Dostępna Teoria Online
                </div>
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/0 transition-colors z-10"></div>
                <img
                  src={`${importBaseUrl}ladowarki-teleskopowe.webp`}
                  alt="Ładowarki Teleskopowe"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-heading font-bold text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">
                  Ładowarki Teleskopowe
                </h3>
                <p className="text-slate-600 text-base mb-6 leading-relaxed flex-grow">
                  Szkolenie na wielozadaniowe nośniki osprzętu. Najbardziej
                  poszukiwane uprawnienia w budownictwie.
                </p>
                <div className="flex items-center text-brand-accent font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Zobacz szczegóły <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>

            {/* Card 3: Koparki */}
            <div
              onClick={() => {
                setSelectedCourseId("c3");
                setView("COURSE_DETAIL");
              }}
              className="group bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 right-4 z-20 bg-brand-accent text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
                  Stacjonarnie
                </div>
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/0 transition-colors z-10"></div>
                <img
                  src={`${importBaseUrl}koparki.webp`}
                  alt="Koparki"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-heading font-bold text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">
                  Koparko-Ładowarki
                </h3>
                <p className="text-slate-600 text-base mb-6 leading-relaxed flex-grow">
                  Obsługa maszyn do robót ziemnych kl. III. Praktyka na placu
                  manewrowym w Kutnie.
                </p>
                <div className="flex items-center text-brand-accent font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Zobacz szczegóły <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEKCJA USŁUG */}
      <div className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent/5 rounded-tr-full -z-0"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <SectionHeader
            title="Usługi dla Przemysłu"
            subtitle="Kompleksowe wsparcie"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Wynajem */}
            <div
              onClick={() => setView("RENTALS")}
              className="flex flex-col md:flex-row bg-slate-50 rounded-sm overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="md:w-2/5 relative min-h-[200px]">
                <img
                  src={`${importBaseUrl}wynajem-maszyn.webp`}
                  alt="Wynajem"
                  className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-brand-accent">
                  <Truck size={24} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-brand-dark mb-2">
                  Wynajem Maszyn
                </h3>
                <p className="text-slate-600 mb-6 text-base">
                  Flota ładowarek teleskopowych i podnośników koszowych dostępna
                  od ręki. Krótki i długi termin.
                </p>
                <span className="text-brand-dark font-bold text-sm uppercase underline decoration-brand-accent decoration-2 underline-offset-4 group-hover:text-brand-accent transition-colors">
                  Zobacz dostępny sprzęt
                </span>
              </div>
            </div>

            {/* Konserwacja */}
            <div
              onClick={() => setView("SERVICES")}
              className="flex flex-col md:flex-row bg-slate-50 rounded-sm overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="md:w-2/5 relative min-h-[200px]">
                <img
                  src={`${importBaseUrl}serwis-i-koserwacja.webp`}
                  alt="Serwis"
                  className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-brand-secondary">
                  <Settings size={24} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-brand-dark mb-2">
                  Serwis i Konserwacja
                </h3>
                <p className="text-slate-600 mb-6 text-base">
                  Przeglądy okresowe UDT, resursy, naprawy bieżące. Mobilny
                  serwis z dojazdem do klienta.
                </p>
                <span className="text-brand-dark font-bold text-sm uppercase underline decoration-brand-secondary decoration-2 underline-offset-4 group-hover:text-brand-secondary transition-colors">
                  Umów serwis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SEO FOOTER */}
      <div className="bg-slate-100 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-heading font-bold text-brand-primary mb-6">
                Profesjonalne Centrum Szkoleniowe MultiSerwis
              </h2>
              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  Jesteśmy liderem w branży szkoleniowej w regionie centralnej
                  Polski. Oferujemy certyfikowane
                  <strong className="text-slate-800">
                    {" "}
                    Szkolenia UDT w Kutnie
                  </strong>{" "}
                  oraz okolicach. Naszą misją jest dostarczanie najwyższej
                  jakości edukacji zawodowej, łączącej teorię z praktyką.
                </p>
                <p>
                  Szukasz szkolenia na maszyny budowlane? Nasze{" "}
                  <strong className="text-slate-800">
                    szkolenie operatora koparki
                  </strong>{" "}
                  oraz ładowarki teleskopowej przygotuje Cię do egzaminu
                  państwowego z najwyższą skutecznością. Posiadamy własny plac
                  manewrowy oraz nowoczesne sale wykładowe.
                </p>
                <p>
                  Dla wygody naszych klientów wprowadziliśmy również szkolenia
                  hybrydowe. Teoria odbywa się online, a zajęcia praktyczne
                  realizujemy na naszym sprzęcie. Sprawdź również naszą ofertę
                  wynajmu podnośników.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                  <MapPin size={16} className="text-brand-accent" /> Kutno i
                  okolice
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                  <Calendar size={16} className="text-brand-accent" /> Terminy
                  co tydzień
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-brand-accent/10 rounded-full blur-xl"></div>
              <div className="relative bg-white p-8 rounded-sm shadow-lg border-l-4 border-brand-accent">
                <h3 className="font-heading font-bold text-lg mb-4 text-brand-dark">
                  Dlaczego warto wybrać MultiSerwis?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Własny park maszynowy i hala szkoleniowa",
                    "Załatwiamy wszelkie formalności z UDT",
                    "Materiały dydaktyczne w cenie kursu",
                    "Elastyczne godziny zajęć praktycznych",
                    "Certyfikat w języku angielskim (opcja)",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-base text-slate-700"
                    >
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
