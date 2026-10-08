# Screen and control inventory

Source snapshot: production 2a2fca5 (live) + Lobby Play introduction button (local commit, not yet pushed) · 2026-10-06.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [40](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:40) | button | benefits-safety-button | type=button · label=ui.faqButton |
| [48](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:48) | select | language-select | ml: Malayalam; en: English |
| [56](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:56) | select | display-language-select | en: English; ml: Malayalam |
| [64](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:64) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [70](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:70) | button | test-voice |  |
| [75](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:75) | input | no-frequency-mode-toggle | type=checkbox |
| [76](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:76) | input | no-mantra-mode-toggle | type=checkbox |
| [81](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:81) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [92](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:92) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [93](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:93) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [97](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:97) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [98](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:98) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [105](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:105) | input | corpse-pose-toggle | type=checkbox |
| [108](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:108) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [109](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:109) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [110](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:110) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [111](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:111) | input | balasana | type=checkbox · value=balasana |
| [112](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:112) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [118](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:118) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [123](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:123) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [128](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:128) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [131](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:131) | input | bath-session-toggle | type=checkbox |
| [134](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:134) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [146](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:146) | input | deity-path | type=radio · value=none |
| [147](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:147) | input | deity-path | type=radio · value=shakthi |
| [148](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:148) | input | deity-path | type=radio · value=shiva |
| [154](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:154) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [159](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:159) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [177](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:177) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [182](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:182) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [187](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:187) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [192](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:192) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [202](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:202) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [209](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:209) | input | upload-script-file | type=file |
| [213](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:213) | input | script-url-input | type=text |
| [214](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:214) | button | load-script-url |  |
| [223](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:223) | button | app-version-unlock | type=button |
| [227](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:227) | input | advanced-features-toggle | type=checkbox |
| [230](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:230) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [232](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:232) | button | save-config |  |
| [233](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:233) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [242](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:242) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [252](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:252) | button | export-settings | type=button · label=ui.exportSettings |
| [256](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:256) | input | import-settings-file | type=file |
| [257](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:257) | button | import-settings | type=button · label=ui.importSettings |
| [261](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:261) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [269](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:269) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [277](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:277) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [283](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:283) | button | start-experiment | type=button · label=ui.runExperiment |
| [284](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:284) | button | close-experiment | type=button · label=ui.backToSettings |
| [306](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:306) | button | settings-help-close | type=button |
| [313](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:313) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [314](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:314) | button | settings-help-faq | type=button · label=ui.faqButton |
| [322](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:322) | button | benefits-safety-close | type=button |
| [344](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:344) | button | advanced-password-close | type=button |
| [349](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:349) | input | advanced-password-input | type=password |
| [350](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:350) | button | advanced-password-reveal | type=button |
| [353](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:353) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [365](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:365) | input | shots-toggle | type=checkbox |
| [370](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:370) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [380](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:380) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [384](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:384) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [391](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:391) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [392](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:392) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [393](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:393) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [394](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:394) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [401](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:401) | input | box-breathing-experience-toggle | type=checkbox |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | input | visualization-addon-toggle | type=checkbox |
| [405](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:405) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [406](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:406) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [410](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:410) | input | dharana-addon-toggle | type=checkbox |
| [412](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:412) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [413](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:413) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [417](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:417) | input | body-scan-addon-toggle | type=checkbox |
| [419](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:419) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | input | noting-addon-toggle | type=checkbox |
| [426](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:426) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | input | quiet-courage-addon-toggle | type=checkbox |
| [438](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:438) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [442](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:442) | input | confidence-visualization-addon-toggle | type=checkbox |
| [445](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:445) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [449](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:449) | input | deep-secrets-addon-toggle | type=checkbox |
| [452](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:452) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [461](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:461) | input | root | type=checkbox · value=root |
| [462](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:462) | input | sacral | type=checkbox · value=sacral |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | solar | type=checkbox · value=solar |
| [464](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:464) | input | heart | type=checkbox · value=heart |
| [465](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:465) | input | throat | type=checkbox · value=throat |
| [466](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:466) | input | thirdeye | type=checkbox · value=thirdeye |
| [467](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:467) | input | crown | type=checkbox · value=crown |
| [469](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:469) | input | reverse-journey-toggle | type=checkbox |
| [474](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:474) | input | hooponopono-experience-toggle | type=checkbox |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | input | undo-unlearn-addon-toggle | type=checkbox |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [486](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:486) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [492](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:492) | input | per-chakra-time-toggle | type=checkbox |
| [498](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:498) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [499](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:499) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [507](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:507) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [515](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:515) | input | drone-duration-mode | type=radio · value=beginner |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | input | drone-duration-mode | type=radio · value=intermediate |
| [523](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:523) | input | drone-duration-mode | type=radio · value=advanced |
| [527](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:527) | input | drone-duration-mode | type=radio · value=expert |
| [540](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:540) | input | intention-input | type=text |
| [546](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:546) | input | returning-journey-toggle | type=checkbox |
| [550](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:550) | input | journey-video-prelude-toggle | type=checkbox |
| [553](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:553) | button | play-video-introduction | type=button · label=ui.playVideoIntroduction |
| [560](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:560) | input | high-energy-toggle | type=checkbox |
| [564](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:564) | input | sleep-mode-toggle | type=checkbox |
| [568](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:568) | input | music-only-toggle | type=checkbox |
| [572](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:572) | input | yoga-experience-toggle | type=checkbox |
| [584](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:584) | input | perineal-care-toggle | type=checkbox |
| [588](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:588) | input | massage-toggle | type=checkbox |
| [592](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:592) | input | assisted-bathing-toggle | type=checkbox |
| [600](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:600) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [605](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:605) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [611](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:611) | input | mood-relaxation-intention-toggle | type=checkbox |
| [613](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:613) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | input | pleasure-ambience-url | type=url |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | button | Decrease value | type=button |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | button | Increase value | type=button |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | button | Decrease value | type=button |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | button | Increase value | type=button |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | button | optional-service-info-yes | type=button · label=ui.optionalServiceYes |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | button | optional-service-info-no | type=button · label=ui.optionalServiceNo |
| [638](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:638) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [643](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:643) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [648](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:648) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [653](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:653) | button | open-role-play | type=button · label=ui.rpOpen |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [669](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:669) | button | start-meditation |  |
| [670](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:670) | button | open-settings |  |
| [671](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:671) | button | begin-consultation | type=button |
| [680](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:680) | button | guide-controlled-continue | type=button |
| [754](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:754) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [763](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:763) | button | close-mixer | type=button |
| [769](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:769) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [770](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:770) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [771](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:771) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [772](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:772) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [773](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:773) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [774](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:774) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [778](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:778) | summary | Voice Tuning ⌄ |  |
| [783](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:783) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [784](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:784) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [785](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:785) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [786](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:786) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [788](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:788) | button | Soft | type=button · label=ui.voicePresetSoft |
| [789](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:789) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [790](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:790) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [791](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:791) | button | Clear | type=button · label=ui.voicePresetClear |
| [793](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:793) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [799](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:799) | summary | Background Music ⌄ |  |
| [804](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:804) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [812](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:812) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [824](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:824) | input | audio-filters-toggle | type=checkbox |
| [825](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:825) | input | eyes-close-mode-toggle | type=checkbox |
| [827](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:827) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [831](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:831) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [833](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:833) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [838](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:838) | button | restart-meditation | type=button · label=ui.restartJourney |
| [839](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:839) | button | close-mixer-bottom | type=button · label=ui.close |
| [851](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:851) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [852](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:852) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [859](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:859) | button | btn-mixer | type=button |
| [860](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:860) | button | pause-meditation | type=button |
| [861](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:861) | button | skip-meditation | type=button |
| [864](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:864) | button | stop-meditation | type=button |
| [872](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:872) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [889](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:889) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [893](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:893) | button | close-completion |  |

## docs/assesment.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [130](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:130) | button | fontDown | type=button |
| [131](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:131) | button | fontReset | type=button |
| [132](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:132) | button | fontUp | type=button |
| [135](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:135) | button | translateBtn | type=button |
| [142](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:142) | a | ← Meditation Room | href=../index.html |
| [153](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:153) | button | retryButton | type=button |
| [161](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:161) | button | choiceLeft | type=button |
| [162](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:162) | button | choiceRight | type=button |
| [165](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:165) | button | equalChoice | type=button |
| [166](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:166) | button | skipChoice | type=button |
| [167](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:167) | button | undoAnswer | type=button |
| [186](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:186) | summary | lowAnswersSummary |  |
| [207](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:207) | button | undoResult | type=button |
| [208](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:208) | button | newAssessment | type=button |
| [209](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:209) | a | Return to Meditation Room | href=../index.html |

## docs/repertory.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [94](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:94) | a | backLink | href=../index.html |
| [95](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:95) | select | languageToggle | en: English; ml: മലയാളം; hi: हिन्दी; ru: Русский; ta: தமிழ் |
| [114](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:114) | a | sourceLink |  |
| [120](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:120) | input | frequencySearch | type=search |
| [121](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:121) | button | clearSearch | type=button |

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
