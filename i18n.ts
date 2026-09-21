import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Base URL for resolving static assets and locales
const baseUrl = import.meta.env.BASE_URL || "/";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "PL",
    supportedLngs: ["PL", "EN", "UA"],
    
    backend: {
      loadPath: (lngs: string[]) => {
        const lng = (lngs[0] || "pl").toLowerCase();
        return `${baseUrl}locales/${lng}/translation.json`;
      },
      parse: (data: string) => {
        try {
          return JSON.parse(data);
        } catch {
          return {};
        }
      },
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false, // React already safe from XSS
    },

    react: {
      useSuspense: false, // Prevents loading flashes by defaulting to fallback translation keys
    },
  });

// Handle custom map for lowercase lang codes (e.g. from browser) to uppercase app state
i18n.on("languageChanged", (lng) => {
  const upper = (lng || "").toUpperCase();
  if (lng !== upper && (upper === "PL" || upper === "EN" || upper === "UA")) {
    i18n.changeLanguage(upper);
  }
});

export default i18n;
