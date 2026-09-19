# Plan

1. Add the modularization safety-loop map and queue future boundaries.
2. Warm-up: extract settings backup helpers and test the module directly.
3. Centralize settings schema and persistent/session state ownership. Complete: initial-state factory and direct behavior contract delivered.
4. Extract content and localization services. Complete: lookup, fallback, localized shapes and script validation. Timing controls remain with UI until their ownership boundary.
5. Separate narration and audio lifecycle owners. Partially complete: deterministic media primitives delivered in CP-MOD-005, Piper lifecycle in CP-MOD-006, and shared effect-route retirement in CP-MOD-007. AudioEngine bus construction is explicitly deferred until the next weekly reset.
6. Convert journey orchestration into reusable stage contracts. In progress: CP-MOD-008 owns deterministic focused-mode selection, launch priority, prelude-safe chakra validation and chakra-order selection; stage execution remains in `app.js`.
7. Split Lobby, Settings, Advanced Features and session UI controllers.
8. Review optional lazy loading after parity and offline checks.

Every phase stops on test failure, overlapping external changes or behavior disagreement.
