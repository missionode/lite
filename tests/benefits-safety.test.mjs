import assert from 'node:assert/strict';
import fs from 'node:fs';

// Owner (2026-10-04): clients felt distress from "not medical" lines inside
// the practice. Medical clarity now lives in one Benefits and safety (FAQ)
// page, opened from Settings; the practice itself speaks only of benefits.
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const view = read('modules/settings-help-view.js');
const languages = ['en', 'ml', 'hi', 'ru', 'ta'];
const keys = ['faqButton', 'faqTitle', 'faqIntro', ...[1, 2, 3, 4, 5, 6].flatMap(i => [`faqQ${i}`, `faqA${i}`])];

assert.match(html, /id="benefits-safety-button"[^>]*data-i18n="ui\.faqButton"/, 'Settings shows a Benefits and safety link');
assert.match(html, /id="settings-help-faq"[^>]*data-i18n="ui\.faqButton"/, 'the Settings help also links to it');
assert.match(html, /id="benefits-safety-modal" class="modal hidden" role="dialog"/);
for (const key of keys.slice(1)) assert.match(html, new RegExp(`data-i18n="ui\\.${key}"`), `the FAQ shows ui.${key}`);
assert.match(view, /\['benefits-safety-button', 'settings-help-faq'\]/);
assert.match(view, /faq\.classList\.remove\('hidden'\)/);

const placebo = { en: /placebo/i, ml: /പ്ലാസിബോ/, hi: /प्लेसीबो/, ru: /плацебо/, ta: /பிளாசிபோ/ };
for (const language of languages) {
    const ui = JSON.parse(read(`locales/${language}.json`)).ui;
    for (const key of keys) assert.ok(ui[key]?.trim(), `${language} has ui.${key}`);
    assert.match(ui.faqA2, placebo[language], `${language} explains the placebo effect as the mind's own help`);
    assert.ok(ui.faqA5.includes(ui.noFrequencyMode), `${language} names ${ui.noFrequencyMode} for turning tones off`);
    // Practice and Lobby text carry no medical disclaimers any more.
    assert.doesNotMatch(ui.newcomerCentresNote, /medical|മെഡിക്കൽ|चिकित्सा|медицин|மருத்துவ/i, `${language} chakra note has no medical disclaimer`);
    assert.doesNotMatch(ui.moodRelaxationShotNote, /evidence|തെളിവ്|प्रमाण|доказ|ஆதாரம்/i, `${language} shot note has no evidence disclaimer`);
}
const en = JSON.parse(read('locales/en.json')).ui;
assert.match(en.faqA4, /does not diagnose or treat illness and does not replace your doctor/, 'the FAQ states clearly that this is not a medical treatment');
assert.match(en.faqA6, /pain, dizziness, weakness or loss of balance/, 'the full Yoga safety list lives in the FAQ');

const scripts = read('scripts.json');
assert.doesNotMatch(scripts, /medical|health advice|your doctor|not a substitute|evidence for/i, 'narration has no medical disclaimers');
const repertory = JSON.parse(read('data/frequency-repertory.json'));
assert.doesNotMatch(JSON.stringify(repertory), /Evidence for a frequency-specific effect|प्रमाण सीमित|доказательства эффекта|சான்று குறைவு|തെളിവുകൾ പരിമിതമാണ്/, 'the repertory data has no evidence disclaimers');
console.log('benefits and safety: ok');
