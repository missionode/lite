import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('app.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const localePaths = ['locales/en.json', 'locales/ml.json', 'locales/hi.json', 'locales/ru.json'];
const requiredKeys = [
  'newcomerBodyMap', 'newcomerGuidedStatus', 'newcomerGuidedNarration',
  'newcomerRootLocation', 'newcomerSacralLocation', 'newcomerSolarLocation',
  'newcomerHeartLocation', 'newcomerThroatLocation', 'newcomerThirdEyeLocation',
  'newcomerCrownLocation'
];

assert.match(html, /id="newcomer-tutorial-screen"/);
assert.match(html, /id="newcomer-body-map"[\s\S]*?symbols\/newcomer-chakra-body-map\.png/);
assert.match(html, /id="newcomer-guided-status"/);
assert.doesNotMatch(html, /newcomer-silhouette|newcomer-centre-dots/);
assert.doesNotMatch(html, /YOUR FIRST CHAKRA JOURNEY|A gentle introduction|You do not need prior knowledge/);

for (const path of localePaths) {
  const ui = JSON.parse(readFileSync(path, 'utf8')).ui;
  for (const key of requiredKeys) assert.ok(ui[key], `${path} needs ui.${key}`);
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
assert.match(app, /async runNewcomerGuidedOrientation\(\)[\s\S]*?t\('ui\.newcomerGuidedNarration'\)[\s\S]*?'soft'/);
assert.match(app, /runNewcomerGuidedOrientation\(\)[\s\S]*?showScreen\(newcomerTutorialScreen\)[\s\S]*?showScreen\(icebreakerScreen\)/);
assert.match(html, /newcomer-body-map-stage[\s\S]*?newcomer-label-crown[\s\S]*?newcomer-label-root/);
assert.match(start, /newcomerChoice === 'guided'[\s\S]*?runNewcomerGuidedOrientation\(\)/);

console.log('newcomer tutorial contracts passed');
