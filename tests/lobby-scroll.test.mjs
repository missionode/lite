import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');

assert.match(app, /function showScreen\(screen\)[\s\S]*?screen\.scrollTop = 0[\s\S]*?document\.scrollingElement\.scrollTop = 0[\s\S]*?window\.scrollTo\(0, 0\)/, 'screen navigation should reset section and document scroll');
assert.match(styles, /\.settings-screen-container\s*\{[\s\S]*?height: auto[\s\S]*?overflow-y: visible/, 'desktop settings content should grow instead of inheriting a clipped viewport height');
assert.match(styles, /#lobby-screen\s*\{[\s\S]*?min-height: 100vh[\s\S]*?height: auto[\s\S]*?justify-content: flex-start/, 'desktop Lobby content should remain top-aligned and fully scrollable');

console.log('Lobby desktop scroll contract passed.');
