# Screen and control inventory

Source snapshot: 2b1b71f production baseline + uncommitted Skip/orientation release · 2026-09-29.

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
| [282](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:282) | button | close-experiment | type=button · label=ui.backToSettings |
| [288](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:288) | button | settings-help-close | type=button |
| [295](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:295) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [303](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:303) | button | advanced-password-close | type=button |
| [308](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:308) | input | advanced-password-input | type=password |
| [309](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:309) | button | advanced-password-reveal | type=button |
| [312](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:312) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [313](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:313) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [324](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:324) | input | shots-toggle | type=checkbox |
| [329](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:329) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [339](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:339) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [343](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:343) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [350](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:350) | input | box-breathing-experience-toggle | type=checkbox |
| [352](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:352) | input | visualization-addon-toggle | type=checkbox |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [355](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:355) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [359](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:359) | input | dharana-addon-toggle | type=checkbox |
| [361](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:361) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [362](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:362) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | input | body-scan-addon-toggle | type=checkbox |
| [368](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:368) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [372](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:372) | input | noting-addon-toggle | type=checkbox |
| [375](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:375) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [384](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:384) | input | root | type=checkbox · value=root |
| [385](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:385) | input | sacral | type=checkbox · value=sacral |
| [386](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:386) | input | solar | type=checkbox · value=solar |
| [387](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:387) | input | heart | type=checkbox · value=heart |
| [388](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:388) | input | throat | type=checkbox · value=throat |
| [389](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:389) | input | thirdeye | type=checkbox · value=thirdeye |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | input | crown | type=checkbox · value=crown |
| [396](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:396) | input | hooponopono-experience-toggle | type=checkbox |
| [398](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:398) | input | undo-unlearn-addon-toggle | type=checkbox |
| [401](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:401) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [414](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:414) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [422](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:422) | input | drone-duration-mode | type=radio · value=beginner |
| [426](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:426) | input | drone-duration-mode | type=radio · value=intermediate |
| [430](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:430) | input | drone-duration-mode | type=radio · value=advanced |
| [434](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:434) | input | drone-duration-mode | type=radio · value=expert |
| [447](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:447) | input | intention-input | type=text |
| [453](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:453) | input | returning-journey-toggle | type=checkbox |
| [457](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:457) | input | journey-video-prelude-toggle | type=checkbox |
| [466](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:466) | input | high-energy-toggle | type=checkbox |
| [470](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:470) | input | sleep-mode-toggle | type=checkbox |
| [474](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:474) | input | music-only-toggle | type=checkbox |
| [478](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:478) | input | yoga-experience-toggle | type=checkbox |
| [490](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:490) | input | perineal-care-toggle | type=checkbox |
| [494](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:494) | input | massage-toggle | type=checkbox |
| [498](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:498) | input | assisted-bathing-toggle | type=checkbox |
| [506](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:506) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [511](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:511) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | input | mood-relaxation-intention-toggle | type=checkbox |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | input | pleasure-ambience-url | type=url |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [522](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:522) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [522](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:522) | button | Decrease value | type=button |
| [522](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:522) | button | Increase value | type=button |
| [523](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:523) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [523](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:523) | button | Decrease value | type=button |
| [523](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:523) | button | Increase value | type=button |
| [531](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:531) | button | start-meditation |  |
| [532](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:532) | button | open-settings |  |
| [533](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:533) | button | begin-consultation | type=button |
| [542](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:542) | button | guide-controlled-continue | type=button |
| [632](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:632) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [641](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:641) | button | close-mixer | type=button |
| [647](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:647) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [648](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:648) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [649](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:649) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [650](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:650) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [651](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:651) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [652](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:652) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [656](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:656) | summary | Voice Tuning ⌄ |  |
| [661](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:661) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [662](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:662) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [663](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:663) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | button | Soft | type=button · label=ui.voicePresetSoft |
| [667](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:667) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [668](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:668) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [669](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:669) | button | Clear | type=button · label=ui.voicePresetClear |
| [671](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:671) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [677](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:677) | summary | Background Music ⌄ |  |
| [682](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:682) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [690](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:690) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [702](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:702) | input | audio-filters-toggle | type=checkbox |
| [703](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:703) | input | eyes-close-mode-toggle | type=checkbox |
| [705](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:705) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [709](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:709) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [711](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:711) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [716](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:716) | button | restart-meditation | type=button · label=ui.restartJourney |
| [717](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:717) | button | close-mixer-bottom | type=button · label=ui.close |
| [727](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:727) | button | btn-mixer |  |
| [728](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:728) | button | pause-meditation |  |
| [729](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:729) | button | skip-meditation | type=button · label=ui.skipCurrentItem |
| [730](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:730) | button | stop-meditation |  |
| [748](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:748) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [752](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:752) | button | close-completion |  |

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
