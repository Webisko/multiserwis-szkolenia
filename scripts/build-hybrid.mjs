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

// Copy Astro dist into root dist, without overwriting 'assets' or 'panel'
copyDirRecursive(astroDist, distDir, ["assets", "panel"]);

// Copy .htaccess into dist
const htaccessSrc = path.join(projectRoot, "public", ".htaccess");
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, path.join(distDir, ".htaccess"));
  console.log("✓ Hybrid .htaccess copied to dist/.htaccess");
}

console.log("==> [4/4] Hybrid Build Completed Successfully!");
console.log("   - Marketing Pages: Astro SSG (Static HTML)");
console.log("   - LMS / Admin / Manager / Guardian: React SPA (/panel/index.html)");
