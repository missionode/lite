import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const registry = JSON.parse(read('piper-models.json')).voices;
const manifest = JSON.parse(read('language-manifest.json'));
const app = read('app.js');
const sw = read('sw.js');

// Owner's own Malayalam voice (Syam), served from the Lite folder itself.
const voice = registry.find(entry => entry.id === 'ml_IN-syam-custom');
assert.ok(voice, 'the Syam custom voice is registered');
assert.equal(voice.language, 'ml', 'it is offered with the other Malayalam narration voices');
assert.equal(voice.locale, 'ml-IN');
assert.equal(voice.gender, 'male');
assert.match(voice.label, /Syam/);
assert.equal(voice.pitchOnly, undefined, 'it is a normal narration voice, selectable like Arjun and Meera');
assert.equal(voice.phonemizerVoice, 'ml');
assert.equal(voice.modelBaseUrl, './piper/models', 'the model loads from the Lite folder, not an external host');

const modelFile = new URL(`../piper/models/${voice.modelPath}`, import.meta.url);
const configFile = new URL(`../piper/models/${voice.configPath}`, import.meta.url);
assert.equal(fs.statSync(modelFile).size, voice.modelSize, 'registry size matches the shipped model');
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
assert.equal(config.espeak.voice, 'ml');
assert.equal(config.phoneme_type, 'espeak');
assert.equal(config.audio.sample_rate, 22050);
assert.equal(config.num_speakers, 1);

// Same pipeline as every Malayalam voice: listed by language, all effects apply.
const malayalam = registry.filter(entry => entry.language === 'ml' && !entry.pitchOnly).map(entry => entry.id);
assert.deepEqual(malayalam, ['ml_IN-arjun-medium', 'ml_IN-meera-medium', 'ml_IN-syam-custom']);
assert.equal(manifest.languages.find(language => language.id === 'ml').defaultPiperVoice, 'ml_IN-arjun-medium', 'Arjun stays the default');

// Downloaded on demand and kept offline by the Piper cache, never precached at install.
assert.doesNotMatch(sw, /voice\.onnx/, 'the 63 MB model is not in the install precache');
assert.match(sw, /url\.pathname\.includes\('\/piper\/'\)/, 'requests under /piper/ use the on-demand Piper cache');
assert.match(sw, /const PIPER_CACHE_NAME = 'chakra-piper-v13'/, 'the Piper cache is renewed so phones see the new registry');
assert.match(app, /loadVoiceRegistry\(fetch, console, 'piper-models\.json\?v=5'\)/, 'the registry URL is renewed');

console.log('Custom Malayalam voice (Syam) passed: registered with the Malayalam voices, served from the Lite folder, on-demand offline cache.');
