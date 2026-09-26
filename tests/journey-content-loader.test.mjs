import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/journey-content-loader.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const context = { console, Date };
context.window = context;
vm.runInNewContext(source, context);
const { loadAndValidate } = context.ChakraJourneyContentLoader;
assert.match(app, /journeyContentLoader\.loadAndValidate\(/);
assert.ok(html.indexOf('modules/journey-content-loader.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /chakra-v5\.310[\s\S]*?\.\/modules\/journey-content-loader\.js\?v=1\.0/);

const valid = { lang: 'en' };
const checked = [];
const resolved = [];
const validate = (scripts, options) => {
    checked.push({ scripts, options });
    return { valid: true, missing: [] };
};
const validationContext = { value: 'preparation', options: { yoga: false, highEnergy: false } };

let fetchedUrl = '';
let result = await loadAndValidate({
    scripts: null,
    scriptsLanguage: null,
    language: 'en',
    scriptSource: 'default',
    contentSource: 'scripts.json',
    fetcher: async url => {
        fetchedUrl = url;
        return { ok: true, json: async () => valid };
    },
    validate,
    onResolved: (scripts, language) => resolved.push({ scripts, language }),
    getValidationContext: () => validationContext,
    log() {}
});
assert.match(fetchedUrl, /^scripts\.json\?v=\d+$/);
assert.equal(result.scripts, valid);
assert.equal(result.scriptsLanguage, 'en');
assert.equal(result.context, 'preparation');
assert.deepEqual(resolved.at(-1), { scripts: valid, language: 'en' });
assert.equal(checked.at(-1).options, validationContext.options);

let fetchCount = 0;
result = await loadAndValidate({
    scripts: valid,
    scriptsLanguage: 'en',
    language: 'en',
    scriptSource: 'default',
    contentSource: 'en.json?edition=1',
    fetcher: async () => { fetchCount++; },
    validate,
    getValidationContext: () => validationContext,
    log() {}
});
assert.equal(fetchCount, 0, 'same-language cached scripts are reused');
assert.equal(result.scripts, valid);

const custom = { lang: 'custom' };
result = await loadAndValidate({
    scripts: valid,
    scriptsLanguage: 'en',
    language: 'ml',
    scriptSource: 'custom',
    customScript: custom,
    contentSource: 'ml.json',
    fetcher: async () => { throw new Error('custom bundle must not fetch'); },
    validate,
    getValidationContext: () => validationContext,
    log() {}
});
assert.equal(result.scripts, custom);
assert.equal(result.scriptsLanguage, 'ml');

await assert.rejects(loadAndValidate({
    scripts: null,
    scriptsLanguage: null,
    language: 'ru',
    scriptSource: 'default',
    contentSource: 'ru.json',
    fetcher: async () => ({ ok: false, status: 503 }),
    validate,
    getValidationContext: () => validationContext,
    log() {}
}), /Unable to load language content \(503\)/);

await assert.rejects(loadAndValidate({
    scripts: valid,
    scriptsLanguage: 'en',
    language: 'en',
    scriptSource: 'default',
    contentSource: 'scripts.json',
    validate: () => ({ valid: false, missing: ['intro.gratitude', 'root.mantra'] }),
    onResolved: (scripts, language) => resolved.push({ scripts, language }),
    getValidationContext: () => validationContext,
    log() {}
}), /Script has missing or invalid required sections: intro\.gratitude, root\.mantra/);
assert.deepEqual(resolved.at(-1), { scripts: valid, language: 'en' }, 'the app cache is updated before bundle validation, matching the former order');

console.log('Journey content loader passed: source selection, cache reuse, validation context timing and failure paths.');
