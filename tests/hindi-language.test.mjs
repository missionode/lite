import assert from 'node:assert/strict';
import fs from 'node:fs';

const json = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const manifest = json('../language-manifest.json');
const piper = json('../piper-models.json');
const english = json('../locales/en.json');
const hindi = json('../locales/hi.json');
const scripts = json('../scripts.json');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');

const language = manifest.languages.find((item) => item.id === 'hi');
assert.deepEqual(language && { locale: language.locale, localeSource: language.localeSource, browserPrefixes: language.browserPrefixes, defaultPiperVoice: language.defaultPiperVoice }, { locale: 'hi-IN', localeSource: 'locales/hi.json', browserPrefixes: ['hi'], defaultPiperVoice: undefined });
assert.equal(piper.voices.some((voice) => voice.language === 'hi'), false, 'Hindi must remain browser-TTS-only until a compatible Piper licence is approved.');
assert.match(app, /function canUseEarnHandoff\(\)[\s\S]*?state\.language !== 'hi'/, 'Hindi must not use the Earn handoff.');
assert.match(app, /function scheduleEarnHandoff\(\)[\s\S]*?if \(!canUseEarnHandoff\(\)\) return;/, 'Hindi must not schedule a delayed Earn handoff.');

function sameShape(source, candidate, path = '') { for (const key of Object.keys(source)) { const next = path ? `${path}.${key}` : key; assert.ok(Object.hasOwn(candidate, key), `Hindi locale is missing ${next}`); if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) sameShape(source[key], candidate[key], next); } }
function hindiSiblings(value, path = '') { if (Array.isArray(value)) return value.forEach((item, index) => hindiSiblings(item, `${path}[${index}]`)); if (!value || typeof value !== 'object') return; for (const [key, child] of Object.entries(value)) { const next = path ? `${path}.${key}` : key; if (key.endsWith('_en')) assert.ok(Object.hasOwn(value, `${key.slice(0, -3)}_hi`), `Hindi narration is missing ${next}`); if (key === 'en') assert.ok(Object.hasOwn(value, 'hi'), `Hindi narration is missing ${path}.hi`); hindiSiblings(child, next); } }
sameShape(english, hindi); hindiSiblings(scripts);
console.log('Hindi language contract passed.');
