import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const completion = fs.readFileSync(new URL('../modules/completion-view.js', import.meta.url), 'utf8');
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

assert.match(app, /modal\.classList\.remove\('hidden'\);\s*scheduleEarnHandoff\(\);/, 'handoff must follow the Journey Complete screen');
const completionContext = vm.createContext({});
vm.runInContext(completion, completionContext);
const timers = new Map();
let timerId = 0;
const earnLink = { hidden: true, classList: { add() {}, remove() {} }, focus() {} };
const handoffPolicy = completionContext.ChakraCompletionView.createEarnHandoff({
    document: { getElementById: id => id === 'continue-to-earn' ? earnLink : null },
    window: { setTimeout: (fn, delay) => { timers.set(++timerId, { fn, delay }); return timerId; }, clearTimeout: id => timers.delete(id) },
    getLanguage: () => 'en'
});
handoffPolicy.schedule();
assert.equal(timers.get(1).delay, 3000, 'the closing blessing remains visible briefly');
timers.get(1).fn();
assert.equal(earnLink.hidden, false, 'the timer reveals the Earn link');
handoffPolicy.cancel();
assert.equal(earnLink.hidden, true);
assert.match(html, /id="continue-to-earn"[\s\S]*?class="primary-btn completion-earn-link hidden"[\s\S]*?href="https:\/\/missionode\.github\.io\/earn-app\/receive\.html\?Source=Lite"/, 'a genuine anchor tap must own the exact Earn navigation');
assert.doesNotMatch(app, /Meditation complete\. You can now turn off/, 'completion must not be interrupted by a blocking reminder');

assert.doesNotMatch(html, /id="journal-section"|id="journal-entry"|id="save-journal"/, 'Journey Complete must not ask for a journal or payment details');
assert.doesNotMatch(html, /id="stat-total-journeys"/, 'Journey Complete must stay focused on the finished session');

console.log('Journey completion reveals a native Earn link with Source=Lite only.');
