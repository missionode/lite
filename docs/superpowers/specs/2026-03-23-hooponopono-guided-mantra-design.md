# Ho'oponopono Guided Mantra — Design Spec

**Date:** 2026-03-23
**Project:** Chakra Meditation App (lite)
**Status:** Approved

---

## Overview

Add a guided Ho'oponopono mantra repetition segment at the end of every chakra meditation session. After the closing narration, the app speaks each of the four sacred phrases one at a time via TTS while displaying the text on screen. The user repeats each phrase silently in their heart. The cycle runs 3 times before the session completes.

---

## Session Flow (Updated)

```
runGratitude
  → runBoxBreathing
  → runSequence (or high_energy path)
  → runClosing             (normal path only)
  → runHooponopono         ← NEW (both paths)
  → finish()
```

### Normal path (`runSequence`)
Insert `await this.runHooponopono()` after `await this.runClosing()`, before `this.finish()` (line ~541 in app.js).

### High-energy path
Insert `await this.runHooponopono()` after `await this.handleSilence()`, before `this.finish()` inside the `isHighEnergy` block (lines ~402–405 in app.js). Note: `runClosing()` does **not** run on this path, so `runHooponopono()`'s visual transition step (Step 1) is the sole visual setup — it must fully stand alone without relying on any prior state from `runClosing()`.

---

## New Method: `runHooponopono()`

Added to `MeditationController` in `app.js`.

### Steps

1. **Visual transition**
   - Set `#aura-bg` to warm gold radial gradient: `radial-gradient(circle at center, #fff9c455, transparent)`
   - Fade `#chakra-symbol` opacity to `0.1`
   - Set `#mantra-display` to `"✦"`
   - Clear `#narration-text`

   > Note: On the normal path, `runClosing()` already sets `#mantra-display` to `"✦"` and `#aura-bg` to a violet gradient. The resets here are intentional — they ensure a clean visual state for the mantra segment regardless of future changes to `runClosing()`, and fully establish the visual state on the high-energy path where `runClosing()` does not run.

2. **Intro narration**
   - Speak `this.scripts.hooponopono.intro[state.language]` via existing `narrate()` method
   - Pause 2 seconds after

3. **3 cycles over 4 phrases**
   - For each phrase in `this.scripts.hooponopono.phrases[state.language]`:
     - Display phrase text in `#narration-text`
     - Call `narrate(phrase)` — uses existing slow/deep TTS settings
     - Pause 2 seconds before next phrase (raw `setTimeout`, acceptable for this short interval)
   - Repeat loop 3 times
   - Check `this.isMeditationActive` at the top of each cycle iteration

4. **Closing breath**
   - Clear `#narration-text`
   - Speak `this.scripts.hooponopono.closing[state.language]`
   - 3 seconds silence
   - Return (caller invokes `finish()`)

---

## scripts.json Additions

New top-level key `hooponopono`, using the same nested sub-key pattern as all other bilingual keys (e.g. `closing[state.language]`):

```json
"hooponopono": {
  "intro": {
    "en": "Now, let us close with a sacred prayer of forgiveness and love. Repeat each phrase gently in your heart.",
    "ml": "ഇപ്പോൾ, ക്ഷമയുടെയും സ്നേഹത്തിന്റെയും ഒരു പ്രാർഥനയോടെ നമുക്ക് ഈ യാത്ര അവസാനിപ്പിക്കാം. ഓരോ വാക്കും നിങ്ങളുടെ ഹൃദയത്തിൽ ആവർത്തിക്കൂ."
  },
  "phrases": {
    "en": [
      "I am sorry",
      "Please forgive me",
      "Thank you",
      "I love you"
    ],
    "ml": [
      "ഞാൻ ക്ഷമ ചോദിക്കുന്നു",
      "എന്നോട് ക്ഷമിക്കൂ",
      "നന്ദി",
      "ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു"
    ]
  },
  "closing": {
    "en": "Carry this love with you.",
    "ml": "ഈ സ്നേഹം നിങ്ങളോടൊപ്പം കൊണ്ടുപോകൂ."
  }
}
```

**Access pattern:**
```js
this.scripts.hooponopono.intro[state.language]
this.scripts.hooponopono.phrases[state.language]   // array of 4 strings
this.scripts.hooponopono.closing[state.language]
```

---

## Visual Specification

| Element | Value |
|---|---|
| `#aura-bg` | `radial-gradient(circle at center, #fff9c455, transparent)` |
| `#chakra-symbol` opacity | `0.1` |
| `#mantra-display` | `"✦"` |
| `#narration-text` | Each phrase, updated per utterance; cleared after final cycle |

No new CSS classes or HTML elements required.

---

## What Does NOT Change

- No new screens or HTML elements
- No changes to `AudioEngine`
- No changes to config screen or lobby
- No changes to box breathing or chakra sequence logic
- Drone/elemental audio continues playing in the background throughout

---

## Constraints & Guards

- All narration respects `state.language` (`"en"` or `"ml"`)
- `this.isMeditationActive` is checked at the top of each cycle — stops cleanly if the user taps stop
- Pause/resume works naturally since `narrate()` already integrates with `speechSynthesis`
- **Phrase strings in `phrases.en` and `phrases.ml` must not contain `.`, `!`, or `?`** — `narrate()` uses these as sentence boundaries and inserts a 500ms pause at each occurrence, which would break the intended rhythm
- The 2-second inter-phrase delays use raw `setTimeout` (not a pause-aware poll loop). This is acceptable given the short duration; the TTS pause/resume handles the user-visible pause behavior
