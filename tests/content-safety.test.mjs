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

for (const section of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy']) {
  for (const language of ['en', 'ml']) {
    assert.ok(scripts[section][`meditation_${language}`], `${section} ${language} meditation is required`);
    assert.ok(facilitatorScripts[section][`meditation_${language}`], `${section} ${language} fixture meditation is required`);
    assert.ok(testScripts[section][`meditation_${language}`], `${section} ${language} test meditation is required`);
    assert.equal(scripts[section][language], undefined, `${section}.${language} duplicates the canonical meditation field`);
    assert.equal(facilitatorScripts[section][language], undefined, `${section}.${language} fixture duplicate must stay removed`);
    assert.equal(testScripts[section][language], undefined, `${section}.${language} test duplicate must stay removed`);
  }
}

for (const bundle of [scripts, facilitatorScripts, testScripts]) {
  for (const language of ['en', 'ml']) {
    assert.ok(bundle.closing[language], `closing.${language} is the canonical closing narration`);
    assert.equal(bundle.closing[`meditation_${language}`], undefined,
      `closing.meditation_${language} duplicates the canonical closing field`);
  }
}

for (const [language, bundle] of [['en', en], ['ml', ml]]) {
  assert.ok(bundle.ui.safetySummary, `${language} lobby safety summary is required`);
  assert.ok(bundle.system.prePracticeSafety, `${language} guided preparation narration is required`);
}

assert.match(ml.system.prePracticeSafety, /മാർഗദർശി/u, 'Malayalam preparation should use the requested മാർഗദർശി spelling');
assert.doesNotMatch(ml.system.prePracticeSafety, /മാർഗ്ഗദർശി/u, 'Malayalam preparation should not use the older മാർഗ്ഗദർശി spelling');

assert.match(app, /contentT\('system\.prePracticeSafety'\)/, 'runtime must narrate the guided preparation');
assert.doesNotMatch(app, /contentT\('system\.groundingSupport'\)/, 'runtime must not add a global crisis narration');
assert.match(app, /meditationMatch[\s\S]*?parentPath[\s\S]*?meditationMatch\[1\]/,
  'legacy section-level language narration must remain import-compatible');
assert.match(app, /meditation_\$\{final\}/,
  'legacy closing meditation fields must remain import-compatible');

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
  /guaranteed healing/i,
  /aura (?:guarantees|ensures) (?:complete|total|absolute) protection/i,
  /nothing (?:negative|harmful) can (?:touch|reach|affect) you/i,
  /this (?:meditation|chakra|aura) (?:will|can) cure/i,
  /your chakra is (?:blocked|damaged|diseased)/i,
  /you must (?:forgive|release|heal)/i,
  /പൂർണ്ണമായ സൗഖ്യം ഉറപ്പാണ്/u,
  /ഒന്നിനും നിങ്ങളെ സ്പർശിക്കാനാവില്ല/u,
  /നിങ്ങളുടെ ചക്രം (?:തടസ്സപ്പെട്ടിരിക്കുന്നു|തകരാറിലായിരിക്കുന്നു)/u,
  /നിങ്ങൾ (?:ക്ഷമിക്കണം|വിട്ടയക്കണം|സൗഖ്യപ്പെടണം)/u,
];

for (const claim of prohibitedClaims) {
  assert.doesNotMatch(productionCopy, claim, `prohibited certainty or healing claim returned: ${claim}`);
}

for (const chakra of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy']) {
  assert.ok(scripts[chakra].affirmation_en, `${chakra} English affirmation is required`);
  assert.ok(scripts[chakra].affirmation_ml, `${chakra} Malayalam affirmation is required`);
}

const auraJourney = {
  en: [
    scripts.intro.gratitude_en,
    ...['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].map(chakra => scripts[chakra].meditation_en),
    scripts.closing.en,
  ].join(' '),
  ml: [
    scripts.intro.gratitude_ml,
    ...['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].map(chakra => scripts[chakra].meditation_ml),
    scripts.closing.ml,
  ].join(' '),
};
assert.match(auraJourney.en, /receiv/i, 'English journey must retain the Receiving theme');
assert.match(auraJourney.en, /aura/i, 'English journey must retain the Aura theme');
assert.match(auraJourney.en, /healing/i, 'English journey must retain the Healing theme');
assert.match(auraJourney.ml, /സ്വീകരി/u, 'Malayalam journey must retain the Receiving theme');
assert.match(auraJourney.ml, /പ്രഭാവലയം/u, 'Malayalam journey must retain the Aura theme');
assert.match(auraJourney.ml, /സൗഖ്യ/u, 'Malayalam journey must retain the Healing theme');
assert.match(scripts.root.meditation_en, /grounded|grounding/i, 'Aura progression must begin with grounding');
assert.match(scripts.solar.meditation_en, /clear boundary/i, 'Aura progression must strengthen boundaries');
assert.match(scripts.heart.meditation_en, /healing/i, 'Heart practice must centre healing without promising a cure');
assert.match(scripts.thirdeye.meditation_en, /discernment/i, 'Aura protection must include discernment');
assert.match(scripts.crown.meditation_en, /sacred protection/i, 'Crown practice must integrate sacred protection');
assert.match(scripts.closing.en, /familiar or new/i, 'Closing must welcome both local clients and travellers');

const malayalamChakraNames = {
  root: 'മൂലാധാര ചക്രത്തിലേക്ക്',
  sacral: 'സ്വാധിഷ്ഠാന ചക്രത്തിലേക്ക്',
  solar: 'മണിപൂര ചക്രത്തിലേക്ക്',
  heart: 'അനാഹത ചക്രത്തിലേക്ക്',
  throat: 'വിശുദ്ധ ചക്രത്തിലേക്ക്',
  thirdeye: 'ആജ്ഞാചക്രത്തിലേക്ക്',
  crown: 'സഹസ്രാര ചക്രത്തിൽ',
};
for (const [chakra, canonicalName] of Object.entries(malayalamChakraNames)) {
  assert.match(scripts[chakra].meditation_ml, new RegExp(canonicalName, 'u'),
    `${chakra} should use only its canonical Malayalam chakra name`);
}
assert.doesNotMatch(
  Object.values(malayalamChakraNames).map((_, index) =>
    scripts[['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'][index]].meditation_ml).join(' '),
  /റൂട്ട്|സാക്രൽ|സോളാർ പ്ലെക്സസ്|തൊണ്ടചക്ര|മൂന്നാം കണ്ണ് ചക്ര|കിരീടചക്ര/u,
  'Malayalam chakra narration must not mix English or explanatory chakra names',
);
assert.match(scripts.intro.gratitude_ml, /പൂർണ്ണമായി എന്നിൽ ശ്രദ്ധിക്കൂ/u);
assert.match(scripts.intro.moon.waning_ml, /പിൻവാങ്ങുന്ന ചന്ദ്രനെ തിരിച്ചുവരവിന്റെ പ്രതീകമായി/u);

const englishChakraNames = {
  root: 'Root Chakra',
  sacral: 'Sacral Chakra',
  solar: 'Solar Plexus Chakra',
  heart: 'Heart Chakra',
  throat: 'Throat Chakra',
  thirdeye: 'Third Eye Chakra',
  crown: 'Crown Chakra',
};
for (const [chakra, canonicalName] of Object.entries(englishChakraNames)) {
  assert.match(scripts[chakra].meditation_en, new RegExp(canonicalName),
    `${chakra} should use its canonical English chakra name`);
}
assert.doesNotMatch(
  Object.keys(englishChakraNames).map(chakra => scripts[chakra].meditation_en).join(' '),
  /Muladhara|Svadhisthana|Manipura|Anahata|Vishuddha|Ajna|Sahasrara/,
  'English chakra narration must not add a second Sanskrit chakra name',
);
assert.match(scripts.intro.gratitude_en, /full attention to my voice/i);
assert.match(scripts.intro.moon.waning_en, /waning moon can symbolize return/i);

assert.match(scripts.hooponopono.intro.en, /optional/i);
assert.match(scripts.hooponopono.intro.ml, /വേണമെങ്കിൽ മാത്രം/u);
assert.match(scripts.closing.en, /awareness you cultivated/i);
assert.match(scripts.closing.ml, /വളർത്തിയ അവബോധം/u);
assert.match(scripts.bath_session.intro.en, /sadhak guide/i);
assert.match(scripts.bath_session.intro.ml, /സാധകന്റെ മാർഗ്ഗനിർദ്ദേശം/u);
assert.match(scripts.yoga.intro.en, /stop for pain/i);
assert.match(scripts.yoga.intro.ml, /വേദന/u);

console.log('Content safety contract passed for English and Malayalam.');
