# Deploy Production to Client SEOHost Server (h108.seohost.pl)
# Domains:
# 1. https://multiserwis.edu.pl (Astro SSG Marketing & SEO)
# 2. https://szkolenia.multiserwis.edu.pl (Student LMS & Company Guardian B2B)
# 3. https://panel.multiserwis.edu.pl (Admin CMS & Manager Panel)
[CmdletBinding()]
param(
  [string]$KeyPath = "D:\Projekty\_MOJE\.ssh\id_rsa_seohost",
  [string]$ServerHost = "h108.seohost.pl",
  [int]$ServerPort = 57185,
  [string]$ServerUser = "srv127364",
  [string]$MainDir = "/home/srv127364/domains/multiserwis.edu.pl/public_html",
  [string]$SzkoleniaDir = "/home/srv127364/domains/szkolenia.multiserwis.edu.pl/public_html",
  [string]$PanelDir = "/home/srv127364/domains/panel.multiserwis.edu.pl/public_html",
  [string]$LegacyPlatformaDir = "/home/srv127364/domains/platforma.multiserwis.edu.pl/public_html"
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

Write-Host "==> [1/4] Building hybrid bundle (Astro SSG + React SPA + API)..." -ForegroundColor Cyan
Push-Location $projectRoot
try {
  & npm run build:server
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad budowania projektu."
    exit 1
  }

  $distDir = Join-Path $projectRoot 'dist'
  if (-not (Test-Path $distDir)) {
    Write-Error "Katalog dist nie istnieje!"
    exit 1
  }

  $archivePath = Join-Path $projectRoot 'dist_prod.tar.gz'
  if (Test-Path $archivePath) {
    Remove-Item -Force $archivePath
  }

  Write-Host "==> [2/4] Compressing dist archive..." -ForegroundColor Cyan
  & tar -czf $archivePath -C $distDir .
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad pakowania archiwum tar."
    exit 1
  }

  Write-Host "==> [3/4] Uploading archive to SEOHost ($ServerHost)..." -ForegroundColor Cyan
  & scp -P $ServerPort -i $KeyPath -o StrictHostKeyChecking=accept-new $archivePath "${ServerUser}@${ServerHost}:/home/${ServerUser}/dist_prod.tar.gz"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad przesylania SCP."
    exit 1
  }

  Write-Host "==> [4/4] Extracting release to multiserwis.edu.pl, szkolenia.multiserwis.edu.pl, and panel.multiserwis.edu.pl..." -ForegroundColor Cyan
  $remoteCommands = @(
    "set -e",
    "mkdir -p '$MainDir' '$SzkoleniaDir' '$PanelDir' '/home/$ServerUser/domains/multiserwis.edu.pl/data'",
    "chmod 700 '/home/$ServerUser/domains/multiserwis.edu.pl/data'",
    "tar -xzf /home/$ServerUser/dist_prod.tar.gz -C '$MainDir'",
    "tar -xzf /home/$ServerUser/dist_prod.tar.gz -C '$SzkoleniaDir'",
    "cp -f '$SzkoleniaDir/panel/index.html' '$SzkoleniaDir/index.html'",
    "tar -xzf /home/$ServerUser/dist_prod.tar.gz -C '$PanelDir'",
    "cp -f '$PanelDir/panel/index.html' '$PanelDir/index.html'",
    "rm -f /home/$ServerUser/dist_prod.tar.gz"
  ) -join " && "

  & ssh -p $ServerPort -i $KeyPath -o StrictHostKeyChecking=accept-new "${ServerUser}@${ServerHost}" "$remoteCommands"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad zdalnego rozpakowywania na serwerze."
    exit 1
  }

  Write-Host "Wdrozenie zakonczone sukcesem!" -ForegroundColor Green
  Write-Host "1. Portal Ofertowy:       https://multiserwis.edu.pl" -ForegroundColor Yellow
  Write-Host "2. Platforma Szkoleniowa: https://szkolenia.multiserwis.edu.pl" -ForegroundColor Yellow
  Write-Host "3. Panel Zarzadzania CMS: https://panel.multiserwis.edu.pl" -ForegroundColor Yellow
} finally {
  $archivePath = Join-Path $projectRoot 'dist_prod.tar.gz'
  if (Test-Path $archivePath) {
    Remove-Item -Force $archivePath
  }
  Pop-Location
}
