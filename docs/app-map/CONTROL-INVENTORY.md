# Screen and control inventory

Source snapshot: dab13fa CP-MOD-059 base + CP-MOD-060 uncommitted source review · 2026-09-25.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

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
| [334](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:334) | input | visualization-addon-toggle | type=checkbox |
| [336](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:336) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [337](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:337) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [341](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:341) | input | dharana-addon-toggle | type=checkbox |
| [343](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:343) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [344](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:344) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [348](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:348) | input | body-scan-addon-toggle | type=checkbox |
| [350](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:350) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [354](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:354) | input | noting-addon-toggle | type=checkbox |
| [357](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:357) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [366](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:366) | input | root | type=checkbox · value=root |
| [367](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:367) | input | sacral | type=checkbox · value=sacral |
| [368](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:368) | input | solar | type=checkbox · value=solar |
| [369](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:369) | input | heart | type=checkbox · value=heart |
| [370](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:370) | input | throat | type=checkbox · value=throat |
| [371](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:371) | input | thirdeye | type=checkbox · value=thirdeye |
| [372](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:372) | input | crown | type=checkbox · value=crown |
| [378](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:378) | input | hooponopono-experience-toggle | type=checkbox |
| [380](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:380) | input | undo-unlearn-addon-toggle | type=checkbox |
| [383](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:383) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [396](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:396) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [404](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:404) | input | drone-duration-mode | type=radio · value=beginner |
| [408](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:408) | input | drone-duration-mode | type=radio · value=intermediate |
| [412](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:412) | input | drone-duration-mode | type=radio · value=advanced |
| [416](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:416) | input | drone-duration-mode | type=radio · value=expert |
| [429](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:429) | input | intention-input | type=text |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | input | returning-journey-toggle | type=checkbox |
| [439](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:439) | input | journey-video-prelude-toggle | type=checkbox |
| [448](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:448) | input | high-energy-toggle | type=checkbox |
| [452](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:452) | input | sleep-mode-toggle | type=checkbox |
| [456](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:456) | input | music-only-toggle | type=checkbox |
| [460](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:460) | input | yoga-experience-toggle | type=checkbox |
| [472](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:472) | input | perineal-care-toggle | type=checkbox |
| [476](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:476) | input | massage-toggle | type=checkbox |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | input | assisted-bathing-toggle | type=checkbox |
| [488](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:488) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [493](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:493) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [499](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:499) | input | mood-relaxation-intention-toggle | type=checkbox |
| [501](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:501) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | input | pleasure-ambience-url | type=url |
| [502](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:502) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [503](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:503) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [504](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:504) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [504](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:504) | button | Decrease value | type=button |
| [504](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:504) | button | Increase value | type=button |
| [505](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:505) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [505](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:505) | button | Decrease value | type=button |
| [505](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:505) | button | Increase value | type=button |
| [513](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:513) | button | start-meditation |  |
| [514](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:514) | button | open-settings |  |
| [515](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:515) | button | begin-consultation | type=button |
| [524](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:524) | button | guide-controlled-continue | type=button |
| [615](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:615) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [624](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:624) | button | close-mixer | type=button |
| [630](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:630) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [631](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:631) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [632](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:632) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [633](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:633) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [634](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:634) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [635](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:635) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [639](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:639) | summary | Voice Tuning ⌄ |  |
| [644](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:644) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [645](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:645) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [646](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:646) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [647](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:647) | select | voice-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [649](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:649) | button | Soft | type=button · label=ui.voicePresetSoft |
| [650](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:650) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [651](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:651) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [652](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:652) | button | Clear | type=button · label=ui.voicePresetClear |
| [654](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:654) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [660](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:660) | summary | Background Music ⌄ |  |
| [665](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:665) | select | music-echo | off: Off; light: Soft Room; spacious: Temple Air |
| [673](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:673) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [685](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:685) | input | audio-filters-toggle | type=checkbox |
| [686](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:686) | input | eyes-close-mode-toggle | type=checkbox |
| [688](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:688) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [692](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:692) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [694](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:694) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [699](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:699) | button | restart-meditation | type=button · label=ui.restartJourney |
| [700](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:700) | button | close-mixer-bottom | type=button · label=ui.close |
| [710](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:710) | button | btn-mixer |  |
| [711](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:711) | button | pause-meditation |  |
| [712](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:712) | button | stop-meditation |  |
| [730](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:730) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [734](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:734) | button | close-completion |  |

## docs/assesment.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [99](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:99) | button | fontDown | type=button |
| [100](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:100) | button | fontReset | type=button |
| [101](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:101) | button | fontUp | type=button |
| [104](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:104) | button | translateBtn | type=button |
| [111](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:111) | a | ← Meditation Room | href=../index.html |
| [122](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:122) | button | retryButton | type=button |
| [129](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:129) | button | choiceLeft | type=button |
| [130](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:130) | button | choiceRight | type=button |
| [133](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:133) | button | equalChoice | type=button |
| [134](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:134) | button | skipChoice | type=button |
| [148](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:148) | button | newAssessment | type=button |
| [149](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/assesment.html:149) | a | Return to Meditation Room | href=../index.html |

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
