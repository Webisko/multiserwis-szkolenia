import React from "react";
import SectionHeader from "../SectionHeader";
import { ViewState } from "../../types";

interface Props {
  setView: (view: ViewState) => void;
}

const ContactView: React.FC<Props> = ({ setView }) => {
  return (
    <div className="py-12 bg-brand-surface animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <SectionHeader
          title="Skontaktuj się"
          subtitle="Jesteśmy do dyspozycji"
        />

        <div className="bg-white shadow-xl rounded-sm overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-brand-dark p-8 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-heading font-bold mb-6">
                Dane kontaktowe
              </h3>
              <div className="space-y-6 text-base">
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Infolinia
                  </span>
                  <span className="text-lg">+48 730 101 000</span>
                </div>
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Email
                  </span>
                  <span>biuro@multiserwis.pl</span>
                </div>
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Adres
                  </span>
                  <span>
                    ul. Siemieradzkiego 18
                    <br />
                    99-300 Kutno
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="w-full h-32 bg-slate-700 rounded opacity-50 flex items-center justify-center text-xs">
                [Mapa Google]
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <h3 className="text-xl font-heading font-bold text-brand-dark mb-6">
              Napisz do nas
            </h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Imię
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-sm focus:outline-none focus:border-brand-accent transition-colors text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Nazwisko
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-sm focus:outline-none focus:border-brand-accent transition-colors text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-sm focus:outline-none focus:border-brand-accent transition-colors text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Wiadomość
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-sm focus:outline-none focus:border-brand-accent transition-colors text-base"
                ></textarea>
              </div>
              <button className="px-8 py-3 bg-brand-primary text-white font-bold uppercase tracking-wider rounded-sm hover:bg-brand-secondary transition-colors">
                Wyślij wiadomość
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
