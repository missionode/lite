import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const timings = JSON.parse(fs.readFileSync(new URL('../timing-config.json', import.meta.url), 'utf8'));
const english = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const malayalam = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(html, /id="yoga-experience-toggle"/, 'Yoga should be a Lobby Experience Mode');
assert.match(html, /id="yoga-experience-setup"[^>]*hidden/, 'Yoga setup should not appear among normal Settings by default');
assert.match(html, /id="yoga-experience-panel-host"/, 'the Lobby should host the Yoga setup panel');
assert.doesNotMatch(html, /id="yoga-bridge-toggle"/, 'Yoga must not remain a chakra-journey bridge');
assert.match(app, /selectedChakras: JSON\.parse\(localStorage\.getItem\('chakra_selected'\)\) \|\| \[\]/, 'a new client should have no preselected chakras');
assert.doesNotMatch(html, /value="(?:thirdeye|crown)" checked|value="(?:thirdeye|crown)"[^>]*disabled/, 'Third Eye and Crown should be optional and editable');
assert.doesNotMatch(app, /state\.yogaBridgeEnabled|getChecked\('yoga-bridge-toggle'\)/, 'normal journeys must not use a Yoga Bridge flag');

const sequenceStart = app.indexOf('    async runSequence({ complete = true } = {})');
const sequenceEnd = app.indexOf('    async runClosing()', sequenceStart);
const sequence = app.slice(sequenceStart, sequenceEnd);
assert.doesNotMatch(sequence, /runYogaSession/, 'a normal chakra sequence must never insert Yoga');

const yogaStart = app.indexOf('    async runYogaSession()');
const yogaEnd = app.indexOf('    shouldUsePiper()', yogaStart);
const yoga = app.slice(yogaStart, yogaEnd);
assert.match(yoga, /if \(state\.corpsePoseEnabled\) await this\.runCorpsePose\(\);/, 'Yoga Experience should retain its optional Corpse Pose');
assert.match(yoga, /if \(state\.bathSessionEnabled/, 'Yoga Experience should retain its optional standard Bath Session');
assert.match(yoga, /await this\.runGuideControlledTransition\(\{[\s\S]*?durationSeconds: timing\('transitions', 'bathToYogaRest'\)/, 'Yoga should rest after a bath/care stage before its introduction');
assert.match(yoga, /if \(!await this\.runBathSession\(\)\) return;/, 'Yoga should retain the standard Bath Session only');
assert.doesNotMatch(yoga, /runMassage|runPerinealCare|runAssistedBathing/, 'Intimate Service stages must not be coupled into Yoga');
const intimateStart = app.indexOf('    async runIntimateService()');
const intimateEnd = app.indexOf('    getFocusedExperience()', intimateStart);
const intimate = app.slice(intimateStart, intimateEnd);
assert.match(intimate, /runPerinealCare\(\)/, 'Intimate Service should start with optional Perineal Care');
assert.match(intimate, /showScreen\(meditationScreen\);[\s\S]*?runSequence\(/, 'Massage should enter the meditation screen before its narrated chakra sequence');
assert.match(intimate, /runSequence\(\{ complete: !state\.assistedBathingEnabled \}\)/, 'Massage should wrap the reverse chakra sequence without a separate timer');
assert.match(intimate, /runAssistedBathing\(\)/, 'Intimate Service should finish with optional Assisted Bathing');
assert.match(html, /id="intimate-service-panel"/, 'Intimate Service should be a dedicated Lobby section');
assert.doesNotMatch(html, /id="reverse-journey-toggle"/, 'normal Settings must not offer Reverse Journey');
assert.doesNotMatch(html, /id="time-massage"/, 'Massage must not expose a standalone duration');
assert.match(app, /\['crown', 'thirdeye', 'throat', 'heart', 'solar', 'sacral', 'root'\]/, 'Massage should force all chakras in Crown-to-Root order');
assert.match(app, /if \(focusedExperience\) \{[\s\S]*?if \(piperWarmup\) await piperWarmup;/, 'focused care should wait for Piper before narration begins');
assert.match(app, /focusedExperience === 'yoga' && state\.selectedYogaPoses\.length === 0/, 'Yoga Experience should require at least one configured pose when launched');
assert.match(app, /roadmapYoga/, 'Yoga Experience should have a focused Lobby roadmap');
assert.match(app, /roadmapRestBeforeYoga/, 'Yoga roadmap should show the required rest stage after Bath Session');
assert.match(app, /yogaExperiencePanelHost\.append\(yogaExperienceSetup\)/, 'Yoga setup should move into the Lobby at runtime');
assert.match(app, /yogaExperienceSetup\.hidden = !yogaExperience \|\| shots/, 'Yoga setup should appear only for Yoga Experience');
assert.match(app, /function persistYogaExperienceSetup\(\)[\s\S]*?chakra_yoga_selected/, 'Yoga setup choices should save immediately from the Lobby');
assert.match(html, /id="guide-controlled-continue"[^>]*hidden/, 'the shared guide-controlled action should start hidden');
assert.match(app, /async runGuideControlledTransition\(\{ durationSeconds, title, subtitle, readyText, continueLabel, showTimer = true \}\)/, 'guide-controlled transitions should remain reusable through generic content and timing inputs');
assert.match(app, /showTimer: false,[\s\S]*?proceedToNextSession/, 'completed care stages should use an untimed guide approval instead of auto-advancing');
assert.match(app, /if \(this\.guideControlledResolve\) this\.guideControlledResolve\(false\)/, 'stopping a session should cancel a pending guide-controlled transition');
assert.equal(timings.transitions.bathToYogaRest, 900, 'Bath-to-Yoga rest should be fifteen minutes in production');
assert.equal(timings.profiles['fast-test'].transitions.bathToYogaRest, 1, 'fast-test profile should keep guide-rest testing short');
for (const locale of [english, malayalam]) {
    for (const key of ['roadmapRestBeforeYoga', 'bathToYogaRestTitle', 'bathToYogaRestGuidance', 'restReadyToContinue', 'beginYogaAfterRest', 'guideReadyForNextSession', 'guideReadyForNextSessionGuidance', 'proceedToNextSession']) {
        assert.ok(locale.ui[key], `missing guide-rest locale key: ${key}`);
    }
    for (const key of ['intimateService', 'intimateServiceNote', 'beginIntimateService', 'massageReverseJourneyNote', 'roadmapMassageReverse']) {
        assert.ok(locale.ui[key], `missing Intimate Service locale key: ${key}`);
    }
}

console.log('Yoga Experience and optional chakra-selection contract passed.');
