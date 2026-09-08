$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# 1. Clean temp files
foreach ($f in @("git_status.txt","gh_check.txt","toplevel.txt")) {
    if (Test-Path "$root\$f") { Remove-Item "$root\$f" -Force }
}

# 2. Init a fresh, independent git repo inside this project folder
Write-Output "=== git init (branch: main) ==="
git init -b main 2>&1
Write-Output ("toplevel: " + (git rev-parse --show-toplevel))

# 3. Stage everything (gitignore excludes node_modules, .env, *.pkl, logs, dist)
Write-Output "=== git add . ==="
git add . 2>&1

# 4. Safety check: no sensitive files staged
$staged = git diff --cached --name-only
Write-Output ("staged file count: " + $staged.Count)
$bad = $staged | Where-Object { $_ -match '(^|/)\.env$' -or $_ -match 'node_modules' -or $_ -match '\.pkl$' -or $_ -match '\.log$' -or $_ -match 'dist/' }
if ($bad) {
    Write-Output "ABORT - sensitive/ignored files staged:"
    $bad
    exit 1
}
Write-Output "safety check passed: no .env / node_modules / .pkl / .log / dist staged"

# 5. Commit
Write-Output "=== git commit ==="
git commit -m "AI College Admission Predictor: React frontend, Express backend, scikit-learn ML service

- frontend/: React 18 + Vite SPA (predictor, results, colleges, auth, dashboard)
- backend/: Express REST API with JWT auth, MongoDB models, college matching
- ai-model/: Flask microservice serving a GradientBoosting admission model
- In-memory MongoDB fallback + heuristic prediction fallback for zero-setup dev" 2>&1 | Select-Object -First 5

Write-Output ("commit: " + (git log --oneline -1))
Write-Output ("total commits: " + (git rev-list --count HEAD))
Write-Output "=== PHASE 1 DONE ==="
