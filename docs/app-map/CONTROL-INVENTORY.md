# Screen and control inventory

Source snapshot: 988af6c + uncommitted performance optimizations · 2026-09-09.

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
| [151](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:151) | input | narration-scroll-toggle | type=checkbox |
| [166](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:166) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [171](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:171) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [176](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:176) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [181](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:181) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [191](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:191) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [198](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:198) | input | upload-script-file | type=file |
| [202](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:202) | input | script-url-input | type=text |
| [203](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:203) | button | load-script-url |  |
| [212](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:212) | button | app-version-unlock | type=button |
| [216](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:216) | input | advanced-features-toggle | type=checkbox |
| [220](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:220) | button | save-config |  |
| [221](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:221) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [229](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:229) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [237](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:237) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [242](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:242) | button | start-experiment | type=button · label=ui.runExperiment |
| [243](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:243) | button | close-experiment | type=button · label=ui.backToSettings |
| [248](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:248) | button | settings-help-close | type=button |
| [255](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:255) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [266](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:266) | input | shots-toggle | type=checkbox |
| [271](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:271) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [281](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:281) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [285](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:285) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [293](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:293) | input | root | type=checkbox · value=root |
| [294](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:294) | input | sacral | type=checkbox · value=sacral |
| [295](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:295) | input | solar | type=checkbox · value=solar |
| [296](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:296) | input | heart | type=checkbox · value=heart |
| [297](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:297) | input | throat | type=checkbox · value=throat |
| [298](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:298) | input | thirdeye | type=checkbox · value=thirdeye |
| [299](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:299) | input | crown | type=checkbox · value=crown |
| [304](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:304) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [310](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:310) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [318](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:318) | input | drone-duration-mode | type=radio · value=beginner |
| [322](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:322) | input | drone-duration-mode | type=radio · value=intermediate |
| [326](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:326) | input | drone-duration-mode | type=radio · value=advanced |
| [330](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:330) | input | drone-duration-mode | type=radio · value=expert |
| [343](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:343) | input | intention-input | type=text |
| [349](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:349) | input | returning-journey-toggle | type=checkbox |
| [358](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:358) | input | high-energy-toggle | type=checkbox |
| [362](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:362) | input | sleep-mode-toggle | type=checkbox |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | input | music-only-toggle | type=checkbox |
| [370](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:370) | input | box-breathing-experience-toggle | type=checkbox |
| [374](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:374) | input | hooponopono-experience-toggle | type=checkbox |
| [378](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:378) | input | yoga-experience-toggle | type=checkbox |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | input | perineal-care-toggle | type=checkbox |
| [394](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:394) | input | massage-toggle | type=checkbox |
| [398](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:398) | input | assisted-bathing-toggle | type=checkbox |
| [406](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:406) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [421](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:421) | button | start-meditation |  |
| [422](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:422) | button | open-settings |  |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | button | begin-consultation | type=button |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | button | guide-controlled-continue | type=button |
| [508](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:508) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [517](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:517) | button | close-mixer | type=button |
| [523](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:523) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [524](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:524) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [525](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:525) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [526](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:526) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [527](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:527) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [531](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:531) | input | mood-relaxation-intention-toggle | type=checkbox |
| [535](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:535) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [545](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:545) | input | pleasure-ambience-url | type=url |
| [546](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:546) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [552](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:552) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [557](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:557) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [559](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:559) | button | Decrease value | type=button |
| [563](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:563) | button | Increase value | type=button |
| [569](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:569) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [571](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:571) | button | Decrease value | type=button |
| [575](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:575) | button | Increase value | type=button |
| [587](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:587) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [588](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:588) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [589](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:589) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [590](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:590) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [592](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:592) | button | Soft | type=button · label=ui.voicePresetSoft |
| [593](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:593) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [594](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:594) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [595](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:595) | button | Clear | type=button · label=ui.voicePresetClear |
| [597](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:597) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [608](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:608) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [616](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:616) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [628](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:628) | input | audio-filters-toggle | type=checkbox |
| [629](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:629) | input | eyes-close-mode-toggle | type=checkbox |
| [631](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:631) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [635](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:635) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [637](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:637) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [642](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:642) | button | restart-meditation | type=button · label=ui.restartJourney |
| [643](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:643) | button | close-mixer-bottom | type=button · label=ui.close |
| [653](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:653) | button | btn-mixer |  |
| [654](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:654) | button | pause-meditation |  |
| [655](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:655) | button | stop-meditation |  |
| [673](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:673) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [677](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:677) | button | close-completion |  |

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
