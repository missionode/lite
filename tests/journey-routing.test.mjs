import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/journey-routing.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const routing = context.ChakraJourneyRouting;

assert.ok(Object.isFrozen(routing), 'journey routing should expose a stable API');
assert.equal(routing.resolveFocusedExperience({ yogaSelected: true, intimateSelected: true }), 'yoga');
assert.equal(routing.resolveFocusedExperience({ intimateSelected: true }), 'intimate');
assert.equal(routing.resolveFocusedExperience({ preparationSelected: true, selectedChakraCount: 0 }), 'preparation');
assert.equal(routing.resolveFocusedExperience({ preparationSelected: true, selectedChakraCount: 1 }), null);

assert.equal(routing.resolveLaunchRoute({ shotsSelected: true, backgroundMusicMode: true, sleepSelected: true }), 'shot');
assert.equal(routing.resolveLaunchRoute({ backgroundMusicMode: true, sleepSelected: true }), 'music');
assert.equal(routing.resolveLaunchRoute({ sleepSelected: true }), 'sleep');
assert.equal(routing.resolveLaunchRoute({}), 'guided');

assert.deepEqual(
    { ...routing.validateLobbyStart({ route: 'guided', selectedChakraCount: 0 }) },
    { valid: false, reason: 'chakra-required' }
);
for (const input of [
    { route: 'shot' },
    { route: 'music' },
    { route: 'sleep' },
    { route: 'guided', highEnergySelected: true },
    { route: 'guided', focusedExperience: 'preparation' },
    { route: 'guided', selectedChakraCount: 1 }
]) assert.equal(routing.validateLobbyStart(input).valid, true);

const selected = ['root', 'heart'];
const copied = routing.buildChakraOrder({ selectedChakras: selected });
assert.deepEqual(Array.from(copied), selected);
assert.notEqual(copied, selected, 'normal journey order should be copied, not shared');
assert.deepEqual(
    Array.from(routing.buildChakraOrder({ focusedExperience: 'intimate', massageSelected: true })),
    ['crown', 'thirdeye', 'throat', 'heart', 'solar', 'sacral', 'root']
);

const app = fs.readFileSync('app.js', 'utf8');
assert.match(app, /journeyRouting\.resolveFocusedExperience/);
assert.match(app, /journeyRouting\.resolveLaunchRoute/);
assert.match(app, /journeyRouting\.validateLobbyStart/);
assert.match(app, /journeyRouting\.buildChakraOrder/);

console.log('Journey routing contract passed: focused modes, launch priority, chakra guard and order.');
