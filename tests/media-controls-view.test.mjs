import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/media-controls-view.js?v=1.0') < html.indexOf('app.js?v='), 'media controls module must load before app');
assert.match(worker, /modules\/media-controls-view\.js\?v=1\.0/, 'media controls module must be precached offline');

const events = new Map();
const elements = new Map(['preview-video-audio', 'preview-visualization-ambience', 'test-voice', 'mixer-voice-preview'].map(id => [id, {
    addEventListener(type, handler) { events.set(id, handler); }
}]));
const voiceStatus = { textContent: '', style: {} };
elements.set('voice-status', voiceStatus);
const warnings = [];
let loaded = 0;
let videoPreview = 0;
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
    loadJourneyVideoPrelude: async () => { loaded++; return { previewAudio: () => videoPreview++ }; }
});
events.get('preview-video-audio')();
events.get('preview-visualization-ambience')();
await Promise.resolve();
await Promise.resolve();
assert.equal(loaded, 1);
assert.equal(videoPreview, 1);
assert.equal(ambiencePreview, 1);
assert.equal(mediaSession.metadata.value.title, 'Chakra Meditation');
actions.get('play')();
assert.equal(toggles, 1);
actions.get('pause')();
assert.equal(toggles, 2);
actions.get('stop')();
assert.equal(stopped, 1);
assert.deepEqual(warnings, []);
console.log('Media controls view passed: previews, metadata and play/pause/stop action routing.');
