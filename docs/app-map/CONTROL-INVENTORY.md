# Screen and control inventory

Source snapshot: 3.45 release snapshot (parent 6337889) · 2026-09-17.

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
| [151](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:151) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [169](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:169) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [174](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:174) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [179](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:179) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [184](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:184) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [194](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:194) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [201](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:201) | input | upload-script-file | type=file |
| [205](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:205) | input | script-url-input | type=text |
| [206](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:206) | button | load-script-url |  |
| [215](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:215) | button | app-version-unlock | type=button |
| [219](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:219) | input | advanced-features-toggle | type=checkbox |
| [222](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:222) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [224](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:224) | button | save-config |  |
| [225](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:225) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [234](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:234) | button | export-settings | type=button · label=ui.exportSettings |
| [238](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:238) | input | import-settings-file | type=file |
| [239](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:239) | button | import-settings | type=button · label=ui.importSettings |
| [243](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:243) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [251](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:251) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [259](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:259) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [264](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:264) | button | start-experiment | type=button · label=ui.runExperiment |
| [265](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:265) | button | close-experiment | type=button · label=ui.backToSettings |
| [270](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:270) | button | settings-help-close | type=button |
| [277](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:277) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [285](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:285) | button | advanced-password-close | type=button |
| [290](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:290) | input | advanced-password-input | type=password |
| [291](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:291) | button | advanced-password-reveal | type=button |
| [294](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:294) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [295](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:295) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [306](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:306) | input | shots-toggle | type=checkbox |
| [311](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:311) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [321](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:321) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [325](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:325) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [332](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:332) | input | box-breathing-experience-toggle | type=checkbox |
| [334](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:334) | input | dharana-addon-toggle | type=checkbox |
| [336](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:336) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [337](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:337) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [341](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:341) | input | visualization-addon-toggle | type=checkbox |
| [343](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:343) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [344](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:344) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [353](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:353) | input | root | type=checkbox · value=root |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | input | sacral | type=checkbox · value=sacral |
| [355](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:355) | input | solar | type=checkbox · value=solar |
| [356](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:356) | input | heart | type=checkbox · value=heart |
| [357](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:357) | input | throat | type=checkbox · value=throat |
| [358](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:358) | input | thirdeye | type=checkbox · value=thirdeye |
| [359](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:359) | input | crown | type=checkbox · value=crown |
| [364](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:364) | input | hooponopono-experience-toggle | type=checkbox |
| [368](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:368) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [374](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:374) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [382](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:382) | input | drone-duration-mode | type=radio · value=beginner |
| [386](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:386) | input | drone-duration-mode | type=radio · value=intermediate |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | input | drone-duration-mode | type=radio · value=advanced |
| [394](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:394) | input | drone-duration-mode | type=radio · value=expert |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | input | intention-input | type=text |
| [413](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:413) | input | returning-journey-toggle | type=checkbox |
| [417](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:417) | input | journey-video-prelude-toggle | type=checkbox |
| [426](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:426) | input | high-energy-toggle | type=checkbox |
| [430](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:430) | input | sleep-mode-toggle | type=checkbox |
| [434](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:434) | input | music-only-toggle | type=checkbox |
| [438](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:438) | input | yoga-experience-toggle | type=checkbox |
| [450](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:450) | input | perineal-care-toggle | type=checkbox |
| [454](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:454) | input | massage-toggle | type=checkbox |
| [458](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:458) | input | assisted-bathing-toggle | type=checkbox |
| [466](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:466) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [471](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:471) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | mood-relaxation-intention-toggle | type=checkbox |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | input | pleasure-ambience-url | type=url |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [481](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:481) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [482](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:482) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [482](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:482) | button | Decrease value | type=button |
| [482](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:482) | button | Increase value | type=button |
| [483](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:483) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [483](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:483) | button | Decrease value | type=button |
| [483](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:483) | button | Increase value | type=button |
| [491](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:491) | button | start-meditation |  |
| [492](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:492) | button | open-settings |  |
| [493](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:493) | button | begin-consultation | type=button |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | button | guide-controlled-continue | type=button |
| [591](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:591) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [600](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:600) | button | close-mixer | type=button |
| [606](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:606) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [607](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:607) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [608](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:608) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [609](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:609) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [610](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:610) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [611](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:611) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | summary | Voice Tuning ⌄ |  |
| [620](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:620) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [621](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:621) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [622](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:622) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [623](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:623) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [625](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:625) | button | Soft | type=button · label=ui.voicePresetSoft |
| [626](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:626) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [627](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:627) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | button | Clear | type=button · label=ui.voicePresetClear |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [636](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:636) | summary | Background Music ⌄ |  |
| [641](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:641) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [649](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:649) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [661](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:661) | input | audio-filters-toggle | type=checkbox |
| [662](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:662) | input | eyes-close-mode-toggle | type=checkbox |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [668](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:668) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [670](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:670) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [675](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:675) | button | restart-meditation | type=button · label=ui.restartJourney |
| [676](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:676) | button | close-mixer-bottom | type=button · label=ui.close |
| [686](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:686) | button | btn-mixer |  |
| [687](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:687) | button | pause-meditation |  |
| [688](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:688) | button | stop-meditation |  |
| [706](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:706) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [710](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:710) | button | close-completion |  |

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
