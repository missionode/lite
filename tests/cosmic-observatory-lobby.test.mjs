import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const navigation = fs.readFileSync(new URL('../modules/screen-navigation.js', import.meta.url), 'utf8');
const ambientField = fs.readFileSync(new URL('../modules/ambient-particle-field.js', import.meta.url), 'utf8');

assert.match(html, /<section id="lobby-screen" class="screen lobby-shell hidden">/);
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
assert.match(css, /#lobby-screen\s*\{[\s\S]*?--lobby-surface:\s*rgba\(8,\s*15,\s*26,\s*0\.96\)/);
assert.match(css, /#lobby-screen \.lobby-panel\s*\{/);
assert.match(css, /@supports selector\(#app:has\(#lobby-screen\)\)/);
assert.match(css, /@media \(min-width: 560px\) and \(max-width: 919px\)[\s\S]*?#lobby-screen \.chakra-selection-list/);
assert.match(css, /@media \(max-width: 559px\)[\s\S]*?#lobby-screen \.lobby-panel/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?#lobby-screen/);

const stylesheetUrl = html.match(/href="(style\.css\?v=[^"]+)"/)?.[1];
assert.ok(stylesheetUrl, 'HTML loads a versioned theme stylesheet');
assert.ok(serviceWorker.includes(`'./${stylesheetUrl}'`), 'offline shell precaches the same stylesheet version');
assert.match(serviceWorker, /const CACHE_NAME = 'chakra-v5\.342'/);
assert.match(html, /id="sky-backdrop"[\s\S]*?id="particle-canvas"/);
assert.match(html, /id="open-sky-observatory"[\s\S]*?id="sky-screen"[\s\S]*?id="sky-location-status"[\s\S]*?id="close-sky-screen"/);
assert.match(html, /href="style\.css\?v=2\.18"/);
assert.match(serviceWorker, /'\.\/style\.css\?v=2\.18'/);
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
