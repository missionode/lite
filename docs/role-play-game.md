# Walk in My Shoes — game guide

A dev-mode (Advanced Features) **role-play acting game** for two to four players, built to grow trust. Players take roles, speak and act as that person would, and a timer ends the role play with a soft chime. Nothing is recorded or saved: no camera, no microphone, no storage.

## Where to find it

1. Unlock dev mode (Advanced Features).
2. Lobby → **🎲 Play Zone** → **🎭 Walk in My Shoes** → **Play now**.

The card is hidden while dev mode is locked. Locking dev mode closes the game and lets the screen sleep.

## How to play

1. **Players** — choose 2, 3 or 4 players. Names are optional.
2. **Scene and roles** — choose a scene, then give each player a role (picking a role swaps it with whoever had it, so the scene is always complete). Each player taps *I'm happy to play*. This tap is not recorded.
3. **Roles are set** — only after everyone is happy and the roles are complete.
4. **Time** — 5, 10 (default), 15, 20 or 30 minutes. Press **Play**.
5. **Role play** — the screen stays awake and the clock counts down. **Pause** and **Resume** keep the remaining time. **Stop** ends it at once, without a sound.
6. **Time is up** — a soft chime plays, then three kind prompts (what you enjoyed about each other's role, what you noticed in yourself, one word for how you feel). **Swap roles and play again** rotates the roles.

## Scenes

| Scene | Roles |
| --- | --- |
| Radha and Krishna | Radha, Krishna (extra players: Friend) |
| The Storyteller and the Listener | Storyteller, Listener |
| The Teacher and the Curious Student | Teacher, Curious Student |
| The Guide and the Traveller | Guide, Traveller |
| The Interviewer and the Guest | Interviewer, Guest |
| Old Friends Meeting Again | Old Friend, Returning Friend |

With **more than two players only Radha and Krishna** is played; the other players join as their friends. Each scene shows a short opening line.

## Safety and trust

- Play only if you are happy to. Anyone can pause or stop at any time.
- The scenes are friendly and non-sexual; the Radha and Krishna scene is a friendship of full trust, play and care.
- The closing prompts ask players to step out of their roles and breathe together.

## Technical notes

- Module: `modules/role-play-game.js` v1.0 (lazy-loaded through the practice loader as `role-play`, offline-cached).
- Wake lock: the shared `modules/wake-lock.js` v1.0 (`ChakraWakeLock.create`), also used by journeys. It re-acquires the lock when the page becomes visible again.
- Timer: runs from a real end time, so it stays accurate even when the browser slows a background tab.
- Sound: a Web Audio three-note bell (no audio file). The audio is armed inside the Play tap because phones only allow sound after a tap. A short vibration is used where supported.
- Styling reuses the Eye Shooter panel styles; the form fields carry small inline styles because the CSS build was unavailable. Move them into `tailwind/legacy.css` on the next styling pass.
- Languages: English, Malayalam, Hindi, Russian, Tamil (Malayalam, Hindi, Russian and Tamil wording is a draft awaiting native review).
- Test: `npm run test:role-play`.
