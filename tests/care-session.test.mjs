import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const source = read('../modules/care-session.js');
const app = read('../app.js');
const html = read('../index.html');
const sw = read('../sw.js');
const context = vm.createContext({ window: {} });
vm.runInContext(source, context);
const api = context.window.ChakraCareSession.create();

assert.match(app, /runBathStage\(scriptKey, durationSeconds\)\s*\{\s*return careSession\.runBathStage/);
assert.match(app, /runIntimateService\(\)\s*\{\s*return careSession\.runIntimateService/);
assert.ok(html.indexOf('modules/care-session.js') < html.indexOf('src="app.js'), 'Care owner must load before app.js.');
assert.match(sw, /chakra-v5\.\d+/);
assert.equal((sw.match(/modules\/care-session\.js/g) || []).length, 1, 'Care owner must be precached exactly once.');

const events = [];
const elements = Object.fromEntries(['icebreaker-title', 'icebreaker-subtitle', 'icebreaker-timer'].map(id => [id, { textContent: '' }]));
const state = { timeBath: 3, timePerinealCare: 4, timeAssistedBathing: 5, perinealCareEnabled: true, massageEnabled: true, assistedBathingEnabled: true };
const owner = {
    isMeditationActive: true,
    isPaused: false,
    isExperimentActive: false,
    scripts: { bath_session: { title: 'Bath', intro: 'intro', instructions: 'instructions', reminder: 'reminder' } },
    narrate: async text => events.push(['narrate', text]),
    narrateSoft: text => events.push(['soft', text]),
    pauseAwareSleep: async duration => events.push(['wait', duration]),
    runGuideControlledTransition: async options => { events.push(['guide', options]); return true; },
    runPerinealCare: async () => { events.push('perineal'); return true; },
    runSequence: async options => events.push(['sequence', options.complete]),
    runAssistedBathing: async () => events.push('assisted')
};
const deps = {
    state,
    journeyT: key => key,
    showScreen: screen => events.push(['screen', screen]),
    icebreakerScreen: 'icebreaker',
    document: { getElementById: id => elements[id] },
    localized: value => value
};

await api.runBathStage(owner, 'bath_session', 2, deps);
assert.deepEqual(events.filter(event => Array.isArray(event) && event[0] === 'narrate'), [['narrate', 'intro'], ['narrate', 'instructions']]);
assert.deepEqual(events.filter(event => Array.isArray(event) && event[0] === 'wait').map(event => event[1]), [1000, 1000]);
assert.equal(elements['icebreaker-timer'].textContent, '0:01');
assert.equal(events.find(event => Array.isArray(event) && event[0] === 'guide')[1].showTimer, false);

events.length = 0;
await api.runIntimateService(owner, { ...deps, showScreen: screen => events.push(['screen', screen]), meditationScreen: 'meditation' });
assert.deepEqual(events, ['perineal', ['screen', 'meditation'], ['sequence', false], 'assisted']);

events.length = 0;
owner.isExperimentActive = true;
owner.experimentDuration = 1;
owner.scripts.perineal_care = owner.scripts.bath_session;
await api.runPerinealCare(owner, deps);
assert.equal(events.filter(event => Array.isArray(event) && event[0] === 'wait').length, 1, 'Experiment duration overrides the persisted care duration.');

events.length = 0;
await api.runIntimateService({ ...owner, isMeditationActive: false }, { ...deps, showScreen: (...args) => events.push(args) });
assert.deepEqual(events, [], 'An inactive session must not start the care flow.');

console.log('Care session passed: timed stage, guide handoff, experiment duration and Intimate Service sequence.');
