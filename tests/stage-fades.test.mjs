import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app = fs.readFileSync('app.js', 'utf8');
const mediaSource = fs.readFileSync('modules/media-lifecycle.js', 'utf8');
const mediaContext = vm.createContext({});
vm.runInContext(mediaSource, mediaContext);
const { stageFadeSeconds, withAudioStageFade } = mediaContext.ChakraMediaLifecycle;
for (const [duration, fade] of [[0,0],[1,.2],[10,2],[30,3],[60,3]]) assert.equal(stageFadeSeconds(duration),fade);
const audio = {};
await withAudioStageFade(audio, 10, async () => { assert.equal(audio.stageFadeWindow.limit,2); });
assert.equal(audio.stageFadeWindow,undefined);
await assert.rejects(withAudioStageFade(audio,10,async()=>{throw new Error('cancelled');}));
assert.equal(audio.stageFadeWindow,undefined,'Failure cannot leak a stage fade cap');
const source = fs.readFileSync('modules/audio-mantra-playback.js', 'utf8');
const mantraContext = vm.createContext({ window: {} });
vm.runInContext(source, mantraContext);
const stop = mantraContext.window.ChakraAudioMantraPlayback.stop;
function run(stageWindow) {
    const events=[]; let fade, retirement;
    const engine={ctx:{currentTime:20},mantraRequestId:0,elementalNodes:[],
        mantraLoop:{stop(seconds){fade=seconds;}},
        mantraTailWetGain:{gain:{value:.26,cancelAndHoldAtTime(){},setValueAtTime(v,t){events.push([v,t]);},linearRampToValueAtTime(v,t){events.push([v,t]);}}},
        setConvolverActive(...args){retirement=args.at(-1);},restoreBackgroundMusicAfterMantra(){}};
    stop(engine,{stageWindow},{state:{volDrone:.2},fadeSeconds:8,tailSeconds:7}); return {fade,retirement,events};
}
assert.equal(run(null).fade,8,'Session ending retains long fade');
assert.equal(run(null).retirement,15.1);
const transition=run(4);
assert.equal(transition.fade,2);
assert.deepEqual(transition.events.at(-1),[0,24],'Mantra tail reaches zero before the affirmation');
assert.equal(transition.retirement,4.1);
assert.equal(run(0).fade,0,'Fast-test zero gap remains zero');
assert.match(app,/stopMantraTrack\(\{ stageWindow: transitionSeconds \}\)/);
assert.match(app,/await narrationPromise/,'Intervals never truncate narration');
console.log('Stage fades passed: short-duration limits, scope cleanup, mantra tail deadline and preserved long session exit.');
