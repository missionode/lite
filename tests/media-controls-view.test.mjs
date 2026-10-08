import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/media-controls-view.js?v=1.1') < html.indexOf('app.js?v='), 'media controls module must load before app');
assert.match(worker, /modules\/media-controls-view\.js\?v=1\.1/, 'media controls module must be precached offline');

const events = new Map();
const elements = new Map(['preview-video-audio', 'preview-visualization-ambience', 'test-voice', 'mixer-voice-preview', 'play-video-introduction'].map(id => [id, {
    disabled: false,
    addEventListener(type, handler) { events.set(id, handler); }
}]));
const voiceStatus = { textContent: '', style: {} };
elements.set('voice-status', voiceStatus);
const warnings = [];
let loaded = 0;
let videoPreview = 0;
let introductionPlays = 0;
let finishIntroduction = null;
let ambiencePreview = 0;
const actions = new Map();
const mediaSession = { metadata: null, setActionHandler: (name, handler) => actions.set(name, handler) };
class Metadata { constructor(value) { this.value = value; } }
const context = {
    document: { getElementById: id => elements.get(id) || null },
    navigator: { mediaSession }, MediaMetadata: Metadata, console: { warn: (...args) => warnings.push(args) }
};
vm.runInNewContext(readFileSync('modules/media-controls-view.js', 'utf8'), context);
context.ChakraMediaControlsView.renderVoiceStatus(context.document, 'Voice ready', 'ready');
assert.equal(voiceStatus.textContent, 'Voice ready');
assert.equal(voiceStatus.style.display, 'block');
assert.equal(voiceStatus.style.color, '#4ade80');
context.ChakraMediaControlsView.renderVoiceStatus(context.document, '', 'muted');
assert.equal(voiceStatus.style.display, 'none');
let voicePreviews = 0;
context.ChakraMediaControlsView.bindVoicePreviewButtons({ document: context.document, testVoice: () => voicePreviews++ });
events.get('test-voice')();
events.get('mixer-voice-preview')();
assert.equal(voicePreviews, 2, 'both voice preview buttons use the same preview action');
let isPaused = true;
let stopped = 0;
let toggles = 0;
context.ChakraMediaControlsView.bind({
    audio: { previewVisualizationAmbience: () => ambiencePreview++ },
    meditation: { get isPaused() { return isPaused; }, togglePause: () => { toggles++; isPaused = !isPaused; }, stop: () => stopped++ },
    loadJourneyVideoPrelude: async () => { loaded++; return { previewAudio: () => videoPreview++, play: () => { introductionPlays++; return new Promise(resolve => { finishIntroduction = resolve; }); } }; }
});
events.get('preview-video-audio')();
events.get('preview-visualization-ambience')();
await Promise.resolve();
await Promise.resolve();
assert.equal(loaded, 1);
assert.equal(videoPreview, 1);
assert.equal(ambiencePreview, 1);
assert.equal(mediaSession.metadata.value.title, 'Chakra Meditation');
// Lobby: play the video introduction on its own, with the same prelude module.
const playIntroduction = elements.get('play-video-introduction');
events.get('play-video-introduction')();
assert.equal(playIntroduction.disabled, true, 'the Lobby play button is disabled while the introduction plays');
events.get('play-video-introduction')();
await new Promise(resolve => setTimeout(resolve, 0));
assert.equal(introductionPlays, 1, 'one tap plays the introduction once through the shared prelude');
assert.equal(stopped + toggles, 0, 'playing the introduction does not start, pause or stop a journey');
finishIntroduction('ended');
await new Promise(resolve => setTimeout(resolve, 0));
assert.equal(playIntroduction.disabled, false, 'the button is ready again once the video returns to the Lobby');
const preferences = html.slice(html.indexOf('id="journey-preferences-group"'), html.indexOf('id="experience-mode-group"'));
assert.match(preferences, /id="journey-video-prelude-toggle"[\s\S]*?<button id="play-video-introduction" class="secondary-btn" type="button" data-i18n="ui\.playVideoIntroduction">/, 'the play button sits beside Include video introduction');
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(readFileSync(`locales/${language}.json`, 'utf8'));
    assert.ok(locale.ui.playVideoIntroduction, `${language} labels the play button`);
}
actions.get('play')();
assert.equal(toggles, 1);
actions.get('pause')();
assert.equal(toggles, 2);
actions.get('stop')();
assert.equal(stopped, 1);
assert.deepEqual(warnings, []);
console.log('Media controls view passed: previews, metadata and play/pause/stop action routing.');
