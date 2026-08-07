# Chakra Meditation — Active Handoff

## START

- Objective: improve Yoga Bridge and Bath timing discoverability and toggle behavior.
- Target root: `/Users/lekshmisyam/Desktop/Ikigai/lite`.
- Stack: static HTML/CSS/JavaScript PWA; no dependencies, backend, database, or browser gate.
- Permanent constraint: preserve the existing journey order unless explicitly changed.

## MID

- Yoga Bridge is a stage before the Crown chakra.
- Bath is an optional nested stage that runs before Yoga.
- Timing values persist in `localStorage` under the existing `chakra_time_*` keys.
- The UI already had visibility helpers and estimate logic; this checkpoint consolidates the controls without changing the storage contract.

## NOW

- Implemented grouped Yoga preparation, per-pose, pose-selection, Bath toggle, and Bath duration controls under Yoga Bridge.
- Added visible copy explaining `Bath → Yoga → Crown` order.
- Bath duration now appears only when Yoga Bridge and Bath Session are enabled.
- Session estimates include Yoga only when enabled and Bath only when its toggle is enabled.
- Bath minimum duration is now 60 seconds for a practical short test while retaining an 1,800-second maximum.
- Validation: `static` evidence level — syntax, JSON, DOM ID uniqueness, local asset references, and diff whitespace checks passed.
- Browser/manual visual validation remains open because it was not required for this checkpoint.
- Implemented a mobile UI pass for Settings and Lobby: scroll-safe settings layout, short-screen lobby layout, safe-area spacing, larger touch targets, mobile-friendly sliders, responsive buttons, compact headings, and viewport-safe mixer/controls.
- Normalized vertical spacing for Audio Levels, Journey Timings, Yoga Timing, and Bath Duration using shared settings-panel and settings-mixer rules instead of repeated inline section spacing.
- Removed the empty chakra image source and added guarded image loading so chakra, deity, Yoga, and Music Only symbols remain hidden until the selected asset loads successfully, preventing the brief broken-image flash.
- Grouped the Lobby Begin Journey and Settings controls into a dedicated vertical action group with explicit spacing and full-width touch-friendly sizing.
- Added explicit top spacing above the Lobby “Meditation Room” heading.
- Increased the Lobby action-group gap and added explicit top margin to the Settings link so the Start Meditation and Settings controls remain visibly separated on mobile and desktop.
- Decision: retain local hand-authored CSS; do not add Tailwind CDN. This preserves the offline PWA behavior and avoids introducing a runtime styling dependency. A future Tailwind migration would require a deliberate build-based migration to local static CSS.
- Repaired the orphaned `#aura-bg` CSS selector and replaced unsupported `width: stretch` declarations with `width: 100%`.
- Validation: `static` evidence level — JavaScript syntax, JSON parsing, DOM ID checks, responsive CSS contract checks, and diff whitespace checks passed.
- Browser/manual visual validation is `BLOCKED` because no browser backend is available in this environment (`agent.browsers.list()` returned no backends).
- Next step: open the app on a real mobile viewport and verify settings scrolling, lobby spacing, slider dragging, and tap target comfort.
- Piper neural TTS is now the preferred narration path for registered local voices. The current implementation is client-only and keeps browser `speechSynthesis` as a graceful fallback.
- Piper timing decision: retain the configured journey interval as the minimum user-facing meditation pause. Piper may extend the pause only when the next narration is not ready.
- Piper architecture decision: use a dedicated Web Worker for ONNX inference, a bounded two-to-three-segment rolling narration queue, and the existing Web Audio/background-music path for playback and timing. Do not run inference in the service worker.
- Service-worker decision: use the service worker only for versioned, on-demand caching of the Piper runtime and selected voice model assets. Do not precache every language model or use the service worker for live audio scheduling.
- Voice-preview decision: the preview must use the exact selected Piper voice/model and the same narration playback path as the journey, with a representative meditation sentence, a first-use “Preparing voice…” state, and browser TTS fallback only when Piper is unavailable.
- Implemented Piper integration: `piper-models.json` provides Malayalam Arjun/Meera and English Lessac registry entries with model paths, sizes, source identifiers, quality, and license-review metadata; `piper-worker.js` owns model loading and synthesis; `app.js` owns queueing, Web Audio playback, ducking, preview, pause, cancellation, and browser fallback.
- The existing journey interval remains the minimum pause. Piper prepares a bounded rolling queue and may wait beyond that minimum only when the next segment is not decoded and ready. Existing background music continues through the wait.
- Piper runtime assets are vendored under `piper/`; the service worker uses a separate versioned, on-demand cache for runtime/model requests and never performs inference. Voice models remain lazy-loaded rather than precached.
- Piper controls are intentionally conservative: voice selection and volume use the local model and Web Audio gain path; browser-only pitch/rate behavior is not silently presented as equivalent Piper control.
- Validation completed at `static` level: JavaScript syntax, JSON parsing, worker/registry contracts, local asset paths, HTTP serving of all Piper assets, and diff whitespace checks passed. A direct Node inference smoke test is not a valid runtime gate because this browser-oriented ONNX/WASM bundle requires browser Worker/WebAssembly APIs.
- Browser/manual validation is `BLOCKED` in this environment because no browser backend is available. Before release, validate first-run model download, cached/offline replay, preview, a complete journey, pause/resume/stop, screen lock/visibility changes, and Samsung S24 FE CPU/thermal/battery behavior.
- Piper preview fix: binary runtime paths now resolve from `piper/runtime/piper-tts-web.js` via `import.meta.url`, avoiding HTML responses from document/dev-server fallback routes. Non-isolated pages now use one WASM thread; the separate Piper cache was bumped to `chakra-piper-v2` to evict stale failed responses. Local HTTP verification returned `application/wasm` and valid `00 61 73 6d` headers for both Piper and ONNX WASM assets.
- Piper diagnostics/fallback fix: preview and journey failures now log the underlying Worker/asset exception to the console. Browser fallback voices shown in Settings are filtered to the selected content language, and fallback narration chooses a matching `ml-*` or `en-*` browser voice so an English voice cannot pronounce Malayalam text as an incompatible approximation.
- Malayalam Piper compatibility fix: the Piper web wrapper assumed every model had a non-null `speaker_id_map`; Malayalam single-speaker model metadata can omit it or return `null`, so synthesis now treats that field as an empty map and only sends `sid` for multi-speaker models.
- Piper meditation tone tuning: widened the voice low-pass ceiling from 2.2kHz to 5.2kHz in normal mode and 3.2kHz in eyes-closed mode, and added a restrained 0.75–1.0dB presence lift during Piper narration. Native Piper prosody remains unchanged; background ducking and sentence timing are preserved.
- Added a timeless returning-visitor opening in English and Malayalam. The first completed journey keeps the moon-phase opening; later journeys use a sea-and-tide image that invites discovery without repeating the orientation or history content.
- Started multilingual architecture migration: added `language-manifest.json`, `locales/en.json`, and `locales/ml.json`; the language selector, locale lookup, browser voice matching, preview sentence, content source, and HTML locale now derive from manifest data. Migrated localized content resolution for core optional stages, Yoga fields, closing, Ho'oponopono, breathing steps, and intention text while preserving the existing bilingual script contract.
- Piper model loading is now registry-driven for model path, config path, and phonemizer voice. The Worker passes the complete model definition and the runtime prefers registry paths, so future voice additions do not require editing the vendored runtime map.
- Language manifest/locale bundles use a separate service-worker cache. Static validation passed for syntax, JSON, localized contracts, dynamic Piper definitions, cache routing, and diff whitespace.
- Remaining multilingual migration: move every remaining controller/UI string into locale dictionaries, convert the full narration pack to the language-neutral content shape, and perform native-speaker and target-device validation for each added language.
- Multilingual tracking: the active checklist is `TEMP-MULTILINGUAL-ARCHITECTURE.md`; the source of truth is `language-manifest.json`; locale dictionaries live under `locales/`; voice metadata lives in `piper-models.json`. The temporary checklist remains intentionally active until browser/device and native-language release gates are completed.
