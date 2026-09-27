import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.match(app, /runShot\(type, customFrequency\)\s*\{\s*return shotSession\.run\(this, type, customFrequency,/);
assert.match(app, /finishShot\(\)\s*\{\s*return shotSession\.finish\(this,/);
assert.match(app, /stopShot\(\)\s*\{\s*return shotSession\.stop\(this,/);
assert.match(html, /modules\/shot-session\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.12/);
assert.match(sw, /const CACHE_NAME = 'chakra-v5\.\d+'[\s\S]*?modules\/shot-session\.js\?v=1\.0/);
assert.equal(pkg.scripts['test:shot-session'], 'node tests/shot-session.test.mjs');

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(new URL('../modules/shot-session.js', import.meta.url), 'utf8'), context);
const shotSession = context.window.ChakraShotSession.create();

function fixture(overrides = {}) {
    const events = [];
    const attrs = [];
    const shotToggle = { disabled: false };
    const startButton = { disabled: false, style: {} };
    const controls = { classList: { add: value => events.push(`controls:add:${value}`), remove: value => events.push(`controls:remove:${value}`) } };
    const elements = new Map([['shots-toggle', shotToggle], ['start-meditation', startButton], ['controls', controls]]);
    const document = { getElementById: id => elements.get(id) || { setAttribute: (...args) => attrs.push([id, ...args]) }, body: { classList: { remove: name => events.push(`body:remove:${name}`) } } };
    const state = { advancedFeaturesUnlocked: true, noFrequencyMode: false, language: 'en', timeShot: 0.2 };
    const owner = {
        isStarting: false, isMeditationActive: false, isShotActive: false, isPaused: false,
        scripts: { root: { frequency: 396 }, thirdeye: { frequency: 852 }, high_energy: { frequency: 528 }, sleep_mode: { intervalSeconds: 1 } }, scriptsLanguage: 'en',
        audio: {
            init: async () => events.push('audio:init'), stopBackgroundMusic: () => events.push('audio:music:stop'),
            stopMantraTrack: () => events.push('audio:mantra:stop'), startFrequencyShot: value => events.push(`audio:shot:start:${value}`),
            stopFrequencyShot: () => events.push('audio:shot:stop'), stopVisualizationAmbience: seconds => events.push(`audio:visualization:stop:${seconds}`)
        },
        visual: { startPulsing: color => events.push(`visual:pulse:${color}`), stop: () => events.push('visual:stop') },
        startSessionCountdown: value => events.push(`countdown:start:${value}`), stopSessionCountdown: () => events.push('countdown:stop'),
        pauseAwareSleep: async value => events.push(`wait:${value}`)
    };
    const deps = {
        state, alert: message => events.push(`alert:${message}`), t: key => key === 'ui.root' ? 'Root' : key, document,
        getLanguageConfig: () => ({ contentSource: 'scripts.json?lang=en' }),
        fetch: async url => { events.push(`fetch:${url}`); return { ok: true, json: async () => ({ root: { frequency: 396 }, high_energy: { frequency: 528 }, sleep_mode: { intervalSeconds: 1 } }) }; },
        normalizeSleepStages: () => [{ key: 'entry', frequency: 100 }, { key: 'settling', frequency: 200 }],
        shotChakraOrder: ['root', 'thirdeye'], wakeLock: { release: () => events.push('wake:release') },
        showScreen: screen => events.push(`screen:${screen}`), meditationScreen: 'meditation', lobbyScreen: 'lobby',
        setText: (...args) => events.push(`text:${args.join(',')}`), journeyT: key => `localized:${key}`,
        logError: (...args) => events.push(`error:${args[0]}:${args[1].message}`), window: { location: { reload: () => events.push('window:reload') } }
    };
    Object.assign(state, overrides.state || {});
    Object.assign(owner, overrides.owner || {});
    Object.assign(deps, Object.fromEntries(Object.entries(overrides).filter(([key]) => !['state', 'owner'].includes(key))));
    return { owner, deps, events, attrs, shotToggle, startButton };
}

{
    const { owner, deps, events, startButton, shotToggle } = fixture();
    await shotSession.run(owner, 'meditation', undefined, deps);
    assert.deepEqual(events.filter(event => event.startsWith('audio:shot:start:')), ['audio:shot:start:396', 'audio:shot:start:852']);
    assert.ok(events.includes('countdown:start:2200'), 'countdown includes one interval between selected chakra shots');
    assert.ok(events.includes('text:mantra-display,localized:ui.root'));
    assert.ok(events.includes('window:reload'), 'successful multi-stage Shot retains its page reset');
    assert.equal(owner.isShotActive, false);
    assert.equal(startButton.disabled, false);
    assert.equal(shotToggle.disabled, true, 'successful Shot keeps its control disabled during reset');
}

{
    const { owner, deps, events } = fixture({
        state: { timeShot: 1 },
        owner: { scripts: null },
        normalizeSleepStages: () => [{ key: 'entry', frequency: 100 }, { key: 'settling', frequency: 200 }]
    });
    await shotSession.run(owner, 'sleep', undefined, deps);
    assert.ok(events.some(event => /^fetch:scripts\.json\?lang=en&v=/.test(event)));
    assert.ok(events.includes('countdown:start:2000'), 'sleep countdown includes the configured inter-stage interval');
    assert.ok(events.includes('audio:shot:start:100'));
    assert.ok(events.includes('audio:shot:start:200'));
}

for (const blocked of [
    { state: { advancedFeaturesUnlocked: false }, activity: 'meditation' },
    { state: { noFrequencyMode: true }, activity: 'meditation' },
    { state: {}, owner: { isStarting: true }, activity: 'meditation' },
    { state: {}, owner: { isMeditationActive: true }, activity: 'meditation' },
    { state: {}, owner: { isShotActive: true }, activity: 'meditation' }
]) {
    const { owner, deps, events } = fixture(blocked);
    await shotSession.run(owner, blocked.activity, undefined, deps);
    assert.equal(owner.isShotActive, blocked.owner?.isShotActive ?? false, 'guarded Shot start preserves existing activity state');
    assert.equal(events.some(event => event === 'audio:init'), false, 'guarded Shot start performs no audio setup');
}

{
    const { owner, deps, events } = fixture();
    await shotSession.run(owner, 'custom', 20001, deps);
    assert.ok(events.includes('alert:ui.shotInvalidFrequency'));
    assert.equal(owner.isShotActive, false);
}

{
    const { owner, deps, events } = fixture({
        owner: { scripts: { root: { frequency: 0 } } },
        shotChakraOrder: ['root']
    });
    await shotSession.run(owner, 'meditation', undefined, deps);
    assert.ok(events.some(event => event.startsWith('alert:Shot activation failed:')));
    assert.ok(events.includes('audio:shot:stop'));
    assert.equal(owner.isShotActive, false, 'activation failure releases the active flag');
    assert.ok(events.includes('screen:lobby'));
}

{
    const { owner, deps, events, startButton } = fixture();
    owner.isMeditationActive = true;
    owner.isShotActive = true;
    shotSession.stop(owner, deps);
    assert.deepEqual(events.slice(0, 3), ['audio:shot:stop', 'visual:stop', 'audio:music:stop']);
    assert.ok(events.includes('audio:visualization:stop:2'));
    assert.ok(events.includes('wake:release'));
    assert.ok(events.includes('screen:lobby'));
    assert.equal(startButton.disabled, false);
    const before = events.length;
    shotSession.stop(owner, deps);
    assert.equal(events.length, before, 'stopping an inactive Shot is an idempotent no-op');
}

console.log('Shot session lifecycle passed: access guards, stage routing/countdowns, invalid input, failure recovery, success reset and stop cleanup.');
