import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/completion-view.js?v=1.0') < html.indexOf('app.js?v='));
assert.match(worker, /modules\/completion-view\.js\?v=1\.0/);
const events = new Map();
const calls = [];
const modalClasses = [];
const auraStyle = {};
const elements = new Map([
    ['close-completion', { addEventListener: (type, fn) => events.set(type, fn) }],
    ['completion-modal', { classList: { add: value => modalClasses.push(value) } }],
    ['aura-bg', { style: auraStyle }]
]);
const lobby = { id: 'lobby' };
const context = { document: { getElementById: id => elements.get(id) || null } };
vm.runInNewContext(readFileSync('modules/completion-view.js', 'utf8'), context);
context.ChakraCompletionView.bind({
    cancelEarnHandoff: () => calls.push('cancel-handoff'),
    showScreen: screen => calls.push(`screen:${screen.id}`),
    lobbyScreen: lobby
});
events.get('click')();
assert.deepEqual(calls, ['cancel-handoff', 'screen:lobby']);
assert.deepEqual(modalClasses, ['hidden']);
assert.match(auraStyle.background, /radial-gradient/);
assert.equal(auraStyle.opacity, '1');
let timerId = 0;
const timers = new Map();
const handoffClasses = [];
const focusCalls = [];
const earnLink = {
    hidden: false,
    classList: { add: value => handoffClasses.push(['add', value]), remove: value => handoffClasses.push(['remove', value]) },
    focus: options => focusCalls.push(options)
};
const earnDocument = { getElementById: id => id === 'continue-to-earn' ? earnLink : null };
const fakeWindow = {
    setTimeout(callback, delay) {
        timerId += 1;
        const id = timerId;
        timers.set(id, { callback: () => { timers.delete(id); callback(); }, delay });
        return id;
    },
    clearTimeout(id) { timers.delete(id); }
};
let language = 'en';
const handoff = context.ChakraCompletionView.createEarnHandoff({ document: earnDocument, window: fakeWindow, getLanguage: () => language });
assert.equal(handoff.canUse(), true);
handoff.schedule();
assert.equal(timers.get(1).delay, 3000);
timers.get(1).callback();
assert.equal(earnLink.hidden, false);
assert.equal(JSON.stringify(focusCalls), JSON.stringify([{ preventScroll: true }]));
handoff.schedule();
handoff.cancel();
assert.equal(timers.size, 0);
assert.equal(earnLink.hidden, true);
assert.deepEqual(handoffClasses.at(-1), ['add', 'hidden']);
language = 'hi';
assert.equal(handoff.canUse(), false, 'Hindi keeps the Earn handoff disabled');
handoff.schedule();
assert.equal(timers.size, 0);
console.log('Completion view passed: handoff cancellation, modal close, aura restoration and Lobby return.');
