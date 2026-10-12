import assert from 'node:assert/strict';
import fs from 'node:fs';

// The converter runs with the TTS project's Python (onnx, onnxruntime, numpy, scipy);
// this test guards its contract. Its own run checks the baked audio numerically.
const script = fs.readFileSync(new URL('../scripts/bake_voice_tuning.py', import.meta.url), 'utf8');

assert.match(script, /TAPS = 1023  # odd -> symmetric, linear phase/, 'linear-phase FIR keeps timing');
assert.match(script, /peaking\(250, 0\.9, tuning\.get\('warmth', 0\), rate\)/, 'warmth matches the tuner (250 Hz, Q 0.9)');
assert.match(script, /peaking\(2300, 0\.8, tuning\.get\('clarity', 0\), rate\)/, 'clarity matches the tuner (2.3 kHz, Q 0.8)');
assert.match(script, /high_shelf\(min\(8000, rate \* 0\.36\), tuning\.get\('air', 0\), rate\)/, 'air matches the tuner');
assert.match(script, /10 \*\* \(tuning\.get\('volume', 0\) \/ 20\)/, 'volume is folded into the filter');
assert.match(script, /helper\.make_node\('Conv', \['tuning_wave', 'tuning_fir'\], \['tuning_filtered'\], pads=\[taps \/\/ 2, taps \/\/ 2\]\)/, 'same-length convolution');
assert.match(script, /helper\.make_node\('Clip'/, 'a clip guard keeps samples within [-1, 1]');
assert.match(script, /helper\.make_node\('Reshape', \['tuning_clipped', 'tuning_original_shape'\], \[out_name\]\)/, 'the output keeps its original name and shape');
assert.match(script, /'noise_scale': round\(float\(tuning\['noiseScale'\]\), 3\),[\s\S]*?'length_scale': round\(float\(tuning\['lengthScale'\]\), 3\),[\s\S]*?'noise_w': round\(float\(tuning\['noiseW'\]\), 3\)/, 'speed, expressiveness and rhythm become inference defaults');
assert.match(script, /app_side = \{k: tuning\.get\(k, 0\) for k in \('pitch', 'cleaner'\)\}/, 'pitch and the noise cleaner stay app-side');
assert.match(script, /report\['check'\] = verify\(args\.model, baked, fir, config\)/, 'every bake is checked against the expected filtered audio');
assert.match(script, /parser\.add_argument\('--out', required=True/, 'writes a new folder; the original files are never changed');
assert.match(script, /export\.get\('schema'\) != 1/, 'only Voice Tuner exports are accepted');

console.log('Bake voice tuning contract passed: tuner-matched FIR, volume, clip guard, inference defaults, app-side pitch/cleaner, verification.');
