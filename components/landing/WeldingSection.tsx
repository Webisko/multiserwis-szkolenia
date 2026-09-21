import React from "react";
import { TrainingCategoryPage, TrainingItem } from "./TrainingCategoryPage";

const weldingTrainings: TrainingItem[] = [
  {
    id: "spawanie-mig-mag",
    title: "Spawanie MIG/MAG (131, 135, 136)",
    price: "od 2400 zł / moduł",
    description:
      "Najpopularniejsza metoda spawania w osłonie gazów aktywnych (MAG) lub obojętnych (MIG). Stal czarna, nierdzewna i aluminium.",
    features: [
      "Stal czarna: 2400 zł | Nierdzewna: 2700 zł | Aluminium: 2900 zł",
      "3 moduły: pachwiny (I), doczołowe blach (II), doczołowe rur (III)",
      "Czas trwania: 32 godz. zajęć praktycznych",
      "Norma PN-EN ISO 9606-1 + Certyfikat Spawalniczy SGS",
    ],
  },
  {
    id: "spawanie-tig",
    title: "Spawanie TIG (141)",
    price: "od 2400 zł / moduł",
    description:
      "Metoda 141 – spawanie elektrodą wolframową w osłonie argonu. Najwyższa estetyka i jakość spoin, idealna do rurociągów i stali nierdzewnej.",
    features: [
      "Stal czarna: 2400 zł | Nierdzewna: 2700 zł | Aluminium: 2900 zł",
      "Spawanie rur cienkościennych i zbiorników ciśnieniowych",
      "Czas trwania: 32 godz. intensywnej praktyki",
      "Książeczka spawacza + Certyfikat SGS (2-3 lata ważności)",
    ],
  },
  {
    id: "spawanie-elektryczne",
    title: "Spawanie elektryczne MMA (111)",
    price: "od 2400 zł / moduł",
    description:
      "Metoda 111 – spawanie elektrodą otuloną. Uniwersalna metoda montażowa w budownictwie, przemyśle ciężkim i pracach w terenie.",
    features: [
      "Stal czarna: 2400 zł | Stal nierdzewna: 2700 zł",
      "Spawanie we wszystkich pozycjach (PA, PB, PC, PD)",
      "Czas trwania: 32 godz. zajęć",
      "Świadectwo Egzaminu Spawacza wg EN ISO 9606-1",
    ],
  },
  {
    id: "odnowienie-spawanie",
    title: "Odnowienie uprawnień i cięcie termiczne",
    price: "od 600 zł",
    description:
      "Egzaminy weryfikacyjne przedłużające ważność certyfikatów spawalniczych oraz kursy cięcia tlenowego i plazmowego.",
    features: [
      "Odnowienie uprawnień spawacza: 600 zł",
      "Cięcie gazowe (acetylen/propan-tlen) i plazmowe: 900 zł",
      "Egzamin weryfikacyjny przed komisją",
      "Przedłużenie na kolejne 2-3 lata",
    ],
  },
];

export const WeldingSection = ({
  setView,
  setSelectedCourseId,
}: {
  setView?: (view: any) => void;
  setSelectedCourseId?: (id: string | null) => void;
}) => {
  return (
    <TrainingCategoryPage
      title="Szkolenia Spawalnicze"
      description="Zdobądź ceniony zawód spawacza. Oferujemy kursy na wszystkie najpopularniejsze metody spawania, kończące się uzyskaniem Książeczki Spawacza i Certyfikatu zgodnego z normami europejskimi."
      trainings={weldingTrainings}
      heroImage="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1"
      setView={setView}
      setSelectedCourseId={setSelectedCourseId}
      servicePromo={{
        title: "Usługi spawalnicze i ślusarskie",
        description:
          "Wykonujemy konstrukcje stalowe, rurociągi przemysłowe oraz naprawy elementów maszyn. Spawamy metodami MIG/MAG, TIG i MMA.",
        linkText: "Zobacz usługi spawalnicze",
        linkUrl: "https://multiserwis-kutno.pl/spawalnictwo",
      }}
    >
      {/* Szczegółowy Cennik Modułowy Spawalnictwa */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            Cennik Szczegółowy
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-2 font-heading">
            Tabela modułowa kursów spawalniczych
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Szkolenia prowadzimy w 3 modułach zaawansowania. Czas trwania pojedynczego modułu: <strong>32 godziny</strong> intensywnych zajęć praktycznych. Po zdanym egzaminie kursant otrzymuje Świadectwo Egzaminu Spawacza oraz Książeczkę Spawacza (Certyfikacja SGS wg PN-EN ISO 9606-1, ważność 2–3 lata). Wszystkie ceny zwolnione z VAT.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-heading font-bold text-xs uppercase tracking-wider">
                <th className="p-3.5 rounded-tl-lg">Metoda spawania i materiał</th>
                <th className="p-3.5 text-center">Moduł I<br /><span className="text-[10px] font-normal text-slate-300">Pachwinowe blach i rur</span></th>
                <th className="p-3.5 text-center">Moduł II<br /><span className="text-[10px] font-normal text-slate-300">Doczołowe blach</span></th>
                <th className="p-3.5 text-center rounded-tr-lg">Moduł III<br /><span className="text-[10px] font-normal text-slate-300">Doczołowe rur</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">Stal czarna – MMA 111 (elektroda otulona)</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">Stal czarna – MAG 135 (drut lity)</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">Stal czarna – MAG 136 (drut proszkowy)</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">Stal czarna – TIG 141 (elektroda wolframowa)</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 400 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-slate-50/50">
                <td className="p-3.5 font-bold text-slate-900">Stal nierdzewna – MMA 111</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-slate-50/50">
                <td className="p-3.5 font-bold text-slate-900">Stal nierdzewna – MAG 135</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-slate-50/50">
                <td className="p-3.5 font-bold text-slate-900">Stal nierdzewna – TIG 141</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 700 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">Aluminium – MIG 131</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 900 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 900 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 900 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">Aluminium – TIG 141</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 900 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 900 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 900 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">Stal czarna – Spawanie gazowe 311</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 000 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 000 zł</td>
                <td className="p-3.5 text-center font-semibold text-brand-primary">2 300 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-amber-50 font-bold text-slate-900">
                <td className="p-3.5">Odnowienie uprawnień spawacza (weryfikacja próbek)</td>
                <td colSpan={3} className="p-3.5 text-center text-brand-accent text-base font-black">600 zł</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-amber-50 font-bold text-slate-900">
                <td className="p-3.5">Cięcie gazowe (acetylen-tlen / propan-tlen) i plazmowe</td>
                <td colSpan={3} className="p-3.5 text-center text-brand-accent text-base font-black">900 zł</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            <strong>W cenie kursu:</strong> materiały spawalnicze, gaz, sprzęt ochrony osobistej, egzamin SGS oraz wydanie certyfikatu i książeczki.
          </div>
          <div className="font-semibold text-slate-700">
            Zapisy telefoniczne: <a href="tel:+48730101000" className="text-brand-primary hover:underline">+48 730 101 000</a>
          </div>
        </div>
      </div>
    </TrainingCategoryPage>
  );
};
