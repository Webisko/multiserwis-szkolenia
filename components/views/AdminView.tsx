import React, { useState } from "react";
import {
  AdminPanelLayout,
  type AdminSectionId,
} from "../admin/AdminPanelLayout";
import { AdminDashboard } from "../admin/AdminDashboard";
import { CoursesCatalog } from "../panel/CoursesCatalog";
import { TrainingPreviewPage } from "../panel/TrainingPreviewPage";
import { AdminCourseEdit } from "../admin/AdminCourseEdit";
import { AdminUsers } from "../admin/AdminUsers";
import { UserCreatePage } from "../panel/UserCreatePage";
import { UserProfileView, type UserOverrides } from "../panel/UserProfileView";
import { UserEdit } from "../panel/UserEdit";
import { AdminCompanies } from "../admin/AdminCompanies";
import { CompanyCreatePage } from "../panel/CompanyCreatePage";
import { CompanyView, type CompanyOverrides } from "../panel/CompanyView";
import { CompanyEdit } from "../panel/CompanyEdit";
import { NotificationsCenter } from "../panel/NotificationsCenter";
import { AdminFinance } from "../admin/AdminFinance";
import { AdminReports } from "../admin/AdminReports";
import { AdminSettings } from "../admin/AdminSettings";
import { AdminPermissions } from "../admin/AdminPermissions";
import { Course, Order, Student, StudentUser, ViewState } from "../../types";

interface AdminPanelProps {
  currentUser: StudentUser | null;
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
  onPreviewCourse: (courseId: string) => void;

  onCreateUser: (
    payload: any,
  ) =>
    | { ok: true }
    | { ok: false; error: string }
    | Promise<{ ok: true } | { ok: false; error: string }>;
  onCreateUsersBulk: (payloads: any[]) => any;
  onDeleteUser: (email: string) => void;
  saveUserOverrides: (email: string, overrides: UserOverrides) => void;

  onCreateCompany: (name: string, overrides: CompanyOverrides) => void;
  onDeleteCompany: (name: string) => void;
  saveCompanyOverrides: (name: string, overrides: CompanyOverrides) => void;
}

export const AdminView: React.FC<AdminPanelProps> = ({
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
  onPreviewCourse,
  onCreateUser,
  onCreateUsersBulk,
  onDeleteUser,
  saveUserOverrides,
  onCreateCompany, // App uses saveCompanyOverrides to create? No, CompanyCreatePage calls saveCompanyOverrides.
  onDeleteCompany,
  saveCompanyOverrides,
}) => {
  const [activeSection, setActiveSection] =
    useState<AdminSectionId>("dashboard");

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
    <AdminPanelLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogoClick={() => setView("HOME")}
      userName={currentUser?.name || "Administrator"}
      userRole="Superadministrator"
      onLogout={handleLogout}
    >
      {activeSection === "dashboard" && (
        <AdminDashboard onNavigate={setActiveSection} />
      )}

      {activeSection === "courses" && (
        <CoursesCatalog
          courses={courses}
          onCreateCourse={() => {
            const newId = onCreateCourse("admin");
            setEditingCourseId(newId);
            setActiveSection("course-create");
          }}
          onEditCourse={(courseId) => {
            setEditingCourseId(courseId);
            setActiveSection("course-edit");
          }}
          onPreviewCourse={(courseId) => {
            setPreviewCourseId(courseId);
            // onPreviewCourse(courseId); // This logic in App set `adminPreviewCourseId` and switched section.
            // Now we do it locally:
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
          onStart={(id) => onPreviewCourse(id)} // This opens the actual player?
        />
      )}

      {(activeSection === "course-edit" ||
        activeSection === "course-create") && (
        <AdminCourseEdit
          course={courseToEdit} // Note: for 'create', this might be null if we don't pre-create.
          onBack={() => setActiveSection("courses")}
          onSave={(c) => {
            onSaveCourse(c);
            setActiveSection("courses");
          }}
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
          onDeleteCompany={onDeleteCompany}
        />
      )}

      {activeSection === "company-create" && (
        <CompanyCreatePage
          overrides={companyOverrides}
          userOverrides={userOverrides}
          onCreate={(name, overrides) => saveCompanyOverrides(name, overrides)} // Wrapper to match signature?
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
        <AdminFinance
          courses={courses}
          students={students}
          orders={orders}
          users={users}
        />
      )}
      {activeSection === "reports" && (
        <AdminReports courses={courses} students={students} />
      )}
      {activeSection === "settings" && <AdminSettings />}
      {activeSection === "permissions" && <AdminPermissions />}
    </AdminPanelLayout>
  );
};
