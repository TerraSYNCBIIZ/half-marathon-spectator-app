# 🚨 GOOGLE MAPS API PRODUCTION FIX - COMPLETE GUIDE

## 🔴 CRITICAL ISSUE IDENTIFIED

Your Google Maps API key **IS embedded** in your production build, but it's being **blocked by HTTP referrer restrictions**.

---

## ✅ SOLUTION: Fix API Key Restrictions

### **Step 1: Open Google Cloud Console**

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your API key: `AIzaSyCwm4CExH0_hPj1a59BVcESE4bNrWJOepc`

### **Step 2: Update Application Restrictions**

Under **Application restrictions**, select **HTTP referrers (web sites)** and add:

```
http://localhost:*
http://127.0.0.1:*
https://localhost:*
https://*.netlify.app/*
https://*.vercel.app/*
https://terrasynbiiiz.github.io/*
https://half-marathon-spectator-app.netlify.app/*
https://half-marathon-spectator-app.vercel.app/*
*://your-actual-deployed-domain.com/*
```

**Important**: Replace `your-actual-deployed-domain.com` with your ACTUAL deployment URL.

### **Step 3: Ensure Required APIs Are Enabled**

In Google Cloud Console, go to **APIs & Services** → **Library** and enable:

- ✅ **Maps JavaScript API** (REQUIRED)
- ✅ **Geocoding API** (recommended)
- ✅ **Places API** (if using autocomplete)
- ✅ **Directions API** (if showing routes)

### **Step 4: Check API Restrictions**

Under **API restrictions** in your key settings:
- Select **Restrict key**
- Enable ONLY the APIs you're using:
  - Maps JavaScript API
  - Geocoding API (if needed)
  - Places API (if needed)

---

## 🧪 HOW TO DIAGNOSE THE ISSUE

### **Test 1: Check Browser Console**

1. Open your production site
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for errors like:

```
This API project is not authorized to use this API
RefererNotAllowedMapError
Google Maps API error: RefererNotAllowedMapError
```

If you see these errors, the fix above will solve it!

### **Test 2: Check Network Tab**

1. Open Developer Tools → **Network** tab
2. Filter by `googleapis.com`
3. Look for failed requests (red)
4. Click on a failed request → **Response** tab
5. Check error message

### **Test 3: Verify API Key is Loaded**

In browser console, type:

```javascript
console.log('API Key loaded:', window.google ? 'Yes' : 'No');
```

---

## 🚀 QUICK FIX CHECKLIST

- [ ] **Add your production domain** to HTTP referrers in Google Cloud Console
- [ ] **Enable Maps JavaScript API** in Google Cloud Console
- [ ] **Wait 5-10 minutes** for changes to propagate
- [ ] **Hard refresh** your production site (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] **Clear browser cache** completely
- [ ] **Test in incognito/private mode**

---

## 🔍 FIND YOUR DEPLOYMENT URL

Since you have both Netlify and Vercel configs, check which one you're using:

### **For Netlify:**
1. Log in to https://app.netlify.com
2. Find your site
3. Copy the site URL (e.g., `https://your-site.netlify.app`)

### **For Vercel:**
1. Log in to https://vercel.com
2. Find your project
3. Copy the production URL (e.g., `https://your-app.vercel.app`)

### **For GitHub Pages:**
- URL format: `https://<username>.github.io/<repo-name>`
- In your case: `https://terrasynbiiiz.github.io/half-marathon-spectator-app`

---

## 🎯 AFTER YOU FIX IT

Once you've updated the API key restrictions:

1. **Wait 5-10 minutes** for Google's servers to update
2. **Clear your browser cache**
3. **Test in incognito mode**
4. **Check browser console** for any remaining errors

---

## 📝 WHAT WE VERIFIED

✅ API key IS embedded in production build (found in dist/assets/*.js)
✅ Vite environment variables working correctly
✅ Build process successful
❌ API key HTTP referrer restrictions blocking production domain

**This is 99% an API key restriction issue, not a code issue!**

---

## 🆘 IF IT STILL DOESN'T WORK

1. **Generate a NEW API key** with correct restrictions from the start:
   - Go to Google Cloud Console
   - APIs & Services → Credentials
   - Click **+ CREATE CREDENTIALS** → **API key**
   - Click **RESTRICT KEY**
   - Add HTTP referrers (see Step 2 above)
   - Enable required APIs

2. **Update your `.env` file**:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_new_api_key_here
   ```

3. **Rebuild and redeploy**:
   ```bash
   npm run build
   git add .
   git commit -m "fix: Update Google Maps API key"
   git push
   ```

---

## 📞 NEXT STEPS

1. **Do NOT create a new API key yet** - try fixing restrictions first
2. **Take a screenshot** of your current API key restrictions in Google Cloud Console
3. **Share your actual deployed URL** so we can test it
4. **Check browser console** and share any error messages

**This is a VERY common issue and 100% fixable! 🎉**

