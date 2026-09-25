import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const audioTonePlayback = fs.readFileSync(new URL('../modules/audio-tone-playback.js', import.meta.url), 'utf8');
const hypnosisWrapper = fs.readFileSync(new URL('../modules/journey-hypnosis-wrapper.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const timing = JSON.parse(fs.readFileSync(new URL('../timing-config.json', import.meta.url), 'utf8'));
const locales = ['en', 'ml', 'ru', 'hi'].map((language) => JSON.parse(
    fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8')
));
const facilitatorPath = new URL('../docs/dot.json', import.meta.url);
const facilitator = fs.existsSync(facilitatorPath)
    ? JSON.parse(fs.readFileSync(facilitatorPath, 'utf8'))
    : null;

assert.deepEqual(timing.journey.emergence, {
    default: 60, min: 30, max: 300, step: 5, unit: 'seconds'
}, 'Emergence should have an independent, bounded timing control.');
assert.equal(timing.journey.icebreaker.max, 300, 'Arriving should allow up to five minutes of settling time.');
assert.match(html, /id="time-emergence"[^>]*min="30"[^>]*max="300"[^>]*value="60"/, 'Journey Timings should expose Emergence.');
assert.match(html, /id="vol-bell"[^>]*min="0\.02"[^>]*max="0\.12"[^>]*value="0\.04"/, 'The transition bell should be deliberately feeble but never muted.');

assert.match(app, /getJourneySystemNarration\(key\)[\s\S]*?state\.scriptSource === 'custom'[\s\S]*?localized\(this\.scripts\?\.system, key\)[\s\S]*?contentT\(`system\.\$\{key\}`\)/, 'Custom scripts should optionally override Arrival/Emergence narration while built-in copy remains the fallback.');
assert.match(app, /runArrivalInduction\(\) \{\s*return journeyHypnosisWrapper\.runArrivalInduction/);
assert.match(app, /runArrivalReadiness\(\) \{\s*return journeyHypnosisWrapper\.runArrivalReadiness/);
assert.match(hypnosisWrapper, /async function runArrivalInduction\(owner,[\s\S]*?getJourneySystemNarration\('arrivalInduction'\)[\s\S]*?owner\.narrate\(text, false\)[\s\S]*?runGuidedTransitionTone\(owner, 432/);
assert.match(hypnosisWrapper, /async function runArrivalReadiness\(owner,[\s\S]*?getJourneySystemNarration\('arrivalReadiness'\)[\s\S]*?owner\.narrate\(text, false\)[\s\S]*?runGuidedTransitionTone\(owner, 528/);
assert.match(hypnosisWrapper, /const halfDuration = Math\.max\(1000, Math\.round\(totalDuration \/ 2\)\)/, 'The two Arrival cues must share one Drone Duration exposure budget.');
assert.match(hypnosisWrapper, /fadeInBackgroundMusic\(1\.2, 0\.08\)[\s\S]*?stopGuidedTransitionTone\(1\.1\)[\s\S]*?fadeInBackgroundMusic\(2\.4, true\)/, 'Each Arrival cue should duck and restore music with explicit fades.');
assert.match(hypnosisWrapper, /if \(state\.noFrequencyMode\) \{[\s\S]*?if \(afterGap > 0\) await owner\.pauseAwareSleep/, 'No Frequency Mode should retain quiet pacing while omitting generated cues.');
assert.match(audioTonePlayback, /if \(state\.noFrequencyMode\) return false;/, 'No Frequency Mode must reject Arrival transition tones at the audio boundary.');
const audioMantraPlayback = fs.readFileSync(new URL('../modules/audio-mantra-playback.js', import.meta.url), 'utf8');
assert.match(app, /startTimedDrone\(baseFrequency, elementalIndex, practiceMinutes, durationMode = state\.droneDurationMode\) \{\s*if \(state\.noFrequencyMode \|\| state\.noMantraMode\) return;/, 'No Mantra Mode must still suppress the paired chakra drone.');
assert.match(audioMantraPlayback, /if \(state\.noMantraMode\) return;/, 'No Mantra Mode must still suppress recorded mantra playback.');
assert.doesNotMatch(hypnosisWrapper, /noMantraMode/, 'No Mantra Mode should not suppress non-mantra Arrival cues.');

const runSequenceStart = app.indexOf('    async runSequence({ complete = true } = {})');
const runSequenceEnd = app.indexOf('    async runClosing()', runSequenceStart);
const runSequence = app.slice(runSequenceStart, runSequenceEnd);
assert.match(runSequence, /for \(let i = 0; i < this\.chakraOrder\.length; i\+\+\)[\s\S]*?await this\.meditateOnChakra\(this\.scripts\[key\], key\)/, 'The original chakra loop must remain the core journey.');
assert.match(runSequence, /await this\.runClosing\(\);[\s\S]*?await this\.runEmergence\(\);[\s\S]*?this\.finish\(\)/, 'Emergence must wrap the existing closing rather than replace the chakra journey.');
assert.match(app, /isHypnosisJourney = !this\.isHighEnergy && !isDemoScriptSelected\(\)/, 'Only normal non-demo chakra journeys should enable the wrapper.');
assert.match(hypnosisWrapper, /async function runEmergence\(owner,[\s\S]*?playSingingBowl\(\)[\s\S]*?getJourneySystemNarration\('emergence'\)[\s\S]*?state\.timeEmergence/, 'Emergence should progress from a feeble bell to custom-or-built-in narration and a configurable quiet return.');
assert.doesNotMatch(app.slice(app.indexOf('    finish() {'), app.indexOf('    stop() {')), /playSingingBowl\(\)/, 'Completion must not add a second abrupt bell after Emergence.');
assert.equal(timing.estimate.hypnosisNarrationSeconds, 40, 'The estimate should include the two Arrival narration blocks.');
assert.match(app, /estimateStandardJourneySeconds\(\)\s*\{\s*return window\.ChakraSessionEstimate\.estimateStandardJourneySeconds\(/,
    'The controller should delegate the standard-session duration contract to its tested owner module.');
assert.match(app, /getSessionDurationMs\(focusedExperience = null\)\s*\{\s*return window\.ChakraSessionEstimate\.resolveDurationMs\(/,
    'Session countdown duration selection should delegate to the tested estimate owner.');
for (const locale of locales) {
    assert.ok(locale.system.arrivalInduction?.trim(), 'Every supported language needs Arrival induction guidance.');
    assert.ok(locale.system.arrivalReadiness?.trim(), 'Every supported language needs Arrival readiness guidance.');
}
if (facilitator) {
    for (const key of ['arrivalInduction', 'arrivalReadiness', 'emergence']) {
        for (const language of ['en', 'ml']) {
            assert.ok(facilitator.system?.[`${key}_${language}`]?.trim(), `Facilitator script needs ${key}_${language}.`);
        }
    }
}

console.log('Hypnosis journey contract passed: Arrival/Emergence wrap, rather than replace, the chakra journey.');
