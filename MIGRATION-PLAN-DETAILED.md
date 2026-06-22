# Plan migracji: Astro (site) + React (platform) + NestJS API (monorepo)

Data: 2026-02-10

## Cel

Zbudować docelową architekturę:

- `domena.pl` → publiczny serwis pod SEO/CWV (Astro SSG)
- `platforma.domena.pl` → aplikacja (React SPA)
- `api.domena.pl` → backend (NestJS + Prisma + PostgreSQL)

…przy jednoczesnym zachowaniu obecnego wdrożenia na GitHub Pages bez regresji:

- Vite `base` dla produkcji: `/multiserwis-kutno/`
- output buildu: `docs/`

## Założenia i ograniczenia

- Zakup szkolenia wymaga konta (rejestracja/logowanie na domenie głównej).
- Na start tylko jedna bramka płatności (jeszcze nie wybrana) — implementujemy model zamówień i statusy, ale bez integracji płatności.
- Nie ruszamy krytycznych parametrów `vite.config.ts` (base/outDir) dopóki działamy na GitHub Pages.
- Nie commitujemy sekretów (`.env*`, klucze API).

## Decyzja: lokalnie „hybrydowo” (rekomendowane)

- Frontendy (Astro + React/Vite) uruchamiamy natywnie na Windows (Node).
- Usługi zależne backendu uruchamiamy w Docker Compose:
  - PostgreSQL (tak)
  - Redis (opcjonalnie, ale może już stać w compose)
- Nie używamy Dev Containers (opcjonalne, na razie zbędne).

Szybkie komendy (lokalny dev):

- start usług: `docker compose -f docker-compose.dev.yml up -d`
- stop usług: `docker compose -f docker-compose.dev.yml down`

Przykładowy `DATABASE_URL` (lokalnie):

- `postgresql://postgres:postgres@localhost:5432/multiserwis_dev?schema=public`

## Wymagania lokalne (prerequisites)

- Docker Desktop (Windows) do uruchomienia Postgresa/Redisa.
- Wolne porty: `5432` (Postgres) i `6379` (Redis).
- Node.js LTS (20 lub 22).
- Nie commitujemy `.env*`; lokalne zmienne trzymamy w `.env.local` albo `.env` (gitignore).

## Struktura docelowa repo

Docelowo (po etapie migracji):

```
/apps
  /site        # Astro
  /platform    # obecna aplikacja React
  /api         # NestJS
/packages
  /shared      # wspólne typy + dane (np. Course)
```

### Ważne: strategia przejściowa (żeby nie zepsuć GitHub Pages)

Są dwa podejścia — w tym planie zakładamy najbezpieczniejsze.

**Podejście A (zalecane na teraz):**

- Zostawiamy obecną platformę w root repo (tak jak jest) do czasu przejścia na VPS.
- Dodajemy `apps/site` i `apps/api` równolegle.
- Dopiero po stabilizacji (i/lub przejściu na VPS) przenosimy platformę do `apps/platform`.

**Podejście B (bardziej ryzykowne):**

- Od razu przenosimy wszystko do `apps/platform` i robimy „wrapper” w root, żeby GH Pages nadal budowało.
- Więcej zmian naraz = większe ryzyko przerwy w deploy.

W tym dokumencie kroki są opisane jako A, a B jest na końcu jako alternatywa.

---

## Faza 0 — Bazowy porządek i punkt odniesienia (1–2h)

**Cel:** upewnić się, że punkt startu jest stabilny.

1. Zweryfikuj lokalnie, że platforma buduje się tak jak dziś:

- `npm install`
- `npm run build`

2. Sprawdź, że nic nie zmieniamy w:

- `vite.config.ts` (szczególnie `base` i `build.outDir`)

3. Ustal wersję Node:

- Preferuj Node LTS (np. 20 lub 22), najlepiej spiąć w przyszłości przez `.nvmrc` / `.node-version` (opcjonalne).

**Status:** ZROBIONE (build root przechodzi, output `docs/`).

**Akceptacja:** build produkuje `docs/` i aplikacja startuje w `npm run dev`.

---

## Faza 1 — Monorepo (workspaces) bez naruszania platformy (2–4h)

**Cel:** przygotować repo pod wiele aplikacji bez przenoszenia obecnej platformy.

1. W root repo dodajemy wsparcie na workspaces (npm workspaces):

- Ustawiamy `package.json` jako `private: true` i dopisujemy `workspaces`.

2. Tworzymy katalogi:

- `apps/site`
- `apps/api`
- `packages/shared`

3. Root skrypty zostają kompatybilne:

- `npm run dev`, `npm run build`, `npm run preview` nadal dotyczą obecnej platformy w root.
- Dodatkowo dopisujemy skrypty: `site:dev`, `site:build`, `api:dev`, `api:build`.

**Ryzyka:** minimalne, dopóki nie ruszamy Vite config i nie przenosimy plików.

**Status:** W DUZEJ MIERZE ZROBIONE.

- Workspaces i skrypty root dodane.
- Struktura apps/site + apps/api + packages/shared istnieje.

**Akceptacja:**

- platforma w root działa jak wcześniej
- można wejść do `apps/site` i uruchomić dev
- można wejść do `apps/api` i uruchomić dev

---

## Faza 2 — `packages/shared`: wspólne typy i dane (1–3h)

**Cel:** uniknąć duplikowania definicji kursów/typów między Astro a platformą.

1. W `packages/shared` tworzymy:

- `src/types.ts` (np. `Course`, `CourseId`, `Money`)
- `src/courses.ts` (tymczasowo: statyczna lista kursów / dane katalogowe)
- `src/index.ts` (eksport publiczny)

2. Ustawiamy build pakietu:

- najprościej: TypeScript build do `dist/` (tsc) i `exports` w `package.json`.

3. Podpinamy w platformie (root) jako dependency workspace:

- import typów/danych z `@shared/...`.

**Status:** CZESCIOWO ZROBIONE.

- `packages/shared` istnieje.
- Weryfikacja, czy root platforma faktycznie importuje dane/typy ze shared, jest jeszcze do sprawdzenia.

**Akceptacja:**

- platforma buduje się bez zmian UX
- dane/typy są współdzielone (brak duplikacji)

---

## Faza 3 — Astro `apps/site` (publiczna strona) (1–2 dni)

**Cel:** wystawić SEO‑friendly stronę główną + katalog + szczegóły + kontakt.

### 3.1 Scaffolding

1. Tworzymy Astro projekt w `apps/site`.
2. Konfigurujemy Tailwind v4 w oparciu o istniejące tokeny:

- przenosimy/udostępniamy `tailwind.config.js` (albo tworzymy osobny, ale z tymi samymi kolorami/fontami)
- zachowujemy style bazowe z `index.css` (tylko te publiczne; TipTap raczej zostaje w platformie)

### 3.2 Strony

Minimalny zestaw stron:

- `/` Home
- `/szkolenia` Katalog
- `/szkolenia/[slug]` Szczegóły kursu
- `/kontakt` Kontakt

Dane:

- w pierwszej wersji dane z `packages/shared` (statyczne)
- później: podmiana na API (SSR/SSG fetch)

### 3.3 UX: „kup” i konto

Ponieważ zakup wymaga konta:

- publiczny przycisk „Kup” powinien prowadzić do:
  - logowania/rejestracji (na domenie głównej)
  - po zalogowaniu przekierowanie do platformy (np. `platforma.domena.pl`) do finalizacji

Na tym etapie nie implementujemy płatności, tylko spójny flow nawigacyjny.

**Status:** ZROBIONE W ZAKRESIE MVP.

- `apps/site` istnieje, ma strony i assets.
- Styl i layout sa gotowe w podstawowym zakresie.

**Akceptacja:**

- build Astro działa lokalnie
- strony są wyrenderowane jako SSG/SSR (zgodnie z konfiguracją)
- styl wizualny używa tych samych tokenów co platforma

---

## Faza 4 — NestJS `apps/api` + Prisma (1–3 dni)

**Cel:** położyć fundamenty pod auth, kursy, zamówienia.

### 4.1 Scaffolding

1. Tworzymy NestJS w `apps/api`.
2. Dodajemy Prisma + PostgreSQL.
3. Konfigurujemy środowisko:

- `DATABASE_URL`
- (opcjonalnie) docker-compose dla Postgresa lokalnie

### 4.2 Moduły i kontrakty (bez płatności)

Minimalny zakres:

- `Auth` (rejestracja, logowanie, wylogowanie)
- `Users`
- `Courses` (read model do katalogu)
- `Orders` (utworzenie zamówienia; statusy)

Proponowane statusy zamówień:

- `DRAFT` (utworzone, nieopłacone)
- `PENDING_PAYMENT` (czeka na bramkę)
- `PAID` (opłacone)
- `CANCELLED`
- `FAILED`

### 4.3 Sesja / bezpieczeństwo (plan)

Docelowo (po przejściu na domeny):

- cookie httpOnly, `SameSite=Lax/None` zależnie od przepływu
- cookie na domenie `.domena.pl`, żeby działało na subdomenach

Na etapie local dev:

- najprościej: JWT w cookie + CORS dla `localhost` portów

**Status:** ZROBIONE W ZAKRESIE MVP, MIGRACJE LOKALNE DO POTWIERDZENIA.

- `apps/api` istnieje (NestJS + Prisma + Postgres).
- Moduly: Auth, Users, Courses, Orders, Questions, Progress, Tickets, Analytics.
- Prisma schema rozszerzona o role, pytania, progres, tickety.
- Prisma Client wygenerowany, API build przechodzi lokalnie.
- Testy API (`npm -C apps/api test`) przechodza lokalnie.
- `prisma migrate status` pokazuje baze jako aktualna.
- Migracje w repo istnieja, ale lokalne `prisma migrate dev` wymaga uruchomienia interaktywnego.

**Akceptacja:**

- migracje Prisma działają lokalnie
- rejestracja/logowanie działa (chociażby minimalnie)
- endpointy courses/orders działają

---

## Faza 5 — Integracja platformy z API (1–3 dni)

**Cel:** platforma (React) używa API zamiast mocków.

1. Wspólne typy DTO (opcjonalnie):

- generowanie typów z OpenAPI lub współdzielone typy w `packages/shared`.

2. Platforma:

- podpięcie logowania
- pobieranie kursów
- tworzenie zamówienia i przekierowanie do płatności (jeszcze nie, tylko stub)

**Status:** ZROBIONE W ZAKRESIE PODSTAWOWYM.

- Platforma uzywa `services/api.ts` i komunikacji z API dla logowania, kursow, zamowien, pytan, progresu, ticketow i analityki (fallbacky UI w razie braku danych).
- Dostep do ticketow zaostrzony (brak wgladu do cudzych zgloszen).

**Akceptacja:**

- „Kup” w platformie tworzy zamówienie w API (nawet jeśli płatność jest stub)
- użytkownik ma sesję

---

## Faza 6 — Platnosci (dopiero po wyborze bramki)

**Cel:** jedna bramka, webhooki, finalizacja statusów.

Do ustalenia przed startem implementacji:

- provider (np. Przelewy24 / Stripe / PayU / Tpay)
- wymagania dot. faktur/VAT
- czy płatność ma być na `domena.pl` czy wewnątrz platformy

**Zasada:** webhook jest źródłem prawdy o `PAID`.

---

## Faza 7 — Deploy docelowy na VPS (osobny etap)

**Cel:** przenieść produkcję z GitHub Pages na domeny i reverse proxy.

Zakres (high level):

- Nginx/Caddy: routing `domena.pl` → Astro, `platforma.*` → SPA, `api.*` → Nest
- TLS (Let’s Encrypt)
- baza Postgres (managed lub VPS)
- backupy
- logowanie i monitoring

---

## Checklista QA po drodze

Po każdej fazie:

- platforma: `npm run build` (w root) nadal przechodzi
- API: `npm run build` w `apps/api` przechodzi
- API: `npm -C apps/api test` przechodzi
- brak zmian w `docs/` wynikających z niezamierzonej zmiany konfiguracji
- brak commitów `.env*`

---

## Rollback (zawsze możliwy)

- Jeśli cokolwiek psuje GH Pages: wycofujemy zmiany w root Vite/platformie; workspaces/apps mogą pozostać nieużywane.
- Najbardziej ryzykowny moment to przeniesienie platformy do `apps/platform` — robimy to dopiero po pełnej stabilizacji.

---

## Alternatywa: Podejście B (od razu `apps/platform`)

Jeżeli jednak chcesz od razu przenieść platformę:

- przenieść pliki aplikacji do `apps/platform`
- w root zostawić „wrapper” `package.json` ze skryptami odpalającymi `npm --workspace apps/platform ...`
- dopilnować, aby `npm run build` w root nadal generował `docs/` i używał `base: /multiserwis-kutno/`

To podejście zrobimy dopiero z osobną checklistą i krótkim oknem na ewentualny rollback.
