import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const page = read('docs/voice-tuner.html');
const runtime = read('piper/runtime/piper-tts-web.js');
const worker = read('piper-worker.js');
const sw = read('sw.js');

// Exact tuning values reach the model, bounded; normal narration keeps its factors.
assert.match(runtime, /const noiseScale = exact\(settings\.noiseScale\) \?\? inference\.noise_scale \* feelingFactor\(settings\.noiseScaleFactor\)/);
assert.match(runtime, /const noiseW = exact\(settings\.noiseW\) \?\? inference\.noise_w \* feelingFactor\(settings\.noiseWFactor\)/);
assert.match(runtime, /Math\.max\(0, Math\.min\(1\.5, number\)\)/, 'exact values are bounded to 0–1.5');
assert.match(worker, /import\('\.\/piper\/runtime\/piper-tts-web\.js\?v=2'\)/, 'the worker loads the versioned runtime');

// The tuner page: three Piper parameters, per-voice browser storage, export and import.
assert.match(page, /<input id="lengthScale" type="range" min="0\.75" max="1\.5"/);
assert.match(page, /<input id="noiseScale" type="range" min="0" max="1\.2"/);
assert.match(page, /<input id="noiseW" type="range" min="0" max="1\.2"/);
assert.match(page, /new Worker\('\.\.\/piper-worker\.js\?v=2', \{ type: 'module' \}\)/, 'a versioned worker so phones fetch the new runtime');
assert.match(page, /const STORAGE_KEY = 'lite_voice_tuning_v1'/);
assert.match(page, /try \{ return JSON\.parse\(localStorage\.getItem\(STORAGE_KEY\)/, 'storage reads never break the page');
assert.match(page, /try \{ localStorage\.setItem\(STORAGE_KEY/, 'storage writes never break the page');
assert.match(page, /schema: 1, app: 'Lite voice tuner'/, 'the export carries a schema');
assert.match(page, /data\?\.schema !== 1/, 'import checks the schema');
assert.match(page, /Math\.max\(Number\(\$\(key\)\.min\), Math\.min\(Number\(\$\(key\)\.max\), number\)\)/, 'imported values are clamped to the slider ranges');
assert.match(page, /voice\.pitchOnly/, 'Pitch-only voices are not offered');
assert.match(page, /\$\(id\)\.addEventListener\('change', \(\) => \{ save\(\); play\(tuned\(\)\); \}\)/, 'releasing a slider saves and re-speaks');

// A development tool: not part of the app's offline install.
assert.doesNotMatch(sw, /voice-tuner/);

console.log('Voice tuner passed: exact bounded settings, versioned runtime, three sliders, per-voice saving, export/import.');
