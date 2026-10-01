# Heavenly Sound — audio tuning guide

Goal: a crisp, smooth, "voice from above" feel that never strains the listener, with good phone performance.

## What changed (2026-10-01)

| Area | Before | Now | Why |
|---|---|---|---|
| Voice in Eyes Close mode | Whole mix (voice too) low-passed at 1 kHz, presence −12 dB | Voice has its own clean bus and skips the Eyes Close chain. Music/drone/mantra soften to 1.6 kHz, presence −6 dB | Words were muffled; listeners had to strain |
| Voice polish | Warmth + clarity only | + mud cut 320 Hz (−2 dB), soft de-ess 6.5 kHz (−3 dB), air shelf 8 kHz (+2 dB, +1 dB eyes closed), 90 Hz low cut | Bright, open voice; no stinging "s" |
| Voice echo | 5 s tail, 35 ms pre-delay, 3–3.6 kHz top | 3.5 s heavenly tail, 70 ms pre-delay, 280 Hz low cut, 5.5–6.5 kHz top, ducked to 55% under words and blooming back over 0.9 s in pauses | Clean words first, then a halo |
| Echo names | Off / Soft Room / Temple Air | Off / Soft Halo / Heavenly (same saved values `off` / `light` / `spacious`) | Matches the new sound |
| Reverb shape | Plain decaying noise (mantra tail random per device) | `createHeavenlyImpulse`: soft early reflections, highs fade faster than lows, 6 ms fade-in, energy matched to the old impulse, deterministic seeds | Airy not hissy; same space on every phone; same loudness |
| Music echo | Light 2.8 kHz, Spacious 3.4 kHz / 35 ms | Light 3.4 kHz, Spacious 4.2 kHz / 45 ms on the heavenly impulse | More open space |
| Frequency carving | Boosted 2.5 kHz on the whole mix during narration | Dips music/drone/mantra 2.5 kHz by 2 dB (3 dB eyes closed) | Makes room for the voice |
| Master compressor | −24 dB, 3:1, 10 ms / 250 ms | −18 dB, 2:1, 30 ms / 600 ms | No pumping or "breathing" |
| Limiter | −1 dB hard knee, 1 ms | −2 dB soft knee, 3 ms / 250 ms | Peaks caught smoothly |
| Exciter | Tiny distortion in open-eyes mode | Clean pass-through always | Never harsh over long sessions |
| 40 Hz grounding hum | On in Eyes Close mode | Removed | Phones can't play it; it pushed the compressor |
| Drone repeats | Feedback 0.45 | 0.30 | Smoother, less muddy |
| Sample rate | Forced 44.1 kHz | Device default (usually 48 kHz) | No resampling: less CPU, cleaner |

## Where to tune

- Voice polish and routing: `modules/audio-engine-initialization.js`.
- Echo presets and duck: `modules/audio-voice-effects.js` (`voiceEchoSettings`, `ECHO_DUCK`).
- Music echo presets: `modules/audio-music-echo.js`.
- Eyes Close targets: `modules/audio-comfort-effects.js`.
- Reverb shape: `createHeavenlyImpulse` in `modules/audio-signal-design.js`.
- Tail lengths: `VOICE_REVERB_TAIL_SECONDS` (3.5) and friends in `app.js`.

## Checks

- Unit tests pin every value above (`audio-engine-initialization`, `audio-voice-effects`, `audio-comfort-effects`, `audio-signal-design`, `audio-music-echo`, `spatial-audio`, `background-music-mantra-echo`, `no-frequency-mode`).
- A Chromium render of AUM and the background music through old vs new echo kept the same peak level (0.82 / 0.79).
- Real listening on phone speaker and headphones is still the final judge.
