import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync('app.js', 'utf8');

assert.match(
  app,
  /typeof this\.ctx\.setSinkId === 'function'[\s\S]*?await this\.ctx\.setSinkId\('default'\)/,
  'AudioContext should prefer the system default loudspeaker output when supported',
);

assert.match(
  app,
  /const storedValue = localStorage\.getItem\(key\);[\s\S]*?storedValue === null[\s\S]*?return fallback;[\s\S]*?Number\(storedValue\)/,
  'missing volume preferences must use defaults while explicit zero remains valid',
);

const storedNumberSource = app.match(/function storedNumber\(key, fallback\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(storedNumberSource, 'storedNumber helper must exist');
const makeStoredNumber = storedValue => vm.runInNewContext(
  `(${storedNumberSource})`,
  { localStorage: { getItem: () => storedValue } },
);
assert.equal(makeStoredNumber(null)('volume', 0.9), 0.9, 'missing volume uses its default');
assert.equal(makeStoredNumber('0')('volume', 0.9), 0, 'explicit zero remains a true mute');
assert.equal(makeStoredNumber('invalid')('volume', 0.9), 0.9, 'invalid volume uses its default');

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
  /if \(!this\.ctx \|\| state\.volBell <= 0\) return;/,
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
