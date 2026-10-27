# Screen and control inventory

Source snapshot: production a176eb3 (live) + Syam custom Malayalam voice, Shots speaker choice, Activate in the Shots section, a get-ready countdown and the speaker choice on phones only, plus a Voice Tuner page (latest changes local, not yet pushed) · 2026-10-06.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [40](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:40) | button | benefits-safety-button | type=button · label=ui.faqButton |
| [41](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:41) | a | syllabus-link | href=docs/syllabus.html · label=ui.syllabusLink |
| [42](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:42) | a | petal-chart-link | href=docs/syllabus.html#petals · label=ui.petalChartLink |
| [50](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:50) | select | language-select | ml: Malayalam; en: English |
| [58](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:58) | select | display-language-select | en: English; ml: Malayalam |
| [66](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:66) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [72](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:72) | button | test-voice |  |
| [77](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:77) | input | no-frequency-mode-toggle | type=checkbox |
| [78](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:78) | input | no-mantra-mode-toggle | type=checkbox |
| [83](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:83) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [94](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:94) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [95](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:95) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [99](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:99) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [100](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:100) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [107](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:107) | input | corpse-pose-toggle | type=checkbox |
| [110](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:110) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [111](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:111) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [112](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:112) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [113](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:113) | input | balasana | type=checkbox · value=balasana |
| [114](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:114) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [120](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:120) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [125](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:125) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [130](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:130) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [133](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:133) | input | bath-session-toggle | type=checkbox |
| [136](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:136) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [148](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:148) | input | deity-path | type=radio · value=none |
| [149](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:149) | input | deity-path | type=radio · value=shakthi |
| [150](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:150) | input | deity-path | type=radio · value=shiva |
| [156](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:156) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [161](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:161) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [179](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:179) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [184](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:184) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [189](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:189) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [194](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:194) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [204](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:204) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [211](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:211) | input | upload-script-file | type=file |
| [215](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:215) | input | script-url-input | type=text |
| [216](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:216) | button | load-script-url |  |
| [225](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:225) | button | app-version-unlock | type=button |
| [229](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:229) | input | advanced-features-toggle | type=checkbox |
| [232](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:232) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [234](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:234) | button | save-config |  |
| [235](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:235) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [244](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:244) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [254](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:254) | button | export-settings | type=button · label=ui.exportSettings |
| [258](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:258) | input | import-settings-file | type=file |
| [259](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:259) | button | import-settings | type=button · label=ui.importSettings |
| [263](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:263) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [271](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:271) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [279](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:279) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [285](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:285) | button | start-experiment | type=button · label=ui.runExperiment |
| [286](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:286) | button | close-experiment | type=button · label=ui.backToSettings |
| [308](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:308) | button | settings-help-close | type=button |
| [315](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:315) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [316](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:316) | button | settings-help-faq | type=button · label=ui.faqButton |
| [324](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:324) | button | benefits-safety-close | type=button |
| [346](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:346) | button | advanced-password-close | type=button |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | input | advanced-password-input | type=password |
| [352](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:352) | button | advanced-password-reveal | type=button |
| [355](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:355) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [356](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:356) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [367](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:367) | input | shots-toggle | type=checkbox |
| [372](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:372) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; golden_ratio: Golden Ratio Shot; sleep: Sleep Shot; custom: Custom Shot |
| [383](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:383) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [387](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:387) | select | shot-speaker-select | both: Both speakers (or headphones); left: Single speaker 1; right: Single speaker 2 |
| [392](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:392) | button | test-shot-speaker | type=button · label=ui.testShotSpeaker |
| [397](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:397) | button | activate-shot | type=button |
| [398](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:398) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [405](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:405) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [406](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:406) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [415](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:415) | input | box-breathing-experience-toggle | type=checkbox |
| [417](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:417) | input | visualization-addon-toggle | type=checkbox |
| [419](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:419) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [420](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:420) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [424](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:424) | input | dharana-addon-toggle | type=checkbox |
| [426](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:426) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [427](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:427) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [431](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:431) | input | body-scan-addon-toggle | type=checkbox |
| [433](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:433) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [437](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:437) | input | noting-addon-toggle | type=checkbox |
| [440](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:440) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [449](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:449) | input | quiet-courage-addon-toggle | type=checkbox |
| [452](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:452) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [456](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:456) | input | confidence-visualization-addon-toggle | type=checkbox |
| [459](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:459) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | deep-secrets-addon-toggle | type=checkbox |
| [466](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:466) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [475](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:475) | input | root | type=checkbox · value=root |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | input | sacral | type=checkbox · value=sacral |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | solar | type=checkbox · value=solar |
| [478](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:478) | input | heart | type=checkbox · value=heart |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | input | throat | type=checkbox · value=throat |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | input | thirdeye | type=checkbox · value=thirdeye |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | input | crown | type=checkbox · value=crown |
| [483](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:483) | input | reverse-journey-toggle | type=checkbox |
| [488](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:488) | input | hooponopono-experience-toggle | type=checkbox |
| [490](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:490) | input | undo-unlearn-addon-toggle | type=checkbox |
| [493](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:493) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [500](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:500) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [506](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:506) | input | per-chakra-time-toggle | type=checkbox |
| [512](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:512) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [513](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:513) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [516](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:516) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [529](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:529) | input | drone-duration-mode | type=radio · value=beginner |
| [533](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:533) | input | drone-duration-mode | type=radio · value=intermediate |
| [537](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:537) | input | drone-duration-mode | type=radio · value=advanced |
| [541](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:541) | input | drone-duration-mode | type=radio · value=expert |
| [554](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:554) | input | intention-input | type=text |
| [560](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:560) | input | returning-journey-toggle | type=checkbox |
| [564](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:564) | input | journey-video-prelude-toggle | type=checkbox |
| [567](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:567) | button | play-video-introduction | type=button · label=ui.playVideoIntroduction |
| [574](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:574) | input | high-energy-toggle | type=checkbox |
| [578](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:578) | input | sleep-mode-toggle | type=checkbox |
| [582](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:582) | input | music-only-toggle | type=checkbox |
| [586](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:586) | input | yoga-experience-toggle | type=checkbox |
| [598](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:598) | input | perineal-care-toggle | type=checkbox |
| [602](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:602) | input | massage-toggle | type=checkbox |
| [606](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:606) | input | assisted-bathing-toggle | type=checkbox |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [619](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:619) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [625](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:625) | input | mood-relaxation-intention-toggle | type=checkbox |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | input | pleasure-ambience-url | type=url |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | button | Decrease value | type=button |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | button | Increase value | type=button |
| [631](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:631) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [631](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:631) | button | Decrease value | type=button |
| [631](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:631) | button | Increase value | type=button |
| [640](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:640) | button | optional-service-info-yes | type=button · label=ui.optionalServiceYes |
| [641](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:641) | button | optional-service-info-no | type=button · label=ui.optionalServiceNo |
| [652](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:652) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [657](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:657) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [662](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:662) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [667](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:667) | button | open-role-play | type=button · label=ui.rpOpen |
| [680](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:680) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [683](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:683) | button | start-meditation |  |
| [684](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:684) | button | open-settings |  |
| [685](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:685) | button | begin-consultation | type=button |
| [694](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:694) | button | guide-controlled-continue | type=button |
| [771](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:771) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [780](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:780) | button | close-mixer | type=button |
| [786](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:786) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [787](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:787) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [788](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:788) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [789](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:789) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [790](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:790) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [791](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:791) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [795](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:795) | summary | Voice Tuning ⌄ |  |
| [800](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:800) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [801](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:801) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [802](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:802) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [803](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:803) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [805](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:805) | button | Soft | type=button · label=ui.voicePresetSoft |
| [806](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:806) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [807](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:807) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [808](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:808) | button | Clear | type=button · label=ui.voicePresetClear |
| [810](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:810) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [816](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:816) | summary | Background Music ⌄ |  |
| [821](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:821) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [829](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:829) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [841](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:841) | input | audio-filters-toggle | type=checkbox |
| [842](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:842) | input | eyes-close-mode-toggle | type=checkbox |
| [844](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:844) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [848](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:848) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [850](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:850) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [855](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:855) | button | restart-meditation | type=button · label=ui.restartJourney |
| [856](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:856) | button | close-mixer-bottom | type=button · label=ui.close |
| [868](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:868) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [869](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:869) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [876](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:876) | button | btn-mixer | type=button |
| [877](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:877) | button | pause-meditation | type=button |
| [878](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:878) | button | skip-meditation | type=button |
| [881](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:881) | button | stop-meditation | type=button |
| [889](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:889) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [906](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:906) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [910](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:910) | button | close-completion |  |

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
