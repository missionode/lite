# Fix queue derived from the flow atlas

## Content-free Undo & Unlearn integration — release 3.51 candidate

Added an optional 5/8/12-minute pitch-black integration after Ho’oponopono. It requires no recall, answer, speech, typing, examples or contact; separates three forgiveness possibilities; preserves responsibility/boundaries; and never claims another person has forgiven the meditator. Four-language source coverage and sequence guards are required; device listening remains open.

## Cosmic Consciousness video subtitle — release 3.50

The optional Lobby video introduction now has a localized “Cosmic Consciousness Introduction” subtitle in all four languages. Playback behavior is unchanged. Production push authorized with the pending Body Scan and Guided Noting preparation release.

## Guided Noting preparation — release 3.49 candidate

Added a selectable 2/4/6-minute Guided Noting stage after Body Scan. It uses neutral labels, four spaced reminders, choice-based safety language, a pitch-black no-loop screen, standalone preparation routing, roadmap/estimate integration and four-language narration. Device listening remains open.

## Guided Body Scan preparation — release 3.48 candidate

Added a selectable 3/5/8-minute Body Scan with eight localized head-to-toe narration regions, whole-body closing, standalone preparation routing and journey estimate/roadmap integration. Its screen is a plain pitch-black fade; the body figure and scanning light were removed by owner request. Preparation order is Box → Visualization → Dharana → Body Scan → chakras. Automated source, language and thermal checks pass; device listening remains open.

## Yoga Advanced Features gate — release 3.47 candidate

Yoga Experience now shares the session-only Advanced Features gate: hidden/disabled while locked, enabled after the password unlock, cleared on relock/reload, and protected against direct locked selection or start. Automated lock lifecycle checks are required; device UI verification remains open.

## Four-language add-on narration coverage — release 3.47 candidate

Audited every spoken segment in Box Breathing, Dharana, Guided Visualization and Ho’oponopono for English, Malayalam, Hindi and Russian. Restored the two empty Malayalam Box Breathing hold prompts as “ശ്വാസം പിടിച്ചുവയ്ക്കുക”. The focused-practice contract now rejects missing/empty narration and incorrect Box-step or Ho’oponopono-phrase counts. Source coverage passes; pronunciation and target-device listening remain open.

## Journey add-on selection and visual release — release 3.46

Box Breathing and Ho’oponopono no longer clear themselves when checked. Box Breathing, Dharana, Guided Visualization and Ho’oponopono can be combined, while replacement experiences still clear all add-ons. Dharana now uses a pitch-black full-screen scene and releases its anchor/veil while the closing narration runs; Visualization's black-overlay transition remains active under static-journey performance mode. Automated source, language, audio-transition and thermal-budget checks pass; device playback remains open. Production push authorized.

## Dharana closing narration — release 3.46

After the selected focus interval, active sessions now keep the anchor visible while a localized closing releases the gaze and widens awareness to breath, body and surrounding space. Visual cleanup follows the narration; stopped sessions skip it. English, Malayalam, Hindi and Russian are included. Automated source/language checks pass; device listening remains open.

## Centered directions and journey snapshot — release 3.45

Directions now have equal viewport insets and spacing; the entire sky projection shifts with them so labels remain correct. Journey redraws no longer recalculate astronomical positions; no ten-second update occurs during journeys. Lobby/Settings keep the bounded update. Protective Earth/Sun artwork is retained. Production push authorized.

## Retained protective artwork visibility — implemented locally

App 3.44: Earth's five atmospheric gradients are stronger outside its opaque limb, including on tiny markers; the innermost layer expresses a cool-aqua 26°C comfort theme (no temperature label or physical claim). Outer footprint, text-clearance guards and static performance remain unchanged. Earth atmosphere and the Sun shield are now explicit owner-retained features in `AGENTS.md` and both atlas maps. Removal/default disabling/substantial fading requires owner approval; unit and actual browser-pixel/render-path tests guard against accidental loss. Device review remains open.

## Observer sky and Earth atmosphere — implemented locally

2026-09-17: removed the decorative daytime planet row, random background stars and daytime Moon suppression. Real stars and topocentric solar-system bodies share a zero-altitude horizon; denied location is explicitly a Greenwich reference. Earth remains below-horizon artwork with softly merged atmosphere layers. Calculation failures clear stale positions and bound retries; static journeys keep no repeating work. NASA reference, unit and desktop/mobile browser checks pass. Live-sky/device thermal and offline upgrade checks remain open; see `../SKY-ACCURACY.md`.

Earth adaptation: centered observer marker below the horizon; shrink/omit guards protect foreground text/controls, including their reveal position. Five softly merged atmospheric layers and a feathered Sun shield ring remain visual-only. Layout events cause a coalesced redraw, not idle polling.

Current broad test baseline: 34/37 non-browser tests pass. Content-safety/drone-duration need owner-managed `docs/dot.json`; chakra-selection has a stale array-order source assertion, reproduced on `6337889`. Track that test cleanup separately rather than altering unrelated Shots behavior in the sky change.

## Newcomer chakra orientation — implemented locally, device check pending

When Returning Journey is unchecked on a normal chakra journey, Begin proceeds directly to a short orientation before Arriving. A static night-sky standing body-map illustration marks each chakra name and body location in the chosen Display Language. Responsive calibrated arrowheads terminate at their matching points. The spoken orientation follows the chosen Meditation Language; its Malayalam copy uses short, natural spoken sentences and the Malayalam chakra names. The app switches explicitly to Arriving afterward, removing the previously visible welcome-screen flicker. Returning Journey, demo, Sleep, Music Only and focused practices bypass this screen. Automated source contracts and a targeted browser flow cover the branches; a user device readability and listening check remains open.

## Lobby video introduction — implemented locally, device check pending

The video introduction is an explicit persisted Lobby preference, OFF by default. When selected, the roadmap adds Video Introduction and the video buffers and plays before the normal journey dispatcher continues. Completion acknowledges the Do Not Disturb reminder once; an unavailable video still continues into the chosen journey. Restart Journey is now immediate and does not replay the video. The readiness-only dark shade is removed during actual playback, so the video uses its authored brightness and contrast. Automated source contracts cover routing and full-brightness behavior; a device playback/color check remains open.

## Newcomer body-map artwork labels — implemented locally, device check pending

The standing body-map artwork carries fixed English chakra labels and restrained leader lines. The responsive Display Language labels and connector arrows remain available for localized location guidance but render at reduced opacity, so the image’s fixed labels remain the primary visual reference. The asset, responsive-overlay contracts and atlas are synchronized; a device readability check remains open.

## Sleep Mode shared unlock — implemented locally, device check pending

Sleep Mode now shares the seven-rapid-tap App version Advanced Features unlock with Intimate Care, Shots and Manage Settings. It starts hidden/disabled, relock clears it, reload starts locked, and both UI and direct journey entry reject it while locked. Automated lock and atlas checks pass; user visual/device journey check remains open.

## Advanced Settings backup — implemented locally, device check pending

The shared seven-tap Advanced Features unlock now reveals a Manage Settings CTA in Settings → About. Its page exports only this app’s `chakra_` saved preferences as a versioned JSON backup. Import accepts a bounded, validated backup, asks for confirmation, replaces only those app keys and reloads; it never uploads settings or changes unrelated browser storage. Focused tests and atlas verification pass; visual/device import/download confirmation remains open.

## Shots shared unlock — implemented locally, CP-SHOTS-001

Shots heading/controls now share the seven-rapid-tap App version unlock with Intimate Care. Relock clears both selections; reload starts locked. No Frequency and confirmation remain. Repertory URLs wait for unlock before preparation; direct locked Shot execution is rejected. Static/mock tests pass; user visual check pending. Corrected obsolete four-click wording in the care map.

## Sleep controls clipping — fixed locally, device check pending

Sleep/Eyes Close dimming no longer filters ancestors of viewport-fixed controls. Brightness composes through opacity; warmth remains on artwork/sky only. This removes the identified containing-block cause of drifting/clipped controls. Source/mocked regression checks pass; actual Sleep layout still requires user verification.

## Journey cursor and controls — implemented locally

Cursor idles out after 3s. Bottom controls including mixer toggle reveal on hover, touch or keyboard focus in normal/fullscreen journeys, with open-mixer and exit cleanup guards. Mock interaction tests pass; device verification remains open.

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

### Modularization track — active on `modularize`

The atlas-led migration is now active. Delivered seams move settings backup operations into `modules/settings-backup.js`, initial state into `modules/app-state.js`, content path lookup/language fallback/script validation into `modules/content-localization.js`, deterministic media primitives into `modules/media-lifecycle.js`, Piper worker/synthesis/playback ownership into `modules/piper-lifecycle.js`, effect-route connect/tail-retirement ownership into `modules/audio-route-lifecycle.js`, and deterministic journey start routing plus the ordered preparation-stage plan into `modules/journey-routing.js`. All expose frozen APIs and preserve classic-script startup order. Web Audio bus construction is explicitly deferred until the next weekly reset; bounded journey stage contracts can continue before UI controllers. Each boundary must retain behavior, update its atlas ownership/source references, remove source-slicing tests where touched, and pass a focused parity gate before the next extraction. Native ES-module conversion and optional-feature lazy loading remain later decisions, not completed behavior.

### Planned post-parity performance phase

Do not begin this phase until the bounded module owners, AudioEngine extraction and UI controllers reach behavior parity. First record cold/warm/offline startup, parsed/executed script cost, journey-start latency and active worker/audio/animation resources. Keep state/settings, localization, Lobby controls, journey routing and lifecycle safety in a small eager shell. Consider cohesive optional bundles—Advanced/Yoga/Intimate/Experiments, Sleep, video introduction, specialized preparation practices, Piper runtime/model and optional spatial effects—only where measurements justify the boundary. The service worker may cache those bytes for offline use without executing them at startup. Preload only after selection or clear intent, deduplicate concurrent imports, provide a safe localized load failure, and make Begin await unfinished preparation. Add explicit release contracts for workers, decoded buffers, AudioNodes, media sources, animation/WebGL owners, observers, timers and listeners. Accept a boundary only after cold/warm/offline, cancellation/restart, PWA-update and route-regression evidence shows a worthwhile memory, CPU or startup improvement without harmful start delay. This is `PLANNED`, not delivered behavior.

## Working order

### Approved delivery workflow

CP-WORKFLOW-001 makes isolated worktrees and focused pull requests the default for substantial, risky, experimental or parallel checkpoints. Tiny isolated corrections remain direct when isolation overhead exceeds risk. Every sandbox receives bounded context, one checkpoint and declared file ownership; only one sandbox may own shared atlas, app-shell, service-worker, settings-schema, translation or audio-engine surfaces at a time. Pull-request readiness requires fresh targeted checks, two-stage review, synchronized atlas/handoff and a validated checkpoint commit. Approved remote merges are synchronized back to the local integration branch before combined regression checks; production publication remains separate. This improves effective token and engineering efficiency by reducing repeated context and rework, not because worktrees intrinsically reduce tokens. See `.loop/workflow.md` and the `delivery-workflow` atlas map.

### Approved visual checkpoint after assessment and modularization

CP-THEME-PLAN-001 adopts the Cosmic Observatory desktop/mobile concept saved under `docs/design/lite-cosmic-observatory/`. Follow `.loop/tracks/cosmic-observatory-theme/spec-plan-review.md` after both prerequisite tracks are complete. Implement shared visual tokens and responsive surfaces against the completed module APIs. Preserve all existing controls, defaults, translations, access rules, journey/audio behavior, offline delivery, static journey performance and Earth/Sun requirements. The generated mockup is an appearance reference; its omissions, sample timing, cardinal arrangement and curved horizon cannot change requirements. Validate responsive usability, functional parity and measured performance before accepting the design. The `cosmic-theme-planned` atlas map is future state only.

### Approved next feature after weekly reset — assessment tournament

Before modularization resumes, replace the standalone consultation with the approved operator-led two-choice hybrid bracket recorded in `.loop/tracks/assessment-tournament/`. Questions and hidden weights/signals come from one operator-approved English versioned JSON file; code owns validation, no-repeat selection, seven-chakra evidence balancing, unused tie-breakers, confidence, participant-friendly archetypes and a conservative result dot. Preserve the current Google Translate widget and ensure dynamically generated questions, choices, progress, archetypes and results are translated; this multilingual path remains internet-dependent. The visible result contains seven chakra statuses, archetype names and one small unlabelled green/orange/red patterned dot only. It has no Advanced Features controls, journey handoff or automatic action. Keep the existing `consultation` map authoritative until implementation is validated; the `assessment-tournament-planned` map is future state only.

For each fix: reproduce or prove the branch → implement the smallest correction → verify that branch and its neighboring exits → update the corresponding atlas map and source references. Keep a separate change record for each fix. Do not claim deployment from local checks.
