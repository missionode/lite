import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../docs/assesment.html', import.meta.url), 'utf8');
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .filter(Boolean);

assert.equal(inlineScripts.length, 1, 'assessment should have one inline application script');
new vm.Script(inlineScripts[0], { filename: 'assessment-inline.js' });

const chakraDataMatch = inlineScripts[0].match(/const chakras = (\[[\s\S]*?\n\]);\n\n\/\/ Consultant-facing/);
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

const consultationMetaMatch = inlineScripts[0].match(/const consultationMeta = (\{[\s\S]*?\n\});\n\nconst cards/);
assert.ok(consultationMetaMatch, 'consultant interpretation metadata should remain extractable');
const consultationMeta = vm.runInNewContext(`(${consultationMetaMatch[1]})`);
for (const chakra of chakras) {
    const meta = consultationMeta[chakra.id];
    assert.ok(meta, `${chakra.id} should retain consultant interpretation metadata`);
    for (const key of ['topics', 'directions', 'followUps', 'tags']) {
        assert.equal(meta[key].length, 5, `${chakra.id}.${key} should align with its five questions`);
    }
    assert.ok(meta.focus.trim(), `${chakra.id} should retain a guide-reviewed meditation consideration`);
}

const insightFunctionSource = inlineScripts[0].slice(
    inlineScripts[0].indexOf('function buildChakraInsight(chakra)'),
    inlineScripts[0].indexOf('function listMarkup(', inlineScripts[0].indexOf('function buildChakraInsight(chakra)')),
);
const sampleInsight = vm.runInNewContext(`
    ${insightFunctionSource}
    buildChakraInsight(chakras[0]);
`, {
    chakras,
    consultationMeta,
    state: { root: { 0: 'aligned', 1: 'concern-0', 2: 'unsure', 3: 'aligned', 4: 'concern-0' } },
    notes: { root: 'Client reports that uncertainty is strongest in the evening.' },
});
assert.equal(sampleInsight.strengths.length, 2, 'balanced selections should become reported strengths');
assert.equal(sampleInsight.patterns.length, 2, 'concern selections should become patterns to explore');
assert.equal(sampleInsight.uncertainties.length, 1, 'unsure selections should remain explicit discussion areas');
assert.equal(sampleInsight.followUps.length, 3, 'concerns and uncertainty should generate follow-up prompts');
assert.match(sampleInsight.note, /uncertainty is strongest/, 'client context should remain part of the consultant insight');

assert.equal(
    chakras.reduce((count, chakra) => count + chakra.questions.length, 0),
    35,
    'assessment should retain 35 questions',
);
assert.match(html, /past two weeks/i, 'assessment should provide a clear reflection period');
assert.match(inlineScripts[0], /result\.answered<chakra\.questions\.length/, 'incomplete cards must not receive a final score');
assert.match(inlineScripts[0], /value="unsure"/, 'each rendered question should offer a discuss/unsure path');
assert.match(inlineScripts[0], /chakraAssessmentNotes/, 'client context notes should be persisted separately');
assert.match(html, /CONSULTANT REFERENCE · BALANCED \/ SUPPORTED/, 'balanced answers should remain explicit consultant references');
assert.match(html, /\.answer\.expected\.selected \.mark/, 'only a selected balanced reference should display as selected');
assert.match(inlineScripts[0], /function buildChakraInsight\(chakra\)/, 'selected answers should generate per-chakra consultant insights');
assert.match(inlineScripts[0], /function renderAssessmentReview\(\)/, 'the completed interview should generate a cross-chakra review');
assert.match(inlineScripts[0], /Consultant decision:/, 'the final review should preserve manual consultant approval');
assert.match(html, /id="newAssessment"/, 'guides need a deliberate way to clear data for a new client');
assert.match(inlineScripts[0], /removeItem\("chakraAnswers"\)/, 'new-client reset should clear previous answers');
assert.match(html, /--page-chakra:/, 'assessment should expose an active chakra theme variable');
assert.match(inlineScripts[0], /function setPageTheme\(chakra\)/, 'active chakra changes should update the complete page theme');
assert.match(inlineScripts[0], /themeMeta\.content=chakra\.color/, 'browser theme color should follow the active chakra');
assert.match(inlineScripts[0], /document\.documentElement\.dataset\.activeChakra=chakra\.id/, 'the page root should identify its active chakra');
assert.match(inlineScripts[0], /function activateChakra\(chakraId\)/, 'navigation and client interaction should share one chakra activation path');
assert.match(inlineScripts[0], /activateChakra\(c\.id\)/, 'chakra navigation should apply its theme immediately');
assert.match(inlineScripts[0], /activateChakra\(cid\)/, 'answer selection should apply the matching chakra theme');
assert.match(inlineScripts[0], /cards\.addEventListener\("focusin"/, 'focused questions and notes should apply their chakra theme');
assert.match(inlineScripts[0], /getBoundingClientRect\(\)\.top>marker/, 'scroll position should deterministically select the visible chakra');
assert.match(inlineScripts[0], /window\.addEventListener\("scroll",scheduleThemeSync/, 'scrolling should keep the complete page theme synchronized');
assert.match(html, /href="\.\.\/index\.html"/, 'assessment should retain its Back to Lobby CTA');
assert.match(html, /id="lobbyLink" href="\.\.\/index\.html"/, 'new-client actions should include a nearby Return to Lobby link');

console.log('Chakra assessment contract passed for seven cards and 35 questions.');
