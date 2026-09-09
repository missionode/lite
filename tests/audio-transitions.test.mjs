import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync('app.js', 'utf8');
const timers = [];
const Loop = vm.runInNewContext(`${app.slice(app.indexOf('class SeamlessLoop {'), app.indexOf('class AudioEngine {'))}; SeamlessLoop`, {
    setTimeout(fn, delay) { timers.push({ fn, delay }); return timers.length; },
    clearTimeout() {}
});
class Param {
    value = 1;
    events = [];
    setValueAtTime(value, time) { this.events.push(['set', value, time]); }
    linearRampToValueAtTime(value, time) { this.events.push(['ramp', value, time]); }
    setValueCurveAtTime(curve, time, duration) { this.events.push(['curve', Array.from(curve), time, duration]); }
    cancelAndHoldAtTime(time) { this.events.push(['hold', time]); }
}
const sources = [];
const ctx = {
    currentTime: 0,
    createGain() { return { gain: new Param(), connect() {}, disconnect() {} }; },
    createBufferSource() {
        const source = { connect() {}, disconnect() {}, start(time) { this.started = time; }, stop(time) { this.stopped = time; } };
        sources.push(source);
        return source;
    }
};
const loop = new Loop(ctx, { duration: 20 }, {}, 0.35, 5);
loop.start();
assert.equal(loop.activeSources[0].gain.gain.events[1][2], 0.04, 'entry must not multiply a long bus fade');
const envelope = JSON.stringify(loop.activeSources[0].gain.gain.events);
loop.setGain(0.2);
assert.equal(JSON.stringify(loop.activeSources[0].gain.gain.events), envelope, 'volume changes preserve overlap timing');
assert.equal(loop.output.gain.events.at(-1)[1], 0.2);
timers[0].fn();
assert.ok(Math.abs(sources[1].started - 15.01) < 1e-9, 'next source overlaps before the first ends');
assert.equal(sources[0].stopped, 20.01, 'cleanup follows audio time, including suspension');
for (let i = 0; i < 65; i++) assert.ok(Math.abs(loop.fadeInCurve[i] ** 2 + loop.fadeOutCurve[i] ** 2 - 1) < 1e-6, 'repeat overlap preserves unit power for uncorrelated audio');
ctx.currentTime = 16;
loop.stop(4);
assert.equal(sources[0].stopped, 20.02);
assert.equal(JSON.stringify(loop.activeSources[0].gain.gain.events), envelope, 'stop preserves repeat envelope and fades the output once');
const short = new Loop(ctx, { duration: 0.4 }, {}, 1, 5);
assert.equal(short.crossfadeDuration, 0.2, 'short buffers cannot schedule backwards');
short.start();
const events = short.activeSources[0].gain.gain.events;
assert.ok(events.every((event, index) => index === 0 || event[2] >= events[index - 1][2]));
assert.match(app, /PIPER_CLIP_FADE_SECONDS, \/\/ Preserve final spoken words/, 'speech endings retain their words');
console.log('Audio transition envelopes passed (simulated audio clock; not device listening).');
