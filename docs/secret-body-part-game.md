# Hush Hush — game guide

Shown in the app as **Hush Hush** (Malayalam ഹഷ് ഹഷ്, Hindi हश हश, Tamil ஹஷ் ஹஷ், Russian Тсс-тсс), with the subtitle *“The icebreaker game for 2–7 players. Spin, guess, laugh.”* The code still uses the internal name Secret Body Part (`modules/secret-body-part-game.js`, `ui.sbp*` keys, `#secret-body-game-*` IDs).

A dev-mode icebreaker game for 2–7 players on one phone. Pure luck: no clues. Nothing is saved.

## Where to find it

1. Unlock dev mode (Advanced Features): Settings → About → tap the app version 7 times → password.
2. Go to the **Lobby** (Meditation Room screen). Under the **Mood & Relaxation Ambience** section, find the **🎲 Play Zone** section and tap **Play now** on the **🤫 Hush Hush** card.

Play Zone is the games section. New games are added as more cards inside it (`.play-zone-game`). It also holds **🎯 Contactless Eye Shooter** (see `docs/eye-shooter-game.md`) and **💞 Chakra Touch** (see `docs/chakra-touch-game.md`).

The panel is hidden while dev mode is locked. Locking dev mode also closes an open game. **Back to Meditation Room** returns to the Lobby.

## Players

Each player is a chakra, in this order:

| Player | Chakra |
|---|---|
| 1 | 🔴 Root |
| 2 | 🟠 Sacral |
| 3 | 🟡 Solar |
| 4 | 🟢 Heart |
| 5 | 🔵 Throat |
| 6 | 🟣 Third Eye |
| 7 | ⚪ Crown |

## How to play

1. **Setup:** choose players (2–7) and rounds (1–5). The chakra players appear as tags with their images.
2. **Secret cards:** a **Pass the phone to <chakra>** screen appears for each player. That player presses and holds **I am <chakra>** for 1 second (a quick tap does nothing). The card flips to show the body part; it hides by itself after 10 seconds. Tap **I've memorised it**.
3. **Spin (Step 1 of 3):** anyone taps **Spin the chakra wheel**. The wheel has one coloured slice and image per player and stops on the called player. Each round calls every remaining player once.
4. **Hand the phone over:** the called player holds the phone for the whole turn, opened again with press-and-hold.
5. **Guess (Step 2 of 3):** a coloured banner says **<CHAKRA> — you hold the phone**. A box shows who is guessing. Guessers only speak. The phone holder taps the word they heard on the 12-word board.
6. **Right or wrong (Step 3 of 3):** only after a word is picked, the green **✔ Right** and red **✘ Wrong** buttons appear — on the holder's honour.
7. **Result flash:** a full green or red screen (with a buzz and a short sound) says who got it or who guesses next. It moves on by itself after about 1.5 seconds, or tap **Continue**.
   - Right → the called player is **out**; the guesser gets ⭐.
   - All wrong → the called player survives and gets 🛡️.
8. **End:** after the last round, or when one player is left.

## Why the screens look like this (v2.0)

Owner feedback: players took each other's turns, and small text changes went unnoticed. So:

- **One person, one job per screen.** The phone holder is always the player whose part is being guessed.
- **Hand-off lock** on every change of hands (press and hold, ~0.9 s).
- **Whole screen takes the holder's chakra colour and image**, so a turn change is seen from across the room.
- **Result flash** after every answer; **big luck-card moment**; bigger text (one main instruction per screen); score chips with images, the current player glows.
- Respects *reduce motion*: the wheel stops at once and animations are off.

## Luck cards (about 1 spin in 4)

| Card | Effect |
|---|---|
| 🔄 Swap | Two players swap cards and each looks at the new card. |
| ✌️ Double Guess | The first guesser gets two tries. |
| 🛡️ Shield | The called player is safe this time. |
| ↩️ Reverse | The called player guesses another player's part. |
| ⚡ Lightning | Everyone shouts at once; the first shout counts. |

## Grand Reveal and Faker Catch

- All cards flip. The Secret Card, if any, flips last.
- If a player marked a correct guess as **Wrong**, they are caught as a **Faker 🤥** and lose their shields.
- Awards: **Lucky Survivor 🛡️**, **Sharp Guesser ⭐**, **Faker of the Night 🤥**.

## Secret Card (every 3rd game in a row)

- The app counts games played back to back on this page load.
- Before the 3rd game it shows an **18+** notice: play it only if everyone is an adult and happy with it, or **play without it**.
- If included, one random player gets the Secret Card instead of a normal card.
- The count resets after that game, or when the app is closed.

## Card words

- Normal cards: 29 outer body parts you can see or touch — Hair, Forehead, Eyebrow, Eyelash, Ear, Nose, Cheek, Chin, Jaw, Lips, Neck, Shoulder, Armpit, Elbow, Wrist, Palm, Thumb, Knuckle, Fingernail, Back, Waist, Navel, Lower stomach, Thigh, Knee, Calf, Ankle, Heel, Toe. No inner organs, no private parts.
- 18+ Secret Card words (only in the 3rd game in a row, after the group agrees): Pubic mound, Vagina, Breasts, Nipples, Penis. List: `SECRET_PARTS` in `modules/secret-body-part-game.js`. To change them, edit that list and add a matching `ui.sbpPart_<id>` translation in all five locale files.

## Technical notes

- Module: `modules/secret-body-part-game.js` v2.0 (lazy-loaded, offline-cached). Chakra images come from `symbols/<chakra>.png` (already offline-cached). `mount()` accepts `holdMs`, `flashMs`, `spinMs` and `cardHideMs` for tuning. Pure engine (`createEngine`) plus DOM view (`mount`).
- Tests: `tests/secret-body-part-game.test.mjs`, e2e in `tests/e2e/settings.spec.js`.
- Flow map: `secret-body-game` in `docs/app-map/index.html`.
- Languages: English, Malayalam, Hindi, Russian, Tamil.
