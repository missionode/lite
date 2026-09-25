import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/practice-module-loader.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const practiceIds = ['body-scan', 'guided-noting', 'dharana', 'box-breathing', 'visualization', 'hooponopono', 'undo-unlearn'];
const locales = ['en', 'ml', 'hi', 'ru'].map(language => JSON.parse(fs.readFileSync(`locales/${language}.json`, 'utf8')));
const selectionSource = app.slice(app.indexOf('function selectedPracticeModuleIds()'), app.indexOf('startMeditationBtn.addEventListener', app.indexOf('function selectedPracticeModuleIds()')));

assert.match(index, /modules\/practice-module-loader\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.93/);
for (const filename of ['body-scan', 'guided-noting', 'dharana', 'box-breathing', 'visualization', 'hooponopono', 'undo-unlearn']) {
    assert.doesNotMatch(index, new RegExp(`modules/${filename}-practice\\.js`), `${filename} must not load eagerly`);
    assert.match(sw, new RegExp(`modules/${filename}-practice\\.js\\?v=1\\.0`), `${filename} remains offline cached`);
}
assert.match(sw, /modules\/practice-module-loader\.js\?v=1\.0/);
assert.match(app, /selectedPracticeModuleIds\(\)[\s\S]*?await practiceModuleLoader\.loadMany\(selectedModules\)/);
for (const [toggle, id] of [
    ['body-scan-addon-toggle', 'body-scan'], ['noting-addon-toggle', 'guided-noting'],
    ['dharana-addon-toggle', 'dharana'], ['box-breathing-experience-toggle', 'box-breathing'],
    ['visualization-addon-toggle', 'visualization'], ['hooponopono-experience-toggle', 'hooponopono'],
    ['undo-unlearn-addon-toggle', 'undo-unlearn']
]) assert.match(selectionSource, new RegExp(`${toggle}['\"]?,\\s*['\"]${id}`));
assert.match(app, /alert\(journeyT\('ui\.practiceLoadFailed'\)\);\s*return;/, 'a failed module load stops the start flow before continuing');
assert.equal(packageJson.scripts['test:practice-module-loader'], 'node tests/practice-module-loader.test.mjs');
assert.ok(locales.every(locale => locale.ui.practiceLoadFailed), 'load failure recovery is localized in every bundled language');

const scripts = [];
const context = vm.createContext({
    URL,
    document: {
        baseURI: 'https://example.test/lite/',
        createElement: () => ({ parentNode: null }),
        head: {
            appendChild(script) {
                scripts.push(script);
                script.parentNode = this;
                queueMicrotask(() => {
                    const id = new URL(script.src).pathname.split('/').at(-1).replace('-practice.js', '');
                    const suffix = {
                        'body-scan': 'BodyScan', 'guided-noting': 'GuidedNoting', dharana: 'Dharana',
                        'box-breathing': 'BoxBreathing', visualization: 'Visualization',
                        hooponopono: 'Hooponopono', 'undo-unlearn': 'UndoUnlearn'
                    }[id];
                    context[`Chakra${suffix}Practice`] = Object.freeze({ run() {} });
                    script.onload();
                });
            },
            removeChild(script) { script.parentNode = null; }
        }
    }
});
vm.runInContext(source, context);
const loader = context.ChakraPracticeModuleLoader;
assert.deepEqual(Array.from(loader.moduleIds), practiceIds);
assert.ok(Object.isFrozen(loader));
const first = loader.load('box-breathing');
const duplicate = loader.load('box-breathing');
assert.equal(first, duplicate, 'concurrent requests share the same promise');
const [one, two] = await Promise.all([first, duplicate]);
assert.equal(one, two);
assert.equal(scripts.length, 1, 'one script is injected for concurrent requests');
assert.match(scripts[0].src, /\/lite\/modules\/box-breathing-practice\.js\?v=1\.0$/);
await loader.loadMany(['dharana', 'dharana', 'body-scan']);
assert.equal(scripts.length, 3, 'duplicate IDs are collapsed');
assert.equal((await loader.load('box-breathing')), one, 'loaded APIs are reused');
await assert.rejects(loader.load('unknown'), /Unknown guided practice module/);

let attempts = 0;
const retryContext = vm.createContext({
    URL,
    document: {
        baseURI: 'https://example.test/',
        createElement: () => ({ parentNode: null }),
        head: {
            appendChild(script) {
                attempts += 1;
                script.parentNode = this;
                if (attempts === 1) queueMicrotask(() => script.onerror());
                else queueMicrotask(() => { retryContext.ChakraBodyScanPractice = { run() {} }; script.onload(); });
            },
            removeChild(script) { script.parentNode = null; }
        }
    }
});
vm.runInContext(source, retryContext);
await assert.rejects(retryContext.ChakraPracticeModuleLoader.load('body-scan'), /failed to load/);
assert.ok(await retryContext.ChakraPracticeModuleLoader.load('body-scan'), 'a failed load can be retried');
assert.equal(attempts, 2);

console.log('Practice module loader passed: selected-only manifest, deduplication, offline precache, API validation and retry.');
