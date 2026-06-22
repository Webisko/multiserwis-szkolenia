import React from "react";
import { MACHINES } from "../../constants";
import SectionHeader from "../SectionHeader";

interface Props {
  setSelectedMachineId: (id: string) => void;
  setView: (view: any) => void;
}

const RentalsView: React.FC<Props> = ({ setSelectedMachineId, setView }) => {
  return (
    <div className="py-12 bg-brand-surface animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader title="Wynajem Maszyn" subtitle="Flota Heavy Duty" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MACHINES.map((machine) => (
            <div
              key={machine.id}
              onClick={() => {
                setSelectedMachineId(machine.id);
                setView("MACHINE_DETAIL");
              }}
              className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow border border-slate-200 overflow-hidden flex flex-col group cursor-pointer"
            >
              <div className="h-56 bg-slate-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors z-10"></div>
                <img
                  src={machine.image}
                  alt={machine.name}
                  className="w-full h-full object-cover mix-blend-multiply transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-heading font-bold text-brand-dark">
                  {machine.name}
                </h3>
                <p className="text-brand-accent font-medium text-sm mb-4 uppercase">
                  {machine.type}
                </p>

                <div className="space-y-2 mb-6">
                  {Object.entries(machine.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-base border-b border-slate-100 pb-1"
                    >
                      <span className="text-slate-500 capitalize">{key}</span>
                      <span className="font-bold text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-brand-primary text-white py-3 font-bold uppercase text-sm rounded-sm hover:bg-brand-dark transition-colors mt-auto">
                  Rezerwuj Maszynę
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentalsView;
