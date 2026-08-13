import assert from 'node:assert/strict';
import fs from 'node:fs';

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const scripts = readJson('scripts.json');
const testScripts = readJson('test-script.json');
const facilitatorScripts = readJson('docs/dot.json');
const en = readJson('locales/en.json');
const ml = readJson('locales/ml.json');
const app = fs.readFileSync('app.js', 'utf8');

function collectSchemaPaths(value, path = '', output = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaPaths(item, `${path}[]`, output);
    return output;
  }
  if (!value || typeof value !== 'object') return output;
  for (const [key, child] of Object.entries(value)) {
    // Underscore-prefixed entries are production metadata, not script fields.
    if (key.startsWith('_')) continue;
    const nextPath = path ? `${path}.${key}` : key;
    output.add(nextPath);
    collectSchemaPaths(child, nextPath, output);
  }
  return output;
}

const productionSchema = collectSchemaPaths(scripts);
for (const [name, fixture] of [['test-script.json', testScripts], ['docs/dot.json', facilitatorScripts]]) {
  const fixtureSchema = collectSchemaPaths(fixture);
  const missing = [...productionSchema].filter(path => !fixtureSchema.has(path));
  assert.deepEqual(missing, [], `${name} is missing production script fields`);
}

for (const section of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'closing', 'high_energy']) {
  assert.equal(facilitatorScripts[section].meditation_en, facilitatorScripts[section].en,
    `${section} English custom narration must be preserved`);
  assert.equal(facilitatorScripts[section].meditation_ml, facilitatorScripts[section].ml,
    `${section} Malayalam custom narration must be preserved`);
}

for (const [language, bundle] of [['en', en], ['ml', ml]]) {
  assert.ok(bundle.ui.safetySummary, `${language} lobby safety summary is required`);
  assert.ok(bundle.system.prePracticeSafety, `${language} guided preparation narration is required`);
}

assert.match(app, /contentT\('system\.prePracticeSafety'\)/, 'runtime must narrate the guided preparation');
assert.doesNotMatch(app, /contentT\('system\.groundingSupport'\)/, 'runtime must not add a global crisis narration');

const globalJourneyCopy = JSON.stringify({
  en: { lobby: en.ui.safetySummary, preparation: en.system.prePracticeSafety },
  ml: { lobby: ml.ui.safetySummary, preparation: ml.system.prePracticeSafety },
  closing: scripts.closing,
  heart: { en: scripts.heart.affirmation_en, ml: scripts.heart.affirmation_ml },
});
for (const alarmingGlobalCopy of [
  /qualified health professional/i,
  /trusted (support )?person/i,
  /emergency/i,
  /driv/i,
  /operating equipment/i,
  /യോഗ്യതയുള്ള ആരോഗ്യവിദഗ്ധ/u,
  /വിശ്വസിക്കുന്ന ഒരാള/u,
  /അടിയന്തര/u,
  /വാഹനമോടി/u,
  /യന്ത്രങ്ങൾ/u,
]) {
  assert.doesNotMatch(globalJourneyCopy, alarmingGlobalCopy,
    `global guide-led journey copy must remain calm and proportionate: ${alarmingGlobalCopy}`);
}

const productionCopy = JSON.stringify({ scripts, en, ml });
const prohibitedClaims = [
  /intuition has never been wrong/i,
  /what you decide, happens/i,
  /everything is happening for you, in perfect order/i,
  /money flows to you easily/i,
  /every need[^.]*is met/i,
  /most healing words in the universe/i,
  /ripples of healing through time/i,
  /your finances are accelerating/i,
  /what you have been calling in is at the door/i,
  /every intention you hold right now gains momentum/i,
  /നിങ്ങളുടെ അന്തർജ്ഞാനം ഒരിക്കലും തെറ്റിയിട്ടില്ല/u,
  /നിങ്ങൾ തീരുമാനിക്കുന്നത് സംഭവിക്കുന്നു/u,
  /പണം എളുപ്പത്തിലും സമൃദ്ധമായും/u,
  /പ്രപഞ്ചത്തിലെ ഏറ്റവും രോഗശാന്തി നൽകുന്ന/u,
];

for (const claim of prohibitedClaims) {
  assert.doesNotMatch(productionCopy, claim, `prohibited certainty or healing claim returned: ${claim}`);
}

for (const chakra of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy']) {
  assert.ok(scripts[chakra].affirmation_en, `${chakra} English affirmation is required`);
  assert.ok(scripts[chakra].affirmation_ml, `${chakra} Malayalam affirmation is required`);
}

assert.match(scripts.hooponopono.intro.en, /optional/i);
assert.match(scripts.hooponopono.intro.ml, /ഐച്ഛിക/u);
assert.match(scripts.closing.meditation_en, /awareness you cultivated/i);
assert.match(scripts.closing.meditation_ml, /വളർത്തിയ അവബോധം/u);
assert.match(scripts.bath_session.intro.en, /keep the device dry/i);
assert.match(scripts.bath_session.intro.ml, /ഉപകരണം വെള്ളത്തിൽ നിന്ന്/u);
assert.match(scripts.yoga.intro.en, /stop for pain/i);
assert.match(scripts.yoga.intro.ml, /വേദന/u);

console.log('Content safety contract passed for English and Malayalam.');
