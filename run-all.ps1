# One click: installs what is missing (Node.js LTS, Git) with winget, builds the apps, starts them.
$ErrorActionPreference = "Stop"
$Kit = $PSScriptRoot

function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
}
function Ensure([string]$cmd, [string]$wingetId, [string]$label) {
  if (Get-Command $cmd -ErrorAction SilentlyContinue) { Write-Host "$label found."; return }
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw "$label is missing and winget is not available. Install $label by hand (see README-WINDOWS.md), then run this again."
  }
  Write-Host "Installing $label (approve the prompt if Windows asks)..."
  winget install --id $wingetId -e --silent --accept-package-agreements --accept-source-agreements
  Refresh-Path
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    throw "$label installed, but this window cannot see it yet. Close this window and double-click RUN-ME.cmd again."
  }
}

Ensure "node" "OpenJS.NodeJS.LTS" "Node.js"
$major = [int]((node --version).TrimStart("v").Split(".")[0])
if ($major -lt 22) {
  Write-Host "Node.js $(node --version) is too old, upgrading..."
  winget upgrade --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
  Refresh-Path
}
Ensure "git" "Git.Git" "Git"

& (Join-Path $Kit "setup.ps1")
& (Join-Path $Kit "start.ps1")
