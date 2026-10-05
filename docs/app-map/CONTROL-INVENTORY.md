# Screen and control inventory

Source snapshot: production b83ec2d + uncommitted Tailwind phases 2–3 (feature/narration-feeling) · 2026-10-05.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [38](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:38) | button | settings-help-button | type=button |
| [41](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:41) | button | benefits-safety-button | type=button · label=ui.faqButton |
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
| [304](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:304) | button | settings-help-close | type=button |
| [311](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:311) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [312](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:312) | button | settings-help-faq | type=button · label=ui.faqButton |
| [320](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:320) | button | benefits-safety-close | type=button |
| [342](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:342) | button | advanced-password-close | type=button |
| [347](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:347) | input | advanced-password-input | type=password |
| [348](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:348) | button | advanced-password-reveal | type=button |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [352](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:352) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [363](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:363) | input | shots-toggle | type=checkbox |
| [368](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:368) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [378](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:378) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [382](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:382) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [389](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:389) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [391](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:391) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [392](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:392) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [399](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:399) | input | box-breathing-experience-toggle | type=checkbox |
| [401](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:401) | input | visualization-addon-toggle | type=checkbox |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [404](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:404) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | input | dharana-addon-toggle | type=checkbox |
| [410](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:410) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [415](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:415) | input | body-scan-addon-toggle | type=checkbox |
| [417](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:417) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [421](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:421) | input | noting-addon-toggle | type=checkbox |
| [424](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:424) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [433](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:433) | input | quiet-courage-addon-toggle | type=checkbox |
| [436](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:436) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [440](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:440) | input | confidence-visualization-addon-toggle | type=checkbox |
| [443](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:443) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [447](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:447) | input | deep-secrets-addon-toggle | type=checkbox |
| [450](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:450) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [454](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:454) | input | final-challenge-addon-toggle | type=checkbox |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | root | type=checkbox · value=root |
| [464](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:464) | input | sacral | type=checkbox · value=sacral |
| [465](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:465) | input | solar | type=checkbox · value=solar |
| [466](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:466) | input | heart | type=checkbox · value=heart |
| [467](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:467) | input | throat | type=checkbox · value=throat |
| [468](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:468) | input | thirdeye | type=checkbox · value=thirdeye |
| [469](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:469) | input | crown | type=checkbox · value=crown |
| [471](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:471) | input | reverse-journey-toggle | type=checkbox |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | input | hooponopono-experience-toggle | type=checkbox |
| [478](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:478) | input | undo-unlearn-addon-toggle | type=checkbox |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [488](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:488) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [494](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:494) | input | per-chakra-time-toggle | type=checkbox |
| [500](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:500) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [501](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:501) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [504](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:504) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [509](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:509) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | input | drone-duration-mode | type=radio · value=beginner |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | input | drone-duration-mode | type=radio · value=intermediate |
| [525](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:525) | input | drone-duration-mode | type=radio · value=advanced |
| [529](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:529) | input | drone-duration-mode | type=radio · value=expert |
| [542](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:542) | input | intention-input | type=text |
| [548](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:548) | input | returning-journey-toggle | type=checkbox |
| [552](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:552) | input | journey-video-prelude-toggle | type=checkbox |
| [561](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:561) | input | high-energy-toggle | type=checkbox |
| [565](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:565) | input | sleep-mode-toggle | type=checkbox |
| [569](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:569) | input | music-only-toggle | type=checkbox |
| [573](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:573) | input | yoga-experience-toggle | type=checkbox |
| [585](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:585) | input | perineal-care-toggle | type=checkbox |
| [589](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:589) | input | massage-toggle | type=checkbox |
| [593](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:593) | input | assisted-bathing-toggle | type=checkbox |
| [601](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:601) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [606](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:606) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [612](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:612) | input | mood-relaxation-intention-toggle | type=checkbox |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | input | pleasure-ambience-url | type=url |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | button | Decrease value | type=button |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | button | Increase value | type=button |
| [618](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:618) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [618](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:618) | button | Decrease value | type=button |
| [618](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:618) | button | Increase value | type=button |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [633](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:633) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [638](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:638) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [651](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:651) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [654](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:654) | button | start-meditation |  |
| [655](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:655) | button | open-settings |  |
| [656](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:656) | button | begin-consultation | type=button |
| [665](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:665) | button | guide-controlled-continue | type=button |
| [739](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:739) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [748](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:748) | button | close-mixer | type=button |
| [754](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:754) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [755](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:755) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [756](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:756) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [757](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:757) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [758](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:758) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [759](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:759) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [763](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:763) | summary | Voice Tuning ⌄ |  |
| [768](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:768) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [769](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:769) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [770](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:770) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [771](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:771) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [773](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:773) | button | Soft | type=button · label=ui.voicePresetSoft |
| [774](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:774) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [775](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:775) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [776](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:776) | button | Clear | type=button · label=ui.voicePresetClear |
| [778](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:778) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [784](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:784) | summary | Background Music ⌄ |  |
| [789](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:789) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [797](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:797) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [809](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:809) | input | audio-filters-toggle | type=checkbox |
| [810](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:810) | input | eyes-close-mode-toggle | type=checkbox |
| [812](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:812) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [816](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:816) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [818](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:818) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [823](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:823) | button | restart-meditation | type=button · label=ui.restartJourney |
| [824](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:824) | button | close-mixer-bottom | type=button · label=ui.close |
| [842](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:842) | button | final-challenge-yes | type=button · label=ui.finalChallengeYes |
| [843](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:843) | button | final-challenge-no | type=button · label=ui.finalChallengeNo |
| [844](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:844) | button | final-challenge-skip | type=button · label=ui.skipForNow |
| [855](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:855) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [856](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:856) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [863](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:863) | button | btn-mixer | type=button |
| [864](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:864) | button | pause-meditation | type=button |
| [865](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:865) | button | skip-meditation | type=button |
| [868](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:868) | button | stop-meditation | type=button |
| [876](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:876) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [893](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:893) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [897](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:897) | button | close-completion |  |

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
