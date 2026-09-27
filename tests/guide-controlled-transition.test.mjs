import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync('modules/guide-controlled-transition.js', 'utf8'), context);
const transition = context.window.ChakraGuideControlledTransition.create();
const listeners = new Map();
const makeElement = () => ({
    hidden: false, disabled: false, textContent: '', focused: false,
    focus() { this.focused = true; },
    addEventListener(type, callback) { listeners.set(type, callback); },
    removeEventListener(type, callback) { if (listeners.get(type) === callback) listeners.delete(type); }
});
const elements = new Map([
    ['guide-controlled-continue', makeElement()],
    ['icebreaker-title', makeElement()],
    ['icebreaker-subtitle', makeElement()],
    ['icebreaker-timer', makeElement()]
]);
const document = { getElementById: id => elements.get(id) };
const button = elements.get('guide-controlled-continue');
const title = elements.get('icebreaker-title');
const subtitle = elements.get('icebreaker-subtitle');
const timer = elements.get('icebreaker-timer');
let shown = null;
let sleeps = 0;
const owner = {
    isMeditationActive: true, isPaused: false, guideControlledResolve: null,
    async pauseAwareSleep(ms) { assert.equal(ms, 1000); sleeps++; }
};
const deps = { document, showScreen: screen => { shown = screen; }, icebreakerScreen: 'guide-screen', formatClockDuration: ms => `clock:${ms}` };

const waiting = transition.run(owner, {
    durationSeconds: 1.4, title: 'Rest', subtitle: 'Settle', readyText: 'Ready', continueLabel: 'Continue'
}, deps);
while (!owner.guideControlledResolve) await new Promise(resolve => setImmediate(resolve));
assert.equal(shown, 'guide-screen');
assert.equal(title.textContent, 'Rest');
assert.equal(subtitle.textContent, 'Ready');
assert.equal(timer.textContent, 'clock:0');
assert.equal(sleeps, 1);
assert.equal(button.textContent, 'Continue');
assert.equal(button.hidden, false);
assert.equal(button.disabled, false);
assert.equal(button.focused, true);
owner.isPaused = true;
listeners.get('click')();
assert.equal(button.hidden, false, 'A paused session cannot accept Continue');
owner.isPaused = false;
listeners.get('click')();
assert.equal(await waiting, true);
assert.equal(owner.guideControlledResolve, null);
assert.equal(button.hidden, true);
assert.equal(button.disabled, true);
assert.equal(listeners.has('click'), false);

const noTimer = transition.run(owner, {
    durationSeconds: 0, title: 'Bath', subtitle: 'Guided', readyText: 'Next', continueLabel: 'Proceed', showTimer: false
}, deps);
while (!owner.guideControlledResolve) await new Promise(resolve => setImmediate(resolve));
assert.equal(timer.hidden, true);
owner.guideControlledResolve(false);
assert.equal(await noTimer, false, 'Stop resolves an active guide wait as cancelled');
assert.equal(button.hidden, true);

assert.equal(await transition.run(owner, {}, { ...deps, document: { getElementById: () => null } }), false,
    'Missing guide controls fail closed');
owner.isMeditationActive = false;
assert.equal(await transition.run(owner, { durationSeconds: 1 }, deps), false,
    'Inactive sessions cannot enter a timed guide wait');
console.log('Guide-controlled transition passed: countdown, pause guard, continue, cancellation cleanup and missing UI guards.');
