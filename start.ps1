# Starts the three lab apps (this computer only), each in its own small window, then opens them in the browser.
$ErrorActionPreference = "Stop"
$Out = if ($env:VIBE_LABS_DIR) { $env:VIBE_LABS_DIR } else { Join-Path $HOME "vibe-labs" }
$apps = @(
  @{ Name = "Buka Orders 3000"; Dir = Join-Path $Out "buka-orders"; Url = "http://localhost:3000" },
  @{ Name = "Ajo Circle 3001"; Dir = Join-Path $Out "ajo-circle"; Url = "http://localhost:3001" },
  @{ Name = "ClinicSlot 3002"; Dir = Join-Path $Out "clinicslot"; Url = "http://localhost:3002" }
)
foreach ($a in $apps) {
  if (-not (Test-Path $a.Dir)) { throw "$($a.Dir) is missing. Run SETUP.cmd first." }
  $cmd = "`$host.UI.RawUI.WindowTitle = '$($a.Name)'; Set-Location '$($a.Dir)'; node server.js"
  Start-Process powershell -ArgumentList "-NoExit", "-NoProfile", "-Command", $cmd -WindowStyle Minimized
}
Start-Sleep -Seconds 3
foreach ($a in $apps) { Start-Process $a.Url }
Write-Host "Started. Close the three minimised windows to stop the apps."
