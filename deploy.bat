@echo off
npm run build
git add -A
git commit -m "Revert to working LoadScript configuration"
git push origin main

