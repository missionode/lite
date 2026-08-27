import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(app, /const SPATIAL_MODES = Object\.freeze\(\['off', 'stereo', 'headphones', 'room'\]\)/);
assert.match(app, /const DEFAULT_SPATIAL_MODE = 'off'/, 'Spatial audio must be off by default');
assert.match(app, /function normalizeSpatialMode\(value\)[\s\S]*?DEFAULT_SPATIAL_MODE/);
assert.match(app, /spatialMode: normalizeSpatialMode\(localStorage\.getItem\('chakra_spatial_mode'\)\)/);

for (const id of ['spatial-mode', 'mixer-spatial-mode']) {
    assert.match(html, new RegExp(`id="${id}"`), `${id} should be available`);
    for (const value of ['off', 'stereo', 'headphones', 'room']) {
        assert.match(html, new RegExp(`id="${id}"[\\s\\S]*?value="${value}"`), `${id} should offer ${value}`);
    }
}

for (const locale of [en, ml]) {
    for (const key of ['spatialSound', 'spatialOff', 'spatialStereo', 'spatialHeadphones', 'spatialRoom', 'spatialNote']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

assert.match(app, /this\.spatialDronePanner = this\.createSpatialPanner\(\)/);
assert.match(app, /this\.spatialMusicPanner = this\.createSpatialPanner\(\)/);
assert.match(app, /this\.spatialMantraPanner = this\.createSpatialPanner\(\)/);
assert.match(app, /this\.pannerNode\.connect\(this\.spatialDronePanner\)[\s\S]*?this\.spatialDronePanner\.connect\(this\.lowCutFilter\)/);
assert.match(app, /this\.bgMusicBusGain\.connect\(this\.spatialMusicPanner\)[\s\S]*?this\.spatialMusicPanner\.connect\(this\.lowCutFilter\)/);
assert.match(app, /this\.mantraFilter\.connect\(this\.spatialMantraPanner\)[\s\S]*?this\.spatialMantraPanner\.connect\(this\.lowCutFilter\)/);
assert.match(app, /this\.voiceClarityFilter\.connect\(this\.lowCutFilter\)/, 'Narration should remain on its centered path');
assert.doesNotMatch(app, /this\.voiceClarityFilter\.connect\(this\.spatial[A-Za-z]+Panner\)/, 'Narration must not be spatialized');

assert.match(app, /createSpatialPanner\(\)[\s\S]*?if \(this\.ctx\?\.createPanner\)[\s\S]*?return this\.ctx\.createStereoPanner\(\)/, 'Spatial routing needs a stereo fallback');
assert.match(app, /setSpatialMode\(mode = DEFAULT_SPATIAL_MODE\)[\s\S]*?model: 'HRTF'/, 'Headphone mode should use HRTF positioning');
assert.match(app, /setSpatialMode\(mode = DEFAULT_SPATIAL_MODE\)[\s\S]*?model: 'equalpower'/, 'Speaker-safe modes should use equal-power positioning');
assert.match(app, /setSpatialMode\(state\.spatialMode\)/, 'Saved spatial mode should apply when the audio graph initializes');
assert.match(app, /localStorage\.setItem\('chakra_spatial_mode', state\.spatialMode\)/, 'Spatial mode changes should persist');
assert.match(app, /getElementById\('spatial-mode'\)\?\.addEventListener\('change'/);
assert.match(app, /getElementById\('mixer-spatial-mode'\)\?\.addEventListener\('change'/);

console.log('Spatial audio routing contract passed.');
