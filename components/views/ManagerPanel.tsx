import React, { useState } from "react";
import {
  ManagerPanelLayout,
  type ManagerSectionId,
} from "../manager/ManagerPanelLayout";
import { ManagerDashboard } from "../manager/ManagerDashboard";
import { CoursesCatalog } from "../panel/CoursesCatalog";
import { TrainingPreviewPage } from "../panel/TrainingPreviewPage";
import { ManagerCourseEdit } from "../manager/ManagerCourseEdit";
import { AdminUsers } from "../admin/AdminUsers";
import { UserCreatePage } from "../panel/UserCreatePage";
import { UserProfileView, type UserOverrides } from "../panel/UserProfileView";
import { UserEdit } from "../panel/UserEdit";
import { AdminCompanies } from "../admin/AdminCompanies";
import { CompanyCreatePage } from "../panel/CompanyCreatePage";
import { CompanyView, type CompanyOverrides } from "../panel/CompanyView";
import { CompanyEdit } from "../panel/CompanyEdit";
import { NotificationsCenter } from "../panel/NotificationsCenter";
import { ManagerFinance } from "../manager/ManagerFinance";
import { ManagerReports } from "../manager/ManagerReports";
import { ManagerSettings } from "../manager/ManagerSettings";
import { Course, Order, Student, StudentUser, ViewState } from "../../types";

interface ManagerPanelProps {
  currentUser: any;
  handleLogout: () => void;
  setView: (view: ViewState) => void;
  courses: Course[];
  students: Student[];
  orders: Order[];
  users: StudentUser[];
  userOverrides: Record<string, UserOverrides>;
  hiddenUsers: string[];
  companyOverrides: Record<string, CompanyOverrides>;
  hiddenCompanies: string[];

  // Handlers
  onCreateCourse: (intent: "admin" | "manager") => string;
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  openCoursePreview: (courseId: string) => void;
  openManagerTrainingPreview: (courseId: string) => void;

  onCreateUser: (
    payload: any,
  ) =>
    | { ok: true }
    | { ok: false; error: string }
    | Promise<{ ok: true } | { ok: false; error: string }>;
  onCreateUsersBulk: (payloads: any[]) => any;
  onDeleteUser: (email: string) => void;
  saveUserOverrides: (email: string, overrides: UserOverrides) => void;

  saveCompanyOverrides: (name: string, overrides: CompanyOverrides) => void;
  handleDeleteCompany: (name: string) => void;
}

export const ManagerPanel: React.FC<ManagerPanelProps> = ({
  currentUser,
  handleLogout,
  setView,
  courses,
  students,
  orders,
  users,
  userOverrides,
  hiddenUsers,
  companyOverrides,
  hiddenCompanies,
  onCreateCourse,
  onSaveCourse,
  onDeleteCourse,
  openCoursePreview,
  openManagerTrainingPreview,
  onCreateUser,
  onCreateUsersBulk,
  onDeleteUser,
  saveUserOverrides,
  saveCompanyOverrides,
  handleDeleteCompany,
}) => {
  const [activeSection, setActiveSection] =
    useState<ManagerSectionId>("dashboard");

  // Local UI State
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [previewCourseId, setPreviewCourseId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null,
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(
    null,
  );

  // Derived state
  const courseToEdit = editingCourseId
    ? courses.find((c) => c.id === editingCourseId) || null
    : null;

  return (
    <ManagerPanelLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogoClick={() => setView("HOME")}
      userName={currentUser?.name || "Menedżer"}
      userRole="Menedżer platformy"
      onLogout={handleLogout}
    >
      {activeSection === "dashboard" && (
        <ManagerDashboard courses={courses} onNavigate={setActiveSection} />
      )}

      {activeSection === "courses" && (
        <CoursesCatalog
          courses={courses}
          onCreateCourse={() => {
            const newId = onCreateCourse("manager");
            setEditingCourseId(newId);
            setActiveSection("course-create");
          }}
          onEditCourse={(courseId) => {
            setEditingCourseId(courseId);
            setActiveSection("course-edit");
          }}
          onPreviewCourse={(courseId) => {
            setPreviewCourseId(courseId);
            setActiveSection("course-preview");
          }}
          onDeleteCourse={onDeleteCourse}
        />
      )}

      {activeSection === "course-preview" && (
        <TrainingPreviewPage
          training={courses.find((c) => c.id === previewCourseId) || null}
          onBack={() => setActiveSection("courses")}
          onEdit={() => {
            if (!previewCourseId) return;
            setEditingCourseId(previewCourseId);
            setActiveSection("course-edit");
          }}
          onStart={openCoursePreview}
        />
      )}

      {(activeSection === "course-edit" ||
        activeSection === "course-create") && (
        <ManagerCourseEdit
          course={courseToEdit}
          onBack={() => setActiveSection("courses")}
          onSave={onSaveCourse}
          onDelete={onDeleteCourse}
          onPreview={(id) => {
            setPreviewCourseId(id);
            setActiveSection("course-preview");
          }}
          intent={activeSection === "course-create" ? "create" : "edit"}
        />
      )}

      {activeSection === "users" && (
        <AdminUsers
          students={students}
          overrides={userOverrides}
          hiddenEmails={hiddenUsers}
          onAddClick={() => setActiveSection("user-create")}
          onViewUser={(email) => {
            setSelectedUserEmail(email);
            setActiveSection("user-view");
          }}
          onEditUser={(email) => {
            setSelectedUserEmail(email);
            setActiveSection("user-edit");
          }}
          onDeleteUser={onDeleteUser}
        />
      )}

      {activeSection === "user-create" && (
        <UserCreatePage
          title="Dodawanie użytkownika"
          subtitle="Dodaj pojedynczą osobę lub zaimportuj wiele osób z CSV."
          courses={courses}
          students={students}
          onBack={() => setActiveSection("users")}
          onCreateUser={onCreateUser}
          onCreateUsersBulk={onCreateUsersBulk}
        />
      )}
      {activeSection === "user-view" && selectedUserEmail && (
        <UserProfileView
          email={selectedUserEmail}
          courses={courses}
          students={students}
          overrides={userOverrides}
          onBack={() => setActiveSection("users")}
          onEdit={() => setActiveSection("user-edit")}
        />
      )}
      {activeSection === "user-edit" && selectedUserEmail && (
        <UserEdit
          email={selectedUserEmail}
          students={students}
          overrides={userOverrides}
          onSaveOverrides={saveUserOverrides}
          onBack={() => setActiveSection("user-view")}
        />
      )}

      {activeSection === "companies" && (
        <AdminCompanies
          overrides={companyOverrides}
          hiddenCompanies={hiddenCompanies}
          onAddClick={() => {
            setSelectedCompanyName(null);
            setActiveSection("company-create");
          }}
          onViewCompany={(companyName) => {
            setSelectedCompanyName(companyName);
            setActiveSection("company-view");
          }}
          onEditCompany={(companyName) => {
            setSelectedCompanyName(companyName);
            setActiveSection("company-edit");
          }}
          onDeleteCompany={handleDeleteCompany}
        />
      )}
      {activeSection === "company-create" && (
        <CompanyCreatePage
          overrides={companyOverrides}
          userOverrides={userOverrides}
          onCreate={saveCompanyOverrides}
          onSaveUserOverrides={saveUserOverrides}
          onCancel={() => setActiveSection("companies")}
          onCreated={(companyName) => {
            setSelectedCompanyName(companyName);
            setActiveSection("company-view");
          }}
        />
      )}
      {activeSection === "company-view" && selectedCompanyName && (
        <CompanyView
          companyName={selectedCompanyName}
          courses={courses}
          overrides={companyOverrides}
          userOverrides={userOverrides}
          onBack={() => setActiveSection("companies")}
          onEdit={() => setActiveSection("company-edit")}
        />
      )}
      {activeSection === "company-edit" && selectedCompanyName && (
        <CompanyEdit
          companyName={selectedCompanyName}
          overrides={companyOverrides}
          userOverrides={userOverrides}
          onSaveOverrides={saveCompanyOverrides}
          onSaveUserOverrides={saveUserOverrides}
          onBack={() => setActiveSection("company-view")}
        />
      )}
      {activeSection === "notifications" && <NotificationsCenter />}
      {activeSection === "finance" && (
        <ManagerFinance
          courses={courses}
          students={students}
          orders={orders}
          users={users}
        />
      )}
      {activeSection === "reports" && (
        <ManagerReports courses={courses} students={students} />
      )}
      {activeSection === "settings" && <ManagerSettings />}
    </ManagerPanelLayout>
  );
};
