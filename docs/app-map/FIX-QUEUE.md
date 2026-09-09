# Fix queue derived from the flow atlas

## Stage-aware fades — implemented locally, listening check pending

Arrival/Interval/Emergence music transitions use 20% of the stage setting capped at 3s. The default post-mantra pause remains 4s, now containing a 2s chant fade and 2s wet-tail fade before affirmation. Long final-session tails remain. Stage timing and failure-cleanup tests pass; device listening remains open.

## Longer audio exits — implemented locally, listening check pending

Mantra entry no longer zeros the retiring chant bus; loop entry/exit envelopes are independent and repeated Stop is idempotent. Mantra/music exits are eight seconds with longer reverb responses; session Piper cancellation fades for two seconds plus its tail. Browser speech cannot use the Web Audio fade chain and retains immediate explicit cancellation. Source/mock checks pass; reported device audibility remains to be checked.

## Thermal workload reduction — implemented locally, device check pending

Static sky and decorative effects outside Lobby/Settings; bounded 180-code-point Piper chunks, one future clip with duration-triggered preparation, a 16 MiB/48-entry memory cache and idle/Off reverb disconnection are implemented. Source and automated checks cover these paths. Device heat/CPU and the reported early journey exit remain unverified. Earlier narration-scroll notes below are historical; scrolling narration is now removed.

## Long playback follow-up — implemented locally, 2026-09-09

Removed JavaScript repeat scheduling, repaired elemental LFO cleanup, moved decoding/normalization ahead of speech, added cancellation guards, bounded phonemizer reuse and inference tensor disposal. `audio` and `narration` maps reflect the implementation. Native PCM/mock and real phonemizer checks pass; full synthesis, thermal profiling and device listening remain open. Narration scroll and intentional pauses remain.

## Performance pass — implemented locally, 2026-09-09

The `visuals` map now includes cached celestial rendering, sleeping frame schedulers, hidden-page animation cancellation and transient audio-node cleanup. Automated cache/lifecycle and existing audio/visual checks pass. Device thermal profiling is still open; this does not establish that every source of heating has been removed. See the active performance entry in `HANDOFF.md` for the matched-scene device check.

Baseline: `production` at `6a0ee84`, inspected 2026-09-08. These are proposed sequential changes, not changes already made. The atlas records the current behavior before fixes.

## 1. Restore a useful test baseline

The content-safety and drone-duration test commands read absent owner-managed `docs/dot.json` before reaching their assertions. The other 21 non-browser commands passed in the initial review.

Separate production assertions from optional facilitator-fixture checks. Keep explicit coverage for a supplied fixture, and clearly report when that optional fixture is absent. Do not recreate or overwrite the owner's facilitator content. Acceptance: production checks execute and pass without this private file; malformed supplied fixtures still fail meaningfully.

Sources: [content-safety test](/Users/lekshmisyam/Desktop/Ikigai/lite/tests/content-safety.test.mjs:7), [drone-duration test](/Users/lekshmisyam/Desktop/Ikigai/lite/tests/drone-duration.test.mjs:11).

## 2. Correct experiment countdown units

The UI assigns `dataset.unit` as `sec` or `min`, but `startExperiment` only recognizes `seconds` as seconds. Box and Corpse countdowns are therefore interpreted as minutes. Bath/care controls carry values consumed as seconds by their routines but are labeled `min`. Ho’oponopono also reads a hidden duration value despite having no duration control.

Define one activity-duration contract and derive control labels, stage arguments and total estimates from it. Box duration is a per-step duration, so a total estimate must account for four steps × four cycles plus guidance. Acceptance: a 60-second care value displays as one minute and does not produce a 60-minute countdown; Box clearly distinguishes step duration from session estimate; Ho’oponopono does not inherit another activity's hidden value.

Sources: [startExperiment](/Users/lekshmisyam/Desktop/Ikigai/lite/app.js:4716), [experiment UI](/Users/lekshmisyam/Desktop/Ikigai/lite/app.js:7481). Map: `experiments`.

## 3. Resolve massage → assisted-bathing closing behavior

`runIntimateService` invokes `runSequence({complete:false})` when assisted bathing follows massage. This skips silence, closing and finish. After bathing and guide Continue, the outer focused route calls `finish()` directly; no deferred closing is invoked. The nearby comment says closing is deferred, which disagrees with execution.

Choose the intended closing placement from this concrete path, then make code, flow map and tests agree. Do not accidentally add ordinary Arrival/Emergence wrappers to standalone care. Acceptance: every selected care combination completes exactly once; if deferred closing is intended, it runs once after assisted bathing, and cancellation prevents it.

Sources: [care composition](/Users/lekshmisyam/Desktop/Ikigai/lite/app.js:5507), [sequence](/Users/lekshmisyam/Desktop/Ikigai/lite/app.js:5428). Map: `care`.

## 4. Make offline startup and upgrades deterministic

The service worker precaches unversioned `app.js`, `style.css` and `scripts.json`, while HTML requests versioned shell URLs and journey loading appends timestamp queries. Its general request handler uses exact `caches.match(request)` and does not cache misses. Those paths can fail offline despite a populated shell cache. Activation also deletes caches outside three exact names, without restricting deletion to this app's namespace.

Registration is attached to `window.load` only after async initialization, so a late registration listener can miss that event. Verify this race and register deterministically. Establish an explicit update and query-key policy that preserves version correctness, limits cache deletion to this app, and defines which media can be available offline.

Acceptance: after an online warm visit and successful installation, offline reload and a standard journey load the intended assets; an update does not mix generations or erase unrelated caches. Optional video/model first-use downloads remain clearly distinguished from cached content. Browser checks must enable service workers for these scenarios.

Sources: [service worker](/Users/lekshmisyam/Desktop/Ikigai/lite/sw.js:1), [registration](/Users/lekshmisyam/Desktop/Ikigai/lite/app.js:6205), [script loading](/Users/lekshmisyam/Desktop/Ikigai/lite/app.js:4566), [test configuration](/Users/lekshmisyam/Desktop/Ikigai/lite/playwright.config.js:18). Maps: `startup`, `storage`.

## 5. Check cancellation, duplicate starts and estimates by journey family

Source review shows multiple start/stop implementations rather than one state transition mechanism. `runSleepJourney` checks `isStarting` but does not claim that guard before fetching content. Natural Shot completion reloads; manual Stop and Shot failure use different cleanup paths. Music Only has a separate activation path. These are concrete places to test rapid actions and delayed loads, not all proven failures.

Sleep's real inter-stage gap is 3 seconds while its estimate uses script intervalSeconds. Care/Yoga guide waits are unbounded; estimates cannot count time the guide has not yet chosen. Completion statistics use elapsed wall time, including pauses. Decide what time each display represents and make labels and calculations agree.

Acceptance: fast double Begin, Stop during fetch/synthesis, Pause during narration, Restart while unwinding and guide cancellation do not start an abandoned stage or leave audio running. Test each family’s own exit behavior rather than assuming shared finish().

Maps: `modes`, `sleep`, `controls`, `restart`, `completion`, `recovery`.

## 6. Improve behavioral evidence before restructuring

Many current checks assert source text. Add a small set of executable journey-transition tests and targeted browser checks for the behavior being fixed. Keep source contracts where they are useful, but avoid equating a regular-expression match with successful playback. Target-device listening and mobile lifecycle checks remain separate evidence.

## 7. Separate modules and simplify the user-facing setup

After behavior is stable, extract bounded areas such as configuration/content, audio, narration, journey orchestration and visuals from `app.js`. Preserve behavior between extractions. Use this atlas to identify shared dependencies and update source references after each extraction.

A later product-design pass can distinguish a simple participant entry from advanced facilitator controls. That is a design change, not a prerequisite for fixing the concrete defects above.

## Working order

For each fix: reproduce or prove the branch → implement the smallest correction → verify that branch and its neighboring exits → update the corresponding atlas map and source references. Keep a separate change record for each fix. Do not claim deployment from local checks.
