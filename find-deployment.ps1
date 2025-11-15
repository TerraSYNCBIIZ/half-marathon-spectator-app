# PowerShell script to find deployment URL

Write-Host "🔍 Finding your deployment URL..." -ForegroundColor Cyan
Write-Host ""

# Check if .git exists
if (Test-Path ".git") {
    Write-Host "📦 Git Repository Found" -ForegroundColor Green
    try {
        $remoteUrl = git remote get-url origin 2>$null
        Write-Host "Remote URL: $remoteUrl"
    } catch {
        Write-Host "No remote found"
    }
    Write-Host ""
}

# Check Netlify
if (Test-Path "netlify.toml") {
    Write-Host "🟢 Netlify Config Found (netlify.toml)" -ForegroundColor Green
    Write-Host "Likely URL format: https://[site-name].netlify.app"
    Write-Host ""
}

# Check Vercel
if (Test-Path "vercel.json") {
    Write-Host "▲ Vercel Config Found (vercel.json)" -ForegroundColor Magenta
    Write-Host "Likely URL format: https://[project-name].vercel.app"
    Write-Host ""
}

# Check GitHub repo for GitHub Pages
if (Test-Path ".git") {
    try {
        $repoUrl = git remote get-url origin 2>$null
        if ($repoUrl -match "github\.com") {
            Write-Host "🐙 GitHub Repository Detected" -ForegroundColor Yellow
            # Extract username and repo name
            if ($repoUrl -match "github\.com[:/]([^/]+)/([^/.]+)") {
                $username = $matches[1]
                $reponame = $matches[2]
                Write-Host "Potential GitHub Pages URL: https://$username.github.io/$reponame" -ForegroundColor White
            }
        }
    } catch {
        # Silent fail
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "1. Check your hosting dashboard (Netlify/Vercel/GitHub Pages)"
Write-Host "2. Copy your actual deployed URL"
Write-Host "3. Add it to Google Cloud Console API key restrictions"
Write-Host ""

# Based on your GitHub username from git remote
Write-Host "📝 LIKELY DEPLOYMENT URLS:" -ForegroundColor Cyan
Write-Host "  - GitHub Pages: https://terrasynbiiiz.github.io/half-marathon-spectator-app"
Write-Host "  - Netlify: https://half-marathon-spectator-app.netlify.app (or custom)"
Write-Host "  - Vercel: https://half-marathon-spectator-app.vercel.app (or custom)"
Write-Host ""

