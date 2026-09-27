# Screen and control inventory

Source snapshot: 6c69ae0 CP-MOD-153 baseline + uncommitted CP-MOD-154/155/156/157/158/159/160/161/162/163/164/165/166/167 + uncommitted CP-THEME-IMPL-001/002/003 (production baseline 4cad261) · 2026-09-27.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [47](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:47) | select | language-select | ml: Malayalam; en: English |
| [55](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:55) | select | display-language-select | en: English; ml: Malayalam |
| [63](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:63) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [67](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:67) | button | test-voice |  |
| [72](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:72) | input | no-frequency-mode-toggle | type=checkbox |
| [73](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:73) | input | no-mantra-mode-toggle | type=checkbox |
| [78](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:78) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [89](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:89) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [90](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:90) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [94](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:94) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [95](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:95) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [102](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:102) | input | corpse-pose-toggle | type=checkbox |
| [105](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:105) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [106](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:106) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [107](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:107) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [108](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:108) | input | balasana | type=checkbox · value=balasana |
| [109](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:109) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [115](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:115) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [120](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:120) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [125](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:125) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [128](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:128) | input | bath-session-toggle | type=checkbox |
| [131](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:131) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [143](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:143) | input | deity-path | type=radio · value=none |
| [144](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:144) | input | deity-path | type=radio · value=shakthi |
| [145](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:145) | input | deity-path | type=radio · value=shiva |
| [151](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:151) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [156](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:156) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [174](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:174) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [179](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:179) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [184](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:184) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [189](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:189) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [199](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:199) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [206](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:206) | input | upload-script-file | type=file |
| [210](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:210) | input | script-url-input | type=text |
| [211](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:211) | button | load-script-url |  |
| [220](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:220) | button | app-version-unlock | type=button |
| [224](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:224) | input | advanced-features-toggle | type=checkbox |
| [227](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:227) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [229](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:229) | button | save-config |  |
| [230](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:230) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [239](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:239) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [249](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:249) | button | export-settings | type=button · label=ui.exportSettings |
| [253](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:253) | input | import-settings-file | type=file |
| [254](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:254) | button | import-settings | type=button · label=ui.importSettings |
| [258](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:258) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [266](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:266) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [274](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:274) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [279](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:279) | button | start-experiment | type=button · label=ui.runExperiment |
| [280](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:280) | button | close-experiment | type=button · label=ui.backToSettings |
| [285](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:285) | button | settings-help-close | type=button |
| [292](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:292) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [300](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:300) | button | advanced-password-close | type=button |
| [305](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:305) | input | advanced-password-input | type=password |
| [306](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:306) | button | advanced-password-reveal | type=button |
| [309](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:309) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [310](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:310) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [321](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:321) | input | shots-toggle | type=checkbox |
| [326](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:326) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [336](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:336) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [340](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:340) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [347](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:347) | input | box-breathing-experience-toggle | type=checkbox |
| [349](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:349) | input | visualization-addon-toggle | type=checkbox |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [352](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:352) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [356](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:356) | input | dharana-addon-toggle | type=checkbox |
| [358](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:358) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [359](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:359) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [363](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:363) | input | body-scan-addon-toggle | type=checkbox |
| [365](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:365) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [369](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:369) | input | noting-addon-toggle | type=checkbox |
| [372](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:372) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [381](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:381) | input | root | type=checkbox · value=root |
| [382](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:382) | input | sacral | type=checkbox · value=sacral |
| [383](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:383) | input | solar | type=checkbox · value=solar |
| [384](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:384) | input | heart | type=checkbox · value=heart |
| [385](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:385) | input | throat | type=checkbox · value=throat |
| [386](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:386) | input | thirdeye | type=checkbox · value=thirdeye |
| [387](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:387) | input | crown | type=checkbox · value=crown |
| [393](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:393) | input | hooponopono-experience-toggle | type=checkbox |
| [395](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:395) | input | undo-unlearn-addon-toggle | type=checkbox |
| [398](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:398) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [405](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:405) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [419](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:419) | input | drone-duration-mode | type=radio · value=beginner |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | input | drone-duration-mode | type=radio · value=intermediate |
| [427](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:427) | input | drone-duration-mode | type=radio · value=advanced |
| [431](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:431) | input | drone-duration-mode | type=radio · value=expert |
| [444](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:444) | input | intention-input | type=text |
| [450](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:450) | input | returning-journey-toggle | type=checkbox |
| [454](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:454) | input | journey-video-prelude-toggle | type=checkbox |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | high-energy-toggle | type=checkbox |
| [467](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:467) | input | sleep-mode-toggle | type=checkbox |
| [471](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:471) | input | music-only-toggle | type=checkbox |
| [475](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:475) | input | yoga-experience-toggle | type=checkbox |
| [487](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:487) | input | perineal-care-toggle | type=checkbox |
| [491](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:491) | input | massage-toggle | type=checkbox |
| [495](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:495) | input | assisted-bathing-toggle | type=checkbox |
| [503](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:503) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [508](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:508) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [514](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:514) | input | mood-relaxation-intention-toggle | type=checkbox |
| [516](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:516) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | input | pleasure-ambience-url | type=url |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [518](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:518) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | button | Decrease value | type=button |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | button | Increase value | type=button |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | button | Decrease value | type=button |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | button | Increase value | type=button |
| [528](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:528) | button | start-meditation |  |
| [529](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:529) | button | open-settings |  |
| [530](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:530) | button | begin-consultation | type=button |
| [539](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:539) | button | guide-controlled-continue | type=button |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [639](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:639) | button | close-mixer | type=button |
| [645](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:645) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [646](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:646) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [647](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:647) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [648](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:648) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [649](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:649) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [650](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:650) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [654](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:654) | summary | Voice Tuning ⌄ |  |
| [659](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:659) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [660](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:660) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [661](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:661) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [662](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:662) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | button | Soft | type=button · label=ui.voicePresetSoft |
| [665](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:665) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [667](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:667) | button | Clear | type=button · label=ui.voicePresetClear |
| [669](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:669) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [675](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:675) | summary | Background Music ⌄ |  |
| [680](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:680) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [688](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:688) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [700](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:700) | input | audio-filters-toggle | type=checkbox |
| [701](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:701) | input | eyes-close-mode-toggle | type=checkbox |
| [703](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:703) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [707](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:707) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [709](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:709) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [714](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:714) | button | restart-meditation | type=button · label=ui.restartJourney |
| [715](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:715) | button | close-mixer-bottom | type=button · label=ui.close |
| [725](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:725) | button | btn-mixer |  |
| [726](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:726) | button | pause-meditation |  |
| [727](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:727) | button | stop-meditation |  |
| [745](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:745) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [749](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:749) | button | close-completion |  |

## docs/assesment.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [102](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:102) | button | fontDown | type=button |
| [103](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:103) | button | fontReset | type=button |
| [104](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:104) | button | fontUp | type=button |
| [107](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:107) | button | translateBtn | type=button |
| [114](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:114) | a | ← Meditation Room | href=../index.html |
| [125](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:125) | a | Return to Settings | href=../index.html |
| [130](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:130) | button | retryButton | type=button |
| [137](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:137) | button | choiceLeft | type=button |
| [138](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:138) | button | choiceRight | type=button |
| [141](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:141) | button | equalChoice | type=button |
| [142](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:142) | button | skipChoice | type=button |
| [143](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:143) | button | undoAnswer | type=button |
| [163](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:163) | button | undoResult | type=button |
| [164](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:164) | button | newAssessment | type=button |
| [165](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:165) | a | Return to Meditation Room | href=../index.html |

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
