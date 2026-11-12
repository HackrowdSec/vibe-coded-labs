# Builds fresh, runnable copies of the three lab apps in %USERPROFILE%\vibe-labs, each with its own git history.
# Safe to run any number of times: it wipes vibe-labs and starts again. Needs Node.js 22+ and Git for Windows.
$ErrorActionPreference = "Stop"
$Kit = $PSScriptRoot
$Out = if ($env:VIBE_LABS_DIR) { $env:VIBE_LABS_DIR } else { Join-Path $HOME "vibe-labs" }
$Demo = Join-Path $Out "buka-orders"
$Origin = Join-Path $Out ".buka-orders-origin.git"

function Run([string]$exe, [string[]]$params) {
  & $exe @params
  if ($LASTEXITCODE -ne 0) { throw "Failed: $exe $($params -join ' ')" }
}
function Fresh([string]$dir) {
  if (Test-Path $dir) { Remove-Item $dir -Recurse -Force }
  New-Item -ItemType Directory -Path $dir | Out-Null
}
function Commit([string]$msg, [string]$name, [string]$email) {
  Run git @("add", "-A")
  Run git @("-c", "user.name=$name", "-c", "user.email=$email", "commit", "-q", "-m", $msg)
}
function Ignore([string[]]$lines) { Set-Content -Path ".gitignore" -Value $lines -Encoding ascii }

foreach ($tool in "node", "git") {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "$tool is not installed. See README-WINDOWS.md." }
}
$major = [int]((node --version).TrimStart("v").Split(".")[0])
if ($major -lt 22) { throw "Node.js 22 or newer is needed (found $(node --version))." }

# ---- Buka Orders: main, then an AI-generated feature on feat/orders; a local bare repo stands in for GitHub ----
Fresh $Out
New-Item -ItemType Directory -Path $Demo | Out-Null
Copy-Item -Path (Join-Path $Kit "apps\buka-orders\*") -Destination $Demo -Recurse
Push-Location $Demo
try {
  Run git @("init", "-q", "-b", "main")
  Ignore @("node_modules", ".env*")
  Commit "Buka Orders: sign-in and my orders list" "Lab" "lab@sample.test"
  Run git @("init", "-q", "--bare", $Origin)
  Run git @("remote", "add", "origin", $Origin)
  Run git @("push", "-q", "origin", "main")
  Run git @("remote", "set-head", "origin", "main")
  Run git @("checkout", "-q", "-b", "feat/orders")
  Copy-Item (Join-Path $Kit "setup\buka-orders-feature\routes\orders.js") (Join-Path $Demo "routes\orders.js") -Force
  Commit "Add order detail page and admin refunds (AI-generated)" "Lab" "lab@sample.test"
} finally { Pop-Location }

# ---- Ajo Circle and ClinicSlot ----
$ajo = Join-Path $Out "ajo-circle"
Copy-Item -Path (Join-Path $Kit "apps\ajo-circle") -Destination $ajo -Recurse
Push-Location $ajo
try {
  Run git @("init", "-q", "-b", "main")
  Ignore @("node_modules", ".env*")
  Commit "Ajo Circle: circles, contributions, payouts" "Lab" "lab@sample.test"
} finally { Pop-Location }

# ClinicSlot: its git history matters too.
$clinic = Join-Path $Out "clinicslot"
Copy-Item -Path (Join-Path $Kit "apps\clinicslot") -Destination $clinic -Recurse
Push-Location $clinic
try {
  Run git @("init", "-q", "-b", "main")
  Copy-Item (Join-Path $Kit "setup\clinicslot-history.env") ".env"
  Ignore @("node_modules")
  Commit "ClinicSlot: booking form, staff view, data API" "Lab" "lab@sample.test"
  Run git @("rm", "-q", "--cached", ".env")
  Remove-Item ".env" -Force
  Ignore @("node_modules", ".env*")
  Commit "Remove .env to fix deploy" "Lab" "lab@sample.test"
} finally { Pop-Location }

Write-Host ""
Write-Host "Ready."
Write-Host "  Labs in $Out"
Write-Host "Next: double-click START.cmd"
