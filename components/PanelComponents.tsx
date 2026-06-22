import React from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

/**
 * Unified Design Components for Admin/Manager/Student/Guardian Panels
 * Ensures consistency across all panel UIs
 */

// ============================================================================
// PANEL HEADER - wspólny header dla wszystkich paneli
// ============================================================================
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

interface PanelHeaderProps {
  logo?: React.ReactNode;
  sections: { label: string; onClick: () => void }[];
  onNotifications?: () => void;
  onProfile?: () => void;
  profileEmail?: string;
  notificationCount?: number;
  notifications?: Notification[];
  variant?: "light" | "sidebar";
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  logo,
  sections,
  onNotifications,
  onProfile,
  profileEmail,
  notificationCount = 0,
  notifications = [],
  variant = "light",
}) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] =
    React.useState(false);
  const [expandedNotification, setExpandedNotification] = React.useState<
    string | null
  >(null);

  // Mock notifications if none provided
  const mockNotifications: Notification[] =
    notifications.length > 0
      ? notifications
      : [
          {
            id: "1",
            title: "Nowy kursant",
            message: 'Jan Kowalski zapisał się na szkolenie "Wózki Widłowe"',
            timestamp: "5 minut temu",
            read: false,
            type: "info",
          },
          {
            id: "2",
            title: "Szkolenie ukończone",
            message:
              'Anna Nowak ukończyła szkolenie "BHP Podstawowe" z wynikiem 95%',
            timestamp: "1 godzina temu",
            read: false,
            type: "success",
          },
          {
            id: "3",
            title: "Ceryfikat wygasa",
            message:
              'Certyfikat "Uprawnienia SEP" użytkownika Piotra Wiśniewskiego wygasa za 7 dni',
            timestamp: "3 godziny temu",
            read: true,
            type: "warning",
          },
        ];

  const notificationsToShow = mockNotifications.slice(0, 5);
  const notificationTypeStyles = {
    info: "border-l-blue-500 bg-blue-50",
    warning: "border-l-yellow-500 bg-yellow-50",
    success: "border-l-green-500 bg-green-50",
    error: "border-l-red-500 bg-red-50",
  };

  const isSidebar = variant === "sidebar";
  const headerClassName = isSidebar
    ? "sticky top-0 z-40 bg-brand-primary border-b border-brand-secondary/40 shadow-xl text-white"
    : "sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm";

  const brandClassName = isSidebar
    ? "text-xl font-heading font-bold text-white"
    : "text-xl font-heading font-bold text-brand-dark";

  const sectionButtonClassName = isSidebar
    ? "text-sm font-bold text-slate-200 hover:text-white transition-colors"
    : "text-sm font-bold text-slate-600 hover:text-brand-accent transition-colors";

  const iconButtonClassName = isSidebar
    ? "relative p-2 text-slate-200 hover:text-white transition-colors"
    : "relative p-2 text-slate-600 hover:text-brand-accent transition-colors";

  return (
    <header className={headerClassName}>
      <div className="max-w-full mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-8">
          {logo ? logo : <div className={brandClassName}>MultiSerwis</div>}
        </div>

        {/* Sekcje - ukryte na mobile */}
        <div className="hidden md:flex items-center gap-6">
          {sections.map((section, idx) => (
            <button
              key={idx}
              onClick={section.onClick}
              className={sectionButtonClassName}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Prawe opcje: Notifications + Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
              className={iconButtonClassName}
              title="Powiadomienia"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-sm shadow-xl z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 sticky top-0">
                  <p className="text-sm font-bold text-slate-700">
                    Powiadomienia ({mockNotifications.length})
                  </p>
                </div>

                {mockNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500">
                    <p className="text-sm">Brak powiadomień</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notificationsToShow.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 cursor-pointer border-l-4 transition-all hover:bg-slate-50 ${
                          notificationTypeStyles[notif.type]
                        } ${!notif.read ? "font-semibold bg-opacity-100" : "bg-opacity-50"}`}
                        onClick={() =>
                          setExpandedNotification(
                            expandedNotification === notif.id ? null : notif.id,
                          )
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">
                              {notif.title}
                            </h4>
                            <p
                              className={`text-xs mt-1 ${notif.read ? "text-slate-500" : "text-slate-600"}`}
                            >
                              {notif.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                              {notif.timestamp}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-brand-accent shrink-0 mt-1"></div>
                          )}
                        </div>

                        {expandedNotification === notif.id && (
                          <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {notif.message}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <button className="text-xs px-3 py-1 bg-brand-accent text-white rounded hover:opacity-90 transition-opacity">
                                Przeczytane
                              </button>
                              <button className="text-xs px-3 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors">
                                Zamknij
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {mockNotifications.length > 5 && (
                  <div className="px-4 py-3 border-t border-slate-100 text-center bg-slate-50 sticky bottom-0">
                    <button className="text-xs font-bold text-brand-accent hover:text-brand-dark">
                      Pokaż wszystkie powiadomienia
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={
                isSidebar
                  ? "flex items-center gap-2 p-2 text-slate-200 hover:text-white transition-colors"
                  : "flex items-center gap-2 p-2 text-slate-600 hover:text-brand-accent transition-colors"
              }
            >
              <User size={18} />
              <ChevronDown size={16} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-sm shadow-lg z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-700">
                    {profileEmail || "Profil"}
                  </p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <User size={16} /> Mój profil
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Settings size={16} /> Ustawienia
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100">
                  <LogOut size={16} /> Wyloguj
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// PANEL TABS - ustandaryzowane tabs
// ============================================================================
interface PanelTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "admin" | "client"; // admin/manager vs kursant/opiekun
}

export const PanelTabs: React.FC<PanelTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "admin",
}) => {
  // Unified brand accent for both admin/client variants
  const borderColor = "bg-brand-accent";
  const textColor = "text-brand-accent";
  const hoverTextColor = "hover:text-slate-700";

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex gap-1 px-4 md:px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-4 px-4 font-bold text-sm uppercase tracking-wider transition-colors relative ${
              activeTab === tab.id
                ? textColor
                : "text-slate-500 " + hoverTextColor
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${borderColor}`}
              ></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STAT CARD - karty statystyk
// ============================================================================
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  borderColor?: "blue" | "green" | "orange" | "red" | "purple";
  onClick?: () => void;
  trend?: { value: number; isPositive: boolean };
  variant?: "admin" | "client";
}

const borderColorMap = {
  blue: "border-l-blue-500",
  green: "border-l-green-500",
  orange: "border-l-orange-500",
  red: "border-l-red-500",
  purple: "border-l-purple-500",
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  borderColor = "blue",
  onClick,
  trend,
  variant = "admin",
}) => {
  // Unified turquoise color for all variants
  const cardStyle = "bg-white border-l-brand-accent";

  return (
    <div
      onClick={onClick}
      className={`rounded-sm shadow-sm p-6 border-l-4 transition-all ${cardStyle} ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-600 font-bold uppercase text-xs tracking-wider">
          {title}
        </h3>
        {icon && <div className="text-brand-accent">{icon}</div>}
      </div>

      <div className="mb-2">
        <div className="text-3xl font-bold text-brand-dark">{value}</div>
      </div>

      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}

      {trend && (
        <div
          className={`text-xs mt-2 font-bold ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
        >
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PANEL TABLE - ustandaryzowana tabela
// ============================================================================
interface PanelTableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  render: (row: any, rowIndex: number) => React.ReactNode;
  sortable?: boolean;
}

interface PanelTableProps {
  columns: PanelTableColumn[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: {
    label: string;
    onClick: (row: any) => void;
    icon?: React.ReactNode;
  }[];
}

export const PanelTable: React.FC<PanelTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = "Brak danych",
  actions,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-slate-500">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className={`px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 text-${col.align || "left"}`}
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-center text-xs font-bold uppercase text-slate-600">
                Akcje
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-8 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={`px-6 py-4 text-${col.align || "left"}`}
                  >
                    {col.render(row, rowIdx)}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => action.onClick(row)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// PANEL LAYOUT - wrapper layout
// ============================================================================
interface PanelLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

export const PanelLayout: React.FC<PanelLayoutProps> = ({
  header,
  children,
  sidebarContent,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {header && header}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">{children}</div>
          {sidebarContent && (
            <aside className="hidden lg:block w-64">{sidebarContent}</aside>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION HEADER - nagłówek sekcji
// ============================================================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-brand-dark mb-1">
          {title}
        </h2>
        {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white font-bold text-sm rounded-sm hover:bg-brand-accentHover transition-colors"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  );
};
