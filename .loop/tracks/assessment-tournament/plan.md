# Plan

## Current implementation status

- `CP-ASSESS-IMPL-002` implements steps 1–7 and the offline-delivery portion of step 9 in the isolated `codex/assessment-tournament` worktree.
- The bounded repository map is recorded in `ast-map.md`; no AST parser dependency was available, so it explicitly uses syntax/symbol fallback.
- `data/assessment-questions.json` owns the versioned seven-chakra question bank and eight value cards. `modules/assessment-tournament.js` owns validation, deterministic coverage, unique pair scheduling, resume sanitation, tie-breakers, scoring, archetypes and conservative dot thresholds. `modules/assessment-persistence.js` owns one versioned state key and legacy clearing.
- `/docs/assesment.html` now runs the replacement one-question/two-card tournament and `sw.js` precaches its versioned dependencies. Live Google Translate, responsive-device and trained-operator review remain `CP-ASSESS-IMPL-003`.

1. Preserve the current consultation as the executable baseline and inventory its local persistence, reset and responsive behavior.
2. Define and test the versioned JSON schema, seven-chakra weight model, archetype signals, the eight-card value-priority bracket, evidence minimums and conservative dot thresholds.
3. Draft and operator-review the English two-choice question bank for neutrality, balanced coverage and non-repetition. Include balanced, position-countered pairings across Sensual Joy, Luxury, Independence, Spontaneity, Commitment, Social Approval, Emotional Safety and Romantic Idealism. Preserve the current Google Translate widget and verify that dynamically generated interview and result content is translatable.
4. Implement a pure adaptive tournament engine: unique-question ledger, bracket progression, equal/skip handling, coverage recovery, unused tie-breakers, confidence and deterministic reset/resume.
5. **Implemented:** build the one-question/two-card operator interview in `/docs/assesment.html` with progress and responsive/keyboard-native controls.
6. **Implemented:** build the result with seven chakra statuses, participant-friendly archetypes and one small unlabelled patterned colour dot only.
7. **Focused validation complete:** simulated answer profiles, chakra and value-pairing balance, position counterbalancing, dot evidence minimums, malformed stored state, repeated input, deterministic resume, clear-for-new-client and local-data separation.
8. **Browser-verified:** Google Translate language menu and dynamically rendered questions work in Malayalam, Hindi and Russian; translation requires network access. Generated answer cards, progress, archetype names and results are prepared through the same translated-string cache.
9. **Implemented source contract:** replace the retired consultation map with the delivered tournament map and cache the page, JSON and two modules. Browser/operator acceptance remains step 8 before integration.
10. After this feature is validated, resume the modularization track from CP-MOD-010.
