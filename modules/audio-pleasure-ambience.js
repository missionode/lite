(function installAudioPleasureAmbience(global) {
    'use strict';

    function create(dependencies) {
        const {
            state, fetchAudio, storage, SeamlessLoop, syncControl, warn,
            normalizeUrl, intensityProfile, clampGain, blurMix, constants
        } = dependencies;

        function scheduleSpatialApproach(owner, fromCurrent = false) {
            if (!owner.ctx || !owner.spatialPleasurePanner || !owner.pleasureSpatialPosition) return;
            const now = owner.ctx.currentTime;
            const position = owner.pleasureSpatialPosition;
            const isSpatial = owner.spatialMode !== 'off';
            const profile = intensityProfile();
            const approachSeconds = profile.approachSeconds;

            if (owner.spatialPleasurePanner.positionZ) {
                const nearZ = Number(position.nearZ ?? position.z) * profile.nearDistanceMultiplier;
                const param = owner.spatialPleasurePanner.positionZ;
                if (fromCurrent && param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
                else { param.cancelScheduledValues(now); param.setValueAtTime(fromCurrent ? param.value : Number(position.z), now); }
                param.linearRampToValueAtTime(isSpatial ? nearZ : -1, now + (isSpatial ? approachSeconds : 1.2));
            } else if (owner.pleasureSpatialDepthGain) {
                const target = isSpatial ? profile.fallbackNearGain : 1;
                const param = owner.pleasureSpatialDepthGain.gain;
                if (fromCurrent && param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
                else { param.cancelScheduledValues(now); param.setValueAtTime(fromCurrent ? param.value : constants.spatialFallbackFarGain, now); }
                param.linearRampToValueAtTime(target, now + (isSpatial ? approachSeconds : 1.2));
            }
        }

        async function loadBuffers(owner) {
            const customUrl = normalizeUrl(state.pleasureAmbienceUrl);
            const manifestKey = customUrl || 'manifest-primary';
            if (owner.pleasureManifest && owner.pleasureManifestKey === manifestKey) return owner.pleasureBuffers;

            const response = await fetchAudio(constants.manifestUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status} - Failed to fetch ${constants.manifestUrl}`);
            const manifest = await response.json();
            const entries = Array.isArray(manifest) ? manifest : manifest?.files;
            if (!Array.isArray(entries)) throw new Error('Pleasure ambience manifest has no files array');
            const manifestPaths = entries
                .map(entry => typeof entry === 'string' ? entry.trim() : '')
                .map(entry => entry.replace(/^\.\/?/, '').replace(/^audio\//i, ''))
                .filter(entry => /^pleasure(?:-\d+)?\.[^./]+$/i.test(entry))
                .map(entry => `audio/${entry}`);
            const serialPaths = manifestPaths.filter(path => !/^audio\/pleasure\.[^./]+$/i.test(path));
            const paths = customUrl ? [customUrl, ...serialPaths] : manifestPaths;
            owner.pleasureManifest = [...new Set(paths)];
            owner.pleasureManifestKey = manifestKey;
            if (!owner.pleasureManifest.length) throw new Error('Pleasure ambience manifest contains no valid audio files');

            try {
                await Promise.all(owner.pleasureManifest.map(async path => {
                    if (owner.pleasureBuffers.has(path)) return;
                    try {
                        const assetResponse = await fetchAudio(path, { cache: 'no-store' });
                        if (!assetResponse.ok) throw new Error(`HTTP ${assetResponse.status}`);
                        const arrayBuffer = await assetResponse.arrayBuffer();
                        const buffer = await owner.ctx.decodeAudioData(arrayBuffer);
                        if (buffer) owner.pleasureBuffers.set(path, buffer);
                    } catch (error) {
                        if (path === customUrl) throw new Error(`Unable to load the pleasure ambience URL (${error.message})`);
                        if (error?.message !== 'HTTP 404') warn(`[Pleasure Ambience] skipped ${path}:`, error);
                    }
                }));
            } catch (error) {
                owner.pleasureManifest = null;
                owner.pleasureManifestKey = null;
                owner.pleasureBuffers.clear();
                throw error;
            }
            if (!owner.pleasureBuffers.size) throw new Error('No pleasure ambience files could be decoded');
            return owner.pleasureBuffers;
        }

        async function loadUrl(owner, url) {
            const rawUrl = String(url ?? '').trim();
            const normalizedUrl = normalizeUrl(rawUrl);
            if (rawUrl && !normalizedUrl) throw new Error('Please enter a valid HTTP or HTTPS audio URL.');
            const previousUrl = state.pleasureAmbienceUrl;
            const previousAmbienceEnabled = state.moodRelaxationIntentionEnabled;
            const shouldRestart = previousAmbienceEnabled && owner.ctx && !state.noFrequencyMode;
            owner.stopPleasureAmbience();
            owner.pleasureManifest = null;
            owner.pleasureManifestKey = null;
            owner.pleasureBuffers.clear();
            owner.pleasureAudioAvailable = null;
            state.pleasureAmbienceUrl = normalizedUrl;
            try {
                if (!owner.isInitialized) await owner.init();
                await owner.loadPleasureAmbienceBuffers();
                owner.pleasureAudioAvailable = true;
                if (normalizedUrl) storage.setItem(constants.urlStorageKey, normalizedUrl);
                else storage.removeItem(constants.urlStorageKey);
                syncControl();
                if (shouldRestart) {
                    const started = await owner.startPleasureAmbience();
                    if (!started) throw new Error('The pleasure ambience could not start. Check the URL and its CORS permissions.');
                }
                return normalizedUrl;
            } catch (error) {
                state.pleasureAmbienceUrl = previousUrl;
                if (previousUrl) storage.setItem(constants.urlStorageKey, previousUrl);
                else storage.removeItem(constants.urlStorageKey);
                owner.stopPleasureAmbience();
                owner.pleasureManifest = null;
                owner.pleasureManifestKey = null;
                owner.pleasureBuffers.clear();
                owner.pleasureAudioAvailable = null;
                state.moodRelaxationIntentionEnabled = previousAmbienceEnabled;
                if (shouldRestart) {
                    try {
                        await owner.loadPleasureAmbienceBuffers();
                        owner.pleasureAudioAvailable = true;
                        await owner.startPleasureAmbience();
                    } catch (restoreError) {
                        owner.pleasureAudioAvailable = false;
                        warn('[Pleasure Ambience] previous source could not be restored:', restoreError);
                    }
                }
                syncControl();
                throw error;
            }
        }

        async function start(owner) {
            if (!state.moodRelaxationIntentionEnabled || state.noFrequencyMode || !owner.ctx || !owner.pleasureGain) return false;
            if (owner.pleasureAudioAvailable === false) return false;
            if (owner.pleasureLoops.some(loop => loop.isRunning)) {
                owner.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
                return true;
            }
            const generation = ++owner.pleasureGeneration;
            try {
                await owner.loadPleasureAmbienceBuffers();
                owner.pleasureAudioAvailable = true;
                syncControl();
                if (generation !== owner.pleasureGeneration || !state.moodRelaxationIntentionEnabled || state.noFrequencyMode) return false;
                owner.pleasureLoops = [...owner.pleasureBuffers.values()].map(buffer => {
                    const loop = new SeamlessLoop(owner.ctx, buffer, owner.pleasureSourceGain, 1.0, constants.fadeSeconds);
                    loop.start();
                    return loop;
                });
                owner.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
                return owner.pleasureLoops.length > 0;
            } catch (error) {
                if (generation === owner.pleasureGeneration) {
                    owner.pleasureAudioAvailable = false;
                    syncControl();
                    warn('[Pleasure Ambience] audio could not start:', error);
                }
                return false;
            }
        }

        function stop(owner, fadeTime = constants.fadeSeconds) {
            owner.setConvolverActive('pleasure', owner.pleasureBlurFilter, owner.pleasureBlurConvolver, owner.pleasureBlurWetGain, false, Math.max(0, fadeTime) + 1);
            owner.pleasureGeneration += 1;
            owner.pleasureLoops.forEach(loop => loop.stop(Math.max(0, fadeTime)));
            owner.pleasureLoops = [];
            owner.pleasureManifest = null;
            owner.pleasureManifestKey = null;
            owner.pleasureBuffers.clear();
        }

        function setGain(owner, gain) {
            const level = clampGain(gain);
            if (!owner.ctx || !owner.pleasureGain || !owner.pleasureEnhancerGain) return level;
            const profile = intensityProfile();
            const now = owner.ctx.currentTime;
            for (const [param, target] of [
                [owner.pleasureGain.gain, level],
                [owner.pleasureEnhancerGain.gain, level * profile.harmonicMix]
            ]) {
                param.cancelScheduledValues(now);
                param.setValueAtTime(param.value, now);
                param.linearRampToValueAtTime(target, now + 0.5);
            }
            return level;
        }

        function setBlur(owner, enabled) {
            const blurEnabled = Boolean(enabled);
            if (!owner.ctx || !owner.pleasureBlurDryGain || !owner.pleasureBlurWetGain) return blurEnabled;
            const profile = intensityProfile();
            const mix = blurMix(blurEnabled);
            const now = owner.ctx.currentTime;
            owner.setConvolverActive('pleasure', owner.pleasureBlurFilter, owner.pleasureBlurConvolver, owner.pleasureBlurWetGain,
                mix.wet > 0 && owner.pleasureLoops.some(loop => loop.isRunning), 2.2);
            if (owner.pleasureBlurFilter) {
                const param = owner.pleasureBlurFilter.frequency;
                param.cancelScheduledValues(now);
                param.setValueAtTime(param.value, now);
                param.linearRampToValueAtTime(profile.blurCutoff, now + 1.2);
            }
            for (const [param, target] of [
                [owner.pleasureBlurDryGain.gain, mix.dry],
                [owner.pleasureBlurWetGain.gain, mix.wet]
            ]) {
                param.cancelScheduledValues(now);
                param.setValueAtTime(param.value, now);
                param.linearRampToValueAtTime(target, now + 1.2);
            }
            return blurEnabled;
        }

        function setIntensity(owner, intensity) {
            state.pleasureAmbienceIntensity = dependencies.normalizeIntensity(intensity);
            owner.setPleasureAmbienceGain(state.pleasureAmbienceGain);
            owner.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
            if (owner.pleasureLoops.some(loop => loop.isRunning)) scheduleSpatialApproach(owner);
            return state.pleasureAmbienceIntensity;
        }

        return Object.freeze({ scheduleSpatialApproach, loadBuffers, loadUrl, start, stop, setGain, setBlur, setIntensity });
    }

    global.ChakraAudioPleasureAmbience = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
