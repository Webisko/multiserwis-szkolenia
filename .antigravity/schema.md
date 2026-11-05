# Schemat bazy danych — MultiSerwis Szkolenia (`multiserwis-szkolenia`)

- **Silnik produkcyjny:** MariaDB `11.4.13-MariaDB` / MySQL 8+ (`DB_CONNECTION=mysql`, `InnoDB`, `utf8mb4_unicode_ci`)
- **Lokalizacja migracji:** `backend/database/migrations/` (`0001_01_01_000000_create_users_table.php`, `2026_11_02_000001_create_multiserwis_lms_tables.php`)
- **Seeder startowy:** `backend/database/seeders/DatabaseSeeder.php` (25 kursów `c1`–`c25`, 3 maszyny `m1`–`m3`, moduły, lekcje, pytania egzaminacyjne, 5 kont systemowych; reguła `Zero CMS Overwrite` via `firstOrCreate`)

---

## 1. Tabela `users`
Przechowuje konta wszystkich 4 ról systemowych (`ADMIN`, `MANAGER`, `COMPANY_GUARDIAN`, `STUDENT`). Obsługuje `SoftDeletes` (`deleted_at`).

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Wewnętrzny klucz główny Eloquent / Sanctum |
| `legacy_id` | `VARCHAR(64)` | `UNIQUE`, `NULLABLE` | Zewnętrzny identyfikator migracyjny (np. `u_admin_webisko`, `u2`, `u3`, `u4`, `u5`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | Pełne imię i nazwisko użytkownika |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Adres e-mail (login) |
| `phone` | `VARCHAR(64)` | `NULLABLE` | Numer telefonu |
| `role` | `VARCHAR(32)` | `INDEX`, `DEFAULT 'STUDENT'` | Rola: `ADMIN`, `MANAGER`, `COMPANY_GUARDIAN`, `STUDENT` |
| `company_name` | `VARCHAR(255)` | `NULLABLE` | Nazwa firmy (dla `COMPANY_GUARDIAN` oraz przypisanych pracowników B2B) |
| `company_nip` | `VARCHAR(32)` | `NULLABLE` | Numer NIP firmy |
| `job_title` | `VARCHAR(255)` | `NULLABLE` | Stanowisko służbowe |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Czy konto jest aktywne |
| `email_verified_at` | `TIMESTAMP` | `NULLABLE` | Data weryfikacji e-mail |
| `password` | `VARCHAR(255)` | `NOT NULL` | Zahaszowane hasło (`bcrypt`) |
| `metadata` | `JSON` | `NULLABLE` | Dodatkowe atrybuty użytkownika (bezpieczne scalanie `array_replace`) |
| `remember_token` | `VARCHAR(100)` | `NULLABLE` | Token sesji Filament |
| `created_at` | `TIMESTAMP` | `NULLABLE` | Data utworzenia |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | Data aktualizacji |
| `deleted_at` | `TIMESTAMP` | `NULLABLE` | Data miękkiego usunięcia (`SoftDeletes`) |

---

## 2. Tabela `site_settings`
Singleton (`id = 1`) przechowujący globalne dane teleadresowe i konfigurację SEO ośrodka MultiSerwis Kutno.

| Kolumna | Typ | Opis |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Klucz główny (`1`) |
| `site_name` | `VARCHAR(255)` | `Ośrodek Szkolenia Kadr MultiSerwis Kutno` |
| `company_legal_name` | `VARCHAR(255)` | `MULTISERWIS KUTNO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ` |
| `company_nip` | `VARCHAR(32)` | `7752676330` |
| `phone_training` | `VARCHAR(64)` | `+48 730 101 000` |
| `phone_training_secondary` | `VARCHAR(64)` | `+48 570 403 806` |
| `phone_rental` | `VARCHAR(64)` | `+48 730 202 000` |
| `email_office` | `VARCHAR(255)` | `biuro@multiserwis.edu.pl` |
| `email_notifications` | `VARCHAR(255)` | `szkolenia@multiserwis.tech` |
| `office_address` | `VARCHAR(255)` | `ul. Henryka Siemiradzkiego 18, 99-300 Kutno` |
| `training_ground_address` | `VARCHAR(255)` | `ul. Przemysłowa 2, 99-300 Kutno` |
| `opening_hours` | `VARCHAR(120)` | `Pon.–Pt.: 8:00 – 16:00` |
| `facebook_url` | `VARCHAR(255)` | `https://www.facebook.com/szkoleniaKutno/` |
| `top_bar_badge` | `VARCHAR(255)` | Komunikat wyróżniony na stronie głównej |
| `meta_title` | `VARCHAR(255)` | Domyślny tytuł SEO |
| `meta_description` | `TEXT` | Domyślny opis SEO |
| `default_og_image` | `VARCHAR(255)` | Domyślny obrazek OpenGraph (konwertowany do `.webp` przez `MediaOptimizer`) |
| `metadata` | `JSON` | Dodatkowe parametry konfiguracyjne (`krs`, `regon`, itd.) |
| `created_at` / `updated_at` | `TIMESTAMP` | Znaczniki czasu |

---

## 3. Tabela `courses`
Katalog szkoleń zawodowych UDT, IMBiGS (ŚBŁ-WIT), SEP, spawalniczych i BHP (`c1`–`c25`). Obsługuje `SoftDeletes` (`deleted_at`).

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Wewnętrzny klucz główny |
| `code` | `VARCHAR(32)` | `UNIQUE`, `NOT NULL` | Kod kursu (`c1`–`c25`) |
| `slug` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Przyjazny adres URL (np. `wozki-widlowe`) |
| `title` | `VARCHAR(255)` | `NOT NULL` | Pełna nazwa szkolenia |
| `category` | `VARCHAR(64)` | `INDEX`, `DEFAULT 'UDT'` | Kategoria: `UDT`, `IMBiGS`, `SEP`, `Spawalnictwo`, `Inne` |
| `duration` | `VARCHAR(64)` | `DEFAULT '35 godz.'` | Czas trwania szkolenia |
| `price_gross` | `DECIMAL(10,2)` | `DEFAULT 1000.00` | Cena brutto (zw. z VAT) używana w zamówieniach po stronie serwera |
| `promo_price_gross` | `DECIMAL(10,2)` | `NULLABLE` | Cena promocyjna brutto |
| `price_label` | `VARCHAR(64)` | `DEFAULT '1 000 zł'` | Etykieta ceny (np. `1 000 zł`) |
| `promo_price_label` | `VARCHAR(64)` | `NULLABLE` | Etykieta ceny promocyjnej |
| `image` | `VARCHAR(255)` | `NULLABLE` | Ścieżka do grafiki WebP |
| `is_popular` | `BOOLEAN` | `DEFAULT FALSE` | Wyróżnienie jako flagowe szkolenie |
| `has_online` | `BOOLEAN` | `DEFAULT FALSE` | Dostępność teorii e-learningowej 24/7 |
| `has_stationary` | `BOOLEAN` | `DEFAULT TRUE` | Dostępność zajęć stacjonarnych w Kutnie |
| `location` | `VARCHAR(255)` | `DEFAULT 'Kutno, ul. Przemysłowa 2'` | Miejsce zajęć praktycznych |
| `exam_body` | `VARCHAR(120)` | `NULLABLE` | Komisja egzaminacyjna (np. `Komisja UDT`, `Komisja ŚBŁ-WIT (IMBiGS)`) |
| `validity_period` | `VARCHAR(120)` | `NULLABLE` | Okres ważności uprawnień (np. `5 lat`, `10 lat`, `Bezterminowo`) |
| `short_description` | `TEXT` | `NULLABLE` | Skrócony opis kursu na karcie katalogowej |
| `description` | `LONGTEXT` | `NULLABLE` | Pełny opis szkolenia |
| `syllabus` | `JSON` | `NULLABLE` | Lista zagadnień programowych (renderowana w `[slug].astro`) |
| `requirements` | `JSON` | `NULLABLE` | Wymagania wstępne dla kandydatów |
| `sort_order` | `INT` | `DEFAULT 0` | Kolejność sortowania |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Status publikacji w katalogu |
| `meta_title` | `VARCHAR(255)` | `NULLABLE` | Tytuł meta SEO |
| `meta_description` | `TEXT` | `NULLABLE` | Opis meta SEO |
| `og_image` | `VARCHAR(255)` | `NULLABLE` | Obrazek OpenGraph (`.webp`) |
| `metadata` | `JSON` | `NULLABLE` | Dodatkowe dane JSON |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu i `SoftDeletes` |

---

## 4. Tabela `course_modules`
Moduły tematyczne przypisane do kursu e-learningowego.

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `course_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> courses.id`, `cascadeOnDelete` | Powiązany kurs |
| `code` | `VARCHAR(64)` | `UNIQUE`, `NOT NULL` | Kod modułu (np. `c1m1`) |
| `title` | `VARCHAR(255)` | `NOT NULL` | Tytuł modułu |
| `description` | `TEXT` | `NULLABLE` | Opis modułu |
| `sort_order` | `INT` | `DEFAULT 0` | Kolejność wyświetlania |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Czy moduł jest aktywny |
| `created_at` / `updated_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu |

---

## 5. Tabela `course_lessons`
Lekcje e-learningowe (`video`, `text`, `test`, `quiz`) wewnątrz modułów.

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `course_module_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> course_modules.id`, `cascadeOnDelete` | Powiązany moduł |
| `course_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> courses.id`, `cascadeOnDelete` | Powiązany kurs |
| `code` | `VARCHAR(64)` | `UNIQUE`, `NOT NULL` | Kod lekcji (np. `c1l1`) |
| `title` | `VARCHAR(255)` | `NOT NULL` | Tytuł lekcji |
| `type` | `VARCHAR(32)` | `DEFAULT 'video'` | Typ: `video`, `text`, `test`, `quiz` |
| `duration` | `VARCHAR(64)` | `DEFAULT '15:00'` | Szacowany czas nauki |
| `content` | `LONGTEXT` | `NULLABLE` | Konspekt HTML / materiał dydaktyczny |
| `video_url` | `VARCHAR(255)` | `NULLABLE` | Adres URL strumienia wideo |
| `digital_file_path` | `VARCHAR(255)` | `NULLABLE` | Ścieżka do pliku chronionego na dysku prywatnym `local` |
| `is_locked` | `BOOLEAN` | `DEFAULT FALSE` | Blokada sekwencyjna lekcji |
| `sort_order` | `INT` | `DEFAULT 0` | Kolejność w module |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Czy lekcja jest aktywna |
| `metadata` | `JSON` | `NULLABLE` | Dodatkowe dane JSON |
| `created_at` / `updated_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu |

---

## 6. Tabela `exam_questions`
Oficjalna baza pytań kontrolnych i egzaminacyjnych UDT / ŚBŁ-WIT (IMBiGS) / SEP.

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `course_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> courses.id`, `cascadeOnDelete` | Powiązany kurs |
| `course_module_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> course_modules.id`, `NULLABLE`, `nullOnDelete` | Opcjonalnie powiązany moduł |
| `code` | `VARCHAR(64)` | `INDEX`, `NULLABLE` | Kod pytania (np. `q1`) |
| `question` | `TEXT` | `NOT NULL` | Treść pytania egzaminacyjnego |
| `type` | `VARCHAR(32)` | `DEFAULT 'SINGLE_CHOICE'` | Typ: `SINGLE_CHOICE`, `MULTIPLE_CHOICE` |
| `difficulty` | `VARCHAR(32)` | `DEFAULT 'MEDIUM'` | Trudność: `EASY`, `MEDIUM`, `HARD` |
| `options` | `JSON` | `NOT NULL` | Tablica wariantów odpowiedzi |
| `correct_answer` | `JSON` | `NOT NULL` | Tablica indeksów poprawnych odpowiedzi (np. `[1]`) |
| `explanation` | `TEXT` | `NULLABLE` | Wyjaśnienie instruktora |
| `sort_order` | `INT` | `DEFAULT 0` | Kolejność |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Czy pytanie jest aktywne |
| `created_at` / `updated_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu |

---

## 7. Tabela `machines`
Katalog floty maszyn budowlanych i podestów ruchomych na wynajem (`m1`–`m3`). Obsługuje `SoftDeletes` (`deleted_at`).

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `code` | `VARCHAR(32)` | `UNIQUE`, `NOT NULL` | Kod maszyny (`m1`, `m2`, `m3`) |
| `slug` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Przyjazny adres URL |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nazwa modelu (np. `Manitou MRT 2150 Privilege`) |
| `type` | `VARCHAR(255)` | `NOT NULL` | Typ maszyny (np. `Ładowarka teleskopowa obrotowa`) |
| `height` | `VARCHAR(64)` | `NULLABLE` | Wysokość robocza |
| `capacity` | `VARCHAR(64)` | `NULLABLE` | Udźwig maksymalny |
| `weight` | `VARCHAR(64)` | `NULLABLE` | Masa własna |
| `daily_price_net` | `DECIMAL(10,2)` | `NULLABLE` | Stawka dobowa netto |
| `image` | `VARCHAR(255)` | `NULLABLE` | Zdjęcie WebP |
| `description` | `TEXT` | `NULLABLE` | Opis maszyny i osprzętu |
| `specs` | `JSON` | `NULLABLE` | Parametry techniczne (`height`, `capacity`, `weight`) |
| `sort_order` | `INT` | `DEFAULT 0` | Kolejność sortowania |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Widoczność w katalogu wynajmu |
| `meta_title` / `meta_description` / `og_image` | `VARCHAR` / `TEXT` | `NULLABLE` | Pola SEO i OpenGraph |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu i `SoftDeletes` |

---

## 8. Tabela `orders`
Zamówienia szkoleń indywidualnych i grupowych B2B (ochrona przed IDOR poprzez `public_token` UUID; `nullOnDelete` dla `user_id` i `course_id` w celu ochrony dokumentacji księgowej).

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `public_token` | `UUID` | `UNIQUE`, `NOT NULL` | Bezpieczny token publiczny do sprawdzania statusu (`/api/orders/{publicToken}/status`) |
| `order_number` | `VARCHAR(64)` | `UNIQUE`, `NOT NULL` | Numer zamówienia (np. `ZAM/2026/0001`) |
| `user_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> users.id`, `NULLABLE`, `nullOnDelete` | Powiązany użytkownik |
| `course_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> courses.id`, `NULLABLE`, `nullOnDelete` | Powiązany kurs |
| `course_code` | `VARCHAR(32)` | `NULLABLE` | Kod zamawianego kursu (zachowany przy usunięciu kursu) |
| `course_name` | `VARCHAR(255)` | `NOT NULL` | Nazwa zamawianego kursu (zachowana przy usunięciu kursu) |
| `customer_name` | `VARCHAR(255)` | `NOT NULL` | Imię i nazwisko zamawiającego |
| `customer_email` | `VARCHAR(255)` | `NOT NULL` | E-mail zamawiającego |
| `customer_phone` | `VARCHAR(64)` | `NULLABLE` | Telefon zamawiającego |
| `company_name` | `VARCHAR(255)` | `NULLABLE` | Nazwa firmy (dla zamówień B2B) |
| `company_nip` | `VARCHAR(32)` | `NULLABLE` | NIP firmy |
| `unit_price_gross` | `DECIMAL(10,2)` | `DEFAULT 0` | Cena jednostkowa wyliczona na serwerze |
| `vat_rate` | `VARCHAR(16)` | `DEFAULT 'zw'` | Stawka VAT (`zw`) |
| `amount_gross` | `DECIMAL(10,2)` | `DEFAULT 0` | Kwota całkowita wyliczona na serwerze |
| `currency` | `VARCHAR(8)` | `DEFAULT 'PLN'` | Waluta (`PLN`) |
| `provider` | `VARCHAR(32)` | `DEFAULT 'TRADITIONAL'` | Metoda płatności: `TRADITIONAL`, `PRZELEWY24`, `STRIPE`, `INVOICE_B2B` |
| `status` | `VARCHAR(32)` | `INDEX`, `DEFAULT 'PENDING_PAYMENT'` | Status: `PENDING_PAYMENT`, `PAID`, `CANCELLED`, `EXPIRED` |
| `paid_at` | `TIMESTAMP` | `NULLABLE` | Data zaksięgowania wpłaty |
| `notes` | `TEXT` | `NULLABLE` | Uwagi do zamówienia |
| `metadata` | `JSON` | `NULLABLE` | Dodatkowe dane JSON |
| `created_at` / `updated_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu |

---

## 9. Tabela `enrollments`
Przypisania kursantów do kursów e-learningowych i stacjonarnych (`UNIQUE(user_id, course_id)`).

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `legacy_id` | `VARCHAR(64)` | `INDEX`, `NULLABLE` | Identyfikator migracyjny (`enr_1`, `enr_2`) |
| `user_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> users.id`, `cascadeOnDelete` | Kursant |
| `course_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> courses.id`, `cascadeOnDelete` | Kurs |
| `status` | `VARCHAR(32)` | `INDEX`, `DEFAULT 'ACTIVE'` | Status: `ACTIVE`, `COMPLETED`, `EXPIRED`, `SUSPENDED` |
| `progress` | `INT UNSIGNED` | `DEFAULT 0` | Postęp procentowy (`0–100`) |
| `next_lesson` | `VARCHAR(255)` | `NULLABLE` | Tytuł kolejnej lekcji do przerobienia |
| `completed_lessons` | `JSON` | `NULLABLE` | Tablica kodów ukończonych lekcji |
| `certificate_number` | `VARCHAR(120)` | `NULLABLE` | Numer wygenerowanego zaświadczenia (np. `MS/UDT/2026/0104`) |
| `expires_at` | `TIMESTAMP` | `NULLABLE` | Data ważności dostępu |
| `completed_at` | `TIMESTAMP` | `NULLABLE` | Data ukończenia części teoretycznej |
| `metadata` | `JSON` | `NULLABLE` | Dodatkowe dane JSON |
| `created_at` / `updated_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu |

---

## 10. Tabela `lesson_progress`
Rejestr zaliczonych lekcji przez poszczególnych kursantów (`UNIQUE(user_id, lesson_code)`).

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `user_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> users.id`, `cascadeOnDelete` | Kursant |
| `course_lesson_id` | `BIGINT UNSIGNED` | `FOREIGN KEY -> course_lessons.id`, `NULLABLE`, `nullOnDelete` | Powiązana lekcja |
| `lesson_code` | `VARCHAR(64)` | `INDEX`, `NOT NULL` | Kod lekcji (np. `c1l1`) |
| `completed` | `BOOLEAN` | `DEFAULT FALSE` | Czy zaliczono |
| `score` | `INT` | `NULLABLE` | Wynik testu (`0–100`) |
| `stopped_at` | `INT UNSIGNED` | `DEFAULT 0` | Sekunda zatrzymania wideo |
| `watch_time` | `INT UNSIGNED` | `DEFAULT 0` | Czas oglądania |
| `created_at` / `updated_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu |

---

## 11. Tabele `tickets` i `ticket_messages`
System zgłoszeń wsparcia technicznego, pytań do instruktora oraz obsługi B2B.

- `tickets`: `id` (`BIGINT UNSIGNED`), `ticket_number` (`VARCHAR(64)`, `UNIQUE`, np. `ZGL/2026/0001`), `user_id` (`FK -> users.id`, `nullOnDelete`), `subject`, `category` (`TECH`, `GENERAL`, `BILLING`), `status` (`OPEN`, `IN_PROGRESS`, `ANSWERED`, `CLOSED`), `created_at`, `updated_at`.
- `ticket_messages`: `id` (`BIGINT UNSIGNED`), `ticket_id` (`FK -> tickets.id`, `cascadeOnDelete`), `sender_id` (`FK -> users.id`, `nullOnDelete`), `sender_name`, `content` (`TEXT`), `is_internal` (`BOOLEAN`), `created_at`, `updated_at`.

---

## 12. Tabela `inquiries`
Zgłoszenia z formularzy kontaktowych (`/kontakt`), szybkiego zapisu (`/rejestracja`, wyszukiwarka kursów) oraz zapytań o wynajem maszyn (`/wynajem`).

| Kolumna | Typ | Klucz / Atrybuty | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Klucz główny |
| `name` | `VARCHAR(255)` | `NOT NULL` | Imię i nazwisko / nazwa firmy |
| `email` | `VARCHAR(255)` | `NOT NULL` | Adres e-mail (używany w nagłówku `Reply-To`) |
| `phone` | `VARCHAR(64)` | `NULLABLE` | Numer telefonu |
| `company` | `VARCHAR(255)` | `NULLABLE` | Nazwa firmy |
| `nip` | `VARCHAR(32)` | `NULLABLE` | NIP firmy |
| `subject` | `VARCHAR(255)` | `NULLABLE` | Kategoria / temat zgłoszenia |
| `course_name` | `VARCHAR(255)` | `NULLABLE` | Wybrany kurs lub maszyna |
| `inquiry_type` | `VARCHAR(32)` | `DEFAULT 'KONTAKT'` | Typ: `KONTAKT`, `INDYWIDUALNY`, `B2B`, `WYNAJEM`, `SERWIS` |
| `message` | `TEXT` | `NULLABLE` | Treść wiadomości |
| `status` | `VARCHAR(32)` | `INDEX`, `DEFAULT 'NEW'` | Status: `NEW`, `IN_PROGRESS`, `COMPLETED`, `ARCHIVED` |
| `is_spam` | `BOOLEAN` | `DEFAULT FALSE` | Flaga antyspamowa |
| `admin_notes` | `TEXT` | `NULLABLE` | Notatki wewnętrzne pracowników biura |
| `metadata` | `JSON` | `NULLABLE` | Dodatkowe dane JSON |
| `created_at` / `updated_at` | `TIMESTAMP` | `NULLABLE` | Znaczniki czasu |
