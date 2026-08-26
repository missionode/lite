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
assert.match(styles, /@keyframes narrationTickerReadOrder[\s\S]*?narration-start[\s\S]*?narration-width/, 'Narration should begin near the reader and reveal LTR words in order');
assert.doesNotMatch(html, /id="tutorial-text"/, 'Preparation should not duplicate the scrolling narration text');
assert.match(app, /const setNarrationText = \(txt, narrationDurationSeconds = null\)[\s\S]*?querySelectorAll\('\[data-narration-text\]'\)[\s\S]*?refreshNarrationTicker\(el\)/, 'Narration updates should restart every ticker');
assert.match(app, /const refreshNarrationTicker = \(el\)[\s\S]*?classList\.add\('is-scrolling'\)/, 'Visible ticker text should receive marquee motion');
assert.match(app, /const refreshNarrationTicker = \(el\)[\s\S]*?container\.clientWidth === 0/, 'Ticker should measure only after its screen is visible');
assert.match(app, /const startOffset = container\.clientWidth \* 0\.68[\s\S]*?const travel = textWidth \+ startOffset/, 'Short narration prompts should receive marquee motion too');
assert.match(app, /const estimateNarrationDurationSeconds = \(txt, pacing = 'normal'\)/, 'Narration should provide a conservative voice-duration estimate');
assert.match(app, /const isMobile = container\.clientWidth <= 600[\s\S]*?const pixelsPerSecond = isMobile \? 42 : 34[\s\S]*?speechDuration \* 1\.15/, 'Mobile speed should adapt without outrunning spoken narration');
assert.match(app, /schedule\(\(\) => document\.querySelectorAll\('\[data-narration-text\]'\)\.forEach\(refreshNarrationTicker\)\)/, 'Screen changes should remeasure the active ticker');
assert.match(app, /const setNarrationTickerPaused = \(paused\)[\s\S]*?is-paused/, 'Ticker motion should pause with the meditation session');
assert.match(app, /if \(id === 'narration-text'\)[\s\S]*?setNarrationText\(txt, narrationDurationSeconds\)/, 'Existing narration updates should feed the ticker');
assert.match(app, /async narrateWithPiper\(text[\s\S]*?setText\('narration-text', text, estimateNarrationDurationSeconds\(text, pacing\)\)[\s\S]*?const sentences/, 'Piper narration should show the complete narration block');
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
