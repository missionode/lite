import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const bank = JSON.parse(fs.readFileSync(new URL('../data/assessment-questions.json', import.meta.url), 'utf8'));
const context = { console };
context.globalThis = context;
for (const file of ['assessment-tournament.js', 'assessment-persistence.js']) {
    const source = fs.readFileSync(new URL(`../modules/${file}`, import.meta.url), 'utf8');
    vm.runInNewContext(source, context, { filename: file });
}

const engine = context.ChakraAssessmentTournament;
const persistenceApi = context.ChakraAssessmentPersistence;
const values = new Map();
const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
};
const persistence = persistenceApi.create(storage, engine);

const empty = persistence.load(bank);
assert.equal(empty.resumed, false);
assert.equal(empty.available, true);

let state = engine.createState(bank);
const first = engine.selectNext(bank, state);
state = engine.answerItem(bank, state, first, first.choices[0].id);
const saved = persistence.save(bank, state);
assert.equal(saved.persisted, true);
assert.equal(JSON.parse(values.get(persistenceApi.STATE_KEY)).answeredIds.length, 1);

const resumed = persistence.load(bank);
assert.equal(resumed.resumed, true);
assert.deepEqual(resumed.state, state);
assert.equal(engine.selectNext(bank, resumed.state).id, engine.selectNext(bank, state).id, 'resume should derive the same next card');

values.set(persistenceApi.STATE_KEY, JSON.stringify({ ...state, contentVersion: 'stale' }));
assert.equal(persistence.load(bank).resumed, false, 'a stale question-bank version should start fresh');

values.set(persistenceApi.STATE_KEY, '{broken-json');
const malformed = persistence.load(bank);
assert.equal(malformed.resumed, false);
assert.equal(malformed.available, false, 'malformed storage should fail safely without blocking a fresh assessment');

values.set(persistenceApi.STATE_KEY, JSON.stringify(state));
values.set('chakraAnswers', '{}');
values.set('chakraAssessmentNotes', '{}');
assert.equal(persistence.clear(), true);
assert.equal(values.has(persistenceApi.STATE_KEY), false);
for (const key of persistenceApi.LEGACY_KEYS) assert.equal(values.has(key), false, `${key} should not leak into the next client`);

const denied = persistenceApi.create({
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('denied'); },
    removeItem() { throw new Error('denied'); }
}, engine);
assert.equal(denied.load(bank).available, false);
assert.equal(denied.save(bank, state).persisted, false);
assert.equal(denied.clear(), false);

const unavailable = persistenceApi.create(null, engine);
assert.equal(unavailable.load(bank).available, false);
assert.equal(unavailable.save(bank, state).persisted, false);
assert.equal(unavailable.clear(), false);

console.log('Assessment persistence contract passed: sanitized resume, version reset, client clearing and storage denial.');
