(function installVoiceDownloadCard(global) {
    'use strict';

    // Makes the first Piper voice download clear: size, "downloads once,
    // then works offline", Wi-Fi advice, a Download now button, a progress
    // bar with MB and percent, and a small floating pill so progress stays
    // visible on any screen (for example when a journey starts the download).
    // Piper keeps downloaded voices in the browser's private file storage
    // (OPFS folder "piper"); the card reads that to show "Downloaded".

    const MB = 1024 * 1024;
    const toMB = bytes => Math.max(1, Math.round((Number(bytes) || 0) / MB));

    function modelFileName(definition) {
        return String(definition?.modelPath || '').split('/').pop();
    }

    async function isStored(definition, navigatorRef = global.navigator) {
        const name = modelFileName(definition);
        if (!name || !navigatorRef?.storage?.getDirectory) return false;
        try {
            const root = await navigatorRef.storage.getDirectory();
            const dir = await root.getDirectoryHandle('piper');
            const file = await (await dir.getFileHandle(name)).getFile();
            const expected = Number(definition.modelSize) || 0;
            return file.size > 0 && (!expected || file.size >= expected * 0.98);
        } catch (error) {
            return false;
        }
    }

    function onMobileData(navigatorRef = global.navigator) {
        const connection = navigatorRef?.connection;
        return Boolean(connection && (connection.saveData || connection.type === 'cellular'));
    }

    function create({ document = global.document, navigator: navigatorRef = global.navigator, t, getDefinition, onDownload } = {}) {
        if (!document || typeof t !== 'function' || typeof getDefinition !== 'function') {
            throw new TypeError('Voice download card needs a document, translator and voice lookup');
        }
        const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.split(`{{${key}}}`).join(String(value)), template);
        let status = 'unknown';
        let loaded = 0;
        let total = 0;
        let refreshToken = 0;

        function card() { return document.getElementById('voice-download-card'); }

        function pill() {
            let node = document.getElementById('voice-download-pill');
            if (!node && document.body) {
                node = document.createElement('div');
                node.id = 'voice-download-pill';
                node.className = 'voice-dl-pill';
                node.setAttribute('role', 'status');
                node.setAttribute('aria-live', 'polite');
                node.hidden = true;
                document.body.append(node);
            }
            return node;
        }

        function sizeMB(definition) {
            return toMB(total || definition?.modelSize || 0);
        }

        function progressText() {
            const totalBytes = total || getDefinition()?.modelSize || 0;
            const percent = totalBytes ? Math.min(100, Math.round((loaded / totalBytes) * 100)) : 0;
            return { percent, text: fill(t('ui.voiceDlProgress'), { loaded: toMB(loaded), total: toMB(totalBytes), percent }) };
        }

        function render() {
            const root = card();
            const definition = getDefinition();
            if (root) {
                root.hidden = !definition;
                root.dataset.state = status;
                root.replaceChildren();
            }
            const floating = pill();
            if (floating) floating.hidden = status !== 'downloading';
            if (!definition) return;
            const make = (tag, className, text) => {
                const node = document.createElement(tag);
                if (className) node.className = className;
                if (text !== undefined) node.textContent = text;
                return node;
            };
            const { percent, text } = progressText();
            if (root) {
                const head = make('div', 'voice-dl-head');
                head.append(make('span', 'voice-dl-icon', status === 'stored' ? '✓' : '⬇'), make('strong', '', t('ui.voiceDlTitle')));
                root.append(head);
                if (status === 'stored') {
                    root.append(make('p', 'voice-dl-note', t('ui.voiceDlStored')));
                } else if (status === 'downloading') {
                    root.append(make('p', 'voice-dl-note', text));
                    const bar = make('div', 'voice-dl-bar');
                    bar.setAttribute('role', 'progressbar');
                    bar.setAttribute('aria-valuemin', '0');
                    bar.setAttribute('aria-valuemax', '100');
                    bar.setAttribute('aria-valuenow', String(percent));
                    const fillBar = make('span');
                    fillBar.style.width = `${percent}%`;
                    bar.append(fillBar);
                    root.append(bar, make('p', 'voice-dl-hint', t('ui.voiceDlKeepOpen')));
                } else {
                    if (status === 'failed') root.append(make('p', 'voice-dl-error', t('ui.voiceDlFailed')));
                    root.append(make('p', 'voice-dl-note', fill(t('ui.voiceDlNeeded'), { size: sizeMB(definition) })));
                    if (onMobileData(navigatorRef)) root.append(make('p', 'voice-dl-hint', t('ui.voiceDlMobileData')));
                    if (typeof onDownload === 'function') {
                        const button = make('button', 'secondary-btn voice-dl-btn', t('ui.voiceDlButton'));
                        button.type = 'button';
                        button.dataset.voiceDl = 'download';
                        button.addEventListener('click', async () => {
                            button.disabled = true;
                            status = 'downloading';
                            loaded = 0;
                            render();
                            try { await onDownload(); }
                            catch (error) { failed(); }
                        });
                        root.append(button);
                    }
                }
            }
            if (floating && status === 'downloading') {
                floating.replaceChildren(make('span', 'voice-dl-pill-text', text));
                const bar = make('span', 'voice-dl-pill-bar');
                const fillBar = make('span');
                fillBar.style.width = `${percent}%`;
                bar.append(fillBar);
                floating.append(bar);
            }
        }

        async function refresh() {
            const token = ++refreshToken;
            const definition = getDefinition();
            if (!definition) { status = 'unknown'; render(); return; }
            if (status === 'downloading') { render(); return; }
            const stored = await isStored(definition, navigatorRef);
            if (token !== refreshToken) return;
            status = stored ? 'stored' : (status === 'failed' ? 'failed' : 'needed');
            render();
        }

        function progress(nextLoaded, nextTotal) {
            loaded = Number(nextLoaded) || 0;
            total = Number(nextTotal) || 0;
            status = 'downloading';
            render();
        }

        function ready() {
            status = 'stored';
            loaded = 0;
            total = 0;
            render();
            void refresh();
        }

        function failed() {
            if (status !== 'downloading') return;
            status = 'failed';
            render();
        }

        return Object.freeze({ refresh, progress, ready, failed, get status() { return status; } });
    }

    global.ChakraVoiceDownloadCard = Object.freeze({ create, isStored, modelFileName, toMB });
})(typeof window === 'undefined' ? globalThis : window);
