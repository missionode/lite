# Screen and control inventory

Source snapshot: 81d4474 production base + Tamil/Indic Piper voice release/166/167 + uncommitted CP-THEME-IMPL-001/002/003 (production baseline 4cad261) · 2026-09-28.

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
| [280](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:280) | button | start-experiment | type=button · label=ui.runExperiment |
| [281](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:281) | button | close-experiment | type=button · label=ui.backToSettings |
| [286](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:286) | button | settings-help-close | type=button |
| [293](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:293) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [301](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:301) | button | advanced-password-close | type=button |
| [306](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:306) | input | advanced-password-input | type=password |
| [307](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:307) | button | advanced-password-reveal | type=button |
| [310](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:310) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [311](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:311) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [322](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:322) | input | shots-toggle | type=checkbox |
| [327](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:327) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [337](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:337) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [341](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:341) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [348](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:348) | input | box-breathing-experience-toggle | type=checkbox |
| [350](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:350) | input | visualization-addon-toggle | type=checkbox |
| [352](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:352) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [353](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:353) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [357](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:357) | input | dharana-addon-toggle | type=checkbox |
| [359](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:359) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [360](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:360) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [364](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:364) | input | body-scan-addon-toggle | type=checkbox |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [370](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:370) | input | noting-addon-toggle | type=checkbox |
| [373](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:373) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [382](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:382) | input | root | type=checkbox · value=root |
| [383](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:383) | input | sacral | type=checkbox · value=sacral |
| [384](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:384) | input | solar | type=checkbox · value=solar |
| [385](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:385) | input | heart | type=checkbox · value=heart |
| [386](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:386) | input | throat | type=checkbox · value=throat |
| [387](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:387) | input | thirdeye | type=checkbox · value=thirdeye |
| [388](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:388) | input | crown | type=checkbox · value=crown |
| [394](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:394) | input | hooponopono-experience-toggle | type=checkbox |
| [396](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:396) | input | undo-unlearn-addon-toggle | type=checkbox |
| [399](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:399) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [406](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:406) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [412](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:412) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [420](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:420) | input | drone-duration-mode | type=radio · value=beginner |
| [424](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:424) | input | drone-duration-mode | type=radio · value=intermediate |
| [428](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:428) | input | drone-duration-mode | type=radio · value=advanced |
| [432](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:432) | input | drone-duration-mode | type=radio · value=expert |
| [445](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:445) | input | intention-input | type=text |
| [451](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:451) | input | returning-journey-toggle | type=checkbox |
| [455](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:455) | input | journey-video-prelude-toggle | type=checkbox |
| [464](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:464) | input | high-energy-toggle | type=checkbox |
| [468](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:468) | input | sleep-mode-toggle | type=checkbox |
| [472](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:472) | input | music-only-toggle | type=checkbox |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | input | yoga-experience-toggle | type=checkbox |
| [488](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:488) | input | perineal-care-toggle | type=checkbox |
| [492](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:492) | input | massage-toggle | type=checkbox |
| [496](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:496) | input | assisted-bathing-toggle | type=checkbox |
| [504](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:504) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [509](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:509) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [515](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:515) | input | mood-relaxation-intention-toggle | type=checkbox |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [518](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:518) | input | pleasure-ambience-url | type=url |
| [518](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:518) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [519](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:519) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | button | Decrease value | type=button |
| [520](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:520) | button | Increase value | type=button |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | button | Decrease value | type=button |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | button | Increase value | type=button |
| [529](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:529) | button | start-meditation |  |
| [530](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:530) | button | open-settings |  |
| [531](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:531) | button | begin-consultation | type=button |
| [540](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:540) | button | guide-controlled-continue | type=button |
| [631](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:631) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [640](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:640) | button | close-mixer | type=button |
| [646](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:646) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [647](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:647) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [648](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:648) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [649](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:649) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [650](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:650) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [651](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:651) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [655](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:655) | summary | Voice Tuning ⌄ |  |
| [660](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:660) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [661](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:661) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [662](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:662) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [663](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:663) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [665](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:665) | button | Soft | type=button · label=ui.voicePresetSoft |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [667](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:667) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [668](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:668) | button | Clear | type=button · label=ui.voicePresetClear |
| [670](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:670) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [676](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:676) | summary | Background Music ⌄ |  |
| [681](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:681) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [689](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:689) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [701](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:701) | input | audio-filters-toggle | type=checkbox |
| [702](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:702) | input | eyes-close-mode-toggle | type=checkbox |
| [704](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:704) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [708](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:708) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [710](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:710) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [715](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:715) | button | restart-meditation | type=button · label=ui.restartJourney |
| [716](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:716) | button | close-mixer-bottom | type=button · label=ui.close |
| [726](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:726) | button | btn-mixer |  |
| [727](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:727) | button | pause-meditation |  |
| [728](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:728) | button | stop-meditation |  |
| [746](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:746) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [750](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:750) | button | close-completion |  |

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
