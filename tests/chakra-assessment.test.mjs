import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../docs/assesment.html', import.meta.url), 'utf8');
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .filter(Boolean);

assert.equal(inlineScripts.length, 1, 'assessment should have one inline application script');
new vm.Script(inlineScripts[0], { filename: 'assessment-inline.js' });

const chakraDataMatch = inlineScripts[0].match(/const chakras = (\[[\s\S]*?\n\]);\n\nconst cards/);
assert.ok(chakraDataMatch, 'chakra question data should remain extractable');

const chakras = vm.runInNewContext(chakraDataMatch[1]);
assert.equal(chakras.length, 7, 'assessment should retain all seven chakra cards');
assert.equal(new Set(chakras.map((chakra) => chakra.id)).size, 7, 'chakra IDs should be unique');
assert.equal(new Set(chakras.map((chakra) => chakra.color)).size, 7, 'each chakra should retain a distinct page theme color');

for (const chakra of chakras) {
    assert.equal(chakra.questions.length, 5, `${chakra.id} should retain five questions`);
    for (const question of chakra.questions) {
        assert.ok(question.length >= 3, `${chakra.id} questions need a prompt, balanced response, and support response`);
        question.forEach((copy) => assert.ok(copy.trim(), `${chakra.id} question copy must not be empty`));
    }
}

assert.equal(
    chakras.reduce((count, chakra) => count + chakra.questions.length, 0),
    35,
    'assessment should retain 35 questions',
);
assert.match(html, /past two weeks/i, 'assessment should provide a clear reflection period');
assert.match(inlineScripts[0], /result\.answered<chakra\.questions\.length/, 'incomplete cards must not receive a final score');
assert.match(inlineScripts[0], /value="unsure"/, 'each rendered question should offer a discuss/unsure path');
assert.match(inlineScripts[0], /chakraAssessmentNotes/, 'client context notes should be persisted separately');
assert.match(html, /id="newAssessment"/, 'guides need a deliberate way to clear data for a new client');
assert.match(inlineScripts[0], /removeItem\("chakraAnswers"\)/, 'new-client reset should clear previous answers');
assert.match(html, /--page-chakra:/, 'assessment should expose an active chakra theme variable');
assert.match(inlineScripts[0], /function setPageTheme\(chakra\)/, 'active chakra changes should update the complete page theme');
assert.match(inlineScripts[0], /themeMeta\.content=chakra\.color/, 'browser theme color should follow the active chakra');
assert.match(html, /href="\.\.\/index\.html"/, 'assessment should retain its Back to Lobby CTA');

console.log('Chakra assessment contract passed for seven cards and 35 questions.');
