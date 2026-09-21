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
              <div className="space-y-5 text-base">
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Szkolenia UDT / IMBiGS / SEP
                  </span>
                  <div className="text-lg font-bold text-white">+48 730 101 000</div>
                  <div className="text-sm text-slate-300">+48 570 403 806</div>
                </div>
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Usługi Dźwigowe i Wynajem
                  </span>
                  <div className="text-base font-semibold text-white">+48 730 202 000</div>
                  <div className="text-sm text-slate-300">+48 733 929 100</div>
                </div>
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Email
                  </span>
                  <a href="mailto:multiserwis.kutno@gmail.com" className="hover:text-brand-accent transition-colors">
                    multiserwis.kutno@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Biuro Obsługi Klienta
                  </span>
                  <span>
                    ul. Siemieradzkiego 18<br />
                    99-300 Kutno<br />
                    <span className="text-xs text-slate-400">Pn–Pt: 8:00 – 16:00</span>
                  </span>
                </div>
                <div>
                  <span className="text-brand-accent block text-xs uppercase font-bold mb-1">
                    Baza Szkoleniowa i Plac Manewrowy
                  </span>
                  <span>
                    ul. Przemysłowa 2<br />
                    99-300 Kutno<br />
                    <span className="text-xs text-emerald-400">✓ Bezpłatny parking dla kursantów</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="w-full h-56 rounded-lg overflow-hidden border border-slate-700/60 shadow-inner">
                <iframe
                  title="Multiserwis Kutno - Lokalizacja Ośrodka Szkoleniowego"
                  src="https://maps.google.com/maps?q=ul.+Siemieradzkiego+18,+99-300+Kutno&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
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
