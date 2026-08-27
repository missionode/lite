import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

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
assert.match(app, /const clipBlobs = await Promise\.all\(sentences\.map\(sentence => piperTTS\.synthesize\(sentence\)\)\)[\s\S]*?const piperDuration = clipBuffers\.reduce\(\(total, buffer\) => total \+ buffer\.duration, 0\)/, 'The marquee should use durations from the queued Piper clips');
assert.match(app, /playBuffer\(clipBuffers\[i\], volumeScale, \{[\s\S]*?startNarrationTicker\(piperDuration\)/, 'The marquee should start from Piper playback rather than an estimate');
assert.match(app, /async narrateBrowser\(text[\s\S]*?updateTicker = true\)[\s\S]*?if \(updateTicker\) setText\('narration-text', text, estimateNarrationDurationSeconds\(text, pacing\)\)/, 'Browser narration should show the complete narration block');
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
