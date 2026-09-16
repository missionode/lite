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
| [215](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:215) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [217](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:217) | button | save-config |  |
| [218](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:218) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [227](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:227) | button | export-settings | type=button · label=ui.exportSettings |
| [231](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:231) | input | import-settings-file | type=file |
| [232](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:232) | button | import-settings | type=button · label=ui.importSettings |
| [236](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:236) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [244](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:244) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [252](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:252) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [257](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:257) | button | start-experiment | type=button · label=ui.runExperiment |
| [258](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:258) | button | close-experiment | type=button · label=ui.backToSettings |
| [263](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:263) | button | settings-help-close | type=button |
| [270](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:270) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [278](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:278) | button | advanced-password-close | type=button |
| [283](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:283) | input | advanced-password-input | type=password |
| [284](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:284) | button | advanced-password-reveal | type=button |
| [287](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:287) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [288](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:288) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [299](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:299) | input | shots-toggle | type=checkbox |
| [304](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:304) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [314](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:314) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [318](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:318) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [326](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:326) | input | root | type=checkbox · value=root |
| [327](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:327) | input | sacral | type=checkbox · value=sacral |
| [328](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:328) | input | solar | type=checkbox · value=solar |
| [329](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:329) | input | heart | type=checkbox · value=heart |
| [330](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:330) | input | throat | type=checkbox · value=throat |
| [331](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:331) | input | thirdeye | type=checkbox · value=thirdeye |
| [332](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:332) | input | crown | type=checkbox · value=crown |
| [337](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:337) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [343](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:343) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | input | drone-duration-mode | type=radio · value=beginner |
| [355](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:355) | input | drone-duration-mode | type=radio · value=intermediate |
| [359](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:359) | input | drone-duration-mode | type=radio · value=advanced |
| [363](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:363) | input | drone-duration-mode | type=radio · value=expert |
| [376](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:376) | input | intention-input | type=text |
| [382](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:382) | input | returning-journey-toggle | type=checkbox |
| [386](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:386) | input | journey-video-prelude-toggle | type=checkbox |
| [395](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:395) | input | high-energy-toggle | type=checkbox |
| [399](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:399) | input | sleep-mode-toggle | type=checkbox |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | input | music-only-toggle | type=checkbox |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | input | box-breathing-experience-toggle | type=checkbox |
| [411](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:411) | input | hooponopono-experience-toggle | type=checkbox |
| [415](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:415) | input | yoga-experience-toggle | type=checkbox |
| [427](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:427) | input | perineal-care-toggle | type=checkbox |
| [431](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:431) | input | massage-toggle | type=checkbox |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | input | assisted-bathing-toggle | type=checkbox |
| [443](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:443) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [448](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:448) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [454](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:454) | input | mood-relaxation-intention-toggle | type=checkbox |
| [456](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:456) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [457](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:457) | input | pleasure-ambience-url | type=url |
| [457](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:457) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [458](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:458) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [459](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:459) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [459](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:459) | button | Decrease value | type=button |
| [459](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:459) | button | Increase value | type=button |
| [460](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:460) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [460](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:460) | button | Decrease value | type=button |
| [460](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:460) | button | Increase value | type=button |
| [468](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:468) | button | start-meditation |  |
| [469](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:469) | button | open-settings |  |
| [470](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:470) | button | begin-consultation | type=button |
| [479](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:479) | button | guide-controlled-continue | type=button |
| [565](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:565) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [574](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:574) | button | close-mixer | type=button |
| [580](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:580) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [581](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:581) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [582](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:582) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [583](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:583) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [584](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:584) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [588](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:588) | summary | Voice Tuning ⌄ |  |
| [593](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:593) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [594](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:594) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [595](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:595) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [596](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:596) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [598](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:598) | button | Soft | type=button · label=ui.voicePresetSoft |
| [599](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:599) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [600](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:600) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [601](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:601) | button | Clear | type=button · label=ui.voicePresetClear |
| [603](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:603) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [609](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:609) | summary | Background Music ⌄ |  |
| [614](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:614) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [622](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:622) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [634](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:634) | input | audio-filters-toggle | type=checkbox |
| [635](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:635) | input | eyes-close-mode-toggle | type=checkbox |
| [637](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:637) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [641](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:641) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [643](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:643) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [648](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:648) | button | restart-meditation | type=button · label=ui.restartJourney |
| [649](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:649) | button | close-mixer-bottom | type=button · label=ui.close |
| [659](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:659) | button | btn-mixer |  |
| [660](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:660) | button | pause-meditation |  |
| [661](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:661) | button | stop-meditation |  |
| [679](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:679) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [683](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:683) | button | close-completion |  |

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
