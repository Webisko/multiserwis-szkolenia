import React from "react";

const TermsView: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold font-heading text-slate-800 mb-6">
            Regulamin Świadczenia Usług Szkoleniowych
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">
              Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §1. Postanowienia ogólne
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Niniejszy Regulamin określa zasady świadczenia usług
                  szkoleniowych przez Multiserwis Kutno z siedzibą w Kutnie, ul.
                  Siemieradzkiego 18, 99-300 Kutno.
                </li>
                <li>
                  Regulamin jest dostępny na stronie internetowej oraz w
                  siedzibie firmy.
                </li>
                <li>
                  Akceptacja Regulaminu następuje poprzez zapisanie się na
                  szkolenie.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §2. Zapisy na szkolenia
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Zapisy na szkolenia odbywają się poprzez formularz online,
                  telefonicznie lub osobiście w siedzibie firmy.
                </li>
                <li>
                  Warunkiem uczestnictwa w szkoleniu jest dokonanie wpłaty
                  zgodnie z wybraną formą płatności.
                </li>
                <li>
                  Potwierdzenie zapisu następuje po otrzymaniu wpłaty i
                  weryfikacji wymaganych dokumentów.
                </li>
                <li>
                  Liczba miejsc na szkoleniu jest ograniczona. Decyduje
                  kolejność zgłoszeń.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §3. Wymagane dokumenty
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Uczestnik zobowiązany jest dostarczyć wymagane dokumenty
                  zgodnie z rodzajem szkolenia (np. badania lekarskie, zdjęcia,
                  dokumenty wykształcenia).
                </li>
                <li>
                  Brak wymaganych dokumentów może skutkować niedopuszczeniem do
                  egzaminu.
                </li>
                <li>
                  Organizator nie ponosi odpowiedzialności za konsekwencje
                  wynikające z niedostarczenia lub dostarczenia nieprawidłowych
                  dokumentów.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §4. Płatności
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Ceny szkoleń podane są w złotych polskich i zawierają podatek
                  VAT (jeśli dotyczy).
                </li>
                <li>
                  Dostępne formy płatności: przelew bankowy, gotówka, płatność
                  online.
                </li>
                <li>
                  W przypadku płatności przelewem, wpłata powinna być dokonana
                  najpóźniej 3 dni przed rozpoczęciem szkolenia.
                </li>
                <li>Faktura VAT wystawiana jest na żądanie klienta.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §5. Rezygnacja i zwroty
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Rezygnacja ze szkolenia możliwa jest do 7 dni przed jego
                  rozpoczęciem z pełnym zwrotem wpłaconej kwoty.
                </li>
                <li>
                  Rezygnacja w terminie krótszym niż 7 dni skutkuje zwrotem 50%
                  wpłaconej kwoty.
                </li>
                <li>
                  Brak stawienia się na szkolenie bez wcześniejszego
                  powiadomienia nie uprawnia do zwrotu wpłaconej kwoty.
                </li>
                <li>
                  W przypadku rezygnacji z przyczyn losowych (choroba, wypadek)
                  możliwe jest przeniesienie na inny termin po przedstawieniu
                  odpowiednich dokumentów.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §6. Prawa i obowiązki uczestnika
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Uczestnik zobowiązany jest do punktualnego przybycia na
                  zajęcia oraz aktywnego uczestnictwa w szkoleniu.
                </li>
                <li>
                  Uczestnik zobowiązany jest do przestrzegania przepisów BHP
                  oraz poleceń instruktora.
                </li>
                <li>
                  Uczestnik ponosi pełną odpowiedzialność za szkody wyrządzone z
                  własnej winy.
                </li>
                <li>
                  Organizator zastrzega sobie prawo do wykluczenia uczestnika w
                  przypadku rażącego naruszenia regulaminu lub przepisów BHP.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §7. Prawa i obowiązki organizatora
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Organizator zapewnia profesjonalną kadrę instruktorską oraz
                  odpowiedni sprzęt szkoleniowy.
                </li>
                <li>
                  Organizator zastrzega sobie prawo do zmiany terminu szkolenia
                  w przypadku siły wyższej lub zbyt małej liczby uczestników
                  (minimum 3 osoby).
                </li>
                <li>
                  W przypadku odwołania szkolenia z winy organizatora,
                  uczestnicy otrzymują pełny zwrot wpłaconej kwoty.
                </li>
                <li>
                  Organizator nie ponosi odpowiedzialności za niezdanie egzaminu
                  przez uczestnika.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §8. Egzaminy
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Egzaminy przeprowadzane są przez uprawnione jednostki (UDT,
                  IMBiGS, SEP).
                </li>
                <li>
                  Koszt egzaminu jest wliczony w cenę szkolenia (chyba że
                  zaznaczono inaczej).
                </li>
                <li>
                  W przypadku niezdania egzaminu, uczestnik może przystąpić do
                  poprawki zgodnie z regulaminem jednostki egzaminacyjnej (koszt
                  dodatkowy).
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §9. Certyfikaty i zaświadczenia
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Po pozytywnym zaliczeniu szkolenia i egzaminu, uczestnik
                  otrzymuje odpowiednie zaświadczenie lub certyfikat.
                </li>
                <li>
                  Dokumenty wydawane są w terminie do 14 dni od zakończenia
                  szkolenia.
                </li>
                <li>
                  Duplikat dokumentu wydawany jest za opłatą administracyjną.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §10. Reklamacje
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Reklamacje należy zgłaszać pisemnie na adres siedziby firmy
                  lub drogą elektroniczną w terminie 14 dni od zakończenia
                  szkolenia.
                </li>
                <li>
                  Reklamacja powinna zawierać opis problemu oraz oczekiwania
                  klienta.
                </li>
                <li>
                  Organizator rozpatruje reklamację w terminie 14 dni od jej
                  otrzymania.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                §11. Postanowienia końcowe
              </h2>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  Organizator zastrzega sobie prawo do zmiany Regulaminu. Zmiany
                  wchodzą w życie po opublikowaniu na stronie internetowej.
                </li>
                <li>
                  W sprawach nieuregulowanych w Regulaminie zastosowanie mają
                  przepisy Kodeksu Cywilnego.
                </li>
                <li>
                  Ewentualne spory rozstrzygane będą przez sąd właściwy dla
                  siedziby organizatora.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Kontakt
              </h2>
              <ul className="list-none pl-0 text-slate-600 space-y-2">
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

export default TermsView;
