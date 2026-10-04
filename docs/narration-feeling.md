# Narration feelings

Owner decision (2026-10-04): option A — add feeling to the offline Piper narration with small, bounded presets, and pilot it in the 2-Minute Mind Reset (Pitch Mode).

## Why presets

Piper voices have no emotion switch. Feeling comes from five things we control per line:

| Control | What it changes | Limits |
| --- | --- | --- |
| pace | speaking speed (Piper length scale = Settings value ÷ pace) | 0.85–1.08 |
| liveliness | Piper `noise_scale` multiplier: lower is calmer and flatter | 0.75–1.12 |
| rhythm | Piper `noise_w` multiplier: lower is steadier timing | 0.75–1.10 |
| closeness | clip volume: lower is softer and more intimate | 0.80–1.00 |
| pause after | extra silence after the line, seconds | 0–2 |

The runtime clamps liveliness and rhythm again (0.75–1.12) and keeps the existing length-scale cap, so a typo can never make the voice strain or crackle.

## The six feelings

| Feeling | Use it for | pace | liveliness | rhythm | closeness | pause |
| --- | --- | --- | --- | --- | --- | --- |
| warm | welcomes, invitations | 1.00 | 1.05 | 1.00 | 1.00 | 0 |
| tender | kindness, softening, letting go | 0.94 | 0.92 | 0.90 | 0.90 | 0.8 s |
| grounding | body, feet, posture, steady attention | 0.95 | 0.90 | 0.88 | 0.95 | 0.6 s |
| still | the deepest moment of a practice | 0.90 | 0.82 | 0.80 | 0.86 | 1.4 s |
| return | coming back, closing | 0.97 | 0.98 | 0.95 | 0.95 | 0.4 s |
| uplift | energy and courage lines | 1.04 | 1.10 | 1.05 | 1.00 | 0 |

## Pitch Mode arcs (opening, four steps, closing)

- Calm: warm → grounding → tender → still → still → return
- Courage: warm → grounding → grounding → warm → uplift → uplift
- Energy: warm → uplift → uplift → warm → uplift → uplift
- Focus: warm → grounding → still → still → grounding → return

## Feelings in the journey scripts

`scripts.json` (and `demo-script.json`, `test-script.json`) start with a `feelings` block: one feeling per narration field, the same for all five languages. Keys drop the language (`meditation_en` → `meditation`, `.en` → nothing); `*` matches a list index. When a journey speaks a line, Lite finds its field by exact text, or by its first 48 characters when the session adds text after it (for example a personal intention).

| Part | Feeling |
| --- | --- |
| Gratitude, returning welcome, waxing and full moon | warm |
| New and waning moon | tender |
| Root meditation and affirmation | grounding |
| Sacral | tender meditation, warm affirmation |
| Solar Plexus | warm meditation, uplift affirmation |
| Heart | tender |
| Throat | warm |
| Third Eye, Crown | still |
| Closing and its affirmation | return |
| High Energy | warm intention, uplift meditation and affirmation |
| Ho'oponopono | tender intro and phrases, return closing |
| Corpse Pose | still intro, return transition |
| Care sessions (bath, perineal, assisted bathing) | warm intro, grounding instructions, tender reminder |
| Massage | warm intro, tender instructions and reminder |
| Yoga | warm intro and next-pose prompt, grounding preparation and pose descriptions, return at the end |

Titles and names are shown on screen and have no feeling. A custom script can carry its own `feelings` block. Narration stored in the locale files (newcomer orientation, safety line, sleep stages, focused practices) has no feeling yet.

## Tagging other scripts later

Any narration line may start with a tag, for example `[tender] Let your shoulders soften.` Only the six names above are recognised; the tag is removed before speaking and never shown. Untagged lines behave exactly as before. Tag the same line in all five languages.

Writing still matters most: short sentences, sensory words, commas and full stops for breath, and no exclamation marks in calm practices.

## Files

`modules/narration-feeling.js` (presets, tags, arcs), `modules/piper-lifecycle.js` (per-line settings and cache key), `modules/piper-narration.js` (closeness and pause), `piper/runtime/piper-tts-web.js` (bounded noise factors), `modules/pitch-mode.js` (arcs), `tests/narration-feeling.test.mjs`.

## Evidence

Unit tests cover limits, tags, settings, arcs and wiring. Not yet verified: listening on a phone in all five languages. Each fixed Pitch voice (Ryan, Pratham, Dmitri, Arjun, Rasa) may react differently to liveliness and rhythm; adjust a preset only after listening.
