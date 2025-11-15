# 🗺️ Production Map Fix Guide

## Problem Summary
The map visualizes perfectly locally but fails in production (Netlify).

## Root Causes Identified

### 1. ✅ .env File Was Committed to Git
- **Status**: FIXED
- **Issue**: The `.env` file containing `VITE_GOOGLE_MAPS_API_KEY` was tracked and committed to git
- **Why it caused issues**: 
  - ✅ Local works: Vite dev server reads `.env` file
  - ❌ Production fails: Netlify doesn't use `.env` from git repo
- **Fix Applied**: 
  - Added `.env` to `.gitignore`
  - Removed `.env` from git tracking with `git rm --cached .env`

### 2. ✅ Missing Netlify Environment Variable
- **Status**: NEEDS MANUAL ACTION
- **Issue**: `VITE_GOOGLE_MAPS_API_KEY` is not configured in Netlify
- **Fix Required**: See instructions below

### 3. ⚠️ API Key Exposed in Git History
- **Status**: SECURITY CONCERN
- **Issue**: Your Google Maps API key is visible in git commit history
- **Recommendation**: Rotate the API key if repo is public

---

## 🔧 Required Actions

### Step 1: Commit the Fixes
```bash
git add .gitignore netlify.toml
git commit -m "fix: Remove .env from git and update .gitignore"
git push origin main
```

### Step 2: Configure Netlify Environment Variable ⚠️ **CRITICAL**
This is why production is failing!

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your project: **half-marathon-spectator-app**
3. Go to **Site Settings** → **Build & Deploy** → **Environment Variables**
4. Click **Add a variable**
5. Add:
   - **Key**: `VITE_GOOGLE_MAPS_API_KEY`
   - **Value**: `AIzaSyAxR4ikSCGoYlDALlSgSnYjAQdGzMpseBs`
6. Set scope: **All deploys** (or specific branches)
7. Click **Save**

### Step 3: Trigger a New Deployment
After adding the environment variable:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete
4. Test the map - it should now work! 🎉

### Step 4: (Optional but Recommended) Rotate API Key
If your GitHub repo is **public**, your API key was exposed. Consider:

1. Generate a new Google Maps API key:
   - Go to: https://console.cloud.google.com/google/maps-apis
   - Create a new API key
   - Enable "Maps JavaScript API"
   - Add HTTP referrer restrictions (e.g., `https://your-netlify-url.netlify.app/*`)

2. Update the key in:
   - Your local `.env` file
   - Netlify environment variables (replace the old key)

3. (Optional) Delete the old API key from Google Cloud Console

---

## 🎯 Why This Happened

**Vite Environment Variables**:
- Vite bundles environment variables **at build time**
- Variables starting with `VITE_` are embedded in the client-side bundle
- `.env` files are **never** deployed - they're only for local development
- Production environments need variables configured in the hosting platform

**The Flow**:
```
Local Development:
  .env file → Vite dev server → Works ✅

Production (Netlify):
  No .env file → Netlify env vars → Vite build → Works ✅
  No env vars configured → Vite build → Empty API key → Fails ❌
```

---

## ✅ Verification Checklist

- [x] `.env` added to `.gitignore`
- [x] `.env` removed from git tracking
- [x] Documentation updated
- [ ] Changes committed and pushed
- [ ] Environment variable added to Netlify
- [ ] New deployment triggered
- [ ] Map tested in production
- [ ] (If public repo) API key rotated

---

## 📚 Best Practices Going Forward

1. **Never commit `.env` files** - They should always be in `.gitignore`
2. **Use `.env.example`** - Commit this with placeholder values
3. **Document required env vars** - List them in README
4. **Restrict API keys** - Use HTTP referrer restrictions in Google Cloud Console
5. **Different keys per environment** - Consider separate keys for dev/staging/prod

---

## 🆘 If Map Still Doesn't Work

1. Check browser console for errors
2. Verify the API key in Netlify dashboard matches your Google Cloud Console key
3. Ensure the API key has "Maps JavaScript API" enabled
4. Check if there are billing/quota issues in Google Cloud Console
5. Verify the build logs in Netlify show the environment variable (it will show as `VITE_GOOGLE_MAPS_API_KEY: [secure]`)

---

Generated: 2025-11-15

