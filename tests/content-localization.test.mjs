import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/content-localization.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const service = context.ChakraContentLocalization;
const scripts = JSON.parse(fs.readFileSync('scripts.json', 'utf8'));

assert.ok(Object.isFrozen(service), 'content/localization service should expose a stable API');
assert.equal(service.getPath({ a: { b: 'value' } }, 'a.b'), 'value');
assert.equal(service.getPath({}, 'a.b'), undefined);
const registry = [{ id: 'ml', locale: 'ml-IN' }, { id: 'en', locale: 'en-US' }];
assert.equal(service.getLanguageConfig(registry, 'ml').locale, 'ml-IN');
assert.equal(service.getLanguageConfig(registry, 'missing').id, 'en');
assert.equal(service.getLanguageConfig([], 'ru').locale, 'ru');
assert.equal(service.localized({ title_ml: 'ശീർഷകം', title_en: 'Title' }, 'title', 'ml'), 'ശീർഷകം');
assert.equal(service.localized({ title_ml: 'ശീർഷകം', title_en: 'Title' }, 'title', 'ru'), 'Title');
assert.equal(service.localized({ text: { ru: 'Текст', en: 'Text' } }, null, 'ru'), 'Текст');
assert.deepEqual([...service.localized({ phrases_en: ['one', 'two'] }, 'phrases', 'ru')], ['one', 'two']);
const bundles = { en: { ui: { begin: 'Begin' } }, ml: { ui: { begin: 'തുടങ്ങുക' } } };
assert.equal(service.translate(bundles, 'ui.begin', 'ml', 'en'), 'തുടങ്ങുക');
assert.equal(service.translate(bundles, 'ui.begin', 'ru', 'en'), 'Begin');
assert.equal(service.translate(bundles, 'ui.missing', 'ru', 'en'), 'ui.missing');
assert.equal(service.isGeneratedIntention('  ', 'Peace', 'Energy'), true);
assert.equal(service.isGeneratedIntention('Peace', 'Peace', 'Energy'), true);
assert.equal(service.isGeneratedIntention('My private intention', 'Peace', 'Energy'), false);
const isGenerated = (value, language) => value === `default:${language}`;
assert.equal(service.shouldRefreshLocalizedIntention('default:ml', 'ml', 'en', ['en', 'ml', 'ru', 'hi'], isGenerated), true,
    'generated copy from any supported language should refresh after a language change');
assert.equal(service.shouldRefreshLocalizedIntention('Personal intention', 'ml', 'en', ['en', 'ml', 'ru', 'hi'], isGenerated), false,
    'a user-authored intention should remain unchanged');
const fullOptions = { languages: ['en', 'ml', 'ru', 'hi'], highEnergy: true, corpse: true, bath: true, perinealCare: true, assistedBathing: true, massage: true, yoga: true, hooponopono: true };
assert.equal(service.validateScriptBundle(scripts, fullOptions).valid, true, 'production scripts should validate for every supported language');
const invalidFrequency = structuredClone(scripts);
invalidFrequency.root.frequency = 25000;
assert.equal(service.validateScriptBundle(invalidFrequency, { languages: ['en'] }).valid, false);
console.log('Content/localization contract passed: paths, language fallback, localized shapes and script validation.');
