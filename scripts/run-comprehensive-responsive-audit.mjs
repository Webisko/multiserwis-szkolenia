import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "Mobile S (320px)", width: 320, height: 568 },
  { name: "Mobile M (375px)", width: 375, height: 667 },
  { name: "Mobile L (430px)", width: 430, height: 932 },
  { name: "Tablet Portrait (768px)", width: 768, height: 1024 },
  { name: "Tablet Air (820px)", width: 820, height: 1180 },
  { name: "Tablet Land/Laptop S (1024px)", width: 1024, height: 768 },
  { name: "Desktop (1280px)", width: 1280, height: 800 },
  { name: "Desktop FHD (1920px)", width: 1920, height: 1080 }
];

const ASTRO_URL = "http://localhost:4321";
const REACT_URL = "http://127.0.0.1:3000";

const ASTRO_PAGES = [
  { path: "/", title: "Strona Główna (Astro)" },
  { path: "/szkolenia", title: "Katalog Szkoleń (Astro)" },
  { path: "/szkolenia/udt", title: "Kategoria UDT (Astro)" },
  { path: "/szkolenia/imbigs", title: "Kategoria IMBiGS (Astro)" },
  { path: "/szkolenia/sep", title: "Kategoria SEP (Astro)" },
  { path: "/szkolenia/spawalnictwo", title: "Kategoria Spawalnictwo (Astro)" },
  { path: "/szkolenia/wozki-widlowe", title: "Szczegóły Szkolenia Wózki (Astro)" },
  { path: "/wynajem", title: "Wynajem Maszyn (Astro)" },
  { path: "/uslugi", title: "Usługi (Astro)" },
  { path: "/harmonogram", title: "Harmonogram (Astro)" },
  { path: "/o-nas", title: "O nas (Astro)" },
  { path: "/kontakt", title: "Kontakt (Astro)" },
  { path: "/polityka-prywatnosci", title: "Polityka Prywatności (Astro)" },
  { path: "/regulamin", title: "Regulamin (Astro)" }
];

const REACT_PAGES = [
  { path: "/katalog", title: "Katalog Szkoleń (React)" },
  { path: "/szkolenia/szczegoly?id=c1", title: "Szczegóły Kursu C1 (React)" },
  { path: "/koszyk", title: "Koszyk Zakupowy (React)" },
  { path: "/harmonogram", title: "Harmonogram (React)" },
  { path: "/kontakt", title: "Kontakt (React)" },
  { path: "/panel/administrator", title: "Panel Administratora (React)" },
  { path: "/panel/kierownik", title: "Panel Managera (React)" },
  { path: "/panel/opiekun-firmy", title: "Panel Opiekuna Firmy (React)" },
  { path: "/panel/kursant", title: "Panel Kursanta LMS (React)" },
  { path: "/panel/analityka", title: "Panel Analityki (React)" },
  { path: "/panel/wsparcie", title: "Panel Wsparcia (React)" },
  { path: "/kursant/lekcje", title: "Odtwarzacz Lekcji LMS (React)" },
  { path: "/kursant/profil", title: "Profil Kursanta (React)" }
];

async function runAudit() {
  console.log("=== STARTING COMPREHENSIVE RESPONSIVENESS AUDIT ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = [];

  const auditPage = async (page, url, title, appType) => {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 8000 });
        await page.waitForTimeout(600); // Allow layout/hydration

        const evaluation = await page.evaluate((vpWidth) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const clientWidth = docEl.clientWidth;
          const innerWidth = window.innerWidth;
          const hasHorizontalOverflow = scrollWidth > innerWidth + 1;

          // Find overflowing elements
          const overflowingElements = [];
          if (hasHorizontalOverflow) {
            const allElements = document.querySelectorAll("*");
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > innerWidth + 1 || rect.left < -1) {
                // Filter out non-visible or zero-size
                if (rect.width > 0 && rect.height > 0) {
                  const tag = el.tagName.toLowerCase();
                  const id = el.id ? `#${el.id}` : "";
                  const classes = el.className && typeof el.className === "string" 
                    ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") 
                    : "";
                  overflowingElements.push({
                    selector: `${tag}${id}${classes}`,
                    rect: {
                      left: Math.round(rect.left),
                      right: Math.round(rect.right),
                      width: Math.round(rect.width)
                    },
                    textSnippet: (el.innerText || "").slice(0, 40).replace(/\n/g, " ")
                  });
                }
              }
            }
          }

          // Navigation menu accessibility check
          const desktopNav = document.querySelector("nav .hidden.lg\\:flex, header .hidden.lg\\:flex, nav .lg\\:flex");
          const mobileBurger = document.querySelector("#mobile-menu-btn, button[aria-label*='menu' i], .md\\:hidden .lucide-menu, button.lg\\:hidden");
          const isDesktopNavVisible = desktopNav ? window.getComputedStyle(desktopNav).display !== "none" : false;
          const isMobileBurgerVisible = mobileBurger ? window.getComputedStyle(mobileBurger).display !== "none" : false;

          // Navigation anomaly: neither desktop nor mobile menu visible
          const navAnomaly = (!isDesktopNavVisible && !isMobileBurgerVisible);

          return {
            scrollWidth,
            innerWidth,
            hasHorizontalOverflow,
            overflowDiff: scrollWidth - innerWidth,
            overflowingElements: overflowingElements.slice(0, 5), // top 5
            isDesktopNavVisible,
            isMobileBurgerVisible,
            navAnomaly
          };
        }, vp.width);

        results.push({
          appType,
          pageTitle: title,
          url,
          viewport: vp.name,
          width: vp.width,
          status: response ? response.status() : 0,
          ...evaluation
        });

      } catch (err) {
        results.push({
          appType,
          pageTitle: title,
          url,
          viewport: vp.name,
          width: vp.width,
          error: err.message
        });
      }
    }
  };

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("\n--> Auditing Astro Marketing Pages...");
  for (const item of ASTRO_PAGES) {
    process.stdout.write(`Testing ${item.title}... `);
    await auditPage(page, `${ASTRO_URL}${item.path}`, item.title, "Astro");
    console.log("Done");
  }

  console.log("\n--> Auditing React SPA Pages...");
  for (const item of REACT_PAGES) {
    process.stdout.write(`Testing ${item.title}... `);
    await auditPage(page, `${REACT_URL}${item.path}`, item.title, "React");
    console.log("Done");
  }

  await browser.close();

  // Save raw results
  const reportPath = path.resolve("./audit_raw_results.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nAudit complete! Results saved to ${reportPath}`);

  // Print summary of issues
  console.log("\n=== AUDIT FINDINGS SUMMARY ===");
  const overflowIssues = results.filter(r => r.hasHorizontalOverflow);
  const navAnomalies = results.filter(r => r.navAnomaly);
  const errors = results.filter(r => r.error);

  console.log(`Total Checks: ${results.length}`);
  console.log(`Horizontal Overflows Detected: ${overflowIssues.length}`);
  console.log(`Navigation Missing (Dead Zone) Detected: ${navAnomalies.length}`);
  console.log(`Errors: ${errors.length}`);

  if (overflowIssues.length > 0) {
    console.log("\n--- Horizontal Overflow List ---");
    overflowIssues.forEach(o => {
      console.log(`[${o.appType}] ${o.pageTitle} @ ${o.viewport}: +${o.overflowDiff}px`);
      o.overflowingElements.forEach(el => {
        console.log(`   -> Selector: ${el.selector}, right: ${el.rect.right}px, text: "${el.textSnippet}"`);
      });
    });
  }

  if (navAnomalies.length > 0) {
    console.log("\n--- Navigation Dead Zones (No Menu Available) ---");
    navAnomalies.forEach(n => {
      console.log(`[${n.appType}] ${n.pageTitle} @ ${n.viewport}: No desktop menu AND no mobile burger!`);
    });
  }
}

runAudit().catch(console.error);
