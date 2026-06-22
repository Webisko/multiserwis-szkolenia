# VPS Deploy Checklist (Astro + Platform + API)

This checklist focuses on the VPS deployment target (not shared hosting).

## 1) DNS & Subdomains

- [ ] Point `domena.pl` -> VPS IP
- [ ] Point `platforma.domena.pl` -> VPS IP
- [ ] Point `api.domena.pl` -> VPS IP

## 2) Server baseline

- [ ] Ubuntu LTS updated
- [ ] Node.js LTS installed
- [ ] Docker + docker compose installed
- [ ] Nginx installed
- [ ] UFW firewall enabled

## 3) SSL/TLS

- [ ] Certbot installed
- [ ] Certificates for `domena.pl`, `platforma.domena.pl`, `api.domena.pl`
- [ ] Auto-renewal enabled

## 4) Database (Postgres)

- [ ] Postgres running (Docker or native)
- [ ] User + database created
- [ ] `DATABASE_URL` ready for API

## 5) Deploy artifacts

- [ ] Astro build output available (site)
- [ ] Platform build output available (SPA)
- [ ] API build output available (NestJS)

## 6) Nginx routing

- [ ] `domena.pl` serves Astro build
- [ ] `platforma.domena.pl` serves SPA build (fallback to index.html)
- [ ] `api.domena.pl` proxies to NestJS

## 7) Environment variables

- [ ] `DATABASE_URL`
- [ ] `JWT_SECRET`
- [ ] `CORS_ORIGIN` (platform domain)

## 8) Process management

- [ ] API runs with systemd/pm2
- [ ] Restart policy configured

## 9) Verification

- [ ] `GET https://api.domena.pl/health`
- [ ] `GET https://domena.pl/` (Astro)
- [ ] `GET https://platforma.domena.pl/` (SPA)
- [ ] Auth flow works end-to-end
- [ ] Orders flow works without payment

## Notes

- Payment integration is separate and requires provider selection.
- For GitHub Pages compatibility, keep current Vite `base` and `docs/` output until VPS switch.
