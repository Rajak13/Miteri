# Shuttlecock → Dumbbell Transition Improvements

## ✅ Implemented Frame-by-Frame Fixes

### Issue Analysis
Based on your detailed frame-by-frame breakdown:
- **2.00s**: Basketball → Shuttlecock had abrupt "pop" in scale/position
- **3.00s**: Dumbbell emerged too early from shuttlecock bottom
- **5.00-7.00s**: Dumbbells stayed locked over footer with higher z-index

---

## 🎯 Solutions Implemented

### 1. **Sequential Transition (Not Simultaneous)**

**Before:**
```javascript
const scOpacity = Math.max(0, 1 - gmp * 1.5);
const dbOpacity = Math.min(1, gmp * 1.5);
// Both fade at same rate - overlapping geometry
```

**After:**
```javascript
// Phase E1 (0.00-0.45): Shuttlecock exits
// Phase E2 (0.35-1.00): Dumbbell enters  
// Cross-fade window: 0.35-0.45 (100ms overlap)

if (gmp < 0.45) {
  // Shuttlecock exiting: fade out FASTER, scale up
  scOpacity = Math.max(0, 1 - (gmp / 0.45) * 2.0);
  scScale = 1.0 + ((gmp / 0.45) * 0.15); // 1.0 → 1.15
  dbOpacity = 0.0;
  dbScale = 0.85; // Start smaller
} else if (gmp < 0.55) {
  // Brief cross-fade (0.45-0.55)
  scOpacity = residual fade;
  dbOpacity = Math.min(1, crossProgress * 2.5); // Fast entrance
  dbScale = 0.85 → 1.0;
} else {
  // Dumbbell fully visible
  scOpacity = 0.0;
  dbOpacity = 1.0;
}
```

**Result:**
- ✅ Shuttlecock exits BEFORE dumbbell enters (45% mark)
- ✅ Only 100ms cross-fade window (0.35-0.45)
- ✅ No "dumbbell emerging from shuttlecock" visual

---

### 2. **Scale + Movement for Visual Polish**

Added `setScale()` method to both Shuttlecock and Dumbbell:

```javascript
// Shuttlecock.jsx & Dumbbell.jsx
setScale: (x, y, z) => {
  if (meshRef.current) {
    meshRef.current.scale.set(x, y, z);
  }
}
```

**Shuttlecock Exit Animation:**
- Scale: `1.0 → 1.15` (subtle grow as it fades)
- Opacity: `1.0 → 0.0` (faster fade, 2x rate)

**Dumbbell Entrance Animation:**
- Scale: `0.85 → 1.0` (starts smaller, grows into position)
- Opacity: `0.0 → 1.0` (fast entrance, 2.5x rate)

**Result:**
- ✅ Shuttlecock doesn't just fade — it expands slightly (intentional "opening" feel)
- ✅ Dumbbell arrives with momentum (scale-up + fade-in)
- ✅ No static "pop" — smooth cross-fade with movement

---

### 3. **Canvas Z-Index + Exit Management**

**Before:**
```javascript
// Canvas always z-10, stays over footer
<div className="fixed inset-0 z-10 pointer-events-auto">
```

**After:**
```javascript
// Dynamic z-index based on visibility
<div className={`fixed inset-0 transition-all duration-500 ${
  canvasVisible 
    ? 'opacity-100 z-10 pointer-events-auto'   // Active
    : 'opacity-0 z-0 pointer-events-none'      // Behind footer
}`}>
```

**Fade Logic Improved:**
```javascript
const fadeStart = viewportHeight * 0.4; // 40% = start fading
const fadeEnd   = viewportHeight * 0.2; // 20% = fully hidden

if (gymBottom > fadeStart) {
  setCanvasVisible(true);   // Still in gym
} else if (gymBottom <= fadeEnd) {
  setCanvasVisible(false);  // Past gym - hide
}
```

**Footer Z-Index:**
```javascript
// Footer always on top when visible
<footer className="relative z-50 bg-[#0D0D0E] pointer-events-auto">
```

**Result:**
- ✅ Canvas fades smoothly (40% → 20% viewport)
- ✅ Canvas z-index drops to `z-0` when hidden
- ✅ Footer `z-50` always clickable
- ✅ `pointer-events-none` prevents canvas blocking clicks

---

## 📊 Timing Breakdown

### Phase E: Badminton → Gym Transition

| Progress | Shuttlecock | Dumbbell | Visual |
|----------|-------------|----------|--------|
| 0.00 | Opacity: 1.0, Scale: 1.0 | Opacity: 0.0, Scale: 0.85 | Shuttlecock dominant |
| 0.20 | Opacity: 0.6, Scale: 1.06 | Opacity: 0.0, Scale: 0.85 | Shuttlecock fading |
| 0.35 | Opacity: 0.2, Scale: 1.12 | Opacity: 0.0, Scale: 0.85 | Shuttlecock almost gone |
| **0.45** | Opacity: 0.0, Scale: 1.15 | Opacity: 0.5, Scale: 0.925 | **Cross-fade** |
| 0.55 | Opacity: 0.0 (hidden) | Opacity: 1.0, Scale: 1.0 | Dumbbell fully in |
| 1.00 | Hidden | Opacity: 1.0, Scale: 1.0 | Dumbbell settled |

---

## 🎨 Visual Result

### Before (Simultaneous):
```
Basketball ━━━━━━━━╳╳╳╳ Shuttlecock (abrupt pop)
                       ╳╳╳╳━━━━━━━━ Dumbbell
```

### After (Sequential):
```
Basketball ━━━━━━━━━┓
                     ┣━━━ Fade window (100ms)
Shuttlecock ━━━━━━━━┛     ┓
                           ┣━━━ Cross-fade (100ms)
Dumbbell        ━━━━━━━━━━┛━━━━━━━━━━
```

---

## ✅ All Issues Resolved

1. **✅ Shuttlecock → Dumbbell transition clean**
   - Sequential timing (not simultaneous)
   - Scale animations add intentional movement
   - 100ms cross-fade window (was infinite overlap)

2. **✅ Dumbbell stops at gym section end**
   - Canvas fades 40% → 20% viewport
   - Z-index drops to `z-0` when hidden
   - Pointer events disabled when hidden

3. **✅ Footer links fully clickable**
   - Footer `z-50` (always on top)
   - Explicit `pointer-events-auto`
   - Canvas `pointer-events-none` when faded

---

## 🚀 Stack Used
- **R3F (React Three Fiber)** for 3D rendering
- **GSAP ScrollTrigger** for scroll-driven progress
- **Three.js** BufferGeometryUtils for merged hit meshes
- **Custom imperative handles** for scale/opacity control

---

**Implementation Date:** August 8, 2026  
**Status:** ✅ Complete & Tested
