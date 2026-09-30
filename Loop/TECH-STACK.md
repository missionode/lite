# Lite technology stack

This is the implementation profile of the Lite meditation PWA in this repository. Confirm changes against the source; proposed architecture belongs in the [fix queue](../docs/app-map/FIX-QUEUE.md). See [browser communication](./communication-architecture.md) for data and worker boundaries.

## Application profile

| Area | Current implementation | Source |
| --- | --- | --- |
| Interface | Static HTML, handwritten CSS and browser JavaScript; no application framework or compilation step | `index.html`, `style.css`, `app.js` |
| Module boundaries | Browser modules expose focused APIs; the controller coordinates them. Selected practices load through a deduplicating classic-script loader | `modules/`, `modules/practice-module-loader.js` |
| Journeys | Local routing, stage sequencing, pause, skip, stop and session timing | `modules/journey-routing.js`, `modules/journey-item-skip.js`, `modules/session-countdown.js` |
| Audio | Web Audio API and media elements; separate narration, music, mantra and generated-tone lifecycles | `modules/audio-*.js`, `modules/media-lifecycle.js` |
| Narration | Piper ONNX/WASM inference in a dedicated Web Worker, with browser Web Speech fallback | `modules/piper-lifecycle.js`, `piper-worker.js`, `piper/runtime/`, `piper/ort/` |
| Content and languages | Local JSON scripts, UI dictionaries, timing and voice manifests; English, Malayalam, Hindi, Russian and Tamil | `scripts.json`, `language-manifest.json`, `locales/`, `timing-config.json`, `piper-models.json` |
| Visuals and sky | CSS, canvas and supported WebGL effects; vendored Astronomy Engine and local star data | `night-sky.js`, `sky-astronomy.js`, `celestial-presence.js`, `vendor/astronomy.browser.min.js` |
| Local state | In-memory journey state; browser local/session storage for selected settings and assessment state | `modules/app-state.js`, `modules/assessment-persistence.js`, `modules/settings-backup.js` |
| Offline delivery | Service-worker Cache Storage for the shell and assets; Piper also uses browser origin-private file storage for downloaded models | `sw.js`, `manifest.json`, `piper/runtime/piper-tts-web.js` |
| Supporting pages | Static assessment and repertory pages with local JavaScript and JSON data | `docs/assesment.html`, `docs/repertory.html`, `data/` |
| Hosting | Static GitHub Pages delivery; the production branch is the release target | Git remote/branch configuration; verify deployment state for each release |
| Development tools | Node.js for tests and atlas generation, Python for local HTTP preview and Loop routing | `package.json`, `package-lock.json`, `playwright.config.js`, `Loop/scripts/` |
| Browser tests | Playwright, explicitly requested per the project workflow | `tests/e2e/`, `playwright.config.js` |

There is no application backend, server database, broker, server worker pool or server authentication service in this profile. Advanced Features is a client-side feature gate; it does not protect server resources.

## Network dependencies and offline limits

The app reads its own scripts, JSON and media over HTTP(S). External requests include first-use voice-model downloads, Google Fonts, the assessment page's Google Translate widget, and user-selected remote script/audio sources. These are separate dependencies with separate failure paths.

Local Piper synthesis and native browser speech are different paths. Browser speech availability and processing depend on the browser/voice provider. An installed PWA does not guarantee that every voice, optional media file, remote source or translation service is available offline.

Service-worker precaching downloads bytes without executing an optional module. Measure loading changes before claiming startup, memory, battery or thermal gains. Preserve selection-based loading, retry handling and cleanup.

## Development and verification

From the Lite project root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. Use HTTP preview for workers, fetch and service-worker behavior; a `file://` page is not an equivalent test. Stop the preview with Ctrl+C when finished. No application build step or database startup is required.

Use the relevant existing `npm run test:...` commands listed in `package.json`. The broad non-browser suite is `node --test tests/*.test.mjs`; atlas generation is `node docs/app-map/build-atlas.mjs`. Browser checks use `npm run test:e2e` only when requested. The current Playwright profile blocks service workers, so offline/PWA-update coverage needs its own suitable run.

Keep dependency versions in their manifests and vendored asset metadata. Do not require a particular developer machine or add dependencies based on an example stack. Node/Python are development tools, not deployed application servers.

## Project boundaries

- Preserve the sky, audio, localization, accessibility and performance requirements in [AGENTS.md](../AGENTS.md).
- Keep implemented behavior and planned changes distinct in the atlas and handoff.
- Consent capture remains postponed until renewed owner approval. A later backend or authentication design needs its own requirement and review.
- `docs/dot.json` was intentionally removed by the owner. Do not copy an external version into Lite to satisfy legacy tests; record stale test dependencies accurately.
- Keep Loop documents and handoff files out of runtime precache lists. Verify actual hosting exposure before claiming internal documentation is private.
