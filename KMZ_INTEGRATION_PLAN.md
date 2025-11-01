# COMPREHENSIVE KMZ INTEGRATION PLAN

## GOAL
Create a unified, interconnected app where:
1. KMZ file is the SINGLE SOURCE OF TRUTH for map data
2. All pages are interconnected (map ↔ spots ↔ timeline)
3. White text visibility issues are fixed
4. Map shows ONLY KMZ content (no duplicate data)

---

## PHASE 1: KMZ File Integration Strategy

### Option A: Direct KMZ Loading (RECOMMENDED) ✅
**How it works:**
1. Host KMZ file in `public/` folder → becomes `/Copy of 2025 Novant Health Charlotte Marathon.kmz`
2. Use KmlLayer to load KMZ directly: `url: '/Copy of 2025 Novant Health Charlotte Marathon.kmz'`
3. Google Maps API handles KMZ decompression automatically

**Pros:**
- Simple - just host the file
- Google Maps handles all parsing
- Maintains all KML styling/colors
- No custom parsing needed

**Cons:**
- KMZ must be publicly accessible
- Can't customize KML placemark click handlers easily

**DECISION: Use Option A - Direct KMZ Loading**

---

## PHASE 2: Implementation Steps

### Step 1: Move KMZ to public folder ✅
```bash
public/Copy of 2025 Novant Health Charlotte Marathon.kmz
```

### Step 2: Create KMZ configuration ✅
```typescript
// src/config/kmz.ts
export const KMZ_FILE_PATH = '/Copy of 2025 Novant Health Charlotte Marathon.kmz';
```

### Step 3: Update Map Component ✅
- Load KMZ directly via KmlLayer
- Remove manual markers/routes when KMZ active
- Make KMZ the ONLY data source

### Step 4: Fix White Text Issues ✅
- Add CSS to override Google Maps default white text
- Ensure all text is visible (black text on white background)

### Step 5: Create Navigation System ✅
- URL parameters: `?spot=spot-id` for map highlighting
- URL hash: `#spot-id` for spectator guide scrolling
- Add navigation buttons between all pages

### Step 6: Connect All Pages ✅
- Map → Spectator Guide (via placemark clicks)
- Spectator Guide → Map (via buttons)
- Timeline → Map & Guide (via buttons)

---

## PHASE 3: Technical Details

### Navigation Flow:
```
MAP PAGE
  ├─ Click KML placemark → Navigate to /guide#spot-id
  ├─ URL param ?spot=spot-id → Highlight spot
  └─ "View Spot Details" button → Navigate to /guide

SPECTATOR GUIDE PAGE
  ├─ Click spot card → Navigate to /map?spot=spot-id
  ├─ URL hash #spot-id → Auto-select spot
  └─ "View on Map" button → Navigate to /map?spot=spot-id

TIMELINE PAGE
  ├─ Click timeline item → Navigate to /guide#spot-id
  ├─ "View Spot Details" → Navigate to /guide#spot-id
  └─ "View on Map" → Navigate to /map?spot=spot-id
```

### CSS Fixes for White Text:
```css
/* Fix KML Info Windows */
.gm-style-iw-c {
  color: #000 !important;
  background: #fff !important;
}

.gm-style-iw-d {
  color: #000 !important;
}

.gm-style-iw-t {
  background: #fff !important;
}
```

---

## SUCCESS CRITERIA

✅ KMZ file loads and displays correctly
✅ No duplicate markers/routes
✅ White text is visible everywhere
✅ All pages interconnect (map ↔ spots ↔ timeline)
✅ Clicking on map navigates to relevant pages
✅ URL parameters work for deep linking
✅ Mobile-friendly navigation

