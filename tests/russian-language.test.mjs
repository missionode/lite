import assert from 'node:assert/strict';
import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const manifest = readJson('../language-manifest.json');
const voices = readJson('../piper-models.json');
const englishLocale = readJson('../locales/en.json');
const russianLocale = readJson('../locales/ru.json');
const scripts = readJson('../scripts.json');

const russian = manifest.languages.find((language) => language.id === 'ru');
assert.deepEqual(russian && {
    locale: russian.locale,
    localeSource: russian.localeSource,
    browserPrefixes: russian.browserPrefixes,
    defaultPiperVoice: russian.defaultPiperVoice
}, {
    locale: 'ru-RU',
    localeSource: 'locales/ru.json',
    browserPrefixes: ['ru'],
    defaultPiperVoice: 'ru_RU-irina-medium'
}, 'Russian must be registered as a complete content and display language.');

const irina = voices.voices.find((voice) => voice.id === 'ru_RU-irina-medium');
assert.deepEqual(irina && {
    language: irina.language,
    locale: irina.locale,
    modelPath: irina.modelPath,
    configPath: irina.configPath,
    phonemizerVoice: irina.phonemizerVoice
}, {
    language: 'ru',
    locale: 'ru-RU',
    modelPath: 'ru/ru_RU/irina/medium/ru_RU-irina-medium.onnx',
    configPath: 'ru/ru_RU/irina/medium/ru_RU-irina-medium.onnx.json',
    phonemizerVoice: 'ru'
}, 'Russian must retain the approved Irina Medium registry identity and paths.');

function assertSameShape(source, candidate, path = '') {
    for (const key of Object.keys(source)) {
        const keyPath = path ? `${path}.${key}` : key;
        assert.ok(Object.hasOwn(candidate, key), `Russian locale is missing ${keyPath}`);
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            assertSameShape(source[key], candidate[key], keyPath);
        }
    }
}

assertSameShape(englishLocale, russianLocale);

function assertRussianNarrationSiblings(value, path = '') {
    if (Array.isArray(value)) {
        value.forEach((item, index) => assertRussianNarrationSiblings(item, `${path}[${index}]`));
        return;
    }
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
        const keyPath = path ? `${path}.${key}` : key;
        if (key.endsWith('_en')) {
            assert.ok(Object.hasOwn(value, `${key.slice(0, -3)}_ru`), `Russian narration is missing ${keyPath}`);
        }
        if (key === 'en') assert.ok(Object.hasOwn(value, 'ru'), `Russian narration is missing ${path}.ru`);
        assertRussianNarrationSiblings(child, keyPath);
    }
}

assertRussianNarrationSiblings(scripts);
console.log('Russian language contract passed.');
