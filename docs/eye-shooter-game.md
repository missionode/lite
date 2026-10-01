# Contactless Eye Shooter — game guide

A dev-mode (Advanced Features) **no-touch gaze practice game for two**, for people who find it hard to look at someone (gaze avoidance). The app only **explains** the game. It has no camera, no eye tracking and saves nothing.

## Where to find it

1. Unlock dev mode (Advanced Features).
2. Lobby → **🎲 Play Zone** → **🎯 Contactless Eye Shooter** → **How to play**.

The card is hidden while dev mode is locked. Locking dev mode also closes the screen. **Got it** or **Back to Meditation Room** returns to the Lobby.

## How to play

1. Sit face to face with your partner. Use only your eyes.
2. Pick a spot on your partner from the points table.
3. Look at that spot and **hold your focus for 3 seconds**.
4. **Blink once** — that is your shot. Add its points.
5. Keep going until you reach your goal.

## Points (easy spots fewer points, hard spots more)

| Points | Spots |
|---|---|
| 1 | Ears, Back, Hair |
| 2 | Nose, Chin, Shoulders |
| 3 | Lips, Navel, Armpits |
| 4 | Breasts |
| 5 | Eyes (eye contact), Pubic mound |

All spots are always shown (owner choice: dev mode is the only gate). The screen says: play only with a partner who agrees.

## How much to play

A points goal: **Short 15**, **Medium 30** (default), **Long 50**. Players keep the score in their head or say it aloud.

## Technical notes

- Module: `modules/eye-shooter-game.js` v1.0 (lazy-loaded via the practice module loader, offline-cached). Data: `SPOT_TIERS`, `GOALS`, `HOLD_SECONDS`; `pointsFor(spot)`.
- To change the points, edit `SPOT_TIERS` and add `ui.esSpot_<id>` in all five locale files.
- Tests: `tests/eye-shooter-game.test.mjs`; e2e in `tests/e2e/settings.spec.js`.
- Flow map: `eye-shooter` in `docs/app-map/index.html`.
- Languages: English, Malayalam, Hindi, Russian, Tamil.
