# Screen and control inventory

Source snapshot: feature/voice-sleep-images on feature/heavenly-voice (production 3c78247) · 2026-10-03.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [47](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:47) | select | language-select | ml: Malayalam; en: English |
| [55](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:55) | select | display-language-select | en: English; ml: Malayalam |
| [63](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:63) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [69](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:69) | button | test-voice |  |
| [74](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:74) | input | no-frequency-mode-toggle | type=checkbox |
| [75](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:75) | input | no-mantra-mode-toggle | type=checkbox |
| [80](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:80) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [91](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:91) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [92](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:92) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [96](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:96) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [97](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:97) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [104](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:104) | input | corpse-pose-toggle | type=checkbox |
| [107](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:107) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [108](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:108) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [109](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:109) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [110](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:110) | input | balasana | type=checkbox · value=balasana |
| [111](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:111) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [117](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:117) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [122](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:122) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [127](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:127) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [130](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:130) | input | bath-session-toggle | type=checkbox |
| [133](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:133) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [145](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:145) | input | deity-path | type=radio · value=none |
| [146](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:146) | input | deity-path | type=radio · value=shakthi |
| [147](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:147) | input | deity-path | type=radio · value=shiva |
| [153](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:153) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [158](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:158) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [176](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:176) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [181](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:181) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [186](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:186) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [191](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:191) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [201](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:201) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [208](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:208) | input | upload-script-file | type=file |
| [212](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:212) | input | script-url-input | type=text |
| [213](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:213) | button | load-script-url |  |
| [222](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:222) | button | app-version-unlock | type=button |
| [226](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:226) | input | advanced-features-toggle | type=checkbox |
| [229](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:229) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [231](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:231) | button | save-config |  |
| [232](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:232) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [241](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:241) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [251](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:251) | button | export-settings | type=button · label=ui.exportSettings |
| [255](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:255) | input | import-settings-file | type=file |
| [256](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:256) | button | import-settings | type=button · label=ui.importSettings |
| [260](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:260) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [268](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:268) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [276](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:276) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [282](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:282) | button | start-experiment | type=button · label=ui.runExperiment |
| [283](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:283) | button | close-experiment | type=button · label=ui.backToSettings |
| [302](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:302) | button | settings-help-close | type=button |
| [309](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:309) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [317](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:317) | button | advanced-password-close | type=button |
| [322](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:322) | input | advanced-password-input | type=password |
| [323](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:323) | button | advanced-password-reveal | type=button |
| [326](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:326) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [327](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:327) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [338](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:338) | input | shots-toggle | type=checkbox |
| [343](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:343) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [353](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:353) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [357](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:357) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [364](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:364) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [365](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:365) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [367](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:367) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [374](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:374) | input | box-breathing-experience-toggle | type=checkbox |
| [376](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:376) | input | visualization-addon-toggle | type=checkbox |
| [378](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:378) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [379](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:379) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [383](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:383) | input | dharana-addon-toggle | type=checkbox |
| [385](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:385) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [386](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:386) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | input | body-scan-addon-toggle | type=checkbox |
| [392](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:392) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [396](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:396) | input | noting-addon-toggle | type=checkbox |
| [399](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:399) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | input | quiet-courage-addon-toggle | type=checkbox |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [415](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:415) | input | confidence-visualization-addon-toggle | type=checkbox |
| [418](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:418) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [422](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:422) | input | deep-secrets-addon-toggle | type=checkbox |
| [425](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:425) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [429](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:429) | input | final-challenge-addon-toggle | type=checkbox |
| [438](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:438) | input | root | type=checkbox · value=root |
| [439](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:439) | input | sacral | type=checkbox · value=sacral |
| [440](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:440) | input | solar | type=checkbox · value=solar |
| [441](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:441) | input | heart | type=checkbox · value=heart |
| [442](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:442) | input | throat | type=checkbox · value=throat |
| [443](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:443) | input | thirdeye | type=checkbox · value=thirdeye |
| [444](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:444) | input | crown | type=checkbox · value=crown |
| [446](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:446) | input | reverse-journey-toggle | type=checkbox |
| [451](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:451) | input | hooponopono-experience-toggle | type=checkbox |
| [453](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:453) | input | undo-unlearn-addon-toggle | type=checkbox |
| [456](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:456) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [469](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:469) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | drone-duration-mode | type=radio · value=beginner |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | input | drone-duration-mode | type=radio · value=intermediate |
| [485](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:485) | input | drone-duration-mode | type=radio · value=advanced |
| [489](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:489) | input | drone-duration-mode | type=radio · value=expert |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | input | intention-input | type=text |
| [508](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:508) | input | returning-journey-toggle | type=checkbox |
| [512](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:512) | input | journey-video-prelude-toggle | type=checkbox |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | input | high-energy-toggle | type=checkbox |
| [525](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:525) | input | sleep-mode-toggle | type=checkbox |
| [529](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:529) | input | music-only-toggle | type=checkbox |
| [533](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:533) | input | yoga-experience-toggle | type=checkbox |
| [545](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:545) | input | perineal-care-toggle | type=checkbox |
| [549](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:549) | input | massage-toggle | type=checkbox |
| [553](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:553) | input | assisted-bathing-toggle | type=checkbox |
| [561](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:561) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [566](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:566) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [572](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:572) | input | mood-relaxation-intention-toggle | type=checkbox |
| [574](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:574) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [575](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:575) | input | pleasure-ambience-url | type=url |
| [575](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:575) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [576](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:576) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [577](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:577) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [577](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:577) | button | Decrease value | type=button |
| [577](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:577) | button | Increase value | type=button |
| [578](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:578) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [578](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:578) | button | Decrease value | type=button |
| [578](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:578) | button | Increase value | type=button |
| [588](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:588) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [593](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:593) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [598](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:598) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [611](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:611) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | button | start-meditation |  |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | button | open-settings |  |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | button | begin-consultation | type=button |
| [625](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:625) | button | guide-controlled-continue | type=button |
| [699](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:699) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [708](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:708) | button | close-mixer | type=button |
| [714](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:714) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [715](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:715) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [716](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:716) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [717](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:717) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [718](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:718) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [719](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:719) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [723](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:723) | summary | Voice Tuning ⌄ |  |
| [728](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:728) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [729](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:729) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [730](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:730) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [731](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:731) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [733](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:733) | button | Soft | type=button · label=ui.voicePresetSoft |
| [734](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:734) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [735](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:735) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [736](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:736) | button | Clear | type=button · label=ui.voicePresetClear |
| [738](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:738) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [744](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:744) | summary | Background Music ⌄ |  |
| [749](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:749) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [757](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:757) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [769](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:769) | input | audio-filters-toggle | type=checkbox |
| [770](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:770) | input | eyes-close-mode-toggle | type=checkbox |
| [772](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:772) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [776](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:776) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [778](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:778) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [783](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:783) | button | restart-meditation | type=button · label=ui.restartJourney |
| [784](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:784) | button | close-mixer-bottom | type=button · label=ui.close |
| [802](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:802) | button | final-challenge-yes | type=button · label=ui.finalChallengeYes |
| [803](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:803) | button | final-challenge-no | type=button · label=ui.finalChallengeNo |
| [804](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:804) | button | final-challenge-skip | type=button · label=ui.skipForNow |
| [815](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:815) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [816](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:816) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [823](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:823) | button | btn-mixer | type=button |
| [824](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:824) | button | pause-meditation | type=button |
| [825](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:825) | button | skip-meditation | type=button |
| [828](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:828) | button | stop-meditation | type=button |
| [836](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:836) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [853](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:853) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [857](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:857) | button | close-completion |  |

## docs/assesment.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [121](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:121) | button | fontDown | type=button |
| [122](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:122) | button | fontReset | type=button |
| [123](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:123) | button | fontUp | type=button |
| [126](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:126) | button | translateBtn | type=button |
| [133](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:133) | a | ← Meditation Room | href=../index.html |
| [144](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:144) | a | Return to Settings | href=../index.html |
| [149](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:149) | button | retryButton | type=button |
| [156](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:156) | button | choiceLeft | type=button |
| [157](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:157) | button | choiceRight | type=button |
| [160](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:160) | button | equalChoice | type=button |
| [161](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:161) | button | skipChoice | type=button |
| [162](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:162) | button | undoAnswer | type=button |
| [193](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:193) | button | undoResult | type=button |
| [194](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:194) | button | newAssessment | type=button |
| [195](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:195) | a | Return to Meditation Room | href=../index.html |

## docs/repertory.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [88](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:88) | a | backLink | href=../index.html |
| [89](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:89) | button | languageToggle | type=button |
| [108](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:108) | a | sourceLink |  |
| [114](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:114) | input | frequencySearch | type=search |
| [115](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:115) | button | clearSearch | type=button |

## Runtime-generated and relocated controls

- Yoga setup is declared in Settings markup, then moved into the Lobby Yoga panel by attachEventListeners.
- Language/voice selects and Experiment activity choices receive generated options. See content, narration and experiments maps.
- Range controls receive decrement/increment buttons; source bounds may be overridden by timing configuration, profile or demo.
- Assessment loads the validated versioned tournament bank, displays one question and two choices at a time, then builds seven chakra result cards and archetype chips. State resumes locally and Clear for New Client removes it.
- Repertory generates a Prepare Shot anchor for each validated catalog row and filters the rows during search.
- Guide Continue is one shared control whose label and availability change with care/Yoga stage.
- Completion Earn link is revealed after a timer only for eligible meditation languages.
- Narration ticker text, progress dots, fullscreen reveal state and canvas visuals are dynamic output surfaces.

## Screen and overlay inventory

Six switchable application screens: config-screen, experiment-screen, lobby-screen, icebreaker-screen, breathing-screen and meditation-screen. Additional surfaces: splash-screen, settings-help-modal, journey-video-prelude, volume-mixer, completion-modal and session-overlay. Assessment and repertory are separate documents with their own navigation and persistent state.
