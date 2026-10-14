import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const page = read('docs/syllabus.html');
const html = read('index.html');

// The programme syllabus page, from the owner's artifact, with a way back to the app.
assert.match(page, /<title>Chakra Meditation Programme<\/title>/);
assert.match(page, /family=Cormorant\+Garamond[\s\S]*?family=DM\+Sans/, 'same fonts as the artifact');
assert.match(page, /--accent: #c9a84c;/, 'same theme colours as the artifact');
assert.equal((page.match(/class="day-card" id="day\d"/g) || []).length, 9, 'nine days');
// Owner edit (2026-10-14): practice text lives inside its day, labelled Day, not Module; no footer.
assert.doesNotMatch(page, /class="module-card"|A gentle way in|>Modules</, 'no separate module cards or count');
assert.equal((page.match(/<div class="day-section-title">Practice focus<\/div>/g) || []).length, 6, 'days 1–6 carry their practice');
assert.match(page, /<div class="day-module-label">Day 01 &middot; Breathe<\/div>/);
assert.doesNotMatch(page, /Module 0\d|Oral Talking Points/, 'Day labels and "Points"');
assert.match(page, /<div class="day-section-title">Points<\/div>/);
assert.doesNotMatch(page, /class="footer"|Evening sessions|English &middot; Malayalam/, 'no bottom footer');
assert.match(page, /<a class="back-to-app" href="\.\.\/index\.html">/, 'back to the app');
assert.match(page, /function toggle\(id\)/, 'days open and close');

// Linked from Settings, labelled in five languages.
assert.match(html, /<a id="syllabus-link" class="benefits-safety-link" href="docs\/syllabus\.html" data-i18n="ui\.syllabusLink">/);
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    assert.ok(JSON.parse(read(`locales/${language}.json`)).ui.syllabusLink, `${language} labels the syllabus link`);
}

console.log('Syllabus page passed: artifact content and theme, back link, Settings link, five languages.');
