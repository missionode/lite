import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync('app.js', 'utf8');
const appStateModule = fs.readFileSync('modules/app-state.js', 'utf8');

assert.match(
  app,
  /typeof this\.ctx\.setSinkId === 'function'[\s\S]*?await this\.ctx\.setSinkId\('default'\)/,
  'AudioContext should prefer the system default loudspeaker output when supported',
);

const context = vm.createContext({});
vm.runInContext(appStateModule, context);
const makeStorage = storedValue => ({ getItem: () => storedValue });
assert.ok(Object.isFrozen(context.ChakraAppState), 'state storage readers should expose a stable API');
assert.equal(context.ChakraAppState.storedNumber(makeStorage(null), 'volume', 0.9), 0.9, 'missing volume uses its default');
assert.equal(context.ChakraAppState.storedNumber(makeStorage('0'), 'volume', 0.9), 0, 'explicit zero remains a true mute');
assert.equal(context.ChakraAppState.storedNumber(makeStorage('invalid'), 'volume', 0.9), 0.9, 'invalid volume uses its default');
const legacyValues = new Map([['legacy', 'true']]);
const legacyStorage = { getItem: key => legacyValues.has(key) ? legacyValues.get(key) : null };
assert.equal(context.ChakraAppState.storedBooleanWithLegacy(legacyStorage, 'current', 'legacy'), true, 'legacy booleans migrate when the current key is absent');
legacyValues.set('current', 'false');
assert.equal(context.ChakraAppState.storedBooleanWithLegacy(legacyStorage, 'current', 'legacy'), false, 'the current boolean key takes precedence over legacy data');

assert.doesNotMatch(
  app,
  /bgMusicEQ\.gain\.exponentialRampToValueAtTime/,
  'signed EQ gain must never use an exponential ramp',
);
assert.match(
  app,
  /if \(targetVol <= 0\)[\s\S]*?linearRampToValueAtTime\(0, now \+ duration\)/,
  'zero music volume must use a zero-safe linear fade',
);
assert.match(
  app,
  /if \(!this\.ctx \|\| state\.noFrequencyMode \|\| state\.volBell <= 0\) return;/,
  'a muted singing bowl must be safely skipped',
);
assert.match(
  app,
  /gain\.gain\.setValueAtTime\(0\.0001, now\);[\s\S]*?gain\.gain\.exponentialRampToValueAtTime\(state\.volBell/,
  'audible singing-bowl envelopes must begin above zero',
);

const exponentialCalls = [...app.matchAll(/\.exponentialRampToValueAtTime\(([^,\n]+)/g)]
  .map(match => match[1].trim());
assert.ok(exponentialCalls.length > 0, 'expected Web Audio exponential ramps to be present');
for (const target of exponentialCalls) {
  assert.notEqual(target, '0', 'exponential ramps must not target literal zero');
}

console.log('Zero-volume Web Audio safety contract passed.');
