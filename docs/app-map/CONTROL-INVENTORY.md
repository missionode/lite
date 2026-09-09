# Screen and control inventory

Source snapshot: Version 2.85 release snapshot, based on c97ca3d · 2026-09-10.

This inventories static UI declarations in all three HTML entry pages. Dynamic consultation radio answers/notes, translated option lists, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

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
| [95](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:95) | input | corpse-pose-toggle | type=checkbox |
| [98](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:98) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [99](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:99) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [100](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:100) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [101](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:101) | input | balasana | type=checkbox · value=balasana |
| [102](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:102) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [108](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:108) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [113](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:113) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [118](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:118) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [121](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:121) | input | bath-session-toggle | type=checkbox |
| [124](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:124) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [136](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:136) | input | deity-path | type=radio · value=none |
| [137](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:137) | input | deity-path | type=radio · value=shakthi |
| [138](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:138) | input | deity-path | type=radio · value=shiva |
| [144](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:144) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [162](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:162) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [167](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:167) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [172](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:172) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [177](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:177) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [187](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:187) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [194](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:194) | input | upload-script-file | type=file |
| [198](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:198) | input | script-url-input | type=text |
| [199](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:199) | button | load-script-url |  |
| [208](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:208) | button | app-version-unlock | type=button |
| [212](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:212) | input | advanced-features-toggle | type=checkbox |
| [216](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:216) | button | save-config |  |
| [217](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:217) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [225](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:225) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [233](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:233) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [238](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:238) | button | start-experiment | type=button · label=ui.runExperiment |
| [239](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:239) | button | close-experiment | type=button · label=ui.backToSettings |
| [244](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:244) | button | settings-help-close | type=button |
| [251](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:251) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [262](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:262) | input | shots-toggle | type=checkbox |
| [267](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:267) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [277](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:277) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [281](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:281) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [289](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:289) | input | root | type=checkbox · value=root |
| [290](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:290) | input | sacral | type=checkbox · value=sacral |
| [291](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:291) | input | solar | type=checkbox · value=solar |
| [292](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:292) | input | heart | type=checkbox · value=heart |
| [293](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:293) | input | throat | type=checkbox · value=throat |
| [294](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:294) | input | thirdeye | type=checkbox · value=thirdeye |
| [295](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:295) | input | crown | type=checkbox · value=crown |
| [300](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:300) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [306](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:306) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [314](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:314) | input | drone-duration-mode | type=radio · value=beginner |
| [318](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:318) | input | drone-duration-mode | type=radio · value=intermediate |
| [322](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:322) | input | drone-duration-mode | type=radio · value=advanced |
| [326](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:326) | input | drone-duration-mode | type=radio · value=expert |
| [339](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:339) | input | intention-input | type=text |
| [345](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:345) | input | returning-journey-toggle | type=checkbox |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | input | high-energy-toggle | type=checkbox |
| [358](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:358) | input | sleep-mode-toggle | type=checkbox |
| [362](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:362) | input | music-only-toggle | type=checkbox |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | input | box-breathing-experience-toggle | type=checkbox |
| [370](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:370) | input | hooponopono-experience-toggle | type=checkbox |
| [374](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:374) | input | yoga-experience-toggle | type=checkbox |
| [386](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:386) | input | perineal-care-toggle | type=checkbox |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | input | massage-toggle | type=checkbox |
| [394](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:394) | input | assisted-bathing-toggle | type=checkbox |
| [402](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:402) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [417](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:417) | button | start-meditation |  |
| [418](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:418) | button | open-settings |  |
| [419](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:419) | button | begin-consultation | type=button |
| [428](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:428) | button | guide-controlled-continue | type=button |
| [495](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:495) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [504](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:504) | button | close-mixer | type=button |
| [510](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:510) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [511](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:511) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [512](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:512) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [513](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:513) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [514](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:514) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [518](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:518) | input | mood-relaxation-intention-toggle | type=checkbox |
| [522](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:522) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [532](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:532) | input | pleasure-ambience-url | type=url |
| [533](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:533) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [539](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:539) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [544](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:544) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [546](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:546) | button | Decrease value | type=button |
| [550](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:550) | button | Increase value | type=button |
| [556](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:556) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [558](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:558) | button | Decrease value | type=button |
| [562](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:562) | button | Increase value | type=button |
| [574](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:574) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [575](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:575) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [576](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:576) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [577](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:577) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [579](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:579) | button | Soft | type=button · label=ui.voicePresetSoft |
| [580](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:580) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [581](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:581) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [582](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:582) | button | Clear | type=button · label=ui.voicePresetClear |
| [584](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:584) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [595](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:595) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [603](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:603) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | input | audio-filters-toggle | type=checkbox |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | input | eyes-close-mode-toggle | type=checkbox |
| [618](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:618) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [622](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:622) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [624](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:624) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | button | restart-meditation | type=button · label=ui.restartJourney |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | button | close-mixer-bottom | type=button · label=ui.close |
| [640](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:640) | button | btn-mixer |  |
| [641](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:641) | button | pause-meditation |  |
| [642](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:642) | button | stop-meditation |  |
| [660](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:660) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [664](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:664) | button | close-completion |  |

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
