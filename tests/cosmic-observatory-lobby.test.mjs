import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../tailwind/legacy.css', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const navigation = fs.readFileSync(new URL('../modules/screen-navigation.js', import.meta.url), 'utf8');
const ambientField = fs.readFileSync(new URL('../modules/ambient-particle-field.js', import.meta.url), 'utf8');

assert.match(html, /<section id="lobby-screen" class="screen lobby-shell hidden ds-lobby">/);
for (const id of [
    'journey-preparation-addons',
    'chakra-selection-panel',
    'journey-integration-addons',
    'box-breathing-experience-toggle',
    'visualization-addon-toggle',
    'dharana-addon-toggle',
    'body-scan-addon-toggle',
    'noting-addon-toggle',
    'hooponopono-experience-toggle',
    'undo-unlearn-addon-toggle',
    'time-per-chakra',
    'time-high-energy',
    'drone-duration-control',
    'returning-journey-toggle',
    'journey-video-prelude-toggle',
    'high-energy-toggle',
    'sleep-mode-toggle',
    'music-only-toggle',
    'yoga-experience-toggle',
    'intimate-service-panel',
    'session-estimate',
    'journey-roadmap',
    'start-meditation',
    'open-settings',
    'begin-consultation'
]) {
    assert.ok(html.includes(`id="${id}"`), `Lobby control #${id} remains present`);
}

assert.match(html, /id="chakra-selection"[\s\S]*?value="root"[\s\S]*?value="sacral"[\s\S]*?value="solar"[\s\S]*?value="heart"[\s\S]*?value="throat"[\s\S]*?value="thirdeye"[\s\S]*?value="crown"/);
// Lobby styles live in the Tailwind entry (design-system tokens) since phase 1.
const tw = fs.readFileSync(new URL('../tailwind/input.css', import.meta.url), 'utf8');
assert.match(tw, /--color-surface:\s*rgba\(8,\s*15,\s*26,\s*0\.96\)/, 'surface token from the design system');
assert.match(tw, /\.ds-lobby \{[\s\S]*?--lobby-surface: var\(--tw-color-surface\)/);
assert.match(tw, /\.ds-lobby \.lobby-panel \{/);
assert.match(tw, /@supports selector\(#app:has\(\.ds-lobby\)\)/);
assert.match(html, /id="chakra-selection" class="chakra-selection-list tw:grid-cols-2 tw:tile4:grid-cols-4 tw:lobby2:grid-cols-7"/, 'chakra grid: 2 / 4 (560px+) / 7 (920px+) columns');
assert.match(tw, /@media \(max-width: 559px\)[\s\S]*?\.ds-lobby \.lobby-panel/);
assert.match(tw, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.ds-lobby/);
assert.doesNotMatch(css, /#lobby-screen \.lobby-panel\s*\{/, 'the old Lobby block is gone from the legacy rules');

const stylesheetUrl = html.match(/href="(tailwind\.css\?v=[^"]+)"/)?.[1];
assert.ok(stylesheetUrl, 'HTML loads a versioned theme stylesheet');
assert.ok(serviceWorker.includes(`'./${stylesheetUrl}'`), 'offline shell precaches the same stylesheet version');
assert.match(serviceWorker, /const CACHE_NAME = 'chakra-v5\.375'/);
assert.match(html, /id="sky-backdrop"[\s\S]*?id="particle-canvas"/);
assert.match(html, /id="open-sky-observatory"[\s\S]*?id="sky-screen"[\s\S]*?id="sky-location-status"[\s\S]*?id="close-sky-screen"/);
assert.doesNotMatch(html, /style\.css/, 'one stylesheet: tailwind.css (phase 6)');
assert.doesNotMatch(serviceWorker, /style\.css/);
assert.match(navigation, /openSkyButton\?\.addEventListener\('click', \(\) => showScreen\(skyScreen\)\)/);
assert.match(navigation, /closeSkyButton\?\.addEventListener\('click', \(\) => showScreen\(configScreen\)\)/);
assert.match(ambientField, /isSkyPageActive\(\)\s*\{\s*return document\.body\.classList\.contains\('sky-canvas-active'\)/);
assert.match(ambientField, /isStaticBackdropActive\(\)\s*\{\s*return document\.body\.classList\.contains\('static-decorations'\)/);
assert.match(ambientField, /if \(!this\.ctx \|\| \(!this\.isSkyPageActive\(\) && !this\.isStaticBackdropActive\(\)\)\) return/);
assert.match(css, /body\.static-decorations \.sky-backdrop/);
assert.match(css, /#settings-manager-screen \.settings-panel,[\s\S]*?background:\s*rgba\(7,13,24,0\.96\)/);
assert.match(css, /\.journey-video-prelude-ready\s*\{[^}]*backdrop-filter:\s*none/);
assert.match(css, /#volume-mixer\s*\{[^}]*backdrop-filter:\s*none/);
assert.match(css, /#icebreaker-screen #icebreaker-subtitle,[\s\S]*?opacity:\s*1 !important/);
for (const language of ['en', 'ml', 'hi', 'ru']) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'));
    for (const key of ['skyObservatoryTitle', 'skyObservatoryEyebrow', 'openSkyObservatory', 'skySettingsNote']) {
        assert.ok(locale.ui[key], `${language} includes localized ${key}`);
    }
}

console.log('Cosmic Observatory theme contracts passed: Lobby controls retained; Settings/Sky navigation, four locales, responsive CSS and offline cache versions aligned.');
