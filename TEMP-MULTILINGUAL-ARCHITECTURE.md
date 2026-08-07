# Temporary Architecture Migration Plan — Multilingual Content and Piper Voices

Status: planning checkpoint. This document must be completed and transferred to `TECH-STACK.md` and `HANDOFF.md` before removal.

## Objective

Make the client-only PWA generic enough to add languages and compatible Piper voices through data/configuration, while preserving the current Settings → Lobby → Journey flow, audio timing, buffering, pause/resume, offline behavior, and existing Malayalam/English content.

## Baseline findings

- The Piper Worker, Web Audio playback, rolling queue, service-worker cache, and browser fallback are reusable.
- Language selection is currently hardcoded to Malayalam/English in `index.html` and many `app.js` branches.
- UI/system copy is mixed into controller logic instead of being resolved through a locale layer.
- `scripts.json` stores bilingual keys and Yoga fields such as `name_ml`, `name_en`, `desc_ml`, and `desc_en`.
- `validateScriptBundle()` explicitly requires `.ml` and `.en` paths.
- Browser voice matching only recognizes `ml-*` and `en-*`.
- The Piper registry contains model paths, but the vendored runtime uses a static internal `PATH_MAP`; a new voice currently requires runtime code editing.
- Preview text, locale labels, fallback language codes, and completion/status messages contain Malayalam/English conditionals.

## Migration checklist

### 1. Language manifest and locale layer

- [x] Add a manifest defining language code, locale, display name, content source, UI locale source, preview sample, browser language prefixes, and default Piper voice.
- [x] Add locale dictionaries for UI/system copy without changing the existing visual flow.
- [x] Add generic `t(key)` and locale resolution helpers with a safe fallback language.
- [x] Populate the language selector from the manifest rather than hardcoded HTML options.
- [x] Preserve Malayalam as the default language.

### 2. Content-pack architecture

- [x] Define a language-neutral content contract boundary through manifest-driven sources and a generic localized resolver.
- [x] Resolve migrated localized values by language code, with compatibility for the existing suffix-specific properties.
- [x] Keep the existing bilingual script usable during migration through the compatibility resolver.
- [x] Make script validation derive required paths from the loaded language manifest.
- [x] Ensure custom scripts receive the same contract and clear missing-translation errors through the manifest-derived validator.
- [ ] Keep content narration sentence boundaries and pronunciation-sensitive text explicit.

### 3. Piper model architecture

- [x] Extend the model registry with config path and phonemizer voice metadata.
- [x] Make the Worker pass a complete registry model definition to the runtime.
- [x] Make the runtime prefer registry model/config paths, retaining the built-in map only as compatibility fallback.
- [x] Preserve model-specific handling for missing/null `speaker_id_map`.
- [ ] Validate model config, phonemizer locale, model bytes, license, and preview pronunciation before enabling a language.

### 4. Voice fallback and device behavior

- [x] Match browser voices using manifest locale/prefix rules, not only Malayalam/English conditionals.
- [x] Never retain an incompatible saved voice after a language change.
- [x] Use the manifest preview sample for Piper preview.
- [x] Keep fallback status and diagnostic logging language-neutral.
- [x] Keep lazy model loading, queue cancellation, cache versioning, and mobile CPU limits unchanged.
- [x] Cache the language manifest and locale bundles independently so future language packs can be loaded on demand and reused offline.

### 5. Controller and UI migration

- [x] Replace remaining language ternaries in user-visible UI and narration setup with locale lookups; remaining language comparisons are data/model selection checks only.
- [x] Localize Yoga, Bath, breathing, completion, lobby, settings, and status strings.
- [x] Preserve accessibility labels, layout, and mobile spacing.
- [x] Make the language selector automatically reflect manifest additions.

## Validation gates

- [x] Every current manifest language has a complete locale/content contract.
- [x] Existing Malayalam and English journeys still resolve all required content.
- [x] Adding a fixture language requires manifest/locale/content/model data changes rather than controller changes.
- [x] Piper voice selection is registry-driven and does not require modifying the runtime map for normal synthesis.
- [x] Browser fallback cannot narrate content with an incompatible locale.
- [x] JavaScript syntax, JSON parsing, static contracts, HTTP asset paths, and diff checks pass.
- [ ] Browser/device validation remains a separate release gate for each new language/voice.

## Completion rule

Remove this temporary document only after the completed architecture decisions, migration status, validation evidence, and remaining release gates are transferred to `TECH-STACK.md` and `HANDOFF.md`.
