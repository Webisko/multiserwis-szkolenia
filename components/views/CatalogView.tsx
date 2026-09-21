import React, { useState } from "react";
import { COURSES } from "../../constants";
import SectionHeader from "../SectionHeader";
import { GraduationCap, Search, MonitorPlay, Award, ArrowRight } from "lucide-react";
import { Course } from "../../types";

interface Props {
  catalogCategory: string;
  setCatalogCategory: (category: string) => void;
  setCurrentView: (view: any) => void;
  setSelectedCourseId: (id: string) => void;
  setView: (view: any) => void;
  courses?: Course[];
}

const CatalogView: React.FC<Props> = ({
  catalogCategory,
  setCatalogCategory,
  setCurrentView,
  setSelectedCourseId,
  setView,
  courses = COURSES,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const categoryMap: { [key: string]: string } = {
    Wszystkie: "ALL",
    "Urządzenia UDT": "UDT",
    "Uprawnienia SEP": "SEP",
    "BHP i PPOŻ": "BHP",
    "Maszyny Budowlane": "Inne",
  };

  const categories = [
    "Wszystkie",
    "Urządzenia UDT",
    "Uprawnienia SEP",
    "BHP i PPOŻ",
    "Maszyny Budowlane",
  ];

  const activeCourses = courses;

  const filteredCourses = activeCourses.filter((course) => {
    const matchesCategory =
      catalogCategory === "Wszystkie" ||
      course.category === categoryMap[catalogCategory];
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      course.title.toLowerCase().includes(q) ||
      (course.description && course.description.toLowerCase().includes(q)) ||
      (course.category && course.category.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 bg-brand-surface animate-fade-in font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          title="Katalog Szkoleń"
          subtitle="Przeglądaj certyfikowane kursy operatorów UDT, IMBiGS i uprawnienia SEP w Kutnie."
        />

        {/* Mobile Horizontal Category Filter Chips */}
        <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setCatalogCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 ${
                catalogCategory === cat
                  ? "bg-brand-accent text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="col-span-1 hidden lg:block space-y-8">
            <div className="bg-white p-6 rounded-sm shadow-xs border border-slate-100">
              <h3 className="font-heading font-bold text-lg mb-4 text-brand-dark">
                Kategorie
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {categories.map((cat, idx) => (
                  <li
                    key={idx}
                    onClick={() => setCatalogCategory(cat)}
                    className={`cursor-pointer px-3 py-2 rounded-sm transition-colors flex items-center justify-between ${
                      catalogCategory === cat
                        ? "bg-brand-primary/10 text-brand-primary font-bold"
                        : "hover:bg-slate-50 hover:text-brand-accent"
                    }`}
                  >
                    <span>{cat}</span>
                    {catalogCategory === cat && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-primary p-6 rounded-sm text-white shadow-sm">
              <h3 className="font-heading font-bold text-lg mb-2">
                Szkolenia dla Firm (B2B)
              </h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Przeszkolimy Twoich pracowników na naszym poligonie w Kutnie lub w siedzibie Twojej firmy. Faktura VAT i rabaty grupowe.
              </p>
              <button
                onClick={() => setCurrentView("contact")}
                className="w-full py-2.5 bg-brand-accent text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-brand-accentHover transition-colors"
              >
                Zapytaj o ofertę dla firm
              </button>
            </div>
          </div>

          {/* Course Grid with Search */}
          <div className="col-span-1 lg:col-span-3">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj szkolenia (np. wózki widłowe, ładowarka, koparka, podnośnik, SEP)..."
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-brand-accent text-slate-800 placeholder-slate-400 text-sm shadow-xs transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Wyczyść
                </button>
              )}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-sm shadow-xs p-12 text-center border border-slate-100">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap size={40} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-brand-dark mb-3">
                  Nie znaleziono szkoleń
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm">
                  {searchQuery
                    ? `Brak wyników dla hasła "${searchQuery}" w wybranej kategorii.`
                    : `W tym momencie nie mamy dostępnych szkoleń w kategorii "${catalogCategory}".`}
                </p>
                <div className="flex justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold uppercase text-xs rounded-sm hover:bg-slate-50 transition-colors"
                    >
                      Wyczyść filtr wyszukiwania
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setCatalogCategory("Wszystkie");
                      setSearchQuery("");
                    }}
                    className="px-5 py-2.5 bg-brand-accent text-white font-bold uppercase text-xs rounded-sm hover:bg-brand-accentHover transition-colors"
                  >
                    Wszystkie szkolenia
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setView("COURSE_DETAIL");
                    }}
                    className="bg-white rounded-sm shadow-xs overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100 cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors z-10"></div>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
                        <span className="bg-brand-primary/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 uppercase rounded-sm">
                          {course.category}
                        </span>
                        {course.hasOnline && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm flex items-center gap-1 shadow-xs">
                            <MonitorPlay size={10} /> Teoria Online
                          </span>
                        )}
                      </div>
                      {course.isPopular && (
                        <span className="absolute top-3 right-3 z-20 bg-brand-accent text-white text-[10px] font-bold px-2.5 py-1 uppercase rounded-sm shadow-md">
                          Popularny
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-heading font-bold text-brand-dark mb-3 leading-snug group-hover:text-brand-accent transition-colors">
                        {course.title}
                      </h3>

                      {course.description && (
                        <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Cena od
                          </span>
                          <span className="text-lg font-heading font-black text-brand-primary">
                            {course.priceOnline
                              ? `${course.priceOnline} zł`
                              : course.price}{" "}
                            <span className="text-xs font-semibold text-slate-500">
                              brutto
                            </span>
                          </span>
                        </div>
                        <span className="text-xs text-brand-accent font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Szczegóły <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogView;
