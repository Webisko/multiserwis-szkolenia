import React, { useState, useEffect, useMemo } from "react";
import { IndustrialIcon } from "./IndustrialIcon";
import { COURSES, type Course } from "@multiserwis/shared";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: "STUDENT" | "COMPANY_GUARDIAN" | "MANAGER" | "ADMIN";
  phone?: string;
  companyName?: string;
  nip?: string;
}

interface LessonItem {
  id: string;
  moduleId: string;
  title: string;
  type: "video" | "text" | "test";
  duration: string;
  content: string;
  videoUrl?: string | null;
  order: number;
  completed?: boolean;
}

interface ModuleItem {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: LessonItem[];
}

interface ExamQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

interface EnrolledCourse {
  enrollmentId: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  description: string;
  progress: number;
  status: string;
  completedLessons: number;
  totalLessons: number;
  expiresAt?: string | null;
  completedAt?: string | null;
}

interface CourseDetailPayload {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  description: string;
  progress: number;
  status: string;
  modules: ModuleItem[];
  examQuestions: ExamQuestionItem[];
}

interface TicketMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

interface TicketItem {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "closed";
  priority: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessageItem[];
}

interface GuardianEmployee {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  enrollments: {
    id: string;
    courseId: string;
    courseTitle: string;
    category?: string;
    progress: number;
    status: string;
    completedAt?: string | null;
    expiresAt?: string | null;
  }[];
}

interface Props {
  initialMode?: "auto" | "student" | "guardian";
}

export const LmsPortalIsland: React.FC<Props> = ({ initialMode = "auto" }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string>("");
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);

  // Login & Register form state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [regForm, setRegForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT" as "STUDENT" | "COMPANY_GUARDIAN",
    companyName: "",
    nip: "",
  });

  // Student LMS state
  const [studentTab, setStudentTab] = useState<"courses" | "player" | "certificates" | "support">("courses");
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [catalogCourses, setCatalogCourses] = useState<Course[]>(COURSES);
  const [activeCourse, setActiveCourse] = useState<CourseDetailPayload | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [courseLoading, setCourseLoading] = useState<boolean>(false);
  const [savingProgress, setSavingProgress] = useState<boolean>(false);

  // Exam simulator state inside player
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Guardian B2B state
  const [guardianTab, setGuardianTab] = useState<"employees" | "add_employee" | "support">("employees");
  const [employees, setEmployees] = useState<GuardianEmployee[]>([]);
  const [empForm, setEmpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courseId: "c1",
    password: "",
  });
  const [empSaving, setEmpSaving] = useState<boolean>(false);
  const [empFeedback, setEmpFeedback] = useState<string>("");

  // Support tickets state
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    category: "Merytoryczne",
    priority: "normal",
    message: "",
  });
  const [replyText, setReplyText] = useState<string>("");
  const [ticketSubmitting, setTicketSubmitting] = useState<boolean>(false);

  // Helper for authenticated requests
  const apiFetch = async (url: string, options: RequestInit = {}, overrideToken?: string) => {
    const activeToken = overrideToken ?? token;
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };
    if (activeToken) {
      headers.Authorization = `Bearer ${activeToken}`;
    }
    return fetch(url, { ...options, headers });
  };

  // Initialize session and handle ?sso_token=...
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get("sso_token");
    const storedToken = ssoToken || localStorage.getItem("token");

    if (ssoToken) {
      localStorage.setItem("token", ssoToken);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // Load catalog courses in background
    fetch("/api/courses", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : null;
        if (list !== null) setCatalogCourses(list);
      })
      .catch(() => {});

    if (!storedToken) {
      setAuthLoading(false);
      return;
    }

    setToken(storedToken);
    apiFetch("/api/auth/session", { method: "GET" }, storedToken)
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          return;
        }
        const data = await res.json();
        if (data?.authenticated && data?.user) {
          const authUser: AuthUser = data.user;
          if (authUser.role === "ADMIN" || authUser.role === "MANAGER") {
            const isProd = window.location.hostname.endsWith("multiserwis.edu.pl");
            const target = isProd
              ? `https://panel.multiserwis.edu.pl/admin/sso?sso_token=${encodeURIComponent(storedToken)}`
              : `http://localhost:8000/admin/sso?sso_token=${encodeURIComponent(storedToken)}`;
            window.location.href = target;
            return;
          }
          setUser(authUser);
          await loadPortalData(authUser, storedToken);
        } else {
          localStorage.removeItem("token");
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  const loadPortalData = async (currentUser: AuthUser, activeToken: string) => {
    try {
      if (currentUser.role === "COMPANY_GUARDIAN" || initialMode === "guardian") {
        const empRes = await apiFetch("/api/guardian/employees", { method: "GET" }, activeToken);
        if (empRes.ok) {
          const empData = await empRes.json();
          setEmployees(Array.isArray(empData) ? empData : []);
        }
      } else {
        const coursesRes = await apiFetch("/api/lms/courses", { method: "GET" }, activeToken);
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setEnrolledCourses(Array.isArray(coursesData) ? coursesData : []);
        }
      }

      const ticketsRes = await apiFetch("/api/tickets", { method: "GET" }, activeToken);
      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        const safeTickets = Array.isArray(ticketsData) ? ticketsData : [];
        setTickets(safeTickets);
        if (safeTickets.length > 0 && !selectedTicketId) {
          setSelectedTicketId(safeTickets[0].id);
        }
      }
    } catch {
      // Ignore transient network errors
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), password: loginPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) {
        throw new Error(data.message || "Nieprawidłowy adres e-mail lub hasło.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      const authUser: AuthUser = data.user;
      if (authUser.role === "ADMIN" || authUser.role === "MANAGER") {
        const isProd = window.location.hostname.endsWith("multiserwis.edu.pl");
        window.location.href = isProd
          ? `https://panel.multiserwis.edu.pl/admin/sso?sso_token=${encodeURIComponent(data.token)}`
          : `http://localhost:8000/admin/sso?sso_token=${encodeURIComponent(data.token)}`;
        return;
      }

      setUser(authUser);
      await loadPortalData(authUser, data.token);
    } catch (err: any) {
      setAuthError(err?.message || "Wystąpił błąd podczas logowania.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(regForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) {
        throw new Error(data.message || "Nie udało się utworzyć konta. Sprawdź poprawność danych.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      await loadPortalData(data.user, data.token);
    } catch (err: any) {
      setAuthError(err?.message || "Wystąpił błąd podczas rejestracji.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/session", { method: "DELETE" });
    } catch {
      // Ignore
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setActiveCourse(null);
  };

  const openCoursePlayer = async (courseId: string) => {
    setCourseLoading(true);
    setStudentTab("player");
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const res = await apiFetch(`/api/lms/courses/${encodeURIComponent(courseId)}`);
      if (!res.ok) throw new Error("Nie udało się pobrać materiałów kursu.");
      const data: CourseDetailPayload = await res.json();
      const safeModules = Array.isArray(data.modules) ? data.modules : [];
      const normalized: CourseDetailPayload = {
        ...data,
        modules: safeModules,
        examQuestions: Array.isArray(data.examQuestions) ? data.examQuestions : [],
      };
      setActiveCourse(normalized);

      // Pick first incomplete lesson or very first lesson
      let firstLesson: string | null = null;
      let firstIncomplete: string | null = null;
      for (const mod of safeModules) {
        for (const les of Array.isArray(mod.lessons) ? mod.lessons : []) {
          if (!firstLesson) firstLesson = les.id;
          if (!les.completed && !firstIncomplete) {
            firstIncomplete = les.id;
          }
        }
      }
      setActiveLessonId(firstIncomplete || firstLesson);
    } catch {
      setStudentTab("courses");
    } finally {
      setCourseLoading(false);
    }
  };

  const activeLesson = useMemo<LessonItem | null>(() => {
    if (!activeCourse || !activeLessonId) return null;
    for (const mod of Array.isArray(activeCourse.modules) ? activeCourse.modules : []) {
      for (const les of Array.isArray(mod.lessons) ? mod.lessons : []) {
        if (les.id === activeLessonId) return les;
      }
    }
    return null;
  }, [activeCourse, activeLessonId]);

  const toggleLessonComplete = async (lesson: LessonItem, completed = true) => {
    if (!activeCourse) return;
    setSavingProgress(true);
    try {
      const res = await apiFetch("/api/lms/progress", {
        method: "POST",
        body: JSON.stringify({
          courseId: activeCourse.id,
          lessonId: lesson.id,
          completed,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const updatedModules = activeCourse.modules.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((l) => (l.id === lesson.id ? { ...l, completed } : l)),
        }));
        setActiveCourse({
          ...activeCourse,
          progress: result.progress ?? activeCourse.progress,
          status: result.status ?? activeCourse.status,
          modules: updatedModules,
        });
        setEnrolledCourses((prev) =>
          prev.map((c) =>
            c.id === activeCourse.id
              ? {
                  ...c,
                  progress: result.progress ?? c.progress,
                  status: result.status ?? c.status,
                  completedLessons: result.completedLessons ?? c.completedLessons,
                }
              : c
          )
        );
      }
    } finally {
      setSavingProgress(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmpSaving(true);
    setEmpFeedback("");
    try {
      const res = await apiFetch("/api/guardian/employees", {
        method: "POST",
        body: JSON.stringify(empForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Nie udało się zapisać pracownika.");
      }
      setEmpFeedback("Pracownik został dodany i przypisany do wybranego szkolenia.");
      setEmpForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        courseId: catalogCourses[0]?.id || "c1",
        password: "",
      });
      if (user && token) {
        await loadPortalData(user, token);
      }
      setTimeout(() => {
        setGuardianTab("employees");
        setEmpFeedback("");
      }, 1200);
    } catch (err: any) {
      setEmpFeedback(err?.message || "Błąd podczas zapisu pracownika.");
    } finally {
      setEmpSaving(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.message.trim()) return;
    setTicketSubmitting(true);
    try {
      const res = await apiFetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify(newTicketForm),
      });
      if (res.ok) {
        setNewTicketForm({ subject: "", category: "Merytoryczne", priority: "normal", message: "" });
        if (user && token) {
          await loadPortalData(user, token);
        }
      }
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyText.trim()) return;
    setTicketSubmitting(true);
    try {
      const res = await apiFetch(`/api/tickets/${encodeURIComponent(selectedTicketId)}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (res.ok) {
        setReplyText("");
        if (user && token) {
          await loadPortalData(user, token);
        }
      }
    } finally {
      setTicketSubmitting(false);
    }
  };

  const selectedTicket = useMemo(
    () => (Array.isArray(tickets) ? tickets.find((t) => t.id === selectedTicketId) || null : null),
    [tickets, selectedTicketId]
  );

  const quizScore = useMemo(() => {
    const questions = Array.isArray(activeCourse?.examQuestions) ? activeCourse!.examQuestions : [];
    if (questions.length === 0) return { correct: 0, total: 0, percent: 100 };
    let correct = 0;
    for (const q of questions) {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    }
    return {
      correct,
      total: questions.length,
      percent: Math.round((correct / questions.length) * 100),
    };
  }, [activeCourse, quizAnswers]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center max-w-md w-full space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-brand-accent border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-800">Weryfikacja sesji na platformie MultiSerwis...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> Login / Register screen
  if (!user) {
    return (
      <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-12 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Left info column */}
          <div className="lg:col-span-5 bg-brand-dark text-white p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="space-y-5">
              <span className="inline-block px-3 py-1 bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-wider rounded-md">
                Platforma e-learningowa 24/7
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold leading-tight">
                Strefa kursanta i opiekuna firmy B2B
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Zaloguj się, aby przejść do materiałów wideo, notatek technicznych oraz oficjalnej bazy pytań testowych UDT, ŚBŁ-WIT (IMBiGS) i SEP.
              </p>

              <ul className="space-y-3 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <IndustrialIcon name="check-circle" className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                  <span>Wykłady i symulator egzaminu państwowego dostępne na komputerze i telefonie</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IndustrialIcon name="check-circle" className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                  <span>Automatyczna synchronizacja postępów z biurem MultiSerwis w Kutnie</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IndustrialIcon name="check-circle" className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                  <span>Panel opiekuna firmy B2B do zarządzania szkoleniami pracowników</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-white/10 text-xs text-slate-400 space-y-1">
              <div className="font-bold text-white">Pomoc techniczna i zapisy:</div>
              <div>Tel.: +48 730 101 000 (pon.–pt. 8:00–16:00)</div>
              <div>Biuro: ul. Henryka Siemiradzkiego 18, 99-300 Kutno</div>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7 p-8 sm:p-10">
            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  authMode === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Logowanie do konta
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  authMode === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Rejestracja nowego konta
              </button>
            </div>

            {authError && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 border-l-4 border-red-500 text-xs font-semibold text-red-700">
                {authError}
              </div>
            )}

            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Adres e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="np. kursant@multiserwis.edu.pl"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base md:text-sm text-slate-900 focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Hasło
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base md:text-sm text-slate-900 focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3.5 px-6 bg-brand-accent hover:bg-brand-accentHover disabled:opacity-60 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{authSubmitting ? "Logowanie..." : "Zaloguj się do platformy"}</span>
                  <IndustrialIcon name="arrow-right" className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegForm({ ...regForm, role: "STUDENT" })}
                    className={`p-3 rounded-lg border text-left text-xs font-bold transition-all cursor-pointer ${
                      regForm.role === "STUDENT"
                        ? "border-brand-accent bg-orange-50/40 text-slate-900"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    Konto kursanta indywidualnego
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegForm({ ...regForm, role: "COMPANY_GUARDIAN" })}
                    className={`p-3 rounded-lg border text-left text-xs font-bold transition-all cursor-pointer ${
                      regForm.role === "COMPANY_GUARDIAN"
                        ? "border-brand-accent bg-orange-50/40 text-slate-900"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    Konto opiekuna firmy (B2B)
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Imię *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.firstName}
                      onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.lastName}
                      onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base md:text-sm"
                    />
                  </div>
                </div>

                {regForm.role === "COMPANY_GUARDIAN" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Nazwa firmy *
                      </label>
                      <input
                        type="text"
                        required
                        value={regForm.companyName}
                        onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base md:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        NIP firmy
                      </label>
                      <input
                        type="text"
                        value={regForm.nip}
                        onChange={(e) => setRegForm({ ...regForm, nip: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base md:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Adres e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base md:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Hasło (min. 6 znaków) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base md:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3.5 px-6 bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-bold uppercase tracking-wider text-xs rounded-md transition-all cursor-pointer"
                >
                  {authSubmitting ? "Tworzenie konta..." : "Utwórz konto i przejdź do panelu"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // COMPANY GUARDIAN B2B VIEW
  if (user.role === "COMPANY_GUARDIAN" || initialMode === "guardian") {
    const safeEmployees = Array.isArray(employees) ? employees : [];
    const totalEnrollments = safeEmployees.reduce(
      (acc, emp) => acc + (Array.isArray(emp.enrollments) ? emp.enrollments.length : 0),
      0
    );
    const completedEnrollments = safeEmployees.reduce(
      (acc, emp) =>
        acc +
        (Array.isArray(emp.enrollments)
          ? emp.enrollments.filter((enr) => enr.progress >= 100 || enr.status === "completed").length
          : 0),
      0
    );

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
        {/* Top Guardian Bar */}
        <div className="bg-brand-dark text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-lg">
          <div>
            <span className="inline-block px-3 py-1 bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-wider rounded-md mb-2">
              Strefa opiekuna firmy B2B
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold">
              {user.companyName || `${user.firstName} ${user.lastName}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Zalogowany jako: <strong>{user.email}</strong> {user.nip ? `• NIP: ${user.nip}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setGuardianTab("employees")}
              className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                guardianTab === "employees"
                  ? "bg-brand-accent text-white"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              Pracownicy ({safeEmployees.length})
            </button>
            <button
              type="button"
              onClick={() => setGuardianTab("add_employee")}
              className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                guardianTab === "add_employee"
                  ? "bg-brand-accent text-white"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              + Zgłoś pracownika na kurs
            </button>
            <button
              type="button"
              onClick={() => setGuardianTab("support")}
              className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                guardianTab === "support"
                  ? "bg-brand-accent text-white"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              Kontakt z koordynatorem
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              Wyloguj
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Pracownicy w systemie
            </span>
            <span className="text-3xl font-heading font-extrabold text-slate-900 mt-2 block">
              {safeEmployees.length}
            </span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Aktywne przypisania do kursów
            </span>
            <span className="text-3xl font-heading font-extrabold text-brand-primary mt-2 block">
              {totalEnrollments}
            </span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Ukończone szkolenia teoretyczne
            </span>
            <span className="text-3xl font-heading font-extrabold text-emerald-600 mt-2 block">
              {completedEnrollments}
            </span>
          </div>
        </div>

        {guardianTab === "employees" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-slate-900">
                  Wykaz pracowników i postępów szkoleniowych
                </h2>
                <p className="text-sm text-slate-600">
                  Monitoruj na bieżąco postęp e-learningowy swoich pracowników przed egzaminem państwowym w Kutnie.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGuardianTab("add_employee")}
                className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer shrink-0"
              >
                + Dodaj pracownika
              </button>
            </div>

            {safeEmployees.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <p className="text-slate-600 text-sm">
                  Nie przypisano jeszcze żadnych pracowników do konta Twojej firmy.
                </p>
                <button
                  type="button"
                  onClick={() => setGuardianTab("add_employee")}
                  className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
                >
                  Zgłoś pierwszego pracownika
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <th className="py-3.5 px-6">Pracownik</th>
                      <th className="py-3.5 px-6">Kontakt</th>
                      <th className="py-3.5 px-6">Przypisane szkolenia i postęp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {safeEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/70">
                        <td className="py-4 px-6 font-bold text-slate-900">{emp.name}</td>
                        <td className="py-4 px-6 text-slate-600">
                          <div>{emp.email}</div>
                          {emp.phone && <div className="text-xs text-slate-400">{emp.phone}</div>}
                        </td>
                        <td className="py-4 px-6">
                          {Array.isArray(emp.enrollments) && emp.enrollments.length > 0 ? (
                            <div className="space-y-2.5">
                              {emp.enrollments.map((enr) => (
                                <div key={enr.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                                    <span className="text-slate-800">{enr.courseTitle}</span>
                                    <span
                                      className={
                                        enr.progress >= 100 ? "text-emerald-600" : "text-brand-primary"
                                      }
                                    >
                                      {enr.progress}%
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        enr.progress >= 100 ? "bg-emerald-500" : "bg-brand-accent"
                                      }`}
                                      style={{ width: `${Math.min(100, Math.max(0, enr.progress))}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Brak przypisanych kursów</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {guardianTab === "add_employee" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl">
            <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-2">
              Zgłoś pracownika na szkolenie
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Konto pracownika zostanie automatycznie powiązane z Twoją firmą ({user.companyName || "B2B"}), a wybrany kurs pojawi się w jego panelu kursanta.
            </p>

            {empFeedback && (
              <div className="mb-5 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {empFeedback}
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Imię pracownika *
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.firstName}
                    onChange={(e) => setEmpForm({ ...empForm, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nazwisko pracownika *
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.lastName}
                    onChange={(e) => setEmpForm({ ...empForm, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Adres e-mail pracownika *
                  </label>
                  <input
                    type="email"
                    required
                    value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Telefon kontaktowy
                  </label>
                  <input
                    type="tel"
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Wybierz kurs docelowy *
                </label>
                <select
                  value={empForm.courseId}
                  onChange={(e) => setEmpForm({ ...empForm, courseId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {(Array.isArray(catalogCourses) ? catalogCourses : []).map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.category}] {c.title} ({c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Hasło startowe dla pracownika (opcjonalnie, domyślnie: MultiSerwis123!)
                </label>
                <input
                  type="text"
                  value={empForm.password}
                  onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })}
                  placeholder="MultiSerwis123!"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={empSaving}
                className="px-6 py-3.5 bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs uppercase tracking-wider rounded-md cursor-pointer"
              >
                {empSaving ? "Zapisywanie..." : "Dodaj pracownika i aktywuj szkolenie"}
              </button>
            </form>
          </div>
        )}

        {guardianTab === "support" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-2">
              Kontakt z koordynatorem szkoleń B2B (KFS / BUR / egzaminy grupowe)
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Wyślij zgłoszenie dotyczące organizacji egzaminu UDT w zakładzie pracy, faktury zbiorczej lub wniosku o dofinansowanie KFS.
            </p>
            <form onSubmit={handleCreateTicket} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Temat zgłoszenia *
                </label>
                <input
                  type="text"
                  required
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  placeholder="np. Zgłoszenie grupy 6 operatorów wózków widłowych + wniosek KFS"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Wiadomość *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={ticketSubmitting}
                className="px-6 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
              >
                {ticketSubmitting ? "Wysyłanie..." : "Wyślij wiadomość do koordynatora"}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // STUDENT LMS VIEW
  const safeEnrolled = Array.isArray(enrolledCourses) ? enrolledCourses : [];
  const completedCoursesList = safeEnrolled.filter((c) => c.progress >= 100 || c.status === "completed");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Top Student Bar */}
      <div className="bg-brand-dark text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-lg">
        <div>
          <span className="inline-block px-3 py-1 bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-wider rounded-md mb-2">
            Platforma szkoleniowa MultiSerwis Kutno
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold">
            Witaj, {user.firstName || user.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Konto kursanta: <strong>{user.email}</strong>{" "}
            {user.companyName ? `• Firma: ${user.companyName}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setStudentTab("courses")}
            className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              studentTab === "courses"
                ? "bg-brand-accent text-white"
                : "bg-white/10 text-slate-200 hover:bg-white/20"
            }`}
          >
            Moje kursy ({safeEnrolled.length})
          </button>
          {activeCourse && (
            <button
              type="button"
              onClick={() => setStudentTab("player")}
              className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                studentTab === "player"
                  ? "bg-brand-accent text-white"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              Odtwarzacz lekcji
            </button>
          )}
          <button
            type="button"
            onClick={() => setStudentTab("certificates")}
            className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              studentTab === "certificates"
                ? "bg-brand-accent text-white"
                : "bg-white/10 text-slate-200 hover:bg-white/20"
            }`}
          >
            Zaświadczenia ({completedCoursesList.length})
          </button>
          <button
            type="button"
            onClick={() => setStudentTab("support")}
            className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              studentTab === "support"
                ? "bg-brand-accent text-white"
                : "bg-white/10 text-slate-200 hover:bg-white/20"
            }`}
          >
            Pomoc instruktora
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            Wyloguj
          </button>
        </div>
      </div>

      {/* TAB 1: MOJE KURSY */}
      {studentTab === "courses" && (
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-heading font-extrabold text-slate-900 mb-2">
              Twoje aktywne szkolenia e-learningowe
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Przerób lekcje teoretyczne oraz testy próbne w swoim tempie. Po ukończeniu teorii zapraszamy na jazdy praktyczne na poligonie przy ul. Przemysłowej 2 w Kutnie.
            </p>

            {safeEnrolled.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  Nie masz jeszcze przypisanych aktywnych szkoleń
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Wybierz interesujące Cię szkolenie z katalogu lub skontaktuj się z biurem MultiSerwis (+48 730 101 000), aby nadać dostęp do platformy.
                </p>
                <a
                  href="/rejestracja"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-white text-xs font-bold uppercase tracking-wider rounded-md"
                >
                  <span>Zapisz się na szkolenie</span>
                  <IndustrialIcon name="arrow-right" className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeEnrolled.map((course) => (
                  <div
                    key={course.enrollmentId || course.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 bg-slate-900 relative overflow-hidden">
                        <img
                          src={course.image || "/operator-wozki-widlowe.webp"}
                          alt={course.title}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-brand-primary text-white text-xs font-bold uppercase tracking-wider">
                            {course.category}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                              course.progress >= 100
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-900/90 text-amber-300"
                            }`}
                          >
                            {course.progress >= 100 ? "Ukończono" : "W trakcie nauki"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <h3 className="text-lg font-heading font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h3>

                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <span>Postęp materiału</span>
                            <span className="text-brand-primary">{course.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div
                              className={`h-full rounded-full transition-all ${
                                course.progress >= 100 ? "bg-emerald-500" : "bg-brand-accent"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, course.progress))}%` }}
                            ></div>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1.5">
                            Zaliczone lekcje: {course.completedLessons} z {course.totalLessons}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        type="button"
                        onClick={() => openCoursePlayer(course.id)}
                        className="w-full py-3 bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>
                          {course.progress > 0 ? "Kontynuuj szkolenie" : "Rozpocznij szkolenie"}
                        </span>
                        <IndustrialIcon name="arrow-right" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ODTWARZACZ KURSU I TESTY */}
      {studentTab === "player" && (
        <div>
          {courseLoading || !activeCourse ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              Wczytywanie modułów szkoleniowych i pytań egzaminacyjnych...
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Sidebar: Modules & Lessons */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 bg-slate-900 text-white">
                  <button
                    type="button"
                    onClick={() => setStudentTab("courses")}
                    className="text-xs text-brand-accent hover:underline font-bold uppercase tracking-wider mb-2 inline-flex items-center gap-1 cursor-pointer"
                  >
                    ← Wróć do listy moich kursów
                  </button>
                  <h2 className="font-heading font-bold text-base leading-snug">
                    {activeCourse.title}
                  </h2>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Całkowity postęp:</span>
                    <span className="font-bold text-emerald-400">{activeCourse.progress}%</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-200">
                  {(Array.isArray(activeCourse.modules) ? activeCourse.modules : []).map((mod, mIdx) => (
                    <div key={mod.id} className="p-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                        Moduł {mIdx + 1}: {mod.title}
                      </div>
                      <div className="space-y-1.5">
                        {(Array.isArray(mod.lessons) ? mod.lessons : []).map((les) => {
                          const isCurrent = les.id === activeLesson?.id;
                          return (
                            <button
                              key={les.id}
                              type="button"
                              onClick={() => {
                                setActiveLessonId(les.id);
                                setQuizSubmitted(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                isCurrent
                                  ? "bg-brand-primary text-white"
                                  : "hover:bg-slate-100 text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                    les.completed
                                      ? "bg-emerald-500 text-white"
                                      : isCurrent
                                      ? "bg-white/20 text-white"
                                      : "bg-slate-200 text-slate-600"
                                  }`}
                                >
                                  {les.completed ? "✓" : les.type === "video" ? "▶" : les.type === "test" ? "?" : "≡"}
                                </span>
                                <span className="truncate">{les.title}</span>
                              </div>
                              <span
                                className={`text-[11px] shrink-0 ${
                                  isCurrent ? "text-slate-200" : "text-slate-400"
                                }`}
                              >
                                {les.duration}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content: Lesson Player or Exam Simulator */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                {activeLesson ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-accent block">
                          {activeLesson.type === "video"
                            ? "Wykład wideo + konspekt"
                            : activeLesson.type === "test"
                            ? "Egzamin wewnętrzny / test sprawdzający"
                            : "Materiał dydaktyczny"}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 mt-1">
                          {activeLesson.title}
                        </h3>
                      </div>

                      {activeLesson.completed ? (
                        <span className="px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                          ✓ Lekcja ukończona
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                          Czas: {activeLesson.duration}
                        </span>
                      )}
                    </div>

                    {activeLesson.type === "video" && (
                      <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col items-center justify-center p-6 text-center text-white relative">
                        {activeLesson.videoUrl ? (
                          <video
                            src={activeLesson.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="space-y-3 max-w-md">
                            <div className="w-14 h-14 rounded-full bg-brand-accent/20 border border-brand-accent text-brand-accent flex items-center justify-center mx-auto">
                              <IndustrialIcon name="play" className="w-6 h-6" />
                            </div>
                            <div className="font-heading font-bold text-lg">
                              Materiał szkoleniowy: {activeLesson.title}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Zapoznaj się z poniższym konspektem instruktorskim przygotowującym do zajęć praktycznych na poligonie MultiSerwis w Kutnie oraz egzaminu przed komisją państwową.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rich Text Lesson Content */}
                    <div
                      className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: activeLesson.content || "" }}
                    />

                    {/* If lesson is TEST or if course has examQuestions */}
                    {(activeLesson.type === "test" ||
                      (Array.isArray(activeCourse.examQuestions) && activeCourse.examQuestions.length > 0)) && (
                      <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                          <h4 className="font-heading font-bold text-slate-900 text-base">
                            Oficjalne pytania kontrolne (symulator testu UDT / ŚBŁ-WIT)
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            Wybierz jedną poprawną odpowiedź dla każdego pytania i sprawdź swój wynik.
                          </p>
                        </div>

                        <div className="space-y-5">
                          {(Array.isArray(activeCourse.examQuestions) ? activeCourse.examQuestions : []).map(
                            (q, qIdx) => {
                              const selectedIdx = quizAnswers[q.id];
                              return (
                                <div
                                  key={q.id}
                                  className="p-5 rounded-xl border border-slate-200 bg-white space-y-3"
                                >
                                  <div className="font-bold text-slate-900 text-sm">
                                    {qIdx + 1}. {q.question}
                                  </div>
                                  <div className="space-y-2">
                                    {(Array.isArray(q.options) ? q.options : []).map((opt, oIdx) => {
                                      const isSelected = selectedIdx === oIdx;
                                      const isCorrect = q.correctAnswerIndex === oIdx;
                                      let btnClass =
                                        "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800";
                                      if (quizSubmitted) {
                                        if (isCorrect) {
                                          btnClass =
                                            "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                                        } else if (isSelected && !isCorrect) {
                                          btnClass = "border-red-400 bg-red-50 text-red-800";
                                        }
                                      } else if (isSelected) {
                                        btnClass =
                                          "border-brand-accent bg-orange-50 text-slate-900 font-bold";
                                      }

                                      return (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          onClick={() => {
                                            if (!quizSubmitted) {
                                              setQuizAnswers({ ...quizAnswers, [q.id]: oIdx });
                                            }
                                          }}
                                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                                        >
                                          <span>{opt}</span>
                                          {quizSubmitted && isCorrect && (
                                            <span className="text-xs font-bold text-emerald-700">
                                              Poprawna odpowiedź
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {quizSubmitted && q.explanation && (
                                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                                      <strong>Wyjaśnienie instruktora:</strong> {q.explanation}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>

                        {quizSubmitted ? (
                          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                              <div className="font-heading font-bold text-emerald-900 text-base">
                                Twój wynik testu: {quizScore.correct} / {quizScore.total} ({quizScore.percent}%)
                              </div>
                              <p className="text-xs text-emerald-700 mt-0.5">
                                {quizScore.percent >= 70
                                  ? "Wynik pozytywny! Lekcja została zaliczona."
                                  : "Przejrzyj wyjaśnienia instruktora i spróbuj ponownie."}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setQuizAnswers({});
                                setQuizSubmitted(false);
                              }}
                              className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
                            >
                              Rozwiąż test ponownie
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizSubmitted(true);
                              if (quizScore.percent >= 70 && !activeLesson.completed) {
                                toggleLessonComplete(activeLesson, true);
                              }
                            }}
                            className="px-6 py-3 bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
                          >
                            Sprawdź odpowiedzi testowe
                          </button>
                        )}
                      </div>
                    )}

                    {/* Action Footer: Mark Completed */}
                    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        type="button"
                        disabled={savingProgress}
                        onClick={() => toggleLessonComplete(activeLesson, !activeLesson.completed)}
                        className={`px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          activeLesson.completed
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : "bg-brand-accent hover:bg-brand-accentHover text-white shadow-md"
                        }`}
                      >
                        {savingProgress
                          ? "Zapisywanie..."
                          : activeLesson.completed
                          ? "Oznacz jako nieukończoną"
                          : "Oznacz lekcję jako ukończoną ✓"}
                      </button>

                      <div className="text-xs text-slate-500">
                        Masz pytanie do tej lekcji? Skorzystaj z zakładki{" "}
                        <button
                          type="button"
                          onClick={() => setStudentTab("support")}
                          className="text-brand-primary underline font-bold cursor-pointer"
                        >
                          Pomoc instruktora
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-600">Wybierz lekcję z listy po lewej stronie.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ZAŚWIADCZENIA */}
      {studentTab === "certificates" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Zaświadczenia ukończenia części teoretycznej
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Po osiągnięciu 100% postępu w kursie e-learningowym możesz wygenerować potwierdzenie zaliczenia teorii uprawniające do przystąpienia do jazd praktycznych oraz egzaminu państwowego w Kutnie (ul. Przemysłowa 2).
            </p>
          </div>

          {completedCoursesList.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="font-bold text-slate-800 text-sm">
                Brak ukończonych w 100% szkoleń teoretycznych
              </div>
              <p className="text-xs text-slate-600">
                Ukończ wszystkie lekcje w wybranym kursie, aby odblokować imienne zaświadczenie.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {completedCoursesList.map((c) => (
                <div
                  key={c.enrollmentId || c.id}
                  className="p-6 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/30 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-md">
                      Część teoretyczna zaliczona (100%)
                    </span>
                    <h3 className="text-lg font-heading font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600">
                      Uczestnik: <strong>{user.name}</strong> ({user.email})
                    </p>
                    <p className="text-xs text-slate-500">
                      Ośrodek Szkolenia Kadr MultiSerwis Kutno Sp. z o.o. • ul. Przemysłowa 2, 99-300 Kutno
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer self-start"
                  >
                    Drukuj / pobierz potwierdzenie PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WSPARCIE I POMOC INSTRUKTORA */}
      {studentTab === "support" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* New Ticket Form */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-heading font-extrabold text-slate-900">
              Zadaj pytanie instruktorowi lub biuru
            </h2>
            <p className="text-xs text-slate-600">
              Masz pytanie do pytań egzaminacyjnych UDT/IMBiGS lub chcesz ustalić grafik jazd praktycznych na placu manewrowym? Napisz poniżej.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Kategoria sprawy
                </label>
                <select
                  value={newTicketForm.category}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="Merytoryczne">Pytanie merytoryczne do instruktora</option>
                  <option value="Techniczne">Pomoc techniczna z platformą</option>
                  <option value="Rozliczenia">Faktury, płatności i dokumenty UDT</option>
                  <option value="Inne">Ustalenie terminu jazd praktycznych</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Temat zgłoszenia *
                </label>
                <input
                  type="text"
                  required
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  placeholder="np. Pytanie o diagram udźwigu wózka jezdniowego"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Treść wiadomości *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  placeholder="Opisz dokładnie swoje pytanie..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={ticketSubmitting}
                className="w-full py-3 bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
              >
                {ticketSubmitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
              </button>
            </form>
          </div>

          {/* Tickets History & Conversation */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-heading font-extrabold text-slate-900">
              Twoje zgłoszenia ({Array.isArray(tickets) ? tickets.length : 0})
            </h2>

            {!Array.isArray(tickets) || tickets.length === 0 ? (
              <p className="text-sm text-slate-500">Nie wysłałeś jeszcze żadnych zgłoszeń.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {tickets.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`px-3.5 py-2 rounded-lg border text-xs font-bold shrink-0 cursor-pointer ${
                        selectedTicket?.id === t.id
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {t.subject}
                    </button>
                  ))}
                </div>

                {selectedTicket && (
                  <div className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{selectedTicket.subject}</div>
                        <div className="text-xs text-slate-500">Kategoria: {selectedTicket.category}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700">
                        {selectedTicket.status === "closed"
                          ? "Zamknięte"
                          : selectedTicket.status === "in_progress"
                          ? "W realizacji"
                          : "Otwarte"}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {(Array.isArray(selectedTicket.messages) ? selectedTicket.messages : []).map((m) => (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-lg text-xs sm:text-sm ${
                            m.senderId === user.id
                              ? "bg-white border border-slate-200 text-slate-800 ml-6"
                              : "bg-brand-primary text-white mr-6"
                          }`}
                        >
                          <div className="font-bold text-[11px] opacity-75 mb-1">
                            {m.senderName} • {new Date(m.createdAt).toLocaleString("pl-PL")}
                          </div>
                          <div>{m.message}</div>
                        </div>
                      ))}
                    </div>

                    {selectedTicket.status !== "closed" && (
                      <form onSubmit={handleSendTicketReply} className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Dopisz wiadomość..."
                          className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                        <button
                          type="submit"
                          disabled={ticketSubmitting}
                          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          Wyślij
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
