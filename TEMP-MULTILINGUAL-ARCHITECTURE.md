# Temporary Multilingual Release Gates

This document contains only the remaining work from the multilingual architecture migration. Completed implementation decisions and evidence are recorded in `TECH-STACK.md` and `HANDOFF.md`.

## Completed evidence

- Playwright browser suite: **18/18 tests passed**.
- Verified language/content separation, timing-profile loading, persistence, dependencies, bath combinations, and journey modes.
- Static JavaScript, JSON, asset-path, and Git whitespace validation passed.

## Incomplete release gates

### Content and narration

- [ ] Review narration sentence boundaries and pronunciation-sensitive text for every supported language.
- [ ] Convert the remaining full narration pack to the language-neutral content shape where compatibility fields are still used.

### Piper voice validation

- [ ] Validate each model’s config, phonemizer locale, model bytes, pronunciation coverage, and representative preview sentences.
- [ ] Record model provenance, size, quality, upstream identifier, and redistribution license approval.
- [ ] Verify cold start, warm synthesis, cancellation, Cache API reuse, offline behavior, and browser fallback for each voice.

### Native and device release validation

- [ ] Native-speaker review for each language and voice.
- [ ] Real browser/mobile validation, including Samsung-class device testing.
- [ ] Measure CPU, memory, thermal impact, long-session stability, and audio continuity during meditation.
- [ ] Run a service-worker-enabled PWA/offline pass; the functional Playwright suite intentionally blocks service workers for determinism.

## Completion rule

Remove this temporary document only after every item above is completed and the evidence is transferred to `TECH-STACK.md` and `HANDOFF.md`.
