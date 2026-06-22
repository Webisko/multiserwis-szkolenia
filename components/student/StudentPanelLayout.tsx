import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  BadgeCheck,
  ClipboardCheck,
  LibraryBig,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  Target,
} from "lucide-react";
import { BrandMark } from "../BrandMark";
import { PanelFooter } from "../panel/PanelFooter";
import { PanelBreadcrumbs } from "../panel/PanelBreadcrumbs";

export type StudentSectionId =
  | "dashboard"
  | "my-courses"
  | "certifications"
  | "exams"
  | "catalog"
  | "goals"
  | "course-preview"
  | "support"
  | "profile-view"
  | "profile-edit"
  | "settings";

interface StudentPanelLayoutProps {
  activeSection: StudentSectionId;
  onSectionChange: (section: StudentSectionId) => void;
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

const sidebarItems: {
  id: StudentSectionId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "dashboard", label: "Pulpit", icon: <LayoutDashboard size={18} /> },
  { id: "my-courses", label: "Moje kursy", icon: <GraduationCap size={18} /> },
  {
    id: "certifications",
    label: "Uprawnienia",
    icon: <BadgeCheck size={18} />,
  },
  { id: "exams", label: "Egzaminy", icon: <ClipboardCheck size={18} /> },
  { id: "goals", label: "Moje cele", icon: <Target size={18} /> },
  { id: "catalog", label: "Katalog szkoleń", icon: <LibraryBig size={18} /> },
  { id: "support", label: "Wsparcie", icon: <ClipboardCheck size={18} /> }, // Using ClipboardCheck as placeholder, check Lucide for better icon like MessageSquare or HelpCircle
  { id: "profile-view", label: "Profil", icon: <User size={18} /> },
  { id: "settings", label: "Ustawienia", icon: <Settings size={18} /> },
];

export const StudentPanelLayout: React.FC<StudentPanelLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
  userName = "Kursant",
  userRole = "Kursant",
  onLogout,
  onLogoClick,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] =
    React.useState(false);

  const notifications = [
    { id: "n1", title: "Nowa lekcja dostępna", time: "10 minut temu" },
    { id: "n2", title: "Zbliża się termin egzaminu", time: "1 godzina temu" },
  ];
  const unreadCount = 1;

  const renderSidebarItem = (item: {
    id: StudentSectionId;
    label: string;
    icon: React.ReactNode;
  }) => {
    const isActive =
      activeSection === item.id ||
      (activeSection === "course-preview" && item.id === "catalog") ||
      ((activeSection === "profile-edit" || activeSection === "profile-view") &&
        item.id === "profile-view");

    return (
      <button
        key={item.id}
        onClick={() => {
          onSectionChange(item.id);
          setMobileOpen(false);
        }}
        className={`sidebar-link flex items-center px-6 py-3 gap-3 text-left border-l-4 transition-all w-full ${
          isActive
            ? "bg-white/10 border-brand-accent text-white font-semibold"
            : "border-transparent text-slate-300 hover:text-white hover:bg-white/10"
        }`}
      >
        <span className={`${isActive ? "text-brand-accent" : ""}`}>
          {item.icon}
        </span>
        <span>{item.label}</span>
      </button>
    );
  };

  const getBreadcrumbs = (section: StudentSectionId): string[] => {
    switch (section) {
      case "dashboard":
        return ["Pulpit"];
      case "my-courses":
        return ["Pulpit", "Moje kursy"];
      case "certifications":
        return ["Pulpit", "Uprawnienia"];
      case "exams":
        return ["Pulpit", "Egzaminy"];
      case "catalog":
        return ["Pulpit", "Katalog szkoleń"];
      case "course-preview":
        return ["Pulpit", "Katalog szkoleń", "Podgląd"];
      case "support":
        return ["Pulpit", "Wsparcie"];
      case "profile-view":
        return ["Pulpit", "Profil"];
      case "profile-edit":
        return ["Pulpit", "Profil", "Edycja"];
      case "settings":
        return ["Pulpit", "Ustawienia"];
      default:
        return ["Pulpit"];
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-brand-primary text-white hidden md:flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-teal-800/50 bg-teal-900/20">
          <BrandMark onClick={onLogoClick} variant="sidebar" />
        </div>
        <nav className="flex-1 overflow-y-auto py-6 space-y-1">
          {sidebarItems.slice(0, 5).map(renderSidebarItem)}
          <div className="pt-6 pb-2 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Konto
          </div>
          {sidebarItems.slice(5).map(renderSidebarItem)}
        </nav>
        <div className="p-4 bg-teal-900/30 border-t border-teal-800/50">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-sm text-slate-300 hover:text-white transition"
          >
            <LogOut size={18} />
            Wyloguj się
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-brand-primary text-white flex flex-col shadow-xl">
            <div className="h-16 flex items-center px-6 border-b border-teal-800/50 bg-teal-900/20">
              <BrandMark onClick={onLogoClick} variant="sidebar" />
            </div>
            <nav className="flex-1 overflow-y-auto py-6 space-y-1">
              {sidebarItems.slice(0, 5).map(renderSidebarItem)}
              <div className="pt-6 pb-2 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Konto
              </div>
              {sidebarItems.slice(5).map(renderSidebarItem)}
            </nav>
            <div className="p-4 bg-teal-900/30 border-t border-teal-800/50">
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full text-sm text-slate-300 hover:text-white transition"
              >
                <LogOut size={18} />
                Wyloguj się
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-500 hover:text-brand-primary"
              onClick={() => setMobileOpen(true)}
              aria-label="Otwórz menu"
            >
              <Menu size={22} />
            </button>
            <div className="relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent w-64"
                placeholder="Szukaj kursów..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="relative"
              onMouseEnter={() => setShowNotificationsMenu(true)}
              onMouseLeave={() => setShowNotificationsMenu(false)}
            >
              <button
                onClick={() => setShowNotificationsMenu((prev) => !prev)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
                aria-label="Powiadomienia"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotificationsMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-900">
                      Powiadomienia
                    </h3>
                  </div>
                  <div className="max-h-100 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 hover:bg-slate-50 transition-colors flex gap-3 border-b border-slate-100"
                      >
                        <div className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center bg-slate-100 text-slate-600">
                          <Bell size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {item.title}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {userName}
                </p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-100 flex items-center justify-center font-bold text-slate-700">
                {(userName || "K")[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col">
          <div className="flex-1 space-y-4">
            <PanelBreadcrumbs segments={getBreadcrumbs(activeSection)} />
            <div>{children}</div>
          </div>
          <PanelFooter />
        </main>
      </div>
    </div>
  );
};
