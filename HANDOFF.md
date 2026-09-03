# Chakra Meditation — Active Handoff

## START

- Current objective: keep `production` stable while refining Yoga and decoupling Intimate Service into its own Lobby experience.
- Target root: `/Users/lekshmisyam/Desktop/Ikigai/lite`.
- Reusable instructions root: `/Users/lekshmisyam/Desktop/Ikigai/lite/Loop`; `Loop/loop.md` is the protected collaboration policy and must not be changed during routine application work.
- Stack: static HTML/CSS/JavaScript PWA with Web Audio, Piper/Web Speech narration, local JSON content, service-worker caching, and npm-based test tooling. There is no backend, database, authentication layer, or production build step.
- Permanent constraints: preserve existing journey order unless explicitly changed; keep `docs/dot.json` as custom facilitator content; add only missing schema fields to fixtures; commit each feature/fix with a detailed reference message; do not run Playwright or take screenshots unless the owner explicitly requests it.
- External actions remain approval-gated: do not merge, push, deploy, or rewrite branch history unless the owner asks.

## MID

- Stable production baseline: `production` remains the release branch; feature work must stay on its dedicated branch until the owner requests a merge.
- Delivered product shape: bilingual English/Malayalam guided journeys; seven-chakra customization; HRIM, Sleep, Music Only, Yoga/Bath/care extensions; Piper narration with browser fallback; trauma-aware wellness boundaries; assessment handoff; and a user-activated, `Source=Lite`-only Earn link after completion.
- Runtime content source is `scripts.json`. `test-script.json` is a short schema fixture. `docs/dot.json` is independently authored facilitator content and is not synchronized from production wording.
- HRIM is a separate energizing/recharge experience with no local-time restriction; it is not an eighth chakra. Its script-defined drone centre is 528 Hz.
- Chakra frequencies follow the widely used modern Solfeggio mapping in this product; they must not be represented as measured anatomy, clinical treatment, or a canonical fixed-Hz rule from classical yogic texts.

## NOW

### Resume snapshot — 2026-09-03 (production, Journey video prelude complete)

- Target application root: `/Users/lekshmisyam/Desktop/Ikigai/lite`. Reusable Loop instructions root: `/Users/lekshmisyam/Desktop/Ikigai/lite/Loop`. The current Loop policy, delivery workflow, and Loop skill were reread for this handoff refresh; they are protected framework files and were not changed.
- Git/remote baseline: branch `production`, merge commit `4077d17` (`Merge branch 'journey-video-prelude'`) is pushed to `origin/production`. It contains the complete approved prelude sequence through `[CP-VIDEO-050]`. No feature branch remains active for this work.
- Restart Journey behavior: after the existing restart confirmation, `MeditationController.stop({ preserveScreen: true })` stops the outgoing journey without exposing the Lobby. A paused, cinematic prelude displays the localized Do Not Disturb reminder. The guide must tap Begin introduction; that user gesture requests fullscreen for persistent `#app`, then begins the video. The video is letterboxed (`contain` on black), its native audio enters the existing Music/Spatial/Music Space routing at the shared Music / Video Volume level, and both visual stage and audio dissolve over the final 8 seconds. On completion, the app goes directly into the new journey, remains fullscreen, and does not repeat the DND alert. Unavailable video falls back safely to the normal localized reminder and normal journey start.
- Fullscreen journey chrome: `JourneyVideoPrelude` explicitly tracks the `fullscreenchange` lifecycle for `#app`. During app-owned fullscreen, `body.journey-fullscreen-active` hides bottom controls and both top countdown rings. The dedicated bottom-edge reveal zone, pointer/focus handling, and the `fullscreen-controls-visible` class reveal them; they hide 120 ms after pointer/focus departure. Normal Stop or Return to Room exits fullscreen. Browser/device visual behavior still needs target-device manual verification; no Playwright or screenshots were run by owner direction.
- Language rule: Settings continue to follow Display Language. Every active journey-stage label now follows Meditation Language via `journeyT()`, including Preparation, Moon/Returning, Gratitude, Intention, Box Breathing completion, Corpse Pose, care and guide-controlled transitions, Music Only, Yoga/rest, Sleep/Shot labels, and the closing Body marker. This resolves Malayalam narration screens that previously displayed the English Preparation title; English, Malayalam, Russian, and Hindi shipped locale coverage is retained.
- Delivery/cache state: `index.html` loads `app.js?v=2.34`; shell cache is `chakra-v5.108`. The 42 MB `video/nature-upgrade.mp4` is tracked but intentionally omitted from service-worker precache, so it loads on first use instead of inflating PWA installation updates.
- Fresh feature validation before merge was `static/unit`: JavaScript/service-worker syntax; `test:journey-video-prelude`, Hindi, Russian, language intention, narration ticker, background music, spatial audio, and `git diff --check` passed across the feature checkpoints. This does not prove visual layout, device fullscreen, or audible fade quality.
- Preserve unrelated local state: `.DS_Store` and `audio/.DS_Store` are modified; `docs/dot.json` is deleted by owner action; `.codex/` and `audio/BACKUP/background_music.mp3` are untracked. They are not part of the video feature, were never staged, and must remain untouched unless the owner explicitly directs otherwise.
- Next action: no new feature is active. On the next request, begin from `production` commit `4077d17`, keep the above local files isolated, and use the focused source/tests for the requested surface. If the user reports fullscreen UI behavior again, inspect the `JourneyVideoPrelude` lifecycle and `journey-fullscreen-active` / `fullscreen-controls-visible` classes before changing other journey code.

### Active feature — 2026-09-03 (Video Volume Settings)

- Branch: `video-volume-settings`, created from local production handoff checkpoint `2293465`; do not merge or push without owner approval.
- Decoupled `state.volVideo` from `state.volMusic`. Video Volume is persisted as `chakra_vol_video`, has the same non-zero 0.02–0.5 safety range, and is used both for the restart prelude and a Settings-only preview. Background Music remains in Journey Tuning as `volMusic` and its existing live role-preserving fade behavior is unchanged.
- Settings now provides Video Volume and Preview Video Audio. The preview uses the supplied prelude media and existing Web Audio Music/Spatial/Music Space route without starting a journey, fades in to Video Volume, plays for eight seconds, then fades and resets. It is user-gesture initiated and does not request fullscreen.
- Delivery is rotated to `app.js?v=2.35` and `chakra-v5.109`. Validation: `static/unit` PASS — JavaScript syntax, `test:journey-video-prelude`, Hindi language contract, and diff check. No Playwright, screenshots, or device listening were run by owner direction.

### Active feature — 2026-09-02 (Journey video prelude)

- Branch: `journey-video-prelude`, created from `production` commit `8d63042`. Scope is intentionally limited to the supplied `video/nature-upgrade.mp4` restart prelude; no ordinary Begin Journey, Shot, Sleep, Music Only, Experiment, or completion flow is changed.
- After the existing Restart Journey confirmation, the active session stops and the supplied video fills the app viewport in a paused ready state. Before playback, it clearly asks the guide to enable Do Not Disturb and requires the explicit Begin introduction button. That genuine tap requests the persistent app container in browser/device fullscreen before starting the video and its native audio; unsupported browsers retain the app-viewport fallback. Fullscreen now intentionally remains through the guided journey, then exits when the guide uses Stop to return to the Lobby. There is no Skip path. The audio enters the Web Audio graph at the guide-selected Music level, follows the existing Spatial Sound panner and Music Space diffuse reverb, fades in over 2.4 seconds, and fades out over 3 seconds. The visual uses matching opacity fades. Missing/failed playback uses a short 1.2-second safe continuation.
- The large video is deliberately not listed in the service-worker install precache, avoiding a 42 MB install/update burden. It remains a normal first-use media request. Once the guide starts it, the video runs through to completion and the established journey begins only after the prelude exit completes.
- The shared `vol-music` control now reads Music / Video Volume because the same safe guide-selected level applies to both background music and the prelude video. New static regression coverage also locks the fullscreen request/exit and the localized shared label. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, background music, spatial audio, Hindi, Russian, and diff check. No Playwright, screenshots, or device listening are run by owner direction.
- The prelude now preserves the full supplied video frame in fullscreen with deliberate black cinematic letterboxing (`object-fit: contain`), rather than cropping it to fill tall or wide devices. Shell delivery is rotated so installed copies receive the layout correction.
- Completing the video now consumes the exact Do Not Disturb acknowledgement already made on its ready screen. Normal direct starts still show the localized reminder, and failed/unavailable video playback intentionally retains that normal reminder. This prevents a duplicate blocking alert from disrupting the fullscreen-to-journey handoff. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, Russian, hypnosis journey, and diff check.
- Restart now stops audio and timers without briefly showing the Lobby behind the video; after the prelude it goes directly into the established journey start sequence. The preserve-screen option belongs specifically to `MeditationController.stop()`—not `VisualEngine.stop()`—and also preserves an already-active fullscreen session during restart. Fullscreen journey chrome: the bottom controls and mirrored top countdown rings fade out by default, reveal only from a dedicated bottom-edge hover zone or keyboard focus, and recede after pointer departure. This applies only while the persistent app container is fullscreen; ordinary journeys retain their existing control visibility. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, Russian, background music, spatial audio, and diff check.
- The direct-start Do Not Disturb alert now has a human-readable English fallback when a locale bundle is unavailable or stale; it never exposes a raw `ui.*` translation key. A completed video still consumes the reminder and shows no follow-up alert. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, and diff check.
- Journey-stage labels now deliberately resolve through Meditation Language, independent of the Settings-only Display Language. This covers Preparation, Moon/Returning, Gratitude, Intention, Box Breathing completion, Corpse Pose, care purification and guide-controlled transitions, Music Only, Yoga/rest stages, Sleep/Shot labels, and the closing Body marker across English, Malayalam, Russian, and Hindi. The cinematic prelude's audio and full-screen visual stage now dissolve together over 8 seconds (was 3 seconds audio / 1.8 seconds container), with the fade beginning eight seconds before playback ends. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, Russian, language intention, narration ticker, background music, and diff check.
- Fullscreen control visibility no longer relies on browser-specific `:fullscreen`/`:has()` matching. The prelude now tracks whether `#app` is the document fullscreen element and applies explicit lifecycle classes: controls and top rings are hidden by default, revealed on the bottom-edge zone or control focus, then hidden 120 ms after pointer/focus departure. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, spatial audio, background music, and diff check.

### Local checkpoint — 2026-09-02 (Minimal test-script narration)

- `test-script.json` remains a complete English/Malayalam schema fixture with its existing frequencies, mantras, assets, service modules, Yoga poses, sleep stages, and shot values intact. Every localized narrative leaf is now exactly one concise sentence, making it suitable for quick technical flow checks rather than stakeholder presentation.
- Validation: `static/unit` PASS — JSON parsing, `test:demo-script`, a direct one-sentence scan across all 118 localized fixture leaves, and diff check. `test:content-safety` remains unavailable because the owner-maintained local `docs/dot.json` is deleted in the working tree and was deliberately not restored. No Playwright or screenshots were run.

### Local checkpoint — 2026-09-02 (Extended natural transition tails)

- Existing diffuse, non-repeating reverb is extended: narration `2.8s → 4.5s`, background music `1.8s → 3.2s`, and mantra `3.6s → 5.5s`. Dry source fades and intelligibility settings remain unchanged.
- Music now has a dedicated reverb-tail input gate. A music-to-mantra dissolve closes both dry music and new reverb input over the established six seconds, but the already-generated, low-passed tail returns beside the dry gate and settles naturally instead of being hard-cut. The tail is restored gradually with the music after mantra.
- Delivery rotates to `app.js?v=2.23` and shell cache `chakra-v5.97`. Validation: `static/unit` PASS — syntax, background-music/mantra, spatial routing, narration timing, audio safety, and diff check. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Local checkpoint — 2026-09-02 (Near-whisper mantra minimum)

- The mantra mixer’s non-zero minimum is now 0.5% in 0.5% steps, replacing the prior 2% floor. Its 35% default is deliberately unchanged, so existing guides retain their normal balance unless they choose the new near-whisper range. The change affects the mantra track only, not spoken narration, music, drones, or bell.
- Delivery rotates to `app.js?v=2.22` and shell cache `chakra-v5.96`. Validation: `static/unit` PASS — JavaScript/service-worker syntax, background-music/mantra, narration ticker, audio safety, and diff check. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Local checkpoint — 2026-09-02 (Slower narration duck and feeble mantra range)

- Background music now takes 6 seconds, rather than 4, to settle to its narration bed in both Piper and Browser TTS routes. The mantra mixer keeps its existing 35% default but now permits a deliberately feeble 2% minimum in 1% steps; persisted values are clamped to the same range.
- Delivery rotates to `app.js?v=2.21` and shell cache `chakra-v5.95`. No mantra default, music-to-mantra dissolve, frequency level, or narration wording changes are included.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, background-music/mantra, narration ticker, audio safety, and diff check. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Local checkpoint — 2026-09-02 (Longer narration-to-mantra tail)

- The single shared Piper narration-to-mantra tail is now 5 seconds (was 3), covering every chakra and HRIM before its mapped mantra. Browser TTS remains outside Web Audio and therefore retains its platform-owned voice ending; it still uses the same six-second background-music dissolve before mantra playback.
- Delivery rotates to `app.js?v=2.20` and shell cache `chakra-v5.94`; language cache remains unchanged. This checkpoint deliberately does not alter music, drone, mantra, bell, guided-tone, ambience, or explicit journey-stop fades.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, `test:background-music`, `test:narration-ticker`, and `git diff --check`. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Active snapshot — 2026-09-01 (Heart release and renewal narration)

- The owner rejected karma terminology as unnecessarily complex. `scripts.json` now adds one approved short Heart Chakra passage immediately before the YAM mantra in English, Malayalam, Russian, and Hindi: old heaviness may soften; keep the learning, release the burden, and let compassion guide the next step. It explicitly avoids forced forgiveness, erasing the past, blame, or promised cleansing.
- The production Heart passage is intentionally a single integrated narration addition, not a separate stage, toggle, frequency, or facilitator-script rewrite. `docs/dot.json`, `demo-script.json`, and `test-script.json` remain unchanged.
- Shell cache rotates to `chakra-v5.89` for fresh script delivery. `test:content-safety` locks the approved English framing and no-karma boundary; Hindi/Russian language checks, JSON parsing, service-worker syntax, and diff check passed.

### Active snapshot — 2026-09-01 (Arrival guided relaxation narration)

- On `hypnosis-integration-journey`, the normal non-demo chakra journey now speaks two brief, choice-preserving Arrival passages around the existing transition cues: `system.arrivalInduction` before the 432 Hz cue and `system.arrivalReadiness` before the 528 Hz cue. The wording uses a gentle repeated rhythm (more settled, more relaxed; steadier, a little deeper) while explicitly retaining room awareness, comfort, and the freedom to adjust.
- Both passages are application-localized in English, Malayalam, Russian, and Hindi; custom scripts require no new fields. The existing chakra narration, moon/returning opening, gratitude, personal intention, mantras, and Emergence are unchanged. No Frequency Mode still narrates both passages while omitting only generated tones; No Mantra Mode remains independent; demo journeys still bypass the whole Arrival/Emergence wrapper.
- Session estimates add a fixed 40-second allowance for the two voice passages. Delivery caches rotate to shell `chakra-v5.90` and language `chakra-language-v22`.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, locale/timing JSON parsing, `test:hypnosis-journey`, `test:no-frequency`, `test:demo-script`, `test:hindi-language`, `test:russian-language`, `test:content-safety`, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Active snapshot — 2026-09-01 (Unhurried narration-to-mantra handoff)

- Every chakra narration, including Crown before AUM, keeps its dedicated Piper final-clip fade before a mantra. The tail is now 3 seconds (was 2); then the already ducked background bed fades steadily to silence over 6 seconds (was 4) before the mantra’s established gradual entrance. The fading music is the intentional contemplative interval—there is no abrupt mute or extra dead-silence delay.
- Browser TTS remains platform-controlled and cannot receive an equivalent Web Audio gain ramp; it still waits for the spoken utterance to finish before this same music/mantra handoff. Mantra loading still completes before music muting, avoiding slow-device loading silence.
- Delivery rotates to `app.js?v=2.17` and shell cache `chakra-v5.91`; language cache remains `chakra-language-v22`. Regression tests lock the longer tail and music fade.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, `test:narration-ticker`, `test:background-music`, `test:hypnosis-journey`, `test:no-frequency`, `test:hindi-language`, `test:russian-language`, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Active snapshot — 2026-09-01 (repertory journey-use annotation)

- `data/frequency-repertory.json` already contained 432 Hz and 528 Hz. Their reference associations were preserved; each now has a bilingual `journeyUse` annotation: 432 Hz is the post-preparation Arrival transition cue and 528 Hz is the pre-first-chakra Arrival readiness cue. Both share the selected Drone Duration budget; 528 Hz also remains marked as Solar/HRIM-configured.
- `docs/repertory.html` renders this optional “Lite journey use” note in the existing family cell and includes it in search. The reference page does not turn the annotation into a medical claim or alter the one-second Custom Shot handoff.
- Shell cache rotates to `chakra-v5.88` so installed PWAs receive the updated repertory data. Validation: JSON parsing, `test:repertory`, `test:hindi-language`, service-worker syntax, and `git diff --check` passed.

### Active snapshot — 2026-09-01 (narration boundary spacing)

- Ordinary narration blocks now end with one shared 2-second `narration.exitGap` for both Piper and Browser TTS. This replaces Browser TTS’s former final 1.5-second sentence gap and gives Piper the same explicit settling time; internal sentence spacing remains 1.5 seconds.
- Mantra handoffs deliberately do not stack the new exit gap: their final Piper clip retains the existing dedicated 2-second narration-to-mantra fade. Arrival/Emergence retain their dedicated 2–3 second gaps.
- `tests/narration-ticker.test.mjs` guards the timing value and confirms both narration engines apply it without doubling Browser TTS’s final sentence gap. Static validation passed: narration ticker, hypnosis journey, and diff check.

### Active snapshot — 2026-09-01 (facilitator fixture restoration)

- `docs/dot.json` has been restored by the owner and is again a tracked, facilitator-maintained English/Malayalam script fixture. It contains all English/Malayalam localized string fields required by the current production schema; no facilitator narration was rewritten or supplemented because no such gaps existed.
- A top-level `_note` is intentional JSON metadata, not a runnable narration field: preserve existing facilitator wording exactly; add only genuinely missing English/Malayalam siblings; do not add partial new-language content to this fixture. Full new-language support belongs to the atomic production-language workflow.
- `tests/content-safety.test.mjs` now separates structural schema validation from localization validation. It requires the short test fixture and facilitator fixture to retain complete English/Malayalam content, while allowing their intentionally absent Russian/Hindi siblings to use the established custom-script English fallback. This corrects the stale assertion surfaced only after `docs/dot.json` returned.
- Validation: PASS — JSON parsing, `test:content-safety`, `test:drone-duration`, and `git diff --check`. Preserve unrelated `.DS_Store` changes, `.codex/`, and the untracked backup audio.

### Production release — 2026-09-01 (Asia/Kolkata)

- `hypnosis-integration-journey` was fully validated and merged into `production` from base `b3a68b2` as `fea10ad`; release handoff checkpoint `789be20` was pushed successfully to `origin/production`. The owner explicitly approved production merge and push. Preserve the unrelated `.DS_Store` changes, `.codex/`, untracked backup audio, and current `docs/dot.json` deletion; they remain excluded from this release.
- Scope: the normal chakra journey is preserved as `Arrival → existing selected chakra sequence → Closing → Emergence`. Arrival/Emergence are a wrapper only; they do not change chakra order, script frequencies, mantra routing, focused experiences, HRIM, Sleep, Yoga, Intimate Service, Shots, Music Only, or the stakeholder demo.
- Arrival: after the established guide preparation narration, a restrained 432 Hz internal transition cue plays; after the existing moon/returning/gratitude/intention narration, a restrained 528 Hz readiness cue plays before the first chakra. Both cues share the existing Drone Duration exposure budget equally (Beginner 2s + 2s, Intermediate 5s + 5s, Advanced 7s + 7s, Expert 10s + 10s). These are not public Shots and do not activate their Bluetooth/confirmation flow.
- Emergence: after the existing Closing, a very feeble bowl/bell begins the return, followed by localized room-orientation narration, then a configurable quiet return. Journey Timings now include Arriving (10–300s, default 60s) and Emergence (30–300s, default 60s). The bell default/range is intentionally restrained at 0.04 / 0.02–0.12.
- Transitions: Arrival uses explicit pre-tone, post-tone, and readiness gaps; music ducks before each cue, fades the cue itself in/out, then restores to the narration bed. Closing pauses before the bell; Emergence pauses after the bell and after narration. No Frequency Mode omits the two generated cues and bowl while retaining the same quiet gaps, narration, and background music. `finish()` no longer fires a second bell.
- Demo boundary: `demo-script.json` continues to skip the hypnosis wrapper so a stakeholder/client demonstration remains the established ordinary short journey. Custom scripts do not need new schema fields; Arrival/Emergence narration is application-localized in all four UI/content languages.
- Regression coverage: `tests/hypnosis-journey.test.mjs` checks wrapper order, shared duration budget, localized Arrival narration, fade/duck routing, No Frequency behavior, demo exclusion, restrained bell, and the absence of a second completion bell. `test:background-music` locks the 3-second final narration tail and 6-second music dissolve before every mantra. Cache delivery is rotated to `app.js?v=2.17`, shell `chakra-v5.91`, language cache `chakra-language-v22`.
- Release static validation: PASS — JavaScript/service-worker syntax, JSON parsing, content safety, chakra selection, Lobby scroll, narration ticker, language intention, Russian/Hindi language, demo script, hypnosis journey, audio safety, background music, spatial audio, No Frequency, focused practices, Yoga, drone duration, repertory, assessment, Earn handoff, HRIM timing, splash, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed by owner direction.

### Local checkpoint — 2026-09-01 (Facilitator Arrival/Emergence narration)

- Restored `docs/dot.json` now has an optional top-level `system` block with English/Malayalam `arrivalInduction`, `arrivalReadiness`, and `emergence` narration. Existing facilitator fields are unchanged.
- When a custom script is selected, `getJourneySystemNarration()` uses that optional custom text once for the normal Arrival/Emergence wrapper. Missing custom fields and all built-in journeys fall back to the four-language app-localized copy, so this does not create duplicate narration or require Russian/Hindi additions to the facilitator document.
- Delivery rotates to `app.js?v=2.18` and shell `chakra-v5.92`; language cache stays `chakra-language-v22`. This checkpoint is local on `production` until the owner explicitly requests a push.
- Validation: `static/unit` PASS — JavaScript syntax, facilitator JSON parsing, `test:hypnosis-journey`, `test:content-safety`, `test:demo-script`, `test:no-frequency`, `test:hindi-language`, `test:russian-language`, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Local checkpoint — 2026-09-02 (Restart-safe background-music entry)

- Background music now preserves its complete 10-second source entry fade. During that protected window, `fadeInBackgroundMusic()` no longer calls the loop helper’s short gain ramp, which previously cancelled the slow envelope and made startup sound too quick.
- A stopped background loop now exposes a retirement promise. Starting another journey waits for the prior controlled fade to complete before a fresh source is created, preventing the brief old/new loop overlap that could make a second start louder or faster without a hard refresh.
- The existing narration ducking, mantra handoff, explicit stop fade, and music-only behavior remain unchanged. Delivery rotates to `app.js?v=2.19` and shell `chakra-v5.93`; language cache remains `chakra-language-v22`.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, `test:background-music`, `test:narration-ticker`, `test:hypnosis-journey`, `test:no-frequency`, `test:hindi-language`, `test:audio-safety`, `test:spatial-audio`, and `git diff --check`. The local facilitator file is currently absent by owner action, so its content-specific test is not included in this audio checkpoint. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Active snapshot — 2026-08-31 (Asia/Kolkata)

- Production release scope: `add-hindi-language` was merged into `production` as `8e1dead` after confirming `origin/production` remained at `2a7f27b`. The merge and documentation checkpoint were pushed successfully to `origin/production` through `491e8c2`. It contains complete `hi-IN` UI/narration with browser TTS only; no Hindi Piper model is registered pending a separate licence-approved voice decision. Hindi meditation sessions do not expose or schedule the Earn handoff. `locales/hi.json` and all Hindi narration fields are registered atomically, avoiding the earlier partial `hi.json` request. Static Hindi locale/narration parity and handoff-suppression checks pass. Native Hindi review and target-device listening remain explicitly deferred manual release gates. See `TEMP-MULTILINGUAL-ARCHITECTURE.md` → “Hindi (`hi` / `hi-IN`)”.
- Hindi contract scope: `locales/hi.json` mirrors all 291 English locale leaves, and `scripts.json` provides Hindi siblings for all 60 English production narration fields while preserving canonical mantras, stage order, durations, frequencies, placeholders, consent language, and stop boundaries. Shipped content validation is strict; existing custom bundles without Hindi retain the English fallback.
- Hindi/demo delivery boundary: the manifest and built-in fallback register `browserPrefixes: ["hi"]` without `defaultPiperVoice`; `piper-models.json` remains unchanged. `scheduleEarnHandoff()` cancels any pending reveal and returns before creating a timer for Hindi. The current client delivery rotates `app.js?v=2.15`, shell cache `chakra-v5.86`, and language cache `chakra-language-v20`; it also prevents an old cached locale from exposing a raw demo-status key. No browser, Playwright, screenshot, native-speaker, or real-device evidence is claimed for this checkpoint.
- Demo-content split: `test-script.json` is restored as the shortest deterministic schema fixture. `demo-script.json` is the separate bilingual stakeholder/client demonstration bundle: it retains the canonical frequencies, mantras, stage ordering, symbols, and sleep values while using refined grounded, consent-led narration for introductions, moon prompts, chakras, closing, HRIM, Yoga, care modules, rest, and Ho'oponopono. Its `_demo` metadata states its purpose without affecting runtime parsing. It uses the established English fallback for Russian and Hindi custom-script validation rather than duplicating production translations.
- Demo timing preset: only `demo-script.json` carries the exact `_demo.id` and 30-second duration metadata recognised by the application. Selecting it through Custom Script upload or URL sets Core Practice Duration to `0.5` minutes, temporarily extends that slider's lower bound to 30 seconds, retains the guide’s prior normal duration, and restores that duration when the guide selects a different/default script. This does not alter production timing defaults, shot duration, sleep duration, or frequency exposure.
- Demo regression protection: `tests/demo-script.test.mjs` verifies the client-facing demo purpose, no internal test terminology, its 30-second recognised metadata, complete custom-script validation with English fallback for Russian/Hindi, and the startup-order guard for the demo duration preset. The demo is intentionally uploaded/loaded as a Custom Script; it does not become a new persisted script-source type.
- Release preflight: PASS (`static/unit`) — app/service-worker syntax; JSON parsing; `test:demo-script`; `test:language-intention`; `test:hindi-language`; `test:russian-language`; and `git diff --check`. `test:drone-duration` remains blocked before assertions by the existing owner-managed deletion of `docs/dot.json`, which is preserved and excluded from this release.
- Production delivery: `add-language-feature` was compared against frozen baseline `a9fcb1e`, then merged cleanly into local `production` as `6aa77ca`. The owner approved this merge and push; `origin/production` was fetched first and matched the frozen baseline. The outgoing push contains only `CP-I18N-034` through `CP-I18N-036` plus this merge/refresh checkpoint.
- Russian scope: full professional Russian UI and the same approved English narration structure are being added as `ru` / `ru-RU`. The content path remains `scripts.json`; `locales/ru.json` mirrors every English locale key; the static Russian contract requires a Russian sibling for every English narration field. The product’s sequence, timing, safety boundaries, frequency behavior, and all English/Malayalam content are unchanged.
- Voice approval: the registry adds only the owner-approved `Piper Russian — Irina (Medium)` entry (`ru_RU-irina-medium`) with Piper’s published `ru` phonemizer path. No ONNX asset, source model configuration, registry identity of existing voices, or native synthesis setting has been changed. Published metadata confirms the model is medium quality at 22,050 Hz with phonemizer voice `ru`.
- Delivery/cache scope: the language manifest, fallback registry, app query version, shell/Piper/language cache names, Russian locale bundle, narration fields, Russian contract test, and npm test command are the only intended feature changes. `test-script.json` has no language-specific runtime schema and uses English fallback for new language custom scripts; `docs/dot.json` is an owner-deleted custom facilitator file and is explicitly untouched.
- Routing: the Loop large-context adapter selected `gpt-5.6-sol` / high for a read-only inventory, but its child did not return an output/session. The active environment performed the bounded fallback with static validation; do not claim automatic routed completion.
- Current static validation: PASS — `node --check app.js`, `node --check sw.js`, all language JSON parsing, `test:russian-language`, `test:language-intention`, `test:narration-ticker`, `test:background-music`, `test:spatial-audio`, `test:no-frequency`, and `git diff --check`. No Playwright, screenshots, browser run, or native-speaker listening was performed by owner direction. Before release, a native Russian review and target-device Piper first-download/preview/journey checks remain required.
- Compatibility correction: pre-Russian custom scripts containing English/Malayalam content are accepted on upload and when a Russian journey starts. `localized()` already falls back to English; validator fallback is now enabled only for custom bundles, while the built-in production bundle remains strict. The shared drone contract is currently blocked before its assertions by the owner-deleted `docs/dot.json`; a direct validator check passed for production Russian content, legacy strict rejection, and legacy custom English fallback.
- Delivery correction: the compatibility fix rotates the app query version and shell cache so installed PWAs do not retain the strict pre-fix validator.
- Loop refresh: `Loop/loop.md` was reread in full on 2026-08-31. It remains protected and unchanged. This is a `standard` production delivery checkpoint; model routing had no successful child dispatch, so the supervisor completed the source/validation review directly. Browser, screenshots, and Playwright remain intentionally unrun by owner direction.
- Feature freeze: the owner has frozen the complete delivered feature set at the next production checkpoint. Do not add, alter, or remove product behavior on `production` until explicitly reopened. The next approved scope is a separate **Add Language** feature and must begin on branch `add-language-feature` from this frozen checkpoint.
- Freeze validation: `production` baseline is `e898b05`; `Loop/loop.md` remains unchanged. Existing unrelated local changes are intentionally preserved and excluded from the freeze/feature branch.
- Continuity refresh: `Loop/loop.md` was reread in full and is unchanged, as required for its protected-policy status. This is a `light` documentation/continuity checkpoint: no model dispatch was needed or available, and no Playwright/screenshots are authorized. `TECH-STACK.md`, `communication-architecture.md`, `DEVELOPMENT-SAFETY.md`, and `.codex/context-index.md` are absent; the compact active handoff remains the continuity source for this static PWA.
- Voice-model approval boundary: do not alter a Piper voice’s ONNX model, original model configuration/document, registry identity, or synthesis character without the owner’s explicit confirmation. The current English-only change is limited to approved application-side cadence bounds; Malayalam, browser voices, and native model settings remain unchanged.
- Current baseline: `production` at `bbcdf36` (`[CP-AUDIO-031] Limit slower cadence to English Lessac`). Preserved unrelated local work remains `.DS_Store`, `audio/.DS_Store`, the deletion of `docs/dot.json`, and untracked `audio/BACKUP/background_music.mp3`; none is part of this checkpoint.
- Delivered checkpoint: `CP-AUDIO-031` — English Piper Lessac now has an English-only slower meditation cadence. Its registry alone opts into a `0.60` pace floor and a bounded `lengthScale` of `1.5`; all other Piper voices retain the former `0.70` floor and `1.35` ceiling. The earlier Lessac noise smoothing and altered warmth/clarity profile are removed: shared female voice tuning and native model texture remain unchanged.
- Validation: `static/unit` PASS — narration-ticker, background-music, and spatial-audio contracts; app/runtime/service-worker syntax; Piper registry JSON; and `git diff --check`. No Playwright/screenshots by owner direction; target-device listening is still the quality gate.
- Delivered checkpoint: `CP-AUDIO-025` / `daf4551` publishes the supplied `audio/background_music.mp3` replacement through a release-versioned URL (`?v=20260831.1`) and matching service-worker cache entry, preventing an installed PWA from reviving the old fixed-path cache. GitHub Pages deployment `33352808872` completed successfully; public bytes at that URL match the committed SHA-256 `64284891b930415e3e757862279fa474d8865b6255545d24357f3174529cd55f`.
- Echo repair: voice and background-music space use separate, filtered feedback-delay buses rather than randomized convolution. Both feedback gains are bounded below unity, automate with 250 ms transitions, retain dry signal clarity, and pass through the existing music/mantra gates. The music send originates after the music EQ/smoothing path, so echo tone matches the dry bed. Static routing contracts passed; actual sound balance still requires owner listening on target speakers/headphones.
- Delivered follow-up: `CP-AUDIO-027` / `9770f7a` removes the audible feedback-delay repetitions. Voice and Music Space now use deterministic, filtered diffuse reverb tails with no feedback loop, so the effect blurs and fades naturally rather than repeating words or beats. The app and shell cache versions are bumped for installed PWA delivery. Static contracts passed; target-device listening remains the release-quality gate.
- Delivered checkpoint: `CP-I18N-023` / `bc911ba` — changing **Meditation Language** recognizes generated English or Malayalam regular/HRIM intentions saved by either current or earlier releases, replaces them with the selected language’s equivalent, and persists the result immediately. A guide-written custom intention remains unchanged. The app shell cache is bumped so installed PWA clients receive the change.
- Validation: `static/unit` PASS — `npm run test:language-intention`, JavaScript syntax checks, locale JSON parsing, and `git diff --check`; no Playwright/screenshots by owner direction. The dedicated static test guards cross-language default recognition and persistence.
- Checkpoint: `CP-AUDIO-020` — ambience intensity, closer spatial pleasure ambience, stronger heavenly voice/music space, extended-but-tempered narration/mantra tails, and role-preserving Music `+`/`−` handling.
- Branch: `production`, baseline `3f898de`. The owner explicitly approved production push; this branch is already production, so no merge commit is required.
- Git checkpoint: `0bf5183` (`[CP-AUDIO-020] Refine immersive audio behavior`).
- Loop refresh: `Loop/loop.md` and the focused delivery/routing guidance were reread. Target application root is `/Users/lekshmisyam/Desktop/Ikigai/lite`; reusable-instructions root is `/Users/lekshmisyam/Desktop/Ikigai/lite/Loop`. Mapping tier remains `light`; no backend, database, auth, WebSocket, or external service is involved in this checkpoint.
- Routing: bounded `standard` audio/UI checkpoint. No separate automatic model dispatch was available in this host session; the supervisor performed the source review and fresh validation directly.
- Validation: `static/unit` PASS — `node --check app.js`, `node --check sw.js`, English/Malayalam locale JSON parsing, `npm run test:background-music`, `npm run test:spatial-audio`, `npm run test:audio-safety`, `npm run test:no-frequency`, and `git diff --check`. Playwright, screenshots, and manual listening were not run by owner direction.
- Commit scope: `HANDOFF.md`, `app.js`, `index.html`, `style.css`, `locales/en.json`, `locales/ml.json`, `sw.js`, `tests/background-music-mantra-echo.test.mjs`, and `tests/spatial-audio.test.mjs` only.
- Preserved external/unrelated work: `.DS_Store`, `audio/.DS_Store`, `audio/background_music.mp3`, untracked `audio/BACKUP/background_music.mp3`, and the existing deletion of `docs/dot.json`. The missing `docs/dot.json` prevents the content-safety fixture test and remains excluded pending owner direction.
- Follow-up checkpoint: English Piper currently has one bundled voice, `en_US-lessac-medium` (female). Its meditation pace multiplier is 0.74, matching English’s estimated reading baseline to Malayalam’s current 5.5 characters-per-second meditation pace while retaining the user Pace slider and leaving Malayalam Piper voices unchanged. `static/unit` validation passed: app/service-worker syntax, Piper registry JSON, narration ticker, background-music, spatial-audio, and audio-safety contracts, plus `git diff --check`.
- Next action: create the detailed local checkpoint commit for the English Piper pace adjustment; push only when the owner requests it.

### Active snapshot — 2026-08-30 (Asia/Kolkata)

- Branch: `yoga-refinement`, created from production commit `b0b9251` (`feat(audio): add configurable pleasure ambience source and blur`). Do not merge or push without explicit owner approval. The unrelated tracked macOS `.DS_Store` change must be preserved and excluded from feature commits.
- Current Yoga/Care implementation is uncommitted: Yoga retains only its selected poses, optional Corpse Pose, and standard Bath Session followed by the existing 15-minute guide-controlled rest. Perineal Care, Massage, and Assisted Bathing are now a dedicated Lobby **Intimate Service** section.
- Intimate Service follows the fixed selected-stage order `Perineal Care → Massage → Assisted Bathing`. Perineal Care and Assisted Bathing retain their existing timer and guide-controlled “ready to proceed” pause. Massage has no standalone timer or script stage: it runs a full forced seven-chakra `Crown → Third Eye → Throat → Heart → Solar → Sacral → Root` meditation wrapper and never overwrites the user's saved normal chakra selection.
- Focused-care narration correction: before any focused flow runs, it now awaits the already-started Piper warm-up that the normal icebreaker would otherwise provide. Massage also explicitly enters the Meditation screen before its Crown narration begins. This prevents the first guided care/chakra narration from racing Piper initialization or being rendered on the hidden Icebreaker screen while the mantra display advances.
- Mood & Relaxation recovery correction: the optional `audio/pleasure*` files are intentionally Git-ignored and can be absent in production. A failed local decode no longer hides or clears the Mood & Relaxation selection. The Journey Tuning section remains visible, shows a bilingual recovery message, and keeps the direct Audio URL field usable so the guide can load a replacement source on mobile.
- Chakra life-skills narration update is uncommitted: each production `meditation_en`/`meditation_ml` now includes the same practical, learnable skill cluster in English and Malayalam. Root: safety, self-care, resources, grounded decisions; Sacral: emotions, consent/boundaries, creativity, restorative joy; Solar: self-efficacy, confident choice, goals, resilience; Heart: compassion, trust, caring boundaries, relationship repair; Throat: communication, listening, support-seeking, respectful refusal; Third Eye: critical thinking, information discernment, attention, reflective decisions; Crown: values, meaning, perspective, humility, interdependence. These remain practice invitations rather than medical, psychological, or supernatural claims.
- The normal Reverse Journey preference/control has been removed. Its legacy local-storage key is cleared at preference load; new Intimate Service choices use `chakra_intimate_*` keys with one-time fallback from the former care keys. Experiment Mode no longer offers a standalone Massage activity.
- Static verification for the refinement passed: `node --check app.js`, `npm run test:yoga-experience`, `npm run test:focused-practices`, `npm run test:chakra-selection`, `npm run test:content-safety`, `npm run test:audio-safety`, locale JSON parsing, and `git diff --check`. No Playwright or screenshots were used.
- Latest committed application work loads pleasure ambience layers from tracked `audio/ambience-manifest.json`. The local-only source assets `audio/pleasure.mp3` and `audio/pleasure-1.ogg` are intentionally ignored by Git; future `pleasure-*` layers may use any browser-decodable audio extension and are discovered through the manifest.
- Uncommitted Journey Tuning work adds a persisted, validated Pleasure Audio URL input. A successful URL replaces only the manifest's primary `pleasure.<extension>` layer; numbered layers such as `pleasure-1.ogg` remain manifest-driven and continue to overlay. Invalid or CORS-blocked URLs are rejected before persistence, and the previous source is restored when possible. Emptying the field returns to the standard manifest source.
- Pleasure-cache follow-up revalidates the manifest and each pleasure file with `cache: 'no-store'`, bypasses service-worker cache reuse for pleasure requests, and clears decoded pleasure buffers whenever the ambience stops. Moving `pleasure.mp3` therefore cannot resurrect its old in-memory copy after a stop/restart; any still-present numbered layer, such as the current local `pleasure-1.ogg`, continues by design.
- Optional pleasure manifest 404s are now silent because missing local layers are expected during replacement; non-404 decode/network failures remain warnings, and user-supplied URL failures remain explicit errors.
- Journey Tuning now exposes a persisted Blur Intensity control for pleasure ambience. The previous effect was approximately 88% dry/12% wet; the new default is 65% dry/35% wet, bounded from 10% to 65% wet, while the existing blur toggle can still bypass the effect completely.
- Uncommitted pleasure-audio work adds a dedicated spatial panner with a 45-second far-to-near approach for Spatial Sound modes, a stereo fallback depth ramp, and a session-only soft blur path using a low-pass filter plus short convolution. Blur defaults on when Mood & Relaxation Ambience is enabled and can be toggled while preserving the clean source path. Every manifest layer shares this processing bus, and the profile is explicitly reapplied on initial start and stage-level re-entry so it remains consistent through the complete journey.
- Pleasure ambience remains bounded at a 0.2%–7.0% source-level range, fades through the existing five-second stop path, and remains separate from the centred narration route. Crossing above 5.0% requires a localized confirmation; cancelling restores the previous level. The app and shell cache versions are bumped for delivery. No claim is made that this percentage equals a calibrated decibel level.
- Audio fade audit checkpoint `CP-AUDIO-018`: the normal chakra path previously called `narrate(..., false)` and then immediately called `playMantraTrack()`, so no multi-second narration fade was scheduled before mantra. Piper clips used only a maximum 50ms end fade; browser speech has no Web Audio fade path. Background music could also be muted before a slow first-use mantra decode, creating an avoidable silent gap.
- CP-AUDIO-019 implementation now coordinates the handoff: the final Piper clip uses a centralized two-second exit fade only when handing off to mantra, ordinary clip boundaries retain the 50ms edge fade, and the browser-speech path documents its platform limitation while waiting for `speechSynthesis.onend`. Mantra music muting starts only after its buffer is decoded, preserving the already-ducked music bed during loading. Manual stop, finish, pause, and Experiment stop remain immediate safety paths; non-emergency Piper cancellation has a short 120ms gain ramp. Mantra/music/pleasure/drone stop paths retain their existing scheduled fades.
- Follow-up audio fix: the background music loop now uses the full 10-second entry envelope internally as well as on the outer music gain, and a restart resets the shared outer gain to zero first. This prevents a restarted loop from becoming audible through stale gain or the previous 3-second inner fade before the intended entry fade completes.
- Validation at this refresh: `static/unit` PASS — `node --check app.js`, every `tests/*.test.mjs` contract, and `git diff --check`. The background-music/mantra contract now covers URL input, persisted source selection, primary-layer replacement, numbered-layer preservation, and failure-safe restoration. No Playwright, screenshots, browser, or real-device evidence was used, per owner instruction.
- Model-router status: Loop routing configuration and the local Codex adapter are present, but no automatic model dispatch evidence is recorded for this checkpoint; do not claim routed execution.
- Loop status: authoritative policy and supporting routing/architecture files remain under `Loop/`; `Loop/loop.md` is unchanged and protected. The active handoff is the current continuity source; no additional Loop policy file needs modification for this refresh.
- Next exact step: perform real-device headphone/speaker listening checks for the coordinated fade package and remote Pleasure Audio URL/CORS behavior, then make a detailed feature commit if the owner approves; do not commit or push the current uncommitted pleasure-audio and fade work without explicit instruction.

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

### CP-AUDIO-007 — Session-only frequency Shots and script-defined Sleep Mode

- Date: 2026-08-16 (Asia/Kolkata).
- Branch: `shots-feature`; not merged or pushed.
- Added a Lobby-only Shots toggle with Meditation, High Energy, Sleep, and Custom Shot types. The common timing contract is 7 seconds by default and 20 seconds maximum; the selected mode is not persisted.
- Shots require explicit confirmation, play only a dedicated direct-frequency oscillator, exclude narration/mantra/background music, add two-second gaps between stages, and permanently disable the Shot controls after activation until refresh.
- Sleep Mode now loads its five stage frequencies and interval from `scripts.json.sleep_mode`. Only the missing `sleep_mode` schema fields were added to `test-script.json` and `docs/dot.json`; existing fixture content was preserved.
- Validation: `static/unit` PASS — JavaScript syntax, JSON parsing, drone-duration/Shot contract, content safety, zero-volume audio safety, assessment, journey handoff, HRIM timing, and `git diff --check`. No Playwright or screenshots were used.

### CP-ASSESSMENT-003 — Consultant insight review layer

- Date: 2026-08-17 (Asia/Kolkata).
- Branch: `assessment-insights`; not merged or pushed.
- Preserved the consultant-led interview structure, all 35 questions, the visible balanced-reference answers, private device-local autosave, notes, and manual new-client reset.
- Balanced references now remain green without appearing selected; the client’s recorded response receives the selection indicator. Every question has consultant-only topic, pattern-direction, follow-up, recurring-theme, and meditation-consideration metadata.
- Completing a chakra reveals a neutral consultant reflection containing reported strengths, patterns to explore, uncertainties, follow-up questions, client context, and a possible meditation consideration. Completing all 35 questions reveals a cross-chakra synthesis with conversation priorities and recurring themes.
- The synthesis cannot diagnose the client or alter the session plan. It explicitly requires the consultant to confirm observations with the client and manually approve any meditation focus.
- Extended `npm run test:assessment` to validate metadata alignment and a mixed-answer insight result. Bumped the PWA shell cache so installed clients receive the updated assessment.
- Validation: `static/unit` PASS — assessment contract, bilingual content-safety contract, script syntax, and `git diff --check`. No Playwright or screenshots were used; the browser surface was unavailable for live visual inspection.

## Documentation checkpoint

- Checkpoint: `CP-CONTEXT-001` — active audio-branch context refresh.
- Date: 2026-08-16 (Asia/Kolkata).
- Baseline `HEAD`: `99bc581` — `fix(audio): preserve exact script drone frequencies`.
- Pre-refresh status: clean `drone-duration-modes` working tree; local branch two commits ahead of `origin/production`, with no upstream and no push performed.
- Scope: documentation accuracy only. Runtime behavior, JSON content, locales, styles, tests, and protected `loop.md` are intentionally unchanged by this checkpoint.
- Validation: `static/unit` PASS — documentation consistency, current Git state, current cache/query versions, npm test inventory, `npm run test:drone-duration`, `npm run test:hrim-time`, and `git diff --check`. Browser/manual evidence is intentionally not part of this refresh.
- Next checkpoint: resolve the pending HRIM duration-mode policy; do not merge or push until explicitly requested.

### CP-SHOTS-001 — Searchable frequency repertory and one-second handoff

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Rebuilt `docs/repertory.html` as a searchable bilingual reference table. It covers the five supplied brainwave bands plus 174, 285, 396, 417, 432, 528, 639, 741, 852, and 963 Hz, including the previously absent 285 Hz and 432 Hz references.
- Added `data/frequency-repertory.json` as the reference metadata source for English/Malayalam names, focus, commonly associated features, search terms, category, source attribution, and a validated Shot value. Runtime narration and active audio frequencies remain authoritative in `scripts.json` and were not changed.
- Benefits are explicitly framed as traditional or commonly reported associations rather than diagnosis, treatment, cure, guaranteed brainwave entrainment, or another medical outcome. Brainwave ranges use clearly identified in-range reference tones for the single-frequency Shot handoff.
- Each row provides a `Prepare 1 sec Shot` action. It returns to the Lobby with only `shotSource=repertory` and the selected frequency, consumes those parameters immediately, validates the 0–20,000 Hz boundary, selects Custom Shot, resets its duration to the configured one-second default, and dispatches the existing Shots confirmation. Cancelling the confirmation leaves Shots inactive; confirming reveals the prefilled Custom Shot ready for deliberate activation.
- Updated the PWA shell cache and app query version so installed copies receive the catalog, page, and handoff. `docs/dot.json`, `test-script.json`, narration content, active audio frequencies, and the owner's in-progress documentation files remain unchanged.
- The Shot confirmation now tells the guide to disconnect Bluetooth or other external speakers before activation and makes the browser limitation explicit: Lite cannot disconnect an OS-managed Bluetooth audio connection itself.
- Validation: `static/unit` PASS — JavaScript syntax, repertory/search/handoff contract, exact-frequency drone contract, zero-volume audio safety, assessment contract, journey-completion handoff, HRIM availability, bilingual content safety, JSON parsing, and `git diff --check`. Browser/visual/manual evidence was not run, following the owner's instruction not to use Playwright or screenshots unless requested.

### CP-AUDIO-008 — No Frequency Mode

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Replaced the former Chakra Frequencies switch, which merely substituted a 110 Hz fallback, with an explicit persisted No Frequency Mode that defaults off.
- When enabled, normal guided journeys keep spoken narration and background music while skipping intentional frequency generators: chakra/HRIM drones, sleep-stage drones, binaural layers, the Eyes Close 40 Hz anchor, singing bowls, and mantra tracks. Enabling it during a journey stops those active frequency sources and cancels the current drone timer.
- Shots are frequency-only by design, so the Lobby toggle is disabled and direct activation is rejected with a localized explanation while No Frequency Mode is active. The drone-duration control is hidden because it has no effect in this mode.
- Updated the shell and language cache versions so installed PWA copies receive the changed application and bilingual labels. Updated the static test contract plus legacy E2E selectors without running Playwright, per the owner's instruction.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-PRACTICE-001 — Focused Box Breathing and Ho’oponopono

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Moved Box Breathing and Ho’oponopono from persistent Settings add-ons to session-only Lobby Experience Modes. Legacy saved add-on flags are removed on load and cannot cause either practice to appear in a normal chakra journey.
- Each practice now completes as its own guided experience: Box Breathing uses its existing timed visual/narrated breath routine; Ho’oponopono uses its existing narrated reflection sequence. Both retain background music and finish directly, without arrival, gratitude, chakra, or normal closing stages.
- Experience modes are mutually exclusive with one another, HRIM, Sleep, Music Only, and Shots. The Lobby shows a focused roadmap, suitable Begin action, and focused estimate; normal intention, returning-journey, core-duration, and drone controls are hidden while a focused practice is selected.
- Updated English/Malayalam labels, static contracts, and legacy E2E selectors. Bumped the shell and language caches for installed PWA updates.
- Validation: `static/unit` PASS — focused-practice contract, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, JavaScript/service-worker syntax, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-001 — Standalone Yoga Experience and optional chakras

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Removed Yoga Bridge from the normal chakra flow. Yoga can no longer be injected between Third Eye and Crown, so none of the seven chakra choices are structurally required, locked, or selected by default for a new client.
- Added Yoga Experience as a session-only Lobby Experience Mode. It uses the saved Yoga setup—selected poses plus optional Corpse Pose, Bath, Massage, Perineal Care, and Assisted Bathing—and finishes directly without meditation arrival, gratitude, chakra, or closing stages.
- Yoga setup remains in Settings, while the Yoga Experience selection is deliberately not persisted. Bath add-ons remain dependent on Bath Session; legacy `chakra_yoga_bridge` state is removed on load.
- Updated English/Malayalam terminology, help text, Lobby roadmap, focused estimates, legacy E2E selectors, and PWA cache versions.
- Validation: `static/unit` PASS — Yoga Experience/optional-chakra contract, focused-practice contract, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, JavaScript/service-worker syntax, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-002 — Lobby-owned Yoga Experience setup

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Moved the complete Yoga setup from normal Settings to an expandable Lobby panel that appears only when Yoga Experience is selected. It contains pose selection, preparation/per-pose timings, optional Corpse Pose, Bath Session, Perineal Care, Assisted Bathing, Massage, and their durations.
- Yoga setup choices now persist immediately from the Lobby, update the focused estimate and roadmap, and are used by the next Yoga Experience without requiring a return to Settings.
- Updated static E2E selectors to open Yoga Experience before operating Yoga controls. Bumped the application shell cache and app query so installed copies receive the relocated panel.
- Validation: `static/unit` PASS — Yoga Experience/optional-chakra contract, focused-practice contract, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, JavaScript/service-worker syntax, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-003 — Guide-controlled bath-to-Yoga rest module

- Date: 2026-08-21 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Added a reusable `runGuideControlledRest` module. It accepts its own timing, title, guidance, completion wording, and guide action, so later experience flows can use the same timer-plus-explicit-continue pattern without duplicating Yoga logic.
- When Bath Session is enabled, Yoga Experience now follows: optional Corpse Pose → selected care/bath stages → 15-minute quiet rest → guide-controlled Begin Yoga → Yoga introduction, preparation, and selected asanas. The rest does not appear when Bath Session is off.
- The rest is pause-aware and a stopped session cancels any pending guide action. The focused estimate and Lobby roadmap include the rest stage. Production timing is 900 seconds; the fast-test profile is one second.
- Updated English/Malayalam labels and PWA app/language cache versions. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-004 — Guide-controlled care-stage handoffs

- Date: 2026-08-21 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Generalized the earlier rest helper into `runGuideControlledTransition`, a reusable module that supports either a visible timed countdown or an immediate approval screen.
- Massage, Perineal Care, Bath Session, and Assisted Bathing now stop at their configured timer end and show “Ready for the next session?” The flow remains there until the guide selects “Proceed to Next Session”; it cannot auto-advance through a real-world delay.
- The existing Bath-to-Yoga rest remains a 15-minute timed use of the same module, followed by the guide-controlled Begin Yoga action. Stopping the session still cancels any pending transition.

### CP-SPLASH-001 — Full-image splash reveal

- Date: 2026-08-21 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Replaced the cropping `cover` splash treatment with a full-image `contain` reveal. The complete source image is visible first, then gently expands during the existing 2.5-second launch window.
- Added a dimmed, blurred Splash image backdrop so wide screens retain an immersive full-screen presentation without cropping the primary artwork. Reduced-motion preference disables the zoom.
- Added a static splash contract test. No Playwright, screenshots, or browser/manual evidence was run.

### CP-POLICY-002 — Loop 0.3 root package refresh

- Date: 2026-08-27 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Installed the supplied `Loop/` source package into the Lite repository root so its root policy documents, plugin manifest, Loop skill, delivery workflow, benchmark, installation guide, local/model routing policies, routing configuration, Codex adapter, and tests remain together with valid relative links.
- The original untracked source folder was moved, not deleted, to `/private/tmp/lite-loop-source-20260827` after the overlay. The root-level `communication-architecture.md` was already identical to the supplied version.
- Validation: Loop manifest/routing JSON parse PASS; six model-router unit tests PASS; `git diff --check` PASS.

### CP-AUDIO-009 — Null-safe No Frequency Mode activation

- Date: 2026-08-27 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Fixed No Frequency Mode activation before Web Audio initialization. `stopBinaural()` and `stopDrone()` now clear dormant node state and return safely when `AudioEngine.ctx` is still null, preventing the `currentTime` TypeError reported at the former line 1634.
- Added regression assertions for both null-safe stop boundaries and refreshed the PWA shell/app cache versions.
- Validation: JavaScript/service-worker syntax PASS; No Frequency Mode, zero-volume audio safety, bilingual content safety, and `git diff --check` PASS. No Playwright or screenshots were used.

### CP-AUDIO-010 — Fixed drone exposure window and continuous narration ticker

- Date: 2026-08-27 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Replaced core-practice-based drone duration with a fixed 20-second exposure reference: Beginner 4s, Intermediate 10s, Advanced 14s, and Expert 20s. Chakra, HRIM, Sleep, and Yoga drone paths use the shared timer; the previously unbounded Yoga grounding drone is now timed.
- Narration ticker behavior is continuous at the complete narration-block level rather than sentence-by-sentence. It clears on actual narration completion and cancellation. Mobile uses a modest speed increase constrained by a conservative voice-duration estimate so it does not intentionally outrun Piper or browser speech.
- Updated bilingual guidance and regression contracts. Validation: JavaScript syntax, narration ticker, drone-duration, and `git diff --check` PASS. No Playwright or screenshots were used.
- Remaining release evidence: real-device listening and visual UX validation; this checkpoint does not claim browser/manual evidence.

### CP-AUDIO-011 — Centered ethereal narration for Spatial Sound

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Spatial Sound now adds a restrained ethereal presence to narration through the existing voice-only ambience bus. The dry narration remains centered and unchanged, while only the stereo wet return receives a short delay, airy filtered tail, and gradual 13% wet mix.
- The effect is derived from the selected spatial mode: it activates for Stereo Wide, Headphone 3D, and Room Spatial, and returns to the guide's saved Voice Space preference when Spatial Sound is Off. The saved voice preference is not overwritten.
- Updated bilingual Spatial Sound guidance and bumped the application shell/app cache versions. No content schema or facilitator script fields changed.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, locale JSON parsing, spatial routing, background-music/mantra echo, drone-duration, bilingual content safety, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence were used.
- Open risk: headphone and speaker listening quality still needs real-device confirmation, especially perceived reverb level and intelligibility across spatial modes.

### CP-AUDIO-012 — Stage countdown and stronger ethereal presence

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Added a circular countdown indicator to the active meditation view. It is driven by the real remaining time for chakra practice, Sleep stages, Shots, Yoga pose holds, intervals, and final silence, and is hidden when no timed stage is active.
- Strengthened the Spatial Sound narration ambience to a perceptible but controlled 110 ms delay, 22% wet return, and 5 kHz filtered tail. The dry narration remains centered, and the saved Voice Space preference is restored when Spatial Sound is turned off.
- Updated cache versions, bilingual countdown/spatial guidance, and static regression contracts. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, locale JSON parsing, spatial audio, narration ticker, background-music/mantra echo, drone-duration, bilingual content safety, chakra selection, and `git diff --check`.
- Open risk: the new ambience level should be listened to on both headphones and speakers before release to confirm it feels ethereal without masking words.

### CP-AUDIO-013 — Journey-level countdown and quiet focus hierarchy

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Corrected the countdown behavior so it starts once from the estimated complete journey duration and remains continuous across preparation, narration, every chakra, intervals, silence, Sleep stages, Shots, Yoga poses, and closing transitions. It no longer resets to an individual chakra or stage timer.
- Kept the circular indicator compact and low-emphasis at the edge of the meditation overlay. The chakra symbol/deity image remains the primary visual focus; the mantra/title and progress dots are intentionally dimmed. The legacy timer node remains synchronized for compatibility but is visually suppressed to avoid a second, conflicting timer.
- Updated cache versions and static regression contracts. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-016 — Full-viewport ambient gradient and ring-only countdown

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Expanded the breathing tutorial’s live gradient across the full viewport with broad layered fields and slow-moving organic forms. Reduced brightness, saturation, and animation intensity so the effect remains atmospheric and comfortable for the eyes.
- Moved the countdown layer above the meditation screen stacking context so the mirrored rings remain visible during mantra playback and throughout the complete journey. Removed the numeric time and label content; only the small circular progress rings remain.
- Bumped cache versions and expanded the static regression contract. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS.

### CP-AUDIO-014 — Mirrored low-distraction journey countdown

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Repositioned the journey-level countdown as two smaller synchronized circular indicators pinned to the lower left and lower right screen corners, keeping them clear of the controls and reducing their visual weight.
- Removed the legacy text timer entirely. The circular indicators are now the only countdown display; both are updated from the same continuous session state and are hidden together when the session ends or a non-timed mode is active.
- Bumped cache versions and refreshed the static countdown regression contract. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS.

### CP-AUDIO-015 — Full-screen live chakra gradient and global countdown visibility

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Made the breathing tutorial a true full-viewport responsive layer with safe-area spacing and overflow handling. Added a slow, low-contrast live gradient made from blurred irregular forms, vibrant complementary colors, and the selected chakra color; no flashing or rapid brightness changes are used.
- Moved the mirrored circular countdown layer outside individual screen sections so it remains visible from journey preparation through completion. Its single continuous session estimate is now visible during the breathing tutorial instead of appearing only after the meditation screen opens.
- Bumped cache versions and expanded the static regression contract. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-017 — Session-only pleasure ambience intensity

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Added Gentle, Immersive, and Deep ambience profiles in Journey Tuning. The choice is deliberately session-only and resets to Gentle after reload.
- The existing 0.2–7.0% Ambience Level remains the source-level ceiling. Profiles instead change blur clarity, subtle harmonic texture, and the speed/proximity of spatial approach. Immersive and Deep make the optional pleasure layer cleaner and more present without changing other session audio paths.
- Optional local/URL asset recovery, the existing 5% confirmation, and all fade behavior remain unchanged.
- Brought the spatial source and end position closer in Stereo, Headphones, and Room. Language-cache rotation plus a readable fallback guard prevents raw `ui.*` keys from appearing while a device still holds an older language bundle.
- Validation: JavaScript/service-worker syntax, English/Malayalam locale JSON parsing, background-music, spatial-audio, audio-safety, and no-frequency static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-018 — More present background-music room

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Raised Background Music → Soft Room from 10% to 16% wet with a 65 ms delay, and Temple Air from 15% to 24% wet with a 110 ms delay. The convolved, low-passed echo remains music-only and continues to be fully muted with the background bus before mantra playback.
- Validation: JavaScript/service-worker syntax, background-music, spatial-audio, and audio-safety static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-019 — Heavenly narration ambience

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Raised Voice Space → Soft Room to 19% wet at 50 ms, Temple Air to 28% wet at 95 ms, and the automatic Spatial Sound ethereal return to 32% wet at 140 ms. The ethereal return opens to 5.6 kHz so it feels airy rather than muffled.
- Narration remains dry and centered; only its convolved wet return widens. Background music, mantra, frequency, and safety paths are unchanged.
- Validation: JavaScript/service-worker syntax, background-music, spatial-audio, audio-safety, and no-frequency static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-020 — Extended narration and mantra tails

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Extended narration’s convolved tail from 1.1 seconds to 3.0 seconds with a slow but clearer decay. Added a separate 3.6-second, low-passed 26% wet convolved tail for recorded mantra audio.
- The mantra tail follows the same spatial panner as the dry mantra. It does not enter the background-music or narration buses, so mantra handoff muting and volume controls remain independent.
- Corrected Music `+`/`−` handling: it now preserves whether the background is full, ducked below narration, or intentionally faded to silence. In particular, it cannot restart music during Box Breathing just by changing the level.
- Validation: JavaScript/service-worker syntax, background-music, spatial-audio, audio-safety, and no-frequency static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.
