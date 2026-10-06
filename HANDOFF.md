# Chakra Meditation (Lite) — Handoff

Short, current and complete. Older checkpoints and release notes: `docs/handoff-archive/HANDOFF-history-2026-10-06.md` (history only; do not restart work from it).

## CURRENT RESUME — 2026-10-06

This is the active checkpoint. Read it first. Update this block (do not add a second one) before every handoff.

- **Branch:** `feature/narration-feeling`. **Production:** `b1c9e30` — everything on this branch is live (see "Recent changes").
- **Local, not committed or pushed (two changes):** (1) Continue to Earn shows only while developer mode (Advanced Features) is unlocked, never for Hindi; locking cancels a pending reveal. (2) The assessment is public: the Lobby button is always visible; value rounds and the private dot appear only in developer mode (public view = chakra questions and results). Files: `modules/completion-view.js`, `modules/assessment-tournament.js`, `modules/assessment-persistence.js`, `docs/assesment.html`, `app.js`, `index.html`, `sw.js`, tests, atlas maps `completion` and `assessment-tournament`, `FIX-QUEUE.md`, assessment `spec.md`. 134/135 unit tests pass; `tailwind-setup` fails only because the native `lightningcss` module is missing here (`npm install`). Not checked in a browser or on a phone. Commit and push are the owner's call.
- **Versions:** app `v4.30`, `tailwind.css?v=2.1`, shell cache `chakra-v5.368`, `completion-view.js?v=1.3`, `assessment-tournament.js?v=1.5`, `assessment-persistence.js?v=1.1`, language cache `chakra-language-v81`, piper cache `chakra-piper-v12`, `chakra-timing-view.js?v=1.1`.
- **Checks:** 135/135 unit tests; atlas 55 maps, verifier passed, all 556 source references point at real code. Before/after screenshots in Chromium for every styling phase. Not yet checked on a phone or by listening.
- **Waiting on the owner:**
  1. Phone check of the new look (reload the PWA once so it picks up `tailwind.css?v=2.1`).
  2. Listening check of narration feelings (Pitch moods and one journey): which feel too strong or too weak.
- **Optional next:** Tailwind phase 7 — rewrite `tailwind/legacy.css` screen by screen when a screen is touched; Lite design-system artifact follow-ups (add Tamil, new components, merged colours, Inter weights).

## Recent changes (all live in `b1c9e30`)

| Change | Where | Notes |
| --- | --- | --- |
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
