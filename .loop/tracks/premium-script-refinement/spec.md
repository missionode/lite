# Premium Script Refinement

## Status

APPROVED — active

## Objective

Refine the established chakra journey narration into a confident, high-value guided experience for discerning private clients while preserving its inclusive use for every meditator.

## Scope

- Keep the existing `scripts.json` schema, journey sequence, mantras, frequencies, and runtime behavior unchanged.
- Refine the built-in English, Malayalam, Russian, and Hindi narration for the standard chakra journey.
- Retain the established themes of healing, receiving, aura protection, and release/renewal.
- Add a grounded theme of fortunate timing and recognising worthy opportunities; do not present luck as a guaranteed external outcome.
- Reconcile narration duration, configured gaps, stage duration, and the displayed session estimate.

## Exclusions

- No changes to meditation controls, audio processing, voice models, timing sliders, or journey order.
- Do not recreate or modify the owner-deleted `docs/dot.json`.
- Do not rewrite the short technical `test-script.json` fixture unless a schema field is missing.

## Acceptance criteria

1. Every affected built-in narration field remains available in all four shipped languages.
2. The experience remains affirmative, ceremonial, non-coercive, and free of clinical diagnoses or guaranteed external outcomes.
3. The estimate accounts for the actual configured stage durations and fixed journey narration/transitions closely enough to avoid a misleading countdown.
4. Existing content/schema/language contracts pass, with targeted timing coverage added or updated as needed.
