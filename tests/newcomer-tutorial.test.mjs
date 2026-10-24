import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('app.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const manifest = JSON.parse(readFileSync('language-manifest.json', 'utf8'));
const requiredKeys = ['newcomerOrientationIntro','newcomerRootNarration','newcomerSacralNarration','newcomerSolarNarration','newcomerHeartNarration','newcomerThroatNarration','newcomerThirdEyeNarration','newcomerCrownNarration','newcomerOrientationClosing','newcomerGuidedStatus','skipCurrentItem','root','sacral','solar','heart','throat','thirdEye','crown','newcomerRootLocation','newcomerSacralLocation','newcomerSolarLocation','newcomerHeartLocation','newcomerThroatLocation','newcomerThirdEyeLocation','newcomerCrownLocation'];
const focusOrder = ['root','sacral','solar','heart','throat','thirdeye','crown'];

assert.match(html, /id="newcomer-tutorial-screen"/);
assert.match(html, /id="newcomer-aura-scene"/);
assert.match(html, /id="newcomer-chakra-symbol"/);
assert.match(html, /id="newcomer-chakra-name"/);
assert.match(html, /id="newcomer-chakra-location"/);
for (const chakra of focusOrder) assert.match(html, new RegExp(`data-focus="${chakra}"`));
assert.match(html, /id="newcomer-guided-status"/);
assert.equal((html.match(/id="skip-meditation"/g) || []).length, 1, 'the session must expose exactly one Skip control');
assert.doesNotMatch(html, /newcomer-silhouette|newcomer-centre-dots/);
assert.doesNotMatch(html, /YOUR FIRST CHAKRA JOURNEY|A gentle introduction|You do not need prior knowledge/);

for (const { id, localeSource } of manifest.languages) {
  const ui = JSON.parse(readFileSync(localeSource, 'utf8')).ui;
  for (const key of requiredKeys) assert.ok(ui[key]?.trim(), `${id} needs ui.${key}`);
  if (id !== 'en') assert.notEqual(ui.skipCurrentItem, JSON.parse(readFileSync('locales/en.json', 'utf8')).ui.skipCurrentItem, `${id} Skip label should be translated`);
}

const eligibility = app.slice(app.indexOf('    shouldShowNewcomerTutorial()'), app.indexOf('    async runNewcomerGuidedOrientation()'));
assert.match(eligibility, /!state\.returningJourney/);
for (const id of ['high-energy-toggle', 'music-only-toggle', 'sleep-mode-toggle']) {
  assert.match(eligibility, new RegExp(`!getChecked\\('${id}'\\)`));
}
assert.match(eligibility, /!this\.getFocusedExperience\(\)/);

const start = app.slice(app.indexOf('    async start()'), app.indexOf('    async runGratitude()'));
assert.match(start, /const newcomerChoice = this\.shouldShowNewcomerTutorial\(\) \? 'guided' : 'skip';/);
assert.ok(
  start.indexOf('newcomerChoice') < start.indexOf('this.showDndReminderIfNeeded()'),
  'newcomer eligibility must be decided before DND reminder, audio setup and Arriving'
);
assert.match(app, /runSessionItem\('newcomer orientation', \(\) => this\.runNewcomerGuidedOrientation\(\)\)/);
assert.match(app, /contentT\(narrationKey\)[\s\S]*?if \(!this\.isMeditationActive\) return;[\s\S]*?showScreen\(icebreakerScreen\)/);
assert.match(app, /newcomerOrientationIntro/);
const css = readFileSync('tailwind/legacy.css', 'utf8');
assert.match(css, /newcomer-aura-scene\[data-active-chakra="root"\]/);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.match(start, /newcomerChoice === 'guided'[\s\S]*?runNewcomerGuidedOrientation\(\)/);

console.log('newcomer tutorial contracts passed');

// Chakra orientation: the spoken name matches the name on screen, and each
// line states the benefit with confidence (no "can be", "is considered").
const orientation = [['root', 'Root'], ['sacral', 'Sacral'], ['solar', 'Solar'], ['heart', 'Heart'], ['throat', 'Throat'], ['thirdEye', 'ThirdEye'], ['crown', 'Crown']];
const hedges = { en: /\b(can|may|might)\b|is placed/i, ml: /കാണാം|സൂചിപ്പിക്കാം|ക്ഷണിക്കാം/u, hi: /माना जाता|सकता है/u, ru: /может|располагается/i, ta: /கருதப்படுகிறது|லாம்/u };
for (const { id, localeSource } of manifest.languages) {
  const ui = JSON.parse(readFileSync(localeSource, 'utf8')).ui;
  for (const [nameKey, part] of orientation) {
    const narration = ui[`newcomer${part}Narration`];
    assert.doesNotMatch(narration, hedges[id], `${id} ${nameKey} orientation must sound confident`);
    const sameName = id === 'ru' ? !['solar', 'thirdEye'].includes(nameKey) : true;
    if (sameName) assert.ok(narration.includes(ui[nameKey]), `${id} ${nameKey}: the voice says the on-screen name "${ui[nameKey]}"`);
  }
}
assert.equal(JSON.parse(readFileSync('locales/en.json', 'utf8')).ui.thirdEye, 'Third Eye');
console.log('Chakra orientation names match the screen and sound confident in all languages.');

// Nyasa in the orientation (owner, 2026-10-20): the compressed version. Touch is the practitioner's
// free choice, said once with what the silences mean; each chakra gets its petal count and where a
// hand rests, a silence to feel and install the petals (shown on screen), then a short "ready" line.
const parts = orientation.map(([, part]) => part);
const nyasaKeys = ['newcomerMatrikaIntro', 'newcomerMatrikaStay', ...parts.flatMap(part => [`newcomerMatrika${part}`, `newcomerMatrika${part}Ready`, `newcomerPetals${part}`])];
for (const { id, localeSource } of manifest.languages) {
  const ui = JSON.parse(readFileSync(localeSource, 'utf8')).ui;
  for (const key of nyasaKeys) assert.ok(ui[key]?.trim(), `${id} needs ui.${key}`);
  assert.doesNotMatch(JSON.stringify(ui), /Sanskrit alphabet|vam, sham|वं, शं/, `${id}: no alphabet mention or letter recital`);
}
const en = JSON.parse(readFileSync('locales/en.json', 'utf8')).ui;
assert.match(en.newcomerMatrikaIntro, /This is Nyasa: placing, or installing\./);
assert.match(en.newcomerMatrikaIntro, /fifty petals, one for each sound;/);
assert.match(en.newcomerMatrikaIntro, /touch is your free choice: your own hand, the hand of someone you trust, or simply your attention/);
assert.match(en.newcomerMatrikaIntro, /After each centre comes a short silence\. Stay with the touch and breathe; the voice returns/, 'the silence is explained before it happens');
assert.deepEqual(parts.map(part => en[`newcomerPetals${part}`]), ['4 petals', '6 petals', '10 petals', '12 petals', '16 petals', '2 petals', '1,000 petals']);
assert.match(en.newcomerMatrikaRoot, /lower back/, 'Root touch is on the lower back');
assert.match(en.newcomerMatrikaThroat, /collarbones/, 'Throat touch rests on the collarbones, not the throat');
for (const part of parts) assert.doesNotMatch(en[`newcomerMatrika${part}`], /someone you trust|free choice/, 'the choice is not repeated per chakra');
const orientationCode = app.slice(app.indexOf('    async runNewcomerGuidedOrientation()'), app.indexOf('    async start()'));
assert.ok(orientationCode.indexOf("contentT('ui.newcomerMatrikaIntro')") > orientationCode.indexOf("contentT('ui.newcomerOrientationIntro')"), 'the choice follows the orientation intro, once');
assert.match(orientationCode, /await this\.pauseAwareSleep\(chakra === 'crown' \? 15000 : 10000\);/, '10 s per chakra, 15 s at the Crown, held by Pause');
assert.match(orientationCode, /nyasaStay\.textContent = t\('ui\.newcomerMatrikaStay'\);[\s\S]*?classList\.add\('is-installing'\)/, 'the silence shows its cue and glow');
assert.match(orientationCode, /contentT\(`ui\.newcomerMatrika\$\{part\}Ready`\)/);
assert.match(html, /<p id="newcomer-nyasa" class="newcomer-nyasa" aria-live="polite" hidden>/);
assert.doesNotMatch(html, /newcomer-matrika-letters/);
console.log('Nyasa orientation passed: free-choice touch said once, petal counts, explained silences with on-screen cue, ready lines, five languages.');

// Owner request (Oct 2026): a journey that opens straight into Arriving (Returning Journey,
// HRIM, demo) starts with a 5-second get-ready count, before the session countdown.
assert.match(app, /const JOURNEY_GET_READY_SECONDS = 5;/);
const startFlow = app.slice(app.indexOf('    async start()'), app.indexOf('    async runGratitude()'));
assert.match(startFlow, /if \(newcomerChoice === 'skip' && !focusedExperience\) \{[\s\S]*?for \(let left = JOURNEY_GET_READY_SECONDS; left > 0; left -= 1\) \{[\s\S]*?journeyT\('ui\.shotGetReady'\)[\s\S]*?await this\.pauseAwareSleep\(1000\);/);
assert.ok(startFlow.indexOf('JOURNEY_GET_READY_SECONDS; left > 0') < startFlow.indexOf('this.startSessionCountdown('), 'the session countdown starts after the get-ready count');
console.log('Returning Journey get-ready passed: 5-second pause-aware count before Arriving.');
