import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app = fs.readFileSync('app.js', 'utf8');
const helpers = app.slice(app.indexOf('function stageFadeSeconds('), app.indexOf('const VOICE_REVERB_TAIL_SECONDS'));
const { stageFadeSeconds, withAudioStageFade } = vm.runInNewContext(helpers + '; ({stageFadeSeconds, withAudioStageFade})');
for (const [duration, fade] of [[0,0],[1,.2],[10,2],[30,3],[60,3]]) assert.equal(stageFadeSeconds(duration),fade);
const audio = {};
await withAudioStageFade(audio, 10, async () => { assert.equal(audio.stageFadeWindow.limit,2); });
assert.equal(audio.stageFadeWindow,undefined);
await assert.rejects(withAudioStageFade(audio,10,async()=>{throw new Error('cancelled');}));
assert.equal(audio.stageFadeWindow,undefined,'Failure cannot leak a stage fade cap');
const source = app.slice(app.indexOf('    stopMantraTrack('),app.indexOf('    async startBackgroundMusic('));
const stop = vm.runInNewContext('({' + source + '})', {MANTRA_FADE_SECONDS:8,MANTRA_REVERB_TAIL_SECONDS:7,state:{volDrone:.2}}).stopMantraTrack;
function run(stageWindow) {
    const events=[]; let fade, retirement;
    const engine={ctx:{currentTime:20},mantraRequestId:0,elementalNodes:[],
        mantraLoop:{stop(seconds){fade=seconds;}},
        mantraTailWetGain:{gain:{value:.26,cancelAndHoldAtTime(){},setValueAtTime(v,t){events.push([v,t]);},linearRampToValueAtTime(v,t){events.push([v,t]);}}},
        setConvolverActive(...args){retirement=args.at(-1);},restoreBackgroundMusicAfterMantra(){}};
    stop.call(engine,{stageWindow}); return {fade,retirement,events};
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
