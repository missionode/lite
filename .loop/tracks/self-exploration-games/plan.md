# Implementation plan

1. Extend the existing Advanced Features Self-Exploration selection without changing Quiet Courage or the Journey Preparation order.
2. Add one lazy-loaded practice module for the two guided exercises and the short final-choice challenge; keep choice state in memory only and make all waits cancellation-aware.
3. Add localized labels/scripts, roadmap ordering, focused-duration estimates, settings visibility/lock behavior and service-worker offline entries/cache generation.
4. Add deterministic tests for module lifecycle, route ordering/standalone validation, translations, no persistence, cancellation and cache delivery.
5. Update atlas data, fix queue and handoff; regenerate and verify. Run the applicable test suite, record missing prerequisites and keep production publication separate pending a clean, reviewed integration.
