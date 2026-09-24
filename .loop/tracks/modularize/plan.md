# Plan

1. Add the modularization safety-loop map and queue future boundaries.
2. Warm-up: extract settings backup helpers and test the module directly.
3. Centralize settings schema and persistent/session state ownership. Complete: initial-state factory and direct behavior contract delivered.
4. Extract content and localization services. Complete: lookup, fallback, localized shapes and script validation. Timing controls remain with UI until their ownership boundary.
5. Separate narration and audio lifecycle owners. Partially complete: deterministic media primitives delivered in CP-MOD-005, Piper lifecycle in CP-MOD-006, and shared effect-route retirement in CP-MOD-007. AudioEngine bus construction is explicitly deferred until the next weekly reset.
6. Convert journey orchestration into reusable stage contracts. In progress: CP-MOD-008 owns deterministic focused-mode selection, launch priority, prelude-safe chakra validation and chakra-order selection; CP-MOD-009 owns the ordered preparation-stage plan; CP-MOD-011 owns sequential execution and the between-stage active-session guard; CP-MOD-012 through CP-MOD-018 own the Body Scan, Guided Noting, Dharana, Box Breathing, Visualization, Ho’oponopono and Undo & Unlearn practice lifecycles. CP-MOD-019 owns shared screen navigation; CP-MOD-020 owns Lobby session estimates.
7. Split Lobby, Settings, Advanced Features and session UI controllers. CP-MOD-021 extracts the Mood & Relaxation ambience settings renderer while preserving the Advanced Features gate and recovery affordances. CP-MOD-022 extracts drone-duration radio/note synchronization; app retains all timing calculations and selection persistence. CP-MOD-023 extracts the Lobby experience-visibility controller with app-injected localization, state, timing and supporting UI refresh callbacks. CP-MOD-024 extracts Yoga setup selection persistence and timing-row visibility, while preference hydration and Yoga session execution remain app-owned. CP-MOD-025 extracts range formatting, step-button enhancement and display refresh; timing configuration and business state remain app-owned.
8. Introduce measured feature-level lazy loading only after extraction parity:
   - Capture startup script/heap cost, journey-start latency, active worker/audio/animation resources and offline behavior before changing delivery.
   - Keep the essential shell eager: state/settings, localization, Lobby controls, journey routing and core lifecycle safety.
   - Define cohesive optional bundles for candidates such as Advanced/Yoga/Intimate/Experiments, Sleep, video introduction, specialized preparation practices, Piper runtime/model and optional spatial effects. Confirm each boundary from measurements rather than splitting every small file.
   - Convert approved optional boundaries to dynamic loading. Let the service worker cache bytes for offline use without executing them at startup; deduplicate concurrent imports and surface a safe localized failure path.
   - Begin preload when the user selects or approaches an optional experience, then let Begin await only unfinished preparation. Do not preload unselected features or create background polling.
   - Add explicit release contracts for workers, decoded audio buffers, AudioNodes, media element sources, animation frames, WebGL/canvas owners, observers, timers and listeners where safe.
   - Revalidate cold/warm/offline startup, every journey route, cancellation/restart, PWA update behavior and journey-start latency. Adopt each lazy boundary only when measured memory/CPU/startup benefit outweighs added complexity.

Every phase stops on test failure, overlapping external changes or behavior disagreement.

CP-MOD-013 extracts Guided Noting's timed reminder loop, cancellation checks and black-scene cleanup behind a frozen directly tested API. The app remains responsible for selecting localized copy and injecting existing screen, visual, narration, sleep and session services; eager loading and offline precache remain unchanged. This is an ownership/testability step, not a performance optimization. Continue with the remaining self-contained practice lifecycles and UI controllers before measuring optional loading boundaries.

CP-MOD-014 extracts Dharana's anchor selection, shrinking session clock, narrated four-second release and cleanup behind a frozen direct-test API. CSS still supplies the same anchor/veil transitions, while session time continues to shrink the anchor when reduced motion disables animation. No narration order, duration, visuals or audio behavior should change.

CP-MOD-015 extracts Box Breathing's tutorial, localized four-step cycle, responsive pause accounting, completion narration and background-music handoff behind a frozen direct-test API. The controller supplies existing translation, timing, audio, narration and session services. The established 100 ms pause-check cadence is intentionally unchanged; this extraction is not a CPU optimization.

CP-MOD-016 extracts Visualization's blackout, narration, silence wake prompt, ambient/music handoffs, active-duration clock, gradual re-entry and cleanup sequence behind a frozen direct-test API. The controller injects localized narration and existing audio, screen and session services. Preserve current ordering, fade durations and cancellation behavior; this is an ownership/testing step, not a performance optimization.

CP-MOD-017 extracts Ho’oponopono's localized opening, three cycles of the four phrases, configured pauses, closing fade handoff and visual setup behind a frozen direct-test API. The app continues to own integration-stage placement, script localization, audio/narration and session timing services; preserve the current order and behavior.

CP-MOD-018 extracts Undo & Unlearn's black-scene setup, localized phase sequencing, active-session guards and fade cleanup behind a frozen direct-test API. Preserve its content-free private-reflection contract and existing timing. Guarantee DOM/body cleanup even if the scene-release delay rejects; leave integration placement, copy and session services in the app.

CP-MOD-019 extracts the shared screen-visibility/static-sky/scroll-reset behavior into an injectable navigation owner. Preserve all screen IDs, scroll resets, decorationchange notification, and the dynamic sky on Lobby and Settings. Existing call sites remain routed through the app's compatibility wrapper.

CP-MOD-020 extracts the ordered Lobby session-duration estimate calculation into a directly tested view-model. Preserve every focused-mode priority, default duration, translation key, timing-config input, demo adjustment, and selected-chakra/add-on formula. App retains the rendering and roadmap refresh.

CP-MOD-021 extracts rendering/synchronization of the Mood & Relaxation ambience controls from the Settings/Lobby view logic into a frozen UI module. Preserve the Advanced Features visibility gate, session-only selection, No Frequency disabling, missing-source recovery message and all existing slider formatting. This is eager-loaded and precached ownership work, not a performance optimization.

CP-MOD-022 extracts only drone-duration option and contextual-note synchronization. Preserve app-owned mode selection, HRIM's Beginner restriction, Sleep/standard eligibility and the existing duration summary calculation. This is eager-loaded and precached ownership work, not a performance optimization.

CP-MOD-023 extracts Lobby experience visibility and associated display synchronization behind a frozen controller API. Preserve selected-mode guards, standalone preparation behavior, Advanced Features/No Frequency Shot restrictions, option visibility, duration range values and labels, Shot/Intimate Service/Yoga presentations and refresh order. The app injects live state, localization, timing and adjacent controller callbacks. Eager delivery remains; no performance benefit is claimed.

CP-MOD-024 extracts the Yoga Experience settings boundary: reading checked Corpse Pose/Bath/selected-pose controls, persisting those values immediately and on Settings save, and synchronizing the related timing-row visibility/accessibility state. The app still hydrates persistent state and consumes the Yoga selection during session validation/execution. Preserve the existing storage keys and visible-row layout defaults. Eager delivery remains; this is an ownership extraction, not a performance optimization.

CP-MOD-025 extracts the shared range-control UI: value formatting, idempotent DOM enhancement, bounded increment/decrement buttons, disabled boundary states and display refresh. The app remains responsible for timing-config interpretation, state updates and value persistence. Preserve the current labels, rounding, time units, DOM structure, event bubbling, boundaries and offline script order. Eager delivery remains; this is not a performance optimization.

CP-MOD-011/012 use identical local Chromium measurements as indicative comparisons, not production wire-size or device evidence: the local server does not compress responses and the harness blocks Google Fonts. CP-MOD-012 adds one eagerly loaded practice module; sampled response bodies grow about 1.4 KiB net, while timing deltas remain within single-run noise. This extraction is not a performance optimization. Select lazy boundaries only after extraction parity and repeatable cold/warm/offline comparisons.

After this track and the assessment are complete, proceed to the separate approved Cosmic Observatory visual redesign, CP-THEME-PLAN-001. Its reference and behavior-preservation contract live in `.loop/tracks/cosmic-observatory-theme/`; it does not alter the extraction sequence above.
