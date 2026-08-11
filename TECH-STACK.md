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

The consent confirmation script is a bounded, independently scrollable region. It supports touch panning, mouse-wheel scrolling, and keyboard focus so long declarations remain reachable without expanding or clipping the surrounding confirmation actions.

The client-facing declaration states the consent date without a clock time. Precise recording timestamps remain separate evidence metadata and are not part of the words the client must read aloud.

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

Playwright is the browser test runner for the static PWA. The suite lives in [`tests/e2e/settings.spec.js`](./tests/e2e/settings.spec.js) and [`tests/e2e/option-matrix.spec.js`](./tests/e2e/option-matrix.spec.js), and runs through the local static server configured in [`playwright.config.js`](./playwright.config.js). It covers display/content language separation, Settings organization and help, the compact selection-driven Lobby roadmap, the full-screen Journey Tuning mixer and safe restart, Corpse Pose timing synchronization and production bounds, Yoga/Bath/add-on dependencies, production narration-field quality, evening Sleep Mode choice, daytime HRIM gating, normal and HRIM timing persistence, generated-versus-custom HRIM intention behavior, all seven valid bath/add-on combinations, and seven representative global journey-mode combinations, including High Energy and Music Only selected from the Lobby. The suite currently contains 33 tests; the complete run on 2026-08-09 passed 33/33 with `?timingProfile=fast-test`.

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

## Consultation safety routing

The single-participant consultation is implemented as a local, versioned plan flowing through `intake → Guide Review → consent/manual route → Lobby`. Guide Review is the safety decision point:

- Movement/body-position sensitivity removes Yoga, Savasana, Bath, Massage, Perineal Care, and Assisted Bathing before a guided plan proceeds.
- Imagery sensitivity advises neutral, present-focused guidance.
- Audio/voice or wording sensitivity requires `Manual Guide Only`; the plan is stored as `manual-guide-required` and the guided app-audio CTA is blocked.
- Safety Review acknowledgment and Manual Guide Only acknowledgment are separate gates and are both required when applicable.
- Injury/back limitation immediately forces Yoga Bridge to `No`, disables the Yoga selector, and hides/clears Yoga poses. Medication/private medication remains selectable but is highlighted in Guide Review. Pregnancy/possible pregnancy keeps Yoga Bridge and remaining care/timing options available while hiding/clearing Yoga poses; Recent childbirth is a separate answer and keeps Yoga poses available, subject to Guide Review. The guide-review requirement remains enforced.
- When medication is disclosed, the consent prompter states that the client is taking prescribed medication and will not stop, start, or change it because of the session without consulting the prescribing clinician. The statement is localized for English and Malayalam and does not include private medication details.
- Consultation approval refreshes the Lobby estimate through the published runtime estimator, avoiding a scope error when returning from consent recording.
- Consultation plans now capture Meditation Language and approval deterministically hydrates language, selected chakras, Yoga poses (including an intentional empty list), and Savasana without stale Settings fallback.
- Consultation reveals long-term, non-medical chakra reflection questions for selected focus areas. Each answer, explicit attention preference, and optional private guide note is retained for context, while timing is assigned independently per active chakra: Balanced/Prefer not to answer keeps the Core duration, Some additional support adds one minute, and More attention adds two minutes, always capped at seven minutes. There is no shared chakra-time budget and no diagnosis or “blocked/weak chakra” inference.
- Consultation entry is intentionally located in Settings rather than Lobby; Lobby remains dedicated to experience selection and starting the journey.
- Each selected focus chakra presents three separately answered reflective questions plus an explicit attention preference and optional guide note. Stored `answers` support rapport and context; the explicit attention preference controls that chakra's independent timing without changing which chakras are active in the journey.
- Guide Review now renders the complete collected plan in sections: profile/goal/language/voice, experience/readiness, chakra answers and notes with calculated minutes, Yoga/Care selections and durations, Savasana, emergency contact, safety answers/details, sensitivities, and guide advice. The review is the source used for final approval.
- Consultation profile now includes required Citizenship, Contact Number, and Email Address fields. They are stored and shown to the guide in Review but are intentionally excluded from the spoken consent prompt. Consent recording controls have explicit high-contrast light-theme button styling.
- Guide Review now highlights every flagged safety row, including private responses, and provides persistent guide notes for decisions, adaptations, and follow-up. Notes are stored on `sessionPlan.guideReview` and remain outside the spoken consent prompt. Focused Playwright validation passed 1/1.
- Manual Guide Only reviews expose separate `Print / Save as PDF`, `Save Manual Plan`, and `Return to Lobby` actions. The A4 document uses print CSS, standard margins, a sans-serif font stack, restrained printer-safe colors, clear header/status styling, and guide prompts/notes. The browser’s print dialog provides the standard PDF output path.
- The manual plan is reusable through the local versioned session plan: the guide can print it repeatedly before leaving the review, and saving no longer implicitly redirects or downloads a separate image.
- The print window is opened without `noopener,noreferrer` so the app can populate it before invoking the native print dialog; manual CTA colors are explicit for visibility on the light review surface.
- Printing now uses a hidden same-page iframe, eliminating the temporary popup/`about:blank` artifact. Chakra reflection summaries are question-by-question with explicit answer and guide-note labels in both review and print output.
- Print invocation is idempotent through a one-shot guard; the detailed review summary has an explicit mobile inset so same-level contents do not touch the card edge.
- Review action buttons use an isolated local stacking context and explicit pointer/touch interaction so decorative layers cannot intercept clicks.
- The app shell, consultation screen, and cards use `min-width: 0`, bounded widths, and horizontal overflow containment; the consultation review test asserts document/app width does not exceed the viewport.

This is a product safety control, not medical clearance. The guide retains final responsibility for suitability, adaptation, and whether to conduct a session in person. The behavior is covered by the focused Playwright Guide Review test.

## Consultation audit status — 2026-08-09

The single-participant consultation implementation is complete for the current local-PWA scope. It includes the Settings entry point, required identity/contact fields, bilingual intake, detailed Guide Review, consent prompter states, safety routing, adaptive chakra reflections/timing, Yoga and care dependencies, voice preference, Sleep/Savasana behavior, and Lobby hydration. The reconciliation file [`TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md`](./TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md) now contains only open production and test gaps.

Open boundaries are authenticated/server-side video sharing, retention/deletion/audit infrastructure, real-device MediaRecorder validation, full Cartesian combination reporting, native-speaker/device validation, and future couple support. The current repository Playwright suite validates UI/state behavior but cannot establish production security or real hardware recording quality.

## Full-width action spacing

Full-width action buttons use a consistent 10px inline margin and calculated width reduction for mobile edge spacing across Lobby, consultation, consent, Sleep Mode, and HRIM action groups.

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
- Consultation architecture and implementation notes: [`TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md`](./TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md). The current release is single-participant and hydrates a versioned session plan before entering the existing Lobby.
## Consultation contact validation

- The consultation uses a required country select with dial-code metadata instead of free-text citizenship.
- The selected prefix is editable and user-edited phone values are not overwritten.
- Email and client phone are required; emergency phone is optional and validated when entered.
- The consultation form/card has a 10px mobile-safe horizontal inset.

## Reverse Journey consultation routing

- Consultation collects a non-diagnostic grounding/reconnection preference as preferences.reverseJourneyNeed.
- reconnect and private answers create a Guide Review recommendation; only the explicit review-reverse-journey approval checkbox writes approvedSettings.reverseJourney.
- Approval hydrates the existing state.reverseJourney and chakra_reverse_journey setting. The feature does not infer a diagnosis or auto-enable the journey.

## Consent video composition

- The browser records a canvas composition rather than the raw camera stream. The canvas presents a session-plan pre-roll, then the consent prompt, live start/timecode/location metadata, and a circular lower-right camera thumbnail.
- MediaRecorder uses WebM VP8/Opus at a bounded video/audio bitrate and emits periodic chunks. A final client-side guard rejects files at or above Gmail's 25 MB attachment limit.
- Start/end timestamps and permission-based location are persisted on the local consultation plan. Location denial is represented as unavailable.
- The source microphone is routed through a Web Audio gain gate: plan pages remain silent, then audio opens at the consent-prompt transition where the circular face thumbnail also appears.
- Consent start time and live wall-clock time are initialized at that same prompt/audio/thumbnail transition; the silent plan pre-roll displays no active consent timer.
- The composed overlay shows Start date/time, live local wall-clock time, and location; the stop action holds an end-time frame for 500 ms before finalizing the MediaRecorder blob.
- Plan pages are built from the same detailed review summary used by the printable plan, normalized into readable label/value rows, pixel-wrapped, paginated, and rendered inside a clipped safe-area rectangle. Prompt text reserves space for the face thumbnail.
- Consent narration derives a localized service summary from the approved plan, including only selected Yoga, Bath, Massage, Perineal Care, Assisted Bathing, and Savasana stages with durations where applicable.
- Guide Review always exposes the A4 Print / Save as PDF action. The generated document uses a branded logo header and distinguishes normal Guide Review copies from Manual Guide Only copies; manual save/return actions remain conditional.
- Both print variants omit the visible Session Plan title, generated date, and app-generated footer/URL text. Browser-native print headers and footers remain controlled by the browser print dialog.
- The uploaded logo is used in Settings, Lobby, Consultation, Guide Review, Consent Confirmation, completion modal, printable plan header, favicon, and PWA manifest icons. It is intentionally not used on the Splash screen or overlaid on top of the chakra symbol.
- The active Chakra Meditation screen now includes a dedicated 100×100px logo with 20px bottom spacing; the Settings header uses a 72×72px logo with 12px title spacing.
- Lobby branding uses a dedicated 64×64px logo treatment with 8px spacing before the room heading.
- Visual QA checkpoint (2026-08-10): temporary Playwright screenshots covered desktop 1440×900, tablet 1024×768, and mobile 390×844 for Settings, Lobby, Consultation, and Guide Review; all 3 scenarios passed and no horizontal overflow was detected. Findings are non-blocking: desktop Lobby CTA sits near the viewport edge, Guide Review is intentionally narrow on desktop, long mobile values are dense, and the dark hero art is visually dense on narrow Settings screens.
- Visual QA follow-ups are implemented in `style.css`: the Lobby action stack has additional bottom breathing room, desktop Guide Review uses an 820px app measure/760px content measure, mobile review rows stack label and value for scanning, and Settings reduces nebula contrast on narrow screens. Stylesheet query is `style.css?v=1.58`.
- Print plans continue to generate the branded logo header for both standard and Manual Guide Only A4 documents. Fixed the Settings consultation-entry button’s nested mobile overflow by accounting for its 10px side margins; the 390px Playwright inspection reports no overflow offenders. Stylesheet query is now `style.css?v=1.59`.
- Print invocation clears the document and iframe titles before printing to avoid an app-supplied title in browser print headers. Date/time and other browser-native headers are outside page content and require disabling “Headers and footers” in the print dialog. Stylesheet query is now `style.css?v=1.60`.
- Both `GUIDE REVIEW COPY` and `MANUAL GUIDE ONLY` variants share this title-clearing renderer and are covered by explicit empty-title print assertions.
- Consent video composition now preloads and draws the shared branded logo at 96×96px in the upper-right header-safe area across plan pre-roll and live consent-prompt frames. It does not overlap the lower-right circular face thumbnail. App script is `app.js?v=1.71`; shell cache is `chakra-v5.31`.
- Consent content now covers the touch/assistance decision as well as every selected service and medication statement. The live prompt is a bounded scroll layer on the page, while the recorded canvas wraps text and reduces prompt typography from 27px to 18px when needed to avoid clipping. English/Malayalam touch consent keys and a Playwright assertion are included. App script is `app.js?v=1.72`; stylesheet is `style.css?v=1.61`; shell cache is `chakra-v5.32`.
- Consent plan slides and A4 print plans now distinguish information hierarchy with diamond section markers, labeled value cards/rows, stronger values, restrained alternating surfaces, and extra spacing. Canvas pages are limited to four source lines per slide; prompt text still fits down to 18px. App script is `app.js?v=1.73`; stylesheet is `style.css?v=1.62`; shell cache is `chakra-v5.33`.
- Consent recording UX now has two modes: pre-recording shows the complete script and a live camera preview; recording hides manual scrollbars and auto-scrolls the prompt at a gentle pace, with the same scroll ratio rendered into the canvas video. Compact icon-led controls support record, pause/resume, stop, retry, submit, and cancel. App script is `app.js?v=1.74`; stylesheet is `style.css?v=1.63`; shell cache is `chakra-v5.34`.
- Consent presentation is now explicitly staged: review first, then selfie teleprompter recording. The prompt DOM is moved into the recording overlay rather than duplicated, preserving one source of truth for text and scroll position. The user can adjust 8–24 px/sec before recording; 14 px/sec is the default.
- The live teleprompter uses a full app-viewport camera surface with a translucent scrolling script panel and icon-only camera controls. The confirmation stage places its circular camera thumbnail above a bounded, manually scrollable script while preserving inline Continue/Cancel actions.
- The generated video contract is plan-first and consent-last. MediaRecorder starts with five-second silent session-plan canvas pages, then a transition/countdown, then the spoken consent. Microphone gain and the consent timer begin only at the consent transition; teleprompter motion waits another three seconds so the client can read the initially visible lines.
- Video plan pages use an explicit client-facing allowlist sourced from the approved plan. They include the client name, goal, focus, language, approved services/settings, and relevant durations while excluding contact/email, emergency contact, medication details, private reflection notes, and guide notes.
- The saved spoken-consent section uses the script as the primary canvas surface with a circular face thumbnail, voice, consent timer, logo, and reading-speed label. The live recording screen remains full camera; the exported evidence layout is intentionally document-led.
- Stop transitions to Review Recording, which labels and plays the complete sequence (silent plan pages → spoken consent) before Retry or Accept.
- Consent export now deliberately ignores browser orientation and always records a standard `1280×720` landscape canvas. Session-plan pages use Material-inspired elevated cards and progress/navigation framing; the spoken section uses a minimal evidence layout with only a synchronized three-line excerpt rather than the complete teleprompter panel.
- Review Recording owns Retry/Accept visibility explicitly and keeps both actions directly below the 16:9 player in a compact mobile-safe action surface. App script is `app.js?v=1.77`; stylesheet is `style.css?v=1.66`; shell cache is `chakra-v5.37`.
- Consent capture now separates silent plan generation from spoken recording with a manual second Record action and no countdown. Confirmation fits the complete script without an internal scrollbar; production auto-scroll waits seven seconds. Exported plan, waiting, and spoken frames share an ivory-and-gold luxury document system, and spoken evidence exposes both elapsed and live local time. App script is `app.js?v=1.78`; stylesheet is `style.css?v=1.67`; shell cache is `chakra-v5.38`.
- Consent composition v3 adds recorded client-verification pages with contact/email/citizenship/emergency contact and full English/Malayalam names. Detailed poses/timings remain visual plan data, while verbal consent uses professional service categories only and declares the recording timestamp plus permission-derived coordinates. App script is `app.js?v=1.79`; shell cache is `chakra-v5.39`.
- Recorded-plan presentation now maps every internal field and stored choice to a contextual, localized document heading and readable value. Two-line canvas label wrapping protects longer English/Malayalam phrases; app script is `app.js?v=1.80` and shell cache is `chakra-v5.40`.
- Review Recording uses Web Share API file sharing to hand the in-memory WebM, localized title, and covering message to the device-native share sheet. It does not choose recipients, send automatically, upload, or persist the file. The spoken declaration omits coordinates while internal evidence retains them; confirmation is a bounded manual-scroll document with centered primary action. App script is `app.js?v=1.81`, stylesheet is `style.css?v=1.68`, and shell cache is `chakra-v5.41`.
- Playwright screenshot capture is opt-in through `PLAYWRIGHT_SCREENSHOTS=1`; ordinary functional and regression runs do not create screenshots.
- A consent-recorded consultation locks the Meditation Room Core Practice Duration and exposes the active client's individual chakra timings plus their exact chakra-practice total. `activeChakras` preserves the Settings selection (normally all seven); `chakraFocus` customizes timing only. The displayed session estimate sums the active individual timings. `End Consultation and Reset Session` clears client plan/consent data and in-memory recording, restores standard session defaults, and re-enables the five-minute Core timer. Individual durations are generated independently and capped at seven minutes. App script is `app.js?v=1.82`, stylesheet is `style.css?v=1.69`, and shell cache is `chakra-v5.42`.
- This remains a local prototype: authenticated storage, email delivery, retention/deletion, and real-device codec/media validation are not implemented.
