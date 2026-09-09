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
const makeBuffer = (channels, length, sampleRate) => {
    const data = Array.from({length:channels},()=>new Float32Array(length));
    return {length,sampleRate,numberOfChannels:channels,duration:length/sampleRate,getChannelData:i=>data[i]};
};
const ctx = {
    currentTime: 0,
    createBuffer: makeBuffer,
    createGain() { return { gain: new Param(), connect() {}, disconnect() {} }; },
    createBufferSource() {
        const source = { connect() {}, disconnect() {}, start(time) { this.started = time; }, stop(time) { this.stopped = time; } };
        sources.push(source);
        return source;
    }
};
const input = makeBuffer(2,2000,100);
for(let c=0;c<2;c++) for(let i=0;i<input.length;i++) input.getChannelData(c)[i]=Math.sin(i*.017+c)*.4;
const loop = new Loop(ctx, input, {}, 0.35, 5);
loop.start();
assert.equal(loop.activeSources[0].gain.gain.events[1][2], 0.04, 'entry must not multiply a long bus fade');
const envelope = JSON.stringify(loop.activeSources[0].gain.gain.events);
loop.setGain(0.2);
assert.equal(JSON.stringify(loop.activeSources[0].gain.gain.events), envelope, 'volume changes preserve overlap timing');
assert.equal(loop.output.gain.events.at(-1)[1], 0.2);
assert.equal(timers.length,0,'Native looping cannot underrun due to a throttled JavaScript timer');
assert.equal(sources[0].loop,true);
assert.equal(sources[0].loopStart,5);
assert.equal(sources[0].loopEnd,20);
assert.equal(sources[0].stopped,undefined,'No stop is scheduled at repeat boundaries');
for(let c=0;c<2;c++) {
    const original=input.getChannelData(c), rendered=sources[0].buffer.getChannelData(c);
    assert.deepEqual(rendered.slice(0,1500),original.slice(0,1500),'First entry preserves the original beginning');
    for(let i=0;i<500;i++) {
        const angle=i/500*Math.PI/2;
        assert.ok(Math.abs(rendered[1500+i]-(original[1500+i]*Math.cos(angle)+original[i]*Math.sin(angle)))<1e-7);
    }
    assert.ok(Math.abs(rendered.at(-1)-rendered[500])<.02,'Loop boundary continues smoothly after the overlap');
}
const repeat = new Loop(ctx,input,{},1,5);
assert.equal(repeat.prepareBuffer(),sources[0].buffer,'Prepared PCM is reused between sessions');
ctx.currentTime=36000;
assert.equal(loop.activeSources.length,1,'Long playback retains one native source');
ctx.currentTime = 16;
loop.stop(4);
assert.equal(sources[0].stopped, 20.02);
assert.equal(JSON.stringify(loop.activeSources[0].gain.gain.events), envelope, 'stop preserves repeat envelope and fades the output once');
sources[0].onended();
assert.equal(loop.activeSources.length,0,'Explicit stop releases the native source');
const fading = new Loop(ctx, input, {}, 1, 3);
fading.start(6);
assert.deepEqual(fading.output.gain.events.at(-1), ['ramp', 1, ctx.currentTime + 6]);
fading.stop(8);
const stoppingEnvelope = JSON.stringify(fading.output.gain.events);
fading.stop(8);
assert.equal(JSON.stringify(fading.output.gain.events), stoppingEnvelope, 'Repeated stop cannot restart the exit fade');
const mantraStart = app.slice(app.indexOf('    async playMantraTrack('), app.indexOf('    stopMantraTrack('));
assert.doesNotMatch(mantraStart, /mantraGain.gain.setValueAtTime\(0/, 'New mantra never zeros the retiring mantra bus');
assert.match(mantraStart, /mantraLoop.start\(MANTRA_MUSIC_FADE_SECONDS\)/);
assert.match(app, /cancel\('journey stopped', \{ fadeSeconds: 2 \}\)/);
assert.match(app, /cancel\('journey finished', \{ fadeSeconds: 2 \}\)/);
const short = new Loop(ctx, makeBuffer(1,40,100), {}, 1, 5);
assert.equal(short.crossfadeDuration, 0.2, 'short buffers cannot schedule backwards');
short.start();
const events = short.activeSources[0].gain.gain.events;
assert.ok(events.every((event, index) => index === 0 || event[2] >= events[index - 1][2]));
assert.match(app, /PIPER_CLIP_FADE_SECONDS, \/\/ Preserve final spoken words/, 'speech endings retain their words');
const stopDrone = vm.runInNewContext('({'+app.slice(app.indexOf('    stopDrone() {'),app.indexOf('    async playMantraTrack'))+'})').stopDrone;
let lfoStops=0;
const engine={ctx:{currentTime:0},stopBinaural(){},droneOscillators:[],elementalNodes:[{
    src:{stop(){}},lfo:{stop(t){assert.equal(t,5.1);lfoStops++;}},
    gain:{gain:{value:1,cancelScheduledValues(){},setValueAtTime(){},linearRampToValueAtTime(){}}}
}]};
stopDrone.call(engine);
assert.equal(lfoStops,1,'Stage exit stops elemental modulation');
console.log('Audio transitions passed: native repeat PCM, timer independence, bounded sources and oscillator cleanup (not device listening).');
