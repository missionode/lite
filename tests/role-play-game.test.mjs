import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const source = read('modules/role-play-game.js');
const wakeSource = read('modules/wake-lock.js');
const html = read('index.html');
const app = read('app.js');
const sw = read('sw.js');
const loader = read('modules/practice-module-loader.js');

const context = vm.createContext({});
vm.runInContext(source, context);
vm.runInContext(wakeSource, context);
const game = context.ChakraRolePlayGame;
const wakeApi = context.ChakraWakeLock;
assert.ok(Object.isFrozen(game) && Object.isFrozen(wakeApi), 'frozen APIs');

// ---- Scenes, roles, timers -------------------------------------------------
assert.deepEqual(Array.from(game.SCENES, scene => scene.id), ['radha-krishna', 'storyteller', 'teacher', 'guide', 'interview', 'old-friends']);
assert.deepEqual(Array.from(game.SCENES[0].roles), ['radha', 'krishna'], 'the owner scene is Radha and Krishna');
assert.equal(game.GROUP_SCENE, 'radha-krishna');
assert.deepEqual(Array.from(game.TIMER_MINUTES), [5, 10, 15, 20, 30]);
assert.deepEqual(Array.from(game.roleList('storyteller', 2)), ['storyteller', 'listener']);
assert.deepEqual(Array.from(game.roleList('radha-krishna', 3)), ['radha', 'krishna', 'friend']);
assert.deepEqual(Array.from(game.roleList('radha-krishna', 4)), ['radha', 'krishna', 'friend', 'friend']);
assert.equal(game.rolesAreComplete('radha-krishna', ['krishna', 'radha']), true);
assert.equal(game.rolesAreComplete('radha-krishna', ['radha', 'radha']), false);
assert.equal(game.rolesAreComplete('radha-krishna', ['friend', 'krishna', 'radha']), true);
assert.equal(game.formatClock(300), '05:00');
assert.equal(game.formatClock(59.2), '00:59');
assert.equal(game.formatClock(-4), '00:00');

// ---- Chime -----------------------------------------------------------------
{
    const made = [];
    class FakeAudioContext {
        constructor() { this.currentTime = 1; this.destination = {}; this.resumed = false; this.closed = false; made.push(this); }
        resume() { this.resumed = true; }
        close() { this.closed = true; }
        createOscillator() { const node = { frequency: {}, connect() {}, start() { this.started = true; }, stop() {} }; (this.oscillators ||= []).push(node); return node; }
        createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
    }
    const chime = game.createChime({ AudioContextCtor: FakeAudioContext });
    assert.equal(chime.play(), false, 'nothing plays before the Play tap primes the audio');
    chime.prime();
    assert.equal(made[0].resumed, true, 'the audio context is resumed inside the tap');
    assert.equal(chime.play(), true);
    assert.equal(made[0].oscillators.length, 3, 'a soft three-note bell');
    chime.dispose();
    assert.equal(made[0].closed, true);
    assert.equal(game.createChime({}).play(), false, 'without Web Audio the chime stays silent');
}

// ---- Wake lock module ------------------------------------------------------
{
    const events = [];
    const sentinel = { release() { events.push('release'); } };
    const navigator = { wakeLock: { request: async kind => { events.push(`request:${kind}`); return sentinel; } } };
    const document = { visibilityState: 'visible' };
    const lock = wakeApi.create({ navigator, document });
    assert.equal(lock.isHeld(), false);
    assert.equal(await lock.request(), true);
    assert.equal(lock.isHeld(), true);
    assert.equal(lock.wakeLock, sentinel);
    document.visibilityState = 'hidden';
    assert.equal(await lock.reacquire(), false, 'no re-acquire while the page is hidden');
    document.visibilityState = 'visible';
    await lock.reacquire();
    assert.equal(events.filter(event => event === 'request:screen').length, 2, 'the lock is taken again when the page is visible');
    lock.release();
    assert.equal(lock.isHeld(), false);
    assert.equal(await lock.reacquire(), false, 'a released lock is not taken again');
    const unsupported = wakeApi.create({ navigator: {}, document });
    assert.equal(await unsupported.request(), false, 'unsupported browsers fail silently');
    const refused = wakeApi.create({ navigator: { wakeLock: { request: async () => { throw new Error('denied'); } } }, document });
    assert.equal(await refused.request(), false, 'a refused lock does not throw');
}

// ---- Game flow with a tiny fake DOM ----------------------------------------
class FakeNode {
    constructor(tag) {
        this.tagName = tag.toUpperCase();
        this.children = [];
        this.dataset = {};
        this.attrs = {};
        this.listeners = {};
        this.style = {};
        this.className = '';
        this.textContent = '';
        this.value = '';
        this.checked = false;
        this.disabled = false;
        this.classList = {
            add: name => { this.className = `${this.className} ${name}`.trim(); },
            remove: name => { this.className = this.className.split(' ').filter(entry => entry !== name).join(' '); },
            contains: name => this.className.split(' ').includes(name),
            toggle: (name, on) => { on ? this.classList.add(name) : this.classList.remove(name); }
        };
    }
    append(...nodes) { this.children.push(...nodes); }
    replaceChildren(...nodes) { this.children = nodes; }
    setAttribute(name, value) { this.attrs[name] = String(value); if (name === 'disabled') this.disabled = true; }
    getAttribute(name) { return this.attrs[name]; }
    addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
    fire(name) { (this.listeners[name] || []).forEach(fn => fn({ target: this })); }
    focus() { this.focused = true; }
    querySelector(selector) { return this.findAll(node => node.tagName === selector.toUpperCase())[0] || null; }
    findAll(predicate, out = []) { this.children.forEach(child => { if (predicate(child)) out.push(child); child.findAll(predicate, out); }); return out; }
}
const fakeDocument = { createElement: tag => new FakeNode(tag) };
const byData = (rootNode, key, value) => rootNode.findAll(node => node.dataset[key] !== undefined && (value === undefined || node.dataset[key] === value));

function makeGame({ unlocked = true } = {}) {
    const events = [];
    const timers = new Map();
    let timerCounter = 0;
    let clock = 1_000_000;
    const made = [];
    class FakeAudioContext {
        constructor() { this.currentTime = 0; this.destination = {}; made.push(this); }
        resume() {}
        close() { this.closed = true; }
        createOscillator() { (this.oscillators ||= []).push(1); return { frequency: {}, connect() {}, start() {}, stop() {} }; }
        createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
    }
    const root = new FakeNode('div');
    const gameScreen = new FakeNode('section');
    gameScreen.classList.add('hidden');
    const state = { unlocked };
    const instance = game.mount({
        document: fakeDocument, root, t: key => key, gameScreen, returnScreen: 'lobby',
        showScreen: target => events.push(['show', target === gameScreen ? 'game' : target]),
        isUnlocked: () => state.unlocked,
        wakeLock: { request: async () => events.push(['wake', 'request']), release: () => events.push(['wake', 'release']) },
        now: () => clock,
        setInterval: fn => { timers.set(++timerCounter, fn); return timerCounter; },
        clearInterval: id => timers.delete(id),
        AudioContextCtor: FakeAudioContext,
        vibrate: pattern => events.push(['vibrate', pattern])
    });
    const advance = seconds => { clock += seconds * 1000; [...timers.values()].forEach(fn => fn()); };
    return { instance, root, events, timers, state, made, advance, gameScreen };
}
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const clockText = rootNode => byData(rootNode, 'rp', 'clock')[0]?.textContent;
const agreeAll = rootNode => byData(rootNode, 'rp', 'agree').forEach(box => { box.checked = true; box.fire('change'); });
const press = (rootNode, value) => byData(rootNode, 'rp', value)[0].fire('click');

{
    const harness = makeGame({ unlocked: false });
    assert.equal(harness.instance.open(), false, 'the game does not open while developer mode is locked');
    assert.equal(harness.instance.step, 'idle');
}

{
    const { instance, root, events, timers, made, advance } = makeGame();
    assert.equal(instance.open(), true);
    assert.equal(instance.step, 'roles');
    assert.deepEqual(Array.from(instance.roles), ['radha', 'krishna'], 'the first scene is Radha and Krishna');
    assert.equal(byData(root, 'rp', 'roles-set')[0].disabled, true, 'roles cannot be finalised before everyone agrees');
    assert.equal(byData(root, 'rp', 'player').length, 2);

    // Roles are swapped, not duplicated.
    const firstRole = byData(root, 'rp', 'role')[0];
    firstRole.value = 'krishna';
    firstRole.fire('change');
    assert.deepEqual(Array.from(instance.roles), ['krishna', 'radha'], 'choosing a role swaps it with its holder');

    agreeAll(root);
    assert.equal(byData(root, 'rp', 'roles-set')[0].disabled, false, 'the roles can be set once everyone is happy to play');
    press(root, 'roles-set');
    assert.equal(instance.step, 'timer');
    assert.equal(byData(root, 'rp', 'play').length, 1, 'Play appears only after the roles are final');

    byData(root, 'rp', 'minutes').find(node => node.dataset.minutes === '5').fire('click');
    press(root, 'play');
    await flush();
    assert.equal(instance.step, 'play');
    assert.ok(events.some(event => event[0] === 'wake' && event[1] === 'request'), 'the screen is kept awake while playing');
    assert.equal(made.length, 1, 'audio is primed inside the Play tap');
    assert.equal(timers.size, 1, 'the timer runs');
    assert.equal(clockText(root), '05:00');

    advance(100);
    assert.equal(clockText(root), '03:20');

    // Pause keeps the remaining time; resume continues from it.
    press(root, 'pause');
    assert.equal(timers.size, 0, 'paused timers stop');
    advance(600);
    press(root, 'pause');
    assert.equal(timers.size, 1);
    advance(0);
    assert.equal(clockText(root), '03:20', 'time spent paused is not counted');

    advance(199);
    assert.equal(instance.step, 'play');
    assert.equal(clockText(root), '00:01');
    advance(2);
    assert.equal(instance.step, 'closing', 'the role play ends when the timer finishes');
    assert.equal(made[0].oscillators.length, 3, 'the notification sound plays when time is up');
    assert.ok(events.some(event => event[0] === 'vibrate'));
    assert.equal(events.filter(event => event[0] === 'wake' && event[1] === 'release').length, 1, 'the screen may sleep again');
    assert.equal(timers.size, 0);

    press(root, 'again');
    assert.equal(instance.step, 'timer', 'play again returns to the timer step');
    assert.deepEqual(Array.from(instance.roles), ['radha', 'krishna'], 'play again swaps the roles');
    press(root, 'play');
    await flush();
    assert.equal(made.length, 2, 'a fresh sound is armed for the next round');
    press(root, 'stop');
    assert.equal(instance.step, 'roles', 'stopping goes back to the roles step');
    assert.equal(made[1].oscillators, undefined, 'stopping early plays no chime');
    assert.equal(timers.size, 0);
    assert.ok(events.filter(event => event[0] === 'wake' && event[1] === 'release').length >= 2);
    instance.close();
    assert.equal(instance.step, 'idle');
}

{
    // More than two players: only the Radha and Krishna scene, others join as friends.
    const { instance, root } = makeGame();
    instance.open();
    byData(root, 'rp', 'count').find(node => node.dataset.count === '3').fire('click');
    assert.deepEqual(Array.from(instance.roles), ['radha', 'krishna', 'friend']);
    assert.equal(instance.sceneId, 'radha-krishna');
    const scene = byData(root, 'rp', 'scene')[0];
    assert.equal(scene.disabled, true, 'the scene cannot be changed with more than two players');
    assert.equal(scene.children.length, 1, 'only the Radha and Krishna scene is offered');
    byData(root, 'rp', 'count').find(node => node.dataset.count === '4').fire('click');
    assert.deepEqual(Array.from(instance.roles), ['radha', 'krishna', 'friend', 'friend']);
    byData(root, 'rp', 'count').find(node => node.dataset.count === '2').fire('click');
    assert.equal(byData(root, 'rp', 'scene')[0].children.length, 6, 'with two players every scene is offered');
}

{
    // Locking developer mode closes the game and releases the screen.
    const { instance, root, events } = makeGame();
    instance.open();
    agreeAll(root);
    press(root, 'roles-set');
    press(root, 'play');
    await flush();
    instance.close();
    assert.equal(instance.step, 'idle');
    assert.ok(events.some(event => event[0] === 'wake' && event[1] === 'release'));
}

// ---- Static contracts ------------------------------------------------------
assert.doesNotMatch(source, /getUserMedia|MediaRecorder|localStorage|sessionStorage|indexedDB|fetch\(/, 'no recording, no storage, no network');
assert.match(html, /<div id="secret-body-game-panel"[^>]*hidden>[\s\S]*?<button id="open-role-play"[^>]*disabled/, 'the card sits in the developer-mode Play Zone with a disabled button');
assert.match(html, /<section id="role-play-screen" class="screen[^"]*hidden"/);
assert.match(html, /modules\/wake-lock\.js\?v=1\.0[\s\S]*app\.js\?v=/, 'the shared wake lock loads before the application');
assert.match(app, /window\.ChakraWakeLock\.create\(/, 'journeys use the shared wake-lock module');
assert.doesNotMatch(app, /class WakeLockManager/, 'the old inline manager is gone');
assert.match(app, /rolePlayButton\.disabled = isLocked/, 'locking developer mode disables the game');
assert.match(app, /if \(isLocked && rolePlayGame\) rolePlayGame\.close\(\)/, 'locking developer mode closes the game');
assert.match(app, /practiceModuleLoader\.load\('role-play'\)[\s\S]*?wakeLock/, 'the game receives the shared wake lock');
assert.match(app, /rolePlayScreen, chakraTouchScreen/, 'the screen is registered for navigation');
assert.match(loader, /'role-play': Object\.freeze\(\{ src: '\.\/modules\/role-play-game\.js\?v=1\.0', globalName: 'ChakraRolePlayGame' \}\)/);
assert.match(sw, /'\.\/modules\/role-play-game\.js\?v=1\.0'/, 'works offline');
assert.match(sw, /'\.\/modules\/wake-lock\.js\?v=1\.0'/, 'the wake lock is precached');

// ---- Five languages --------------------------------------------------------
const keys = ['rolePlay', 'rolePlayNote', 'rpOpen', 'rpTitle', 'rpLead', 'rpSafety', 'rpPlayersTitle', 'rpPlayersWord', 'rpPlayer', 'rpPlayerName',
    'rpSceneTitle', 'rpGroupNote', 'rpRolesTitle', 'rpRoleFor', 'rpHappy', 'rpRolesSet', 'rpTimerTitle', 'rpTimerPick', 'rpMinutes', 'rpPlay',
    'rpChangeRoles', 'rpTimeLeft', 'rpPause', 'rpResume', 'rpStop', 'rpTimeUp', 'rpThanks', 'rpClosing1', 'rpClosing2', 'rpClosing3', 'rpAgain',
    'rpBackToLobby', 'sbpBack',
    ...Array.from(game.SCENES, scene => `rpScene_${scene.id}`), ...Array.from(game.SCENES, scene => `rpStarter_${scene.id}`),
    ...['radha', 'krishna', 'friend', 'storyteller', 'listener', 'teacher', 'student', 'guide', 'traveller', 'interviewer', 'guest', 'oldFriend', 'returnedFriend'].map(role => `rpRole_${role}`)];
for (const scene of game.SCENES) for (const role of scene.roles) assert.ok(keys.includes(`rpRole_${role}`), `${role} has a label key`);
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(read(`locales/${language}.json`));
    for (const key of keys) assert.ok(locale.ui[key], `${language} is missing ui.${key}`);
}

console.log('Walk in My Shoes passed: scenes and roles, group rule, timer with pause, chime, shared wake lock, developer-mode Play Zone card and five locales.');
