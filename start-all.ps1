# Start all three services in the background and verify they come up.
# Usage: powershell -ExecutionPolicy Bypass -File start-all.ps1
$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Test-Port($port) {
  try {
    $tcp = New-Object Net.Sockets.TcpClient
    $r = $tcp.BeginConnect("127.0.0.1", $port, $null, $null)
    $ok = $r.AsyncWaitHandle.WaitOne(500)
    $tcp.Close()
    return $ok
  } catch { return $false }
}

Write-Output "Starting AI/ML service on port 5001..."
Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory "$root\ai-model" -RedirectStandardOutput "$root\log_ai.log" -RedirectStandardError "$root\log_ai_err.log" -WindowStyle Hidden

Write-Output "Starting backend API on port 5000..."
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$root\backend" -RedirectStandardOutput "$root\log_backend.log" -RedirectStandardError "$root\log_backend_err.log" -WindowStyle Hidden

Write-Output "Starting frontend on port 5173..."
Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory "$root\frontend" -RedirectStandardOutput "$root\log_frontend.log" -RedirectStandardError "$root\log_frontend_err.log" -WindowStyle Hidden

Start-Sleep -Seconds 12
Write-Output ("AI service (5001) : " + $(if (Test-Port 5001) { "UP" } else { "still starting (see log_ai.log)" }))
Write-Output ("Backend API (5000): " + $(if (Test-Port 5000) { "UP" } else { "still starting (see log_backend.log)" }))
Write-Output ("Frontend  (5173)  : " + $(if (Test-Port 5173) { "UP" } else { "still starting (see log_frontend.log)" }))
Write-Output "Open http://localhost:5173 in your browser."
