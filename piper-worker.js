let piperModulePromise = null;
let activeVoiceId = null;
let sessionPromise = null;
let cancelledRequests = new Set();

function loadPiper() {
    if (!piperModulePromise) {
        piperModulePromise = import('./piper/runtime/piper-tts-web.js');
    }
    return piperModulePromise;
}

function reportProgress(requestId, progress) {
    self.postMessage({
        type: 'progress',
        requestId,
        url: progress?.url || '',
        loaded: progress?.loaded || 0,
        total: progress?.total || 0
    });
}

async function getSession(voiceId, requestId, voiceDefinition = {}) {
    if (!voiceId) throw new Error('Piper voice is required.');
    if (activeVoiceId && activeVoiceId !== voiceId) {
        throw new Error('Piper worker voice changed; restart the worker.');
    }
    if (!sessionPromise) {
        activeVoiceId = voiceId;
        const piper = await loadPiper();
        sessionPromise = piper.TtsSession.create({
            voiceId,
            modelPath: voiceDefinition.modelPath,
            configPath: voiceDefinition.configPath,
            phonemizerVoice: voiceDefinition.phonemizerVoice,
            progress: (progress) => reportProgress(requestId, progress)
        });
    }
    await sessionPromise;
    return { piper: await loadPiper(), session: await sessionPromise };
}

self.onmessage = async (event) => {
    const message = event.data || {};
    const { type, requestId, voiceId, voiceDefinition } = message;

    if (type === 'cancel') {
        if (requestId) cancelledRequests.add(requestId);
        return;
    }

    try {
        if (type === 'warmup') {
            await getSession(voiceId, requestId, voiceDefinition);
            self.postMessage({ type: 'ready', requestId, voiceId });
            return;
        }

        if (type === 'synthesize') {
            if (!message.text || !message.text.trim()) {
                self.postMessage({ type: 'audio', requestId, audio: null });
                return;
            }
            const { session } = await getSession(voiceId, requestId, voiceDefinition);
            if (cancelledRequests.has(requestId)) {
                cancelledRequests.delete(requestId);
                return;
            }
            const audio = await session.predict(message.text, message.settings || {});
            if (cancelledRequests.has(requestId)) {
                cancelledRequests.delete(requestId);
                return;
            }
            self.postMessage({ type: 'audio', requestId, voiceId, audio });
            return;
        }

        self.postMessage({ type: 'error', requestId, error: `Unknown Piper worker message: ${type}` });
    } catch (error) {
        self.postMessage({
            type: 'error',
            requestId,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
