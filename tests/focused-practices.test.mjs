import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const bodyScanPractice = fs.readFileSync(new URL('../modules/body-scan-practice.js', import.meta.url), 'utf8');
const mediaLifecycle = fs.readFileSync(new URL('../modules/media-lifecycle.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));
const hi = JSON.parse(fs.readFileSync(new URL('../locales/hi.json', import.meta.url), 'utf8'));
const ru = JSON.parse(fs.readFileSync(new URL('../locales/ru.json', import.meta.url), 'utf8'));
const scripts = JSON.parse(fs.readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));

for (const id of ['box-breathing-experience-toggle', 'hooponopono-experience-toggle', 'yoga-experience-toggle']) assert.match(html, new RegExp(`id="${id}"`), `${id} should remain selectable in the Lobby`);
assert.match(html, /id="yoga-mode-control"[^>]* hidden[\s\S]*?id="yoga-experience-toggle" disabled/, 'Yoga Experience should be available only after Advanced Features unlock');
assert.doesNotMatch(html, /id="box-meditation-toggle"|id="hooponopono-toggle"/, 'focused practices must not remain Settings add-ons');
assert.doesNotMatch(app, /state\.boxMeditation\b|state\.hooponopono\b/, 'legacy add-on state must not return');
for (const key of ['chakra_box_meditation', 'chakra_hooponopono']) {
    assert.match(app, new RegExp(`localStorage\\.removeItem\\('${key}'\\)`), `${key} should be cleared instead of restored`);
    assert.doesNotMatch(app, new RegExp(`localStorage\\.setItem\\('${key}'`), `${key} must not be persisted`);
}

assert.match(app, /getFocusedExperience\(\) \{[\s\S]*?journeyRouting\.resolveFocusedExperience[\s\S]*?yoga-experience-toggle[\s\S]*?assisted-bathing-toggle[\s\S]*?noting-addon-toggle/, 'Focused experience inputs should be delegated to the journey-routing owner');
assert.match(app, /focusedExperience === 'preparation'\) \{[\s\S]*?runPreparationStages\(\{ includeBox: true \}\)[\s\S]*?getChecked\('hooponopono-experience-toggle'\)[\s\S]*?runHooponopono\(\)[\s\S]*?getChecked\('undo-unlearn-addon-toggle'\)[\s\S]*?runUndoUnlearn\(\)/, 'Standalone preparation should use the ordered runner and include selected integration practices');
assert.match(app, /runGratitude\(this\.isHighEnergy\);[\s\S]*?runPreparationStages\(\{ includeBox: true, highEnergy: this\.isHighEnergy \}\)[\s\S]*?runSequence\(\)/, 'Journey preparation should run through the shared plan before chakras');
assert.match(app, /async runPreparationStages[\s\S]*?buildPreparationStagePlan[\s\S]*?runBoxBreathing[\s\S]*?runVisualization[\s\S]*?runDharana[\s\S]*?runBodyScan[\s\S]*?runNoting/, 'The controller should map each planned preparation stage to its existing runtime method');
assert.match(html, /id="visualization-addon-toggle"[\s\S]*?id="visualization-duration"[\s\S]*?id="visualization-ambience"/, 'Visualization should expose its optional duration and score choice');
assert.match(html, /id="settings-vol-visualization"[^>]*min="0\.02"[^>]*max="0\.5"/, 'Settings should allow the approved higher Visualization ambience ceiling');
assert.match(html, /id="vol-visualization"[^>]*min="0\.02"[^>]*max="0\.5"/, 'Journey Tuning should match the Visualization ambience ceiling');
assert.match(html, /id="focus-anchor"/, 'Focused Attention needs a dedicated visible anchor layer rather than text inside the chakra image');
assert.match(app, /focusAnchor\.textContent = shapes\[anchor\][\s\S]*?focusAnchor\.hidden = false[\s\S]*?focusAnchor\.hidden = true/, 'Focused Attention should show its selected anchor and clean it up afterwards');
assert.match(app, /while \(remaining-- > 0 && this\.isMeditationActive\)[\s\S]*?dharanaClosing[\s\S]*?finally[\s\S]*?focusAnchor\.hidden = true/, 'Dharana should narrate its closing before the anchor and veil are removed');
assert.match(app, /--focus-anchor-duration[\s\S]*?is-focusing/, 'Focused Attention should slowly settle the anchor over the selected duration');
assert.match(html, /box-breathing-experience-toggle[\s\S]*?visualization-addon-toggle[\s\S]*?dharana-addon-toggle[\s\S]*?body-scan-addon-toggle[\s\S]*?noting-addon-toggle[\s\S]*?chakra-selection-panel/, 'Lobby preparation controls should match the approved runtime order');
assert.match(html, /id="body-scan-duration"[\s\S]*?value="3"[\s\S]*?value="5" selected[\s\S]*?value="8"/, 'Body Scan should offer 3, 5 and 8 minute durations');
assert.match(app, /async runBodyScan\(\)[\s\S]*?bodyScanRegions[\s\S]*?bodyScanPractice\.run[\s\S]*?bodyScanOpening[\s\S]*?bodyScanClosing/, 'The controller should pass localized Body Scan content into its practice owner');
assert.match(fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8'), /\.body-scan-scene[\s\S]*?background:\s*#000/, 'Body Scan should use a pitch-black fade');
assert.doesNotMatch(html, /body-scan-figure|body-scan-light/, 'Body Scan must not display a body figure or scanning light');
assert.doesNotMatch(bodyScanPractice, /requestAnimationFrame|setInterval/, 'Body Scan must not add a recurring visual loop');
assert.match(html, /id="noting-duration"[\s\S]*?value="2"[\s\S]*?value="4" selected[\s\S]*?value="6"/, 'Guided Noting should offer 2, 4 and 6 minute durations');
assert.match(app, /async runNoting\(\)[\s\S]*?notingReminders[\s\S]*?notingOpening[\s\S]*?notingClosing/, 'Guided Noting should narrate its explanation, reminders and release');
assert.match(html, /hooponopono-experience-toggle[\s\S]*?undo-unlearn-addon-toggle[\s\S]*?id="undo-unlearn-duration"[\s\S]*?value="5"[\s\S]*?value="8" selected[\s\S]*?value="12"/, 'Undo & Unlearn should follow Ho’oponopono and offer 5, 8 and 12 minutes');
assert.match(app, /hooponopono-experience-toggle[\s\S]*?runHooponopono\(\)[\s\S]*?undo-unlearn-addon-toggle[\s\S]*?runUndoUnlearn\(\)[\s\S]*?handleSilence/, 'Undo & Unlearn should run after Ho’oponopono and before final silence');
assert.match(app, /async runUndoUnlearn\(\)[\s\S]*?undoUnlearnPhases[\s\S]*?undoUnlearnOpening[\s\S]*?undoUnlearnClosing/, 'Undo & Unlearn should narrate its content-free release flow');
assert.match(app, /VISUALIZATION_AMBIENCE_ENTRY_FADE_SECONDS = 8[\s\S]*?VISUALIZATION_AMBIENCE_EXIT_FADE_SECONDS = 10/, 'Visualization score should retain deliberate entry and exit fades');
assert.match(app, /visualizationAmbienceGain\.gain\.setValueAtTime\(1, this\.ctx\.currentTime\)[\s\S]*?new SeamlessLoop\(this\.ctx, this\.visualizationAmbienceBuffer, this\.visualizationAmbienceGain, state\.volVisualizationAmbience/, 'Visualization score should start audibly without a volume-slider interaction');
assert.match(mediaLifecycle, /source\.loop = true/, 'Visualization score uses the native seamless loop path for the full practice duration');
assert.match(app, /if \(state\.visualizationAmbience === 'silence'\)[\s\S]*?visualizationSilenceWakePrompt[\s\S]*?pauseAwareSleep\(8000\)/, 'Silence mode should gently re-orient the meditator before the return prompt');
assert.match(app, /setVisualizationAmbienceDucked\(true, 0\.8\)[\s\S]*?narrate\([\s\S]*?setVisualizationAmbienceDucked\(false, 2\)/, 'Narration should duck and restore visualization ambience');
assert.match(app, /async runSequence[\s\S]*?hooponopono-experience-toggle[\s\S]*?runHooponopono\(\)[\s\S]*?handleSilence[\s\S]*?runClosing[\s\S]*?runEmergence/, 'Ho’oponopono should run after chakras and before closing/emergence');
assert.match(app, /clearFocusedExperiences\(target\)/, 'Standalone Experience Modes should remain mutually exclusive');
assert.match(app, /clearFocusedExperiences\(\);/, 'Shots and other Experience Modes should clear focused practices');
const focusedClearBody = app.slice(app.indexOf('function clearFocusedExperiences'), app.indexOf('function clearJourneyAddons'));
assert.doesNotMatch(focusedClearBody, /boxBreathing|hooponopono|dharana|visualization/i, 'Selecting a compatible journey add-on must not immediately clear it');
const addonClearBody = app.slice(app.indexOf('function clearJourneyAddons'), app.indexOf('const advancedPasswordModal'));
    for (const feature of ['boxBreathing', 'hooponopono', 'dharana', 'visualization', 'bodyScan', 'noting', 'undoUnlearn']) {
    assert.match(addonClearBody, new RegExp(feature, 'i'), `Exclusive modes must still clear ${feature}`);
}
assert.match(app, /focusAnchor\?\.classList\.add\('is-releasing'\)[\s\S]*?Promise\.all\([\s\S]*?dharanaClosing[\s\S]*?pauseAwareSleep\(4000\)/, 'Dharana should visually release while its closing narration plays');
assert.match(fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8'), /body\.dharana-active #chakra-container[\s\S]*?background:\s*#000[\s\S]*?\.focus-anchor\.is-releasing[\s\S]*?opacity:\s*0/, 'Dharana should enter a pitch-black full-screen scene and fade its anchor away');
assert.match(app, /journeyRouting\.buildChakraOrder\([\s\S]*?focusedExperience[\s\S]*?massage-toggle[\s\S]*?selectedChakras/, 'Guided starts should delegate chakra-order selection to the journey-routing owner');
assert.match(app, /labels\.splice\(0, 0, t\('ui\.roadmapBoxBreathing'\)\)[\s\S]*?labels\.push\(t\('ui\.roadmapHooponopono'\)\)/, 'The roadmap should place preparation before chakras and integration after them');

for (const [language, locale] of Object.entries({ en, ml, hi, ru })) {
    for (const key of ['dharanaFocusGuidance', 'dharanaClosing', 'visualizationFocusPrompt', 'visualizationGuidance', 'visualizationSilenceWakePrompt', 'visualizationReturn']) {
        assert.equal(typeof locale.ui[key], 'string', `${language} ui.${key} narration must be a string`);
        assert.ok(locale.ui[key].trim(), `${language} ui.${key} narration must not be empty`);
    }
    for (const key of ['bodyScanOpening', 'bodyScanClosing']) assert.ok(locale.ui[key]?.trim(), `${language} ui.${key} narration must not be empty`);
    assert.equal(locale.ui.bodyScanRegions?.length, 8, `${language} Body Scan needs eight head-to-toe narration regions`);
    for (const region of locale.ui.bodyScanRegions) assert.ok(region.trim(), `${language} Body Scan region narration must not be empty`);
    for (const key of ['notingOpening', 'notingClosing']) assert.ok(locale.ui[key]?.trim(), `${language} ui.${key} narration must not be empty`);
    assert.equal(locale.ui.notingReminders?.length, 4, `${language} Guided Noting needs four spaced reminders`);
    for (const reminder of locale.ui.notingReminders) assert.ok(reminder.trim(), `${language} Guided Noting reminder must not be empty`);
    for (const key of ['undoUnlearnOpening', 'undoUnlearnClosing']) assert.ok(locale.ui[key]?.trim(), `${language} ui.${key} narration must not be empty`);
    assert.equal(locale.ui.undoUnlearnPhases?.length, 8, `${language} Undo & Unlearn needs eight content-free phases`);
    const undoCopy = [locale.ui.undoUnlearnOpening, ...locale.ui.undoUnlearnPhases, locale.ui.undoUnlearnClosing].join(' ');
    assert.doesNotMatch(undoCopy, /think about what happened|what happened|recall a person/i, `${language} Undo & Unlearn must not request recall or a private answer`);
    for (const key of ['centeringBreath', 'breathingComplete']) {
        assert.equal(typeof locale.system[key], 'string', `${language} system.${key} narration must be a string`);
        assert.ok(locale.system[key].trim(), `${language} system.${key} narration must not be empty`);
    }
    assert.equal(locale.system.breathingSteps?.length, 4, `${language} Box Breathing needs four localized spoken steps`);
    for (const step of locale.system.breathingSteps) assert.ok(step.text?.trim(), `${language} Box Breathing step narration must not be empty`);
    assert.ok(scripts.hooponopono.intro[language]?.trim(), `${language} Ho’oponopono intro narration is required`);
    assert.equal(scripts.hooponopono.phrases[language]?.length, 4, `${language} Ho’oponopono needs four spoken phrases`);
    for (const phrase of scripts.hooponopono.phrases[language]) assert.ok(phrase.trim(), `${language} Ho’oponopono phrase narration must not be empty`);
    assert.ok(scripts.hooponopono.closing[language]?.trim(), `${language} Ho’oponopono closing narration is required`);
    for (const key of ['boxBreathingExperience', 'hooponoponoExperience', 'yogaExperience', 'beginBoxBreathing', 'beginHooponopono', 'beginYogaExperience', 'roadmapBoxBreathing']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
    for (const key of ['visualizationAddon', 'visualizationAmbience', 'visualizationFocusPrompt', 'visualizationGuidance', 'visualizationReturn', 'visualizationSilenceWakePrompt', 'roadmapVisualization', 'bodyScanAddon', 'bodyScanDuration', 'bodyScanTitle', 'roadmapBodyScan', 'notingAddon', 'notingSubtitle', 'notingDuration', 'notingTitle', 'roadmapNoting', 'undoUnlearnAddon', 'undoUnlearnSubtitle', 'undoUnlearnDuration', 'undoUnlearnTitle', 'roadmapUndoUnlearn']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

console.log('Focused Box Breathing and Ho’oponopono experience-mode contract passed.');
