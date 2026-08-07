# Initial Engineering Handoff — Chakra Meditation

**Repository:** `lite`  
**Handoff type:** initial reverse-engineering record  
**Date:** 2026-08-07  
**Current shape:** static client-only PWA

## 1. Product summary

Chakra Meditation is an immersive guided meditation web app. A user configures language, voice, chakra selection, timing, sound layers, optional ritual/physical practices, and visual preferences. The app then runs a timed, narrated journey with chakra-specific imagery, mantra audio, procedural sound, ambient visuals, and optional post-session reflection.

The primary design goal is a private, low-infrastructure meditation experience that can be installed and used offline on a phone or desktop browser.

## 2. Primary user flow

```text
Launch
  ↓
Splash screen
  ↓
First run? ── yes ──> Configuration
  │                         ├─ language + voice test
  │                         ├─ chakras + deity path
  │                         ├─ audio, visual, timing, script settings
  │                         └─ save to localStorage
  │
  └─ no ─────────────> Lobby
                              ├─ choose minutes per chakra
                              ├─ set intention
                              ├─ choose normal / high-energy / sleep mode
                              └─ begin journey
                                        ↓
                              Arriving / icebreaker
                                        ↓
                         Optional box breathing preparation
                                        ↓
          Normal: selected chakras in order (or reverse order)
          High-energy: single HRIM transformation path
          Music-only: background music mode
                                        ↓
             Optional Ho'oponopono / Yoga Bridge / Bath / Savasana
                                        ↓
                             Completion + session stats
                                        ↓
                     Optional local journal entry → return to lobby
```

## 3. Screen and state model

### Configuration screen (`#config-screen`)

Shown on first use, or from the lobby’s Settings link. It loads saved preferences and exposes:

- Malayalam/English language and browser TTS voice selection/test
- Selectable chakras; third eye and crown are always selected
- Warmth/audio filters, reverse journey, box breathing, Ho'oponopono, Solfeggio frequencies, eyes-close mode, background music mode, Savasana
- Yoga Bridge, selected yoga poses, and optional bath session
- Shiva/Shakti/none visual path
- Audio mixer and per-stage timing controls
- Default `scripts.json` or custom JSON upload/URL

Mutual-exclusion rules are enforced in JavaScript: background music disables journey features, and Yoga Bridge and reverse journey cannot be enabled together.

### Lobby (`#lobby-screen`)

The user chooses time per chakra, writes an intention, and optionally enables High Energy or Sleep Mode. The UI calculates an approximate session length. Start initializes audio-related browser capabilities through the user gesture and begins the controller flow.

### Preparation screens

`#icebreaker-screen` provides an arrival timer. `#breathing-screen` provides the optional box-breathing tutorial/animation and countdown.

### Meditation screen (`#meditation-screen`)

The controller updates the active symbol, mantra, chakra color, progress dots, timer, narration text, and visual aura. Audio is layered through the `AudioEngine`; narration uses `speechSynthesis`. Pause, stop, mixer, Wake Lock, and Media Session behavior are managed from this session state.

### Completion modal

The app records aggregate journey count and minutes in `localStorage`, displays the current session summary, accepts a journal entry, and returns the user to the lobby.

## 4. Main code responsibilities

| Area | Responsibility |
|---|---|
| `index.html` | Static DOM for all screens, controls, modal, and asset links |
| `app.js` state | Reads/writes preferences and statistics under `chakra_*` localStorage keys |
| `AudioEngine` | Builds Web Audio graph, drones, elemental layers, effects, mantra loops, music, fades, and volume routing |
| `VisualEngine` | Runs star/particle background and chakra-symbol pulsing; applies aura and brightness changes |
| `MeditationController` | Loads scripts, sequences preparation/journey/closing features, controls timers, pause/stop, and completion |
| `WakeLockManager` | Requests/reacquires screen wake lock while the page is visible |
| `scripts.json` | Bilingual guided narration, affirmations, yoga content, and Ho'oponopono phrases |
| `sw.js` | Precaches the shell and selected media; serves cache-first responses |

## 5. Persistence contract

All persistence is local to the current browser profile. Important keys include:

- `chakra_configured`, `chakra_lang`, `chakra_voice`, `chakra_time`
- `chakra_selected`, `chakra_intention`, `chakra_deity_path`
- `chakra_*` feature toggles and timing values
- `chakra_custom_script`, `chakra_script_source`
- `chakra_stats_journeys`, `chakra_stats_time`, `chakra_journal`

There is no migration/versioning layer for stored preferences. Future schema changes should add defaults and tolerate malformed JSON rather than assuming old values are valid.

## 6. Operational notes

- Serve over HTTP(S), not `file://`, for service workers and reliable asset loading.
- Audio and speech are subject to browser autoplay and voice availability rules; user interaction is required.
- Malayalam narration depends on installed/browser-provided voices and may fall back to the browser default.
- The app is intentionally offline-first, but external Google Fonts and custom script URLs can require network access.
- The global error handler currently uses `alert()` for runtime errors, which is useful for mobile debugging but disruptive in production.

## 7. Known gaps and risks

1. There is no automated test, lint, typecheck, or build pipeline.
2. Service-worker asset coverage is incomplete for all deity and yoga assets.
3. Cache-first delivery can serve stale assets until the cache version changes and the service worker activates.
4. Remote custom scripts now pass a required-section schema check before use; payload size limits and deeper content validation remain future hardening work.
5. Journal entries are unencrypted browser data; the UI should set clear privacy expectations.
6. `localStorage` writes can fail or be unavailable in restrictive/private browsing modes.
7. Long-running timers, speech synthesis, and audio nodes need real mobile-browser testing for cleanup after pause, stop, backgrounding, and reconnecting visibility.
8. The design and product language make wellness/spiritual claims; copy should avoid implying medical treatment or guaranteed outcomes.

## 8. Continuity audit completed

The initial journey continuity audit has been implemented in `app.js`:

- Music Only now exposes the shared pause/stop controls, requests Wake Lock, and returns cleanly to the lobby.
- High Energy is mutually exclusive with Music Only and Yoga Bridge so no selected branch is silently skipped.
- Bath runs only when enabled inside Yoga Bridge; Yoga requires at least one selected pose.
- Corpse Pose, Yoga, preparation, closing, and Ho'oponopono waits now use pause-aware timing.
- High Energy falls back to its own symbol when a deity path is selected.
- Partial chakra journeys no longer mark omitted chakras as completed.
- Completion statistics use measured session duration and display the current session duration separately from the aggregate total.
- Corpse Pose preference restoration, lobby aura restoration, default asset fallback, and custom-script contract validation were added.

Validation completed for this checkpoint: JavaScript syntax, JSON parsing, default script contract (101 required paths), local asset references (48 paths), and whitespace checks. Real browser/mobile audio, speech, service-worker, and background-visibility testing remain release validation work.

## 9. Yoga/Bath timing UX checkpoint

Yoga Bridge settings now keep preparation duration, per-pose duration, pose selection, Bath Session, and Bath Duration together. The UI explains the preserved execution order: Bath first, Yoga second, then the chakra journey continues to Crown. Yoga controls are shown only when Yoga Bridge is active; Bath Duration is shown only when Bath Session is active. Session estimates now include Bath only when enabled. Bath timing accepts 60–1,800 seconds to support shorter validation sessions while preserving longer practice sessions.

Evidence level for this checkpoint is `static`: syntax, JSON parsing, DOM ID uniqueness, local asset references, and whitespace validation passed. Manual browser layout/accessibility review remains open.

## 10. Mobile UI checkpoint

Settings and Lobby received a mobile-first responsive pass. Settings now scrolls independently on small screens and respects safe-area insets. Lobby uses short-screen-friendly spacing and sizing. Buttons, checkbox chips, sliders, and session controls have larger touch targets; the mixer is constrained to the viewport; headings and labels wrap more safely; and the script URL button remains compact beside its input. The stylesheet also now contains an explicit `#aura-bg` selector and no longer relies on unsupported `width: stretch` declarations.

Validation is `static`: JavaScript syntax, JSON parsing, DOM ID checks, responsive CSS assertions, and whitespace checks passed. Live browser inspection is `BLOCKED` for this checkpoint because no browser backend was available; mobile visual/accessibility review remains required on a real device or available browser.

## 11. Settings spacing checkpoint

Audio Levels, Journey Timings, Yoga Timing, and Bath Duration now share a consistent settings panel rhythm: one separator, one compact top padding value, one label-to-control gap, and one slider-row gap. Repeated inline section spacing was removed from the main settings panels, while existing behavior and persistence remain unchanged.

Validation remains `static`: JavaScript syntax, JSON parsing, DOM control uniqueness, spacing contract checks, and whitespace checks passed. Live mobile visual review remains open because the browser backend is unavailable.

## 12. Image loading checkpoint

The meditation symbol image no longer starts with an empty source. A guarded image-loader now hides the symbol during source changes and reveals it only after a successful load, covering normal chakra, deity, Yoga pose, and Music Only paths. This removes the brief broken-image state during transitions. Static syntax, JSON, image-assignment, and whitespace checks passed; browser visual confirmation remains unavailable.

## 13. Lobby action spacing checkpoint

The Lobby’s Begin Journey and Settings controls now sit inside a dedicated vertical action group with explicit spacing, full-width sizing, and mobile-safe tap targets. This prevents their spacing from depending on the parent screen’s general layout gap.

The Lobby heading also has explicit top spacing so “Meditation Room” does not sit too close to the top safe area.

## 14. Styling stack decision

The project will continue using local hand-authored CSS rather than Tailwind CDN. This is the best fit for the current static offline-first PWA: it avoids a runtime network dependency and preserves the existing custom animation and audio-oriented presentation. Tailwind remains deferred unless a future build-based migration produces local static CSS.

## 15. Suggested next checkpoint

Create a lightweight validation harness and run it against a local HTTP server:

- Parse `scripts.json` and assert required top-level sections and language keys.
- Extract referenced asset paths from HTML, JS, manifest, and service worker and report missing files.
- Exercise first-run configuration, preference reload, normal journey, stop, completion, journal save, and offline reload manually on one desktop and one mobile browser.
- Expand the service-worker cache list or move to a generated asset manifest.
- Add a small JSON schema and bounded-input validation for custom scripts before allowing them to replace the default script.

## 16. Handoff decisions

- The current stack is authoritative for this checkpoint: vanilla HTML/CSS/JavaScript plus browser APIs and static assets.
- No backend architecture has been committed.
- Any future server, account, sync, or analytics proposal should first update the product requirements and threat model, then revise `TECH-STACK.md` and this handoff together.
