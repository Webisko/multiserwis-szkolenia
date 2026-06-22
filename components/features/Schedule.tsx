import React from "react";
import { Calendar, MapPin, Clock, ArrowRight, Filter } from "lucide-react";
import { ViewState, Course } from "../../types";

interface ScheduleProps {
  courses?: Course[];
  setView: (view: ViewState) => void;
}

// Mock Schedule Data (since Course type doesn't natively have exact dates for sessions yet, usually)
// We will extend or mock it here.
const MOCK_SESSIONS = [
  {
    id: "s1",
    courseName: "Wózki Jezdniowe II WJO",
    date: "2025-06-15",
    time: "09:00",
    location: "Kutno, ul. Siemieradzkiego 18",
    spots: 5,
    price: "699 zł",
    category: "UDT",
  },
  {
    id: "s2",
    courseName: "Uprawnienia SEP G1",
    date: "2025-06-16",
    time: "16:00",
    location: "Kutno, ul. Siemieradzkiego 18",
    spots: 12,
    price: "350 zł",
    category: "SEP",
  },
  {
    id: "s3",
    courseName: "Suwnice IIS",
    date: "2025-06-18",
    time: "08:00",
    location: "Kutno, ul. Siemieradzkiego 18",
    spots: 3,
    price: "899 zł",
    category: "UDT",
  },
  {
    id: "s4",
    courseName: "Podesty Ruchome IP",
    date: "2025-06-20",
    time: "09:00",
    location: "Kutno, ul. Siemieradzkiego 18",
    spots: 8,
    price: "799 zł",
    category: "UDT",
  },
  {
    id: "s5",
    courseName: "BHP Wstępne",
    date: "2025-06-22",
    time: "10:00",
    location: "Online / Kutno",
    spots: 20,
    price: "150 zł",
    category: "BHP",
  },
];

export const Schedule: React.FC<ScheduleProps> = ({ setView }) => {
  const [filter, setFilter] = React.useState("ALL");

  const filteredSessions =
    filter === "ALL"
      ? MOCK_SESSIONS
      : MOCK_SESSIONS.filter((s) => s.category === filter);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-800 flex items-center gap-2">
            <Calendar className="text-brand-accent" /> Harmonogram Szkoleń
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Najbliższe terminy kursów w Kutnie i online
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded border border-slate-200">
          <Filter size={16} className="text-slate-400 ml-2" />
          <select
            className="bg-transparent text-sm font-semibold text-slate-600 outline-none p-2 cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">Wszystkie kategorie</option>
            <option value="UDT">Urządzenia UDT</option>
            <option value="SEP">Elektryczne SEP</option>
            <option value="BHP">BHP</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-6 hover:bg-brand-surface/30 transition-colors group flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-brand-accent/10 text-brand-accent font-bold rounded px-4 py-3 text-center min-w-[80px]">
                  <div className="text-2xl leading-none">
                    {session.date.split("-")[2]}
                  </div>
                  <div className="text-xs uppercase mt-1">
                    {new Date(session.date).toLocaleString("pl-PL", {
                      month: "short",
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-brand-primary transition-colors">
                    {session.courseName}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {session.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {session.location}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      Wolne miejsca: {session.spots}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="font-bold text-xl text-slate-700">
                  {session.price}
                </div>
                <button
                  onClick={() => setView("SIGNUP")}
                  className="bg-brand-primary text-white px-6 py-2 rounded-sm font-bold uppercase tracking-wide hover:bg-brand-primaryHover transition-colors flex items-center gap-2 text-sm"
                >
                  Zapisz się <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500">
            Brak zaplanowanych szkoleń w tej kategorii.
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 text-center text-xs text-slate-400 border-t border-slate-100">
        * Terminy mogą ulec zmianie. Potwierdzenie otrzymasz po zapisie.
      </div>
    </div>
  );
};
