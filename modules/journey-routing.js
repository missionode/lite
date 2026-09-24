(function installJourneyRouting(global) {
    'use strict';

    const MASSAGE_CHAKRA_ORDER = Object.freeze([
        'crown', 'thirdeye', 'throat', 'heart', 'solar', 'sacral', 'root'
    ]);
    const PREPARATION_STAGE_ORDER = Object.freeze([
        'box', 'visualization', 'dharana', 'bodyScan', 'noting'
    ]);

    function resolveFocusedExperience({
        yogaSelected = false,
        intimateSelected = false,
        selectedChakraCount = 0,
        preparationSelected = false
    } = {}) {
        if (yogaSelected) return 'yoga';
        if (intimateSelected) return 'intimate';
        if (selectedChakraCount === 0 && preparationSelected) return 'preparation';
        return null;
    }

    function resolveLaunchRoute({
        shotsSelected = false,
        backgroundMusicMode = false,
        sleepSelected = false
    } = {}) {
        if (shotsSelected) return 'shot';
        if (backgroundMusicMode) return 'music';
        if (sleepSelected) return 'sleep';
        return 'guided';
    }

    function validateLobbyStart({
        route = 'guided',
        highEnergySelected = false,
        focusedExperience = null,
        selectedChakraCount = 0
    } = {}) {
        const valid = route !== 'guided' || highEnergySelected || Boolean(focusedExperience) || selectedChakraCount > 0;
        return Object.freeze({ valid, reason: valid ? null : 'chakra-required' });
    }

    function buildChakraOrder({
        focusedExperience = null,
        massageSelected = false,
        selectedChakras = []
    } = {}) {
        if (focusedExperience === 'intimate' && massageSelected) return [...MASSAGE_CHAKRA_ORDER];
        return Array.isArray(selectedChakras) ? [...selectedChakras] : [];
    }

    function buildPreparationStagePlan({
        highEnergy = false,
        box = false,
        visualization = false,
        dharana = false,
        bodyScan = false,
        noting = false
    } = {}) {
        if (highEnergy) return [];
        const selected = { box, visualization, dharana, bodyScan, noting };
        return PREPARATION_STAGE_ORDER.filter(stage => selected[stage]);
    }

    async function executePreparationStages(stages, runners, shouldContinue) {
        if (!Array.isArray(stages) || !runners || typeof runners !== 'object' || typeof shouldContinue !== 'function') {
            throw new TypeError('Preparation execution requires a stage list, runners and a continuation guard');
        }
        for (const stage of stages) {
            if (!shouldContinue()) return false;
            if (typeof runners[stage] !== 'function') throw new Error(`No preparation runner is registered for: ${stage}`);
            await runners[stage]();
        }
        return true;
    }

    global.ChakraJourneyRouting = Object.freeze({
        resolveFocusedExperience,
        resolveLaunchRoute,
        validateLobbyStart,
        buildChakraOrder,
        buildPreparationStagePlan,
        executePreparationStages,
        MASSAGE_CHAKRA_ORDER,
        PREPARATION_STAGE_ORDER
    });
})(typeof window === 'undefined' ? globalThis : window);
