import React, { useState, useEffect } from "react";
import { ViewState, Language } from "../types";
import {
  Menu,
  X,
  Phone,
  Mail,
  GraduationCap,
  Truck,
  User,
  HardHat,
  ChevronRight,
  BarChart3,
  Globe,
  Shield,
  Building2,
} from "lucide-react";
import { TRANSLATIONS } from "../constants";
import { BrandMark } from "./BrandMark";

// Helper function for image paths (kept simple to avoid env typing issues)
const getImagePath = (filename: string) => filename;

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  setCatalogCategory: (category: string) => void;
  onShowLoginModal?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
  onShowNewPanel?: (
    panel: "admin" | "manager" | "guardian" | "student",
  ) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  setView,
  language,
  setLanguage,
  setCatalogCategory,
  onShowLoginModal,
  isLoggedIn,
  userName,
  onLogout,
  onShowNewPanel,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [trainingMenuOpen, setTrainingMenuOpen] = useState(false);
  const [newPanelsMenuOpen, setNewPanelsMenuOpen] = useState(false);

  const t = TRANSLATIONS[language].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItemClass = (view: ViewState) => `
    cursor-pointer text-sm font-bold uppercase tracking-wider transition-colors duration-300
    ${currentView === view ? "text-brand-accent" : "text-white hover:text-brand-accent"}
  `;

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-slate-800">
      {/* Top Bar - Contact Info - Added relative z-[60] for Language Switcher context */}
      <div className="bg-brand-dark text-slate-400 py-2 px-4 text-xs md:text-sm border-b border-brand-secondary/30 relative z-60">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center gap-2">
              <Phone size={14} className="text-brand-accent" /> +48 730 101 000
            </span>
            <span className="hidden items-center gap-2 md:flex">
              <Mail size={14} className="text-brand-accent" />{" "}
              biuro@multiserwis.pl
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-semibold text-brand-accent uppercase tracking-wide hidden sm:block">
              Profesjonalne Szkolenia UDT
            </div>

            {/* Desktop Language Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-white hover:text-brand-accent transition-colors font-bold"
              >
                <Globe size={14} /> {language}{" "}
                <ChevronRight
                  size={10}
                  className={`transform transition-transform ${langMenuOpen ? "rotate-90" : ""}`}
                />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-auto bg-white rounded shadow-lg border border-slate-200 py-1 z-50">
                  {(["PL", "UA", "EN"] as Language[]).map((lang) => (
                    <div
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangMenuOpen(false);
                      }}
                      className={`
                          px-4 py-2 text-xs font-bold cursor-pointer hover:bg-slate-50 hover:text-brand-accent flex items-center gap-2
                          ${language === lang ? "text-brand-accent" : "text-slate-600"}
                        `}
                    >
                      {lang}{" "}
                      {language === lang && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-brand-primary shadow-xl py-3" : "bg-brand-primary/95 backdrop-blur-sm py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo Area */}
          <BrandMark onClick={() => setView("HOME")} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Szkolenia Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setTrainingMenuOpen(true)}
              onMouseLeave={() => setTrainingMenuOpen(false)}
            >
              <span
                onClick={() => setView("CATALOG")}
                className={`${navItemClass("CATALOG")} flex items-center gap-1`}
              >
                {t.catalog}{" "}
                <ChevronRight
                  size={14}
                  className={`transform transition-transform ${trainingMenuOpen ? "rotate-90" : ""}`}
                />
              </span>

              {trainingMenuOpen && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white rounded-sm shadow-xl border border-slate-200 overflow-hidden">
                    <div
                      onClick={() => {
                        setCatalogCategory("Wszystkie");
                        setView("CATALOG");
                        setTrainingMenuOpen(false);
                      }}
                      className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <GraduationCap size={16} /> Wszystkie szkolenia
                    </div>
                    <div className="border-t border-slate-100"></div>

                    {/* New Landing Links */}
                    <div
                      onClick={() => {
                        setView("LANDING_UDT");
                        setTrainingMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors"
                    >
                      Szkolenia UDT (Wózki, Suwnice)
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_IMBIGS");
                        setTrainingMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors"
                    >
                      Szkolenia IMBiGS (Maszyny)
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_SEP");
                        setTrainingMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors"
                    >
                      Uprawnienia SEP (G1, G2, G3)
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_WELDING");
                        setTrainingMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors"
                    >
                      Spawalnictwo
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_OTHER");
                        setTrainingMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors"
                    >
                      Inne (Pilarki, Hakowy)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Harmonogram Link */}
            <span
              onClick={() => setView("SCHEDULE")}
              className={navItemClass("SCHEDULE")}
            >
              Harmonogram
            </span>

            {/* Usługi External Link */}
            <a
              href="https://multiserwis-kutno.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-sm font-bold uppercase tracking-wider transition-colors duration-300 text-white hover:text-brand-accent flex items-center gap-1"
            >
              Usługi <Truck size={14} />
            </a>

            <span
              onClick={() => setView("ABOUT")}
              className={navItemClass("ABOUT")}
            >
              O Firmie
            </span>

            <span
              onClick={() => setView("ABOUT")}
              className={navItemClass("ABOUT")}
            >
              O Firmie
            </span>

            <span
              onClick={() => setView("CONTACT")}
              className={navItemClass("CONTACT")}
            >
              {t.contact}
            </span>

            {!isLoggedIn ? (
              <button
                onClick={onShowLoginModal}
                className="px-5 py-2 rounded-sm font-bold text-sm uppercase tracking-wide transition-all bg-brand-accent text-white hover:bg-brand-accentHover shadow-lg"
              >
                <User size={16} className="inline mr-2" />
                Zaloguj
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-bold">{userName}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-wide bg-brand-accent text-white hover:bg-brand-accentHover transition-colors"
                >
                  Wyloguj
                </button>
              </div>
            )}

            {/* Nowe Panele Dropdown */}
            {onShowNewPanel && (
              <div
                className="relative group"
                onMouseEnter={() => setNewPanelsMenuOpen(true)}
                onMouseLeave={() => setNewPanelsMenuOpen(false)}
              >
                <span
                  className={`cursor-pointer text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                    currentView === "NEW_ADMIN_PANEL" ||
                    currentView === "NEW_MANAGER_PANEL" ||
                    currentView === "NEW_GUARDIAN_PANEL" ||
                    currentView === "NEW_STUDENT_PANEL" ||
                    newPanelsMenuOpen
                      ? "text-brand-accent"
                      : "text-white hover:text-brand-accent"
                  } flex items-center gap-1`}
                >
                  Nowe panele{" "}
                  <ChevronRight
                    size={14}
                    className={`transform transition-transform ${newPanelsMenuOpen ? "rotate-90" : ""}`}
                  />
                </span>
                {newPanelsMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 w-72 z-50">
                    <div className="bg-white rounded-sm shadow-xl border border-slate-200 overflow-hidden">
                      <div
                        onClick={() => {
                          onShowNewPanel("admin");
                          setNewPanelsMenuOpen(false);
                        }}
                        className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors flex items-center gap-2"
                      >
                        <Shield size={16} /> Panel administratora (nowy)
                      </div>
                      <div
                        onClick={() => {
                          onShowNewPanel("manager");
                          setNewPanelsMenuOpen(false);
                        }}
                        className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors flex items-center gap-2 border-t border-slate-100"
                      >
                        <BarChart3 size={16} /> Panel managera (nowy)
                      </div>
                      <div
                        onClick={() => {
                          onShowNewPanel("guardian");
                          setNewPanelsMenuOpen(false);
                        }}
                        className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors flex items-center gap-2 border-t border-slate-100"
                      >
                        <Building2 size={16} /> Strefa opiekuna (nowa)
                      </div>
                      <div
                        onClick={() => {
                          onShowNewPanel("student");
                          setNewPanelsMenuOpen(false);
                        }}
                        className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-brand-accent hover:text-white cursor-pointer transition-colors flex items-center gap-2 border-t border-slate-100"
                      >
                        <GraduationCap size={16} /> Strefa kursanta (nowa)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-brand-primary border-t border-brand-secondary/50 shadow-2xl">
            <div className="flex flex-col p-4 space-y-4">
              {/* Szkolenia Mobile */}
              <div className="border-b border-brand-secondary/30">
                <div
                  onClick={() => setTrainingMenuOpen(!trainingMenuOpen)}
                  className="text-white font-bold py-2 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={16} /> {t.catalog}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`transform transition-transform ${trainingMenuOpen ? "rotate-90" : ""}`}
                  />
                </div>
                {trainingMenuOpen && (
                  <div className="pl-6 py-2 space-y-2">
                    <div
                      onClick={() => {
                        setCatalogCategory("Wszystkie");
                        setView("CATALOG");
                        setMobileMenuOpen(false);
                      }}
                      className="text-slate-300 text-sm py-1"
                    >
                      Wszystkie szkolenia
                    </div>
                    {/* New Landing Links Mobile */}
                    <div
                      onClick={() => {
                        setView("LANDING_UDT");
                        setMobileMenuOpen(false);
                      }}
                      className="text-slate-300 text-sm py-1"
                    >
                      Szkolenia UDT
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_IMBIGS");
                        setMobileMenuOpen(false);
                      }}
                      className="text-slate-300 text-sm py-1"
                    >
                      Szkolenia IMBiGS
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_SEP");
                        setMobileMenuOpen(false);
                      }}
                      className="text-slate-300 text-sm py-1"
                    >
                      Uprawnienia SEP
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_WELDING");
                        setMobileMenuOpen(false);
                      }}
                      className="text-slate-300 text-sm py-1"
                    >
                      Spawalnictwo
                    </div>
                    <div
                      onClick={() => {
                        setView("LANDING_OTHER");
                        setMobileMenuOpen(false);
                      }}
                      className="text-slate-300 text-sm py-1"
                    >
                      Inne
                    </div>
                  </div>
                )}
              </div>

              {/* Harmonogram Mobile */}
              <div
                onClick={() => {
                  setView("CATALOG");
                  setMobileMenuOpen(false);
                }}
                className="text-white font-bold py-2 border-b border-brand-secondary/30 cursor-pointer"
              >
                Harmonogram
              </div>

              {/* Usługi Mobile External */}
              <a
                href="https://multiserwis-kutno.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold py-2 border-b border-brand-secondary/30 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Truck size={16} /> Usługi
                </span>
              </a>

              <span
                onClick={() => {
                  setView("CONTACT");
                  setMobileMenuOpen(false);
                }}
                className="text-white font-bold py-2 border-b border-brand-secondary/30"
              >
                {t.contact}
              </span>

              {/* Login/Logout Mobile */}
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    onShowLoginModal?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white font-bold py-2 border-b border-brand-secondary/30 flex items-center gap-2 bg-brand-accent px-4 rounded"
                >
                  <User size={16} /> Zaloguj
                </button>
              ) : (
                <div className="flex items-center justify-between border-b border-brand-secondary/30 pb-2">
                  <span className="text-white text-sm font-bold">
                    {userName}
                  </span>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-sm font-bold text-xs uppercase bg-brand-accent text-white hover:bg-brand-accentHover"
                  >
                    Wyloguj
                  </button>
                </div>
              )}

              {/* Nowe Panele Mobile */}
              {onShowNewPanel && (
                <div className="border-b border-brand-secondary/30">
                  <div
                    onClick={() => setNewPanelsMenuOpen(!newPanelsMenuOpen)}
                    className="text-white font-bold py-2 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Shield size={16} /> Nowe panele
                    </span>
                    <ChevronRight
                      size={16}
                      className={`transform transition-transform ${newPanelsMenuOpen ? "rotate-90" : ""}`}
                    />
                  </div>
                  {newPanelsMenuOpen && (
                    <div className="pl-6 py-2 space-y-2">
                      <div
                        onClick={() => {
                          onShowNewPanel("admin");
                          setMobileMenuOpen(false);
                          setNewPanelsMenuOpen(false);
                        }}
                        className="text-slate-300 text-sm py-1 flex items-center gap-2"
                      >
                        <Shield size={14} /> Panel administratora (nowy)
                      </div>
                      <div
                        onClick={() => {
                          onShowNewPanel("manager");
                          setMobileMenuOpen(false);
                          setNewPanelsMenuOpen(false);
                        }}
                        className="text-slate-300 text-sm py-1 flex items-center gap-2"
                      >
                        <BarChart3 size={14} /> Panel managera (nowy)
                      </div>
                      <div
                        onClick={() => {
                          onShowNewPanel("guardian");
                          setMobileMenuOpen(false);
                          setNewPanelsMenuOpen(false);
                        }}
                        className="text-slate-300 text-sm py-1 flex items-center gap-2"
                      >
                        <Building2 size={14} /> Strefa opiekuna (nowa)
                      </div>
                      <div
                        onClick={() => {
                          onShowNewPanel("student");
                          setMobileMenuOpen(false);
                          setNewPanelsMenuOpen(false);
                        }}
                        className="text-slate-300 text-sm py-1 flex items-center gap-2"
                      >
                        <GraduationCap size={14} /> Strefa kursanta (nowa)
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Language Switcher */}
              <div className="flex gap-4 pt-2 justify-center">
                {(["PL", "UA", "EN"] as Language[]).map((lang) => (
                  <span
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`text-sm font-bold p-2 rounded ${language === lang ? "bg-brand-accent text-white" : "text-slate-400 bg-brand-dark/30"}`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="grow">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-16 pb-8 border-t-4 border-brand-accent">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col mb-6">
              <span className="text-2xl font-heading font-extrabold text-white leading-none tracking-tight">
                MULTI<span className="text-brand-accent">SERWIS</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Lider szkoleń zawodowych i wynajmu maszyn budowlanych. Dostarczamy
              najwyższą jakość usług, certyfikowane szkolenia UDT oraz
              niezawodny sprzęt.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 bg-brand-secondary/50 rounded flex items-center justify-center hover:bg-brand-accent transition-colors cursor-pointer">
                F
              </div>
              <div className="w-8 h-8 bg-brand-secondary/50 rounded flex items-center justify-center hover:bg-brand-accent transition-colors cursor-pointer">
                I
              </div>
              <div className="w-8 h-8 bg-brand-secondary/50 rounded flex items-center justify-center hover:bg-brand-accent transition-colors cursor-pointer">
                L
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-accent block"></span> Usługi
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="hover:text-brand-accent cursor-pointer transition-colors">
                Szkolenia UDT
              </li>
              <li className="hover:text-brand-accent cursor-pointer transition-colors">
                Wynajem Ładowarek
              </li>
              <li className="hover:text-brand-accent cursor-pointer transition-colors">
                Serwis Maszyn
              </li>
              <li className="hover:text-brand-accent cursor-pointer transition-colors">
                Uprawnienia SEP
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-accent block"></span> Kontakt
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="mt-1">
                  <Phone size={14} className="text-brand-accent" />
                </div>
                <div>
                  +48 730 101 000
                  <br />
                  <span className="text-xs text-slate-500">
                    Pn-Pt 8:00 - 16:00
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-brand-accent" />{" "}
                biuro@multiserwis.pl
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1">📍</div>
                <div>
                  ul. Siemieradzkiego 18
                  <br />
                  99-300 Kutno
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-accent block"></span>{" "}
              Certyfikaty
            </h4>
            <div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold mb-1 tracking-widest text-slate-200">
                ISO 9001
              </div>
              <div className="text-[10px] uppercase text-slate-500">
                System Zarządzania Jakością
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-brand-secondary/30 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; 2026 MultiSerwis. Wszelkie prawa zastrzeżone.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span
              onClick={() => setView("PRIVACY")}
              className="hover:text-white cursor-pointer"
            >
              Polityka Prywatności
            </span>
            <span
              onClick={() => setView("TERMS")}
              className="hover:text-white cursor-pointer"
            >
              Regulamin
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
