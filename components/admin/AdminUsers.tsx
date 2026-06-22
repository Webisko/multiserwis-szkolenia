import React from "react";
import {
  Search,
  UserPlus,
  Mail,
  Building2,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { ADMIN_STUDENTS, COURSES } from "../../constants";
import type { Student } from "../../types";
import type { UserOverrides } from "../panel/UserProfileView";

interface UserSummary {
  name: string;
  email: string;
  company: string;
  averageProgress: number;
  coursesCount: number;
  courseIds: string[];
  status: "active" | "inactive";
}

const buildUserSummaries = (students: Student[]) => {
  const usersMap = new Map<string, UserSummary>();

  students.forEach((student) => {
    const existing = usersMap.get(student.email);
    if (!existing) {
      usersMap.set(student.email, {
        name: student.name,
        email: student.email,
        company: student.company || "Indywidualny",
        averageProgress: student.progress,
        coursesCount: 1,
        courseIds: [student.course],
        status: student.status === "active" ? "active" : "inactive",
      });
    } else {
      const totalProgress =
        existing.averageProgress * existing.coursesCount + student.progress;
      const newCount = existing.coursesCount + 1;
      usersMap.set(student.email, {
        ...existing,
        averageProgress: Math.round(totalProgress / newCount),
        coursesCount: newCount,
        courseIds: Array.from(new Set([...existing.courseIds, student.course])),
        status:
          existing.status === "active" || student.status === "active"
            ? "active"
            : "inactive",
      });
    }
  });

  return Array.from(usersMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

interface AdminUsersProps {
  onViewUser?: (email: string) => void;
  onEditUser?: (email: string) => void;
  onDeleteUser?: (email: string) => void;
  onAddClick?: () => void;
  hideCompanyColumn?: boolean;
  overrides?: Record<string, UserOverrides>;
  hiddenEmails?: string[];
  title?: string;
  subtitle?: string;
  addButtonLabel?: string;
  searchPlaceholder?: string;
  countLabel?: string;
  forcedCompany?: string;
  students?: Student[];
}

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "U") + (parts[1]?.[0] || parts[0]?.[1] || "");
};

export const AdminUsers: React.FC<AdminUsersProps> = ({
  onViewUser,
  onEditUser,
  onDeleteUser,
  onAddClick,
  overrides,
  hiddenEmails = [],
  title = "Użytkownicy",
  subtitle = "Lista wszystkich użytkowników przypisanych do kursów.",
  addButtonLabel = "Dodaj użytkownika",
  searchPlaceholder = "Szukaj użytkownika...",
  countLabel = "UŻYTKOWNIKÓW",
  forcedCompany,
  students = ADMIN_STUDENTS,
  hideCompanyColumn = false,
}) => {
  const [query, setQuery] = React.useState("");
  const [companyFilter, setCompanyFilter] = React.useState<string | null>(null);
  const [courseFilter, setCourseFilter] = React.useState<string>("all");
  const [pendingDeleteEmail, setPendingDeleteEmail] = React.useState<
    string | null
  >(null);

  const courseOptions = COURSES.map((course) => ({
    id: course.id,
    label: course.title,
  }));

  const selectClassName =
    "w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white appearance-none pr-10 text-sm";

  const users = React.useMemo(() => {
    const base = buildUserSummaries(students).map((u) => {
      const override = overrides?.[u.email];
      return {
        ...u,
        name: override?.name || u.name,
        company: override?.company || u.company,
      };
    });

    const visible = hiddenEmails.length
      ? base.filter((u) => !hiddenEmails.includes(u.email))
      : base;

    const companyGate = forcedCompany || companyFilter;
    const byCompany = companyGate
      ? visible.filter((u) => u.company === companyGate)
      : visible;
    const byCourse =
      courseFilter === "all"
        ? byCompany
        : byCompany.filter((u) => u.courseIds.includes(courseFilter));

    const q = query.trim().toLowerCase();
    if (!q) return byCourse;
    return byCourse.filter((u) => {
      const hay = `${u.name} ${u.email} ${u.company}`.toLowerCase();
      return hay.includes(q);
    });
  }, [
    companyFilter,
    courseFilter,
    forcedCompany,
    hiddenEmails,
    overrides,
    query,
    students,
  ]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>
          <button
            className="flex items-center gap-2 bg-brand-accent text-white px-4 py-2 rounded-lg shadow hover:bg-brand-accentHover transition text-sm font-medium"
            onClick={() => onAddClick?.()}
            disabled={!onAddClick}
          >
            <UserPlus size={16} />
            {addButtonLabel}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:max-w-3xl">
              <div className="relative w-full sm:max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={16} />
                </span>
                <input
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent w-full"
                  placeholder={searchPlaceholder}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative w-fit">
                  <select
                    className="appearance-none w-fit max-w-65 truncate pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent cursor-pointer"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    aria-label="Filtruj po szkoleniu"
                    title={
                      courseFilter === "all"
                        ? "Wszystkie szkolenia"
                        : courseOptions.find(
                            (course) => course.id === courseFilter,
                          )?.label || ""
                    }
                  >
                    <option value="all">Wszystkie szkolenia</option>
                    {courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>
              {!forcedCompany && companyFilter && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold whitespace-nowrap">
                  <Building2 size={14} /> {companyFilter}
                  <button
                    onClick={() => setCompanyFilter(null)}
                    className="p-1 rounded hover:bg-slate-200 transition"
                    aria-label="Usuń filtr firmy"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="text-right whitespace-nowrap">
              <div className="text-2xl font-bold text-slate-900 leading-none">
                {users.length}
              </div>
              <div className="text-xs font-semibold uppercase text-slate-500 mt-1">
                {countLabel}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Użytkownik</th>
                  {!hideCompanyColumn && <th className="px-4 py-3">Firma</th>}
                  <th className="px-4 py-3 text-center">Szkolenia</th>
                  <th className="px-4 py-3 text-center">Średni postęp</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.email}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onViewUser?.(user.email)}
                          className="h-16 w-16 rounded-md bg-slate-200 border border-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          aria-label="Podgląd użytkownika"
                        >
                          {initials(user.name).toUpperCase()}
                        </button>
                        <div>
                          <button
                            onClick={() => onViewUser?.(user.email)}
                            className="font-semibold text-slate-800 hover:text-brand-primary text-left"
                            title="Podgląd profilu"
                          >
                            {user.name}
                          </button>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    {!hideCompanyColumn && (
                      <td className="px-4 py-4 align-middle">
                        {forcedCompany ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                            <Building2 size={12} /> {user.company}
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              setCompanyFilter((prev) =>
                                prev === user.company ? null : user.company,
                              )
                            }
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
                            title={`Pokaż użytkowników z firmy: ${user.company}`}
                          >
                            <Building2 size={12} /> {user.company}
                          </button>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-4 text-slate-600 text-center">
                      {user.coursesCount}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-brand-accent h-2 rounded-full"
                            style={{ width: `${user.averageProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {user.averageProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.status === "active" ? "Aktywny" : "Nieaktywny"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <div className="relative w-32 h-10 overflow-hidden">
                          <div
                            className={`absolute inset-0 flex items-center justify-end transition-all ease-in-out ${
                              pendingDeleteEmail === user.email && onDeleteUser
                                ? "translate-x-0 opacity-100 duration-300"
                                : "translate-x-full opacity-0 duration-500"
                            }`}
                          >
                            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-2 py-1 shadow-sm">
                              <div className="relative group">
                                <button
                                  onClick={() => {
                                    onDeleteUser(user.email);
                                    setPendingDeleteEmail(null);
                                  }}
                                  className="p-2 text-red-700 hover:bg-red-100 rounded-md transition"
                                  aria-label="Potwierdź usunięcie"
                                >
                                  <Check size={16} />
                                </button>
                                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                  Potwierdź
                                </div>
                              </div>
                              <div className="relative group">
                                <button
                                  onClick={() => setPendingDeleteEmail(null)}
                                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
                                  aria-label="Anuluj usunięcie"
                                >
                                  <X size={16} />
                                </button>
                                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                  Anuluj
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`absolute inset-0 flex items-center justify-end gap-2 transition-all ease-in-out ${
                              pendingDeleteEmail === user.email && onDeleteUser
                                ? "translate-x-full opacity-0 duration-300"
                                : "translate-x-0 opacity-100 duration-500"
                            }`}
                          >
                            <div className="relative group">
                              <button
                                onClick={() => onViewUser?.(user.email)}
                                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                aria-label="Podgląd"
                              >
                                <Eye size={16} />
                              </button>
                              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                Podgląd
                              </div>
                            </div>
                            <div className="relative group">
                              <button
                                onClick={() => onEditUser?.(user.email)}
                                className="p-2 text-brand-accent hover:text-brand-accentHover hover:bg-orange-50 rounded-lg transition"
                                aria-label="Edytuj"
                              >
                                <Edit size={16} />
                              </button>
                              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                Edytuj
                              </div>
                            </div>
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  setPendingDeleteEmail(user.email)
                                }
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                aria-label="Usuń"
                              >
                                <Trash2 size={16} />
                              </button>
                              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                Usuń
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
