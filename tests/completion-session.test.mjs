import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('index.html', 'utf8');
const worker = fs.readFileSync('sw.js', 'utf8');
const appSource = fs.readFileSync('app.js', 'utf8');
const moduleSource = fs.readFileSync('modules/completion-view.js', 'utf8');
assert.ok(html.indexOf('modules/completion-view.js?v=1.0') < html.indexOf('app.js?v='));
assert.match(worker, /modules\/completion-view\.js\?v=1\.0/);
assert.match(appSource, /finish\(\) \{\s*(?:this\.sessionItemRunner\.reset\(\);\s*)?return window\.ChakraCompletionView\.finish\(this,/);

const context = vm.createContext({ window: {} });
vm.runInContext(moduleSource, context);
const view = context.window.ChakraCompletionView;
const events = [];
const makeClassList = name => ({ remove: (...classes) => events.push([name, 'remove', ...classes]), add: (...classes) => events.push([name, 'add', ...classes]) });
const elements = new Map();
for (const id of ['aura-bg', 'app', 'controls', 'volume-mixer', 'completion-modal', 'completion-title', 'completion-message', 'continue-to-earn', 'close-completion']) {
    elements.set(id, { textContent: '', classList: makeClassList(id), style: { opacity: 1, setProperty: (key, value) => events.push([id, 'style', key, value]) } });
}
const dot = { classList: { remove: (...classes) => events.push(['dot', 'remove', ...classes]) } };
const document = {
    body: { classList: makeClassList('body') },
    getElementById: id => elements.get(id) || null,
    querySelectorAll: selector => selector === '.dot' ? [dot] : []
};
const state = { stats: { journeys: 3, time: 21 } };
const saved = new Map();
const owner = {
    isMeditationActive: true, isHypnosisJourney: true, sessionStartedAt: 10_000,
    stopSessionCountdown: () => events.push(['countdown', 'stop']),
    visual: { stop: () => events.push(['visual', 'stop']) },
    stopStageDrone: () => events.push(['drone', 'stop']),
    audio: {
        bgMusicTargetVolume: 0.7, bgMusicTargetEQ: 0.2,
        stopMantraTrack: options => events.push(['mantra', options.restoreMusic]),
        stopGuidedTransitionTone: () => events.push(['tone', 'stop']),
        stopBackgroundMusic: seconds => events.push(['music', seconds]),
        stopVisualizationAmbience: seconds => events.push(['visualization', seconds]),
        stopPleasureAmbience: seconds => events.push(['ambience', seconds])
    }
};
const deps = {
    document, window: {}, state, storage: { setItem: (key, value) => saved.set(key, String(value)) },
    setText: (id, value) => events.push(['text', id, value]), translate: key => `translated:${key}`,
    wakeLock: { release: () => events.push(['wake-lock', 'release']) },
    piperTTS: { cancel: (reason, options) => events.push(['piper', reason, options.fadeSeconds]) },
    backgroundMusicStopFadeSeconds: 8, visualizationAmbienceExitFadeSeconds: 10,
    scheduleEarnHandoff: () => events.push(['earn', 'schedule']), now: () => 70_000
};

view.finish(owner, deps);
assert.equal(owner.isMeditationActive, false);
assert.equal(owner.isHypnosisJourney, false);
assert.equal(owner.sessionStartedAt, null);
assert.equal(owner.audio.bgMusicTargetVolume, 0);
assert.equal(owner.audio.bgMusicTargetEQ, 0);
assert.deepEqual(state.stats, { journeys: 4, time: 22 });
assert.equal(saved.get('chakra_stats_journeys'), '4');
assert.equal(saved.get('chakra_stats_time'), '22');
assert.equal(elements.get('stat-session-time'), undefined, 'stats are presented through the injected display adapter');
assert.deepEqual(events.filter(event => event[0] === 'text'), [
    ['text', 'stat-journeys', 4], ['text', 'stat-time', 22], ['text', 'stat-session-time', '1 mins']
]);
assert.equal(elements.get('completion-title').textContent, 'translated:ui.journeyComplete');
assert.equal(elements.get('completion-message').textContent, 'translated:ui.meditationCompleted');
assert.equal(elements.get('continue-to-earn').textContent, 'translated:ui.continueToEarn');
assert.equal(elements.get('close-completion').textContent, 'translated:ui.returnToRoom');
assert.ok(events.findIndex(event => event[0] === 'mantra') < events.findIndex(event => event[0] === 'music'));
assert.ok(events.findIndex(event => event[0] === 'music') < events.findIndex(event => event[0] === 'piper'));
assert.deepEqual(events.at(-1), ['earn', 'schedule']);
assert.ok(events.some(event => event[0] === 'completion-modal' && event[1] === 'remove' && event[2] === 'hidden'));
assert.ok(events.some(event => event[0] === 'app' && event[1] === 'style' && event[2] === '--app-brightness' && event[3] === '1'));
console.log('Completion session passed: time/stats, ordered audio cleanup, UI restoration and Earn handoff.');
