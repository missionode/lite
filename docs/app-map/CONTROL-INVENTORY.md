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
| [370](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:370) | input | shots-toggle | type=checkbox |
| [374](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:374) | input | mixed-shots-toggle | type=checkbox |
| [381](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:381) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; deep_focus: Deep Focus Shot; mental_clarity: Mental Clarity Shot; joy_ease: Inner Ease &amp; Joy Shot; warm_heart: Warm Heart &amp; Connection Shot; sensory_awareness: Sensory Awareness Shot; fresh_perception: Fresh Perception Shot; humming_anchor: Breath &amp; Humming Anchor Shot; body_renewal: Body Renewal &amp; Balance Shot; earth_grounding: Deep Grounding &amp; Earth Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; golden_ratio: Golden Ratio Shot; sleep: Sleep Shot; custom: Custom Shot |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | input | deep_focus | type=checkbox · value=deep_focus |
| [404](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:404) | input | mental_clarity | type=checkbox · value=mental_clarity |
| [405](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:405) | input | joy_ease | type=checkbox · value=joy_ease |
| [406](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:406) | input | warm_heart | type=checkbox · value=warm_heart |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | input | sensory_awareness | type=checkbox · value=sensory_awareness |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | input | fresh_perception | type=checkbox · value=fresh_perception |
| [409](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:409) | input | humming_anchor | type=checkbox · value=humming_anchor |
| [410](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:410) | input | body_renewal | type=checkbox · value=body_renewal |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | input | earth_grounding | type=checkbox · value=earth_grounding |
| [412](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:412) | input | high_energy | type=checkbox · value=high_energy |
| [413](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:413) | input | anesthetic | type=checkbox · value=anesthetic |
| [414](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:414) | input | mood_relaxation | type=checkbox · value=mood_relaxation |
| [419](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:419) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | select | shot-speaker-select | both: Both speakers (or headphones); left: Single speaker 1; right: Single speaker 2 |
| [428](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:428) | button | test-shot-speaker | type=button · label=ui.testShotSpeaker |
| [433](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:433) | button | activate-shot | type=button |
| [434](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:434) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [441](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:441) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [442](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:442) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [443](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:443) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [444](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:444) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [451](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:451) | input | box-breathing-experience-toggle | type=checkbox |
| [453](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:453) | input | visualization-addon-toggle | type=checkbox |
| [455](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:455) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [456](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:456) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [460](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:460) | input | dharana-addon-toggle | type=checkbox |
| [462](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:462) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [467](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:467) | input | body-scan-addon-toggle | type=checkbox |
| [469](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:469) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [473](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:473) | input | noting-addon-toggle | type=checkbox |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [485](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:485) | input | quiet-courage-addon-toggle | type=checkbox |
| [488](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:488) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [492](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:492) | input | confidence-visualization-addon-toggle | type=checkbox |
| [495](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:495) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [499](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:499) | input | deep-secrets-addon-toggle | type=checkbox |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [511](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:511) | input | root | type=checkbox · value=root |
| [512](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:512) | input | sacral | type=checkbox · value=sacral |
| [513](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:513) | input | solar | type=checkbox · value=solar |
| [514](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:514) | input | heart | type=checkbox · value=heart |
| [515](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:515) | input | throat | type=checkbox · value=throat |
| [516](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:516) | input | thirdeye | type=checkbox · value=thirdeye |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | input | crown | type=checkbox · value=crown |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | input | reverse-journey-toggle | type=checkbox |
| [524](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:524) | input | hooponopono-experience-toggle | type=checkbox |
| [526](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:526) | input | undo-unlearn-addon-toggle | type=checkbox |
| [529](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:529) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [536](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:536) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [542](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:542) | input | per-chakra-time-toggle | type=checkbox |
| [548](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:548) | button | per-chakra-time-reset | type=button · label=ui.perChakraTimeReset |
| [549](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:549) | button | per-chakra-time-assessment | type=button · label=ui.perChakraTimeFromAssessment |
| [552](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:552) | button | per-chakra-time-apply | type=button · label=ui.perChakraTimeApply |
| [557](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:557) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [565](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:565) | input | drone-duration-mode | type=radio · value=beginner |
| [569](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:569) | input | drone-duration-mode | type=radio · value=intermediate |
| [573](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:573) | input | drone-duration-mode | type=radio · value=advanced |
| [577](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:577) | input | drone-duration-mode | type=radio · value=expert |
| [590](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:590) | input | intention-input | type=text |
| [596](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:596) | input | returning-journey-toggle | type=checkbox |
| [600](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:600) | input | journey-video-prelude-toggle | type=checkbox |
| [603](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:603) | button | play-video-introduction | type=button · label=ui.playVideoIntroduction |
| [610](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:610) | input | high-energy-toggle | type=checkbox |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | input | sleep-mode-toggle | type=checkbox |
| [618](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:618) | input | music-only-toggle | type=checkbox |
| [622](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:622) | input | yoga-experience-toggle | type=checkbox |
| [634](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:634) | input | perineal-care-toggle | type=checkbox |
| [638](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:638) | input | massage-toggle | type=checkbox |
| [642](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:642) | input | assisted-bathing-toggle | type=checkbox |
| [650](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:650) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [655](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:655) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [661](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:661) | input | mood-relaxation-intention-toggle | type=checkbox |
| [663](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:663) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | input | pleasure-ambience-url | type=url |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [665](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:665) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | button | Decrease value | type=button |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | button | Increase value | type=button |
| [667](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:667) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [667](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:667) | button | Decrease value | type=button |
| [667](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:667) | button | Increase value | type=button |
| [676](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:676) | button | optional-service-info-yes | type=button · label=ui.optionalServiceYes |
| [677](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:677) | button | optional-service-info-no | type=button · label=ui.optionalServiceNo |
| [688](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:688) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [693](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:693) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [698](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:698) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [703](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:703) | button | open-role-play | type=button · label=ui.rpOpen |
| [716](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:716) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [719](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:719) | button | start-meditation |  |
| [720](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:720) | button | open-settings |  |
| [721](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:721) | button | begin-consultation | type=button |
| [730](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:730) | button | guide-controlled-continue | type=button |
| [807](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:807) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [816](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:816) | button | close-mixer | type=button |
| [822](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:822) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [823](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:823) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [824](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:824) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [825](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:825) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [826](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:826) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [827](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:827) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [831](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:831) | summary | Voice Tuning ⌄ |  |
| [836](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:836) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [837](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:837) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [838](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:838) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [839](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:839) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [841](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:841) | button | Soft | type=button · label=ui.voicePresetSoft |
| [842](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:842) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [843](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:843) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [844](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:844) | button | Clear | type=button · label=ui.voicePresetClear |
| [846](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:846) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [852](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:852) | summary | Background Music ⌄ |  |
| [857](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:857) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [865](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:865) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [877](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:877) | input | audio-filters-toggle | type=checkbox |
| [878](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:878) | input | eyes-close-mode-toggle | type=checkbox |
| [880](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:880) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [884](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:884) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [886](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:886) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [891](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:891) | button | restart-meditation | type=button · label=ui.restartJourney |
| [892](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:892) | button | close-mixer-bottom | type=button · label=ui.close |
| [904](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:904) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [905](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:905) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [912](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:912) | button | btn-mixer | type=button |
| [913](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:913) | button | pause-meditation | type=button |
| [914](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:914) | button | skip-meditation | type=button |
| [917](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:917) | button | stop-meditation | type=button |
| [925](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:925) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [942](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:942) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [946](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:946) | button | close-completion |  |

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
