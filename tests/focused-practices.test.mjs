import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));
const hi = JSON.parse(fs.readFileSync(new URL('../locales/hi.json', import.meta.url), 'utf8'));
const ru = JSON.parse(fs.readFileSync(new URL('../locales/ru.json', import.meta.url), 'utf8'));

for (const id of ['box-breathing-experience-toggle', 'hooponopono-experience-toggle', 'yoga-experience-toggle']) assert.match(html, new RegExp(`id="${id}"`), `${id} should remain selectable in the Lobby`);
assert.doesNotMatch(html, /id="box-meditation-toggle"|id="hooponopono-toggle"/, 'focused practices must not remain Settings add-ons');
assert.doesNotMatch(app, /state\.boxMeditation\b|state\.hooponopono\b/, 'legacy add-on state must not return');
assert.match(app, /boxBreathingExperienceEnabled: false/, 'Box Breathing should start session-only');
assert.match(app, /hooponoponoExperienceEnabled: false/, 'Ho’oponopono should start session-only');
assert.match(app, /yogaExperienceEnabled: false/, 'Yoga should start session-only');
for (const key of ['chakra_box_meditation', 'chakra_hooponopono']) {
    assert.match(app, new RegExp(`localStorage\\.removeItem\\('${key}'\\)`), `${key} should be cleared instead of restored`);
    assert.doesNotMatch(app, new RegExp(`localStorage\\.setItem\\('${key}'`), `${key} must not be persisted`);
}

assert.match(app, /getFocusedExperience\(\) \{[\s\S]*?yoga-experience-toggle[\s\S]*?intimate-service/, 'Yoga and intimate care remain standalone focused experiences');
assert.match(app, /state\.selectedChakras\.length === 0[\s\S]*?dharana-addon-toggle[\s\S]*?visualization-addon-toggle[\s\S]*?return 'preparation'/, 'Dharana and Visualization should run independently when no chakra is selected');
assert.match(app, /focusedExperience === 'preparation'[\s\S]*?runDharana\(\)[\s\S]*?runVisualization\(\)/, 'Standalone preparation should run the selected Dharana and Visualization stages in order');
assert.match(app, /runGratitude\(this\.isHighEnergy\);[\s\S]*?box-breathing-experience-toggle[\s\S]*?runBoxBreathing\(\)[\s\S]*?runSequence\(\)/, 'Box Breathing should prepare a normal chakra journey');
assert.match(html, /id="visualization-addon-toggle"[\s\S]*?id="visualization-duration"[\s\S]*?id="visualization-ambience"/, 'Visualization should expose its optional duration and score choice');
assert.match(html, /id="settings-vol-visualization"[^>]*min="0\.02"[^>]*max="0\.5"/, 'Settings should allow the approved higher Visualization ambience ceiling');
assert.match(html, /id="vol-visualization"[^>]*min="0\.02"[^>]*max="0\.5"/, 'Journey Tuning should match the Visualization ambience ceiling');
assert.match(app, /volVisualizationAmbience: clampAudioLevel\(storedNumber\('chakra_vol_visualization_ambience', 0\.10\), 0\.02, 0\.5, 0\.10\)/, 'Saved Visualization ambience volume should accept the same ceiling');
assert.match(html, /id="focus-anchor"/, 'Focused Attention needs a dedicated visible anchor layer rather than text inside the chakra image');
assert.match(app, /focusAnchor\.textContent = shapes\[anchor\][\s\S]*?focusAnchor\.hidden = false[\s\S]*?focusAnchor\.hidden = true/, 'Focused Attention should show its selected anchor and clean it up afterwards');
assert.match(app, /while \(remaining-- > 0 && this\.isMeditationActive\)[\s\S]*?dharanaClosing[\s\S]*?finally[\s\S]*?focusAnchor\.hidden = true/, 'Dharana should narrate its closing before the anchor and veil are removed');
assert.match(app, /--focus-anchor-duration[\s\S]*?is-focusing/, 'Focused Attention should slowly settle the anchor over the selected duration');
assert.match(app, /runDharana\(\)[\s\S]*?visualization-addon-toggle[\s\S]*?runVisualization\(\)[\s\S]*?runSequence\(\)/, 'Visualization should run after Dharana and before chakras');
assert.match(app, /VISUALIZATION_AMBIENCE_ENTRY_FADE_SECONDS = 8[\s\S]*?VISUALIZATION_AMBIENCE_EXIT_FADE_SECONDS = 10/, 'Visualization score should retain deliberate entry and exit fades');
assert.match(app, /visualizationAmbienceGain\.gain\.setValueAtTime\(1, this\.ctx\.currentTime\)[\s\S]*?new SeamlessLoop\(this\.ctx, this\.visualizationAmbienceBuffer, this\.visualizationAmbienceGain, state\.volVisualizationAmbience/, 'Visualization score should start audibly without a volume-slider interaction');
assert.match(app, /source\.loop = true/, 'Visualization score uses the native seamless loop path for the full practice duration');
assert.match(app, /if \(state\.visualizationAmbience === 'silence'\)[\s\S]*?visualizationSilenceWakePrompt[\s\S]*?pauseAwareSleep\(8000\)/, 'Silence mode should gently re-orient the meditator before the return prompt');
assert.match(app, /setVisualizationAmbienceDucked\(true, 0\.8\)[\s\S]*?narrate\([\s\S]*?setVisualizationAmbienceDucked\(false, 2\)/, 'Narration should duck and restore visualization ambience');
assert.match(app, /async runSequence[\s\S]*?hooponopono-experience-toggle[\s\S]*?runHooponopono\(\)[\s\S]*?handleSilence[\s\S]*?runClosing[\s\S]*?runEmergence/, 'Ho’oponopono should run after chakras and before closing/emergence');
assert.match(app, /clearFocusedExperiences\(target\)/, 'Standalone Experience Modes should remain mutually exclusive');
assert.match(app, /clearFocusedExperiences\(\);/, 'Shots and other Experience Modes should clear focused practices');
const focusedClearBody = app.slice(app.indexOf('function clearFocusedExperiences'), app.indexOf('function clearJourneyAddons'));
assert.doesNotMatch(focusedClearBody, /boxBreathing|hooponopono|dharana|visualization/i, 'Selecting a compatible journey add-on must not immediately clear it');
const addonClearBody = app.slice(app.indexOf('function clearJourneyAddons'), app.indexOf('const advancedPasswordModal'));
for (const feature of ['boxBreathing', 'hooponopono', 'dharana', 'visualization']) {
    assert.match(addonClearBody, new RegExp(feature, 'i'), `Exclusive modes must still clear ${feature}`);
}
assert.match(app, /focusAnchor\?\.classList\.add\('is-releasing'\)[\s\S]*?Promise\.all\([\s\S]*?dharanaClosing[\s\S]*?pauseAwareSleep\(4000\)/, 'Dharana should visually release while its closing narration plays');
assert.match(fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8'), /body\.dharana-active #chakra-container[\s\S]*?background:\s*#000[\s\S]*?\.focus-anchor\.is-releasing[\s\S]*?opacity:\s*0/, 'Dharana should enter a pitch-black full-screen scene and fade its anchor away');
assert.match(app, /if \(!focusedExperience && !isHighEnergy && order\.length === 0\)/, 'Yoga and care should not require chakra selection');
assert.match(app, /labels\.splice\(0, 0, t\('ui\.roadmapBoxBreathing'\)\)[\s\S]*?labels\.push\(t\('ui\.roadmapHooponopono'\)\)/, 'The roadmap should place preparation before chakras and integration after them');

for (const locale of [en, ml, hi, ru]) {
    assert.ok(locale.ui.dharanaClosing?.trim(), 'Each locale needs the Dharana closing narration');
    for (const key of ['boxBreathingExperience', 'hooponoponoExperience', 'yogaExperience', 'beginBoxBreathing', 'beginHooponopono', 'beginYogaExperience', 'roadmapBoxBreathing']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
    for (const key of ['visualizationAddon', 'visualizationAmbience', 'visualizationFocusPrompt', 'visualizationGuidance', 'visualizationReturn', 'visualizationSilenceWakePrompt', 'roadmapVisualization']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

console.log('Focused Box Breathing and Ho’oponopono experience-mode contract passed.');
