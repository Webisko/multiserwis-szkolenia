# Agent Instructions (Webisko/multiserwis-kutno)

This repository uses the unified **Astro 7.4 + React 19 Islands + Laravel 13.39 + Filament 5.11 (MySQL / MariaDB 11.4)** stack:
- **Frontend (`apps/site/`)**: Astro `v7.4.4` + `@astrojs/react` `v7.1.2` + React `v19.3.1` Islands + Tailwind CSS `v4.3.3` (`@tailwindcss/vite`) + TypeScript `v7.0.2`
- **Backend & CMS (`backend/`)**: Laravel `v13.39.0` + FilamentPHP `v5.11.0` + Livewire `v4.4.8` + Laravel Sanctum `v4.3.3` + PHP `8.4`
- **Database**: MySQL / MariaDB `11.4` (`DB_CONNECTION=mysql`, `InnoDB`, `utf8mb4_unicode_ci`)
- **Frontend build output**: `dist/` (`npm run build` via `scripts/build-hybrid.mjs`)
- **Hosting target**: SEOHost shared hosting (`h108.seohost.pl`, port `57185`, user `srv127364`, deployment via `scripts/deploy-prod-seohost.ps1`)
- **Full technical documentation**: `DOKUMENTACJA.md` and `.antigravity/schema.md`

---

## Subdomain Architecture on SEOHost (`h108.seohost.pl`)

1. **`https://multiserwis.edu.pl`** — Marketing & SEO Catalog (Astro 7.4 SSG + React 19 `CourseFinderIsland`)
2. **`https://szkolenia.multiserwis.edu.pl`** — Student LMS & Company Guardian B2B Portal (Astro 7.4 + React 19 `LmsPortalIsland`)
3. **`https://panel.multiserwis.edu.pl`** — Admin & Manager Backoffice (Native Laravel 13.39 + Filament 5.11 CMS at `/admin/kokpit`) + central REST API (`/api/*`)

---

## Safety Rails (Non-Negotiable)

1. **No risky changes without confirmation**
   - If a change affects authentication, payments, checkout flows, admin capabilities, user data, pricing, legal/consent/cookies, or security posture — stop and ask for explicit confirmation before implementing.
2. **Small, reversible steps**
   - Prefer small commits and localized edits.
3. **Protect Production deployment**
   - Ensure frontend build output remains `dist/` with `base: '/'`.
   - Ensure Apache/LiteSpeed routing (`public/.htaccess` and `public/api/index.php`) keeps working across subdomains.
4. **Never commit secrets**
   - Do not commit `.env`, `.env.local`, API keys, tokens, or credentials.
5. **Verification required**
   - Backend changes: must pass `cd backend && php artisan test`.
   - Frontend/build changes: must pass `npm run build`.
   - Keep `DOKUMENTACJA.md` and `.antigravity/schema.md` synchronized with any model, API, or CMS changes.
