import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

for (const id of ['box-breathing-experience-toggle', 'hooponopono-experience-toggle', 'yoga-experience-toggle']) {
    assert.match(html, new RegExp(`id="${id}"`), `${id} should be a Lobby Experience Mode`);
}
assert.doesNotMatch(html, /id="box-meditation-toggle"|id="hooponopono-toggle"/, 'focused practices must not remain Settings add-ons');
assert.doesNotMatch(app, /state\.boxMeditation\b|state\.hooponopono\b/, 'focused practices must not be appended to a normal meditation flow');
assert.match(app, /boxBreathingExperienceEnabled: false/, 'Box Breathing should start session-only');
assert.match(app, /hooponoponoExperienceEnabled: false/, 'Ho’oponopono should start session-only');
assert.match(app, /yogaExperienceEnabled: false/, 'Yoga should start session-only');
for (const key of ['chakra_box_meditation', 'chakra_hooponopono']) {
    assert.match(app, new RegExp(`localStorage\\.removeItem\\('${key}'\\)`), `${key} should be cleared instead of restored`);
    assert.doesNotMatch(app, new RegExp(`localStorage\\.setItem\\('${key}'`), `${key} must not be persisted`);
}

assert.match(app, /getFocusedExperience\(\) \{[\s\S]*?box-breathing-experience-toggle[\s\S]*?hooponopono-experience-toggle[\s\S]*?yoga-experience-toggle/, 'one focused practice should be selected at a time');
assert.match(app, /if \(focusedExperience\) \{[\s\S]*?this\.audio\.fadeInBackgroundMusic\(BACKGROUND_MUSIC_ENTRY_FADE_SECONDS\);[\s\S]*?focusedExperience === 'box'[\s\S]*?this\.runBoxBreathing\(\)[\s\S]*?focusedExperience === 'yoga'[\s\S]*?this\.runYogaSession\(\)[\s\S]*?this\.runHooponopono\(\)[\s\S]*?this\.finish\(\);/, 'focused practices should finish directly without a chakra sequence');
assert.doesNotMatch(app, /state\.boxMeditation\) await this\.runBoxBreathing\(\)|state\.hooponopono\) \{ await this\.runHooponopono\(\)/, 'normal journeys must no longer append either practice');
assert.match(app, /clearFocusedExperiences\(target\)/, 'Experience Modes should be mutually exclusive');
assert.match(app, /clearFocusedExperiences\(\);/, 'Shots and other Experience Modes should clear focused practices');
assert.match(app, /if \(!focusedExperience && !isHighEnergy && order\.length === 0\)/, 'focused practices should not require chakra selection');
assert.match(app, /roadmapBoxBreathing/, 'Box Breathing should have its own Lobby roadmap');

for (const locale of [en, ml]) {
    for (const key of ['boxBreathingExperience', 'hooponoponoExperience', 'yogaExperience', 'beginBoxBreathing', 'beginHooponopono', 'beginYogaExperience', 'roadmapBoxBreathing']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

console.log('Focused Box Breathing and Ho’oponopono experience-mode contract passed.');
