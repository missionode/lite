import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const locales = ['en', 'ml', 'ru', 'hi'].map(language =>
    JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'))
);

assert.ok(fs.statSync(new URL('../video/generate.mp4', import.meta.url)).size > 0, 'the generated compressed prelude video should exist');
assert.ok(fs.statSync(new URL('../video/meditator.png', import.meta.url)).size > 0, 'the supplied meditator image should exist');
assert.match(html, /id="journey-video-prelude"[\s\S]*?class="journey-video-prelude-meditator"[^>]*src="video\/meditator\.png"/, 'the meditator image should lead the prelude');
assert.match(html, /id="journey-video-prelude"[\s\S]*?id="journey-video-prelude-media"[^>]*preload="auto"[^>]*playsinline[\s\S]*?src="video\/generate\.mp4"[^>]*type="video\/mp4"/, 'generate.mp4 should be the sole prelude video source');
assert.match(html, /id="journey-video-prelude-ready"[\s\S]*?data-i18n="ui\.journeyVideoPreludeReminder"[\s\S]*?data-i18n="ui\.journeyVideoPreludeLoading"[\s\S]*?id="play-journey-video-prelude"[\s\S]*?data-i18n="ui\.playJourneyVideoPrelude"/, 'the prelude should show the interruption reminder, loading status, and explicit localized Play control');
assert.doesNotMatch(html, /skip-journey-video-prelude/, 'the prelude should not offer a skip path once the guide begins it');
assert.match(css, /\.journey-video-prelude\s*\{[\s\S]*?position:\s*fixed[\s\S]*?inset:\s*0[\s\S]*?z-index:\s*100100/, 'the video prelude should fill the application viewport');
assert.match(css, /\.journey-video-prelude video\s*\{[\s\S]*?object-fit:\s*contain[\s\S]*?aspect-ratio:\s*16 \/ 9[\s\S]*?background:\s*#000[\s\S]*?transition:\s*opacity 2\.4s/, 'the video should preserve the complete original proportion with cinematic letterboxing');
assert.match(css, /#app:fullscreen\s*\{[\s\S]*?height:\s*100vh[\s\S]*?min-height:\s*100vh/, 'fullscreen should use a stable viewport height');
assert.match(css, /#app:fullscreen \.journey-video-prelude\s*\{[\s\S]*?width:\s*100%[\s\S]*?height:\s*100%/, 'the prelude should fill the stable fullscreen container');
assert.match(css, /\.journey-video-prelude\.is-playing \.journey-video-prelude-ready[\s\S]*?backdrop-filter:\s*none[\s\S]*?box-shadow:\s*none/, 'playback should remove expensive loading-card compositing');
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS = 2\.4/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS = 0\.25/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS = 1\.2/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_MEDITATOR_HOLD_SECONDS = 3/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_BUFFER_MIN_SECONDS = 4/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS = 8/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_BUFFER_STABILITY_MS = 750/);
assert.match(app, /getVideoBufferTargetSeconds\(\)[\s\S]*?effectiveType[\s\S]*?downlink/, 'the prelude should adapt its initial buffer target to connection conditions');
assert.match(app, /async bufferVideoToSafePoint\(\)[\s\S]*?readyState < HTMLMediaElement\.HAVE_FUTURE_DATA[\s\S]*?getBufferedAheadSeconds\(\)[\s\S]*?JOURNEY_VIDEO_PRELUDE_BUFFER_STABILITY_MS/, 'the prelude should wait for a measured stable initial buffer');
assert.match(app, /Slow first-use delivery is not a media failure[\s\S]*?setTimeout\(\(\) => finish\(true\), 90000\)/, 'buffer timeout must not silently skip the video prelude');
assert.match(app, /getBufferedAheadSeconds\(\)[\s\S]*?JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS|JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS[\s\S]*?getBufferedAheadSeconds\(\)/, 'the prelude should define a playback rebuffer safety threshold');
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS = 2/);
assert.match(app, /const JOURNEY_VIDEO_PRELUDE_RESUME_BUFFER_SECONDS = 4/);
assert.match(app, /isWaitingForBuffer[\s\S]*?JOURNEY_VIDEO_PRELUDE_RESUME_BUFFER_SECONDS/, 'the prelude should resume only after a meaningful recovery buffer');
assert.match(app, /remaining <= JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS\) return/, 'short clips should not enter impossible end-of-video recovery');
assert.match(app, /addEventListener\('waiting', onWaiting\)[\s\S]*?addEventListener\('stalled', onWaiting\)/, 'native media stalls should enter the recovery path');
assert.match(app, /this\.playButton\.hidden = true[\s\S]*?bufferVideoToSafePoint\(\)\.then[\s\S]*?this\.playButton\.hidden = false/, 'the Begin control should appear only after the safe buffer is ready');
assert.match(app, /bufferCountdownTimer[\s\S]*?getVideoBufferTargetSeconds\(\)[\s\S]*?getBufferedAheadSeconds\(\)/, 'the prelude should show a live buffer countdown while loading');
assert.match(css, /\.journey-video-prelude\.is-playing,[\s\S]*?cursor: none/, 'the pointer should be hidden during cinematic playback');
assert.match(app, /is-meditator[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?is-video/, 'the meditator image should dissolve into the video after a short hold');
assert.match(app, /this\.media\?\.load\(\)/, 'the supplied video should be explicitly prepared for native buffering');
assert.match(css, /\.journey-video-prelude\.is-meditator \.journey-video-prelude-meditator[\s\S]*?opacity: 1[\s\S]*?\.journey-video-prelude\.is-video \.journey-video-prelude-meditator[\s\S]*?opacity: 0/, 'the image-to-video transition should crossfade cleanly');
assert.match(css, /\.journey-video-prelude\.is-leaving[\s\S]*?transition-duration:\s*0\.25s/, 'the short prelude should dissolve only across its final 0.25 seconds');
assert.match(html, /id="settings-vol-video"[^>]*min="0\.02"[^>]*max="0\.5"[\s\S]*?id="preview-video-audio"/, 'Settings should provide a safe dedicated Video Volume control and preview action');
assert.match(app, /volVideo: clampAudioLevel\(storedNumber\('chakra_vol_video', 0\.20\), 0\.02, 0\.5, 0\.20\)/, 'Video Volume should persist independently in local storage');
assert.match(app, /class JourneyVideoPrelude[\s\S]*?async previewAudio\(\)[\s\S]*?this\.audio\.fadeJourneyVideoPrelude\(state\.volVideo, 0\.25\)[\s\S]*?const onPlay = \(\) => \{[\s\S]*?const playback = this\.media\.play\(\)[\s\S]*?fadeJourneyVideoPrelude\(state\.volVideo, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS\)/, 'preview and actual video playback should use the independent Video Volume');
assert.doesNotMatch(app, /fadeJourneyVideoPrelude\(state\.volMusic, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS\)/, 'video playback must not follow the background Music Volume');
assert.doesNotMatch(app, /requestFullscreen\(|webkitEnterFullscreen/, 'the prelude should not trigger automatic fullscreen');
assert.match(app, /restart-meditation'\)\?\.addEventListener\('click', async \(\) => \{[\s\S]*?meditation\.stop\(\{ preserveScreen: true \}\)/, 'Restart should prepare the prelude without entering fullscreen');
assert.doesNotMatch(app, /this\.media\.pause\(\);[\s\S]{0,250}this\.exitFullscreen\(\);[\s\S]{0,250}this\.overlay\.classList\.remove/, 'the prelude should not leave fullscreen during the video-to-journey handoff');
assert.doesNotMatch(app, /journeyVideoPrelude\.exitFullscreen\(\)/, 'the app should not exit user-controlled fullscreen');
assert.match(app, /this\.media\.pause\(\);[\s\S]*?this\.audio\.fadeJourneyVideoPrelude\(0, 0\);/, 'the ready screen should leave the video paused and silent before Play');
assert.match(app, /this\.journeyVideoPreludeSource = this\.ctx\.createMediaElementSource\(media\)/, 'video audio should enter the Web Audio graph');
assert.match(app, /this\.journeyVideoPreludeGain\.connect\(this\.spatialMusicPanner\)[\s\S]*?this\.journeyVideoPreludeGain\.connect\(this\.musicEchoSend\)/, 'video audio should use the established Spatial Sound and Music Space paths');
assert.doesNotMatch(app, /onSkip|skipButton|JOURNEY_VIDEO_PRELUDE_SKIP/, 'the implementation should not retain an automatic skip path');
assert.match(app, /const onError = \(\) => \{ void complete\('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS\); \}/, 'video failure should safely continue to the prepared journey');
assert.match(app, /document\.getElementById\('restart-meditation'\)\?\.addEventListener\('click', async \(\) => \{[\s\S]*?meditation\.stop\(\{ preserveScreen: true \}\);[\s\S]*?const preludeResult = await journeyVideoPrelude\.play\(\);[\s\S]*?if \(preludeResult === 'ended'\) meditation\.acknowledgeDndReminder\(\);[\s\S]*?const deadline = Date\.now\(\)/, 'restart should preserve the active screen behind the prelude and acknowledge the reminder before relaunching the journey');
assert.match(app, /class MeditationController[\s\S]*?stop\(\{ preserveScreen = false \} = \{\}\)[\s\S]*?if \(!preserveScreen\) \{\s*showScreen\(returnScreen\);/, 'the meditation stop path should keep the active screen in place only during a restart');
assert.match(app, /const DND_REMINDER_FALLBACK = "Before we begin:[\s\S]*?showDndReminderIfNeeded\(\) \{[\s\S]*?if \(this\.dndReminderAcknowledged\)[\s\S]*?this\.dndReminderAcknowledged = false;[\s\S]*?const reminder = t\('ui\.journeyVideoPreludeReminder'\);[\s\S]*?alert\(reminder === 'ui\.journeyVideoPreludeReminder' \? DND_REMINDER_FALLBACK : reminder\);/, 'the reminder should be consumed once after a completed video while normal starts retain a human-readable fallback');
assert.doesNotMatch(sw, /video\/nature-upgrade\.mp4/, 'the large prelude must not be pre-cached during PWA installation');
assert.match(css, /#app:fullscreen\s*\{[\s\S]*?max-width:\s*none[\s\S]*?min-height:\s*100dvh/, 'the persistent fullscreen app should not retain the normal narrow Lobby width');
assert.match(html, /id="fullscreen-controls-reveal-zone"/, 'fullscreen should provide a dedicated bottom-edge reveal zone');
assert.match(app, /document\.addEventListener\('fullscreenchange', this\.syncFullscreenJourneyChrome\)[\s\S]*?syncFullscreenJourneyChrome\(\) \{[\s\S]*?document\.body\.classList\.toggle\('journey-fullscreen-active', isJourneyFullscreen\)/, 'the app should explicitly track whether its persistent container is fullscreen');
assert.match(app, /this\.revealZone\?\.addEventListener\('pointerenter',[\s\S]*?setFullscreenChromeVisible\(true\)/, 'bottom edge hover reveals journey controls');
assert.match(css, /body\.journey-controls-active #controls:not\(\.hidden\),[\s\S]*?body\.journey-fullscreen-active #session-countdown-layer[\s\S]*?opacity:\s*0[\s\S]*?body\.journey-controls-active\.fullscreen-controls-visible #controls:not\(\.hidden\),[\s\S]*?body\.journey-fullscreen-active\.fullscreen-controls-visible #session-countdown-layer[\s\S]*?opacity:\s*1/, 'fullscreen journey controls and top timers should remain hidden unless the explicit reveal state is active');

for (const locale of locales) {
    assert.ok(locale.ui.journeyVideoPreludeReminder?.trim(), 'each shipped locale needs the interruption reminder');
    assert.ok(locale.ui.journeyVideoPreludeLoading?.trim(), 'each shipped locale needs the video loading status');
    assert.ok(locale.ui.playJourneyVideoPrelude?.trim(), 'each shipped locale needs the explicit Play label');
    assert.ok(locale.ui.musicVideoVolume?.trim(), 'each shipped locale needs the shared Music / Video Volume label');
}

assert.match(app, /function journeyT\(path\) \{\s*return t\(path, state\.language\);\s*\}/, 'journey labels should resolve against Meditation Language rather than Display Language');
assert.match(app, /tutTitle\.textContent = journeyT\('ui\.preparation'\);/, 'the Preparation stage should use the narrated language');
assert.match(app, /journeyT\('ui\.moon'\)[\s\S]*?journeyT\('ui\.gratitude'\)[\s\S]*?journeyT\('ui\.intention'\)/, 'all reflective journey headings should use the narrated language');
assert.match(app, /journeyT\('ui\.corpsePose'\)[\s\S]*?journeyT\('ui\.purification'\)[\s\S]*?journeyT\('ui\.guideReadyForNextSession'\)[\s\S]*?journeyT\('ui\.yoga'\)/, 'focused in-journey titles should use the narrated language');

console.log('Journey video prelude contract passed.');
