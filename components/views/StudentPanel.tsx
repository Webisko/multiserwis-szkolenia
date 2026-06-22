import React, { useState } from "react";
import {
  StudentPanelLayout,
  type StudentSectionId,
} from "../student/StudentPanelLayout";
import { StudentDashboard } from "../student/StudentDashboard";
import { CoursesCatalog } from "../panel/CoursesCatalog";
import { TrainingPreviewPage } from "../panel/TrainingPreviewPage";
import { UserProfileView, type UserOverrides } from "../panel/UserProfileView";
import { UserEdit } from "../panel/UserEdit";
import { StudentMyCoursesPage } from "../student/StudentMyCoursesPage";
import { StudentCertificationsPage } from "../student/StudentCertificationsPage";
import { StudentExamsPage } from "../student/StudentExamsPage";
import { StudentGoalsPage } from "../student/StudentGoalsPage";
import SupportView from "./SupportView";
import { Course, Student, ViewState } from "../../types";

interface StudentPanelProps {
  currentUser: any;
  demoStudent: any;
  courses: Course[];
  students: Student[];
  userOverrides: Record<string, UserOverrides>;
  myCourses: any[];
  courseCurriculum: any[];
  setView: (view: ViewState) => void;
  setCurrentLessonId: (id: string) => void;
  setSelectedCourseId: (id: string) => void;
  setIsFromAdmin: (val: boolean) => void;
  openCoursePreview: (courseId: string) => void;
  saveUserOverrides: (email: string, overrides: UserOverrides) => void;
  setCurrentUser: (user: any) => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({
  currentUser,
  demoStudent,
  courses,
  students,
  userOverrides,
  myCourses,
  courseCurriculum,
  setView,
  setCurrentLessonId,
  setSelectedCourseId,
  setIsFromAdmin,
  openCoursePreview,
  saveUserOverrides,
  setCurrentUser,
}) => {
  const studentUser = currentUser ?? demoStudent;
  const [activeSection, setActiveSection] =
    useState<StudentSectionId>("dashboard");
  const [previewCourseId, setPreviewCourseId] = useState<string | null>(null);

  const openStudentTrainingPreview = (courseId: string) => {
    setPreviewCourseId(courseId);
    setActiveSection("course-preview");
  };

  const continueStudentCourse = (courseId: string) => {
    const normalize = (value: string) =>
      (value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    const email = (studentUser?.email || "").trim().toLowerCase();
    const studentRecord = email
      ? students.find((s) => s.email.trim().toLowerCase() === email)
      : undefined;
    const lessons =
      courseCurriculum.find((m) => m.courseId === courseId)?.lessons || [];
    const completed = new Set(studentRecord?.completedLessons || []);
    const firstIncompleteLessonId = lessons.find(
      (l) => !completed.has(l.id),
    )?.id;
    const fallbackLessonId = lessons[0]?.id;

    const enrollment = myCourses.find((uc) => uc.courseId === courseId);
    const desiredTitle = enrollment?.nextLesson
      ? normalize(enrollment.nextLesson)
      : "";
    const desiredLessonId = desiredTitle
      ? lessons.find((l) => normalize(l.title) === desiredTitle)?.id ||
        lessons.find(
          (l) =>
            normalize(l.title).includes(desiredTitle) ||
            desiredTitle.includes(normalize(l.title)),
        )?.id
      : undefined;

    setSelectedCourseId(courseId);
    if (desiredLessonId) setCurrentLessonId(desiredLessonId);
    else if (firstIncompleteLessonId)
      setCurrentLessonId(firstIncompleteLessonId);
    else if (fallbackLessonId) setCurrentLessonId(fallbackLessonId);
    setIsFromAdmin(false);
    setView("LESSON_PLAYER");
  };

  return (
    <StudentPanelLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      userName={studentUser?.name || "Kursant"}
      userRole="Kursant"
      onLogoClick={() => setView("HOME")}
      onLogout={() => {
        setCurrentUser(null);
        setView("HOME");
      }}
    >
      {activeSection === "dashboard" && studentUser && (
        <StudentDashboard
          studentUser={studentUser}
          courses={courses}
          myCourses={myCourses}
          onContinueLearning={() => setActiveSection("my-courses")}
          onGoToCatalog={() => setActiveSection("catalog")}
          onGoToCertifications={() => setActiveSection("certifications")}
        />
      )}

      {activeSection === "catalog" && (
        <CoursesCatalog
          title="Katalog szkoleń"
          subtitle="Przeglądaj szkolenia dostępne w systemie."
          courses={courses}
          variant="tiles"
          onPreviewCourse={openStudentTrainingPreview}
          onBuyCourse={(courseId) => {
            setSelectedCourseId(courseId);
            setView("CONTACT");
          }}
          buyLabel="Kup"
        />
      )}

      {activeSection === "course-preview" && (
        <TrainingPreviewPage
          training={courses.find((c) => c.id === previewCourseId) || null}
          onBack={() => setActiveSection("catalog")}
          onStart={openCoursePreview}
        />
      )}

      {activeSection === "profile-view" && studentUser?.email && (
        <UserProfileView
          email={studentUser.email}
          courses={courses}
          students={students}
          overrides={userOverrides}
          onBack={() => setActiveSection("dashboard")}
          onEdit={() => setActiveSection("profile-edit")}
        />
      )}

      {activeSection === "profile-edit" && studentUser?.email && (
        <UserEdit
          email={studentUser.email}
          students={students}
          overrides={userOverrides}
          onSaveOverrides={saveUserOverrides}
          hideCompanyField
          onBack={() => setActiveSection("profile-view")}
        />
      )}

      {activeSection === "my-courses" && (
        <StudentMyCoursesPage
          courses={courses}
          myCourses={myCourses}
          onPreviewCourse={openStudentTrainingPreview}
          onContinueCourse={continueStudentCourse}
        />
      )}

      {activeSection === "certifications" && (
        <StudentCertificationsPage studentUser={studentUser} />
      )}

      {activeSection === "exams" && (
        <StudentExamsPage studentUser={studentUser} />
      )}

      {activeSection === "goals" && (
        <StudentGoalsPage
          studentUser={studentUser}
          myCourses={myCourses}
          courses={courses}
        />
      )}

      {activeSection === "support" && <SupportView currentUser={currentUser} />}

      {activeSection === "settings" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Ustawienia</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ustawienia konta (do wdrożenia).
          </p>
        </div>
      )}
    </StudentPanelLayout>
  );
};
