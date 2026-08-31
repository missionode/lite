import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));
const piperModels = JSON.parse(fs.readFileSync(new URL('../piper-models.json', import.meta.url), 'utf8'));

const englishPiperVoices = piperModels.voices.filter(voice => voice.language === 'en');
assert.equal(englishPiperVoices.length, 1, 'the registry should currently expose one English Piper voice');
assert.equal(englishPiperVoices[0]?.id, 'en_US-lessac-medium', 'Lessac should remain the bundled English Piper voice');
assert.equal(englishPiperVoices[0]?.meditationPaceMultiplier, 0.74, 'English Lessac should match the calmer Malayalam meditation reading baseline');
assert.equal(englishPiperVoices[0]?.meditationLengthScaleMax, 1.5, 'English Lessac may use a bounded extended meditation cadence');
assert.equal(englishPiperVoices[0]?.meditationNoiseScale, 0.6, 'English Lessac should use a restrained smoothing noise scale');
assert.equal(englishPiperVoices[0]?.meditationNoiseW, 0.7, 'English Lessac should use a restrained phoneme-width variation');

const symbolPosition = html.indexOf('id="chakra-symbol"');
const tickerPosition = html.indexOf('id="narration-scroll-container"');
assert.ok(symbolPosition >= 0 && tickerPosition > symbolPosition, 'Narration ticker should appear below the chakra symbol');
for (const id of ['breathing-narration-scroll-container', 'narration-scroll-container', 'icebreaker-narration-scroll-container']) {
    assert.match(html, new RegExp(`id="${id}"[^>]*data-narration-ticker`), `${id} should provide a narration surface`);
}
assert.match(html, /id="narration-scroll-container"[^>]*dir="ltr"/, 'Narration ticker should use left-to-right direction');
assert.match(html, /id="narration-text"/, 'Narration ticker should provide a dedicated text element');
assert.match(styles, /\.narration-scroll-container\s*\{[\s\S]*?padding:/, 'Narration ticker should have explicit spacing and padding');
assert.match(styles, /\.narration-scroll-text\s*\{[\s\S]*?min-width:\s*100%[\s\S]*?font-size:\s*clamp\(/, 'Narration text should scale for larger, readable type and support short prompts');
assert.match(styles, /@keyframes narrationTickerReadOrder[\s\S]*?narration-start[\s\S]*?narration-end[\s\S]*?narration-width/, 'Narration should begin near the reader and finish with the final word at center');
assert.doesNotMatch(html, /id="tutorial-text"/, 'Preparation should not duplicate the scrolling narration text');
assert.match(app, /const setNarrationText = \(txt, narrationDurationSeconds = null\)[\s\S]*?querySelectorAll\('\[data-narration-text\]'\)[\s\S]*?refreshNarrationTicker\(el\)/, 'Narration updates should restart every ticker');
assert.match(app, /const refreshNarrationTicker = \(el\)[\s\S]*?classList\.add\('is-scrolling'\)/, 'Visible ticker text should receive marquee motion');
assert.match(app, /const refreshNarrationTicker = \(el\)[\s\S]*?container\.clientWidth === 0/, 'Ticker should measure only after its screen is visible');
assert.match(app, /const startOffset = container\.clientWidth \* 0\.68[\s\S]*?--narration-start/, 'The container width may position the text but must not control its timing');
assert.match(app, /const endOffset = container\.clientWidth \* 0\.5[\s\S]*?--narration-end/, 'The final spoken word should finish at the center reading point');
assert.match(app, /const estimateNarrationDurationSeconds = \(txt, pacing = 'normal'\)/, 'Narration should provide a conservative voice-duration estimate');
assert.match(app, /function getPiperMeditationPaceMultiplier\(value = state\.voiceName\)/, 'Piper voices should be able to declare a meditative pace baseline');
assert.match(app, /function getEffectivePiperPace\(\)[\s\S]*?selectedPace \* getPiperMeditationPaceMultiplier\(\)/, 'the user pace control should combine with the selected Piper meditation baseline');
assert.match(app, /function getPiperMeditationSettings\(value = state\.voiceName\)[\s\S]*?lengthScale: 1 \/ getEffectivePiperPace\(\)[\s\S]*?lengthScaleMax: Number\(definition\.meditationLengthScaleMax\)/, 'Piper voices should declare a bounded meditation cadence in their registry');
assert.match(app, /settings: getPiperMeditationSettings\(\)/, 'Piper synthesis should apply the selected meditation voice settings');
assert.match(app, /englishFemininePiper[\s\S]*?clarity: 22, warmth: 88, pace: 0\.90, echo: 'light'/, 'English feminine Piper should receive its softer meditation profile');
assert.match(app, /return Math\.max\(0\.6, Math\.min\(1\.15, selectedPace \* getPiperMeditationPaceMultiplier\(\)\)\)/, 'The app should permit the registered slower English meditation cadence');
assert.match(app, /noiseScale: Number\(definition\.meditationNoiseScale\)[\s\S]*?noiseW: Number\(definition\.meditationNoiseW\)/, 'registry smoothing controls should reach the Piper runtime');
assert.match(fs.readFileSync(new URL('../piper/runtime/piper-tts-web.js', import.meta.url), 'utf8'), /const lengthScaleMax = Number\.isFinite\(requestedLengthScaleMax\)[\s\S]*?Math\.min\(1\.5, requestedLengthScaleMax\)[\s\S]*?const noiseW = Number\.isFinite\(requestedNoiseW\)/, 'The Piper runtime should bound model-specific meditation cadence and smoothing values');
assert.match(app, /const speechDuration = Number\(container\.dataset\.narrationDurationHint\)[\s\S]*?Number\.isFinite\(speechDuration\)[\s\S]*?Math\.max\(1, speechDuration\)/, 'Ticker duration should follow narration timing rather than device width');
assert.doesNotMatch(app, /const isMobile = container\.clientWidth <= 600|const pixelsPerSecond = isMobile \? 42 : 34|speechDuration \* 1\.15/, 'Ticker speed must not vary by device width or mobile-specific pixel rates');
assert.match(app, /schedule\(\(\) => document\.querySelectorAll\('\[data-narration-text\]'\)\.forEach\(refreshNarrationTicker\)\)/, 'Screen changes should remeasure the active ticker');
assert.match(app, /const setNarrationTickerPaused = \(paused\)[\s\S]*?is-paused/, 'Ticker motion should pause with the meditation session');
assert.match(app, /const startNarrationTicker = \(durationSeconds\)[\s\S]*?setNarrationTickerAwaitingPlayback\(false\)[\s\S]*?refreshNarrationTicker\(el\)/, 'The ticker should start only when real playback is ready');
assert.match(app, /el\.classList\.add\('is-awaiting-playback'\)/, 'The ticker should hide its static text while Piper is preparing');
assert.match(app, /el\.classList\.remove\('is-awaiting-playback'\)/, 'The ticker should reveal text when playback begins');
assert.match(styles, /\.narration-scroll-text\.is-awaiting-playback\s*\{[\s\S]*?opacity:\s*0/, 'Pre-playback narration should not flash as static text');
assert.match(styles, /\.narration-scroll-text\s*\{[\s\S]*?transition:\s*opacity\s+0\.7s/, 'Narration should fade in at playback start');
assert.match(styles, /\.narration-scroll-text\.is-scrolling\s*\{[\s\S]*?linear 1 both/, 'Each narration should make one finite marquee pass');
assert.match(styles, /@keyframes narrationTickerReadOrder[\s\S]*?7%[\s\S]*?opacity:\s*0\.92[\s\S]*?93%[\s\S]*?opacity:\s*0\.92[\s\S]*?100%[\s\S]*?opacity:\s*0/, 'The marquee should fade in and out without a reset flash');
assert.match(app, /if \(id === 'narration-text'\)[\s\S]*?setNarrationText\(txt, narrationDurationSeconds\)/, 'Existing narration updates should feed the ticker');
assert.match(app, /async narrateWithPiper\(text[\s\S]*?setText\('narration-text', text, estimateNarrationDurationSeconds\(text, pacing\)\)[\s\S]*?const sentences/, 'Piper narration should show the complete narration block');
assert.match(app, /async decode\(blob\)[\s\S]*?decodeAudioData\(arrayBuffer\)/, 'Piper clips should expose their decoded duration');
assert.match(app, /async playBuffer\(buffer, volumeScale = 1, callbacks = \{\}\)[\s\S]*?callbacks\.onStart\?\.\(\{ duration: buffer\.duration/, 'Piper playback should expose the actual clip start timing');
assert.match(app, /const queueSynthesis = \(sentence\) => \{[\s\S]*?const pending = sentences\.slice\(0, 2\)\.map\(queueSynthesis\)/, 'Piper should prebuffer only the first two sentences');
assert.doesNotMatch(app, /Promise\.all\(sentences\.map\(sentence => piperTTS\.synthesize\(sentence\)\)\)/, 'Piper should not wait for the complete narration before playback');
assert.match(app, /if \(i \+ 2 < sentences\.length\) pending\.push\(queueSynthesis\(sentences\[i \+ 2\]\)\)/, 'Piper should continue generating the next sentence while playback flows');
assert.match(app, /const estimatedDurations = sentences\.map\(sentence =>[\s\S]*?estimateNarrationDurationSeconds\(sentence, pacing\)[\s\S]*?\)/, 'The hybrid ticker should have a fallback duration for sentences not decoded yet');
assert.match(app, /const buffer = await piperTTS\.decode\(blob\)[\s\S]*?narrationDuration \+= buffer\.duration - estimatedDurations\[i\][\s\S]*?updateNarrationTickerDuration\(narrationDuration\)/, 'The hybrid ticker should progressively replace estimates with real Piper durations');
assert.match(app, /await piperTTS\.playBuffer\(buffer, volumeScale, \{[\s\S]*?fadeOutSeconds:[\s\S]*?\}\)/, 'Piper should play each ready sentence progressively with a transition-aware fade');
assert.match(app, /const isFinalClip = i === sentences\.length - 1/, 'Piper should identify the final narration clip for a mantra handoff');
assert.match(app, /NARRATION_MANTRA_FADE_SECONDS/, 'the final narration clip should use a centralized mantra transition fade');
assert.match(app, /startNarrationTicker\(narrationDuration\)/, 'The marquee should start when the first Piper clip is ready');
assert.match(app, /const updateNarrationTickerDuration = \(durationSeconds\)[\s\S]*?const position = Number\.isFinite\(currentTime\)[\s\S]*?currentTime \/ previousDuration[\s\S]*?nextAnimation\.currentTime = position \* duration \* 1000/, 'Updating to real Piper timing should preserve the marquee position');
assert.match(app, /if \(!this\.isMeditationActive\) return;[\s\S]*?piperFailed = true[\s\S]*?piperTTS\.cancel\('sentence failed'\)/, 'A stopped journey should not trigger browser fallback after Piper cancellation');
assert.match(app, /async narrateBrowser\(text[\s\S]*?updateTicker = true, transition = 'none'\)[\s\S]*?if \(updateTicker\) setText\('narration-text', text, estimateNarrationDurationSeconds\(text, pacing\)\)/, 'Browser narration should show the complete narration block');
assert.doesNotMatch(app, /for \(let i = 0; i < sentences\.length; i\+\+\) \{[\s\S]*?setText\('narration-text', sentences\[i\]/, 'The ticker must not replace the full narration with each sentence');
assert.match(app, /async narrateSoftBrowser\(text\) \{\s*setText\('narration-text', text, estimateNarrationDurationSeconds\(text, 'soft'\)\)/, 'Soft prompts should also use the ticker');
assert.match(app, /async narrateFeebleBrowser\(text\) \{\s*setText\('narration-text', text, estimateNarrationDurationSeconds\(text, 'feeble'\)\)/, 'Feeble prompts should also use the ticker');
assert.match(app, /let narrationPlaybackGeneration = 0[\s\S]*?finishNarrationPlayback = \(generation\)[\s\S]*?setNarrationText\(''\)/, 'The ticker should have a narration playback lifecycle');
assert.match(app, /const cancelNarrationPlayback = \(\)[\s\S]*?narrationPlaybackGeneration \+= 1[\s\S]*?setNarrationText\(''\)/, 'Stopping a session should immediately invalidate and clear narration');
for (const method of ['narrate', 'narrateSoft', 'narrateFeeble']) {
    assert.match(app, new RegExp(`async ${method}\\([\\s\\S]*?const generation = beginNarrationPlayback\\(\\);[\\s\\S]*?finally \\{[\\s\\S]*?finishNarrationPlayback\\(generation\\)`), `${method} should clear the ticker after spoken audio finishes`);
}
assert.match(app, /runSleepJourney\(\)[\s\S]*?setText\('narration-text', ''\)/, 'Sleep mode should not leave non-spoken guidance in the narration ticker');
assert.match(app, /runShot\(type, customFrequency\)[\s\S]*?setText\('narration-text', ''\)/, 'Shot mode should not leave non-spoken help in the narration ticker');
for (const locale of [en, ml]) assert.ok(locale.ui.currentNarration?.trim(), 'Current narration label is required');

console.log('Narration ticker contract passed.');
