import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync('app.js', 'utf8');
const droneStopSource = fs.readFileSync('modules/audio-drone-stop.js', 'utf8');
const timers = [];
const mediaSource = fs.readFileSync('modules/media-lifecycle.js', 'utf8');
const mediaContext = vm.createContext({
    setTimeout(fn, delay) { timers.push({ fn, delay }); return timers.length; },
    clearTimeout() {}
});
vm.runInContext(mediaSource, mediaContext);
const Loop = mediaContext.ChakraMediaLifecycle.SeamlessLoop;
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
// Exercise the actual Visualization start method with the real loop class.
const startVisualization = vm.runInNewContext(`({${app.slice(app.indexOf('    async startVisualizationAmbience('), app.indexOf('    setVisualizationAmbienceDucked('))}}).startVisualizationAmbience`, {
    SeamlessLoop: Loop, state: { visualizationAmbience: 'space-race', volVisualizationAmbience: 0.1 },
    VISUALIZATION_AMBIENCE_ENTRY_FADE_SECONDS: 8
});
for (const fade of [8, 1.2]) {
    const engine = { ctx, visualizationAmbienceBuffer: input, visualizationAmbienceGain: ctx.createGain() };
    engine.visualizationAmbienceGain.gain.cancelScheduledValues = () => {};
    await startVisualization.call(engine, fade);
    const entry = engine.visualizationAmbienceLoop.output.gain.events;
    assert.deepEqual(entry.slice(-2), [['set', 0, 0], ['ramp', 0.1, fade]], 'Session and preview must fade from silence to the saved level');
    assert.equal(engine.visualizationAmbienceLoop.activeSources[0].source.loop, true);
}
sources.length = 0;
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
const mantraModule = fs.readFileSync('modules/audio-mantra-playback.js', 'utf8');
assert.doesNotMatch(mantraModule, /owner\.mantraGain\.gain\.setValueAtTime\(0/, 'New mantra never zeros the retiring mantra bus');
assert.match(mantraModule, /owner\.mantraLoop\.start\(musicFadeSeconds\)/);
assert.match(app, /cancel\('journey stopped', \{ fadeSeconds: 2 \}\)/);
assert.match(app, /cancel\('journey finished', \{ fadeSeconds: 2 \}\)/);
const short = new Loop(ctx, makeBuffer(1,40,100), {}, 1, 5);
assert.equal(short.crossfadeDuration, 0.2, 'short buffers cannot schedule backwards');
short.start();
const events = short.activeSources[0].gain.gain.events;
assert.ok(events.every((event, index) => index === 0 || event[2] >= events[index - 1][2]));
assert.equal(mediaContext.ChakraMediaLifecycle.constants.PIPER_CLIP_FADE_SECONDS, 0.05, 'speech endings retain their short final-word-safe envelope');
const droneStopContext = vm.createContext({ Object, window: {} });
vm.runInContext(droneStopSource, droneStopContext);
const stopDrone = droneStopContext.window.ChakraAudioDroneStop.stopDrone;
let lfoStops=0;
const engine={ctx:{currentTime:0},stopBinaural(){},droneOscillators:[],binauralNodes:[],elementalNodes:[{
    src:{stop(){}},lfo:{stop(t){assert.equal(t,5.1);lfoStops++;}},
    gain:{gain:{value:1,cancelScheduledValues(){},setValueAtTime(){},linearRampToValueAtTime(){}}}
}]};
stopDrone(engine);
assert.equal(lfoStops,1,'Stage exit stops elemental modulation');
console.log('Audio transitions passed: native repeat PCM, timer independence, bounded sources and oscillator cleanup (not device listening).');
