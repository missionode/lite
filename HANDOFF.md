# Chakra Meditation (Lite) — Handoff

Short, current and complete. Older checkpoints and release notes: `docs/handoff-archive/HANDOFF-history-2026-10-06.md` (history only; do not restart work from it).

## CURRENT RESUME — 2026-10-27

This is the active checkpoint. Read it first. Update this block (do not add a second one) before every handoff.

- **Branch:** `production` (the owner maintains code here). **Live:** `edf1577` — everything up to it is pushed (see "Recent changes").
- **Pushed to `production`: Walk in My Shoes (first release `f4bbab1`, then the 2/3/3+, no-story and spinner-wheel update), the shared wake-lock module and the offline-version fix; everything below is live.** Changes: (1) Continue to Earn shows only while developer mode (Advanced Features) is unlocked, never for Hindi; locking cancels a pending reveal. (2) The assessment is public: the Lobby button is always visible; value rounds and the private dot appear only in developer mode (public view = chakra questions and results). Files: `modules/completion-view.js`, `modules/assessment-tournament.js`, `modules/assessment-persistence.js`, `docs/assesment.html`, `app.js`, `index.html`, `sw.js`, tests, atlas maps `completion` and `assessment-tournament`, `FIX-QUEUE.md`, assessment `spec.md`. 134/135 unit tests pass; `tailwind-setup` fails only because the native `lightningcss` module is missing here (`npm install`). Not checked in a browser or on a phone.
- **Versions:** app `v4.42`, `tailwind.css?v=2.5`, shell cache `chakra-v5.390`, `completion-view.js?v=1.3`, `assessment-tournament.js?v=1.7`, `assessment-persistence.js?v=1.1`, language cache `chakra-language-v91`, piper cache `chakra-piper-v14`, `chakra-timing-view.js?v=1.1`.
- **Latest (2026-10-27, local, not pushed):** Nyasa petal chart in the syllabus (`#petals`): all fifty lettered petals with letter, quality and meaning from Woodroffe's *The Serpent Power*, Crown 1,000, total 1,050; data `data/petals.json`; Settings "Petal chart" link. Map `programme-syllabus`.
- **Earlier (2026-10-24):** a completed journey blends into silence (20 s fades, completion window after 10 s; map `completion`); the mantra finishes its current pass instead of fading mid-chant (0–27 s longer per chakra), and journeys that open into Arriving (Returning, HRIM, demo, Sleep, Music Only) start with a 5-second get-ready count. Map `standard`.
- **Earlier (2026-10-20):** Golden Ratio Shot (432 → 699 → 1131 Hz, map `shots`; 699 and 1131 Hz also in the Repertory, map `repertory`); Malayalam narration says സ്പർശനം; and Nyasa (installing the petals) in the newcomer orientation: one line defines Nyasa, the petals and the free choice of touch (own hand, trusted person, or attention) and explains the silences; per chakra its petal count and hand placement, a 10 s silence (Crown 15 s) with an on-screen cue, then "… is ready." Five languages (translations a draft; silence lengths need a felt check). Map `standard`.
- **Earlier (2026-10-13 to 10-15, pushed):** (1) Programme syllabus page `docs/syllabus.html` linked from Settings; app fonts DM Sans (text) and Cormorant Garamond (h1–h3), colours unchanged. (2) Syllabus edits: module cards folded into days 1–6 as "Practice focus", Day labels, "Points", no footer, and "The seven chakras" framework section plus a Day 1 introduction. Map `programme-syllabus`. (3) Repertory: 100, 175, 200, 310, 1000 Hz as a "Listening tone" family (translations a draft), family count computed. Map `repertory`. Local commits since the last push also include Voice Tuner, the ONNX bake converter, Syam 12 Oct model and the Shots changes; the owner pushes.
- **Checks:** 140/140 unit tests (2026-10-20); atlas 58 maps, verifier passed 2026-10-20, all 556 source references point at real code. Before/after screenshots in Chromium for every styling phase. Not yet checked on a phone or by listening.
- **Voice tuning (owner plan, 2026-10-12):** the owner tunes voices first in `docs/voice-tuner.html` (live loop: speed, expressiveness, rhythm, pitch, clarity, warmth, air, noise cleaner, volume), then exports the JSON. Only if the result is a great voice do we convert (converter ready: `scripts/bake_voice_tuning.py`, run with the TTS `.venv-asr` Python, writes a new folder): bake speed/expressiveness/rhythm defaults, EQ (one FIR filter) and volume into a copy of the voice's ONNX; pitch, formants, breathiness, compression and the noise cleaner stay app-side per voice. Possible later tuner additions: chest (≈150 Hz) and nasality (≈1 kHz) EQ. Do this in a fresh session.
- **Waiting on the owner:**
  1. Phone check of the new look (reload the PWA once so it picks up `tailwind.css?v=2.4`).
  2. Listening check of narration feelings (Pitch moods and one journey): which feel too strong or too weak.
  3. Browser or phone check of `edf1577`: finish a journey with developer mode locked and unlocked (Continue to Earn only when unlocked); run the assessment both ways (value rounds and the dot only when unlocked). Reload the PWA for cache `chakra-v5.368`.
- **Optional next:** Tailwind phase 7 — rewrite `tailwind/legacy.css` screen by screen when a screen is touched; Lite design-system artifact follow-ups (add Tamil, new components, merged colours, Inter weights).

## Recent changes (all live in `edf1577`)

| Change | Where | Notes |
| --- | --- | --- |
| Nyasa petal chart | `docs/syllabus.html`, `data/petals.json`, `index.html`, `locales/*.json` | 50 sourced petals + 1,000 Crown = 1,050; lotus chart, petal cards, searchable table; Settings link. Map `programme-syllabus`. Local, not yet pushed. |
| Journey end blends into silence | `app.js`, `modules/completion-view.js` | 20 s fades; completion window after 10 s quiet; Stop unchanged. Map `completion`. Local, not yet pushed. |
| Mantra finishes its pass; journey get-ready | `modules/media-lifecycle.js`, `modules/chakra-session.js`, `modules/audio-mantra-playback.js`, `app.js` | No mid-chant cut; 5-second get-ready before Arriving. Map `standard`. Local, not yet pushed. |
| Golden Ratio Shot | `modules/shot-session.js`, `scripts.json`, `index.html`, `locales/*.json` | 432 → 699 → 1131 Hz (×1.618), three stages, Lobby note. Map `shots`. Local, not yet pushed. |
| Nyasa in the orientation | `app.js`, `index.html`, `tailwind/input.css`, `locales/*.json` | Free-choice touch said once; per chakra petal count, hand placement, a guided silence (10 s, Crown 15 s) and a "ready" line. Map `standard`. Local, not yet pushed. |
| Repertory: five listening tones | `data/frequency-repertory.json`, `docs/repertory.html` | 100, 175, 200, 310, 1000 Hz as a new "Listening tone" family (five languages, translations a draft); family count now computed. Map `repertory`. Local, not yet pushed. |
| Programme syllabus + syllabus fonts | `docs/syllabus.html`, `index.html`, `tailwind/input.css`, `tailwind/legacy.css`, `locales/*.json` | Owner's 9-day programme page, unchanged, linked from Settings; app text DM Sans, headings Cormorant Garamond, Inter removed, colours kept. Map `programme-syllabus`. Local, not yet pushed. |
| Voice Tuner page | `docs/voice-tuner.html`, `piper/runtime/piper-tts-web.js`, `piper-worker.js` | Tune speed/expressiveness/rhythm plus pitch, clarity, warmth, air, noise cleaner and volume per voice, saved in the browser, export JSON for applying as defaults later. Local, not yet pushed. |
| Shots: Activate in section + countdown | `index.html`, `app.js`, `modules/shot-session.js`, `modules/lobby-experience-visibility.js` | Activate Shot button inside the Shots section (Begin hidden during Shots); Get ready 5-4-3-2-1 before the first tone; Speaker for Shots shown on phones and tablets only. Atlas `shots`. Local, not yet pushed. |
| Shots on one speaker | `modules/audio-tone-playback.js`, `modules/app-state.js`, `app.js`, `index.html` | Speaker for Shots: Both / Single speaker 1 / 2 with Test speaker; single routes play only one channel (bottom speaker once picked). Atlas `shots`. Needs the one-time test on the phone. Local, not yet pushed. |
| Syam custom Malayalam voice | `piper-models.json`, `piper/models/ml/ml_IN/syam/custom/`, `modules/voice-download-card.js` | Owner's own voice in the Malayalam list, served from the Lite folder, same effects as Arjun/Meera; Arjun stays default. Model updated to the 12 October 2026 training (Piper cache v14). Needs a listening check. Local, not yet pushed. |
| Video introduction: any orientation + loading meter | `tailwind/legacy.css`, `modules/journey-video-prelude.js`, `index.html`, `manifest.json` | Image and video fill the screen and turn with the device; loading card fits sideways; progress meter while loading. Atlas `restart`. Live in `a176eb3`. |
| Play the video introduction from the Lobby | `index.html`, `modules/media-controls-view.js`, `locales/*.json` | ▶ Play introduction beside the option plays the same prelude and returns to the Meditation Room; no journey starts. Atlas `restart`. Live in `6e58c33`. |
| Walk in My Shoes (role-play game) | `modules/role-play-game.js`, `modules/wake-lock.js`, `index.html`, `app.js`, `locales/*.json` | Developer-mode Play Zone game: players 2/3/3+, no scripted story, roles first, a spinner wheel decides the time, Play, screen stays awake, chime at zero. Radha and Krishna scene (only scene with three or more players). Shared wake-lock module replaces the inline manager. Recorded consent dropped. Guide `docs/role-play-game.md`. Live (`f4bbab1` and the update after it). |
| Optional-service offer out of the journey | `index.html`, `app.js`, `locales/*.json`, journey modules | Final Challenge removed from every journey; now a standalone developer-mode Lobby card (`optional-service-info-panel`), hidden for a care-first client. Care-first flag now survives page loads. Live in the commit after `6c7e3b8`. |
| Assessment ethics fix | `data/assessment-questions.json`, `modules/assessment-tournament.js`, `docs/assesment.html`, `app.js` | Neutral value pairs, no hidden weights, disclosure line; colour dot replaced by a labelled protective care-first note (developer mode), which also skips the optional-service question in Final Challenge. Live in the commit after `c4885d0`. |
| Assessment answer review | `modules/assessment-tournament.js` (`lowSupportAnswers`), `docs/assesment.html` | Collapsed read-only list under the result, both modes: question, chakra, answer given, higher-support option. No editing or recalculation. Live in `c4885d0`. |
| Developer-mode gates (Earn, assessment) | `modules/completion-view.js`, `modules/assessment-tournament.js`, `docs/assesment.html` | Continue to Earn only in developer mode (never Hindi). The assessment is public; its value rounds and private dot need developer mode (`includeValues`). Maps `completion`, `assessment-tournament`. |
| Tailwind v4 on the Lite design system, phases 0–6 | `tailwind/input.css`, `tailwind/legacy.css`, `tailwind.css` | One stylesheet, preflight on, `tw:` prefix, design-system colours only; violet `#7c3aed` / amber `#fbbf24` retired. Roadmap `docs/tailwind-roadmap.md`, map `styling-system`. |
| Separate time for each chakra | `modules/chakra-timing.js`, `modules/chakra-timing-view.js` | Switch under Core Practice Duration (off by default; normal chakra journeys only). Rows only for chakras chosen in Chakra Journey, padded tiles; "Fill times from assessment" suggests core + 50 % (max 7 min), applied only on Apply. Map `per-chakra-time`. |
| Benefits and safety FAQ | Settings title link and Settings help | Six questions, five languages. No "not medical" lines inside practices; placebo explained only in the FAQ. Map `benefits-safety`. |
| Narration feelings | `modules/narration-feeling.js`, `feelings` block in `scripts.json` / `demo-script.json` / `test-script.json` | Six presets (warm, tender, grounding, still, return, uplift) adjust Piper pace, noise and volume. Guide `docs/narration-feeling.md`. |
| 2-Minute Mind Reset (Pitch) | `modules/pitch-mode.js` | Mood tone (Calm 639, Courage 396, Energy 528, Focus 852 Hz, very soft, only when No Frequency Mode is off); music fades in 5 s, 6 s outro. Guide `docs/pitch-mode.md`. |

## Project facts

- **What it is:** a static, offline-first PWA for guided chakra meditation. Five languages: English, Malayalam, Hindi, Russian, Tamil (`locales/*.json`). Narration by Piper (on-device voices in a Web Worker) or browser voices.
- **Main files:** `index.html`, `app.js` (controller), `modules/*.js` (one owner per feature), `scripts.json` (journey content), `sw.js` (offline cache), `tailwind/*` → `tailwind.css`. Supporting pages: `docs/assesment.html`, `docs/repertory.html`.
- **Flow atlas:** `docs/app-map/index.html` is the shared visual reference. Edit `docs/app-map/atlas-data.mjs`, rebuild with `node docs/app-map/build-atlas.mjs`, check with `node docs/app-map/verify-atlas.mjs` when maps change. Planned work goes in `docs/app-map/FIX-QUEUE.md`.
- **Tests:** `node --test tests/*.test.mjs` (unit, all must pass). Playwright e2e exists; in the cloud sandbox 8 e2e tests always fail because media files are missing there.
- **Styling:** never edit `tailwind.css` by hand; run `npm run build:css` (`npm install` once on the Mac). See `AGENTS.md` → Styling.
- **Version bumps:** when a file changes, bump its `?v=` in `index.html` and `sw.js`, bump `CACHE_NAME` (and `LANGUAGE_CACHE_NAME` when locales change), then update the pinned versions in tests.
- **Saved on device (localStorage):** `chakra_lang`, `chakra_display_language`, `chakra_selected`, `chakra_per_chakra_time_enabled`, `chakra_per_chakra_times`, assessment `chakraAssessmentTournamentV1`. Settings backup includes the per-chakra times.

## Working rules (owner decisions that still hold)

- **Approvals:** the owner pushes. Never push, merge, deploy or rewrite history without the owner asking. Give one copy-paste push command.
- **Commits:** `git -c user.name=missionode -c user.email=nath.syam.1986@gmail.com commit`, detailed message, with the session attribution trailers.
- **Deleting:** not allowed in the connected folder; move files to `_to_delete/` instead.
- **Journey content:** keep the journey order, chakra frequencies and mantras unless the owner changes them. Preserve facilitator wording in scripts; add only missing language siblings, never partial new-language content. `demo-script.json` skips the Arrival/Emergence wrapper on purpose.
- **Frequencies:** the modern Solfeggio mapping is a product choice; never present it as anatomy, treatment or a classical fixed rule.
- **Piper voices:** do not change a voice's ONNX model, model config, registry identity or character without owner confirmation. Voice models are cached on demand by the service worker, never all precached.
- **`docs/dot.json`:** owner-managed facilitator bundle, currently absent. Do not create or fake it; `content-safety` skips it when missing.
- **Protected files:** `Loop/loop.md` is the collaboration policy; do not change it in routine work. Keep the dynamic sky as it is (see `AGENTS.md`).
- **Owner communication:** simple Indian English, short lines; decisions as A/B/C options with a recommendation; do not ask about routine work.

## How to update this file

1. Rewrite the CURRENT RESUME bullets (status, versions, checks, what is waiting, next step).
2. Add one row to "Recent changes" for each live feature; drop rows older than about two weeks into the archive.
3. Add a rule to "Working rules" only when the owner makes a lasting decision.
4. Keep this file under about 150 lines. Long notes belong in the feature guide (`docs/*.md`), the track (`.loop/tracks/`) or the atlas.
