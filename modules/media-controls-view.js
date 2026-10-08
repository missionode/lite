(function installMediaControlsView(global) {
    'use strict';

    function bindVoicePreviewButtons({ document = global.document, testVoice } = {}) {
        if (!document || typeof testVoice !== 'function') {
            throw new TypeError('Voice preview buttons require document and preview service');
        }
        document.getElementById('test-voice')?.addEventListener('click', testVoice);
        document.getElementById('mixer-voice-preview')?.addEventListener('click', testVoice);
    }

    function renderVoiceStatus(document, message, tone = 'muted') {
        const status = document?.getElementById('voice-status');
        if (!status) return;
        status.textContent = message || '';
        status.style.display = message ? 'block' : 'none';
        status.style.color = tone === 'error' ? '#f87171' : tone === 'ready' ? '#4ade80' : '#ffa500';
    }

    function bind({
        document = global.document,
        navigator = global.navigator,
        MediaMetadataCtor = global.MediaMetadata,
        audio,
        meditation,
        loadJourneyVideoPrelude,
        logger = global.console
    } = {}) {
        if (!document || !audio || !meditation || typeof loadJourneyVideoPrelude !== 'function') {
            throw new TypeError('Media controls require document, audio, meditation and video-prelude services');
        }

        document.getElementById('preview-video-audio')?.addEventListener('click', () => {
            void loadJourneyVideoPrelude()
                .then(prelude => prelude.previewAudio())
                .catch(error => logger.warn('Video audio preview unavailable:', error));
        });
        // Lobby: play the video introduction on its own with the same prelude. Its
        // full-screen overlay closes back to the Lobby when the video ends.
        const playIntroduction = document.getElementById('play-video-introduction');
        playIntroduction?.addEventListener('click', () => {
            if (playIntroduction.disabled) return;
            playIntroduction.disabled = true;
            void loadJourneyVideoPrelude()
                .then(prelude => prelude.play())
                .catch(error => logger.warn('Video introduction unavailable:', error))
                .finally(() => { playIntroduction.disabled = false; });
        });
        document.getElementById('preview-visualization-ambience')?.addEventListener('click', () => {
            void audio.previewVisualizationAmbience();
        });

        if (navigator && 'mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadataCtor({
                title: 'Chakra Meditation', artist: 'Mahakatha Vibe',
                artwork: [
                    { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
                ]
            });
            navigator.mediaSession.setActionHandler('play', () => { if (meditation.isPaused) meditation.togglePause(); });
            navigator.mediaSession.setActionHandler('pause', () => { if (!meditation.isPaused) meditation.togglePause(); });
            navigator.mediaSession.setActionHandler('stop', () => meditation.stop());
        }
    }

    global.ChakraMediaControlsView = Object.freeze({ bind, bindVoicePreviewButtons, renderVoiceStatus });
})(typeof window === 'undefined' ? globalThis : window);
