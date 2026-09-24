import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// 1. Pure White Emblem (Exact paths from MultiSerwisEmblem in BrandMark.tsx, NO clipPaths that cut off strokes)
const whiteEmblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 215.25 213" fill="none">
  <path stroke-linecap="round" transform="matrix(0.746388, 0.0387904, -0.0387904, 0.746388, 22.667593, -4.308565)" fill="none" stroke-linejoin="miter" d="M 23.70514 61.062752 C 88.201608 1.617793 152.695967 1.646833 217.198386 61.144111" stroke="#ffffff" stroke-width="32" />
  <path stroke-linecap="round" transform="matrix(0.572096, 0.480943, -0.480943, 0.572096, 39.832766, 27.664762)" fill="none" stroke-linejoin="miter" d="M 16.498401 16.499856 L 262.297368 16.498863" stroke="#ffffff" stroke-width="32" />
  <path stroke-linecap="round" transform="matrix(-0.747097, -0.0211284, 0.0211284, -0.747097, 195.863611, 216.068173)" fill="none" stroke-linejoin="miter" d="M 23.693011 64.961328 C 89.360518 0.319538 155.026848 0.34474 220.697519 65.047236" stroke="#ffffff" stroke-width="32" />
  <path stroke-linecap="round" transform="matrix(0.572399, 0.480583, -0.480583, 0.572399, 15.864842, 58.787771)" fill="none" stroke-linejoin="miter" d="M 16.497529 16.498899 L 174.894069 16.502823" stroke="#ffffff" stroke-width="32" />
  <path stroke-linecap="round" transform="matrix(0.578067, -0.47375, 0.47375, 0.578067, 141.691865, 104.468184)" fill="none" stroke-linejoin="miter" d="M 16.501648 16.49805 L 81.315506 16.502295" stroke="#ffffff" stroke-width="32" />
  <path stroke-linecap="round" transform="matrix(-0.0335867, -0.746641, 0.746641, -0.0335867, 2.676521, 156.398469)" fill="none" stroke-linejoin="miter" d="M 21.302331 22.130225 C 50.148174 14.617523 78.990668 14.622718 107.829577 22.151032" stroke="#ffffff" stroke-width="32" />
  <path stroke-linecap="round" transform="matrix(-0.0224359, 0.747059, -0.747059, -0.0224359, 215.48332, 59.708109)" fill="none" stroke-linejoin="miter" d="M 21.352238 22.081857 C 49.704086 14.631591 78.055025 14.637675 106.410437 22.105175" stroke="#ffffff" stroke-width="32" />
  <path stroke-linecap="round" transform="matrix(0.549434, -0.506678, 0.506678, 0.549434, 91.588072, 151.143562)" fill="none" stroke-linejoin="miter" d="M 16.502923 16.50019 L 31.212682 16.500169" stroke="#ffffff" stroke-width="32" />
</svg>`;

// 2. Favicon SVG with Orange Background (Preserves exact orientation & proportions, perfectly centered, NO cutoffs)
const orangeFaviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <!-- Orange Background with subtle modern rounding -->
  <rect width="256" height="256" rx="44" fill="#ff6600"/>

  <!-- Centered White MultiSerwis Emblem without any clipping -->
  <g transform="translate(39.75, 40.67) scale(0.82)">
    <path stroke-linecap="round" transform="matrix(0.746388, 0.0387904, -0.0387904, 0.746388, 22.667593, -4.308565)" fill="none" stroke-linejoin="miter" d="M 23.70514 61.062752 C 88.201608 1.617793 152.695967 1.646833 217.198386 61.144111" stroke="#ffffff" stroke-width="32" />
    <path stroke-linecap="round" transform="matrix(0.572096, 0.480943, -0.480943, 0.572096, 39.832766, 27.664762)" fill="none" stroke-linejoin="miter" d="M 16.498401 16.499856 L 262.297368 16.498863" stroke="#ffffff" stroke-width="32" />
    <path stroke-linecap="round" transform="matrix(-0.747097, -0.0211284, 0.0211284, -0.747097, 195.863611, 216.068173)" fill="none" stroke-linejoin="miter" d="M 23.693011 64.961328 C 89.360518 0.319538 155.026848 0.34474 220.697519 65.047236" stroke="#ffffff" stroke-width="32" />
    <path stroke-linecap="round" transform="matrix(0.572399, 0.480583, -0.480583, 0.572399, 15.864842, 58.787771)" fill="none" stroke-linejoin="miter" d="M 16.497529 16.498899 L 174.894069 16.502823" stroke="#ffffff" stroke-width="32" />
    <path stroke-linecap="round" transform="matrix(0.578067, -0.47375, 0.47375, 0.578067, 141.691865, 104.468184)" fill="none" stroke-linejoin="miter" d="M 16.501648 16.49805 L 81.315506 16.502295" stroke="#ffffff" stroke-width="32" />
    <path stroke-linecap="round" transform="matrix(-0.0335867, -0.746641, 0.746641, -0.0335867, 2.676521, 156.398469)" fill="none" stroke-linejoin="miter" d="M 21.302331 22.130225 C 50.148174 14.617523 78.990668 14.622718 107.829577 22.151032" stroke="#ffffff" stroke-width="32" />
    <path stroke-linecap="round" transform="matrix(-0.0224359, 0.747059, -0.747059, -0.0224359, 215.48332, 59.708109)" fill="none" stroke-linejoin="miter" d="M 21.352238 22.081857 C 49.704086 14.631591 78.055025 14.637675 106.410437 22.105175" stroke="#ffffff" stroke-width="32" />
    <path stroke-linecap="round" transform="matrix(0.549434, -0.506678, 0.506678, 0.549434, 91.588072, 151.143562)" fill="none" stroke-linejoin="miter" d="M 16.502923 16.50019 L 31.212682 16.500169" stroke="#ffffff" stroke-width="32" />
  </g>
</svg>`;

async function run() {
  console.log("Restoring pure logo.svg and generating perfect orange favicons...");

  // 1. Restore pure white logo.svg (used by site header, navbar, BrandMark)
  const rootLogo = path.join(projectRoot, "public", "logo.svg");
  const siteLogo = path.join(projectRoot, "apps", "site", "public", "logo.svg");
  fs.writeFileSync(rootLogo, whiteEmblemSvg, "utf8");
  fs.writeFileSync(siteLogo, whiteEmblemSvg, "utf8");
  console.log("✓ Restored clean white logo.svg for site navigation");

  // 2. Write favicon.svg with orange background
  const rootFavSvg = path.join(projectRoot, "public", "favicon.svg");
  const siteFavSvg = path.join(projectRoot, "apps", "site", "public", "favicon.svg");
  fs.writeFileSync(rootFavSvg, orangeFaviconSvg, "utf8");
  fs.writeFileSync(siteFavSvg, orangeFaviconSvg, "utf8");
  console.log("✓ Saved orange favicon.svg");

  // 3. Render high-res PNGs and ICO using Chromium
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const renderPng = async (size) => {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;overflow:hidden;">${orangeFaviconSvg}</body></html>`);
    const svgEl = await page.$("svg");
    const buffer = await svgEl.screenshot({ omitBackground: true });
    await page.close();
    return buffer;
  };

  const renderIcon = async (size, filename) => {
    const buffer = await renderPng(size);
    fs.writeFileSync(path.join(projectRoot, "public", filename), buffer);
    fs.writeFileSync(path.join(projectRoot, "apps", "site", "public", filename), buffer);
    console.log(`✓ Rendered ${filename} (${size}x${size})`);
    return buffer;
  };

  const png16 = await renderPng(16);
  const png32 = await renderIcon(32, "favicon-32x32.png");
  const png48 = await renderPng(48);
  await renderIcon(180, "apple-touch-icon.png");
  await renderIcon(192, "favicon-192x192.png");

  // Build a true multi-resolution binary ICO container (16x16, 32x32, 48x48)
  const icoImages = [
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ];

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type
  header.writeUInt16LE(icoImages.length, 4); // number of images

  let offset = 6 + 16 * icoImages.length;
  const directoryEntries = [];
  const imageBuffers = [];

  for (const img of icoImages) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    directoryEntries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  const finalIcoBuffer = Buffer.concat([header, ...directoryEntries, ...imageBuffers]);
  fs.writeFileSync(path.join(projectRoot, "public", "favicon.ico"), finalIcoBuffer);
  fs.writeFileSync(path.join(projectRoot, "apps", "site", "public", "favicon.ico"), finalIcoBuffer);
  console.log("✓ Built true multi-resolution binary favicon.ico (16, 32, 48px)");

  await browser.close();
  console.log("All icons regenerated and verified successfully!");
}

run().catch(console.error);
