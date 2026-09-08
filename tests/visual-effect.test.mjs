import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');
const app = readFileSync('app.js', 'utf8');
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
assert.match(app, /globalCompositeOperation = 'destination-out'[\s\S]*?globalCompositeOperation = 'source-over'/,
    'The Moon phase should reveal the transparent sky instead of using an opaque dark overlay disc.');
assert.match(app, /drawMoonWithBooleanMask\([\s\S]*?globalCompositeOperation = 'destination-out'[\s\S]*?drawImage\(buffer/,
    'The Moon should use an offscreen boolean mask before compositing onto the sky.');
assert.match(app, /function celestialMoonPhase\(days\)[\s\S]*?29\.530588853/,
    'Moon illumination should use the synodic cycle rather than right ascension.');
assert.match(app, /const halo = this\.ctx\.createRadialGradient[\s\S]*?halo\.addColorStop/,
    'Celestial bodies should receive a soft identifying divine glow.');
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
assert.match(app, /t\(labelKey, state\.displayLanguage\)[\s\S]*?fillText\(label/,
    'Celestial labels should follow the selected display language and remain subtle.');
assert.match(app, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/,
    'Particle rendering should cap device-pixel density for mobile performance.');
assert.match(app, /Math\.min\(240, Math\.max\(100, Math\.round\(area \/ 7600\)\)\)/,
    'Particle density should respond to the viewport area.');
assert.match(app, /const layerFor = \(index\) => index < count \* 0\.52 \? 'background'[\s\S]*?'foreground'/,
    'The particle field should use multiple depth layers.');
assert.match(app, /isTwinkler: layer !== 'background' && Math\.random\(\) < \(layer === 'foreground' \? 0\.86 : 0\.55\)/,
    'Only selected bright stars should receive stronger twinkle animation.');
assert.match(app, /twinkleSpeed: 0\.65 \+ Math\.random\(\) \* 1\.2/,
    'Star twinkles should use varied visible cycles.');
assert.match(app, /twinkleDepth: 0\.3 \+ Math\.random\(\) \* 0\.42/,
    'Star brightness changes should be visible but bounded.');
assert.match(app, /Math\.sin\(time \* particle\.twinkleSpeed[\s\S]*?particle\.twinkleSpeed \* 2\.37/,
    'Star twinkles should combine independent sine waves instead of a synchronized CSS loop.');
assert.match(app, /drawMeteors\(time, width, height\)[\s\S]*?this\.meteors\.length < 2[\s\S]*?nextMeteorAt = time \+ 8 \+ Math\.random\(\) \* 7/,
    'The sky should occasionally show a capped, low-frequency shooting star.');
assert.match(app, /fillStyle = `rgba\(255, 255, 255, \$\{Math\.min\(1, alpha \* 1\.18\)\}\)`/,
    'Sparkling stars should receive a bright white core.');
assert.match(app, /Four-point star[\s\S]*?ctx\.closePath\(\)/,
    'Particles should render as subtle star-like sparkles.');
assert.match(app, /legLengths: Array\.from\(\{ length: 4 \}[\s\S]*?Math\.random\(\)/,
    'Star rays should have varied lengths rather than identical spikes.');
assert.match(app, /const driftY = animate[\s\S]*?const driftX = animate/,
    'Stars should use subtle independent drift on both axes.');
assert.match(app, /color: starColors\[Math\.floor\(Math\.random\(\) \* starColors\.length\)\]/,
    'Stars should use varied realistic colour temperatures.');
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
assert.match(styles, /#nebula-bg::before,[\s\S]*?#nebula-bg::after/,
    'The shared background should provide layered ambient colour volumes.');
assert.match(styles, /@keyframes nebulaDriftA[\s\S]*?@keyframes nebulaDriftB/,
    'Ambient background volumes should drift slowly for a subtle sense of depth.');
assert.match(styles, /filter:\s*blur\(72px\) saturate\(0\.88\)/,
    'Ambient background volumes should remain soft and non-distracting.');
assert.match(styles, /#app:fullscreen[\s\S]*?background:\s*transparent/,
    'The fullscreen app shell should not cover the ambient background.');
assert.match(app, /const cycleSeconds = 8 \+ Math\.random\(\) \* 8/,
    'Image breathing should use a slow randomized cycle per chakra.');
assert.match(app, /classList\.toggle\('image-breathe-active', breatheActive\)/,
    'The image breathing effect should cover symbols and deity images without relying on visual mode.');
assert.match(styles, /@keyframes imageLightBreath[\s\S]*?opacity: 0\.9[\s\S]*?opacity: 1/,
    'Image breathing should remain within a subtle visible opacity range.');

for (const bundle of [en, ml, ru, hi]) {
    for (const key of ['visualEffect', 'visualEffectNatural', 'visualEffectAura', 'visualEffectHolographic', 'visualEffectDepth']) {
        assert.ok(bundle.ui[key], `${key} should be translated for every visible UI language.`);
    }
}

console.log('Meditation visual effect contract passed.');
