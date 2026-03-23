# Visual Redesign — Cosmic + Sacred Gold — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a full Cosmic Purple + Sacred Gold visual theme across all 5 screens of the Chakra Meditation PWA.

**Architecture:** Single CSS variable system in `style.css` powers the entire palette. Structural HTML additions (nebula layer, ring divs, gold ring, completion stats) are made to `index.html`. Animation and logic enhancements (star field, chakra entrance, range fill, aura hooks) are added to `app.js`. No new files are created.

**Tech Stack:** Vanilla JS, CSS3 (custom properties, keyframes, pseudo-elements), Web Canvas API, HTML5 PWA

**Spec:** `docs/superpowers/specs/2026-03-23-visual-redesign-design.md`

---

## Task 1: CSS Variables & Base Layer

**Files:**
- Modify: `style.css` (`:root` block, `#app`, `#aura-bg`, `#particle-canvas`)
- Modify: `index.html` (add `#nebula-bg`)

- [ ] **Step 1: Update CSS variables in `:root`**

In `style.css`, replace the `:root` block:
```css
:root {
    --bg-color: #000000;
    --text-color: #ede9fe;
    --primary-color: #7c3aed;
    --primary-dark: #6d28d9;
    --accent-color: #fbbf24;
    --accent-glow: #fde68a;
    --secondary-color: #111111;
    --font-family: 'Inter', 'Manjari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --glass-bg: rgba(124, 58, 237, 0.06);
    --glass-border: rgba(251, 191, 36, 0.15);
}
```

- [ ] **Step 2: Fix z-index stack**

In `style.css`:
- `#app`: change `z-index: 2` → `z-index: 3`
- `#particle-canvas`: change `z-index: 1` → `z-index: 2`
- `#aura-bg`: stays at `z-index: 1` (no change needed)

- [ ] **Step 3: Add `#nebula-bg` CSS**

Add after the `#aura-bg` block in `style.css`:
```css
#nebula-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background:
        radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.25) 0%, transparent 55%),
        radial-gradient(ellipse at 20% 70%, rgba(109,40,217,0.15) 0%, transparent 45%),
        radial-gradient(ellipse at 80% 60%, rgba(167,139,250,0.10) 0%, transparent 40%);
    z-index: 0;
    pointer-events: none;
}
```

- [ ] **Step 4: Add `#nebula-bg` to HTML**

In `index.html`, add as the very first child of `<body>` (before `<div id="app">`):
```html
<div id="nebula-bg"></div>
```

- [ ] **Step 5: Visual check**

Open `index.html` in a browser. The config screen should show a faint purple nebula glow in the background. If it's invisible, check z-index values are correct and `#nebula-bg` is before `#app` in the DOM.

- [ ] **Step 6: Commit**
```bash
git add style.css index.html
git commit -m "feat: add cosmic CSS variables and nebula background layer"
```

---

## Task 2: Star Field (Canvas)

**Files:**
- Modify: `app.js` (`VisualEngine` class — replace `animateParticles` with `animateStars`)

- [ ] **Step 1: Add star generation to `VisualEngine` constructor**

In the `VisualEngine` constructor (around line 280), add after `this.particles = []`:
```js
this.stars = [];
this.starsAnimId = null;
```

- [ ] **Step 2: Add `generateStars()` method**

Add inside `VisualEngine`, after the constructor:
```js
generateStars() {
    this.stars = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
        this.stars.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: 0.5 + Math.random() * 1.0,
            baseOpacity: 0.1 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.9
        });
    }
}
```

- [ ] **Step 3: Add `animateStars()` method**

Add after `generateStars()`:
```js
animateStars() {
    const ctx = this.canvas.getContext('2d');
    const draw = (time) => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const t = time * 0.001;
        this.stars.forEach(star => {
            const opacity = star.baseOpacity + (1 - star.baseOpacity) * 0.5 * (1 + Math.sin(t * star.speed + star.phase));
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        });
        this.starsAnimId = requestAnimationFrame(draw);
    };
    this.starsAnimId = requestAnimationFrame(draw);
}
```

- [ ] **Step 4: Replace `animateParticles` call in constructor and delete the old method**

Find the line in the constructor that calls `this.animateParticles()` and replace it with:
```js
this.generateStars();
this.animateStars();
```

Then delete the entire `animateParticles()` method body from `VisualEngine`. Also remove `this.particles = []` from the constructor (replaced by `this.stars = []`).

- [ ] **Step 5: Update canvas resize handler**

Find where the canvas is resized (the `resize` event or `resizeCanvas` method). After resizing, re-generate stars so they fill the new dimensions:
```js
this.generateStars();
```

- [ ] **Step 6: Confirm `stop()` does NOT cancel starsAnimId**

Open `VisualEngine.stop()`. Confirm it only cancels `this.animationId` (the chakra breathing loop). Do NOT add `cancelAnimationFrame(this.starsAnimId)` — stars run for the lifetime of the page.

- [ ] **Step 7: Visual check**

Open in browser. The background canvas should show ~60 gently twinkling white stars. No colored orbs or particle bursts should appear.

- [ ] **Step 8: Commit**
```bash
git add app.js
git commit -m "feat: replace particle system with persistent star field"
```

---

## Task 3: Config & Lobby Screen Styling

**Files:**
- Modify: `style.css` (config/lobby selectors)
- Modify: `app.js` (aura gradient on screen show, range fill init + live update, chip toggle)

- [ ] **Step 1: Style config screen elements**

In `style.css`, update/add:
```css
h1 {
    /* existing properties kept — change color */
    color: var(--text-color);
}

.subtitle {
    color: var(--accent-color);
    opacity: 0.6;
}

select {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
}

#stats-display {
    border-radius: 20px;
    border: 1px solid rgba(251, 191, 36, 0.12);
    padding: 6px 14px;
    background: var(--glass-bg);
}

#stats-display span {
    color: var(--accent-color);
    opacity: 1;
}

.chip-active {
    border-color: rgba(251, 191, 36, 0.5) !important;
    background: rgba(251, 191, 36, 0.08) !important;
    color: var(--accent-color) !important;
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.15);
}

.primary-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
}
```

- [ ] **Step 2: Style lobby time selector**

In `style.css`, update:
```css
.time-selector {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
}

#time-display {
    color: var(--accent-color);
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
}

input[type="range"] {
    /* keep existing, add: */
    -webkit-appearance: none;
    height: 4px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    padding: 0;
}

input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 4px;
    background: linear-gradient(
        90deg,
        var(--primary-color) 0%,
        var(--accent-color) var(--range-fill, 65%),
        rgba(255, 255, 255, 0.1) var(--range-fill, 65%)
    );
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, var(--accent-glow), var(--accent-color));
    box-shadow: 0 0 12px rgba(251, 191, 36, 0.7);
    border: none;
    cursor: pointer;
}

input[type="range"]::-moz-range-progress {
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    height: 4px;
    border-radius: 4px;
}
```

- [ ] **Step 3: Add screen-specific aura gradients in `app.js`**

Find where `showScreen(configScreen)` is called on page load (in the init/ready block). After it, add:
```js
const aura = document.getElementById('aura-bg');
aura.style.background = 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 55%)';
aura.style.opacity = '1';
```

Find where `showScreen(lobbyScreen)` is called (inside the `save-config` click handler). After it, add:
```js
const aura = document.getElementById('aura-bg');
aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
aura.style.opacity = '1';
```

- [ ] **Step 4: Add `--range-fill` initialisation in `loadPreferences()`**

Find `loadPreferences()`. After the line `timeSlider.value = state.timePerChakra` (or equivalent), add:
```js
const pctInit = ((timeSlider.value - timeSlider.min) / (timeSlider.max - timeSlider.min) * 100).toFixed(1) + '%';
timeSlider.style.setProperty('--range-fill', pctInit);
```

- [ ] **Step 5: Add `--range-fill` live update on slider input**

Find the `time-per-chakra` input event listener. Inside it, add:
```js
const pct = ((e.target.value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1) + '%';
e.target.style.setProperty('--range-fill', pct);
```

- [ ] **Step 6: Add chip toggle JS**

Find where chakra checkboxes are set up (in the init block). Add a `change` listener on each `.checkbox-label input[type="checkbox"]`:
```js
document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
        cb.closest('.checkbox-label').classList.toggle('chip-active', cb.checked);
    });
    // Set initial state
    if (cb.checked) cb.closest('.checkbox-label').classList.add('chip-active');
});
```

- [ ] **Step 7: Visual check**

Open in browser. Config screen: subtitle should be gold, checkboxes glow gold when checked, Start button has violet gradient. Lobby: time slider has violet-to-gold fill, thumb glows gold, time display is gold.

- [ ] **Step 8: Commit**
```bash
git add style.css app.js
git commit -m "feat: style config and lobby screens with cosmic palette"
```

---

## Task 4: Breathing Screen — Mandala Rings

**Files:**
- Modify: `index.html` (add ring divs inside `#breathing-circle-container`)
- Modify: `style.css` (ring classes, keyframes, breathing circle, timer)

- [ ] **Step 1: Add ring divs to HTML**

In `index.html`, find `#breathing-circle-container`. Replace its contents so it becomes:
```html
<div id="breathing-circle-container">
    <div class="mandala-ring-outer"></div>
    <div class="mandala-ring-mid"></div>
    <div class="mandala-ring-inner"></div>
    <div id="breathing-circle"></div>
</div>
```

- [ ] **Step 2: Add ring CSS**

In `style.css`, remove `border: 1px solid var(--glass-border)` from `#breathing-circle-container` (add `border: none`). Then add:
```css
.mandala-ring-outer,
.mandala-ring-mid,
.mandala-ring-inner {
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 50%;
}

.mandala-ring-outer {
    width: 240px;
    height: 240px;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(251, 191, 36, 0.5);
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.2), inset 0 0 20px rgba(251, 191, 36, 0.05);
    animation: ringPulse 4s ease-in-out infinite;
}

.mandala-ring-mid {
    width: 216px;
    height: 216px;
    transform: translate(-50%, -50%);
    border: 1px dashed rgba(251, 191, 36, 0.2);
    animation: mandalaSpin 20s linear infinite;
}

.mandala-ring-inner {
    width: 192px;
    height: 192px;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(124, 58, 237, 0.3);
    animation: ringPulse 4s ease-in-out infinite reverse;
}
```

- [ ] **Step 3: Add keyframes**

Add to `style.css` (inside `@media (prefers-reduced-motion: no-preference)` block — create one if it doesn't exist):
```css
@media (prefers-reduced-motion: no-preference) {
    @keyframes ringPulse {
        0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
    }

    @keyframes mandalaSpin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
}
```

- [ ] **Step 4: Update breathing circle and timer styles**

In `style.css`:
```css
#breathing-circle {
    /* keep existing width/height/border-radius/transition */
    background: radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed 60%, #4c1d95);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.9), 0 0 50px rgba(124, 58, 237, 0.4);
}

#breathing-timer {
    color: var(--accent-color);
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
}

#breathing-instruction {
    color: var(--text-color);
    opacity: 0.85;
}
```

- [ ] **Step 5: Visual check**

Start a meditation session to reach the breathing screen. Three concentric rings should be visible — gold outer pulsing, dashed gold middle slowly rotating, violet inner pulsing in reverse. Breathing circle orb glows violet. Timer is gold.

- [ ] **Step 6: Commit**
```bash
git add index.html style.css
git commit -m "feat: redesign breathing screen with mandala rings"
```

---

## Task 5: Meditation Screen

**Files:**
- Modify: `index.html` (add `.chakra-gold-ring`)
- Modify: `style.css` (gold ring, mantra shimmer, dots, controls)
- Modify: `app.js` (cosmicEntrance on chakra change)

- [ ] **Step 1: Add gold ring div to HTML**

In `index.html`, inside `#chakra-container`, add `.chakra-gold-ring` as the first child:
```html
<div id="chakra-container">
    <div class="chakra-gold-ring"></div>
    <img id="chakra-symbol" src="" alt="Chakra Symbol">
    <div id="glow-effect"></div>
</div>
```

- [ ] **Step 2: Add gold ring CSS**

In `style.css`:
```css
.chakra-gold-ring {
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    border: 1px solid rgba(251, 191, 36, 0.35);
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.05);
    pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
    .chakra-gold-ring { animation: ringPulse 4s ease-in-out infinite; }
    #mantra-display { animation: goldShimmer 4s ease-in-out infinite; }
}
```

- [ ] **Step 3: Update meditation screen CSS**

In `style.css`:
```css
#mantra-display {
    /* keep existing properties, add/update: */
    color: var(--accent-color);
    animation: goldShimmer 4s ease-in-out infinite;
}

#narration-text {
    color: #ffffff;
    opacity: 0.7;
}

.dot.active {
    background: var(--accent-color);
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
}

.dot.completed {
    background: rgba(124, 58, 237, 0.5);
    opacity: 1;
}

.icon-btn {
    /* keep existing, update: */
    border: 1px solid rgba(251, 191, 36, 0.15);
    background: rgba(124, 58, 237, 0.08);
}

#chakra-symbol {
    /* keep existing — update filter */
    filter: drop-shadow(0 0 25px var(--primary-color));
}

#glow-effect {
    background: radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%);
}
```

- [ ] **Step 4: Add keyframes**

Add inside the `@media (prefers-reduced-motion: no-preference)` block in `style.css`:
```css
@keyframes goldShimmer {
    0%, 100% {
        text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
        color: #fbbf24;
    }
    50% {
        text-shadow: 0 0 35px rgba(251, 191, 36, 0.8), 0 0 70px rgba(251, 191, 36, 0.3);
        color: #fde68a;
    }
}

@keyframes cosmicEntrance {
    from {
        opacity: 0;
        transform: scale(0.8);
        filter: drop-shadow(0 0 0px transparent);
    }
    to {
        opacity: 1;
        transform: scale(1);
        filter: drop-shadow(0 0 25px var(--primary-color));
    }
}
```

- [ ] **Step 5: Add `.cosmic-entrance` class CSS**

```css
.cosmic-entrance {
    animation: cosmicEntrance 1.2s ease-out forwards;
}
```

- [ ] **Step 6: Add cosmicEntrance trigger in `app.js`**

Find `meditateOnChakra()` in `app.js`. Locate where `#chakra-symbol` src is set (around line 580). Before setting the src, add:
```js
const symbolEl = document.getElementById('chakra-symbol');
symbolEl.style.opacity = '';   // clear any inline opacity
symbolEl.classList.remove('cosmic-entrance');
// Force reflow to restart animation
void symbolEl.offsetWidth;
symbolEl.classList.add('cosmic-entrance');
setTimeout(() => symbolEl.classList.remove('cosmic-entrance'), 1200);
```

- [ ] **Step 7: Visual check**

Run a full session. When transitioning to a new chakra: the symbol should fade-in with a scale effect. The mantra text should slowly shimmer between amber and light gold. The active progress dot should glow gold. Completed dots should shift to violet.

- [ ] **Step 8: Commit**
```bash
git add index.html style.css app.js
git commit -m "feat: redesign meditation screen with gold ring and shimmer animations"
```

---

## Task 6: Completion Modal

**Files:**
- Modify: `index.html` (add `.gold-burst`, `.gold-line` divs, `.comp-stats` block)
- Modify: `style.css` (all new completion classes and keyframe)
- Modify: `app.js` (`finish()` — populate stats)

- [ ] **Step 1: Update HTML structure of completion modal**

In `index.html`, find `#completion-modal`. Update `.modal-content` to:
```html
<div id="completion-modal" class="modal hidden">
    <div class="gold-burst"></div>
    <div class="modal-content">
        <div class="completion-icon">🕉️</div>
        <div class="gold-line"></div>
        <h2 id="completion-title">Journey Complete</h2>
        <div class="gold-line"></div>
        <p id="completion-message">Meditation Completed. Stay Blessed.</p>
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
        <button id="close-completion" class="primary-btn">Return to Room</button>
    </div>
</div>
```

- [ ] **Step 2: Add completion CSS**

In `style.css`:
```css
.gold-burst {
    position: absolute;
    width: 340px;
    height: 340px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 65%);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
    .gold-burst { animation: burstPulse 3s ease-in-out infinite; }
}

.modal-content {
    /* keep existing — add: */
    z-index: 1;
    position: relative;
    border: 1px solid rgba(251, 191, 36, 0.25);
    background: rgba(10, 0, 20, 0.88);
    box-shadow: 0 0 40px rgba(124, 58, 237, 0.3), 0 0 80px rgba(251, 191, 36, 0.08);
}

.gold-line {
    width: 40px;
    height: 1px;
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
    background: rgba(251, 191, 36, 0.04);
    border-radius: 14px;
    border: 1px solid rgba(251, 191, 36, 0.1);
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
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}
```

- [ ] **Step 3: Add `burstPulse` keyframe**

Inside the `@media (prefers-reduced-motion: no-preference)` block:
```css
@keyframes burstPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
}
```

- [ ] **Step 4: Populate stats in `finish()` in `app.js`**

Find `finish()`. Before or after the line that shows `#completion-modal`, add:
```js
document.getElementById('stat-session-time').textContent =
    Math.round(state.stats.time) + ' mins';
document.getElementById('stat-total-journeys').textContent =
    state.stats.journeys;
```

- [ ] **Step 5: Visual check**

Complete a meditation session (or trigger `finish()` manually). The completion modal should show: pulsing gold radial burst behind the card, 🕉️ floating with gold glow, thin gold lines above and below the title, session stats in gold, cosmic violet Return button.

- [ ] **Step 6: Commit**
```bash
git add index.html style.css app.js
git commit -m "feat: redesign completion modal with gold burst and session stats"
```

---

## Task 7: Final Polish & Full-Session Test

**Files:**
- Modify: `style.css` (any remaining elements needing the new palette)
- Modify: `sw.js` (bump cache version if needed)

- [ ] **Step 1: Check remaining unstyled elements**

Open the app and step through all screens. Look for any elements still using the old purple (`#8e44ad`) or yellow (`#f1c40f`). Common stragglers: `select:focus` border, `.secondary-btn` border, settings modal if any. Update these to use `var(--primary-color)` / `var(--accent-color)` / `var(--glass-border)`.

- [ ] **Step 2: Check `select` appearance on mobile**

On iOS Safari, native `<select>` may have a white background overriding the glass style. Add:
```css
select {
    -webkit-appearance: none;
    appearance: none;
}
```

- [ ] **Step 3: Full session test**

Walk through the complete flow:
1. Config screen — nebula visible, gold chips, violet gradient button
2. Lobby — gold time display, violet-gold slider
3. Box breathing — mandala rings animate, violet orb, gold timer
4. Meditation (all 7 chakras) — star field, gold ring, mantra shimmer, entrance animation
5. Closing narration
6. Completion modal — gold burst, stats populated correctly

- [ ] **Step 4: Bump service worker cache version**

In `sw.js`, find `const CACHE_NAME = '...'` and increment the version number so the new CSS/JS is served fresh to returning users.

- [ ] **Step 5: Final commit**
```bash
git add style.css sw.js
git commit -m "feat: visual redesign polish and cache version bump"
```
