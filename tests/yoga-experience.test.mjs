import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const lobbyVisibility = fs.readFileSync(new URL('../modules/lobby-experience-visibility.js', import.meta.url), 'utf8');
const yogaSettings = fs.readFileSync(new URL('../modules/yoga-experience-settings.js', import.meta.url), 'utf8');
const journeyRoadmap = fs.readFileSync(new URL('../modules/journey-roadmap.js', import.meta.url), 'utf8');
const yogaSession = fs.readFileSync(new URL('../modules/yoga-session.js', import.meta.url), 'utf8');
const careSession = fs.readFileSync(new URL('../modules/care-session.js', import.meta.url), 'utf8');
const standardJourneySequence = fs.readFileSync(new URL('../modules/standard-journey-sequence.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const timings = JSON.parse(fs.readFileSync(new URL('../timing-config.json', import.meta.url), 'utf8'));
const english = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const malayalam = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(html, /id="yoga-experience-toggle"/, 'Yoga should be a Lobby Experience Mode');
assert.match(html, /id="yoga-experience-setup"[^>]*hidden/, 'Yoga setup should not appear among normal Settings by default');
assert.match(html, /id="yoga-experience-panel-host"/, 'the Lobby should host the Yoga setup panel');
assert.doesNotMatch(html, /id="yoga-bridge-toggle"/, 'Yoga must not remain a chakra-journey bridge');
assert.doesNotMatch(html, /value="(?:thirdeye|crown)" checked|value="(?:thirdeye|crown)"[^>]*disabled/, 'Third Eye and Crown should be optional and editable');
assert.doesNotMatch(app, /state\.yogaBridgeEnabled|getChecked\('yoga-bridge-toggle'\)/, 'normal journeys must not use a Yoga Bridge flag');

assert.match(app, /async runSequence\(\{ complete = true \} = \{\}\)\s*\{\s*return standardJourneySequence\.run\(this, \{ state, isChecked: getChecked, complete \}\);/);
assert.doesNotMatch(standardJourneySequence, /runYogaSession/, 'a normal chakra sequence must never insert Yoga');

assert.match(app, /runYogaSession\(\)\s*\{\s*return yogaSession\.run\(this,/, 'Yoga should retain a stable app adapter.');
assert.match(yogaSession, /if \(state\.corpsePoseEnabled\) await owner\.runCorpsePose\(\);/, 'Yoga Experience should retain its optional Corpse Pose');
assert.match(yogaSession, /if \(state\.bathSessionEnabled/, 'Yoga Experience should retain its optional standard Bath Session');
assert.match(yogaSession, /await owner\.runGuideControlledTransition\(\{[\s\S]*?durationSeconds: timing\('transitions', 'bathToYogaRest'\)/, 'Yoga should rest after a bath/care stage before its introduction');
assert.match(yogaSession, /if \(!await owner\.runBathSession\(\)\) return;/, 'Yoga should retain the standard Bath Session only');
assert.doesNotMatch(yogaSession, /runMassage|runPerinealCare|runAssistedBathing/, 'Intimate Service stages must not be coupled into Yoga');
assert.match(app, /runIntimateService\(\)\s*\{\s*return careSession\.runIntimateService\(this,/, 'Intimate Service should retain its stable controller adapter');
assert.match(careSession, /state\.perinealCareEnabled && !await owner\.runPerinealCare\(\)/, 'Intimate Service should start with optional Perineal Care');
assert.match(careSession, /showScreen\(meditationScreen\);[\s\S]*?owner\.runSequence\(/, 'Massage should enter the meditation screen before its narrated chakra sequence');
assert.match(careSession, /owner\.runSequence\(\{ complete: !state\.assistedBathingEnabled \}\)/, 'Massage should wrap the reverse chakra sequence without a separate timer');
assert.match(careSession, /if \(state\.assistedBathingEnabled\) await owner\.runAssistedBathing\(\)/, 'Intimate Service should finish with optional Assisted Bathing');
assert.match(html, /id="intimate-service-panel"/, 'Intimate Service should be a dedicated Lobby section');
assert.doesNotMatch(html, /intimate-service-unlock/, 'Intimate Service should not expose a visible reveal control');
assert.match(html, /id="intimate-service-panel"[^>]*hidden/, 'Intimate Service is hidden before initialization');
assert.match(app, /versionUnlockButton\?\.addEventListener\('click', handleIntimateServiceUnlockTap\)/, 'App version is the reveal target');
assert.match(app, /intimateServiceTapCount \+= 1[\s\S]*?remaining = 7 - intimateServiceTapCount[\s\S]*?setIntimateServiceLocked\(false\)/, 'Intimate Service should unlock after seven taps');
assert.doesNotMatch(html, /id="reverse-journey-toggle"/, 'normal Settings must not offer Reverse Journey');
assert.doesNotMatch(html, /id="time-massage"/, 'Massage must not expose a standalone duration');
assert.match(app, /\['crown', 'thirdeye', 'throat', 'heart', 'solar', 'sacral', 'root'\]/, 'Massage should force all chakras in Crown-to-Root order');
assert.match(app, /if \(focusedExperience\) \{[\s\S]*?if \(piperWarmup\) await piperWarmup;/, 'focused care should wait for Piper before narration begins');
assert.match(app, /focusedExperience === 'yoga' && state\.selectedYogaPoses\.length === 0/, 'Yoga Experience should require at least one configured pose when launched');
assert.match(journeyRoadmap, /ui\.roadmapYoga/, 'Yoga Experience should have a focused Lobby roadmap');
assert.match(journeyRoadmap, /ui\.roadmapRestBeforeYoga/, 'Yoga roadmap should show the required rest stage after Bath Session');
assert.match(app, /yogaExperiencePanelHost\.append\(yogaExperienceSetup\)/, 'Yoga setup should move into the Lobby at runtime');
assert.match(lobbyVisibility, /yogaExperienceSetup\.hidden = !yogaExperience \|\| shots/, 'Yoga setup should appear only for Yoga Experience');
assert.match(app, /function persistYogaExperienceSetup\(\)\s*\{\s*yogaExperienceSettings\.persist\(/, 'Yoga setup choices should save immediately from the Lobby through the extracted settings owner');
assert.match(yogaSettings, /chakra_yoga_selected/, 'the Yoga settings owner should persist selected poses');
assert.match(html, /id="guide-controlled-continue"[^>]*hidden/, 'the shared guide-controlled action should start hidden');
assert.match(app, /async runGuideControlledTransition\(\{ durationSeconds, title, subtitle, readyText, continueLabel, showTimer = true \}\)/, 'guide-controlled transitions should remain reusable through generic content and timing inputs');
assert.match(careSession, /showTimer: false,[\s\S]*?proceedToNextSession/, 'completed care stages should use an untimed guide approval instead of auto-advancing');
assert.match(fs.readFileSync(new URL('../modules/session-stop.js', import.meta.url), 'utf8'), /if \(owner\.guideControlledResolve\) owner\.guideControlledResolve\(false\)/, 'stopping a session should cancel a pending guide-controlled transition');
assert.equal(timings.transitions.bathToYogaRest, 900, 'Bath-to-Yoga rest should be fifteen minutes in production');
assert.equal(timings.profiles['fast-test'].transitions.bathToYogaRest, 1, 'fast-test profile should keep guide-rest testing short');
for (const locale of [english, malayalam]) {
    for (const key of ['roadmapRestBeforeYoga', 'bathToYogaRestTitle', 'bathToYogaRestGuidance', 'restReadyToContinue', 'beginYogaAfterRest', 'guideReadyForNextSession', 'guideReadyForNextSessionGuidance', 'proceedToNextSession']) {
        assert.ok(locale.ui[key], `missing guide-rest locale key: ${key}`);
    }
    for (const key of ['intimateService', 'intimateServiceNote', 'intimateServiceUnlock', 'intimateServiceUnlockProgress', 'beginIntimateService', 'massageReverseJourneyNote', 'roadmapMassageReverse']) {
        assert.ok(locale.ui[key], `missing Intimate Service locale key: ${key}`);
    }
}

console.log('Yoga Experience and optional chakra-selection contract passed.');
