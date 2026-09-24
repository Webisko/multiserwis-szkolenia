import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const faviconSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <clipPath id="fav_e278f55ca7"><path d="M 0 0.371094 L 214.503906 0.371094 L 214.503906 190 L 0 190 Z M 0 0.371094 " clip-rule="nonzero"/></clipPath>
    <clipPath id="fav_37a554b49f"><path d="M 0 0.371094 L 214.503906 0.371094 L 214.503906 212.628906 L 0 212.628906 Z M 0 0.371094 " clip-rule="nonzero"/></clipPath>
    <clipPath id="fav_d29f8b745c"><path d="M 0 23 L 214.503906 23 L 214.503906 212.628906 L 0 23 " clip-rule="nonzero"/></clipPath>
    <clipPath id="fav_256091618d"><path d="M 0 0.371094 L 214.503906 0.371094 L 214.503906 212.628906 L 0 212.628906 Z M 0 0.371094 " clip-rule="nonzero"/></clipPath>
    <clipPath id="fav_14f17cf363"><path d="M 19 0.371094 L 214.503906 0.371094 L 214.503906 212.628906 L 19 212.628906 Z M 19 0.371094 " clip-rule="nonzero"/></clipPath>
    <clipPath id="fav_0250e0ed51"><path d="M 0 0.371094 L 159 0.371094 L 159 212.628906 L 0 212.628906 Z M 0 0.371094 " clip-rule="nonzero"/></clipPath>
    <clipPath id="fav_206d1e0885"><path d="M 57 0.371094 L 214.503906 0.371094 L 214.503906 212.628906 L 57 212.628906 Z M 57 0.371094 " clip-rule="nonzero"/></clipPath>
    <clipPath id="fav_f1f7fcf97d"><path d="M 0 4 L 214.503906 4 L 214.503906 212.628906 L 0 4 " clip-rule="nonzero"/></clipPath>
  </defs>

  <!-- Orange Background with Rounded Corners -->
  <rect width="256" height="256" rx="52" fill="#ff6600"/>

  <!-- Centered White Emblem -->
  <g transform="translate(50.5, 51.3) scale(0.72)">
    <g clip-path="url(#fav_e278f55ca7)">
      <path stroke-linecap="round" transform="matrix(0.746388, 0.0387904, -0.0387904, 0.746388, 22.667593, -4.308565)" fill="none" stroke-linejoin="miter" d="M 23.70514 61.062752 C 88.201608 1.617793 152.695967 1.646833 217.198386 61.144111 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
    <g clip-path="url(#fav_37a554b49f)">
      <path stroke-linecap="round" transform="matrix(0.572096, 0.480943, -0.480943, 0.572096, 39.832766, 27.664762)" fill="none" stroke-linejoin="miter" d="M 16.498401 16.499856 L 262.297368 16.498863 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
    <g clip-path="url(#fav_d29f8b745c)">
      <path stroke-linecap="round" transform="matrix(-0.747097, -0.0211284, 0.0211284, -0.747097, 195.863611, 216.068173)" fill="none" stroke-linejoin="miter" d="M 23.693011 64.961328 C 89.360518 0.319538 155.026848 0.34474 220.697519 65.047236 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
    <g clip-path="url(#fav_256091618d)">
      <path stroke-linecap="round" transform="matrix(0.572399, 0.480583, -0.480583, 0.572399, 15.864842, 58.787771)" fill="none" stroke-linejoin="miter" d="M 16.497529 16.498899 L 174.894069 16.502823 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
    <g clip-path="url(#fav_14f17cf363)">
      <path stroke-linecap="round" transform="matrix(0.578067, -0.47375, 0.47375, 0.578067, 141.691865, 104.468184)" fill="none" stroke-linejoin="miter" d="M 16.501648 16.49805 L 81.315506 16.502295 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
    <g clip-path="url(#fav_0250e0ed51)">
      <path stroke-linecap="round" transform="matrix(-0.0335867, -0.746641, 0.746641, -0.0335867, 2.676521, 156.398469)" fill="none" stroke-linejoin="miter" d="M 21.302331 22.130225 C 50.148174 14.617523 78.990668 14.622718 107.829577 22.151032 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
    <g clip-path="url(#fav_206d1e0885)">
      <path stroke-linecap="round" transform="matrix(-0.0224359, 0.747059, -0.747059, -0.0224359, 215.48332, 59.708109)" fill="none" stroke-linejoin="miter" d="M 21.352238 22.081857 C 49.704086 14.631591 78.055025 14.637675 106.410437 22.105175 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
    <g clip-path="url(#fav_f1f7fcf97d)">
      <path stroke-linecap="round" transform="matrix(0.549434, -0.506678, 0.506678, 0.549434, 91.588072, 151.143562)" fill="none" stroke-linejoin="miter" d="M 16.502923 16.50019 L 31.212682 16.500169 " stroke="#ffffff" stroke-width="33" stroke-opacity="1" stroke-miterlimit="4"/>
    </g>
  </g>
</svg>`;

async function generateFavicons() {
  console.log("Generating Orange Background Favicons...");

  // Write SVG files
  const rootPublicSvg = path.join(projectRoot, "public", "favicon.svg");
  const sitePublicSvg = path.join(projectRoot, "apps", "site", "public", "favicon.svg");
  fs.writeFileSync(rootPublicSvg, faviconSvgContent, "utf8");
  fs.writeFileSync(sitePublicSvg, faviconSvgContent, "utf8");
  console.log("✓ Saved favicon.svg");

  // Also update logo.svg / icon
  const rootLogoSvg = path.join(projectRoot, "public", "logo.svg");
  const siteLogoSvg = path.join(projectRoot, "apps", "site", "public", "logo.svg");
  fs.writeFileSync(rootLogoSvg, faviconSvgContent, "utf8");
  fs.writeFileSync(siteLogoSvg, faviconSvgContent, "utf8");
  console.log("✓ Updated logo.svg with orange background");

  // Render PNGs and ICO using Chromium
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  
  const renderPng = async (size, filename) => {
    const page = await browser.newPage({
      viewport: { width: size, height: size }
    });
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;overflow:hidden;">${faviconSvgContent}</body></html>`);
    const svgEl = await page.$("svg");
    const buffer = await svgEl.screenshot({ omitBackground: true });
    
    fs.writeFileSync(path.join(projectRoot, "public", filename), buffer);
    fs.writeFileSync(path.join(projectRoot, "apps", "site", "public", filename), buffer);
    await page.close();
    console.log(`✓ Rendered ${filename} (${size}x${size})`);
    return buffer;
  };

  await renderPng(32, "favicon-32x32.png");
  await renderPng(180, "apple-touch-icon.png");
  await renderPng(192, "favicon-192x192.png");
  const icoBuffer = await renderPng(48, "favicon.ico"); // Browser supports PNG-in-ICO format

  // Copy 48x48 to favicon.ico in both places
  fs.writeFileSync(path.join(projectRoot, "public", "favicon.ico"), icoBuffer);
  fs.writeFileSync(path.join(projectRoot, "apps", "site", "public", "favicon.ico"), icoBuffer);

  await browser.close();
  console.log("All favicons generated successfully!");
}

generateFavicons().catch(console.error);
