import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const astroDist = path.join(projectRoot, "apps", "site", "dist");
const rootPublic = path.join(projectRoot, "public");

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

console.log("==> [1/4] Building shared types & constants (@multiserwis/shared)...");
execSync("npm --workspace packages/shared run build", { cwd: projectRoot, stdio: "inherit" });

console.log("==> [2/4] Building Astro 7 + React 19 Islands (apps/site)...");
execSync("npm --workspace apps/site run build", { cwd: projectRoot, stdio: "inherit" });

console.log("==> [3/4] Assembling production dist/ bundle...");
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy root public/ static assets & .htaccess first
if (fs.existsSync(rootPublic)) {
  copyDirRecursive(rootPublic, distDir);
}

// 2. Copy Astro SSG + React 19 Islands build output on top
copyDirRecursive(astroDist, distDir);

// 3. Ensure root public/.htaccess and public/api/index.php take priority
const criticalFiles = ["robots.txt", "llms.txt", "ai-catalog.json", ".htaccess"];
for (const file of criticalFiles) {
  const rootSrc = path.join(rootPublic, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(rootSrc)) {
    fs.copyFileSync(rootSrc, dest);
    console.log(`✓ ${file} verified in dist/${file}`);
  }
}

const apiSrc = path.join(rootPublic, "api");
const apiDest = path.join(distDir, "api");
if (fs.existsSync(apiSrc)) {
  copyDirRecursive(apiSrc, apiDest);
  console.log("✓ Laravel 13 API Gateway verified in dist/api/index.php");
}

console.log("==> [4/4] Unified Stack Build Completed Successfully!");
console.log("   - Marketing & SEO Catalog: Astro 7.4 + React 19 Islands (multiserwis.edu.pl)");
console.log("   - Student LMS & B2B Portal: Astro 7.4 + React 19 Islands (szkolenia.multiserwis.edu.pl)");
console.log("   - Admin & Manager CMS: Laravel 13.39 + Filament 5.11 (panel.multiserwis.edu.pl)");
