# Pitch Mode — 2-Minute Mind Reset

A public marketing demo. Anyone can use it; dev mode is **not** needed.

## Where it is

Lobby (Meditation Room screen), **between Sound Shot and the Meditation Room**:

> **2-Minute Mind Reset** — Choose your feeling.
> 😌 Calm · 💪 Courage · ⚡ Energy · 🎯 Focus

One tap starts the session. There is no Rest mood, so nobody is sent to sleep in public.

## What happens

1. The fixed voice for the language is prepared (first time only: about 60 MB download).
2. A **2:00** countdown starts. Soft background music plays.
3. The guide speaks an opening, **four guided steps** and a closing. Quiet gaps are spread so the voice ends about 12 seconds before the two-minute mark.
4. The session ends on its own — **no statistics are saved** (a demo is not a journey).
5. An invite appears: **"That was 2 minutes. Imagine what 20 minutes could do for you."**
   - **Begin a full journey** → scrolls to the Meditation Room.
   - **Try another feeling** → scrolls back to the moods.

**Sitting or standing:** demos are often done standing, so every mood's opening welcomes the listener to sit or stand, and no step assumes a chair.

Close, Pause and the sound mixer work as usual. There is **no mantra, drone, chakra frequency or chakra visual** — voice-guided only.

## The four moods

| Mood | Aim | Guided steps (summary) |
|---|---|---|
| 😌 Calm | Slow down, feel light | soften jaw and face, loose hands and dropping shoulders, listen to near and far sounds, one calm thought |
| 💪 Courage | Stand tall, feel strong | tall posture, feet pressed into the ground, remember a hard thing you handled, "one step at a time" |
| ⚡ Energy | Wake up, feel fresh | three slow shoulder rolls, stretch arms high, shake out hands and wrists, a small smile |
| 🎯 Focus | Clear the mind | eyes on one point, notice three sounds and return, choose one next task, "one thing at a time" |

Wording stays honest: relax, pause, feel calmer or fresher. No healing or guaranteed-result claims.

## Fixed voice (does not follow Settings)

The **text follows the selected content language**. The **voice is fixed** — a young male Piper voice per language — and ignores the Settings voice and voice pace. After the demo, the Settings voice and pace are restored; nothing is saved.

| Language | Fixed Pitch voice | Piper id | Source |
|---|---|---|---|
| English | Ryan (US, male) | `en_US-ryan-medium` | rhasspy/piper-voices |
| Hindi | Pratham (male) | `hi_IN-pratham-medium` | rhasspy/piper-voices |
| Russian | Dmitri (male) | `ru_RU-dmitri-medium` | rhasspy/piper-voices |
| Malayalam | Arjun (male) | `ml_IN-arjun-medium` | rhasspy/piper-voices |
| Tamil | Rasa (male) | `ta_IN-rasa_male-medium` | tinisoft (community) |

- Pace is fixed at 1.0 (natural, lively) for Pitch Mode.
- Ryan, Pratham and Dmitri are marked `"pitchOnly": true` in `piper-models.json`, so they never appear in the Settings voice list or automatic voice choice.
- If a Piper voice cannot load (for example offline on first use), the browser voice for that language is used for that demo.
- To change a Pitch voice: edit `FIXED_VOICES` in `modules/pitch-mode.js` (and add the voice to `piper-models.json` with `"pitchOnly": true` if it is new). Tested alternatives: Hindi **Rohan** (`hi_IN-rohan-medium`), Russian **Denis** or **Ruslan**, English **Joe** (`en_US-joe-medium`).

## Technical notes

- Module: `modules/pitch-mode.js` (eager, offline pre-cached). `MeditationController.startPitch(mood)` in `app.js`.
- Text: `ui.pitch_*` keys in all five locale files (`pitch_<mood>_opening`, `_steps` ×4, `_closing`, `_title`, `_label`).
- Tests: `tests/pitch-mode.test.mjs`; e2e in `tests/e2e/settings.spec.js`.
- Flow map: `pitch-mode` in `docs/app-map/index.html`.

No breathing cues (owner, 2026-10-02): repeated "breathe in, breathe out" lines felt rushed in two minutes, so every mood now uses body, senses, movement or thought. A test keeps breathing words out of the Pitch steps in all five languages. The quiet gaps between lines (up to 14 seconds, spread evenly) give time to do each step.

## Narration feelings

Each Pitch line now carries a feeling (warm welcome, settling middle, mood-shaped close). See `docs/narration-feeling.md`.

## Mood tone

When No Frequency Mode is off, each mood has one very soft background tone (Calm 639 Hz Heart, Courage 396 Hz Root, Energy 528 Hz Solar Plexus, Focus 852 Hz Third Eye) at a third of the chakra drone level. It fades in over 8 s and out at the end. With No Frequency Mode on there is no tone; switching it on mid-session stops the tone at once.
