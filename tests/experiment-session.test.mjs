import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.match(app, /startExperiment\(activity\)\s*\{\s*return experimentSession\.start\(this, activity,/);
assert.match(app, /stopExperiment\(\)\s*\{\s*return experimentSession\.stop\(this,/);
assert.match(html, /modules\/experiment-session\.js\?v=1\.1[\s\S]*?app\.js\?v=4\.32/);
assert.match(serviceWorker, /const CACHE_NAME = 'chakra-v5\.\d+'[\s\S]*?modules\/experiment-session\.js\?v=1\.1/);
assert.equal(pkg.scripts['test:experiment-session'], 'node tests/experiment-session.test.mjs');

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(new URL('../modules/experiment-session.js', import.meta.url), 'utf8'), context);
const session = context.window.ChakraExperimentSession.create();

function fixture(overrides = {}) {
    const events = [];
    const controls = { classList: { add: name => events.push(`controls:add:${name}`), remove: name => events.push(`controls:remove:${name}`) } };
    const duration = { value: '1', dataset: { unit: 'seconds' } };
    const document = { getElementById: id => id === 'experiment-core-duration' ? duration : id === 'controls' ? controls : null };
    const state = { advancedFeaturesUnlocked: true, language: 'en', scriptSource: 'custom', customScript: { root: 'Root script', high_energy: 'HRIM script' }, bgMusicMode: false };
    const owner = {
        sessionItemRunner: { reset: () => events.push('runner-reset') },
        async runSessionItem(_label, task) { return { skipped: false, value: await task() }; },
        scripts: null, scriptsLanguage: null, isStarting: false, isMeditationActive: false, isExperimentActive: false,
        audio: Object.fromEntries(['init', 'startBackgroundMusic', 'startPleasureAmbience', 'fadeInBackgroundMusic', 'stopMantraTrack', 'stopBackgroundMusic', 'stopPleasureAmbience'].map(name => [name, (...args) => events.push(`audio:${name}:${args.join(',')}`)])),
        startSessionCountdown: value => events.push(`countdown:start:${value}`), stopSessionCountdown: () => events.push('countdown:stop'),
        stopIntentionFrequency: () => events.push('intention:stop'), stopStageDrone: () => events.push('drone:stop'),
        meditateOnChakra: async (...args) => events.push(`chakra:${args.join(',')}`), runBoxBreathing: async () => events.push('run:box'),
        runHooponopono: async () => events.push('run:hooponopono'), runCorpsePose: async () => events.push('run:corpse'),
        runPerinealCare: async () => events.push('run:perineal'), runBathSession: async () => events.push('run:bath'),
        runAssistedBathing: async () => events.push('run:assisted-bath'), visual: { stop: () => events.push('visual:stop') }
    };
    const deps = {
        state, document, fetch: async url => { events.push(`fetch:${url}`); return { ok: true, json: async () => ({ root: 'Fetched root', high_energy: 'Fetched HRIM' }) }; },
        getLanguageConfig: () => ({ contentSource: 'scripts.json?lang=en' }),
        wakeLock: { request: async () => events.push('wake:request'), release: () => events.push('wake:release') },
        setText: (...args) => events.push(`text:${args.join(',')}`), showScreen: screen => events.push(`screen:${screen}`),
        meditationScreen: 'meditation', experimentScreen: 'experiment', backgroundMusicEntryFadeSeconds: 10,
        window: { speechSynthesis: { cancel: () => events.push('speech:cancel') } },
        piperTTS: { cancel: (...args) => events.push(`piper:cancel:${args[0]}:${args[1].fadeSeconds}`) },
        logError: (...args) => events.push(`error:${args[0]}:${args[1].message}`), alert: message => events.push(`alert:${message}`)
    };
    Object.assign(state, overrides.state || {});
    Object.assign(owner, overrides.owner || {});
    Object.assign(deps, Object.fromEntries(Object.entries(overrides).filter(([key]) => !['state', 'owner'].includes(key))));
    return { owner, deps, events, duration };
}

{
    const { owner, deps, events, duration } = fixture({ state: { scriptSource: 'custom', customScript: { root: 'Root script' } } });
    await session.start(owner, 'chakra:root', deps);
    assert.deepEqual(Array.from(owner.chakraOrder), ['root']);
    assert.ok(events.includes('chakra:Root script,root'));
    assert.ok(events.includes('screen:meditation'));
    assert.ok(events.includes('countdown:start:1000'));
    assert.ok(events.includes('audio:fadeInBackgroundMusic:10'));
    assert.ok(events.includes('piper:cancel:experiment stopped:2'));
    assert.equal(owner.isExperimentActive, false, 'a completed activity should use the shared cleanup path');
    assert.equal(duration.value, '1');
}

{
    const { owner, deps, events } = fixture({ state: { scriptSource: 'default', customScript: null } });
    await session.start(owner, 'box', deps);
    assert.ok(events.some(item => /^fetch:scripts\.json\?lang=en&v=/.test(item)), 'default content URL preserves existing query parameters');
    assert.ok(events.includes('run:box'));
    assert.equal(owner.scripts.root, 'Fetched root');
}

{
    const { owner, deps, events } = fixture({ state: { advancedFeaturesUnlocked: false } });
    await session.start(owner, 'assisted-bath', deps);
    assert.deepEqual(events, [], 'locked care activities return before loading content or starting audio');
}

{
    const { owner, deps, events } = fixture({ owner: { isStarting: true } });
    await session.start(owner, 'box', deps);
    assert.deepEqual(events, [], 'concurrent start is ignored');
}

{
    const { owner, deps, events } = fixture({
        state: { scriptSource: 'default', customScript: null },
        fetch: async () => ({ ok: false, status: 503 })
    });
    await session.start(owner, 'hrim', deps);
    assert.ok(events.some(item => item.includes('Unable to load language content (503)')));
    assert.ok(events.some(item => item.startsWith('alert:Experiment activity failed: Unable to load language content (503)')));
    assert.ok(events.includes('speech:cancel'));
    assert.equal(owner.isStarting, false, 'failure releases the start guard');
}

{
    const { owner, deps, events } = fixture();
    owner.isMeditationActive = true;
    owner.isExperimentActive = true;
    owner.experimentDuration = 42;
    session.stop(owner, deps);
    assert.equal(owner.isMeditationActive, false);
    assert.equal(owner.isExperimentActive, false);
    assert.equal(owner.experimentDuration, null);
    assert.deepEqual(events.slice(0, 6), ['runner-reset', 'speech:cancel', 'piper:cancel:experiment stopped:2', 'intention:stop', 'drone:stop', 'audio:stopMantraTrack:']);
    assert.ok(events.includes('screen:experiment'));
    assert.ok(events.includes('controls:add:hidden'));
}

console.log('Experiment session lifecycle passed: care guard, content selection/cache, standalone dispatch, countdown, failure recovery, and ordered cleanup.');
