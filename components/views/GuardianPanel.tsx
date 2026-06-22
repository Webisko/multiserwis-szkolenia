import React, { useState } from "react";
import {
  GuardianPanelLayout,
  type GuardianSectionId,
} from "../guardian/GuardianPanelLayout";
import { GuardianDashboard } from "../guardian/GuardianDashboard";
import { CoursesCatalog } from "../panel/CoursesCatalog";
import { TrainingPreviewPage } from "../panel/TrainingPreviewPage";
import { AdminUsers } from "../admin/AdminUsers";
import { UserCreatePage } from "../panel/UserCreatePage";
import { UserProfileView, type UserOverrides } from "../panel/UserProfileView";
import { UserEdit } from "../panel/UserEdit";
import { GuardianReports } from "../guardian/GuardianReports";
import { NotificationsCenter } from "../panel/NotificationsCenter";
import { GuardianSettings } from "../guardian/GuardianSettings";
import AnalyticsView from "./AnalyticsView";
import { Course, Student, ViewState } from "../../types";

interface GuardianPanelProps {
  currentUser: any;
  demoGuardian: any;
  handleLogout: () => void;
  setView: (view: ViewState) => void;
  courses: Course[];
  students: Student[];
  userOverrides: Record<string, UserOverrides>;
  hiddenUsers: string[];

  // Handlers
  openCoursePreview: (courseId: string) => void;
  handleCreatePanelUser: (
    payload: any,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  handleCreatePanelUsersBulk: (payloads: any[]) => any;
  handleDeleteUser: (email: string) => void;
  saveUserOverrides: (email: string, overrides: UserOverrides) => void;
}

export const GuardianPanel: React.FC<GuardianPanelProps> = ({
  currentUser,
  demoGuardian,
  handleLogout,
  setView,
  courses,
  students,
  userOverrides,
  hiddenUsers,
  openCoursePreview,
  handleCreatePanelUser,
  handleCreatePanelUsersBulk,
  handleDeleteUser,
  saveUserOverrides,
}) => {
  const [activeSection, setActiveSection] =
    useState<GuardianSectionId>("dashboard");
  const [previewCourseId, setPreviewCourseId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null,
  );

  const companyName =
    currentUser?.company || demoGuardian?.company || "Demo Sp. z o.o.";

  const employeesCount = new Set(
    students
      .filter((s) => (s.company || "Indywidualny") === companyName)
      .map((s) => s.email),
  ).size;

  return (
    <GuardianPanelLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogoClick={() => setView("HOME")}
      userName={currentUser?.name || "Opiekun firmy"}
      userRole={
        currentUser?.company
          ? `Opiekun: ${currentUser.company}`
          : "Opiekun firmy"
      }
      onLogout={handleLogout}
    >
      {activeSection === "dashboard" && (
        <GuardianDashboard
          companyName={companyName}
          employeesCount={employeesCount}
          trainingsCount={courses.length}
        />
      )}

      {activeSection === "courses" && (
        <CoursesCatalog
          title="Szkolenia"
          subtitle="Katalog szkoleń dostępnych dla firmy (podgląd)."
          courses={courses}
          onPreviewCourse={(id) => {
            setPreviewCourseId(id);
            setActiveSection("course-preview");
          }}
        />
      )}

      {activeSection === "course-preview" && (
        <TrainingPreviewPage
          training={courses.find((c) => c.id === previewCourseId) || null}
          onBack={() => setActiveSection("courses")}
          onStart={openCoursePreview}
        />
      )}

      {activeSection === "analytics" && <AnalyticsView />}

      {activeSection === "employees" && (
        <AdminUsers
          title="Pracownicy"
          subtitle="Lista pracowników firmy przypisanych do kursów."
          addButtonLabel="Dodaj pracownika"
          searchPlaceholder="Szukaj pracownika..."
          countLabel="PRACOWNIKÓW"
          forcedCompany={companyName}
          hideCompanyColumn
          students={students}
          overrides={userOverrides}
          hiddenEmails={hiddenUsers}
          onAddClick={() => setActiveSection("employee-create")}
          onViewUser={(email) => {
            setSelectedUserEmail(email);
            setActiveSection("employee-view");
          }}
          onEditUser={(email) => {
            setSelectedUserEmail(email);
            setActiveSection("employee-edit");
          }}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {activeSection === "employee-create" && (
        <UserCreatePage
          title="Dodawanie pracownika"
          subtitle="Dodaj pojedynczą osobę lub zaimportuj wiele osób z CSV."
          courses={courses}
          students={students}
          forcedCompany={companyName}
          onBack={() => setActiveSection("employees")}
          onCreateUser={handleCreatePanelUser}
          onCreateUsersBulk={handleCreatePanelUsersBulk}
        />
      )}

      {activeSection === "employee-view" && selectedUserEmail && (
        <UserProfileView
          email={selectedUserEmail}
          entityLabel="pracownika"
          courses={courses}
          students={students}
          overrides={userOverrides}
          onBack={() => setActiveSection("employees")}
          onEdit={() => setActiveSection("employee-edit")}
        />
      )}

      {activeSection === "employee-edit" && selectedUserEmail && (
        <UserEdit
          email={selectedUserEmail}
          entityLabel="pracownika"
          students={students}
          overrides={userOverrides}
          onSaveOverrides={saveUserOverrides}
          hideCompanyField
          forcedCompany={companyName}
          onBack={() => setActiveSection("employee-view")}
        />
      )}

      {activeSection === "reports" && (
        <GuardianReports
          courses={courses}
          students={students}
          forcedCompany={companyName}
        />
      )}
      {activeSection === "notifications" && <NotificationsCenter />}
      {activeSection === "settings" && <GuardianSettings />}
    </GuardianPanelLayout>
  );
};
