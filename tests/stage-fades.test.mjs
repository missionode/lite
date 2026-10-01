import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app = fs.readFileSync('app.js', 'utf8');
const chakraSession = fs.readFileSync('modules/chakra-session.js', 'utf8');
const journeyTransitionStages = fs.readFileSync('modules/journey-transition-stages.js', 'utf8');
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
assert.match(chakraSession,/owner\.audio\.stopMantraTrack\(\{ stageWindow: exitSeconds \}\)/);
// Owner report (Oct 2026): the mantra dropped suddenly. It now leaves over a
// 12 s window (6 s fade + reverb tail) that starts inside the chant time.
assert.match(chakraSession,/exitSeconds = Math\.max\(transitionSeconds, Number\(timing\('transitions', 'chakraMantraExit', transitionSeconds\)\)/);
assert.match(chakraSession,/- \(\(exitSeconds - transitionSeconds\) \* 1000\)/,'the longer exit is taken from the chant time, so total time is unchanged');
const timingConfig=JSON.parse(fs.readFileSync('timing-config.json','utf8'));
assert.equal(timingConfig.transitions.chakraMantraExit,12);
assert.equal(run(12).fade,6,'a chakra ending fades the mantra over 6 seconds, not 2');
const appSource=fs.readFileSync('app.js','utf8');
assert.match(appSource,/this\.audio\.stopMantraTrack\(\{ stageWindow: 6 \}\)/,'Skip fades the mantra over about 3 seconds');
assert.match(appSource,/fadeOutputForPause\(paused\)[\s\S]*?ramp\(0, 0\.8\)[\s\S]*?ctx\.suspend\(\)[\s\S]*?ctx\.resume\(\)[\s\S]*?ramp\(1, 1\.2\)/,'Pause fades out before suspending and fades back in on resume');
const init=fs.readFileSync('modules/audio-engine-initialization.js','utf8');
assert.match(init,/this\.masterLimiter\.connect\(this\.pauseFader\);\s*this\.pauseFader\.connect\(this\.ctx\.destination\)/);
assert.match(journeyTransitionStages,/await narration;/,'Intervals never truncate narration');
console.log('Stage fades passed: short-duration limits, scope cleanup, mantra tail deadline and preserved long session exit.');
