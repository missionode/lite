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
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS = 8/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS = 1\.2/);
assert.match(css, /\.journey-video-prelude\.is-leaving,[\s\S]*?\.journey-video-prelude\.is-leaving video\s*\{[\s\S]*?transition-duration:\s*8s/, 'the video and its full-screen stage should dissolve together over an unhurried eight seconds');
assert.match(html, /id="settings-vol-video"[^>]*min="0\.02"[^>]*max="0\.5"[\s\S]*?id="preview-video-audio"/, 'Settings should provide a safe dedicated Video Volume control and preview action');
assert.match(app, /volVideo: clampAudioLevel\(storedNumber\('chakra_vol_video', 0\.20\), 0\.02, 0\.5, 0\.20\)/, 'Video Volume should persist independently in local storage');
assert.match(app, /class JourneyVideoPrelude[\s\S]*?async previewAudio\(\)[\s\S]*?this\.audio\.fadeJourneyVideoPrelude\(state\.volVideo, 0\.25\)[\s\S]*?const onPlay = \(\) => \{[\s\S]*?const playback = this\.media\.play\(\)[\s\S]*?fadeJourneyVideoPrelude\(state\.volVideo, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS\)/, 'preview and actual video playback should use the independent Video Volume');
assert.doesNotMatch(app, /fadeJourneyVideoPrelude\(state\.volMusic, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS\)/, 'video playback must not follow the background Music Volume');
assert.match(app, /this\.fullscreenTarget = document\.getElementById\('app'\)[\s\S]*?enterFullscreen\(\) \{[\s\S]*?this\.fullscreenTarget\.requestFullscreen\(\{ navigationUI: 'hide' \}\)[\s\S]*?const onPlay = \(\) => \{[\s\S]*?this\.enterFullscreen\(\);[\s\S]*?this\.media\.play\(\)/, 'the explicit Play action should make the persistent app container fullscreen before it starts playback');
assert.doesNotMatch(app, /this\.media\.pause\(\);[\s\S]{0,250}this\.exitFullscreen\(\);[\s\S]{0,250}this\.overlay\.classList\.remove/, 'the prelude should not leave fullscreen during the video-to-journey handoff');
assert.match(app, /showScreen\(returnScreen\);\s*journeyVideoPrelude\.exitFullscreen\(\);/, 'an explicit Stop should return the app to its normal viewport');
assert.match(app, /document\.getElementById\('close-completion'\)\.addEventListener\('click', \(\) => \{[\s\S]*?showScreen\(lobbyScreen\);\s*journeyVideoPrelude\.exitFullscreen\(\);/, 'returning from completion should also leave fullscreen before the Lobby is shown');
assert.match(app, /this\.media\.pause\(\);[\s\S]*?this\.audio\.fadeJourneyVideoPrelude\(0, 0\);/, 'the ready screen should leave the video paused and silent before Play');
assert.match(app, /this\.journeyVideoPreludeSource = this\.ctx\.createMediaElementSource\(media\)/, 'video audio should enter the Web Audio graph');
assert.match(app, /this\.journeyVideoPreludeGain\.connect\(this\.spatialMusicPanner\)[\s\S]*?this\.journeyVideoPreludeGain\.connect\(this\.musicEchoSend\)/, 'video audio should use the established Spatial Sound and Music Space paths');
assert.doesNotMatch(app, /onSkip|skipButton|JOURNEY_VIDEO_PRELUDE_SKIP/, 'the implementation should not retain an automatic skip path');
assert.match(app, /const onError = \(\) => \{ void complete\('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS\); \}/, 'video failure should safely continue to the prepared journey');
assert.match(app, /document\.getElementById\('restart-meditation'\)\?\.addEventListener\('click', async \(\) => \{[\s\S]*?meditation\.stop\(\{ preserveScreen: true \}\);[\s\S]*?const preludeResult = await journeyVideoPrelude\.play\(\);[\s\S]*?if \(preludeResult === 'ended'\) meditation\.acknowledgeDndReminder\(\);[\s\S]*?const deadline = Date\.now\(\)/, 'restart should preserve the active screen behind the prelude and acknowledge the reminder before relaunching the journey');
assert.match(app, /class MeditationController[\s\S]*?stop\(\{ preserveScreen = false \} = \{\}\)[\s\S]*?if \(!preserveScreen\) \{\s*showScreen\(returnScreen\);\s*journeyVideoPrelude\.exitFullscreen\(\);\s*\}/, 'the meditation stop path should keep the active screen and fullscreen state in place only during a restart');
assert.match(app, /const DND_REMINDER_FALLBACK = "Before we begin:[\s\S]*?showDndReminderIfNeeded\(\) \{[\s\S]*?if \(this\.dndReminderAcknowledged\)[\s\S]*?this\.dndReminderAcknowledged = false;[\s\S]*?const reminder = t\('ui\.journeyVideoPreludeReminder'\);[\s\S]*?alert\(reminder === 'ui\.journeyVideoPreludeReminder' \? DND_REMINDER_FALLBACK : reminder\);/, 'the reminder should be consumed once after a completed video while normal starts retain a human-readable fallback');
assert.doesNotMatch(sw, /video\/nature-upgrade\.mp4/, 'the large prelude must not be pre-cached during PWA installation');
assert.match(css, /#app:fullscreen\s*\{[\s\S]*?max-width:\s*none[\s\S]*?min-height:\s*100dvh/, 'the persistent fullscreen app should not retain the normal narrow Lobby width');
assert.match(html, /id="fullscreen-controls-reveal-zone"/, 'fullscreen should provide a dedicated bottom-edge reveal zone');
assert.match(app, /document\.addEventListener\('fullscreenchange', this\.syncFullscreenJourneyChrome\)[\s\S]*?syncFullscreenJourneyChrome\(\) \{[\s\S]*?document\.body\.classList\.toggle\('journey-fullscreen-active', isJourneyFullscreen\)/, 'the app should explicitly track whether its persistent container is fullscreen');
assert.match(app, /this\.revealZone\?\.addEventListener\('pointerenter', \(\) => this\.setFullscreenChromeVisible\(true\)\)[\s\S]*?scheduleFullscreenChromeHide\(\)/, 'the bottom edge should explicitly reveal then hide fullscreen controls');
assert.match(css, /body\.journey-fullscreen-active #controls:not\(\.hidden\),[\s\S]*?body\.journey-fullscreen-active #session-countdown-layer[\s\S]*?opacity:\s*0[\s\S]*?body\.journey-fullscreen-active\.fullscreen-controls-visible #controls:not\(\.hidden\),[\s\S]*?body\.journey-fullscreen-active\.fullscreen-controls-visible #session-countdown-layer[\s\S]*?opacity:\s*1/, 'fullscreen journey controls and top timers should remain hidden unless the explicit reveal state is active');

for (const locale of locales) {
    assert.ok(locale.ui.journeyVideoPreludeReminder?.trim(), 'each shipped locale needs the interruption reminder');
    assert.ok(locale.ui.playJourneyVideoPrelude?.trim(), 'each shipped locale needs the explicit Play label');
    assert.ok(locale.ui.musicVideoVolume?.trim(), 'each shipped locale needs the shared Music / Video Volume label');
}

assert.match(app, /function journeyT\(path\) \{\s*return t\(path, state\.language\);\s*\}/, 'journey labels should resolve against Meditation Language rather than Display Language');
assert.match(app, /tutTitle\.textContent = journeyT\('ui\.preparation'\);/, 'the Preparation stage should use the narrated language');
assert.match(app, /journeyT\('ui\.moon'\)[\s\S]*?journeyT\('ui\.gratitude'\)[\s\S]*?journeyT\('ui\.intention'\)/, 'all reflective journey headings should use the narrated language');
assert.match(app, /journeyT\('ui\.corpsePose'\)[\s\S]*?journeyT\('ui\.purification'\)[\s\S]*?journeyT\('ui\.guideReadyForNextSession'\)[\s\S]*?journeyT\('ui\.yoga'\)/, 'focused in-journey titles should use the narrated language');

console.log('Journey video prelude contract passed.');
