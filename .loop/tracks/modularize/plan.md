# Plan

1. Add the modularization safety-loop map and queue future boundaries.
2. Warm-up: extract settings backup helpers and test the module directly.
3. Centralize settings schema and persistent/session state ownership. Complete: initial-state factory and direct behavior contract delivered.
4. Extract content and localization services. Complete: lookup, fallback, localized shapes and script validation. Timing controls remain with UI until their ownership boundary.
5. Separate narration and audio lifecycle owners. Partially complete: deterministic media primitives delivered in CP-MOD-005, Piper lifecycle in CP-MOD-006, and shared effect-route retirement in CP-MOD-007. AudioEngine bus construction is explicitly deferred until the next weekly reset.
6. Convert journey orchestration into reusable stage contracts. In progress: CP-MOD-008 owns deterministic focused-mode selection, launch priority, prelude-safe chakra validation and chakra-order selection; CP-MOD-009 owns the ordered preparation-stage plan. Stage execution remains in `app.js`.
7. Split Lobby, Settings, Advanced Features and session UI controllers.
8. Introduce measured feature-level lazy loading only after extraction parity:
   - Capture startup script/heap cost, journey-start latency, active worker/audio/animation resources and offline behavior before changing delivery.
   - Keep the essential shell eager: state/settings, localization, Lobby controls, journey routing and core lifecycle safety.
   - Define cohesive optional bundles for candidates such as Advanced/Yoga/Intimate/Experiments, Sleep, video introduction, specialized preparation practices, Piper runtime/model and optional spatial effects. Confirm each boundary from measurements rather than splitting every small file.
   - Convert approved optional boundaries to dynamic loading. Let the service worker cache bytes for offline use without executing them at startup; deduplicate concurrent imports and surface a safe localized failure path.
   - Begin preload when the user selects or approaches an optional experience, then let Begin await only unfinished preparation. Do not preload unselected features or create background polling.
   - Add explicit release contracts for workers, decoded audio buffers, AudioNodes, media element sources, animation frames, WebGL/canvas owners, observers, timers and listeners where safe.
   - Revalidate cold/warm/offline startup, every journey route, cancellation/restart, PWA update behavior and journey-start latency. Adopt each lazy boundary only when measured memory/CPU/startup benefit outweighs added complexity.

Every phase stops on test failure, overlapping external changes or behavior disagreement.

After this track and the assessment are complete, proceed to the separate approved Cosmic Observatory visual redesign, CP-THEME-PLAN-001. Its reference and behavior-preservation contract live in `.loop/tracks/cosmic-observatory-theme/`; it does not alter the extraction sequence above.
