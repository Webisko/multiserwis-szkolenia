import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

console.log("==> [1/4] Building React SPA for Panels (/panel/*)...");
execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });

const distDir = path.join(projectRoot, "dist");
const panelDir = path.join(distDir, "panel");
if (!fs.existsSync(panelDir)) {
  fs.mkdirSync(panelDir, { recursive: true });
}

// Copy React SPA index.html to dist/panel/index.html
fs.copyFileSync(path.join(distDir, "index.html"), path.join(panelDir, "index.html"));
console.log("✓ React SPA entrypoint mapped to dist/panel/index.html");

console.log("==> [2/4] Building Astro SSG Site (apps/site)...");
execSync("npm --workspace apps/site run build", { cwd: projectRoot, stdio: "inherit" });

console.log("==> [3/4] Merging Astro Static Pages into production dist/...");
const astroDist = path.join(projectRoot, "apps", "site", "dist");

function copyDirRecursive(src, dest, excludeDirs = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name)) continue;
      copyDirRecursive(srcPath, destPath, excludeDirs);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy Astro dist into root dist, without overwriting 'assets', 'panel', or 'api'
copyDirRecursive(astroDist, distDir, ["assets", "panel", "api"]);

// Copy .htaccess and critical manifest files into dist (root public/ takes priority)
const criticalFiles = ["robots.txt", "llms.txt", "ai-catalog.json", ".htaccess"];
for (const file of criticalFiles) {
  const rootSrc = path.join(projectRoot, "public", file);
  const astroSrc = path.join(astroDist, file);
  const dest = path.join(distDir, file);
  const chosenSrc = fs.existsSync(rootSrc) ? rootSrc : (fs.existsSync(astroSrc) ? astroSrc : null);
  if (chosenSrc) {
    fs.copyFileSync(chosenSrc, dest);
    console.log(`✓ ${file} verified in dist/${file}`);
  }
}

// Copy API backend into dist/api
const apiSrc = path.join(projectRoot, "public", "api");
const apiDest = path.join(distDir, "api");
if (fs.existsSync(apiSrc)) {
  copyDirRecursive(apiSrc, apiDest);
  console.log("✓ Production API engine verified in dist/api/index.php");
}

// Copy .well-known into dist/.well-known
const wellKnownSrc = fs.existsSync(path.join(astroDist, ".well-known")) 
  ? path.join(astroDist, ".well-known") 
  : path.join(projectRoot, "public", ".well-known");
const wellKnownDest = path.join(distDir, ".well-known");
if (fs.existsSync(wellKnownSrc)) {
  copyDirRecursive(wellKnownSrc, wellKnownDest);
  console.log("✓ .well-known verified in dist/.well-known");
}

console.log("==> [4/4] Hybrid Build Completed Successfully!");
console.log("   - Marketing Pages: Astro SSG (multiserwis.edu.pl)");
console.log("   - Student & Guardian LMS: React SPA (szkolenia.multiserwis.edu.pl)");
console.log("   - Admin CMS & Manager: React SPA (panel.multiserwis.edu.pl)");
console.log("   - Backend REST API + SQLite: /api/index.php");
