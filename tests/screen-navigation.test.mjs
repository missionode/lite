import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/screen-navigation.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const screenNavigationModule = window\.ChakraScreenNavigation/);
assert.match(app, /function showScreen\(screen\)\s*\{\s*screenNavigation\.showScreen\(screen\);\s*\}/);
assert.match(html, /modules\/screen-navigation\.js\?v=1\.0[\s\S]*?app\.js\?v=4.12/);
assert.match(serviceWorker, /chakra-v5.309[\s\S]*?modules\/screen-navigation\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const navigation = context.ChakraScreenNavigation;
assert.ok(Object.isFrozen(navigation));

function screen() {
    const classes = new Set();
    return {
        scrollTop: 38,
        classes,
        classList: {
            add(name) { classes.add(name); },
            remove(name) { classes.delete(name); }
        }
    };
}

const config = screen();
const lobby = screen();
const meditation = screen();
const experiment = screen();
const nullable = null;
const screens = [config, lobby, meditation, experiment, nullable];
const bodyClasses = new Set();
const body = { classList: {
    toggle(name, enabled) { enabled ? bodyClasses.add(name) : bodyClasses.delete(name); }
} };
const document = { scrollingElement: { scrollTop: 77 } };
let scrollCalls = [];
let eventCount = 0;
const api = navigation.create({
    body, document, window: { scrollTo(...args) { scrollCalls.push(args); } }, screens,
    lobbyScreen: lobby, configScreen: config,
    dispatchDecorationChange() { eventCount++; }
});
assert.ok(Object.isFrozen(api));

api.showScreen(meditation);
assert.equal(bodyClasses.has('static-decorations'), true, 'non-Lobby/non-Settings screens keep static decorative background mode');
assert.equal(eventCount, 1);
for (const view of [config, lobby, experiment]) assert.equal(view.classes.has('hidden'), true);
assert.equal(meditation.classes.has('hidden'), false);
assert.equal(meditation.scrollTop, 0);
assert.equal(document.scrollingElement.scrollTop, 0);
assert.deepEqual(scrollCalls, [[0, 0]]);

api.showScreen(lobby);
assert.equal(bodyClasses.has('static-decorations'), false, 'the Lobby retains its dynamic sky');
assert.equal(eventCount, 2);
assert.equal(lobby.classes.has('hidden'), false);

api.showScreen(config);
assert.equal(bodyClasses.has('static-decorations'), false, 'Settings retains its dynamic sky');
assert.equal(eventCount, 3);

api.showScreen(null);
assert.equal(eventCount, 4);
assert.ok(screens.filter(Boolean).every(view => view.classes.has('hidden')));
assert.equal(document.scrollingElement.scrollTop, 0, 'navigation without a destination does not scroll the document');

assert.throws(() => navigation.create({}), /requires the application views/);
console.log('Screen navigation owner passed: static-sky guards, screen visibility, event, and scroll reset.');
