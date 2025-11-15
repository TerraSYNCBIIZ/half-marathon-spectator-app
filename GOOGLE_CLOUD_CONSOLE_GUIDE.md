# 🎯 GOOGLE CLOUD CONSOLE - STEP-BY-STEP VISUAL GUIDE

## 📍 **Your Current Situation**

```
┌─────────────────────────────────────────────────────────────┐
│  LOCAL (Works ✅)          PRODUCTION (Broken ❌)            │
├─────────────────────────────────────────────────────────────┤
│  localhost:5173            terrasynbiiiz.github.io          │
│  ↓                         ↓                                 │
│  API Key ✅                API Key ❌ BLOCKED                │
│  Maps Load ✅              Maps Don't Load ❌                │
└─────────────────────────────────────────────────────────────┘

WHY? → HTTP Referrer Restrictions only allow localhost
```

---

## 🔧 **STEP-BY-STEP FIX**

### **STEP 1: Access Google Cloud Console**

1. Open: **https://console.cloud.google.com**
2. Sign in with your Google account
3. Select your project (top-left dropdown)

```
┌────────────────────────────────────────────┐
│ Google Cloud Console                       │
├────────────────────────────────────────────┤
│ 📦 Select a project ▼                      │
│   ├─ My Project                            │
│   ├─ Half Marathon App                     │
│   └─ [Your Project Name] ← Click this      │
└────────────────────────────────────────────┘
```

### **STEP 2: Navigate to Credentials**

1. Click **☰ Menu** (top-left)
2. Hover over **APIs & Services**
3. Click **Credentials**

```
Navigation Path:
☰ Menu → APIs & Services → Credentials

Or direct link:
https://console.cloud.google.com/apis/credentials
```

### **STEP 3: Find Your API Key**

Look for: `AIzaSyCwm4CExH0_hPj1a59BVcESE4bNrWJOepc`

```
┌────────────────────────────────────────────────────────┐
│ Credentials                                            │
├────────────────────────────────────────────────────────┤
│ 🔑 API Keys                                            │
│                                                        │
│ Name                          Key                      │
│ ────────────────────────────────────────────────────── │
│ Browser key (auto created)   AIzaSyCwm4CExH0...       │
│                               ↑                        │
│                               Click this row           │
└────────────────────────────────────────────────────────┘
```

### **STEP 4: Edit Application Restrictions**

Scroll to **"Application restrictions"** section:

```
┌──────────────────────────────────────────────────────────┐
│ Application restrictions                                 │
├──────────────────────────────────────────────────────────┤
│ ⚪ None (NOT RECOMMENDED) ← Don't use this              │
│                                                          │
│ 🔘 HTTP referrers (web sites) ← SELECT THIS            │
│                                                          │
│ ⚪ IP addresses (web servers, cron jobs, etc.)          │
│                                                          │
│ ⚪ Android apps                                          │
│                                                          │
│ ⚪ iOS apps                                              │
└──────────────────────────────────────────────────────────┘
```

### **STEP 5: Add Your Domains**

After selecting "HTTP referrers", click **"+ ADD AN ITEM"**:

```
┌──────────────────────────────────────────────────────────┐
│ Website restrictions                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Item 1: [http://localhost:*/*          ] 🗑️            │
│ Item 2: [https://localhost:*/*         ] 🗑️            │
│ Item 3: [http://127.0.0.1:*/*          ] 🗑️            │
│ Item 4: [https://terrasynbiiiz.github.io/*] 🗑️         │
│ Item 5: [https://*.netlify.app/*       ] 🗑️            │
│ Item 6: [https://*.vercel.app/*        ] 🗑️            │
│                                                          │
│ + ADD AN ITEM                                           │
└──────────────────────────────────────────────────────────┘
```

**Copy-paste these EXACTLY:**

```
http://localhost:*/*
https://localhost:*/*
http://127.0.0.1:*/*
https://terrasynbiiiz.github.io/*
https://*.netlify.app/*
https://*.vercel.app/*
```

**⚠️ Important Notes:**
- The `*` is a wildcard (matches any path)
- Include both `http://` and `https://`
- The `*.netlify.app` and `*.vercel.app` wildcards catch all preview deployments

### **STEP 6: Set API Restrictions**

Scroll to **"API restrictions"** section:

```
┌──────────────────────────────────────────────────────────┐
│ API restrictions                                         │
├──────────────────────────────────────────────────────────┤
│ ⚪ Don't restrict key (NOT RECOMMENDED)                 │
│                                                          │
│ 🔘 Restrict key ← SELECT THIS                          │
│                                                          │
│    Select APIs:                                         │
│    ☑️ Maps JavaScript API (REQUIRED)                    │
│    ☑️ Geocoding API (Recommended)                       │
│    ☑️ Places API (If using search)                      │
│    ☐ Directions API (Optional)                         │
│    ☐ Distance Matrix API (Optional)                    │
└──────────────────────────────────────────────────────────┘
```

**Check these APIs:**
- ✅ **Maps JavaScript API** (MUST have)
- ✅ **Geocoding API** (recommended)
- ✅ **Places API** (if you use autocomplete/search)

### **STEP 7: Save Changes**

1. Click **"SAVE"** button at the bottom
2. Wait for confirmation message: "API key updated"
3. **Wait 5-10 minutes** for changes to propagate to Google's servers

```
┌────────────────────────────────────────┐
│                                        │
│  [Cancel]           [SAVE] ← Click    │
│                                        │
└────────────────────────────────────────┘

After clicking SAVE, you'll see:
✅ API key updated successfully
```

---

## ✅ **VERIFY APIs ARE ENABLED**

### **Check Enabled APIs**

1. Go to: **APIs & Services → Library**
2. Search for: **"Maps JavaScript API"**
3. Should show: **"API enabled"** with a green checkmark

```
┌────────────────────────────────────────────────────────┐
│ 🔍 Search for APIs & Services                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Maps JavaScript API                                   │
│ ✅ API enabled                    [MANAGE] [DISABLE]  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

If it shows **"Enable"** button instead:
1. Click **"ENABLE"**
2. Wait for it to enable
3. Do the same for **Geocoding API** and **Places API**

---

## 🧪 **TEST YOUR FIX**

### **Method 1: Browser Console Test**

1. Open your production site
2. Press **F12** (open Developer Tools)
3. Go to **Console** tab
4. Look for errors:

```javascript
// ❌ BEFORE FIX (Error):
RefererNotAllowedMapError
This API project is not authorized to use this API

// ✅ AFTER FIX (Success):
Google Maps API loaded successfully
Map initialized
```

### **Method 2: Network Tab Test**

1. Open Developer Tools → **Network** tab
2. Reload the page
3. Filter by: `googleapis.com`
4. Check status codes:

```
❌ BEFORE: Status 403 (Forbidden) - API key restricted
✅ AFTER:  Status 200 (OK) - API key working
```

### **Method 3: Visual Test**

```
❌ BEFORE:
┌─────────────────────────────┐
│                             │
│    [Gray screen]            │
│                             │
│  "Google Maps API           │
│   Key Required"             │
│                             │
└─────────────────────────────┘

✅ AFTER:
┌─────────────────────────────┐
│  🗺️ [Full map displayed]    │
│                             │
│  📍 Markers visible         │
│  🛣️  Routes visible         │
│                             │
└─────────────────────────────┘
```

---

## ⏰ **TIMELINE**

```
Now           → Update API key restrictions
+2 minutes    → Changes saved in Google Cloud Console
+5-10 minutes → Changes propagate to Google's servers
+10 minutes   → Clear browser cache and test
+15 minutes   → Map should be working! ✅
```

---

## 🚨 **COMMON ERRORS & FIXES**

### **Error 1: "RefererNotAllowedMapError"**

```
❌ Error:
Google Maps JavaScript API error: RefererNotAllowedMapError
Your site URL to be authorized: https://your-site.com
```

**Fix:**
- Your domain is not in the allowed referrers list
- Add `https://your-site.com/*` to HTTP referrers
- Wait 10 minutes and clear cache

### **Error 2: "ApiNotActivatedMapError"**

```
❌ Error:
Google Maps JavaScript API error: ApiNotActivatedMapError
```

**Fix:**
- Maps JavaScript API is not enabled
- Go to: APIs & Services → Library
- Search "Maps JavaScript API" and click **ENABLE**

### **Error 3: "BillingNotEnabledMapError"**

```
❌ Error:
Google Maps JavaScript API error: BillingNotEnabledMapError
```

**Fix:**
- Your project doesn't have billing enabled
- Go to: https://console.cloud.google.com/billing
- Link a billing account (you still get $200 free credit per month)

### **Error 4: Silent Failure (No Map, No Error)**

**Possible causes:**
- Changes haven't propagated yet → Wait 10 minutes
- Browser cache → Clear cache and hard reload (Ctrl+Shift+R)
- API key not embedded → Check `dist/assets/*.js` contains API key
- Network issue → Check Network tab in browser DevTools

---

## 📊 **CHECKLIST**

Print this and check off as you go:

```
API Key Configuration:
☐ Logged into Google Cloud Console
☐ Selected correct project
☐ Found my API key (AIzaSyCwm4CExH0...)
☐ Set Application restrictions to "HTTP referrers"
☐ Added all 6 referrer URLs
☐ Set API restrictions to "Restrict key"
☐ Enabled Maps JavaScript API
☐ Enabled Geocoding API (optional)
☐ Enabled Places API (optional)
☐ Clicked SAVE button
☐ Saw confirmation message

Testing:
☐ Waited 10 minutes for propagation
☐ Cleared browser cache
☐ Tested in incognito mode
☐ Opened browser console (F12)
☐ Checked for errors
☐ Map loads successfully ✅
☐ Markers visible ✅
☐ Routes visible ✅

Final:
☐ Tested on multiple devices
☐ Tested on mobile
☐ Confirmed no errors in console
☐ Map is fully functional ✅
```

---

## 🎓 **UNDERSTANDING THE FIX**

**Why did this happen?**

```
Google Maps API keys can be restricted by:
1. HTTP referrers (websites) ← Your issue
2. IP addresses (servers)
3. Mobile app identifiers

Your key was created with localhost-only restrictions.
When you deployed to production, Google blocked it because
the production domain wasn't in the allowed list.

This is actually a GOOD security feature!
It prevents unauthorized sites from using your API key.
```

**Why the wait time?**

```
Google's global infrastructure needs time to update:
- Console update: Instant
- Regional servers: 2-5 minutes
- Global CDN: 5-10 minutes
- Your browser cache: Until you clear it

That's why you need to:
1. Wait 10 minutes
2. Clear cache
3. Test in incognito mode
```

---

## 💡 **PRO TIPS**

1. **Create separate API keys** for dev/staging/prod
   - Better security
   - Easier to track usage
   - Can revoke without affecting other environments

2. **Set up billing alerts**
   - Go to: Billing → Budgets & alerts
   - Set alert at $50, $100, $150
   - Avoid surprise bills

3. **Monitor API usage**
   - Go to: APIs & Services → Dashboard
   - Watch daily request counts
   - Free tier: 28,000 requests/month

4. **Use API key rotation**
   - Rotate keys every 90 days
   - Keep old key active for 24 hours during rotation
   - Update all deployments

5. **Add rate limiting**
   - Set quotas in Google Cloud Console
   - Protect against abuse
   - Control costs

---

## 🎉 **YOU'RE DONE!**

If you've followed all steps, your map should be working in production now!

**Still stuck?** Share:
1. Screenshot of your API key restrictions page
2. Error messages from browser console
3. Your actual deployed URL
4. Network tab showing googleapis.com requests

**We'll get it working! 🚀**

