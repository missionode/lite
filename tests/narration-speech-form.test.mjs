import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Owner direction (Oct 2026): narration sounds natural, keeps its tone, and
// says mantra and Sanskrit names correctly. Screen text is never changed.
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('modules/narration-speech-form.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('modules/media-lifecycle.js', 'utf8'), context);
const { spokenForm } = context.ChakraNarrationSpeechForm;
const { splitNarrationText, isContinuationPiece } = context.ChakraMediaLifecycle;

// English: "Lam" must not sound like "lamb", nor "Ram" like the animal.
assert.equal(spokenForm('The Lam mantra. The Ram mantra. The Om mantra.', 'en'), 'The Lumm mantra. The Rumm mantra. The Ohm mantra.');
assert.equal(spokenForm('Your Chakra journey and chakras.', 'en'), 'Your Chukra journey and chukras.');
assert.equal(spokenForm('Ho oponopono', 'en'), 'Ho oh pono pono');
assert.equal(spokenForm('Lumm Ohm Chukra', 'en'), 'Lumm Ohm Chukra', 'respelling is idempotent');
// Russian: capitals are spelled letter by letter, so they become normal case.
assert.equal(spokenForm('Мантра ЛАМ и ОМ.', 'ru'), 'Мантра Лам и Ом.');
// Hindi: anusvara bija before मंत्र is read with "n"; use the halant form.
assert.equal(spokenForm('लं मंत्र', 'hi'), 'लम् मंत्र');
// Malayalam / Tamil: long-vowel bija spellings become short.
assert.equal(spokenForm('വാം മന്ത്രം റാം മന്ത്രം', 'ml'), 'വം മന്ത്രം രം മന്ത്രം');
assert.equal(spokenForm('யாம் மந்திரம்', 'ta'), 'யம் மந்திரம்');

// Pieces keep their sentence mark, so questions still sound like questions.
assert.deepEqual(Array.from(splitNarrationText('Breathe in. Are you ready? Yes! अब रुकें।')), ['Breathe in.', 'Are you ready?', 'Yes!', 'अब रुकें।']);
// "..." never makes empty pieces.
assert.deepEqual(Array.from(splitNarrationText('Rest... breathe.')), ['Rest.', 'breathe.']);
// A long sentence breaks at a comma, and that piece only gets a short breath.
const long = `${'Soft and slow, '.repeat(14)}now rest.`;
const pieces = Array.from(splitNarrationText(long));
assert.ok(pieces.length > 1 && pieces.every(piece => Array.from(piece).length <= 180));
assert.ok(pieces[0].endsWith(','), 'cut at a comma, not mid-phrase');
assert.equal(isContinuationPiece(pieces[0]), true);
assert.equal(isContinuationPiece(pieces.at(-1)), false);

// The narration engine applies both, for Piper and the browser voice.
const app = fs.readFileSync('app.js', 'utf8');
const piper = fs.readFileSync('modules/piper-narration.js', 'utf8');
assert.match(app, /isContinuationPiece: mediaLifecycle\.isContinuationPiece/);
assert.match(app, /splitNarrationText\(spokenForm\(text\)\)/, 'browser voice uses the same pieces and spoken forms');
assert.match(piper, /splitNarrationText\(spokenForm\(text\)\)/);
assert.match(piper, /isContinuationPiece\(sentences\[i\]\) \? Math\.min\(sentenceGap, 0\.4\)/);

// Every spoken script: no sentence longer than 150 characters, no hedging
// openers in English chakra and closing scripts, and no he/she wording.
const scripts = JSON.parse(fs.readFileSync('scripts.json', 'utf8'));
const english = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']
    .flatMap(chakra => [scripts[chakra].meditation_en, scripts[chakra].affirmation_en]).concat(scripts.closing.en, scripts.intro.gratitude_en);
for (const text of english) {
    for (const sentence of text.split(/(?<=[.!?])\s+/)) assert.ok(sentence.length <= 150, `long sentence: ${sentence}`);
}
assert.doesNotMatch(english.join(' '), /\b(he|she|him|her|his|hers)\b/i, 'the listener and guide stay gender-neutral');
const hindi = JSON.stringify(scripts).match(/"[a-z_]*_?hi"\s*:\s*"[^"]*"/g).join(' ');
assert.doesNotMatch(hindi, /करूँगा|करूँगी|करता हूँ|करती हूँ|सकता हूँ|सकती हूँ/, 'Hindi narrator never speaks with a gendered first person');

console.log('Narration speech form passed: respellings, tone-keeping pieces, comma breaks, short breaths and neutral, confident copy.');
