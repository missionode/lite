import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../docs/assesment.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const scriptTags = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
const inlineScripts = scriptTags.map(match => match[1]).filter(source => source.trim());

assert.equal(inlineScripts.length, 1, 'assessment should have one inline application script');
new vm.Script(inlineScripts[0], { filename: 'assessment-inline.js' });

const enginePosition = html.indexOf('../modules/assessment-tournament.js?v=1.5');
const persistencePosition = html.indexOf('../modules/assessment-persistence.js?v=1.1');
const inlinePosition = html.indexOf('<script>', persistencePosition);
assert.ok(enginePosition > 0 && persistencePosition > enginePosition && inlinePosition > persistencePosition,
    'engine and persistence should load before the application');
assert.match(inlineScripts[0], /fetch\('\.\.\/data\/assessment-questions\.json\?v=1\.4'\)/,
    'the UI should fetch the versioned English question bank');

for (const id of [
    'loadingView', 'errorView', 'interviewView', 'resultView', 'progressLabel', 'progressBar',
    'questionPrompt', 'choiceLeft', 'choiceRight', 'equalChoice', 'skipChoice', 'saveStatus',
    'chakraResults', 'resultNote', 'sessionFocus', 'supportLegend', 'archetypeResults', 'operatorDot', 'newAssessment', 'undoAnswer', 'undoResult',
    'rapportInsight', 'rapportIcebreaker'
]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `${id} should remain in the tournament shell`);
}

assert.match(inlineScripts[0], /\.textContent\s*=/, 'dynamic copy should be inserted as text');
assert.match(inlineScripts[0], /document\.createElement\(/, 'result cards should use DOM construction');
assert.match(inlineScripts[0], /replaceChildren\(\)/, 'new results should replace old DOM safely');
assert.doesNotMatch(inlineScripts[0], /innerHTML/, 'question-bank content must never be inserted with innerHTML');
assert.match(inlineScripts[0], /persistence\.load\(bank, engineOptions\(\)\)/, 'an interrupted interview should resume locally');
assert.match(inlineScripts[0], /persistence\.save\(bank, state, engineOptions\(\)\)/, 'each answer should be persisted');
assert.match(inlineScripts[0], /persistence\.clear\(\)/, 'new-client reset should clear tournament and legacy data');
assert.match(inlineScripts[0], /ChakraAssessmentTournament\.undoLast\(bank, state, engineOptions\(\)\)/, 'the assessment should undo and persist its latest response');
assert.match(inlineScripts[0], /chakra_assessment_access_until/, 'developer-mode extras (value rounds and dot) should follow a short-lived Advanced Features handoff');
assert.doesNotMatch(inlineScripts[0], /accessRequiredView/, 'the assessment is public; there is no access-required view');
assert.match(inlineScripts[0], /developerMode = hasAdvancedAccess\(\)/, 'developer mode is read once when the page loads');
assert.match(inlineScripts[0], /operatorDot\.hidden = !result\.dot/, 'the dot is hidden when the result has none');
assert.match(html, /Conversation cue — not a prediction/, 'rapport guidance should not claim to predict character or behavior');
assert.match(inlineScripts[0], /window\.confirm\('Clear this assessment/, 'new-client clearing should be deliberate');

assert.match(html, /includedLanguages:\s*'en,ml,hi,ru,ta'/, 'English, Malayalam, Hindi and Russian should remain available');
assert.match(html, /translate\.google\.com\/translate_a\/element\.js\?cb=googleTranslateElementInit/,
    'the existing Google Translate path should be retained');
assert.match(html, /\.goog-te-gadget\{font-size:14px!important;/,
    'the current Google language launcher must remain visible');
assert.doesNotMatch(html, /\.goog-te-gadget\{font-size:0!important/, 'Google Translate copy should not be collapsed to zero size');
assert.match(html, /id="translationCache"/, 'translated strings should be retained for later tournament screens');
assert.match(inlineScripts[0], /function primeTranslationCache\(\)/, 'all dynamic questions and result labels should be prepared for translation');
assert.match(inlineScripts[0], /Today’s lowest answer-support signal is for/, 'the translated result should identify a tentative lowest-support area');
assert.match(inlineScripts[0], /evidenceCount/, 'results should show the number of responses behind each chakra signal');
assert.match(inlineScripts[0], /result\.focusStatus/, 'the result should handle insufficient evidence and near-ties without inventing a weakest chakra');
assert.doesNotMatch(inlineScripts[0], /reflection confidence|confidence-gated|chakra\.confidence/, 'the result must not describe answer coverage as confidence');
assert.match(html, /--support-lower:#c8b7ed/, 'lower support should use the agreed muted lavender');
assert.match(html, /--support-mixed:#efca78/, 'mixed support should use the agreed soft amber');
assert.match(html, /--support-higher:#7bd8ce/, 'higher support should use the agreed cool aqua');
assert.match(html, /class="support-legend"/, 'the color key should label the three support colors');
assert.match(inlineScripts[0], /signalMeter\.setAttribute\('aria-hidden','true'\)/, 'the color strip should be decorative because its status text remains visible');
assert.match(inlineScripts[0], /supportLevelByStatus/, 'the three-step cue should map from the textual support category');
assert.match(inlineScripts[0], /Possible discussion focus/, 'a highlighted focus candidate should also receive a readable label');
assert.match(inlineScripts[0], /translation\(`question:\$\{item\.id\}:prompt`, item\.prompt\)/,
    'later prompts should reuse Google-translated cache entries');
assert.match(html, /id="operatorDot" aria-hidden="true"/, 'the operator indicator should remain an unlabelled visual dot');
assert.match(html, /Responses stay on this device/, 'the local-data boundary should be visible');
assert.match(html, /separate from the meditation journey/, 'assessment should remain separate from journey configuration');
assert.doesNotMatch(inlineScripts[0], /startJourney|selectedChakras|journeyConfig/,
    'assessment must not configure or launch a journey');
assert.match(html, /href="\.\.\/index\.html"/, 'assessment should retain a return path to the Meditation Room');

for (const asset of [
    './data/assessment-questions.json?v=1.4',
    './modules/assessment-tournament.js?v=1.5',
    './modules/assessment-persistence.js?v=1.1'
]) {
    assert.ok(sw.includes(`'${asset}'`), `${asset} should be available through the app cache`);
}

console.log('Chakra assessment UI contract passed: safe tournament rendering, resume/reset, translation and offline assets.');
