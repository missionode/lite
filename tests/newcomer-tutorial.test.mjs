import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('app.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const localePaths = ['locales/en.json', 'locales/ml.json', 'locales/hi.json', 'locales/ru.json'];
const requiredKeys = [
  'newcomerKicker', 'newcomerTitle', 'newcomerLead', 'newcomerReassurance',
  'newcomerCentresTitle', 'newcomerCentresNote', 'newcomerRoot', 'newcomerSacral',
  'newcomerSolar', 'newcomerHeart', 'newcomerThroat', 'newcomerThirdEye',
  'newcomerCrown', 'newcomerControlsTitle', 'newcomerControls', 'newcomerBegin',
  'newcomerSkip', 'newcomerNotNow', 'newcomerBodyMap', 'newcomerGuidedStatus',
  'newcomerGuidedNarration'
];

assert.match(html, /id="newcomer-tutorial-screen"/);
assert.match(html, /id="begin-newcomer-tutorial"/);
assert.match(html, /id="skip-newcomer-tutorial"/);
assert.match(html, /id="leave-newcomer-tutorial"/);
assert.match(html, /id="newcomer-body-map"[\s\S]*?symbols\/newcomer-chakra-body-map\.png/);
assert.match(html, /id="newcomer-guided-status"/);
assert.doesNotMatch(html, /newcomer-silhouette|newcomer-centre-dots/);
assert.match(html, /traditional map for reflection\. These are prompts for attention, not medical facts/i);

for (const path of localePaths) {
  const ui = JSON.parse(readFileSync(path, 'utf8')).ui;
  for (const key of requiredKeys) assert.ok(ui[key], `${path} needs ui.${key}`);
}

const eligibility = app.slice(app.indexOf('    shouldShowNewcomerTutorial()'), app.indexOf('    async showNewcomerTutorial()'));
assert.match(eligibility, /!state\.returningJourney/);
for (const id of ['high-energy-toggle', 'music-only-toggle', 'sleep-mode-toggle']) {
  assert.match(eligibility, new RegExp(`!getChecked\\('${id}'\\)`));
}
assert.match(eligibility, /!this\.getFocusedExperience\(\)/);

const start = app.slice(app.indexOf('    async start()'), app.indexOf('    async runGratitude()'));
assert.match(start, /const newcomerChoice = this\.shouldShowNewcomerTutorial\(\)\s*\? await this\.showNewcomerTutorial\(\)/);
assert.match(start, /showScreen\(lobbyScreen\);\s*return;/);
assert.ok(
  start.indexOf('showNewcomerTutorial') < start.indexOf('this.showDndReminderIfNeeded()'),
  'newcomer choice must happen before DND reminder, audio setup and Arriving'
);
assert.match(app, /async runNewcomerGuidedOrientation\(\)[\s\S]*?contentT\('ui\.newcomerGuidedNarration'\)[\s\S]*?'soft'/);
assert.match(app, /runNewcomerGuidedOrientation\(\)[\s\S]*?showScreen\(newcomerTutorialScreen\)[\s\S]*?bodyMap\.hidden = false/);
assert.match(start, /newcomerChoice === 'guided'[\s\S]*?runNewcomerGuidedOrientation\(\)/);

console.log('newcomer tutorial contracts passed');
