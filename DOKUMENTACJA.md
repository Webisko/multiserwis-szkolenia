# Dokumentacja techniczna projektu — MultiSerwis Szkolenia (`multiserwis.edu.pl`)

Kompleksowa dokumentacja ekosystemu szkoleniowego, e-learningowego (LMS) oraz katalogu wynajmu maszyn budowlanych dla **MULTISERWIS KUTNO Sp. z o.o.** (ul. Przemysłowa 2 / ul. Henryka Siemiradzkiego 18, 99-300 Kutno).

---

## 1. Przegląd projektu i stos technologiczny

Projekt został zunifikowany do pełnego standardu **Astro + React Islands + Laravel + FilamentPHP** na najnowszych stabilnych wersjach pakietów (listopad 2026):

| Warstwa | Technologia | Wersja | Rola w systemie |
| :--- | :--- | :--- | :--- |
| **Backend & API** | Laravel Framework | `v13.39.0` | REST API (`/api/*`), logika biznesowa LMS, zamówienia, harmonogram zadań, powiadomienia SMTP |
| **Panel CMS / Backoffice** | FilamentPHP + Livewire | `v5.11.0` / `v4.4.8` | Natywny polski panel administracyjny i menedżerski (`/admin/kokpit`) z motywem *MultiSerwis Industrial* |
| **Autoryzacja API / SSO** | Laravel Sanctum | `v4.3.3` | Tokeny Bearer API dla strefy kursanta i opiekuna firmy B2B oraz przekierowanie SSO (`/admin/sso`) |
| **Baza danych** | MySQL / MariaDB | `11.4.13-MariaDB` | Pełna relacyjna baza danych (`InnoDB`, `utf8mb4_unicode_ci`) dla kursów, postępów LMS, zamówień i kont |
| **Środowisko PHP** | PHP | `8.4.27` (SEOHost) | Silnik wykonawczy z rozszerzeniami `pdo_mysql`, `gd` (konwersja WebP), `mbstring`, `openssl` |
| **Frontend SSG & Islands** | Astro + `@astrojs/react` | `v7.4.4` / `v7.1.2` | Statycznie generowany portal ofertowy SEO (`multiserwis.edu.pl`) oraz portal LMS (`szkolenia.multiserwis.edu.pl`) |
| **Komponenty interaktywne** | React + TypeScript | `v19.3.1` / `v7.0.2` | Wyspy interaktywne (`CourseFinderIsland.tsx`, `LmsPortalIsland.tsx`) z odtwarzaczem HLS i symulatorem testów UDT |
| **Stylowanie UI** | Tailwind CSS + Vite | `v4.3.3` / `v8.3.5` | System projektowy *Industrial Deep Teal (`#003d4d`) & Safety Orange (`#ff6600`)* z lokalnymi fontami WOFF2 |

### Mapowanie subdomen produkcyjnych (SEOHost `h108.seohost.pl`)
1. **`https://multiserwis.edu.pl`** — Portal ofertowy i katalog SEO (Astro 7.4 SSG + wyspa wyszukiwarki kursów `CourseFinderIsland`).
2. **`https://szkolenia.multiserwis.edu.pl`** — Platforma e-learningowa Kursanta (`STUDENT`) oraz Strefa Opiekuna Firmy B2B (`COMPANY_GUARDIAN`) oparta na wyspie `LmsPortalIsland`.
3. **`https://panel.multiserwis.edu.pl`** — Natywny panel zarządzania **Filament 5.11 CMS** (`/admin/kokpit`) dla ról `ADMIN` i `MANAGER` oraz centralny punkt końcowy REST API.
4. **`https://stats.multiserwis.edu.pl`** — Self-hosted instancja analityki **Umami v2** (CloudLinux Node.js 20 Passenger + MariaDB `srv127364_szkolenia`), w 100% cookieless i prywatna (RODO Zero-Consent), zliczająca statystyki ruchu bez profilowania.

---

## 2. Struktura katalogów i architektura

```text
multiserwis-szkolenia/
├── .agents/skills/multiserwis-seohost-ssh/  # Lokalny skill SSH z parametrami połączenia SEOHost
├── .antigravity/
│   └── schema.md                            # Pełny schemat bazy danych MySQL / MariaDB 11.4
├── apps/
│   └── site/                                # Aplikacja Astro 7.4 + React 19 Islands + Tailwind 4.3
│       ├── src/
│       │   ├── components/                  # Komponenty Astro (SiteHeader, SiteFooter, CourseCard)
│       │   ├── components/islands/          # Wyspy React 19 (CourseFinderIsland, LmsPortalIsland)
│       │   ├── layouts/                     # Szablony BaseLayout.astro i CategoryLayout.astro
│       │   ├── pages/                       # 68 statycznych tras SEO oraz /panel, /panel/kursant, /panel/opiekun
│       │   ├── styles/global.css            # Konfiguracja @theme Tailwind CSS 4.3 i fonty WOFF2
│       │   └── utils/                       # Klient API (api.ts) z bezpiecznym fallbackiem SSR
│       └── astro.config.mjs
├── backend/                                 # Aplikacja Laravel 13.39 + Filament 5.11 + Sanctum 4.3
│   ├── app/
│   │   ├── Console/Commands/                # Komendy Artisan (orders:release-expired, multiserwis:import-legacy)
│   │   ├── Filament/                        # Kokpit, strona Analityka i ruch oraz 10 polskich zasobów Filament 5.11
│   │   ├── Http/Controllers/Api/            # Kontrolery REST API (Catalog, Auth, Contact, Order, Lms)
│   │   ├── Http/Resources/                  # Transformatory JSON (CourseJsonResource, MachineJsonResource, OrderStatusJsonResource)
│   │   ├── Mail/                            # Powiadomienia e-mail (InquiryReceivedMail z nagłówkiem Reply-To)
│   │   ├── Models/                          # 13 modeli Eloquent z automatyczną konwersją obrazów do WebP
│   │   ├── Services/AnalyticsService.php    # Serwis agregacji statystyk odwiedzin z tabel Umami MariaDB
│   │   └── Support/MediaOptimizer.php       # Serwis optymalizacji i konwersji uploadów JPG/PNG -> WebP
│   ├── config/                              # Konfiguracja Laravel 13 (Europe/Warsaw, pl, mysql InnoDB, cors, livewire)
│   ├── database/migrations/                 # Migracje tabel systemu LMS, zamówień i katalogu
│   ├── database/seeders/DatabaseSeeder.php  # Seeder 25 kursów, 3 maszyn, modułów, pytań i 4 kont ról
│   ├── resources/views/filament/            # Motyw MultiSerwis Industrial (custom-theme, kokpit, stopka Webisko)
│   ├── routes/                              # Trasy api.php, web.php (w tym /admin/sso) oraz console.php
│   └── tests/Feature/MultiserwisApiTest.php # Zestaw testów integracyjnych PHPUnit 12.5
├── packages/
│   └── shared/                              # Współdzielone definicje typów TS i katalog referencyjny (25 kursów, 3 maszyny)
├── public/                                  # Zasoby statyczne WebP, WOFF2, .htaccess, manifesty AI oraz bramka public/api/index.php
└── scripts/
    ├── build-hybrid.mjs                     # Skrypt budujący zunifikowaną paczkę produkcyjną dist/
    └── deploy-prod-seohost.ps1              # Skrypt wdrożeniowy SCP/SSH na serwer współdzielony SEOHost
```

---

## 3. Modele bazy danych i relacje

Szczegółowy wykaz kolumn znajduje się w pliku [`.antigravity/schema.md`](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/.antigravity/schema.md). Główne modele Eloquent w `backend/app/Models/`:

1. **`User`** (`users`) — implementuje `FilamentUser`, `HasApiTokens` (Sanctum) oraz `SoftDeletes`. Obsługuje 4 role:
   - `ADMIN` — pełny dostęp do wszystkich zasobów w Filament CMS, zarządzania użytkownikami (`UserResource`) i ustawieniami ośrodka (`SiteSettingResource`).
   - `MANAGER` — dostęp do zasobów operacyjnych w Filament CMS (kursy, lekcje, pytania, zapisy kursantów, zamówienia, zapytania ofertowe, zgłoszenia wsparcia) z zablokowanym dostępem do zarządzania kontami użytkowników (`UserResource::canAccess()`) i konfiguracji systemowej (`SiteSettingResource::canAccess()`), zwracającym `403 Forbidden`.
   - `COMPANY_GUARDIAN` — opiekun firmy B2B zarządzający pracownikami powiązanymi z jego firmą (`company_name`).
   - `STUDENT` — kursant indywidualny lub pracownik firmy posiadający relację `enrollments()` oraz `lessonProgress()`.
2. **`SiteSetting`** (`site_settings`) — singleton (`id = 1`) przechowujący dane teleadresowe biura i poligonu w Kutnie oraz domyślne ustawienia SEO/OpenGraph (z automatyczną konwersją `default_og_image` do `.webp`).
3. **`Course`** (`courses`) — kurs zawodowy z kodami (`c1`–`c25`), relacjami `modules()`, `questions()`, `enrollments()` oraz automatyczną konwersją wgrywanych grafik do formatu `.webp` w hooku `saving`.
4. **`CourseModule`** (`course_modules`) i **`CourseLesson`** (`course_lessons`) — struktura modułów i lekcji (`video`, `text`, `test`, `quiz`) wraz z chronionymi plikami na dysku `local` (`digital_file_path`).
5. **`ExamQuestion`** (`exam_questions`) — pytania egzaminacyjne (`SINGLE_CHOICE`, `MULTIPLE_CHOICE`, JSON `options`, `correct_answer`, `explanation`).
6. **`Machine`** (`machines`) — flota maszyn na wynajem (`m1`–`m3`) z parametrami technicznymi w kolumnie JSON `specs` i konwersją zdjęć do `.webp`.
7. **`Order`** (`orders`) — zamówienia szkoleń z automatycznie generowanym `public_token` (UUID v4) chroniącym przed atakami IDOR oraz z klauzulami `nullOnDelete()` dla `user_id` i `course_id` (ochrona dokumentacji księgowej). Gdy status zamówienia zmienia się na `PAID` (przez webhook lub w Filament CMS), model automatycznie aktywuje przypisanie `Enrollment` dla kursanta.
8. **`Enrollment`** (`enrollments`) i **`LessonProgress`** (`lesson_progress`) — zapisy na szkolenia oraz rejestr ukończonych lekcji.
9. **`Ticket`** (`tickets`) i **`TicketMessage`** (`ticket_messages`) — dwukierunkowa komunikacja kursantów i opiekunów B2B z kadrą instruktorską.
10. **`Inquiry`** (`inquiries`) — zapytania z formularzy kontaktowych, szybkich zapisów i wynajmu maszyn.

---

## 4. Panel administracyjny (Filament 5.11 CMS)

Panel dostępny jest pod adresem `https://panel.multiserwis.edu.pl/admin/kokpit` (logowanie: `/admin/logowanie` lub automatyczne SSO z szuflady logowania na stronie głównej poprzez `/admin/sso?sso_token=...`).

### Zasoby Filament (`backend/app/Filament/Resources/`)
Wszystkie zasoby posiadają pełne polskie etykiety w Sentence case (zgodnie z regułą *Zero Title Case*) oraz walidację spójną z bazą MySQL:

| Grupa nawigacji | Zasób | Klasa | Uprawnienia |
| :--- | :--- | :--- | :--- |
| **Katalog i oferta** | Szkolenia i kursy | `CourseResource` | `ADMIN`, `MANAGER` |
| **Katalog i oferta** | Lekcje e-learningowe | `CourseLessonResource` | `ADMIN`, `MANAGER` |
| **Katalog i oferta** | Pytania egzaminacyjne | `ExamQuestionResource` | `ADMIN`, `MANAGER` |
| **Katalog i oferta** | Maszyny na wynajem | `MachineResource` | `ADMIN`, `MANAGER` |
| **Platforma LMS i sprzedaż** | Zapisy kursantów (LMS) | `EnrollmentResource` | `ADMIN`, `MANAGER` |
| **Platforma LMS i sprzedaż** | Zamówienia i płatności | `OrderResource` | `ADMIN`, `MANAGER` |
| **Obsługa klienta** | Zapytania z formularzy | `InquiryResource` | `ADMIN`, `MANAGER` |
| **Obsługa klienta** | Zgłoszenia wsparcia (LMS) | `TicketResource` | `ADMIN`, `MANAGER` |
| **Administracja** | Użytkownicy i role | `UserResource` | Tylko `ADMIN` |
| **Administracja** | Ustawienia ośrodka | `SiteSettingResource` | Tylko `ADMIN` |

---

## 5. Endpointy REST API i integracje

Wszystkie trasy zdefiniowane są w `backend/routes/api.php` i obsługiwane zarówno bezpośrednio przez `panel.multiserwis.edu.pl/api/*`, jak i przez bramkę `public/api/index.php` na domenach `multiserwis.edu.pl` oraz `szkolenia.multiserwis.edu.pl`:

### Endpointy publiczne
- `GET /api/health` — status silnika Laravel 13.39 i połączenia z bazą danych.
- `GET /api/settings` — globalne dane teleadresowe ośrodka MultiSerwis Kutno.
- `GET /api/courses` — pełny katalog opublikowanych kursów (`CourseJsonResource`).
- `GET /api/courses/{slugOrId}` — szczegóły kursu wraz z programem, modułami i pytaniami.
- `GET /api/machines` — katalog maszyn budowlanych na wynajem (`MachineJsonResource`).
- `POST /api/contact` — zapis zapytania w tabeli `inquiries` (limit `throttle:15,1`) oraz wysyłka powiadomienia e-mail `InquiryReceivedMail` z nagłówkiem `Reply-To` ustawionym na adres klienta.
- `POST /api/orders` — utworzenie zamówienia na kurs (limit `throttle:10,1`), zwraca bezpieczny `publicToken` (UUID).
- `GET /api/orders/{publicToken}/status` — bezpieczny odczyt statusu zamówienia po UUID (`OrderStatusJsonResource`, brak wycieku danych osobowych PII).
- `POST /api/auth/session` (alias `POST /api/auth/login`) — logowanie zwracające token Bearer Laravel Sanctum oraz obiekt `user` z rolą.
- `POST /api/auth/register` — rejestracja nowego kursanta (`STUDENT`) lub opiekuna firmy (`COMPANY_GUARDIAN`).

### Endpointy chronione (`auth:sanctum`)
- `GET /api/auth/me` oraz `GET /api/auth/session` — weryfikacja aktywnego tokenu i pobranie profilu zalogowanego użytkownika (`authenticated: true`).
- `POST /api/auth/logout` oraz `DELETE /api/auth/session` — unieważnienie bieżącego tokenu Sanctum.
- `GET /api/lms/dashboard` oraz `GET /api/lms/courses` — lista kursów przypisanych do zalogowanego kursanta wraz z procentowym postępem i liczbą ukończonych lekcji.
- `GET /api/lms/courses/{courseId}` — pełna struktura modułów, lekcji (`video`, `text`, `test`), statusów zaliczenia oraz pytań testowych (`examQuestions`), chroniona weryfikacją aktywnego `Enrollment`.
- `POST /api/lms/progress` — zapis zaliczenia lekcji (`courseId`, `lessonId`, `completed`) i automatyczne przeliczenie postępu całego kursu (`0–100%`) oraz generowanie numeru zaświadczenia po osiągnięciu `100%`.
- `GET /api/lms/lessons/{lessonCode}/download` — autoryzowane pobieranie prywatnych materiałów PDF z dysku `local`.
- `GET /api/guardian/dashboard` oraz `GET /api/guardian/employees` — wykaz pracowników przypisanych do firmy opiekuna B2B wraz z ich kursami i postępami.
- `POST /api/guardian/employees` — utworzenie konta pracownika w firmie opiekuna B2B i natychmiastowe przypisanie go do wybranego szkolenia.
- `GET /api/tickets`, `POST /api/tickets`, `POST /api/tickets/{ticketId}/messages` — obsługa zgłoszeń pomocniczych i wiadomości w strefie kursanta i opiekuna B2B.

---

## 6. Architektura frontendu (Astro 7.4 + React 19 Islands)

1. **Warstwa statyczna SSG (`apps/site/src/pages/`)**:
   - Generuje 68 statycznych podstron HTML w czasie budowania (`npm run build`), w tym stronę główną (`/`), strony kategorii (`/szkolenia/udt`, `/szkolenia/imbigs`, `/szkolenia/sep`, `/szkolenia/spawalnictwo`, `/szkolenia/pozostale`), 50+ ścieżek kanonicznych i aliasów dla wszystkich 25 szkoleń (`/szkolenia/[slug].astro`), katalog wynajmu (`/wynajem`), usługi serwisowe (`/uslugi`), harmonogram (`/harmonogram`), formularz zapisu (`/rejestracja`) oraz kontakt (`/kontakt`).
   - Każda strona posiada pełne dane strukturalne Schema.org JSON-LD (`Course`, `FAQPage`, `LocalBusiness`, `Service`, `BreadcrumbList`).
2. **Wyspy interaktywne React 19 (`apps/site/src/components/islands/`)**:
   - `CourseFinderIsland.tsx` — interaktywna wyszukiwarka i filtrowanie szkoleń na żywo z ekspresowym modalem zapisu oraz automatyczną synchronizacją z `/api/courses`.
   - `LmsPortalIsland.tsx` — kompletna aplikacja e-learningowa dla kursantów (`STUDENT`) oraz opiekunów firm (`COMPANY_GUARDIAN`), osadzona na stronach `/panel`, `/panel/kursant` i `/panel/opiekun` (oraz jako strona główna subdomeny `szkolenia.multiserwis.edu.pl`).
3. **Defensywne pobieranie danych (`apps/site/src/utils/api.ts`)**:
   - Wszystkie wywołania `fetchCourses()` i `fetchMachines()` weryfikują typ odpowiedzi (`Array.isArray(...)`) i łączą dane z API z katalogiem referencyjnym `@multiserwis/shared`, dzięki czemu `npm run build` nigdy nie ulega awarii nawet przy pustej bazie danych lub braku połączenia sieciowego.

---

## 7. Zmienne środowiskowe i konfiguracja

Plik `backend/.env` (wzór w `backend/.env.example`):

```ini
APP_NAME="MultiSerwis Szkolenia CMS"
APP_ENV=production
APP_URL=https://panel.multiserwis.edu.pl
FRONTEND_URL=https://multiserwis.edu.pl
LMS_URL=https://szkolenia.multiserwis.edu.pl

APP_LOCALE=pl
APP_FALLBACK_LOCALE=pl
APP_TIMEZONE=Europe/Warsaw

# Produkcyjna baza danych MySQL / MariaDB 11.4 na SEOHost
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=srv127364_szkolenia
DB_USERNAME=srv127364_szkolenia
DB_PASSWORD="<haslo_bazy_mysql>"

# Konfiguracja SMTP (SEOHost)
MAIL_MAILER=smtp
MAIL_HOST=h108.seohost.pl
MAIL_PORT=465
MAIL_USERNAME=kontakt@multiserwis.edu.pl
MAIL_PASSWORD="<haslo_smtp>"
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="kontakt@multiserwis.edu.pl"
MAIL_FROM_NAME="MultiSerwis Kutno - Szkolenia"
MAIL_NOTIFICATION_TO="multiserwis.kutno@gmail.com"
```

---

## 8. Lokalny rozwój i budowanie projektu

### Wymagania lokalne
- PHP `>= 8.4` z rozszerzeniami `pdo_mysql`, `pdo_sqlite`, `gd`, `mbstring`, `openssl`
- Composer `2.x`
- Node.js `>= 22.x` / `26.x` oraz npm

### Uruchomienie lokalne krok po kroku
```powershell
# 1. Instalacja zależności i przygotowanie bazy backendu (Laravel 13 + Filament 5)
cd backend
composer install
php artisan migrate --seed
php artisan serve --port=8000

# 2. W drugim terminalu — uruchomienie frontendu Astro 7 + React 19 Islands
cd ..
npm install
npm run dev
```

### Budowanie produkcyjne i testy automatyczne
```powershell
# Testy integracyjne PHPUnit 12.5 (backend Laravel 13)
cd backend
php artisan test

# Budowanie pełnej paczki produkcyjnej Astro 7 + React 19 Islands do katalogu dist/
cd ..
npm run build
```

---

## 9. Wdrożenie produkcyjne (Deployment na SEOHost)

Wdrożenie na serwer współdzielony SEOHost (`h108.seohost.pl`, port `57185`, konto `srv127364`) jest w pełni zautomatyzowane skryptem PowerShell:

```powershell
npm run deploy:prod
```

Skrypt `scripts/deploy-prod-seohost.ps1` wykonuje kolejno:
1. Buduje paczkę frontendową `dist/` (`npm run build`).
2. Pakuje `dist/` oraz `backend/` (z wykluczeniem `.env`, `node_modules` i lokalnych plików SQLite).
3. Przesyła archiwa przez `scp` na `h108.seohost.pl`.
4. Rozpakowuje frontend do `multiserwis.edu.pl/public_html` oraz `szkolenia.multiserwis.edu.pl/public_html` (mapując `panel/index.html` jako `index.html` dla subdomeny szkoleniowej).
5. Rozpakowuje backend Laravel 13 do `/home/srv127364/domains/panel.multiserwis.edu.pl/backend` oraz publikuje punkt wejścia do `panel.multiserwis.edu.pl/public_html`.
6. Uruchamia na serwerze:
   - `php artisan migrate --force`
   - `php artisan db:seed --force`
   - `php artisan multiserwis:import-legacy` (bezstratna migracja rekordów z dawnej bazy SQLite, jeśli istnieje)
   - `php artisan filament:assets` oraz `php artisan optimize:clear`
   - Tworzy dowiązania symboliczne `public_html/storage -> backend/storage/app/public`.

### Harmonogram zadań Cron (DirectAdmin SEOHost)
W panelu DirectAdmin dla konta `srv127364` należy utrzymywać wpis Cron uruchamiany co minutę:
```cron
* * * * * cd /home/srv127364/domains/panel.multiserwis.edu.pl/backend && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```
Zadanie automatycznie wykonuje komendę `orders:release-expired` (`->everyFiveMinutes()->withoutOverlapping()`).

---

## 10. Bezpieczeństwo, RODO i lista kontrolna audytu

1. **Ochrona przed IDOR i wyciekiem PII:**
   - Publiczny odczyt statusu zamówienia (`/api/orders/{public_token}/status`) wymaga nieodgadnionego identyfikatora UUID v4 (`public_token`) i zwraca wyłącznie `OrderStatusJsonResource` (bez adresu e-mail, telefonu, NIP-u i nazwiska klienta).
2. **Ochrona integralności księgowej:**
   - Tabela `orders` używa `nullOnDelete()` zamiast `cascadeOnDelete()`, dzięki czemu usunięcie konta użytkownika nigdy nie kasuje historii transakcji i zamówień.
3. **Izolacja uprawnień ról (`ADMIN` vs `MANAGER` vs `COMPANY_GUARDIAN` vs `STUDENT`):**
   - W panelu Filament 5.11 rola `MANAGER` ma zablokowany dostęp do `UserResource` oraz `SiteSettingResource` zarówno w nawigacji, jak i na poziomie autoryzacji HTTP (`403 Forbidden`).
   - Endpointy `/api/guardian/*` weryfikują rolę opiekuna firmy, a zapytania o pracowników są ściśle filtrowane po powiązaniu z firmą zalogowanego opiekuna.
4. **Bezpieczne logowanie SSO do Filament CMS (Single-Use Token Revocation):**
   - Trasa `/admin/sso` w `backend/routes/web.php` natychmiast po uwierzytelnieniu i odświeżeniu sesji unieważnia (`$accessToken->delete()`) przekazany token Sanctum, uniemożliwiając jego ponowne wykorzystanie w przypadku wycieku z logów URL (`access.log`).
5. **Obsługa błędów formularzy (Eliminacja False-Positive Submission):**
   - Formularze `rejestracja.astro`, `kontakt.astro` oraz modal `CourseFinderIsland.tsx` weryfikują status odpowiedzi `res.ok`. W przypadku błędu walidacji (422) lub limitu (429) błędy są mapowane bezpośrednio pod poszczególne pola oraz w zbiorczym boksie alertowym nad przyciskiem CTA, a widok płynnie centruje się na pierwszym błędnym elemencie. Komunikat sukcesu pojawia się wyłącznie przy kodzie `200/201`.
6. **Ergonomia dotykowa smartfonów (Blokada iOS Safari Auto-Zoom):**
   - Wszystkie pola `<input>`, `<select>` i `<textarea>` w formularzach publicznych, szufladzie logowania i wyspie LMS posiadają rozmiar minimum 16px na ekranach dotykowych (`text-base md:text-sm`), eliminując niepożądane przybliżanie widoku w iOS Safari.
7. **Draft-by-Default dla nowych kursów:**
   - Pole `is_active` w formularzu `CourseResource` w Filament CMS ma ustawioną wartość domyślną `false`, zapobiegając przypadkowej publikacji nieukończonego kursu w katalogu SEO.
8. **Optymalizacja mediów i limit uploadu:**
   - `backend/config/livewire.php` posiada limit `max:51200` (50 MB), a klasa `MediaOptimizer` automatycznie konwertuje przesyłane w Filament CMS obrazy JPG/PNG do formatu `.webp`.
9. **Polityka Cookieless & Self-Hosted Umami Analytics (RODO Privacy-First):**
   - Portal publiczny `multiserwis.edu.pl` działa w standardzie Cookieless (lokalne fonty WOFF2, brak zewnętrznych trackerów firm trzecich jak GA4 czy Meta Pixel).
   - Analityka ruchu jest w 100% self-hosted na subdomenie `https://stats.multiserwis.edu.pl` za pomocą oprogramowania **Umami v2** (website ID: `fffb3ad4-dc24-48dc-b99f-6263eb60a221`). Tracker nie zapisuje ciasteczek, anonimizuje adresy IP haszowane solą i nie wymaga wyświetlania inwazyjnych bannerów zgód (zgodność z wytycznymi UODO i ePrivacy).
   - W `BaseLayout.astro` zaimplementowano uśpiony komponent `CookieBanner.astro` z symetryczną wagą wizualną przycisków 1:1 (*„Tylko niezbędne”* / *„Zezwól na wszystkie”*), gotowy do natychmiastowej aktywacji w razie potrzeby.

---

## 11. Changelog audytu produkcyjnego (Listopad 2026)

- **Self-Hosted Umami Analytics (`stats.multiserwis.edu.pl`):**
  - Uruchomiono produkcyjną aplikację Umami v2 w środowisku CloudLinux Node.js 20 Passenger na SEOHost.
  - Skonfigurowano pełną izolację bazy danych – Umami korzysta z dedykowanych tabel w bazie `srv127364_szkolenia`.
  - Zarejestrowano witrynę `MultiSerwis Szkolenia` (`multiserwis.edu.pl`) z identyfikatorem `fffb3ad4-dc24-48dc-b99f-6263eb60a221`.
  - Wpięto skrypt `script.js` do szablonu bazowego `BaseLayout.astro` i zweryfikowano poprawność rejestracji zdarzeń przez endpoint `/api/send`.

- **Natywna analityka i statystyki w Filament CMS (`/admin/analityka`):**
  - Utworzono dedykowaną stronę w CMS `AnalyticsPage.php` oraz serwis agregujący `AnalyticsService.php` czytający bezpośrednio z tabel Umami w bazie MariaDB `srv127364_szkolenia`.
  - Wdrożono kafelki KPI na głównym Kokpicie (odwiedzający dzisiaj, w tygodniu, odsłony).
  - Wdrożono podstronę z wykresem dynamiki wizyt z ostatnich 14 dni, rankingiem najpopularniejszych kursów z bezpośrednim linkiem do edycji, podziałem źródeł ruchu (Google, Facebook, bezpośrednie) oraz urządzeń (desktop vs mobile).
  - Dodano test integracyjny `test_analytics_service_and_filament_page_integration` (13 testów, 84 asercje PASS).

- **Formularze & Bezpieczeństwo leadów:**
  - Naprawiono obsługę `fetch('/api/contact')` w `rejestracja.astro`, `kontakt.astro` i `CourseFinderIsland.tsx` – wyeliminowano fałszywe komunikaty sukcesu przy błędach 422/429/500, dodano mapowanie błędów pod polami i zbiorcze alerty nad przyciskami submit.
- **Ergonomia mobilna:**
  - Zaktualizowano klasy pól formularzy z `text-sm` (14px) do `text-base md:text-sm` w celu eliminacji przymusowego Auto-Zoomu w przeglądarce Safari na iOS.
- **Autoryzacja i SSO:**
  - Dodano automatyczne unieważnianie tokenu Sanctum po pomyślnym uwierzytelnieniu sesji przez `/admin/sso` (zabezpieczenie jednorazowości).
  - Rozszerzono zestaw testów `MultiserwisApiTest.php` o test `test_admin_sso_login_and_token_revocation` (12 testów, 71 asercji PASS).
- **Filament CMS & Baza danych:**
  - Ustawiono `is_active = false` (Draft-by-Default) w `CourseResource.php`.
  - Uelastyczniono hasła w `DatabaseSeeder.php` poprzez pobieranie z `.env` (`ADMIN_INITIAL_PASSWORD` itp.) z bezpiecznym fallbackiem.
- **Zgodność RODO:**
  - Dodano uśpiony komponent `CookieBanner.astro` w `BaseLayout.astro` (1:1 Zero Dark Patterns).
- **Separacja baz danych i wdrożenie produkcyjne MariaDB 11.4:**
  - Utworzono i podpięto dedykowaną, izolowaną bazę produkcyjną `srv127364_szkolenia` na serwerze SEOHost (`h108.seohost.pl`), rozdzielając odnogę szkoleniową od odnogi usługowej (`multiserwis.tech`).
  - Przeprowadzono migrację schematu tabel, seeding użytkowników oraz import 25 kursów zawodowych do silnika InnoDB (MariaDB 11.4.13).
  - Skonfigurowano automatyczny harmonogram Cron (`* * * * * artisan schedule:run`).
- **Wdrożenie autentycznych zdjęć bazy szkoleniowej (`/images/baza/`):**
  - Wyekstrahowano i zoptymalizowano do formatu WebP 25 autentycznych zdjęć ze starej strony ośrodka (`multiserwis.kutno.pl/realizacje.html`), dokumentujących realną infrastrukturę dydaktyczną MultiSerwis.
  - Wyselekcjonowano kluczowe zdjęcia do dedykowanego katalogu `public/images/baza/` (plac manewrowy przy ul. Przemysłowej 2 z wózkami widłowymi Yale oznaczonymi tabliczką „L”, poligon robót ziemnych IMBiGS/ŚBŁ-WIT z ciężką koparką i ładowarką kołową Hyundai, sala wykładowa przy ul. Siemiradzkiego 18 z fantomem do resuscytacji i rzutnikiem, ładowarki teleskopowe obrotowe Genie, podesty nożycowe JLG, żuraw przenośny Fassi HDS oraz spawalnia).
  - Zaktualizowano podstronę `/o-nas` (`apps/site/src/pages/o-nas.astro`), zastępując grafiki renderowane autentycznym zdjęciem placu manewrowego oraz dodając 4-kolumnową galerię obiektów ośrodka w Kutnie.
  - Wzbogacono sekcję dlaczego warto wybrać MultiSerwis na stronie głównej `/` (`apps/site/src/pages/index.astro`), osadzając autentyczne ujęcie placu manewrowego przy ul. Przemysłowej 2 z bezpośrednim linkiem do prezentacji bazy.
  - Wszystkie zdjęcia posiadają zoptymalizowane wymiary, atrybuty `loading="lazy"`, czytelne opisy `alt` i nazwy plików zgodne z wytycznymi SEO.
- **Frontend & Uśpienie platformy LMS:**
  - Ukryto przycisk *Strefa kursanta* w nawigacji desktopowej i mobilnej (`SiteHeader.astro`) do czasu uruchomienia pierwszego pełnego kursu online – serwis skupia się obecnie w 100% na zapisach na kursy stacjonarne.
  - Zaktualizowano komunikację na podstronie `/harmonogram` (publikacja cotygodniowego planu zjazdów w każdy piątek na profilu Facebook `@szkoleniaKutno` i infolinii).
  - Zaktualizowano formułę badań lekarskich w formularzu `/rejestracja` oraz na kartach szkoleń (bezpłatne skierowanie wystawiane w dniu zapisu z opłatą pobieraną w przychodni medycyny pracy, bez podawania sztywnej kwoty 60 zł).
