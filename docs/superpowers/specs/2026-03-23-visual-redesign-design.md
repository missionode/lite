# Visual Redesign — Cosmic + Sacred Gold — Design Spec

**Date:** 2026-03-23
**Project:** Chakra Meditation App (lite)
**Status:** Approved

---

## Overview

A full visual refresh of all 5 screens using a unified **Cosmic Purple + Sacred Gold** theme. Approach: a single cohesive CSS variable system applied across `style.css`, with targeted animation enhancements in `app.js`. Every screen shares the nebula backdrop and star field. Each screen has its own gold-accented focal element.

---

## 1. Color & Theme System (CSS Variables)

Replace all variables in `:root` in `style.css`:

| Variable | Old Value | New Value | Purpose |
|---|---|---|---|
| `--primary-color` | `#8e44ad` | `#7c3aed` | Cosmic violet |
| `--primary-dark` | _(new)_ | `#6d28d9` | Gradient end for buttons |
| `--accent-color` | `#f1c40f` | `#fbbf24` | Sacred gold |
| `--accent-glow` | _(new)_ | `#fde68a` | Light gold for shimmer peaks |
| `--text-color` | `#f0f0f0` | `#ede9fe` | Violet-white (used at 0.85 opacity where labels need it) |
| `--glass-bg` | `rgba(255,255,255,0.03)` | `rgba(124,58,237,0.06)` | Violet-tinted glass |
| `--glass-border` | `rgba(255,255,255,0.08)` | `rgba(251,191,36,0.15)` | Gold-tinted borders |

> Note: `#ffffff` (pure white) is used directly for body/narration text at `opacity: 0.7–0.75` — no new variable needed.

---

## 2. Layering & Z-Index System

Add `<div id="nebula-bg"></div>` as the **first child of `<body>`** (before `#app`). This is the persistent static nebula. Full z-index stack, explicitly defined:

| Element | z-index | Notes |
|---|---|---|
| `#nebula-bg` | `0` | Static cosmic nebula, always visible |
| `#aura-bg` | `1` | Per-chakra color overlay, transitions during session |
| `#particle-canvas` | `2` | Star field (replaces old particles) |
| `#app` | `3` | All UI content (raised from current 2) |

Update `#app` in `style.css` from `z-index: 2` to `z-index: 3`.

**`#nebula-bg` CSS:**
```css
#nebula-bg {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 20% 70%, rgba(109,40,217,0.15) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 60%, rgba(167,139,250,0.10) 0%, transparent 40%);
  z-index: 0;
  pointer-events: none;
}
```

---

## 3. Star Field (app.js — VisualEngine)

Replace the `animateParticles()` method and its constructor call with `animateStars()`. Follow the same pattern: called from the constructor, runs its own `requestAnimationFrame` loop stored on `this.starsAnimId`.

**Star field logic:**
- On canvas resize/init, generate ~60 star objects: `{ x, y, radius (0.5–1.5px), baseOpacity (0.1–0.5), phase (0–2π), speed (0.3–1.2) }`
- Each frame: for each star, compute `opacity = baseOpacity + (1 - baseOpacity) * 0.5 * (1 + sin(time * speed + phase))`
- Draw as white filled circles at the computed opacity
- Stars do not move — twinkle only

Remove the `this.particles` array and all existing particle emission/update code.

**`VisualEngine.stop()` — do NOT cancel `starsAnimId`:**
Stars are cosmetic and always-on across all screens (equivalent to a persistent background). `stop()` must **not** call `cancelAnimationFrame(this.starsAnimId)`. Only `this.animationId` (the chakra symbol breathing animation) is cancelled by `stop()`, as it is today. The star loop runs for the lifetime of the page.

---

## 4. Screen-by-Screen Changes

### 4.1 Config Screen

**CSS changes:**
- `h1`: `color: var(--text-color)`
- `.subtitle`: `color: var(--accent-color); opacity: 0.6`
- `select`: `border: 1px solid var(--glass-border); background: var(--glass-bg)`
- `#stats-display`: `border-radius: 20px; border: 1px solid rgba(251,191,36,0.12); padding: 6px 14px` — stat number `<span>` elements: `color: var(--accent-color)`
- `.checkbox-label`: `border: 1px solid rgba(251,191,36,0.2); background: var(--glass-bg)`
- Checked chakra chip — use `.checkbox-label:has(input:checked)` in modern browsers. For safe cross-browser support, also add a JS class toggle: on each checkbox `change` event, add/remove class `.chip-active` on the parent `.checkbox-label`. Style `.chip-active`: `border-color: rgba(251,191,36,0.5); background: rgba(251,191,36,0.08); color: var(--accent-color); box-shadow: 0 0 8px rgba(251,191,36,0.15)`
- `.primary-btn`: `background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); box-shadow: 0 8px 24px rgba(124,58,237,0.4)`

**JS change (aura on config screen):**
On page load (at the bottom of the init block, after `showScreen(configScreen)`), set:
```js
document.getElementById('aura-bg').style.background =
  'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 55%)';
document.getElementById('aura-bg').style.opacity = '1';
```

---

### 4.2 Lobby Screen

**CSS changes:**
- `.time-selector`: `border: 1px solid var(--glass-border); background: var(--glass-bg)`
- `#time-display`: `color: var(--accent-color); text-shadow: 0 0 20px rgba(251,191,36,0.4)`
- Range track gradient fill — set a `--range-fill` CSS custom property (percentage) on the `<input>` element via JS on its `input` event. Then:
  ```css
  input[type="range"]::-webkit-slider-runnable-track {
    background: linear-gradient(90deg,
      var(--primary-color) 0%,
      var(--accent-color) var(--range-fill, 65%),
      rgba(255,255,255,0.1) var(--range-fill, 65%));
  }
  /* Firefox */
  input[type="range"]::-moz-range-progress {
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    height: 4px;
    border-radius: 4px;
  }
  ```
- Range thumb:
  ```css
  input[type="range"]::-webkit-slider-thumb {
    background: radial-gradient(circle at 35% 35%, var(--accent-glow), var(--accent-color));
    box-shadow: 0 0 12px rgba(251,191,36,0.7);
    width: 18px; height: 18px;
    border-radius: 50%;
    border: none;
  }
  ```

**JS change (aura on lobby screen):**
In the `save-config` button click handler, after `showScreen(lobbyScreen)`, set:
```js
document.getElementById('aura-bg').style.background =
  'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
document.getElementById('aura-bg').style.opacity = '1';
```

**JS change (range fill — initialisation):**
In `loadPreferences()`, after `timeSlider.value = state.timePerChakra`, immediately compute and set `--range-fill` so the first lobby render shows the correct fill:
```js
const pctInit = ((timeSlider.value - timeSlider.min) / (timeSlider.max - timeSlider.min) * 100).toFixed(1) + '%';
timeSlider.style.setProperty('--range-fill', pctInit);
```

**JS change (range fill — live update):**
On the `time-per-chakra` input's `input` event, compute and update `--range-fill`:
```js
const input = document.getElementById('time-per-chakra');
const pct = ((input.value - input.min) / (input.max - input.min) * 100).toFixed(1) + '%';
input.style.setProperty('--range-fill', pct);
```

---

### 4.3 Breathing Screen

**HTML changes:**
Replace the contents of `#breathing-circle-container` with:
```html
<div class="mandala-ring-outer"></div>
<div class="mandala-ring-mid"></div>
<div class="mandala-ring-inner"></div>
<div id="breathing-circle"></div>
```

**CSS changes:**
- `#breathing-circle-container`: remove existing `border: 1px solid var(--glass-border)` → set `border: none`. Keep existing dimensions (240px × 240px), `position: relative`.
- New ring classes (all `position: absolute; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%)`):
  ```css
  .mandala-ring-outer {
    width: 240px; height: 240px;
    border: 1px solid rgba(251,191,36,0.5);
    box-shadow: 0 0 20px rgba(251,191,36,0.2), inset 0 0 20px rgba(251,191,36,0.05);
    animation: ringPulse 4s ease-in-out infinite;
  }
  .mandala-ring-mid {
    width: 216px; height: 216px;
    border: 1px dashed rgba(251,191,36,0.2);
    animation: mandalaSpin 20s linear infinite;
  }
  .mandala-ring-inner {
    width: 192px; height: 192px;
    border: 1px solid rgba(124,58,237,0.3);
    animation: ringPulse 4s ease-in-out infinite reverse;
  }
  ```
- `#breathing-circle`: `background: radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed 60%, #4c1d95); box-shadow: 0 0 20px rgba(124,58,237,0.9), 0 0 50px rgba(124,58,237,0.4)`
- `#breathing-timer`: `color: var(--accent-color); text-shadow: 0 0 20px rgba(251,191,36,0.4)`
- `#breathing-instruction`: `color: var(--text-color); opacity: 0.85`

**New keyframes:**
```css
@keyframes ringPulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
}
@keyframes mandalaSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

---

### 4.4 Meditation Screen

**HTML changes:**
Add inside `#chakra-container` (as first child, before `#chakra-symbol`):
```html
<div class="chakra-gold-ring"></div>
```

**CSS changes:**
```css
.chakra-gold-ring {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  border: 1px solid rgba(251,191,36,0.35);
  box-shadow: 0 0 20px rgba(251,191,36,0.15), inset 0 0 20px rgba(251,191,36,0.05);
  animation: ringPulse 4s ease-in-out infinite;
  pointer-events: none;
}
```
- `#chakra-symbol`: `filter: drop-shadow(0 0 25px var(--primary-color))`
- `#glow-effect`: `background: radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)`
- `#mantra-display`: `color: var(--accent-color); animation: goldShimmer 4s ease-in-out infinite`
- `#narration-text`: `color: #ffffff; opacity: 0.7`
- `.dot.active`: `background: var(--accent-color); box-shadow: 0 0 10px rgba(251,191,36,0.8)`
- `.dot.completed`: `background: rgba(124,58,237,0.5)`
- `.icon-btn`: `border: 1px solid rgba(251,191,36,0.15); background: rgba(124,58,237,0.08)`

**New keyframes:**
```css
@keyframes goldShimmer {
  0%, 100% { text-shadow: 0 0 20px rgba(251,191,36,0.4); color: #fbbf24; }
  50% { text-shadow: 0 0 35px rgba(251,191,36,0.8), 0 0 70px rgba(251,191,36,0.3); color: #fde68a; }
}
@keyframes cosmicEntrance {
  from { opacity: 0; transform: scale(0.8); filter: drop-shadow(0 0 0px transparent); }
  to { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 25px var(--primary-color)); }
}
```

**JS change — cosmicEntrance on chakra load:**
In `meditateOnChakra()`, when setting the chakra symbol `src`, first:
1. Clear any inline opacity: `symbolEl.style.opacity = ''`
2. Add class `cosmic-entrance` (CSS: `animation: cosmicEntrance 1.2s ease-out forwards`)
3. Remove the class after 1200ms via `setTimeout`

The existing opacity manipulations in `handleInterval()` and `handleSilence()` run after this 1.2s window and will correctly override as before.

```css
.cosmic-entrance {
  animation: cosmicEntrance 1.2s ease-out forwards;
}
```

---

### 4.5 Completion Modal

**HTML changes:**
1. Add `<div class="gold-burst"></div>` as first child of `.modal` (before `.modal-content`)
2. Inside `.modal-content`, add two `.gold-line` divs — one before and one after `#completion-title`
3. Add `.comp-stats` block after `#completion-message` and before `#close-completion`:
```html
<div class="comp-stats">
  <div class="stat-row">
    <span class="stat-lbl">Session Time</span>
    <span class="stat-val" id="stat-session-time">—</span>
  </div>
  <div class="stat-row">
    <span class="stat-lbl">Total Journeys</span>
    <span class="stat-val" id="stat-total-journeys">—</span>
  </div>
</div>
```
> Note: Day Streak is removed — no streak tracking exists in the current codebase.

**CSS changes:**
```css
.gold-burst {
  position: absolute;
  width: 340px; height: 340px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 65%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
  animation: burstPulse 3s ease-in-out infinite;
}
.modal-content { z-index: 1; position: relative; } /* ensure above .gold-burst */

.gold-line {
  width: 40px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
  margin: 0.5rem auto;
  opacity: 0.7;
  border-radius: 1px;
}

.comp-stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  background: rgba(251,191,36,0.04);
  border-radius: 14px;
  border: 1px solid rgba(251,191,36,0.1);
  margin-bottom: 0.5rem;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-lbl {
  font-size: 0.62rem;
  color: var(--text-color);
  opacity: 0.5;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.stat-val {
  font-size: 0.9rem;
  color: var(--accent-color);
  font-weight: 300;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(251,191,36,0.4);
}
```

**New keyframe:**
```css
@keyframes burstPulse {
  0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
  50% { transform: translate(-50%,-50%) scale(1.15); opacity: 1; }
}
```

**JS change — populate stats on completion:**
In `finish()`, before showing the completion modal, set:
```js
document.getElementById('stat-session-time').textContent =
  Math.round(state.stats.time) + ' mins';
document.getElementById('stat-total-journeys').textContent =
  state.stats.journeys;
```

---

## 5. Animation Summary

| Name | Where | Description |
|---|---|---|
| `goldShimmer` | `#mantra-display` | Pulses between amber and light gold |
| `cosmicEntrance` | `#chakra-symbol` (via `.cosmic-entrance` class) | Scale+fade-in on chakra change |
| `ringPulse` | Mandala rings, `.chakra-gold-ring` | Slow scale+opacity pulse |
| `mandalaSpin` | `.mandala-ring-mid` | Continuous 20s rotation |
| `burstPulse` | `.gold-burst` | Slow expanding radial glow |
| Star twinkle | `#particle-canvas` via `animateStars()` | Sine-wave opacity on each star |

All animations respect `@media (prefers-reduced-motion: reduce)` — wrap all new keyframe `animation:` declarations in:
```css
@media (prefers-reduced-motion: no-preference) { ... }
```

---

## 6. Files Changed

| File | Type of change |
|---|---|
| `style.css` | CSS variables, new classes/keyframes, z-index update for `#app` |
| `index.html` | Add `#nebula-bg`, `.chakra-gold-ring`, mandala ring divs, `.gold-line`, `.comp-stats`, `.gold-burst` |
| `app.js` | Replace `animateParticles` with `animateStars`; add `cosmicEntrance` trigger; populate `.comp-stats`; set screen-specific aura gradients for config/lobby; add JS checkbox class toggle; update range fill on slider input |

---

## 7. What Does NOT Change

- App logic, session flow, audio engine
- Font family (Inter/Manjari)
- AMOLED true black base background
- All existing functionality and screen structure
