# Chakra Touch — game guide

A dev-mode (Advanced Features) **couples touch game for two players**. The wheel picks a place on the body, a card picks how to touch, and the one receiving keeps their eyes closed. It is slow, gentle and built on consent. Nothing is saved.

## Where to find it

1. Unlock dev mode (Advanced Features).
2. Lobby → **🎲 Play Zone** → **💞 Chakra Touch** → **Play now**.

The card is disabled while dev mode is locked. Locking dev mode also closes the game. **Back to Meditation Room** returns to the Lobby.

## Setup

- Names of both players (default "Player 1" / "Player 2").
- **Heat level**: 🌸 Warm, 🔥 Close, 🌶️ Spicy 18+.
- **Rounds**: 6, 10 (default) or 14.
- **Touch time**: 30 s, 45 s (default) or 60 s.
- **Swap Roles** (optional): each player plays the other player for the whole game.

**Spicy** asks both players to tick "I am an adult and I agree". Without both ticks the game offers **Play Close instead**.

## Private consent map

Before play, each player gets the phone in turn (press-and-hold hand-off lock) and marks every place **Yes / Maybe / No**.

- **No** is never picked.
- **Maybe** means the game asks first ("Asha, is Neck okay this time?"). **Not this time** skips that place for the round.
- Warm places start as Yes, closer places start as Maybe. The other player never sees the map.

## Places (outer body only, no genitals)

| Level | Places added |
|---|---|
| Warm | Scalp, Hair, Forehead, Temples, Shoulders, Upper back, Hands, Feet, Legs |
| Close | Ears, Neck, Chest, Waist, Stomach, Lower back, Hips, Thighs |
| Spicy 18+ | Breasts, Lower belly, Buttocks, Inner thighs |

Each place belongs to a chakra and shows its colour and image.

## A round

1. **Spin the chakra wheel** — it stops on an allowed place. Givers take turns every round.
2. **Touch card** — Feather fingertips, Warm still palm, Slow circles, Draw a letter (receiver guesses), Breath only, Receiver's choice; Close adds Gentle kiss; Spicy adds Slow trail.
3. About one round in five draws a **luck card**: Swap (the other player gives), Double time, Your choice (receiver picks the place), Slow motion.
4. The receiver closes their eyes. **Start** runs the timer ring. **Finish now** stops early.
5. The receiver rates: **More of this / Just right / Less of this**. "More of this" goes into the private summary.

**Pause** is on every game screen. It stops everything and offers Continue, Skip this round or End the game.

Every **3 rounds** a **check-in** asks: We are good / Go one level lower / End the game.

## Swap Roles

If turned on, an intro says "Asha now plays Ravi, and Ravi plays Asha". Each round adds a fun prompt (touch the way the other player likes, ask the way they ask, say their favourite line, react like them, dress up like them). At the end: **"Role swap ends. Back to yourselves."** and a reflection question. The wording is gender-neutral.

## End

A private summary of each player's "More of this" places. Nothing is stored. **Play again** or **Back**.

## Technical notes

- Module: `modules/chakra-touch-game.js` v1.0 (lazy-loaded via the practice module loader as `chakra-touch`, offline-cached). Exposes `ChakraTouchGame` with `createEngine`, `mount`, `LEVELS`, `ZONES`, `TOUCHES`, `LUCK_CARDS`, `SWAP_PROMPTS`, `CHECK_IN_EVERY`.
- To add a place, add it to `ZONES` with its chakra and level, then add `ui.ctZone_<id>` in all five locale files.
- Strings: `ui.chakraTouch*` and `ui.ct*` in `locales/{en,ml,hi,ru,ta}.json`.
- Tests: `tests/chakra-touch-game.test.mjs` (`npm run test:chakra-touch`); e2e in `tests/e2e/settings.spec.js`.
- Flow map: `chakra-touch` in `docs/app-map/index.html`.
