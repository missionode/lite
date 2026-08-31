# Temporary Multilingual Release Gates

This document contains only the remaining work from the multilingual architecture migration. Completed implementation decisions and evidence are recorded in `TECH-STACK.md` and `HANDOFF.md`.

## Completed evidence

- Playwright browser suite: **18/18 tests passed**.
- Verified language/content separation, timing-profile loading, persistence, dependencies, bath combinations, and journey modes.
- Static JavaScript, JSON, asset-path, and Git whitespace validation passed.

## Incomplete release gates

## Language integration register

### Hindi (`hi` / `hi-IN`) — approved, in progress

- Product decision: Hindi is a complete meditation-content and display-language integration and is approved to ship now with **browser TTS only**. Hindi implementation is not blocked by Piper licensing. Do not add a Hindi Piper model unless the owner separately approves a voice whose redistribution and commercial-use terms are compatible with Lite; that is a later, independent enhancement.
- Commercial boundary: when Hindi is the selected **Meditation Language**, do not reveal or schedule Lite's `Continue to Earn` handoff. This is a product boundary; it does not itself change a third-party voice licence.
- Content requirement: add professional Hindi counterparts for every English UI key and every English production narration field in `scripts.json`. Preserve the established stage order, durations, canonical mantra identifiers, safety boundaries, and all existing English/Malayalam/Russian behavior.
- Custom-script compatibility: existing guide-authored English/Malayalam bundles must remain uploadable. When a Hindi custom field is absent, runtime may use the existing English content fallback; shipped production content remains strict and must include Hindi fields.
- Required implementation paths: `language-manifest.json`, `locales/hi.json`, `scripts.json`, `app.js` language fallback and Earn visibility, app/language cache versions, and a Hindi language contract test. Do not modify `docs/dot.json`; it is independent facilitator content.
- Required release evidence: Hindi locale/narration parity, generated-intention switching, Hindi browser-voice filtering/preview fallback, Hindi custom-script fallback, no Earn control or delayed handoff for Hindi, installed-PWA cache update, native Hindi review, and real-device full-journey listening.
- Current state: no Hindi runtime scaffold is registered yet. Begin registration only in the same checkpoint that adds the complete Hindi locale/narration bundle and required static checks; do not commit, merge, or push a partial integration.

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
