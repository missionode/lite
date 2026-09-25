(function installJourneyRoadmap(global) {
    'use strict';

    function resolveLabels({ state, isChecked, translate }) {
        if (!state || typeof isChecked !== 'function' || typeof translate !== 'function') {
            throw new TypeError('Journey roadmap requires state, selection and translation services');
        }
        const withOptionalVideo = labels => state.journeyVideoPreludeEnabled
            ? [translate('ui.roadmapVideoIntroduction'), ...labels]
            : labels;
        if (isChecked('music-only-toggle')) return withOptionalVideo([translate('ui.roadmapMusicOnly')]);

        if (isChecked('perineal-care-toggle') || isChecked('massage-toggle') || isChecked('assisted-bathing-toggle')) {
            const labels = [];
            if (isChecked('perineal-care-toggle')) labels.push(translate('ui.roadmapPerineal'));
            if (isChecked('massage-toggle')) labels.push(translate('ui.roadmapMassageReverse'));
            if (isChecked('assisted-bathing-toggle')) labels.push(translate('ui.roadmapAssistedBathing'));
            return withOptionalVideo(labels);
        }

        if (isChecked('yoga-experience-toggle')) {
            const labels = [];
            if (isChecked('corpse-pose-toggle')) labels.push(translate('ui.roadmapCorpse'));
            if (isChecked('bath-session-toggle')) {
                labels.push(translate('ui.roadmapBath'));
                labels.push(translate('ui.roadmapRestBeforeYoga'));
            }
            labels.push(translate('ui.roadmapYoga'));
            return withOptionalVideo(labels);
        }

        if (isChecked('sleep-mode-toggle')) {
            return withOptionalVideo([
                translate('ui.roadmapSleep'), translate('ui.roadmapDrowsiness'), translate('ui.roadmapLightSleep'),
                translate('ui.roadmapTrueSleep'), translate('ui.roadmapDeepSleep'), translate('ui.roadmapRemRest')
            ]);
        }

        if (isChecked('high-energy-toggle')) {
            return withOptionalVideo([translate('ui.roadmapIntention'), translate('ui.roadmapHrim'), translate('ui.roadmapClosing')]);
        }

        if (state.selectedChakras.length === 0) {
            const standalone = [];
            if (isChecked('box-breathing-experience-toggle')) standalone.push(translate('ui.roadmapBoxBreathing'));
            if (isChecked('visualization-addon-toggle')) standalone.push(translate('ui.roadmapVisualization'));
            if (isChecked('dharana-addon-toggle')) standalone.push(translate('ui.roadmapDharana'));
            if (isChecked('body-scan-addon-toggle')) standalone.push(translate('ui.roadmapBodyScan'));
            if (isChecked('noting-addon-toggle')) standalone.push(translate('ui.roadmapNoting'));
            if (isChecked('hooponopono-experience-toggle')) standalone.push(translate('ui.roadmapHooponopono'));
            if (isChecked('undo-unlearn-addon-toggle')) standalone.push(translate('ui.roadmapUndoUnlearn'));
            if (standalone.length) return withOptionalVideo(standalone);
        }

        const labels = [
            translate(state.returningJourney ? 'ui.roadmapReturning' : 'ui.roadmapArrival'),
            translate('ui.roadmapIntention'),
            translate('ui.roadmapChakras')
        ];
        if (isChecked('box-breathing-experience-toggle')) labels.splice(0, 0, translate('ui.roadmapBoxBreathing'));
        let preparationIndex = isChecked('box-breathing-experience-toggle') ? 1 : 0;
        if (isChecked('visualization-addon-toggle')) labels.splice(preparationIndex++, 0, translate('ui.roadmapVisualization'));
        if (isChecked('dharana-addon-toggle')) labels.splice(preparationIndex++, 0, translate('ui.roadmapDharana'));
        if (isChecked('body-scan-addon-toggle')) labels.splice(preparationIndex, 0, translate('ui.roadmapBodyScan'));
        if (isChecked('body-scan-addon-toggle')) preparationIndex++;
        if (isChecked('noting-addon-toggle')) labels.splice(preparationIndex, 0, translate('ui.roadmapNoting'));
        if (isChecked('hooponopono-experience-toggle')) labels.push(translate('ui.roadmapHooponopono'));
        if (isChecked('undo-unlearn-addon-toggle')) labels.push(translate('ui.roadmapUndoUnlearn'));
        labels.push(translate('ui.roadmapClosing'));
        return withOptionalVideo(labels);
    }

    function render({ document, state, isChecked, translate }) {
        if (!document || typeof document.getElementById !== 'function') {
            throw new TypeError('Journey roadmap requires a document');
        }
        const roadmap = document.getElementById('journey-roadmap');
        if (!roadmap) return false;
        roadmap.textContent = resolveLabels({ state, isChecked, translate }).join(' » ');
        return true;
    }

    global.ChakraJourneyRoadmap = Object.freeze({ resolveLabels, render });
})(typeof window === 'undefined' ? globalThis : window);
