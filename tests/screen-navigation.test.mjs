import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/screen-navigation.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const screenNavigationModule = window\.ChakraScreenNavigation/);
assert.match(app, /function showScreen\(screen\)\s*\{\s*screenNavigation\.showScreen\(screen\);\s*\}/);
assert.match(html, /modules\/screen-navigation\.js\?v=1\.0[\s\S]*?app\.js\?v=4.28/);
assert.match(serviceWorker, /modules\/screen-navigation\.js\?v=1\.0/);

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
experiment.id = 'experiment-screen';
const sky = screen();
sky.id = 'sky-screen';
const nullable = null;
const screens = [config, lobby, meditation, experiment, sky, nullable];
const bodyClasses = new Set();
const body = { classList: {
    toggle(name, enabled) { enabled ? bodyClasses.add(name) : bodyClasses.delete(name); },
    contains(name) { return bodyClasses.has(name); }
} };
const document = { scrollingElement: { scrollTop: 77 } };
let scrollCalls = [];
let eventCount = 0;
const browserWindow = { scrollTo(...args) { scrollCalls.push(args); }, location: { href: '' } };
const api = navigation.create({
    body, document, window: browserWindow, screens,
    lobbyScreen: lobby, configScreen: config, experimentScreen: experiment, skyScreen: sky,
    dispatchDecorationChange() { eventCount++; }
});
assert.ok(Object.isFrozen(api));

api.showScreen(meditation);
assert.equal(bodyClasses.has('static-decorations'), true, 'non-Lobby/non-Settings screens keep static decorative background mode');
assert.equal(bodyClasses.has('sky-canvas-active'), false, 'the sky animation loop is inactive outside the dedicated Sky page');
assert.equal(eventCount, 1);
for (const view of [config, lobby, experiment, sky]) assert.equal(view.classes.has('hidden'), true);
assert.equal(meditation.classes.has('hidden'), false);
assert.equal(meditation.scrollTop, 0);
assert.equal(document.scrollingElement.scrollTop, 0);
assert.deepEqual(scrollCalls, [[0, 0]]);

api.showScreen(lobby);
assert.equal(bodyClasses.has('static-decorations'), false, 'Lobby retains its non-journey decoration mode');
assert.equal(eventCount, 2);
assert.equal(lobby.classes.has('hidden'), false);

api.showScreen(config);
assert.equal(bodyClasses.has('static-decorations'), false, 'Settings remains outside the journey static-decoration mode');
assert.equal(bodyClasses.has('sky-canvas-active'), false, 'Settings no longer renders the sky canvas');
assert.equal(eventCount, 3);

api.showScreen(sky);
assert.equal(bodyClasses.has('static-decorations'), false, 'the dedicated Sky page supports the existing motion policy');
assert.equal(bodyClasses.has('sky-canvas-active'), true, 'the sky animation loop is active only on the dedicated Sky page');
assert.equal(sky.classes.has('hidden'), false);
assert.equal(eventCount, 4);

const actions = new Map();
const bind = id => ({ addEventListener(type, handler) { actions.set(`${id}:${type}`, handler); } });
api.bindLobbyActions({ settingsButton: bind('settings'), experimentButton: bind('experiment'), closeExperimentButton: bind('close-experiment'), assessmentButton: bind('assessment'), openSkyButton: bind('open-sky'), closeSkyButton: bind('close-sky') });
actions.get('settings:click')();
assert.equal(config.classes.has('hidden'), false, 'settings CTA opens Settings');
actions.get('experiment:click')();
assert.equal(experiment.classes.has('hidden'), false, 'experiment CTA opens the isolated activity screen');
actions.get('close-experiment:click')();
assert.equal(config.classes.has('hidden'), false, 'closing an experiment returns to Settings');
assert.equal(experiment.classes.has('hidden'), true, 'closing the experiment hides its screen');
actions.get('open-sky:click')();
assert.equal(sky.classes.has('hidden'), false, 'Settings CTA opens the dedicated Sky page');
actions.get('close-sky:click')();
assert.equal(config.classes.has('hidden'), false, 'Sky return action restores Settings');
assert.equal(bodyClasses.has('sky-canvas-active'), false, 'leaving Sky immediately disables its canvas');
actions.get('assessment:click')();
assert.equal(browserWindow.location.href, './docs/assesment.html', 'the operator consultation CTA opens the standalone assessment');

api.showScreen(null);
assert.equal(eventCount, 10);
assert.ok(screens.filter(Boolean).every(view => view.classes.has('hidden')));
assert.equal(document.scrollingElement.scrollTop, 0, 'navigation without a destination does not scroll the document');

for (const configured of [null, '', 'true', 'false']) {
    for (const hasAura of [true, false]) {
        const settings = screen();
        const room = screen();
        const journey = screen();
        const views = [settings, room, journey];
        const decorationClasses = new Set(['static-decorations']);
        const aura = hasAura ? { style: { background: 'previous', opacity: '0' } } : null;
        const reads = [];
        let decorations = 0;
        const entry = navigation.create({
            body: { classList: { toggle(name, enabled) {
                enabled ? decorationClasses.add(name) : decorationClasses.delete(name);
            } } },
            document: { getElementById(id) {
                assert.equal(id, 'aura-bg');
                return aura;
            } },
            window: {}, screens: views, lobbyScreen: room, configScreen: settings,
            dispatchDecorationChange() {
                decorations++;
                assert.equal(decorationClasses.has('static-decorations'), false);
                if (aura) assert.equal(aura.style.background, 'previous', 'decoration event precedes aura treatment');
            }
        });
        entry.checkFirstTime({ getItem(key) { reads.push(key); return configured; } });
        assert.deepEqual(reads, ['chakra_configured']);
        const destination = configured ? room : settings;
        for (const view of views) {
            assert.equal(view.classes.has('hidden'), view !== destination, 'only the entry destination is visible');
        }
        assert.equal(decorationClasses.has('static-decorations'), false, 'both entry destinations use dynamic decorations');
        assert.equal(decorations, 1, 'entry routing dispatches one decoration change');
        assert.equal(destination.scrollTop, 0);
        if (aura) {
            assert.equal(aura.style.background, configured
                ? 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)'
                : 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 55%)');
            assert.equal(aura.style.opacity, '1');
        }
    }
}

assert.throws(() => navigation.create({}), /requires the application views/);
console.log('Screen navigation owner passed: static-sky guards, screen visibility, event, scroll reset, and first-visit routing/aura parity.');
