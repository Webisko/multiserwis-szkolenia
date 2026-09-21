# Deploy Staging to SEOHost via SSH/SCP
[CmdletBinding()]
param(
  [string]$KeyPath = "d:\Projekty\_MOJE\naturalne-rodzicielstwo-dev\.ssh\id_rsa_seohost",
  [string]$ServerHost = "h51.seohost.pl",
  [int]$ServerPort = 57185,
  [string]$ServerUser = "srv78841",
  [string]$RemoteDir = "/home/srv78841/domains/multiserwis-szkolenia.webisko.pl/public_html"
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

Write-Host "==> [1/4] Building static frontend for server (Vite)..." -ForegroundColor Cyan
Push-Location $projectRoot
try {
  & npm run build:server
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad budowania frontendu."
    exit 1
  }

  $distDir = Join-Path $projectRoot 'dist'
  if (-not (Test-Path $distDir)) {
    Write-Error "Katalog dist nie istnieje!"
    exit 1
  }

  $archivePath = Join-Path $projectRoot 'dist_staging.tar.gz'
  if (Test-Path $archivePath) {
    Remove-Item -Force $archivePath
  }

  Write-Host "==> [2/4] Compressing dist archive..." -ForegroundColor Cyan
  & tar -czf $archivePath -C $distDir .
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad pakowania archiwum tar."
    exit 1
  }

  Write-Host "==> [3/4] Uploading archive to SEOHost..." -ForegroundColor Cyan
  & scp -P $ServerPort -i $KeyPath -o StrictHostKeyChecking=accept-new $archivePath "${ServerUser}@${ServerHost}:${RemoteDir}/dist_staging.tar.gz"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad przesylania SCP."
    exit 1
  }

  Write-Host "==> [4/4] Extracting release on server..." -ForegroundColor Cyan
  $remoteCommands = "cd '$RemoteDir' && tar -xzf dist_staging.tar.gz && rm -f dist_staging.tar.gz"
  & ssh -p $ServerPort -i $KeyPath -o StrictHostKeyChecking=accept-new "${ServerUser}@${ServerHost}" "$remoteCommands"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Blad zdalnego rozpakowywania na serwerze."
    exit 1
  }

  Write-Host "Wdrozenie zakonczone sukcesem!" -ForegroundColor Green
  Write-Host "Staging dostepny pod adresem: https://multiserwis-szkolenia.webisko.pl" -ForegroundColor Yellow
} finally {
  $archivePath = Join-Path $projectRoot 'dist_staging.tar.gz'
  if (Test-Path $archivePath) {
    Remove-Item -Force $archivePath
  }
  Pop-Location
}
