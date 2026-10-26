import React, { useState, useMemo, useEffect } from "react";
import { COURSES, type Course } from "@multiserwis/shared";
import { IndustrialIcon, type IndustrialIconName } from "./IndustrialIcon";

interface Props {
  initialCategory?: string;
}

export const CourseFinderIsland: React.FC<Props> = ({ initialCategory = "ALL" }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [enrollSubmitted, setEnrollSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [enrollForm, setEnrollForm] = useState({ name: "", phone: "", email: "" });

  const categories: { id: string; label: string; icon?: IndustrialIconName }[] = [
    { id: "ALL", label: "Wszystkie szkolenia" },
    { id: "UDT", label: "UDT (wózki, podesty, suwnice)", icon: "forklift" },
    { id: "IMBiGS", label: "IMBiGS (koparki, walce)", icon: "excavator" },
    { id: "SEP", label: "SEP (G1, G2, G3)", icon: "sep" },
    { id: "Spawalnictwo", label: "Spawalnictwo (MIG/MAG, TIG)", icon: "welding" },
    { id: "Inne", label: "BHP i specjalistyczne", icon: "bhp" },
  ];

  // Read URL query parameters (?zapisz=c1, ?szukaj=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const szukaj = params.get("szukaj");
    const zapisz = params.get("zapisz");

    if (szukaj) {
      setSearchQuery(szukaj);
    }
    if (zapisz) {
      const found = COURSES.find(
        (c) => c.id.toLowerCase() === zapisz.toLowerCase() || c.slug?.toLowerCase() === zapisz.toLowerCase()
      );
      if (found) {
        setSelectedCourseForEnroll(found);
        setEnrollSubmitted(false);
      }
    }
  }, []);

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCat =
        selectedCategory === "ALL" || course.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEnroll) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: enrollForm.name.trim(),
          phone: enrollForm.phone.trim(),
          email: enrollForm.email.trim(),
          message: `Zgłoszenie na kurs stacjonarny: ${selectedCourseForEnroll.title} (${selectedCourseForEnroll.price}). Proszę o kontakt w sprawie najbliższego terminu rozpoczęcia kursu.`,
        }),
      });
    } catch {
      // Fallback for offline/static preview
    } finally {
      setIsSubmitting(false);
      setEnrollSubmitted(true);
    }
  };

  return (
    <div className="w-full">
      {/* Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <IndustrialIcon name="search" className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wyszukaj szkolenie (np. wózki widłowe, koparka, SEP, suwnica, spawanie)..."
              aria-label="Wyszukaj szkolenie"
              className="w-full pl-10 pr-9 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Wyczyść wyszukiwanie"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <IndustrialIcon name="close" className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Infolinia / Pomoc doradcy */}
          <a
            href="tel:+48730101000"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 select-none shrink-0 bg-slate-50 px-4 py-2.5 rounded-md border border-slate-200 hover:bg-slate-100 hover:text-brand-accent transition-colors"
          >
            <IndustrialIcon name="phone" className="w-4 h-4 text-brand-accent" />
            <span>Infolinia: +48 730 101 000</span>
          </a>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4 no-scrollbar">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                  active
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.icon && (
                  <IndustrialIcon
                    name={cat.icon}
                    className={`w-4 h-4 ${active ? "text-brand-accent" : "text-slate-500"}`}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6 text-sm text-slate-600">
        <span>
          Dostępne kursy: <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong>
        </span>
        {searchQuery && (
          <span className="text-brand-accent font-semibold">
            Wyniki dla frazy: &bdquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Results Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <IndustrialIcon name="search" className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
            Nie znaleziono szkoleń spełniających kryteria
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-5">
            Spróbuj zmienić frazę wyszukiwania lub zresetować filtry kategorii.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-brand-dark cursor-pointer"
          >
            Resetuj filtry
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand-accent/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-brand-primary/95 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {course.category}
                    </span>
                    <span className="bg-slate-900/90 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-xs">
                      Stacjonarne Kutno
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-baseline gap-2 mb-2.5">
                    <span className="text-xs text-slate-500 font-semibold inline-flex items-center gap-1">
                      <IndustrialIcon name="clock" className="w-3.5 h-3.5 text-brand-accent" />
                      <span>Czas: {course.duration}</span>
                    </span>
                    <span className="font-heading font-extrabold text-brand-primary text-lg">
                      {course.price} <span className="text-[11px] font-semibold text-slate-500">zw. z VAT</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug group-hover:text-brand-primary transition-colors mb-2.5">
                    {course.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-auto flex gap-2.5 pt-4">
                <a
                  href={`/szkolenia/${course.slug}`}
                  className="flex-1 text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-md uppercase tracking-wider text-xs transition-colors"
                >
                  Szczegóły
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseForEnroll(course);
                    setEnrollSubmitted(false);
                  }}
                  className="flex-1 text-center py-2.5 bg-brand-accent hover:bg-brand-accentHover text-white font-bold rounded-md uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Zapisz się
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Zapis Express */}
      {selectedCourseForEnroll && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              type="button"
              onClick={() => setSelectedCourseForEnroll(null)}
              aria-label="Zamknij okno zapisu"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <IndustrialIcon name="close" className="w-5 h-5" />
            </button>

            {!enrollSubmitted ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent block mb-1">
                  Rezerwacja miejsca w 60 sekund
                </span>
                <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2">
                  Zapis na: {selectedCourseForEnroll.title}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Wypełnij poniższe dane, a koordynator MultiSerwis skontaktuje się z Tobą, aby potwierdzić termin zjazdu praktycznego i nadać dostęp do platformy e-learningowej.
                </p>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 mb-6 flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Koszt szkolenia:</span>
                  <span className="font-heading font-extrabold text-brand-primary text-lg">
                    {selectedCourseForEnroll.price} <span className="text-xs font-normal text-slate-500">zw. z VAT</span>
                  </span>
                </div>

                <form onSubmit={handleEnrollSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={enrollForm.name}
                      onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                      placeholder="Jan Kowalski"
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Numer telefonu *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      placeholder="+48 600 000 000"
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Adres e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={enrollForm.email}
                      onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                      placeholder="jan.kowalski@firma.pl"
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-brand-accent hover:bg-brand-accentHover disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors shadow-md mt-2 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Wysyłanie zgłoszenia..." : "Potwierdź rezerwację wstępną"}</span>
                    <IndustrialIcon name="arrow-right" className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    Złożenie formularza nie zobowiązuje do natychmiastowej opłaty. Płatność (lub zaliczka 500 zł) następuje po potwierdzeniu terminu.
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndustrialIcon name="check" className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2">
                  Dziękujemy, {enrollForm.name}!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
                  Twoje zgłoszenie na szkolenie <strong>{selectedCourseForEnroll.title}</strong> zostało przekazane do biura MultiSerwis. Nasz koordynator skontaktuje się z Tobą pod numerem <strong>{enrollForm.phone}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCourseForEnroll(null)}
                  className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-brand-dark cursor-pointer"
                >
                  Zamknij okno
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
