#!/bin/bash

echo "🔍 Finding your deployment URL..."
echo ""

# Check if .git exists
if [ -d ".git" ]; then
    echo "📦 Git Repository Found"
    echo "Remote URL: $(git remote get-url origin 2>/dev/null || echo 'No remote found')"
    echo ""
fi

# Check Netlify
if [ -f "netlify.toml" ]; then
    echo "🟢 Netlify Config Found (netlify.toml)"
    echo "Likely URL format: https://[site-name].netlify.app"
    echo ""
fi

# Check Vercel
if [ -f "vercel.json" ]; then
    echo "▲ Vercel Config Found (vercel.json)"
    echo "Likely URL format: https://[project-name].vercel.app"
    echo ""
fi

# Check GitHub repo for GitHub Pages
if [ -d ".git" ]; then
    REPO_URL=$(git remote get-url origin 2>/dev/null)
    if [[ $REPO_URL == *"github.com"* ]]; then
        echo "🐙 GitHub Repository Detected"
        # Extract username and repo name
        if [[ $REPO_URL =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
            USERNAME="${BASH_REMATCH[1]}"
            REPONAME="${BASH_REMATCH[2]}"
            echo "Potential GitHub Pages URL: https://${USERNAME}.github.io/${REPONAME}"
        fi
    fi
fi

echo ""
echo "============================================"
echo "ACTION REQUIRED:"
echo "============================================"
echo "1. Check your hosting dashboard (Netlify/Vercel/GitHub Pages)"
echo "2. Copy your actual deployed URL"
echo "3. Add it to Google Cloud Console API key restrictions"
echo ""

