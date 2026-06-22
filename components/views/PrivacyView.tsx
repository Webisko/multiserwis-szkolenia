import React from "react";

const PrivacyView: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold font-heading text-slate-800 mb-6">
            Polityka Prywatności
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">
              Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                1. Administrator danych
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Administratorem danych osobowych jest Multiserwis Kutno z
                siedzibą w Kutnie, ul. Siemieradzkiego 18, 99-300 Kutno.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                2. Zakres zbieranych danych
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                W ramach świadczonych usług szkoleniowych zbieramy następujące
                dane osobowe:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Imię i nazwisko</li>
                <li>Adres e-mail</li>
                <li>Numer telefonu</li>
                <li>Adres zamieszkania</li>
                <li>Numer PESEL (wymagany do wydania certyfikatów)</li>
                <li>
                  Dane do faktury (w przypadku firm: NIP, nazwa firmy, adres)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                3. Cel przetwarzania danych
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Dane osobowe przetwarzane są w celu:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Realizacji umowy o świadczenie usług szkoleniowych</li>
                <li>Wystawienia certyfikatów i zaświadczeń</li>
                <li>Kontaktu w sprawach organizacyjnych</li>
                <li>Wystawiania faktur i dokumentów księgowych</li>
                <li>
                  Wypełnienia obowiązków prawnych (archiwizacja dokumentacji)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                4. Podstawa prawna
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Przetwarzanie danych osobowych odbywa się na podstawie:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Art. 6 ust. 1 lit. b RODO (wykonanie umowy)</li>
                <li>Art. 6 ust. 1 lit. c RODO (obowiązek prawny)</li>
                <li>Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                5. Okres przechowywania danych
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Dane osobowe przechowywane są przez okres niezbędny do
                realizacji celów, dla których zostały zebrane, oraz zgodnie z
                obowiązującymi przepisami prawa (min. 5 lat dla dokumentacji
                księgowej).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                6. Prawa osób, których dane dotyczą
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Przysługuje Państwu prawo do:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Dostępu do swoich danych osobowych</li>
                <li>Sprostowania danych</li>
                <li>Usunięcia danych</li>
                <li>Ograniczenia przetwarzania</li>
                <li>Przenoszenia danych</li>
                <li>Wniesienia sprzeciwu wobec przetwarzania</li>
                <li>
                  Cofnięcia zgody (jeśli przetwarzanie opiera się na zgodzie)
                </li>
                <li>Wniesienia skargi do organu nadzorczego (UODO)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                7. Odbiorcy danych
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Dane osobowe mogą być udostępniane:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Organom egzaminacyjnym (UDT, IMBiGS, SEP)</li>
                <li>Podmiotom świadczącym usługi księgowe</li>
                <li>Dostawcom systemów IT</li>
                <li>Organom państwowym na podstawie przepisów prawa</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                8. Pliki cookies
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nasza strona wykorzystuje pliki cookies w celu zapewnienia
                prawidłowego funkcjonowania serwisu oraz analizy ruchu. Możesz
                zarządzać ustawieniami cookies w swojej przeglądarce.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                9. Kontakt
              </h2>
              <p className="text-slate-600 leading-relaxed">
                W sprawach dotyczących ochrony danych osobowych prosimy o
                kontakt:
              </p>
              <ul className="list-none pl-0 text-slate-600 space-y-2 mt-4">
                <li>
                  <strong>Email:</strong> kontakt@multiserwis-kutno.pl
                </li>
                <li>
                  <strong>Telefon:</strong> 601 308 358
                </li>
                <li>
                  <strong>Adres:</strong> ul. Siemieradzkiego 18, 99-300 Kutno
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyView;
