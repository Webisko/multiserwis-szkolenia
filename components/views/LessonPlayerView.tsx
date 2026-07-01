import React, { useState, useEffect } from "react";
import { COURSE_CURRICULUM, COURSES } from "../../constants";
import {
  ChevronRight,
  Menu,
  Play,
  FileText,
  Download,
  CheckCircle,
  Lock,
  PlayCircle,
  BookOpen,
  HelpCircle,
  Clock,
} from "lucide-react";
import { api } from "../../services/api";
import { Question } from "../../types";
import LessonQuiz from "./LessonQuiz";
import { VideoPlayer } from "../ui/VideoPlayer";
import DOMPurify from "dompurify";

interface Props {
  currentLessonId: string;
  setCurrentLessonId: (id: string) => void;
  selectedCourseId: string | null;
  setView: (view: any) => void;
  isLoggedIn: boolean;
  isFromAdmin: boolean;
  adminEditingCourseId: string | null;
  setAdminEditingCourseId: (id: string | null) => void;
  setIsFromAdmin: (val: boolean) => void;
  panelCourses: any[];
}

const LessonPlayerView: React.FC<Props> = ({
  currentLessonId,
  setCurrentLessonId,
  selectedCourseId,
  setView,
  isLoggedIn,
  isFromAdmin,
  adminEditingCourseId,
  setAdminEditingCourseId,
  setIsFromAdmin,
  panelCourses,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [progressList, setProgressList] = useState<any[]>([]);

  // Fetch Progress list
  useEffect(() => {
    if (isLoggedIn) {
      api.progress
        .list()
        .then(setProgressList)
        .catch((err) => console.error("Failed to fetch progress", err));
    }
  }, [isLoggedIn, currentLessonId]);

  // Fetch Questions
  useEffect(() => {
    if (selectedCourseId) {
      setIsLoadingQuestions(true);
      api.questions
        .list(selectedCourseId)
        .then(setQuestions)
        .catch((err) => console.error("Failed to fetch questions", err))
        .finally(() => setIsLoadingQuestions(false));
    }
  }, [selectedCourseId]);

  // Determine active lesson
  const activeLessonId = currentLessonId;

  // Build Modules with Quizzes
  const baseModules = selectedCourseId
    ? COURSE_CURRICULUM.filter((m) => m.courseId === selectedCourseId)
    : COURSE_CURRICULUM;

  const modulesForCourse = React.useMemo(() => {
    // Clone and inject Quizzes
    return baseModules.map((m) => {
      const moduleQuestions = questions.filter((q) => q.moduleId === m.id);
      if (moduleQuestions.length > 0) {
        // Check if Quiz lesson already exists to avoid dupes if re-running
        if (m.lessons.some((l) => l.type === "quiz")) return m;

        return {
          ...m,
          lessons: [
            ...m.lessons,
            {
              id: `quiz_${m.id}`,
              title: `Test wiedzy: ${m.title}`,
              duration: "15 min",
              isCompleted: false, // In real app, check progress
              isLocked: false,
              type: "quiz" as const,
              questions: moduleQuestions,
            },
          ],
        };
      }
      return m;
    });
    // Final Exam could be added here too if needed
  }, [baseModules, questions]);

  const activeCourseTitle = selectedCourseId
    ? panelCourses.find((c) => c.id === selectedCourseId)?.title ||
      COURSES.find((c) => c.id === selectedCourseId)?.title ||
      "Szkolenie"
    : "Szkolenie";

  // Find all lessons (flattened)
  const allLessons: any[] = [];
  modulesForCourse.forEach((module) => {
    module.lessons.forEach((lesson) => {
      allLessons.push(lesson);
    });
  });

  // TODO: Add Final Exam as a separate "lesson" at the very end
  const finalExamQuestions = questions.filter((q) => !q.moduleId);
  if (finalExamQuestions.length > 0) {
    allLessons.push({
      id: "final_exam",
      title: "Egzamin Końcowy",
      duration: "60 min",
      isCompleted: false,
      isLocked: false,
      type: "quiz",
      questions: finalExamQuestions,
    });
  }

  // Find index of current lesson
  const foundLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === activeLessonId,
  );
  const currentLessonIndex = foundLessonIndex === -1 ? 0 : foundLessonIndex;
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  const goToPreviousLesson = () => {
    if (hasPrevious) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  const goToNextLesson = () => {
    if (hasNext) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  // Current lesson data
  const currentLesson = allLessons[currentLessonIndex];
  const completedLessonsCount = allLessons.filter(
    (lesson) => lesson.isCompleted,
  ).length;
  const progressPercent = allLessons.length
    ? Math.round((completedLessonsCount / allLessons.length) * 100)
    : 0;
  const activeSidebarLessonId = currentLesson?.id || activeLessonId;

  const handleBack = () => {
    setView(isLoggedIn ? "NEW_STUDENT_PANEL" : "CATALOG");
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      if (currentLesson?.id) {
        api.progress
          .update({
            lessonId: currentLesson.id,
            completed: true,
            score,
            watchTime: 0,
          })
          .then(() => {
            alert(`Gratulacje! Zdałeś test z wynikiem ${score}%.`);
            if (hasNext) {
              goToNextLesson();
            }
          })
          .catch((err) => console.error(err));
      }
    } else {
      // Do nothing, let them retry
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      <div className="min-w-0 flex-1 flex flex-col gap-6 font-body animate-fade-in order-2 md:order-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-dark transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" /> Powrót
            </button>

            <div className="mt-2 text-xs text-slate-500 font-semibold flex items-center gap-1">
              <span>Moje szkolenia</span>
              <ChevronRight size={12} />
              <span>{activeCourseTitle}</span>
            </div>
            <h1 className="mt-1 text-2xl font-heading font-bold text-slate-900">
              {currentLesson?.title || "Lekcja"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              aria-label={
                sidebarOpen ? "Ukryj spis lekcji" : "Pokaż spis lekcji"
              }
            >
              <Menu size={20} className="text-slate-600" />
            </button>

            {isFromAdmin && adminEditingCourseId ? (
              <button
                onClick={() => {
                  localStorage.setItem(
                    "returnToEditCourseId",
                    adminEditingCourseId,
                  );
                  setIsFromAdmin(false);
                  setAdminEditingCourseId(null);
                  setView("NEW_ADMIN_PANEL");
                }}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-accent text-white font-bold text-sm rounded-sm hover:bg-brand-accentHover transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" /> Powrót do
                edycji
              </button>
            ) : null}
          </div>
        </div>

        {currentLesson?.type === "video" && (
          <VideoPlayer
            src={currentLesson?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
            poster="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop"
            initialProgress={progressList.find(p => p.lessonId === currentLesson?.id)?.stoppedAt || 0}
            onProgressUpdate={(time, duration) => {
              // Update local/API progress
              if (currentLesson?.id) {
                console.log(
                  `Syncing progress for ${currentLesson.id}: ${time} / ${duration}`,
                );
                api.progress
                  .update({
                    lessonId: currentLesson.id,
                    completed: time >= duration * 0.9,
                    stoppedAt: Math.floor(time),
                    watchTime: 10,
                  })
                  .catch((e) => console.warn("Progress sync failed", e));
              }
            }}
          />
        )}

        {currentLesson?.type === "text" && (
          <div className="w-full bg-white rounded-sm shadow-sm border border-slate-200 p-8">
            <div className="prose max-w-none text-base text-slate-700 leading-relaxed">
              <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">
                {currentLesson?.title}
              </h2>

              {/* NOTE: Hardcoded text content for demo purposes pulled from App.tsx */}
              {currentLesson.id === "c1l6a" && (
                <>
                  <p className="text-lg mb-4">
                    Przepisy BHP (Bezpieczeństwa i Higieny Pracy) oraz normy
                    bezpieczeństwa stanowią fundament bezpiecznej pracy na
                    wózkach widłowych.
                  </p>

                  <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">
                    Podstawowe zasady BHP
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>
                      Operator musi posiadać aktualne uprawnienia do obsługi
                      wózka widłowego kategorii I, II lub III
                    </li>
                    <li>
                      Przed rozpoczęciem pracy należy przeprowadzić przegląd
                      techniczny wózka
                    </li>
                    <li>
                      Zabrania się jazdy z uniesionymi widłami bez ładunku
                    </li>
                    <li>
                      Maksymalna prędkość jazdy w pomieszczeniach: 10 km/h
                    </li>
                    <li>
                      Operator musi używać środków ochrony indywidualnej (kask,
                      obuwie, kamizelka)
                    </li>
                  </ul>
                  {/* ... abbreviated common text blocks could be their own components eventually ... */}
                  <div className="bg-brand-accent/10 border-l-4 border-brand-accent p-4 my-6">
                    <p className="font-bold text-brand-dark mb-2">⚠️ Ważne!</p>
                    <p>
                      Niestosowanie się do przepisów BHP może skutkować
                      odpowiedzialnością karną lub cywilną, a także utratą
                      uprawnień do obsługi wózków widłowych.
                    </p>
                  </div>
                </>
              )}
              {/* ... handling other specific lesson IDs similarly ... */}
              {currentLesson.id !== "c1l6a" && (
                currentLesson.description ? (
                  <div 
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentLesson.description) }} 
                  />
                ) : (
                  <p>Treść lekcji tekstowej...</p>
                )
              )}
            </div>
          </div>
        )}

        {(currentLesson?.type === "test" || currentLesson?.type === "quiz") && (
          <LessonQuiz
            title={currentLesson.title}
            questions={currentLesson.questions || []}
            onComplete={handleQuizComplete}
            passingThreshold={currentLesson.type === "test" ? 80 : 50} // Higher for logic test? Or keep consistent
          />
        )}

        {/* Content & Materials - Only for video lessons */}
        {currentLesson?.type === "video" && (
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
            <div className="flex border-b border-slate-200 mb-6">
              <button className="px-6 py-3 text-sm font-bold text-brand-accent border-b-2 border-brand-accent">
                Opis Lekcji
              </button>
              <button className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-brand-dark transition-colors">
                Materiały (1)
              </button>
            </div>

            <div className="prose max-w-none text-base text-slate-600 leading-relaxed mb-8">
              <p>
                W tej lekcji omówimy procedurę bezpiecznej wymiany butli z gazem
                propan-butan w wózkach jezdniowych.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="p-2 bg-red-100 rounded text-red-600">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-bold text-brand-dark text-sm group-hover:text-brand-accent transition-colors">
                    Instrukcja Wymiany Butli.pdf
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    PDF • 2.4 MB
                  </div>
                </div>
                <Download
                  size={16}
                  className="ml-auto text-slate-400 group-hover:text-brand-primary"
                />
              </div>
            </div>
          </div>
        )}

        {currentLesson?.type !== "quiz" && (
          <div className="flex flex-col md:flex-row gap-3 mt-6 md:justify-between">
            <button
              onClick={goToPreviousLesson}
              disabled={!hasPrevious}
              className={`px-6 py-3 border border-slate-300 font-bold uppercase text-xs rounded-sm transition-colors ${
                hasPrevious
                  ? "text-slate-600 hover:bg-white hover:text-brand-dark cursor-pointer"
                  : "text-slate-300 cursor-not-allowed opacity-50"
              }`}
            >
              Poprzednia lekcja
            </button>

            {!currentLesson?.isCompleted ? (
              <button
                onClick={() => {
                  // Oznacz lekcję jako ukończoną logic
                  const moduleIndex = COURSE_CURRICULUM.findIndex((m) =>
                    m.lessons.some((l) => l.id === currentLesson?.id),
                  );
                  if (moduleIndex !== -1) {
                    const lessonIndex = COURSE_CURRICULUM[
                      moduleIndex
                    ].lessons.findIndex((l) => l.id === currentLesson?.id);
                    if (lessonIndex !== -1) {
                      COURSE_CURRICULUM[moduleIndex].lessons[
                        lessonIndex
                      ].isCompleted = true;
                      setCurrentLessonId(currentLesson?.id || ""); // re-render hack/trigger
                    }
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold uppercase text-xs rounded-sm hover:bg-green-700 transition-colors md:order-2"
              >
                <CheckCircle size={16} /> Oznacz jako ukończona
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-green-50 text-green-700 font-bold uppercase text-xs rounded-sm md:order-2">
                <CheckCircle size={16} /> Lekcja ukończona
              </div>
            )}

            <button
              onClick={goToNextLesson}
              disabled={!hasNext}
              className={`px-6 py-3 bg-brand-accent font-bold uppercase text-xs rounded-sm transition-colors flex items-center justify-center gap-2 md:order-3 ${
                hasNext
                  ? "text-white hover:bg-brand-accentHover cursor-pointer"
                  : "bg-slate-300 text-slate-400 cursor-not-allowed"
              }`}
            >
              Następna lekcja <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Sidebar - Right/Bottom on mobile */}
      <div
        className={`
           w-full md:w-1/4 shrink-0 bg-white border border-slate-200 shadow-sm rounded-sm order-1 md:order-2
           md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-hidden md:flex md:flex-col
           ${sidebarOpen ? "block" : "hidden md:flex"}
        `}
      >
        <div className="p-4 bg-brand-primary text-white rounded-t-sm shrink-0">
          <div className="text-xs font-bold uppercase text-brand-accent tracking-widest mb-1">
            Twój postęp
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-heading font-bold">
              {progressPercent}%
            </span>
            <span className="text-xs text-slate-300 mb-1">ukończono</span>
          </div>
          <div className="w-full bg-brand-dark/50 rounded-full h-1.5">
            <div
              className="bg-brand-accent h-1.5 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {modulesForCourse.map((module) => (
            <div
              key={module.id}
              className="border-b border-slate-100 last:border-0"
            >
              <div className="bg-slate-50 px-4 py-3 text-xs font-bold uppercase text-slate-600 tracking-wider flex justify-between items-center sticky top-0 z-10 border-b border-slate-200">
                {module.title}
              </div>
              <div>
                {module.lessons.map((lesson) => {
                  const isActive = lesson.id === activeSidebarLessonId;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() =>
                        !lesson.isLocked && setCurrentLessonId(lesson.id)
                      }
                      className={`
                          flex items-start gap-3 p-4 cursor-pointer transition-colors relative
                          ${lesson.isCompleted ? "bg-green-50 hover:bg-green-100" : ""}
                          ${isActive && !lesson.isCompleted ? "bg-brand-surface" : ""}
                          ${!isActive && !lesson.isCompleted ? "hover:bg-slate-50" : ""}
                          ${lesson.isLocked ? "opacity-50 pointer-events-none" : ""}
                        `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent"></div>
                      )}

                      <div className="mt-0.5 shrink-0">
                        {lesson.isCompleted ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : lesson.isLocked ? (
                          <Lock size={16} className="text-slate-400" />
                        ) : (
                          <>
                            {lesson.type === "video" && (
                              <PlayCircle
                                size={16}
                                className={`${isActive ? "text-brand-accent" : "text-slate-400"}`}
                              />
                            )}
                            {lesson.type === "text" && (
                              <BookOpen
                                size={16}
                                className={`${isActive ? "text-brand-accent" : "text-slate-400"}`}
                              />
                            )}
                            {lesson.type === "test" && (
                              <HelpCircle
                                size={16}
                                className={`${isActive ? "text-brand-accent" : "text-slate-400"}`}
                              />
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium leading-tight mb-1 ${lesson.isCompleted ? "text-green-700" : ""} ${isActive ? "text-brand-dark font-bold" : "text-slate-600"}`}
                        >
                          {lesson.title}
                        </div>
                        <div
                          className={`text-xs flex items-center gap-2 ${lesson.isCompleted ? "text-green-600" : "text-slate-400"}`}
                        >
                          <Clock size={10} />
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPlayerView;
