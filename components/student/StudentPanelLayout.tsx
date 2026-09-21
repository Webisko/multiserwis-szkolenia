import React, { useState } from "react";
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
  X,
  Target,
  ExternalLink,
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

const mainNavItems: {
  id: StudentSectionId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  { id: "dashboard", label: "Mój Pulpit", icon: <LayoutDashboard size={18} /> },
  { id: "my-courses", label: "Moje Szkolenia", icon: <GraduationCap size={18} />, badge: "Aktywne" },
  { id: "exams", label: "Testy i Egzaminy", icon: <ClipboardCheck size={18} /> },
  { id: "certifications", label: "Zaświadczenia UDT", icon: <BadgeCheck size={18} /> },
];

const secondaryNavItems: {
  id: StudentSectionId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "catalog", label: "Katalog Kursów", icon: <LibraryBig size={18} /> },
  { id: "goals", label: "Cele Szkoleniowe", icon: <Target size={18} /> },
  { id: "profile-view", label: "Mój Profil", icon: <User size={18} /> },
  { id: "settings", label: "Ustawienia", icon: <Settings size={18} /> },
];

export const StudentPanelLayout: React.FC<StudentPanelLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
  userName = "Kursant",
  userRole = "Uczestnik Szkolenia",
  onLogout,
  onLogoClick,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    { id: "n1", title: "Nowy moduł wideo dostępny w kursie", time: "15 min temu" },
    { id: "n2", title: "Zbliża się termin egzaminu UDT w Kutnie", time: "2 godz. temu" },
  ];

  const isItemActive = (id: StudentSectionId) => {
    if (activeSection === id) return true;
    if (id === "my-courses" && activeSection === "course-preview") return true;
    if (id === "profile-view" && activeSection === "profile-edit") return true;
    return false;
  };

  const renderNavItem = (item: {
    id: StudentSectionId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }) => {
    const active = isItemActive(item.id);

    return (
      <button
        key={item.id}
        onClick={() => {
          onSectionChange(item.id);
          setMobileOpen(false);
        }}
        className={`group flex items-center justify-between w-full px-4 py-3 rounded-lg text-[15px] font-semibold transition-all cursor-pointer ${
          active
            ? "bg-brand-accent text-white shadow-md shadow-orange-600/30"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-brand-accent transition-colors"}`}>
            {item.icon}
          </span>
          <span className="leading-tight">{item.label}</span>
        </div>
        {item.badge && (
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${active ? "bg-white/25 text-white" : "bg-slate-800 text-slate-400"}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const getBreadcrumbs = (section: StudentSectionId): string[] => {
    switch (section) {
      case "dashboard":
        return ["Strefa Kursanta", "Pulpit"];
      case "my-courses":
        return ["Strefa Kursanta", "Moje Szkolenia"];
      case "course-preview":
        return ["Strefa Kursanta", "Szkolenia", "Lekcja"];
      case "exams":
        return ["Strefa Kursanta", "Testy i Egzaminy"];
      case "certifications":
        return ["Strefa Kursanta", "Uprawnienia"];
      case "catalog":
        return ["Strefa Kursanta", "Katalog"];
      case "profile-view":
        return ["Strefa Kursanta", "Profil"];
      default:
        return ["Strefa Kursanta"];
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-body text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-brand-dark text-white hidden md:flex flex-col border-r border-slate-800 shadow-2xl z-30 shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80 bg-slate-950/40">
          <BrandMark onClick={onLogoClick} variant="sidebar" />
        </div>

        <nav className="flex-1 overflow-y-auto custom-sidebar-scroll px-4 py-4 space-y-3">
          <div className="space-y-1">
            {mainNavItems.map(renderNavItem)}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            {secondaryNavItems.map(renderNavItem)}
          </div>
        </nav>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>🌐</span> Strona Główna Portalu
            </span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onSectionChange("profile-view")}
              className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg hover:bg-white/10 transition-colors text-left flex-1 min-w-0 cursor-pointer group"
              title="Przejdź do profilu i edycji danych"
            >
              <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/40 text-brand-accent flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
                {userName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white leading-tight truncate group-hover:text-brand-accent transition-colors">
                  {userName}
                </span>
                <span className="text-xs text-slate-400 leading-tight mt-0.5 truncate">
                  {userRole} • Mój profil
                </span>
              </div>
            </button>

            <button
              onClick={onLogout}
              title="Wyloguj się"
              className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-brand-dark text-white flex flex-col h-full shadow-2xl z-10 border-r border-slate-800">
            <div className="h-18 flex items-center justify-between px-6 border-b border-slate-800">
              <BrandMark onClick={onLogoClick} variant="sidebar" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto custom-sidebar-scroll px-4 py-4 space-y-3">
              <div className="space-y-1">
                {mainNavItems.map(renderNavItem)}
              </div>
              <div className="pt-3 border-t border-slate-800/80 space-y-1">
                {secondaryNavItems.map(renderNavItem)}
              </div>
            </nav>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                Wyloguj z platformy
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-8 shadow-xs shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              onClick={() => setMobileOpen(true)}
              aria-label="Otwórz menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span>Platforma E-learningowa MultiSerwis Kutno</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden lg:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj lekcji..."
                className="pl-9 pr-8 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-accent focus:bg-white transition-all w-60"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotificationsMenu((prev) => !prev)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Powiadomienia"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full ring-2 ring-white"></span>
              </button>

              {showNotificationsMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Powiadomienia
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-accent font-black text-xs flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:block">
                {userName}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
          <div className="max-w-7xl mx-auto space-y-6">
            <PanelBreadcrumbs segments={getBreadcrumbs(activeSection)} />
            {children}
          </div>
          <div className="max-w-7xl mx-auto mt-12">
            <PanelFooter />
          </div>
        </main>
      </div>
    </div>
  );
};
