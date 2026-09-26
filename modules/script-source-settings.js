(function installScriptSourceSettings(global) {
    'use strict';

    function getDemoCoreDurationMinutes(script, scriptId, durationSeconds) {
        const metadata = script?._demo;
        return metadata?.id === scriptId && Number(metadata.recommendedCoreDurationSeconds) === durationSeconds
            ? durationSeconds / 60 : null;
    }

    function getDemoTimingMessage(translate, key, fallback) {
        const message = translate(key);
        return message === key ? fallback : message;
    }

    function isDemoScriptSelected(state, scriptId, durationSeconds) {
        return state?.scriptSource === 'custom'
            && getDemoCoreDurationMinutes(state.customScript, scriptId, durationSeconds) !== null;
    }

    function bindSourceSelection({
        document,
        state,
        storage,
        isDemoScriptSelected,
        applyDemoCoreDurationPreset,
        restorePreDemoCoreDuration,
        updateSessionEstimate,
        meditation
    }) {
        if (!document || typeof document.getElementById !== 'function') throw new TypeError('Script source settings require a document');
        if (!state) throw new TypeError('Script source settings require app state');
        if (!storage || typeof storage.setItem !== 'function') throw new TypeError('Script source settings require storage');
        for (const [name, fn] of Object.entries({ isDemoScriptSelected, applyDemoCoreDurationPreset, restorePreDemoCoreDuration, updateSessionEstimate })) {
            if (typeof fn !== 'function') throw new TypeError(`Script source settings require ${name}`);
        }
        if (!meditation) throw new TypeError('Script source settings require the meditation controller');

        const sourceSelect = document.getElementById('script-source-select');
        if (!sourceSelect || typeof sourceSelect.addEventListener !== 'function') return false;

        sourceSelect.addEventListener('change', event => {
            state.scriptSource = event.target.value;
            if (isDemoScriptSelected()) applyDemoCoreDurationPreset();
            else restorePreDemoCoreDuration();
            updateSessionEstimate();

            const customScriptUI = document.getElementById('custom-script-ui');
            if (customScriptUI) customScriptUI.style.display = state.scriptSource === 'custom' ? 'flex' : 'none';
            storage.setItem('chakra_script_source', state.scriptSource);
            meditation.scripts = null;
        });
        return true;
    }

    function bindUpload({
        document,
        state,
        storage,
        meditation,
        FileReaderCtor = global.FileReader,
        validateScriptBundle,
        getChecked,
        applyDemoCoreDurationPreset,
        restorePreDemoCoreDuration,
        updateSessionEstimate,
        getDemoScriptTimingMessage
    }) {
        if (!document || typeof document.getElementById !== 'function') throw new TypeError('Script upload requires a document');
        if (!state) throw new TypeError('Script upload requires app state');
        if (!storage || typeof storage.setItem !== 'function') throw new TypeError('Script upload requires storage');
        if (!meditation) throw new TypeError('Script upload requires the meditation controller');
        if (typeof FileReaderCtor !== 'function') throw new TypeError('Script upload requires FileReader');
        for (const [name, fn] of Object.entries({ validateScriptBundle, getChecked, applyDemoCoreDurationPreset, restorePreDemoCoreDuration, updateSessionEstimate, getDemoScriptTimingMessage })) {
            if (typeof fn !== 'function') throw new TypeError(`Script upload requires ${name}`);
        }

        const uploadInput = document.getElementById('upload-script-file');
        const scriptStatus = document.getElementById('script-status');
        if (!uploadInput || typeof uploadInput.addEventListener !== 'function') return false;

        uploadInput.addEventListener('change', event => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReaderCtor();
            reader.onload = loadEvent => {
                try {
                    const json = JSON.parse(loadEvent.target.result);
                    const check = validateScriptBundle(json, {
                        allowLanguageFallback: true,
                        highEnergy: getChecked('high-energy-toggle'),
                        corpse: getChecked('corpse-pose-toggle'),
                        bath: false,
                        perinealCare: false,
                        assistedBathing: false,
                        massage: false,
                        yoga: false
                    });
                    if (!check.valid) throw new Error(`Missing required sections: ${check.missing.slice(0, 3).join(', ')}`);
                    state.customScript = json;
                    storage.setItem('chakra_custom_script', JSON.stringify(json));
                    const isDemo = applyDemoCoreDurationPreset();
                    if (!isDemo) restorePreDemoCoreDuration();
                    updateSessionEstimate();
                    if (scriptStatus) {
                        scriptStatus.textContent = isDemo ? getDemoScriptTimingMessage() : 'Script uploaded successfully!';
                        scriptStatus.style.display = 'block';
                        scriptStatus.style.background = 'rgba(74, 222, 128, 0.2)';
                        scriptStatus.style.color = '#4ade80';
                    }
                    meditation.scripts = null;
                } catch (error) {
                    if (scriptStatus) {
                        scriptStatus.textContent = 'Error: Invalid JSON file.';
                        scriptStatus.style.display = 'block';
                        scriptStatus.style.background = 'rgba(248, 113, 113, 0.2)';
                        scriptStatus.style.color = '#f87171';
                    }
                }
            };
            reader.readAsText(file);
        });
        return true;
    }

    function bindUrlFetch({
        document,
        state,
        storage,
        meditation,
        fetchImpl = global.fetch,
        validateScriptBundle,
        getChecked,
        applyDemoCoreDurationPreset,
        restorePreDemoCoreDuration,
        updateSessionEstimate,
        getDemoScriptTimingMessage
    }) {
        if (!document || typeof document.getElementById !== 'function') throw new TypeError('Script URL loading requires a document');
        if (!state) throw new TypeError('Script URL loading requires app state');
        if (!storage || typeof storage.setItem !== 'function') throw new TypeError('Script URL loading requires storage');
        if (!meditation) throw new TypeError('Script URL loading requires the meditation controller');
        if (typeof fetchImpl !== 'function') throw new TypeError('Script URL loading requires fetch');
        for (const [name, fn] of Object.entries({ validateScriptBundle, getChecked, applyDemoCoreDurationPreset, restorePreDemoCoreDuration, updateSessionEstimate, getDemoScriptTimingMessage })) {
            if (typeof fn !== 'function') throw new TypeError(`Script URL loading requires ${name}`);
        }

        const urlInput = document.getElementById('script-url-input');
        const loadButton = document.getElementById('load-script-url');
        const scriptStatus = document.getElementById('script-status');
        if (!loadButton || typeof loadButton.addEventListener !== 'function') return false;

        let latestRequest = 0;
        loadButton.addEventListener('click', async () => {
            const url = urlInput?.value?.trim();
            if (!url) return;
            const requestId = ++latestRequest;

            if (scriptStatus) {
                scriptStatus.textContent = 'Loading script from URL...';
                scriptStatus.style.display = 'block';
                scriptStatus.style.background = 'rgba(255, 255, 255, 0.1)';
                scriptStatus.style.color = 'white';
            }

            try {
                const response = await fetchImpl(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const json = await response.json();
                if (requestId !== latestRequest) return;
                const check = validateScriptBundle(json, {
                    allowLanguageFallback: true,
                    highEnergy: getChecked('high-energy-toggle'),
                    corpse: getChecked('corpse-pose-toggle'),
                    bath: false,
                    perinealCare: false,
                    assistedBathing: false,
                    massage: false,
                    yoga: false
                });
                if (!check.valid) throw new Error(`Missing required sections: ${check.missing.slice(0, 3).join(', ')}`);
                if (requestId !== latestRequest) return;

                storage.setItem('chakra_custom_script', JSON.stringify(json));
                state.customScript = json;
                const isDemo = applyDemoCoreDurationPreset();
                if (!isDemo) restorePreDemoCoreDuration();
                updateSessionEstimate();
                if (scriptStatus) {
                    scriptStatus.textContent = isDemo ? getDemoScriptTimingMessage() : 'Script loaded from URL successfully!';
                    scriptStatus.style.background = 'rgba(74, 222, 128, 0.2)';
                    scriptStatus.style.color = '#4ade80';
                }
                meditation.scripts = null;
            } catch (error) {
                if (requestId !== latestRequest) return;
                if (scriptStatus) {
                    scriptStatus.textContent = `Error: ${error.message}`;
                    scriptStatus.style.background = 'rgba(248, 113, 113, 0.2)';
                    scriptStatus.style.color = '#f87171';
                }
            }
        });
        return true;
    }

    global.ChakraScriptSourceSettings = Object.freeze({
        bindSourceSelection, bindUpload, bindUrlFetch,
        getDemoCoreDurationMinutes, getDemoTimingMessage, isDemoScriptSelected
    });
})(typeof window === 'undefined' ? globalThis : window);
