# Screen and control inventory

Source snapshot: production a176eb3 (live) + Syam custom Malayalam voice, Shots speaker choice, Activate in the Shots section, a get-ready countdown and the speaker choice on phones only, plus a Voice Tuner page (latest changes local, not yet pushed) · 2026-10-06.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [40](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:40) | button | benefits-safety-button | type=button · label=ui.faqButton |
| [41](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:41) | a | syllabus-link | href=docs/syllabus.html · label=ui.syllabusLink |
| [49](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:49) | select | language-select | ml: Malayalam; en: English |
| [57](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:57) | select | display-language-select | en: English; ml: Malayalam |
| [65](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:65) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [71](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:71) | button | test-voice |  |
| [76](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:76) | input | no-frequency-mode-toggle | type=checkbox |
| [77](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:77) | input | no-mantra-mode-toggle | type=checkbox |
| [82](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:82) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [93](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:93) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [94](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:94) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [98](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:98) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [99](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:99) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [106](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:106) | input | corpse-pose-toggle | type=checkbox |
| [109](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:109) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [110](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:110) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [111](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:111) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [112](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:112) | input | balasana | type=checkbox · value=balasana |
| [113](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:113) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [119](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:119) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [124](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:124) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [129](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:129) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [132](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:132) | input | bath-session-toggle | type=checkbox |
| [135](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:135) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [147](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:147) | input | deity-path | type=radio · value=none |
| [148](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:148) | input | deity-path | type=radio · value=shakthi |
| [149](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:149) | input | deity-path | type=radio · value=shiva |
| [155](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:155) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [160](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:160) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [178](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:178) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [183](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:183) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [188](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:188) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [193](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:193) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [203](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:203) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [210](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:210) | input | upload-script-file | type=file |
| [214](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:214) | input | script-url-input | type=text |
| [215](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:215) | button | load-script-url |  |
| [224](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:224) | button | app-version-unlock | type=button |
| [228](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:228) | input | advanced-features-toggle | type=checkbox |
| [231](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:231) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [233](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:233) | button | save-config |  |
| [234](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:234) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [243](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:243) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [253](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:253) | button | export-settings | type=button · label=ui.exportSettings |
| [257](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:257) | input | import-settings-file | type=file |
| [258](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:258) | button | import-settings | type=button · label=ui.importSettings |
| [262](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:262) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [270](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:270) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [278](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:278) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [284](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:284) | button | start-experiment | type=button · label=ui.runExperiment |
| [285](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:285) | button | close-experiment | type=button · label=ui.backToSettings |
| [307](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:307) | button | settings-help-close | type=button |
| [314](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:314) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [315](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:315) | button | settings-help-faq | type=button · label=ui.faqButton |
| [323](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:323) | button | benefits-safety-close | type=button |
| [345](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:345) | button | advanced-password-close | type=button |
| [350](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:350) | input | advanced-password-input | type=password |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | button | advanced-password-reveal | type=button |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [355](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:355) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | input | shots-toggle | type=checkbox |
| [371](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:371) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [381](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:381) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [385](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:385) | select | shot-speaker-select | both: Both speakers (or headphones); left: Single speaker 1; right: Single speaker 2 |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | button | test-shot-speaker | type=button · label=ui.testShotSpeaker |
| [395](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:395) | button | activate-shot | type=button |
| [396](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:396) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [404](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:404) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [405](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:405) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [406](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:406) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [413](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:413) | input | box-breathing-experience-toggle | type=checkbox |
| [415](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:415) | input | visualization-addon-toggle | type=checkbox |
| [417](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:417) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [418](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:418) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [422](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:422) | input | dharana-addon-toggle | type=checkbox |
| [424](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:424) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [425](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:425) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [429](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:429) | input | body-scan-addon-toggle | type=checkbox |
| [431](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:431) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | input | noting-addon-toggle | type=checkbox |
| [438](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:438) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [447](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:447) | input | quiet-courage-addon-toggle | type=checkbox |
| [450](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:450) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [454](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:454) | input | confidence-visualization-addon-toggle | type=checkbox |
| [457](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:457) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [461](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:461) | input | deep-secrets-addon-toggle | type=checkbox |
| [464](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:464) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [473](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:473) | input | root | type=checkbox · value=root |
| [474](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:474) | input | sacral | type=checkbox · value=sacral |
| [475](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:475) | input | solar | type=checkbox · value=solar |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | input | heart | type=checkbox · value=heart |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | throat | type=checkbox · value=throat |
| [478](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:478) | input | thirdeye | type=checkbox · value=thirdeye |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | input | crown | type=checkbox · value=crown |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | input | reverse-journey-toggle | type=checkbox |
| [486](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:486) | input | hooponopono-experience-toggle | type=checkbox |
| [488](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:488) | input | undo-unlearn-addon-toggle | type=checkbox |
| [491](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:491) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [498](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:498) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [504](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:504) | input | per-chakra-time-toggle | type=checkbox |
| [510](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:510) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [511](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:511) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [514](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:514) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [527](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:527) | input | drone-duration-mode | type=radio · value=beginner |
| [531](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:531) | input | drone-duration-mode | type=radio · value=intermediate |
| [535](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:535) | input | drone-duration-mode | type=radio · value=advanced |
| [539](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:539) | input | drone-duration-mode | type=radio · value=expert |
| [552](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:552) | input | intention-input | type=text |
| [558](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:558) | input | returning-journey-toggle | type=checkbox |
| [562](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:562) | input | journey-video-prelude-toggle | type=checkbox |
| [565](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:565) | button | play-video-introduction | type=button · label=ui.playVideoIntroduction |
| [572](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:572) | input | high-energy-toggle | type=checkbox |
| [576](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:576) | input | sleep-mode-toggle | type=checkbox |
| [580](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:580) | input | music-only-toggle | type=checkbox |
| [584](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:584) | input | yoga-experience-toggle | type=checkbox |
| [596](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:596) | input | perineal-care-toggle | type=checkbox |
| [600](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:600) | input | massage-toggle | type=checkbox |
| [604](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:604) | input | assisted-bathing-toggle | type=checkbox |
| [612](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:612) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [623](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:623) | input | mood-relaxation-intention-toggle | type=checkbox |
| [625](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:625) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | input | pleasure-ambience-url | type=url |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | button | Decrease value | type=button |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | button | Increase value | type=button |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | button | Decrease value | type=button |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | button | Increase value | type=button |
| [638](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:638) | button | optional-service-info-yes | type=button · label=ui.optionalServiceYes |
| [639](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:639) | button | optional-service-info-no | type=button · label=ui.optionalServiceNo |
| [650](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:650) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [655](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:655) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [660](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:660) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [665](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:665) | button | open-role-play | type=button · label=ui.rpOpen |
| [678](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:678) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [681](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:681) | button | start-meditation |  |
| [682](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:682) | button | open-settings |  |
| [683](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:683) | button | begin-consultation | type=button |
| [692](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:692) | button | guide-controlled-continue | type=button |
| [769](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:769) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [778](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:778) | button | close-mixer | type=button |
| [784](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:784) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [785](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:785) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [786](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:786) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [787](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:787) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [788](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:788) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [789](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:789) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [793](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:793) | summary | Voice Tuning ⌄ |  |
| [798](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:798) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [799](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:799) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [800](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:800) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [801](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:801) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [803](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:803) | button | Soft | type=button · label=ui.voicePresetSoft |
| [804](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:804) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [805](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:805) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [806](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:806) | button | Clear | type=button · label=ui.voicePresetClear |
| [808](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:808) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [814](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:814) | summary | Background Music ⌄ |  |
| [819](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:819) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [827](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:827) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [839](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:839) | input | audio-filters-toggle | type=checkbox |
| [840](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:840) | input | eyes-close-mode-toggle | type=checkbox |
| [842](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:842) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [846](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:846) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [848](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:848) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [853](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:853) | button | restart-meditation | type=button · label=ui.restartJourney |
| [854](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:854) | button | close-mixer-bottom | type=button · label=ui.close |
| [866](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:866) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [867](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:867) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [874](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:874) | button | btn-mixer | type=button |
| [875](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:875) | button | pause-meditation | type=button |
| [876](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:876) | button | skip-meditation | type=button |
| [879](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:879) | button | stop-meditation | type=button |
| [887](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:887) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [904](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:904) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [908](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:908) | button | close-completion |  |

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
