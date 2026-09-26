(function installChakraSelectionView(global) {
    'use strict';

    function create({ document = global.document, state, storage = global.localStorage, updateSessionEstimate, updateJourneyRoadmap } = {}) {
        if (!document || !state || !storage || typeof updateSessionEstimate !== 'function' || typeof updateJourneyRoadmap !== 'function') {
            throw new TypeError('Chakra selection view requires document, state, storage and refresh services');
        }

        function persist() {
            state.selectedChakras = Array.from(document.querySelectorAll('#chakra-selection input:checked')).map(input => input.value);
            storage.setItem('chakra_selected', JSON.stringify(state.selectedChakras));
            updateSessionEstimate();
            updateJourneyRoadmap();
        }

        function bindPersistence() {
            document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(input => {
                input.addEventListener('change', persist);
            });
        }

        function bindChipDisplay() {
            document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(input => {
                input.addEventListener('change', () => {
                    input.closest('.checkbox-label').classList.toggle('chip-active', input.checked);
                });
                if (input.checked) input.closest('.checkbox-label').classList.add('chip-active');
            });
        }

        return Object.freeze({ persist, bindPersistence, bindChipDisplay });
    }

    global.ChakraSelectionView = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
