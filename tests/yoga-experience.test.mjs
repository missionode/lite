import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(html, /id="yoga-experience-toggle"/, 'Yoga should be a Lobby Experience Mode');
assert.doesNotMatch(html, /id="yoga-bridge-toggle"/, 'Yoga must not remain a chakra-journey bridge');
assert.match(app, /selectedChakras: JSON\.parse\(localStorage\.getItem\('chakra_selected'\)\) \|\| \[\]/, 'a new client should have no preselected chakras');
assert.doesNotMatch(html, /value="(?:thirdeye|crown)" checked|value="(?:thirdeye|crown)"[^>]*disabled/, 'Third Eye and Crown should be optional and editable');
assert.doesNotMatch(app, /state\.yogaBridgeEnabled|getChecked\('yoga-bridge-toggle'\)/, 'normal journeys must not use a Yoga Bridge flag');

const sequenceStart = app.indexOf('    async runSequence()');
const sequenceEnd = app.indexOf('    async runClosing()', sequenceStart);
const sequence = app.slice(sequenceStart, sequenceEnd);
assert.doesNotMatch(sequence, /runYogaSession/, 'a normal chakra sequence must never insert Yoga');

const yogaStart = app.indexOf('    async runYogaSession()');
const yogaEnd = app.indexOf('    shouldUsePiper()', yogaStart);
const yoga = app.slice(yogaStart, yogaEnd);
assert.match(yoga, /if \(state\.corpsePoseEnabled\) await this\.runCorpsePose\(\);/, 'Yoga Experience should retain its optional Corpse Pose');
assert.match(yoga, /if \(state\.bathSessionEnabled/, 'Yoga Experience should retain optional care stages');
assert.match(app, /focusedExperience === 'yoga' && state\.selectedYogaPoses\.length === 0/, 'Yoga Experience should require at least one configured pose when launched');
assert.match(app, /roadmapYoga/, 'Yoga Experience should have a focused Lobby roadmap');

console.log('Yoga Experience and optional chakra-selection contract passed.');
