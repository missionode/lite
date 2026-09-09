import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('app.js', 'utf8');
const sky = readFileSync('night-sky.js', 'utf8');
const styles = readFileSync('style.css', 'utf8');
const en = JSON.parse(readFileSync('locales/en.json', 'utf8'));
const ml = JSON.parse(readFileSync('locales/ml.json', 'utf8'));
const ru = JSON.parse(readFileSync('locales/ru.json', 'utf8'));
const hi = JSON.parse(readFileSync('locales/hi.json', 'utf8'));

assert.match(html, /<canvas id="particle-canvas" aria-hidden="true"><\/canvas>/,
    'The shared background should include the ambient particle canvas.');
assert.match(app, /class AmbientParticleField[\s\S]*?requestAnimationFrame\(this\.render\)/,
    'The particle field should use a lightweight animation loop.');
assert.match(app, /navigator\.geolocation\.getCurrentPosition[\s\S]*?refreshCelestialBodies/,
    'The sky should use the granted observer location when available.');
assert.match(app, /setFallbackObserver\(\)[\s\S]*?latitude: 0, longitude: 0, approximate: true[\s\S]*?refreshCelestialBodies\(\)/,
    'The sky should retain an approximate celestial fallback when location is unavailable.');
assert.match(app, /const orbitalAngle = trueAnomaly \+ argument[\s\S]*?Math\.sin\(node\) \* Math\.cos\(orbitalAngle\)/,
    'The Moon should convert its orbital node correctly before horizon projection.');
assert.match(app, /namedStars = \[[\s\S]*?Polaris[\s\S]*?Sirius[\s\S]*?Vega[\s\S]*?Arcturus/,
    'The sky should include recognizable bright stars.');
assert.match(app, /name: 'Moon'[\s\S]*?kind: 'moon'[\s\S]*?phase:/,
    'The sky should draw a location-aware phased Moon.');
assert.match(app, /incidence<=0\) continue[\s\S]*?pixels\.data\[i\+3\][\s\S]*?drawImage\(buffer/,
    'The unlit Moon should stay transparent while the lit sphere is composited.');
assert.match(app, /function celestialMoonPhase\(days\)[\s\S]*?29\.530588853/,
    'Moon illumination should use the synodic cycle rather than right ascension.');
assert.match(app, /const halo = this\.ctx\.createRadialGradient[\s\S]*?halo\.addColorStop/,
    'Celestial bodies should receive a restrained atmospheric halo.');
assert.match(app, /angularDiameter: 0\.52[\s\S]*?body\.angularDiameter \/ 0\.52/,
    'The Moon should provide the apparent-size reference for planet scaling.');
assert.match(app, /createRadialGradient\(x - size \* 0\.35[\s\S]*?planetGradient\.addColorStop/,
    'Planets should use soft radial lighting rather than flat coloured dots.');
assert.doesNotMatch(app, /fillStyle = 'rgba\(4, 6, 18, 0\.82\)'/,
    'The Moon should not use a pasted opaque dark disc for its phase.');
assert.match(app, /\['Venus'[\s\S]*?\['Jupiter'[\s\S]*?\['Mars'[\s\S]*?\['Saturn'/,
    'The sky should include visible planet candidates with individual colours.');
assert.match(app, /drawCelestialBodies\(width, height\)/,
    'Calculated celestial bodies should be rendered in the ambient sky.');
assert.match(app, /CELESTIAL_LABEL_KEYS[\s\S]*?ui\.celestialMoon[\s\S]*?ui\.celestialJupiter[\s\S]*?ui\.celestialSirius/,
    'Prominent celestial bodies should have localized display labels.');
assert.match(app, /const shouldShowLabel = body\.kind !== 'moon'[\s\S]*?font = '500 11px Inter, Manjari, sans-serif'[\s\S]*?rgba\(2, 4, 9, 0\.15\)[\s\S]*?strokeStyle = 'rgba\(2, 4, 9, 0\.15\)'[\s\S]*?0\.30\)`[\s\S]*?fillText\(label/,
    'Non-Moon celestial labels should use 30% text with a 15% translucent backing and outline.');
assert.match(app, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/,
    'Particle rendering should cap device-pixel density for mobile performance.');
assert.match(app, /this\.ctx\.save\(\);\s*this\.ctx\.shadowBlur = 0;\s*this\.ctx\.filter = 'blur\(3px\)';[\s\S]*?fillRect\(labelLeft, labelY - 12, labelWidth, 16\);\s*this\.ctx\.restore\(\);[\s\S]*?strokeText\(label/,
    'Only the label backing is blurred; text rendering restores its sharp state.');
assert.match(html, /night-sky\.js\?v=[^\"]+[\s\S]*?app\.js\?v=/,
    'The cached sky renderer must load before the app controller.');
assert.match(sky, /this\.twinklingStars\.length < 110/,
    'Only a bounded subset of bright stars should be animated.');
assert.match(app, /nextMeteorAt = time \+ 25 \+ Math\.random\(\) \* 45/,
    'Meteors should be occasional rather than a continuous shower.');
assert.match(app, /document\.hidden[\s\S]*?cancelAnimationFrame\(this\.frame\)/,
    'The particle field should pause when the document is hidden.');
assert.match(html, /id="visual-effect-select"[\s\S]*?value="natural"[\s\S]*?value="aura"[\s\S]*?value="holographic"[\s\S]*?value="depth"/,
    'Settings should expose the meditation visual effect choices.');
assert.match(app, /const MEDITATION_VISUAL_EFFECTS = new Set\(\['natural', 'aura', 'holographic', 'depth'\]\)/,
    'Runtime should normalize the supported visual effect modes.');
assert.match(app, /visualEffect:\s*normalizeMeditationVisualEffect\(localStorage\.getItem\('chakra_visual_effect'\)\)/,
    'The selected visual effect should be restored from local storage.');
assert.match(app, /localStorage\.setItem\('chakra_visual_effect', state\.visualEffect\)/,
    'The selected visual effect should be saved with Settings.');
assert.match(app, /classList\.add\(`visual-effect-\$\{effect\}`\)[\s\S]*?classList\.toggle\('visual-effect-active', active\)/,
    'The image container should receive the normalized visual effect class.');
assert.match(app, /const active = effect !== 'natural' && !state\.eyesCloseMode/,
    'Eyes Close Mode should suppress decorative visual effects.');
assert.match(styles, /#chakra-container\.visual-effect-holographic::after[\s\S]*?animation:\s*holographicShimmer 12s ease-in-out infinite alternate/,
    'Holographic mode should use a slow CSS-only shimmer.');
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation:\s*none/,
    'The visual effect should respect reduced-motion preferences.');
assert.doesNotMatch(styles, /@keyframes nebulaDrift/,
    'The natural sky should not contain drifting colored cloud volumes.');
assert.match(styles, /#app:fullscreen[\s\S]*?background:\s*transparent/,
    'The fullscreen app shell should not cover the ambient background.');
assert.match(app, /const cycleSeconds = 8 \+ Math\.random\(\) \* 8/,
    'Image breathing should use a slow randomized cycle per chakra.');
assert.match(app, /classList\.toggle\('image-breathe-active', breatheActive\)/,
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
