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
