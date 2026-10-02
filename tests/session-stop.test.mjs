import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync('modules/session-stop.js', 'utf8'), context);
const sessionStop = context.window.ChakraSessionStop.create();
const appSource = fs.readFileSync('app.js', 'utf8');
const htmlSource = fs.readFileSync('index.html', 'utf8');
const workerSource = fs.readFileSync('sw.js', 'utf8');
assert.match(appSource, /stop\(\{ preserveScreen = false \} = \{\}\) \{\s*(?:this\.sessionItemRunner\.reset\(\);\s*)?return sessionStop\.stop\(this, \{ preserveScreen \}/);
assert.ok(htmlSource.indexOf('modules/session-stop.js?v=1.1') < htmlSource.indexOf('app.js?v='));
assert.match(workerSource, /modules\/session-stop\.js\?v=1\.1/);
const events = [];
const classList = name => ({
    remove: (...classes) => events.push([name, 'remove', ...classes]),
    add: (...classes) => events.push([name, 'add', ...classes])
});
const elements = new Map();
for (const id of ['guide-controlled-continue', 'start-meditation', 'app', 'aura-bg', 'controls', 'volume-mixer']) {
    elements.set(id, { hidden: false, disabled: true, style: { opacity: '0.5', setProperty: (key, value) => events.push([id, 'style', key, value]) }, classList: classList(id) });
}
elements.get('aura-bg').style = {
    opacity: '0.8', background: '',
    set background(value) { this._background = value; events.push(['aura-bg', 'background', value]); },
    get background() { return this._background; }
};
const dot = { classList: { remove: (...classes) => events.push(['dot', 'remove', ...classes]) } };
const document = {
    body: { classList: classList('body') },
    getElementById: id => elements.get(id) || null,
    querySelectorAll: selector => selector === '.dot' ? [dot] : []
};
const window = { speechSynthesis: { cancel: () => events.push(['speech', 'cancel']) } };
const owner = {
    isMeditationActive: true, isShotActive: true, isHypnosisJourney: true,
    isExperimentActive: true, sessionStartedAt: 123, guideControlledResolve: value => events.push(['guide', value]),
    stopIntentionFrequency: () => events.push(['intention', 'stop']),
    stopStageDrone: () => events.push(['drone', 'stop']),
    stopSessionCountdown: () => events.push(['countdown', 'stop']),
    audio: {
        stopGuidedTransitionTone: () => events.push(['transition-tone', 'stop']),
        stopMantraTrack: options => events.push(['mantra', options.restoreMusic]),
        stopBackgroundMusic: () => events.push(['music', 'stop']),
        stopVisualizationAmbience: seconds => events.push(['visualization', seconds]),
        stopPleasureAmbience: seconds => events.push(['ambience', seconds])
    },
    visual: { stop: () => events.push(['visual', 'stop']) }
};
const piperTTS = { cancel: (reason, options) => events.push(['piper', reason, options.fadeSeconds]) };
const wakeLock = { release: () => events.push(['wake-lock', 'release']) };
const shown = [];
const deps = { document, window, piperTTS, wakeLock, lobbyScreen: 'lobby', experimentScreen: 'experiment', showScreen: screen => shown.push(screen) };

sessionStop.stop(owner, { preserveScreen: true }, deps);
assert.equal(owner.isMeditationActive, false);
assert.equal(owner.isShotActive, false);
assert.equal(owner.isHypnosisJourney, false);
assert.equal(owner.isExperimentActive, false);
assert.equal(owner.sessionStartedAt, null);
assert.equal(elements.get('guide-controlled-continue').hidden, true);
assert.equal(elements.get('guide-controlled-continue').disabled, true);
assert.equal(elements.get('start-meditation').disabled, false);
assert.equal(elements.get('start-meditation').style.opacity, '1');
assert.deepEqual(shown, [], 'Restart with preserveScreen leaves screen routing to the caller');
assert.ok(events.some(item => item[0] === 'guide' && item[1] === false), 'Stop releases pending guide waits');
assert.ok(events.some(item => item[0] === 'piper' && item[1] === 'journey stopped' && item[2] === 2));
assert.ok(events.some(item => item[0] === 'aura-bg' && item[1] === 'background'));
assert.ok(events.some(item => item[0] === 'app' && item[1] === 'style' && item[2] === '--app-brightness' && item[3] === '1'));
assert.ok(events.some(item => item[0] === 'dot' && item[1] === 'remove' && item.includes('active') && item.includes('completed')));
assert.ok(events.some(item => item[0] === 'controls' && item[1] === 'add' && item[2] === 'hidden'));
assert.ok(events.some(item => item[0] === 'volume-mixer' && item[1] === 'add' && item[2] === 'hidden'));
assert.ok(events.findIndex(item => item[0] === 'music') < events.findIndex(item => item[0] === 'speech'),
    'Audio shutdown retains its order before speech cancellation');
assert.ok(events.findIndex(item => item[0] === 'speech') < events.findIndex(item => item[0] === 'piper'));

owner.isExperimentActive = false;
sessionStop.stop(owner, {}, deps);
assert.deepEqual(shown, ['lobby'], 'Ordinary Stop returns to Lobby');
assert.equal(elements.get('aura-bg').style.opacity, '1');
console.log('Session stop passed: cleanup order, audio fades, timers, wake lock, guides, UI reset and return routes.');
