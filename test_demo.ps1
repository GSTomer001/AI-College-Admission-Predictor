$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Output "=== JS inference test (model.json vs sklearn samples) ==="
Set-Location $root
node test_model.mjs 2>&1

Write-Output "=== demo build ==="
npm run build:demo --prefix frontend 2>&1 | Select-Object -Last 12

Write-Output "=== dist contents ==="
Get-ChildItem "$root\frontend\dist" -Recurse -File | ForEach-Object { $_.FullName.Replace("$root\frontend\dist", '') + "  (" + [math]::Round($_.Length/1KB, 1) + " KB)" }
Write-Output "=== DONE ==="
