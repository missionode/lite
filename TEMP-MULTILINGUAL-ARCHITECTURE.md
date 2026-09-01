# Temporary Multilingual Release Gates

This document contains only the remaining work from the multilingual architecture migration. Completed implementation decisions and evidence are recorded in `TECH-STACK.md` and `HANDOFF.md`.

## Completed evidence

- Playwright browser suite: **18/18 tests passed**.
- Verified language/content separation, timing-profile loading, persistence, dependencies, bath combinations, and journey modes.
- Static JavaScript, JSON, asset-path, and Git whitespace validation passed.

## Incomplete release gates

## Language integration register

### Hindi (`hi` / `hi-IN`) — merged to local production; manual review deferred

- Product decision: Hindi is a complete meditation-content and display-language integration and is approved to ship now with **browser TTS only**. Hindi implementation is not blocked by Piper licensing. Do not add a Hindi Piper model unless the owner separately approves a voice whose redistribution and commercial-use terms are compatible with Lite; that is a later, independent enhancement.
- Commercial boundary: when Hindi is the selected **Meditation Language**, do not reveal or schedule Lite's `Continue to Earn` handoff. This is a product boundary; it does not itself change a third-party voice licence.
- Content requirement: add professional Hindi counterparts for every English UI key and every English production narration field in `scripts.json`. Preserve the established stage order, durations, canonical mantra identifiers, safety boundaries, and all existing English/Malayalam/Russian behavior.
- Custom-script compatibility: existing guide-authored English/Malayalam bundles must remain uploadable. When a Hindi custom field is absent, runtime may use the existing English content fallback; shipped production content remains strict and must include Hindi fields.
- Implemented paths: `language-manifest.json`, `locales/hi.json`, all English production narration siblings in `scripts.json`, the manifest fallback registry, Hindi Earn-timer suppression, app/language cache versions, and `tests/hindi-language.test.mjs`. `piper-models.json` and independent facilitator content in `docs/dot.json` remain untouched by this feature.
- Static/unit contract: exact locale shape and placeholder parity, narration sibling parity, canonical mantra and sleep-stage preservation, Hindi safety wording, browser-prefix voice filtering, absence of Hindi Piper/default Piper configuration, strict shipped-content validation, legacy custom-script English fallback, Earn timer suppression, and cache/app rotation.
- Completed static release evidence: generated-intention switching through the existing registry-wide contract; strict shipped-content validation; legacy custom-script English fallback; Hindi Earn suppression; and cache/app rotation. `tests/hindi-language.test.mjs` guards these contracts.
- Deferred manual evidence: native Hindi review, target-device browser-voice filtering and preview fallback, real-device full-journey listening, and installed-PWA/offline cache verification. The owner has authorized the production merge/push with these manual quality gates recorded as deferred rather than completed. Local production merge: `8e1dead`; remote push is pending at this documentation checkpoint.

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
