import React from "react";
import {
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  ArrowUpRight,
  FileText,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  Award,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { ADMIN_STUDENTS, COURSES, POPULARITY_DATA } from "../../constants";
import type { AdminSectionId } from "./AdminPanelLayout";

interface AdminDashboardProps {
  onNavigate: (section: AdminSectionId) => void;
}

const parsePrice = (price: string) => {
  const cleaned = price.replace(/[^0-9]/g, "");
  return cleaned ? Number(cleaned) : 0;
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  });

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const uniqueUsers = new Set(ADMIN_STUDENTS.map((student) => student.email)).size;
  const totalCourses = COURSES.length;
  const companyCounts = ADMIN_STUDENTS.reduce<Record<string, number>>((acc, student) => {
    const key = student.company || "Indywidualny";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const totalCompanies = Object.keys(companyCounts).length;

  const priceMap = COURSES.reduce<Record<string, number>>((acc, course) => {
    acc[course.id] = parsePrice(course.price);
    return acc;
  }, {});

  const totalRevenue = ADMIN_STUDENTS.reduce(
    (sum, student) => sum + (priceMap[student.course] || 0),
    0
  );

  const topCompanies = Object.entries(companyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const activeEnrollments = ADMIN_STUDENTS.filter(
    (student) => student.status === "active"
  ).length;
  const warningEnrollments = ADMIN_STUDENTS.filter(
    (student) => student.status === "warning"
  ).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Quick Action Header */}
      <div className="bg-gradient-to-r from-brand-dark via-slate-900 to-brand-primary rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-accent text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles size={13} />
            MultiSerwis Kutno • Panel Zarządzania
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight">
            Dzień dobry, Administratorze 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Platforma działa stabilnie. Masz dziś <strong>{activeEnrollments} aktywnych uczestników</strong> na kursach oraz <strong>{warningEnrollments} osoby</strong> oczekujące na wyznaczenie terminu egzaminu UDT.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate("course-create")}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            Dodaj nowe szkolenie
          </button>
          <button
            onClick={() => onNavigate("user-create")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/20 transition-all cursor-pointer"
          >
            <Users size={15} />
            Rejestracja kursanta
          </button>
          <button
            onClick={() => onNavigate("reports")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/10 transition-all cursor-pointer"
          >
            <FileText size={15} />
            Raport UDT
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Users */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kursanci w Bazie
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-heading font-black text-slate-900 block leading-none">
              {uniqueUsers}
            </span>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle2 size={12} /> {activeEnrollments} aktywnych
              </span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{warningEnrollments} egzaminy</span>
            </div>
          </div>
        </div>

        {/* Card 2: Courses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Katalog Szkoleń
            </span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-heading font-black text-slate-900 block leading-none">
              {totalCourses}
            </span>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
              <span className="text-purple-600 font-bold">UDT, IMBiGS, SEP</span>
              <span>•</span>
              <span>E-learning 24/7</span>
            </div>
          </div>
        </div>

        {/* Card 3: Companies */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Firmy i Klienci B2B
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Building2 size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-heading font-black text-slate-900 block leading-none">
              {totalCompanies}
            </span>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium truncate">
              <span className="text-slate-600 font-semibold truncate">
                Lider: {topCompanies[0]?.name || "Brak"} ({topCompanies[0]?.count})
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Wartość Zamówień
            </span>
            <div className="p-2.5 bg-orange-50 text-brand-accent rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-heading font-black text-brand-primary block leading-none">
              {formatCurrency(totalRevenue)}
            </span>
            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600 font-bold">
              <span>↑ 100% zrealizowane</span>
              <span className="text-slate-400 font-normal">• Łącznie</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Top Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Course popularity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
                Analityka Szkoleń
              </span>
              <h2 className="text-lg font-heading font-bold text-slate-900 mt-0.5">
                Popularność kategorii i zapisy kursantów
              </h2>
            </div>
            <button
              onClick={() => onNavigate("courses")}
              className="text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors self-start sm:self-auto"
            >
              Zarządzaj katalogiem →
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {POPULARITY_DATA.map((item) => {
              const percentage = Math.min(Math.round((item.value / 85) * 100), 100);
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-800">{item.name}</span>
                    <span className="text-slate-500 font-bold">{item.value} kursantów ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color || "#003d4d",
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust / Pass rate callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
                <Award size={18} />
              </span>
              <div>
                <strong className="text-slate-900 block">Zdawalność egzaminów państwowych UDT</strong>
                <span className="text-slate-500">Średnia zdawalność kursantów MultiSerwis Kutno: 98.4%</span>
              </div>
            </div>
            <span className="font-heading font-black text-emerald-600 text-lg">98.4%</span>
          </div>
        </div>

        {/* Right Column (1 col): Top B2B Companies */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
                Portfel B2B
              </span>
              <h2 className="text-lg font-heading font-bold text-slate-900 mt-0.5">
                Kluczowi Partnerzy
              </h2>
            </div>
            <button
              onClick={() => onNavigate("companies")}
              className="text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors"
            >
              Wszystkie →
            </button>
          </div>

          <div className="space-y-4">
            {topCompanies.map((company, idx) => (
              <div
                key={company.name}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-white text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {company.name}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {company.count} przeszkolonych osób
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md shrink-0">
                  {company.count}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate("company-create")}
            className="w-full py-2.5 border border-slate-200 hover:border-brand-accent text-slate-700 hover:text-brand-accent font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            + Zarejestruj nową firmę
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-base font-heading font-bold text-slate-900 mb-4">
          Szybkie Operacje Administracyjne
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate("users")}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-brand-accent shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-sm group-hover:text-brand-accent transition-colors">
              Zarządzaj Kursantami
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Lista uczestników, postępy w e-learningu, edycja danych i PESEL.
            </p>
          </button>

          <button
            onClick={() => onNavigate("courses")}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-brand-accent shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap size={18} />
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-sm group-hover:text-brand-accent transition-colors">
              Edycja Programów Szkoleń
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Zarządzanie modułami, cenami, pytaniami testowymi i edytor TipTap.
            </p>
          </button>

          <button
            onClick={() => onNavigate("finance")}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-brand-accent shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-sm group-hover:text-brand-accent transition-colors">
              Finanse i Faktury
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Statusy płatności, faktury proforma, rozliczenia z firmami i KFS.
            </p>
          </button>

          <button
            onClick={() => onNavigate("settings")}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-brand-accent shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Settings size={18} />
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-sm group-hover:text-brand-accent transition-colors">
              Ustawienia Portalu
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Konfiguracja integracji, e-maili powiadomień i parametrów UDT.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
