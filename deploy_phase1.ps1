$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Output "=== enable GitHub Pages (workflow source) ==="
gh api -X POST repos/GSTomer001/AI-College-Admission-Predictor/pages -f build_type=workflow 2>&1 | Select-Object -First 3

Write-Output "=== git add / commit / push ==="
git add . 2>&1 | Select-Object -First 3
$staged = git diff --cached --name-only
Write-Output ("staged count: " + $staged.Count)
$staged | ForEach-Object { Write-Output "  + $_" }
$bad = $staged | Where-Object { $_ -match '(^|/)\.env$' -or $_ -match 'node_modules' -or $_ -match '\.log$' }
if ($bad) { Write-Output "ABORT: sensitive files staged"; $bad; exit 1 }

git commit -m "Add GitHub Pages live demo: browser-side ML inference + auto-deploy workflow

- ai-model/export_model.py: exports trained model JSON (verified vs sklearn)
- frontend demo mode: JS inference engine, localStorage auth/predictions
- GitHub Actions workflow: build demo bundle and deploy to Pages" 2>&1 | Select-Object -First 3
git push origin main 2>&1 | Select-Object -First 5

Write-Output "=== trigger status ==="
git log --oneline -2 2>&1
Write-Output "=== DONE ==="
