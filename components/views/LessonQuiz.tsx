import React, { useState } from "react";
import { Question, Answer } from "../../types";
import { CheckCircle, XCircle, AlertCircle, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  questions: Question[];
  onComplete: (score: number, passed: boolean) => void;
  passingThreshold?: number; // percent 0-100, default 80
}

const LessonQuiz: React.FC<Props> = ({
  title,
  questions,
  onComplete,
  passingThreshold = 80,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({}); // questionId -> answerIds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // If no questions, just show error or completed
  if (!questions || questions.length === 0) {
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

  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const uAnswers = userAnswers[q.id] || [];
      const correctAnswers = q.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id!); // Assuming ID exists from backend

      // Check if arrays match
      // For simplified logic:
      // Single Choice: user answer must be in correctAnswers (should be length 1)
      // Multiple Choice: user answers must imply exact match of correctAnswers set

      const isCorrect =
        uAnswers.length === correctAnswers.length &&
        uAnswers.every((id) => correctAnswers.includes(id));

      if (isCorrect) correctCount++;
    });

    return correctCount;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= passingThreshold;

    // We show results immediately
    setShowResults(true);

    // Notify parent
    // setTimeout(() => onComplete(percent, passed), 2000); // Optional delay?
    // No, keep user on screen to review answers, add "Finish" button.
  };

  const handleFinish = () => {
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= passingThreshold;
    onComplete(percent, passed);
  };

  const score = isSubmitted ? calculateScore() : 0;
  const percent = Math.round((score / questions.length) * 100);
  const passed = percent >= passingThreshold;

  return (
    <div className="w-full bg-white rounded-sm shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-2xl font-heading font-bold text-brand-dark mb-4">
        {title}
      </h2>

      {!isSubmitted && (
        <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-sm flex items-start gap-3 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Zasady:</p>
            <p>
              Aby zaliczyć test, musisz uzyskać minimum {passingThreshold}%
              poprawnych odpowiedzi.
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
          {!passed && (
            <p className="text-sm text-slate-500 mt-2">
              Przeanalizuj błędy i spróbuj ponownie.
            </p>
          )}

          <button
            onClick={handleFinish}
            className="mt-6 px-8 py-3 bg-brand-primary text-white font-bold rounded-sm hover:bg-brand-dark transition-colors"
          >
            {passed ? "Kontynuuj" : "Spróbuj ponownie (Reset)"}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const uAnswers = userAnswers[q.id] || [];
          // Determine status for styling
          let statusClass = "border-slate-200";
          if (isSubmitted) {
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
            <div key={q.id} className={`border rounded p-6 ${statusClass}`}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  <span className="text-slate-400 mr-2">{idx + 1}.</span>{" "}
                  {q.content}
                </h3>
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                  {q.type === "SINGLE_CHOICE"
                    ? "Jednokrotny wybór"
                    : "Wielokrotny wybór"}
                </span>
              </div>

              <div className="space-y-2">
                {q.answers.map((ans) => {
                  const isSelected = uAnswers.includes(ans.id!);
                  const isCorrect = ans.isCorrect;

                  let rowClass =
                    "border-slate-200 hover:bg-slate-50 cursor-pointer";
                  if (isSubmitted) {
                    if (isCorrect) rowClass = "border-green-500 bg-green-100";
                    else if (isSelected && !isCorrect)
                      rowClass = "border-red-500 bg-red-100";
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
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                            ${isSelected ? "border-brand-accent bg-brand-accent" : "border-slate-300"}
                          ${isSubmitted && isCorrect ? "border-green-600! bg-green-600!" : ""}
                          ${isSubmitted && isSelected && !isCorrect ? "border-red-500! bg-red-500!" : ""}
                        `}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                        {isSubmitted && isCorrect && (
                          <CheckCircle size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-slate-700 font-medium text-sm">
                        {ans.content}
                      </span>
                      {isSubmitted &&
                        ans.explanation &&
                        (isSelected || isCorrect) && (
                          <div className="ml-auto text-xs text-slate-500 italic max-w-xs text-right hidden md:block">
                            {ans.explanation}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
              {isSubmitted && (
                <div className="mt-3 text-xs text-slate-500">
                  Poprawna odpowiedź:{" "}
                  {q.answers
                    .filter((a) => a.isCorrect)
                    .map((a) => a.content)
                    .join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-brand-primary text-white font-bold uppercase rounded-sm hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            Zakończ test i sprawdź wynik <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonQuiz;
