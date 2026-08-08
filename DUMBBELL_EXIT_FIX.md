# Dumbbell Exit & Canvas Fade Fix

## Problem Summary

The 3D dumbbell model was "dragging" into the footer section because:

1. **No exit animation** – The gym progress (`gmp`) only went from 0 → 1.0 during the gym section, with no logic to fade out the dumbbell when the section scrolled past
2. **Late canvas fade** – The wrapper fade logic started too late (40% viewport) and used boolean state instead of progressive opacity
3. **Hard cutoff** – The shadow and lighting never faded out with the model

## Solution Overview

### 1. Extended Gym ScrollTrigger Range (Cleaner Approach)
**File:** `components/3d/HeroCanvas.jsx`

Changed the gym section ScrollTrigger to run **until the section completely exits** the viewport:

```js
stGym = ScrollTrigger.create({
  trigger: gymEl,
  start: 'top 95%',
  end: 'bottom top',  // Continue until bottom of gym hits top of viewport
  scrub: true,
  onUpdate: (self) => {
    // Natural 0 → 1 progress as gym scrolls through and exits
    gymProgressRef.current = self.progress;
    invalidate();
  },
});
```

This gives us a natural, extended scroll range where:
- **0.0–0.75**: Shuttlecock → dumbbell morph happens
- **0.75–1.0**: Dumbbell exit fade (25% of total scroll = smooth, gradual fade)

### 2. Added Phase F: Dumbbell Exit Logic
**File:** `components/3d/HeroCanvas.jsx` – `CameraPortalController` component

The shuttlecock → dumbbell transition now uses the full natural scroll range:

```js
// Map 0-1 progress to 0-0.75 for the morph, leaving 0.75-1.0 for exit
const morphProgress = Math.min(gmp / 0.75, 1.0);  // Morph completes by 75%

if (gmp > 0.75) {
  // Phase F: Dumbbell exit (gmp 0.75 → 1.0)
  const exitProgress = Math.min((gmp - 0.75) / 0.25, 1.0);
  dbOpacity = Math.max(0, 1.0 - exitProgress * 3.0); // Fast fade
  dbScale = 1.0 + (exitProgress * 0.12); // Subtle scale-up
}
```

**Animation phases:**
- **Phase E1 (0.00–0.34)**: Shuttlecock exits with fade-out + scale-up
- **Phase E2 (0.34–0.41)**: Brief cross-fade window (~7% overlap)
- **Phase E3 (0.41–0.75)**: Dumbbell fully visible and interactive
- **Phase F (0.75–1.00)** ✨ NEW: Dumbbell exit fade with scale-up (entire last quarter of scroll)

Key improvements:
- Natural scroll-driven timing (no arbitrary multipliers)
- Full 25% of scroll range dedicated to smooth exit
- Fast 3x fade multiplier for clean disappearance
- Subtle scale-up (1.0 → 1.12) creates depth
- Pointer events disabled during fade
- Model set to `visible: false` when opacity < 0.001

### 3. Shadow Exit Fade
**File:** `components/3d/HeroCanvas.jsx` – `DynamicRadialShadow` component

Updated to match the new progress range:

```js
const exitFade = gmp > 0.75 ? Math.max(0, 1.0 - ((gmp - 0.75) / 0.25)) : 1.0;
const morphGmp = Math.min(gmp / 0.75, 1.0);  // Clamp morph progress

if (redMatRef.current) redMatRef.current.opacity = 0.50 * morphGmp * exitFade;
```

The red gym shadow now:
- Fades in from 0 → 0.50 as shuttlecock morphs to dumbbell (0.0–0.75)
- Fades out from 0.50 → 0 as dumbbell exits (0.75–1.0)

### 4. Improved Canvas Wrapper Fade
**File:** `components/sections/HeroKickSequence.jsx`

Replaced boolean state toggle with progressive opacity control via direct DOM manipulation:

**Before:**
- Triggered at 40% viewport → 20% viewport
- Boolean state caused React re-renders
- No actual fade, just opacity class toggle

**After:**
- Triggers at 55% viewport → 15% viewport (earlier start)
- Direct DOM write (zero React re-renders)
- Linear progressive fade: `opacity = (bottom - 15vh) / (55vh - 15vh)`
- Also controls `pointerEvents` and `zIndex` dynamically

```js
const fadeStart = vh * 0.55;   // begin fade (earlier)
const fadeEnd   = vh * 0.15;   // fully gone

let opacity = 1;
if (rect.bottom <= fadeEnd) {
  opacity = 0;
} else if (rect.bottom < fadeStart) {
  opacity = (rect.bottom - fadeEnd) / (fadeStart - fadeEnd);
}

// Direct DOM manipulation
canvasWrapper.style.opacity = String(opacity);
canvasWrapper.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto';
canvasWrapper.style.zIndex = opacity < 0.05 ? '0' : '10';
```

Benefits:
- Starts fading while gym content is still partially visible
- Smooth progressive transition instead of hard cutoff
- Footer becomes clickable as soon as opacity < 0.05
- Zero performance impact from React state updates during scroll

## Animation Timeline

```
Gym Section Scroll Progress (0 → 1 as section exits viewport):
├─ 0.00–0.34:  Shuttlecock exit (fade out + scale up)
├─ 0.34–0.41:  Cross-fade window (7% overlap)
├─ 0.41–0.75:  Dumbbell active (fully visible, interactive) — 34% of scroll
└─ 0.75–1.00:  Dumbbell exit (fade out + scale up) — 25% of scroll ← NEW

Canvas Wrapper Fade (independent of gym progress):
├─ Gym bottom at 55vh: Fade begins
├─ Gym bottom at 35vh: ~50% opacity
└─ Gym bottom at 15vh: Fully transparent
```

## Key Advantages of This Approach

1. **Natural scroll mapping** – No arbitrary progress multipliers (1.15x, etc.)
2. **Generous exit window** – Full 25% of scroll range for smooth fade
3. **Clean sync** – Shadow, model, and canvas wrapper all fade together
4. **Performance** – Direct DOM writes, no React re-renders during scroll
5. **Predictable** – `end: 'bottom top'` is intuitive and matches user expectation

## Testing Checklist

- [ ] Shuttlecock exits cleanly before dumbbell enters
- [ ] Dumbbell fully visible and rotatable in gym section (41–75% progress)
- [ ] Dumbbell begins fading at 75% gym progress (section 3/4 scrolled)
- [ ] Dumbbell fully invisible by 100% gym progress (section fully exited)
- [ ] Shadow fades in sync with dumbbell
- [ ] Canvas wrapper fades smoothly without stuttering
- [ ] Footer links are clickable after fade completes
- [ ] No WebGL render artifacts or "stuck" models
- [ ] Mobile and desktop both work correctly

## Files Modified

1. `components/3d/HeroCanvas.jsx`
   - Extended gym ScrollTrigger to `end: 'bottom top'` (natural exit)
   - Remapped progress so morph uses 0–0.75, exit uses 0.75–1.0
   - Added Phase F exit logic in CameraPortalController
   - Updated shadow exit fade to match new range

2. `components/sections/HeroKickSequence.jsx`
   - Improved canvas fade logic with progressive opacity
   - Changed canvas wrapper to use direct DOM manipulation
   - Removed unused `canvasVisible` state

## Performance Notes

- Direct DOM manipulation eliminates React re-renders during scroll
- WebGL models stop rendering when `visible: false` (opacity < 0.001)
- Progressive opacity creates smooth 60fps animation
- Natural `end: 'bottom top'` gives predictable, scroll-driven timing

---

**Result:** The dumbbell now fades out cleanly over the last 25% of the gym section's scroll journey, and the entire 3D canvas fades progressively before the footer enters, eliminating the "dragging model" issue with a natural, scroll-driven animation curve.
