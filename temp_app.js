function attachEventListeners() {
    languageSelect.addEventListener('change', (e) => { state.language = e.target.value; autoSelectVoice(); });
    const eyesSelect = document.getElementById('eyes-mode-select');
    if (eyesSelect) {
        eyesSelect.addEventListener('change', (e) => { state.eyesMode = e.target.value; });
    }
    voiceSelect.addEventListener('change', (e) => { state.voiceName = e.target.value; });
    testVoiceBtn.addEventListener('click', testVoice);
    saveConfigBtn.addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('#chakra-selection input:checked')).map(cb => cb.value);
        if (checked.length === 0) { alert("Please select at least one chakra."); return; }
        state.selectedChakras = checked;
        localStorage.setItem('chakra_selected', JSON.stringify(state.selectedChakras));
        localStorage.setItem('chakra_lang', state.language);
        state.eyesMode = document.getElementById('eyes-mode-select').value;
        localStorage.setItem('chakra_eyes_mode', state.eyesMode);
        state.voiceName = voiceSelect.value;
        localStorage.setItem('chakra_voice', state.voiceName);
        state.audioFilters = getChecked('audio-filters-toggle');
        state.reverseJourney = getChecked('reverse-journey-toggle');
        state.boxMeditation = getChecked('box-meditation-toggle');
        state.hooponopono = getChecked('hooponopono-toggle');
        state.chakraFrequencies = getChecked('frequencies-toggle');
        const selectedDeity = document.querySelector('input[name="deity-path"]:checked');
        state.deityPath = selectedDeity ? selectedDeity.value : 'none';
        
        localStorage.setItem('chakra_audio_filters', state.audioFilters);
        localStorage.setItem('chakra_reverse_journey', state.reverseJourney);
        localStorage.setItem('chakra_box_meditation', state.boxMeditation);
        localStorage.setItem('chakra_hooponopono', state.hooponopono);
        localStorage.setItem('chakra_frequencies', state.chakraFrequencies);
        localStorage.setItem('chakra_deity_path', state.deityPath);
        localStorage.setItem('chakra_configured', 'true');
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
        aura.style.opacity = '1';
    });
    function updateSessionEstimate() {
        const isHigh = getChecked('high-energy-toggle');
        const hasBox = getChecked('box-meditation-toggle');
        const hasHooponopono = getChecked('hooponopono-toggle');
        
        let overhead = 5; // base overhead (gratitude, corpse, silence, etc)
        if (hasBox) overhead += 4; // box breathing cycles + narration
        if (hasHooponopono) overhead += 3; // 3 cycles + intro/outro
        
        const estimate = isHigh
            ? Math.round(state.timePerChakra + (state.timeIcebreaker / 60) + (state.timeCorpse / 60) + overhead + 3) 
            : Math.round(state.selectedChakras.length * (state.timePerChakra + 2) + (state.timeIcebreaker / 60) + (state.timeCorpse / 60) + overhead + 7);
        setText('session-estimate', `~ ${estimate} min session`);
    }

    // Timing Sliders Listeners
    document.getElementById('time-icebreaker').addEventListener('input', (e) => {
        state.timeIcebreaker = parseInt(e.target.value);
        setText('display-icebreaker', state.timeIcebreaker + 's');
        localStorage.setItem('chakra_time_icebreaker', state.timeIcebreaker);
        updateSessionEstimate();
    });
    document.getElementById('time-breathing').addEventListener('input', (e) => {
        state.timeBreathing = parseInt(e.target.value);
        setText('display-breathing', state.timeBreathing + 's');
        localStorage.setItem('chakra_time_breathing', state.timeBreathing);
        updateSessionEstimate();
    });
    document.getElementById('time-corpse').addEventListener('input', (e) => {
        state.timeCorpse = parseInt(e.target.value);
        setText('display-corpse', state.timeCorpse + 's');
        localStorage.setItem('chakra_time_corpse', state.timeCorpse);
        updateSessionEstimate();
    });
    document.getElementById('time-interval').addEventListener('input', (e) => {
        state.timeInterval = parseInt(e.target.value);
        setText('display-interval', state.timeInterval + 's');
        localStorage.setItem('chakra_time_interval', state.timeInterval);
        updateSessionEstimate();
    });

    timeSlider.addEventListener('input', (e) => {
        state.timePerChakra = parseFloat(e.target.value);
        timeDisplay.textContent = `${state.timePerChakra.toFixed(1)} mins`;
        localStorage.setItem('chakra_time', state.timePerChakra);
        const pct = ((e.target.value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1) + '%';
        e.target.style.setProperty('--range-fill', pct);
        updateSessionEstimate();
    });

    document.getElementById('high-energy-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('box-meditation-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('hooponopono-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('reverse-journey-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('frequencies-toggle').addEventListener('change', updateSessionEstimate);
    openSettingsBtn.addEventListener('click', () => showScreen(configScreen));

    startMeditationBtn.addEventListener('click', () => {
        let order = [...state.selectedChakras];
        if (state.reverseJourney) order.reverse();
        meditation.chakraOrder = order;
        // Apply sleep mode dim class at session start
        if (state.sleepMode) document.body.classList.add('sleep-mode-active');
        // Absolute Grounding: Dim UI for Eyes Closed mode
        if (state.eyesMode === 'closed') {
            const app = document.getElementById('app');
            if (app) app.style.opacity = "0.2";
        }
        meditation.start();
    });    document.getElementById('pause-meditation').addEventListener('click', () => meditation.togglePause());
    document.getElementById('stop-meditation').addEventListener('click', () => meditation.stop());
    document.getElementById('close-completion').addEventListener('click', () => {
        document.getElementById('completion-modal').classList.add('hidden');
        showScreen(lobbyScreen);
    });

    // Intention input
    document.getElementById('intention-input').addEventListener('input', (e) => {
        state.intention = e.target.value;
        localStorage.setItem('chakra_intention', state.intention);
    });

    // Sleep mode toggle
    document.getElementById('sleep-mode-toggle').addEventListener('change', (e) => {
        state.sleepMode = e.target.checked;
        localStorage.setItem('chakra_sleep_mode', state.sleepMode);
    });

    // Journal save
    document.getElementById('save-journal').addEventListener('click', () => {
        const entryEl = document.getElementById('journal-entry');
        const entry = entryEl ? entryEl.value.trim() : "";
        if (!entry) return;
        const entries = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
        entries.unshift({ date: new Date().toLocaleDateString(), text: entry });
        localStorage.setItem('chakra_journal', JSON.stringify(entries.slice(0, 50)));
        syncValue('journal-entry', '');
        const info = document.getElementById('last-journal-info');
        if (info) {
            info.textContent = state.language === 'ml' ? '✓ സൂക്ഷിച്ചു' : '✓ Saved';
            setTimeout(() => {
                const saved = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
                info.textContent = saved.length > 0
                    ? (state.language === 'ml' ? 'അവസാന നമ്പർ: ' : 'Last entry: ') + saved[0].date
                    : '';
            }, 2000);
        }
    });
    const mixer = document.getElementById('volume-mixer');
    document.getElementById('btn-mixer').addEventListener('click', () => mixer.classList.toggle('hidden'));
    document.getElementById('close-mixer').addEventListener('click', () => mixer.classList.add('hidden'));
    // Unified Volume Handlers
    const syncVolume = (key, value, elements) => {
        state[key] = parseFloat(value);
        localStorage.setItem(`chakra_${key.replace('vol', 'vol_').toLowerCase()}`, state[key]);
        elements.forEach(el => { if (el) el.value = value; });
    };

    // Voice
    const volVoiceEls = [document.getElementById('vol-voice'), document.getElementById('settings-vol-voice')];
    volVoiceEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volVoice', e.target.value, volVoiceEls);
    }));

    // Drone
    const volDroneEls = [document.getElementById('vol-drone'), document.getElementById('settings-vol-drone')];
    volDroneEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volDrone', e.target.value, volDroneEls);
        if (audio.masterGain) audio.masterGain.gain.setValueAtTime(state.volDrone, audio.ctx.currentTime);
    }));

    // Bell
    const volBellEls = [document.getElementById('vol-bell'), document.getElementById('settings-vol-bell')];
    volBellEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volBell', e.target.value, volBellEls);
        if (audio.bellGain) audio.bellGain.gain.setValueAtTime(state.volBell, audio.ctx.currentTime);
    }));

    // Mantra
    const volMantraEls = [document.getElementById('vol-mantra'), document.getElementById('settings-vol-mantra')];
    volMantraEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volMantra', e.target.value, volMantraEls);
        if (audio.mantraGain && audio.mantraLoop) {
            audio.mantraGain.gain.setValueAtTime(state.volMantra, audio.ctx.currentTime);
        }
    }));

    // Music
    const volMusicEls = [document.getElementById('vol-music'), document.getElementById('settings-vol-music')];
    volMusicEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volMusic', e.target.value, volMusicEls);
        if (audio.bgMusicGain && audio.bgMusicLoop) {
            // Note: fadeIn/fadeOut and ducking logic will use the new state.volMusic on their next trigger
            // For immediate feedback during play:
            audio.bgMusicGain.gain.setValueAtTime(state.volMusic, audio.ctx.currentTime);
        }
    }));
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Chakra Meditation', artist: 'Mahakatha Vibe',
            artwork: [
                { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
            ]
        });
        navigator.mediaSession.setActionHandler('play', () => { if (meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('pause', () => { if (!meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('stop', () => meditation.stop());
    }
    document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            cb.closest('.checkbox-label').classList.toggle('chip-active', cb.checked);
        });
        // Set initial state
        if (cb.checked) cb.closest('.checkbox-label').classList.add('chip-active');
    });

    // Initial estimate on load
    updateSessionEstimate();
} // Closes attachEventListeners

init();
