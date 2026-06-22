import React from "react";
import { ArrowLeft, Edit, PlayCircle, ChevronDown } from "lucide-react";
import type { Course } from "../../types";
import { COURSE_CURRICULUM, ADMIN_STUDENTS } from "../../constants";

interface TrainingPreviewPageProps {
  training: Course | null;
  onBack: () => void;
  onEdit?: () => void;
  onStart: (trainingId: string) => void;
}

const getPromo = (training: Course) => {
  const promo = (training.promoPrice || "").trim();
  if (!promo) return null;
  if (promo === training.price) return null;
  return promo;
};

export const TrainingPreviewPage: React.FC<TrainingPreviewPageProps> = ({
  training,
  onBack,
  onEdit,
  onStart,
}) => {
  if (!training) {
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

  const promo = getPromo(training);
  const modules = COURSE_CURRICULUM.filter((m) => m.courseId === training.id);
  const lessonsCount = modules.reduce(
    (sum, m) => sum + (m.lessons?.length || 0),
    0,
  );
  const stats = ADMIN_STUDENTS.filter((s) => s.course === training.id);
  const totalParticipants = stats.length;
  const activeParticipants = stats.filter((s) => s.status === "active").length;
  const completedParticipants = stats.filter((s) => s.progress >= 100).length;
  const averageProgress = totalParticipants
    ? Math.round(
        stats.reduce((sum, s) => sum + s.progress, 0) / totalParticipants,
      )
    : 0;
  const isPublished = Boolean(training.description);

  const [openModuleId, setOpenModuleId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOpenModuleId(modules[0]?.id || null);
  }, [training?.id]);

  const normalizeModuleTitle = (title: string) =>
    title.replace(/^Moduł\s*\d+\s*:\s*/i, "").trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Podgląd szkolenia
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {onEdit ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-semibold"
            >
              <Edit size={16} /> Edytuj
            </button>
          ) : null}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} /> Wróć
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="aspect-16/6 bg-slate-100">
              {training.image ? (
                <img
                  src={training.image}
                  alt={training.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400">
                  Brak okładki
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                  {training.category}
                </span>
                <span className="text-sm text-slate-600 font-semibold">
                  Lekcje: {lessonsCount}
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                {training.title}
              </div>
              {training.description && (
                <div className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {training.description}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Program szkolenia
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Podgląd modułów i lekcji.
              </p>
            </div>
            <div className="p-6 space-y-3">
              {modules.length === 0 ? (
                <div className="text-sm text-slate-500">
                  Brak zdefiniowanego programu dla tego szkolenia (na razie).
                </div>
              ) : (
                modules.map((m) => {
                  const isOpen = openModuleId === m.id;
                  return (
                    <div
                      key={m.id}
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenModuleId(isOpen ? null : m.id)}
                        className="w-full bg-slate-50 px-4 py-3 cursor-pointer flex items-center justify-between text-left"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">
                            {normalizeModuleTitle(m.title)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {m.lessons.length} lekcji
                          </div>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
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
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Dostęp
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    isPublished
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isPublished ? "Opublikowany" : "Nieopublikowany"}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cena
                </div>
                {promo ? (
                  <div className="mt-2">
                    <div className="text-sm text-slate-400 line-through font-semibold">
                      {training.price}
                    </div>
                    <div className="text-2xl font-extrabold text-brand-accent">
                      {promo}
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">
                    {training.price}
                  </div>
                )}
              </div>

              <button
                onClick={() => onStart(training.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-accent text-white rounded-lg shadow hover:bg-brand-accentHover transition font-semibold"
              >
                <PlayCircle size={18} /> Zobacz szkolenie
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Uczestnicy
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Zapisani</span>
                <span className="font-semibold text-slate-800">
                  {totalParticipants}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Aktywni</span>
                <span className="font-semibold text-slate-800">
                  {activeParticipants}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Ukończyło</span>
                <span className="font-semibold text-slate-800">
                  {completedParticipants}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Średni postęp</span>
                <span className="font-semibold text-slate-800">
                  {averageProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
