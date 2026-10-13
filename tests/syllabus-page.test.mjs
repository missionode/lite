import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const page = read('docs/syllabus.html');
const html = read('index.html');

// The programme syllabus page, kept as the owner published it, with a way back to the app.
assert.match(page, /<title>Chakra Meditation Programme<\/title>/);
assert.match(page, /family=Cormorant\+Garamond[\s\S]*?family=DM\+Sans/, 'same fonts as the artifact');
assert.match(page, /--accent: #c9a84c;/, 'same theme colours as the artifact');
assert.equal((page.match(/class="day-card" id="day\d"/g) || []).length, 9, 'nine days');
assert.equal((page.match(/class="module-card"/g) || []).length, 6, 'six modules');
assert.match(page, /<a class="back-to-app" href="\.\.\/index\.html">/, 'back to the app');
assert.match(page, /function toggle\(id\)/, 'days open and close');

// Linked from Settings, labelled in five languages.
assert.match(html, /<a id="syllabus-link" class="benefits-safety-link" href="docs\/syllabus\.html" data-i18n="ui\.syllabusLink">/);
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    assert.ok(JSON.parse(read(`locales/${language}.json`)).ui.syllabusLink, `${language} labels the syllabus link`);
}

console.log('Syllabus page passed: artifact content and theme, back link, Settings link, five languages.');
