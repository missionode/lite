import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Tailwind v4 integration (phase 0 + Lobby phase 1). See docs/tailwind-roadmap.md.
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const html = read('index.html');
const sw = read('sw.js');
const css = read('tailwind/legacy.css');
const input = read('tailwind/input.css');
const built = read('tailwind.css');
const pkg = JSON.parse(read('package.json'));

// Build pipeline: CLI, prefix, preflight (phase 6), scan only app files.
assert.match(pkg.scripts['build:css'], /tailwindcss -i tailwind\/input\.css -o tailwind\.css --minify/);
assert.ok(pkg.devDependencies.tailwindcss && pkg.devDependencies['@tailwindcss/cli']);
assert.match(input, /@import "tailwindcss\/theme\.css" layer\(theme\) prefix\(tw\);/);
assert.match(input, /@import "tailwindcss\/utilities\.css" layer\(utilities\) source\(none\) prefix\(tw\);/);
assert.doesNotMatch(input, /@import "tailwindcss";/, "pieces imported one by one (theme, preflight, utilities), never the all-in-one import");
for (const source of ['../index.html', '../modules', '../app.js']) assert.ok(input.includes(`@source "${source}";`));

// Tokens: design-system colours only.
assert.match(input, /--color-\*: initial;/, 'no default Tailwind palette');
for (const [name, value] of [['sky', '#000000'], ['ink', '#f4f1ea'], ['muted', '#c3cedb'], ['gold', '#e8c27e'], ['on-gold', '#17130c'], ['chakra-thirdeye', '#8e4ec6']]) {
    assert.ok(input.includes(`--color-${name}: ${value};`), `token ${name}`);
}

// Cascade (phase 6): one stylesheet. Preflight on in base; legacy rules bundled from tailwind/legacy.css.
assert.ok(!fs.existsSync(new URL('../style.css', import.meta.url)), 'style.css is gone');
assert.doesNotMatch(html + sw, /style\.css/, 'nothing loads or precaches style.css');
assert.match(html, /<link rel="stylesheet" href="tailwind\.css\?v=2\.2">/);
assert.match(input, /@layer theme, base, ds-base, legacy, components, utilities;/, 'layer order: preflight lowest, design-system layers win');
assert.match(input, /@import "tailwindcss\/preflight\.css" layer\(base\);/, 'preflight on');
assert.match(input, /@import "\.\/legacy\.css";/, 'legacy rules bundled into the build');
assert.match(css, /\n@layer ds-base, legacy;\n@layer legacy \{\n/, 'legacy file opens the legacy layer');
assert.match(css, /\n\}\n$/, 'and closes it at the end');
{
    const order = ['theme', 'base', 'ds-base', 'legacy', 'components', 'utilities'].map(name => built.indexOf(`@layer ${name}`));
    assert.ok(order.every((at, i) => at >= 0 && (i === 0 || at > order[i - 1])), 'built layers appear in cascade order');
}
assert.match(input, /html, :host \{ line-height: normal; \}[\s\S]*?h2 \{ font-size: 1\.5em; font-weight: 700; \}[\s\S]*?a \{ color: var\(--tw-color-gold\); text-decoration: underline; \}/, 'old browser defaults kept above preflight; links in gold');
assert.match(sw, /'\.\/tailwind\.css\?v=2\.2'/, 'tailwind.css works offline');
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
assert.match(html, /href="tailwind\.css\?v=2\.2"/);
// Phase 3: shared pieces on design-system tokens, in ds-base with the element defaults they compete with.
for (const selector of ['.primary-btn {', '.secondary-btn {', 'input[type="range"]::-webkit-slider-runnable-track {', '.range-step {', '.checkbox-label {', '.drone-duration-copy {', '.modal-content {', '.app-notice {', '* {', 'label {']) {
    assert.ok(input.includes(selector), `ds-base has ${selector}`);
    const top = new RegExp('(^|\\n)' + selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    assert.doesNotMatch(css, top, `${selector} moved out of style.css`);
}
assert.match(input, /\.primary-btn \{[\s\S]*?var\(--tw-color-cta-start\)[\s\S]*?text-transform: none;/, 'gold primary button app-wide');
assert.match(input, /--range-fill, 65%\), rgba\(192, 207, 225, 0\.18\)/, 'gold slider fill on a quiet track');
assert.doesNotMatch(input.slice(input.indexOf('Shared pieces (phase 3)')), /#a78bfa|#7c3aed|251, 191, 36/, 'no violet or amber in the shared pieces');
assert.match(input, /\.settings-help-list p \{[\s\S]*?border: 1px solid var\(--tw-color-border\)/, 'help and FAQ entries are tiles, not left-border cards');
// Phase 4: legacy violet #7c3aed and amber #fbbf24 retired from app chrome (legacy variables point at design-system tokens).
const appJs = read('app.js');
const chromeModules = ['screen-navigation', 'completion-view', 'session-stop', 'shot-session', 'mood-ambience-settings-view'].map(name => read(`modules/${name}.js`)).join('\n');
assert.doesNotMatch(css.slice(css.indexOf('}', css.indexOf(':root {'))), /#7c3aed|#fbbf24|124, *58, *237|251, *191, *36|#ede9fe|#4c1d95|%23fbbf24/i, 'no legacy violet or amber in style.css rules');
assert.doesNotMatch(appJs + chromeModules, /#7c3aed|#fbbf24|124, *58, *237/i, 'no legacy violet or amber in journey chrome scripts');
assert.match(css, /--text-color: var\(--tw-color-ink\);[\s\S]*?--accent-color: var\(--tw-color-gold\);[\s\S]*?--glass-bg: var\(--tw-color-tile\);/, 'legacy variables come from design-system tokens');
assert.match(css, /--primary-color: #a9d9df;/, 'calm sky-teal default; the chakra colour replaces it during a journey');
assert.match(css, /#breathing-circle \{[\s\S]*?var\(--tw-color-gold-glow\), var\(--tw-color-gold\) 60%/, 'gold breathing orb');
// Phase 5: practice and support screens.
for (const id of ['settings-manager-screen', 'experiment-screen']) assert.match(html, new RegExp(`id="${id}" class="[^"]*ds-settings`), `${id} uses .ds-settings`);
assert.match(html, /id="icebreaker-screen" class="[^"]*ds-support/, 'Arriving uses .ds-support');
assert.match(html, /id="newcomer-tutorial-title" class="tw:sr-only"/, 'orientation title is screen-reader only (sr-only was never defined)');
assert.match(input, /\.ds-settings \.config-group select \{[\s\S]*?background-repeat: no-repeat;/, 'single gold chevron on every .ds-settings select');
assert.doesNotMatch(css, /rgba\((220, 205, 255|233, 220, 255|237, 233, 254|168, 145, 255|36, 28, 70|16, 12, 36|30, 20, 60),/, 'no lavender or violet surfaces in support screens');
for (const page of ['docs/assesment.html', 'docs/repertory.html']) {
    const doc = read(page);
    assert.match(doc, /--ink:#f4f1ea;/, `${page} ink from the design system`);
    assert.match(doc, /--gold:#e8c27e;/, `${page} gold from the design system`);
    assert.match(doc, /family=Inter/, `${page} loads Inter`);
    assert.doesNotMatch(doc, /rgba\((126,87,194|90,61,151|169,139,255|24,19,45),|#6f4cae|#090713|#0d0a14/, `${page} has no violet surfaces`);
}
console.log('tailwind setup: ok');
