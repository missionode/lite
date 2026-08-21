import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');

assert.match(html, /id="splash-screen"[\s\S]*?src="Splash\.png"/, 'Splash image should remain available at launch');
assert.match(styles, /#splash-screen img\s*\{[\s\S]*?object-fit:\s*contain/, 'Splash should show the complete image before zooming');
assert.match(styles, /@keyframes splashReveal[\s\S]*?transform:\s*scale\(1\.12\)/, 'Splash should gently expand after the full image is visible');
assert.match(styles, /#splash-screen::before[\s\S]*?url\('Splash\.png'\)/, 'Splash should fill wide screens with a softened image backdrop');
assert.match(styles, /prefers-reduced-motion/, 'Splash animation should respect reduced-motion preferences');

console.log('Splash screen reveal contract passed.');
