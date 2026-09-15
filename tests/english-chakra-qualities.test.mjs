import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scripts = JSON.parse(readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));

assert.match(scripts.sacral.meditation_en, /wholesome fun, lightness, and everyday happiness/i,
    'Sacral guidance should explicitly include fun and happiness without requiring a forced mood.');
assert.match(scripts.solar.meditation_en, /one steady period of deep work/i,
    'Solar guidance should connect purposeful action with a realistic deep-work practice.');
assert.match(scripts.thirdeye.meditation_en, /concentration, attention management/i,
    'Third Eye guidance should explicitly include concentration and attention management.');
assert.match(scripts.thirdeye.meditation_en, /Intelligence here is not a promise of special powers/i,
    'Intelligence language must remain grounded and avoid extraordinary claims.');
assert.match(scripts.thirdeye.meditation_en, /deep work unfold in a realistic, unforced period/i,
    'Third Eye guidance should frame deep work as a practical, unforced focus skill.');

console.log('English chakra qualities are mapped with grounded, non-promissory guidance.');

for (const [language, terms] of Object.entries({
    ml: { fun: 'വിനോദത്തിനും', deepWork: 'ആഴത്തിലുള്ള ഏകാഗ്രപ്രവർത്തന', concentration: 'ഏകാഗ്രത', intelligence: 'ബുദ്ധിശക്തി' },
    hi: { fun: 'स्वस्थ मनोरंजन', deepWork: 'गहरे एकाग्र काम', concentration: 'एकाग्रता', intelligence: 'बुद्धिमत्ता' },
    ru: { fun: 'здорового веселья', deepWork: 'глубокой сосредоточенной работы', concentration: 'концентрацию', intelligence: 'Интеллект' }
})) {
    assert.ok(scripts.sacral[`meditation_${language}`].includes(terms.fun), `${language} Sacral guidance must include grounded fun/happiness`);
    assert.ok(scripts.solar[`meditation_${language}`].includes(terms.deepWork), `${language} Solar guidance must include realistic deep work`);
    assert.ok(scripts.thirdeye[`meditation_${language}`].includes(terms.concentration), `${language} Third Eye guidance must include concentration`);
    assert.ok(scripts.thirdeye[`meditation_${language}`].includes(terms.intelligence), `${language} Third Eye guidance must include grounded intelligence`);
}

console.log('Malayalam, Hindi and Russian chakra quality migrations are present.');
