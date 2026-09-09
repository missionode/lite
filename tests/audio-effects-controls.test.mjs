import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app = fs.readFileSync('app.js','utf8');
const modes = ['off','stereo','headphones','room'];
const method = (name,next) => vm.runInNewContext(`({${app.slice(app.indexOf(`    ${name}(`),app.indexOf(`    ${next}(`))}})`, {
    VOICE_REVERB_TAIL_SECONDS:3.2, DEFAULT_SPATIAL_MODE:'off', normalizeSpatialMode:value=>modes.includes(value)?value:'off'
})[name];
const parameter = () => ({value:0, cancelScheduledValues(){}, setValueAtTime(v){this.value=v;}, linearRampToValueAtTime(v){this.value=v;}});
const node = () => ({gain:parameter(),delayTime:parameter(),frequency:parameter(),panningModel:'equalpower'});
const engine = {
    setConvolverActive(){},
    ctx:{currentTime:10}, spatialDronePanner:node(),spatialMusicPanner:node(),spatialMantraPanner:node(),spatialPleasurePanner:node(),
    spatialPanLfoGain:node(), pleasureLoops:[], setSpatialPosition(n,p){n.position=p;},
    voiceEchoSend:node(),voiceEchoDelay:node(),voiceEchoConvolver:node(),voiceEchoWetGain:node(),voiceEchoFilter:node(),
    setVoiceEcho:method('setVoiceEcho','setMusicEcho'), setSpatialMode:method('setSpatialMode','setVoiceTuning')
};
for (const [voice,wet] of Object.entries({off:0,light:.12,spacious:.18})) {
    engine.setVoiceEcho(voice);
    for (const spatial of modes) {
        engine.setSpatialMode(spatial);
        assert.equal(engine.voiceEchoWetGain.gain.value,wet,`${spatial} must not override ${voice}`);
        engine.setVoiceEcho(voice);
        assert.equal(engine.voiceEchoWetGain.gain.value,wet);
        assert.equal(engine.spatialMusicPanner.panningModel,spatial==='headphones'?'HRTF':'equalpower');
        for (const n of [engine.spatialDronePanner,engine.spatialMusicPanner,engine.spatialMantraPanner]) assert.ok(n.position.z<0,'Primary sounds stay in front');
        if (spatial==='off') assert.equal(engine.spatialPanLfoGain.gain.value,0);
    }
}
engine.setVoiceEcho('invalid'); assert.equal(engine.voiceEchoWetGain.gain.value,0);
assert.equal(engine.voiceEchoDelay.delayTime.value,0,'Preset switching must never automate pre-delay');
engine.voiceWarmthFilter=node(); engine.voiceClarityFilter=node();
const tune=method('setVoiceTuning','setConvolverActive');
tune.call(engine,500,-500);
assert.equal(engine.voiceWarmthFilter.gain.value,3);
assert.equal(engine.voiceClarityFilter.gain.value,-4);
tune.call(engine,NaN,Infinity);
assert.equal(engine.voiceWarmthFilter.gain.value,0);
assert.equal(engine.voiceClarityFilter.gain.value,0);
engine.setSpatialMode('invalid'); assert.equal(engine.spatialPanLfoGain.gain.value,0);
let moves=0;
engine.setSpatialPosition=()=>{moves++;};
engine.setSpatialMode('room'); const beforeRepeat=moves;
engine.setSpatialMode('room'); assert.equal(moves,beforeRepeat,'Repeated settings do not restart spatial automation');
const position=method('setSpatialPosition','schedulePleasureSpatialApproach');
const fallback=node(); fallback.pan=parameter();
position.call(engine,fallback,{x:1,y:0,z:-1},10);
assert.ok(Math.abs(fallback.pan.value-.5)<1e-8,'Fallback follows the same 45-degree bearing');
assert.match(app,/bgMusicEQ\.type = 'peaking'/);
assert.match(app,/const targetEQ = factor < 1\.0 \? -3 : 0/);
assert.doesNotMatch(app,/reverbGain|reverbWet|reverbFilter|triggerReverbSwell/);
assert.equal((app.match(/this\.exciter\.connect\(this\.presenceFilter\)/g)||[]).length,1);
assert.match(app,/voiceEchoConvolver\.connect\(this\.voiceEchoFilter\)/);
assert.match(app,/musicEchoConvolver\.connect\(this\.musicEchoFilter\)/);
console.log('Audio effects control matrix passed: 12 combinations, fallbacks and shared routing.');
