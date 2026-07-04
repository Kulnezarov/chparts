# Upload CHparts to VPS without git (PowerShell).
# Usage:
#   .\deploy\vps\upload-from-windows.ps1 -SshTarget "ubuntu@37365"
param(
  [string]$SshTarget = "ubuntu@37365",
  [string]$RemoteDir = "/opt/chparts"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path (Join-Path $ProjectRoot "package.json"))) {
  throw "Cannot find package.json in $ProjectRoot"
}

$Archive = Join-Path $env:TEMP "chparts-deploy.tar.gz"
Write-Host "==> Archive from $ProjectRoot"

if (-not (Get-Command tar -ErrorAction SilentlyContinue)) {
  throw "tar is required (Windows 10+). Or use git clone on the VPS."
}

Push-Location $ProjectRoot
tar --exclude=node_modules --exclude=.next --exclude=.git --exclude=".env*.local" -czf $Archive .
Pop-Location

Write-Host "==> SSH: mkdir $RemoteDir"
ssh $SshTarget "sudo mkdir -p $RemoteDir && sudo chown `$USER:`$USER $RemoteDir"
if ($LASTEXITCODE -ne 0) { throw "SSH failed (exit $LASTEXITCODE). Check: ssh $SshTarget" }

Write-Host "==> SCP archive"
scp $Archive "${SshTarget}:${RemoteDir}/chparts-deploy.tar.gz"
if ($LASTEXITCODE -ne 0) { throw "SCP failed (exit $LASTEXITCODE)" }

Write-Host "==> Extract and deploy on server"
$RemoteScript = @"
set -e
cd $RemoteDir
tar -xzf chparts-deploy.tar.gz
rm -f chparts-deploy.tar.gz
if [ ! -f .env.vps ]; then cp deploy/vps/.env.example .env.vps; fi
bash deploy/vps/redeploy.sh
"@
ssh $SshTarget $RemoteScript
if ($LASTEXITCODE -ne 0) { throw "Remote deploy failed (exit $LASTEXITCODE)" }

Remove-Item $Archive -ErrorAction SilentlyContinue
Write-Host "==> Done: https://chparts.kz"
