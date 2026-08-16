# Chakra Meditation — Active Handoff

## START

- Current objective: preserve the stable `production` branch while implementing and reviewing the isolated Sleep Mode experience on `sleep-experience-mode`.
- Target root: `/Users/lekshmisyam/Desktop/Ikigai/lite`.
- Reusable instructions root: this same repository; `loop.md` is the protected collaboration policy and must not be changed during routine application work.
- Stack: static HTML/CSS/JavaScript PWA with Web Audio, Piper/Web Speech narration, local JSON content, service-worker caching, and npm-based test tooling. There is no backend, database, authentication layer, or production build step.
- Permanent constraints: preserve existing journey order unless explicitly changed; keep `docs/dot.json` as custom facilitator content; add only missing schema fields to fixtures; commit each feature/fix with a detailed reference message; do not run Playwright or take screenshots unless the owner explicitly requests it.
- External actions remain approval-gated: do not merge, push, deploy, or rewrite branch history unless the owner asks.

## MID

- Stable production baseline: local and remote `production` are aligned at `71ecda1` (`merge: deliver aura journey and assessment theming`).
- Delivered product shape: bilingual English/Malayalam guided journeys; seven-chakra customization; HRIM, Sleep, Music Only, Yoga/Bath/care extensions; Piper narration with browser fallback; trauma-aware wellness boundaries; assessment handoff; and a user-activated, `Source=Lite`-only Earn link after completion.
- Runtime content source is `scripts.json`. `test-script.json` is a short schema fixture. `docs/dot.json` is independently authored facilitator content and is not synchronized from production wording.
- HRIM is a separate energizing/recharge experience with no local-time restriction; it is not an eighth chakra. Its script-defined drone centre is 528 Hz.
- Chakra frequencies follow the widely used modern Solfeggio mapping in this product; they must not be represented as measured anatomy, clinical treatment, or a canonical fixed-Hz rule from classical yogic texts.

## NOW

### Active snapshot — 2026-08-16 (Asia/Kolkata)

- Branch: `sleep-experience-mode`; it is based on the verified production merge `8cf1260` and contains the current Sleep Mode implementation as uncommitted work pending review and commit.
- `b7563b7` (`feat(audio): add progressive drone duration modes`) adds Beginner 20%, Intermediate 50%, Advanced 70%, and Expert 100%, with Beginner as the persisted default and a pause-aware fade-start timer beginning before narration.
- `99bc581` removes octave reduction from the main oscillator. With Chakra Frequencies enabled, production centre pitches are Root 396, Sacral 417, Solar 528, Heart 639, Throat 741, Third Eye 852, Crown 963, and HRIM 528 Hz. Frequencies Off and malformed input intentionally retain the 110 Hz fallback.
- `fc243a1` keeps Beginner as the normal chakra default but gives HRIM a separate persisted duration preference. HRIM normalizes missing, invalid, or Beginner values to Intermediate (50%); Advanced and Expert remain available. The HRIM Beginner radio is disabled and the active setting is explained in English and Malayalam.
- The former half-frequency lower oscillator is gone. Independent support remains: a slow 0.04 Hz LFO modulates the main pitch by approximately ±0.1%, Eyes Close may add a 40 Hz anchor plus 80/82 Hz binaural pair, elemental noise remains, and Yoga retains 136.1 Hz.
- Delivery versions: `style.css?v=1.55`, `app.js?v=1.66`, shell cache `chakra-v5.29`, Piper cache `chakra-piper-v3`, and language cache `chakra-language-v4`.
- Validation at the latest implementation checkpoint: `unit/static` PASS — JavaScript syntax, service-worker syntax, exact-frequency/drone-duration contract, zero-volume audio contract, bilingual content-safety contract, assessment contract, Earn handoff contract, HRIM time-window contract, JSON parsing, and diff whitespace. No Playwright or screenshots were used.
- Owner clarification implemented: HRIM is for energizing/recharge, so Beginner is disabled for HRIM and Intermediate is the default. HRIM remains a timed path using its independent `timeHighEnergy` duration; uninterrupted full-stage drone behavior is not part of this approved change.
- Additional HRIM audio observations remain unimplemented: `high_energy` currently resolves to elemental index `-1` and therefore receives the fallback bright high-pass texture; the stage named final silence stops the drone but leaves quiet background music running.
- Sleep Mode now has five sequential, sleep-inspired binaural targets (10, 6, 5, 2, and 6 Hz), one shared stage duration capped at 10 minutes, continuous background music, and separate persisted drone-duration mode defaulting to Intermediate. It is mutually exclusive with HRIM, Music Only, and normal guided options.
- Sleep targets are explicitly sound-design guidance rather than biological sleep-stage guarantees. The audible carrier remains 80 Hz; Delta 2 Hz is represented as a stereo beat difference rather than an inaudible main oscillator.
- Experience Mode selections (Music Only, HRIM, and Sleep Mode) are session-only. They are reset on load and their legacy selection keys are removed from local storage; timing and drone-duration preferences remain persisted.
- The former HRIM 03:30–18:00 gate and block modal are removed. HRIM can now be selected at any local time.
- Validation for the current work: `static/unit` PASS — JavaScript syntax, JSON parsing, drone-duration/Sleep Mode contract, content safety, zero-volume audio safety, and diff whitespace. No Playwright or screenshots were used.
- Next exact step: review the diff, commit the Sleep Mode feature with a detailed message, and perform real-device listening before any production merge or push.
- Progress: **95% complete** for the isolated Sleep Mode implementation | Confidence: medium | Current phase: static validation and review | Main remaining scope: device audio/UX validation.

### Historical context retained for reference

- Implemented grouped Yoga preparation, per-pose, pose-selection, Bath toggle, and Bath duration controls under Yoga Bridge.
- Added visible copy explaining `Bath → Yoga → Crown` order.
- Bath duration now appears only when Yoga Bridge and Bath Session are enabled.
- Session estimates include Yoga only when enabled and Bath only when its toggle is enabled.
- Bath minimum duration is now 60 seconds for a practical short test while retaining an 1,800-second maximum.
- Validation: `static` evidence level — syntax, JSON, DOM ID uniqueness, local asset references, and diff whitespace checks passed.
- Browser/manual visual validation remains open because it was not required for this checkpoint.
- Implemented a mobile UI pass for Settings and Lobby: scroll-safe settings layout, short-screen lobby layout, safe-area spacing, larger touch targets, mobile-friendly sliders, responsive buttons, compact headings, and viewport-safe mixer/controls.
- Normalized vertical spacing for Audio Levels, Journey Timings, Yoga Timing, and Bath Duration using shared settings-panel and settings-mixer rules instead of repeated inline section spacing.
- Redesigned all range controls for mobile: full-width sliders with 44px touch targets, a centered outlined current-value pill, visible minimum/maximum values, and tappable decrement/increment buttons that clamp to the configured bounds. Removed the `.settings-mixer` 300px max-width so audio and timing controls use the full settings-panel width.
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
- Added a timeless returning-visitor opening in English and Malayalam. The opening can be selected from the Lobby; when no preference has been saved, first-time users receive the moon-phase opening and users with completed journeys receive the sea-and-tide image.
- Added a Lobby-level `Returning Journey` option. It controls whether the current session uses that timeless returning opening; `state.stats.journeys` remains the historical completed-journey counter. Existing users with completed journeys default to the option once, while explicit changes persist in `chakra_returning_journey`.
- Expanded locale coverage for the Settings, Lobby, completion modal, mixer, journey timings, yoga/bath controls, placeholders, and runtime labels. Static HTML labels now use `data-i18n`, while checkbox labels and session-only text are translated through `applyLocaleUI()` and `t()`.
- Separated display localization from meditation content language: `language-select` controls narration/content, while `display-language-select` controls visible interface text and defaults to English. Content/system narration uses `contentT()` so a facilitator can show English UI while guiding in the selected meditation language. The main `Chakra Meditation` heading and document title now follow the display language.
- Bumped the app script and service-worker shell cache versions to deliver the separated localization behavior to existing PWA users instead of serving the previous cached `app.js?v=1.51` implementation.
- Fixed Yoga Bridge dependency handling: Bath Session is cleared and disabled when Yoga Bridge is off, persisted bath state is ignored unless Yoga Bridge is enabled, and the session estimate only counts bath time when both options are active. The journey execution path already required Yoga Bridge before running Bath.
- Added optional Bath Session add-ons: Perineal Care and Assisted Bathing, each with independent timing and English/Malayalam scripts. The master Bath Session remains unchanged when no add-on is selected; Perineal Care can precede the standard Bath Session, while Assisted Bathing replaces it. With both selected, the order is `Perineal Care → Assisted Bathing → Yoga`.
- Added optional Massage before the bathing stages, with its own persisted duration and localized English/Malayalam script. The complete add-on order is `Massage → Perineal Care → Assisted Bathing → Yoga`; when Assisted Bathing is not selected, the standard Bath Session remains in its place.
- Decoupled Music Only from Settings into a Lobby-level Experience Mode. Settings now remains focused on guided-meditation configuration, while Music Only keeps the existing background-music runner and `state.bgMusicMode`/`chakra_bg_music_mode` persistence for compatibility. It is mutually exclusive with guided journey selections, and Audio Levels remain separate in the meditation room.
- Music Only now uses `symbols/background-only.png` instead of the Root Chakra symbol. Its visible mantra follows the selected Display Language independently of the meditation/narration language.
- The intention prompt, placeholder, and positive default are now locale-backed. The default follows Meditation Language and only changes when the user has not entered a custom intention.
- Moved High Energy (HRIM) into Lobby Experience Mode beside Music Only. HRIM now has an independent persisted `timeHighEnergy` duration with a production range of 1–30 minutes and a fast-test range of 0.1–1 minute; normal `timePerChakra` timing remains unchanged.
- HRIM now uses localized activation-specific intention framing with the user’s custom intention, then runs only `HRIM activation → final silence → closing` after the shared icebreaker. Box Breathing, Corpse Pose, and Ho’oponopono are skipped in the HRIM branch; HRIM also does not require chakra selection.
- HRIM no longer plays Moon Phase or Returning Journey opening narration. Its intention script is shorter, with dedicated lead-in/gap timing and a normal-speed browser fallback voice so the activation begins more directly.
- Added the HRIM duration slider, mobile range controls, mutual exclusion with Music Only, locale-backed HRIM intention defaults that preserve custom intentions, storage migration/defaulting, service-worker cache entry for the background-only image, and cache/version bumps. Browser validation completed at `browser` evidence level: 22/22 Playwright tests passed. `test-script.json` receives short test content for new script fields, while `docs/dot.json` receives additive fields only because it is a custom facilitator script.
- Moved Sleep Mode out of the Lobby. At or after 6:00 PM local device time, the journey-start flow asks whether to continue with or without Sleep Mode before the existing Do Not Disturb reminder. The decision applies only to that journey; daytime journeys reset Sleep Mode off.
- Refined the evening Sleep Mode prompt with compact, consistently spaced mobile actions: “Continue with Sleep Mode On” and a red “Continue with Sleep Mode Off” action for clear visibility. Browser validation now covers 25/25 tests.
- Verified the Corpse Pose timing control in both fast-test and production profiles; its value changes, display, persistence, and 60–600 second production bounds are working.
- Fixed the Corpse Pose range-control visual styling by giving the current value a responsive minimum width, centered outline, and tabular-number layout; bumped the stylesheet cache version to `1.52`.
- Corrected the remaining Corpse Pose-only column alignment bug by removing the inline `display:flex` override from the dynamic timing-row visibility helper; enhanced timing rows now retain their grid layout when shown.
- Reorganized Settings into Chakra Journey, Guided Practices, Comfort & Visuals, and Yoga Bridge sections. Corpse Pose and its timing now live under Yoga Bridge and default off for new setups; Reverse Journey and Chakra Frequencies live under Chakra Journey. Added a localized Settings help modal. Browser validation now covers 27/27 tests.
- Added a compact, localized Lobby roadmap that derives its arrow-separated stages from the active selections, including Yoga, Massage, Perineal Care, Assisted Bathing/Bath, Ho'oponopono, High Energy, Music Only, and Returning Journey variants. It wraps on mobile without adding a large panel.
- Completed an expanded temporary Playwright matrix covering all four language/display-language pairings, Yoga/Corpse/Bath/add-on dependency transitions, Yoga/Reverse mutual exclusion, every Guided Practice and Comfort toggle, lobby mode switching, Returning Journey, timing persistence, mobile overflow, HRIM boundaries at 03:29/12:00/12:01, and voice-preview fallback. The expanded matrix passed 9/9 and was removed after validation. Disabling Yoga now also clears a previously selected Corpse Pose to prevent stale hidden state.
- Added a close action to the evening prompt; closing it cancels and skips the journey instead of continuing without Sleep Mode.
- Added a daytime HRIM gate: HRIM can start only from 3:30 AM through 11:59 AM local time. Outside that window, users receive a localized explanation and can return to the Lobby or continue with regular meditation; no audio is initialized before the decision.
- Refined active chakra and HRIM narration through `meditation_en`/`meditation_ml` fields. The spoken flow now emphasizes felt experience and practical meditation benefits rather than organ-specific or physiological direction; legacy custom script uploads remain supported through fallback behavior.
- Centralized journey timing defaults, slider constraints, transition pauses, narration pacing, safety buffers, and estimate constants in `timing-config.json`. Runtime timing now resolves through the timing configuration; audio-engine filter/fade durations remain separate playback behavior. Bumped the shell/app versions to deliver the timing configuration to existing PWA users.
- Set the production interval range to 10–20 seconds with a 10-second default so the “take a break” narration has enough time. The explicit `fast-test` profile retains a 2-second minimum, while interval execution now waits for break narration completion before advancing; persisted values below the active minimum are clamped on load.
- Added a Playwright test harness under `tests/e2e/` with a local static `webServer`, Chromium coverage, and a `fast-test` timing profile in `timing-config.json`. The suite covers localization separation, timing configuration, bath/add-on dependency rules, timing persistence, seven bath/add-on combinations, and seven representative global journey-mode combinations; the latest complete run passed 18/18 tests. Service workers are blocked for deterministic functional tests; PWA cache behavior remains a separate allowed-service-worker pass.
- Moved live Comfort & Visuals and Audio Levels into a full-screen mobile-safe `Journey Tuning` mixer opened from the meditation-room mixer button. The dialog includes Audio Filters, Eyes Close Mode, Screen Brightness, Solfeggio frequencies, localized guidance, and Restart Journey; live controls update the active audio graph and synchronize persisted frequency state. Restart now restores the Start button and waits for a pending async start sequence to cancel before relaunching.
- Added a dedicated mixer Playwright test covering the full-screen dialog, live controls, Solfeggio synchronization, volume changes, evening Sleep Mode handling, and restart. The suite now contains 28 tests; the focused mixer test passed. A final full-suite rerun was impacted by the local static-server process being interrupted, so a clean 28/28 run remains a release follow-up.
- Preserved the mixer header close control as a visible `×` icon while keeping its localized accessible label; the bottom Close action remains localized text.
- Completed the first audio-quality improvement pass: added a final master safety limiter for compressed narration/music and bells, gentle Piper per-clip RMS/peak matching, 50 ms-or-less Piper edge fades, and AudioContext-timeline-ahead scheduling for crossfaded loops. Static validation passed and the focused mixer browser test passed 1/1.
- Audited the delivered audio assets: background music and mantra files are stereo 44.1 kHz/192 kbps MP3s of roughly 30 seconds. No lossless source master exists locally, so no re-encode was performed; replacing the background asset remains dependent on receiving a WAV/FLAC master. Browser speech synthesis remains an unprocessed fallback outside the Web Audio limiter.
- Added a collapsed Voice Tuning section inside Journey Tuning with narration-only Clarity, Warmth, Pace, Soft/Balanced/Clear presets, and Preview Current Voice. Piper pace is applied to the next generated phrase through a bounded runtime length-scale setting; browser fallback maps the same control to speech rate. Bumped the app shell and Piper cache versions to deliver the new runtime.
- Replaced the flat Light Echo delay with a voice-only Voice Space effect using a short pre-delay and generated stereo room impulse. The menu now presents Off, Soft Room, and Temple Air; wet levels remain restrained and Off is the default so the effect adds atmosphere without masking speech. Focused Playwright validation passed 1/1 after the addition.
- Increased Voice Space audibility after review: Soft Room now uses approximately 14% wet level and Temple Air approximately 20%, while retaining the filtered tail and voice-only routing for speech clarity.
- Set Soft Room as the default Voice Space preset for new users; existing explicit Voice Space preferences remain preserved.
- Added journey-aware voice profiles: regular guided meditation starts with Soft voice tuning plus Temple Air, while HRIM starts with Balanced voice tuning plus Soft Room. Users can still adjust the active profile from Journey Tuning.
- Set Chakra Frequencies/Solfeggio active by default for new users in both Settings and Journey Tuning; existing explicit frequency preferences remain preserved.
- Prevented the Voice Space label from wrapping in the compact mixer by giving it a responsive fixed minimum width and `white-space: nowrap`; the select remains flexible on mobile.
- Started multilingual architecture migration: added `language-manifest.json`, `locales/en.json`, and `locales/ml.json`; the language selector, locale lookup, browser voice matching, preview sentence, content source, and HTML locale now derive from manifest data. Migrated localized content resolution for core optional stages, Yoga fields, closing, Ho'oponopono, breathing steps, and intention text while preserving the existing bilingual script contract.
- Piper model loading is now registry-driven for model path, config path, and phonemizer voice. The Worker passes the complete model definition and the runtime prefers registry paths, so future voice additions do not require editing the vendored runtime map.
- Language manifest/locale bundles use a separate service-worker cache. Static validation passed for syntax, JSON, localized contracts, dynamic Piper definitions, cache routing, and diff whitespace.
- Remaining multilingual migration: move every remaining controller/UI string into locale dictionaries, convert the full narration pack to the language-neutral content shape, and perform native-speaker and target-device validation for each added language.
- Multilingual tracking: the active checklist is `TEMP-MULTILINGUAL-ARCHITECTURE.md`; the source of truth is `language-manifest.json`; locale dictionaries live under `locales/`; voice metadata lives in `piper-models.json`. The temporary checklist remains intentionally active until browser/device and native-language release gates are completed.
- Rewrote production chakra, closing, and HRIM guidance in `scripts.json` for English and Malayalam to be healing-oriented and result-focused through experiential outcomes—grounding, emotional freedom, confidence, compassion, clear expression, insight, and purposeful action—without organ, gland, blood, cell, or disease-directed claims. Existing `meditation_en`/`meditation_ml` content is now reused for the legacy `en`/`ml` fields to keep both runtime paths aligned.
- Expanded the Playwright narration regression to scan both languages and all production journey sections for anatomy-specific claims. Validation passed: JSON/syntax/diff checks passed, production guidance audit returned no anatomy matches, and `npx playwright test tests/e2e/settings.spec.js` passed 14/14.
- `docs/dot.json` remains intentionally unchanged as a custom facilitator script; its legacy anatomy-specific language is outside the production bundle and must be reviewed separately if that script is ever promoted to runtime content.
- Audited mantra wording and pronunciation: canonical identifiers remain `LAM`, `VAM`, `RAM`, `YAM`, `HAM`, `OM`, `AUM`, and `HRIM`; English spoken narration now uses contextual forms such as “The Lam mantra” and “Hreem mantra,” while Malayalam uses the native forms such as `ഹ്രീം`. This keeps the HRIM key and `HREEM.mp3` asset stable while giving English Piper a clearer pronunciation input.
- Confirmed Piper transport behavior: narration is segmented with explicit lead-in/sentence-gap timing; pause suspends the AudioContext and blocks queue advancement; stop/restart cancels the active source, clears queued synthesis, and terminates the Worker. Fixed persisted volume loading so `0` remains a true mute after reload. Focused Playwright validation passed 2/2 for mantra wording and mute persistence; syntax, JSON, and diff checks also passed.
- Consultation architecture is documented in `TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md` as planning-only. The first implementation is single-participant: HRIM, Sleep Mode, and Music Only stay in the Lobby, Reverse Journey stays in Settings, and Yoga remains separate from Sleep Mode. No consultation production code, recording backend, or video-sharing infrastructure has started.
- Added the Lobby entry point CTA `Begin Session Consultation`, localized in English and Malayalam. It is currently a non-mutating placeholder that preserves the existing meditation flow until the consultation screen/state machine is implemented.

### CP-PSY-001 — Bilingual psychological-safety baseline

- Date: 2026-08-12 (Asia/Kolkata).
- Commit: `fb4148f` — `feat(safety): make guided journeys trauma-aware`.
- Scope: production-shaped English/Malayalam content and runtime safety revision; this is a wellness safeguard, not clinical validation or a claim that the app meets every psychological need.
- Added a mandatory app-owned spoken contract before every guided path, including HRIM and custom scripts: wellness-not-treatment boundary, safe-use warning, natural breathing, open-eye/position choices, permission to skip/pause/stop, distress grounding, support escalation, and emergency guidance.
- Added a localized Lobby safety summary so the warning is available before Start; bumped shell, stylesheet, app, and language-cache versions for PWA delivery.
- Replaced absolute prosperity, healing, perfect-intuition, manifestation, universal-protection, relationship, and outcome guarantees with agency, boundaries, gradual progress, evidence-aware decisions, and support-seeking.
- Made Ho'oponopono explicitly optional and non-coercive; users need not recall events, forgive, contact anyone, or interpret the phrases as healing.
- Reworked Corpse Pose, mindful bathing, and all Yoga pose instructions for support, balance, device/water separation, natural breathing, modification, and symptom-based stopping. Removed physiological benefit claims from Yoga narration.
- Files changed in the implementation commit: `TECH-STACK.md`, `app.js`, `index.html`, `locales/en.json`, `locales/ml.json`, `package.json`, `scripts.json`, `style.css`, `sw.js`, and `tests/content-safety.test.mjs`. Custom facilitator content in `docs/dot.json` and the short fixture in `test-script.json` were intentionally not rewritten; the mandatory app-owned safety contract still precedes custom guided paths.
- Validation: `static` PASS — `npm run test:content-safety`, JavaScript syntax, JSON parsing, DOM ID uniqueness, localization-key coverage, and `git diff --check`. `runtime` PASS — localhost returned the revised HTML, Malayalam grounding locale, production Ho'oponopono copy, and mandatory grounding runtime. No Playwright or screenshots were used, per owner instruction.
- Remaining release review: native Malayalam speaker review and qualified mental-health/trauma-informed content review are pending. Real-device checks remain needed for spoken pacing, comprehension, balance/movement usability, and bathing safety. The app must not be represented as therapy, medical treatment, crisis care, or complete psychological care.
- Working tree after the implementation commit: clean before this handoff-only traceability update; local `production` was one commit ahead of `origin/production` and was not pushed.

### CP-SCHEMA-001 — Script fixture parity

- Date: 2026-08-13 (Asia/Kolkata).
- Commit: `4e6d1b8` — `test(content): keep script fixtures schema-compatible`.
- Added only the 18 missing `meditation_en`/`meditation_ml` compatibility fields to `docs/dot.json` for the seven chakras, closing, and HRIM. Each field duplicates that custom file's existing `en`/`ml` value; no custom wording was replaced.
- `test-script.json` already contained every runtime narration field. Its only structural difference was `thirdeye._note`, which is underscore-prefixed metadata and was intentionally not copied.
- Extended `npm run test:content-safety` to compare production schema paths against `test-script.json` and `docs/dot.json`, including object fields inside arrays while ignoring underscore-prefixed metadata. It also verifies that the new facilitator meditation fields preserve the corresponding legacy custom text.
- Validation: `static` PASS — fixture schema parity, custom-content equality, JSON parsing, content-safety regression, and `git diff --check`.

### CP-AUDIO-001 — Zero-volume Web Audio startup

- Date: 2026-08-13 (Asia/Kolkata).
- Commit: `5f20561` — `fix(audio): allow journeys with fully muted levels`.
- Root cause: the shared Eyes Close/audio initialization path used `exponentialRampToValueAtTime()` on signed EQ gain from zero toward a negative decibel value. Web Audio rejects zero and negative exponential ramp domains, so both normal and Sleep Mode starts could abort with a misleading stable-connection alert.
- Replaced the signed EQ transition with a linear ramp. Music volume zero now uses a true linear fade to zero rather than a tiny non-zero substitute. Bell volume zero skips singing-bowl oscillator creation; audible bell envelopes begin at a legal positive floor.
- Corrected volume preference loading so a missing key receives its intended default while an explicitly saved `0` remains a true mute. A journey may therefore continue with voice, drone, bell, mantra, and music all set to zero.
- Added `npm run test:audio-safety` covering missing/zero/invalid stored values, signed-EQ ramp exclusion, zero music behavior, muted bell behavior, and literal-zero exponential targets.
- Validation: `static` PASS — audio-safety regression, bilingual content-safety regression, JavaScript syntax, package JSON parsing, and `git diff --check`. No Playwright or screenshots were used.

### CP-JOURNEY-001 — Quiet Journey Complete handoff

- Date: 2026-08-13 (Asia/Kolkata).
- Branch: `journey-complete-update`.
- Lite now treats journey completion as a boundary rather than a financial workflow. After showing the localized Journey Complete blessing and session time for three seconds, it navigates to `https://missionode.github.io/earn-app/receive.html?Source=Lite`.
- The handoff deliberately sends only `Source=Lite`: no amount, client count, client identity, chakra selection, session details, UPI configuration, discount, QR data, or payment status is calculated or stored by Lite.
- Removed Total Journeys and the reflective journal from the completion modal. Historical journey statistics and existing `chakra_journal` data remain untouched in local storage; only the completion-page journal interface and its now-unused locale/runtime handlers were removed.
- Removed the blocking post-session Do Not Disturb alert because it interrupted the quiet automatic transition. The background-music fade now completes within the three-second closing window.
- `Return to Room` remains as a non-financial escape action and cancels the pending handoff if selected before navigation.
- Added `npm run test:handoff` to lock the exact destination, `Source=Lite`-only query contract, three-second sequencing, normal HTTPS navigation, and absence of the removed completion controls. Bumped the app query version and PWA shell cache so installed users receive the flow.
- Validation: `static` PASS — handoff contract, audio-safety regression, assessment contract, bilingual content-safety regression, JavaScript syntax, English/Malayalam/package JSON parsing, and `git diff --check`. No Playwright or screenshots were used, per owner instruction.
- Earn remains independently responsible for installed-PWA/custom-protocol handling and every financial decision after the HTTPS handoff.

### CP-HRIM-002 — Extended daytime availability

- Date: 2026-08-15 (Asia/Kolkata).
- HRIM is available from 3:30 AM through 5:59 PM according to the device's local time. At exactly 6:00 PM, HRIM is blocked and the existing evening Sleep Mode decision takes priority, so the modes do not overlap.
- Updated the runtime boundary and all visible English/Malayalam settings-help and blocked-time guidance from noon to 6:00 PM. The original 3:30 AM start remains unchanged.
- Added `npm run test:hrim-time` covering 3:29 AM, 3:30 AM, noon, 5:59 PM, and 6:00 PM. The existing browser specification now uses 6:00 PM as its blocked boundary, but Playwright was not run per owner instruction.
- Bumped the app query version and PWA shell cache so installed users receive the revised timing and copy.

### CP-JOURNEY-002 — User-activated Earn PWA handoff

- Date: 2026-08-15 (Asia/Kolkata).
- Supersedes the automatic navigation described in CP-JOURNEY-001. Journey Complete still preserves a three-second quiet blessing, but the timer now only reveals and focuses a localized `Continue to Earn` anchor.
- Earn navigation occurs only when the guide taps the native HTTPS anchor. This preserves fresh user activation and gives supported Android/Chromium environments the best opportunity to open the installed Earn PWA instead of navigating Lite's standalone window out of scope.
- The exact destination remains `https://missionode.github.io/earn-app/receive.html?Source=Lite`, carrying no amount, count, client, meditation, or payment data. `Return to Room` remains available and cancels/hides a pending handoff.
- The regression contract verifies that the control begins hidden, appears after three seconds, uses a genuine anchor with the exact `Source=Lite`-only URL, and contains no timer-driven `window.location` navigation.
- Updated English/Malayalam labels and completion-control styling; bumped stylesheet, app, and PWA shell versions. No custom protocol is invoked by Lite.

### CP-CONTENT-002 — Receiving, Aura, and Healing journey

- Date: 2026-08-16 (Asia/Kolkata).
- Rewrote the production English and Malayalam gratitude opening, returning opening, seven chakra meditations, seven affirmations, and closing as one progressive spiritual journey centred on Receiving, Aura, and Healing.
- The aura progression is intentional: Root establishes grounded protection; Sacral restores receptive flow; Solar strengthens clear boundaries; Heart supports healing and compassionate receiving; Throat protects authentic expression; Third Eye adds discernment; Crown integrates the colours into sacred protection; Closing carries the practice into familiar or unfamiliar surroundings.
- Traveller awareness is inclusive rather than logistical. The opening and closing welcome clients for whom the setting may be familiar or new, without adding transport, destination, itinerary, or tourism instructions to meditation.
- Aura language builds confidence through luminous imagery, dignity, consent, boundaries, support, discernment, and spiritual connection. It does not promise invulnerability, diagnose blocked chakras, claim medical or psychological cure, or force release, forgiveness, or healing.
- No JSON fields were added or removed. `test-script.json` and the custom facilitator content in `docs/dot.json` remain untouched. Existing names, mantras, frequencies, colours, symbols, moon scripts, HRIM, care practices, Yoga, and Ho'oponopono remain unchanged.
- Extended the bilingual content contract to preserve all three themes and the chakra-by-chakra aura progression while rejecting absolute protection, cure, diagnosis, and coercive-healing phrases. Bumped the PWA shell cache for production delivery.

### CP-ASSESSMENT-002 — Reliable chakra theming and lobby return

- Date: 2026-08-16 (Asia/Kolkata).
- Replaced the narrow Intersection Observer activation band with deterministic viewport-marker syncing, so scrolling through each large assessment card updates the complete page, toolbar, navigation, hero, and browser theme colour to that chakra.
- Chakra navigation, answer selection, and counsellor-note interaction now use the same activation path and apply the corresponding theme immediately.
- Added a visible `Return to Lobby` link beside `Clear for New Client`. It uses the app-relative `../index.html` destination so GitHub Pages and local hosting both return to Lite rather than the domain root.
- Extended the static assessment contract for all activation paths and the lower lobby link; bumped the PWA shell cache so installed clients receive the corrected assessment page. No questions, responses, scoring, notes, or stored client data were changed.

### CP-AUDIO-004 — Main-drone duration modes

- Date: 2026-08-16 (Asia/Kolkata).
- Commit: `b7563b7` — `feat(audio): add progressive drone duration modes`.
- Added a localized Lobby control with four persisted modes: Beginner 20%, Intermediate 50%, Advanced 70%, and Expert 100%. New and invalid preferences resolve to Beginner.
- The drone still begins before each chakra narration. Its timer uses the active core-practice duration (`timePerChakra`, or `timeHighEnergy` for HRIM), pauses with the journey, and starts the existing five-second release when the selected percentage elapses. Generation guards prevent a cancelled or previous chakra timer from stopping a later stage.
- Removed the half-frequency lower oscillator completely while retaining one main drone, elemental texture, and optional Eyes Close binaural support. Yoga keeps its independent untimed 136.1 Hz bridge-drone lifecycle.
- Added a live `MM:SS` preview so the guide can see the exact fade-start time before beginning. Music Only hides the control because that path creates no chakra drone.
- Strengthened custom-script handling by requiring HRIM's audio identity fields, validating every active chakra/HRIM frequency from 1–20,000 Hz, and retaining a defensive 110 Hz fallback at the audio boundary.
- Added `npm run test:drone-duration` for exact ratios, defaulting, localization, stage ordering, pause behavior, stale-timer protection, one-main-oscillator output, persistence, and frequency validation. Bumped app/style query versions plus the PWA shell and language caches. No Playwright or screenshots were used.

### CP-AUDIO-005 — Exact script-defined main-drone frequencies

- Date: 2026-08-16 (Asia/Kolkata).
- Commit: `99bc581` — `fix(audio): preserve exact script drone frequencies`.
- Removed the remaining octave-reduction rules that halved script frequencies above 600 Hz and quartered frequencies above 900 Hz. The main oscillator now uses the validated active chakra or HRIM JSON value as its centre frequency: 396, 417, 528, 639, 741, 852, 963, and HRIM 528 Hz in the production bundle.
- Preserved the separate 80/82 Hz optional Eyes Close binaural support, 40 Hz Eyes Close grounding anchor, elemental texture, and Yoga's independent 136.1 Hz drone. These supporting layers do not replace or retune the JSON-driven main oscillator.
- Preserved the existing 0.04 Hz vibration LFO, which moves the centre pitch by approximately ±0.1%; no octave or secondary lower-tone layer remains.
- Preserved the explicit Chakra Frequencies Off behavior and malformed-input defense, both of which use the neutral 110 Hz fallback intentionally.
- Strengthened `npm run test:drone-duration` to reject any return of `/2` or `/4` main-frequency shifting and to require direct use of the validated active frequency. No Playwright or screenshots were used.

### CP-AUDIO-006 — HRIM Intermediate-default drone mode

- Date: 2026-08-16 (Asia/Kolkata).
- Commit: `fc243a1` — `fix(audio): use separate HRIM drone duration default`.
- Normal chakra journeys retain the persisted Beginner default. HRIM now has a separate `chakra_hrim_drone_duration_mode` preference with Intermediate as the default; saved Beginner or invalid HRIM values normalize to Intermediate.
- The Lobby disables the Beginner radio while HRIM is selected, shows a localized English/Malayalam explanation, and keeps Advanced/Expert available. The runtime passes the correct normal or HRIM mode into the pause-aware drone timer.
- Bumped `app.js` to `v=1.67`, shell cache to `chakra-v5.30`, and language cache to `chakra-language-v5`. Updated the drone contract for HRIM normalization, separate persistence, UI disabling, and localization.
- Validation: `static/unit` PASS — JavaScript syntax, `npm run test:drone-duration`, `npm run test:content-safety`, and `git diff --check`. No Playwright or screenshots were used.

## Documentation checkpoint

- Checkpoint: `CP-CONTEXT-001` — active audio-branch context refresh.
- Date: 2026-08-16 (Asia/Kolkata).
- Baseline `HEAD`: `99bc581` — `fix(audio): preserve exact script drone frequencies`.
- Pre-refresh status: clean `drone-duration-modes` working tree; local branch two commits ahead of `origin/production`, with no upstream and no push performed.
- Scope: documentation accuracy only. Runtime behavior, JSON content, locales, styles, tests, and protected `loop.md` are intentionally unchanged by this checkpoint.
- Validation: `static/unit` PASS — documentation consistency, current Git state, current cache/query versions, npm test inventory, `npm run test:drone-duration`, `npm run test:hrim-time`, and `git diff --check`. Browser/manual evidence is intentionally not part of this refresh.
- Next checkpoint: resolve the pending HRIM duration-mode policy; do not merge or push until explicitly requested.
