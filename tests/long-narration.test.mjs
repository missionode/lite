import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { BoundedPhonemizer } from '../piper/runtime/bounded-phonemizer.js';

// Exercise the real bundled WASM and language data, without a browser/network.
const root = new URL('../piper/runtime/',import.meta.url).pathname;
const code = fs.readFileSync(root+'piper-o91UDS6e.js','utf8').replace(/export\s*\{[\s\S]*?\};\s*$/, 'globalThis.factory=createPiperPhonemize;');
const box = {require:createRequire(import.meta.url),process,console,__dirname:root,__filename:root+'piper-o91UDS6e.js',WebAssembly,fetch,URL,TextDecoder,TextEncoder,setTimeout,clearTimeout};
vm.createContext(box); vm.runInContext(code,box);
let builds=0;
const phonemizer = new BoundedPhonemizer(options=>{
    builds++;
    return box.factory({...options,wasmBinary:fs.readFileSync(root+'piper_phonemize.wasm')});
},{piperWasm:root+'piper_phonemize.wasm',piperData:root+'piper_phonemize.data'});
const phrases=[['Breathe slowly.','en-us'],['Relax your shoulders.','en-us'],['ശാന്തമായി ശ്വസിക്കുക.','ml'],['Дышите спокойно.','ru']];
const baseline=[];
for(let i=0;i<64;i++) {
    const index=i%phrases.length;
    const result=await phonemizer.phonemize(...phrases[index]);
    if(i<4) baseline.push(Array.from(result));
    else assert.deepEqual(Array.from(result),baseline[index],'Repeated calls and retired instances preserve phonemes');
}
assert.equal(builds,8,'64 short sentences initialize eight instances, not 64');
assert.notDeepEqual(baseline[0],baseline[1]);
const before=builds;
await phonemizer.phonemize('Breathe. '.repeat(950),'en-us');
await phonemizer.phonemize('Breathe.','en-us');
assert.equal(builds,before+2,'Large input retires the instance before another call');
let fail=true, attempts=0;
const recovery=new BoundedPhonemizer(async options=>{
    attempts++;
    return {callMain(){options.print(fail?'invalid JSON':'{"phoneme_ids":[1,2]}');}};
},{});
await assert.rejects(recovery.phonemize('Test','en-us'));
fail=false;
assert.deepEqual(await recovery.phonemize('Test','en-us'),[1,2]);
assert.equal(attempts,2,'Bad output retires the instance and the next request can recover');

const app=fs.readFileSync('app.js','utf8');
const method=app.slice(app.indexOf('    async narrateWithPiper('),app.indexOf('    async narrateSoft('));
const decoded=[],played=[];
let cancelDuringDecode=false;
const piper={generation:0,synthesize:async text=>text,decode:async text=>{
    decoded.push(text);
    if(cancelDuringDecode) piper.generation++;
    return {text,duration:2};
},getNormalizationGain(){return 1;},playBuffer:async buffer=>{
    if(played.length===0) assert.ok(decoded.includes('Two'),'The next sentence is decoded before first playback completes');
    played.push(buffer.text);
}};
const sandbox={piperTTS:piper,state:{eyesCloseMode:false},timing:()=>0,
    PIPER_CLIP_FADE_SECONDS:.05,NARRATION_MANTRA_FADE_SECONDS:.05,
    setNarrationTickerAwaitingPlayback(){},setText(){},estimateNarrationDurationSeconds:()=>2,
    updateNarrationTickerDuration(){},startNarrationTicker(){},setTimeout};
const narrate=vm.runInNewContext('({'+method+'})',sandbox).narrateWithPiper;
const controller={isMeditationActive:true,isPaused:false,audio:{fadeInBackgroundMusic(){}},pauseAwareSleep:async()=>{}};
await narrate.call(controller,'One. Two. Three.');
assert.deepEqual(played,['One','Two','Three']);
played.length=0; cancelDuringDecode=true;
await narrate.call(controller,'One. Two.');
assert.deepEqual(played,[],'Cancellation during preparation cannot start stale speech');
console.log('Long narration passed: 64 real multilingual phonemizations, bounded instance retirement, decode-ahead and cancellation.');
