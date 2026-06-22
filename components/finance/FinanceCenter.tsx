import React from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  Filter,
  Receipt,
  RefreshCcw,
  Search,
  Settings,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import type {
  Course,
  Order,
  OrderStatus,
  Student,
  StudentUser,
} from "../../types";

type FinanceRole = "admin" | "manager";

type FinanceTab =
  | "dashboard"
  | "transactions"
  | "payment-methods"
  | "reports"
  | "invoices"
  | "settings";

type TransactionStatus = "pending" | "completed" | "cancelled" | "refunded";
type PaymentMethodId = "card" | "blik" | "transfer" | "paypal";

type Transaction = {
  id: string;
  createdAt: string; // ISO
  amountPln: number;
  status: TransactionStatus;
  method: PaymentMethodId;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  orderId: string;
  courseId?: string;
  courseTitle?: string;
};

type PaymentMethodConfig = {
  id: PaymentMethodId;
  label: string;
  active: boolean;
  order: number;
  mode: "test" | "production";
  publicKey?: string;
  secretKey?: string;
  feePercent: number;
  limitMinPln?: number;
  limitMaxPln?: number;
};

const parsePricePln = (price: string) => {
  const cleaned = price.replace(/[^0-9]/g, "");
  return cleaned ? Number(cleaned) : 0;
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 2,
  });

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const dateFromStableHash = (seed: string, daysBack = 180) => {
  const now = new Date();
  const h = hashString(seed);
  const offsetDays = h % daysBack;
  const minutes = h % (24 * 60);
  const dt = new Date(now.getTime());
  dt.setDate(now.getDate() - offsetDays);
  dt.setHours(Math.floor(minutes / 60));
  dt.setMinutes(minutes % 60);
  dt.setSeconds(0);
  dt.setMilliseconds(0);
  return dt;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const toCsv = (
  rows: Array<Record<string, string | number | boolean | null | undefined>>,
) => {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const escape = (value: unknown) => {
    const text = String(value ?? "");
    const needsQuotes = /[;\n\r\"]/g.test(text);
    const escaped = text.replace(/\"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const lines = [headers.join(";")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(";"));
  }
  return lines.join("\r\n");
};

const statusLabel: Record<TransactionStatus, string> = {
  pending: "Oczekująca",
  completed: "Zrealizowana",
  cancelled: "Anulowana",
  refunded: "Zwrócona",
};

const methodLabel: Record<PaymentMethodId, string> = {
  card: "Karta płatnicza",
  blik: "BLIK",
  transfer: "Przelew",
  paypal: "PayPal",
};

const statusPillClass: Record<TransactionStatus, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  refunded: "bg-rose-50 text-rose-700 border-rose-200",
};

const buildTransactions = (
  courses: Course[],
  students: Student[],
): Transaction[] => {
  const priceMap = courses.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] = parsePricePln(c.price);
    return acc;
  }, {});

  const courseTitleMap = courses.reduce<Record<string, string>>((acc, c) => {
    acc[c.id] = c.title;
    return acc;
  }, {});

  const methods: PaymentMethodId[] = ["card", "blik", "transfer", "paypal"];

  return students.map((s, idx) => {
    const createdAt = dateFromStableHash(
      `${s.id}-${s.email}-${s.course}`,
    ).toISOString();
    const amountPln = priceMap[s.course] ?? 0;
    const method = methods[idx % methods.length];
    const status: TransactionStatus =
      s.status === "expired" ||
      (typeof s.expirationDays === "number" && s.expirationDays <= 0)
        ? "refunded"
        : s.status === "warning"
          ? "pending"
          : "completed";

    return {
      id: `TX-${String(hashString(`${s.id}-${s.course}`)).slice(0, 10)}`,
      createdAt,
      amountPln,
      status,
      method,
      customerName: s.name,
      customerEmail: s.email,
      customerCompany: s.company,
      orderId: `ORD-${String(hashString(`${s.email}-${s.course}`)).slice(0, 8)}`,
      courseId: s.course,
      courseTitle: courseTitleMap[s.course],
    };
  });
};

const mapOrderStatus = (status: OrderStatus): TransactionStatus => {
  switch (status) {
    case "PAID":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "FAILED":
      return "cancelled";
    case "PENDING_PAYMENT":
    case "DRAFT":
    default:
      return "pending";
  }
};

const mapProviderToMethod = (provider?: string): PaymentMethodId => {
  const value = (provider || "").toLowerCase();
  if (value.includes("blik")) return "blik";
  if (value.includes("card") || value.includes("stripe")) return "card";
  if (value.includes("paypal")) return "paypal";
  if (value.includes("transfer") || value.includes("przelew"))
    return "transfer";
  return "transfer";
};

const buildTransactionsFromOrders = (
  orders: Order[],
  courses: Course[],
  users: StudentUser[],
): Transaction[] => {
  const courseMap = courses.reduce<Record<string, Course>>((acc, course) => {
    acc[course.id] = course;
    return acc;
  }, {});

  const userMap = users.reduce<Record<string, StudentUser>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return orders.map((order) => {
    const course = courseMap[order.courseId];
    const user = userMap[order.userId];
    const fallbackName = user?.email
      ? user.email
      : `Uzytkownik ${order.userId.slice(0, 6)}`;

    return {
      id: order.id,
      createdAt: order.createdAt,
      amountPln: order.amount,
      status: mapOrderStatus(order.status),
      method: mapProviderToMethod(order.provider),
      customerName: user?.name || fallbackName,
      customerEmail: user?.email || "-",
      customerCompany: user?.company || undefined,
      orderId: order.id,
      courseId: order.courseId,
      courseTitle: course?.title,
    };
  });
};

const inRange = (value: number, min?: number, max?: number) => {
  if (typeof min === "number" && value < min) return false;
  if (typeof max === "number" && value > max) return false;
  return true;
};

const startOfDay = (d: Date) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const startOfWeek = (d: Date) => {
  const dt = startOfDay(d);
  const day = dt.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  dt.setDate(dt.getDate() + diff);
  return dt;
};

const startOfMonth = (d: Date) => {
  const dt = startOfDay(d);
  dt.setDate(1);
  return dt;
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const TabButton: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
      active
        ? "border-brand-accent text-brand-accent"
        : "border-transparent text-slate-500 hover:text-slate-800"
    }`}
  >
    <span className={active ? "text-brand-accent" : "text-slate-400"}>
      {icon}
    </span>
    {label}
  </button>
);

const Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className ?? ""}`}
  >
    {title ? (
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
      </div>
    ) : null}
    <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
  </div>
);

const KpiCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accentClass: string;
}> = ({ label, value, sub, icon, accentClass }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentClass}`} />
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
        {sub ? <p className="text-xs text-slate-500 mt-1">{sub}</p> : null}
      </div>
      <span className="p-2 rounded-lg bg-slate-50 text-slate-500">{icon}</span>
    </div>
  </div>
);

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="text-base font-bold text-slate-800">{title}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition"
          aria-label="Zamknij"
        >
          <XCircle size={20} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const FinanceDashboard: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  const now = new Date();
  const dayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const completed = transactions.filter((t) => t.status === "completed");
  const refunded = transactions.filter((t) => t.status === "refunded");

  const sumAmount = (list: Transaction[]) =>
    list.reduce((sum, t) => sum + t.amountPln, 0);

  const revenueToday = sumAmount(
    completed.filter((t) => isSameDay(new Date(t.createdAt), now)),
  );
  const revenueWeek = sumAmount(
    completed.filter((t) => new Date(t.createdAt) >= weekStart),
  );
  const revenueMonth = sumAmount(
    completed.filter((t) => new Date(t.createdAt) >= monthStart),
  );

  const txToday = transactions.filter(
    (t) => new Date(t.createdAt) >= dayStart,
  ).length;
  const avgOrder = completed.length
    ? sumAmount(completed) / completed.length
    : 0;

  const balance = sumAmount(completed) - sumAmount(refunded);

  const lastSixMonths = React.useMemo(() => {
    const buckets: Array<{ label: string; value: number }> = [];
    const cursor = new Date(now);
    cursor.setDate(1);
    cursor.setHours(0, 0, 0, 0);
    cursor.setMonth(cursor.getMonth() - 5);

    for (let i = 0; i < 6; i++) {
      const start = new Date(cursor);
      const end = new Date(cursor);
      end.setMonth(end.getMonth() + 1);

      const label = start
        .toLocaleString("pl-PL", { month: "short" })
        .toUpperCase();
      const value = sumAmount(
        completed.filter((t) => {
          const dt = new Date(t.createdAt);
          return dt >= start && dt < end;
        }),
      );

      buckets.push({ label, value });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return buckets;
  }, [completed]);

  const maxBar = Math.max(1, ...lastSixMonths.map((b) => b.value));

  const methodPopularity = React.useMemo(() => {
    const total = transactions.length || 1;
    const counts = transactions.reduce<Record<PaymentMethodId, number>>(
      (acc, t) => {
        acc[t.method] = (acc[t.method] ?? 0) + 1;
        return acc;
      },
      { card: 0, blik: 0, transfer: 0, paypal: 0 },
    );

    return (Object.keys(counts) as PaymentMethodId[])
      .map((id) => ({
        id,
        label: methodLabel[id],
        percent: Math.round((counts[id] / total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          label="Całkowity przychód"
          value={formatCurrency(revenueMonth)}
          sub={`Dziś: ${formatCurrency(revenueToday)} • Tydzień: ${formatCurrency(revenueWeek)}`}
          icon={<Wallet size={18} />}
          accentClass="bg-emerald-500"
        />
        <KpiCard
          label="Liczba transakcji"
          value={txToday.toLocaleString("pl-PL")}
          sub="Ostatnie 24h"
          icon={<TrendingUp size={18} />}
          accentClass="bg-blue-500"
        />
        <KpiCard
          label="Średnia wartość zamówienia"
          value={formatCurrency(avgOrder)}
          sub="Dla transakcji zrealizowanych"
          icon={<BarChartIcon />}
          accentClass="bg-violet-500"
        />
        <KpiCard
          label="Bilans konta"
          value={formatCurrency(balance)}
          sub="Zrealizowane minus zwroty"
          icon={<Wallet size={18} />}
          accentClass="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Trendy przychodów" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              Podsumowanie wpływów w ciągu ostatnich 6 miesięcy.
            </p>
            <button className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
              Ostatnie 6 miesięcy <ChevronDown size={16} />
            </button>
          </div>
          <div className="flex items-end gap-4 h-56">
            {lastSixMonths.map((b) => (
              <div
                key={b.label}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full bg-slate-100 rounded-xl overflow-hidden flex items-end h-44">
                  <div
                    className="w-full bg-brand-accent/90"
                    style={{
                      height: `${Math.round((b.value / maxBar) * 100)}%`,
                    }}
                    title={formatCurrency(b.value)}
                  />
                </div>
                <div className="text-[11px] font-semibold text-slate-400 tracking-wider">
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Metody płatności">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              Popularność metod w transakcjach.
            </p>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Popularność
            </span>
          </div>
          <div className="space-y-4">
            {methodPopularity.slice(0, 4).map((m) => (
              <div key={m.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <CreditCard size={16} />
                    </span>
                    {m.label}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {m.percent}%
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <button className="text-sm font-semibold text-brand-accent hover:underline">
              Zarządzaj metodami →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const BarChartIcon = () => <TrendingUp size={18} />;

const FinanceTransactions: React.FC<{
  transactions: Transaction[];
  onExportCsv: (rows: Transaction[]) => void;
}> = ({ transactions, onExportCsv }) => {
  const [status, setStatus] = React.useState<TransactionStatus | "all">("all");
  const [method, setMethod] = React.useState<PaymentMethodId | "all">("all");
  const [query, setQuery] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [minAmount, setMinAmount] = React.useState("");
  const [maxAmount, setMaxAmount] = React.useState("");
  const [selected, setSelected] = React.useState<Transaction | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromDate = from ? new Date(`${from}T00:00:00`) : null;
    const toDate = to ? new Date(`${to}T23:59:59`) : null;
    const min = minAmount ? Number(minAmount) : undefined;
    const max = maxAmount ? Number(maxAmount) : undefined;

    return transactions
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => (method === "all" ? true : t.method === method))
      .filter((t) => {
        if (!q) return true;
        return (
          t.id.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          (t.customerCompany ?? "").toLowerCase().includes(q) ||
          (t.courseTitle ?? "").toLowerCase().includes(q)
        );
      })
      .filter((t) => (fromDate ? new Date(t.createdAt) >= fromDate : true))
      .filter((t) => (toDate ? new Date(t.createdAt) <= toDate : true))
      .filter((t) => inRange(t.amountPln, min, max))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [transactions, status, method, query, from, to, minAmount, maxAmount]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-800">Filtry</div>
            <div className="text-xs text-slate-500 mt-1">
              Zawęź listę po statusie, dacie, metodzie i kwocie.
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onExportCsv(filtered)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mt-5">
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-slate-500">
              Wyszukaj
            </label>
            <div className="mt-1 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Szukaj transakcji, klienta lub zamówienia..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as TransactionStatus | "all")
              }
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="all">Wszystkie</option>
              <option value="pending">Oczekujące</option>
              <option value="completed">Zrealizowane</option>
              <option value="cancelled">Anulowane</option>
              <option value="refunded">Zwrócone</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Metoda
            </label>
            <select
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as PaymentMethodId | "all")
              }
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="all">Wszystkie</option>
              <option value="card">Karta</option>
              <option value="blik">BLIK</option>
              <option value="transfer">Przelew</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Od</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Do</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Kwota min
            </label>
            <input
              inputMode="numeric"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Kwota max
            </label>
            <input
              inputMode="numeric"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="9999"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card title={`Transakcje (${filtered.length})`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 text-left">ID</th>
                <th className="py-3 text-left">Data</th>
                <th className="py-3 text-left">Klient</th>
                <th className="py-3 text-left">Kwota</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Metoda</th>
                <th className="py-3 text-left">Zamówienie</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelected(t)}
                >
                  <td className="py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {t.id}
                  </td>
                  <td className="py-3 text-slate-600 whitespace-nowrap">
                    {formatDateTime(t.createdAt)}
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-slate-800">
                      {t.customerName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t.customerEmail}
                    </div>
                  </td>
                  <td className="py-3 font-bold text-slate-800 whitespace-nowrap">
                    {formatCurrency(t.amountPln)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${statusPillClass[t.status]}`}
                    >
                      {t.status === "completed" ? (
                        <CheckCircle2 size={14} />
                      ) : null}
                      {t.status === "pending" ? <Calendar size={14} /> : null}
                      {t.status === "cancelled" ? <XCircle size={14} /> : null}
                      {t.status === "refunded" ? (
                        <RefreshCcw size={14} />
                      ) : null}
                      {statusLabel[t.status]}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700 whitespace-nowrap">
                    {methodLabel[t.method]}
                  </td>
                  <td className="py-3 text-slate-600 whitespace-nowrap">
                    {t.orderId}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Brak transakcji spełniających kryteria.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      {selected ? (
        <Modal
          title={`Szczegóły transakcji ${selected.id}`}
          onClose={() => setSelected(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Dane
              </div>
              <div className="text-sm">
                <span className="font-semibold">Data:</span>{" "}
                {formatDateTime(selected.createdAt)}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Kwota:</span>{" "}
                {formatCurrency(selected.amountPln)}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Status:</span>{" "}
                {statusLabel[selected.status]}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Metoda:</span>{" "}
                {methodLabel[selected.method]}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Zamówienie:</span>{" "}
                {selected.orderId}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Klient
              </div>
              <div className="text-sm">
                <span className="font-semibold">Imię i nazwisko:</span>{" "}
                {selected.customerName}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Email:</span>{" "}
                {selected.customerEmail}
              </div>
              {selected.customerCompany ? (
                <div className="text-sm">
                  <span className="font-semibold">Firma:</span>{" "}
                  {selected.customerCompany}
                </div>
              ) : null}
              {selected.courseTitle ? (
                <div className="text-sm">
                  <span className="font-semibold">Szkolenie:</span>{" "}
                  {selected.courseTitle}
                </div>
              ) : null}
            </div>
          </div>
          <div className="pt-5 flex gap-2 justify-end">
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Zamknij
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

const FinancePaymentMethods: React.FC = () => {
  const [methods, setMethods] = React.useState<PaymentMethodConfig[]>([
    {
      id: "card",
      label: "Karty płatnicze",
      active: true,
      order: 1,
      mode: "production",
      feePercent: 1.49,
    },
    {
      id: "blik",
      label: "BLIK",
      active: true,
      order: 2,
      mode: "production",
      feePercent: 1.2,
    },
    {
      id: "transfer",
      label: "Przelewy24 / Przelew",
      active: true,
      order: 3,
      mode: "test",
      feePercent: 1.0,
    },
    {
      id: "paypal",
      label: "PayPal",
      active: false,
      order: 4,
      mode: "test",
      feePercent: 2.9,
    },
  ]);

  const [selected, setSelected] = React.useState<PaymentMethodId>("card");
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  const sorted = React.useMemo(
    () => [...methods].sort((a, b) => a.order - b.order),
    [methods],
  );
  const activeConfig = methods.find((m) => m.id === selected) || methods[0];

  const updateMethod = (
    id: PaymentMethodId,
    patch: Partial<PaymentMethodConfig>,
  ) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  };

  const move = (id: PaymentMethodId, dir: -1 | 1) => {
    setMethods((prev) => {
      const current = [...prev].sort((a, b) => a.order - b.order);
      const idx = current.findIndex((m) => m.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= current.length) return prev;
      const a = current[idx];
      const b = current[target];
      const next = current.map((m) => {
        if (m.id === a.id) return { ...m, order: b.order };
        if (m.id === b.id) return { ...m, order: a.order };
        return m;
      });
      return next;
    });
  };

  const handleSave = () => {
    setSavedAt(new Date().toISOString());
    window.setTimeout(() => setSavedAt(null), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Metody płatności" className="lg:col-span-1">
        <div className="space-y-3">
          {sorted.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selected === m.id
                  ? "border-brand-accent bg-orange-50/40"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-800">{m.label}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {m.active ? "Aktywna" : "Nieaktywna"} • Tryb:{" "}
                    {m.mode === "test" ? "testowy" : "produkcyjny"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-semibold ${m.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}
                  >
                    {m.active ? "ON" : "OFF"}
                  </span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        move(m.id, -1);
                      }}
                      className="p-1 rounded hover:bg-slate-100 text-slate-500"
                      aria-label="Przenieś w górę"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        move(m.id, 1);
                      }}
                      className="p-1 rounded hover:bg-slate-100 text-slate-500"
                      aria-label="Przenieś w dół"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Konfiguracja" className="lg:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-slate-800">
              {activeConfig.label}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              To jest UI demo. Klucze API nie są nigdzie wysyłane ani zapisywane
              na serwerze.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={activeConfig.active}
                onChange={(e) =>
                  updateMethod(activeConfig.id, { active: e.target.checked })
                }
              />
              Aktywna
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="text-xs font-semibold text-slate-500">Tryb</label>
            <select
              value={activeConfig.mode}
              onChange={(e) =>
                updateMethod(activeConfig.id, {
                  mode: e.target.value as "test" | "production",
                })
              }
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="test">Testowy</option>
              <option value="production">Produkcyjny</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Opłata (%)
            </label>
            <input
              inputMode="decimal"
              value={String(activeConfig.feePercent)}
              onChange={(e) =>
                updateMethod(activeConfig.id, {
                  feePercent: clamp(Number(e.target.value || 0), 0, 99),
                })
              }
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Public key
            </label>
            <input
              value={activeConfig.publicKey ?? ""}
              onChange={(e) =>
                updateMethod(activeConfig.id, { publicKey: e.target.value })
              }
              placeholder="pk_live_..."
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Secret key
            </label>
            <input
              type="password"
              value={activeConfig.secretKey ?? ""}
              onChange={(e) =>
                updateMethod(activeConfig.id, { secretKey: e.target.value })
              }
              placeholder="••••••••••"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Limit min (PLN)
            </label>
            <input
              inputMode="numeric"
              value={activeConfig.limitMinPln ?? ""}
              onChange={(e) =>
                updateMethod(activeConfig.id, {
                  limitMinPln: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Limit max (PLN)
            </label>
            <input
              inputMode="numeric"
              value={activeConfig.limitMaxPln ?? ""}
              onChange={(e) =>
                updateMethod(activeConfig.id, {
                  limitMaxPln: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between gap-4">
          {savedAt ? (
            <div className="text-sm text-emerald-700 font-semibold">
              Zapisano konfigurację (lokalnie).
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Zmiany są zapisywane wyłącznie w pamięci przeglądarki (demo).
            </div>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-semibold hover:bg-orange-600"
          >
            Zapisz konfigurację
          </button>
        </div>
      </Card>
    </div>
  );
};

const FinanceReports: React.FC = () => {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [groupBy, setGroupBy] = React.useState<"method" | "status" | "day">(
    "method",
  );
  const [scheduled, setScheduled] = React.useState(false);
  const [lastGenerated, setLastGenerated] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card title="Generowanie raportu">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Od</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Do</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Grupowanie
            </label>
            <select
              value={groupBy}
              onChange={(e) =>
                setGroupBy(e.target.value as "method" | "status" | "day")
              }
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="method">Metoda płatności</option>
              <option value="status">Status</option>
              <option value="day">Dzień</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setLastGenerated(new Date().toISOString())}
              className="w-full px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-semibold hover:bg-orange-600"
            >
              Generuj raport
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={scheduled}
              onChange={(e) => setScheduled(e.target.checked)}
            />
            Zaplanuj raport cykliczny (demo)
          </label>
          {lastGenerated ? (
            <div className="text-xs text-slate-500">
              Ostatnio wygenerowano: {formatDateTime(lastGenerated)}
            </div>
          ) : null}
        </div>
      </Card>

      <Card title="Raporty">
        <div className="text-sm text-slate-600">
          To jest placeholder pod: analiza konwersji, podatki/VAT, raporty per
          metoda i okres. Po podpięciu backendu podepniemy prawdziwe dane i
          pobieranie plików PDF.
        </div>
      </Card>
    </div>
  );
};

const FinanceInvoices: React.FC = () => {
  const invoices = React.useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const dt = dateFromStableHash(`inv-${i}`, 120);
        return {
          number: `FV/${dt.getFullYear()}/${String(i + 1).padStart(4, "0")}`,
          createdAt: dt.toISOString(),
          client: [
            "LogiTrans Sp. z o.o.",
            "Budimex S.A.",
            "DHL Supply Chain",
            "Indywidualny",
          ][i % 4],
          amount: 450 + (i % 5) * 150,
          status:
            i % 3 === 0 ? "Wystawiona" : i % 3 === 1 ? "Opłacona" : "Oczekuje",
        };
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <Card title="Faktury">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-sm text-slate-500">
            Historia wystawionych dokumentów (demo).
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-semibold hover:bg-orange-600">
            <Receipt size={16} /> Wystaw fakturę
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 text-left">Numer</th>
                <th className="py-3 text-left">Data</th>
                <th className="py-3 text-left">Klient</th>
                <th className="py-3 text-left">Kwota</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.number} className="border-b border-slate-100">
                  <td className="py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {inv.number}
                  </td>
                  <td className="py-3 text-slate-600 whitespace-nowrap">
                    {formatDateTime(inv.createdAt)}
                  </td>
                  <td className="py-3 text-slate-700">{inv.client}</td>
                  <td className="py-3 font-bold text-slate-800 whitespace-nowrap">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3 text-slate-700">{inv.status}</td>
                  <td className="py-3">
                    <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <FileText size={16} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Szablony i numeracja">
        <div className="text-sm text-slate-600">
          Placeholder pod: automatyczna numeracja, wybór szablonu, logo na
          fakturze, eksport PDF.
        </div>
      </Card>
    </div>
  );
};

const FinanceSettings: React.FC = () => {
  const [currency, setCurrency] = React.useState("PLN");
  const [vat, setVat] = React.useState("23");
  const [companyName, setCompanyName] = React.useState("MultiSerwis");
  const [companyNip, setCompanyNip] = React.useState("");
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  const handleSave = () => {
    setSavedAt(new Date().toISOString());
    window.setTimeout(() => setSavedAt(null), 3500);
  };

  return (
    <div className="space-y-6">
      <Card title="Ustawienia">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Waluta
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Stawka VAT (%)
            </label>
            <input
              inputMode="numeric"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Nazwa firmy (do faktur)
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">NIP</label>
            <input
              value={companyNip}
              onChange={(e) => setCompanyNip(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
            />
            Powiadomienia email o transakcjach
          </label>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-semibold hover:bg-orange-600"
          >
            Zapisz ustawienia
          </button>
        </div>

        {savedAt ? (
          <div className="mt-4 text-sm text-emerald-700 font-semibold">
            Zapisano (demo).
          </div>
        ) : null}
      </Card>

      <Card title="Limity i zabezpieczenia">
        <div className="text-sm text-slate-600">
          Placeholder pod: limity transakcji, whitelisty IP, zabezpieczenia,
          logi zdarzeń.
        </div>
      </Card>
    </div>
  );
};

export const FinanceCenter: React.FC<{
  role: FinanceRole;
  courses: Course[];
  students: Student[];
  orders?: Order[];
  users?: StudentUser[];
}> = ({ role, courses, students, orders, users = [] }) => {
  const [activeTab, setActiveTab] = React.useState<FinanceTab>("dashboard");
  const [globalQuery, setGlobalQuery] = React.useState("");

  const transactions = React.useMemo(() => {
    if (Array.isArray(orders)) {
      return buildTransactionsFromOrders(orders, courses, users);
    }
    return buildTransactions(courses, students);
  }, [orders, courses, students, users]);

  const exportCsv = (rows: Transaction[]) => {
    const csv = toCsv(
      rows.map((t) => ({
        ID: t.id,
        Data: formatDateTime(t.createdAt),
        "Kwota (PLN)": t.amountPln,
        Status: statusLabel[t.status],
        "Metoda płatności": methodLabel[t.method],
        Klient: t.customerName,
        Email: t.customerEmail,
        Firma: t.customerCompany ?? "",
        Zamówienie: t.orderId,
        Szkolenie: t.courseTitle ?? "",
      })),
    );
    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      `transakcje-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Centrum Zarządzania Finansami
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitorowanie przychodów, płatności i kondycji finansowej platformy.
            {role === "manager" ? " (Widok Managera)" : ""}
          </p>
        </div>

        <div className="flex-1 xl:max-w-xl">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder="Szukaj transakcji, faktury lub klienta..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCsv(transactions)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} /> Eksportuj
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent text-white text-sm font-semibold hover:bg-orange-600"
            title="(Demo)"
          >
            <TrendingUp size={16} /> Nowa transakcja
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 px-4">
          <TabButton
            active={activeTab === "dashboard"}
            icon={<TrendingUp size={16} />}
            label="Dashboard"
            onClick={() => setActiveTab("dashboard")}
          />
          <TabButton
            active={activeTab === "transactions"}
            icon={<Filter size={16} />}
            label="Transakcje"
            onClick={() => setActiveTab("transactions")}
          />
          <TabButton
            active={activeTab === "payment-methods"}
            icon={<CreditCard size={16} />}
            label="Metody płatności"
            onClick={() => setActiveTab("payment-methods")}
          />
          <TabButton
            active={activeTab === "invoices"}
            icon={<Receipt size={16} />}
            label="Faktury"
            onClick={() => setActiveTab("invoices")}
          />
          <TabButton
            active={activeTab === "reports"}
            icon={<FileText size={16} />}
            label="Raporty"
            onClick={() => setActiveTab("reports")}
          />
          <TabButton
            active={activeTab === "settings"}
            icon={<Settings size={16} />}
            label="Ustawienia"
            onClick={() => setActiveTab("settings")}
          />
        </div>
      </div>

      <div>
        {activeTab === "dashboard" ? (
          <FinanceDashboard transactions={transactions} />
        ) : null}
        {activeTab === "transactions" ? (
          <FinanceTransactions
            transactions={transactions.filter((t) => {
              const q = globalQuery.trim().toLowerCase();
              if (!q) return true;
              return (
                t.id.toLowerCase().includes(q) ||
                t.orderId.toLowerCase().includes(q) ||
                t.customerName.toLowerCase().includes(q) ||
                t.customerEmail.toLowerCase().includes(q) ||
                (t.customerCompany ?? "").toLowerCase().includes(q) ||
                (t.courseTitle ?? "").toLowerCase().includes(q)
              );
            })}
            onExportCsv={exportCsv}
          />
        ) : null}
        {activeTab === "payment-methods" ? <FinancePaymentMethods /> : null}
        {activeTab === "reports" ? <FinanceReports /> : null}
        {activeTab === "invoices" ? <FinanceInvoices /> : null}
        {activeTab === "settings" ? <FinanceSettings /> : null}
      </div>
    </div>
  );
};
