import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/session-countdown.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /this\.sessionCountdown = new window\.ChakraSessionCountdown/);
assert.match(app, /startSessionCountdown\(totalMs\)\s*\{\s*this\.sessionCountdown\.start\(totalMs\);/);
assert.match(html, /modules\/session-countdown\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.00/);
assert.match(serviceWorker, /chakra-v5\.296[\s\S]*?modules\/session-countdown\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const Countdown = context.ChakraSessionCountdown;
assert.equal(typeof Countdown, 'function');
assert.throws(() => new Countdown({}), /requires clock, timer/);

let now = 1000;
let active = true;
let paused = false;
let nextTimerId = 1;
const timers = new Map();
const cleared = [];
const displays = [];
let hides = 0;
const countdown = new Countdown({
    now: () => now,
    setIntervalFn: (callback, ms) => {
        const timer = { id: nextTimerId++, callback, ms };
        timers.set(timer.id, timer);
        return timer.id;
    },
    clearIntervalFn: id => { cleared.push(id); timers.delete(id); },
    isActive: () => active,
    isPaused: () => paused,
    render: (remaining, total) => displays.push([remaining, total]),
    hide: () => { hides += 1; }
});

countdown.start(1000);
assert.equal(hides, 1, 'Starting first clears/hides any previous countdown.');
assert.deepEqual(displays, [[1000, 1000]], 'Initial display renders synchronously.');
assert.equal([...timers.values()][0].ms, 250, 'The existing 250ms update cadence remains.');
let tick = [...timers.values()][0].callback;
now += 250;
tick();
assert.equal(countdown.remainingMs, 750);
paused = true;
now += 1000;
tick();
assert.equal(countdown.remainingMs, 750, 'Paused time does not reduce the session countdown.');
paused = false;
now += 500;
tick();
assert.equal(countdown.remainingMs, 250, 'Resume subtracts only elapsed time since the last paused tick.');
active = false;
now += 400;
tick();
assert.equal(countdown.remainingMs, 250, 'Inactive sessions keep the countdown unchanged.');
active = true;
now += 1000;
tick();
assert.equal(countdown.remainingMs, 0, 'Long stalls clamp remaining time at zero.');
assert.deepEqual(displays.at(-1), [0, 1000]);

countdown.start(400);
assert.deepEqual(cleared, [1], 'Restart clears the previous ticker.');
assert.equal(countdown.totalMs, 400);
countdown.stop();
assert.equal(countdown.totalMs, 0);
assert.equal(countdown.remainingMs, 0);
assert.equal(countdown.lastTickAt, 0);
assert.equal(countdown.ticker, null);
assert.deepEqual(cleared, [1, 2]);
assert.equal(hides, 3, 'Restart and stop retain display cleanup.');

const displayCount = displays.length;
countdown.start(Number.NaN);
assert.equal(countdown.ticker, null, 'Invalid durations do not start an interval.');
assert.equal(displays.length, displayCount);
assert.equal(hides, 4, 'Invalid replacement still clears and hides the prior display.');

console.log('Session countdown lifecycle passed: exact cadence, pause/inactive accounting, clamping, restart, invalid duration, render and cleanup.');
