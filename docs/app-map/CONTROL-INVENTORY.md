# Screen and control inventory

Source snapshot: production a176eb3 (live) + Syam custom Malayalam voice and Shots speaker choice (local commits, not yet pushed) · 2026-10-06.

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
| [384](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:384) | select | shot-speaker-select | both: Both speakers (or headphones); left: Single speaker 1; right: Single speaker 2 |
| [389](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:389) | button | test-shot-speaker | type=button · label=ui.testShotSpeaker |
| [394](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:394) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [401](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:401) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [402](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:402) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [404](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:404) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | input | box-breathing-experience-toggle | type=checkbox |
| [413](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:413) | input | visualization-addon-toggle | type=checkbox |
| [415](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:415) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [416](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:416) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [420](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:420) | input | dharana-addon-toggle | type=checkbox |
| [422](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:422) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [427](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:427) | input | body-scan-addon-toggle | type=checkbox |
| [429](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:429) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [433](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:433) | input | noting-addon-toggle | type=checkbox |
| [436](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:436) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [445](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:445) | input | quiet-courage-addon-toggle | type=checkbox |
| [448](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:448) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [452](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:452) | input | confidence-visualization-addon-toggle | type=checkbox |
| [455](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:455) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [459](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:459) | input | deep-secrets-addon-toggle | type=checkbox |
| [462](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:462) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [471](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:471) | input | root | type=checkbox · value=root |
| [472](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:472) | input | sacral | type=checkbox · value=sacral |
| [473](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:473) | input | solar | type=checkbox · value=solar |
| [474](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:474) | input | heart | type=checkbox · value=heart |
| [475](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:475) | input | throat | type=checkbox · value=throat |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | input | thirdeye | type=checkbox · value=thirdeye |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | crown | type=checkbox · value=crown |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | input | reverse-journey-toggle | type=checkbox |
| [484](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:484) | input | hooponopono-experience-toggle | type=checkbox |
| [486](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:486) | input | undo-unlearn-addon-toggle | type=checkbox |
| [489](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:489) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [496](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:496) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | input | per-chakra-time-toggle | type=checkbox |
| [508](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:508) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [509](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:509) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [512](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:512) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [525](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:525) | input | drone-duration-mode | type=radio · value=beginner |
| [529](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:529) | input | drone-duration-mode | type=radio · value=intermediate |
| [533](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:533) | input | drone-duration-mode | type=radio · value=advanced |
| [537](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:537) | input | drone-duration-mode | type=radio · value=expert |
| [550](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:550) | input | intention-input | type=text |
| [556](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:556) | input | returning-journey-toggle | type=checkbox |
| [560](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:560) | input | journey-video-prelude-toggle | type=checkbox |
| [563](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:563) | button | play-video-introduction | type=button · label=ui.playVideoIntroduction |
| [570](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:570) | input | high-energy-toggle | type=checkbox |
| [574](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:574) | input | sleep-mode-toggle | type=checkbox |
| [578](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:578) | input | music-only-toggle | type=checkbox |
| [582](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:582) | input | yoga-experience-toggle | type=checkbox |
| [594](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:594) | input | perineal-care-toggle | type=checkbox |
| [598](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:598) | input | massage-toggle | type=checkbox |
| [602](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:602) | input | assisted-bathing-toggle | type=checkbox |
| [610](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:610) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [621](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:621) | input | mood-relaxation-intention-toggle | type=checkbox |
| [623](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:623) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [624](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:624) | input | pleasure-ambience-url | type=url |
| [624](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:624) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [625](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:625) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | button | Decrease value | type=button |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | button | Increase value | type=button |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | button | Decrease value | type=button |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | button | Increase value | type=button |
| [636](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:636) | button | optional-service-info-yes | type=button · label=ui.optionalServiceYes |
| [637](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:637) | button | optional-service-info-no | type=button · label=ui.optionalServiceNo |
| [648](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:648) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [653](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:653) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [658](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:658) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [663](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:663) | button | open-role-play | type=button · label=ui.rpOpen |
| [676](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:676) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [679](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:679) | button | start-meditation |  |
| [680](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:680) | button | open-settings |  |
| [681](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:681) | button | begin-consultation | type=button |
| [690](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:690) | button | guide-controlled-continue | type=button |
| [766](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:766) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [775](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:775) | button | close-mixer | type=button |
| [781](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:781) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [782](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:782) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [783](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:783) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [784](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:784) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [785](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:785) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [786](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:786) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [790](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:790) | summary | Voice Tuning ⌄ |  |
| [795](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:795) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [796](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:796) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [797](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:797) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [798](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:798) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [800](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:800) | button | Soft | type=button · label=ui.voicePresetSoft |
| [801](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:801) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [802](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:802) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [803](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:803) | button | Clear | type=button · label=ui.voicePresetClear |
| [805](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:805) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [811](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:811) | summary | Background Music ⌄ |  |
| [816](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:816) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [824](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:824) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [836](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:836) | input | audio-filters-toggle | type=checkbox |
| [837](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:837) | input | eyes-close-mode-toggle | type=checkbox |
| [839](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:839) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [843](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:843) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [845](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:845) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [850](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:850) | button | restart-meditation | type=button · label=ui.restartJourney |
| [851](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:851) | button | close-mixer-bottom | type=button · label=ui.close |
| [863](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:863) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [864](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:864) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [871](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:871) | button | btn-mixer | type=button |
| [872](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:872) | button | pause-meditation | type=button |
| [873](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:873) | button | skip-meditation | type=button |
| [876](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:876) | button | stop-meditation | type=button |
| [884](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:884) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [901](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:901) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [905](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:905) | button | close-completion |  |

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
