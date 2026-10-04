# Screen and control inventory

Source snapshot: production 4108ba0 + uncommitted Drone Duration tone and Benefits and safety (feature/narration-feeling) · 2026-10-04.

This inventories static UI declarations in the three meditation HTML entry pages. Assessment questions and result cards are generated at runtime; two answer buttons render one prompt at a time. Translated copy, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.

## index.html

| Source | Element | Identifier / label | Choices / bounds / destination |
| --- | --- | --- | --- |
| [37](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:37) | button | settings-help-button | type=button |
| [40](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:40) | button | benefits-safety-button | type=button · label=ui.faqButton |
| [48](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:48) | select | language-select | ml: Malayalam; en: English |
| [56](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:56) | select | display-language-select | en: English; ml: Malayalam |
| [64](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:64) | select | voice-select | piper:ml_IN-arjun-medium: Piper Malayalam — Arjun (Medium) |
| [70](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:70) | button | test-voice |  |
| [75](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:75) | input | no-frequency-mode-toggle | type=checkbox |
| [76](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:76) | input | no-mantra-mode-toggle | type=checkbox |
| [81](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:81) | select | spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [92](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:92) | input | settings-vol-video | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [93](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:93) | button | preview-video-audio | type=button · label=ui.previewVideoAudio |
| [97](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:97) | input | settings-vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [98](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:98) | button | preview-visualization-ambience | type=button · label=ui.previewVisualizationAmbience |
| [105](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:105) | input | corpse-pose-toggle | type=checkbox |
| [108](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:108) | input | vrikshasana | type=checkbox · value=vrikshasana |
| [109](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:109) | input | adho_mukha_svanasana | type=checkbox · value=adho_mukha_svanasana |
| [110](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:110) | input | marjaryasana | type=checkbox · value=marjaryasana |
| [111](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:111) | input | balasana | type=checkbox · value=balasana |
| [112](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:112) | input | ananda_balasana | type=checkbox · value=ananda_balasana |
| [118](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:118) | input | time-yoga-prep | type=range · min=10 · max=120 · step=5 · value=60 |
| [123](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:123) | input | time-yoga-pose | type=range · min=30 · max=300 · step=10 · value=60 |
| [128](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:128) | input | time-corpse | type=range · min=60 · max=600 · step=30 · value=300 |
| [131](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:131) | input | bath-session-toggle | type=checkbox |
| [134](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:134) | input | time-bath | type=range · min=60 · max=1800 · step=60 · value=600 |
| [146](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:146) | input | deity-path | type=radio · value=none |
| [147](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:147) | input | deity-path | type=radio · value=shakthi |
| [148](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:148) | input | deity-path | type=radio · value=shiva |
| [154](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:154) | button | open-sky-observatory | type=button · label=ui.openSkyObservatory |
| [159](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:159) | select | visual-effect-select | natural: Natural; aura: Aura Glow; holographic: Holographic; depth: Sacred Depth |
| [177](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:177) | input | time-icebreaker | type=range · min=10 · max=300 · step=5 · value=60 |
| [182](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:182) | input | time-emergence | type=range · min=30 · max=300 · step=5 · value=60 |
| [187](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:187) | input | time-breathing | type=range · min=4 · max=16 · step=1 · value=8 |
| [192](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:192) | input | time-interval | type=range · min=10 · max=20 · step=1 · value=10 |
| [202](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:202) | select | script-source-select | default: Default (scripts.json); custom: Custom Script |
| [209](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:209) | input | upload-script-file | type=file |
| [213](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:213) | input | script-url-input | type=text |
| [214](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:214) | button | load-script-url |  |
| [223](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:223) | button | app-version-unlock | type=button |
| [227](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:227) | input | advanced-features-toggle | type=checkbox |
| [230](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:230) | button | open-settings-manager | type=button · label=ui.manageSettings |
| [232](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:232) | button | save-config |  |
| [233](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:233) | button | open-experiment-mode | type=button · label=ui.experimentMode |
| [242](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:242) | button | close-sky-screen | type=button · label=ui.backToSettings |
| [252](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:252) | button | export-settings | type=button · label=ui.exportSettings |
| [256](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:256) | input | import-settings-file | type=file |
| [257](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:257) | button | import-settings | type=button · label=ui.importSettings |
| [261](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:261) | button | close-settings-manager | type=button · label=ui.backToSettings |
| [269](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:269) | select | experiment-activity | chakra:root: Root; chakra:sacral: Sacral; chakra:solar: Solar; chakra:heart: Heart; chakra:throat: Throat; chakra:thirdeye: Third Eye; chakra:crown: Crown; hrim: HRIM; box: Box Breathing; hooponopono: Ho’oponopono; corpse: Savasana; perineal: Perineal Care; bath: Bath Session; assisted-bath: Assisted Bathing |
| [277](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:277) | input | experiment-core-duration | type=range · min=1 · max=7 · step=0.5 · value=5 |
| [283](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:283) | button | start-experiment | type=button · label=ui.runExperiment |
| [284](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:284) | button | close-experiment | type=button · label=ui.backToSettings |
| [303](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:303) | button | settings-help-close | type=button |
| [310](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:310) | a | CC0 details | href=https://creativecommons.org/publicdomain/zero/1.0/ · label=ui.cc0Details |
| [311](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:311) | button | settings-help-faq | type=button · label=ui.faqButton |
| [319](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:319) | button | benefits-safety-close | type=button |
| [341](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:341) | button | advanced-password-close | type=button |
| [346](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:346) | input | advanced-password-input | type=password |
| [347](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:347) | button | advanced-password-reveal | type=button |
| [350](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:350) | button | advanced-password-cancel | type=button · label=ui.advancedPasswordCancel |
| [351](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:351) | button | Unlock | type=submit · label=ui.advancedPasswordSubmit |
| [362](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:362) | input | shots-toggle | type=checkbox |
| [367](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:367) | select | shot-type-select | meditation: Meditation Shot; high_energy: High Energy Shot; anesthetic: Anesthetic Shot; mood_relaxation: Mood &amp; Relaxation Shot; sleep: Sleep Shot; custom: Custom Shot |
| [377](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:377) | input | shot-frequency-input | type=number · min=0 · max=20000 · step=0.1 · value=0 |
| [381](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:381) | a | View Frequency Repertory | href=./docs/repertory.html · label=ui.frequencyRepertory |
| [388](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:388) | button | 😌 Calm | type=button · label=ui.pitch_calm_label |
| [389](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:389) | button | 💪 Courage | type=button · label=ui.pitch_courage_label |
| [390](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:390) | button | ⚡ Energy | type=button · label=ui.pitch_energy_label |
| [391](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:391) | button | 🎯 Focus | type=button · label=ui.pitch_focus_label |
| [398](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:398) | input | box-breathing-experience-toggle | type=checkbox |
| [400](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:400) | input | visualization-addon-toggle | type=checkbox |
| [402](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:402) | select | visualization-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [403](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:403) | select | visualization-ambience | silence: Silence; space-race: Space Race |
| [407](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:407) | input | dharana-addon-toggle | type=checkbox |
| [409](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:409) | select | dharana-anchor | indigo-circle: Indigo circle; gold-dot: Golden dot; violet-triangle: Violet triangle |
| [410](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:410) | select | dharana-duration | 1: 1 min; 2: 2 min; 3: 3 min; 5: 5 min |
| [414](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:414) | input | body-scan-addon-toggle | type=checkbox |
| [416](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:416) | select | body-scan-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [420](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:420) | input | noting-addon-toggle | type=checkbox |
| [423](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:423) | select | noting-duration | 2: 2 min; 4: 4 min; 6: 6 min |
| [432](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:432) | input | quiet-courage-addon-toggle | type=checkbox |
| [435](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:435) | select | quiet-courage-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [439](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:439) | input | confidence-visualization-addon-toggle | type=checkbox |
| [442](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:442) | select | confidence-visualization-duration | 3: 3 min; 5: 5 min; 8: 8 min |
| [446](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:446) | input | deep-secrets-addon-toggle | type=checkbox |
| [449](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:449) | select | deep-secrets-duration | 3: 3 min; 4: 4 min; 6: 6 min |
| [453](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:453) | input | final-challenge-addon-toggle | type=checkbox |
| [462](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:462) | input | root | type=checkbox · value=root |
| [463](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:463) | input | sacral | type=checkbox · value=sacral |
| [464](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:464) | input | solar | type=checkbox · value=solar |
| [465](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:465) | input | heart | type=checkbox · value=heart |
| [466](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:466) | input | throat | type=checkbox · value=throat |
| [467](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:467) | input | thirdeye | type=checkbox · value=thirdeye |
| [468](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:468) | input | crown | type=checkbox · value=crown |
| [470](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:470) | input | reverse-journey-toggle | type=checkbox |
| [475](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:475) | input | hooponopono-experience-toggle | type=checkbox |
| [477](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:477) | input | undo-unlearn-addon-toggle | type=checkbox |
| [480](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:480) | select | undo-unlearn-duration | 5: 5 min; 8: 8 min; 12: 12 min |
| [487](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:487) | input | time-per-chakra | type=range · min=1 · max=7 · step=0.5 · value=1 |
| [493](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:493) | input | time-high-energy | type=range · min=1 · max=30 · step=1 · value=5 |
| [501](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:501) | input | drone-duration-mode | type=radio · value=beginner |
| [505](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:505) | input | drone-duration-mode | type=radio · value=intermediate |
| [509](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:509) | input | drone-duration-mode | type=radio · value=advanced |
| [513](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:513) | input | drone-duration-mode | type=radio · value=expert |
| [526](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:526) | input | intention-input | type=text |
| [532](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:532) | input | returning-journey-toggle | type=checkbox |
| [536](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:536) | input | journey-video-prelude-toggle | type=checkbox |
| [545](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:545) | input | high-energy-toggle | type=checkbox |
| [549](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:549) | input | sleep-mode-toggle | type=checkbox |
| [553](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:553) | input | music-only-toggle | type=checkbox |
| [557](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:557) | input | yoga-experience-toggle | type=checkbox |
| [569](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:569) | input | perineal-care-toggle | type=checkbox |
| [573](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:573) | input | massage-toggle | type=checkbox |
| [577](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:577) | input | assisted-bathing-toggle | type=checkbox |
| [585](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:585) | input | time-perineal-care | type=range · min=30 · max=900 · step=30 · value=300 |
| [590](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:590) | input | time-assisted-bathing | type=range · min=60 · max=1800 · step=60 · value=600 |
| [596](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:596) | input | mood-relaxation-intention-toggle | type=checkbox |
| [598](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:598) | select | pleasure-ambience-intensity | gentle: Gentle; immersive: Immersive; deep: Deep |
| [599](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:599) | input | pleasure-ambience-url | type=url |
| [599](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:599) | button | load-pleasure-ambience-url | type=button · label=ui.loadPleasureAmbience |
| [600](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:600) | input | pleasure-ambience-blur-toggle | type=checkbox |
| [601](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:601) | input | pleasure-ambience-blur-level | type=range · min=10 · max=65 · step=5 · value=35 |
| [601](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:601) | button | Decrease value | type=button |
| [601](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:601) | button | Increase value | type=button |
| [602](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:602) | input | mood-relaxation-ambience-level | type=range · min=0.2 · max=7.0 · step=0.1 · value=0.3 |
| [602](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:602) | button | Decrease value | type=button |
| [602](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:602) | button | Increase value | type=button |
| [612](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:612) | button | open-secret-body-game | type=button · label=ui.sbpOpen |
| [617](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:617) | button | open-eye-shooter | type=button · label=ui.esOpen |
| [622](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:622) | button | open-chakra-touch | type=button · label=ui.ctOpen |
| [635](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:635) | button | frequency-reminder-toggle | type=button · label=ui.freqReminderTurnOn |
| [638](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:638) | button | start-meditation |  |
| [639](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:639) | button | open-settings |  |
| [640](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:640) | button | begin-consultation | type=button |
| [649](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:649) | button | guide-controlled-continue | type=button |
| [723](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:723) | button | play-journey-video-prelude | type=button · label=ui.playJourneyVideoPrelude |
| [732](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:732) | button | close-mixer | type=button |
| [738](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:738) | input | vol-voice | type=range · min=0.2 · max=2 · step=0.1 · value=1.0 |
| [739](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:739) | input | vol-drone | type=range · min=0.02 · max=0.2 · step=0.01 · value=0.05 |
| [740](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:740) | input | vol-bell | type=range · min=0.02 · max=0.12 · step=0.01 · value=0.04 |
| [741](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:741) | input | vol-mantra | type=range · min=0.005 · max=1 · step=0.005 · value=0.35 |
| [742](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:742) | input | vol-visualization | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.1 |
| [743](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:743) | input | vol-music | type=range · min=0.02 · max=0.5 · step=0.01 · value=0.2 |
| [747](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:747) | summary | Voice Tuning ⌄ |  |
| [752](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:752) | input | voice-clarity | type=range · min=0 · max=100 · step=1 · value=50 |
| [753](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:753) | input | voice-warmth | type=range · min=0 · max=100 · step=1 · value=50 |
| [754](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:754) | input | voice-pace | type=range · min=0.85 · max=1.15 · step=0.05 · value=1 |
| [755](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:755) | select | voice-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [757](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:757) | button | Soft | type=button · label=ui.voicePresetSoft |
| [758](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:758) | button | Shringara | type=button · label=ui.voicePresetShringara |
| [759](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:759) | button | Balanced | type=button · label=ui.voicePresetBalanced |
| [760](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:760) | button | Clear | type=button · label=ui.voicePresetClear |
| [762](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:762) | button | mixer-voice-preview | type=button · label=ui.previewTunedVoice |
| [768](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:768) | summary | Background Music ⌄ |  |
| [773](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:773) | select | music-echo | off: Off; light: Soft Halo; spacious: Heavenly |
| [781](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:781) | select | mixer-spatial-mode | off: Off (Stereo Safe); stereo: Stereo Wide; headphones: Headphone 3D; room: Room Spatial |
| [793](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:793) | input | audio-filters-toggle | type=checkbox |
| [794](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:794) | input | eyes-close-mode-toggle | type=checkbox |
| [796](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:796) | input | brightness-slider | type=range · min=0.1 · max=1 · step=0.05 · value=1 |
| [800](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:800) | input | mixer-no-frequency-mode-toggle | type=checkbox |
| [802](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:802) | input | mixer-no-mantra-mode-toggle | type=checkbox |
| [807](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:807) | button | restart-meditation | type=button · label=ui.restartJourney |
| [808](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:808) | button | close-mixer-bottom | type=button · label=ui.close |
| [826](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:826) | button | final-challenge-yes | type=button · label=ui.finalChallengeYes |
| [827](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:827) | button | final-challenge-no | type=button · label=ui.finalChallengeNo |
| [828](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:828) | button | final-challenge-skip | type=button · label=ui.skipForNow |
| [839](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:839) | button | pitch-invite-journey | type=button · label=ui.pitchInviteJourney |
| [840](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:840) | button | pitch-invite-again | type=button · label=ui.pitchInviteAgain |
| [847](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:847) | button | btn-mixer | type=button |
| [848](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:848) | button | pause-meditation | type=button |
| [849](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:849) | button | skip-meditation | type=button |
| [852](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:852) | button | stop-meditation | type=button |
| [860](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:860) | button | sleep-goodnight-close | type=button · label=ui.returnToRoom |
| [877](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:877) | a | continue-to-earn | href=https://missionode.github.io/earn-app/receive.html?Source=Lite |
| [881](/Users/lekshmisyam/Desktop/Ikigai/lite/index.html:881) | button | close-completion |  |

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
| [90](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:90) | a | backLink | href=../index.html |
| [91](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:91) | select | languageToggle | en: English; ml: മലയാളം; hi: हिन्दी; ru: Русский; ta: தமிழ் |
| [110](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:110) | a | sourceLink |  |
| [116](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:116) | input | frequencySearch | type=search |
| [117](/Users/lekshmisyam/Desktop/Ikigai/lite/docs/repertory.html:117) | button | clearSearch | type=button |

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
