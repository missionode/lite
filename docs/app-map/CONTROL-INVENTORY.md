# Screen and control inventory

Source snapshot: 6a0ee84 + uncommitted natural-sky and audio-transition updates · 2026-09-09.

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
| [206](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:206) | button | save-config |  |
| [207](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:207) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [215](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:215) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [223](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:223) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [228](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:228) | button | start-experiment | type=button · label=ui.runExperiment |
| [229](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:229) | button | close-experiment | type=button · label=ui.backToSettings |
| [234](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:234) | button | settings-help-close | type=button |
| [241](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:241) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [252](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:252) | input | shots-toggle | type=checkbox |
| [257](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:257) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [267](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:267) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [271](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:271) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [279](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:279) | input | root | type=checkbox · value=root |
| [280](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:280) | input | sacral | type=checkbox · value=sacral |
| [281](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:281) | input | solar | type=checkbox · value=solar |
| [282](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:282) | input | heart | type=checkbox · value=heart |
| [283](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:283) | input | throat | type=checkbox · value=throat |
| [284](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:284) | input | thirdeye | type=checkbox · value=thirdeye |
| [285](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:285) | input | crown | type=checkbox · value=crown |
| [290](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:290) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [296](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:296) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [304](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:304) | input | drone-duration-mode | type=radio · value=beginner |
| [308](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:308) | input | drone-duration-mode | type=radio · value=intermediate |
| [312](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:312) | input | drone-duration-mode | type=radio · value=advanced |
| [316](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:316) | input | drone-duration-mode | type=radio · value=expert |
| [329](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:329) | input | intention-input | type=text |
| [335](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:335) | input | returning-journey-toggle | type=checkbox |
| [344](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:344) | input | high-energy-toggle | type=checkbox |
| [348](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:348) | input | sleep-mode-toggle | type=checkbox |
| [352](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:352) | input | music-only-toggle | type=checkbox |
| [356](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:356) | input | box-breathing-experience-toggle | type=checkbox |
| [360](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:360) | input | hooponopono-experience-toggle | type=checkbox |
| [364](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:364) | input | yoga-experience-toggle | type=checkbox |
| [376](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:376) | input | perineal-care-toggle | type=checkbox |
| [380](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:380) | input | massage-toggle | type=checkbox |
| [384](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:384) | input | assisted-bathing-toggle | type=checkbox |
| [392](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:392) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [397](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:397) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | button | start-meditation |  |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | button | open-settings |  |
| [409](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:409) | button | begin-consultation | type=button |
| [421](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:421) | button | guide-controlled-continue | type=button |
| [494](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:494) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [503](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:503) | button | close-mixer | type=button |
| [509](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:509) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [510](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:510) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [511](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:511) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [512](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:512) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [513](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:513) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | input | mood-relaxation-intention-toggle | type=checkbox |
| [521](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:521) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [531](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:531) | input | pleasure-ambience-url | type=url |
| [532](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:532) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [538](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:538) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [543](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:543) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [545](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:545) | button | Decrease value | type=button |
| [549](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:549) | button | Increase value | type=button |
| [555](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:555) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [557](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:557) | button | Decrease value | type=button |
| [561](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:561) | button | Increase value | type=button |
| [573](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:573) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [574](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:574) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [575](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:575) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [576](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:576) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [578](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:578) | button | Soft | type=button · label=ui.voicePresetSoft |
| [579](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:579) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [580](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:580) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [581](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:581) | button | Clear | type=button · label=ui.voicePresetClear |
| [583](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:583) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [594](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:594) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [602](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:602) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | input | audio-filters-toggle | type=checkbox |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | input | eyes-close-mode-toggle | type=checkbox |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [621](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:621) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [623](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:623) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | button | restart-meditation | type=button · label=ui.restartJourney |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | button | close-mixer-bottom | type=button · label=ui.close |
| [639](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:639) | button | btn-mixer |  |
| [640](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:640) | button | pause-meditation |  |
| [641](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:641) | button | stop-meditation |  |
| [659](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:659) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [663](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:663) | button | close-completion |  |

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
