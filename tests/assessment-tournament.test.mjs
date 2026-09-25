import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const bank = JSON.parse(fs.readFileSync(new URL('../data/assessment-questions.json', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../modules/assessment-tournament.js', import.meta.url), 'utf8');
const context = { console };
context.globalThis = context;
vm.runInNewContext(source, context, { filename: 'assessment-tournament.js' });
const engine = context.ChakraAssessmentTournament;

assert.equal(engine.validateBank(bank), true, 'the approved assessment bank should validate');
assert.deepEqual([...engine.CHAKRA_IDS], ['root', 'sacral', 'solar', 'heart', 'throat', 'third-eye', 'crown']);
assert.equal(bank.values.length, 8, 'the value bracket should contain all eight approved cards');
assert.deepEqual(
    bank.values.map(item => item.label),
    ['Sensual Joy', 'Luxury', 'Independence', 'Spontaneity', 'Commitment', 'Social Approval', 'Emotional Safety', 'Romantic Idealism'],
);

const malformed = structuredClone(bank);
malformed.questions[1].id = malformed.questions[0].id;
assert.throws(() => engine.validateBank(malformed), /question IDs contains duplicates/);

let state = engine.createState(bank);
const consumed = new Set();
while (true) {
    const item = engine.selectNext(bank, state);
    if (item.kind !== 'question') break;
    assert.equal(consumed.has(item.id), false, `question ${item.id} must not repeat`);
    consumed.add(item.id);
    const response = consumed.size % 3 === 0 ? engine.RESPONSE_EQUAL : item.choices[0].id;
    state = engine.answerItem(bank, state, item, response);
}

const coreQuestions = bank.questions.filter(item => item.tier === 'core');
const evidence = Object.fromEntries(engine.CHAKRA_IDS.map(id => [id, 0]));
for (const question of coreQuestions) {
    if (!state.answers[question.id] || state.answers[question.id] === engine.RESPONSE_SKIP) continue;
    question.coverage.forEach(id => { evidence[id] += 1; });
}
engine.CHAKRA_IDS.forEach(id => assert.ok(evidence[id] >= 2, `${id} should reach balanced minimum evidence before values`));

const valuePairs = new Set();
const appearances = Object.fromEntries(bank.values.map(item => [item.id, { total: 0, left: 0, right: 0 }]));
for (let index = 0; index < bank.settings.valueRounds; index += 1) {
    const item = engine.selectNext(bank, state);
    assert.equal(item.kind, 'value', 'value rounds should follow minimum chakra coverage');
    assert.equal(valuePairs.has(item.pairId), false, `unordered pair ${item.pairId} must not repeat`);
    valuePairs.add(item.pairId);
    appearances[item.left.id].total += 1;
    appearances[item.left.id].left += 1;
    appearances[item.right.id].total += 1;
    appearances[item.right.id].right += 1;
    state = engine.answerItem(bank, state, item, index % 4 === 0 ? engine.RESPONSE_SKIP : item.left.id);
}

const totals = Object.values(appearances).map(item => item.total);
assert.ok(Math.max(...totals) - Math.min(...totals) <= 1, 'value opportunities should remain balanced');
Object.entries(appearances).forEach(([id, item]) => {
    assert.ok(Math.abs(item.left - item.right) <= 1, `${id} should be position-counterbalanced`);
});

const serialized = JSON.stringify(state);
const restored = engine.restoreState(bank, JSON.parse(serialized));
assert.deepEqual(restored, state, 'serialized assessment state should resume deterministically');
assert.equal(engine.selectNext(bank, restored).id, engine.selectNext(bank, state).id, 'resume should preserve the next tournament item');
const legacyState = JSON.parse(serialized);
delete legacyState.history;
const legacyRestored = engine.restoreState(bank, legacyState);
assert.deepEqual(legacyRestored.history, state.history,
    'state persisted before the history field was introduced should reconstruct chronological undo history');
const resultWithValues = engine.buildResult(bank, state);
const chakraOnlyResult = engine.buildResult(bank, { ...state, valueHistory: [] });
assert.ok(resultWithValues.rapportCue?.topic, 'sufficient chakra evidence should produce a tentative conversation cue');
assert.equal(resultWithValues.rapportCue.topic, chakraOnlyResult.rapportCue.topic,
    'rapport topics must come from chakra answers, never value/intimate-service signals');

let undoQuestionState = engine.createState(bank);
const firstQuestion = engine.selectNext(bank, undoQuestionState);
undoQuestionState = engine.answerItem(bank, undoQuestionState, firstQuestion, firstQuestion.choices[0].id);
const secondQuestion = engine.selectNext(bank, undoQuestionState);
undoQuestionState = engine.answerItem(bank, undoQuestionState, secondQuestion, secondQuestion.choices[0].id);
const afterUndoQuestion = engine.undoLast(bank, undoQuestionState);
assert.equal(afterUndoQuestion.answeredIds.includes(secondQuestion.id), false, 'undo should remove the most recent chakra answer');
assert.equal(engine.selectNext(bank, afterUndoQuestion).id, secondQuestion.id, 'the undone question should be offered again for correction');
assert.equal(afterUndoQuestion.history.at(-1).id, firstQuestion.id, 'undo should preserve the earlier response history');

let undoValueState = engine.createState(bank);
while (engine.selectNext(bank, undoValueState).kind === 'question') {
    const question = engine.selectNext(bank, undoValueState);
    undoValueState = engine.answerItem(bank, undoValueState, question, question.choices[0].id);
}
const undoFirstValue = engine.selectNext(bank, undoValueState);
undoValueState = engine.answerItem(bank, undoValueState, undoFirstValue, undoFirstValue.left.id);
const undoSecondValue = engine.selectNext(bank, undoValueState);
undoValueState = engine.answerItem(bank, undoValueState, undoSecondValue, undoSecondValue.right.id);
const afterUndoValue = engine.undoLast(bank, undoValueState);
assert.equal(afterUndoValue.valueHistory.length, 1, 'undo should remove the latest value-pair response only');
assert.equal(engine.selectNext(bank, afterUndoValue).pairId, undoSecondValue.pairId, 'undo should reopen the last value pair without disturbing earlier responses');

const invalidRestore = engine.restoreState(bank, {
    ...state,
    answers: { ...state.answers, [state.answeredIds[0]]: 'invented-response' }
});
assert.equal(invalidRestore.answeredIds.includes(state.answeredIds[0]), false, 'resume should discard an invalid stored response');

const oneSignalState = engine.createState(bank);
const forcedValueState = {
    ...oneSignalState,
    answeredIds: bank.questions.filter(item => item.tier === 'core').map(item => item.id),
    answers: Object.fromEntries(bank.questions.filter(item => item.tier === 'core').map(item => [item.id, item.choices[0].id]))
};
const firstValue = engine.selectNext(bank, forcedValueState);
const afterOneValue = engine.answerItem(bank, forcedValueState, firstValue, firstValue.left.id);
assert.equal(engine.buildResult(bank, afterOneValue).dot, 'orange', 'one value answer can never create a decisive dot');

function valueEntry(firstId, secondId, response) {
    return {
        pairId: engine.canonicalPairId(firstId, secondId),
        leftId: firstId,
        rightId: secondId,
        response
    };
}

const positiveState = {
    ...forcedValueState,
    valueHistory: [
        valueEntry('sensual-joy', 'independence', 'sensual-joy'),
        valueEntry('sensual-joy', 'social-approval', 'sensual-joy'),
        valueEntry('sensual-joy', 'emotional-safety', 'sensual-joy'),
        valueEntry('luxury', 'independence', 'luxury'),
        valueEntry('luxury', 'social-approval', 'luxury'),
        valueEntry('spontaneity', 'independence', 'spontaneity'),
        valueEntry('spontaneity', 'emotional-safety', 'spontaneity'),
        valueEntry('romantic-idealism', 'social-approval', 'romantic-idealism')
    ]
};
assert.equal(engine.buildResult(bank, positiveState).dot, 'green', 'several consistent independent value signals may produce green');

const cautiousState = {
    ...forcedValueState,
    valueHistory: [
        valueEntry('independence', 'sensual-joy', 'independence'),
        valueEntry('independence', 'luxury', 'independence'),
        valueEntry('social-approval', 'sensual-joy', 'social-approval'),
        valueEntry('social-approval', 'luxury', 'social-approval'),
        valueEntry('emotional-safety', 'sensual-joy', 'emotional-safety'),
        valueEntry('emotional-safety', 'luxury', 'emotional-safety'),
        valueEntry('independence', 'spontaneity', 'independence'),
        valueEntry('social-approval', 'romantic-idealism', 'social-approval')
    ]
};
assert.equal(engine.buildResult(bank, cautiousState).dot, 'red', 'several consistent independent cautious signals may produce red');

let uncertainState = engine.createState(bank);
while (true) {
    const item = engine.selectNext(bank, uncertainState);
    if (item.kind !== 'question') break;
    uncertainState = engine.answerItem(bank, uncertainState, item, engine.RESPONSE_EQUAL);
}
for (let index = 0; index < bank.settings.valueRounds; index += 1) {
    const item = engine.selectNext(bank, uncertainState);
    uncertainState = engine.answerItem(bank, uncertainState, item, engine.RESPONSE_EQUAL);
}
const tieBreaker = engine.selectNext(bank, uncertainState);
assert.equal(tieBreaker.kind, 'question', 'close chakra scores should request an unused tie-breaker');
assert.equal(tieBreaker.tier, 'tie-breaker');
const afterTie = engine.answerItem(bank, uncertainState, tieBreaker, engine.RESPONSE_SKIP);
assert.notEqual(engine.selectNext(bank, afterTie).id, tieBreaker.id, 'a skipped tie-breaker must remain consumed');

let skipped = engine.createState(bank);
const skippedId = engine.selectNext(bank, skipped).id;
skipped = engine.answerItem(bank, skipped, engine.selectNext(bank, skipped), engine.RESPONSE_SKIP);
assert.notEqual(engine.selectNext(bank, skipped).id, skippedId, 'a skipped question must remain consumed and never repeat');

console.log('Assessment tournament schema and deterministic engine contract passed.');
