import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const source = read('../modules/chakra-session.js');
const app = read('../app.js');
const html = read('../index.html');
const sw = read('../sw.js');
const context = vm.createContext({ window: {} });
vm.runInContext(source, context);
const api = context.window.ChakraSession.create();

assert.match(app, /meditateOnChakra\(chakra, key\)\s*\{\s*return chakraSession\.run\(this, chakra, key,/);
assert.ok(html.indexOf('modules/chakra-session.js') < html.indexOf('src="app.js'), 'Chakra owner must load before app.js.');
assert.match(sw, /chakra-v5\.\d+/);
assert.equal((sw.match(/modules\/chakra-session\.js/g) || []).length, 1, 'Chakra owner must be precached exactly once.');

const events = [];
const classes = () => ({ add: value => events.push(['class+', value]), remove: value => events.push(['class-', value]) });
const symbol = { style: {}, classList: classes(), offsetWidth: 10 };
const mantra = { style: {}, textContent: '' };
const aura = { style: {} };
const rootDot = { dataset: { chakra: 'root' }, classList: classes() };
const dot = { dataset: { chakra: 'sacral' }, classList: classes() };
const elements = { 'chakra-symbol': symbol, 'mantra-display': mantra, 'aura-bg': aura };
const state = {
    deityPath: 'none', eyesCloseMode: false, noMantraMode: false,
    timePerChakra: 1, timeHighEnergy: 2,
    droneDurationMode: 'advanced', hrimDroneDurationMode: 'expert'
};
const owner = {
    isMeditationActive: true, isPaused: false, isExperimentActive: false, experimentDuration: null,
    chakraOrder: ['root', 'sacral'], scripts: {},
    audio: {
        mantraLoop: true,
        playMantraTrack: async key => events.push(['mantra+', key]),
        stopMantraTrack: options => events.push(['mantra-', options])
    },
    visual: null,
    narrate: async (...args) => events.push(['narrate', ...args]),
    startTimedDrone: (...args) => events.push(['drone', ...args]),
    pauseAwareSleep: async duration => events.push(['sleep', duration])
};
const chakra = { symbol: 'symbols/sacral.png', mantra: 'VAM', color: '#ff8800', frequency: 417, meditation: 'guided', affirmation: 'affirmation' };
const deps = {
    state,
    document: {
        getElementById: id => elements[id],
        body: { style: { setProperty: (...args) => events.push(['css', ...args]) } },
        querySelectorAll: selector => selector === '.dot' ? [rootDot, dot] : []
    },
    visual: { setSymbolImage: (image, target) => { target.src = image; events.push(['symbol', image]); }, startPulsing: color => events.push(['pulse', color]) },
    localized: (value, key) => key ? value[key] : value,
    timing: (_section, key) => ({ chakraLeadOut: 59, chakraPostMantra: 2 })[key],
    setTimeout: callback => { events.push('entrance-timeout'); callback(); }
};

await api.run({ ...owner, isMeditationActive: false }, chakra, 'sacral', { ...deps, visual: deps.visual });
assert.deepEqual(events, [], 'Inactive sessions must not update chakra UI or start audio.');

await api.run(owner, chakra, 'sacral', deps);
const narrateAt = events.findIndex(event => Array.isArray(event) && event[0] === 'narrate');
const mantraAt = events.findIndex(event => Array.isArray(event) && event[0] === 'mantra+');
const droneAt = events.findIndex(event => Array.isArray(event) && event[0] === 'drone');
assert.ok(narrateAt < mantraAt && mantraAt < droneAt, 'Narration ends before mantra, and the drone starts only after mantra.');
assert.deepEqual(events[droneAt], ['drone', 417, 1, 1, 'advanced']);
assert.deepEqual(events.filter(event => Array.isArray(event) && event[0] === 'sleep').slice(-1)[0], ['sleep', 2000]);
assert.equal(events.find(event => Array.isArray(event) && event[0] === 'mantra-')[1].stageWindow, 2);
assert.ok(events.some(event => Array.isArray(event) && event[0] === 'narrate' && event[1] === 'affirmation'));
assert.equal(symbol.src, chakra.symbol);
assert.equal(mantra.textContent, 'VAM');
assert.equal(aura.style.opacity, '1');
assert.ok(events.some(event => Array.isArray(event) && event[0] === 'class+' && event[1] === 'completed'));

events.length = 0;
state.eyesCloseMode = true;
state.noMantraMode = true;
await api.run(owner, chakra, 'high_energy', deps);
assert.equal(aura.style.opacity, '0');
assert.equal(events.some(event => Array.isArray(event) && event[0] === 'pulse'), false);
assert.equal(events.some(event => Array.isArray(event) && event[0] === 'drone'), false, 'No Mantra keeps the frequency drone off.');

console.log('Chakra session passed: narration/mantra/drone order, stage timing, UI, HRIM mode and suppression guards.');
