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
assert.match(html, /id="journey-video-prelude"[\s\S]*?id="journey-video-prelude-media"[^>]*preload="auto"[^>]*playsinline[\s\S]*?src="video\/nature-upgrade\.mp4"/, 'the prelude should use the supplied video in a preloaded, inline mobile-safe player');
assert.match(html, /id="journey-video-prelude-ready"[\s\S]*?data-i18n="ui\.journeyVideoPreludeReminder"[\s\S]*?id="play-journey-video-prelude"[\s\S]*?data-i18n="ui\.playJourneyVideoPrelude"/, 'the prelude should show the interruption reminder and wait for an explicit localized Play control');
assert.doesNotMatch(html, /skip-journey-video-prelude/, 'the prelude should not offer a skip path once the guide begins it');
assert.match(css, /\.journey-video-prelude\s*\{[\s\S]*?position:\s*fixed[\s\S]*?inset:\s*0[\s\S]*?z-index:\s*100100/, 'the video prelude should fill the application viewport');
assert.match(css, /\.journey-video-prelude video\s*\{[\s\S]*?object-fit:\s*contain[\s\S]*?background:\s*#000[\s\S]*?transition:\s*opacity 2\.4s/, 'the video should preserve its entire frame with a cinematic black letterbox and gradual visual entry');
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS = 2\.4/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS = 3/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS = 1\.2/);
assert.match(app, /class JourneyVideoPrelude[\s\S]*?this\.playButton = document\.getElementById\('play-journey-video-prelude'\)[\s\S]*?const onPlay = \(\) => \{[\s\S]*?const playback = this\.media\.play\(\)[\s\S]*?fadeJourneyVideoPrelude\(state\.volMusic, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS\)/, 'video and its audio should begin only from the explicit Play action, at the guide-selected music level');
assert.match(app, /enterFullscreen\(\) \{[\s\S]*?this\.overlay\.requestFullscreen\(\{ navigationUI: 'hide' \}\)[\s\S]*?const onPlay = \(\) => \{[\s\S]*?this\.enterFullscreen\(\);[\s\S]*?this\.media\.play\(\)/, 'the explicit Play action should request full screen before it starts playback');
assert.match(app, /this\.exitFullscreen\(\);[\s\S]*?this\.overlay\.classList\.remove/, 'the application should return to its normal viewport before the journey continues');
assert.match(app, /this\.media\.pause\(\);[\s\S]*?this\.audio\.fadeJourneyVideoPrelude\(0, 0\);/, 'the ready screen should leave the video paused and silent before Play');
assert.match(app, /this\.journeyVideoPreludeSource = this\.ctx\.createMediaElementSource\(media\)/, 'video audio should enter the Web Audio graph');
assert.match(app, /this\.journeyVideoPreludeGain\.connect\(this\.spatialMusicPanner\)[\s\S]*?this\.journeyVideoPreludeGain\.connect\(this\.musicEchoSend\)/, 'video audio should use the established Spatial Sound and Music Space paths');
assert.doesNotMatch(app, /onSkip|skipButton|JOURNEY_VIDEO_PRELUDE_SKIP/, 'the implementation should not retain an automatic skip path');
assert.match(app, /const onError = \(\) => \{ void complete\('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS\); \}/, 'video failure should safely continue to the prepared journey');
assert.match(app, /meditation\.stop\(\);[\s\S]*?await journeyVideoPrelude\.play\(\);[\s\S]*?const deadline = Date\.now\(\)/, 'Restart should play the prelude before it waits to relaunch the journey');
assert.doesNotMatch(sw, /video\/nature-upgrade\.mp4/, 'the large prelude must not be pre-cached during PWA installation');

for (const locale of locales) {
    assert.ok(locale.ui.journeyVideoPreludeReminder?.trim(), 'each shipped locale needs the interruption reminder');
    assert.ok(locale.ui.playJourneyVideoPrelude?.trim(), 'each shipped locale needs the explicit Play label');
    assert.ok(locale.ui.musicVideoVolume?.trim(), 'each shipped locale needs the shared Music / Video Volume label');
}

console.log('Journey video prelude contract passed.');
