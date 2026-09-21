# QA Checklist — MultiSerwis Szkolenia

Strona produkcyjna/stagingowa wdrażana jest na serwer SeoHost z bazą:
- Base path: `/`
- Output katalog: `dist/`
- Routing: Apache `.htaccess` fallback

Use this checklist after any change that could affect UI, assets, routing, or deployment.

---

## A. Local checks (before pushing)

1. Install deps (once):
   - `npm install`

2. Production build succeeds:
   - `npm run build`

3. Preview the production build locally:
   - `npm run preview`
   - Open the preview URL and do a quick smoke test (see section C).

---

## B. Staging / Production checks (after deploy)

Open the deployed site (`https://multiserwis-szkolenia.webisko.pl`) and verify:

1. **Home page loads**
   - No blank page.
   - No infinite loading.

2. **Assets load correctly**
   - Open DevTools → Network → refresh
   - Verify no `404` for `.js`, `.css`, images, fonts.

3. **Styles and icons render**
   - Layout looks correct (CSS loaded).
   - Icons/images appear (especially logo in panels).

4. **Console is clean**
   - DevTools → Console
   - No critical errors (red) during page load and basic interactions.

5. **Navigation sanity**
   - Click a few key navigation paths and buttons.
   - Verify expected content appears and links do not break.

6. **Refresh behavior (Direct link / F5)**
   - Navigate to a non-home route (e.g. `/szkolenia/udt` or `/panel/kursant`)
   - Press F5 / reload
   - Confirm Apache `.htaccess` cleanly serves the route without 404.

7. **Responsiveness**
   - DevTools device toolbar: test mobile / tablet widths.
   - Ensure no obvious layout break.

---

## C. Common breakages to catch

- Broken relative links / images
- Missing `.htaccess` fallback for direct routes
- Console errors or broken imports in lazy chunks