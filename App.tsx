import React, { useState, useEffect } from "react";
import { ViewState, Course, Machine, Language, SEOMetadata } from "./types";
import { Layout } from "./components/Layout";
import SectionHeader from "./components/SectionHeader";
import ImagePicker from "./components/ImagePicker";
import LessonTextEditor from "./components/LessonTextEditor";
import { api } from "./services/api";

import {
  PanelHeader,
  PanelTable,
  PanelLayout,
  type SectionHeader as PanelSectionHeader,
} from "./components/PanelComponents";
import { PanelFooter } from "./components/panel/PanelFooter";
import { BrandMark } from "./components/BrandMark";

import { AdminView } from "./components/views/AdminView";
import { ManagerPanel } from "./components/views/ManagerPanel";
import { GuardianPanel } from "./components/views/GuardianPanel";
import { StudentPanel } from "./components/views/StudentPanel";
import AnalyticsView from "./components/views/AnalyticsView";
import SupportView from "./components/views/SupportView";
import HomeView from "./components/views/HomeView";
import CatalogView from "./components/views/CatalogView";
import CourseDetailView from "./components/views/CourseDetailView";
import RentalsView from "./components/views/RentalsView";
import MachineDetailView from "./components/views/MachineDetailView";
import ServicesView from "./components/views/ServicesView";
import ContactView from "./components/views/ContactView";
import StudentDetailView from "./components/views/StudentDetailView";
import LessonPlayerView from "./components/views/LessonPlayerView";
import LMSView from "./components/views/LMSView";

// Landing Sections
import { UDTSection } from "./components/landing/UDTSection";
import { IMBIGSSection } from "./components/landing/IMBIGSSection";
import { SEPSection } from "./components/landing/SEPSection";
import { WeldingSection } from "./components/landing/WeldingSection";
import { OtherSection } from "./components/landing/OtherSection";
import ScheduleView from "./components/views/ScheduleView";
import AboutView from "./components/views/AboutView";
import WizardView from "./components/views/WizardView";
import PrivacyView from "./components/views/PrivacyView";
import TermsView from "./components/views/TermsView";

import {
  COURSES,
  MACHINES,
  MY_COURSES,
  COURSE_CURRICULUM,
  ADMIN_STUDENTS,
  POPULARITY_DATA,
  TRANSLATIONS,
  SEO_DATA,
} from "./constants";
import {
  ChevronRight,
  CheckCircle,
  Star,
  Play,
  Download,
  ShieldCheck,
  Wrench,
  Users,
  Trophy,
  GraduationCap,
  Truck,
  MonitorPlay,
  Settings,
  Calendar,
  MapPin,
  ArrowRight,
  PlayCircle,
  Lock,
  FileText,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Menu,
  BarChart3,
  MoreVertical,
  AlertCircle,
  Printer,
  Search,
  BookOpen,
  Clock,
  Award,
  Phone,
  X,
  Trash2,
  Edit,
  Eye,
  User,
  HelpCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  Order,
  StudentUser,
  UserRole,
  CompanyGuardianReport,
  Employee,
  Student,
} from "./types";
import { type UserOverrides } from "./components/panel/UserProfileView";
import { type CompanyOverrides } from "./components/panel/CompanyView";

type NewPanelKey = "admin" | "manager" | "guardian" | "student";

const App = () => {
  const [currentView, setView] = useState<ViewState>("HOME");
  const [language, setLanguage] = useState<Language>("PL");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null,
  );
  const [catalogCategory, setCatalogCategory] = useState<string>("Wszystkie");
  const [currentLessonId, setCurrentLessonId] = useState<string>("l5");
  const [isFromAdmin, setIsFromAdmin] = useState(false);
  const [adminEditingCourseId, setAdminEditingCourseId] = useState<
    string | null
  >(null);

  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<
    "dashboard" | "courses" | "students"
  >("dashboard");
  const importBaseUrl = import.meta.env.BASE_URL;

  // Panel State (Lifted from panels to share across if needed, or just kept for persistence)
  // We keep 'panelCourses' here because App.tsx handles 'handleCreateCourse'
  const [panelCourses, setPanelCourses] = useState<Course[]>(COURSES);

  // We also keep User/Company overrides and definitions here because they are shared
  const [panelUserOverrides, setPanelUserOverrides] = useState<
    Record<string, UserOverrides>
  >({});
  const [panelCompanyOverrides, setPanelCompanyOverrides] = useState<
    Record<string, CompanyOverrides>
  >({});
  const [panelHiddenUsers, setPanelHiddenUsers] = useState<string[]>([]);
  const [panelHiddenCompanies, setPanelHiddenCompanies] = useState<string[]>(
    [],
  );
  const [panelExtraStudents, setPanelExtraStudents] = useState<Student[]>([]);
  const [panelOrders, setPanelOrders] = useState<Order[]>([]);
  const [panelUsers, setPanelUsers] = useState<StudentUser[]>([]);
  const [pendingOrder, setPendingOrder] = useState<{
    courseId: string;
    variant: "ONLINE" | "STATIONARY";
  } | null>(null);

  React.useEffect(() => {
    // Legacy panels are intentionally hidden; if something tries to navigate there, send the user back to HOME.
    if (
      currentView === "ADMIN_PANEL" ||
      currentView === "ADMIN" ||
      currentView === "LMS" ||
      currentView === "COMPANY_GUARDIAN_PANEL"
    ) {
      setView("HOME");
    }
  }, [currentView]);

  const loadPanelDataForUser = async (user: StudentUser) => {
    const canLoadUsers =
      user.role === "ADMIN" ||
      user.role === "MANAGER" ||
      user.role === "COMPANY_GUARDIAN";

    if (canLoadUsers) {
      try {
        const users = await api.users.list();
        const normalizedUsers = users.map((u: any) => ({
          ...u,
          company: typeof u.company === "string" ? u.company : u.company?.name,
        }));
        setPanelUsers(normalizedUsers);

        const mappedStudents: Student[] = normalizedUsers.flatMap((u: any) => {
          if (!u.enrollments || u.enrollments.length === 0) return [];
          return u.enrollments.map((enr: any) => ({
            id: `${u.id}-${enr.courseId}`,
            name: u.name || u.email,
            email: u.email,
            company: u.company?.name || "Indywidualny",
            course: enr.courseId,
            progress: enr.progress || 0,
            expirationDays: enr.expiresAt
              ? Math.ceil(
                  (new Date(enr.expiresAt).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24),
                )
              : 365,
            status: enr.active ? "active" : "expired",
            completedLessons: [],
          }));
        });

        if (mappedStudents.length > 0) {
          setPanelExtraStudents((prev) => {
            const seen = new Set(
              prev.map(
                (student) => `${student.email.toLowerCase()}|${student.course}`,
              ),
            );
            const next = [...prev];
            mappedStudents.forEach((student) => {
              const key = `${student.email.toLowerCase()}|${student.course}`;
              if (!seen.has(key)) {
                seen.add(key);
                next.push(student);
              }
            });
            return next;
          });
        }
      } catch (e) {
        console.error("Failed to fetch users", e);
      }
    } else {
      setPanelUsers([]);
    }

    if (user.role === "ADMIN" || user.role === "MANAGER") {
      try {
        const orders = await api.orders.list();
        setPanelOrders(orders);
      } catch (e) {
        console.error("Failed to fetch orders", e);
      }
    } else {
      setPanelOrders([]);
    }
  };

  const parsePriceToPln = (value?: string) => {
    const digits = (value || "").replace(/[^0-9]/g, "");
    return digits ? Number(digits) : 0;
  };

  const resolveOrderAmount = (
    course: Course,
    variant: "ONLINE" | "STATIONARY",
  ) => {
    if (variant === "ONLINE") {
      return parsePriceToPln(course.priceOnline || course.price);
    }
    return parsePriceToPln(course.priceStationary || course.price);
  };

  const createOrderForUser = async (
    user: StudentUser,
    courseId: string,
    variant: "ONLINE" | "STATIONARY",
  ) => {
    const course = panelCourses.find((c) => c.id === courseId);
    if (!course) {
      alert("Nie znaleziono szkolenia.");
      return;
    }

    const amount = resolveOrderAmount(course, variant);
    if (!amount) {
      alert("Nie udalo sie wyliczyc kwoty zamowienia.");
      return;
    }

    try {
      const order = await api.orders.create({
        userId: user.id,
        courseId,
        amount,
        provider: variant === "ONLINE" ? "online" : "stationary",
      });
      await loadPanelDataForUser(user);
      alert(`Utworzono zamowienie ${order.id}. Status: ${order.status}.`);
      setView("NEW_STUDENT_PANEL");
    } catch (e) {
      console.error("Failed to create order", e);
      alert("Nie udalo sie utworzyc zamowienia.");
    }
  };

  const handleBuyCourse = (
    courseId: string,
    variant: "ONLINE" | "STATIONARY",
  ) => {
    if (!currentUser) {
      setPendingOrder({ courseId, variant });
      setShowLoginModal(true);
      return;
    }
    createOrderForUser(currentUser, courseId, variant);
  };

  // Initial Data Fetch & Auth Check
  useEffect(() => {
    const init = async () => {
      // 1. Check Auth (Persistent Login)
      const user = await api.auth.getMe();
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        await loadPanelDataForUser(user);
      }

      // 2. Fetch Courses
      try {
        const courses = await api.courses.list();
        if (courses.length > 0) {
          setPanelCourses(courses);
        }
      } catch (e) {
        console.error("Failed to fetch courses, using defaults", e);
      }
    };
    init();
  }, []);

  const handleDeleteUser = async (email: string) => {
    // Optimistically hide
    setPanelHiddenUsers((prev) =>
      prev.includes(email) ? prev : [...prev, email],
    );

    if (
      currentUser &&
      (currentUser.role === "ADMIN" || currentUser.role === "COMPANY_GUARDIAN")
    ) {
      const target = panelStudents.find((s) => s.email === email);
      if (target) {
        let realId = target.id;
        // Handle composite IDs from enrollment mapping
        if (realId.includes("-") && realId.length > 36) {
          realId = realId.split("-")[0];
        }
        try {
          await api.users.delete(realId);
        } catch (e) {
          console.error("Failed to delete user", e);
        }
      }
    }
  };

  const panelStudents = React.useMemo(() => {
    return [...ADMIN_STUDENTS, ...panelExtraStudents];
  }, [panelExtraStudents]);

  const handleCreatePanelUser = async (payload: {
    email: string;
    name: string;
    company: string;
    courseId: string;
    phone?: string;
    address?: string;
    idNumber?: string;
    pesel?: string;
    avatarUrl?: string;
  }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const email = payload.email.trim();

    // 1. Check duplicates locally (fast check)
    if (
      panelStudents.some((s) => s.email.toLowerCase() === email.toLowerCase())
    ) {
      return { ok: false, error: "Użytkownik o takim emailu już istnieje." };
    }

    // 2. Real API Creation (if authenticated)
    if (
      currentUser &&
      (currentUser.role === "ADMIN" || currentUser.role === "COMPANY_GUARDIAN")
    ) {
      try {
        // Determine Company ID
        let companyId = currentUser.companyId; // Default for Guardian

        // If Admin, try to find companyId by name in existing users or map it.
        // For now, if Admin and company is custom, we might leave it null or need a Company picker with IDs.
        // If payload.company is "Indywidualny", companyId remains undefined/null.

        await api.users
          .create({
            email,
            name: payload.name,
            password: email, // Default password = email
            role: "STUDENT",
            companyId:
              payload.company !== "Indywidualny" ? companyId : undefined,
          })
          .then(async (created) => {
            if (payload.courseId) {
              await api.users.enroll(created.id, payload.courseId);
            }
            return created;
          });

        // If successful, add to local state
        const newStudent: Student = {
          id: `s_new_${Date.now()}`, // We don't have the real ID/Enrollment ID handy unless we await properly above.
          // Actually I should await above.
          name: payload.name,
          email,
          company: payload.company,
          course: payload.courseId,
          progress: 0,
          expirationDays: 365,
          status: "active",
          completedLessons: [],
        };
        setPanelExtraStudents((prev) => [newStudent, ...prev]);

        saveUserOverrides(email, {
          email,
          name: payload.name,
          company: payload.company,
          phone: payload.phone,
          address: payload.address,
          idNumber: payload.idNumber,
          pesel: payload.pesel,
          avatarUrl: payload.avatarUrl,
        });

        return { ok: true };
      } catch (e: any) {
        console.error(e);
        return { ok: false, error: e.message || "Błąd API" };
      }
    }

    // 3. Fallback / Offline / Demo Logic
    const newStudent: Student = {
      id: `s_custom_${Date.now()}`,
      name: payload.name.trim() || email,
      email,
      company: payload.company.trim() || "Indywidualny",
      course: payload.courseId,
      progress: 0,
      expirationDays: 60,
      status: "active",
      completedLessons: [],
    };

    setPanelExtraStudents((prev) => [newStudent, ...prev]);
    saveUserOverrides(email, {
      email,
      name: payload.name.trim() || email,
      company: payload.company.trim() || "Indywidualny",
      phone: payload.phone,
      address: payload.address,
      idNumber: payload.idNumber,
      pesel: payload.pesel,
      avatarUrl: payload.avatarUrl,
    });

    return { ok: true };
  };

  const handleCreatePanelUsersBulk = (
    payloads: Array<{
      email: string;
      name: string;
      company: string;
      courseId: string;
      phone?: string;
      address?: string;
      idNumber?: string;
      pesel?: string;
      avatarUrl?: string;
      __rowNumber?: number;
    }>,
  ):
    | {
        ok: true;
        created: number;
        skipped: Array<{ row: number; email?: string; reason: string }>;
      }
    | { ok: false; error: string } => {
    if (!payloads.length)
      return { ok: false, error: "Brak rekordów do importu." };

    const existingEmails = new Set(
      panelStudents.map((s) => s.email.trim().toLowerCase()),
    );
    const seenInFile = new Set<string>();

    const skipped: Array<{ row: number; email?: string; reason: string }> = [];
    const newStudents: Student[] = [];
    const newOverrides: Record<string, UserOverrides> = {};

    payloads.forEach((p, idx) => {
      const rowNumber =
        typeof p.__rowNumber === "number" ? p.__rowNumber : idx + 2; // fallback assumes header is row 1
      const email = (p.email || "").trim();
      const normalized = email.toLowerCase();
      if (!email) {
        skipped.push({ row: rowNumber, reason: "Brak emaila." });
        return;
      }
      if (existingEmails.has(normalized)) {
        skipped.push({
          row: rowNumber,
          email,
          reason: "Email już istnieje w systemie.",
        });
        return;
      }
      if (seenInFile.has(normalized)) {
        skipped.push({
          row: rowNumber,
          email,
          reason: "Duplikat emaila w pliku importu.",
        });
        return;
      }
      seenInFile.add(normalized);

      const name = (p.name || "").trim() || email;
      const company = (p.company || "").trim() || "Indywidualny";
      const courseId = (p.courseId || "").trim();
      if (!courseId) {
        skipped.push({
          row: rowNumber,
          email,
          reason: "Brak courseId (ID szkolenia).",
        });
        return;
      }
      if (!panelCourses.some((c) => c.id === courseId)) {
        skipped.push({
          row: rowNumber,
          email,
          reason: `Nieznane courseId: ${courseId}`,
        });
        return;
      }

      newStudents.push({
        id: `s_custom_${Date.now()}_${idx}`,
        name,
        email,
        company,
        course: courseId,
        progress: 0,
        expirationDays: 60,
        status: "active",
        completedLessons: [],
      });

      newOverrides[email] = {
        email,
        name,
        company,
        phone: p.phone,
        address: p.address,
        idNumber: p.idNumber,
        pesel: p.pesel,
        avatarUrl: p.avatarUrl,
      };
    });

    if (!newStudents.length) {
      const sample = skipped[0]
        ? `Przykład: wiersz ${skipped[0].row}${skipped[0].email ? ` (${skipped[0].email})` : ""} – ${skipped[0].reason}`
        : "";
      return {
        ok: false,
        error: skipped.length
          ? `Nie udało się dodać żadnego rekordu. Sprawdź błędy w imporcie. ${sample}`.trim()
          : "Brak poprawnych rekordów.",
      };
    }

    setPanelExtraStudents((prev) => [...newStudents, ...prev]);
    setPanelUserOverrides((prev) => ({ ...prev, ...newOverrides }));

    return { ok: true, created: newStudents.length, skipped };
  };

  const handleDeleteCompany = (companyName: string) => {
    setPanelHiddenCompanies((prev) =>
      prev.includes(companyName) ? prev : [...prev, companyName],
    );
  };

  // --- SYSTEM ROL UŻYTKOWNIKÓW ---
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // --- SEO LOGIC ---
  const [currentSEO, setCurrentSEO] = useState<SEOMetadata | null>(null);

  // Reset accordion when course changes
  useEffect(() => {
    // setOpenAccordionIndex(null); // Unused in cleaned App
  }, [selectedCourseId]);

  useEffect(() => {
    // Basic Title update
    document.title = `MultiSerwis [${language}] - ${currentView}`;

    // Update Simulated SEO Data
    if (currentView === "CATALOG" || (currentView === "HOME" && language)) {
      // We'll just use the Telescopic Loader data as the active "example" SEO when in Catalog/Home for this prototype
      // In a real app, this would route based on the specific page/slug
      setCurrentSEO(SEO_DATA[language]);
    }
  }, [currentView, language]);

  const t = TRANSLATIONS[language];

  // --- MOCK USERS DATA (for testing) ---
  const mockUsers: { [key: string]: { password: string; user: StudentUser } } =
    {
      "admin@test.com": {
        password: "admin123",
        user: {
          id: "u1",
          email: "admin@test.com",
          name: "Administrator",
          phone: "+48 123 456 789",
          role: "ADMIN",
        },
      },
      "manager@test.com": {
        password: "manager123",
        user: {
          id: "u2",
          email: "manager@test.com",
          name: "Manager Platformy",
          phone: "+48 234 567 890",
          role: "MANAGER",
        },
      },
      "student@test.com": {
        password: "student123",
        user: {
          id: "u3",
          email: "student@test.com",
          name: "Jan Kowalski",
          phone: "+48 730 101 000",
          company: "ABC Transport Sp. z o.o.",
          role: "STUDENT",
          certifications: [
            {
              id: "cert1",
              name: "Operator wózków jezdniowych",
              courseId: "c1",
              courseName: "Operator Wózków Jezdniowych UDT",
              issueDate: "2020-03-12",
              expirationDate: "2025-03-12",
              status: "expiring-soon",
              certificateUrl: "/certificates/cert1.pdf",
            },
            {
              id: "cert2",
              name: "Operator suwnic",
              courseId: "c2",
              courseName: "Operator Suwnic i Wciągników UDT",
              issueDate: "2021-06-18",
              expirationDate: "2026-06-18",
              status: "expiring-soon",
              certificateUrl: "/certificates/cert2.pdf",
            },
            {
              id: "cert3",
              name: "Operator koparek i ładowarek",
              courseId: "c3",
              courseName: "Obsługa Maszyn Budowlanych",
              issueDate: "2022-09-05",
              expirationDate: "2027-09-05",
              status: "active",
              certificateUrl: "/certificates/cert3.pdf",
            },
            {
              id: "cert4",
              name: "Uprawnienia SEP do 1kV",
              courseId: "c4",
              courseName: "Uprawnienia Elektryczne SEP",
              issueDate: "2019-11-22",
              expirationDate: "2024-11-22",
              status: "expired",
              certificateUrl: "/certificates/cert4.pdf",
            },
            {
              id: "cert5",
              name: "BHP dla pracowników biurowych",
              courseId: "c5",
              courseName: "Szkolenie BHP Podstawowe",
              issueDate: "2023-01-15",
              expirationDate: "2026-01-15",
              status: "active",
              certificateUrl: "/certificates/cert5.pdf",
            },
          ],
          examHistory: [
            {
              id: "exam1",
              courseId: "c1",
              courseName: "Operator Wózków Jezdniowych UDT",
              examType: "final",
              score: 14,
              maxScore: 15,
              passed: true,
              date: "2020-03-10",
              questionsAnswered: [],
            },
            {
              id: "exam2",
              courseId: "c1",
              courseName: "Operator Wózków Jezdniowych UDT",
              examType: "module",
              moduleId: "m1",
              moduleName: "Podstawy BHP",
              score: 19,
              maxScore: 20,
              passed: true,
              date: "2020-02-28",
              questionsAnswered: [],
            },
            {
              id: "exam3",
              courseId: "c2",
              courseName: "Operator Suwnic i Wciągników UDT",
              examType: "final",
              score: 13,
              maxScore: 15,
              passed: true,
              date: "2021-06-15",
              questionsAnswered: [],
            },
            {
              id: "exam4",
              courseId: "c2",
              courseName: "Operator Suwnic i Wciągników UDT",
              examType: "module",
              moduleId: "m2",
              moduleName: "Przepisy eksploatacji",
              score: 17,
              maxScore: 20,
              passed: true,
              date: "2021-06-10",
              questionsAnswered: [],
            },
            {
              id: "exam5",
              courseId: "c3",
              courseName: "Obsługa Maszyn Budowlanych",
              examType: "final",
              score: 15,
              maxScore: 15,
              passed: true,
              date: "2022-09-01",
              questionsAnswered: [],
            },
            {
              id: "exam6",
              courseId: "c4",
              courseName: "Uprawnienia Elektryczne SEP",
              examType: "final",
              score: 11,
              maxScore: 15,
              passed: false,
              date: "2019-11-18",
              questionsAnswered: [],
            },
            {
              id: "exam7",
              courseId: "c4",
              courseName: "Uprawnienia Elektryczne SEP",
              examType: "final",
              score: 14,
              maxScore: 15,
              passed: true,
              date: "2019-11-20",
              questionsAnswered: [],
            },
            {
              id: "exam8",
              courseId: "c5",
              courseName: "Szkolenie BHP Podstawowe",
              examType: "module",
              moduleId: "m1",
              moduleName: "Przepisy BHP",
              score: 20,
              maxScore: 20,
              passed: true,
              date: "2023-01-12",
              questionsAnswered: [],
            },
          ],
        },
      },
      "guardian@test.com": {
        password: "guardian123",
        user: {
          id: "u4",
          email: "guardian@test.com",
          name: "Opiekun Firmy ABC",
          phone: "+48 345 678 901",
          role: "COMPANY_GUARDIAN",
          company: "ABC Sp. z o.o.",
          employeeLimit: 10,
          employees: [
            {
              id: "emp1",
              email: "mateusz.kowalski@abc.pl",
              name: "Mateusz Kowalski",
              phone: "+48 500 111 222",
              status: "active",
              createdDate: "2025-11-15",
              assignedCourses: ["c1"],
            },
            {
              id: "emp2",
              email: "anna.lewandowska@abc.pl",
              name: "Anna Lewandowska",
              phone: "+48 500 222 333",
              status: "active",
              createdDate: "2025-10-20",
              assignedCourses: ["c2"],
            },
            {
              id: "emp3",
              email: "pawel.zawisza@abc.pl",
              name: "Paweł Zawisza",
              phone: "+48 500 333 444",
              status: "pending",
              inviteToken: "token123",
              createdDate: "2026-01-03",
              assignedCourses: ["c1"],
            },
          ],
        },
      },
    };

  // Demo użytkownicy do podglądu bez logowania
  const demoStudent = mockUsers["student@test.com"]?.user;
  const demoGuardian = mockUsers["guardian@test.com"]?.user;

  // Funkcja logowania
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      // Try local mock first for dev speed if needed, or go straight to API.
      // For this phase, we prefer API but if it fails (e.g. invalid creds for mock users), fall back?
      // Actually, let's try API first.

      let userObj: StudentUser | null = null;

      try {
        userObj = await api.auth.login(loginEmail, loginPassword);
      } catch (err) {
        console.warn("API Login failed, checking mocks...", err);
        // Fallback to mocks for existing hardcoded users if API fails
        const mock = mockUsers[loginEmail];
        if (mock && mock.password === loginPassword) {
          userObj = mock.user;
        } else {
          alert("Błędny email lub hasło");
          return;
        }
      }

      if (userObj) {
        setCurrentUser(userObj);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginEmail("");
        setLoginPassword("");

        await loadPanelDataForUser(userObj);

        if (pendingOrder) {
          const { courseId, variant } = pendingOrder;
          setPendingOrder(null);
          await createOrderForUser(userObj, courseId, variant);
        }

        // Routing na podstawie roli
        if (userObj.role === "ADMIN") {
          // setAdminPanelSection("dashboard"); // Logic moved to AdminView
          setView("NEW_ADMIN_PANEL");
        } else if (userObj.role === "MANAGER") {
          setView("NEW_MANAGER_PANEL");
        } else if (userObj.role === "COMPANY_GUARDIAN") {
          setView("NEW_GUARDIAN_PANEL");
        } else {
          setView("NEW_STUDENT_PANEL");
        }
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Wystąpił błąd logowania");
    }
  };

  // Funkcja wylogowania
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPanelOrders([]);
    setPanelUsers([]);
    setPendingOrder(null);
    setView("HOME");
  };

  const handleShowNewPanel = (panel: NewPanelKey) => {
    const viewMap: Record<NewPanelKey, ViewState> = {
      admin: "NEW_ADMIN_PANEL",
      manager: "NEW_MANAGER_PANEL",
      guardian: "NEW_GUARDIAN_PANEL",
      student: "NEW_STUDENT_PANEL",
    };
    setView(viewMap[panel]);
  };

  const getNextCourseId = (courses: Course[]) => {
    const numbers = courses
      .map((c) => c.id)
      .map((id) => {
        const match = id.match(/^c(\d+)$/);
        return match ? Number(match[1]) : null;
      })
      .filter((n): n is number => n !== null);

    const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
    return `c${next}`;
  };

  const createBlankCourse = (existing: Course[]): Course => {
    const fallbackImage = existing[0]?.image || "";
    return {
      id: getNextCourseId(existing),
      title: "Nowe szkolenie",
      category: "UDT",
      duration: "0h",
      price: "0 PLN",
      promoPrice: "",
      image: fallbackImage,
      status: "draft",
      description: "",
    };
  };

  const handleCreateCourse = (context: "admin" | "manager"): string => {
    const created = createBlankCourse(panelCourses);
    setPanelCourses((prev) => [created, ...prev]);
    return created.id;
  };

  const handleSaveCourse = (updated: Course) => {
    setPanelCourses((prev) => {
      const exists = prev.some((c) => c.id === updated.id);
      if (!exists) return [updated, ...prev];
      return prev.map((c) => (c.id === updated.id ? updated : c));
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setPanelCourses((prev) => prev.filter((c) => c.id !== courseId));
    setAdminEditingCourseId((prev) => (prev === courseId ? null : prev));
  };

  const openCoursePreview = (courseId: string) => {
    const firstLessonId = COURSE_CURRICULUM.find((m) => m.courseId === courseId)
      ?.lessons?.[0]?.id;
    setSelectedCourseId(courseId);
    if (firstLessonId) setCurrentLessonId(firstLessonId);
    setIsFromAdmin(false);
    setView("LESSON_PLAYER");
  };

  const openAdminTrainingPreview = (courseId: string) => {
    const firstLessonId = COURSE_CURRICULUM.find((m) => m.courseId === courseId)
      ?.lessons?.[0]?.id;
    setSelectedCourseId(courseId);
    if (firstLessonId) setCurrentLessonId(firstLessonId);
    setAdminEditingCourseId(courseId);
    setIsFromAdmin(true);
    setView("LESSON_PLAYER");
  };

  const openManagerTrainingPreview = (courseId: string) => {
    // Logic moved or remains if needed for other things?
    // Usually Panel handles its own section switching.
  };

  const openGuardianTrainingPreview = (courseId: string) => {
    // Logic moved to GuardianPanel
  };

  const saveUserOverrides = (email: string, overrides: UserOverrides) => {
    setPanelUserOverrides((prev) => ({ ...prev, [email]: overrides }));
  };

  const saveCompanyOverrides = (
    companyName: string,
    overrides: CompanyOverrides,
  ) => {
    setPanelCompanyOverrides((prev) => ({ ...prev, [companyName]: overrides }));
  };

  // Get program details for each course

  // Komponent Modal dla pracownika
  const EmployeeModal: React.FC<{
    employee: Employee | null;
    onClose: () => void;
    onSave: (data: Partial<Employee>) => void;
  }> = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: employee?.name || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-sm shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">
            {employee ? "Edytuj pracownika" : "Dodaj pracownika"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Imię i nazwisko
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent"
                required
                disabled={!!employee}
              />
              {employee && (
                <p className="text-xs text-slate-500 mt-1">
                  Email nie może być zmieniony
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Numer telefonu
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent"
                required
              />
            </div>
            {!employee && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-sm text-blue-700">
                  Po dodaniu pracownika zostanie wysłany email z linkiem do
                  potwierdzenia konta i ustawienia hasła.
                </p>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-brand-accent text-white font-bold rounded-sm hover:bg-brand-primary transition-colors"
              >
                {employee ? "Zapisz zmiany" : "Dodaj pracownika"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-sm hover:bg-slate-300 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const adminCourseToEdit = adminEditingCourseId
    ? panelCourses.find((course) => course.id === adminEditingCourseId) || null
    : null;

  const managerCourseToEdit = null; // No longer used in App.tsx

  const handleReturnToPanel = () => {
    if (!isLoggedIn || !currentUser) {
      setView("CATALOG");
      return;
    }
    if (currentUser.role === "ADMIN") setView("NEW_ADMIN_PANEL");
    else if (currentUser.role === "MANAGER") setView("NEW_MANAGER_PANEL");
    else if (currentUser.role === "COMPANY_GUARDIAN")
      setView("NEW_GUARDIAN_PANEL");
    else setView("NEW_STUDENT_PANEL");
  };

  return (
    <>
      {/* Modal logowania */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">
              Zaloguj się
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@test.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-primary"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Dostępne konta testowe:
                </p>
                <ul className="text-xs text-slate-500 space-y-1 mt-2">
                  <li>• admin@test.com / admin123</li>
                  <li>• manager@test.com / manager123</li>
                  <li>• student@test.com / student123</li>
                  <li>• guardian@test.com / guardian123</li>
                </ul>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Hasło
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 font-bold rounded-sm hover:bg-slate-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white font-bold rounded-sm hover:bg-brand-dark transition-colors"
                >
                  Zaloguj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "NEW_ADMIN_PANEL" ? (
        <AdminView
          currentUser={currentUser}
          handleLogout={handleLogout}
          setView={setView}
          courses={panelCourses}
          students={panelStudents}
          orders={panelOrders}
          users={panelUsers}
          userOverrides={panelUserOverrides}
          hiddenUsers={panelHiddenUsers}
          companyOverrides={panelCompanyOverrides}
          hiddenCompanies={panelHiddenCompanies}
          onCreateCourse={handleCreateCourse}
          onSaveCourse={handleSaveCourse}
          onDeleteCourse={handleDeleteCourse}
          onPreviewCourse={openAdminTrainingPreview}
          onCreateUser={handleCreatePanelUser}
          onCreateUsersBulk={handleCreatePanelUsersBulk}
          onDeleteUser={handleDeleteUser}
          saveUserOverrides={saveUserOverrides}
          onCreateCompany={saveCompanyOverrides}
          onDeleteCompany={handleDeleteCompany}
          saveCompanyOverrides={saveCompanyOverrides}
        />
      ) : currentView === "NEW_MANAGER_PANEL" ? (
        <ManagerPanel
          currentUser={currentUser}
          handleLogout={handleLogout}
          setView={setView}
          courses={panelCourses}
          students={panelStudents}
          orders={panelOrders}
          users={panelUsers}
          userOverrides={panelUserOverrides}
          hiddenUsers={panelHiddenUsers}
          companyOverrides={panelCompanyOverrides}
          hiddenCompanies={panelHiddenCompanies}
          onCreateCourse={handleCreateCourse}
          onSaveCourse={handleSaveCourse}
          onDeleteCourse={handleDeleteCourse}
          openCoursePreview={openCoursePreview}
          openManagerTrainingPreview={openManagerTrainingPreview}
          onCreateUser={handleCreatePanelUser}
          onCreateUsersBulk={handleCreatePanelUsersBulk}
          onDeleteUser={handleDeleteUser}
          saveUserOverrides={saveUserOverrides}
          saveCompanyOverrides={saveCompanyOverrides}
          handleDeleteCompany={handleDeleteCompany}
        />
      ) : currentView === "NEW_GUARDIAN_PANEL" ? (
        <GuardianPanel
          currentUser={currentUser}
          demoGuardian={demoGuardian}
          handleLogout={handleLogout}
          setView={setView}
          courses={panelCourses}
          students={panelStudents}
          userOverrides={panelUserOverrides}
          hiddenUsers={panelHiddenUsers}
          openCoursePreview={openCoursePreview}
          handleCreatePanelUser={handleCreatePanelUser}
          handleCreatePanelUsersBulk={handleCreatePanelUsersBulk}
          handleDeleteUser={handleDeleteUser}
          saveUserOverrides={saveUserOverrides}
        />
      ) : currentView === "NEW_ANALYTICS_PANEL" ? (
        <PanelLayout
          header={
            <PanelHeader
              sections={[]}
              onNotifications={() => {}}
              onProfile={() => setView("NEW_GUARDIAN_PANEL")}
              profileEmail={currentUser?.email}
              logo={<BrandMark variant="dark" />}
            />
          }
        >
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <AnalyticsView />
          </div>
        </PanelLayout>
      ) : currentView === "NEW_SUPPORT_PANEL" ? (
        <PanelLayout
          header={
            <PanelHeader
              sections={[]}
              onNotifications={() => {}}
              onProfile={() => setView("NEW_STUDENT_PANEL")}
              profileEmail={currentUser?.email}
              logo={<BrandMark variant="dark" />}
            />
          }
        >
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <SupportView currentUser={currentUser} />
          </div>
        </PanelLayout>
      ) : currentView === "LANDING_UDT" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <UDTSection setView={setView} />
        </Layout>
      ) : currentView === "LANDING_IMBIGS" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <IMBIGSSection setView={setView} />
        </Layout>
      ) : currentView === "LANDING_SEP" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <SEPSection setView={setView} />
        </Layout>
      ) : currentView === "LANDING_WELDING" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <WeldingSection setView={setView} />
        </Layout>
      ) : currentView === "LANDING_OTHER" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <OtherSection setView={setView} />
        </Layout>
      ) : currentView === "SCHEDULE" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <ScheduleView setView={setView} />
        </Layout>
      ) : currentView === "ABOUT" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <AboutView setView={setView} />
        </Layout>
      ) : currentView === "SIGNUP" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <WizardView setView={setView} />
        </Layout>
      ) : currentView === "PRIVACY" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <PrivacyView />
        </Layout>
      ) : currentView === "TERMS" ? (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onShowLoginModal={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
          setCatalogCategory={setCatalogCategory}
        >
          <TermsView />
        </Layout>
      ) : currentView === "NEW_STUDENT_PANEL" ? (
        <StudentPanel
          currentUser={currentUser}
          demoStudent={demoStudent}
          courses={panelCourses}
          students={panelStudents}
          userOverrides={panelUserOverrides}
          myCourses={MY_COURSES}
          courseCurriculum={COURSE_CURRICULUM}
          setView={setView}
          setCurrentLessonId={setCurrentLessonId}
          setSelectedCourseId={setSelectedCourseId}
          setIsFromAdmin={setIsFromAdmin}
          openCoursePreview={openCoursePreview}
          saveUserOverrides={saveUserOverrides}
          setCurrentUser={setCurrentUser}
        />
      ) : currentView === "LESSON_PLAYER" ? (
        <div className="min-h-screen bg-slate-50">
          <PanelHeader
            variant="sidebar"
            logo={<BrandMark onClick={handleReturnToPanel} />}
            sections={[
              ...(isFromAdmin && adminEditingCourseId
                ? [
                    {
                      label: "Powrót do edycji",
                      onClick: () => {
                        localStorage.setItem(
                          "returnToEditCourseId",
                          adminEditingCourseId,
                        );
                        setIsFromAdmin(false);
                        setAdminEditingCourseId(null);
                        setView("NEW_ADMIN_PANEL");
                      },
                    },
                  ]
                : []),
              ...(isLoggedIn
                ? [
                    {
                      label: "Wyloguj",
                      onClick: handleLogout,
                    },
                  ]
                : []),
            ]}
            profileEmail={currentUser?.email}
          />
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <LessonPlayerView
              currentLessonId={currentLessonId}
              setCurrentLessonId={setCurrentLessonId}
              selectedCourseId={selectedCourseId}
              setView={setView}
              isLoggedIn={isLoggedIn}
              isFromAdmin={isFromAdmin}
              adminEditingCourseId={adminEditingCourseId}
              setAdminEditingCourseId={setAdminEditingCourseId}
              setIsFromAdmin={setIsFromAdmin}
              panelCourses={panelCourses}
            />
            <PanelFooter />
          </div>
        </div>
      ) : (
        <Layout
          currentView={currentView}
          setView={setView}
          language={language}
          setLanguage={setLanguage}
          setCatalogCategory={setCatalogCategory}
          onShowLoginModal={() => setShowLoginModal(true)}
          isLoggedIn={isLoggedIn}
          userName={currentUser?.name}
          onLogout={handleLogout}
          onShowNewPanel={handleShowNewPanel}
        >
          <>
            {currentView === "HOME" && (
              <HomeView
                language={language}
                setView={setView}
                setSelectedCourseId={setSelectedCourseId}
                importBaseUrl={importBaseUrl}
              />
            )}
            {currentView === "CATALOG" && (
              <CatalogView
                catalogCategory={catalogCategory}
                setCatalogCategory={setCatalogCategory}
                setCurrentView={setView}
                setSelectedCourseId={setSelectedCourseId}
                setView={setView}
                courses={panelCourses}
              />
            )}
            {currentView === "COURSE_DETAIL" && (
              <CourseDetailView
                selectedCourseId={selectedCourseId}
                setView={setView}
                setSelectedCourseId={setSelectedCourseId}
                language={language}
                courses={panelCourses}
                onBuyCourse={handleBuyCourse}
              />
            )}
            {currentView === "RENTALS" && (
              <RentalsView
                setView={setView}
                setSelectedMachineId={setSelectedMachineId}
              />
            )}
            {currentView === "MACHINE_DETAIL" && (
              <MachineDetailView
                selectedMachineId={selectedMachineId}
                setView={setView}
              />
            )}
            {currentView === "SERVICES" && (
              <ServicesView setView={setView} importBaseUrl={importBaseUrl} />
            )}
            {currentView === "CONTACT" && <ContactView setView={setView} />}
            {currentView === "STUDENT_DETAIL" && (
              <StudentDetailView
                viewingStudentId={viewingStudentId}
                setViewingStudentId={setViewingStudentId}
                setView={setView}
                setAdminActiveTab={setAdminActiveTab}
                selectedCompany={selectedCompany}
              />
            )}
            {currentView === "LMS" && (
              <LMSView
                currentUser={currentUser}
                demoStudent={demoStudent}
                setCurrentLessonId={setCurrentLessonId}
                setIsFromAdmin={setIsFromAdmin}
                setView={setView}
              />
            )}
          </>
        </Layout>
      )}
    </>
  );
};

export default App;
