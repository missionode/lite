import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Narration feelings: bounded presets of pace, liveliness, rhythm, closeness
// and pause, used first in the 2-Minute Mind Reset (owner choice A).
const source = fs.readFileSync(new URL('../modules/narration-feeling.js', import.meta.url), 'utf8');
const context = vm.createContext({ Math, Number, Object, String, Array });
vm.runInContext(source, context);
const feeling = context.ChakraNarrationFeeling;
assert.ok(Object.isFrozen(feeling));
assert.deepEqual(Array.from(feeling.NAMES), ['warm', 'tender', 'grounding', 'still', 'return', 'uplift']);

// Every preset stays inside the safe limits.
for (const name of feeling.NAMES) {
    const safe = feeling.preset(name);
    for (const [key, [low, high]] of Object.entries(feeling.LIMITS)) {
        assert.ok(safe[key] >= low && safe[key] <= high, `${name}.${key} = ${safe[key]} stays within ${low}–${high}`);
    }
}
assert.equal(feeling.preset('shouting'), null, 'unknown feelings are ignored');
// The deepest feeling is the slowest, calmest, softest and leaves the most silence.
const still = feeling.preset('still');
for (const name of feeling.NAMES.filter(n => n !== 'still')) {
    const other = feeling.preset(name);
    assert.ok(still.pace <= other.pace && still.liveliness <= other.liveliness && still.closeness <= other.closeness && still.pauseAfter >= other.pauseAfter, `still is the deepest (vs ${name})`);
}
// Uplift never gets louder than normal and never goes past the liveliness cap.
assert.ok(feeling.preset('uplift').closeness <= 1 && feeling.preset('uplift').liveliness <= 1.12);

// Tags: only known feelings are removed; the words stay the same.
assert.deepEqual({ ...feeling.parse('[tender] Let your shoulders soften.') }, { feeling: 'tender', text: 'Let your shoulders soften.' });
assert.deepEqual({ ...feeling.parse('[Still]   Rest here.') }, { feeling: 'still', text: 'Rest here.' });
assert.deepEqual({ ...feeling.parse('[note] keep me') }, { feeling: null, text: '[note] keep me' });
assert.deepEqual({ ...feeling.parse('No tag.') }, { feeling: null, text: 'No tag.' });

// Piper settings: slower pace = longer length scale; liveliness and rhythm become factors.
const base = { lengthScale: 1, lengthScaleMax: 1.35 };
const settings = feeling.voiceSettings(base, 'still');
assert.ok(Math.abs(settings.lengthScale - 1 / 0.9) < 1e-9);
assert.equal(settings.lengthScaleMax, 1.35, 'the voice cap from Settings is kept');
assert.equal(settings.noiseScaleFactor, 0.82);
assert.equal(settings.noiseWFactor, 0.8);
assert.equal(feeling.voiceSettings(base, null), base, 'no feeling, no change');

// Pitch arcs: warm welcome, a settling middle and a close that matches the mood.
assert.deepEqual(Array.from(feeling.pitchArc('calm', 6)), ['warm', 'grounding', 'tender', 'still', 'still', 'return']);
assert.deepEqual(Array.from(feeling.pitchArc('focus', 6)), ['warm', 'grounding', 'still', 'still', 'grounding', 'return']);
for (const mood of ['calm', 'courage', 'energy', 'focus']) {
    const arc = feeling.pitchArc(mood, 6);
    assert.equal(arc.length, 6);
    assert.equal(arc[0], 'warm', `${mood} opens warmly`);
    assert.ok(arc.every(name => feeling.NAMES.includes(name)));
    assert.equal(feeling.pitchArc(mood, 3).length, 3, 'shorter scripts still get one feeling per line');
}
assert.equal(feeling.pitchArc('energy', 6).at(-1), 'uplift', 'Energy ends lifted');
assert.equal(feeling.pitchArc('calm', 6).includes('uplift'), false, 'Calm never lifts');

// Wiring: runtime bounds, cache key, playback volume, pause, Pitch Mode and the tag stripper.
const runtime = fs.readFileSync(new URL('../piper/runtime/piper-tts-web.js', import.meta.url), 'utf8');
assert.match(runtime, /Math\.max\(0\.75, Math\.min\(1\.12, factor\)\)/, 'the runtime clamps feeling factors again');
assert.match(runtime, /inference\.noise_scale \* feelingFactor\(settings\.noiseScaleFactor\)/);
assert.match(runtime, /inference\.noise_w \* feelingFactor\(settings\.noiseWFactor\)/);
const lifecycle = fs.readFileSync(new URL('../modules/piper-lifecycle.js', import.meta.url), 'utf8');
assert.match(lifecycle, /async prepare\(text, feeling = null\)[\s\S]*?const settings = this\.settingsFor\(feeling\);[\s\S]*?JSON\.stringify\(\[this\.voiceId, this\.voiceDefinition, settings, text\]\)/, 'cached clips are keyed by their feeling settings');
const narration = fs.readFileSync(new URL('../modules/piper-narration.js', import.meta.url), 'utf8');
assert.match(narration, /piperTTS\.prepare\(sentence, feeling\)/);
assert.match(narration, /playBuffer\(buffer, volumeScale \* closeness/);
assert.match(narration, /feeling\.pauseAfter \* 1000/);
const pitch = fs.readFileSync(new URL('../modules/pitch-mode.js', import.meta.url), 'utf8');
assert.match(pitch, /narrationFeeling\.pitchArc\(mood, lines\.length\)/);
assert.match(pitch, /owner\.narrate\(lines\[index\], false, false, 'normal', 'none', feelings\[index\] \|\| null\)/);
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /narrationFeeling\.parse\(text\)/, 'a leading tag is removed before speaking');
assert.match(app, /feelingSettings: \(base, feeling\) =>/);
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/narration-feeling.js?v=1.0') < html.indexOf('modules/pitch-mode.js'), 'feelings load before Pitch Mode');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(sw, /'\.\/modules\/narration-feeling\.js\?v=1\.0'/, 'works offline');
assert.match(sw, /chakra-piper-v12/, 'the changed Piper runtime is fetched fresh');
console.log('narration feeling: ok');
