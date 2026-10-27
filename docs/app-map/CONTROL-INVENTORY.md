# Screen and control inventory

Source snapshot: production a176eb3 (live) + Syam custom Malayalam voice, Shots speaker choice, Activate in the Shots section, a get-ready countdown and the speaker choice on phones only, plus a Voice Tuner page (latest changes local, not yet pushed) · 2026-10-06.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [41](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:41) | button | benefits-safety-button | type=button |
| [42](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:42) | a | syllabus-link | href=docs/syllabus.html |
| [43](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:43) | a | petal-chart-link | href=docs/syllabus.html#petals |
| [52](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:52) | select | language-select | ml: Malayalam; en: English |
| [60](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:60) | select | display-language-select | en: English; ml: Malayalam |
| [68](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:68) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [74](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:74) | button | test-voice |  |
| [79](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:79) | input | no-frequency-mode-toggle | type=checkbox |
| [80](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:80) | input | no-mantra-mode-toggle | type=checkbox |
| [85](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:85) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [96](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:96) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [97](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:97) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [101](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:101) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [102](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:102) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [109](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:109) | input | corpse-pose-toggle | type=checkbox |
| [112](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:112) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [113](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:113) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [114](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:114) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [115](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:115) | input | balasana | type=checkbox · value=balasana |
| [116](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:116) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [122](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:122) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [127](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:127) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [132](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:132) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [135](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:135) | input | bath-session-toggle | type=checkbox |
| [138](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:138) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [150](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:150) | input | deity-path | type=radio · value=none |
| [151](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:151) | input | deity-path | type=radio · value=shakthi |
| [152](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:152) | input | deity-path | type=radio · value=shiva |
| [158](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:158) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [163](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:163) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [181](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:181) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [186](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:186) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [191](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:191) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [196](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:196) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [206](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:206) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [213](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:213) | input | upload-script-file | type=file |
| [217](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:217) | input | script-url-input | type=text |
| [218](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:218) | button | load-script-url |  |
| [227](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:227) | button | app-version-unlock | type=button |
| [231](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:231) | input | advanced-features-toggle | type=checkbox |
| [234](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:234) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [236](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:236) | button | save-config |  |
| [237](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:237) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [246](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:246) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [256](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:256) | button | export-settings | type=button · label=ui.exportSettings |
| [260](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:260) | input | import-settings-file | type=file |
| [261](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:261) | button | import-settings | type=button · label=ui.importSettings |
| [265](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:265) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [273](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:273) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [281](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:281) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [287](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:287) | button | start-experiment | type=button · label=ui.runExperiment |
| [288](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:288) | button | close-experiment | type=button · label=ui.backToSettings |
| [310](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:310) | button | settings-help-close | type=button |
| [317](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:317) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [318](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:318) | button | settings-help-faq | type=button · label=ui.faqButton |
| [326](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:326) | button | benefits-safety-close | type=button |
| [348](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:348) | button | advanced-password-close | type=button |
| [353](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:353) | input | advanced-password-input | type=password |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | button | advanced-password-reveal | type=button |
| [357](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:357) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [358](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:358) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [369](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:369) | input | shots-toggle | type=checkbox |
| [374](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:374) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; golden_ratio: Golden Ratio Shot; sleep: Sleep Shot; custom: Custom Shot |
| [385](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:385) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [389](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:389) | select | shot-speaker-select | both: Both speakers (or headphones); left: Single speaker 1; right: Single speaker 2 |
| [394](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:394) | button | test-shot-speaker | type=button · label=ui.testShotSpeaker |
| [399](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:399) | button | activate-shot | type=button |
| [400](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:400) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [409](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:409) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [410](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:410) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [417](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:417) | input | box-breathing-experience-toggle | type=checkbox |
| [419](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:419) | input | visualization-addon-toggle | type=checkbox |
| [421](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:421) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [422](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:422) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [426](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:426) | input | dharana-addon-toggle | type=checkbox |
| [428](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:428) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [429](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:429) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [433](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:433) | input | body-scan-addon-toggle | type=checkbox |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [439](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:439) | input | noting-addon-toggle | type=checkbox |
| [442](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:442) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [451](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:451) | input | quiet-courage-addon-toggle | type=checkbox |
| [454](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:454) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [458](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:458) | input | confidence-visualization-addon-toggle | type=checkbox |
| [461](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:461) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [465](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:465) | input | deep-secrets-addon-toggle | type=checkbox |
| [468](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:468) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | root | type=checkbox · value=root |
| [478](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:478) | input | sacral | type=checkbox · value=sacral |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | input | solar | type=checkbox · value=solar |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | input | heart | type=checkbox · value=heart |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | input | throat | type=checkbox · value=throat |
| [482](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:482) | input | thirdeye | type=checkbox · value=thirdeye |
| [483](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:483) | input | crown | type=checkbox · value=crown |
| [485](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:485) | input | reverse-journey-toggle | type=checkbox |
| [490](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:490) | input | hooponopono-experience-toggle | type=checkbox |
| [492](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:492) | input | undo-unlearn-addon-toggle | type=checkbox |
| [495](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:495) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [508](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:508) | input | per-chakra-time-toggle | type=checkbox |
| [514](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:514) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [515](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:515) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [518](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:518) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [523](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:523) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [531](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:531) | input | drone-duration-mode | type=radio · value=beginner |
| [535](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:535) | input | drone-duration-mode | type=radio · value=intermediate |
| [539](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:539) | input | drone-duration-mode | type=radio · value=advanced |
| [543](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:543) | input | drone-duration-mode | type=radio · value=expert |
| [556](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:556) | input | intention-input | type=text |
| [562](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:562) | input | returning-journey-toggle | type=checkbox |
| [566](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:566) | input | journey-video-prelude-toggle | type=checkbox |
| [569](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:569) | button | play-video-introduction | type=button · label=ui.playVideoIntroduction |
| [576](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:576) | input | high-energy-toggle | type=checkbox |
| [580](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:580) | input | sleep-mode-toggle | type=checkbox |
| [584](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:584) | input | music-only-toggle | type=checkbox |
| [588](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:588) | input | yoga-experience-toggle | type=checkbox |
| [600](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:600) | input | perineal-care-toggle | type=checkbox |
| [604](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:604) | input | massage-toggle | type=checkbox |
| [608](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:608) | input | assisted-bathing-toggle | type=checkbox |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [621](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:621) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | input | mood-relaxation-intention-toggle | type=checkbox |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | input | pleasure-ambience-url | type=url |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [631](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:631) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [632](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:632) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [632](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:632) | button | Decrease value | type=button |
| [632](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:632) | button | Increase value | type=button |
| [633](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:633) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [633](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:633) | button | Decrease value | type=button |
| [633](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:633) | button | Increase value | type=button |
| [642](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:642) | button | optional-service-info-yes | type=button · label=ui.optionalServiceYes |
| [643](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:643) | button | optional-service-info-no | type=button · label=ui.optionalServiceNo |
| [654](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:654) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [659](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:659) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [669](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:669) | button | open-role-play | type=button · label=ui.rpOpen |
| [682](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:682) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [685](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:685) | button | start-meditation |  |
| [686](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:686) | button | open-settings |  |
| [687](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:687) | button | begin-consultation | type=button |
| [696](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:696) | button | guide-controlled-continue | type=button |
| [773](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:773) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [782](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:782) | button | close-mixer | type=button |
| [788](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:788) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [789](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:789) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [790](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:790) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [791](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:791) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [792](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:792) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [793](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:793) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [797](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:797) | summary | Voice Tuning ⌄ |  |
| [802](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:802) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [803](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:803) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [804](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:804) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [805](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:805) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [807](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:807) | button | Soft | type=button · label=ui.voicePresetSoft |
| [808](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:808) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [809](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:809) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [810](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:810) | button | Clear | type=button · label=ui.voicePresetClear |
| [812](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:812) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [818](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:818) | summary | Background Music ⌄ |  |
| [823](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:823) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [831](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:831) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [843](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:843) | input | audio-filters-toggle | type=checkbox |
| [844](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:844) | input | eyes-close-mode-toggle | type=checkbox |
| [846](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:846) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [850](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:850) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [852](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:852) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [857](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:857) | button | restart-meditation | type=button · label=ui.restartJourney |
| [858](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:858) | button | close-mixer-bottom | type=button · label=ui.close |
| [870](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:870) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [871](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:871) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [878](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:878) | button | btn-mixer | type=button |
| [879](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:879) | button | pause-meditation | type=button |
| [880](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:880) | button | skip-meditation | type=button |
| [883](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:883) | button | stop-meditation | type=button |
| [891](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:891) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [908](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:908) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [912](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:912) | button | close-completion |  |

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
