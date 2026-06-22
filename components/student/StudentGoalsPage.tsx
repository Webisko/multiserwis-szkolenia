import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  Calendar,
  Award,
  Plus,
  Trash2,
  Check,
  Edit2,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  courseId?: string;
  progress: number;
  completed: boolean;
  createdAt: string;
}

interface StudentGoalsPageProps {
  studentUser: any;
  myCourses: any[];
  courses: any[];
}

export const StudentGoalsPage: React.FC<StudentGoalsPageProps> = ({
  studentUser,
  myCourses,
  courses,
}) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Ukończ szkolenie UDT Wózki Widłowe",
      description: "Zdobądź uprawnienia na wózki widłowe przed końcem miesiąca",
      targetDate: "2026-02-28",
      courseId: "course-1",
      progress: 65,
      completed: false,
      createdAt: "2026-02-01",
    },
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    courseId: "",
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      courseId: newGoal.courseId || undefined,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: "", description: "", targetDate: "", courseId: "" });
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setGoals(
      goals.map((g) =>
        g.id === id
          ? {
              ...g,
              completed: !g.completed,
              progress: g.completed ? g.progress : 100,
            }
          : g,
      ),
    );
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diff = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const getMotivationalMessage = () => {
    const totalGoals = goals.length;
    const completed = completedGoals.length;
    const percentage =
      totalGoals > 0 ? Math.round((completed / totalGoals) * 100) : 0;

    if (percentage === 100) return "🎉 Gratulacje! Osiągnąłeś wszystkie cele!";
    if (percentage >= 75) return "💪 Świetna robota! Jesteś blisko celu!";
    if (percentage >= 50) return "🚀 Dobra praca! Kontynuuj!";
    if (percentage >= 25) return "📈 Jesteś na dobrej drodze!";
    return "🎯 Wyznacz cele i zacznij działać!";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Target className="text-brand-primary" size={32} />
          Moje Cele
        </h1>
        <p className="text-slate-600">
          Wyznaczaj cele, śledź postępy i osiągaj sukcesy w nauce
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Aktywne cele</span>
            <Target size={24} className="text-blue-200" />
          </div>
          <div className="text-3xl font-bold">{activeGoals.length}</div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">Ukończone</span>
            <Award size={24} className="text-green-200" />
          </div>
          <div className="text-3xl font-bold">{completedGoals.length}</div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">Postęp ogólny</span>
            <TrendingUp size={24} className="text-purple-200" />
          </div>
          <div className="text-3xl font-bold">
            {goals.length > 0
              ? Math.round((completedGoals.length / goals.length) * 100)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-linear-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-lg p-4 mb-8">
        <p className="text-center text-lg font-semibold text-slate-700">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Add Goal Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primaryHover transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Dodaj nowy cel
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Nowy cel</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tytuł celu *
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                placeholder="np. Ukończ szkolenie UDT"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Opis
              </label>
              <textarea
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                placeholder="Opcjonalny opis celu"
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Data docelowa *
              </label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, targetDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Powiązane szkolenie (opcjonalnie)
              </label>
              <select
                value={newGoal.courseId}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, courseId: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">Brak</option>
                {myCourses.map((mc) => {
                  const course = courses.find((c) => c.id === mc.courseId);
                  return (
                    <option key={mc.courseId} value={mc.courseId}>
                      {course?.title || mc.courseId}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddGoal}
                disabled={!newGoal.title || !newGoal.targetDate}
                className="bg-brand-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-primaryHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Dodaj cel
              </button>
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoal({
                    title: "",
                    description: "",
                    targetDate: "",
                    courseId: "",
                  });
                }}
                className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Aktywne cele
          </h2>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const isOverdue = daysRemaining < 0;
              const isUrgent = daysRemaining <= 7 && daysRemaining >= 0;

              return (
                <div
                  key={goal.id}
                  className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-slate-600 text-sm mb-3">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar size={16} />
                          <span>
                            {new Date(goal.targetDate).toLocaleDateString(
                              "pl-PL",
                            )}
                          </span>
                        </div>
                        <div
                          className={`font-semibold ${
                            isOverdue
                              ? "text-red-600"
                              : isUrgent
                                ? "text-orange-600"
                                : "text-green-600"
                          }`}
                        >
                          {isOverdue
                            ? `Przekroczono o ${Math.abs(daysRemaining)} dni`
                            : `Pozostało ${daysRemaining} dni`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleComplete(goal.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Oznacz jako ukończone"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Usuń cel"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Postęp</span>
                      <span className="font-semibold text-slate-800">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-brand-primary to-brand-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Ukończone cele
          </h2>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-green-50 border border-green-200 rounded-lg p-6 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Check size={20} className="text-green-600" />
                      <h3 className="text-lg font-bold text-slate-800 line-through">
                        {goal.title}
                      </h3>
                    </div>
                    {goal.description && (
                      <p className="text-slate-600 text-sm mb-2">
                        {goal.description}
                      </p>
                    )}
                    <div className="text-sm text-slate-600">
                      Ukończono:{" "}
                      {new Date(goal.targetDate).toLocaleDateString("pl-PL")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Usuń cel"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-16">
          <Target size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">Brak celów</h3>
          <p className="text-slate-500 mb-6">
            Wyznacz swój pierwszy cel i zacznij osiągać sukcesy!
          </p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primaryHover transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Dodaj pierwszy cel
          </button>
        </div>
      )}
    </div>
  );
};
