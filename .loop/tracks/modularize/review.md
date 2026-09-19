# Review

## CP-MOD-009 — ordered preparation-stage plan

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- The canonical Box → Visualization → Dharana → Body Scan → Noting selection order now originates in `modules/journey-routing.js`.
- `MeditationController.runPreparationStages()` maps that plan to the existing stage methods and checks active-session state before each stage. Standalone preparation still excludes Box; high-energy still bypasses all preparation add-ons.
- Direct routing plus focused-practice, newcomer, hypnosis and thermal contracts pass. No stage implementation, timing, narration, audio or visual behavior moved.
- App `3.62`, journey-routing `1.1` and shell `chakra-v5.255` rotate offline delivery. Browser/device evidence was not requested and is not claimed.

## CP-MOD-008 — deterministic journey routing

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- Focused-mode selection, launch priority, prelude-safe chakra validation and intimate-massage chakra order now originate in `modules/journey-routing.js`.
- Existing UI reads, alerts and runtime dispatch remain in `app.js`; stage order, timing, narration, audio and visuals are unchanged.
- Direct routing plus focused-practice, video-prelude, Yoga, Advanced Features, chakra-selection and thermal contracts pass. Touched routing assertions no longer require the implementation to live inside `app.js`.
- The module loads before `app.js`, is versioned in the offline shell cache, and app/shell versions are rotated.
- AudioEngine bus construction is owner-deferred until the weekly reset. Journey stage execution remains in `app.js`; browser/device evidence was not requested and is not claimed.

## CP-MOD-007 — Web Audio effect-route lifecycle

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- Idempotent convolver connection, audio-clock tail retirement, stale-retirement cancellation and deterministic disconnection now originate in `modules/audio-route-lifecycle.js`.
- `AudioEngine.setConvolverActive()` remains as a thin compatibility method, preserving every voice, music, mantra and ambience caller and every existing tail duration.
- Direct route-lifecycle, thermal, audio-effects, background-music, spatial and shell-delivery contracts pass. The thermal test no longer slices this implementation from `app.js`.
- The module loads before `app.js`, is versioned in the offline shell cache, and app/shell versions are rotated.
- AudioEngine bus construction, gain/spatial policy and journey sequencing remain in `app.js`. Browser/device playback evidence was not requested and is not claimed.

## CP-MOD-006 — Piper synthesis and playback lifecycle

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- Piper model configuration, serial worker queueing, progress/error handling, synthesis/decode cache, normalization, Web Audio clip envelopes, preview, pause and cancellation now originate in `modules/piper-lifecycle.js`.
- `app.js` supplies the existing voice registry, translation, pace, volume and envelope dependencies through one factory call. No narration order, worker protocol, cache budget, gain, fade, fallback or cancellation caller changed.
- Direct Piper lifecycle, thermal, long-narration, background-music, audio-transition and shell-delivery contracts pass. The prior class source-slicing test now executes the module owner directly.
- The module loads after media-lifecycle and before `app.js`, is versioned in the offline shell cache, and app/shell versions are rotated.
- AudioEngine buses and journey sequencing remain in `app.js`. The Piper phonemizer test retains its known Node module-type warning; browser/device playback evidence was not requested and is not claimed.

## CP-MOD-005 — deterministic media lifecycle primitives

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- Stage fade scoping, Unicode-safe narration chunking, Piper clip/cancel envelope constants and native seamless-loop preparation/cleanup now originate in `modules/media-lifecycle.js`.
- `app.js` retains thin compatibility wrappers and the same `SeamlessLoop` constructor binding, so every existing caller, duration, gain target, crossfade and cleanup path is unchanged.
- Direct module, stage-fade, native-loop, long-narration, thermal, background-music and shell-delivery contracts pass. The touched tests no longer slice these primitives from `app.js`.
- The module loads before `app.js`, is versioned in the offline shell cache, and app/shell versions are rotated.
- Piper worker orchestration, AudioEngine buses and journey sequencing remain in `app.js`. The Piper phonemizer test emits its known Node module-type warning; no test error or unhandled exception occurred. Browser/device playback evidence was not requested and is not claimed.

## CP-MOD-001 — atlas contract and settings-backup seam

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- The 30th atlas map records the repeatable extraction gate and clearly labels later boundaries as queued.
- Settings backup collection, validation and replacement moved unchanged behind a frozen API.
- The app loads the module before `app.js`; the service worker precaches the same versioned URL.
- The touched test now executes the module directly instead of slicing implementation text from `app.js`.
- Audio, narration, journeys, localization, Earth atmosphere and Sun shield were not modified.
- Browser/device evidence was not requested and is not claimed.

## CP-MOD-003 — complete initial-state factory

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- Initial persisted preferences, defaults, session-only flags and legacy precedence now originate in `modules/app-state.js`.
- Existing runtime consumers continue to mutate the same plain state object; no journey, media or UI consumer was rewritten.
- Direct state tests cover defaults, restoration, session reset and legacy precedence. Eleven neighboring feature/thermal contracts pass.
- Script ordering, versioned offline precache, JavaScript syntax, atlas regeneration and diff checks pass.
- `drone-duration.test.mjs` remains blocked before assertions by the known absent owner-managed `docs/dot.json`; browser/device evidence was not requested and is not claimed.

## CP-MOD-004 — content and localization service

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence.

- Path lookup, language configuration fallback, supported localized content shapes, UI translation fallback and script validation now originate in `modules/content-localization.js`.
- Existing app-level functions remain thin compatibility wrappers, so callers and language selection behavior are unchanged.
- Direct module, state, focused-practice, Yoga, demo and all four-language contracts pass.
- Script ordering, versioned offline precache, syntax, atlas regeneration and diff checks pass.
- Timing controls, narration/audio and journey sequencing were not modified. Browser/device evidence was not requested and is not claimed.

## CP-MOD-002 — preference normalization seam

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at unit/static evidence after refreshing one stale shell-version assertion.

- Numeric/default and current-key/legacy-key boolean preference reads execute directly against the frozen module API.
- Existing zero-volume, ambience, focused-practice, Advanced Features and video-prelude contracts remain unchanged.
- Script order and service-worker precache cover both extracted modules.
- The initial state object remains in `app.js`; this checkpoint deliberately does not move audio, journey or UI state.
- Browser/device evidence was not requested and is not claimed.
