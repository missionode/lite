import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scripts = JSON.parse(readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));

assert.match(scripts.sacral.meditation_en, /wholesome fun, lightness, and everyday happiness/i,
    'Sacral guidance should explicitly include fun and happiness without requiring a forced mood.');
assert.match(scripts.solar.meditation_en, /one steady period of deep work/i,
    'Solar guidance should connect purposeful action with a realistic deep-work practice.');
assert.match(scripts.thirdeye.meditation_en, /concentration/i,
    'Third Eye guidance should explicitly include concentration.');
assert.match(scripts.thirdeye.meditation_en, /intelligence/i,
    'Third Eye guidance should include grounded intelligence.');
// Owner direction (Oct 2026): the guide speaks with calm confidence. No
// doubtful or "giving up" hedges, and still no extraordinary claims.
const chakraNarration = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']
    .map(chakra => `${scripts[chakra].meditation_en} ${scripts[chakra].affirmation_en}`).join(' ');
assert.doesNotMatch(chakraNarration, /\b(perhaps|maybe|you may|you might|if it feels comfortable|not a promise|realistic|unforced|nothing needs to|no need to)\b/i,
    'Chakra narration must sound confident, not doubtful.');
assert.doesNotMatch(chakraNarration, /\b(cure|guarantee|special powers)\b/i, 'Confidence never becomes an extraordinary claim.');

console.log('English chakra qualities are mapped with confident, grounded guidance.');

for (const [language, terms] of Object.entries({
    ml: { fun: 'ലളിതമായ ആനന്ദത്തിനും', deepWork: 'ആഴത്തിൽ ഏകാഗ്രമായി പ്രവർത്തിക്കാൻ', concentration: 'ഏകാഗ്രത', intelligence: 'ബുദ്ധിശക്തി' },
    hi: { fun: 'सहज आनंद', deepWork: 'गहरे, एकाग्र काम', concentration: 'एकाग्रता', intelligence: 'बुद्धिमत्ता' },
    ru: { fun: 'простого живого веселья', deepWork: 'глубокой сосредоточенной работы', concentration: 'концентрацию', intelligence: 'интеллект' }
})) {
    assert.ok(scripts.sacral[`meditation_${language}`].includes(terms.fun), `${language} Sacral guidance must include grounded fun/happiness`);
    assert.ok(scripts.solar[`meditation_${language}`].includes(terms.deepWork), `${language} Solar guidance must include realistic deep work`);
    assert.ok(scripts.thirdeye[`meditation_${language}`].includes(terms.concentration), `${language} Third Eye guidance must include concentration`);
    assert.ok(scripts.thirdeye[`meditation_${language}`].includes(terms.intelligence), `${language} Third Eye guidance must include grounded intelligence`);
}

console.log('Malayalam, Hindi and Russian chakra quality migrations are present.');
