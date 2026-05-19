$Base = "http://localhost:3000/api/v1"
$results = @()

function Test-Api {
  param(
    [string]$Name,
    [string]$Method = "GET",
    [string]$Path,
    [hashtable]$Headers = @{},
    $Body = $null,
    [int[]]$ExpectStatus = @(200, 201)
  )
  $uri = "$Base$Path"
  try {
    $params = @{
      Uri         = $uri
      Method      = $Method
      Headers     = $Headers
      ContentType = "application/json"
    }
    if ($null -ne $Body) {
      $params.Body = ($Body | ConvertTo-Json -Compress -Depth 6)
    }
    $resp = Invoke-WebRequest @params -UseBasicParsing
    $ok = $ExpectStatus -contains $resp.StatusCode
    $script:results += [pscustomobject]@{
      Test   = $Name
      Pass   = $ok
      Status = $resp.StatusCode
      Note   = if ($ok) { "OK" } else { "unexpected status" }
    }
    try {
      return ($resp.Content | ConvertFrom-Json).data
    } catch {
      return ($resp.Content | ConvertFrom-Json)
    }
  } catch {
    $status = $_.Exception.Response.StatusCode.value__
    $ok = $ExpectStatus -contains $status
    $script:results += [pscustomobject]@{
      Test   = $Name
      Pass   = $ok
      Status = $status
      Note   = $_.ErrorDetails.Message
    }
    return $null
  }
}

Write-Host "=== Calorie API Regression ===" -ForegroundColor Cyan

Test-Api "GET /api/v1 root" -Path ""
Test-Api "GET health" -Path "/health"

$login = Test-Api "POST wechat login" -Method POST -Path "/auth/wechat" -Body @{ code = "regression-test-user" }
if (-not $login.accessToken) {
  Write-Host "FATAL: cannot obtain user token" -ForegroundColor Red
  $results | Format-Table -AutoSize
  exit 1
}
$userHeaders = @{ Authorization = "Bearer $($login.accessToken)" }

Test-Api "GET users/me" -Path "/users/me" -Headers $userHeaders
Test-Api "PATCH users/me (onboarding)" -Method PATCH -Path "/users/me" -Headers $userHeaders -Body @{
  gender         = 1
  age            = 28
  heightCm       = 175
  weightKg       = 70
  activityLevel  = "light"
  healthMode     = "lose_fat"
  recalculateGoals = $true
}
Test-Api "GET modes" -Path "/modes" -Headers $userHeaders

$foods = Test-Api "GET foods search" -Path "/foods?q=%E7%B1%B3" -Headers $userHeaders
$foodId = $foods[0].id
if ($foodId) {
  Test-Api "GET food by id" -Path "/foods/$foodId" -Headers $userHeaders
} else {
  $results += [pscustomobject]@{ Test = "GET food by id"; Pass = $false; Status = "-"; Note = "no food in search" }
}

$recognition = Test-Api "POST recognition analyze" -Method POST -Path "/recognition/analyze" -Headers $userHeaders -Body @{
  imageUrl = "https://example.com/rice.jpg"
}
if ($recognition.taskId) {
  Test-Api "POST recognition feedback" -Method POST -Path "/recognition/feedback" -Headers $userHeaders -Body @{
    taskId       = $recognition.taskId
    reportedName = "回归测试纠错"
    note         = "regression"
  }
}
if ($foodId) {
  Test-Api "POST food-log" -Method POST -Path "/food-logs" -Headers $userHeaders -Body @{
    foodId   = $foodId
    mealType = "lunch"
    source   = "manual"
    servingG = 200
  }
}
Test-Api "GET daily-summary" -Path "/food-logs/daily-summary" -Headers $userHeaders
Test-Api "GET weekly-trend" -Path "/food-logs/weekly-trend?days=7" -Headers $userHeaders

Test-Api "GET users/me without token (401)" -Path "/users/me" -ExpectStatus @(401, 403)

$adminLogin = Test-Api "POST admin login" -Method POST -Path "/admin/auth/login" -Body @{
  username = "admin"
  password = "admin123"
}
$adminHeaders = @{ Authorization = "Bearer $($adminLogin.accessToken)" }

Test-Api "GET admin stats" -Path "/admin/stats/overview" -Headers $adminHeaders
Test-Api "GET admin foods" -Path "/admin/foods" -Headers $adminHeaders
Test-Api "GET admin modes" -Path "/admin/modes" -Headers $adminHeaders
Test-Api "GET admin recognition-feedback" -Path "/admin/recognition-feedback" -Headers $adminHeaders

$newFood = Test-Api "POST admin create food" -Method POST -Path "/admin/foods" -Headers $adminHeaders -Body @{
  name            = "回归测试食物"
  category        = "测试"
  caloriesPer100g = 100
  proteinPer100g  = 5
  carbsPer100g    = 15
  fatPer100g      = 2
  defaultServingG = 100
}
if ($newFood.id) {
  Test-Api "PATCH admin update food" -Method PATCH -Path "/admin/foods/$($newFood.id)" -Headers $adminHeaders -Body @{
    name = "回归测试食物-已改"
  }
}

Test-Api "PATCH admin mode config" -Method PATCH -Path "/admin/modes/lose_fat" -Headers $adminHeaders -Body @{
  label  = "减脂"
  config = @{ calorieDeficit = 400; proteinPerKg = 1.6 }
}

Write-Host ""
$results | Format-Table -AutoSize
$failed = @($results | Where-Object { -not $_.Pass })
if ($failed.Count -gt 0) {
  Write-Host "FAILED: $($failed.Count) / $($results.Count)" -ForegroundColor Red
  exit 1
}
Write-Host "PASSED: $($results.Count) / $($results.Count)" -ForegroundColor Green
