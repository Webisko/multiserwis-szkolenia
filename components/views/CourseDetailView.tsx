import React, { useState } from "react";
import { COURSES } from "../../constants";
import { JOB_PROGRAMS } from "../../lib/mockData";
import { ChevronRight, Award, CheckCircle, ChevronDown } from "lucide-react";
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
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    null,
  );

  const course = courses.find((c) => c.id === selectedCourseId);
  if (!course) return null;

  const program = JOB_PROGRAMS[course.id] || JOB_PROGRAMS["c1"];

  const handleBuy = (variant: "ONLINE" | "STATIONARY") => {
    if (!onBuyCourse) return;
    onBuyCourse(course.id, variant);
  };

  return (
    <div className="animate-fade-in font-body">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-brand-primary via-brand-primary/95 to-brand-secondary min-h-125 flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-primary via-brand-primary/80 to-transparent"></div>
        </div>

        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 py-20">
          <button
            onClick={() => setView("CATALOG")}
            className="flex items-center gap-1 text-white/80 hover:text-white mb-8 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" /> Wróć do katalogu
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
                {course.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl">
                {course.description ||
                  "Kompleksowe szkolenie przygotowujące do egzaminu państwowego z najwyższą skutecznością."}
              </p>

              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <Award size={24} className="text-brand-accent" />
                  <div>
                    <div className="text-sm text-white/70">Certyfikat UDT</div>
                    <div className="font-bold text-white">
                      Uznawany zawodowo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-2xl p-8 sticky top-24 space-y-6">
                {/* Variant Selection Logic */}
                {(course.hasOnline || !course.hasStationary) && (
                  <div className="p-4 border border-brand-primary/10 rounded-sm bg-brand-primary/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-brand-dark">
                        Teoria Online
                      </span>
                      <span className="text-xl font-black text-brand-primary">
                        {course.priceOnline
                          ? `${course.priceOnline} PLN`
                          : `${course.price}`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleBuy("ONLINE")}
                      className="w-full bg-brand-primary text-white py-3 font-bold uppercase text-xs rounded-sm hover:bg-brand-dark transition-colors"
                    >
                      Wybierz Online
                    </button>
                  </div>
                )}

                {course.hasStationary && (
                  <div className="p-4 border border-brand-accent/20 rounded-sm bg-brand-accent/5">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-bold text-brand-dark">
                          Stacjonarnie
                        </div>
                        {course.location && (
                          <div className="text-xs text-slate-500">
                            {course.location}
                          </div>
                        )}
                      </div>
                      <span className="text-xl font-black text-brand-primary">
                        {course.priceStationary
                          ? `${course.priceStationary} PLN`
                          : "Zapytaj"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleBuy("STATIONARY")}
                      className="w-full bg-brand-accent text-white py-3 font-bold uppercase text-xs rounded-sm hover:bg-brand-accentHover transition-colors"
                    >
                      Wybierz Pełny Kurs
                    </button>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="text-green-600 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-slate-700">
                      Certyfikat ukończenia
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="text-green-600 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-slate-700">
                      Dostęp do materiałów 24/7
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
              {/* O szkoleniu */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-primary mb-6">
                  O szkoleniu
                </h2>
                <p className="text-base text-slate-600 leading-relaxed mb-4">
                  Szkolenie {course.title.toLowerCase()} to kompleksowy program,
                  który przygotowuje operatorów do pracy z maszynami
                  budowlanymi. Program obejmuje zarówno wiedzę teoretyczną, jak
                  i praktyczne umiejętności niezbędne do bezpiecznej
                  eksploatacji sprzętu.
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Szkolenie kończy się egzaminem państwowego UDT, którego zdanie
                  uprawnia do pracy zawodowej na terenie całej Polski.
                </p>
              </div>

              {/* Program */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-primary mb-6">
                  Program szkolenia
                </h2>
                <div className="space-y-3">
                  {program.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-sm border border-slate-200"
                    >
                      <button
                        onClick={() =>
                          setOpenAccordionIndex(
                            openAccordionIndex === idx ? null : idx,
                          )
                        }
                        className="w-full flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-slate-700 font-bold text-left">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown
                          style={{
                            transform:
                              openAccordionIndex === idx
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.5s ease-in-out",
                          }}
                          className={`shrink-0 ${openAccordionIndex === idx ? "text-brand-accent" : "text-slate-400"}`}
                          size={24}
                        />
                      </button>
                      <div
                        style={{
                          maxHeight:
                            openAccordionIndex === idx ? "500px" : "0px",
                          opacity: openAccordionIndex === idx ? 1 : 0,
                          transition:
                            "max-height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                          overflow: "hidden",
                        }}
                      >
                        <div className="px-5 pb-5 pt-3 bg-slate-50 border-t border-slate-200">
                          <ul className="space-y-2.5 ml-14">
                            {item.details.map((detail, detailIdx) => (
                              <li
                                key={detailIdx}
                                className="flex items-start gap-3 text-slate-600"
                              >
                                <CheckCircle
                                  size={18}
                                  className="text-green-600 shrink-0 mt-0.5"
                                />
                                <span className="text-sm leading-relaxed">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wymagania */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-primary mb-6">
                  Wymagania wstępne
                </h2>
                <ul className="space-y-3">
                  {[
                    "Ukończone 18 lat",
                    "Stan zdrowia pozwalający na pracę na wysokościach",
                    "Zaświadczenie lekarskie",
                    "Dokument tożsamości",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-slate-600"
                    >
                      <CheckCircle
                        size={20}
                        className="text-green-600 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-sm p-8 sticky top-24 space-y-6">
                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold mb-2">
                    Kategoria
                  </p>
                  <p className="text-lg font-bold text-brand-primary">
                    {course.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold mb-2">
                    Cena
                  </p>
                  <p className="text-2xl font-heading font-black text-brand-primary">
                    {course.price}
                  </p>
                </div>

                <button className="w-full bg-brand-primary text-white py-3 font-bold uppercase text-sm rounded-sm hover:bg-brand-dark transition-colors">
                  Zapisz się
                </button>

                <div className="bg-brand-accent/10 p-4 rounded-sm border-l-4 border-brand-accent">
                  <p className="text-sm font-bold text-brand-primary mb-2">
                    📞 Masz pytania?
                  </p>
                  <p className="text-sm text-slate-600">
                    Skontaktuj się z nami - chętnie pomożemy!
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

export default CourseDetailView;
