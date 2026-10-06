# Screen and control inventory

Source snapshot: production b1c9e30 (feature/narration-feeling pushed: Tailwind phases 0–6, per-chakra rows and padding) + uncommitted atlas source-reference refresh · 2026-10-06.

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
| [303](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:303) | button | settings-help-close | type=button |
| [310](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:310) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [311](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:311) | button | settings-help-faq | type=button · label=ui.faqButton |
| [319](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:319) | button | benefits-safety-close | type=button |
| [341](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:341) | button | advanced-password-close | type=button |
| [346](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:346) | input | advanced-password-input | type=password |
| [347](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:347) | button | advanced-password-reveal | type=button |
| [350](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:350) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [362](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:362) | input | shots-toggle | type=checkbox |
| [367](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:367) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [377](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:377) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [381](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:381) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [388](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:388) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [389](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:389) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [391](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:391) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [398](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:398) | input | box-breathing-experience-toggle | type=checkbox |
| [400](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:400) | input | visualization-addon-toggle | type=checkbox |
| [402](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:402) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | input | dharana-addon-toggle | type=checkbox |
| [409](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:409) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [410](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:410) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [414](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:414) | input | body-scan-addon-toggle | type=checkbox |
| [416](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:416) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [420](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:420) | input | noting-addon-toggle | type=checkbox |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [432](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:432) | input | quiet-courage-addon-toggle | type=checkbox |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [439](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:439) | input | confidence-visualization-addon-toggle | type=checkbox |
| [442](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:442) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [446](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:446) | input | deep-secrets-addon-toggle | type=checkbox |
| [449](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:449) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [453](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:453) | input | final-challenge-addon-toggle | type=checkbox |
| [462](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:462) | input | root | type=checkbox · value=root |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | sacral | type=checkbox · value=sacral |
| [464](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:464) | input | solar | type=checkbox · value=solar |
| [465](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:465) | input | heart | type=checkbox · value=heart |
| [466](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:466) | input | throat | type=checkbox · value=throat |
| [467](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:467) | input | thirdeye | type=checkbox · value=thirdeye |
| [468](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:468) | input | crown | type=checkbox · value=crown |
| [470](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:470) | input | reverse-journey-toggle | type=checkbox |
| [475](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:475) | input | hooponopono-experience-toggle | type=checkbox |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | undo-unlearn-addon-toggle | type=checkbox |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [487](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:487) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [493](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:493) | input | per-chakra-time-toggle | type=checkbox |
| [499](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:499) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [500](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:500) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [503](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:503) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [508](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:508) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [516](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:516) | input | drone-duration-mode | type=radio · value=beginner |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | input | drone-duration-mode | type=radio · value=intermediate |
| [524](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:524) | input | drone-duration-mode | type=radio · value=advanced |
| [528](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:528) | input | drone-duration-mode | type=radio · value=expert |
| [541](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:541) | input | intention-input | type=text |
| [547](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:547) | input | returning-journey-toggle | type=checkbox |
| [551](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:551) | input | journey-video-prelude-toggle | type=checkbox |
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
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [632](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:632) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [637](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:637) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [650](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:650) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [653](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:653) | button | start-meditation |  |
| [654](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:654) | button | open-settings |  |
| [655](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:655) | button | begin-consultation | type=button |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | button | guide-controlled-continue | type=button |
| [738](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:738) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [747](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:747) | button | close-mixer | type=button |
| [753](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:753) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [754](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:754) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [755](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:755) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [756](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:756) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [757](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:757) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [758](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:758) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [762](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:762) | summary | Voice Tuning ⌄ |  |
| [767](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:767) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [768](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:768) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [769](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:769) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [770](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:770) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [772](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:772) | button | Soft | type=button · label=ui.voicePresetSoft |
| [773](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:773) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [774](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:774) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [775](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:775) | button | Clear | type=button · label=ui.voicePresetClear |
| [777](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:777) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [783](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:783) | summary | Background Music ⌄ |  |
| [788](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:788) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [796](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:796) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [808](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:808) | input | audio-filters-toggle | type=checkbox |
| [809](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:809) | input | eyes-close-mode-toggle | type=checkbox |
| [811](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:811) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [815](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:815) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [817](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:817) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [822](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:822) | button | restart-meditation | type=button · label=ui.restartJourney |
| [823](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:823) | button | close-mixer-bottom | type=button · label=ui.close |
| [841](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:841) | button | final-challenge-yes | type=button · label=ui.finalChallengeYes |
| [842](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:842) | button | final-challenge-no | type=button · label=ui.finalChallengeNo |
| [843](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:843) | button | final-challenge-skip | type=button · label=ui.skipForNow |
| [854](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:854) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [855](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:855) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [862](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:862) | button | btn-mixer | type=button |
| [863](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:863) | button | pause-meditation | type=button |
| [864](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:864) | button | skip-meditation | type=button |
| [867](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:867) | button | stop-meditation | type=button |
| [875](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:875) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [892](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:892) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [896](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:896) | button | close-completion |  |

## docs/assesment.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [125](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:125) | button | fontDown | type=button |
| [126](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:126) | button | fontReset | type=button |
| [127](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:127) | button | fontUp | type=button |
| [130](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:130) | button | translateBtn | type=button |
| [137](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:137) | a | ← Meditation Room | href=../index.html |
| [148](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:148) | a | Return to Settings | href=../index.html |
| [153](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:153) | button | retryButton | type=button |
| [160](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:160) | button | choiceLeft | type=button |
| [161](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:161) | button | choiceRight | type=button |
| [164](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:164) | button | equalChoice | type=button |
| [165](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:165) | button | skipChoice | type=button |
| [166](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:166) | button | undoAnswer | type=button |
| [197](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:197) | button | undoResult | type=button |
| [198](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:198) | button | newAssessment | type=button |
| [199](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:199) | a | Return to Meditation Room | href=../index.html |

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
