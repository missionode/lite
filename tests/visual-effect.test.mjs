import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('app.js', 'utf8');
const sky = readFileSync('night-sky.js', 'utf8');
const particleField = readFileSync('modules/ambient-particle-field.js', 'utf8');
const visualEngine = readFileSync('modules/visual-engine.js', 'utf8');
const styles = readFileSync('style.css', 'utf8');
const en = JSON.parse(readFileSync('locales/en.json', 'utf8'));
const ml = JSON.parse(readFileSync('locales/ml.json', 'utf8'));
const ru = JSON.parse(readFileSync('locales/ru.json', 'utf8'));
const hi = JSON.parse(readFileSync('locales/hi.json', 'utf8'));

assert.match(html, /<canvas id="particle-canvas" aria-hidden="true"><\/canvas>/,
    'The shared background should include the ambient particle canvas.');
assert.match(particleField, /class AmbientParticleField[\s\S]*?requestAnimationFrame\(this\.render\)/,
    'The particle field should use a lightweight animation loop.');
assert.match(particleField, /navigator\.geolocation\.getCurrentPosition[\s\S]*?refreshCelestialBodies/,
    'The sky should use the granted observer location when available.');
assert.match(particleField, /incidence<=0\) continue[\s\S]*?pixels\.data\[i\+3\][\s\S]*?drawImage\(buffer/,
    'The unlit Moon should stay transparent while the lit sphere is composited.');
assert.match(particleField, /const halo = this\.ctx\.createRadialGradient[\s\S]*?halo\.addColorStop/,
    'Celestial bodies should receive a restrained atmospheric halo.');
assert.match(particleField, /createRadialGradient\(x - size \* 0\.35[\s\S]*?planetGradient\.addColorStop/,
    'Planets should use soft radial lighting rather than flat coloured dots.');
assert.doesNotMatch(particleField, /fillStyle = 'rgba\(4, 6, 18, 0\.82\)'/,
    'The Moon should not use a pasted opaque dark disc for its phase.');
assert.match(particleField, /drawCelestialBodies\(width, height\)/,
    'Calculated celestial bodies should be rendered in the ambient sky.');
assert.match(app, /CELESTIAL_LABEL_KEYS[\s\S]*?ui\.celestialMercury[\s\S]*?ui\.celestialJupiter[\s\S]*?ui\.celestialMoon[\s\S]*?ui\.celestialSirius/,
    'Prominent celestial bodies should have localized display labels.');
assert.match(particleField, /translatedLabel = labelKey \? t\(labelKey, state\.displayLanguage\)[\s\S]*?translatedLabel\.startsWith\('ui\.'\)[\s\S]*?const shouldShowLabel = body\.kind === 'sun' \|\| body\.kind === 'planet' \|\| \(body\.kind === 'star' && body\.magnitude < 1\)[\s\S]*?font = '500 11px Inter, Manjari, sans-serif'[\s\S]*?rgba\(2, 4, 9, 0\.20\)[\s\S]*?strokeStyle = 'rgba\(2, 4, 9, 0\.20\)'[\s\S]*?0\.40\)`[\s\S]*?fillText\(label/,
    'Non-Moon celestial labels should use 40% text with a 20% translucent backing and outline.');
assert.match(particleField, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/,
    'Particle rendering should cap device-pixel density for mobile performance.');
assert.match(particleField, /this\.ctx\.save\(\);\s*this\.ctx\.shadowBlur = 0;\s*this\.ctx\.filter = 'blur\(3px\)';[\s\S]*?fillRect\(labelLeft, labelY - 12, labelWidth, 16\);\s*this\.ctx\.restore\(\);[\s\S]*?strokeText\(label/,
    'Only the label backing is blurred; text rendering restores its sharp state.');
assert.match(html, /night-sky\.js\?v=[^\"]+[\s\S]*?modules\/ambient-particle-field\.js\?v=1\.0[\s\S]*?app\.js\?v=/,
    'The cached sky dependencies and extracted renderer must load before the app controller.');
assert.match(html, /modules\/ambient-particle-field\.js\?v=1\.0[\s\S]*?modules\/visual-engine\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.11/,
    'The shared visual-effect owner must load after sky dependencies and before the app.');
assert.match(readFileSync('sw.js', 'utf8'), /chakra-v5\.308[\s\S]*?modules\/visual-engine\.js\?v=1\.0/,
    'The visual-effect module must be precached for offline sessions.');
assert.match(app, /new window\.AmbientParticleField\(\)/,
    'The app should construct the same one shared particle-field owner from its extracted module.');
assert.match(app, /new window\.VisualEngine\(audio\)/,
    'The app should construct the same single visual-effect owner with the existing audio engine.');
assert.match(sky, /this\.twinklingStars\.length < 110/,
    'Only a bounded subset of bright stars should be animated.');
assert.match(particleField, /nextMeteorAt = time \+ 25 \+ Math\.random\(\) \* 45/,
    'Meteors should be occasional rather than a continuous shower.');
assert.match(particleField, /document\.hidden[\s\S]*?cancelAnimationFrame\(this\.frame\)/,
    'The particle field should pause when the document is hidden.');
assert.match(html, /id="visual-effect-select"[\s\S]*?value="natural"[\s\S]*?value="aura"[\s\S]*?value="holographic"[\s\S]*?value="depth"/,
    'Settings should expose the meditation visual effect choices.');
assert.match(app, /const MEDITATION_VISUAL_EFFECTS = new Set\(\['natural', 'aura', 'holographic', 'depth'\]\)/,
    'Runtime should normalize the supported visual effect modes.');
assert.match(app, /localStorage\.setItem\('chakra_visual_effect', state\.visualEffect\)/,
    'The selected visual effect should be saved with Settings.');
assert.match(visualEngine, /classList\.add\(`visual-effect-\$\{effect\}`\)[\s\S]*?classList\.toggle\('visual-effect-active', active\)/,
    'The image container should receive the normalized visual effect class.');
assert.match(visualEngine, /const active = effect !== 'natural' && !state\.eyesCloseMode/,
    'Eyes Close Mode should suppress decorative visual effects.');
assert.match(styles, /#chakra-container\.visual-effect-holographic::after[\s\S]*?animation:\s*holographicShimmer 12s ease-in-out infinite alternate/,
    'Holographic mode should use a slow CSS-only shimmer.');
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation:\s*none/,
    'The visual effect should respect reduced-motion preferences.');
assert.doesNotMatch(styles, /@keyframes nebulaDrift/,
    'The natural sky should not contain drifting colored cloud volumes.');
assert.match(styles, /#app:fullscreen[\s\S]*?background:\s*transparent/,
    'The fullscreen app shell should not cover the ambient background.');
assert.match(visualEngine, /const cycleSeconds = 8 \+ Math\.random\(\) \* 8/,
    'Image breathing should use a slow randomized cycle per chakra.');
assert.match(visualEngine, /classList\.toggle\('image-breathe-active', breatheActive\)/,
    'The image breathing effect should cover symbols and deity images without relying on visual mode.');
const breathingFrames = styles.slice(styles.indexOf('@keyframes imageLightBreath'), styles.indexOf('#chakra-container.visual-effect-active::before'));
assert.doesNotMatch(breathingFrames, /opacity:/, 'Image breathing must not fade the artwork.');
assert.match(breathingFrames, /scale: 1\.018/, 'Image breathing uses restrained depth motion.');
assert.match(styles, /#chakra-symbol\s*\{[^}]*opacity: 1;/, 'Artwork remains fully opaque.');
assert.match(styles, /#chakra-container::after\s*\{[^}]*z-index: 1;/, 'Light layers stay behind the artwork.');
const motionBlock = styles.slice(styles.indexOf('@media (prefers-reduced-motion: reduce)', styles.indexOf('@keyframes imageLightBreath')), styles.indexOf('.chakra-gold-ring'));
let depth = 0;
for (const character of motionBlock) {
    if (character === '{') depth++;
    if (character === '}') depth--;
    assert.ok(depth >= 0, 'Reduced-motion block must not close early.');
}
assert.equal(depth, 0, 'Reduced-motion braces must balance.');
assert.match(motionBlock, /#chakra-container::after[\s\S]*animation: none !important/, 'All decorative modes honor reduced motion.');

for (const bundle of [en, ml, ru, hi]) {
    for (const key of ['visualEffect', 'visualEffectNatural', 'visualEffectAura', 'visualEffectHolographic', 'visualEffectDepth']) {
        assert.ok(bundle.ui[key], `${key} should be translated for every visible UI language.`);
    }
}

console.log('Meditation visual effect contract passed.');
