import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.doesNotMatch(app, /function isHighEnergyTimeAllowed\(/, 'the HRIM time gate should be removed');
assert.doesNotMatch(app, /function confirmHighEnergyTime\(/, 'the HRIM confirmation gate should be removed');
assert.doesNotMatch(app, /confirmHighEnergyTime\(\)/, 'journey start should not call an HRIM time gate');
assert.doesNotMatch(app, /hrim-time-block-modal/, 'the HRIM time-block modal should be removed');

console.log('HRIM has no local-time restriction and no time-block modal.');
