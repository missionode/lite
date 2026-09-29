import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const source = read('../modules/sleep-journey.js');
const app = read('../app.js');
const html = read('../index.html');
const sw = read('../sw.js');
const context = vm.createContext({ window: {}, Date });
vm.runInContext(source, context);
const create = context.window.ChakraSleepJourney.create;

function harness(overrides = {}) {
    const events = [];
    const button = { disabled: false, style: {} };
    const controls = { classList: { remove: value => events.push(['controls', value]) } };
    const state = {
        advancedFeaturesUnlocked: true,
        language: 'en',
        scriptSource: 'custom',
        customScript: { sleep_mode: { stages: [{ key: 'drowsiness', frequency: 10 }, { key: 'lightSleep', frequency: 6 }] } },
        timeSleepStage: 0.01,
        sleepDroneDurationMode: 'intermediate',
        ...overrides.state
    };
    const owner = {
        sessionItemRunner: { reset: () => events.push('runner-reset') },
        async runSessionItem(_label, task) { return { skipped: false, value: await task() }; },
        isStarting: false,
        isMeditationActive: false,
        isPaused: false,
        audio: {
            startBackgroundMusic: async () => events.push('music-start'),
            startPleasureAmbience: () => events.push('ambience-start'),
            fadeInBackgroundMusic: (...args) => events.push(['music-in', ...args]),
            fadeOutBackgroundMusic: duration => events.push(['music-out', duration])
        },
        visual: { startPulsing: color => events.push(['pulse', color]) },
        showDndReminderIfNeeded: () => events.push('dnd'),
        startSessionCountdown: duration => events.push(['countdown', duration]),
        getSessionDurationMs: () => 120000,
        startTimedSleepDrone: (...args) => events.push(['drone-start', ...args]),
        stopStageDrone: () => events.push('drone-stop'),
        pauseAwareSleep: async duration => events.push(['wait', duration]),
        finish: () => { events.push('finish'); owner.isMeditationActive = false; }
    };
    const deps = {
        state,
        getLanguageConfig: () => ({ contentSource: 'scripts.json?lang=en' }),
        fetch: async url => { events.push(['fetch', url]); return { ok: true, json: async () => ({ sleep_mode: { stages: [{ key: 'drowsiness', frequency: 10 }, { key: 'lightSleep', frequency: 6 }] } }) }; },
        normalizeSleepStages: scripts => scripts.sleep_mode.stages,
        document: { getElementById: id => id === 'start-meditation' ? button : id === 'controls' ? controls : null },
        showScreen: screen => events.push(['screen', screen]),
        meditationScreen: 'meditation-screen',
        setText: (id, value) => events.push(['text', id, value]),
        journeyT: key => key
    };
    return { owner, deps, events, button, ...overrides };
}

assert.match(app, /runSleepJourney\(\)\s*\{\s*return sleepJourney\.run\(this,/);
assert.ok(html.indexOf('modules/sleep-journey.js') < html.indexOf('src="app.js'), 'Sleep owner loads before the app adapter.');
assert.match(sw, /chakra-v5\.\d+/);
assert.equal((sw.match(/modules\/sleep-journey\.js/g) || []).length, 1, 'Sleep module is precached exactly once.');

{
    const h = harness({ state: { advancedFeaturesUnlocked: false } });
    h.owner.showDndReminderIfNeeded = () => assert.fail('locked calls must have no side effects');
    await create().run(h.owner, h.deps);
    assert.equal(h.owner.isMeditationActive, false);
    assert.deepEqual(h.events, []);
}

{
    const h = harness();
    const finished = await create().run(h.owner, h.deps);
    assert.equal(finished, undefined);
    assert.deepEqual(h.events.filter(event => Array.isArray(event) && event[0] === 'drone-start'), [
        ['drone-start', 10, 0.01, 'intermediate'],
        ['drone-start', 6, 0.01, 'intermediate']
    ]);
    assert.deepEqual(h.events.filter(event => Array.isArray(event) && event[0] === 'wait').map(event => event[1]), [600, 3000, 600, 12000]);
    assert.ok(h.events.indexOf('music-start') < h.events.findIndex(event => Array.isArray(event) && event[0] === 'music-in'));
    assert.ok(h.events.indexOf('finish') > h.events.findIndex(event => Array.isArray(event) && event[0] === 'music-out'));
    assert.equal(h.button.disabled, true);
}

{
    const h = harness({ state: { customScript: null, scriptSource: 'default' } });
    h.owner.scripts = null;
    await create().run(h.owner, h.deps);
    const fetched = h.events.find(event => Array.isArray(event) && event[0] === 'fetch');
    assert.match(fetched[1], /^scripts\.json\?lang=en&v=\d+$/);
    assert.equal(h.owner.scriptsLanguage, 'en');
}

{
    const h = harness();
    h.owner.pauseAwareSleep = async () => { h.events.push('cancel'); h.owner.isMeditationActive = false; };
    await create().run(h.owner, h.deps);
    assert.equal(h.events.includes('finish'), false, 'A cancelled session must not finish as naturally completed.');
    assert.equal(h.events.filter(event => Array.isArray(event) && event[0] === 'drone-start').length, 1);
}

console.log('Sleep journey passed: unlock guard, stage timing, audio fades, content loading and cancellation.');
