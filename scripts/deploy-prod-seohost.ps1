# Deploy Production to Client SEOHost Server (h108.seohost.pl)
# Unified Stack:
# 1. https://multiserwis.edu.pl           — Astro 7.4 SSG + React 19 Islands (Marketing & SEO)
# 2. https://szkolenia.multiserwis.edu.pl — Astro 7.4 + React 19 Islands (Student LMS & Company Guardian B2B)
# 3. https://panel.multiserwis.edu.pl     — Laravel 13.39 + Filament 5.11 CMS + REST API (MySQL / MariaDB 11.4)
[CmdletBinding()]
param(
  [string]$KeyPath = "D:\Projekty\_MOJE\.ssh\id_rsa_seohost",
  [string]$ServerHost = "h108.seohost.pl",
  [int]$ServerPort = 57185,
  [string]$ServerUser = "srv127364",
  [string]$MainDir = "/home/srv127364/domains/multiserwis.edu.pl/public_html",
  [string]$SzkoleniaDir = "/home/srv127364/domains/szkolenia.multiserwis.edu.pl/public_html",
  [string]$PanelPublicDir = "/home/srv127364/domains/panel.multiserwis.edu.pl/public_html",
  [string]$PanelBackendDir = "/home/srv127364/domains/panel.multiserwis.edu.pl/backend"
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot

if ($env:SEOHOST_SSH_KEY -and (Test-Path $env:SEOHOST_SSH_KEY)) {
  $KeyPath = $env:SEOHOST_SSH_KEY
} elseif (-not (Test-Path $KeyPath)) {
  $altKey = Join-Path $HOME '.ssh\id_rsa_seohost'
  if (Test-Path $altKey) {
    $KeyPath = $altKey
  } else {
    Write-Error "Nie znaleziono klucza SSH w $KeyPath"
    exit 1
  }
}

Write-Host "==> [1/5] Building Astro 7.4 + React 19 Islands bundle..." -ForegroundColor Cyan
Push-Location $projectRoot
try {
  & npm run build
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad budowania projektu frontendowego."
    exit 1
  }

  $distDir = Join-Path $projectRoot 'dist'
  $backendDir = Join-Path $projectRoot 'backend'

  $distArchive = Join-Path $projectRoot 'dist_prod.tar.gz'
  $backendArchive = Join-Path $projectRoot 'backend_prod.tar.gz'

  if (Test-Path $distArchive) { Remove-Item -Force $distArchive }
  if (Test-Path $backendArchive) { Remove-Item -Force $backendArchive }

  Write-Host "==> [2/5] Compressing frontend (dist/) and backend (backend/) archives..." -ForegroundColor Cyan
  & tar -czf $distArchive -C $distDir .
  & tar --exclude=".env" --exclude="node_modules" --exclude="storage/logs/*.log" --exclude="database/*.sqlite" -czf $backendArchive -C $backendDir .

  Write-Host "==> [3/5] Uploading archives to SEOHost ($ServerHost)..." -ForegroundColor Cyan
  & scp -P $ServerPort -i $KeyPath -o StrictHostKeyChecking=accept-new $distArchive $backendArchive "${ServerUser}@${ServerHost}:/home/${ServerUser}/"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad przesylania SCP."
    exit 1
  }

  Write-Host "==> [4/5] Extracting frontend & backend and running Laravel 13 Artisan tasks..." -ForegroundColor Cyan
  $remoteCommands = @(
    "set -e",
    "mkdir -p '$MainDir' '$SzkoleniaDir' '$PanelPublicDir' '$PanelBackendDir'",
    "tar -xzf /home/$ServerUser/dist_prod.tar.gz -C '$MainDir'",
    "tar -xzf /home/$ServerUser/dist_prod.tar.gz -C '$SzkoleniaDir'",
    "cp -f '$SzkoleniaDir/panel/index.html' '$SzkoleniaDir/index.html'",
    "tar -xzf /home/$ServerUser/backend_prod.tar.gz -C '$PanelBackendDir'",
    "cp -rf '$PanelBackendDir/public/.' '$PanelPublicDir/'",
    "sed -i 's|\.\./vendor/autoload\.php|../backend/vendor/autoload.php|g; s|\.\./bootstrap/app\.php|../backend/bootstrap/app.php|g; s|\.\./storage/framework/maintenance\.php|../backend/storage/framework/maintenance.php|g' '$PanelPublicDir/index.php'",
    "cd '$PanelBackendDir'",
    "mkdir -p storage/framework/{cache,sessions,views} storage/app/public bootstrap/cache database",
    "chmod -R 775 storage bootstrap/cache database",
    "if [ ! -f .env ]; then cp .env.example .env && sed -i 's|^MAIL_PASSWORD=.*|MAIL_PASSWORD=uT5ueCpSXc6DWbvmrGtK|' .env && /usr/local/bin/php artisan key:generate --force; fi",
    "/usr/local/bin/php artisan migrate --force",
    "/usr/local/bin/php artisan db:seed --force",
    "/usr/local/bin/php artisan multiserwis:import-legacy",
    "/usr/local/bin/php artisan filament:assets",
    "/usr/local/bin/php artisan optimize:clear",
    "cp -rf '$PanelBackendDir/public/js' '$PanelBackendDir/public/css' '$PanelBackendDir/public/fonts' '$PanelPublicDir/' 2>/dev/null || true",
    "ln -sfn '$PanelBackendDir/storage/app/public' '$PanelPublicDir/storage'",
    "ln -sfn '$PanelBackendDir/storage/app/public' '$MainDir/storage'",
    "ln -sfn '$PanelBackendDir/storage/app/public' '$SzkoleniaDir/storage'",
    "rm -f /home/$ServerUser/dist_prod.tar.gz /home/$ServerUser/backend_prod.tar.gz"
  ) -join " && "

  & ssh -p $ServerPort -i $KeyPath -o StrictHostKeyChecking=accept-new "${ServerUser}@${ServerHost}" "$remoteCommands"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad zdalnego wdrozenia na serwerze."
    exit 1
  }

  Write-Host "==> [5/5] Wdrozenie zakonczone sukcesem!" -ForegroundColor Green
  Write-Host "1. Portal Ofertowy (Astro 7):           https://multiserwis.edu.pl" -ForegroundColor Yellow
  Write-Host "2. Platforma LMS i B2B (React 19):      https://szkolenia.multiserwis.edu.pl" -ForegroundColor Yellow
  Write-Host "3. Panel CMS (Laravel 13 + Filament 5): https://panel.multiserwis.edu.pl/admin/kokpit" -ForegroundColor Yellow
} finally {
  if (Test-Path (Join-Path $projectRoot 'dist_prod.tar.gz')) { Remove-Item -Force (Join-Path $projectRoot 'dist_prod.tar.gz') }
  if (Test-Path (Join-Path $projectRoot 'backend_prod.tar.gz')) { Remove-Item -Force (Join-Path $projectRoot 'backend_prod.tar.gz') }
  Pop-Location
}
