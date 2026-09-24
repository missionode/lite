# Assessment task-scoped repository map

Checkpoint: `CP-ASSESS-IMPL-002`

Mapping method: bounded symbol/dependency inspection. This dependency-light PWA has no JavaScript AST parser installed, so the map uses syntax checks plus targeted symbol/call-site search. It is navigation evidence, not a claim of complete AST coverage.

## Runtime entry and ownership

- `index.html` — Lobby owns the `#begin-consultation` CTA.
- `app.js` — the CTA handler navigates to `./docs/assesment.html`; assessment state is not shared with journey state.
- `docs/assesment.html` — standalone one-question/two-card shell, safe dynamic rendering, progress/results, font controls, Google Translate initialization and deliberate new-client reset.
- `sw.js` — shell cache `chakra-v5.257` precaches the assessment page and its versioned JSON, engine and persistence dependencies.

## Delivered assessment owners

- Data: `data/assessment-questions.json` owns English prompts, two-choice labels, weights, value cards and positive archetype names.
- Algorithm: `ChakraAssessmentTournament` owns validation, deterministic selection, no-repeat ledgers, scoring/confidence and conservative dot thresholds.
- State: `ChakraAssessmentPersistence` owns `chakraAssessmentTournamentV1`; load/save sanitize through the engine and clear also removes retired `chakraAnswers` and `chakraAssessmentNotes`.
- UI lifecycle: `start`, `renderNext`, `answer`, `renderResult`, safe DOM helpers, font controls, Translate toggle and `googleTranslateElementInit`.
- Reset: `#newAssessment` confirms, clears replacement and legacy assessment state, then renders a fresh first prompt without reloading.

## Verified seams

- `data/assessment-questions.json` — versioned English question/value bank and declarative weights/signals only.
- `modules/assessment-tournament.js` — pure schema validation, deterministic unique-question ledger, balanced chakra coverage, value-pair scheduling, scoring/confidence/archetypes, conservative dot and serializable state transitions.
- `docs/assesment.html` — one-question/two-card shell, Equal/Skip, progress, result and text-node dynamic rendering.
- `tests/chakra-assessment.test.mjs`, `tests/assessment-tournament.test.mjs`, `tests/assessment-persistence.test.mjs` — UI, engine, no-repeat/balance, resume/reset, failure and cache contracts.
- `docs/app-map/atlas-data.mjs` — delivered assessment map; live translation, responsive-device and operator acceptance remain explicitly pending.

## Invariants

- Standalone page; no journey recommendation, configuration, service activation or automatic navigation.
- One English source translated by the existing internet-dependent Google Translate widget, including dynamically inserted content.
- Every answered, Equal or Skip item is consumed and cannot repeat.
- Value cards: Sensual Joy, Luxury, Independence, Spontaneity, Commitment, Social Approval, Emotional Safety and Romantic Idealism. Unordered pairings do not repeat and left/right placement is counterbalanced.
- A single response cannot produce a decisive green/red dot. The dot remains small and unlabelled in participant-visible output.
- Clear for New Client removes every answer, ledger, value result and note owned by the replacement.
- Existing unrelated Lobby, journey, audio, localization and sky behavior remain untouched.
