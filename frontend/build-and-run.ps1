# Build and Run Script for Flex Living Frontend (PowerShell)
# Usage: .\build-and-run.ps1 -ClientId <CLIENT_ID> -ClientSecret <CLIENT_SECRET> [-Port <PORT>]

param(
    [Parameter(Mandatory=$true)]
    [string]$ClientId,
    
    [Parameter(Mandatory=$true)]
    [string]$ClientSecret,
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 3000
)

Write-Host "Building Docker image with provided credentials..." -ForegroundColor Cyan

docker build `
  --build-arg VITE_HOSTAWAY_CLIENT_ID=$ClientId `
  --build-arg VITE_HOSTAWAY_CLIENT_SECRET=$ClientSecret `
  -t flex-living-frontend:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Starting container..." -ForegroundColor Green
    
    # Stop and remove existing container if it exists
    docker stop flex-living-app 2>$null
    docker rm flex-living-app 2>$null
    
    docker run -d -p "${Port}:80" --name flex-living-app flex-living-frontend:latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Container started! Application available at http://localhost:$Port" -ForegroundColor Green
    } else {
        Write-Host "Failed to start container!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
