# Screen and control inventory

Source snapshot: b967a5f production + uncommitted narration and No Frequency default updates · 2026-09-30.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [47](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:47) | select | language-select | ml: Malayalam; en: English |
| [55](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:55) | select | display-language-select | en: English; ml: Malayalam |
| [63](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:63) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [68](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:68) | button | test-voice |  |
| [73](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:73) | input | no-frequency-mode-toggle | type=checkbox |
| [74](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:74) | input | no-mantra-mode-toggle | type=checkbox |
| [79](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:79) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [90](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:90) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [91](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:91) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [95](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:95) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [96](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:96) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [103](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:103) | input | corpse-pose-toggle | type=checkbox |
| [106](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:106) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [107](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:107) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [108](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:108) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [109](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:109) | input | balasana | type=checkbox · value=balasana |
| [110](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:110) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [116](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:116) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [121](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:121) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [126](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:126) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [129](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:129) | input | bath-session-toggle | type=checkbox |
| [132](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:132) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [144](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:144) | input | deity-path | type=radio · value=none |
| [145](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:145) | input | deity-path | type=radio · value=shakthi |
| [146](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:146) | input | deity-path | type=radio · value=shiva |
| [152](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:152) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [157](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:157) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [175](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:175) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [180](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:180) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [185](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:185) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [190](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:190) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [200](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:200) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [207](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:207) | input | upload-script-file | type=file |
| [211](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:211) | input | script-url-input | type=text |
| [212](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:212) | button | load-script-url |  |
| [221](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:221) | button | app-version-unlock | type=button |
| [225](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:225) | input | advanced-features-toggle | type=checkbox |
| [228](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:228) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [230](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:230) | button | save-config |  |
| [231](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:231) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [240](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:240) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [250](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:250) | button | export-settings | type=button · label=ui.exportSettings |
| [254](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:254) | input | import-settings-file | type=file |
| [255](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:255) | button | import-settings | type=button · label=ui.importSettings |
| [259](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:259) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [267](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:267) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [275](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:275) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [281](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:281) | button | start-experiment | type=button · label=ui.runExperiment |
| [282](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:282) | button | open-secret-body-game | type=button · label=ui.secretBodyGame |
| [283](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:283) | button | close-experiment | type=button · label=ui.backToSettings |
| [294](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:294) | button | settings-help-close | type=button |
| [301](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:301) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [309](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:309) | button | advanced-password-close | type=button |
| [314](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:314) | input | advanced-password-input | type=password |
| [315](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:315) | button | advanced-password-reveal | type=button |
| [318](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:318) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [319](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:319) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [330](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:330) | input | shots-toggle | type=checkbox |
| [335](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:335) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [345](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:345) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [349](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:349) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [356](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:356) | input | box-breathing-experience-toggle | type=checkbox |
| [358](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:358) | input | visualization-addon-toggle | type=checkbox |
| [360](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:360) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [361](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:361) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [365](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:365) | input | dharana-addon-toggle | type=checkbox |
| [367](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:367) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [368](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:368) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [372](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:372) | input | body-scan-addon-toggle | type=checkbox |
| [374](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:374) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [378](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:378) | input | noting-addon-toggle | type=checkbox |
| [381](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:381) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | input | quiet-courage-addon-toggle | type=checkbox |
| [393](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:393) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [397](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:397) | input | confidence-visualization-addon-toggle | type=checkbox |
| [400](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:400) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [404](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:404) | input | deep-secrets-addon-toggle | type=checkbox |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | input | final-challenge-addon-toggle | type=checkbox |
| [420](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:420) | input | root | type=checkbox · value=root |
| [421](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:421) | input | sacral | type=checkbox · value=sacral |
| [422](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:422) | input | solar | type=checkbox · value=solar |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | input | heart | type=checkbox · value=heart |
| [424](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:424) | input | throat | type=checkbox · value=throat |
| [425](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:425) | input | thirdeye | type=checkbox · value=thirdeye |
| [426](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:426) | input | crown | type=checkbox · value=crown |
| [428](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:428) | input | reverse-journey-toggle | type=checkbox |
| [433](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:433) | input | hooponopono-experience-toggle | type=checkbox |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | input | undo-unlearn-addon-toggle | type=checkbox |
| [438](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:438) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [445](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:445) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [451](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:451) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [459](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:459) | input | drone-duration-mode | type=radio · value=beginner |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | drone-duration-mode | type=radio · value=intermediate |
| [467](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:467) | input | drone-duration-mode | type=radio · value=advanced |
| [471](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:471) | input | drone-duration-mode | type=radio · value=expert |
| [484](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:484) | input | intention-input | type=text |
| [490](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:490) | input | returning-journey-toggle | type=checkbox |
| [494](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:494) | input | journey-video-prelude-toggle | type=checkbox |
| [503](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:503) | input | high-energy-toggle | type=checkbox |
| [507](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:507) | input | sleep-mode-toggle | type=checkbox |
| [511](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:511) | input | music-only-toggle | type=checkbox |
| [515](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:515) | input | yoga-experience-toggle | type=checkbox |
| [527](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:527) | input | perineal-care-toggle | type=checkbox |
| [531](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:531) | input | massage-toggle | type=checkbox |
| [535](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:535) | input | assisted-bathing-toggle | type=checkbox |
| [543](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:543) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [548](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:548) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [554](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:554) | input | mood-relaxation-intention-toggle | type=checkbox |
| [556](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:556) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [557](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:557) | input | pleasure-ambience-url | type=url |
| [557](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:557) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [558](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:558) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [559](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:559) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [559](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:559) | button | Decrease value | type=button |
| [559](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:559) | button | Increase value | type=button |
| [560](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:560) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [560](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:560) | button | Decrease value | type=button |
| [560](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:560) | button | Increase value | type=button |
| [568](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:568) | button | start-meditation |  |
| [569](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:569) | button | open-settings |  |
| [570](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:570) | button | begin-consultation | type=button |
| [579](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:579) | button | guide-controlled-continue | type=button |
| [653](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:653) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [662](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:662) | button | close-mixer | type=button |
| [668](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:668) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [669](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:669) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [670](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:670) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [671](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:671) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [672](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:672) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [673](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:673) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [677](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:677) | summary | Voice Tuning ⌄ |  |
| [682](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:682) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [683](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:683) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [684](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:684) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [685](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:685) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [687](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:687) | button | Soft | type=button · label=ui.voicePresetSoft |
| [688](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:688) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [689](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:689) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [690](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:690) | button | Clear | type=button · label=ui.voicePresetClear |
| [692](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:692) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [698](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:698) | summary | Background Music ⌄ |  |
| [703](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:703) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [711](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:711) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [723](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:723) | input | audio-filters-toggle | type=checkbox |
| [724](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:724) | input | eyes-close-mode-toggle | type=checkbox |
| [726](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:726) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [730](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:730) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [732](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:732) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [737](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:737) | button | restart-meditation | type=button · label=ui.restartJourney |
| [738](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:738) | button | close-mixer-bottom | type=button · label=ui.close |
| [756](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:756) | button | final-challenge-yes | type=button · label=ui.finalChallengeYes |
| [757](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:757) | button | final-challenge-no | type=button · label=ui.finalChallengeNo |
| [758](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:758) | button | final-challenge-skip | type=button · label=ui.skipForNow |
| [768](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:768) | button | btn-mixer | type=button |
| [769](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:769) | button | pause-meditation | type=button |
| [770](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:770) | button | skip-meditation | type=button |
| [773](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:773) | button | stop-meditation | type=button |
| [791](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:791) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [795](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:795) | button | close-completion |  |

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
