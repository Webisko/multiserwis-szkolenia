import React, { useState } from "react";
import { COURSES } from "../../constants";
import { JOB_PROGRAMS } from "../../lib/mockData";
import {
  ChevronRight,
  Award,
  CheckCircle,
  ChevronDown,
  ShieldCheck,
  Clock,
  Calendar,
  GraduationCap,
  PhoneCall,
  MapPin,
  FileText,
  UserCheck,
} from "lucide-react";
import { Language, ViewState, Course } from "../../types";

interface Props {
  selectedCourseId: string | null;
  setView: (view: ViewState) => void;
  setSelectedCourseId: (id: string | null) => void;
  language: Language;
  courses?: Course[];
  onBuyCourse?: (courseId: string, variant: "ONLINE" | "STATIONARY") => void;
}

const CourseDetailView: React.FC<Props> = ({
  selectedCourseId,
  setView,
  setSelectedCourseId,
  language,
  courses = COURSES,
  onBuyCourse,
}) => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  // Safe fallback to first course so screen is never blank if ID is missing or incorrect
  const course =
    courses.find((c) => c.id === selectedCourseId || c.slug === selectedCourseId) ||
    courses[0];
  if (!course) return null;

  const program =
    JOB_PROGRAMS[course.id] ||
    (course.slug && JOB_PROGRAMS[course.slug]) ||
    (selectedCourseId && JOB_PROGRAMS[selectedCourseId]) ||
    JOB_PROGRAMS["c1"] ||
    [];

  const handleBuy = (variant: "ONLINE" | "STATIONARY") => {
    if (!onBuyCourse) return;
    onBuyCourse(course.id, variant);
  };

  return (
    <div className="animate-fade-in font-body">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-primary via-brand-primary/95 to-brand-secondary min-h-125 flex items-center overflow-hidden">
        {/* Background Image with Darker Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/85 to-transparent"></div>
        </div>

        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 py-16">
          <button
            onClick={() => setView("CATALOG")}
            className="flex items-center gap-1 text-white/80 hover:text-white mb-6 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ChevronRight size={16} className="rotate-180" /> Wróć do katalogu szkoleń
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                  {course.category}
                </span>
                {course.hasOnline && (
                  <span className="inline-block bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                    Dostępna teoria online 24/7
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
                {course.title}
              </h1>

              <p className="text-base md:text-lg text-slate-200 mb-8 leading-relaxed max-w-2xl font-light">
                {course.description ||
                  "Kompleksowe szkolenie teoretyczne i praktyczne przygotowujące do państwowego egzaminu UDT z najwyższą zdawalnością w regionie."}
              </p>

              <div className="flex flex-wrap gap-6 text-white text-sm">
                <div className="flex items-center gap-2.5">
                  <Award size={22} className="text-brand-accent" />
                  <div>
                    <div className="text-xs text-white/70">Uprawnienia państwowe</div>
                    <div className="font-bold">Certyfikat UDT / IMBiGS</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={22} className="text-brand-accent" />
                  <div>
                    <div className="text-xs text-white/70">Miejsce praktyki</div>
                    <div className="font-bold">Poligon Kutno</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={22} className="text-brand-accent" />
                  <div>
                    <div className="text-xs text-white/70">Terminy zajęć</div>
                    <div className="font-bold">Nowe grupy co tydzień</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Buy/Registration Box */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-2xl p-6 sm:p-8 sticky top-24 space-y-6 border border-slate-100">
                <h3 className="font-heading font-bold text-lg text-brand-dark pb-2 border-b border-slate-100">
                  Wybierz dogodny format
                </h3>

                {/* Variant: Online */}
                {(course.hasOnline || !course.hasStationary) && (
                  <div className="p-4 border-2 border-brand-primary/20 rounded-sm bg-brand-primary/5 hover:border-brand-primary transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-brand-dark text-sm block">
                          Teoria Online (E-learning)
                        </span>
                        <span className="text-xs text-slate-500">
                          + jazdy praktyczne i egzamin
                        </span>
                      </div>
                      <span className="text-xl font-heading font-black text-brand-primary">
                        {course.priceOnline
                          ? `${course.priceOnline} zł`
                          : `${course.price}`}{" "}
                        <span className="text-[10px] text-slate-500 font-semibold">
                          brutto
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => handleBuy("ONLINE")}
                      className="w-full mt-3 bg-brand-primary text-white py-3 font-bold uppercase text-xs tracking-wider rounded-sm hover:bg-brand-dark transition-colors cursor-pointer"
                    >
                      Wybierz Wariant Online
                    </button>
                  </div>
                )}

                {/* Variant: Stationary */}
                {course.hasStationary && (
                  <div className="p-4 border-2 border-brand-accent/30 rounded-sm bg-brand-accent/5 hover:border-brand-accent transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-brand-dark text-sm block">
                          Kurs Stacjonarny
                        </span>
                        <span className="text-xs text-slate-500">
                          sala wykładowa + plac w Kutnie
                        </span>
                      </div>
                      <span className="text-xl font-heading font-black text-brand-primary">
                        {course.priceStationary
                          ? `${course.priceStationary} zł`
                          : course.price}{" "}
                        <span className="text-[10px] text-slate-500 font-semibold">
                          brutto
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => handleBuy("STATIONARY")}
                      className="w-full mt-3 bg-brand-accent text-white py-3 font-bold uppercase text-xs tracking-wider rounded-sm hover:bg-brand-accentHover transition-colors cursor-pointer shadow-md shadow-brand-accent/20"
                    >
                      Wybierz Kurs Pełny
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                    <span>Załatwiamy wszelkie formalności z UDT</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                    <span>Dostęp do bazy pytań testowych 24/7</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                    <span>Faktura VAT dla firm i raty</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-sm border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Zadzwoń do doradcy:</div>
                      <a
                        href="tel:+48730101000"
                        className="text-sm font-heading font-bold text-brand-dark hover:text-brand-accent transition-colors"
                      >
                        +48 730 101 000
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-brand-surface py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-16">
              {/* 1. OPIS */}
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-primary mb-6">
                  O szkoleniu
                </h2>
                <div className="space-y-4 text-base text-slate-600 leading-relaxed">
                  <p>
                    Szkolenie <strong>{course.title}</strong> prowadzone przez MultiSerwis w Kutnie to sprawdzony program przygotowujący do egzaminu przed państwową komisją <strong>Urzędu Dozoru Technicznego (UDT)</strong> lub IMBiGS.
                  </p>
                  <p>
                    Program łączy solidną wiedzę techniczną z dużą liczbą godzin praktyki na profesjonalnym sprzęcie. Uczestnicy poznają budowę maszyny, zasady bezpiecznej eksploatacji (BHP), procedury awaryjne oraz metody prawidłowego manewrowania z ładunkiem.
                  </p>
                  <p>
                    Po zdanym egzaminie otrzymujesz bezterminowe lub terminowe (zgodnie z przepisami prawa) zaświadczenie kwalifikacyjne uprawniające do legalnej pracy w całej Polsce i Unii Europejskiej.
                  </p>
                </div>
              </div>

              {/* 2. INFOGRAFIKA PROCESU: JAK TO DZIAŁA (1-2-3) */}
              <div className="bg-white p-8 rounded-sm shadow-xs border border-slate-200">
                <h2 className="text-2xl font-heading font-bold text-brand-primary mb-8">
                  Ścieżka do zdobycia uprawnień w 3 krokach
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Step 1 */}
                  <div className="flex flex-col relative">
                    <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-heading font-black text-lg mb-4 shadow-sm">
                      1
                    </div>
                    <h3 className="font-heading font-bold text-base text-brand-dark mb-2">
                      Zapis online
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Rejestrujesz się przez stronę lub telefonicznie w 2 minuty. Wybierasz dogodny termin i tryb nauki.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col relative">
                    <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center font-heading font-black text-lg mb-4 shadow-sm">
                      2
                    </div>
                    <h3 className="font-heading font-bold text-base text-brand-dark mb-2">
                      Teoria online 24/7
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Dostęp do materiałów e-learningowych, filmów instruktażowych i oficjalnych pytań testowych UDT na telefonie lub PC.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-heading font-black text-lg mb-4 shadow-sm">
                      3
                    </div>
                    <h3 className="font-heading font-bold text-base text-brand-dark mb-2">
                      Praktyka & Egzamin
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Praktyczne jazdy z instruktorem na naszym placu w Kutnie oraz egzamin państwowy przed komisją UDT.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. PROGRAM SZKOLENIA (ACCORDION) */}
              {program.length > 0 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-primary mb-6">
                    Program szkolenia
                  </h2>
                  <div className="space-y-3">
                    {program.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-sm border border-slate-200 overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setOpenAccordionIndex(
                              openAccordionIndex === idx ? null : idx,
                            )
                          }
                          className="w-full flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
                              {idx + 1}
                            </div>
                            <span className="text-slate-800 font-bold text-left text-sm md:text-base">
                              {item.title}
                            </span>
                          </div>
                          <ChevronDown
                            className={`shrink-0 transition-transform duration-300 ${
                              openAccordionIndex === idx
                                ? "rotate-180 text-brand-accent"
                                : "text-slate-400"
                            }`}
                            size={20}
                          />
                        </button>
                        {openAccordionIndex === idx && (
                          <div className="px-5 pb-5 pt-2 bg-slate-50/70 border-t border-slate-100">
                            <ul className="space-y-2.5 ml-12">
                              {item.details.map((detail, detailIdx) => (
                                <li
                                  key={detailIdx}
                                  className="flex items-start gap-3 text-slate-600 text-sm"
                                >
                                  <CheckCircle
                                    size={16}
                                    className="text-emerald-600 shrink-0 mt-0.5"
                                  />
                                  <span className="leading-relaxed">
                                    {detail}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. WYMAGANIA FORMALNE DLA KANDYDATÓW */}
              <div className="bg-white p-8 rounded-sm shadow-xs border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <UserCheck className="text-brand-accent w-7 h-7" />
                  <h2 className="text-2xl font-heading font-bold text-brand-primary">
                    Wymagania formalne dla kandydatów
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Ukończone 18 lat",
                      desc: "Wymóg formalny określony w ustawie o dozorze technicznym.",
                    },
                    {
                      title: "Wykształcenie min. podstawowe",
                      desc: "Wystarczy świadectwo ukończenia szkoły podstawowej lub gimnazjum.",
                    },
                    {
                      title: "Orzeczenie lekarskie",
                      desc: "Brak przeciwwskazań zdrowotnych do pracy na urządzeniach transportu bliskiego.",
                    },
                    {
                      title: "Prawo jazdy kat. B (opcjonalnie)",
                      desc: "Wymagane tylko, jeśli masz zamiar poruszać się maszyną po drogach publicznych.",
                    },
                  ].map((req, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-sm bg-slate-50 border border-slate-100 flex items-start gap-3"
                    >
                      <CheckCircle
                        size={18}
                        className="text-emerald-600 shrink-0 mt-0.5"
                      />
                      <div>
                        <div className="font-heading font-bold text-sm text-slate-800 mb-1">
                          {req.title}
                        </div>
                        <div className="text-xs text-slate-500 leading-relaxed">
                          {req.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column (Empty or additional support on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-brand-primary p-6 rounded-sm text-white shadow-sm">
                <h3 className="font-heading font-bold text-lg mb-3">
                  Szkolisz grupę pracowników?
                </h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  Zorganizujemy szkolenie zamknięte na terenie Twojej firmy w dogodnym terminie. Oferujemy elastyczne stawki i opiekuna B2B.
                </p>
                <button
                  onClick={() => setView("CONTACT")}
                  className="w-full py-3 bg-brand-accent text-white font-bold uppercase text-xs tracking-wider rounded-sm hover:bg-brand-accentHover transition-colors cursor-pointer"
                >
                  Zapytaj o ofertę dla firm
                </button>
              </div>

              <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-heading font-bold text-sm text-brand-dark uppercase tracking-wider">
                  Dlaczego MultiSerwis Kutno?
                </h4>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span>Własny park maszynowy i certyfikowany poligon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span>98% zdawalności na egzaminie państwowym</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span>Opcjonalny certyfikat w języku angielskim i niemieckim</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;
