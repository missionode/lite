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

## Multilingual architecture

`language-manifest.json` is the source of truth for supported languages. Each entry defines its language ID, locale, display label, content source, locale dictionary, browser voice prefixes, preview sentence, and preferred Piper voice. `app.js` loads the manifest before settings initialization, populates the language selector from it, resolves UI/system copy through `t(path)`, and resolves content through `localized(...)`. Existing Malayalam/English suffix fields remain supported during migration, while new content should use language-keyed values such as `{ "text": { "hi": "...", "en": "..." } }` or `{ "name": { "hi": "..." } }`. The validator accepts both the current compatibility shape and this language-keyed shape.

Piper model entries now include model and config paths plus phonemizer metadata. The Worker passes the complete registry definition to the runtime, which prefers those paths and retains its built-in voice map only as a compatibility fallback. Adding a new Piper voice should therefore be a registry/content/locale change rather than a runtime source edit. The service worker keeps language bundles in a separate on-demand cache from the app shell and Piper model cache.

Remaining migration work: move all remaining user-visible controller strings into locale dictionaries, convert the full content pack to the language-neutral shape, and validate each language with native speakers and target-device audio tests.

The Lobby exposes a `Returning Journey` preference for selecting the timeless sea/ocean opening. It is persisted independently from `state.stats.journeys`, which remains the completed-journey statistic; when no preference has been saved, the toggle defaults on for users with prior completed journeys.

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

Current validation is primarily static/manual because no automated test harness is present. Before a release, validate:

- JSON parsing for `scripts.json` and custom script uploads
- Required DOM IDs and media paths
- A real HTTP(S) runtime, service-worker registration, offline reload, and cache update behavior
- Audio start/resume/stop, pause/resume, timer cleanup, and completion paths on mobile browsers
- Safe handling of remote custom-script URLs, including CORS failure and untrusted content
- Journal/privacy expectations, since entries are stored in browser storage without encryption
- No secrets in the static bundle; the app currently has no server secrets

For this client-only release, the main security boundary is untrusted browser/user content and remote custom script input. If a backend is added, authentication, authorization, storage, rate limiting, and a formal threat model must be designed at that point.

## Recommended delivery profile

Use any static host that serves the files over HTTPS with correct MIME types and SPA-safe asset paths. A lightweight local server is sufficient for development. No container, database, worker, or reverse proxy is required by the current codebase.

## Source of truth

- Product intent and implemented feature history: [`plan.md`](./plan.md), [`Phase.md`](./Phase.md)
- User flow and reverse-engineered architecture: [`INITIAL-HANDOFF.md`](./INITIAL-HANDOFF.md)
- Runtime implementation: [`index.html`](./index.html), [`app.js`](./app.js), [`style.css`](./style.css), [`sw.js`](./sw.js)
- Narration content: [`scripts.json`](./scripts.json)
