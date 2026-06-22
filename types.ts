export type ViewState =
  | "HOME"
  | "CATALOG"
  | "COURSE_DETAIL"
  | "LMS"
  | "LESSON_PLAYER"
  | "RENTALS"
  | "MACHINE_DETAIL"
  | "SERVICES"
  | "CONTACT"
  | "ADMIN"
  | "STUDENT_DETAIL"
  | "STUDENTS_LIST"
  | "ADMIN_PANEL"
  | "COMPANY_GUARDIAN_PANEL"
  | "NEW_ADMIN_PANEL"
  | "NEW_MANAGER_PANEL"
  | "NEW_GUARDIAN_PANEL"
  | "NEW_STUDENT_PANEL"
  | "NEW_ANALYTICS_PANEL"
  | "NEW_SUPPORT_PANEL"
  | "SCHEDULE"
  | "ABOUT"
  | "SIGNUP"
  | "PRIVACY"
  | "TERMS"
  | "LANDING_UDT"
  | "LANDING_IMBIGS"
  | "LANDING_SEP"
  | "LANDING_WELDING"
  | "LANDING_OTHER";
export type Language = "PL" | "EN" | "UA";
export type UserRole = "ADMIN" | "MANAGER" | "STUDENT" | "COMPANY_GUARDIAN";

export interface Course {
  id: string;
  title: string;
  category: "UDT" | "SEP" | "BHP" | "Inne";
  duration: string;
  price: string;
  promoPrice?: string;
  image: string;
  status?: "published" | "draft" | "archived";
  isPopular?: boolean;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  level?: string;

  // Hybrid support
  hasOnline?: boolean;
  hasStationary?: boolean;
  priceOnline?: string;
  priceStationary?: string;
  location?: string;
  nextSession?: string;

  lessons?: any[];
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  specs: {
    height?: string;
    weight?: string;
    capacity?: string;
  };
  image: string;
}

export interface UserCourse {
  id: string;
  courseId: string;
  progress: number;
  status: "active" | "completed" | "pending";
  nextLesson: string;
}

export type OrderStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PAID"
  | "CANCELLED"
  | "FAILED";

export interface Order {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  provider?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: "video" | "test" | "text" | "quiz";
  videoUrl?: string;
  description?: string;
  materials?: { name: string; url: string }[];
  questions?: QuizQuestion[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  moduleId?: string;
  courseId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "single" | "multiple" | "open";
  options?: string[];
  correctAnswer?: number | number[];
  explanation?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  company?: string;
  course: string;
  progress: number;
  expirationDays: number;
  status: "active" | "warning" | "expired" | "completed" | "pending";
  completedLessons: string[]; // Array of lesson IDs that are completed
}

export interface Employee {
  id: string;
  email: string;
  name: string;
  phone: string;
  status: "active" | "pending"; // pending = oczekuje na potwierdzenie konta
  inviteToken?: string; // Token do potwierdzenia konta
  createdDate: string;
  assignedCourses?: string[]; // ID kursów przypisanych do pracownika
}

export interface StudentUser {
  id: string;
  email: string;
  name: string;
  phone: string; // Required - numer telefonu obowiązkowy
  role: UserRole;
  company?: string;
  companyId?: string; // Links to Company entity
  profileImage?: string;
  certifications?: Certification[]; // Historia uprawnień
  examHistory?: ExamResult[]; // Historia egzaminów
  employees?: Employee[]; // Lista pracowników (dla opiekuna firmy)
  employeeLimit?: number; // Maksymalna liczba pracowników (ustawiana przez admina)
}

export interface Certification {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  expirationDate: string;
  status: "active" | "expiring-soon" | "expired"; // expiring-soon = 3-6 miesięcy przed wygaśnięciem
  certificateUrl?: string;
}

export interface ExamResult {
  id: string;
  courseId: string;
  courseName: string;
  examType: "module" | "final"; // test po module lub egzamin końcowy
  moduleId?: string;
  moduleName?: string;
  score: number;
  maxScore: number;
  passed: boolean;
  date: string;
  questionsAnswered: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: string;
  question: string;
  selectedAnswer: number | number[];
  correctAnswer: number | number[];
  isCorrect: boolean;
}

export interface ExamBooking {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  examDate: string;
  location: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface CourseRecommendation {
  course: Course;
  reason: string;
  discount?: number; // procent zniżki
  isPackage?: boolean;
}

export interface CoursePackage {
  id: string;
  name: string;
  description: string;
  courses: Course[];
  originalPrice: number;
  packagePrice: number;
  discount: number; // procent zniżki
  savings: number; // kwota oszczędności
}

export interface CompanyGuardianReport {
  employeeId: string;
  employeeName: string;
  courseId: string;
  courseName: string;
  progress: number;
  status: "active" | "completed" | "pending";
  completedDate?: string;
  lastActivityDate: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
}

export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Answer {
  id?: string;
  content: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  courseId: string;
  moduleId?: string;
  content: string;
  type: QuestionType;
  difficulty?: Difficulty;
  answers: Answer[];
}
