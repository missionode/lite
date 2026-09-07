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
assert.match(app, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/,
    'Particle rendering should cap device-pixel density for mobile performance.');
assert.match(app, /Math\.min\(220, Math\.max\(80, Math\.round\(area \/ 8500\)\)\)/,
    'Particle density should respond to the viewport area.');
assert.match(app, /const layerFor = \(index\) => index < count \* 0\.52 \? 'background'[\s\S]*?'foreground'/,
    'The particle field should use multiple depth layers.');
assert.match(app, /isTwinkler: layer !== 'background' && Math\.random\(\) < \(layer === 'foreground' \? 0\.7 : 0\.46\)/,
    'Only selected stars should receive stronger twinkle animation.');
assert.match(app, /twinkleSpeed: 0\.16 \+ Math\.random\(\) \* 0\.18/,
    'Star twinkles should have a visible but gentle cycle.');
assert.match(app, /fillStyle = `rgba\(255, 255, 255, \$\{Math\.min\(1, alpha \* 1\.18\)\}\)`/,
    'Sparkling stars should receive a bright white core.');
assert.match(app, /Four-point star[\s\S]*?ctx\.closePath\(\)/,
    'Particles should render as subtle star-like sparkles.');
assert.match(app, /legLengths: Array\.from\(\{ length: 4 \}[\s\S]*?Math\.random\(\)/,
    'Star rays should have varied lengths rather than identical spikes.');
assert.match(app, /const driftY = animate[\s\S]*?const driftX = animate/,
    'Stars should use subtle independent drift on both axes.');
assert.match(app, /fillStyle = `rgba\(255, 255, 255, \$\{alpha\}\)`/,
    'Star twinkles should have a bright white luminous core.');
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

for (const bundle of [en, ml, ru, hi]) {
    for (const key of ['visualEffect', 'visualEffectNatural', 'visualEffectAura', 'visualEffectHolographic', 'visualEffectDepth']) {
        assert.ok(bundle.ui[key], `${key} should be translated for every visible UI language.`);
    }
}

console.log('Meditation visual effect contract passed.');
