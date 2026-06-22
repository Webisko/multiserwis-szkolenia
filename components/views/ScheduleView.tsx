import React from "react";
import { Schedule } from "../features/Schedule";

interface ScheduleViewProps {
  setView: (view: any) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ setView }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-800 mb-4">
          Harmonogram Szkoleń
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Sprawdź najbliższe terminy szkoleń i zapisz się online. Aktualizujemy
          harmonogram na bieżąco.
        </p>
      </div>
      <Schedule setView={setView} />
    </div>
  );
};

export default ScheduleView;
