(function installSessionEstimate(global) {
    'use strict';

    function estimateStandardJourneySeconds({
        scripts,
        isHighEnergy,
        isDemoScriptSelected,
        estimateNarrationDurationSeconds,
        timing,
        getDroneDurationMs,
        state,
        chakraOrder,
        localized,
        contentT,
        getMoonPhase,
        defaultIntention,
        isChecked,
        readNumber,
        getJourneySystemNarration
    }) {
        if (!scripts || isHighEnergy || isDemoScriptSelected()) return null;
        if (typeof estimateNarrationDurationSeconds !== 'function' || typeof timing !== 'function' ||
            typeof getDroneDurationMs !== 'function' || !state || !Array.isArray(chakraOrder) ||
            typeof localized !== 'function' || typeof contentT !== 'function' || typeof getMoonPhase !== 'function' ||
            typeof defaultIntention !== 'function' || typeof isChecked !== 'function' || typeof readNumber !== 'function' ||
            typeof getJourneySystemNarration !== 'function') {
            throw new TypeError('Standard journey estimate requires script, timing, duration and localization services');
        }

        const narration = (text, transition = 'none') => {
            if (!text) return 0;
            return estimateNarrationDurationSeconds(text) + (transition === 'mantra' ? 0 : timing('narration', 'exitGap'));
        };
        const tone = afterGap => {
            const sharedDuration = Math.max(1000, Math.round(
                getDroneDurationMs(state.timePerChakra, state.droneDurationMode) / 2
            ));
            const audibleToneSeconds = state.noFrequencyMode ? 0 : (sharedDuration / 1000) + 1.1;
            return timing('transitions', 'arrivalToneLeadGap') + audibleToneSeconds + afterGap;
        };
        const selected = chakraOrder.map(key => [key, scripts[key]]).filter(([, chakra]) => chakra);
        if (!selected.length) return null;

        const phase = getMoonPhase();
        const opening = state.returningJourney
            ? localized(scripts.intro, 'returning')
            : localized(scripts.intro?.moon?.[phase]) || scripts.intro?.moon?.[`${phase}_${state.language}`];
        const intention = contentT('system.intention').replace('{{intention}}', state.intention?.trim() || defaultIntention(state.language));
        let seconds = state.timeIcebreaker + timing('transitions', 'initialSettle');
        seconds += narration(contentT('system.prePracticeSafety'));
        seconds += narration(getJourneySystemNarration('arrivalInduction'));
        seconds += tone(timing('transitions', 'arrivalToneExitGap'));
        seconds += narration(opening) + timing('transitions', 'openingPause');
        seconds += narration(localized(scripts.intro, 'gratitude'));
        seconds += narration(intention);
        seconds += narration(getJourneySystemNarration('arrivalReadiness'));
        seconds += tone(timing('transitions', 'arrivalReadinessGap'));
        if (isChecked('box-breathing-experience-toggle')) seconds += state.timeBreathing * 16;
        if (isChecked('visualization-addon-toggle')) seconds += readNumber('visualization-duration', 2) * 60;
        if (isChecked('dharana-addon-toggle')) seconds += readNumber('dharana-duration', 2) * 60;
        if (isChecked('body-scan-addon-toggle')) seconds += readNumber('body-scan-duration', 5) * 60;
        if (isChecked('noting-addon-toggle')) seconds += readNumber('noting-duration', 4) * 60;
        seconds += timing('transitions', 'postBreathing');

        selected.forEach(([key, chakra], index) => {
            seconds += narration(localized(chakra, 'meditation'), 'mantra');
            seconds += Math.max(0, state.timePerChakra * 60 - timing('transitions', 'chakraLeadOut'));
            seconds += timing('transitions', 'chakraPostMantra');
            seconds += narration(localized(chakra, 'affirmation'));
            if (index < selected.length - 1) {
                const intervalNarration = narration(contentT('system.breatheInterval'));
                seconds += timing('transitions', 'intervalPreparation') + Math.max(state.timeInterval, intervalNarration);
            }
        });

        if (isChecked('hooponopono-experience-toggle')) seconds += 4 * 60;
        if (isChecked('undo-unlearn-addon-toggle')) seconds += readNumber('undo-unlearn-duration', 8) * 60;

        seconds += timing('transitions', 'finalSilence');
        seconds += narration(localized(scripts.closing));
        seconds += timing('transitions', 'closingFirstPause');
        seconds += narration(localized(scripts.closing, 'affirmation'));
        seconds += timing('transitions', 'closingSecondPause');
        seconds += timing('transitions', 'emergenceBellSettle');
        seconds += narration(getJourneySystemNarration('emergence'));
        seconds += state.timeEmergence + timing('transitions', 'emergenceFinalQuiet');
        return Math.ceil(seconds);
    }

    function resolve({
        isChecked,
        state,
        readNumber,
        countYogaPoses,
        timing,
        translate,
        isDemoScriptSelected,
        sleepStageCount
    }) {
        if (typeof isChecked !== 'function' || !state || typeof readNumber !== 'function' ||
            typeof countYogaPoses !== 'function' || typeof timing !== 'function' ||
            typeof translate !== 'function' || typeof isDemoScriptSelected !== 'function') {
            throw new TypeError('Session estimate requires current mode, duration, timing and label services');
        }

        const checked = isChecked;
        if (checked('shots-toggle')) return `~ ${state.timeShot} sec frequency shot`;
        if (checked('music-only-toggle')) return 'Music only — stop anytime';
        if (checked('box-breathing-experience-toggle')) {
            const seconds = state.timeBreathing * 16;
            return `~ ${Math.max(1, Math.ceil(seconds / 60))} min ${translate('ui.boxBreathingExperience').toLowerCase()}`;
        }
        if (checked('hooponopono-experience-toggle')) {
            return `~ 4 min ${translate('ui.hooponoponoExperience').toLowerCase()}`;
        }
        if (checked('undo-unlearn-addon-toggle')) {
            const minutes = readNumber('undo-unlearn-duration', 8);
            return `~ ${minutes} min ${translate('ui.undoUnlearnAddon').toLowerCase()}`;
        }
        if (checked('visualization-addon-toggle')) {
            const minutes = readNumber('visualization-duration', 2);
            return `~ ${minutes} min ${translate('ui.visualizationAddon').toLowerCase()}`;
        }
        if (checked('body-scan-addon-toggle')) {
            const minutes = readNumber('body-scan-duration', 5);
            return `~ ${minutes} min ${translate('ui.bodyScanAddon').toLowerCase()}`;
        }
        if (checked('noting-addon-toggle')) {
            const minutes = readNumber('noting-duration', 4);
            return `~ ${minutes} min ${translate('ui.notingAddon').toLowerCase()}`;
        }
        if (checked('perineal-care-toggle') || checked('massage-toggle') || checked('assisted-bathing-toggle')) {
            let seconds = 0;
            if (checked('perineal-care-toggle')) seconds += state.timePerinealCare;
            if (checked('massage-toggle')) {
                seconds += (7 * (state.timePerChakra + timing('estimate', 'chakraStageOverhead'))
                    + (state.timeIcebreaker / 60) + timing('estimate', 'baseOverhead') + timing('estimate', 'normalExtra')) * 60;
            }
            if (checked('assisted-bathing-toggle')) seconds += state.timeAssistedBathing;
            return `~ ${Math.max(1, Math.ceil(seconds / 60))} min ${translate('ui.intimateService').toLowerCase()}`;
        }
        if (checked('yoga-experience-toggle')) {
            let seconds = state.timeYogaPrep + countYogaPoses() * (state.timeYogaPose + timing('estimate', 'yogaPoseTransitionEstimate'));
            if (checked('corpse-pose-toggle')) seconds += state.timeCorpse;
            if (checked('bath-session-toggle')) seconds += state.timeBath + timing('transitions', 'bathToYogaRest');
            return `~ ${Math.max(1, Math.ceil(seconds / 60))} min ${translate('ui.yogaExperience').toLowerCase()}`;
        }
        if (checked('sleep-mode-toggle')) {
            return `~ ${Math.round(state.timeSleepStage * sleepStageCount)} min sleep journey`;
        }

        const isHigh = checked('high-energy-toggle');
        const overhead = timing('estimate', 'baseOverhead');
        const hypnosisWrapperMinutes = !isHigh && !isDemoScriptSelected()
            ? (state.timeEmergence / 60) + (timing('estimate', 'hypnosisTransitionToneSeconds') / 60) + (timing('estimate', 'hypnosisNarrationSeconds') / 60)
            : 0;
        const addonMinutes = isHigh ? 0
            : (checked('box-breathing-experience-toggle') ? (state.timeBreathing * 16) / 60 : 0)
                + (checked('visualization-addon-toggle') ? readNumber('visualization-duration', 2) : 0)
                + (checked('dharana-addon-toggle') ? readNumber('dharana-duration', 2) : 0)
                + (checked('body-scan-addon-toggle') ? readNumber('body-scan-duration', 5) : 0)
                + (checked('noting-addon-toggle') ? readNumber('noting-duration', 4) : 0)
                + (checked('hooponopono-experience-toggle') ? 4 : 0)
                + (checked('undo-unlearn-addon-toggle') ? readNumber('undo-unlearn-duration', 8) : 0);
        const estimate = isHigh
            ? Math.round(state.timeHighEnergy + (state.timeIcebreaker / 60) + timing('estimate', 'highEnergyExtra'))
            : Math.round(state.selectedChakras.length * (state.timePerChakra + timing('estimate', 'chakraStageOverhead'))
                + (state.timeIcebreaker / 60) + overhead + timing('estimate', 'normalExtra') + hypnosisWrapperMinutes + addonMinutes);
        return `~ ${estimate} min session`;
    }

    global.ChakraSessionEstimate = Object.freeze({ resolve, estimateStandardJourneySeconds });
})(typeof window === 'undefined' ? globalThis : window);
