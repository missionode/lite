import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const moduleSource = read('../modules/yoga-session.js');
const app = read('../app.js');
const html = read('../index.html');
const sw = read('../sw.js');
const context = vm.createContext({ window: {} });
vm.runInContext(moduleSource, context);

assert.match(app, /runYogaSession\(\)\s*\{\s*return yogaSession\.run\(this,/);
assert.ok(html.indexOf('modules/yoga-session.js') < html.indexOf('src="app.js'), 'Yoga owner must load before app.js.');
assert.match(sw, /chakra-v5\.\d+/);
assert.equal((sw.match(/modules\/yoga-session\.js/g) || []).length, 1, 'Yoga owner is precached exactly once.');

const events = [];
const state = {
    corpsePoseEnabled: true,
    bathSessionEnabled: true,
    timeYogaPrep: 1,
    timeYogaPose: 1,
    droneDurationMode: 'beginner',
    selectedYogaPoses: ['vrikshasana']
};
const elements = Object.fromEntries(['icebreaker-title', 'icebreaker-subtitle', 'icebreaker-timer', 'chakra-symbol', 'mantra-display', 'aura-bg'].map(id => [id, { style: {}, textContent: '' }]));
const owner = {
    isMeditationActive: true,
    isPaused: false,
    scripts: { yoga: { intro: 'intro', preparation: 'prep', poses: [{ id: 'vrikshasana' }], next_pose_prompt: 'next', session_complete: 'done' } },
    runCorpsePose: async () => events.push('corpse'),
    runBathSession: async () => { events.push('bath'); return true; },
    runGuideControlledTransition: async options => { events.push(['guide', options.durationSeconds]); return true; },
    startTimedDrone: (...args) => events.push(['drone', ...args]),
    audio: { fadeInBackgroundMusic: (...args) => events.push(['music', ...args]) },
    narrate: async text => events.push(['narrate', text]),
    narrateSoft: text => events.push(['soft', text]),
    pauseAwareSleep: async duration => events.push(['wait', duration])
};
const deps = {
    state,
    timing: (section, key) => ({ bathToYogaRest: 900, yogaPoseGap: 2, yogaFinalSettle: 3 })[key],
    journeyT: key => key,
    showScreen: screen => events.push(['screen', screen]),
    icebreakerScreen: 'icebreaker',
    meditationScreen: 'meditation',
    document: { getElementById: id => elements[id] },
    localized: (value, part) => part ? `${value.id}:${part}` : value,
    visual: { setSymbolImage: (image, element) => { element.image = image; events.push(['image', image]); } }
};

await context.window.ChakraYogaSession.create().run(owner, deps);
assert.ok(events.indexOf('corpse') < events.indexOf('bath'));
assert.ok(events.indexOf('bath') < events.findIndex(event => Array.isArray(event) && event[0] === 'guide'));
assert.deepEqual(events.filter(event => Array.isArray(event) && event[0] === 'narrate').map(event => event[1]), ['intro', 'prep', 'vrikshasana:desc', 'done']);
assert.deepEqual(events.filter(event => Array.isArray(event) && event[0] === 'wait').map(event => event[1]), [1000, 1000, 2000, 3000]);
assert.equal(elements['mantra-display'].textContent, 'vrikshasana:name');
assert.equal(elements['aura-bg'].style.opacity, '1');
assert.ok(events.every(event => typeof event !== 'string' || !event.includes('intimate')));

const inactiveEvents = [];
await context.window.ChakraYogaSession.create().run({ ...owner, isMeditationActive: false }, { ...deps, showScreen: (...args) => inactiveEvents.push(args) });
assert.deepEqual(inactiveEvents, [], 'An inactive session must not start Yoga presentation.');

console.log('Yoga session passed: pre-stage order, selected-pose playback, timing, shared services and inactive guard.');
