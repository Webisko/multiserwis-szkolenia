import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Dynamically resolve base URL for GitHub Pages
const baseUrl = import.meta.env.BASE_URL || "/";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "PL",
    supportedLngs: ["PL", "EN", "UA"],
    
    // Convert uppercase languages from state to lowercase for file request structure
    backend: {
      loadPath: `${baseUrl}locales/{{lng}}/translation.json`,
      parse: (data: string) => JSON.parse(data),
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

// Handle custom map for uppercase lang codes to lowercase requests
i18n.on("languageChanged", (lng) => {
  const normalized = lng.toLowerCase();
  if (normalized !== lng) {
    // If browser returned lowercase "pl", normalize it to upper
    const upper = lng.toUpperCase();
    if (upper === "PL" || upper === "EN" || upper === "UA") {
      i18n.changeLanguage(upper);
    }
  }
});

export default i18n;
