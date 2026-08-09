# Chakra Meditation — Technology Stack

This document describes the stack that is actually implemented in this repository. It replaces the earlier Laravel/WebSocket proposal, which did not match the current application shape.

## Current implementation

| Area | Technology | Status / evidence |
|---|---|---|
| Application type | Static, single-page web application | Implemented in `index.html`, `app.js`, and `style.css` |
| Markup | HTML5 | Five primary screens and completion modal in `index.html` |
| Client logic | Plain modern JavaScript (ES classes, async/await) | `AudioEngine`, `VisualEngine`, `MeditationController`, and `WakeLockManager` in `app.js` |
| Styling | Hand-authored CSS with CSS custom properties | `style.css`; no CSS framework or preprocessor |
| Content/configuration | Manifest-driven JSON language packs with backward-compatible localized lookup | `language-manifest.json`, `locales/*.json`, and `scripts.json` |
| Audio | Web Audio API, HTML audio buffers, MP3 assets | Procedural drones/effects plus `audio/*.mp3` in `app.js` |
| Narration | Piper neural TTS in a Web Worker + Web Speech API fallback | Local ONNX/WASM Piper runtime, Malayalam/English voice registry, rolling sentence buffer, and browser voice fallback in `app.js`/`piper-worker.js` |
| Visuals | DOM/CSS animation and Canvas 2D star/particle effects | `VisualEngine` and `#particle-canvas` |
| Persistence | Browser `localStorage` | Preferences, custom scripts, journal entries, and aggregate stats |
| Offline/installability | Service Worker + Web App Manifest | `sw.js` and `manifest.json` |
| Device integration | Screen Wake Lock API and Media Session API where supported | Session lifecycle in `app.js` |
| Backend/API | None | No server routes, database, authentication, or WebSocket layer |
| Dependencies/build | None required | No `package.json`, Composer project, bundler, or test runner is present |

## Runtime architecture

```text
Browser
  ├─ index.html: screen structure and controls
  ├─ style.css: visual system, responsive layout, animations
  ├─ app.js
  │   ├─ state + localStorage preferences
  │   ├─ MeditationController: journey orchestration
  │   ├─ AudioEngine: Web Audio graph and asset playback
  │   ├─ VisualEngine: symbols, aura, particles, progress
  │   └─ WakeLockManager / Media Session integration
  ├─ language-manifest.json: language, locale, content, preview, and browser-voice metadata
  ├─ locales/: localized UI/system strings with fallback resolution
  ├─ scripts.json: current bilingual narration/content pack
  ├─ piper-models.json: versioned local voice registry and model metadata
  ├─ piper-worker.js: isolated Piper model loading and synthesis queue
  ├─ piper/: vendored Piper phonemizer, ONNX Runtime Web, and WASM assets
  ├─ audio/ + symbols/ + presiding-deities/: media assets
  └─ sw.js: cache-first static asset delivery
```

The application is designed to be served from a static HTTP(S) origin. Opening `index.html` directly from `file://` is not a supported runtime because service workers, fetch, and some browser media APIs require an origin. Piper binary paths resolve from the runtime module URL, so static hosts must preserve the `piper/` directory and serve `.wasm` files as binary assets.

## Narration architecture

Piper neural TTS is now implemented as the preferred narration path for registered local voices. Piper ONNX/WASM inference runs in a dedicated Web Worker; the service worker caches the runtime and selected model requests on demand; the existing Web Audio engine plays generated narration alongside background music; and browser `speechSynthesis` remains the fallback. The configured journey interval remains the minimum meditation pause and can extend only when the next Piper segment is not ready. The current registry starts with Malayalam Arjun/Meera and English Lessac; additional languages require a registry entry, compatible model path, license review, and device validation.

Audio quality controls: the Web Audio graph now ends in a conservative master safety limiter after the musical compressor, and the bell path is included in that final protection stage. Piper clips receive restrained per-clip RMS/peak matching and short edge fades before entering the shared voice chain. Background and mantra loops retain crossfades, but their next instances are now scheduled ahead on the AudioContext timeline to reduce mobile timer-jitter gaps. Browser speech synthesis remains outside the Web Audio graph and therefore cannot receive the limiter or Piper normalization.

Journey Tuning also includes a compact, collapsed Voice Tuning section. Clarity and Warmth use voice-only Web Audio filters, Pace applies to the next generated Piper phrase through a bounded `lengthScale` override and maps to browser speech rate for fallback voices, and Soft/Balanced/Clear presets provide approachable starting points. Voice Space uses a short pre-delay into a generated stereo room impulse, filtered and mixed quietly; its user-facing presets are Off, Soft Room, and Temple Air, with Soft Room as the default for new users. Soft Room is approximately 14% wet and Temple Air approximately 20% wet so the effect remains perceptible on mobile without masking narration. This replaces the earlier flat single-delay echo. Voice Preview uses the same selected tuning. Voice model selection remains in Settings because changing a Piper model requires worker/session reinitialization.

Journey type applies an initial narration profile at start: regular guided journeys use Soft voice tuning with Temple Air, while HRIM uses Balanced voice tuning with Soft Room. The profile is persisted as the current starting preference and can still be adjusted from Journey Tuning after the journey begins. Chakra Frequencies/Solfeggio is enabled by default for new users; an existing explicit Off preference is preserved.

Asset audit baseline: `audio/background_music.mp3` and the mantra MP3s are stereo, 44.1 kHz, 192 kbps, approximately 30 seconds long. No lossless master is present in the repository; the existing MP3s were not re-encoded because repeated lossy conversion would reduce quality. A future source replacement should start from WAV/FLAC masters, then normalize and export a delivery asset once the source material is available.

## Multilingual architecture

`language-manifest.json` is the source of truth for supported languages. Each entry defines its language ID, locale, display label, content source, locale dictionary, browser voice prefixes, preview sentence, and preferred Piper voice. `app.js` loads the manifest before settings initialization, populates the language selector from it, resolves UI/system copy through `t(path)`, and resolves content through `localized(...)`. Existing Malayalam/English suffix fields remain supported during migration, while new content should use language-keyed values such as `{ "text": { "hi": "...", "en": "..." } }` or `{ "name": { "hi": "..." } }`. The validator accepts both the current compatibility shape and this language-keyed shape.

Piper model entries now include model and config paths plus phonemizer metadata. The Worker passes the complete registry definition to the runtime, which prefers those paths and retains its built-in voice map only as a compatibility fallback. Adding a new Piper voice should therefore be a registry/content/locale change rather than a runtime source edit. The service worker keeps language bundles in a separate on-demand cache from the app shell and Piper model cache.

Remaining migration work: move all remaining user-visible controller strings into locale dictionaries, convert the full content pack to the language-neutral shape, and validate each language with native speakers and target-device audio tests.

The Lobby exposes a `Returning Journey` preference for selecting the timeless sea/ocean opening. It is persisted independently from `state.stats.journeys`, which remains the completed-journey statistic; when no preference has been saved, the toggle defaults on for users with prior completed journeys.

Display localization is intentionally independent from meditation content: `language-select` controls narration and content, while `display-language-select` controls the visible interface and defaults to English. `t()` resolves UI copy through the display language; `contentT()` resolves system narration/in-session content through the meditation language.

The intention field has a localized prompt, placeholder, and positive default intention in every registered locale. A saved custom intention is preserved; while the generated default is still active, changing Meditation Language switches it to that language’s equivalent so Piper narration receives matching text.

Bath/Yoga extension behavior: `Enable Bath Session` remains the master switch. Optional Perineal Care and Assisted Bathing have independent persisted durations and localized scripts. Perineal Care may precede the standard bath; selecting Assisted Bathing replaces the standard bath, so both add-ons execute as `Perineal Care → Assisted Bathing → Yoga`.

Massage is an additional optional Bath Session add-on with an independent persisted duration. It always runs before Perineal Care and the bathing stage; the full add-on order is `Massage → Perineal Care → Assisted Bathing → Yoga`, with Assisted Bathing replacing the standard Bath Session.

Music Only is a Lobby-level experience mode rather than a Settings option. It opens the existing background-music-only journey with `symbols/background-only.png` and remains mutually exclusive with guided journey selections; the internal `state.bgMusicMode` and `chakra_bg_music_mode` storage key are retained for compatibility with existing users and the runner. Its visible Music Only label follows Display Language, while narration/content remains governed by Meditation Language. Audio Levels remain part of the meditation-room experience and are intentionally separate.

High Energy (HRIM) is also a Lobby-level Experience Mode. It uses a focused flow of icebreaker → HRIM-specific intention → full-system HRIM activation → final silence → closing; Moon Phase and Returning Journey openings are intentionally skipped. Box Breathing, Corpse Pose, Ho'oponopono, the normal seven-chakra sequence, Yoga, Bath, Massage, and Music Only are not run in this mode. HRIM duration is independently configured by `timeHighEnergy`, persisted under `chakra_time_high_energy`, and bounded to 1–30 minutes in production; normal chakra duration remains controlled by `timePerChakra`.

HRIM intention narration is intentionally shorter and uses dedicated `hrimLeadIn`/`hrimSentenceGap` pacing. Browser fallback narration uses a normal-speed profile for this branch; Piper retains its model-native voice character while using the shorter text and reduced inter-sentence gap.

The meditation-room `Journey Tuning` mixer is a full-screen, mobile-safe dialog opened from `btn-mixer`. It owns live Audio Levels, Audio Filters, Eyes Close Mode, Screen Brightness, and Solfeggio frequency controls, while Settings retains only configuration that belongs before the journey. Changes are applied to the active Web Audio graph and synchronized with the persisted Settings checkbox where applicable. `Restart Journey` stops the current controller safely, restores the Lobby Start button, and waits for any pending asynchronous start sequence to release before beginning again. The header close control remains a visible `×` icon with a localized accessible label; a localized text Close action is also available at the bottom.

Journey timing configuration is centralized in [`timing-config.json`](./timing-config.json). It owns stage defaults/ranges, fixed journey transitions, narration pacing/safety buffers, and session-estimate constants. Audio-engine fades, filter ramps, and visual animation timers remain in their playback/visual layers rather than being treated as user journey durations.

## End-to-end testing

Playwright is the browser test runner for the static PWA. The suite lives in [`tests/e2e/settings.spec.js`](./tests/e2e/settings.spec.js) and [`tests/e2e/option-matrix.spec.js`](./tests/e2e/option-matrix.spec.js), and runs through the local static server configured in [`playwright.config.js`](./playwright.config.js). It covers display/content language separation, Settings organization and help, the compact selection-driven Lobby roadmap, the full-screen Journey Tuning mixer and safe restart, Corpse Pose timing synchronization and production bounds, Yoga/Bath/add-on dependencies, production narration-field quality, evening Sleep Mode choice, daytime HRIM gating, normal and HRIM timing persistence, generated-versus-custom HRIM intention behavior, all seven valid bath/add-on combinations, and seven representative global journey-mode combinations, including High Energy and Music Only selected from the Lobby. The suite now contains 28 tests; the mixer test passes in isolation, while the final full-suite rerun was affected by the local static-server process being interrupted after the stale Settings assertion was corrected.

`scripts.json` remains the production narration source. `test-script.json` is a short, fast validation fixture and receives matching additions when a newly introduced script field is needed; it is not a production-content replacement. `docs/dot.json` is a facilitator-custom script, so new schema fields are added there additively only—its existing custom copy is never synchronized with `scripts.json`.

Production chakra narration uses the optional `meditation_en`/`meditation_ml` fields for experiential guidance and expected benefits such as grounding, creativity, confidence, compassion, expression, clarity, and connection. This keeps meditation guidance non-clinical and avoids directing attention to specific organs or implying medical effects. The runtime falls back to the legacy language fields for backward-compatible custom uploads.

HRIM has a local-time safety gate: it is startable only from 03:30 through 11:59, and is blocked from 12:00 noon through 03:29. The gate runs before Sleep Mode selection, audio initialization, and narration. Users can return to the Lobby or continue with regular meditation; normal meditation remains available at all times.

Tests use `?timingProfile=fast-test`, defined in `timing-config.json`, so journey controls use short values without changing production defaults. Production interval selection starts at 10 seconds so the “take a break” narration has enough room; the explicit fast-test profile uses a 2-second minimum, and the interval stage awaits narration completion before advancing. Persisted values are bounded to the active configuration range on load. The profile is selected at runtime by the app and is not enabled unless the query parameter is present. Functional tests block service workers for deterministic behavior; a separate PWA pass should run with service workers allowed to verify caching/offline behavior.

### Migration tracking

- Active checklist: [`TEMP-MULTILINGUAL-ARCHITECTURE.md`](./TEMP-MULTILINGUAL-ARCHITECTURE.md)
- Language source of truth: [`language-manifest.json`](./language-manifest.json)
- Locale dictionaries: [`locales/`](./locales/)
- Narration/model registry: [`piper-models.json`](./piper-models.json)
- Implementation: [`app.js`](./app.js), [`piper-worker.js`](./piper-worker.js), and [`piper/runtime/piper-tts-web.js`](./piper/runtime/piper-tts-web.js)
- Current status: architecture implementation and static validation complete; native-speaker, browser, device, model-license, and full content-pack validation remain release gates.

### Piper language-integration lessons

Every new language/voice must pass these checks before being added to `piper-models.json`:

- Use the exact upstream voice ID and model path. Add the matching model configuration path as well as the `.onnx` path; a model URL alone is insufficient.
- Resolve all local ONNX, phonemizer WASM, and `.data` assets from the runtime module URL (`import.meta.url`). Relative paths can fall through to the app HTML and produce a misleading WebAssembly “expected magic word” error.
- Verify the server response for every `.wasm` asset: it must be binary WASM (`00 61 73 6d`) with an appropriate binary content type, not an HTML fallback. Bump the Piper cache when correcting a bad asset response.
- Do not assume model metadata is uniform. Single-speaker voices may omit or set `speaker_id_map` to `null`; only send `sid` for models with a real speaker map.
- Confirm the model’s phonemizer/espeak language metadata and pronunciation coverage with representative native-language preview sentences, including punctuation and script-specific terms.
- Keep browser fallback voices language-compatible. Never use an English browser voice to narrate Malayalam text, or silently preserve a saved voice after switching content languages.
- Keep the Worker error visible in development logs. User-facing status can remain friendly, but initialization, model-config, phonemizer, decode, and synthesis errors must retain their original cause in the console.
- Keep the model lazy-loaded and verify cold start, warm synthesis, Cache API reuse, offline behavior, cancellation, and device CPU/thermal impact separately for each language.
- Record model provenance, size, quality, license, and upstream identifier. Engine licensing does not automatically cover redistribution of every voice model.

## Product-facing stack decisions

- Keep the first release client-only. This preserves privacy and enables offline meditation without accounts or a network dependency.
- Use the browser’s native audio and speech capabilities instead of adding a media framework. The current app needs careful user-gesture handling because browsers may suspend audio until interaction.
- Keep scripts and media as replaceable static assets. The custom JSON upload/URL path is a runtime extension point, not a backend content-management system.
- Treat `localStorage` as convenience persistence only. It is device-local, synchronous, unencrypted, and not suitable for cross-device history or sensitive personal records.
- Use progressive enhancement for optional APIs. The core journey should remain usable when Wake Lock, Media Session, Canvas, or Malayalam voices are unavailable.
- Do not use Tailwind Play CDN in production. The app remains on local hand-authored CSS to preserve offline behavior, avoid runtime network dependencies, and keep the current animation/audio presentation stable. Tailwind may be reconsidered later only through a build step that emits local static CSS.

## Asset and caching behavior

`sw.js` precaches the application shell, core chakra symbols, and core audio assets. Its fetch handler is cache-first and falls back to the network. The cache is versioned by `CACHE_NAME` and old caches are removed during activation.

The cache list should be kept synchronized with the application. In particular, deity images, yoga pose images, backup audio, and any newly added media are not all currently listed. External Google Fonts also remain network-dependent.

## Deferred technology

The following are intentionally not part of the current implementation:

- Laravel, PHP, PostgreSQL, Redis/Valkey, Workerman, OpenSwoole, queues, and WebSockets
- TypeScript, Tailwind CSS, React/Vue, and a frontend build pipeline
- Accounts, authentication, server-side journals, cloud sync, analytics, and remote content management

These may become appropriate if the product later needs multi-device sync, protected content, social features, server-managed scripts, or operational reporting. They should not be introduced until that product requirement exists.

## Quality and security baseline

The repository now includes a Playwright suite under `tests/e2e/` with a local static `webServer`; `timing-config.json` supports the explicit `fast-test` profile so long narration and interval flows can be exercised quickly without changing production defaults. Current narration regression coverage checks both English and Malayalam production sections for organ/gland/blood/cell/disease-directed claims.

Before a release, validate:

- JSON parsing for `scripts.json` and custom script uploads
- Required DOM IDs and media paths
- A real HTTP(S) runtime, service-worker registration, offline reload, and cache update behavior
- Audio start/resume/stop, pause/resume, timer cleanup, and completion paths on mobile browsers
- Safe handling of remote custom-script URLs, including CORS failure and untrusted content
- Journal/privacy expectations, since entries are stored in browser storage without encryption
- No secrets in the static bundle; the app currently has no server secrets

## Narration content policy

- Production guided meditation copy in `scripts.json` should describe felt experience and practical outcomes—grounding, calm, emotional release, confidence, compassion, clarity, renewal, and purposeful action—without claiming to treat or directly change organs, glands, blood, cells, hormones, disease, or other medical conditions.
- Keep English and Malayalam fields aligned in meaning and intent. Run the bilingual Playwright narration regression after editing `en`, `ml`, `meditation_en`, or `meditation_ml` fields.
- Keep canonical mantra keys stable for UI/audio lookup (`LAM`, `VAM`, `RAM`, `YAM`, `HAM`, `OM`, `AUM`, `HRIM`), while using contextual spoken forms in narration. The English HRIM pronunciation is written as `Hreem mantra`; Malayalam uses `ഹ്രീം`. This avoids asking English Piper to infer the short `hrim` spelling while preserving the established `HRIM` journey identifier and `HREEM.mp3` asset.
- Piper narration is sentence-queued with an explicit lead-in and sentence gap. `piperTTS.setPaused(true)` stops queue advancement while the AudioContext suspension holds the current clip; `piperTTS.cancel()` stops the active source, rejects queued synthesis, and terminates the Worker for journey stop/restart. Voice volume is a live Web Audio gain, and zero is a valid persisted mute value.
- `docs/dot.json` is a custom facilitator script and is intentionally not synchronized with the production bundle. Review it separately before promoting any of its content into runtime narration.

For this client-only release, the main security boundary is untrusted browser/user content and remote custom script input. If a backend is added, authentication, authorization, storage, rate limiting, and a formal threat model must be designed at that point.

## Recommended delivery profile

Use any static host that serves the files over HTTPS with correct MIME types and SPA-safe asset paths. A lightweight local server is sufficient for development. No container, database, worker, or reverse proxy is required by the current codebase.

## Source of truth

- Product intent and implemented feature history: [`plan.md`](./plan.md), [`Phase.md`](./Phase.md)
- User flow and reverse-engineered architecture: [`INITIAL-HANDOFF.md`](./INITIAL-HANDOFF.md)
- Runtime implementation: [`index.html`](./index.html), [`app.js`](./app.js), [`style.css`](./style.css), [`sw.js`](./sw.js)
- Narration content: [`scripts.json`](./scripts.json)
- Consultation planning (not yet implemented): [`TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md`](./TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md). The first release is single-participant and must hydrate a versioned session plan before entering the existing Lobby.
