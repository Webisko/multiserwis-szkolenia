import React, { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { BrandMark } from "../BrandMark";
import { PanelFooter } from "../panel/PanelFooter";
import { PanelBreadcrumbs } from "../panel/PanelBreadcrumbs";

export type AdminSectionId =
  | "dashboard"
  | "courses"
  | "course-preview"
  | "course-create"
  | "course-edit"
  | "users"
  | "user-view"
  | "user-edit"
  | "user-create"
  | "companies"
  | "company-view"
  | "company-create"
  | "company-edit"
  | "finance"
  | "reports"
  | "notifications"
  | "settings"
  | "permissions";

interface AdminPanelLayoutProps {
  activeSection: AdminSectionId;
  onSectionChange: (section: AdminSectionId) => void;
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

const mainNavItems: {
  id: AdminSectionId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  { id: "dashboard", label: "Pulpit Główny", icon: <LayoutDashboard size={18} /> },
  { id: "courses", label: "Katalog Szkoleń", icon: <GraduationCap size={18} />, badge: "8" },
  { id: "users", label: "Kursanci i Personel", icon: <Users size={18} /> },
  { id: "companies", label: "Klienci Biznesowi (B2B)", icon: <Building2 size={18} /> },
];

const operationsNavItems: {
  id: AdminSectionId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "finance", label: "Płatności i Faktury", icon: <CreditCard size={18} /> },
  { id: "reports", label: "Raporty i Egzaminy", icon: <BarChart3 size={18} /> },
  { id: "notifications", label: "Centrum Alertów", icon: <Bell size={18} /> },
];

const systemNavItems: {
  id: AdminSectionId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "permissions", label: "Uprawnienia Ról", icon: <ShieldCheck size={18} /> },
  { id: "settings", label: "Ustawienia Portalu", icon: <Settings size={18} /> },
];

export const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
  userName = "Administrator",
  userRole = "Superadministrator",
  onLogout,
  onLogoClick,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: "n1",
      title: "Nowe zgłoszenie na wózki II WJO",
      time: "5 min temu",
      type: "users",
    },
    {
      id: "n2",
      title: "Opłacono kurs: SEP G1 (Faktura #2026/04)",
      time: "18 min temu",
      type: "sales",
    },
    {
      id: "n3",
      title: "Termin egzaminu UDT potwierdzony na 14.04",
      time: "1 godz. temu",
      type: "system",
    },
    {
      id: "n4",
      title: "Firma 'Agro-Kutno' dodała 4 uczestników",
      time: "3 godz. temu",
      type: "company",
    },
  ];

  const unreadCount = 2;

  const isItemActive = (id: AdminSectionId) => {
    if (activeSection === id) return true;
    if (id === "courses" && ["course-edit", "course-create", "course-preview"].includes(activeSection)) return true;
    if (id === "users" && ["user-view", "user-edit", "user-create"].includes(activeSection)) return true;
    if (id === "companies" && ["company-view", "company-edit", "company-create"].includes(activeSection)) return true;
    return false;
  };

  const renderNavItem = (item: {
    id: AdminSectionId;
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
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
              active
                ? "bg-white/25 text-white"
                : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const getBreadcrumbs = (section: AdminSectionId): string[] => {
    switch (section) {
      case "dashboard":
        return ["Pulpit"];
      case "courses":
        return ["Pulpit", "Szkolenia"];
      case "course-preview":
        return ["Pulpit", "Szkolenia", "Podgląd"];
      case "course-create":
        return ["Pulpit", "Szkolenia", "Nowe Szkolenie"];
      case "course-edit":
        return ["Pulpit", "Szkolenia", "Edycja"];
      case "users":
        return ["Pulpit", "Kursanci i Personel"];
      case "user-view":
        return ["Pulpit", "Użytkownicy", "Szczegóły"];
      case "user-edit":
        return ["Pulpit", "Użytkownicy", "Edycja"];
      case "user-create":
        return ["Pulpit", "Użytkownicy", "Nowy Użytkownik"];
      case "companies":
        return ["Pulpit", "Firmy B2B"];
      case "company-view":
        return ["Pulpit", "Firmy", "Szczegóły"];
      case "company-create":
        return ["Pulpit", "Firmy", "Rejestracja Firmy"];
      case "company-edit":
        return ["Pulpit", "Firmy", "Edycja"];
      case "finance":
        return ["Pulpit", "Finanse i Rozliczenia"];
      case "reports":
        return ["Pulpit", "Raporty i Egzaminy"];
      case "notifications":
        return ["Pulpit", "Centrum Powiadomień"];
      case "settings":
        return ["Pulpit", "Konfiguracja Systemu"];
      case "permissions":
        return ["Pulpit", "Zarządzanie Rolami"];
      default:
        return ["Pulpit"];
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-body text-slate-800">
      {/* Desktop Sidebar (Clean, bold Dark Slate #002a36) */}
      <aside className="w-72 bg-brand-dark text-white hidden md:flex flex-col border-r border-slate-800 shadow-2xl z-30 shrink-0">
        {/* Brand Header - Clean without blinking dots */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80 bg-slate-950/40">
          <BrandMark onClick={onLogoClick} variant="sidebar" />
        </div>

        {/* Nav Links - Clean without redundant section headers */}
        <nav className="flex-1 overflow-y-auto custom-sidebar-scroll px-4 py-4 space-y-3">
          <div className="space-y-1">
            {mainNavItems.map(renderNavItem)}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            {operationsNavItems.map(renderNavItem)}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            {systemNavItems.map(renderNavItem)}
          </div>
        </nav>

        {/* Sidebar Footer: User Card & Quick Links */}
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
              onClick={() => onSectionChange("settings")}
              className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg hover:bg-white/10 transition-colors text-left flex-1 min-w-0 cursor-pointer group"
              title="Przejdź do profilu i ustawień konta"
            >
              <div className="w-9 h-9 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-accent flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
                {userName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white leading-tight truncate group-hover:text-brand-accent transition-colors">
                  {userName}
                </span>
                <span className="text-xs text-slate-400 leading-tight mt-0.5 truncate">
                  {userRole} • Edytuj
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
                {operationsNavItems.map(renderNavItem)}
              </div>
              <div className="pt-3 border-t border-slate-800/80 space-y-1">
                {systemNavItems.map(renderNavItem)}
              </div>
            </nav>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                Wyloguj z panelu
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-8 shadow-xs shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              onClick={() => setMobileOpen(true)}
              aria-label="Otwórz menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-slate-400">Panel</span>
              {getBreadcrumbs(activeSection).map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={13} className="text-slate-300" />
                  <span className={idx === getBreadcrumbs(activeSection).length - 1 ? "text-slate-900 font-bold" : "text-slate-500"}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Search */}
            <div className="relative hidden lg:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj (kurs, kursant, NIP)..."
                className="pl-9 pr-8 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-accent focus:bg-white transition-all w-60"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded-sm">
                ⌘K
              </span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsMenu((prev) => !prev)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Powiadomienia"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotificationsMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Najnowsze Powiadomienia
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {unreadCount} nowe
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-brand-accent flex items-center justify-center shrink-0 text-xs">
                          ●
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 leading-snug">{n.title}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        onSectionChange("notifications");
                        setShowNotificationsMenu(false);
                      }}
                      className="text-xs font-bold text-brand-accent hover:underline"
                    >
                      Przejdź do wszystkich powiadomień →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Quick Public Portal Shortcut */}
            <a
              href="/panel/kursant"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <span>🎓</span>
              <span>Strefa Kursanta</span>
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
          <div className="max-w-7xl mx-auto space-y-6">
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
