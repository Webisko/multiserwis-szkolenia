import React, { useState } from "react";
import {
  ChevronRight,
  Clock,
  AlertCircle,
  Edit,
  BookOpen,
  Printer,
  Download,
  Calendar,
} from "lucide-react";
import { ADMIN_STUDENTS, COURSES, COURSE_CURRICULUM } from "../../constants";

interface Props {
  viewingStudentId: string | null;
  setViewingStudentId: (id: string | null) => void;
  setView: (view: any) => void;
  setAdminActiveTab: (tab: any) => void;
  selectedCompany: string | null;
}

const StudentDetailView: React.FC<Props> = ({
  viewingStudentId,
  setViewingStudentId,
  setView,
  setAdminActiveTab,
  selectedCompany,
}) => {
  if (!viewingStudentId) return null;

  const student = ADMIN_STUDENTS.find((s) => s.id === viewingStudentId);
  if (!student) return null;

  const [editingAccessFor, setEditingAccessFor] = useState<string | null>(null);
  const [accessEditMode, setAccessEditMode] = useState<"add" | "set">("add");
  const [daysToAdd, setDaysToAdd] = useState<number>(30);
  const [targetDate, setTargetDate] = useState<string>("");

  const allStudentEnrollments = ADMIN_STUDENTS.filter(
    (s) => s.name === student.name && s.email === student.email,
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <button
          onClick={() => {
            if (selectedCompany) {
              setView("ADMIN");
              setViewingStudentId(null);
              setAdminActiveTab("students");
            } else {
              setView("ADMIN");
              setViewingStudentId(null);
            }
          }}
          className="mb-6 flex items-center gap-2 text-brand-primary hover:text-brand-accent transition-colors font-bold"
        >
          <ChevronRight className="rotate-180" size={20} />
          {selectedCompany ? "Powrót do listy kursantów" : "Powrót do panelu"}
        </button>

        <div className="bg-white rounded-sm shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-brand-dark text-white p-8">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">
                {student.name}
              </h1>
              <p className="text-white/80 flex items-center gap-2 mb-2">
                <span>{student.email}</span>
              </p>
              {student.company && (
                <p className="text-white/70 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-white/20 rounded-sm font-bold">
                    {student.company}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">
              Przypisane szkolenia ({allStudentEnrollments.length})
            </h2>

            <div className="space-y-4">
              {allStudentEnrollments.map((enrollment) => {
                const enrolledCourse = COURSES.find(
                  (c) => c.id === enrollment.course,
                );
                if (!enrolledCourse) return null;

                const courseCurriculum = COURSE_CURRICULUM.filter(
                  (m) => m.courseId === enrolledCourse.id,
                );
                const totalLessons = courseCurriculum.reduce(
                  (sum, module) => sum + module.lessons.length,
                  0,
                );
                const completedLessons = enrollment.completedLessons.length;

                return (
                  <div
                    key={`${enrollment.id}-${enrollment.course}`}
                    className="border border-slate-200 rounded-sm overflow-hidden"
                  >
                    <div className="flex items-start">
                      <div className="w-32 h-48 bg-slate-200 flex-shrink-0">
                        <img
                          src={enrolledCourse.image}
                          alt={enrolledCourse.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-heading font-bold text-brand-dark mb-2">
                              {enrolledCourse.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <span className="px-2 py-0.5 bg-brand-secondary/10 text-brand-secondary rounded font-bold uppercase text-xs">
                                {enrolledCourse.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} /> {enrolledCourse.duration}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div>
                              {enrollment.expirationDays > 5 ? (
                                <span className="inline-flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-3 py-1.5 rounded">
                                  Ważne przez {enrollment.expirationDays} dni
                                </span>
                              ) : enrollment.expirationDays > 0 ? (
                                <span className="inline-flex items-center gap-1 text-yellow-600 font-bold text-sm bg-yellow-50 px-3 py-1.5 rounded">
                                  <AlertCircle size={14} /> Wygasa za{" "}
                                  {enrollment.expirationDays} dni
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-3 py-1.5 rounded">
                                  Wygasł
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAccessFor(enrollment.id);
                                const futureDate = new Date();
                                futureDate.setDate(futureDate.getDate() + 30);
                                setTargetDate(
                                  futureDate.toISOString().split("T")[0],
                                );
                              }}
                              className="p-2 text-slate-400 hover:text-brand-accent hover:bg-slate-50 rounded transition-colors"
                              title="Edytuj czas dostępu"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-700">
                              Postęp w szkoleniu
                            </span>
                            <span className="text-sm font-bold text-brand-primary">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-brand-primary to-brand-accent h-3 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-heading font-black text-brand-primary">
                              {enrollment.progress}%
                            </p>
                            <p className="text-xs text-slate-500 font-bold">
                              Ukończone
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-heading font-black text-slate-600">
                              {enrollment.expirationDays > 0
                                ? enrollment.expirationDays
                                : 0}
                            </p>
                            <p className="text-xs text-slate-500 font-bold">
                              Dni dostępu
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-heading font-black text-teal-600">
                              {completedLessons}/{totalLessons}
                            </p>
                            <p className="text-xs text-slate-500 font-bold">
                              Lekcji ukończono
                            </p>
                          </div>
                        </div>

                        <details className="group">
                          <summary className="cursor-pointer list-none flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded transition-colors">
                            <span className="font-bold text-sm text-brand-dark flex items-center gap-2">
                              <BookOpen size={16} />
                              Szczegółowe postępy ({completedLessons}/
                              {totalLessons} lekcji)
                            </span>
                            <ChevronRight
                              size={16}
                              className="text-slate-400 group-open:rotate-90 transition-transform"
                            />
                          </summary>
                          <div className="mt-3 space-y-3">
                            {courseCurriculum.map((module, moduleIndex) => (
                              <div
                                key={module.id}
                                className="border border-slate-200 rounded-sm overflow-hidden"
                              >
                                <div className="bg-slate-50 px-4 py-2 font-bold text-sm text-brand-dark">
                                  Moduł {moduleIndex + 1}: {module.title}
                                </div>
                                <div className="p-3 space-y-2">
                                  {module.lessons.map((lesson, lessonIndex) => {
                                    const isCompleted =
                                      enrollment.completedLessons.includes(
                                        lesson.id,
                                      );
                                    return (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center gap-3 text-sm py-1"
                                      >
                                        <div
                                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            isCompleted
                                              ? "bg-green-100 text-green-600"
                                              : "bg-slate-100 text-slate-400"
                                          }`}
                                        >
                                          {isCompleted ? "✓" : "○"}
                                        </div>
                                        <span
                                          className={`flex-grow ${isCompleted ? "text-slate-700" : "text-slate-400"}`}
                                        >
                                          {lesson.title}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                          {lesson.duration}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                          <button
                            onClick={() => {
                              alert(
                                `Generowanie raportu PDF dla:\nKursant: ${student.name}\nSzkolenie: ${enrolledCourse.title}\nPostęp: ${enrollment.progress}%\nW pełnej wersji zostanie wygenerowany i pobrany plik PDF`,
                              );
                            }}
                            className="flex-1 px-4 py-2 bg-brand-primary text-white font-bold text-sm rounded hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
                          >
                            <Printer size={16} />
                            Generuj raport PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {ADMIN_STUDENTS.filter((s) => s.id === viewingStudentId).length ===
              0 && (
              <div className="text-center py-12 text-slate-500">
                <BookOpen size={48} className="mx-auto mb-3 text-slate-300" />
                <p>Brak przypisanych szkoleń</p>
              </div>
            )}
          </div>
        </div>

        {editingAccessFor &&
          (() => {
            const enrollment = allStudentEnrollments.find(
              (e) => e.id === editingAccessFor,
            );
            if (!enrollment) return null;
            const enrollmentCourse = COURSES.find(
              (c) => c.id === enrollment.course,
            );

            return (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-xl font-heading font-bold text-brand-dark">
                      Edytuj czas dostępu
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {enrollmentCourse?.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Aktualnie: {enrollment.expirationDays} dni
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        Wybierz sposób edycji:
                      </label>
                      <div className="space-y-2">
                        <label
                          className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-50"
                          style={{
                            borderColor:
                              accessEditMode === "add" ? "#003d4d" : "#e2e8f0",
                          }}
                        >
                          <input
                            type="radio"
                            name="editMode"
                            checked={accessEditMode === "add"}
                            onChange={() => setAccessEditMode("add")}
                            className="w-4 h-4 rounded-full border-2 border-brand-accent accent-brand-accent focus:ring-brand-accent"
                          />
                          <div>
                            <div className="font-bold text-slate-800">
                              Dodaj dni
                            </div>
                            <div className="text-xs text-slate-500">
                              Dodaj określoną liczbę dni do obecnego czasu
                              dostępu
                            </div>
                          </div>
                        </label>

                        <label
                          className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-50"
                          style={{
                            borderColor:
                              accessEditMode === "set" ? "#003d4d" : "#e2e8f0",
                          }}
                        >
                          <input
                            type="radio"
                            name="editMode"
                            checked={accessEditMode === "set"}
                            onChange={() => setAccessEditMode("set")}
                            className="w-4 h-4 rounded-full border-2 border-brand-accent accent-brand-accent focus:ring-brand-accent"
                          />
                          <div>
                            <div className="font-bold text-slate-800">
                              Ustaw datę końcową
                            </div>
                            <div className="text-xs text-slate-500">
                              Wybierz konkretną datę, do której kurs będzie
                              ważny
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {accessEditMode === "add" ? (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Liczba dni do dodania:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="3650"
                          value={daysToAdd}
                          onChange={(e) =>
                            setDaysToAdd(parseInt(e.target.value) || 0)
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-primary transition-colors"
                          placeholder="Wpisz liczbę dni"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Nowy czas dostępu:{" "}
                          {enrollment.expirationDays + daysToAdd} dni
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Data ważności (do końca dnia):
                        </label>
                        {(() => {
                          const polishMonths = [
                            "Styczeń",
                            "Luty",
                            "Marzec",
                            "Kwiecień",
                            "Maj",
                            "Czerwiec",
                            "Lipiec",
                            "Sierpień",
                            "Wrzesień",
                            "Październik",
                            "Listopad",
                            "Grudzień",
                          ];

                          const today = new Date();
                          const [day, month, year] = targetDate
                            ? targetDate.split("-").map(Number)
                            : [
                                today.getDate(),
                                today.getMonth() + 1,
                                today.getFullYear(),
                              ];

                          const daysInMonth = new Date(
                            year || today.getFullYear(),
                            month || today.getMonth() + 1,
                            0,
                          ).getDate();

                          const handleDateChange = (
                            type: "day" | "month" | "year",
                            value: string,
                          ) => {
                            const currentDate = targetDate
                              ? new Date(targetDate)
                              : today;
                            let newDay = currentDate.getDate();
                            let newMonth = currentDate.getMonth() + 1;
                            let newYear = currentDate.getFullYear();

                            if (type === "day") newDay = parseInt(value);
                            if (type === "month") newMonth = parseInt(value);
                            if (type === "year") newYear = parseInt(value);

                            const maxDay = new Date(
                              newYear,
                              newMonth,
                              0,
                            ).getDate();
                            if (newDay > maxDay) newDay = maxDay;

                            const newDate = `${newYear}-${String(newMonth).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`;
                            setTargetDate(newDate);
                          };

                          return (
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-slate-500 mb-1">
                                  Dzień
                                </label>
                                <select
                                  value={day}
                                  onChange={(e) =>
                                    handleDateChange("day", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-primary transition-colors bg-white"
                                >
                                  {Array.from(
                                    { length: daysInMonth },
                                    (_, i) => i + 1,
                                  ).map((d) => (
                                    <option key={d} value={d}>
                                      {d}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs text-slate-500 mb-1">
                                  Miesiąc
                                </label>
                                <select
                                  value={month}
                                  onChange={(e) =>
                                    handleDateChange("month", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-primary transition-colors bg-white"
                                >
                                  {polishMonths.map((monthName, index) => (
                                    <option key={index + 1} value={index + 1}>
                                      {monthName}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs text-slate-500 mb-1">
                                  Rok
                                </label>
                                <select
                                  value={year}
                                  onChange={(e) =>
                                    handleDateChange("year", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-primary transition-colors bg-white"
                                >
                                  {Array.from(
                                    { length: 11 },
                                    (_, i) => today.getFullYear() + i,
                                  ).map((y) => (
                                    <option key={y} value={y}>
                                      {y}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })()}
                        {targetDate && (
                          <p className="text-xs text-slate-500 mt-3">
                            Szkolenie będzie ważne do końca dnia:{" "}
                            {new Date(
                              targetDate + "T23:59:59",
                            ).toLocaleDateString("pl-PL", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setEditingAccessFor(null);
                        setDaysToAdd(30);
                        setAccessEditMode("add");
                      }}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={() => {
                        alert(`Changes saved (simulation)`);
                        setEditingAccessFor(null);
                        setDaysToAdd(30);
                        setAccessEditMode("add");
                      }}
                      className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary transition-colors"
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default StudentDetailView;
