import React, { useState, useEffect, useRef } from "react";
import { Question, Answer } from "../../types";
import { CheckCircle, XCircle, AlertCircle, ChevronRight, Clock, BookOpen, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  title: string;
  questions: Question[];
  onComplete: (score: number, passed: boolean) => void;
  passingThreshold?: number; // percent 0-100, default 80
  durationMinutes?: number; // default 20
}

const LessonQuiz: React.FC<Props> = ({
  title,
  questions: originalQuestions,
  onComplete,
  passingThreshold = 80,
  durationMinutes = 20,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({}); // questionId -> answerIds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Training Timer State
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Study Mode State (Feedback on click)
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  // Retry logic (only failed questions)
  const [failedQuestionIds, setFailedQuestionIds] = useState<string[]>([]);
  const [retryOnlyFailed, setRetryOnlyFailed] = useState(false);

  // Filtered questions based on retry preference
  const questions = React.useMemo(() => {
    if (retryOnlyFailed && failedQuestionIds.length > 0) {
      return originalQuestions.filter((q) => failedQuestionIds.includes(q.id));
    }
    return originalQuestions;
  }, [originalQuestions, retryOnlyFailed, failedQuestionIds]);

  // Timer Effect
  useEffect(() => {
    if (isSubmitted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(durationMinutes * 60);
    setIsTimeOver(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeOver(true);
          // Just notify, do not force submit
          toast.warning("Czas na rozwiązanie testu minął! Możesz kontynuować, aby poćwiczyć.");
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted, durationMinutes, questions]);

  // If no questions, just show error or completed
  if (!originalQuestions || originalQuestions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        Brak pytań w tym teście.
      </div>
    );
  }

  const handleSelectAnswer = (
    questionId: string,
    answerId: string,
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
  ) => {
    if (isSubmitted) return;
    if (isStudyMode && revealedQuestions[questionId]) return; // Lock after check

    setUserAnswers((prev) => {
      const current = prev[questionId] || [];
      if (type === "SINGLE_CHOICE") {
        return { ...prev, [questionId]: [answerId] };
      } else {
        // Toggle
        if (current.includes(answerId)) {
          return {
            ...prev,
            [questionId]: current.filter((id) => id !== answerId),
          };
        } else {
          return { ...prev, [questionId]: [...current, answerId] };
        }
      }
    });
  };

  const handleCheckQuestionInStudyMode = (questionId: string) => {
    if (!userAnswers[questionId] || userAnswers[questionId].length === 0) {
      toast.info("Wybierz najpierw odpowiedź.");
      return;
    }
    setRevealedQuestions((prev) => ({ ...prev, [questionId]: true }));
  };

  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const uAnswers = userAnswers[q.id] || [];
      const correctAnswers = q.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id!);

      const isCorrect =
        uAnswers.length === correctAnswers.length &&
        uAnswers.every((id) => correctAnswers.includes(id));

      if (isCorrect) correctCount++;
    });

    return correctCount;
  };

  const handleSubmit = () => {
    // In study mode, verify all questions have been checked
    if (isStudyMode) {
      const allChecked = questions.every((q) => revealedQuestions[q.id]);
      if (!allChecked) {
        toast.error("Sprawdź odpowiedzi na wszystkie pytania przed zakończeniem testu.");
        return;
      }
    }

    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setShowResults(true);

    // Save failed question IDs for potential retry
    const failedIds: string[] = [];
    questions.forEach((q) => {
      const uAnswers = userAnswers[q.id] || [];
      const correctAnswers = q.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id!);
      const isCorrect =
        uAnswers.length === correctAnswers.length &&
        uAnswers.every((id) => correctAnswers.includes(id));
      if (!isCorrect) {
        failedIds.push(q.id);
      }
    });
    setFailedQuestionIds(failedIds);
  };

  const handleFinish = () => {
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= passingThreshold;
    onComplete(percent, passed);
  };

  const handleReset = (onlyFailed = false) => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setRevealedQuestions({});
    
    if (onlyFailed) {
      setRetryOnlyFailed(true);
    } else {
      setRetryOnlyFailed(false);
      setFailedQuestionIds([]);
    }
    
    setTimeLeft(durationMinutes * 60);
    setIsTimeOver(false);
  };

  const score = isSubmitted ? calculateScore() : 0;
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const passed = percent >= passingThreshold;

  const formatTimer = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = Math.floor(absSeconds % 60);
    return `${isNegative ? "-" : ""}${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-white rounded-sm shadow-sm border border-slate-200 p-6 md:p-8 select-none">
      {/* Quiz Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-brand-dark">
            {title}
          </h2>
          {retryOnlyFailed && (
            <span className="inline-block mt-2 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded border border-amber-200">
              Tryb poprawkowy: tylko błędne odpowiedzi ({questions.length})
            </span>
          )}
        </div>

        {/* Timer and Study Mode Control */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Study Mode Toggle */}
          {!isSubmitted && (
            <label className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isStudyMode}
                onChange={(e) => {
                  setIsStudyMode(e.target.checked);
                  setRevealedQuestions({});
                }}
                className="accent-brand-accent h-4 w-4"
              />
              <BookOpen size={16} className="text-slate-500" />
              <span>Tryb nauki (sprawdź od razu)</span>
            </label>
          )}

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded border font-mono text-sm font-bold shadow-sm ${
            isTimeOver ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-slate-50 text-slate-700 border-slate-200"
          }`}>
            <Clock size={16} />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>
      </div>

      {!isSubmitted && (
        <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-sm flex items-start gap-3 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Zasady testu próbnego:</p>
            <p>
              Próg zaliczenia: <span className="font-bold">{passingThreshold}%</span>. Możesz rozwiązywać test wielokrotnie.
              {isStudyMode && " Włączono Tryb Nauki: przy każdym pytaniu zobaczysz przycisk 'Sprawdź', który pokaże prawidłową odpowiedź i uzasadnienie."}
            </p>
          </div>
        </div>
      )}

      {isSubmitted && (
        <div
          className={`mb-8 p-6 rounded-sm text-center border-2 ${passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
            {passed ? (
              <CheckCircle size={32} className="text-green-600" />
            ) : (
              <XCircle size={32} className="text-red-600" />
            )}
            <span className={passed ? "text-green-700" : "text-red-700"}>
              {passed ? "Zaliczone!" : "Niezaliczone"}
            </span>
          </div>
          <p className="text-lg text-slate-700">
            Twój wynik:{" "}
            <span className="font-bold">
              {score}/{questions.length} ({percent}%)
            </span>
          </p>
          {isTimeOver && (
            <p className="text-sm text-red-600 mt-2 font-semibold flex items-center justify-center gap-1">
              <AlertTriangle size={14} /> Czas na realnym egzaminie został przekroczony.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-sm hover:bg-brand-dark transition-colors cursor-pointer"
            >
              Ukończ test
            </button>
            {!passed && failedQuestionIds.length > 0 && (
              <button
                onClick={() => handleReset(true)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={16} /> Popraw tylko błędy ({failedQuestionIds.length})
              </button>
            )}
            <button
              onClick={() => handleReset(false)}
              className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} /> Rozpocznij cały test ponownie
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((q, idx) => {
          const uAnswers = userAnswers[q.id] || [];
          const isRevealed = isSubmitted || (isStudyMode && revealedQuestions[q.id]);

          // Determine status for styling
          let statusClass = "border-slate-200";
          if (isRevealed) {
            const correctAnswers = q.answers
              .filter((a) => a.isCorrect)
              .map((a) => a.id);
            const isCorrect =
              uAnswers.length === correctAnswers.length &&
              uAnswers.every((id) => correctAnswers.includes(id));
            statusClass = isCorrect
              ? "border-green-300 bg-green-50/30"
              : "border-red-300 bg-red-50/30";
          }

          return (
            <div key={q.id} className={`border rounded-lg p-6 transition-all duration-300 ${statusClass}`}>
              <div className="flex items-start justify-between mb-4 gap-4">
                <h3 className="text-lg font-bold text-slate-800">
                  <span className="text-slate-400 mr-2">{idx + 1}.</span>{" "}
                  {q.content}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded whitespace-nowrap">
                    {q.type === "SINGLE_CHOICE" ? "Jednokrotny" : "Wielokrotny"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {q.answers.map((ans) => {
                  const isSelected = uAnswers.includes(ans.id!);
                  const isCorrect = ans.isCorrect;

                  let rowClass = "border-slate-200 hover:bg-slate-50 cursor-pointer";
                  if (isRevealed) {
                    if (isCorrect) rowClass = "border-green-500 bg-green-100/70";
                    else if (isSelected && !isCorrect)
                      rowClass = "border-red-500 bg-red-100/70";
                    else rowClass = "border-slate-200 opacity-60";
                  } else {
                    if (isSelected)
                      rowClass = "border-brand-accent bg-brand-accent/5";
                  }

                  return (
                    <div
                      key={ans.id}
                      onClick={() => handleSelectAnswer(q.id, ans.id!, q.type)}
                      className={`border rounded p-3 transition-colors flex items-center gap-3 ${rowClass}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all
                            ${isSelected ? "border-brand-accent bg-brand-accent" : "border-slate-300"}
                          ${isRevealed && isCorrect ? "border-green-600 bg-green-600" : ""}
                          ${isRevealed && isSelected && !isCorrect ? "border-red-500 bg-red-500" : ""}
                        `}
                      >
                        {isSelected && !isRevealed && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                        {isRevealed && isCorrect && (
                          <CheckCircle size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-slate-700 font-medium text-sm">
                        {ans.content}
                      </span>
                      {isRevealed &&
                        ans.explanation &&
                        (isSelected || isCorrect) && (
                          <div className="ml-auto text-xs text-slate-600 italic max-w-xs text-right hidden md:block">
                            {ans.explanation}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>

              {/* Study Mode 'Check' Button */}
              {isStudyMode && !isRevealed && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCheckQuestionInStudyMode(q.id)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded transition"
                  >
                    Sprawdź odpowiedź
                  </button>
                </div>
              )}

              {/* Show correct answers and explanations after checking/submitting */}
              {isRevealed && (
                <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div>
                    <span className="font-bold">Prawidłowe:</span>{" "}
                    {q.answers
                      .filter((a) => a.isCorrect)
                      .map((a) => a.content)
                      .join(", ")}
                  </div>
                  {q.answers.some(a => a.isCorrect && a.explanation) && (
                    <div>
                      <span className="font-bold">Uzasadnienie:</span>{" "}
                      {q.answers
                        .filter((a) => a.isCorrect && a.explanation)
                        .map((a) => a.explanation)
                        .join(" ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-brand-primary text-white font-bold uppercase rounded-sm hover:bg-brand-dark transition-colors flex items-center gap-2 cursor-pointer"
          >
            Zakończ test i sprawdź wynik <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonQuiz;
