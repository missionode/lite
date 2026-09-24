# Review

## CP-MOD-025 — Shared range-control UI ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-control, integration-contract, offline-delivery and syntax evidence.

- Extracts value formatting, idempotent range enhancement, bounded step buttons, disabled boundary state and display refresh into `modules/range-controls.js`. App retains timing configuration and state/persistence ownership.
- `modules/range-controls.js` owns input-value formatting, idempotent DOM enhancement, min/max step-button behavior and display refresh. The app retains timing-config application and all state/persistence handlers.
- The direct mock-DOM test covers chakra/Sleep/ambience/time formatting, increments and decrements, min/max clamps, disabled boundary states, bubbled `input` updates, idempotent control creation, value refresh, startup order and offline precache. Range tests plus all practice lifecycle/version contracts, Yoga and Lobby settings views, Settings backup, Advanced unlock, journey routing, session estimate, thermal, and Hindi/Malayalam/Russian tests pass. Syntax checks and `git diff --check` pass.
- Atlas regenerated at 32 maps / 295 nodes / 340 edges; the build surfaced and corrected two stale `app.js` source-line references in the mode map. The visual Playwright verifier cannot start because Playwright is absent from this worktree. The unrelated `tests/drone-duration.test.mjs` remains blocked by owner-managed `docs/dot.json`; neither limitation is reported as passing. No visual/device/performance outcome is claimed; the module remains eager and offline-pre-cached.

## CP-MOD-024 — Yoga Experience settings ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct behavior, integration-contract, offline-delivery and syntax evidence.

- Integrated via PR #43 at `ad3d49b`. `modules/yoga-experience-settings.js` owns checked-setting snapshots, immediate and Save-time persistence under existing keys, and timing-row/accessibility synchronization. App-state hydration and Yoga validation/session execution remain app-owned.
- The direct contract covers Corpse Pose/Bath toggles, checked pose collection, exact state/storage values, disabled/ARIA reset, row display defaults, startup order and offline precache. Yoga Experience, Lobby visibility, session estimate, Settings backup, Advanced unlock, routing, focused-practice, thermal and Hindi/Malayalam/Russian contracts, syntax and diff checks passed.
- Atlas regenerated at 32 maps / 295 nodes / 340 edges. Playwright is absent from the isolated worktree; `tests/drone-duration.test.mjs` remains blocked by the absent owner-managed `docs/dot.json`. Neither is counted as passing. No performance, browser/device or audio claim; module remains eager/offline-pre-cached.

Next: integrate CP-MOD-025; continue remaining cohesive Settings/UI boundaries and audit the AudioEngine gate. Lazy loading remains pending extraction parity plus measured cold/warm/offline evidence.

## CP-MOD-020 — Lobby session-estimate view-model

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/session-estimate.js` owns the previous ordered choice priority and all time formulas. Inputs (selected modes, durations, timing configuration, locale labels and Yoga pose count) remain supplied by app services; app writes the same estimate string and refreshes the roadmap once.
- Direct tests cover exclusive-mode priority, each standalone preparation, Intimate Service combinations, Yoga, Sleep, HRIM, the standard chakra/add-on estimate, demo-script handling, and module/offline delivery. Sleep estimate contract moved from source slicing to the direct calculation owner.
- Eager script/offline precache remain. No user-visible behavior or performance change is claimed. Browser/device evidence was not run; graph topology remains unchanged.
- Atlas and source inventory regenerated; static source/ownership checks and syntax/diff checks pass.

Next: continue bounded UI controller extraction; after parity, capture repeatable cold/warm/offline loading baselines.

## CP-MOD-019 — Shared screen navigation ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/screen-navigation.js` owns shared visible-screen switching, the static decorative-sky guard, the `decorationchange` event and section/document/window scroll resets. All existing callers remain behind the `showScreen` compatibility wrapper.
- Direct tests cover Lobby/Settings dynamic-background exception, hidden/visible transitions, scroll reset, decoration notification, null destination and module delivery. Lobby-scroll, all journey practice modules, thermal, settings and four-language checks pass.
- Eager script/offline precache remain. No behavior or performance change is claimed. Browser/device evidence is not claimed; graph topology did not change.

Next: CP-MOD-021 extracts the Mood & Relaxation ambience settings renderer; then continue cohesive Settings/UI ownership before measured loading.

## CP-MOD-021 — Mood & Relaxation ambience settings view

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, integration, offline-delivery and syntax evidence.

- `modules/mood-ambience-settings-view.js` owns DOM synchronization for the Advanced Features Lobby ambience section, intensity and URL controls, blur settings, bounded gain slider and unavailable-source status. `app.js` retains the compatibility wrapper and injects live state, audio availability, localized message and existing formatter.
- Direct behavior tests cover locked/unlocked display, option visibility, No Frequency disabling, unavailable audio recovery, slider values/fills, output text and API validation. HTML startup order and service-worker precache are asserted. Atlas sources and generated references are synchronized at 32 maps / 295 nodes / 340 edges. A stale Yoga source reference discovered during generation was corrected.
- Fresh checks passed: mood view, settings backup, Advanced Features unlock, background music/ambience, session estimate, journey routing, screen navigation, Guided Noting, Dharana, Box Breathing, Visualization, Ho’oponopono, Undo & Unlearn, thermal budget, Hindi/Malayalam/Russian contracts, JavaScript syntax and `git diff --check`.
- Browser atlas verification could not run because Playwright is not installed in this worktree. Device/audio/thermal evidence is not claimed. The unrelated drone-duration test requires owner-managed `docs/dot.json`, absent from isolated worktrees. No execution/performance benefit is claimed; module remains eager and offline-precached.

Next: CP-MOD-022 extracts drone-duration Settings radio/note synchronization while app-owned duration calculation remains unchanged. Keep measured lazy loading gated until extraction parity and repeatable cold/warm/offline data.

## CP-MOD-022 — Drone-duration Settings view

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, integration, offline-delivery and syntax evidence.

- `modules/drone-duration-settings-view.js` owns only radio checked/disabled state plus HRIM/Sleep contextual note visibility. App retains mode choice, duration math, localized summary text and localStorage persistence.
- Direct tests cover standard, HRIM and Sleep modes, Beginner eligibility, note visibility, script order and offline precache. Fresh settings-view, Mood & Relaxation view, settings backup, Advanced Features unlock, background music, session estimate, navigation and journey routing contracts pass. JavaScript syntax and `git diff --check` pass.
- Atlas sources and generated references are synchronized at 32 maps / 295 nodes / 340 edges. Browser verification could not run because Playwright is absent from this worktree. `tests/drone-duration.test.mjs` cannot start because owner-managed `docs/dot.json` is missing; this is an explicit baseline limitation, not a pass. No runtime-performance or device/audio claim; modules remain eager and precached.

Next: CP-MOD-023 extracts the Lobby experience-visibility controller; preserve all route gates and control defaults through direct behavior tests. Lazy loading remains gated by parity plus repeatable cold/warm/offline measurements.

## CP-MOD-023 — Lobby experience visibility controller

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct route-contract, integration, offline-delivery, locale and syntax evidence.

- Moved `updateExperienceModeVisibility()` to a frozen controller module; `app.js` retains its compatibility call-site and injects current state, selection, translation, timing, setting and refresh services.
- Direct contracts exercise standalone preparation, normal chakra setup, Sleep, HRIM, Shot gating/custom frequency, Intimate Service, Yoga and range/control presentation. Advanced Features lock preservation, focused practices, session estimates, Settings views, journey routing, all practice owners, thermal budget and Hindi/Malayalam/Russian contracts passed. HTML order and precache, JavaScript syntax and `git diff --check` passed.
- Atlas was synchronized at 32 maps / 295 nodes / 340 edges. Browser atlas verification is unavailable because Playwright is absent from the isolated worktree; no browser claim. The unrelated `tests/drone-duration.test.mjs` requires owner-managed `docs/dot.json`, absent from this worktree. This remains a missing-fixture limitation, not a pass. Modules remain eager/precached; no runtime-performance or device/audio evidence claimed.

- Integrated on `modularize` via PR #42 at `a46333d`; production unchanged.

Next: CP-MOD-024 extracts Yoga Experience settings selection persistence and timing-row visibility without moving preference hydration or session execution.

## CP-MOD-018 — Undo & Unlearn practice lifecycle

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/undo-unlearn-practice.js` owns black-scene setup, translated title/opening/phases/closing, selected-duration interval calculation, active-session checks and fade cleanup. Existing content-free private-reflection wording and stage placement are unchanged.
- The direct API test verifies phase order and spacing, cancellation, narration failure, fade-wait rejection, and guaranteed hiding/body-mode cleanup. All practice owners, focused-practice, routing, audio transition, stage-fade, thermal, settings backup and Hindi/Malayalam/Russian contracts passed.
- Eager script/offline delivery remains. Existing timings are unchanged; no performance gain is claimed. Browser/device evidence was not run.

Next: extract shared screen navigation.

## CP-MOD-018 — Undo & Unlearn practice lifecycle

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/undo-unlearn-practice.js` owns black-scene setup, translated title/opening/phases/closing, selected-duration interval calculation, active-session checks and fade cleanup. Existing content-free private-reflection wording and stage placement are unchanged.
- The direct API test verifies phase order and spacing, cancellation, narration failure, fade-wait rejection, and guaranteed hiding/body-mode cleanup. All practice owners, focused-practice, routing, audio transition, stage-fade, thermal, settings backup and Hindi/Malayalam/Russian contracts pass.
- Eager script/offline delivery remains. Existing timings are unchanged; no performance gain is claimed. Browser/device playback/thermal evidence is not claimed.
- Atlas regenerated to 32 maps / 295 nodes / 340 edges; static source/ownership assertions and syntax checks pass. Browser atlas verification is unavailable because Playwright is not installed in the isolated worktree.

Next: extract remaining UI controller ownership; then measure optional loading boundaries after parity.

## CP-MOD-015 — Box Breathing practice ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/box-breathing-practice.js` owns tutorial/cycle sequencing, pause-aware elapsed-time accounting, completion narration and music handoff. Existing translated narration, timing configuration and audio/session services are injected by the app controller.
- Direct tests cover the preparation and tutorial transitions, 4×4 breathing order, 100 ms tick cadence, pause behavior, cancellation and completion handoff. Localized step arrays remain validated by the four-language focused-practice contract.
- Eager classic-script and service-worker delivery remain. The 100 ms timer cadence is preserved; this is not a performance improvement. Browser/device audio/thermal evidence was not run.
- Bounded dependency map used source-symbol/reference inspection because an AST parser is unavailable in the local dependency set. Syntax and direct API behavior were checked.

Next: CP-MOD-017 extracts Ho’oponopono's existing phrase-cycle lifecycle; then extract remaining practice/controller seams before measured loading.

## CP-MOD-016 — Visualization practice lifecycle

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/visualization-practice.js` owns the ordered blackout scene, music fade, optional ambience start/error fallback, ducked narration, focus/guidance timing, timed visualization, silence wake prompt, return narration, gradual screen reveal, ambience stop and music restoration. The app injects translated and existing runtime services.
- Direct tests cover one-minute active duration, score and silence paths, missing ambience fallback, narration/audio handoffs, return fades, blackout cleanup and cancellation at the opening guard. Existing focused-practice and audio-transition contracts remain required.
- Eager script/offline delivery remain. Existing wait/fade intervals and pause-aware sleep are preserved; no performance gain is claimed. Browser fade/render, device playback and thermal evidence were not run.
- Dependency mapping used focused symbol/reference inspection; syntax and direct API behavior were checked.

Next: extract the remaining integration practice and UI controller ownership, then measure candidate lazy-loading boundaries only after parity.

## CP-MOD-017 — Ho’oponopono practice lifecycle

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/hooponopono-practice.js` owns the existing aura/symbol setup, localized opening, three ordered cycles of the four phrases, configured inter-phrase pauses, closing narration with its final fade flag, and final rest. The app still localizes script data and retains integration-stage placement.
- Direct tests cover exact 12-phrase order, all configured pauses, closing handoff, cancellation before the first phrase, narration failure propagation, and script/offline integration. Focused-practice, all predecessor practice contracts, routing, audio transition, stage-fade, thermal, settings and four-language narration contracts pass.
- Eager script/offline delivery remains. Existing narration and timing are unchanged; no performance improvement is claimed. Browser/device audio or thermal evidence was not run.
- Atlas regenerated to 32 maps / 295 nodes / 340 edges; static source/ownership assertions and syntax checks pass. The browser verifier is unavailable because Playwright is not installed in this isolated worktree.

Next: extract Undo & Unlearn lifecycle and remaining UI controller ownership, then measure optional loading boundaries after parity.

## CP-MOD-014 — Dharana focus scene ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas-source and syntax evidence.

- Frozen `modules/dharana-practice.js` owns anchor/veil setup, selected shape/color, reduced-motion-compatible one-second shrink progression, closing narration with the existing four-second visual tail, cancellation and cleanup. The app supplies localized copy, selected duration and existing screen/audio/session services.
- The direct lifecycle contract covers all 60 active-time updates for a one-minute practice, starting/final scales, release timing, cancellation, narration error cleanup and optional scene elements. Focused-practice, Guided Noting, settings delivery and Hindi module-cache contracts pass.
- Eager script order/offline precache are retained. No performance gain is claimed. Browser layout/console and device playback/thermal checks were not run; reduced-motion behavior is source/unit evidence only.
- Bounded dependency map used symbol/reference lookup because no JavaScript AST parser is available in the local dependency set; public boundaries and syntax were verified directly.

Next: extract remaining preparation-stage lifecycles, then UI ownership; only after parity start repeated cold/warm/offline loading measurements.

## CP-MOD-013 — Guided Noting stage ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, focused regression, atlas source and syntax evidence.

- Timed reminder sequencing, active-session checks and black-scene cleanup now belong to frozen `modules/guided-noting-practice.js`; `MeditationController` still supplies the selected duration, localized copy and existing screen/audio/session services.
- Direct tests cover prompt order, even interval calculation, cancellation during an interval, narration failure, fade failure and no-scene/empty-prompt paths. The focused preparation and ordered-routing contracts pass.
- Index script ordering and service-worker precache include the new eager module. Behavior and delivery remain synchronous/offline-compatible; no lazy loading or performance gain is claimed.
- Dependency map used a bounded symbol/reference lookup because no JavaScript AST parser is available in the local dependency set. Public boundary and syntax were verified directly; no broad repository rewrite was inferred from textual matches.
- Browser was not run; browser console/page-error evidence is `NOT_RUN`. CLI test output had no errors or unexpected warnings. Device audio/thermal evidence remains open.

Next: extract the next low-coupling practice lifecycle, then the UI controllers; complete parity before the repeated cold/warm/offline loading measurement gate.

## CP-MOD-012 — Body Scan stage ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, regression, atlas and local-browser evidence.

- Timed eight-region narration, session-active sequencing and black-scene/fade cleanup now belong to frozen `modules/body-scan-practice.js`; the controller injects existing localization, audio, screen, sleep and session services.
- Direct tests cover ordering and proportional pauses, cancellation guards, final scene tail and cleanup after narration failure. Focused-practice and settings/offline delivery contracts pass.
- The shell adds one eager script. Same-harness single cold/warm samples show about 1.4 KiB net additional uncompressed JS body bytes; timing differences are within run-to-run noise. No startup/performance gain is claimed. Google Fonts are blocked and responses uncompressed; not production/device evidence.
- Browser page errors: 0. Two console errors were expected font requests blocked by the measurement harness. Device playback/thermal behavior was not tested.
- No dynamic/lazy loading is implemented. Continue bounded ownership extraction before revisiting the measured-loading gate.

## CP-MOD-011 — preparation-stage execution seam

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, regression, atlas and local-browser evidence.

- Sequential execution and the between-stage session-active guard now belong to the frozen `modules/journey-routing.js` API. The controller still owns the five original practice methods and supplies their callbacks.
- Tests cover canonical order, cancellation before the next stage, empty plan completion, missing-handler rejection and runner-error propagation.
- No stage timing, narration, visuals, audio, route selection or lifecycle behavior is intentionally changed. Service-worker cache and module URL versions are rotated for offline updates.
- Pre/post startup samples use the same local Chromium harness: both load 13 classic scripts before Lobby and about 849 KiB uncompressed JavaScript bodies. Post cold sample: DOMContentLoaded 592 ms, load 1,770 ms, ScriptDuration 0.731 s, TaskDuration 1.993 s, heap 6.71 MB; warm sample: DOMContentLoaded 255 ms, load 466 ms, ScriptDuration 0.473 s, TaskDuration 1.267 s, heap 6.65 MB. The prior baseline varied across cold attempts (DOMContentLoaded 510–1,390 ms, load 1,110–2,916 ms, ScriptDuration 0.73–1.07 s, TaskDuration 1.78–3.15 s, heap 6.7–7.5 MB). The post cold reading falls inside baseline variability; this code change is not a startup optimization and makes no speedup claim. The server is uncompressed and Google Fonts are intentionally blocked; these are not production wire/device results.
- Browser harness observed 0 page errors and two expected blocked-font console errors. `docs/app-map/verify-atlas.mjs` passes all 33 maps, template fallback, node selections, bounds, mobile overflow, keyboard, print and SVG download.
- Next: continue stage implementation/UI ownership extraction before approving any dynamic-import boundary. AudioEngine bus construction remains owner-deferred until weekly reset.

## CP-MOD-010 — post-parity loading and lifecycle plan

Status: `PLAN_SYNC PASS`; implementation remains queued.

- The migration now explicitly separates offline caching from JavaScript execution and active runtime resources.
- Lazy loading remains after behavior parity and measurement, so it does not reorder the current module extraction or the deferred AudioEngine checkpoint.
- The approved direction is a small eager shell plus measured feature-level dynamic bundles, selection-time preload, import deduplication, safe offline/failure paths and explicit resource disposal.
- Performance acceptance requires cold/warm/offline and journey-start measurements plus route/cancellation/PWA regression evidence. No runtime code or performance claim changed in this checkpoint.

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
