# Assessment task-scoped repository map

Checkpoint: `CP-ASSESS-IMPL-001`

Mapping method: bounded symbol/dependency inspection. This dependency-light PWA has no JavaScript AST parser installed, so the map uses syntax checks plus targeted symbol/call-site search. It is navigation evidence, not a claim of complete AST coverage.

## Runtime entry and ownership

- `index.html` — Lobby owns the `#begin-consultation` CTA.
- `app.js` — the CTA handler navigates to `./docs/assesment.html`; assessment state is not shared with journey state.
- `docs/assesment.html` — current standalone page, CSS, English question data, local persistence, rendering, Google Translate initialization and reset behavior.
- `sw.js` — precaches the assessment page; new same-origin JSON/module assets must be added and the shell cache rotated only when implementation is ready.

## Current assessment symbols

- Data: `chakras`, `consultationMeta`, `themeLabels`.
- State: `chakraAnswers`, `chakraAssessmentNotes`, `chakraFontScale` in `localStorage`.
- Interpretation: `trainingNeed`, `buildChakraInsight`, `renderChakraInsight`, `renderAssessmentReview`, `renderEval`.
- UI lifecycle: `activateChakra`, `syncThemeToScroll`, `scheduleThemeSync`, delegated `change`/`input`, font controls, Translate toggle and `googleTranslateElementInit`.
- Reset: `#newAssessment` confirms, removes both assessment keys and reloads.

## Target seams

- `data/assessment-questions.json` — versioned English question/value bank and declarative weights/signals only.
- `modules/assessment-tournament.js` — pure schema validation, deterministic unique-question ledger, balanced chakra coverage, value-pair scheduling, scoring/confidence/archetypes, conservative dot and serializable state transitions.
- `docs/assesment.html` — responsive one-question/two-card shell, Equal/Skip, progress, result and Google Translate-compatible dynamic rendering.
- `tests/chakra-assessment.test.mjs` — executable schema/engine/UI contract including no-repeat, balanced coverage, value position counterbalance, resume/reset and conservative dot thresholds.
- `sw.js` — cache the new JSON/module and rotate the cache generation after runtime validation.
- `docs/app-map/atlas-data.mjs` — replace the current consultation map only after executable parity passes; until then retain both current and active-plan maps.

## Invariants

- Standalone page; no journey recommendation, configuration, service activation or automatic navigation.
- One English source translated by the existing internet-dependent Google Translate widget, including dynamically inserted content.
- Every answered, Equal or Skip item is consumed and cannot repeat.
- Value cards: Sensual Joy, Luxury, Independence, Spontaneity, Commitment, Social Approval, Emotional Safety and Romantic Idealism. Unordered pairings do not repeat and left/right placement is counterbalanced.
- A single response cannot produce a decisive green/red dot. The dot remains small and unlabelled in participant-visible output.
- Clear for New Client removes every answer, ledger, value result and note owned by the replacement.
- Existing unrelated Lobby, journey, audio, localization and sky behavior remain untouched.
