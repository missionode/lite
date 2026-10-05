import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Tailwind v4 integration (phase 0 + Lobby phase 1). See docs/tailwind-roadmap.md.
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const html = read('index.html');
const sw = read('sw.js');
const css = read('style.css');
const input = read('tailwind/input.css');
const built = read('tailwind.css');
const pkg = JSON.parse(read('package.json'));

// Build pipeline: CLI, prefix, no preflight, scan only app files.
assert.match(pkg.scripts['build:css'], /tailwindcss -i tailwind\/input\.css -o tailwind\.css --minify/);
assert.ok(pkg.devDependencies.tailwindcss && pkg.devDependencies['@tailwindcss/cli']);
assert.match(input, /@layer legacy, theme, base, components, utilities;/, 'legacy is the lowest layer');
assert.match(input, /@import "tailwindcss\/theme\.css" layer\(theme\) prefix\(tw\);/);
assert.match(input, /@import "tailwindcss\/utilities\.css" layer\(utilities\) source\(none\) prefix\(tw\);/);
assert.doesNotMatch(input, /@import "tailwindcss"|@import "tailwindcss\/preflight/, 'no preflight reset while legacy CSS still owns element styles');
for (const source of ['../index.html', '../modules', '../app.js']) assert.ok(input.includes(`@source "${source}";`));

// Tokens: design-system colours only.
assert.match(input, /--color-\*: initial;/, 'no default Tailwind palette');
for (const [name, value] of [['sky', '#000000'], ['ink', '#f4f1ea'], ['muted', '#c3cedb'], ['gold', '#e8c27e'], ['on-gold', '#17130c'], ['chakra-thirdeye', '#8e4ec6']]) {
    assert.ok(input.includes(`--color-${name}: ${value};`), `token ${name}`);
}

// Cascade: style.css is wrapped in the legacy layer and loads before tailwind.css.
assert.match(css, /^\/\*[\s\S]*?\*\/\n@layer legacy \{\n/, 'style.css opens the legacy layer');
assert.match(css, /\n\}\n$/, 'and closes it at the end');
assert.ok(html.indexOf('href="style.css?v=') < html.indexOf('href="tailwind.css?v=1.1"'), 'tailwind.css loads after style.css');
assert.match(sw, /'\.\/tailwind\.css\?v=1\.1'/, 'tailwind.css works offline');
assert.doesNotMatch(html, /cdn\.tailwindcss\.com/, 'no runtime CDN build');

// The committed build contains the Lobby and the utilities the markup uses.
assert.match(built, /^\/\*! tailwindcss v4/);
for (const fragment of ['.ds-lobby', 'tw\\:lobby2\\:col-\\[1\\/-1\\]', 'tw\\:grid-cols-2', 'tw\\:tile4\\:grid-cols-4', 'tw\\:lobby2\\:grid-cols-7', '--tw-color-gold:']) {
    assert.ok(built.includes(fragment), `tailwind.css has ${fragment}`);
}
assert.match(html, /family=Inter:wght@200;300;400;500;600;700&/, 'Inter loads the weights the design system uses');

// When Tailwind is installed, the committed tailwind.css must match a fresh build.
const cli = new URL('../node_modules/.bin/tailwindcss', import.meta.url);
if (fs.existsSync(cli)) {
    const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lite-tw-')), 'tailwind.css');
    const result = spawnSync(cli.pathname, ['-i', 'tailwind/input.css', '-o', out, '--minify'], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(out, 'utf8'), built, 'tailwind.css is out of date: run npm run build:css');
}
// Phase 2: Settings and Sky Observatory on the design system; duplicate colours merged.
assert.match(html, /id="config-screen" class="screen settings-screen-container ds-settings"/);
assert.match(html, /id="sky-screen" class="screen sky-screen hidden ds-sky"/);
assert.match(input, /\.ds-settings > \.config-group \{[\s\S]*?var\(--tw-color-surface-settings\)/);
assert.match(input, /\.ds-settings \.primary-btn \{[\s\S]*?var\(--tw-color-cta-start\), var\(--tw-color-cta-end\)[\s\S]*?text-transform: none;/, 'Settings uses the one gold primary button');
assert.doesNotMatch(input, /ink-settings|muted-settings|cta-settings/, 'one ink, one muted, one gold button');
assert.match(input, /stroke='%23e8c27e'/, 'select chevron in design-system gold');
assert.doesNotMatch(css, /#config-screen > \.config-group\s*\{|\.sky-observatory-panel\s*\{|--cosmic-panel:/, 'old Settings and Sky block gone from style.css');
assert.match(html, /href="tailwind\.css\?v=1\.1"/);
console.log('tailwind setup: ok');
