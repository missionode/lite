import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const functionSource = app.match(/function isHighEnergyTimeAllowed\(now = new Date\(\)\) \{[\s\S]*?\n    \}/)?.[0];
assert.ok(functionSource, 'the HRIM time gate must remain directly testable');

const isHighEnergyTimeAllowed = vm.runInNewContext(`(${functionSource})`);
const localTime = (hour, minute) => new Date(2026, 7, 15, hour, minute, 0);

assert.equal(isHighEnergyTimeAllowed(localTime(3, 29)), false, 'HRIM must remain unavailable before 3:30 AM');
assert.equal(isHighEnergyTimeAllowed(localTime(3, 30)), true, 'HRIM must become available at 3:30 AM');
assert.equal(isHighEnergyTimeAllowed(localTime(12, 0)), true, 'HRIM must remain available after noon');
assert.equal(isHighEnergyTimeAllowed(localTime(17, 59)), true, 'HRIM must remain available through 5:59 PM');
assert.equal(isHighEnergyTimeAllowed(localTime(18, 0)), false, 'Sleep Mode must take priority from 6:00 PM');

console.log('HRIM availability is 3:30 AM–5:59 PM, before the 6 PM Sleep Mode boundary.');
