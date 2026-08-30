import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');

assert.match(
    app,
    /function shouldRefreshLocalizedIntention\(value, previousLanguage\)[\s\S]*?languageRegistry\.map\(language => language\.id\)[\s\S]*?isGeneratedIntention\(value, language\)/,
    'Generated intention detection should recognize every registered content language.'
);
assert.match(
    app,
    /languageSelect\.addEventListener\('change', \(e\) => \{[\s\S]*?const previousLanguage = state\.language;[\s\S]*?const shouldUpdateGeneratedIntention = shouldRefreshLocalizedIntention\(state\.intention, previousLanguage\);[\s\S]*?state\.language = e\.target\.value;[\s\S]*?if \(shouldUpdateGeneratedIntention\) \{[\s\S]*?defaultIntention\(state\.language\)[\s\S]*?localStorage\.setItem\('chakra_intention', state\.intention\);/,
    'Changing Meditation Language should refresh and persist only an app-generated intention.'
);

console.log('Language intention contract passed.');
