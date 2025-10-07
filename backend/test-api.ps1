Write-Host "Testing Backend API endpoints..." -ForegroundColor Green

try {
    Write-Host "`nTesting Health Endpoint..." -ForegroundColor Yellow
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method Get -ContentType "application/json"
    Write-Host "✅ Health Check Successful" -ForegroundColor Green
    $healthResponse | ConvertTo-Json -Depth 3
    
    Write-Host "`nTesting Groups Endpoint..." -ForegroundColor Yellow
    $groupsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/groups" -Method Get -ContentType "application/json"
    Write-Host "✅ Groups Endpoint Successful" -ForegroundColor Green
    Write-Host "Found $($groupsResponse.count) groups" -ForegroundColor Cyan
    
    Write-Host "`nTesting Users Endpoint..." -ForegroundColor Yellow
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users" -Method Get -ContentType "application/json"
    Write-Host "✅ Users Endpoint Successful" -ForegroundColor Green
    Write-Host "Found $($usersResponse.count) users" -ForegroundColor Cyan
    
    Write-Host "`n🎉 All API tests passed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ API Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}