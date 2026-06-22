# Local API guide (apps/api)

This document explains how to run and test the local NestJS API.

## Prerequisites

- Docker Desktop running
- Node.js LTS installed

## Start local services

1. Start Postgres + Redis:
   - `docker compose -f docker-compose.dev.yml up -d`
2. Ensure API env is set:
   - Copy `.env.example` to `.env` in `apps/api` and set `DATABASE_URL`.

## Run the API

From `apps/api`:

- `npm run dev`

API default port: `3000`.

## Connect the platform (Vite)

Set in root `.env.local` (not committed):

- `VITE_API_URL=http://localhost:3000`

## Seed database

From `apps/api`:

- `npm run prisma:seed`

## Useful endpoints

Health:

- `GET /health`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (requires `Authorization: Bearer <JWT>`)

Courses:

- `GET /courses`
- `GET /courses/:id`
- `POST /courses` (ADMIN/MANAGER, JWT required)
- `PUT /courses/:id` (ADMIN/MANAGER, JWT required)
- `DELETE /courses/:id` (ADMIN/MANAGER, JWT required)

Users (ADMIN/MANAGER/COMPANY_GUARDIAN, JWT required):

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `POST /users/:id/enroll`

Orders (JWT required):

- `POST /orders`
- `GET /orders`
- `GET /orders?userId=...` (ADMIN/MANAGER)
- `GET /orders/me`
- `GET /orders/:id`
- `PATCH /orders/:id/status` (ADMIN/MANAGER)

Questions (JWT required):

- `GET /questions?courseId=...`
- `GET /questions?courseId=...&moduleId=...`
- `POST /questions` (ADMIN/MANAGER)
- `POST /questions/generate`

Progress (JWT required):

- `GET /progress`
- `POST /progress`

Tickets (JWT required):

- `GET /tickets`
- `GET /tickets/:id`
- `POST /tickets`
- `POST /tickets/:id/messages`
- `PATCH /tickets/:id/status` (ADMIN/MANAGER)

Analytics (JWT required):

- `GET /analytics` (ADMIN/MANAGER/COMPANY_GUARDIAN)

## Example requests

Register:

```
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.pl","password":"Secret123","name":"Jan Nowak"}'
```

Login:

```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.pl","password":"Secret123"}'
```

Get courses:

```
curl http://localhost:3000/courses
```

Create order:

```
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"userId":"<uuid>","courseId":"<uuid>","amount":650}'
```
