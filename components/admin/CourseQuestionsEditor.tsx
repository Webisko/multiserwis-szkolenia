import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import { api } from "../../services/api"; // Ensure api service is imported
import { Question, Answer, QuestionType, Difficulty } from "../../types";

interface CourseQuestionsEditorProps {
  courseId: string;
  modules: any[]; // Pass modules to allow assigning questions
}

export const CourseQuestionsEditor: React.FC<CourseQuestionsEditorProps> = ({
  courseId,
  modules,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Question Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newModuleId, setNewModuleId] = useState<string>("");
  const [newType, setNewType] = useState<QuestionType>("SINGLE_CHOICE");
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>("MEDIUM");
  const [newAnswers, setNewAnswers] = useState<Answer[]>([
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await api.questions.list(courseId);
      setQuestions(data);
    } catch (error) {
      console.error("Failed to load questions", error);
      alert("Nie udało się pobrać pytań.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadQuestions();
  }, [courseId]);

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, { content: "", isCorrect: false }]);
  };

  const handleRemoveAnswer = (index: number) => {
    setNewAnswers(newAnswers.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (
    index: number,
    field: keyof Answer,
    value: any,
  ) => {
    const updated = [...newAnswers];
    updated[index] = { ...updated[index], [field]: value };
    setNewAnswers(updated);
  };

  const handleSaveQuestion = async () => {
    // Validation
    if (!newContent.trim()) return alert("Treść pytania jest wymagana");
    if (newAnswers.some((a) => !a.content.trim()))
      return alert("Treść odpowiedzi jest wymagana");
    if (!newAnswers.some((a) => a.isCorrect))
      return alert("Przynajmniej jedna odpowiedź musi być poprawna");

    try {
      await api.questions.create({
        courseId,
        moduleId: newModuleId || undefined,
        content: newContent,
        type: newType,
        difficulty: newDifficulty,
        answers: newAnswers,
      });

      setIsAdding(false);
      setNewContent("");
      setNewAnswers([
        { content: "", isCorrect: false },
        { content: "", isCorrect: false },
      ]);
      loadQuestions(); // Reload list
    } catch (error) {
      console.error("Failed to create question", error);
      alert("Błąd podczas dodawania pytania");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Baza Pytań Egzaminacyjnych
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pytania używane w testach modułowych (jeśli przypisane) oraz w
            egzaminie końcowym.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 text-brand-accent hover:text-brand-accentHover font-semibold"
        >
          <Plus size={16} /> {isAdding ? "Anuluj" : "Dodaj pytanie"}
        </button>
      </div>

      <div className="p-6">
        {isAdding && (
          <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 mb-4">Nowe Pytanie</h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Treść pytania
              </label>
              <textarea
                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                rows={2}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Np. Jaka jest maksymalna..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Typ
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as QuestionType)}
                >
                  <option value="SINGLE_CHOICE">Jednokrotnego wyboru</option>
                  <option value="MULTIPLE_CHOICE">Wielokrotnego wyboru</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Trudność
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  value={newDifficulty}
                  onChange={(e) =>
                    setNewDifficulty(e.target.value as Difficulty)
                  }
                >
                  <option value="EASY">Łatwe</option>
                  <option value="MEDIUM">Średnie</option>
                  <option value="HARD">Trudne</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Moduł (opcjonalne)
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  value={newModuleId}
                  onChange={(e) => setNewModuleId(e.target.value)}
                >
                  <option value="">-- Ogólne (tylko egzamin końcowy) --</option>
                  {modules.map((m, i) => (
                    <option key={m.id} value={m.id}>
                      Moduł {i + 1}: {m.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="block text-sm font-semibold text-slate-700">
                Odpowiedzi
              </label>
              {newAnswers.map((answer, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleAnswerChange(idx, "isCorrect", !answer.isCorrect)
                    }
                    className={`p-2 rounded-full transition ${answer.isCorrect ? "text-emerald-600 bg-emerald-50" : "text-slate-300 bg-slate-100 hover:text-slate-400"}`}
                    title="Oznacz jako poprawne"
                  >
                    {answer.isCorrect ? (
                      <CheckCircle size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-current" />
                    )}
                  </button>
                  <input
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder={`Odpowiedź ${idx + 1}`}
                    value={answer.content}
                    onChange={(e) =>
                      handleAnswerChange(idx, "content", e.target.value)
                    }
                  />
                  <button
                    onClick={() => handleRemoveAnswer(idx)}
                    className="text-slate-400 hover:text-rose-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddAnswer}
                className="text-sm font-semibold text-brand-accent hover:underline mt-2"
              >
                + Dodaj odpowiedź
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveQuestion}
                className="px-6 py-2 bg-brand-accent text-white rounded-lg font-semibold shadow hover:bg-brand-accentHover"
              >
                Zapisz pytanie
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {isLoading && (
            <p className="text-slate-500 text-sm">Ładowanie pytań...</p>
          )}
          {!isLoading && questions.length === 0 && (
            <p className="text-slate-500 text-sm">Brak pytań w bazie.</p>
          )}

          {questions.map((q, i) => (
            <div
              key={q.id || i}
              className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-medium text-slate-900">{q.content}</div>
                  <div className="text-xs text-slate-500 mt-1 flex gap-2">
                    <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                      {q.type === "SINGLE_CHOICE"
                        ? "Jednokrotny"
                        : "Wielokrotny"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded ${q.difficulty === "HARD" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {q.difficulty}
                    </span>
                    {q.moduleId && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        Moduł:{" "}
                        {modules.find((m) => m.id === q.moduleId)?.title ||
                          "Nieznany"}
                      </span>
                    )}
                  </div>
                </div>
                {/* Actions could go here (Edit/Delete) - for MVP just view */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
