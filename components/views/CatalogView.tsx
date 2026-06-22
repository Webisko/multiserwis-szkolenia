import React, { useState } from "react";
import { COURSES } from "../../constants";
import SectionHeader from "../SectionHeader";
import { GraduationCap } from "lucide-react";
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
  const categoryMap: { [key: string]: string } = {
    Wszystkie: "ALL",
    "Urządzenia UDT": "UDT",
    "Uprawnienia SEP": "SEP",
    "BHP i PPOŻ": "BHP",
    "Maszyny Budowlane": "Inne",
  };

  const activeCourses = courses;

  const filteredCourses =
    catalogCategory === "Wszystkie"
      ? activeCourses
      : activeCourses.filter(
          (course) => course.category === categoryMap[catalogCategory],
        );

  return (
    <div className="py-12 bg-brand-surface animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          title="Katalog Szkoleń"
          subtitle="Przeglądaj dostępne szkolenia i podnoś swoje kwalifikacje."
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="col-span-1 hidden lg:block space-y-8">
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="font-heading font-bold text-lg mb-4 text-brand-dark">
                Kategorie
              </h3>
              <ul className="space-y-2 text-base text-slate-600">
                {[
                  "Wszystkie",
                  "Urządzenia UDT",
                  "Uprawnienia SEP",
                  "BHP i PPOŻ",
                  "Maszyny Budowlane",
                ].map((cat, idx) => (
                  <li
                    key={idx}
                    onClick={() => setCatalogCategory(cat)}
                    className={`cursor-pointer hover:text-brand-accent transition-colors ${catalogCategory === cat ? "text-brand-accent font-bold" : ""}`}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-primary p-6 rounded-sm text-white">
              <h3 className="font-heading font-bold text-lg mb-2">
                Potrzebujesz szkolenia dla firmy?
              </h3>
              <p className="text-base text-slate-300 mb-4">
                Przygotujemy indywidualną ofertę dla Twoich pracowników.
              </p>
              <button
                onClick={() => setCurrentView("contact")}
                className="w-full py-2 bg-brand-accent text-white text-sm font-bold uppercase rounded-sm hover:bg-brand-accentHover transition-colors"
              >
                Zapytaj o ofertę
              </button>
            </div>
          </div>

          {/* Course Grid */}
          <div className="col-span-1 lg:col-span-3">
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap size={40} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-brand-dark mb-3">
                  Brak szkoleń w tej kategorii
                </h3>
                <p className="text-slate-600 mb-6">
                  W tym momencie nie mamy dostępnych szkoleń w kategorii "
                  {catalogCategory}".
                </p>
                <button
                  onClick={() => setCatalogCategory("Wszystkie")}
                  className="px-6 py-3 bg-brand-accent text-white font-bold uppercase text-sm rounded-sm hover:bg-brand-accentHover transition-colors"
                >
                  Zobacz wszystkie szkolenia
                </button>
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
                    className="bg-white rounded-sm shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100 cursor-pointer"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors z-10"></div>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      {course.isPopular && (
                        <span className="absolute top-4 right-4 z-20 bg-brand-accent text-white text-xs font-bold px-3 py-1 uppercase rounded-sm shadow-md">
                          Popularny
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs font-bold text-brand-secondary uppercase mb-2">
                        {course.category}
                      </div>
                      <h3 className="text-lg font-heading font-bold text-brand-dark mb-4 leading-snug group-hover:text-brand-accent transition-colors">
                        {course.title}
                      </h3>

                      {/* Enhanced Description Area */}
                      {course.description && (
                        <p className="text-base text-slate-600 mb-4 line-clamp-3">
                          {course.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 uppercase">
                            Cena
                          </span>
                          <span className="text-lg font-bold text-brand-primary">
                            {course.price}
                          </span>
                        </div>
                      </div>
                      <button className="mt-4 w-full py-3 border border-brand-primary text-brand-primary font-bold uppercase text-sm hover:bg-brand-primary hover:text-white transition-all rounded-sm">
                        Szczegóły Szkolenia
                      </button>
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
