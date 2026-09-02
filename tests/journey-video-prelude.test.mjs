import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const locales = ['en', 'ml', 'ru', 'hi'].map(language =>
    JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'))
);

assert.ok(fs.statSync(new URL('../video/nature-upgrade.mp4', import.meta.url)).size > 0, 'the supplied prelude video should exist');
assert.match(html, /id="journey-video-prelude"[\s\S]*?id="journey-video-prelude-media"[^>]*playsinline[\s\S]*?src="video\/nature-upgrade\.mp4"/, 'the prelude should use the supplied video in an inline mobile-safe player');
assert.match(html, /id="skip-journey-video-prelude"[\s\S]*?data-i18n="ui\.skipJourneyVideoPrelude"/, 'the prelude should provide a localized Skip control');
assert.match(css, /\.journey-video-prelude\s*\{[\s\S]*?position:\s*fixed[\s\S]*?inset:\s*0[\s\S]*?z-index:\s*100100/, 'the video prelude should fill the application viewport');
assert.match(css, /\.journey-video-prelude video\s*\{[\s\S]*?object-fit:\s*cover[\s\S]*?transition:\s*opacity 2\.4s/, 'the video should receive a gradual visual entry');
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS = 2\.4/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS = 3/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_SKIP_FADE_SECONDS = 1\.2/);
assert.match(app, /class JourneyVideoPrelude[\s\S]*?this\.media\.play\(\)[\s\S]*?fadeJourneyVideoPrelude\(state\.volMusic, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS\)/, 'video audio should fade in at the guide-selected music level');
assert.match(app, /this\.journeyVideoPreludeSource = this\.ctx\.createMediaElementSource\(media\)/, 'video audio should enter the Web Audio graph');
assert.match(app, /this\.journeyVideoPreludeGain\.connect\(this\.spatialMusicPanner\)[\s\S]*?this\.journeyVideoPreludeGain\.connect\(this\.musicEchoSend\)/, 'video audio should use the established Spatial Sound and Music Space paths');
assert.match(app, /const onSkip = \(\) => \{ void complete\('skipped', JOURNEY_VIDEO_PRELUDE_SKIP_FADE_SECONDS\); \}/, 'Skip should fade safely before continuing');
assert.match(app, /const onError = \(\) => \{ void complete\('unavailable', JOURNEY_VIDEO_PRELUDE_SKIP_FADE_SECONDS\); \}/, 'video failure should safely continue to the prepared journey');
assert.match(app, /meditation\.stop\(\);[\s\S]*?await journeyVideoPrelude\.play\(\);[\s\S]*?const deadline = Date\.now\(\)/, 'Restart should play the prelude before it waits to relaunch the journey');
assert.doesNotMatch(sw, /video\/nature-upgrade\.mp4/, 'the large prelude must not be pre-cached during PWA installation');

for (const locale of locales) {
    assert.ok(locale.ui.skipJourneyVideoPrelude?.trim(), 'each shipped locale needs the Skip label');
}

console.log('Journey video prelude contract passed.');
