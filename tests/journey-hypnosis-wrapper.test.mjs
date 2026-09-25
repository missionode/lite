import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/journey-hypnosis-wrapper.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(source, context);
const wrapper = context.window.ChakraJourneyHypnosisWrapper;
assert.ok(Object.isFrozen(wrapper));
assert.match(app, /shouldRunHypnosisWrapper\(\) \{\s*return journeyHypnosisWrapper\.shouldRun\(this\)/);
assert.match(app, /runGuidedTransitionTone\(frequency, durationMs,[\s\S]*?journeyHypnosisWrapper\.runGuidedTransitionTone\(this, frequency/);
assert.ok(html.indexOf('modules/journey-hypnosis-wrapper.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /chakra-v5.309[\s\S]*?\.\/modules\/journey-hypnosis-wrapper\.js\?v=1\.0/);

const events = [];
const owner = {
    isHypnosisJourney: true, isMeditationActive: true,
    audio: {
        fadeInBackgroundMusic(...args) { events.push(['music-in', ...args]); },
        startGuidedTransitionTone(...args) { events.push(['tone-start', ...args]); return true; },
        stopGuidedTransitionTone(...args) { events.push(['tone-stop', ...args]); },
        playSingingBowl() { events.push(['bowl']); }
    },
    pauseAwareSleep: async ms => events.push(['wait', ms]),
    getJourneySystemNarration: key => key,
    narrate: async (...args) => events.push(['narrate', ...args]),
    setMantraDisplay: value => events.push(['mantra-display', value])
};
const state = { noFrequencyMode: false, timePerChakra: 4, droneDurationMode: 'beginner', timeEmergence: 60 };
const timing = (group, key) => ({
    arrivalToneLeadGap: 2, arrivalToneExitGap: 3, arrivalReadinessGap: 4,
    emergenceBellSettle: 5, emergenceFinalQuiet: 6
})[key];
const dependencies = { state, timing, getDroneDurationMs: () => 8000 };

assert.equal(wrapper.shouldRun(owner), true);
await wrapper.runArrivalInduction(owner, dependencies);
assert.deepEqual(events.slice(0, 5), [
    ['narrate', 'arrivalInduction', false], ['wait', 2000],
    ['music-in', 1.2, 0.08], ['tone-start', 432, 4000], ['wait', 4000]
]);
assert.ok(events.some(event => event[0] === 'tone-stop' && event[1] === 1.1));
assert.ok(events.some(event => event[0] === 'music-in' && event[1] === 2.4 && event[2] === true));

events.length = 0;
await wrapper.runArrivalReadiness(owner, dependencies);
assert.ok(events.some(event => event[0] === 'tone-start' && event[1] === 528 && event[2] === 4000));
assert.ok(events.some(event => event[0] === 'wait' && event[1] === 4000));

events.length = 0;
state.noFrequencyMode = true;
await wrapper.runGuidedTransitionTone(owner, 432, 4000, { beforeGap: 2, afterGap: 3 }, { state });
assert.deepEqual(events, [['wait', 2000], ['wait', 3000]], 'No Frequency retains quiet gaps without generated-tone or bus actions.');

events.length = 0;
state.noFrequencyMode = false;
await wrapper.runEmergence(owner, {
    state, timing,
    setMantraDisplay: value => events.push(['mantra-display', value]),
    withAudioStageFade: async (_audio, seconds, action) => { events.push(['fade-out', seconds]); return action(); }
});
assert.deepEqual(events, [
    ['mantra-display', '✦'], ['bowl'], ['wait', 5000], ['fade-out', 60], ['narrate', 'emergence', false],
    ['wait', 60000], ['wait', 6000]
]);
assert.equal(events.some(event => event[0] === 'bowl'), true, 'Normal emergence begins with its quiet bell.');

events.length = 0;
owner.pauseAwareSleep = async ms => { events.push(['wait', ms]); owner.isMeditationActive = false; };
await wrapper.runEmergence(owner, {
    state, timing, setMantraDisplay: value => events.push(['mantra-display', value]),
    withAudioStageFade: async () => assert.fail('cancelled emergence must not start its narration fade')
});
assert.deepEqual(events, [['mantra-display', '✦'], ['bowl'], ['wait', 5000]], 'Stopping during bell settling exits before narration and countdown.');
owner.isMeditationActive = true;
owner.pauseAwareSleep = async ms => events.push(['wait', ms]);
state.noFrequencyMode = true;
events.length = 0;
await wrapper.runEmergence(owner, {
    state, timing, setMantraDisplay: value => events.push(['mantra-display', value]),
    withAudioStageFade: async (_audio, seconds, action) => { events.push(['fade-out', seconds]); return action(); }
});
assert.equal(events.some(event => event[0] === 'bowl'), false, 'No Frequency omits the bell during emergence.');
assert.ok(events.some(event => event[0] === 'narrate' && event[1] === 'emergence'), 'No Frequency retains emergence narration.');

console.log('Hypnosis wrapper contract passed: arrival cues, shared exposure window, quiet No Frequency pacing and cancellable emergence sequence.');
