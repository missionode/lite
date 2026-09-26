import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/session-transport-controls.js?v=1.0') < html.indexOf('app.js?v='));
assert.match(worker, /modules\/session-transport-controls\.js\?v=1\.0/);
const events = new Map();
const calls = [];
const context = { document: { getElementById: id => ({ addEventListener: (type, fn) => events.set(id, fn) }) } };
vm.runInNewContext(readFileSync('modules/session-transport-controls.js', 'utf8'), context);
context.ChakraSessionTransportControls.bind({
    meditation: { togglePause: () => calls.push('pause'), stop: () => calls.push('stop') },
    logger: { log: message => calls.push(message) }
});
for (const [id, expected] of [['pause-meditation', 'Pause/Play button clicked'], ['stop-meditation', 'Stop button clicked']]) {
    let stopped = 0;
    events.get(id)({ stopImmediatePropagation: () => stopped++ });
    assert.equal(stopped, 1, 'the control prevents duplicate app-level handling');
    assert.equal(calls.at(-2), expected);
}
assert.deepEqual(calls, ['Pause/Play button clicked', 'pause', 'Stop button clicked', 'stop']);
console.log('Session transport controls passed: pause/stop event order and propagation guard.');
