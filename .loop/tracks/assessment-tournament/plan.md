# Plan

## Current implementation status

- `CP-ASSESS-IMPL-001` implements steps 1–2 and the pure-engine portion of step 4 in the isolated `codex/assessment-tournament` worktree.
- The bounded repository map is recorded in `ast-map.md`; no AST parser dependency was available, so it explicitly uses syntax/symbol fallback.
- `data/assessment-questions.json` now owns the versioned seven-chakra question bank and eight value cards. `modules/assessment-tournament.js` owns validation, deterministic coverage, unique pair scheduling, resume sanitation, tie-breakers, scoring, archetypes and conservative dot thresholds.
- The existing consultation page remains untouched and authoritative. UI replacement, Google Translate runtime verification, persistence wiring, service-worker delivery and operator/browser review remain later checkpoints.

1. Preserve the current consultation as the executable baseline and inventory its local persistence, reset and responsive behavior.
2. Define and test the versioned JSON schema, seven-chakra weight model, archetype signals, the eight-card value-priority bracket, evidence minimums and conservative dot thresholds.
3. Draft and operator-review the English two-choice question bank for neutrality, balanced coverage and non-repetition. Include balanced, position-countered pairings across Sensual Joy, Luxury, Independence, Spontaneity, Commitment, Social Approval, Emotional Safety and Romantic Idealism. Preserve the current Google Translate widget and verify that dynamically generated interview and result content is translatable.
4. Implement a pure adaptive tournament engine: unique-question ledger, bracket progression, equal/skip handling, coverage recovery, unused tie-breakers, confidence and deterministic reset/resume.
5. Build the one-question/two-card operator interview in `/docs/assesment.html` with progress and responsive/keyboard behavior.
6. Build the result: seven chakra statuses, participant-friendly archetypes and one small unlabelled patterned colour dot only.
7. Validate simulated answer profiles, chakra and value-pairing balance, position counterbalancing, dot evidence minimums, malformed JSON, repeated input, refresh/resume, clear-for-new-client and local-data separation.
8. Verify Google Translate behavior for the page shell, generated questions, answer cards, progress, archetype names and results; retain an explicit online-translation limitation.
9. Replace the current consultation atlas map only after runtime parity is verified; update offline delivery if new assets become required.
10. After this feature is validated, resume the modularization track from CP-MOD-010.
