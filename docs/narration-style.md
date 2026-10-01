# Narration style guide (all languages)

Owner direction, October 2026: the guide must sound **natural, meditative and confident**. Meditators were asking about the benefit because the old narration sounded doubtful, like giving up.

## The guide's voice
- Calm, warm and sure. Present tense. Say what happens: "Your breath slows. Your shoulders soften. Your mind is clear."
- Name the benefit as a felt experience: calm, steady, clear, focused, grounded, confident, rested, protected.
- No hedging: no "if it feels comfortable", "you may", "perhaps", "try to", "there is no need", "nothing needs to change", "realistic", "unforced", "not a promise". (Each language has the same rule.)
- Honest: no cures, no disease claims, no special powers, no "guaranteed". "Healing" only as inner or emotional healing.
- Safety stays where the body is involved (yoga, pelvic floor, bathing, massage, private care, consent), said once, briefly and calmly.

## Spoken, not written
- Short sentences (6–18 words, never over 150 characters). One idea per sentence.
- Everyday spoken words: everyday Hindustani, spoken-standard Malayalam and Tamil, living Russian. No calques, no office or tech words.
- At most three items in a list; prefer body, breath, light, warmth and earth images.
- No "...", dashes, quotes, brackets, emoji, digits, abbreviations or ALL CAPS.
- Gender-neutral: never "he/she"; Hindi uses neutral forms ("मुझे आपसे प्रेम है"); Russian avoids gender-revealing forms; the narrator never speaks with a gendered first person.

## How the voice reads text (engine)
- `modules/media-lifecycle.js` `splitNarrationText`: pieces keep their `. ? ! ।` so questions still sound like questions. A sentence over 180 characters breaks at its last comma, semicolon or colon (then a space).
- `modules/piper-narration.js`: 1.5 s pause after a full sentence; only 0.4 s after a piece cut at a comma.
- `modules/narration-speech-form.js`: voice-only respellings, screen text unchanged.
  - English: Lam/Vam/Ram/Yam/Ham → Lumm/Vumm/Rumm/Yumm/Humm, Om → Ohm, Chakra → Chukra, sadhak → saadhuk, Ho oponopono → Ho oh pono pono, pose names split ("Vriksha asana").
  - Russian: ALL-CAPS words become normal case (capitals are spelled letter by letter).
  - Hindi: लं मंत्र → लम् मंत्र (anusvara is read "n").
  - Malayalam/Tamil: long-vowel bija (വാം, യாம்) → short (വം, யம்).
- Check a word: `echo "word" | espeak-ng -q -v <en-us|hi|ml|ru|ta> --ipa` (Piper uses espeak-ng phonemes).

## Mantras
Root Lam, Sacral Vam, Solar Ram, Heart Yam, Throat Ham, Third Eye Om, Crown Aum, High energy Hreem — written in normal case in each script (ml ലം വം രം യം ഹം ഓം ഔം; hi लम् वम् रम् यम् हम् ॐ औम्; ta லம் வம் ரம் யம் ஹம் ஓம் ஔம்; ru Лам Вам Рам Ям Хам Ом Аум).

Tests: `tests/narration-speech-form.test.mjs`, `tests/english-chakra-qualities.test.mjs`, `tests/content-safety.test.mjs`.
