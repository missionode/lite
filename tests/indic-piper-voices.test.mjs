import assert from 'node:assert/strict';
import fs from 'node:fs';

const json = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const manifest = json('language-manifest.json');
const registry = json('piper-models.json');
const tamilLocale = json('locales/ta.json');
const englishLocale = json('locales/en.json');
const app = fs.readFileSync('app.js', 'utf8');
const lifecycle = fs.readFileSync('modules/piper-lifecycle.js', 'utf8');
const worker = fs.readFileSync('piper-worker.js', 'utf8');
const runtime = fs.readFileSync('piper/runtime/piper-tts-web.js', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

for (const [language, id] of [['ta', 'ta_IN-rasa_male-medium'], ['hi', 'hi_IN-priyamvada-medium']]) {
    const voice = registry.voices.find(item => item.id === id);
    assert.ok(voice, `${language} community Piper voice is registered`);
    assert.equal(voice.language, language);
    const languageEntry = manifest.languages.find(item => item.id === language);
    assert.equal(languageEntry.defaultPiperVoice, id);
    assert.ok(languageEntry.preview.length > 20, `${language} has a complete preview phrase`);
}

assert.equal(manifest.languages.find(item => item.id === 'ta').localeSource, 'locales/ta.json');
assert.deepEqual(Object.keys(tamilLocale.ui).sort(), Object.keys(englishLocale.ui).sort(), 'Tamil UI keys match English');
assert.deepEqual(Object.keys(tamilLocale.system).sort(), Object.keys(englishLocale.system).sort(), 'Tamil system keys match English');
function auditTamilNarration(value, path = 'scripts') {
    if (Array.isArray(value)) {
        value.forEach((item, index) => auditTamilNarration(item, `${path}[${index}]`));
        return;
    }
    if (!value || typeof value !== 'object') return;
    const hasLocaleShape = ['en', 'ml', 'hi', 'ru'].some(language => typeof value[language] === 'string');
    if (hasLocaleShape) assert.ok(value.ta?.trim(), `Tamil narration missing at ${path}.ta`);
    for (const [key, child] of Object.entries(value)) {
        if (key.endsWith('_en')) assert.ok(value[key.replace(/_en$/, '_ta')]?.trim(), `Tamil narration missing at ${path}.${key.replace(/_en$/, '_ta')}`);
        auditTamilNarration(child, `${path}.${key}`);
    }
}
auditTamilNarration(json('scripts.json'));
assert.match(worker, /modelBaseUrl:\s*voiceDefinition\.modelBaseUrl/);
assert.match(runtime, /modelBaseUrl\s*\|\|\s*HF_BASE/);
assert.match(runtime, /var [^;]*_modelBaseUrl[^;]*;/, 'The custom repository backing field must be declared.');
assert.match(runtime, /_modelBaseUrl = new WeakMap\(\)/, 'The backing field must be initialized before a session uses it.');
assert.match(lifecycle, /registryUrl\s*=\s*'piper-models\.json'/);
assert.match(app, /language-manifest\.json\?v=2/);
assert.match(app, /piper-models\.json\?v=4/);
assert.match(serviceWorker, /chakra-piper-v11/);
assert.match(serviceWorker, /chakra-language-v73/);
assert.match(serviceWorker, /LANGUAGE_ASSETS\s*=\s*\['\.\/language-manifest\.json\?v=2',\s*'\.\/locales\/ta\.json'\]/);
assert.match(serviceWorker, /chakra-v5\.351/);
assert.doesNotMatch(serviceWorker, /hostname\s*===\s*['"]huggingface\.co['"]/, 'ONNX downloads are not duplicated in Service Worker storage');
assert.match(html, /data-i18n="ui\.piperCommunityVoiceNote"/);

console.log('Tamil localization and Tamil/Hindi community Piper setup passed.');
