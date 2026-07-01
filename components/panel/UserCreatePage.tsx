import React from "react";
import type { Course } from "../../types";
import type { Student } from "../../types";
import { userValidationSchema } from "../../lib/validation";
import { toast } from "sonner";

type CreateUserPayload = {
  email: string;
  name: string;
  company: string;
  courseId: string;
  phone?: string;
  address?: string;
  idNumber?: string;
  pesel?: string;
  avatarUrl?: string;
  __rowNumber?: number;
};

type CreateOneResult = { ok: true } | { ok: false; error: string };

type CreateBulkResult =
  | {
      ok: true;
      created: number;
      skipped: Array<{ row: number; email?: string; reason: string }>;
    }
  | { ok: false; error: string };

interface UserCreatePageProps {
  title: string;
  subtitle: string;
  courses: Course[];
  students: Student[];
  forcedCompany?: string;
  onBack: () => void;
  onCreateUser: (
    payload: CreateUserPayload,
  ) => CreateOneResult | Promise<CreateOneResult>;
  onCreateUsersBulk: (payloads: CreateUserPayload[]) => CreateBulkResult;
}

const selectClassName =
  "w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white appearance-none pr-10 text-sm";

const NEW_COMPANY_VALUE = "__new_company__";

const normalizeHeader = (h: string) => {
  return h
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_]/g, "")
    .replace(
      /[ąćęłńóśżź]/g,
      (m) =>
        (
          ({
            ą: "a",
            ć: "c",
            ę: "e",
            ł: "l",
            ó: "o",
            ś: "s",
            ż: "z",
            ź: "z",
          }) as Record<string, string>
        )[m] || m,
    );
};

const detectDelimiter = (line: string) => {
  let inQuotes = false;
  let commas = 0;
  let semis = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    }
    if (!inQuotes) {
      if (ch === ",") commas++;
      if (ch === ";") semis++;
    }
  }
  return semis >= commas ? ";" : ",";
};

const parseCsv = (text: string, delimiter: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    while (row.length && row[row.length - 1] === "") row.pop();
    const isEmpty = row.every((c) => !c.trim());
    if (!isEmpty) rows.push(row.map((c) => c.trim()));
    row = [];
  };

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (ch === '"') {
      if (inQuotes && normalized[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && ch === delimiter) {
      pushField();
      continue;
    }
    if (!inQuotes && ch === "\n") {
      pushField();
      pushRow();
      continue;
    }
    field += ch;
  }
  pushField();
  pushRow();
  return rows;
};

const normalizePhone = (value: string) => {
  const raw = (value || "").trim();
  if (!raw) return undefined;
  const compact = raw.replace(/\s+/g, "");
  if (compact.startsWith("+48")) return compact.slice(3) || undefined;
  if (compact.startsWith("0048")) return compact.slice(4) || undefined;
  if (/^48\d{9}$/.test(compact)) return compact.slice(2);
  return compact;
};

export const UserCreatePage: React.FC<UserCreatePageProps> = ({
  title,
  subtitle,
  courses,
  students,
  forcedCompany,
  onBack,
  onCreateUser,
  onCreateUsersBulk,
}) => {
  const [mode, setMode] = React.useState<"single" | "csv">("single");
  const [importSummary, setImportSummary] = React.useState<null | {
    created: number;
    createdUsers: Array<{ name: string; email: string; courseTitle: string }>;
    skipped: Array<{ row: number; email?: string; reason: string }>;
  }>(null);

  const [error, setError] = React.useState<string | null>(null);

  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [company, setCompany] = React.useState(forcedCompany || "Indywidualny");
  const [companyMode, setCompanyMode] = React.useState<"existing" | "new">(
    "existing",
  );
  const [newCompanyName, setNewCompanyName] = React.useState("");
  const [courseId, setCourseId] = React.useState(courses[0]?.id || "c1");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [idNumber, setIdNumber] = React.useState("");
  const [pesel, setPesel] = React.useState("");

  const [bulkText, setBulkText] = React.useState("");
  const [bulkCourseId, setBulkCourseId] = React.useState(
    courses[0]?.id || "c1",
  );

  const courseTitleById = React.useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => map.set(c.id, c.title));
    return map;
  }, [courses]);

  const createdLabel = React.useMemo(() => {
    const t = title.toLowerCase();
    if (t.includes("pracownik")) return "Dodani pracownicy";
    return "Dodane osoby";
  }, [title]);

  React.useEffect(() => {
    setCompany(forcedCompany || "Indywidualny");
    setCompanyMode("existing");
    setNewCompanyName("");
  }, [forcedCompany]);

  const companyOptions = React.useMemo(() => {
    const fromData = Array.from(
      new Set(students.map((s) => (s.company || "Indywidualny").trim())),
    );
    const merged = [
      "Indywidualny",
      ...fromData.filter((c) => c && c !== "Indywidualny"),
    ];
    return Array.from(new Set(merged));
  }, [students]);

  const effectiveCompany = (
    forcedCompany || (companyMode === "new" ? newCompanyName : company)
  ).trim();

  const existingEmails = React.useMemo(() => {
    return new Set(
      students.map((s) => (s.email || "").trim().toLowerCase()).filter(Boolean),
    );
  }, [students]);

  const fullName = `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");

  const canCreateOne = (() => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return false;
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) return false;
    if (!firstName.trim()) return false;
    if (!lastName.trim()) return false;
    if (!courseId) return false;
    if (!forcedCompany && !effectiveCompany) return false;
    if (existingEmails.has(normalizedEmail)) return false;
    return true;
  })();

  const downloadCsvTemplate = () => {
    const content =
      "imie;nazwisko;email;nr tel;adres;nr dowodu osobistego;nr pesel\n" +
      "Jan;Kowalski;jan.kowalski@firma.pl;600000000;ul. Przykladowa 1, 99-300 Kutno;ABC123456;90010112345\n" +
      "Anna;Nowak;anna.nowak@firma.pl;;;;\n";

    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-pracownicy.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const parseBulkPayloads = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed)
      return { ok: false as const, error: "Wklej lub wczytaj dane CSV." };

    const firstLine = trimmed.split(/\r?\n/).find((l) => l.trim());
    if (!firstLine) return { ok: false as const, error: "Brak danych CSV." };

    const delimiter = detectDelimiter(firstLine);
    const rows = parseCsv(trimmed, delimiter);
    if (rows.length < 2)
      return {
        ok: false as const,
        error: "CSV musi zawierać nagłówek i co najmniej 1 wiersz danych.",
      };

    const header = rows[0].map(normalizeHeader);
    const idx = (names: string[]) => {
      for (const name of names) {
        const i = header.indexOf(normalizeHeader(name));
        if (i >= 0) return i;
      }
      return -1;
    };

    const firstNameIdx = idx(["imie", "firstname", "first name"]);
    const lastNameIdx = idx(["nazwisko", "lastname", "last name"]);
    const emailIdx = idx(["email", "e-mail", "mail"]);
    const phoneIdx = idx(["nrtel", "nr tel", "nr_tel", "telefon", "phone"]);
    const addressIdx = idx(["adres", "address"]);
    const idNumberIdx = idx([
      "nrdowoduosobistego",
      "nr dowodu osobistego",
      "nr_dowodu_osobistego",
      "idnumber",
      "dowod",
      "nrdowodu",
    ]);
    const peselIdx = idx(["nrpesel", "nr pesel", "nr_pesel", "pesel"]);

    if (emailIdx < 0 || firstNameIdx < 0 || lastNameIdx < 0) {
      return {
        ok: false as const,
        error: "Brakuje wymaganych kolumn: imie, nazwisko oraz email.",
      };
    }

    if (!forcedCompany && !effectiveCompany) {
      return {
        ok: false as const,
        error: "Wybierz firmę dla importu (lub dodaj nową).",
      };
    }

    const payloads: CreateUserPayload[] = [];
    const parseErrors: Array<{ row: number; email?: string; reason: string }> =
      [];

    rows.slice(1).forEach((r, i) => {
      const rowNumber = i + 2;
      const rowEmail = (r[emailIdx] || "").trim();
      const rowFirstName = (r[firstNameIdx] || "").trim();
      const rowLastName = (r[lastNameIdx] || "").trim();

      const combinedName = `${rowFirstName} ${rowLastName}`.trim();

      if (!rowEmail) {
        parseErrors.push({ row: rowNumber, reason: "Brak emaila." });
        return;
      }
      if (!/\S+@\S+\.\S+/.test(rowEmail)) {
        parseErrors.push({
          row: rowNumber,
          email: rowEmail,
          reason: "Niepoprawny email.",
        });
        return;
      }
      if (!rowFirstName || !rowLastName) {
        parseErrors.push({
          row: rowNumber,
          email: rowEmail,
          reason: "Brak danych: imię lub nazwisko.",
        });
        return;
      }

      payloads.push({
        email: rowEmail,
        name: combinedName,
        company: effectiveCompany || "Indywidualny",
        courseId: bulkCourseId,
        phone: phoneIdx >= 0 ? normalizePhone(r[phoneIdx] || "") : undefined,
        address:
          addressIdx >= 0
            ? (r[addressIdx] || "").trim() || undefined
            : undefined,
        idNumber:
          idNumberIdx >= 0
            ? (r[idNumberIdx] || "").trim() || undefined
            : undefined,
        pesel:
          peselIdx >= 0 ? (r[peselIdx] || "").trim() || undefined : undefined,
        avatarUrl: undefined,
        __rowNumber: rowNumber,
      });
    });

    if (!payloads.length) {
      const sample = parseErrors[0]
        ? `Przykład: wiersz ${parseErrors[0].row} – ${parseErrors[0].reason}`
        : "";
      return {
        ok: false as const,
        error: `Nie znaleziono poprawnych rekordów. ${sample}`.trim(),
      };
    }

    return { ok: true as const, payloads, parseErrors };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <button
          className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold"
          onClick={onBack}
        >
          Wróć
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${
              mode === "single"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => {
              setError(null);
              setImportSummary(null);
              setMode("single");
            }}
          >
            Pojedynczo
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${
              mode === "csv"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => {
              setError(null);
              setImportSummary(null);
              setMode("csv");
            }}
          >
            Import CSV (wiele osób)
          </button>
        </div>

        {mode === "csv" && importSummary && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Podsumowanie importu
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-green-800">
                      Dodano
                    </div>
                    <div className="mt-1 text-2xl font-bold text-green-900 leading-none">
                      {importSummary.created}
                    </div>
                    <div className="mt-1 text-xs text-green-800">
                      Nowe rekordy w systemie
                    </div>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Pominięto
                    </div>
                    <div className="mt-1 text-2xl font-bold text-amber-900 leading-none">
                      {importSummary.skipped.length}
                    </div>
                    <div className="mt-1 text-xs text-amber-800">
                      Np. duplikaty lub błędy danych
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                  onClick={() => {
                    setImportSummary(null);
                  }}
                >
                  Ukryj podsumowanie
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-semibold text-white shadow transition bg-brand-accent hover:bg-brand-accentHover"
                  onClick={onBack}
                >
                  Wróć do listy
                </button>
              </div>
            </div>

            {importSummary.skipped.length > 0 && (
              <details className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                  Pokaż pominięte wiersze ({importSummary.skipped.length})
                </summary>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-2 pr-3">Wiersz</th>
                        <th className="py-2 pr-3">Email</th>
                        <th className="py-2">Powód</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importSummary.skipped
                        .slice()
                        .sort((a, b) => a.row - b.row)
                        .map((s, idx) => (
                          <tr
                            key={`${s.row}-${s.email || ""}-${idx}`}
                            className="border-t border-slate-100"
                          >
                            <td className="py-2 pr-3 font-semibold text-slate-700">
                              {s.row}
                            </td>
                            <td className="py-2 pr-3 text-slate-700">
                              {s.email || "—"}
                            </td>
                            <td className="py-2 text-slate-700">{s.reason}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}

            {importSummary.createdUsers.length > 0 && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-slate-900">
                  {createdLabel}{" "}
                  <span className="text-slate-500 font-semibold">
                    ({importSummary.createdUsers.length})
                  </span>
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-2 pr-3">Imię i nazwisko</th>
                        <th className="py-2 pr-3">Email</th>
                        <th className="py-2">Szkolenie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importSummary.createdUsers.map((u, idx) => (
                        <tr
                          key={`${u.email}-${idx}`}
                          className="border-t border-slate-100"
                        >
                          <td className="py-2 pr-3 font-semibold text-slate-800">
                            {u.name}
                          </td>
                          <td className="py-2 pr-3 text-slate-700">
                            {u.email}
                          </td>
                          <td className="py-2 text-slate-700">
                            {u.courseTitle}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "csv" ? (
          <div className="mt-6 space-y-4">
            <details className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <summary className="cursor-pointer font-semibold">
                Jak przygotować plik CSV?
              </summary>
              <div className="mt-3 space-y-2 leading-relaxed">
                <div>
                  Kolumny wymagane: <span className="font-semibold">imie</span>,{" "}
                  <span className="font-semibold">nazwisko</span>,{" "}
                  <span className="font-semibold">email</span>. Opcjonalnie: nr
                  tel, adres, nr dowodu osobistego, nr pesel.
                </div>
                <div>
                  Nagłówki mogą zawierać spacje lub podkreślenia (np.{" "}
                  <span className="font-semibold">nr tel</span> albo{" "}
                  <span className="font-semibold">nr_tel</span>).
                </div>
                <div>
                  Format adresu:{" "}
                  <span className="font-semibold">
                    ul. Przykładowa 1, 99-300 Kutno
                  </span>
                  . Telefon bez prefiksu{" "}
                  <span className="font-semibold">+48</span>
                  (jeśli wkleisz +48, importer go usunie).
                </div>
                <div>
                  Jeśli Excel/LibreOffice pokazuje okno „Potwierdź format pliku”
                  przy zapisie — to normalne. Wybierz zapis jako{" "}
                  <span className="font-semibold">Tekst CSV</span>.
                </div>
              </div>
            </details>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Szkolenie (dla całej importowanej listy)
                </label>
                <div className="relative">
                  <select
                    className={selectClassName}
                    value={bulkCourseId}
                    onChange={(e) => setBulkCourseId(e.target.value)}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ▾
                  </div>
                </div>
              </div>

              {!forcedCompany && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Firma (dla całej importowanej listy)
                  </label>
                  <div className="relative">
                    <select
                      className={selectClassName}
                      value={
                        companyMode === "new" ? NEW_COMPANY_VALUE : company
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === NEW_COMPANY_VALUE) {
                          setCompanyMode("new");
                          setNewCompanyName("");
                          setCompany("");
                          return;
                        }
                        setCompanyMode("existing");
                        setNewCompanyName("");
                        setCompany(value);
                      }}
                    >
                      {companyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      <option value={NEW_COMPANY_VALUE}>
                        + Dodaj nową firmę…
                      </option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ▾
                    </div>
                  </div>
                  {companyMode === "new" && (
                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Nazwa nowej firmy
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="np. ABC Transport Sp. z o.o."
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-end gap-2">
                <button
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                  onClick={downloadCsvTemplate}
                >
                  Pobierz szablon CSV
                </button>
                <label className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold cursor-pointer">
                  Wczytaj plik CSV
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setBulkText(String(reader.result || ""));
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Dane CSV
              </label>
              <textarea
                className="w-full h-56 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono text-xs"
                value={bulkText}
                onChange={(e) => {
                  setBulkText(e.target.value);
                  setImportSummary(null);
                }}
                placeholder="imie;nazwisko;email;nr tel;adres;nr dowodu osobistego;nr pesel\nJan;Kowalski;jan@firma.pl;600000000;ul. Przykladowa 1, 99-300 Kutno;ABC123456;90010112345"
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white shadow transition bg-brand-accent hover:bg-brand-accentHover"
                onClick={() => {
                  setError(null);
                  setImportSummary(null);

                  const parsed = parseBulkPayloads(bulkText);
                  if (!parsed.ok) {
                    setError(parsed.error);
                    return;
                  }

                  const result = onCreateUsersBulk(parsed.payloads);
                  if (result.ok === false) {
                    setError(result.error);
                    return;
                  }

                  const skippedEmails = new Set(
                    result.skipped
                      .map((s) => (s.email || "").trim().toLowerCase())
                      .filter(Boolean),
                  );

                  const createdUsers = parsed.payloads
                    .filter(
                      (p) => !skippedEmails.has(p.email.trim().toLowerCase()),
                    )
                    .map((p) => ({
                      name: p.name,
                      email: p.email,
                      courseTitle:
                        courseTitleById.get(p.courseId) || p.courseId,
                    }));

                  const combinedSkipped = [
                    ...parsed.parseErrors,
                    ...result.skipped,
                  ];
                  setImportSummary({
                    created: result.created,
                    createdUsers,
                    skipped: combinedSkipped,
                  });
                }}
              >
                Importuj
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Imię
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jan"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nazwisko
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  E-mail
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan@firma.pl"
                />
                {email.trim() &&
                  existingEmails.has(email.trim().toLowerCase()) && (
                    <div className="text-xs text-red-600 mt-2">
                      Użytkownik o takim emailu już istnieje.
                    </div>
                  )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Telefon
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="600000000"
                />
              </div>

              {!forcedCompany && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Firma
                  </label>
                  <div className="relative">
                    <select
                      className={selectClassName}
                      value={
                        companyMode === "new" ? NEW_COMPANY_VALUE : company
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === NEW_COMPANY_VALUE) {
                          setCompanyMode("new");
                          setNewCompanyName("");
                          setCompany("");
                          return;
                        }
                        setCompanyMode("existing");
                        setNewCompanyName("");
                        setCompany(value);
                      }}
                    >
                      {companyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      <option value={NEW_COMPANY_VALUE}>
                        + Dodaj nową firmę…
                      </option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ▾
                    </div>
                  </div>
                  {companyMode === "new" && (
                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Nazwa nowej firmy
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="np. ABC Transport Sp. z o.o."
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Szkolenie
                </label>
                <div className="relative">
                  <select
                    className={selectClassName}
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ▾
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Adres
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ul. Przykładowa 1, 99-300 Kutno"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dowód osobisty
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="ABC123456"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  PESEL
                </label>
                <input
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={pesel}
                  onChange={(e) => setPesel(e.target.value)}
                  placeholder="90010112345"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className={`px-4 py-2 rounded-lg font-semibold text-white shadow transition ${
                  canCreateOne
                    ? "bg-brand-accent hover:bg-brand-accentHover"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
                disabled={!canCreateOne}
                onClick={async () => {
                  if (!canCreateOne) return;
                  setError(null);

                  const validationResult = userValidationSchema.safeParse({
                    name: fullName,
                    email: email.trim(),
                    phone: normalizePhone(phone) || "",
                    pesel: pesel.trim() || undefined,
                  });

                  if (!validationResult.success) {
                    const errMsg = validationResult.error.errors[0].message;
                    setError(errMsg);
                    toast.error(errMsg);
                    return;
                  }

                  const payload: CreateUserPayload = {
                    email: email.trim(),
                    name: fullName,
                    company: effectiveCompany || "Indywidualny",
                    courseId,
                    phone: normalizePhone(phone) || undefined,
                    address: address.trim() || undefined,
                    idNumber: idNumber.trim() || undefined,
                    pesel: pesel.trim() || undefined,
                    avatarUrl: undefined,
                  };

                  try {
                    const result = await onCreateUser(payload);
                    if (result.ok === false) {
                      setError(result.error);
                      return;
                    }
                    onBack();
                  } catch (e: any) {
                    setError(e.message || "Wystąpił błąd");
                  }
                }}
              >
                Dodaj
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
