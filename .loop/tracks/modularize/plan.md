# Plan

1. Add the modularization safety-loop map and queue future boundaries.
2. Warm-up: extract settings backup helpers and test the module directly.
3. Centralize settings schema and persistent/session state ownership. Complete: initial-state factory and direct behavior contract delivered.
4. Extract content, localization and timing services.
5. Separate narration and audio lifecycle owners.
6. Convert journey orchestration into reusable stage contracts.
7. Split Lobby, Settings, Advanced Features and session UI controllers.
8. Review optional lazy loading after parity and offline checks.

Every phase stops on test failure, overlapping external changes or behavior disagreement.
