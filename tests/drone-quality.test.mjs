import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
const state={noFrequencyMode:false,eyesCloseMode:false,volDrone:.05};
const methods=vm.runInNewContext('(class {'+app.slice(app.indexOf('    startDrone(baseFreq'),app.indexOf('    stopGuidedTransitionTone('))+'}).prototype',{state});
const param=()=>({value:0,setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;}});
let nodes=[],oscillators=[];
const node=()=>{const n={frequency:param(),gain:param(),pan:param(),Q:param(),connect(){},disconnect(){this.disconnected=true;},start(){},stop(){}};nodes.push(n);return n;};
const engine={ctx:{currentTime:0,sampleRate:48000,createGain:node,createBiquadFilter:node,createStereoPanner:node,createOscillator(){const n=node();oscillators.push(n);return n;}},
    masterGain:{},droneOscillators:[],stopDrone(){this.droneOscillators=[];},startElementalLayer(){},stopFrequencyShot(){},stopGuidedTransitionTone(){}};
for(let i=0;i<50;i++) {
    nodes=[];oscillators=[];
    methods.startDrone.call(engine,528);
    assert.equal(oscillators.length,3,'One exact main tone and two support tones; no pitch LFO');
    assert.equal(oscillators[0].frequency.value,528);
    oscillators.forEach(osc=>osc.onended());
    assert.ok(nodes.every(n=>n.disconnected),'Every tone/filter/panner/gain disconnects after ending');
}
nodes=[];oscillators=[];
methods.startSleepDrone.call(engine,6);
assert.equal(oscillators[0].frequency.value,6);
oscillators.forEach(osc=>osc.onended());
assert.ok(nodes.every(n=>n.disconnected));
state.volDrone=0;nodes=[];oscillators=[];
methods.startFrequencyShot.call(engine,440);
assert.equal(engine.shotGain.gain.value,0,'Zero-volume Shots remain silent');
oscillators[0].onended();assert.ok(nodes.every(n=>n.disconnected));
assert.equal(methods.startGuidedTransitionTone.call(engine,440,2000),false,'Muted transition cue is skipped');
assert.equal(methods.startGuidedTransitionTone.call(engine,440,NaN),false);
console.log('Drone quality passed: exact pitch, 50 repeated cleanup cycles, sleep cleanup and true mute.');
