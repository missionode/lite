import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const start = app.indexOf('async function testVoice()');
const end = app.indexOf('\nfunction loadPreferences()', start);
const preview = app.slice(start, end);

assert.ok(start >= 0 && end > start, 'The settings voice-preview handler must exist.');
assert.match(preview, /const sample = getLanguageConfig\(\)\.preview \|\| contentT\('system\.centeringBreath'\)/);
assert.match(preview, /state\.voices\.find\(voice => voiceMatchesLanguage\(voice\)\)/, 'Prefer a browser voice matching the active language.');
assert.match(preview, /state\.voiceName = fallbackValue;\s*voiceSelect\.value = fallbackValue;/, 'Show the temporary fallback in the voice picker.');
assert.match(preview, /window\.speechSynthesis\.speak\(utterance\)/, 'Speak the same sample with the browser voice after Piper fails.');
assert.match(preview, /setVoiceStatus\(t\('ui\.piperFallback'\)\)/, 'Report fallback status after browser speech starts.');
assert.match(preview, /setVoiceStatus\(t\('ui\.piperPreviewFailed'\), 'error'\)/, 'Keep the failure message if browser speech is unavailable too.');
console.log('Piper preview browser fallback checks passed.');
