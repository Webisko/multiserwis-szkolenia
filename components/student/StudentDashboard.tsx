import React from "react";
import {
  PlayCircle,
  TrendingUp,
  Award,
  Clock,
  GraduationCap,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import type { Course, StudentUser, UserCourse } from "../../types";

interface StudentDashboardProps {
  studentUser: StudentUser;
  courses: Course[];
  myCourses: UserCourse[];
  onContinueLearning: () => void;
  onGoToCatalog: () => void;
  onGoToCertifications: () => void;
}

const percent = (value: number) =>
  `${Math.max(0, Math.min(100, Math.round(value)))}%`;

const firstNameFromFullName = (name: string) => {
  const trimmed = (name || "").trim();
  if (!trimmed) return "Kursancie";
  return trimmed.split(/\s+/)[0] || trimmed;
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentUser,
  courses,
  myCourses,
  onContinueLearning,
  onGoToCatalog,
  onGoToCertifications,
}) => {
  const activeCourses = myCourses.filter((c) => c.status === "active");
  const completedCourses = myCourses.filter((c) => c.status === "completed");

  const avgProgress = (() => {
    if (!myCourses.length) return 0;
    return (
      myCourses.reduce((sum, c) => sum + (c.progress || 0), 0) /
      myCourses.length
    );
  })();

  const avgExamScore = (() => {
    const history = studentUser.examHistory || [];
    if (!history.length) return null;
    const avg =
      history.reduce(
        (sum, h) => sum + (h.maxScore ? (h.score / h.maxScore) * 100 : 0),
        0,
      ) / history.length;
    return avg;
  })();

  const certifications = studentUser.certifications || [];
  const expiringSoon = (() => {
    const now = new Date();
    return certifications.filter((cert) => {
      const expirationDate = new Date(cert.expirationDate);
      const daysUntilExpiration = Math.ceil(
        (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilExpiration <= 180 && daysUntilExpiration > 0;
    });
  })();

  const primaryCourse = activeCourses[0] || myCourses[0] || null;
  const primaryCourseDetails = primaryCourse
    ? courses.find((c) => c.id === primaryCourse.courseId)
    : null;

  const recommended = React.useMemo(() => {
    const myIds = new Set(myCourses.map((c) => c.courseId));
    return courses.filter((c) => !myIds.has(c.id)).slice(0, 2);
  }, [courses, myCourses]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-brand-primary/5 to-transparent pointer-events-none" />
        <div className="z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary mb-2">
            Dzień dobry, {firstNameFromFullName(studentUser.name)}!
          </h1>
          <p className="text-slate-500 max-w-lg">
            Masz {activeCourses.length} aktywne kursy i {expiringSoon.length}{" "}
            uprawnienia do sprawdzenia w najbliższych miesiącach.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 z-10 w-full md:w-auto">
          <div className="bg-sky-50 px-5 py-3 rounded-xl border border-sky-100 flex items-center gap-3 flex-1 md:flex-none min-w-40">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {percent(avgExamScore ?? avgProgress)}
              </p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                Śr. wynik
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-100 flex items-center gap-3 flex-1 md:flex-none min-w-40">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {certifications.length}
              </p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                Certyfikatów
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlayCircle size={18} className="text-brand-primary" /> Moja
                nauka
              </h2>
              <button
                onClick={onContinueLearning}
                className="text-sm text-brand-accent font-semibold hover:text-brand-accentHover"
              >
                Zobacz wszystkie <ChevronRight size={16} className="inline" />
              </button>
            </div>

            {primaryCourse && primaryCourseDetails ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row border border-slate-200 group hover:shadow-md transition-all">
                <div className="sm:w-2/5 h-40 sm:h-auto bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-brand-primary/5 transition-colors" />
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 text-white">
                    <GraduationCap size={56} className="opacity-50" />
                  </div>
                  <div className="absolute top-3 left-3 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {primaryCourse.status === "completed"
                      ? "UKOŃCZONE"
                      : "W TOKU"}
                  </div>
                </div>

                <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {primaryCourseDetails.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-xs text-slate-400">
                        Ostatnia aktywność: Dzisiaj
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-primary transition-colors">
                      {primaryCourseDetails.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {primaryCourseDetails.description || ""}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>Postęp</span>
                        <span className="text-brand-accent">
                          {percent(primaryCourse.progress)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-brand-accent h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.max(0, Math.min(100, primaryCourse.progress))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={onContinueLearning}
                      className="bg-brand-accent hover:bg-brand-accentHover text-white px-5 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition flex items-center gap-2"
                    >
                      Kontynuuj
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                Brak aktywnych kursów. Przejdź do katalogu, aby wybrać
                szkolenie.
                <div className="mt-4">
                  <button
                    onClick={onGoToCatalog}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition"
                  >
                    Przejdź do katalogu
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap size={18} className="text-brand-primary" />{" "}
                Polecane dla Ciebie
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommended.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group"
                >
                  <div className="h-28 bg-slate-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-primary/5 text-brand-primary/20">
                      <GraduationCap size={44} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-brand-primary bg-slate-100 px-2 py-1 rounded">
                        {course.category}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {course.promoPrice || course.price}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1 group-hover:text-brand-primary transition-colors">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {course.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertTriangle size={56} className="text-brand-accent" />
            </div>
            <div className="relative z-10">
              <h3 className="text-brand-accent font-bold flex items-center gap-2 mb-2">
                <AlertTriangle size={18} /> Przypomnienia
              </h3>
              {expiringSoon.length > 0 ? (
                <>
                  <p className="text-sm text-slate-800 font-medium mb-2">
                    Masz {expiringSoon.length} uprawnienia wygasające w ciągu 6
                    miesięcy.
                  </p>
                  <button
                    onClick={onGoToCertifications}
                    className="text-sm font-semibold text-brand-accent underline hover:text-brand-accentHover"
                  >
                    Zobacz szczegóły i zapisz się na egzamin →
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-700">
                  Na ten moment nie masz pilnych przypomnień.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Moje kursy
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900">
                  {myCourses.length}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">W toku</div>
                <div className="font-bold text-slate-900">
                  {activeCourses.length}
                </div>
                <div className="text-xs text-slate-500 mt-2">Ukończone</div>
                <div className="font-bold text-slate-900">
                  {completedCourses.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
