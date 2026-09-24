(function installYogaExperienceSettings(global) {
    'use strict';

    function read(document) {
        if (!document) throw new TypeError('Yoga experience settings require a document');
        return {
            corpsePoseEnabled: document.getElementById('corpse-pose-toggle')?.checked === true,
            bathSessionEnabled: document.getElementById('bath-session-toggle')?.checked === true,
            selectedYogaPoses: Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).map(input => input.value)
        };
    }

    function persist({ document, state, storage }) {
        if (!state || !storage || typeof storage.setItem !== 'function') {
            throw new TypeError('Yoga experience settings require state and storage services');
        }
        const selection = read(document);
        Object.assign(state, selection);
        storage.setItem('chakra_corpse_enabled', state.corpsePoseEnabled);
        storage.setItem('chakra_bath_enabled', state.bathSessionEnabled);
        storage.setItem('chakra_yoga_selected', JSON.stringify(state.selectedYogaPoses));
        return selection;
    }

    function syncTimingRows({ document, getChecked }) {
        if (!document || typeof getChecked !== 'function') {
            throw new TypeError('Yoga experience settings require document and selection services');
        }
        const toggleDisplay = (id, show) => {
            const element = document.getElementById(id);
            if (element) element.style.display = show ? '' : 'none';
        };

        const bathToggle = document.getElementById('bath-session-toggle');
        if (bathToggle) {
            bathToggle.disabled = false;
            bathToggle.setAttribute('aria-disabled', 'false');
        }
        toggleDisplay('row-breathing', false);
        toggleDisplay('row-corpse', getChecked('corpse-pose-toggle'));
        toggleDisplay('row-yoga-prep', true);
        toggleDisplay('row-yoga-pose', true);
        toggleDisplay('row-bath', getChecked('bath-session-toggle'));

        const yogaSubOptions = document.getElementById('yoga-sub-options');
        if (yogaSubOptions) yogaSubOptions.style.display = 'flex';
    }

    global.ChakraYogaExperienceSettings = Object.freeze({ read, persist, syncTimingRows });
})(typeof window === 'undefined' ? globalThis : window);
