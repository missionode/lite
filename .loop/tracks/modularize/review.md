# Review

## CP-MOD-053 — Chakra and sleep drone startup ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for current startup guards, frequency bounds/fallbacks, oscillator and binaural parameters/routes, direct fake-node coverage, all runnable Node tests, Loop router checks, syntax/diff checks and atlas build/source-reference validation. PR review and integration sync are pending.

- `startDrone()` and `startSleepDrone()` now delegate to `modules/audio-drone-start.js`. The public AudioEngine methods, stop-before-start and app state inputs remain unchanged; `stopDrone()` continues owning shutdown.
- Direct coverage passes for No Frequency, exact/capped/fallback chakra pitch, Eyes Close drift, seven-index elemental handoff, sleep beat clamps/fallback, gain/filter envelopes, binaural node lifecycle and cleanup. Existing drone-quality, transition and mode tests pass.
- App/cache advance to `4.04` / `chakra-v5.300`; module is loaded eagerly and precached. 78/80 Node files pass; `content-safety` and `drone-duration` need owner-managed `docs/dot.json`, absent from the isolated worktree. 11 Loop router tests pass; atlas validates 43 maps / 353 nodes / 405 edges. No sound/performance benefit or device listening is claimed.

## CP-MOD-052 — Generated tone playback lifecycle ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for input validation, exact gain/time envelopes, generated-tone suppression, direct lifecycle tests, all runnable Node tests, Loop router checks, syntax/diff checks and atlas build/source validation. PR review and integration sync are pending.

- Shot and guided transition-tone creation/stopping moved to `modules/audio-tone-playback.js`; AudioEngine method names remain stable adapters. User-selected state, public call sites and AudioContext routing are unchanged.
- Direct checks cover volume caps/mute, invalid frequencies, No Frequency behavior, Shot fade-out, transition fade-in/steady/fade-out, disposal and state clearing. Existing drone-quality, No Frequency, Arrival/Emergence and journey-duration contracts pass.
- App/cache advance to `4.02` / `chakra-v5.298`; new module is eager and precached. 77/79 Node files pass; two require owner-managed `docs/dot.json`, unavailable in this worktree. All 11 router tests pass; atlas validates 43 maps / 353 nodes / 405 edges. Device listening and performance/thermal claims are not made.

## CP-MOD-051 — Elemental audio-layer lifecycle ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for preserved layer profiles, exact node/value ordering, replacement and stop cleanup, direct fake-node tests, all runnable Node tests, Loop router checks, syntax/diff checks and atlas build/source validation. PR review and integration sync are pending.

- `startElementalLayer(index)` now delegates to `modules/audio-elemental-layer.js`. AudioEngine retains its cached-noise buffer and public adapter, while `startDrone()` order and all seven index-specific filter profiles remain unchanged.
- Direct checks pass for every index, gain/LFO values, node connections, one random draw, replacement stop and ended cleanup. Existing audio-transition/drone-quality tests pass.
- App/cache advance to `4.01` / `chakra-v5.297`; the module loads before app and is precached. 76/78 direct Node files pass; two require owner-managed `docs/dot.json`, absent from the worktree. 11 Loop router tests pass. Atlas validates 43 maps / 353 nodes / 405 edges. No audio/performance gain is claimed.

## CP-MOD-050 — Audio spatial geometry ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for unchanged panner defaults/movement, direct module and app integration contracts, runnable Node tests, Loop router checks, syntax/diff checks, and atlas build/source-reference validation. PR review and integration sync are pending.

- `createSpatialPanner()` and `setSpatialPosition()` now delegate to `modules/audio-spatial-geometry.js`; all spatial-mode selections, profiles and apply order remain in AudioEngine.
- Direct module tests cover 3D modern and legacy positioning, stereo fallback, panner defaults, smooth ramps, legacy parameter scheduling, pan clamping and null-node safety. Spatial audio and effects matrix contracts pass.
- App/cache advance to `4.00` / `chakra-v5.296`; module is loaded before app and precached. Full runnable suite and atlas build status follow below; no listening, sound-quality or performance/thermal result is claimed.
- 75/77 direct Node files pass; `content-safety` and `drone-duration` require owner-managed `docs/dot.json`, unavailable in the isolated worktree. All 11 Loop router tests pass. Atlas builds and validates 43 maps / 353 nodes / 405 edges. Browser/device listening was not performed.

## CP-MOD-049 — Audio signal design helper ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for algorithm parity, direct helper tests, all runnable Node tests, Loop router checks, syntax/diff checks, and atlas build/source-reference validation. PR review and integration sync are pending.

- Existing curve, stochastic impulse, seeded diffuse impulse and noise-buffer algorithms moved to `modules/audio-signal-design.js`; AudioEngine public methods remain adapters and `_cachedNoise` remains instance-owned.
- Direct tests cover lengths, representative samples, deterministic repeatability/decorrelated channels, and adapter/script/cache wiring. Existing AudioEngine graph-initialization and other app contracts remain covered.
- App/cache advance to `3.99` / `chakra-v5.295`; the helper is loaded before the app and precached. Audio quality/listening and performance/thermal improvement are not claimed.
- 74/76 direct Node files pass; `content-safety` and `drone-duration` require owner-managed `docs/dot.json`, absent from the isolated worktree. All 11 Loop router tests pass. Atlas builds and validates 43 maps / 353 nodes / 405 edges. Browser/device listening was not performed.

## CP-MOD-048 — AudioEngine initialization graph ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for initializer parity, direct mock-node coverage, all runnable Node tests, Loop router checks, syntax/diff checks, and atlas build/source-reference validation. PR review and integration sync are pending.

- The original `AudioEngine.init()` body is relocated into `modules/audio-engine-initialization.js`; normalized source comparison against the integration baseline confirms it is identical apart from the injected `audioWindow` alias for selecting `AudioContext`. App retains `init()` as its public adapter and explicitly supplies current state and the existing constants/helper.
- Direct Web Audio mock tests pass for the graph’s key routes, level/filter/reverb defaults, spatial buses, closed-eyes grounding, No Frequency suppression, rejected optional output-device selection recovery and suspended-context re-entry without rebuilding nodes. Spatial audio, audio-route, audio-effects and existing sky/settings integration contracts pass.
- App/cache advance to `3.98` / `chakra-v5.294`; module is before app and precached. 73/75 direct Node files pass; the two remaining failures require owner-managed `docs/dot.json`, absent from this isolated worktree. All 11 Loop router tests pass. Atlas builds and validates 43 maps / 353 nodes / 405 edges. Browser/device listening is not claimed.
- This is an ownership/testability boundary only; it makes no audible, startup, CPU, memory or thermal claim.

## CP-MOD-047 — Newcomer marker layout lifecycle ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for unchanged geometry/lifecycle contracts, newcomer integration, the applicable direct test suite, Loop router checks, and generated atlas source validation. Interactive browser verification remains opt-in and was not run.

- The seven normalized chakra anchors and existing geometry equations have moved into `modules/newcomer-marker-layout.js`. It owns the same SVG viewBox/path measurements, one-frame coalescing, image-load and ResizeObserver triggers, and explicit listener/observer/frame disposal. `app.js` constructs the owner eagerly and still requests a sync at the same newcomer-orientation point.
- Direct deterministic checks pass for unchanged anchor values, left/right connector geometry, incomplete-image preservation, load/resize coalescing and destroy cleanup. Existing newcomer tutorial and countdown lifecycle contracts also pass.
- App/cache advance to `3.97` / `chakra-v5.293`; the module is ordered before `app.js` and included in the exact offline shell. Browser visual proof has not been run (browser verification is opt-in); device readability is not claimed.
- Of 74 direct Node test files, 72 pass. `content-safety` and `drone-duration` cannot run because owner-managed `docs/dot.json` is absent from this worktree; this is the same fixture limitation recorded on earlier checkpoints. All 11 Loop model-router tests pass.
- Atlas regenerated successfully with 43 maps / 353 nodes / 405 edges; source-reference validation in the builder passes. The interactive Playwright atlas verifier and app/browser run were not performed because browser testing is opt-in. Syntax checks and `git diff --check` pass.
- Error surface for the executed non-browser work has no untriaged exceptions beyond the two missing-fixture failures. No visual, startup, CPU, memory or thermal gain is claimed; production and device evidence are not claimed.

## CP-MOD-046 — Session countdown lifecycle ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for deterministic timer lifecycle, controller integration, offline caching, full applicable Node suite and atlas/browser checks.

- The countdown ticker and elapsed-time state now live in `modules/session-countdown.js`. The controller constructs one owner with the same `Date.now`, browser interval APIs, live active/paused state and existing countdown show/hide callbacks; its `startSessionCountdown`, render and stop methods remain stable for all journeys.
- Fake-clock tests preserve the 250 ms cadence, synchronous initial render, elapsed-time subtraction, paused/inactive tick rebasing, zero clamp, restart, invalid-duration cleanup and timer/display cleanup. Existing spatial-audio and narration contracts were updated to test the new boundary.
- App/cache advance to `3.96` / `chakra-v5.292`; the eager module is in the exact offline shell. Local Chromium cold/warm/offline startup passes, including the new cache-presence assertion.
- All 71 applicable direct Node tests pass; `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is missing. All 11 Loop router tests pass. Atlas is browser-verified at 43 maps / 353 nodes / 405 edges, with no page errors and mobile overflow false.
- No timer behavior, route semantics, startup, CPU or thermal improvement is claimed. No manual device/audio or production evidence is claimed.

## CP-MOD-045 — Exact session countdown-duration ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for direct duration contracts, focused journey regressions, complete applicable Node suite, offline-shell Chromium startup, and atlas checks.

- Exact `getSessionDurationMs()` formulas moved into `modules/session-estimate.js` as `resolveDurationMs()`. The controller injects app-owned state, selected mode, duration inputs, Yoga pose count, Sleep script interval and the standard-narration estimator; session countdown start/pause/stop/render remains in the controller.
- Direct duration tests cover Music Only, focused Box and Ho’oponopono, combined preparation choices, empty preparation floor, Yoga pose/Corpse Pose/Bath, Intimate Service stages and massage, Sleep’s configured intervals, standard measured timing, HRIM fallback, demo fallback, and invalid dependencies. Existing focused-practice, Yoga, thermal and hypnosis contracts pass.
- App/cache URLs advance to `3.95` / `chakra-v5.291`; eager/offline module order remains unchanged. The first Chromium startup attempt caught a stale expected cache URL in its test; after correcting it, the cold/warm/offline test passes.
- All 70 runnable direct Node tests pass; `content-safety` and `drone-duration` require the absent owner-managed `docs/dot.json`. All 11 Loop router tests pass. The atlas rebuild and interactive verifier pass at 43 maps / 353 nodes / 405 edges, with no page errors and mobile overflow false.
- The module remains eager and this extraction makes no startup, memory, CPU or thermal gain claim. No device timing/audio or production verification is claimed.

## CP-MOD-044 — Standard journey duration-estimate ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for source parity, direct estimator contracts, applicable regression suite, shell-cache startup and atlas verification.

- The full standard chakra-journey seconds formula now lives in the existing `modules/session-estimate.js`. `MeditationController.estimateStandardJourneySeconds()` remains as a thin adapter supplying the same script/state, selected-chakra order, locale, timing, narration-duration, drone-duration, DOM-value and system-narration services. Session mode priority and legacy countdown fallback branches are unchanged.
- Direct tests exercise missing scripts, no selected chakras, positive rounded estimates, Box Breathing/Visualization duration contribution and dependency validation. Existing hypnosis duration and narration/session-countdown contracts pass.
- App/cache URLs advance to `3.94` / `chakra-v5.290`; the estimator remains eagerly loaded and in the offline shell cache. One local Chromium cold/warm/offline startup test passes. The atlas was regenerated and browser-verified: 43 maps, 353 nodes, 405 edges; all node selections, label bounds, mobile overflow, keyboard use, print, SVG export and template fallback pass with no page errors.
- Direct Node suite: 70 of 72 test files pass. `content-safety` and `drone-duration` are excluded because owner-managed `docs/dot.json` is absent. All 11 Loop model-router tests pass. A broader 4-case optional-loading browser run encountered a refused local test-server connection; the cache/startup browser case was rerun alone and passed. No unrelated browser behavior is inferred from that failed run.
- This is a cohesive ownership/testability extraction only. The module remains eager; no startup, memory, CPU or thermal improvement is claimed. No manual device/audio evidence or production verification is claimed.

## CP-MOD-043 — Chakra VisualEngine ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for verbatim ownership move, app construction, direct visual/preference contracts, offline delivery and atlas/browser checks.

- The existing class matches the `078b983` app implementation verbatim (excluding its export wrapper), and app wiring constructs the same one instance with the same `AudioEngine`.
- Preserved behavior includes visual-mode normalization, Eyes Close suppression, effect classes, chakra color glow, randomized image-breath timing, and Sacred Depth audio attachment.
- All 70 applicable Node tests pass; two fixture-dependent tests are skipped because `docs/dot.json` is absent. All 11 Loop router tests pass. Four Chromium cold/warm/offline and optional-feature scenarios pass without page errors; the cache includes the new module and the script is loaded before `app.js`.
- Atlas verification passes at 43 maps / 353 nodes / 405 edges, including mobile overflow, labels, keyboard navigation, print, SVG and no page errors. JS syntax and `git diff --check` pass.
- The local sample is 35 scripts / 879,838 encoded JS bytes versus CP42's 34 / 879,812: one extra request and 26 additional bytes. `app.js` falls by about 2.3 KiB; aggregate startup JS is effectively unchanged. This is an organization/testability extraction, not a performance, CPU or thermal improvement.

## CP-MOD-042 — Observational sky renderer ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for behavior-preserving ownership, direct sky contracts, cache/offline delivery and atlas/browser structure. Merged via PR #61 into `modularize` at `078b983`.

- The original `AmbientParticleField` implementation is mechanically moved into an eager module, retaining one app-level instance and all current call sites. Its class uses the same global lexical dependencies, including `state`, `t` and `CELESTIAL_LABEL_KEYS`.
- Existing direct contracts now load the standalone module; the service worker precaches it, and the index loads it after astronomy/night-sky dependencies and before `app.js`.
- All 70 applicable Node test files pass; two fixture-dependent tests are skipped because owner-managed `docs/dot.json` is absent. All 11 Loop router tests pass. Four Chromium modularization scenarios pass: cold/warm/offline baseline, selected preparation offline, Lobby opt-in and Settings preview. The renderer is requested at startup and its exact versioned URL is present in the service-worker cache.
- The renderer class compares byte-for-byte with its original `dd9f033` implementation (excluding the new export wrapper/comment). Atlas verification passes: 43 maps / 353 nodes / 405 edges, labels, keyboard navigation, mobile overflow, print and SVG export, with no page errors. `git diff --check` and source syntax checks pass.
- The current local Chromium baseline records 34 scripts / 879,812 encoded JS bytes, versus CP-MOD-041's single sample of 33 / 879,754: one additional request and 58 more encoded bytes in this harness. The extraction reduces `app.js` by about 35 KiB but does not reduce aggregate startup JS; this is strictly an ownership/maintainability change, not a performance, CPU or thermal gain.
- `tests/night-sky-browser.mjs` reaches an Earth/mantra clearance assertion failure. The same test fails on the unmodified `dd9f033` integration baseline with the identical assertion, and the extracted renderer is byte-identical, so it is recorded as a pre-existing visual-test failure; no unrelated layout change was made. Manual device sky review remains unperformed.
- CP-MOD-042 changes no sky visuals, observer calculations, routes or runtime branching. The dedicated sky browser assertion is a known baseline issue; it must be addressed in a separate scoped visual correction if the owner wants that layout changed.

## CP-MOD-041 — Lazy video-introduction controller

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for source/unit, offline cache and Chromium entry-point evidence.

- The controller class has been relocated without changing its implementation. The app loader is deduplicated, retries after load failure, and is entered only for the selected Lobby video introduction or explicit Settings audio preview.
- The controller script is precached for offline use but is not loaded/parsed at initial page load; the large media file remains non-precached. Journey/media failure continues through the existing journey fallback.
- The app holds one pending load promise, registers the constructor once, resets on failure for retry, and catches failures on both entry points. Lobby input validation still runs before optional controller loading; Restart continues to bypass the prelude.
- All 70 applicable Node test files pass; `content-safety` and `drone-duration` are excluded because owner-managed `docs/dot.json` is absent. All 11 Loop router tests pass. Four Chromium checks pass across cold/warm/offline baseline, selected preparation loading, Lobby opt-in, and explicit Settings preview; both opt-in surfaces request one controller script only after intent, with zero initial controller/video requests on normal load. The shell cache contains the controller.
- One local cold Chromium sample records 879,754 encoded initial JavaScript bytes versus 891,328 at CP-MOD-040 (about 11.3 KiB fewer in this harness); app.js is 359,918 versus 371,492 bytes. This is a single local sample, not compressed-network, CPU, heap, device or thermal evidence, and timing/heap measures vary.
- Atlas rebuilt and browser verified at 43 maps / 353 nodes / 405 edges; source references, map labels/bounds, keyboard navigation, mobile overflow, print, SVG export and template fallback pass without page errors. The only console `ERR_FAILED` messages in the opt-in test are the deliberate blocked video and external-font requests. JS syntax and `git diff --check` pass.
- Dynamic sky and every journey/audio/narration/video timing behavior are unchanged. No manual device playback or production verification is claimed. Pending PR review/merge.

## CP-MOD-040 — Shared journey chrome ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for direct interaction contract, app wiring, offline delivery, adjacent journey browser routes and atlas evidence.

- `JourneyChromeController` now owns the existing fullscreen, hover/touch/focus reveal, idle cursor, mixer visibility and cleanup listeners in `modules/journey-chrome.js`; the app constructs one instance at app lifetime, independently of the video-prelude class. The module is loaded before `app.js` and is included in the versioned shell cache.
- Direct coverage preserves the current 180 ms control hide and 3 s cursor/touch timing, keyboard focus protection, mixer keep-visible behavior and exit cleanup. Eager loading remains deliberate because all journeys use it; this is ownership work, not a startup optimization.
- Direct timer/interaction test, video prelude, routing and Settings/cache contracts pass; all 70 applicable Node tests pass, with the same two owner-fixture tests omitted because `docs/dot.json` is absent. All 11 Loop router tests pass.
- Three Chromium modularization checks pass: cold/warm/offline cache baseline, selected-practice offline start, and optional video request. The baseline records 33 initial scripts / 891,328 encoded JS bytes; app.js is 371,492 bytes and sky scripts remain 409,508 bytes. Relative to CP-MOD-039, the extracted helper adds 723 bytes net to the total initial JS and one request, while moving ~5.2 KiB out of app.js. This is an ownership tradeoff, not a performance win.
- Atlas rebuilt and browser verified at 43 maps / 353 nodes / 405 edges; labels, bounds, keyboard, mobile overflow, print, SVG and template fallback pass, with no page errors. The test-only video abort and deliberately blocked external fonts produce only expected `ERR_FAILED` console lines; no other console or page errors. JS syntax and `git diff --check` pass.
- Local Chromium evidence only; no device visual, thermal, audio playback or production benefit is claimed. The new module is eager by design and leaves video, audio, narration, timing and sky behavior unchanged.

## CP-MOD-039 — Optional video media request

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for source, request-level Chromium, offline route and atlas evidence.

- The 7.3 MB `video/generate.mp4` no longer has a parser-discoverable `<source>` or an eager controller `.load()`. Its URL is retained in `data-video-src`; explicit Settings preview or an opted-in Lobby video introduction attaches the source and performs native preparation. Eager fullscreen/journey chrome remains because it supports every journey.
- App/cache identifiers advance to `3.89` / `chakra-v5.285`; the video remains intentionally absent from precache and versioned shell cache includes the new app URL.
- Chromium proves zero video requests and an unset media `src` on initial page load, then exactly one request after the user opts in and presses Begin. The request is deliberately aborted by the test after observation; the application emits no page errors and the existing failure path hands control to the journey. Captured console `ERR_FAILED` messages correspond to the deliberate video abort and blocked external font requests; there were no unexpected console errors.
- Full applicable Node suite: 70 passed; two tests are excluded because owner-managed `docs/dot.json` is absent. All 11 Loop router tests pass. Three Chromium modularization checks pass (cold/warm/offline, selected practice offline, optional video request). Local static-server cold/warm/offline DCL/load: 352/352, 428/428 and 189/190 ms; 32 scripts, 890,605 encoded JS bytes. Timing is noisy. This checkpoint avoids an unneeded 7.3 MB video request for ordinary sessions; no CPU, thermal or device gain is claimed.
- Atlas rebuilt and browser verified: 43 maps, 353 nodes, 405 edges, no page errors; source-reference selection, labels/bounds, keyboard, 43-map print, SVG download and template fallback pass. Mobile overflow check passes. `git diff --check` and JS syntax checks pass.
- Test evidence is source/unit and local Chromium/browser; no manual device, audio playback, thermal, production or compressed-network claims. `.DS_Store`, `.codex/` and backup audio remain outside the checkpoint.

## CP-MOD-037 — Repeatable startup baseline and offline shell parity

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for the measured baseline and exact-URL cache correction.

- Added `tests/e2e/modularization-baseline.spec.js` and an opt-in package script. It records cold, warm and offline local Chromium navigation/resource data; verifies service-worker control and exact versioned app/CSS cache entries; fails on uncaught page errors; and deliberately does not start audio.
- The test exposed a genuine offline failure: `index.html` requests `app.js?v=3.87` and `style.css?v=2.03`, while the shell cache used unversioned URLs. Updated the shell cache generation and entries to those exact URLs and updated version assertions.
- Latest local static-server sample (external requests/fonts blocked; no response compression): cold DCL/load 484/1,206 ms, 38 scripts, ~903 KiB encoded JS, ~915 KiB transfer; warm 496/702 ms, zero transfer; offline 194/195 ms, zero transfer. An earlier cold/warm sample differed (403/793 and 386/567 ms), demonstrating timing variability. Seven preparation modules contribute ~16.9 KiB encoded JS versus ~903 KiB total. These samples are not device/production or CPU/thermal evidence.
- Chromium cold/warm/offline test passes with no page errors. `node docs/app-map/build-atlas.mjs` and `node docs/app-map/verify-atlas.mjs` pass; atlas reports 43 maps, 352 nodes, 401 edges and no page errors. Applicable Node suite: 69 runnable pass; 11 Loop router Python tests pass. `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is absent.
- Test evidence is source, automated and local Chromium; no device playback, thermal, compressed-network or production performance claims. No user files, production branch or deployment changed.

Next: a bounded selected-practice lazy-loading experiment is justified by the measured ~1.9% initial-JavaScript share. Require standalone and combined preparation route parity, selected-only loading, offline cache loading, retry/error recovery, and startup resource comparison. Defer AudioEngine bus work until its owner-approved weekly reset.

## CP-MOD-038 — Selected guided-practice script loading

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for source contracts, practice lifecycle regression and local Chromium selected/offline route evidence.

- The seven Box Breathing, Guided Visualization, Dharana, Body Scan, Guided Noting, Ho’oponopono and Undo & Unlearn API scripts are removed from eager HTML. A small classic-script loader is eager; exact practice URL assets remain in service-worker precache. Begin resolves checked practices and loads those only, before optional video/audio startup. Every individual runner also calls the loader to protect focused/direct routes.
- Concurrent loads deduplicate; loadMany deduplicates repeated IDs. Failed modules clear pending state for retry, and the app presents `ui.practiceLoadFailed` in English, Malayalam, Hindi and Russian before any session starts. Versioned app URL is bumped to 3.88 and shell cache to `chakra-v5.284`.
- Direct loader tests cover all seven manifest IDs, no-eager/precached delivery, API registration, shared concurrent promises, repeated IDs, and failed-load retry. All seven lifecycle contracts plus focused-practice routing and Settings/offline delivery pass.
- Chromium cold/warm/offline baseline and selected Box Breathing offline-start route pass. The page starts with zero practice modules; pressing Begin offline with Box Breathing selected loads only `/modules/box-breathing-practice.js`, with no uncaught page errors. Local pre/post cold sample body bytes decrease from 903,351 to 890,285 (~13.1 KiB); initial script count goes from 38 to 32. CP-MOD-038 sample cold/warm/offline DCL/load is 456/1,010 ms, 417/647 ms, and 219/256 ms respectively; timings are noisy. No CPU, device heat, production wire or audio-session benefit is claimed.
- Atlas builder and browser verifier pass at 43 maps, 353 nodes and 405 edges with no page errors. All 70 runnable Node test files and 11 Loop router Python tests pass; `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is absent. One early browser attempt timed out waiting for automatic service-worker readiness; the test now explicitly registers the worker and passes, while app auto-registration behavior is separately covered by the cold/warm baseline.
- This is local Chromium evidence, not device playback validation.

Next: integrate CP-MOD-038 into `modularize`. Then inspect other large initial assets/modules by the same byte-and-route evidence before choosing the next lazy boundary. The largest single categories in this local baseline are app.js (~376 KiB) and the observational sky/astronomy scripts (~410 KiB combined); preserve current sky behavior while determining if any deferred page boundary offers real benefit. AudioEngine bus construction remains owner-deferred until its approved weekly reset. Production stays unchanged.

## CP-MOD-029 — Journey voice-profile application

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, integrated regression, offline-delivery, atlas-build and syntax evidence.

- Extract the existing High Energy / Shringara / soft profile choice, saved voice settings, associated control/preset synchronization and audio tuning into `modules/journey-voice-profile.js`.
- Keep gender/voice registry detection in the app and inject it, app state, storage, UI synchronization, DOM and audio services. Preserve values, storage keys and side-effect order.
- Direct contract tests cover all three profile branches, saved values, UI controls, audio tuning, absent optional audio methods and invalid dependencies. All 62 runnable Node contract files and 11 model-router Python tests pass. `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is absent.
- Atlas builder passes at 36 maps / 321 nodes / 377 edges. Atlas browser verification cannot start because Playwright is unavailable. Syntax checks and `git diff --check` pass. Module stays eager and precached; no performance, browser, device or audio claim.

Integrated via PR #48 at `17a42f0`; production unchanged.

## CP-MOD-030 — Session-only experience-mode hydration

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, regression, offline-delivery, atlas-build and syntax evidence.

- Extract app-load cleanup for retired preparation/experience-mode storage keys and the forced-off session-mode checkbox defaults. Preserve the original ordering among preparation toggles, saved mixer preferences, other session-only modes and Yoga's separately restored setup.
- Keep localStorage ownership app-injected. Do not clear persisted Yoga pose/care preferences or alter Advanced Features gates.
- Direct tests cover exact retired keys, checkbox reset defaults, call/event ordering, repeatable reset and invalid dependencies. All 63 runnable Node test files and 11 model-router Python tests pass; `content-safety` and `drone-duration` are excluded because owner-managed `docs/dot.json` is unavailable in the worktree.
- Atlas builder passes at 37 maps / 326 nodes / 381 edges. The browser verifier cannot start because Playwright is unavailable. Syntax and `git diff --check` pass. Eager delivery only; no performance or device claim.

Integrated via PR #49 at `2662379`; production unchanged.

## CP-MOD-031 — Mixer preference-control hydration

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, integrated regression, offline-delivery, atlas-build and syntax evidence.

- Extract the 19 saved mixer/audio setting to control-value synchronizations from `loadPreferences` without taking ownership of app state, timing, journey choices or audio effects.
- Preserve repeated mirror controls, exact sequence and placement in the overall preference hydration flow. Keep classic script and offline cache delivery.
- Direct tests cover all 19 ordered pairs, duplicate mirrors, neighboring hydration order, classic-script/offline delivery and missing dependencies. All 64 runnable Node test files and 11 Loop router Python tests pass; `content-safety` and `drone-duration` are excluded because owner-managed `docs/dot.json` is unavailable in the worktree.
- Atlas builder passes at 38 maps / 330 nodes / 384 edges. The browser verifier cannot start because Playwright is unavailable. Syntax and `git diff --check` pass. This is a small ownership boundary; no performance benefit is claimed.

Integrated via PR #50 at `9711f0e`; production unchanged.

## CP-MOD-032 — Journey selection preference hydration

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-contract, integrated regression, offline-delivery, atlas-build and syntax evidence.

- Extract selected-chakra checkbox hydration, blank-intention fallback and returning/video/audio-filter control restoration. Keep state, default copy, validation and journey dispatch app-owned.
- Preserve exact selection semantics and its position after mixer/statistics hydration but before mode and frequency controls. Keep current eager/offline delivery.
- Direct contracts cover checked/unchecked chakra inputs, saved and blank intentions, all three journey toggles, service validation and startup order. All 65 runnable Node test files and 11 Loop router Python tests pass; `content-safety` and `drone-duration` are excluded because owner-managed `docs/dot.json` is unavailable in this worktree.
- Atlas builder passes at 39 maps / 335 nodes / 388 edges. The browser verifier cannot start because Playwright is unavailable. Syntax and `git diff --check` pass. No performance or browser claim.

Integrated via PR #51 at `05485a3`; production unchanged.

## CP-MOD-033 — Timing preference control hydration

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for the bounded extraction.

- Extract core-duration slider fill/labels and all auxiliary journey timing slider/label synchronization from `loadPreferences`.
- Keep timing config resolution, stored values, duration estimation and drone-duration callbacks app-owned. Preserve existing display strings, range-fill math and hydration sequence.
- Add direct tests for range presentation, all mapped durations and module delivery; refresh atlas. This remains eager ownership work, not a performance optimization.
- Direct contract, syntax checks and `git diff --check` pass. All 66 runnable Node test files and 11 Loop router Python tests pass; `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is unavailable in this worktree.
- Atlas builder passes at 40 maps / 339 nodes / 391 edges. Browser verifier cannot start because Playwright is unavailable. No browser/device/performance claim.

Integrated via PR #52 at `685a38d`; production unchanged.

## CP-MOD-034 — Appearance preference control hydration

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for the bounded extraction.

- Extract only visual-effect selector/application and brightness control/CSS synchronization from `loadPreferences`.
- Preserve their original relative call positions and keep state plus image-effect rendering app-owned.
- Direct contract covers effect selection/application order, brightness UI/CSS synchronization, placement around journey timing, classic-script delivery and offline precache. All 67 runnable Node test files and 11 Loop router Python tests pass; `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is unavailable in the worktree.
- Atlas builder passes at 41 maps / 343 nodes / 394 edges. Browser verifier cannot start because Playwright is unavailable. Syntax and `git diff --check` pass. Eager delivery remains; no browser/device/performance claim.

Integrated via PR #53 at `f2d8827`; production unchanged.

## CP-MOD-035 — Script preference control hydration

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for the bounded extraction.

- Extract the script-source selector, optional custom-script panel visibility and existing status copy from `loadPreferences`.
- Keep state, demo-script detection/timing, actual loading and validation app-owned; preserve placement before range refresh and voice selection.
- Direct contract covers saved source selection, custom panel visibility, demo/custom status branches, unchanged status when no custom script exists, startup order and offline delivery. All 68 runnable Node test files and 11 Loop router Python tests pass; `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is unavailable in this worktree.
- Atlas builder passes at 42 maps / 348 nodes / 398 edges. Browser verifier cannot start because Playwright is unavailable. Syntax and `git diff --check` pass. Eager delivery remains; no browser/device/performance claim.

Integrated via PR #54 at `9aec136`; production unchanged.

## CP-MOD-036 — Personal-care preference control hydration

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` for the bounded extraction.

- Extract exactly three saved care-control values (perineal care, assisted bathing, massage) from `loadPreferences`.
- Preserve order after Bath hydration. Keep persisted state, Advanced Features/session gates, care configuration and execution in their existing owners.
- Direct contract covers exact checkbox/state mapping, order, app integration and offline delivery. All 69 runnable Node test files and 11 Loop router Python tests pass; `content-safety` and `drone-duration` remain excluded because owner-managed `docs/dot.json` is unavailable in the worktree.
- Atlas builder passes at 43 maps / 352 nodes / 401 edges. Browser verifier cannot start because Playwright is unavailable. Syntax and `git diff --check` pass. Eager delivery remains; no browser/device/performance claim.

Next: integrate CP-MOD-036. Then inspect the remaining startup hydrator for a coherent extraction boundary; declare eager modularization parity only after that audit, then proceed to measurement-gated lazy loading.

## CP-MOD-025 — Shared range-control UI ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct-control, integration-contract, offline-delivery and syntax evidence.

- `modules/range-controls.js` owns input-value formatting, idempotent DOM enhancement, min/max step-button behavior and display refresh. The app retains timing-config application and all state/persistence handlers.
- The direct mock-DOM test covers chakra/Sleep/ambience/time formatting, increments and decrements, min/max clamps, disabled boundary states, bubbled `input` updates, idempotent control creation, value refresh, startup order and offline precache. Range tests plus all practice lifecycle/version contracts, Yoga and Lobby settings views, Settings backup, Advanced unlock, journey routing, session estimate, thermal, and Hindi/Malayalam/Russian tests pass. Syntax checks and `git diff --check` pass.
- Atlas regenerated at 32 maps / 295 nodes / 340 edges; the build surfaced and corrected two stale `app.js` source-line references in the mode map. The visual Playwright verifier cannot start because Playwright is absent from this worktree. The unrelated `tests/drone-duration.test.mjs` remains blocked by owner-managed `docs/dot.json`; neither limitation is reported as passing. No visual/device/performance outcome is claimed; the module remains eager and offline-pre-cached.
- Integrated via PR #44 at `f531002`; production unchanged.

Integrated via PR #45 at `ace1752`; production unchanged.

Next: CP-MOD-027 extracts localized display-language UI rendering while preserving app-owned sky, roadmap and duration-summary refreshes.

## CP-MOD-024 — Yoga Experience settings ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct behavior, integration-contract, offline-delivery and syntax evidence.

- Integrated via PR #43 at `ad3d49b`. `modules/yoga-experience-settings.js` owns checked-setting snapshots, immediate and Save-time persistence under existing keys, and timing-row/accessibility synchronization. App-state hydration and Yoga validation/session execution remain app-owned.
- The direct contract covers Corpse Pose/Bath toggles, checked pose collection, exact state/storage values, disabled/ARIA reset, row display defaults, startup order and offline precache. Yoga Experience, Lobby visibility, session estimate, Settings backup, Advanced unlock, routing, focused-practice, thermal and Hindi/Malayalam/Russian contracts, syntax and diff checks passed.
- Atlas regenerated at 32 maps / 295 nodes / 340 edges. Playwright is absent from the isolated worktree; `tests/drone-duration.test.mjs` remains blocked by the absent owner-managed `docs/dot.json`. Neither is counted as passing. No performance, browser/device or audio claim; module remains eager/offline-pre-cached.

Integrated via PR #43 at `ad3d49b`; CP-MOD-025 then integrated via PR #44. Production unchanged.

## CP-MOD-026 — Lobby journey roadmap

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct route-contract, locale-key, integration, offline-delivery, atlas-build and syntax evidence.

- `modules/journey-roadmap.js` owns localized display-only route-label resolution and DOM rendering; app compatibility wrappers remain. Begin validation and actual dispatch stay in their existing owners. No roadmap behavior is intentionally changed.
- Direct contract covers Music Only, care combinations/order, Yoga, Sleep, HRIM, standalone practices, full guided/returning stages, optional-video prefix, separator/rendering, missing-target no-op, delivery order and offline precache. Every used roadmap key is confirmed in English, Malayalam, Hindi and Russian. All 59 runnable `tests/*.test.mjs` contracts pass, including the extracted roadmap and adjacent route/UI contracts; two owner-fixture tests (`content-safety` and `drone-duration`) are excluded because `docs/dot.json` is absent from the isolated worktree. Prior UI owners, range settings, routing, estimate, Settings backup, Advanced unlock, thermal, practice lifecycle, syntax and diff checks pass.
- Atlas builder passes at 33 maps / 307 nodes / 364 edges, including a distinct display-only roadmap map. Visual Playwright verification cannot start because Playwright is missing. The two fixture-dependent test exclusions and visual-verifier limitation are not counted as passes. No user-interface browser, device, performance or audio claim; module remains eager/offline-pre-cached.

Integrated via PR #45 at `ace1752`; production unchanged.

## CP-MOD-027 — Display-language UI renderer

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct mock-DOM behavior, app integration order, locale fallback and offline-delivery evidence.

- Extract only the DOM label/text/placeholder/ARIA rendering from `applyLocaleUI()` into `modules/locale-ui-renderer.js`. The app still invalidates/redraws the current sky first, sets the document language, then delegates text painting and app-owned roadmap/duration-summary refresh callbacks in the existing order.
- Preserve readable HTML fallback text when a translated key is missing from a stale cached language bundle. Do not change locale selection, voice selection, journey labels, celestial language, timing or persistence.
- Direct mock-DOM test covers title/text labels, group labels, stat captions, placeholders, data-i18n fallback, ARIA labels, selectable control text nodes and app-owned roadmap/duration refresh ordering. All 60 runnable `tests/*.test.mjs` pass; `content-safety` and `drone-duration` are excluded because owner-managed `docs/dot.json` is absent. Current roadmap/localization/Settings/sky regressions, classic-script order, offline precache, JavaScript syntax and `git diff --check` pass.
- Atlas builder passes at 34 maps / 311 nodes / 368 edges, including the dedicated renderer ownership map and refreshed source references. Visual Playwright verification cannot start because Playwright is missing; that is not a pass. No user-interface browser, device, performance or audio claim; module remains eager/offline-pre-cached.

Integrated via PR #46 at `519bbed`; production unchanged.

## CP-MOD-028 — Timing configuration and preference application

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct contract and regression level.

- Extract timing fallback resolution, named profile overlay, control bounds, configured defaults, persisted-value clamping and fetch fallback into `modules/timing-settings.js`. Keep app compatibility accessors and the demo preset as an injected callback.
- Preserve the current shallow per-section profile merge, storage keys, values/units and load → profile → bounds → preference → demo callback order.
- All 61 runnable `tests/*.test.mjs` pass, including timing, estimates, Yoga, Settings backup and locale renderer contracts. `content-safety` and `drone-duration` are excluded because owner-managed `docs/dot.json` is absent. Syntax checks and `git diff --check` pass.
- Atlas builder passes at 35 maps / 316 nodes / 373 edges and includes timing configuration. `verify-atlas.mjs` cannot start because Playwright is unavailable; do not treat that as a pass. No UI/browser, device, performance or audio claim. Keep classic-script/offline delivery eager; this is not a performance change.

Integrated via PR #47 at `6261a08`; production unchanged.

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
## CP-MOD-054 — drone shutdown ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at direct unit/static evidence.

- `stopBinaural()` and `stopDrone()` now delegate to `modules/audio-drone-stop.js`; public AudioEngine APIs and existing call order remain stable.
- Preserved pre-context reset, AudioParam detection, `cancelAndHoldAtTime` fallback, 5-second fades, 5.1-second source retirement, oscillator/resource cleanup, grounding anchor reset and elemental-layer retirement.
- The focused stop/start, Audio transitions and No Frequency contracts pass. Full Node suite: 79/81 pass; `content-safety` and `drone-duration` cannot begin assertions because owner-managed `docs/dot.json` is absent from this isolated worktree.
- Loop routing unit suite: 11 pass. Atlas build: 43 maps / 353 nodes / 405 edges. Browser atlas verification did not run because Playwright is unavailable in this worktree; browser checks remain opt-in. No device listening or audible, CPU, memory, thermal or performance improvement is claimed.
- Cache/app versions are `chakra-v5.301` / `4.05`. The shutdown lifecycle remains eager and offline cached. This is ownership/testability work only.
## CP-MOD-055 — recorded mantra playback ownership

Status: `SPEC_COMPLIANCE PASS`, `QUALITY_AND_RISK PASS` at focused unit/static evidence.

- Recorded mantra startup and shutdown now live in `modules/audio-mantra-playback.js`; AudioEngine keeps its stable public methods and all background-music bus/profile policy.
- Preserved the No Mantra guard, cached decode, stale-request cancellation, delayed music mute until decode is ready, seamless-loop fades, reverb-tail cutoff, LFO disposal, drone/master duck, elemental-bed ramps and same-window music restoration on failure/stop.
- Direct contract, stage-fade, background-music/mantra, No Frequency and hypnosis journey tests pass. Node syntax checks pass. Test assertions now follow module ownership rather than depending on implementation text staying in `app.js`.
- App/cache versions are `4.06` / `chakra-v5.302`; the module is eager and service-worker precached. No sound quality or performance improvement is claimed; device listening remains open.
- Full Node suite: 80/82 pass; `content-safety` and `drone-duration` stop before assertions because the isolated worktree lacks owner-managed `docs/dot.json`. Loop router tests: 11 pass. Atlas regenerated at 43 maps / 353 nodes / 405 edges; browser atlas verification could not start because Playwright is unavailable in this worktree. `git diff --check` and syntax checks pass.
- No browser/device listening, audio-quality, CPU, memory or thermal evidence is claimed. Module stays eager and offline cached; assessment/theme remain future checkpoints.
