import { COURSES, MACHINES, type Course, type Machine } from "@multiserwis/shared";

export interface SiteSettings {
  companyName: string;
  nip: string;
  krs: string;
  regon: string;
  addressBiuro: string;
  addressPoligon: string;
  phoneTraining: string;
  phoneTrainingAlt: string;
  phoneRental: string;
  email: string;
  facebookUrl: string;
  openingHours: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "MULTISERWIS KUTNO Sp. z o.o.",
  nip: "7752676330",
  krs: "0001160280",
  regon: "541108550",
  addressBiuro: "ul. Henryka Siemiradzkiego 18, 99-300 Kutno",
  addressPoligon: "ul. Przemysłowa 2, 99-300 Kutno",
  phoneTraining: "+48 730 101 000",
  phoneTrainingAlt: "+48 570 403 806",
  phoneRental: "+48 730 202 000",
  email: "szkolenia@multiserwis.tech",
  facebookUrl: "https://www.facebook.com/szkoleniaKutno/",
  openingHours: "Pon.–Pt. 8:00–16:00",
};

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  const envUrl = import.meta.env?.PUBLIC_API_URL;
  return typeof envUrl === "string" && envUrl.trim() !== ""
    ? envUrl.replace(/\/+$/, "")
    : "https://panel.multiserwis.edu.pl";
}

export async function fetchCourses(): Promise<Course[]> {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/courses`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return COURSES;
    const payload = await res.json();
    const list: Course[] | null = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
      ? payload.data
      : null;
    if (!list) return COURSES;

    const staticMap = new Map<string, Course>();
    for (const staticCourse of COURSES) {
      staticMap.set(staticCourse.id, staticCourse);
    }

    return list.map((apiCourse) => {
      const existing = staticMap.get(apiCourse.id);
      return {
        ...existing,
        ...apiCourse,
        slug: apiCourse.slug || existing?.slug,
      };
    });
  } catch {
    return COURSES;
  }
}

export async function fetchMachines(): Promise<Machine[]> {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/machines`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return MACHINES;
    const payload = await res.json();
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : null;
    return list !== null ? list : MACHINES;
  } catch {
    return MACHINES;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/settings`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return DEFAULT_SITE_SETTINGS;
    const payload = await res.json();
    if (payload && typeof payload === "object" && payload.companyName) {
      return { ...DEFAULT_SITE_SETTINGS, ...payload };
    }
    return DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
