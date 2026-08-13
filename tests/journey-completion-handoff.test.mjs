import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const handoffMatch = app.match(/const EARN_HANDOFF_URL = '([^']+)'/);
assert.ok(handoffMatch, 'the Earn handoff URL must remain explicit and reviewable');

const handoffUrl = new URL(handoffMatch[1]);
assert.equal(handoffUrl.origin, 'https://missionode.github.io');
assert.equal(handoffUrl.pathname, '/earn-app/receive.html');
assert.deepEqual(
    [...handoffUrl.searchParams.entries()],
    [['Source', 'Lite']],
    'Lite must hand off only its source identity',
);

assert.match(app, /const EARN_HANDOFF_DELAY_MS = 3000;/, 'the closing blessing should remain visible briefly');
assert.match(app, /modal\.classList\.remove\('hidden'\);\s*scheduleEarnHandoff\(\);/, 'handoff must follow the Journey Complete screen');
assert.match(app, /window\.location\.assign\(EARN_HANDOFF_URL\)/, 'handoff must use a normal HTTPS navigation');
assert.doesNotMatch(app, /Meditation complete\. You can now turn off/, 'completion must not be interrupted by a blocking reminder');

assert.doesNotMatch(html, /id="journal-section"|id="journal-entry"|id="save-journal"/, 'Journey Complete must not ask for a journal or payment details');
assert.doesNotMatch(html, /id="stat-total-journeys"/, 'Journey Complete must stay focused on the finished session');

console.log('Journey completion hands off to Earn with Source=Lite only.');
