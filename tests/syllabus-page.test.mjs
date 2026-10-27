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
// The chakra system is introduced as the framework, before the days and in Day 1's Points.
assert.match(page, /<div class="section-title">The seven chakras<\/div>/);
assert.equal((page.match(/class="chakra-card"/g) || []).length, 7, 'seven chakra cards');
for (const name of ['Muladhara', 'Svadhisthana', 'Manipura', 'Anahata', 'Vishuddha', 'Ajna', 'Sahasrara']) assert.match(page, new RegExp(`<div class="chakra-name">[^<]*${name}<`));
assert.match(page, /<div class="talk-point">Introduce the chakra system as the map for all nine days/);
assert.doesNotMatch(page, /class="footer"|Evening sessions|English &middot; Malayalam/, 'no bottom footer');
assert.match(page, /<a class="back-to-app" href="\.\.\/index\.html">/, 'back to the app');
assert.match(page, /function toggle\(id\)/, 'days open and close');

// Linked from Settings, labelled in five languages.
assert.match(html, /<a id="syllabus-link" class="benefits-safety-link" href="docs\/syllabus\.html" data-i18n="ui\.syllabusLink">/);
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    assert.ok(JSON.parse(read(`locales/${language}.json`)).ui.syllabusLink, `${language} labels the syllabus link`);
}

console.log('Syllabus page passed: artifact content and theme, back link, Settings link, five languages.');

// Nyasa petal chart (owner, 2026-10-27): every petal's letter, place and quality from
// Woodroffe, The Serpent Power (1919); 50 lettered petals + 1,000 Crown petals = 1,050.
const petals = JSON.parse(read('data/petals.json'));
const lettered = petals.chakras.filter(chakra => Array.isArray(chakra.petals));
assert.deepEqual(lettered.map(chakra => [chakra.id, chakra.petals.length]), [['root', 4], ['sacral', 6], ['solar', 10], ['heart', 12], ['throat', 16], ['thirdeye', 2]]);
assert.equal(petals.chakras.find(chakra => chakra.id === 'crown').petals, 1000);
assert.deepEqual(petals.totals, { lettered: 50, crown: 1000, all: 1050 });
for (const chakra of lettered) for (const petal of chakra.petals) assert.ok(petal.letter && petal.iast && petal.attribute && petal.meaning, `${chakra.id} petal is complete`);
assert.deepEqual(lettered[0].petals.map(petal => petal.iast), ['vaṁ', 'śaṁ', 'ṣaṁ', 'saṁ'], 'Root letters as in the source');
assert.equal(lettered.find(chakra => chakra.id === 'thirdeye').petals.map(petal => petal.letter).join(' '), 'हं क्षं');
assert.match(petals.source.url, /archive\.org\/details\/x-the-serpent-power/, 'the source is named and linked');
assert.match(petals.note, /not as diagnosis or claims about health/, 'difficult qualities are offered for reflection');
assert.match(page, /<section id="petals" class="petal-section"/);
assert.match(page, /fetch\('\.\.\/data\/petals\.json'\)/, 'the chart reads the one data file');
assert.match(page, /id="petal-search" type="search"/);
assert.match(page, /50 lettered petals \+ 1,000 Crown petals = <strong>1,050<\/strong>/);
assert.match(page, /<a href="#petals">petal chart<\/a>/, 'Day 1 points facilitators to the chart');
assert.match(html, /<a id="petal-chart-link" class="benefits-safety-link" href="docs\/syllabus\.html#petals" data-i18n="ui\.petalChartLink">Petal chart<\/a>/);
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) assert.ok(JSON.parse(read(`locales/${language}.json`)).ui.petalChartLink, `${language} labels the petal chart link`);
console.log('Petal chart passed: 50 sourced petals + 1,000 Crown = 1,050, one data file, search, Day 1 pointer, Settings link in five languages.');
