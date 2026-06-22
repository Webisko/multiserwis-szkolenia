import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Users,
  Clock,
  BookOpen,
  AlertCircle,
  Search,
  Download,
} from "lucide-react";

interface EmployeeStats {
  id: string;
  name: string;
  email: string;
  totalWatchTime: number;
  completedCourses: number;
  activeCourses: number;
  passedTests: number;
  lastLogin: string | null;
}

interface AnalyticsOverview {
  totalEmployees: number;
  activeNow: number;
  totalWatchHours: number;
}

const AnalyticsView: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [employees, setEmployees] = useState<EmployeeStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.analytics.getGuardianStats();
        setOverview(data.overview ?? null);
        setEmployees(Array.isArray(data.employees) ? data.employees : []);
      } catch (error) {
        setError("Brak dostepu do analityki lub API jest niedostepne.");
        setOverview({ totalEmployees: 0, activeNow: 0, totalWatchHours: 0 });
        setEmployees([]);
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Ładowanie danych analitycznych...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-slate-800">
        Analityka i Raporty
      </h2>

      {error && (
        <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-full">
              <Users size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {overview?.totalEmployees}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Pracowników
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {overview?.totalWatchHours}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Godzin szkoleniowych
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {employees.reduce((acc, e) => acc + e.completedCourses, 0)}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Ukończonych szkoleń
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-slate-700">
            Szczegółowe postępy pracowników
          </h3>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Szukaj pracownika..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs uppercase rounded-sm hover:bg-slate-50 transition-colors">
              <Download size={14} /> Eksportuj CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Pracownik</th>
                <th className="px-6 py-3">Czas nauki</th>
                <th className="px-6 py-3">Ukończone</th>
                <th className="px-6 py-3">W toku</th>
                <th className="px-6 py-3">Zaliczone testy</th>
                <th className="px-6 py-3">Ostatnia aktywność</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span>{emp.name || "Brak nazwy"}</span>
                        <span className="text-xs text-slate-400 font-normal">
                          {emp.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {formatDuration(emp.totalWatchTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">
                      {emp.completedCourses}
                    </td>
                    <td className="px-6 py-4 text-brand-accent font-bold">
                      {emp.activeCourses}
                    </td>
                    <td className="px-6 py-4">{emp.passedTests}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {emp.lastLogin
                        ? new Date(emp.lastLogin).toLocaleString("pl-PL")
                        : "Nigdy"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Brak wyników.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
