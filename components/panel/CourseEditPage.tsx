import React from "react";
import { ArrowLeft, Eye, Save, Trash2, Plus } from "lucide-react";
import type { Course } from "../../types";
import { COURSE_CURRICULUM } from "../../constants";
import LessonTextEditor from "../LessonTextEditor";
import { CourseQuestionsEditor } from "../admin/CourseQuestionsEditor";

interface CourseEditPageProps {
  course: Course | null;
  onBack: () => void;
  onSave: (course: Course) => void;
  onPreview: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  mode?: "admin" | "manager";
  intent?: "create" | "edit";
}

const slugify = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ż/g, "z")
    .replace(/ź/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const CourseEditPage: React.FC<CourseEditPageProps> = ({
  course,
  onBack,
  onSave,
  onPreview,
  onDelete,
  mode = "admin",
  intent = "edit",
}) => {
  const [formState, setFormState] = React.useState<Course | null>(course);

  const coverFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const seoFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = React.useState<"published" | "draft">(
    course?.status === "archived"
      ? "draft"
      : course?.status || (intent === "create" ? "draft" : "published"),
  );
  const [promoVideoUrl, setPromoVideoUrl] = React.useState("");
  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");
  const [seoImage, setSeoImage] = React.useState("");
  const [fullDescription, setFullDescription] = React.useState("");
  const [autoCertificate, setAutoCertificate] = React.useState(true);

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Nie udało się odczytać pliku."));
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(file);
    });

  React.useEffect(() => {
    setFormState(course);
    setFullDescription(course?.description || "");
    setMetaTitle(course?.seoTitle || "");
    setMetaDescription(course?.seoDescription || "");
    setSeoImage(course?.seoImage || "");
    setStatus(
      course?.status === "archived"
        ? "draft"
        : course?.status || (intent === "create" ? "draft" : "published"),
    );
  }, [course, intent]);

  if (!formState) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p className="text-slate-500">Nie znaleziono szkolenia.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
        >
          Wróć
        </button>
      </div>
    );
  }

  const getSeoLengthMeter = (
    value: string,
    opts: { min: number; max: number; label: string },
  ) => {
    const length = (value || "").trim().length;
    const inRange = length >= opts.min && length <= opts.max;
    const tooShort = length < opts.min;
    const tooLong = length > opts.max;

    const progressToMin =
      opts.min === 0
        ? 100
        : Math.min(100, Math.round((length / opts.min) * 100));
    const barPercent = tooShort ? progressToMin : 100;

    const toneClasses = inRange
      ? { bar: "bg-emerald-500", text: "text-emerald-700" }
      : tooLong
        ? { bar: "bg-rose-500", text: "text-rose-700" }
        : { bar: "bg-amber-500", text: "text-amber-700" };

    const statusText = inRange ? "OK" : tooShort ? "Za krótki" : "Za długi";
    const secondaryText = tooShort
      ? `${length}/${opts.min} do minimum`
      : tooLong
        ? `${length} znaków (max ${opts.max})`
        : `${length} znaków`;

    return {
      length,
      barPercent,
      inRange,
      statusText,
      toneClasses,
      helperText: `Rekomendowane: ${opts.min}–${opts.max} znaków.`,
      ariaLabel: `${opts.label}: ${length} znaków. ${statusText}.`,
      secondaryText,
    };
  };

  const seoTitleMeter = getSeoLengthMeter(metaTitle, {
    min: 50,
    max: 60,
    label: "Meta tytuł",
  });
  const seoDescMeter = getSeoLengthMeter(metaDescription, {
    min: 150,
    max: 160,
    label: "Meta opis",
  });

  const courseSlug = slugify(formState.title || "szkolenie");
  const modules = COURSE_CURRICULUM.filter((m) => m.courseId === formState.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-3">
              <span>
                {intent === "create"
                  ? "Dodawanie szkolenia"
                  : `Edycja szkolenia: "${formState.title}"`}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold align-middle ${
                  status === "published"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {status === "published" ? "Opublikowany" : "Wersja robocza"}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-semibold"
            >
              <ArrowLeft size={16} /> Wróć
            </button>
            <button
              onClick={() => onPreview(formState.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-semibold"
            >
              <Eye size={16} /> Podgląd
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  const ok = window.confirm(
                    `Czy na pewno usunąć szkolenie: ${formState.title}?`,
                  );
                  if (!ok) return;
                  onDelete(formState.id);
                  onBack();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold"
              >
                <Trash2 size={16} /> Usuń
              </button>
            )}
            <button
              onClick={() =>
                onSave({
                  ...formState,
                  status,
                  seoTitle: metaTitle,
                  seoDescription: metaDescription,
                  seoImage,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg shadow hover:bg-brand-accentHover transition font-semibold"
            >
              <Save size={16} /> Zapisz zmiany
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* Left */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Szczegóły podstawowe
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Podstawowe informacje wyświetlane na karcie szkolenia.
              </p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tytuł szkolenia
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={formState.title}
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Link (slug URL)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    multiserwis.pl/szkolenia/
                  </span>
                  <input
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
                    value={courseSlug}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Krótki opis
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg min-h-30 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={formState.description || ""}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Pełny opis
                </label>
                <LessonTextEditor
                  content={fullDescription}
                  onChange={setFullDescription}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Program szkolenia
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Zarządzaj modułami i lekcjami.
                </p>
              </div>
              <button
                className="flex items-center gap-2 text-brand-accent hover:text-brand-accentHover font-semibold"
                type="button"
                title="Dodaj moduł (UI)"
              >
                <Plus size={16} /> Dodaj moduł
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modules.length === 0 ? (
                <div className="text-sm text-slate-500">
                  Brak zdefiniowanego programu dla tego szkolenia (na razie).
                </div>
              ) : (
                modules.map((m, idx) => (
                  <div
                    key={m.id}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-slate-50 px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">
                          Moduł {idx + 1}: {m.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.lessons.length} lekcji
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Zwiń/rozwiń
                      </button>
                    </div>
                    <div className="p-4 space-y-2">
                      {m.lessons.map((l) => (
                        <div
                          key={l.id}
                          className="flex items-center justify-between px-3 py-2 rounded-md bg-white border border-slate-100"
                        >
                          <div className="text-sm text-slate-800 font-medium">
                            {l.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {l.duration}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-md text-sm font-semibold text-brand-accent hover:bg-brand-accent/5"
                      >
                        + Dodaj lekcję
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <CourseQuestionsEditor courseId={formState.id} modules={modules} />

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Ustawienia SEO
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Ustawienia SEO dla szkolenia.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meta tytuł
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Np. Szkolenie Bezpieczeństwa IT - Certyfikat"
                  />
                  <div className="mt-2">
                    <div className="text-[11px] text-slate-500">
                      {seoTitleMeter.helperText}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div
                        className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden"
                        aria-label={seoTitleMeter.ariaLabel}
                      >
                        <div
                          className={`h-full ${seoTitleMeter.toneClasses.bar}`}
                          style={{ width: `${seoTitleMeter.barPercent}%` }}
                        />
                      </div>
                      <div
                        className={`text-[11px] font-semibold ${seoTitleMeter.toneClasses.text} whitespace-nowrap`}
                      >
                        {seoTitleMeter.secondaryText} •{" "}
                        {seoTitleMeter.statusText}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meta opis
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg resize-y"
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Krótki opis do wyszukiwarki..."
                  />
                  <div className="mt-2">
                    <div className="text-[11px] text-slate-500">
                      {seoDescMeter.helperText}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div
                        className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden"
                        aria-label={seoDescMeter.ariaLabel}
                      >
                        <div
                          className={`h-full ${seoDescMeter.toneClasses.bar}`}
                          style={{ width: `${seoDescMeter.barPercent}%` }}
                        />
                      </div>
                      <div
                        className={`text-[11px] font-semibold ${seoDescMeter.toneClasses.text} whitespace-nowrap`}
                      >
                        {seoDescMeter.secondaryText} • {seoDescMeter.statusText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Miniatura SEO
                </label>
                <input
                  ref={seoFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      if (file.size > 6 * 1024 * 1024) {
                        window.alert("Plik jest za duży (max 6MB).");
                        return;
                      }
                      const dataUrl = await readFileAsDataUrl(file);
                      setSeoImage(dataUrl);
                    } finally {
                      e.target.value = "";
                    }
                  }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => seoFileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      seoFileInputRef.current?.click();
                  }}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                  title="Kliknij aby wgrać miniaturę SEO"
                >
                  {seoImage ? (
                    <div className="space-y-2">
                      <img
                        src={seoImage}
                        alt="Miniatura SEO"
                        className="w-full h-32 object-cover rounded-md border border-slate-200 bg-white"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[11px] text-slate-500">
                          Kliknij aby podmienić • Rekomendowane: 1200×630 • WEBP
                          (zalecane), PNG/JPG
                        </div>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            setSeoImage("");
                          }}
                          className="text-xs font-semibold text-rose-700 hover:text-rose-900"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="h-24 flex items-center justify-center text-sm text-slate-500">
                        Kliknij aby wgrać obrazek SEO
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2">
                        Rekomendowany rozmiar: 1200×630 • WEBP (zalecane),
                        PNG/JPG
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {mode === "manager" && (
                <div className="text-xs text-slate-500">
                  Uwaga: Menedżer może edytować szkolenia, ale nie zarządza
                  uprawnieniami systemowymi.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ustawienia szkolenia
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="published">Opublikowany</option>
                  <option value="draft">Wersja robocza</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kategoria
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  value={formState.category}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      category: e.target.value as Course["category"],
                    })
                  }
                >
                  <option value="UDT">UDT</option>
                  <option value="SEP">SEP</option>
                  <option value="BHP">BHP</option>
                  <option value="Inne">Inne</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cena regularna
                </label>
                <div className="flex items-stretch border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <input
                    className="flex-1 px-3 py-2 focus:outline-none"
                    inputMode="decimal"
                    placeholder="0"
                    value={(formState.price || "").replace(/[^\d.,]/g, "")}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        price: e.target.value.replace(/[^\d.,]/g, ""),
                      })
                    }
                  />
                  <span className="px-3 py-2 text-sm text-slate-500 bg-slate-50 border-l border-slate-200">
                    PLN
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cena promocyjna
                </label>
                <div className="flex items-stretch border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <input
                    className="flex-1 px-3 py-2 focus:outline-none"
                    inputMode="decimal"
                    placeholder="Opcjonalnie"
                    value={(formState.promoPrice || "").replace(/[^\d.,]/g, "")}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        promoPrice: e.target.value.replace(/[^\d.,]/g, ""),
                      })
                    }
                  />
                  <span className="px-3 py-2 text-sm text-slate-500 bg-slate-50 border-l border-slate-200">
                    PLN
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-900 mb-3">
                  Tryb hybrydowy
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formState.hasOnline ?? true}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          hasOnline: e.target.checked,
                        })
                      }
                      className="accent-brand-accent"
                    />
                    <span className="text-sm font-medium">
                      Dostępny Online (Teoria)
                    </span>
                  </label>
                  {formState.hasOnline && (
                    <div className="pl-6">
                      <label className="block text-xs text-slate-500 mb-1">
                        Cena (tylko online)
                      </label>
                      <input
                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                        placeholder="Osobna cena..."
                        value={formState.priceOnline || ""}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            priceOnline: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formState.hasStationary ?? false}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          hasStationary: e.target.checked,
                        })
                      }
                      className="accent-brand-accent"
                    />
                    <span className="text-sm font-medium">
                      Dostępny Stacjonarnie (Teoria + Praktyka)
                    </span>
                  </label>
                  {formState.hasStationary && (
                    <div className="pl-6 space-y-2">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Cena (pełna tyb stacjonarny)
                        </label>
                        <input
                          className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                          placeholder="Cena stacjonarna..."
                          value={formState.priceStationary || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              priceStationary: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Miejsce szkolenia
                        </label>
                        <input
                          className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                          placeholder="np. Kutno, ul. Przemysłowa 1"
                          value={formState.location || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCertificate}
                  onChange={(e) => setAutoCertificate(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-brand-accent"
                />
                <div>
                  <div className="font-semibold text-slate-800">
                    Generuj certyfikat ukończenia
                  </div>
                  <div className="text-sm text-slate-500">
                    Automatycznie wystaw certyfikat po ukończeniu 100%
                    szkolenia.
                  </div>
                </div>
              </label>
              <div className="pt-2 text-xs text-slate-500">
                Utworzono: <span className="font-semibold">12.01.2024</span>
                <br />
                Ostatnia edycja:{" "}
                <span className="font-semibold">przed chwilą</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Media
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  Okładka szkolenia
                </div>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      if (file.size > 6 * 1024 * 1024) {
                        window.alert("Plik jest za duży (max 6MB).");
                        return;
                      }
                      const dataUrl = await readFileAsDataUrl(file);
                      setFormState({ ...formState, image: dataUrl });
                    } finally {
                      e.target.value = "";
                    }
                  }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => coverFileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      coverFileInputRef.current?.click();
                  }}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                  title="Kliknij aby wgrać okładkę szkolenia"
                >
                  {formState.image ? (
                    <div className="space-y-2">
                      <img
                        src={formState.image}
                        alt={formState.title}
                        className="w-full h-36 object-cover rounded-md border border-slate-200 bg-white"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[11px] text-slate-500">
                          Kliknij aby podmienić • WEBP (zalecane), PNG/JPG •
                          1600×900
                        </div>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            setFormState({ ...formState, image: "" });
                          }}
                          className="text-xs font-semibold text-rose-700 hover:text-rose-900"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="h-36 flex items-center justify-center text-sm text-slate-500">
                        Kliknij aby wgrać okładkę
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2">
                        Rekomendowane: WEBP • Alternatywnie: PNG/JPG •
                        Rekomendowany rozmiar: 1600×900 • max 6MB
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Wideo promocyjne (URL)
                </label>
                <input
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  value={promoVideoUrl}
                  onChange={(e) => setPromoVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
