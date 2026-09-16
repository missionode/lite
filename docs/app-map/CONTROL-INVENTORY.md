# Screen and control inventory

Source snapshot: 13a6089 + uncommitted Advanced Features password gate · 2026-09-15.

This inventories static UI declarations in the three meditation HTML entry pages. Dynamic consultation radio answers/notes, translated option lists, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [35](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:35) | button | settings-help-button | type=button |
| [45](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:45) | select | language-select | ml: Malayalam; en: English |
| [53](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:53) | select | display-language-select | en: English; ml: Malayalam |
| [61](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:61) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [65](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:65) | button | test-voice |  |
| [70](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:70) | input | no-frequency-mode-toggle | type=checkbox |
| [71](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:71) | input | no-mantra-mode-toggle | type=checkbox |
| [76](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:76) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [87](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:87) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [88](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:88) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [92](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:92) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [93](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:93) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [100](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:100) | input | corpse-pose-toggle | type=checkbox |
| [103](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:103) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [104](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:104) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [105](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:105) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [106](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:106) | input | balasana | type=checkbox · value=balasana |
| [107](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:107) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [113](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:113) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [118](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:118) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [123](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:123) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [126](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:126) | input | bath-session-toggle | type=checkbox |
| [129](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:129) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [141](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:141) | input | deity-path | type=radio · value=none |
| [142](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:142) | input | deity-path | type=radio · value=shakthi |
| [143](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:143) | input | deity-path | type=radio · value=shiva |
| [149](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:149) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [167](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:167) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [172](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:172) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [177](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:177) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [182](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:182) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [192](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:192) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [199](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:199) | input | upload-script-file | type=file |
| [203](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:203) | input | script-url-input | type=text |
| [204](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:204) | button | load-script-url |  |
| [213](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:213) | button | app-version-unlock | type=button |
| [217](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:217) | input | advanced-features-toggle | type=checkbox |
| [220](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:220) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [222](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:222) | button | save-config |  |
| [223](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:223) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [232](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:232) | button | export-settings | type=button · label=ui.exportSettings |
| [236](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:236) | input | import-settings-file | type=file |
| [237](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:237) | button | import-settings | type=button · label=ui.importSettings |
| [241](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:241) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [249](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:249) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [257](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:257) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [262](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:262) | button | start-experiment | type=button · label=ui.runExperiment |
| [263](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:263) | button | close-experiment | type=button · label=ui.backToSettings |
| [268](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:268) | button | settings-help-close | type=button |
| [275](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:275) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [283](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:283) | button | advanced-password-close | type=button |
| [288](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:288) | input | advanced-password-input | type=password |
| [289](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:289) | button | advanced-password-reveal | type=button |
| [292](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:292) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [293](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:293) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [304](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:304) | input | shots-toggle | type=checkbox |
| [309](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:309) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [319](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:319) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [323](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:323) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [330](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:330) | input | box-breathing-experience-toggle | type=checkbox |
| [332](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:332) | input | dharana-addon-toggle | type=checkbox |
| [334](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:334) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [335](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:335) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [339](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:339) | input | visualization-addon-toggle | type=checkbox |
| [341](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:341) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [342](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:342) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | input | root | type=checkbox · value=root |
| [352](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:352) | input | sacral | type=checkbox · value=sacral |
| [353](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:353) | input | solar | type=checkbox · value=solar |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | input | heart | type=checkbox · value=heart |
| [355](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:355) | input | throat | type=checkbox · value=throat |
| [356](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:356) | input | thirdeye | type=checkbox · value=thirdeye |
| [357](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:357) | input | crown | type=checkbox · value=crown |
| [362](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:362) | input | hooponopono-experience-toggle | type=checkbox |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [372](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:372) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [380](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:380) | input | drone-duration-mode | type=radio · value=beginner |
| [384](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:384) | input | drone-duration-mode | type=radio · value=intermediate |
| [388](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:388) | input | drone-duration-mode | type=radio · value=advanced |
| [392](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:392) | input | drone-duration-mode | type=radio · value=expert |
| [405](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:405) | input | intention-input | type=text |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | input | returning-journey-toggle | type=checkbox |
| [415](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:415) | input | journey-video-prelude-toggle | type=checkbox |
| [424](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:424) | input | high-energy-toggle | type=checkbox |
| [428](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:428) | input | sleep-mode-toggle | type=checkbox |
| [432](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:432) | input | music-only-toggle | type=checkbox |
| [436](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:436) | input | yoga-experience-toggle | type=checkbox |
| [448](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:448) | input | perineal-care-toggle | type=checkbox |
| [452](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:452) | input | massage-toggle | type=checkbox |
| [456](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:456) | input | assisted-bathing-toggle | type=checkbox |
| [464](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:464) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [469](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:469) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [475](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:475) | input | mood-relaxation-intention-toggle | type=checkbox |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [478](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:478) | input | pleasure-ambience-url | type=url |
| [478](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:478) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | button | Decrease value | type=button |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | button | Increase value | type=button |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | button | Decrease value | type=button |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | button | Increase value | type=button |
| [489](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:489) | button | start-meditation |  |
| [490](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:490) | button | open-settings |  |
| [491](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:491) | button | begin-consultation | type=button |
| [500](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:500) | button | guide-controlled-continue | type=button |
| [589](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:589) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [598](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:598) | button | close-mixer | type=button |
| [604](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:604) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [605](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:605) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [606](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:606) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [607](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:607) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [608](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:608) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [609](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:609) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [613](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:613) | summary | Voice Tuning ⌄ |  |
| [618](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:618) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [619](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:619) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [620](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:620) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [621](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:621) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [623](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:623) | button | Soft | type=button · label=ui.voicePresetSoft |
| [624](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:624) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [625](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:625) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | button | Clear | type=button · label=ui.voicePresetClear |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [634](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:634) | summary | Background Music ⌄ |  |
| [639](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:639) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [647](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:647) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [659](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:659) | input | audio-filters-toggle | type=checkbox |
| [660](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:660) | input | eyes-close-mode-toggle | type=checkbox |
| [662](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:662) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [666](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:666) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [668](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:668) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [673](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:673) | button | restart-meditation | type=button · label=ui.restartJourney |
| [674](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:674) | button | close-mixer-bottom | type=button · label=ui.close |
| [684](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:684) | button | btn-mixer |  |
| [685](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:685) | button | pause-meditation |  |
| [686](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:686) | button | stop-meditation |  |
| [704](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:704) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [708](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:708) | button | close-completion |  |

## docs/assesment.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [244](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:244) | button | fontDown |  |
| [245](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:245) | button | fontReset |  |
| [246](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:246) | button | fontUp |  |
| [249](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:249) | button | translateBtn |  |
| [257](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:257) | a | Back to meditation lobby | href=../index.html |
| [270](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:270) | button | newAssessment | type=button |
| [271](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:271) | a | lobbyLink | href=../index.html |
| [696](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:696) | input | ${c.id}-${qi} | type=radio · value=aligned |
| [701](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:701) | input | ${c.id}-${qi} | type=radio · value=concern-${oi} |
| [706](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:706) | input | ${c.id}-${qi} | type=radio · value=unsure |

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
- Consultation generates seven cards with five question groups each, response choices and a notes textarea per card. It persists each response immediately.
- Repertory generates a Prepare Shot anchor for each validated catalog row and filters the rows during search.
- Guide Continue is one shared control whose label and availability change with care/Yoga stage.
- Completion Earn link is revealed after a timer only for eligible meditation languages.
- Narration ticker text, progress dots, fullscreen reveal state and canvas visuals are dynamic output surfaces.

## Screen and overlay inventory

Six switchable application screens: config-screen, experiment-screen, lobby-screen, icebreaker-screen, breathing-screen and meditation-screen. Additional surfaces: splash-screen, settings-help-modal, journey-video-prelude, volume-mixer, completion-modal and session-overlay. Consultation and repertory are separate documents with their own navigation and persistent state.
