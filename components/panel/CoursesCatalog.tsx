import React from "react";
import {
  Edit,
  Plus,
  Search,
  Eye,
  Trash2,
  ChevronDown,
  Check,
  X,
  Users,
} from "lucide-react";
import { ADMIN_STUDENTS } from "../../constants";
import type { Course } from "../../types";

interface CoursesCatalogProps {
  title?: string;
  subtitle?: string;
  courses: Course[];
  variant?: "table" | "tiles";
  onBuyCourse?: (courseId: string) => void;
  buyLabel?: string;
  onCreateCourse?: () => void;
  onEditCourse?: (courseId: string) => void;
  onPreviewCourse: (courseId: string) => void;
  onDeleteCourse?: (courseId: string) => void;
}

export const CoursesCatalog: React.FC<CoursesCatalogProps> = ({
  title = "Katalog szkoleń",
  subtitle = "Zarządzaj szkoleniami i modułami szkoleniowymi.",
  courses,
  variant = "table",
  onBuyCourse,
  buyLabel = "Kup szkolenie",
  onCreateCourse,
  onEditCourse,
  onPreviewCourse,
  onDeleteCourse,
}) => {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<
    "Wszystkie" | Course["category"]
  >("Wszystkie");
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null,
  );

  const coursesInCategory = React.useMemo(() => {
    if (category === "Wszystkie") return courses;
    return courses.filter((course) => course.category === category);
  }, [category, courses]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coursesInCategory;
    return coursesInCategory.filter((course) => {
      const hay =
        `${course.title} ${course.category} ${course.price} ${course.promoPrice || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [coursesInCategory, query]);

  const getPromo = (training: Course) => {
    const promo = (training.promoPrice || "").trim();
    if (!promo) return null;
    if (promo === training.price) return null;
    return promo;
  };

  const participantStats = React.useMemo(() => {
    const map = new Map<string, { total: number; active: number }>();
    ADMIN_STUDENTS.forEach((student) => {
      const current = map.get(student.course) || { total: 0, active: 0 };
      current.total += 1;
      if (student.status === "active") current.active += 1;
      map.set(student.course, current);
    });
    return map;
  }, []);

  const tilesVariant = variant === "tiles";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        {onCreateCourse ? (
          <button
            onClick={onCreateCourse}
            className="flex items-center gap-2 bg-brand-accent text-white px-4 py-2 rounded-lg shadow hover:bg-brand-accentHover transition text-sm font-medium"
          >
            <Plus size={16} />
            Dodaj szkolenie
          </button>
        ) : null}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
            <div className="relative w-full md:max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent w-full"
                placeholder="Szukaj szkoleń..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="w-full md:w-auto">
              <div className="relative w-fit">
                <select
                  className="appearance-none w-fit pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent cursor-pointer"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as "Wszystkie" | Course["category"],
                    )
                  }
                  aria-label="Filtruj po kategorii"
                >
                  <option value="Wszystkie">Wszystkie kategorie</option>
                  <option value="UDT">UDT</option>
                  <option value="SEP">SEP</option>
                  <option value="BHP">BHP</option>
                  <option value="Inne">Inne</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <div className="text-2xl font-bold text-slate-900 leading-none">
              {courses.length}
            </div>
            <div className="text-xs font-semibold uppercase text-slate-500 mt-1">
              SZKOLEŃ
            </div>
          </div>
        </div>

        {tilesVariant ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const promo = getPromo(course);
              return (
                <div
                  key={course.id}
                  onClick={() => onPreviewCourse(course.id)}
                  className="bg-white rounded-sm shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100 cursor-pointer"
                >
                  <div className="relative aspect-3/2 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors z-10"></div>
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {course.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {(course as any).isPopular ? (
                      <span className="absolute top-4 right-4 z-20 bg-brand-accent text-white text-xs font-bold px-3 py-1 uppercase rounded-sm shadow-md">
                        Popularny
                      </span>
                    ) : null}
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <div className="text-xs font-bold text-brand-secondary uppercase mb-2">
                      {course.category}
                    </div>
                    <h3 className="text-lg font-heading font-bold text-brand-dark mb-4 leading-snug group-hover:text-brand-accent transition-colors">
                      {course.title}
                    </h3>

                    {course.description ? (
                      <p className="text-base text-slate-600 mb-4 line-clamp-3">
                        {course.description}
                      </p>
                    ) : null}

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase">
                          Cena
                        </span>
                        {promo ? (
                          <div className="leading-tight">
                            <div className="text-xs text-slate-400 line-through font-semibold">
                              {course.price}
                            </div>
                            <div className="text-lg font-bold text-brand-accent">
                              {promo}
                            </div>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-brand-primary">
                            {course.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewCourse(course.id);
                        }}
                        className="w-full py-3 border border-brand-primary text-brand-primary font-bold uppercase text-xs hover:bg-brand-primary hover:text-white transition-all rounded-sm"
                      >
                        Szczegóły
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBuyCourse) onBuyCourse(course.id);
                          else onPreviewCourse(course.id);
                        }}
                        className="w-full py-3 bg-brand-accent text-white font-bold uppercase text-xs hover:bg-brand-accentHover transition-all rounded-sm"
                      >
                        {buyLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Szkolenie</th>
                  <th className="px-4 py-3 text-center">Kategoria</th>
                  <th className="px-4 py-3 text-center">Uczestnicy</th>
                  <th className="px-4 py-3 text-center">Cena</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => {
                  const promo = getPromo(course);
                  const stats = participantStats.get(course.id) || {
                    total: 0,
                    active: 0,
                  };
                  const isDraft = course.status === "draft";
                  return (
                    <tr
                      key={course.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onPreviewCourse(course.id)}
                            className="h-16 w-16 rounded-md overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                            aria-label="Podgląd szkolenia"
                          >
                            {course.image ? (
                              <img
                                src={course.image}
                                alt={course.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs font-bold text-slate-500">
                                {course.title.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </button>
                          <button
                            onClick={() => onPreviewCourse(course.id)}
                            className="font-semibold text-slate-800 hover:text-brand-primary text-left"
                            title="Podgląd szkolenia"
                          >
                            {course.title}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setCategory(course.category)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
                          title={`Pokaż szkolenia: ${course.category}`}
                        >
                          {course.category}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                          <Users size={14} className="text-slate-500" />
                          <span>
                            {stats.active} / {stats.total}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          aktywni / łącznie
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {promo ? (
                          <div className="leading-tight">
                            <div className="text-xs text-slate-400 line-through font-semibold">
                              {course.price}
                            </div>
                            <div className="font-extrabold text-brand-accent">
                              {promo}
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-700 font-semibold">
                            {course.price}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            isDraft
                              ? "bg-slate-100 text-slate-600"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {isDraft ? "Wersja robocza" : "Opublikowany"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end">
                          <div className="relative w-32 h-10 overflow-hidden">
                            <div
                              className={`absolute inset-0 flex items-center justify-end transition-all ease-in-out ${
                                pendingDeleteId === course.id && onDeleteCourse
                                  ? "translate-x-0 opacity-100 duration-300"
                                  : "translate-x-full opacity-0 duration-500"
                              }`}
                            >
                              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-2 py-1 shadow-sm">
                                <div className="relative group">
                                  <button
                                    onClick={() => {
                                      if (!onDeleteCourse) return;
                                      onDeleteCourse(course.id);
                                      setPendingDeleteId(null);
                                    }}
                                    className="p-2 text-red-700 hover:bg-red-100 rounded-md transition"
                                    aria-label="Potwierdź usunięcie"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                    Potwierdź
                                  </div>
                                </div>
                                <div className="relative group">
                                  <button
                                    onClick={() => setPendingDeleteId(null)}
                                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
                                    aria-label="Anuluj usunięcie"
                                  >
                                    <X size={16} />
                                  </button>
                                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                    Anuluj
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={`absolute inset-0 flex items-center justify-end gap-2 transition-all ease-in-out ${
                                pendingDeleteId === course.id && onDeleteCourse
                                  ? "translate-x-full opacity-0 duration-300"
                                  : "translate-x-0 opacity-100 duration-500"
                              }`}
                            >
                              <div className="relative group">
                                <button
                                  onClick={() => onPreviewCourse(course.id)}
                                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                  aria-label="Podgląd"
                                >
                                  <Eye size={16} />
                                </button>
                                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                  Podgląd
                                </div>
                              </div>
                              {onEditCourse ? (
                                <div className="relative group">
                                  <button
                                    onClick={() => onEditCourse(course.id)}
                                    className="p-2 text-brand-accent hover:text-brand-accentHover hover:bg-orange-50 rounded-lg transition"
                                    aria-label="Edytuj"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                    Edytuj
                                  </div>
                                </div>
                              ) : null}
                              {onDeleteCourse && (
                                <div className="relative group">
                                  <button
                                    onClick={() =>
                                      setPendingDeleteId(course.id)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    aria-label="Usuń"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                    Usuń
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {category !== "Wszystkie" && coursesInCategory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Brak szkoleń w tej kategorii
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Brak wyników.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
