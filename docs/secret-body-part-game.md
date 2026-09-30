# Secret Body Part — game guide

A dev-mode party game for 2–7 players on one phone. Pure luck: no clues. Nothing is saved.

## Where to find it

1. Unlock dev mode (Advanced Features): Settings → About → tap the app version 7 times → password.
2. Go to the **Lobby** (Meditation Room screen). Under the **Mood & Relaxation Ambience** section, find the **🎭 Secret Body Part** panel and tap **Play now**.

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

1. **Setup:** choose players (2–7) and rounds (1–5).
2. **Secret cards:** pass the phone. Each player taps their face-down card, remembers the body part, taps **I've memorised it**.
3. **Spin:** the chakra wheel calls one player. Each round calls every remaining player once.
4. **Guess:** the other players say one guess each, aloud. The called player taps the word on the 12-word board and marks **✅ Right** or **❌ Wrong** — on their honour.
   - Right → the called player is **out**; the guesser gets ⭐.
   - All wrong → the called player survives and gets 🛡️.
5. **End:** after the last round, or when one player is left.

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
- Before the 3rd game it asks: **include the bold Secret Card** or **play without it**.
- If included, one random player gets the Secret Card instead of a normal card.
- The count resets after that game, or when the app is closed.

## Card words

- Normal cards: 36 everyday body parts (face, arms, body, legs, organs). Private parts are not in this list.
- Secret Card words: `SECRET_PARTS` in `modules/secret-body-part-game.js` (currently Chest and Buttocks). To change them, edit that list and add a matching `ui.sbpPart_<id>` translation in all five locale files.

## Technical notes

- Module: `modules/secret-body-part-game.js` (lazy-loaded, offline-cached). Pure engine (`createEngine`) plus DOM view (`mount`).
- Tests: `tests/secret-body-part-game.test.mjs`, e2e in `tests/e2e/settings.spec.js`.
- Flow map: `secret-body-game` in `docs/app-map/index.html`.
- Languages: English, Malayalam, Hindi, Russian, Tamil.
