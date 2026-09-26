(function installPracticeModuleLoader(global) {
    'use strict';

    const manifest = Object.freeze({
        'body-scan': Object.freeze({ src: './modules/body-scan-practice.js?v=1.0', globalName: 'ChakraBodyScanPractice' }),
        'guided-noting': Object.freeze({ src: './modules/guided-noting-practice.js?v=1.0', globalName: 'ChakraGuidedNotingPractice' }),
        dharana: Object.freeze({ src: './modules/dharana-practice.js?v=1.0', globalName: 'ChakraDharanaPractice' }),
        'box-breathing': Object.freeze({ src: './modules/box-breathing-practice.js?v=1.0', globalName: 'ChakraBoxBreathingPractice' }),
        visualization: Object.freeze({ src: './modules/visualization-practice.js?v=1.0', globalName: 'ChakraVisualizationPractice' }),
        hooponopono: Object.freeze({ src: './modules/hooponopono-practice.js?v=1.0', globalName: 'ChakraHooponoponoPractice' }),
        'undo-unlearn': Object.freeze({ src: './modules/undo-unlearn-practice.js?v=1.0', globalName: 'ChakraUndoUnlearnPractice' })
    });
    const pending = new Map();
    const selectionOrder = Object.freeze([
        Object.freeze(['body-scan-addon-toggle', 'body-scan']),
        Object.freeze(['noting-addon-toggle', 'guided-noting']),
        Object.freeze(['dharana-addon-toggle', 'dharana']),
        Object.freeze(['box-breathing-experience-toggle', 'box-breathing']),
        Object.freeze(['visualization-addon-toggle', 'visualization']),
        Object.freeze(['hooponopono-experience-toggle', 'hooponopono']),
        Object.freeze(['undo-unlearn-addon-toggle', 'undo-unlearn'])
    ]);

    function selectedModuleIds(isChecked) {
        if (typeof isChecked !== 'function') throw new TypeError('Practice selection requires a toggle reader');
        return selectionOrder.filter(([toggleId]) => isChecked(toggleId)).map(([, moduleId]) => moduleId);
    }

    function load(id) {
        const entry = manifest[id];
        if (!entry) return Promise.reject(new RangeError(`Unknown guided practice module: ${id}`));
        const current = global[entry.globalName];
        if (current) return Promise.resolve(current);
        if (pending.has(id)) return pending.get(id);

        let script;
        const promise = new Promise((resolve, reject) => {
            if (!global.document?.createElement || !global.document.head?.appendChild) {
                reject(new Error(`Cannot load guided practice module: ${id}`));
                return;
            }
            script = global.document.createElement('script');
            script.async = true;
            script.src = new URL(entry.src, global.document.baseURI).href;
            script.onload = () => {
                const api = global[entry.globalName];
                if (api) resolve(api);
                else reject(new Error(`Guided practice module did not register: ${id}`));
            };
            script.onerror = () => reject(new Error(`Guided practice module failed to load: ${id}`));
            global.document.head.appendChild(script);
        }).catch(error => {
            if (script?.parentNode) script.parentNode.removeChild(script);
            pending.delete(id);
            throw error;
        });

        pending.set(id, promise);
        return promise;
    }

    function loadMany(ids) {
        if (!Array.isArray(ids)) return Promise.reject(new TypeError('Guided practice module IDs must be an array'));
        return Promise.all([...new Set(ids)].map(load));
    }

    global.ChakraPracticeModuleLoader = Object.freeze({ load, loadMany, selectedModuleIds, moduleIds: Object.freeze(Object.keys(manifest)) });
})(typeof window === 'undefined' ? globalThis : window);
