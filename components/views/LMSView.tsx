import React, { useState } from "react";
import {
  User,
  Lock,
  Award,
  Play,
  Download,
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  GraduationCap,
  ShieldCheck,
  X,
} from "lucide-react";
import { MY_COURSES, COURSES, COURSE_CURRICULUM } from "../../constants";

interface Props {
  currentUser: any;
  demoStudent: any;
  setCurrentLessonId: (id: string) => void;
  setIsFromAdmin: (val: boolean) => void;
  setView: (view: any) => void;
}

const LMSView: React.FC<Props> = ({
  currentUser,
  demoStudent,
  setCurrentLessonId,
  setIsFromAdmin,
  setView,
}) => {
  const [lmsTab, setLmsTab] = useState<
    "courses" | "certifications" | "examHistory"
  >("courses");
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const studentViewUser = currentUser ?? demoStudent;

  // Oblicz dni do wygaśnięcia najbliższych uprawnień
  const getExpiringCertifications = () => {
    if (!studentViewUser?.certifications) return [];
    const now = new Date();
    return studentViewUser.certifications.filter((cert: any) => {
      const expirationDate = new Date(cert.expirationDate);
      const daysUntilExpiration = Math.ceil(
        (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilExpiration <= 180 && daysUntilExpiration > 0; // 3-6 miesięcy
    });
  };

  const expiringCerts = getExpiringCertifications();

  return (
    <div className="min-h-[calc(100vh-200px)] bg-slate-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-heading font-bold text-brand-primary mb-2">
                Panel Kursanta
              </h2>
              <p className="text-slate-500">
                Witaj ponownie, {studentViewUser?.name || "Podgląd demo"}.
                Kontynuuj naukę.
              </p>
            </div>

            <div className="h-px bg-slate-200"></div>

            {expiringCerts.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-sm shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-yellow-600 flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-yellow-800 mb-1">
                      Przypomnienie o odnowieniu uprawnień
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {expiringCerts.length === 1
                        ? `Twoje uprawnienia "${expiringCerts[0].name}" wygasają za ${Math.ceil((new Date(expiringCerts[0].expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dni.`
                        : `Masz ${expiringCerts.length} uprawnienia wygasające w ciągu najbliższych miesięcy.`}
                    </p>
                    <button
                      onClick={() => setLmsTab("certifications")}
                      className="mt-2 text-sm font-bold text-yellow-800 underline hover:text-yellow-900"
                    >
                      Zobacz szczegóły i zapisz się na egzamin →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-brand-primary text-white p-6 rounded-sm shadow-lg min-w-[260px]">
            <div className="mb-4">
              <div className="font-bold text-lg">
                {studentViewUser?.name || "Jan Kowalski"}
              </div>
              <div className="text-sm text-slate-300">
                {studentViewUser?.company || "Twoja firma"}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-300">Status konta</span>
                <span className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Aktywne
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-300">Ukończone szkolenia</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300">Certyfikaty</span>
                <span className="font-bold">1</span>
              </div>
            </div>
            <button
              onClick={() => setShowProfileEdit(true)}
              className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <User size={16} /> Edytuj profil
            </button>
          </div>
        </div>

        {/* Zakładki */}
        <div className="mb-6 flex border-b border-slate-200">
          <button
            onClick={() => setLmsTab("courses")}
            className={`px-6 py-3 text-sm font-bold transition-colors ${
              lmsTab === "courses"
                ? "text-brand-accent border-b-2 border-brand-accent"
                : "text-slate-500 hover:text-brand-dark"
            }`}
          >
            <GraduationCap size={16} className="inline mr-2" />
            Moje szkolenia
          </button>
          <button
            onClick={() => setLmsTab("certifications")}
            className={`px-6 py-3 text-sm font-bold transition-colors ${
              lmsTab === "certifications"
                ? "text-brand-accent border-b-2 border-brand-accent"
                : "text-slate-500 hover:text-brand-dark"
            }`}
          >
            <Award size={16} className="inline mr-2" />
            Moje uprawnienia
          </button>
          <button
            onClick={() => setLmsTab("examHistory")}
            className={`px-6 py-3 text-sm font-bold transition-colors ${
              lmsTab === "examHistory"
                ? "text-brand-accent border-b-2 border-brand-accent"
                : "text-slate-500 hover:text-brand-dark"
            }`}
          >
            <Award size={16} className="inline mr-2" />
            Historia egzaminów
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ZAKŁADKA: Moje szkolenia */}
          {lmsTab === "courses" && (
            <>
              {/* Main Course Content */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                  <Play size={20} className="text-brand-accent" /> Moje Aktywne
                  Szkolenia
                </h3>

                {MY_COURSES.map((userCourse) => {
                  const courseDetails = COURSES.find(
                    (c) => c.id === userCourse.courseId,
                  );
                  if (!courseDetails) return null;

                  return (
                    <div
                      key={userCourse.id}
                      className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-brand-accent"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-heading font-bold text-lg text-brand-dark">
                            {courseDetails.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            Ostatnia lekcja: {userCourse.nextLesson}
                          </p>
                        </div>
                        {userCourse.status === "completed" ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase flex items-center gap-1">
                            <CheckCircle size={12} /> Ukończony
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                            W toku
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Postęp</span>
                          <span>{userCourse.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-brand-accent h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${userCourse.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            // Znajdź pierwszą nieukończoną lekcję
                            let firstIncompleteLesson = null;
                            for (const module of COURSE_CURRICULUM) {
                              const incompleteLesson = module.lessons.find(
                                (lesson: any) => !lesson.isCompleted,
                              );
                              if (incompleteLesson) {
                                firstIncompleteLesson = incompleteLesson;
                                break;
                              }
                            }

                            // Jeśli znaleziono nieukończoną lekcję, ustaw ją jako aktywną
                            if (firstIncompleteLesson) {
                              setCurrentLessonId(firstIncompleteLesson.id);
                            }

                            setIsFromAdmin(false);
                            setView("LESSON_PLAYER");
                          }}
                          className="flex-1 bg-brand-primary text-white py-2 text-sm font-bold rounded-sm hover:bg-brand-dark transition-colors"
                        >
                          {userCourse.status === "completed"
                            ? "Powtórz materiał"
                            : "Kontynuuj naukę"}
                        </button>
                        {userCourse.status === "completed" && (
                          <button className="flex-1 border border-brand-primary text-brand-primary rounded-sm hover:bg-brand-surface flex items-center justify-center gap-2 py-2 text-sm font-bold">
                            <Download size={18} /> Pobierz certyfikat
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-100">
                  <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" /> Polecane dla
                    Ciebie
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors">
                      <div className="w-10 h-10 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                        <img
                          src="https://picsum.photos/100/100?random=8"
                          className="w-full h-full object-cover"
                          alt="Course"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-brand-dark leading-tight">
                          Szkolenie pierwszej pomocy
                        </div>
                        <div className="text-xs text-brand-accent mt-1">
                          4h • Online
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Polecane kursy - pełna szerokość pod kursami */}
              <div className="lg:col-span-3 mt-8">
                <h3 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <Star size={24} className="text-yellow-500" /> Polecane dla
                  Ciebie
                </h3>

                {/* Pakiety kursów */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-brand-dark mb-4">
                    📦 Pakiety kursów ze zniżką
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white p-6 rounded-sm shadow-lg relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-brand-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                        -30%
                      </div>
                      <h5 className="text-xl font-bold mb-2">
                        Pakiet Operator UDT
                      </h5>
                      <p className="text-slate-200 text-sm mb-4">
                        3 kursy w jednym pakiecie
                      </p>
                      <ul className="space-y-2 mb-4 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} /> Wózki jezdniowe
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} /> Suwnice
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} /> Podnośniki
                        </li>
                      </ul>
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-3xl font-bold">2450 zł</span>
                        <span className="text-slate-300 line-through text-lg mb-1">
                          3500 zł
                        </span>
                      </div>
                      <div className="text-sm text-slate-200 mb-4">
                        Oszczędzasz: 1050 zł!
                      </div>
                      <button className="w-full bg-white text-brand-primary py-3 rounded-sm font-bold hover:bg-slate-100 transition-colors">
                        Kup pakiet
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-6 rounded-sm shadow-lg relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-brand-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                        -25%
                      </div>
                      <h5 className="text-xl font-bold mb-2">
                        Pakiet BHP Premium
                      </h5>
                      <p className="text-slate-300 text-sm mb-4">
                        Kompleksowe szkolenie BHP
                      </p>
                      <ul className="space-y-2 mb-4 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} /> BHP podstawowy
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} /> Pierwsza pomoc
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} /> Ochrona ppoż.
                        </li>
                      </ul>
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-3xl font-bold">1125 zł</span>
                        <span className="text-slate-400 line-through text-lg mb-1">
                          1500 zł
                        </span>
                      </div>
                      <div className="text-sm text-slate-300 mb-4">
                        Oszczędzasz: 375 zł!
                      </div>
                      <button className="w-full bg-white text-slate-900 py-3 rounded-sm font-bold hover:bg-slate-100 transition-colors">
                        Kup pakiet
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pojedyncze kursy ze zniżką */}
                <div>
                  <h4 className="text-lg font-bold text-brand-dark mb-4">
                    💡 Zniżki na kolejne kursy
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {COURSES.slice(0, 6).map((course, idx) => {
                      const discount = [15, 20, 10, 15, 20, 10][idx];
                      const originalPrice = parseInt(course.price);
                      const discountedPrice =
                        originalPrice - (originalPrice * discount) / 100;

                      return (
                        <div
                          key={course.id}
                          className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                        >
                          <div className="relative mb-3">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-32 object-cover rounded-sm"
                            />
                            <div className="absolute top-2 right-2 bg-brand-accent text-white px-2 py-1 rounded text-xs font-bold">
                              -{discount}%
                            </div>
                          </div>
                          <h5 className="font-bold text-brand-dark mb-2 text-sm leading-tight">
                            {course.title}
                          </h5>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-brand-primary">
                              {discountedPrice} zł
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                              {originalPrice} zł
                            </span>
                          </div>
                          <button className="w-full bg-brand-primary text-white py-2 rounded-sm text-sm font-bold hover:bg-brand-dark transition-colors">
                            Dodaj do koszyka
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ZAKŁADKA: Historia egzaminów */}
          {lmsTab === "examHistory" && (
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <Award size={20} className="text-brand-accent" /> Historia
                  egzaminów
                </h3>
                <div className="grid gap-4">
                  {studentViewUser?.examHistory &&
                  studentViewUser.examHistory.length > 0 ? (
                    studentViewUser.examHistory.map((exam: any) => (
                      <div
                        key={exam.id}
                        className="bg-white p-6 rounded-sm shadow-sm border border-slate-200"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-brand-dark text-lg">
                              {exam.courseName}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1">
                              {exam.examType === "final"
                                ? "Egzamin końcowy"
                                : `Moduł: ${exam.moduleName}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div
                                className={`text-2xl font-bold ${exam.passed ? "text-green-600" : "text-red-600"}`}
                              >
                                {exam.score}/{exam.maxScore}
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(exam.date).toLocaleDateString(
                                  "pl-PL",
                                )}
                              </div>
                            </div>
                            {exam.passed ? (
                              <CheckCircle
                                size={32}
                                className="text-green-600"
                              />
                            ) : (
                              <X size={32} className="text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 text-center">
                      <p className="text-slate-500">Brak historii egzaminów</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ZAKŁADKA: Moje uprawnienia */}
          {lmsTab === "certifications" && (
            <div className="lg:col-span-3">
              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-brand-accent" /> Moje
                  uprawnienia i certyfikaty
                </h3>
                <div className="grid gap-4">
                  {studentViewUser?.certifications &&
                  studentViewUser.certifications.length > 0 ? (
                    studentViewUser.certifications.map((cert: any) => {
                      const expirationDate = new Date(cert.expirationDate);
                      const today = new Date();
                      const daysUntilExpiration = Math.ceil(
                        (expirationDate.getTime() - today.getTime()) /
                          (1000 * 60 * 60 * 24),
                      );

                      return (
                        <div
                          key={cert.id}
                          className={`bg-white p-6 rounded-sm shadow-sm border-l-4 ${
                            cert.status === "active"
                              ? "border-green-500"
                              : cert.status === "expiring-soon"
                                ? "border-yellow-500"
                                : "border-red-500"
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-brand-dark text-lg">
                                  {cert.name}
                                </h4>
                                <span
                                  className={`px-3 py-1 text-xs font-bold rounded uppercase ${
                                    cert.status === "active"
                                      ? "bg-green-100 text-green-700"
                                      : cert.status === "expiring-soon"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {cert.status === "active"
                                    ? "Aktywne"
                                    : cert.status === "expiring-soon"
                                      ? "Wygasa wkrótce"
                                      : "Wygasłe"}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">
                                {cert.courseName}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-2 text-sm text-slate-500 mt-2">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} /> Wydano:{" "}
                                  {new Date(cert.issueDate).toLocaleDateString(
                                    "pl-PL",
                                  )}
                                </span>
                                <span className="hidden sm:inline text-slate-300">
                                  •
                                </span>
                                <span
                                  className={`flex items-center gap-1 ${
                                    daysUntilExpiration <= 90
                                      ? "text-red-600 font-bold"
                                      : daysUntilExpiration <= 180
                                        ? "text-yellow-600 font-bold"
                                        : "text-slate-500"
                                  }`}
                                >
                                  <Clock size={14} /> Ważne do:{" "}
                                  {expirationDate.toLocaleDateString("pl-PL")}
                                  {daysUntilExpiration > 0 &&
                                    daysUntilExpiration <= 180 &&
                                    ` (${daysUntilExpiration} dni)`}
                                </span>
                              </div>
                              {daysUntilExpiration <= 180 &&
                                daysUntilExpiration > 0 && (
                                  <div className="mt-3 p-3 bg-yellow-50 rounded text-sm text-yellow-800">
                                    <AlertCircle
                                      size={14}
                                      className="inline mr-1"
                                    />
                                    Pamiętaj o odnowieniu uprawnień! Zapisz się
                                    na egzamin poniżej.
                                  </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              {cert.certificateUrl && (
                                <button className="px-4 py-2 bg-brand-primary text-white rounded-sm hover:bg-brand-dark transition-colors text-sm font-bold flex items-center justify-center gap-2">
                                  <Download size={16} /> Pobierz certyfikat
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  alert(
                                    "Formularz zapisu na egzamin - w budowie",
                                  );
                                }}
                                className="px-4 py-2 border border-brand-accent text-brand-accent rounded-sm hover:bg-brand-surface transition-colors text-sm font-bold flex items-center justify-center gap-2"
                              >
                                <Calendar size={16} /> Zapisz się na egzamin
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 text-center">
                      <p className="text-slate-500">
                        Nie masz jeszcze żadnych certyfikatów
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal edycji profilu */}
        {showProfileEdit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-heading font-bold text-brand-dark">
                  Mój Profil
                </h3>
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Dane osobowe */}
                <div>
                  <h4 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                    <User size={18} className="text-brand-accent" /> Dane
                    osobowe
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Imię
                        </label>
                        <input
                          type="text"
                          defaultValue="Jan"
                          className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Nazwisko
                        </label>
                        <input
                          type="text"
                          defaultValue="Kowalski"
                          className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        defaultValue="jan.kowalski@abc-transport.pl"
                        className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        defaultValue={
                          studentViewUser?.phone || "+48 000 000 000"
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Firma
                      </label>
                      <input
                        type="text"
                        defaultValue={studentViewUser?.company || "Twoja firma"}
                        className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors bg-slate-50"
                        disabled
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Zmiana firmy wymaga kontaktu z administratorem
                      </p>
                    </div>
                  </div>
                </div>

                {/* Zmiana hasła */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-brand-accent" /> Zmiana
                    hasła
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Obecne hasło
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Nowe hasło
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Powtórz nowe hasło
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Przyciski */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      // Tutaj logika zapisu
                      alert("Dane zostały zapisane!");
                      setShowProfileEdit(false);
                    }}
                    className="flex-1 px-6 py-3 bg-brand-primary text-white font-bold rounded-sm hover:bg-brand-dark transition-colors"
                  >
                    Zapisz zmiany
                  </button>
                  <button
                    onClick={() => setShowProfileEdit(false)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-sm hover:bg-slate-300 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSView;
