import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

async function generateOgImage() {
  console.log("Generating OG Image (1200x630)...");

  const heroImagePath = path.join(projectRoot, "public", "hero.webp");
  const heroImageBase64 = fs.readFileSync(heroImagePath).toString("base64");
  const heroDataUri = `data:image/webp;base64,${heroImageBase64}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Roboto:wght@400;500;700&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Roboto', sans-serif;
      background-color: #002a36;
      color: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px 72px;
    }

    .bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${heroDataUri}');
      background-size: cover;
      background-position: center;
      opacity: 0.38;
      z-index: 1;
    }

    .bg-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 80% 20%, rgba(255, 102, 0, 0.15) 0%, transparent 50%),
                  linear-gradient(135deg, rgba(0, 42, 54, 0.96) 0%, rgba(0, 61, 77, 0.88) 50%, rgba(0, 42, 54, 0.95) 100%);
      z-index: 2;
    }

    .accent-glow {
      position: absolute;
      bottom: -100px;
      right: -80px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(255, 102, 0, 0.22) 0%, transparent 70%);
      z-index: 2;
      pointer-events: none;
    }

    .grid-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      z-index: 3;
    }

    .content-wrapper {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .brand-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background-color: #ff6600;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(255, 102, 0, 0.35);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 26px;
      letter-spacing: -0.5px;
      line-height: 1;
      color: #ffffff;
    }

    .brand-title span {
      color: #ff6600;
    }

    .brand-subtitle {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #94a3b8;
      margin-top: 4px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 9999px;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background-color: #ff6600;
      border-radius: 50%;
      box-shadow: 0 0 10px #ff6600;
    }

    .badge-text {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #e2e8f0;
    }

    .hero-center {
      max-width: 960px;
      margin-top: 10px;
    }

    .hero-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 52px;
      line-height: 1.15;
      letter-spacing: -1px;
      color: #ffffff;
      margin-bottom: 20px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .hero-title .highlight {
      color: #ff6600;
      position: relative;
      display: inline-block;
    }

    .hero-description {
      font-size: 20px;
      line-height: 1.5;
      color: #cbd5e1;
      max-width: 820px;
      font-weight: 400;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    }

    .trust-footer {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 61, 77, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 10px 20px;
      border-radius: 6px;
    }

    .trust-icon {
      color: #ff6600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .trust-text {
      font-size: 14px;
      font-weight: 700;
      color: #f1f5f9;
      font-family: 'Montserrat', sans-serif;
    }

    .trust-sub {
      font-size: 11px;
      color: #94a3b8;
      display: block;
      font-weight: 500;
      font-family: 'Roboto', sans-serif;
    }

    .domain-tag {
      margin-left: auto;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="bg-image"></div>
  <div class="bg-gradient"></div>
  <div class="accent-glow"></div>
  <div class="grid-lines"></div>

  <div class="content-wrapper">
    <div class="brand-bar">
      <div class="brand">
        <div class="brand-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="brand-text">
          <div class="brand-title">MULTI<span>SERWIS</span></div>
          <div class="brand-subtitle">Kutno • Ośrodek Szkolenia Zawodowego</div>
        </div>
      </div>

      <div class="badge">
        <div class="badge-dot"></div>
        <div class="badge-text">Uprawnienia UDT • IMBiGS • SEP</div>
      </div>
    </div>

    <div class="hero-center">
      <h1 class="hero-title">
        Zdobądź uprawnienia operatora<br>
        <span class="highlight">online i stacjonarnie</span>
      </h1>
      <p class="hero-description">
        Certyfikowane kursy na wózki widłowe, ładowarki, suwnice, podesty i maszyny budowlane. Teoria e-learningowa 24/7 i praktyka na własnym placu manewrowym w Kutnie.
      </p>
    </div>

    <div class="trust-footer">
      <div class="trust-item">
        <div class="trust-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div>
          <span class="trust-text">98% Zdawalności</span>
          <span class="trust-sub">Egzaminy państwowe</span>
        </div>
      </div>

      <div class="trust-item">
        <div class="trust-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <div>
          <span class="trust-text">Teoria Online 24/7</span>
          <span class="trust-sub">Wygodny e-learning</span>
        </div>
      </div>

      <div class="trust-item">
        <div class="trust-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div>
          <span class="trust-text">5000+ Absolwentów</span>
          <span class="trust-sub">Doświadczeni instruktorzy</span>
        </div>
      </div>

      <div class="domain-tag">
        multiserwis-szkolenia.pl
      </div>
    </div>
  </div>
</body>
</html>`;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const outPublicPath = path.join(projectRoot, "public", "og-image.jpg");
  const outAstroPath = path.join(projectRoot, "apps", "site", "public", "og-image.jpg");

  await page.screenshot({ path: outPublicPath, type: "jpeg", quality: 92 });
  fs.copyFileSync(outPublicPath, outAstroPath);

  console.log(`✓ OG Image generated at: ${outPublicPath}`);
  console.log(`✓ Copied to: ${outAstroPath}`);

  await browser.close();
}

generateOgImage().catch(console.error);
