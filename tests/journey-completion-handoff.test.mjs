import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const handoffMatch = html.match(/<a\s+id="continue-to-earn"[\s\S]*?href="([^"]+)"[\s\S]*?hidden>/);
assert.ok(handoffMatch, 'Journey Complete must contain a hidden native Earn link');

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
assert.match(app, /earnLink\.hidden = false;[\s\S]*?earnLink\.classList\.remove\('hidden'\);[\s\S]*?earnLink\.focus/, 'the timer must reveal and focus the Earn link');
const scheduleSource = app.match(/function scheduleEarnHandoff\(\) \{[\s\S]*?\n\}\n\nfunction setSymbolImage/)?.[0];
assert.ok(scheduleSource, 'the delayed handoff reveal must remain directly reviewable');
assert.doesNotMatch(scheduleSource, /location\.|\.click\(/, 'the handoff timer must never navigate or synthesize a click');
assert.match(html, /id="continue-to-earn"[\s\S]*?class="primary-btn completion-earn-link hidden"[\s\S]*?href="https:\/\/missionode\.github\.io\/earn-app\/receive\.html\?Source=Lite"/, 'a genuine anchor tap must own the exact Earn navigation');
assert.doesNotMatch(app, /Meditation complete\. You can now turn off/, 'completion must not be interrupted by a blocking reminder');

assert.doesNotMatch(html, /id="journal-section"|id="journal-entry"|id="save-journal"/, 'Journey Complete must not ask for a journal or payment details');
assert.doesNotMatch(html, /id="stat-total-journeys"/, 'Journey Complete must stay focused on the finished session');

console.log('Journey completion reveals a native Earn link with Source=Lite only.');
