<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MultiSerwis Szkolenia - E-Learning & Equipment Rental Platform

Welcome to the **MultiSerwis Szkolenia** system codebase. This project is a comprehensive, multi-role training management platform (LMS) and heavy equipment rental portal tailored for MultiSerwis, Kutno.

The application allows users to browse and purchase professional qualification courses (such as UDT, IMBiGS, SEP, and welding courses), attend online e-learning sessions with video streaming and interactive quizzes, track certificates, and request heavy machinery rental (e.g., forklifts, telehandlers, cherry pickers, cranes).

---

## 🛠️ Architecture & Monorepo Structure

This project is organized as an **npm monorepo** with multiple workspaces, allowing a clear separation between frontend platforms, backend APIs, and shared packages.

### Workspace Breakdown
* **Root Application (Vite + React + TypeScript)**: The main client platform. It serves as the landing page, training catalog, shopping cart, heavy machinery catalog, and houses all four user/admin dashboard panels.
  * Key files: [App.tsx](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/App.tsx), [constants.ts](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/constants.ts), [types.ts](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/types.ts).
* **`apps/api` (NestJS + Prisma + PostgreSQL + Redis)**: The backend REST API. It handles user authentication, database operations via Prisma ORM, Redis-backed session management, order processing, learning progress tracking, analytics compilation, and support tickets.
  * Location: [apps/api/](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/apps/api)
* **`apps/site` (Astro)**: A static informational portal / blog package for SEO-optimized content marketing.
  * Location: [apps/site/](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/apps/site)
* **`packages/shared`**: A shared library containing common schemas, utility functions, constants, and TypeScript types used across frontend and backend applications.

### Folder Structure Overview
```
multiserwis-szkolenia/
├── apps/
│   ├── api/                    # NestJS API backend
│   └── site/                   # Astro static marketing website/blog
├── packages/
│   └── shared/                 # Shared TypeScript models and helpers
├── components/                 # React UI components (Layouts, Panels, Elements)
├── services/                   # Frontend APIs and state managers (Zustand)
├── docs/                       # Production output build target (GitHub Pages deployment)
├── public/                     # Static client assets (logos, images)
├── types.ts / constants.ts     # Frontend type contracts and configurations
└── App.tsx                     # Main application routing and core container
```

---

## 💎 Features & Capabilities

### 1. Unified Multi-Role Dashboard System
The client portal provides tailored user experiences depending on authorization level, utilizing a consistent grid layout and side-navigation scheme:
* **Student Portal (LMS)**: Features a course player (supporting HLS.js streaming), progress markers, quizzes/exams, and a certificates tab to view and print completed credentials.
* **Company Guardian Portal**: Designed for corporate B2B clients to purchase training licenses in bulk, manage employees, assign courses via dashboard controls, and monitor training completion rates.
* **Manager Portal**: Interface for training instructors/coordinators to manage scheduled courses, organize teaching materials, view class rosters, and generate performance reports.
* **Admin Portal**: Central administration dashboard with global platform statistics, full course catalog management (create/edit modules, lessons, exam questions), user accounts CRUD, order processing, and support ticket resolution panels.

### 2. Machinery Rental & Services
* Interactive catalog of heavy machinery (forklifts, cherry pickers, telehandlers, crane trucks).
* Parametric filters (lifting capacity, height, power source).
* Dynamic rental inquiry system linked with operator training courses.

### 3. Interactive Training Wizard
* A multi-step onboarding wizard ([WizardView](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/components/views/WizardView.tsx)) helping users find the precise qualification path (UDT, IMBiGS, or SEP) based on their targeted job role and experience.

### 4. Localization (i18n)
* The platform features multi-language translation (Polish and English) implemented using `i18next` with hot-reloading.

---

## 🚦 Getting Started

### Prerequisites
* **Node.js** (LTS version)
* **Docker Desktop** (for PostgreSQL and Redis containers)

### 1. Launch Backend Infrastructure (Docker)
Run the required database and cache containers from the project root:
```bash
docker compose -f docker-compose.dev.yml up -d
```
This launches a **PostgreSQL** instance on port `5432` and a **Redis** instance on port `6379`.

### 2. Configure Environment Variables
* **Frontend Root**: Create a file named `.env.local` in the root folder:
  ```env
  VITE_API_URL=http://localhost:3000
  GEMINI_API_KEY=your_gemini_api_key
  ```
* **Backend API (`apps/api`)**: Copy `.env.example` to `.env` in the `apps/api` folder:
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/multiserwis?schema=public"
  JWT_SECRET="your-secure-jwt-secret-key"
  REDIS_URL="redis://localhost:6379"
  ```

### 3. Initialize the Database Schema & Seeds
Execute migrations and load default training parameters/accounts using Prisma:
```bash
# Navigate to API workspace
cd apps/api

# Run database migrations
npm run prisma:migrate

# Seed database with courses, lessons, and mock accounts
npm run prisma:seed

# Return to root workspace
cd ../..
```

### 4. Start Development Servers
From the root workspace, run:
```bash
# Install monorepo dependencies
npm install

# Start the NestJS API server (starts on port 3000)
npm run api:dev

# Start the React frontend application (Vite dev server)
npm run dev
```

---

## 🚀 Testing

The project has end-to-end tests configured with Playwright.
To execute end-to-end tests:
```bash
npm run test:e2e
```

---

## 🚢 Deployment

* **Frontend Production Build**: Output is generated into the [docs/](file:///d:/Projekty/_KLIENCI/Multiserwis/multiserwis-szkolenia/docs) directory for hosting on GitHub Pages.
* **Base Path**: The application is configured to run under the base path `/multiserwis-kutno/` in production.
* To build the frontend bundle:
  ```bash
  npm run build
  ```

---

## 📜 License

This system is proprietary software developed for **MultiSerwis Kutno**. All rights reserved.
