import React, { useState, useMemo } from "react";
import { COURSES, type Course } from "@multiserwis/shared";

interface Props {
  initialCategory?: string;
}

export const CourseFinderIsland: React.FC<Props> = ({ initialCategory = "ALL" }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [enrollSubmitted, setEnrollSubmitted] = useState<boolean>(false);
  const [enrollForm, setEnrollForm] = useState({ name: "", phone: "", email: "" });

  const categories = [
    { id: "ALL", label: "Wszystkie szkolenia" },
    { id: "UDT", label: "🚜 UDT (Wózki, Zwyżki)" },
    { id: "IMBiGS", label: "🏗️ IMBiGS (Koparki)" },
    { id: "SEP", label: "⚡ SEP (Elektryczne)" },
    { id: "Spawalnictwo", label: "🔥 Spawalnictwo" },
  ];

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCat =
        selectedCategory === "ALL" || course.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOnline = !onlyOnline || course.hasOnline;

      return matchesCat && matchesSearch && matchesOnline;
    });
  }, [selectedCategory, searchQuery, onlyOnline]);

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wyszukaj szkolenie (np. wózki, koparka, sep, suwnica)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Toggle Online Theory */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none shrink-0 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200/60 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={onlyOnline}
              onChange={(e) => setOnlyOnline(e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
            />
            <span>Tylko z e-learningiem 24/7</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6 text-xs text-slate-500">
        <span>
          Znaleziono: <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong> szkoleń
        </span>
        {searchQuery && (
          <span className="text-orange-600 font-medium">
            Wyniki dla frazy: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Results Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="text-3xl mb-2">🔎</div>
          <h3 className="font-heading font-bold text-slate-800 text-base mb-1">
            Nie znaleziono szkoleń spełniających kryteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Spróbuj zmienić frazę wyszukiwania lub zresetować filtry kategorii.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setOnlyOnline(false);
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded-sm hover:bg-slate-800"
          >
            Resetuj filtry
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 bg-slate-900 overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs backdrop-blur-xs">
                      {course.category}
                    </span>
                    {course.hasOnline && (
                      <span className="bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs backdrop-blur-xs">
                        E-learning
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-baseline gap-2 mb-2">
                    <span className="text-xs text-slate-400 font-semibold">Czas: {course.duration}</span>
                    <span className="font-heading font-black text-slate-900 text-base">
                      {course.price}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug group-hover:text-orange-600 transition-colors mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-50 flex gap-2">
                <a
                  href={`/szkolenia/${course.slug}`}
                  className="flex-1 text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-sm uppercase tracking-wider text-[11px] transition-colors"
                >
                  Szczegóły
                </a>
                <button
                  onClick={() => {
                    setSelectedCourseForEnroll(course);
                    setEnrollSubmitted(false);
                  }}
                  className="flex-1 text-center py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-sm uppercase tracking-wider text-[11px] transition-colors cursor-pointer shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              onClick={() => setSelectedCourseForEnroll(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            {!enrollSubmitted ? (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
                  Rezerwacja miejsca w 60 sekund
                </span>
                <h3 className="text-xl font-heading font-black text-slate-900 mb-2">
                  Zapis na: {selectedCourseForEnroll.title}
                </h3>
                <p className="text-xs text-slate-600 mb-6">
                  Wypełnij dane, a koordynator MultiSerwis skontaktuje się z Tobą, aby potwierdzić termin zjazdu praktycznego i nadać login do platformy e-learningowej.
                </p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-6 flex justify-between items-center text-xs">
                  <span className="text-slate-600">Koszt szkolenia:</span>
                  <span className="font-heading font-black text-slate-900 text-base">
                    {selectedCourseForEnroll.price}
                  </span>
                </div>

                <form onSubmit={handleEnrollSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={enrollForm.name}
                      onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                      placeholder="Jan Kowalski"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Numer telefonu *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      placeholder="+48 600 000 000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Adres e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={enrollForm.email}
                      onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                      placeholder="jan@firma.pl"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-md mt-2 cursor-pointer"
                  >
                    Potwierdź rezerwację wstępną →
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    Złożenie formularza nie zobowiązuje do zapłaty. Płatność następuje przed rozpoczęciem zajęć.
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-heading font-black text-slate-900 mb-2">
                  Dziękujemy, {enrollForm.name}!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                  Twoje zgłoszenie na szkolenie <strong>{selectedCourseForEnroll.title}</strong> zostało zarejestrowane. Nasz koordynator odezwie się telefonicznie na numer <strong>{enrollForm.phone}</strong>.
                </p>
                <button
                  onClick={() => setSelectedCourseForEnroll(null)}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-slate-800"
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
