# Chakra Meditation — Active Handoff

### NOW — CP-SHOTS-001: Shots shares the Advanced features unlock

- COMPLETE locally, app 2.88 / shell 5.174, based on 94914a8. Approved scope: hide Shots and its heading until the same seven rapid App version taps as Intimate Care; Advanced features OFF clears and hides both, reload locks again. Existing confirmation, No Frequency guard and mutual exclusion remain. Repertory URL waits for unlock, then normal confirmation; no autoplay. Direct locked runShot returns without audio.
- Routing: standard recommendation Terra / medium; executionMode direct under the efficiency companion (no useful child split). No model switch or measured savings claimed. Target is this project; reusable policy is project-local Loop. Preflight Node 25.9.0 / Python 3.9.6 / Darwin arm64; 49 GiB available, hardware sysctl permission-limited; no new dependencies/services/browser required.
- Spec/plan: extend the existing lock only, add hidden HTML defaults and direct-entry guards, preserve repertory intent, test and regenerate atlas. Spec-compliance then quality/risk review completed; this is a UI opt-in gate, not authentication. No added polling/audio processing.
- Fresh evidence: 30 app test files pass (static/unit/mock), including advanced-unlock, frequency-repertory and no-frequency-mode. Hindi-language was accidentally included in the broad run and fails its pre-existing hardcoded app.js?v=2.62 assertion (line 219); not a new regression. Content-safety/drone-duration excluded for missing owner-managed docs/dot.json. Initial unlock mock needed the real false No Frequency default; corrected and rerun. No untriaged app errors. No browser/device/playback evidence.
- Atlas: startup, modes, care, shots, repertory and persistence updated and generated (24 maps, 221 nodes, 253 edges); stale care four-click wording reconciled to executable seven taps. No graph topology/interface changes; browser-based verify-atlas not invoked under opt-in policy.
- Local check: from /Users/lekshmisyam/Desktop/Ikigai/lite run `node tests/advanced-unlock.test.mjs` and `node docs/app-map/build-atlas.mjs`. Use the existing local preview to test Settings → About → App version seven taps, then return to Lobby. Existing serving setup unchanged. Next: user visual check; push requires authorization. Private .codex/ and backup audio preserved unstaged.

### NOW — CP-WF-001: project-local Loop efficiency workflow

- User requested the efficiency recommendations be encoded into Loop. Added `Loop/EFFICIENT-WORKFLOW.md` and links from AGENTS, root policy, delivery, routing and local skill. One combined track records scope/review at `.loop/tracks/workflow-efficiency/spec-plan-review.md`.
- Rules cover compact task context, honest planned/dispatched routing, no duplicated agent work, reusable deterministic checks, behavior tests, measured diagnostics and bounded refactors. Suggestions do not themselves install scripts, launch models, archive history or change application behavior.
- Validation: static efficiency contract and existing model-router unit tests; host behavior/savings NOT_RUN. App atlas remains accurate; no app-flow change. Global settings and installed plugin cache untouched. Prior app baseline is production 361938c / version 2.87.
- Next action: follow the companion on the next task. Reusable plugin installation, release-helper implementation and handoff archival remain separate scoped work; no production push authorized here.

### Version 2.87 release preparation — 2026-09-10

- User authorized production push of cursor/control hiding and Sleep/Eyes Close positioning fixes. Thirty applicable automated tests passed in the implementation pass; targeted controls/video/visual checks and syntax/diff checks repeated before release. No device geometry verification claimed.
- Atlas release snapshot updated. Private `.codex/` and backup audio excluded. Earlier local/not-pushed entries record checkpoints; final push result is reported in the conversation.

### Sleep control positioning — local, 2026-09-10

- Source diagnosis: Sleep filtered the narrow, positioned #app ancestor. A CSS filter establishes the containing block for fixed descendants, so controls and the bottom reveal zone could be positioned/clipped relative to app content rather than the viewport. Eyes Close had the same risk on body.
- Replaced ancestor filters with composed opacity factors (user brightness × Sleep 0.4 × Eyes Close 0.85). Brightness writes now set a CSS variable. Eyes Close warmth is confined to the sky canvas and chakra artwork, not ancestors of fixed controls. No new render loop. Hover/touch/keyboard rules remain unchanged.
- Controls/Sleep/visuals descriptions synchronized. Static regression checks cover ancestor-filter removal and brightness composition; mock interaction checks pass. No browser/device geometry verification; user should retest Sleep and Sleep + Eyes Close. App 2.87 / CSS 1.93 / shell 5.173, local and not pushed.

### Journey cursor and control hiding — local, 2026-09-10

- All active in-session control surfaces (not only fullscreen) now hide the bottom controls and mixer toggle until bottom-edge/control-area hover. Leaving hides after 180 ms; moving elsewhere reveals only the cursor. Cursor hides after three idle seconds; keyboard focus and open mixer preserve access/visibility.
- Touch/pen can reveal controls by tapping the bottom area, with three-second auto-hide that ignores sticky touch hover. Keyboard focus reveals buttons without removing them from the tab order. Controls stay available while mixer is open; Stop/completion and page hiding clear timers/cursor hiding. Lifecycle uses listeners, class observation and one-shot timers, no animation loop. Existing fullscreen-only countdown hiding remains unchanged.
- Controls/restart maps updated. Mock tests cover cursor, hover, focus, touch focus, mixer and cleanup; no browser/device appearance evidence. App 2.86 / CSS 1.92 / shell 5.172, local and not pushed.

### Version 2.85 release preparation — 2026-09-10

- User authorized production push after reviewing extension message-channel errors. No Chrome runtime messaging calls found in application sources; those console messages alone do not identify an app failure. Device interruption/thermal evidence remains unresolved, not claimed fixed by this release.
- Release includes scrolling narration removal, static session decorations, bounded/cached Piper preparation, idle reverb bypass, longer session exits and stage-aware fades. All 29 applicable non-browser test files pass; established missing-fixture tests and stale Hindi delivery-version assertions remain excluded. Atlas regenerated; syntax/diff checks pass.
- Remote production fetched and aligned with c97ca3d before this release. Exclude private `.codex/` and untracked backup audio. Earlier local/not-pushed notes record implementation checkpoints; push outcome is reported in the conversation.

### Stage-aware fades — local, 2026-09-10

- Arrival music entry uses 20% of the selected settling period, capped at three seconds (10s → 2s). Interval and Emergence narration music transitions have the same scoped cap; it is restored on success/failure. Narration still finishes before advancing. Emergence retains its minimum 30s settling period after narration; Interval remains preparation + max(selected duration, narration).
- The existing post-mantra transition window now budgets the dry fade and shortened wet tail equally: default 4s → 2s chant fade + 2s tail, reaching silence before affirmation. No extra waiting time added; zero-duration test profiles stay zero. New mantra start restores the wet return. Final Stop/completion still uses the long eight-second mantra/music exit with full response tails.
- Source-reviewed standard/chakra/audio maps updated. Stage tests cover minima, zero duration, scope cleanup on failure and wet-tail deadline; narration/audio regressions checked. No browser/device listening evidence. App 2.85 / shell 5.171, local, not pushed.

### Longer audio exits — local, 2026-09-10

- Source review found new mantra entry zeroed the shared bus, potentially cutting an outgoing chant. Entry now uses the new loop output (six seconds); repeated loop Stop cannot reset an existing exit. Mantra modulation retires gradually and disconnects with its gain instead of stopping abruptly.
- Mantra and background-music exits now last eight seconds, plus seven-/five-second reverb responses. Voice Space uses a five-second response. Session Stop/completion fade active Piper over two seconds instead of immediate source cancellation, retaining its convolution route through the fade plus tail. Final words keep their short anti-click envelopes; no long fade is applied over natural spoken endings. Space Off stays dry. Browser speech remains outside Web Audio and cannot be smoothly gain-ramped; explicit Stop still cancels it immediately.
- Session Stop no longer restores music while stopping mantra; ambience exits over eight seconds. Existing drone/cue envelopes remain. Tests cover loop entry, idempotent exit, shared-bus protection, routing and retirement. No device listening evidence; user must verify the reported cut. Longer convolution responses can add some active DSP cost; idle bypass remains.
- Atlas audio/narration/controls descriptions synchronized. App 2.84 / shell 5.170, local and not pushed.

### Thermal workload reduction — local, 2026-09-10

- Only Lobby and Settings animate the night sky. All other app screens render a static sky; screen changes cancel sky scheduling/meteors, CSS animations/transitions stop, and Sacred Depth draws once without an audio analyser. Functional stage labels/countdowns and media playback remain intact.
- Piper splits text into at most 180 Unicode code points (word boundaries where possible), prepares the first clip, and schedules only one future clip when the current clip has at most twelve seconds remaining. Pause-aware scheduling and cancellation checks remain. Speech gaps remain deliberate; subdivided long sentences also use the existing gap.
- Decoded speech uses an in-memory LRU keyed by text, voice definition and synthesis settings, capped at 16 MiB and 48 entries. No persistent narration cache. Cancelled preparations do not populate it. A cache hit avoids inference/decoding/normalization.
- Reverb routes disconnect on Off or idle lifecycle paths: voice after playback, music after Stop, mantra and ambience after Stop; blur also bypasses when unused. Native silent audio-clock deadlines retain exit fades/tails and freeze with AudioContext suspension. Restart cancels stale disconnection. This does not bypass every common tone filter or active spatial panner.
- Source-reviewed controls/narration/audio/visuals maps updated. Automated thermal/cache, actual phonemizer and mock lifecycle/audio regression checks pass. No browser, listening, device CPU or thermal evidence; the reported premature exit remains unconfirmed. Existing fixture-dependent content-safety/drone-duration tests and stale Hindi delivery-version assertions remain excluded.
- Router recommends Sol/high; no active-model switch claimed. App 2.83 / CSS 1.91 / Sacred Depth 1.2 / shell 5.169. Local, not pushed; user will test.

### Scrolling narration removed — local, 2026-09-09

- Removed scrolling text from arrival, breathing and journey screens, its Settings toggle, translations, animation scheduling and playback hooks. Spoken narration, pause/stop and session countdowns remain.
- Replaced the obsolete ticker test with an audio-only contract. Narration, long-narration, No Frequency, journey completion and lobby-scroll checks pass. Atlas narration, controls and visuals maps updated. No browser/device listening evidence.
- App 2.82 / CSS 1.90 / shell 5.168 / language cache v26. This removal is local and not pushed.

### Production release preparation — 2026-09-09

- User authorized merge/push of accumulated workspace changes. Origin production fetched; HEAD and origin/production both at 988af6c before this release, so no divergent branch merge required.
- All non-browser test commands run: all pass except the established missing `docs/dot.json` fixture in content-safety/drone-duration and the Hindi test's obsolete hard-coded delivery versions. Syntax and diff checks pass; atlas generated. Browser/device verification remains unavailable/unperformed as recorded below.
- Release includes local routing, performance/audio/narration/sky refinements, optional narration text, seven-tap shared care unlock, translations and synchronized atlas. Exclude `.codex/` and `audio/BACKUP/background_music.mp3`. Earlier “not pushed” notes describe implementation checkpoints; this entry records release preparation, with push outcome reported in the conversation.

### Drone signal quality — local, 2026-09-09

- Removed main-pitch LFO and modulation gain: approved frequencies now remain unmodulated, saving two nodes per ordinary drone. Main sine low-pass cutoff moved from 1.1× to 4× pitch, capped at 45% sample rate, reducing unnecessary fundamental attenuation; six-second entry and existing levels retained. No new harmonics or frequency presets.
- Added end cleanup for ordinary/sleep main tones, stereo support pairs and their filters/panners/gains, Shot and guided cue nodes. Main-drone stop holds an active gain ramp where supported (MDN AudioParam.cancelAndHoldAtTime; explicit compatibility fallback retained). Shots honor zero volume; muted guided cues skip; nonfinite duration rejected.
- New mock test checks exact pitches, 50 repeated cleanup cycles, Sleep and true-mute behavior. No Frequency, zero-volume and transition checks pass. `audio` map updated. Full drone-duration suite still depends on missing owner-managed docs/dot.json; not recreated. No device listening/CPU measurement. App 2.81 / shell 5.167; not pushed.

### Spatial refinement — local, 2026-09-09

- Primary drone/music/mantra positions now stay in front in all modes; headphone and room layouts avoid previous rear placement. Drone sway slowed from 0.03 to 0.018 Hz and reduced to Stereo 0.18 / Headphones 0.06 / Room 0.08; Off stays zero. Music spatial bus also carries prelude video and Music Space. Narration/bells remain centered; no new processing nodes, timers or loops.
- Spatial parameters hold current automation when supported, then ramp. Fallback stereo pan derives from source bearing rather than raw x. Reapplying the same mode does not restart positioning; active ambience approaches from its current depth instead of jumping back, including a 1.2-second return for Off. First ambience starts retain their intended approach.
- Updated audio map; effect matrix, front-placement, repeated-setting and fallback-bearing checks pass. Actual speaker/headphone listening remains unverified. App 2.80 / shell 5.166; not pushed.

### Narration Voice Space refinement — local, 2026-09-09

- Reduced voice reverb impulse from 4.5 to 3.2 seconds (about 29% fewer stored impulse samples; no measured CPU claim). Added a 180 Hz high-pass on the wet send only; preserved dry voice. Fixed 35 ms pre-delay avoids delay pitch sweeps on preset changes. Light uses 12% return with 3 kHz damping, Spacious 18% with 3.6 kHz damping. Existing Off and Spatial independence retained.
- Warmth/Clarity inputs now clamp to 0–100 with neutral invalid-input fallback. Tone and reverb parameter changes hold current automation where supported before 250 ms ramps. No polling/analyser or additional convolver added. Applies to Piper only; browser speech remains outside Web Audio.
- Audio effects matrix, input bounds, fixed-delay, zero-volume, transition and spatial contracts checked. Updated `audio` map. Listening comparison and device performance unverified. Delivery app 2.79 / shell 5.165; local, not pushed.

### Meteor visibility adjustment — local, 2026-09-09

- User screenshot confirms visible sky, but a still image cannot verify animation. First meteor now appears after 5–9 visible seconds; wide-screen paths start beside central controls. Slightly brighter 1.8 px cached trail and 0.75–1.05 second flight improve visibility. Subsequent cadence remains 25–70 seconds, one meteor maximum; reduced motion still respected. No new loop or per-frame gradient. Updated `visuals` map; unit checks passed, no device visual confirmation. App 2.78, shell 5.164; not pushed.

### Experiment care unlock consistency — local fix, 2026-09-09

- Experiment Mode now shares the session-only Advanced features unlock. Care optgroup starts hidden/disabled and is detached while locked, then reattached with current translations on seven-tap unlock. Re-lock removes it, resets care selection to Root and refreshes duration controls. `startExperiment` rejects locked perineal/bath/assisted-bath requests before side effects. Regular experiments remain available.
- Expanded unlock tests cover picker removal/restoration, stale selection reset and direct execution rejection. Updated `experiments` map. Delivery: app 2.77, shell cache 5.163. Local/uncommitted, not pushed; no browser/device verification.

### Seven-tap unlock and restrained meteors — local update, 2026-09-09

- Settings → About → App version now accepts seven rapid clicks/keyboard activations, with a 1.5-second inter-tap reset; taps 1–4 silent, 5–6 countdown toasts, 7 confirmation. Intimate Service is hidden and disabled on each reload. After unlocking, the Advanced features switch is visible; OFF clears care selections and relocks. Mode/Shot visibility updates cannot reveal a locked panel. No authentication or persistent unlock added. Four-language labels included; held-key repeats suppressed.
- Meteors now first appear after 15–40 seconds and repeat every 25–70 seconds, at most one active. Tail length/speed scale down for small viewports; quick emergence and restrained variable brightness fade into a 180 ms residual. A 256×12 cached glow sprite avoids per-frame gradients/shadow blur; no idle meteor array filtering. Existing hidden-page/reduced-motion cancellation remains.
- Updated `modes` and `visuals` atlas descriptions. Unlock timeout/countdown/relock/reload and Yoga contract tests passed. No browser/device visual verification; prior atlas browser launch remains sandbox-blocked. Local/uncommitted, not pushed. Delivery: app 2.76, stylesheet 1.89, shell 5.162, language v25.

### Optional narration text — local update, 2026-09-09

- Settings under Meditation Visual Effect now offers “Show scrolling narration text”, default ON. Save persists `chakra_show_narration_text`; startup restores it. OFF hides all three narration surfaces and skips their layout/animation scheduling, without muting speech or changing timing. Translated in English, Malayalam, Russian and Hindi.
- Updated `narration` map. Delivery: app 2.74, stylesheet 1.88, shell cache 5.160, language cache v24. Local/uncommitted, not pushed. Narration contract and syntax checks pass; atlas regenerated. Device/browser verification remains unperformed.

### Long audio and narration — local fixes, 2026-09-09

- Fixed timer-dependent repeat underruns by baking the existing equal-power overlap into reusable PCM and using one native looping source per layer. First entry preserves original head audio; loopStart skips the head already blended into the tail. No recurring loop scheduling timers or accumulating paused sources. Independent volume and explicit stop fades remain; prepared PCM adds one reusable buffer per original/overlap variant and is weakly keyed by the original buffer.
- Elemental stage stop now stops its LFO as well as noise. Noise end disconnects the filter, gain and both modulation gains. Piper now decodes and normalizes ahead in its bounded sentence queue; cancellation generation and activity/pause checks prevent stale prepared clips starting. Narration scroll remains: it was not the repeated phonemizer initialization identified in review. Deliberate sentence and exit pauses remain.
- Added BoundedPhonemizer: real CLI WASM reuse capped at eight calls or 8,192 cumulative characters, then retirement; retire on failure. Indefinite reuse is unsafe because this bundled callMain allocates stack without exporting restoration. Real local WASM tests verified stable English/Malayalam/Russian phonemes across 64 calls, eight initializations, and retirement after large input. This is not an end-to-end ONNX or device listening benchmark. Inference input/output tensors are disposed in finally after WAV conversion.
- Tests passed: native PCM/crossfade boundaries, timer independence, one-source tracking, cached reuse, elemental LFO stop, decode-ahead and cancellation; existing narrator ticker, audio safety, spatial/effect controls, background music and prelude checks. Atlas `audio` and `narration` descriptions updated and visual source references refreshed. Browser atlas validation remains unavailable due to the previously recorded sandbox launch failure.
- Delivery: app 2.73, shell cache 5.159, Piper cache v9 (runtime import update). Local/uncommitted, not pushed. Actual heat reduction, full neural synthesis, and long-session listening still require target-device verification. OS audio suspension and silence inside recordings are outside the timer fix.
- Extra language checks: Russian and language-intention pass. Hindi assertions reach a pre-existing hard-coded delivery-version check expecting app 2.62 / shell 5.147 / language v22; current versions already exceeded those before this pass. That unrelated stale version contract remains unfixed; do not report the entire suite as passing.

### Performance optimization — local update

- Date: 2026-09-09. Investigated the reported device heat through source review. Found repeated celestial gradients/text/blur per frame, display-rate callbacks in both capped renderers, per-frame Sacred Depth layout reads, and temporary audio connections without explicit end cleanup. These are avoidable work, not measured proof of the device's thermal cause.
- Sky now caches celestial artwork until observer positions, language, font status or canvas dimensions change; identical resize events skip backdrop regeneration and repeated start calls cannot duplicate the loop. Both visual renderers sleep 33 ms before requesting another display-aligned frame. Pending timers/frames cancel on hide; CSS animations pause in hidden tabs. Sacred Depth reuses measured dimensions until ResizeObserver invalidation and detaches its analyser when inactive, hidden, paused, reduced-motion or in fallback.
- Piper clip source/gain and bell oscillator/filter/gain connections disconnect after playback ends. No forced garbage collection, audio fade changes, unrelated process termination, or removal of recovery assets. The celestial cache trades one reusable canvas for less repeated drawing/allocation.
- Updated the `visuals` atlas map with work-budget and background cleanup paths. Delivery versions: app 2.72, stylesheet 1.87, Sacred Depth 1.1, shell cache 5.158. Uncommitted/local; not deployed.
- Atlas generation passed (24 maps, 221 nodes, 253 edges). The browser-based atlas verifier could not launch Chromium because the sandbox denied its macOS bootstrap port; no escalation or substitute browser run was attempted. Diagram interaction/appearance remains unverified.
- Validation: executable mock tests for sky cache invalidation, 100-frame reuse, hide/resume/reduced-motion scheduling and Sacred Depth lifecycle; existing visual, audio transition, zero-volume, spatial, mixer, background music and prelude checks passed. Syntax checks passed. Browser/device profiling and listening remain unperformed; no measured CPU, battery or temperature reduction is claimed. Next device check: compare the same scene, brightness and audio settings for 10 minutes, including Pause, tab hide/return, Stop and restart.

### Workspace auto model routing — local update

- Date: 2026-09-09. Added intelligent per-task Codex model routing to the local Loop workspace. `Loop/scripts/codex_model_router.py` now defaults to `--task-class auto`, reads the bounded task prompt, infers task intensity, and selects the matching route from `Loop/config/model-routing.json`. Explicit task classes remain supported when a supervising workflow has already classified the bounded task.
- Refreshed the routing table to the current Codex model family guidance: Luna for light/simple work, Terra for everyday standard work, Sol for deeper reasoning/implementation, and Astra for large-context or high-risk production/security/release lanes. The adapter still uses per-run model and reasoning overrides only; it must not rewrite global Codex settings.
- Added regression coverage for automatic classification, current route choices and prompt-safe decision logging via `npm run test:model-routing`. This is workspace orchestration only; no website user flow changed, so the app atlas remains accurate without a graph topology update. Local change is not committed or deployed.

### Audio control/routing corrections — local update

- Voice Space now independently honors Off/Light/Spacious in all spatial modes. Removed the forced ethereal override and updated spatial guidance in all four UI languages. Spatial Off fades added drone pan modulation to zero; initialization also starts it at zero. Original recording stereo and deliberate binaural channels are not collapsed to mono.
- Removed the shared filtered-duplicate path, its nodes and transition swell calls; dedicated Voice Space, Music Space and mantra convolution returns remain. Background music EQ is now peaking with a neutral starting gain, a gentle -3 dB ducked target and 0 dB full target. Saved settings, volumes, comfort controls and existing reverb presets remain otherwise unchanged. No compensating loudness boost was added.
- Added executable 12-combination Voice Space/spatial control tests, unknown-value fallbacks and routing checks. Device listening and measured output loudness remain unverified. Audio/narration atlas updated. App v2.71; shell v5.157; language cache v23. Committed and pushed to `production` in `988af6c`.

### Night-sky label backing blur — local update

- Label backing now uses a 3 px canvas blur, isolated by save/restore so text and outline stay sharp. Text remains 30%, backing/outline 15%; Moon stays unlabeled. This softens the backing itself, not the stars behind it. Browsers without canvas filter support retain the plain backing.
- Visual contract and syntax checks cover the change; browser appearance remains unverified. App v2.70; shell v5.156. Committed and pushed to `production` in `988af6c`.

### Sacred Depth GPU treatment — local prototype

- Date: 2026-09-09. Select Settings → Meditation visual effect → Sacred Depth. Existing saved preferences are not overwritten. `celestial-presence.js` adds WebGL 1 relief displacement, selective moving moonlight highlights, procedural atmosphere on transparent margins and a smoothed read-only mantra response. All existing source art remains unchanged. This is illustrative 2.5D: the relief envelope is authored mathematically and highlights derive from luminance, not an anatomical depth map or a reconstructed statue.
- GPU drawing is bounded to 30 fps, 960 px longest edge and 1.25 DPR. Original image remains the fallback on unsupported WebGL, load/texture errors or context loss. Session pause freezes frames; hidden pages cancel them; reduced motion produces a static frame; stop/Eyes Close deactivate the renderer. No microphone, network rendering library, gain change or new source image.
- The breathing-like atmospheric rhythm is decorative; Box Breathing runs on a separate screen and is not synchronized with this treatment. One reusable renderer covers the selected chakra/deity image rather than duplicating GPU contexts per image.
- Visual atlas updated; renderer lifecycle tests use a mock GPU, and existing visual/prelude checks pass. Shader compilation, actual rendered appearance, and phone performance still need browser verification; do not describe the prototype as visually approved. CSS v1.86, app v2.69, renderer v1.0, shell v5.155. Committed and pushed to `production` in `988af6c`.

### Meditation imagery — local, uncommitted update

- Date: 2026-09-09. Chakra/deity artwork now remains fully opaque; breathing uses a subtle 1.8% scale and 2 px lift instead of opacity changes. Aura, Holographic and Depth use restrained layered starlight behind the artwork, with slow 12–26 s light motion; removed the foreground screen wash and visible ring border. Original image assets are unchanged.
- Fixed a premature reduced-motion media-query closing brace that disabled image/shimmer animation globally. Reduced motion still disables all effect motion; inactive/Eyes Close decorations stay hidden. Explicit brightness and Sleep dimming are preserved.
- Visuals atlas updated without topology changes. Visual and night-sky contracts pass; browser appearance and device performance have not been verified. CSS v1.85, shell cache chakra-v5.154. Not committed or deployed.

### Audio transition repair — local, uncommitted update

- Date: 2026-09-09. Music/mantra now crossfade concurrently (6 s entry, 4 s return); cancellation is checked before touching the music gates after decoding. Removed doubled mantra volume and exit fading. Music entry uses a linear bus ramp without another long source fade; completion uses one exit envelope.
- Shared loops isolate volume from equal-power repeat envelopes, bound overlap for short recordings, and stop sources on the AudioContext clock rather than wall-clock cleanup timers. Drone, anchor and elemental source retirement also follows audio time. Piper clip endings use at most 50 ms fading so final words remain audible.
- Read-only FFmpeg scan of all nine active MP3s found no stretches below -50 dB lasting at least 0.5 s. A -35 dB scan found quiet entrances of 0.54–1.08 s in five mantras; recordings were not destructively trimmed. This does not establish perceived loudness or browser playback quality.
- Verification: 23 runnable non-browser contracts pass, including new simulated loop-envelope tests. Hindi contract still hardcodes pre-sky app/cache versions 2.62/v5.147 and fails that assertion; language behavior assertions before it pass. Content-safety and drone-duration checks remain excluded because their owner-managed docs/dot.json fixture is absent. No browser checks performed.
- Chakra, narration and audio maps updated. Shell: app.js v2.68, cache chakra-v5.153. No commit or deployment performed. Automated fake-clock envelope and existing audio contract checks cover scheduling, mute and handoff behavior; no device listening evidence. Embedded recording silence, mobile background timer throttling and every journey timing combination remain unverified. Intentional breath/stillness gaps and safety/suppression settings remain unchanged.

### Natural night sky — local, uncommitted update

- Date: 2026-09-08. Base: production `6a0ee84`; this change is not committed or deployed.
- Added `night-sky.js`: deterministic 700–2,400-point background, faint procedural Milky Way luminance/dust lanes, cached star sprites/backdrop, and at most 110 stationary stars with restrained scintillation. Replaced the moving colored CSS clouds with a neutral dark atmosphere.
- Existing observer-aware celestial overlay remains approximate. Moon now uses a cached textured sphere/transparent illumination mask; planets remain small points without decorative Saturn rings. The Moon is intentionally unlabeled. Other localized celestial names remain compact at 11 px, with 30% text and 15% dark backing/outline opacity so they stay within the night sky rather than reading as interface elements. Meteors start after 35–90 seconds, then occur individually every 45–120 seconds.
- Reduced-motion preference changes stop/restart the animation live; hidden pages clear meteor state. Rendering retains the 1.5 DPR cap. No external sky imagery or data downloads were added. Journey and audio paths were not changed.
- Shell references: `style.css?v=1.84`, `night-sky.js?v=1.0`, `app.js?v=2.63`; shell cache `chakra-v5.148`. New renderer is in precache.
- Visual flow atlas updated alongside implementation and labeled as uncommitted; source references regenerated. Static/unit evidence: renderer determinism, bounded draw count, stationary stars, static reduced-motion drawing, lunar phase transparency/orientation and phase caching; existing visual/prelude contracts and syntax checks pass. Browser preview was declined, so no desktop/mobile appearance, frame-rate or device playback verification is claimed. A scoped `tests/night-sky-browser.mjs` check is available for later preview authorization.

### CP-VIDEO-108 — Ultra-short prelude exit fade

- Date: 2026-09-08 (Asia/Kolkata).
- Reduced the `generate.mp4` final visual/audio fade from 0.75 seconds to 0.25 seconds, keeping the 10-second clip visible until its final quarter-second before the journey handoff.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device playback remains the final visual check.

### CP-VIDEO-107 — Meditation-language celestial labels and shorter exit fade

- Date: 2026-09-08 (Asia/Kolkata).
- Celestial labels for the Moon, planets, and named stars now resolve through `state.language`, the selected Meditation Language, instead of `state.displayLanguage`. Settings/UI labels continue to follow Display Language.
- Reduced the `generate.mp4` final visual/audio fade from 1.5 seconds to 0.75 seconds so the short clip remains fully visible longer before handoff.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Evidence level is `static`/`unit`; browser/device playback remains open.

### CP-VIDEO-106 — Prevent short-video end-of-clip stall

- Date: 2026-09-08 (Asia/Kolkata).
- Fixed a real prelude edge case: the 10-second `generate.mp4` could pause when roughly 2 seconds remained because recovery required 4 seconds of future buffer, which could never be satisfied near the end of the clip.
- The rebuffer guard now avoids entering recovery during the final fade window, and native `waiting`/`stalled` events now enter the recovery path explicitly. Resume targets are bounded by the actual remaining duration.
- The reported `chext_loader.js` `unload` permissions-policy warning and asynchronous message-channel errors are browser-extension messages, not Lite source errors. They should be retested with the extension disabled or in a clean browser profile if console verification is needed.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, and `git diff --check` PASS. Evidence level is `static`/`unit`; browser/device playback remains open.

### CP-VIDEO-105 — Responsive short-prelude buffering

- Date: 2026-09-08 (Asia/Kolkata).
- Reduced the `generate.mp4` startup gate from effectively the full 10-second clip to a measured 4-second buffer, with a 750 ms stability confirmation. Slow-link targets are now capped at 6–8 seconds rather than 30–60 seconds.
- Retained playback protection: if buffered-ahead time falls below 2 seconds, playback pauses and resumes after 4 seconds are available. Reduced the post-button meditator image hold from 15 seconds to 3 seconds.
- The MP4 was already valid and fast-start indexed; the delay was caused by the conservative buffer policy and intentional image hold, not file corruption.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Evidence level is `static`/`unit`; browser/device playback remains open.

### Loop refresh — 2026-09-08 (Inner-presence narration and active requirements)

- Existing-project activation completed from `/Users/lekshmisyam/Desktop/Ikigai/lite`. Reusable Loop instructions remain under `/Users/lekshmisyam/Desktop/Ikigai/lite/Loop`; the protected Loop policy and routing documents were read and were not changed.
- Runtime baseline: static HTML/CSS/JavaScript PWA with Web Audio, Piper/Web Speech narration, local JSON content, service-worker caching, and npm-based unit/contract tests. Host detected as Darwin arm64 with Node v25.9.0.
- Latest approved delivery is commit `7622c2a` on `production`, and `origin/production` matches it. The four-language inner-presence passage is merged into the existing `intro.gratitude_en`, `intro.gratitude_hi`, `intro.gratitude_ru`, and `intro.gratitude_ml` narration blocks. The temporary `system.innerPresence` field was removed, so no new narration stage or runtime code path exists.
- Active content requirements: preserve the existing journey order and narration behavior; keep English, Malayalam, Russian, and Hindi aligned; retain trauma-aware, optional, non-forceful language; avoid claims that a divine outcome is guaranteed; preserve all unrelated script fields and facilitator content.
- Validation for this checkpoint: `scripts.json` JSON parsing and `git diff --check -- scripts.json` PASS. Evidence level is `static`; no browser playback, listening, or Playwright evidence was run.
- Existing local state remains intentionally isolated: modified application files, `.DS_Store` files, deleted owner-managed `docs/dot.json`, `.codex/`, and untracked `audio/BACKUP/background_music.mp3` were not included in the narration commit and must not be cleaned up or restored without explicit approval.
- Current Loop next action: treat `production`/`origin/production` at `7622c2a` as the content baseline. For future work, inspect the relevant source/tests first, preserve unrelated edits, run proportionate static/unit validation, update this handoff, and request approval before any merge, push, deployment, deletion, or history rewrite.

## START

### Local checkpoint — 2026-09-07 (Cinematic ambient background)

- Added a CSS-only, full-viewport ambient background behind the meditation surface: two oversized blurred colour volumes drift slowly over a near-black field, with the active chakra colour supplied through the existing `--primary-color` variable. This gives the 3D image treatment more depth while preserving readability and avoiding image/WebGL/per-frame rendering cost.
- The background is intentionally low-contrast and uses `prefers-reduced-motion` support. It does not alter audio, narration timing, image assets, or the existing visual-effect selector. Delivery rotates to `style.css?v=1.66` and shell cache `chakra-v5.111`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction; target-device visual comfort remains the final QA gate.

### Local checkpoint — 2026-09-07 (Reveal ambient background in fullscreen)

- Fixed the cinematic background being hidden during the fullscreen journey: `#app:fullscreen` no longer paints an opaque black layer over the shared `#nebula-bg`. The video prelude keeps its own opaque black stage, so this change does not affect video presentation.
- Delivery rotates to `style.css?v=1.67` and shell cache `chakra-v5.112`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Subtle ambient particle field)

- Added the previously missing particle layer as a lightweight 2D canvas star field. It is globally available behind the app, uses a capped device-pixel ratio and responsive particle count, moves only a few pixels with restrained twinkle, pauses while the document is hidden, and renders a static frame when reduced motion is requested.
- No WebGL, external assets, audio changes, or meditation timing changes were introduced. Delivery rotates to `style.css?v=1.68` and shell cache `chakra-v5.113`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction; target-device visual comfort remains the final QA gate.

### Local checkpoint — 2026-09-07 (Particle visibility tuning)

- Increased the particle field's visibility after owner review: particles are now larger, brighter, and given a restrained blue-white halo. The field remains sparse, slowly moving, and capped for mobile performance; no audio or journey timing behavior changed.
- Delivery rotates to `style.css?v=1.69` and shell cache `chakra-v5.114`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Responsive star sparkles)

- Refined the particle field into a responsive star-sky treatment. Particle count now scales with viewport area (30–150 particles), and each particle is rendered as a tiny four-point star with a soft halo, gentle rotation, and restrained slow twinkle. The motion remains low-amplitude and non-flashing for meditation use.
- Delivery rotates to `style.css?v=1.70` and shell cache `chakra-v5.115`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Natural star variation)

- Varied each star's four ray lengths independently, added small per-star brightness differences, and introduced very gentle two-axis drift. Each star fades and brightens on its own slow phase, avoiding synchronized flashing while making the field feel less mechanically generated.
- Delivery rotates to `style.css?v=1.71` and shell cache `chakra-v5.116`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Bright stellar twinkle core)

- Changed the star sparkle core to clean white while retaining a cool blue-white halo. The existing slow, unsynchronized twinkle and low-amplitude drift remain unchanged, so the stars gain clarity without becoming a flashing or high-contrast effect.
- Delivery rotates to `style.css?v=1.72` and shell cache `chakra-v5.117`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Layered responsive sky)

- Reworked the particle field into three depth layers: a fuller field of dim background pinpricks, visible middle stars, and sparse foreground sparkles. Density scales with viewport area (80–220 particles), with only selected middle/foreground stars receiving the stronger slow twinkle. Background stars remain steady so the effect feels like a sky rather than a flashing surface.
- Delivery rotates to `style.css?v=1.73` and shell cache `chakra-v5.118`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Visible star twinkle timing)

- Corrected the barely visible twinkle: the cycle now runs at a gentle 18–39 second range instead of approximately 95 seconds. Middle and foreground stars have stronger but bounded contrast, selected stars receive independent twinkle phases, and larger sparkles now draw a bright white core.
- The reported `chext_loader` permissions/message-channel messages are external browser-extension warnings; they are not generated by the particle field.
- Delivery rotates to `style.css?v=1.74` and shell cache `chakra-v5.119`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Quick glint, long star hold)

- Refined the twinkle envelope so stars brighten faster, remain at peak brightness for about 40% of each cycle, and fade more slowly across the remaining phase. Individual random phases remain unsynchronized to avoid a flashing effect.
- Delivery rotates to `style.css?v=1.75` and shell cache `chakra-v5.120`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-07 (Slow image breathing light)

- Added a restrained slow fade cycle to the active chakra symbol or presiding-deity image. Each chakra receives a randomized 8–16 second phase and the image stays between 0.90 and 1.0 opacity, so it remains present rather than disappearing. Eyes Close Mode and `prefers-reduced-motion` disable the animation.
- Delivery rotates to `style.css?v=1.76`, `app.js?v=2.37`, and shell cache `chakra-v5.121`.
- Validation: `static/unit` PASS — `test:visual-effect`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-08 (Universe fly-through prelude)

- The uploaded `Stunning New Universe Fly-Through Really Puts Things Into Perspective [nGnX6GkrOgk].webm` is now the primary Restart Journey prelude video. The existing `nature-upgrade.mp4` remains only as a compatibility fallback; the end-of-session video idea was not implemented.
- Existing fullscreen behavior, explicit Play action, video-volume control, spatial routing, and fade treatment are unchanged. Delivery rotates to `style.css?v=1.77`, `app.js?v=2.38`, and shell cache `chakra-v5.122`.
- Validation: `static/unit` PASS — `test:journey-video-prelude`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-08 (Meditator image lead-in)

- Added the supplied `video/meditator.png` as a short visual lead-in to the Restart Journey prelude. After the explicit Play action, it holds for 2.2 seconds while fullscreen is requested, then crossfades into the primary FHD WebM. The video remains natively `preload="auto"` and is explicitly prepared with `load()`; the existing MP4 fallback remains available.
- No end-of-session video was added. The browser's native fullscreen exit notification remains browser-controlled and cannot be hidden by Lite; Lite does not add a duplicate popup.
- Delivery rotates to `style.css?v=1.78`, `app.js?v=2.39`, and shell cache `chakra-v5.123`.
- Validation: `static/unit` PASS — `test:journey-video-prelude`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-08 (Buffer-gated video start)

- The Restart Journey prelude now keeps the meditator image visible while the FHD WebM buffers. The Begin button stays hidden until the browser reports future media data and at least a measured four-second safe buffer; a failed/timeout buffer safely continues through the existing unavailable-video path. After Begin, the image holds for five seconds before crossfading into playback.
- Delivery rotates to `style.css?v=1.79`, `app.js?v=2.40`, and shell cache `chakra-v5.124`.
- Validation: `static/unit` PASS — `test:journey-video-prelude`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-08 (Cinematic pointer and image hold)

- Extended the meditator image hold from five to eight seconds after Begin, allowing the browser's fullscreen notification to settle before the video takes focus. The pointer is hidden for the active cinematic prelude and returns when the prelude closes; Lite does not attempt to suppress browser-owned fullscreen UI.
- Delivery rotates to `style.css?v=1.80`, `app.js?v=2.41`, and shell cache `chakra-v5.125`.
- Validation: `static/unit` PASS — `test:journey-video-prelude`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-08 (Extended meditator image hold)

- Extended the meditator image hold from eight to fifteen seconds before the Restart Journey video begins. Buffer gating, fullscreen behavior, pointer hiding, fades, and audio routing remain unchanged.
- Delivery rotates to `app.js?v=2.42` and shell cache `chakra-v5.126`.
- Validation: `static/unit` PASS — `test:journey-video-prelude`, app/service-worker syntax, and `git diff --check`. No Playwright or screenshots were run, per owner direction.

### Local checkpoint — 2026-09-08 (Performance review — 15-second prelude hold)

- The 15-second `meditator.png` hold has negligible runtime cost: it is one static 1.5 MB image, displayed before video playback, with no animation or repeated decoding. Its only user-visible cost is the intentional 15-second wait before video playback.
- The requested prelude WebM is FHD AV1 at 1920×1080/25 fps with Opus audio, approximately 70.4 MB and 344 seconds long. The browser is allowed to buffer it natively and Lite now waits for at least four seconds of future media data before revealing Begin, which reduces startup stutter without attempting to download the full asset.
- Residual performance risk: AV1 hardware decode is not equally available on older phones, some browsers, or low-power devices; software decoding may increase CPU, battery use, or cause dropped frames. The 80–220-particle canvas field is bounded and rendered at a capped 1.5 device-pixel ratio, but its shadow blur should still be checked on low-end mobile hardware.
- Recommendation: retain the current WebM for capable devices, then provide an H.264/AAC encode of the same universe video as a true compatibility fallback when available. The current MP4 fallback is a different video, so it preserves compatibility but not identical content.
- Loop evidence: `static` — detected host `Darwin arm64`, measured asset metadata with `ffprobe`, inspected buffering and particle code, and refreshed relevant handoff records. No browser/runtime/device playback benchmark was run because Playwright/screenshots are opt-in and were not requested.

- Current objective: keep `production` stable while refining Yoga and decoupling Intimate Service into its own Lobby experience.
- Target root: `/Users/lekshmisyam/Desktop/Ikigai/lite`.
- Reusable instructions root: `/Users/lekshmisyam/Desktop/Ikigai/lite/Loop`; `Loop/loop.md` is the protected collaboration policy and must not be changed during routine application work.
- Stack: static HTML/CSS/JavaScript PWA with Web Audio, Piper/Web Speech narration, local JSON content, service-worker caching, and npm-based test tooling. There is no backend, database, authentication layer, or production build step.
- Permanent constraints: preserve existing journey order unless explicitly changed; keep `docs/dot.json` as custom facilitator content; add only missing schema fields to fixtures; commit each feature/fix with a detailed reference message; do not run Playwright or take screenshots unless the owner explicitly requests it.
- External actions remain approval-gated: do not merge, push, deploy, or rewrite branch history unless the owner asks.

## MID

- Stable production baseline: `production` remains the release branch; feature work must stay on its dedicated branch until the owner requests a merge.
- Delivered product shape: bilingual English/Malayalam guided journeys; seven-chakra customization; HRIM, Sleep, Music Only, Yoga/Bath/care extensions; Piper narration with browser fallback; trauma-aware wellness boundaries; assessment handoff; and a user-activated, `Source=Lite`-only Earn link after completion.
- Runtime content source is `scripts.json`. `test-script.json` is a short schema fixture. `docs/dot.json` is independently authored facilitator content and is not synchronized from production wording.
- HRIM is a separate energizing/recharge experience with no local-time restriction; it is not an eighth chakra. Its script-defined drone centre is 528 Hz.
- Chakra frequencies follow the widely used modern Solfeggio mapping in this product; they must not be represented as measured anatomy, clinical treatment, or a canonical fixed-Hz rule from classical yogic texts.

## NOW

### Local checkpoint — 2026-09-07 (Meditation visual effects)

- Scope: Settings now has a persisted `Meditation Visual Effect` selector with `Natural`, `Aura Glow`, `Holographic`, and `Sacred Depth`. It applies to the existing meditation image area for normal chakra symbols and presiding-deity images without changing image assets or adding WebGL/canvas/per-frame JavaScript.
- Implementation: `VisualEngine.applyImageEffect()` owns the `#chakra-container` classes, binds the active chakra color into `--chakra-visual-color`, and suppresses decorative effects when Eyes Close Mode is active. CSS uses pseudo-elements, drop shadows, subtle glow, and a slow shimmer only for Holographic mode; `prefers-reduced-motion` disables animation.
- Delivery: `index.html` now loads `style.css?v=1.65` and `app.js?v=2.36`; service-worker shell cache is `chakra-v5.110`.
- Validation: `static/unit` PASS — `node --check app.js`, `node --check sw.js`, locale/package JSON parsing, `test:visual-effect`, `test:spatial-audio`, `test:russian-language`, `test:hindi-language`, `test:language-intention`, `test:narration-ticker`, `test:splash`, and `git diff --check`. No Playwright, screenshots, browser run, or real-device visual performance check was performed by owner direction.
- Preserve unrelated local state: `.DS_Store`, `audio/.DS_Store`, deleted `docs/dot.json`, `.codex/`, and `audio/BACKUP/background_music.mp3` remain unrelated and must stay excluded.

### Local checkpoint — 2026-09-07 (Chakra body-awareness narration)

- Scope: `scripts.json` seven chakra `meditation_*` fields only, across English, Malayalam, Russian, and Hindi. Each chakra now includes one gentle body-awareness cue immediately before its mantra sentence: Root uses an optional pelvic-floor/base engage-and-release cue; Sacral uses lower belly/hips/pelvis softening; Solar uses navel/diaphragm/upper-abdomen breath; Heart uses chest/shoulder-blades/palms; Throat uses jaw/tongue/throat/neck; Third Eye uses forehead/eyes/brow; Crown uses crown/space-above/spine openness.
- Tone/safety boundary: wording remains optional, slow, comfortable, and non-forceful. The direct anatomical phrase “contract the anus” is deliberately not used. No timing, code, frequency, mantra, locale UI, fixture, or `docs/dot.json` changes are part of this checkpoint.
- Validation: `static/unit` PASS — scripts JSON parsing, all-language body-cue coverage scan, direct script-only safety scan, `test:hypnosis-journey`, `test:russian-language`, `test:hindi-language`, `test:language-intention`, and `git diff --check`. `test:content-safety` remains blocked before assertions because owner-managed `docs/dot.json` is absent.

### Local checkpoint — 2026-09-07 (Closing possible-update narration)

- Branch/server baseline: `production` matches `origin/production` at `d2dfdcf` (`Merge branch 'premium-script-refinement'`). The owner also noted a server push before this checkpoint; fetch confirmed no local/remote divergence before editing.
- Scope: `scripts.json` closing narration and closing affirmation only. English, Malayalam, Russian, and Hindi now include the approved concepts that receiving/healing/protection/change are possible, and that the session can feel like a clean inner update received where scattered or misaligned experience begins to correct in the way currently possible.
- Journey behavior unchanged: no code, timing, frequency, mantra, audio, locale UI, service-worker, fixture, or `docs/dot.json` changes are part of this checkpoint.
- Validation: `static/unit` PASS — `scripts.json` parses, all four closing/affirmation language fields exist, `test:hypnosis-journey`, `test:russian-language`, `test:hindi-language`, `test:language-intention`, direct script-only concept/safety scan, and `git diff --check -- scripts.json`. `test:content-safety` is blocked before assertions because owner-managed `docs/dot.json` is currently absent; it was not restored or rewritten. No Playwright, screenshots, browser run, or listening evidence was performed.
- Preserve unrelated local state: `.DS_Store`, `audio/.DS_Store`, deleted `docs/dot.json`, `.codex/`, and `audio/BACKUP/background_music.mp3` remain unrelated and must stay excluded from any script checkpoint commit unless the owner explicitly asks.

### Resume snapshot — 2026-09-03 (production, Journey video prelude complete)

- Target application root: `/Users/lekshmisyam/Desktop/Ikigai/lite`. Reusable Loop instructions root: `/Users/lekshmisyam/Desktop/Ikigai/lite/Loop`. The current Loop policy, delivery workflow, and Loop skill were reread for this handoff refresh; they are protected framework files and were not changed.
- Git/remote baseline: branch `production`, merge commit `4077d17` (`Merge branch 'journey-video-prelude'`) is pushed to `origin/production`. It contains the complete approved prelude sequence through `[CP-VIDEO-050]`. No feature branch remains active for this work.
- Restart Journey behavior: after the existing restart confirmation, `MeditationController.stop({ preserveScreen: true })` stops the outgoing journey without exposing the Lobby. A paused, cinematic prelude displays the localized Do Not Disturb reminder. The guide must tap Begin introduction; that user gesture requests fullscreen for persistent `#app`, then begins the video. The video is letterboxed (`contain` on black), its native audio enters the existing Music/Spatial/Music Space routing at the shared Music / Video Volume level, and both visual stage and audio dissolve over the final 8 seconds. On completion, the app goes directly into the new journey, remains fullscreen, and does not repeat the DND alert. Unavailable video falls back safely to the normal localized reminder and normal journey start.
- Fullscreen journey chrome: `JourneyVideoPrelude` explicitly tracks the `fullscreenchange` lifecycle for `#app`. During app-owned fullscreen, `body.journey-fullscreen-active` hides bottom controls and both top countdown rings. The dedicated bottom-edge reveal zone, pointer/focus handling, and the `fullscreen-controls-visible` class reveal them; they hide 120 ms after pointer/focus departure. Normal Stop or Return to Room exits fullscreen. Browser/device visual behavior still needs target-device manual verification; no Playwright or screenshots were run by owner direction.
- Language rule: Settings continue to follow Display Language. Every active journey-stage label now follows Meditation Language via `journeyT()`, including Preparation, Moon/Returning, Gratitude, Intention, Box Breathing completion, Corpse Pose, care and guide-controlled transitions, Music Only, Yoga/rest, Sleep/Shot labels, and the closing Body marker. This resolves Malayalam narration screens that previously displayed the English Preparation title; English, Malayalam, Russian, and Hindi shipped locale coverage is retained.
- Delivery/cache state: `index.html` loads `app.js?v=2.34`; shell cache is `chakra-v5.108`. The 42 MB `video/nature-upgrade.mp4` is tracked but intentionally omitted from service-worker precache, so it loads on first use instead of inflating PWA installation updates.
- Fresh feature validation before merge was `static/unit`: JavaScript/service-worker syntax; `test:journey-video-prelude`, Hindi, Russian, language intention, narration ticker, background music, spatial audio, and `git diff --check` passed across the feature checkpoints. This does not prove visual layout, device fullscreen, or audible fade quality.
- Preserve unrelated local state: `.DS_Store` and `audio/.DS_Store` are modified; `docs/dot.json` is deleted by owner action; `.codex/` and `audio/BACKUP/background_music.mp3` are untracked. They are not part of the video feature, were never staged, and must remain untouched unless the owner explicitly directs otherwise.
- Next action: no new feature is active. On the next request, begin from `production` commit `4077d17`, keep the above local files isolated, and use the focused source/tests for the requested surface. If the user reports fullscreen UI behavior again, inspect the `JourneyVideoPrelude` lifecycle and `journey-fullscreen-active` / `fullscreen-controls-visible` classes before changing other journey code.

### Active feature — 2026-09-04 (Premium Script Refinement)

- Branch: `premium-script-refinement`, created from production baseline `8f32c0d`. This is an approved content-and-timing track; it must not alter the journey order, frequencies, mantras, runtime audio behavior, or owner-deleted `docs/dot.json`.
- The opening and returning narration now use a more concise, ceremonial private-session tone in English, Malayalam, Russian, and Hindi: the meditator is received, invited to set down the day, guided into a white-gold aura, and prepared for renewal without making external guarantees.
- Root, Sacral, and Solar Chakra narration is being refined in all four languages. Root now centres embodied trust and dependable support; Sacral treats sensitivity as strength, consent, emotional clarity, and creative freedom; Solar adds the approved theme of recognising timely opportunities and meeting good fortune through preparation, discernment, and grace.
- Timing audit finding: the former countdown used fixed per-chakra/extra-minute constants even though the live path includes all narration, narration exit gaps, two Arrival cues, selected mantra durations, intervals, final silence, closing, and Emergence. `MeditationController.estimateStandardJourneySeconds()` now measures those actual selected script blocks and `getSessionDurationMs()` uses the measured result once the script is loaded. This preserves the configured pauses and gives the continuous session ring a much more honest duration.
- A Loop reasoning-model editorial child was requested under route `premium-script-refinement-001`, but the local record remains `DISPATCHING` without output. Do not claim a successful routed result; supervisor source review and static validation remain the evidence for this checkpoint.
- Current validation: `static/unit` PASS — `node --check app.js`, scripts JSON parsing, hypnosis journey, narration ticker, language-intention, Russian, Hindi, and diff whitespace contracts. `test:content-safety` remains blocked by the owner-managed deletion of `docs/dot.json`, which is intentionally untouched. No Playwright, screenshots, browser, or listening tests were run.
- Release decision: the owner approved this scoped checkpoint for merge and push. The remaining Heart, Throat, Third Eye, Crown, and closing refinements are intentionally deferred to a later, separately reviewed script pass; they do not block this release.

### Active feature — 2026-09-03 (Video Volume Settings)

- Branch: `video-volume-settings`, created from local production handoff checkpoint `2293465`; do not merge or push without owner approval.
- Decoupled `state.volVideo` from `state.volMusic`. Video Volume is persisted as `chakra_vol_video`, has the same non-zero 0.02–0.5 safety range, and is used both for the restart prelude and a Settings-only preview. Background Music remains in Journey Tuning as `volMusic` and its existing live role-preserving fade behavior is unchanged.
- Settings now provides Video Volume and Preview Video Audio. The preview uses the supplied prelude media and existing Web Audio Music/Spatial/Music Space route without starting a journey, fades in to Video Volume, plays for eight seconds, then fades and resets. It is user-gesture initiated and does not request fullscreen.
- Delivery is rotated to `app.js?v=2.35` and `chakra-v5.109`. Validation: `static/unit` PASS — JavaScript syntax, `test:journey-video-prelude`, Hindi language contract, and diff check. No Playwright, screenshots, or device listening were run by owner direction.

### Active feature — 2026-09-02 (Journey video prelude)

- Branch: `journey-video-prelude`, created from `production` commit `8d63042`. Scope is intentionally limited to the supplied `video/nature-upgrade.mp4` restart prelude; no ordinary Begin Journey, Shot, Sleep, Music Only, Experiment, or completion flow is changed.
- After the existing Restart Journey confirmation, the active session stops and the supplied video fills the app viewport in a paused ready state. Before playback, it clearly asks the guide to enable Do Not Disturb and requires the explicit Begin introduction button. That genuine tap requests the persistent app container in browser/device fullscreen before starting the video and its native audio; unsupported browsers retain the app-viewport fallback. Fullscreen now intentionally remains through the guided journey, then exits when the guide uses Stop to return to the Lobby. There is no Skip path. The audio enters the Web Audio graph at the guide-selected Music level, follows the existing Spatial Sound panner and Music Space diffuse reverb, fades in over 2.4 seconds, and fades out over 3 seconds. The visual uses matching opacity fades. Missing/failed playback uses a short 1.2-second safe continuation.
- The large video is deliberately not listed in the service-worker install precache, avoiding a 42 MB install/update burden. It remains a normal first-use media request. Once the guide starts it, the video runs through to completion and the established journey begins only after the prelude exit completes.
- The shared `vol-music` control now reads Music / Video Volume because the same safe guide-selected level applies to both background music and the prelude video. New static regression coverage also locks the fullscreen request/exit and the localized shared label. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, background music, spatial audio, Hindi, Russian, and diff check. No Playwright, screenshots, or device listening are run by owner direction.
- The prelude now preserves the full supplied video frame in fullscreen with deliberate black cinematic letterboxing (`object-fit: contain`), rather than cropping it to fill tall or wide devices. Shell delivery is rotated so installed copies receive the layout correction.
- Completing the video now consumes the exact Do Not Disturb acknowledgement already made on its ready screen. Normal direct starts still show the localized reminder, and failed/unavailable video playback intentionally retains that normal reminder. This prevents a duplicate blocking alert from disrupting the fullscreen-to-journey handoff. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, Russian, hypnosis journey, and diff check.
- Restart now stops audio and timers without briefly showing the Lobby behind the video; after the prelude it goes directly into the established journey start sequence. The preserve-screen option belongs specifically to `MeditationController.stop()`—not `VisualEngine.stop()`—and also preserves an already-active fullscreen session during restart. Fullscreen journey chrome: the bottom controls and mirrored top countdown rings fade out by default, reveal only from a dedicated bottom-edge hover zone or keyboard focus, and recede after pointer departure. This applies only while the persistent app container is fullscreen; ordinary journeys retain their existing control visibility. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, Russian, background music, spatial audio, and diff check.
- The direct-start Do Not Disturb alert now has a human-readable English fallback when a locale bundle is unavailable or stale; it never exposes a raw `ui.*` translation key. A completed video still consumes the reminder and shows no follow-up alert. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, and diff check.
- Journey-stage labels now deliberately resolve through Meditation Language, independent of the Settings-only Display Language. This covers Preparation, Moon/Returning, Gratitude, Intention, Box Breathing completion, Corpse Pose, care purification and guide-controlled transitions, Music Only, Yoga/rest stages, Sleep/Shot labels, and the closing Body marker across English, Malayalam, Russian, and Hindi. The cinematic prelude's audio and full-screen visual stage now dissolve together over 8 seconds (was 3 seconds audio / 1.8 seconds container), with the fade beginning eight seconds before playback ends. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, Russian, language intention, narration ticker, background music, and diff check.
- Fullscreen control visibility no longer relies on browser-specific `:fullscreen`/`:has()` matching. The prelude now tracks whether `#app` is the document fullscreen element and applies explicit lifecycle classes: controls and top rings are hidden by default, revealed on the bottom-edge zone or control focus, then hidden 120 ms after pointer/focus departure. Validation: `static/unit` PASS — JavaScript/service-worker syntax, journey-video-prelude, Hindi, spatial audio, background music, and diff check.

### Local checkpoint — 2026-09-02 (Minimal test-script narration)

- `test-script.json` remains a complete English/Malayalam schema fixture with its existing frequencies, mantras, assets, service modules, Yoga poses, sleep stages, and shot values intact. Every localized narrative leaf is now exactly one concise sentence, making it suitable for quick technical flow checks rather than stakeholder presentation.
- Validation: `static/unit` PASS — JSON parsing, `test:demo-script`, a direct one-sentence scan across all 118 localized fixture leaves, and diff check. `test:content-safety` remains unavailable because the owner-maintained local `docs/dot.json` is deleted in the working tree and was deliberately not restored. No Playwright or screenshots were run.

### Local checkpoint — 2026-09-02 (Extended natural transition tails)

- Existing diffuse, non-repeating reverb is extended: narration `2.8s → 4.5s`, background music `1.8s → 3.2s`, and mantra `3.6s → 5.5s`. Dry source fades and intelligibility settings remain unchanged.
- Music now has a dedicated reverb-tail input gate. A music-to-mantra dissolve closes both dry music and new reverb input over the established six seconds, but the already-generated, low-passed tail returns beside the dry gate and settles naturally instead of being hard-cut. The tail is restored gradually with the music after mantra.
- Delivery rotates to `app.js?v=2.23` and shell cache `chakra-v5.97`. Validation: `static/unit` PASS — syntax, background-music/mantra, spatial routing, narration timing, audio safety, and diff check. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Local checkpoint — 2026-09-02 (Near-whisper mantra minimum)

- The mantra mixer’s non-zero minimum is now 0.5% in 0.5% steps, replacing the prior 2% floor. Its 35% default is deliberately unchanged, so existing guides retain their normal balance unless they choose the new near-whisper range. The change affects the mantra track only, not spoken narration, music, drones, or bell.
- Delivery rotates to `app.js?v=2.22` and shell cache `chakra-v5.96`. Validation: `static/unit` PASS — JavaScript/service-worker syntax, background-music/mantra, narration ticker, audio safety, and diff check. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Local checkpoint — 2026-09-02 (Slower narration duck and feeble mantra range)

- Background music now takes 6 seconds, rather than 4, to settle to its narration bed in both Piper and Browser TTS routes. The mantra mixer keeps its existing 35% default but now permits a deliberately feeble 2% minimum in 1% steps; persisted values are clamped to the same range.
- Delivery rotates to `app.js?v=2.21` and shell cache `chakra-v5.95`. No mantra default, music-to-mantra dissolve, frequency level, or narration wording changes are included.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, background-music/mantra, narration ticker, audio safety, and diff check. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Local checkpoint — 2026-09-02 (Longer narration-to-mantra tail)

- The single shared Piper narration-to-mantra tail is now 5 seconds (was 3), covering every chakra and HRIM before its mapped mantra. Browser TTS remains outside Web Audio and therefore retains its platform-owned voice ending; it still uses the same six-second background-music dissolve before mantra playback.
- Delivery rotates to `app.js?v=2.20` and shell cache `chakra-v5.94`; language cache remains unchanged. This checkpoint deliberately does not alter music, drone, mantra, bell, guided-tone, ambience, or explicit journey-stop fades.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, `test:background-music`, `test:narration-ticker`, and `git diff --check`. No Playwright or screenshots were run by owner direction; target-device listening remains the audible-quality gate.

### Active snapshot — 2026-09-01 (Heart release and renewal narration)

- The owner rejected karma terminology as unnecessarily complex. `scripts.json` now adds one approved short Heart Chakra passage immediately before the YAM mantra in English, Malayalam, Russian, and Hindi: old heaviness may soften; keep the learning, release the burden, and let compassion guide the next step. It explicitly avoids forced forgiveness, erasing the past, blame, or promised cleansing.
- The production Heart passage is intentionally a single integrated narration addition, not a separate stage, toggle, frequency, or facilitator-script rewrite. `docs/dot.json`, `demo-script.json`, and `test-script.json` remain unchanged.
- Shell cache rotates to `chakra-v5.89` for fresh script delivery. `test:content-safety` locks the approved English framing and no-karma boundary; Hindi/Russian language checks, JSON parsing, service-worker syntax, and diff check passed.

### Active snapshot — 2026-09-01 (Arrival guided relaxation narration)

- On `hypnosis-integration-journey`, the normal non-demo chakra journey now speaks two brief, choice-preserving Arrival passages around the existing transition cues: `system.arrivalInduction` before the 432 Hz cue and `system.arrivalReadiness` before the 528 Hz cue. The wording uses a gentle repeated rhythm (more settled, more relaxed; steadier, a little deeper) while explicitly retaining room awareness, comfort, and the freedom to adjust.
- Both passages are application-localized in English, Malayalam, Russian, and Hindi; custom scripts require no new fields. The existing chakra narration, moon/returning opening, gratitude, personal intention, mantras, and Emergence are unchanged. No Frequency Mode still narrates both passages while omitting only generated tones; No Mantra Mode remains independent; demo journeys still bypass the whole Arrival/Emergence wrapper.
- Session estimates add a fixed 40-second allowance for the two voice passages. Delivery caches rotate to shell `chakra-v5.90` and language `chakra-language-v22`.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, locale/timing JSON parsing, `test:hypnosis-journey`, `test:no-frequency`, `test:demo-script`, `test:hindi-language`, `test:russian-language`, `test:content-safety`, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Active snapshot — 2026-09-01 (Unhurried narration-to-mantra handoff)

- Every chakra narration, including Crown before AUM, keeps its dedicated Piper final-clip fade before a mantra. The tail is now 3 seconds (was 2); then the already ducked background bed fades steadily to silence over 6 seconds (was 4) before the mantra’s established gradual entrance. The fading music is the intentional contemplative interval—there is no abrupt mute or extra dead-silence delay.
- Browser TTS remains platform-controlled and cannot receive an equivalent Web Audio gain ramp; it still waits for the spoken utterance to finish before this same music/mantra handoff. Mantra loading still completes before music muting, avoiding slow-device loading silence.
- Delivery rotates to `app.js?v=2.17` and shell cache `chakra-v5.91`; language cache remains `chakra-language-v22`. Regression tests lock the longer tail and music fade.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, `test:narration-ticker`, `test:background-music`, `test:hypnosis-journey`, `test:no-frequency`, `test:hindi-language`, `test:russian-language`, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Active snapshot — 2026-09-01 (repertory journey-use annotation)

- `data/frequency-repertory.json` already contained 432 Hz and 528 Hz. Their reference associations were preserved; each now has a bilingual `journeyUse` annotation: 432 Hz is the post-preparation Arrival transition cue and 528 Hz is the pre-first-chakra Arrival readiness cue. Both share the selected Drone Duration budget; 528 Hz also remains marked as Solar/HRIM-configured.
- `docs/repertory.html` renders this optional “Lite journey use” note in the existing family cell and includes it in search. The reference page does not turn the annotation into a medical claim or alter the one-second Custom Shot handoff.
- Shell cache rotates to `chakra-v5.88` so installed PWAs receive the updated repertory data. Validation: JSON parsing, `test:repertory`, `test:hindi-language`, service-worker syntax, and `git diff --check` passed.

### Active snapshot — 2026-09-01 (narration boundary spacing)

- Ordinary narration blocks now end with one shared 2-second `narration.exitGap` for both Piper and Browser TTS. This replaces Browser TTS’s former final 1.5-second sentence gap and gives Piper the same explicit settling time; internal sentence spacing remains 1.5 seconds.
- Mantra handoffs deliberately do not stack the new exit gap: their final Piper clip retains the existing dedicated 2-second narration-to-mantra fade. Arrival/Emergence retain their dedicated 2–3 second gaps.
- `tests/narration-ticker.test.mjs` guards the timing value and confirms both narration engines apply it without doubling Browser TTS’s final sentence gap. Static validation passed: narration ticker, hypnosis journey, and diff check.

### Active snapshot — 2026-09-01 (facilitator fixture restoration)

- `docs/dot.json` has been restored by the owner and is again a tracked, facilitator-maintained English/Malayalam script fixture. It contains all English/Malayalam localized string fields required by the current production schema; no facilitator narration was rewritten or supplemented because no such gaps existed.
- A top-level `_note` is intentional JSON metadata, not a runnable narration field: preserve existing facilitator wording exactly; add only genuinely missing English/Malayalam siblings; do not add partial new-language content to this fixture. Full new-language support belongs to the atomic production-language workflow.
- `tests/content-safety.test.mjs` now separates structural schema validation from localization validation. It requires the short test fixture and facilitator fixture to retain complete English/Malayalam content, while allowing their intentionally absent Russian/Hindi siblings to use the established custom-script English fallback. This corrects the stale assertion surfaced only after `docs/dot.json` returned.
- Validation: PASS — JSON parsing, `test:content-safety`, `test:drone-duration`, and `git diff --check`. Preserve unrelated `.DS_Store` changes, `.codex/`, and the untracked backup audio.

### Production release — 2026-09-01 (Asia/Kolkata)

- `hypnosis-integration-journey` was fully validated and merged into `production` from base `b3a68b2` as `fea10ad`; release handoff checkpoint `789be20` was pushed successfully to `origin/production`. The owner explicitly approved production merge and push. Preserve the unrelated `.DS_Store` changes, `.codex/`, untracked backup audio, and current `docs/dot.json` deletion; they remain excluded from this release.
- Scope: the normal chakra journey is preserved as `Arrival → existing selected chakra sequence → Closing → Emergence`. Arrival/Emergence are a wrapper only; they do not change chakra order, script frequencies, mantra routing, focused experiences, HRIM, Sleep, Yoga, Intimate Service, Shots, Music Only, or the stakeholder demo.
- Arrival: after the established guide preparation narration, a restrained 432 Hz internal transition cue plays; after the existing moon/returning/gratitude/intention narration, a restrained 528 Hz readiness cue plays before the first chakra. Both cues share the existing Drone Duration exposure budget equally (Beginner 2s + 2s, Intermediate 5s + 5s, Advanced 7s + 7s, Expert 10s + 10s). These are not public Shots and do not activate their Bluetooth/confirmation flow.
- Emergence: after the existing Closing, a very feeble bowl/bell begins the return, followed by localized room-orientation narration, then a configurable quiet return. Journey Timings now include Arriving (10–300s, default 60s) and Emergence (30–300s, default 60s). The bell default/range is intentionally restrained at 0.04 / 0.02–0.12.
- Transitions: Arrival uses explicit pre-tone, post-tone, and readiness gaps; music ducks before each cue, fades the cue itself in/out, then restores to the narration bed. Closing pauses before the bell; Emergence pauses after the bell and after narration. No Frequency Mode omits the two generated cues and bowl while retaining the same quiet gaps, narration, and background music. `finish()` no longer fires a second bell.
- Demo boundary: `demo-script.json` continues to skip the hypnosis wrapper so a stakeholder/client demonstration remains the established ordinary short journey. Custom scripts do not need new schema fields; Arrival/Emergence narration is application-localized in all four UI/content languages.
- Regression coverage: `tests/hypnosis-journey.test.mjs` checks wrapper order, shared duration budget, localized Arrival narration, fade/duck routing, No Frequency behavior, demo exclusion, restrained bell, and the absence of a second completion bell. `test:background-music` locks the 3-second final narration tail and 6-second music dissolve before every mantra. Cache delivery is rotated to `app.js?v=2.17`, shell `chakra-v5.91`, language cache `chakra-language-v22`.
- Release static validation: PASS — JavaScript/service-worker syntax, JSON parsing, content safety, chakra selection, Lobby scroll, narration ticker, language intention, Russian/Hindi language, demo script, hypnosis journey, audio safety, background music, spatial audio, No Frequency, focused practices, Yoga, drone duration, repertory, assessment, Earn handoff, HRIM timing, splash, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed by owner direction.

### Local checkpoint — 2026-09-01 (Facilitator Arrival/Emergence narration)

- Restored `docs/dot.json` now has an optional top-level `system` block with English/Malayalam `arrivalInduction`, `arrivalReadiness`, and `emergence` narration. Existing facilitator fields are unchanged.
- When a custom script is selected, `getJourneySystemNarration()` uses that optional custom text once for the normal Arrival/Emergence wrapper. Missing custom fields and all built-in journeys fall back to the four-language app-localized copy, so this does not create duplicate narration or require Russian/Hindi additions to the facilitator document.
- Delivery rotates to `app.js?v=2.18` and shell `chakra-v5.92`; language cache stays `chakra-language-v22`. This checkpoint is local on `production` until the owner explicitly requests a push.
- Validation: `static/unit` PASS — JavaScript syntax, facilitator JSON parsing, `test:hypnosis-journey`, `test:content-safety`, `test:demo-script`, `test:no-frequency`, `test:hindi-language`, `test:russian-language`, and `git diff --check`. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Local checkpoint — 2026-09-02 (Restart-safe background-music entry)

- Background music now preserves its complete 10-second source entry fade. During that protected window, `fadeInBackgroundMusic()` no longer calls the loop helper’s short gain ramp, which previously cancelled the slow envelope and made startup sound too quick.
- A stopped background loop now exposes a retirement promise. Starting another journey waits for the prior controlled fade to complete before a fresh source is created, preventing the brief old/new loop overlap that could make a second start louder or faster without a hard refresh.
- The existing narration ducking, mantra handoff, explicit stop fade, and music-only behavior remain unchanged. Delivery rotates to `app.js?v=2.19` and shell `chakra-v5.93`; language cache remains `chakra-language-v22`.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, `test:background-music`, `test:narration-ticker`, `test:hypnosis-journey`, `test:no-frequency`, `test:hindi-language`, `test:audio-safety`, `test:spatial-audio`, and `git diff --check`. The local facilitator file is currently absent by owner action, so its content-specific test is not included in this audio checkpoint. No Playwright, screenshots, browser run, or human listening evidence was performed.

### Active snapshot — 2026-08-31 (Asia/Kolkata)

- Production release scope: `add-hindi-language` was merged into `production` as `8e1dead` after confirming `origin/production` remained at `2a7f27b`. The merge and documentation checkpoint were pushed successfully to `origin/production` through `491e8c2`. It contains complete `hi-IN` UI/narration with browser TTS only; no Hindi Piper model is registered pending a separate licence-approved voice decision. Hindi meditation sessions do not expose or schedule the Earn handoff. `locales/hi.json` and all Hindi narration fields are registered atomically, avoiding the earlier partial `hi.json` request. Static Hindi locale/narration parity and handoff-suppression checks pass. Native Hindi review and target-device listening remain explicitly deferred manual release gates. See `TEMP-MULTILINGUAL-ARCHITECTURE.md` → “Hindi (`hi` / `hi-IN`)”.
- Hindi contract scope: `locales/hi.json` mirrors all 291 English locale leaves, and `scripts.json` provides Hindi siblings for all 60 English production narration fields while preserving canonical mantras, stage order, durations, frequencies, placeholders, consent language, and stop boundaries. Shipped content validation is strict; existing custom bundles without Hindi retain the English fallback.
- Hindi/demo delivery boundary: the manifest and built-in fallback register `browserPrefixes: ["hi"]` without `defaultPiperVoice`; `piper-models.json` remains unchanged. `scheduleEarnHandoff()` cancels any pending reveal and returns before creating a timer for Hindi. The current client delivery rotates `app.js?v=2.15`, shell cache `chakra-v5.86`, and language cache `chakra-language-v20`; it also prevents an old cached locale from exposing a raw demo-status key. No browser, Playwright, screenshot, native-speaker, or real-device evidence is claimed for this checkpoint.
- Demo-content split: `test-script.json` is restored as the shortest deterministic schema fixture. `demo-script.json` is the separate bilingual stakeholder/client demonstration bundle: it retains the canonical frequencies, mantras, stage ordering, symbols, and sleep values while using refined grounded, consent-led narration for introductions, moon prompts, chakras, closing, HRIM, Yoga, care modules, rest, and Ho'oponopono. Its `_demo` metadata states its purpose without affecting runtime parsing. It uses the established English fallback for Russian and Hindi custom-script validation rather than duplicating production translations.
- Demo timing preset: only `demo-script.json` carries the exact `_demo.id` and 30-second duration metadata recognised by the application. Selecting it through Custom Script upload or URL sets Core Practice Duration to `0.5` minutes, temporarily extends that slider's lower bound to 30 seconds, retains the guide’s prior normal duration, and restores that duration when the guide selects a different/default script. This does not alter production timing defaults, shot duration, sleep duration, or frequency exposure.
- Demo regression protection: `tests/demo-script.test.mjs` verifies the client-facing demo purpose, no internal test terminology, its 30-second recognised metadata, complete custom-script validation with English fallback for Russian/Hindi, and the startup-order guard for the demo duration preset. The demo is intentionally uploaded/loaded as a Custom Script; it does not become a new persisted script-source type.
- Release preflight: PASS (`static/unit`) — app/service-worker syntax; JSON parsing; `test:demo-script`; `test:language-intention`; `test:hindi-language`; `test:russian-language`; and `git diff --check`. `test:drone-duration` remains blocked before assertions by the existing owner-managed deletion of `docs/dot.json`, which is preserved and excluded from this release.
- Production delivery: `add-language-feature` was compared against frozen baseline `a9fcb1e`, then merged cleanly into local `production` as `6aa77ca`. The owner approved this merge and push; `origin/production` was fetched first and matched the frozen baseline. The outgoing push contains only `CP-I18N-034` through `CP-I18N-036` plus this merge/refresh checkpoint.
- Russian scope: full professional Russian UI and the same approved English narration structure are being added as `ru` / `ru-RU`. The content path remains `scripts.json`; `locales/ru.json` mirrors every English locale key; the static Russian contract requires a Russian sibling for every English narration field. The product’s sequence, timing, safety boundaries, frequency behavior, and all English/Malayalam content are unchanged.
- Voice approval: the registry adds only the owner-approved `Piper Russian — Irina (Medium)` entry (`ru_RU-irina-medium`) with Piper’s published `ru` phonemizer path. No ONNX asset, source model configuration, registry identity of existing voices, or native synthesis setting has been changed. Published metadata confirms the model is medium quality at 22,050 Hz with phonemizer voice `ru`.
- Delivery/cache scope: the language manifest, fallback registry, app query version, shell/Piper/language cache names, Russian locale bundle, narration fields, Russian contract test, and npm test command are the only intended feature changes. `test-script.json` has no language-specific runtime schema and uses English fallback for new language custom scripts; `docs/dot.json` is an owner-deleted custom facilitator file and is explicitly untouched.
- Routing: the Loop large-context adapter selected `gpt-5.6-sol` / high for a read-only inventory, but its child did not return an output/session. The active environment performed the bounded fallback with static validation; do not claim automatic routed completion.
- Current static validation: PASS — `node --check app.js`, `node --check sw.js`, all language JSON parsing, `test:russian-language`, `test:language-intention`, `test:narration-ticker`, `test:background-music`, `test:spatial-audio`, `test:no-frequency`, and `git diff --check`. No Playwright, screenshots, browser run, or native-speaker listening was performed by owner direction. Before release, a native Russian review and target-device Piper first-download/preview/journey checks remain required.
- Compatibility correction: pre-Russian custom scripts containing English/Malayalam content are accepted on upload and when a Russian journey starts. `localized()` already falls back to English; validator fallback is now enabled only for custom bundles, while the built-in production bundle remains strict. The shared drone contract is currently blocked before its assertions by the owner-deleted `docs/dot.json`; a direct validator check passed for production Russian content, legacy strict rejection, and legacy custom English fallback.
- Delivery correction: the compatibility fix rotates the app query version and shell cache so installed PWAs do not retain the strict pre-fix validator.
- Loop refresh: `Loop/loop.md` was reread in full on 2026-08-31. It remains protected and unchanged. This is a `standard` production delivery checkpoint; model routing had no successful child dispatch, so the supervisor completed the source/validation review directly. Browser, screenshots, and Playwright remain intentionally unrun by owner direction.
- Feature freeze: the owner has frozen the complete delivered feature set at the next production checkpoint. Do not add, alter, or remove product behavior on `production` until explicitly reopened. The next approved scope is a separate **Add Language** feature and must begin on branch `add-language-feature` from this frozen checkpoint.
- Freeze validation: `production` baseline is `e898b05`; `Loop/loop.md` remains unchanged. Existing unrelated local changes are intentionally preserved and excluded from the freeze/feature branch.
- Continuity refresh: `Loop/loop.md` was reread in full and is unchanged, as required for its protected-policy status. This is a `light` documentation/continuity checkpoint: no model dispatch was needed or available, and no Playwright/screenshots are authorized. `TECH-STACK.md`, `communication-architecture.md`, `DEVELOPMENT-SAFETY.md`, and `.codex/context-index.md` are absent; the compact active handoff remains the continuity source for this static PWA.
- Voice-model approval boundary: do not alter a Piper voice’s ONNX model, original model configuration/document, registry identity, or synthesis character without the owner’s explicit confirmation. The current English-only change is limited to approved application-side cadence bounds; Malayalam, browser voices, and native model settings remain unchanged.
- Current baseline: `production` at `bbcdf36` (`[CP-AUDIO-031] Limit slower cadence to English Lessac`). Preserved unrelated local work remains `.DS_Store`, `audio/.DS_Store`, the deletion of `docs/dot.json`, and untracked `audio/BACKUP/background_music.mp3`; none is part of this checkpoint.
- Delivered checkpoint: `CP-AUDIO-031` — English Piper Lessac now has an English-only slower meditation cadence. Its registry alone opts into a `0.60` pace floor and a bounded `lengthScale` of `1.5`; all other Piper voices retain the former `0.70` floor and `1.35` ceiling. The earlier Lessac noise smoothing and altered warmth/clarity profile are removed: shared female voice tuning and native model texture remain unchanged.
- Validation: `static/unit` PASS — narration-ticker, background-music, and spatial-audio contracts; app/runtime/service-worker syntax; Piper registry JSON; and `git diff --check`. No Playwright/screenshots by owner direction; target-device listening is still the quality gate.
- Delivered checkpoint: `CP-AUDIO-025` / `daf4551` publishes the supplied `audio/background_music.mp3` replacement through a release-versioned URL (`?v=20260831.1`) and matching service-worker cache entry, preventing an installed PWA from reviving the old fixed-path cache. GitHub Pages deployment `33352808872` completed successfully; public bytes at that URL match the committed SHA-256 `64284891b930415e3e757862279fa474d8865b6255545d24357f3174529cd55f`.
- Echo repair: voice and background-music space use separate, filtered feedback-delay buses rather than randomized convolution. Both feedback gains are bounded below unity, automate with 250 ms transitions, retain dry signal clarity, and pass through the existing music/mantra gates. The music send originates after the music EQ/smoothing path, so echo tone matches the dry bed. Static routing contracts passed; actual sound balance still requires owner listening on target speakers/headphones.
- Delivered follow-up: `CP-AUDIO-027` / `9770f7a` removes the audible feedback-delay repetitions. Voice and Music Space now use deterministic, filtered diffuse reverb tails with no feedback loop, so the effect blurs and fades naturally rather than repeating words or beats. The app and shell cache versions are bumped for installed PWA delivery. Static contracts passed; target-device listening remains the release-quality gate.
- Delivered checkpoint: `CP-I18N-023` / `bc911ba` — changing **Meditation Language** recognizes generated English or Malayalam regular/HRIM intentions saved by either current or earlier releases, replaces them with the selected language’s equivalent, and persists the result immediately. A guide-written custom intention remains unchanged. The app shell cache is bumped so installed PWA clients receive the change.
- Validation: `static/unit` PASS — `npm run test:language-intention`, JavaScript syntax checks, locale JSON parsing, and `git diff --check`; no Playwright/screenshots by owner direction. The dedicated static test guards cross-language default recognition and persistence.
- Checkpoint: `CP-AUDIO-020` — ambience intensity, closer spatial pleasure ambience, stronger heavenly voice/music space, extended-but-tempered narration/mantra tails, and role-preserving Music `+`/`−` handling.
- Branch: `production`, baseline `3f898de`. The owner explicitly approved production push; this branch is already production, so no merge commit is required.
- Git checkpoint: `0bf5183` (`[CP-AUDIO-020] Refine immersive audio behavior`).
- Loop refresh: `Loop/loop.md` and the focused delivery/routing guidance were reread. Target application root is `/Users/lekshmisyam/Desktop/Ikigai/lite`; reusable-instructions root is `/Users/lekshmisyam/Desktop/Ikigai/lite/Loop`. Mapping tier remains `light`; no backend, database, auth, WebSocket, or external service is involved in this checkpoint.
- Routing: bounded `standard` audio/UI checkpoint. No separate automatic model dispatch was available in this host session; the supervisor performed the source review and fresh validation directly.
- Validation: `static/unit` PASS — `node --check app.js`, `node --check sw.js`, English/Malayalam locale JSON parsing, `npm run test:background-music`, `npm run test:spatial-audio`, `npm run test:audio-safety`, `npm run test:no-frequency`, and `git diff --check`. Playwright, screenshots, and manual listening were not run by owner direction.
- Commit scope: `HANDOFF.md`, `app.js`, `index.html`, `style.css`, `locales/en.json`, `locales/ml.json`, `sw.js`, `tests/background-music-mantra-echo.test.mjs`, and `tests/spatial-audio.test.mjs` only.
- Preserved external/unrelated work: `.DS_Store`, `audio/.DS_Store`, `audio/background_music.mp3`, untracked `audio/BACKUP/background_music.mp3`, and the existing deletion of `docs/dot.json`. The missing `docs/dot.json` prevents the content-safety fixture test and remains excluded pending owner direction.
- Follow-up checkpoint: English Piper currently has one bundled voice, `en_US-lessac-medium` (female). Its meditation pace multiplier is 0.74, matching English’s estimated reading baseline to Malayalam’s current 5.5 characters-per-second meditation pace while retaining the user Pace slider and leaving Malayalam Piper voices unchanged. `static/unit` validation passed: app/service-worker syntax, Piper registry JSON, narration ticker, background-music, spatial-audio, and audio-safety contracts, plus `git diff --check`.
- Next action: create the detailed local checkpoint commit for the English Piper pace adjustment; push only when the owner requests it.

### Active snapshot — 2026-08-30 (Asia/Kolkata)

- Branch: `yoga-refinement`, created from production commit `b0b9251` (`feat(audio): add configurable pleasure ambience source and blur`). Do not merge or push without explicit owner approval. The unrelated tracked macOS `.DS_Store` change must be preserved and excluded from feature commits.
- Current Yoga/Care implementation is uncommitted: Yoga retains only its selected poses, optional Corpse Pose, and standard Bath Session followed by the existing 15-minute guide-controlled rest. Perineal Care, Massage, and Assisted Bathing are now a dedicated Lobby **Intimate Service** section.
- Intimate Service follows the fixed selected-stage order `Perineal Care → Massage → Assisted Bathing`. Perineal Care and Assisted Bathing retain their existing timer and guide-controlled “ready to proceed” pause. Massage has no standalone timer or script stage: it runs a full forced seven-chakra `Crown → Third Eye → Throat → Heart → Solar → Sacral → Root` meditation wrapper and never overwrites the user's saved normal chakra selection.
- Focused-care narration correction: before any focused flow runs, it now awaits the already-started Piper warm-up that the normal icebreaker would otherwise provide. Massage also explicitly enters the Meditation screen before its Crown narration begins. This prevents the first guided care/chakra narration from racing Piper initialization or being rendered on the hidden Icebreaker screen while the mantra display advances.
- Mood & Relaxation recovery correction: the optional `audio/pleasure*` files are intentionally Git-ignored and can be absent in production. A failed local decode no longer hides or clears the Mood & Relaxation selection. The Journey Tuning section remains visible, shows a bilingual recovery message, and keeps the direct Audio URL field usable so the guide can load a replacement source on mobile.
- Chakra life-skills narration update is uncommitted: each production `meditation_en`/`meditation_ml` now includes the same practical, learnable skill cluster in English and Malayalam. Root: safety, self-care, resources, grounded decisions; Sacral: emotions, consent/boundaries, creativity, restorative joy; Solar: self-efficacy, confident choice, goals, resilience; Heart: compassion, trust, caring boundaries, relationship repair; Throat: communication, listening, support-seeking, respectful refusal; Third Eye: critical thinking, information discernment, attention, reflective decisions; Crown: values, meaning, perspective, humility, interdependence. These remain practice invitations rather than medical, psychological, or supernatural claims.
- The normal Reverse Journey preference/control has been removed. Its legacy local-storage key is cleared at preference load; new Intimate Service choices use `chakra_intimate_*` keys with one-time fallback from the former care keys. Experiment Mode no longer offers a standalone Massage activity.
- Static verification for the refinement passed: `node --check app.js`, `npm run test:yoga-experience`, `npm run test:focused-practices`, `npm run test:chakra-selection`, `npm run test:content-safety`, `npm run test:audio-safety`, locale JSON parsing, and `git diff --check`. No Playwright or screenshots were used.
- Latest committed application work loads pleasure ambience layers from tracked `audio/ambience-manifest.json`. The local-only source assets `audio/pleasure.mp3` and `audio/pleasure-1.ogg` are intentionally ignored by Git; future `pleasure-*` layers may use any browser-decodable audio extension and are discovered through the manifest.
- Uncommitted Journey Tuning work adds a persisted, validated Pleasure Audio URL input. A successful URL replaces only the manifest's primary `pleasure.<extension>` layer; numbered layers such as `pleasure-1.ogg` remain manifest-driven and continue to overlay. Invalid or CORS-blocked URLs are rejected before persistence, and the previous source is restored when possible. Emptying the field returns to the standard manifest source.
- Pleasure-cache follow-up revalidates the manifest and each pleasure file with `cache: 'no-store'`, bypasses service-worker cache reuse for pleasure requests, and clears decoded pleasure buffers whenever the ambience stops. Moving `pleasure.mp3` therefore cannot resurrect its old in-memory copy after a stop/restart; any still-present numbered layer, such as the current local `pleasure-1.ogg`, continues by design.
- Optional pleasure manifest 404s are now silent because missing local layers are expected during replacement; non-404 decode/network failures remain warnings, and user-supplied URL failures remain explicit errors.
- Journey Tuning now exposes a persisted Blur Intensity control for pleasure ambience. The previous effect was approximately 88% dry/12% wet; the new default is 65% dry/35% wet, bounded from 10% to 65% wet, while the existing blur toggle can still bypass the effect completely.
- Uncommitted pleasure-audio work adds a dedicated spatial panner with a 45-second far-to-near approach for Spatial Sound modes, a stereo fallback depth ramp, and a session-only soft blur path using a low-pass filter plus short convolution. Blur defaults on when Mood & Relaxation Ambience is enabled and can be toggled while preserving the clean source path. Every manifest layer shares this processing bus, and the profile is explicitly reapplied on initial start and stage-level re-entry so it remains consistent through the complete journey.
- Pleasure ambience remains bounded at a 0.2%–7.0% source-level range, fades through the existing five-second stop path, and remains separate from the centred narration route. Crossing above 5.0% requires a localized confirmation; cancelling restores the previous level. The app and shell cache versions are bumped for delivery. No claim is made that this percentage equals a calibrated decibel level.
- Audio fade audit checkpoint `CP-AUDIO-018`: the normal chakra path previously called `narrate(..., false)` and then immediately called `playMantraTrack()`, so no multi-second narration fade was scheduled before mantra. Piper clips used only a maximum 50ms end fade; browser speech has no Web Audio fade path. Background music could also be muted before a slow first-use mantra decode, creating an avoidable silent gap.
- CP-AUDIO-019 implementation now coordinates the handoff: the final Piper clip uses a centralized two-second exit fade only when handing off to mantra, ordinary clip boundaries retain the 50ms edge fade, and the browser-speech path documents its platform limitation while waiting for `speechSynthesis.onend`. Mantra music muting starts only after its buffer is decoded, preserving the already-ducked music bed during loading. Manual stop, finish, pause, and Experiment stop remain immediate safety paths; non-emergency Piper cancellation has a short 120ms gain ramp. Mantra/music/pleasure/drone stop paths retain their existing scheduled fades.
- Follow-up audio fix: the background music loop now uses the full 10-second entry envelope internally as well as on the outer music gain, and a restart resets the shared outer gain to zero first. This prevents a restarted loop from becoming audible through stale gain or the previous 3-second inner fade before the intended entry fade completes.
- Validation at this refresh: `static/unit` PASS — `node --check app.js`, every `tests/*.test.mjs` contract, and `git diff --check`. The background-music/mantra contract now covers URL input, persisted source selection, primary-layer replacement, numbered-layer preservation, and failure-safe restoration. No Playwright, screenshots, browser, or real-device evidence was used, per owner instruction.
- Model-router status: Loop routing configuration and the local Codex adapter are present, but no automatic model dispatch evidence is recorded for this checkpoint; do not claim routed execution.
- Loop status: authoritative policy and supporting routing/architecture files remain under `Loop/`; `Loop/loop.md` is unchanged and protected. The active handoff is the current continuity source; no additional Loop policy file needs modification for this refresh.
- Next exact step: perform real-device headphone/speaker listening checks for the coordinated fade package and remote Pleasure Audio URL/CORS behavior, then make a detailed feature commit if the owner approves; do not commit or push the current uncommitted pleasure-audio and fade work without explicit instruction.

### Historical context retained for reference

- Implemented grouped Yoga preparation, per-pose, pose-selection, Bath toggle, and Bath duration controls under Yoga Bridge.
- Added visible copy explaining `Bath → Yoga → Crown` order.
- Bath duration now appears only when Yoga Bridge and Bath Session are enabled.
- Session estimates include Yoga only when enabled and Bath only when its toggle is enabled.
- Bath minimum duration is now 60 seconds for a practical short test while retaining an 1,800-second maximum.
- Validation: `static` evidence level — syntax, JSON, DOM ID uniqueness, local asset references, and diff whitespace checks passed.
- Browser/manual visual validation remains open because it was not required for this checkpoint.
- Implemented a mobile UI pass for Settings and Lobby: scroll-safe settings layout, short-screen lobby layout, safe-area spacing, larger touch targets, mobile-friendly sliders, responsive buttons, compact headings, and viewport-safe mixer/controls.
- Normalized vertical spacing for Audio Levels, Journey Timings, Yoga Timing, and Bath Duration using shared settings-panel and settings-mixer rules instead of repeated inline section spacing.
- Redesigned all range controls for mobile: full-width sliders with 44px touch targets, a centered outlined current-value pill, visible minimum/maximum values, and tappable decrement/increment buttons that clamp to the configured bounds. Removed the `.settings-mixer` 300px max-width so audio and timing controls use the full settings-panel width.
- Removed the empty chakra image source and added guarded image loading so chakra, deity, Yoga, and Music Only symbols remain hidden until the selected asset loads successfully, preventing the brief broken-image flash.
- Grouped the Lobby Begin Journey and Settings controls into a dedicated vertical action group with explicit spacing and full-width touch-friendly sizing.
- Added explicit top spacing above the Lobby “Meditation Room” heading.
- Increased the Lobby action-group gap and added explicit top margin to the Settings link so the Start Meditation and Settings controls remain visibly separated on mobile and desktop.
- Decision: retain local hand-authored CSS; do not add Tailwind CDN. This preserves the offline PWA behavior and avoids introducing a runtime styling dependency. A future Tailwind migration would require a deliberate build-based migration to local static CSS.
- Repaired the orphaned `#aura-bg` CSS selector and replaced unsupported `width: stretch` declarations with `width: 100%`.
- Validation: `static` evidence level — JavaScript syntax, JSON parsing, DOM ID checks, responsive CSS contract checks, and diff whitespace checks passed.
- Browser/manual visual validation is `BLOCKED` because no browser backend is available in this environment (`agent.browsers.list()` returned no backends).
- Next step: open the app on a real mobile viewport and verify settings scrolling, lobby spacing, slider dragging, and tap target comfort.
- Piper neural TTS is now the preferred narration path for registered local voices. The current implementation is client-only and keeps browser `speechSynthesis` as a graceful fallback.
- Piper timing decision: retain the configured journey interval as the minimum user-facing meditation pause. Piper may extend the pause only when the next narration is not ready.
- Piper architecture decision: use a dedicated Web Worker for ONNX inference, a bounded two-to-three-segment rolling narration queue, and the existing Web Audio/background-music path for playback and timing. Do not run inference in the service worker.
- Service-worker decision: use the service worker only for versioned, on-demand caching of the Piper runtime and selected voice model assets. Do not precache every language model or use the service worker for live audio scheduling.
- Voice-preview decision: the preview must use the exact selected Piper voice/model and the same narration playback path as the journey, with a representative meditation sentence, a first-use “Preparing voice…” state, and browser TTS fallback only when Piper is unavailable.
- Implemented Piper integration: `piper-models.json` provides Malayalam Arjun/Meera and English Lessac registry entries with model paths, sizes, source identifiers, quality, and license-review metadata; `piper-worker.js` owns model loading and synthesis; `app.js` owns queueing, Web Audio playback, ducking, preview, pause, cancellation, and browser fallback.
- The existing journey interval remains the minimum pause. Piper prepares a bounded rolling queue and may wait beyond that minimum only when the next segment is not decoded and ready. Existing background music continues through the wait.
- Piper runtime assets are vendored under `piper/`; the service worker uses a separate versioned, on-demand cache for runtime/model requests and never performs inference. Voice models remain lazy-loaded rather than precached.
- Piper controls are intentionally conservative: voice selection and volume use the local model and Web Audio gain path; browser-only pitch/rate behavior is not silently presented as equivalent Piper control.
- Validation completed at `static` level: JavaScript syntax, JSON parsing, worker/registry contracts, local asset paths, HTTP serving of all Piper assets, and diff whitespace checks passed. A direct Node inference smoke test is not a valid runtime gate because this browser-oriented ONNX/WASM bundle requires browser Worker/WebAssembly APIs.
- Browser/manual validation is `BLOCKED` in this environment because no browser backend is available. Before release, validate first-run model download, cached/offline replay, preview, a complete journey, pause/resume/stop, screen lock/visibility changes, and Samsung S24 FE CPU/thermal/battery behavior.
- Piper preview fix: binary runtime paths now resolve from `piper/runtime/piper-tts-web.js` via `import.meta.url`, avoiding HTML responses from document/dev-server fallback routes. Non-isolated pages now use one WASM thread; the separate Piper cache was bumped to `chakra-piper-v2` to evict stale failed responses. Local HTTP verification returned `application/wasm` and valid `00 61 73 6d` headers for both Piper and ONNX WASM assets.
- Piper diagnostics/fallback fix: preview and journey failures now log the underlying Worker/asset exception to the console. Browser fallback voices shown in Settings are filtered to the selected content language, and fallback narration chooses a matching `ml-*` or `en-*` browser voice so an English voice cannot pronounce Malayalam text as an incompatible approximation.
- Malayalam Piper compatibility fix: the Piper web wrapper assumed every model had a non-null `speaker_id_map`; Malayalam single-speaker model metadata can omit it or return `null`, so synthesis now treats that field as an empty map and only sends `sid` for multi-speaker models.
- Piper meditation tone tuning: widened the voice low-pass ceiling from 2.2kHz to 5.2kHz in normal mode and 3.2kHz in eyes-closed mode, and added a restrained 0.75–1.0dB presence lift during Piper narration. Native Piper prosody remains unchanged; background ducking and sentence timing are preserved.
- Added a timeless returning-visitor opening in English and Malayalam. The opening can be selected from the Lobby; when no preference has been saved, first-time users receive the moon-phase opening and users with completed journeys receive the sea-and-tide image.
- Added a Lobby-level `Returning Journey` option. It controls whether the current session uses that timeless returning opening; `state.stats.journeys` remains the historical completed-journey counter. Existing users with completed journeys default to the option once, while explicit changes persist in `chakra_returning_journey`.
- Expanded locale coverage for the Settings, Lobby, completion modal, mixer, journey timings, yoga/bath controls, placeholders, and runtime labels. Static HTML labels now use `data-i18n`, while checkbox labels and session-only text are translated through `applyLocaleUI()` and `t()`.
- Separated display localization from meditation content language: `language-select` controls narration/content, while `display-language-select` controls visible interface text and defaults to English. Content/system narration uses `contentT()` so a facilitator can show English UI while guiding in the selected meditation language. The main `Chakra Meditation` heading and document title now follow the display language.
- Bumped the app script and service-worker shell cache versions to deliver the separated localization behavior to existing PWA users instead of serving the previous cached `app.js?v=1.51` implementation.
- Fixed Yoga Bridge dependency handling: Bath Session is cleared and disabled when Yoga Bridge is off, persisted bath state is ignored unless Yoga Bridge is enabled, and the session estimate only counts bath time when both options are active. The journey execution path already required Yoga Bridge before running Bath.
- Added optional Bath Session add-ons: Perineal Care and Assisted Bathing, each with independent timing and English/Malayalam scripts. The master Bath Session remains unchanged when no add-on is selected; Perineal Care can precede the standard Bath Session, while Assisted Bathing replaces it. With both selected, the order is `Perineal Care → Assisted Bathing → Yoga`.
- Added optional Massage before the bathing stages, with its own persisted duration and localized English/Malayalam script. The complete add-on order is `Massage → Perineal Care → Assisted Bathing → Yoga`; when Assisted Bathing is not selected, the standard Bath Session remains in its place.
- Decoupled Music Only from Settings into a Lobby-level Experience Mode. Settings now remains focused on guided-meditation configuration, while Music Only keeps the existing background-music runner and `state.bgMusicMode`/`chakra_bg_music_mode` persistence for compatibility. It is mutually exclusive with guided journey selections, and Audio Levels remain separate in the meditation room.
- Music Only now uses `symbols/background-only.png` instead of the Root Chakra symbol. Its visible mantra follows the selected Display Language independently of the meditation/narration language.
- The intention prompt, placeholder, and positive default are now locale-backed. The default follows Meditation Language and only changes when the user has not entered a custom intention.
- Moved High Energy (HRIM) into Lobby Experience Mode beside Music Only. HRIM now has an independent persisted `timeHighEnergy` duration with a production range of 1–30 minutes and a fast-test range of 0.1–1 minute; normal `timePerChakra` timing remains unchanged.
- HRIM now uses localized activation-specific intention framing with the user’s custom intention, then runs only `HRIM activation → final silence → closing` after the shared icebreaker. Box Breathing, Corpse Pose, and Ho’oponopono are skipped in the HRIM branch; HRIM also does not require chakra selection.
- HRIM no longer plays Moon Phase or Returning Journey opening narration. Its intention script is shorter, with dedicated lead-in/gap timing and a normal-speed browser fallback voice so the activation begins more directly.
- Added the HRIM duration slider, mobile range controls, mutual exclusion with Music Only, locale-backed HRIM intention defaults that preserve custom intentions, storage migration/defaulting, service-worker cache entry for the background-only image, and cache/version bumps. Browser validation completed at `browser` evidence level: 22/22 Playwright tests passed. `test-script.json` receives short test content for new script fields, while `docs/dot.json` receives additive fields only because it is a custom facilitator script.
- Moved Sleep Mode out of the Lobby. At or after 6:00 PM local device time, the journey-start flow asks whether to continue with or without Sleep Mode before the existing Do Not Disturb reminder. The decision applies only to that journey; daytime journeys reset Sleep Mode off.
- Refined the evening Sleep Mode prompt with compact, consistently spaced mobile actions: “Continue with Sleep Mode On” and a red “Continue with Sleep Mode Off” action for clear visibility. Browser validation now covers 25/25 tests.
- Verified the Corpse Pose timing control in both fast-test and production profiles; its value changes, display, persistence, and 60–600 second production bounds are working.
- Fixed the Corpse Pose range-control visual styling by giving the current value a responsive minimum width, centered outline, and tabular-number layout; bumped the stylesheet cache version to `1.52`.
- Corrected the remaining Corpse Pose-only column alignment bug by removing the inline `display:flex` override from the dynamic timing-row visibility helper; enhanced timing rows now retain their grid layout when shown.
- Reorganized Settings into Chakra Journey, Guided Practices, Comfort & Visuals, and Yoga Bridge sections. Corpse Pose and its timing now live under Yoga Bridge and default off for new setups; Reverse Journey and Chakra Frequencies live under Chakra Journey. Added a localized Settings help modal. Browser validation now covers 27/27 tests.
- Added a compact, localized Lobby roadmap that derives its arrow-separated stages from the active selections, including Yoga, Massage, Perineal Care, Assisted Bathing/Bath, Ho'oponopono, High Energy, Music Only, and Returning Journey variants. It wraps on mobile without adding a large panel.
- Completed an expanded temporary Playwright matrix covering all four language/display-language pairings, Yoga/Corpse/Bath/add-on dependency transitions, Yoga/Reverse mutual exclusion, every Guided Practice and Comfort toggle, lobby mode switching, Returning Journey, timing persistence, mobile overflow, HRIM boundaries at 03:29/12:00/12:01, and voice-preview fallback. The expanded matrix passed 9/9 and was removed after validation. Disabling Yoga now also clears a previously selected Corpse Pose to prevent stale hidden state.
- Added a close action to the evening prompt; closing it cancels and skips the journey instead of continuing without Sleep Mode.
- Added a daytime HRIM gate: HRIM can start only from 3:30 AM through 11:59 AM local time. Outside that window, users receive a localized explanation and can return to the Lobby or continue with regular meditation; no audio is initialized before the decision.
- Refined active chakra and HRIM narration through `meditation_en`/`meditation_ml` fields. The spoken flow now emphasizes felt experience and practical meditation benefits rather than organ-specific or physiological direction; legacy custom script uploads remain supported through fallback behavior.
- Centralized journey timing defaults, slider constraints, transition pauses, narration pacing, safety buffers, and estimate constants in `timing-config.json`. Runtime timing now resolves through the timing configuration; audio-engine filter/fade durations remain separate playback behavior. Bumped the shell/app versions to deliver the timing configuration to existing PWA users.
- Set the production interval range to 10–20 seconds with a 10-second default so the “take a break” narration has enough time. The explicit `fast-test` profile retains a 2-second minimum, while interval execution now waits for break narration completion before advancing; persisted values below the active minimum are clamped on load.
- Added a Playwright test harness under `tests/e2e/` with a local static `webServer`, Chromium coverage, and a `fast-test` timing profile in `timing-config.json`. The suite covers localization separation, timing configuration, bath/add-on dependency rules, timing persistence, seven bath/add-on combinations, and seven representative global journey-mode combinations; the latest complete run passed 18/18 tests. Service workers are blocked for deterministic functional tests; PWA cache behavior remains a separate allowed-service-worker pass.
- Moved live Comfort & Visuals and Audio Levels into a full-screen mobile-safe `Journey Tuning` mixer opened from the meditation-room mixer button. The dialog includes Audio Filters, Eyes Close Mode, Screen Brightness, Solfeggio frequencies, localized guidance, and Restart Journey; live controls update the active audio graph and synchronize persisted frequency state. Restart now restores the Start button and waits for a pending async start sequence to cancel before relaunching.
- Added a dedicated mixer Playwright test covering the full-screen dialog, live controls, Solfeggio synchronization, volume changes, evening Sleep Mode handling, and restart. The suite now contains 28 tests; the focused mixer test passed. A final full-suite rerun was impacted by the local static-server process being interrupted, so a clean 28/28 run remains a release follow-up.
- Preserved the mixer header close control as a visible `×` icon while keeping its localized accessible label; the bottom Close action remains localized text.
- Completed the first audio-quality improvement pass: added a final master safety limiter for compressed narration/music and bells, gentle Piper per-clip RMS/peak matching, 50 ms-or-less Piper edge fades, and AudioContext-timeline-ahead scheduling for crossfaded loops. Static validation passed and the focused mixer browser test passed 1/1.
- Audited the delivered audio assets: background music and mantra files are stereo 44.1 kHz/192 kbps MP3s of roughly 30 seconds. No lossless source master exists locally, so no re-encode was performed; replacing the background asset remains dependent on receiving a WAV/FLAC master. Browser speech synthesis remains an unprocessed fallback outside the Web Audio limiter.
- Added a collapsed Voice Tuning section inside Journey Tuning with narration-only Clarity, Warmth, Pace, Soft/Balanced/Clear presets, and Preview Current Voice. Piper pace is applied to the next generated phrase through a bounded runtime length-scale setting; browser fallback maps the same control to speech rate. Bumped the app shell and Piper cache versions to deliver the new runtime.
- Replaced the flat Light Echo delay with a voice-only Voice Space effect using a short pre-delay and generated stereo room impulse. The menu now presents Off, Soft Room, and Temple Air; wet levels remain restrained and Off is the default so the effect adds atmosphere without masking speech. Focused Playwright validation passed 1/1 after the addition.
- Increased Voice Space audibility after review: Soft Room now uses approximately 14% wet level and Temple Air approximately 20%, while retaining the filtered tail and voice-only routing for speech clarity.
- Set Soft Room as the default Voice Space preset for new users; existing explicit Voice Space preferences remain preserved.
- Added journey-aware voice profiles: regular guided meditation starts with Soft voice tuning plus Temple Air, while HRIM starts with Balanced voice tuning plus Soft Room. Users can still adjust the active profile from Journey Tuning.
- Set Chakra Frequencies/Solfeggio active by default for new users in both Settings and Journey Tuning; existing explicit frequency preferences remain preserved.
- Prevented the Voice Space label from wrapping in the compact mixer by giving it a responsive fixed minimum width and `white-space: nowrap`; the select remains flexible on mobile.
- Started multilingual architecture migration: added `language-manifest.json`, `locales/en.json`, and `locales/ml.json`; the language selector, locale lookup, browser voice matching, preview sentence, content source, and HTML locale now derive from manifest data. Migrated localized content resolution for core optional stages, Yoga fields, closing, Ho'oponopono, breathing steps, and intention text while preserving the existing bilingual script contract.
- Piper model loading is now registry-driven for model path, config path, and phonemizer voice. The Worker passes the complete model definition and the runtime prefers registry paths, so future voice additions do not require editing the vendored runtime map.
- Language manifest/locale bundles use a separate service-worker cache. Static validation passed for syntax, JSON, localized contracts, dynamic Piper definitions, cache routing, and diff whitespace.
- Remaining multilingual migration: move every remaining controller/UI string into locale dictionaries, convert the full narration pack to the language-neutral content shape, and perform native-speaker and target-device validation for each added language.
- Multilingual tracking: the active checklist is `TEMP-MULTILINGUAL-ARCHITECTURE.md`; the source of truth is `language-manifest.json`; locale dictionaries live under `locales/`; voice metadata lives in `piper-models.json`. The temporary checklist remains intentionally active until browser/device and native-language release gates are completed.
- Rewrote production chakra, closing, and HRIM guidance in `scripts.json` for English and Malayalam to be healing-oriented and result-focused through experiential outcomes—grounding, emotional freedom, confidence, compassion, clear expression, insight, and purposeful action—without organ, gland, blood, cell, or disease-directed claims. Existing `meditation_en`/`meditation_ml` content is now reused for the legacy `en`/`ml` fields to keep both runtime paths aligned.
- Expanded the Playwright narration regression to scan both languages and all production journey sections for anatomy-specific claims. Validation passed: JSON/syntax/diff checks passed, production guidance audit returned no anatomy matches, and `npx playwright test tests/e2e/settings.spec.js` passed 14/14.
- `docs/dot.json` remains intentionally unchanged as a custom facilitator script; its legacy anatomy-specific language is outside the production bundle and must be reviewed separately if that script is ever promoted to runtime content.
- Audited mantra wording and pronunciation: canonical identifiers remain `LAM`, `VAM`, `RAM`, `YAM`, `HAM`, `OM`, `AUM`, and `HRIM`; English spoken narration now uses contextual forms such as “The Lam mantra” and “Hreem mantra,” while Malayalam uses the native forms such as `ഹ്രീം`. This keeps the HRIM key and `HREEM.mp3` asset stable while giving English Piper a clearer pronunciation input.
- Confirmed Piper transport behavior: narration is segmented with explicit lead-in/sentence-gap timing; pause suspends the AudioContext and blocks queue advancement; stop/restart cancels the active source, clears queued synthesis, and terminates the Worker. Fixed persisted volume loading so `0` remains a true mute after reload. Focused Playwright validation passed 2/2 for mantra wording and mute persistence; syntax, JSON, and diff checks also passed.
- Consultation architecture is documented in `TEMP-CONSULTATION-CONSENT-ARCHITECTURE.md` as planning-only. The first implementation is single-participant: HRIM, Sleep Mode, and Music Only stay in the Lobby, Reverse Journey stays in Settings, and Yoga remains separate from Sleep Mode. No consultation production code, recording backend, or video-sharing infrastructure has started.
- Added the Lobby entry point CTA `Begin Session Consultation`, localized in English and Malayalam. It is currently a non-mutating placeholder that preserves the existing meditation flow until the consultation screen/state machine is implemented.

### CP-PSY-001 — Bilingual psychological-safety baseline

- Date: 2026-08-12 (Asia/Kolkata).
- Commit: `fb4148f` — `feat(safety): make guided journeys trauma-aware`.
- Scope: production-shaped English/Malayalam content and runtime safety revision; this is a wellness safeguard, not clinical validation or a claim that the app meets every psychological need.
- Added a mandatory app-owned spoken contract before every guided path, including HRIM and custom scripts: wellness-not-treatment boundary, safe-use warning, natural breathing, open-eye/position choices, permission to skip/pause/stop, distress grounding, support escalation, and emergency guidance.
- Added a localized Lobby safety summary so the warning is available before Start; bumped shell, stylesheet, app, and language-cache versions for PWA delivery.
- Replaced absolute prosperity, healing, perfect-intuition, manifestation, universal-protection, relationship, and outcome guarantees with agency, boundaries, gradual progress, evidence-aware decisions, and support-seeking.
- Made Ho'oponopono explicitly optional and non-coercive; users need not recall events, forgive, contact anyone, or interpret the phrases as healing.
- Reworked Corpse Pose, mindful bathing, and all Yoga pose instructions for support, balance, device/water separation, natural breathing, modification, and symptom-based stopping. Removed physiological benefit claims from Yoga narration.
- Files changed in the implementation commit: `TECH-STACK.md`, `app.js`, `index.html`, `locales/en.json`, `locales/ml.json`, `package.json`, `scripts.json`, `style.css`, `sw.js`, and `tests/content-safety.test.mjs`. Custom facilitator content in `docs/dot.json` and the short fixture in `test-script.json` were intentionally not rewritten; the mandatory app-owned safety contract still precedes custom guided paths.
- Validation: `static` PASS — `npm run test:content-safety`, JavaScript syntax, JSON parsing, DOM ID uniqueness, localization-key coverage, and `git diff --check`. `runtime` PASS — localhost returned the revised HTML, Malayalam grounding locale, production Ho'oponopono copy, and mandatory grounding runtime. No Playwright or screenshots were used, per owner instruction.
- Remaining release review: native Malayalam speaker review and qualified mental-health/trauma-informed content review are pending. Real-device checks remain needed for spoken pacing, comprehension, balance/movement usability, and bathing safety. The app must not be represented as therapy, medical treatment, crisis care, or complete psychological care.
- Working tree after the implementation commit: clean before this handoff-only traceability update; local `production` was one commit ahead of `origin/production` and was not pushed.

### CP-SCHEMA-001 — Script fixture parity

- Date: 2026-08-13 (Asia/Kolkata).
- Commit: `4e6d1b8` — `test(content): keep script fixtures schema-compatible`.
- Added only the 18 missing `meditation_en`/`meditation_ml` compatibility fields to `docs/dot.json` for the seven chakras, closing, and HRIM. Each field duplicates that custom file's existing `en`/`ml` value; no custom wording was replaced.
- `test-script.json` already contained every runtime narration field. Its only structural difference was `thirdeye._note`, which is underscore-prefixed metadata and was intentionally not copied.
- Extended `npm run test:content-safety` to compare production schema paths against `test-script.json` and `docs/dot.json`, including object fields inside arrays while ignoring underscore-prefixed metadata. It also verifies that the new facilitator meditation fields preserve the corresponding legacy custom text.
- Validation: `static` PASS — fixture schema parity, custom-content equality, JSON parsing, content-safety regression, and `git diff --check`.

### CP-AUDIO-001 — Zero-volume Web Audio startup

- Date: 2026-08-13 (Asia/Kolkata).
- Commit: `5f20561` — `fix(audio): allow journeys with fully muted levels`.
- Root cause: the shared Eyes Close/audio initialization path used `exponentialRampToValueAtTime()` on signed EQ gain from zero toward a negative decibel value. Web Audio rejects zero and negative exponential ramp domains, so both normal and Sleep Mode starts could abort with a misleading stable-connection alert.
- Replaced the signed EQ transition with a linear ramp. Music volume zero now uses a true linear fade to zero rather than a tiny non-zero substitute. Bell volume zero skips singing-bowl oscillator creation; audible bell envelopes begin at a legal positive floor.
- Corrected volume preference loading so a missing key receives its intended default while an explicitly saved `0` remains a true mute. A journey may therefore continue with voice, drone, bell, mantra, and music all set to zero.
- Added `npm run test:audio-safety` covering missing/zero/invalid stored values, signed-EQ ramp exclusion, zero music behavior, muted bell behavior, and literal-zero exponential targets.
- Validation: `static` PASS — audio-safety regression, bilingual content-safety regression, JavaScript syntax, package JSON parsing, and `git diff --check`. No Playwright or screenshots were used.

### CP-JOURNEY-001 — Quiet Journey Complete handoff

- Date: 2026-08-13 (Asia/Kolkata).
- Branch: `journey-complete-update`.
- Lite now treats journey completion as a boundary rather than a financial workflow. After showing the localized Journey Complete blessing and session time for three seconds, it navigates to `https://missionode.github.io/earn-app/receive.html?Source=Lite`.
- The handoff deliberately sends only `Source=Lite`: no amount, client count, client identity, chakra selection, session details, UPI configuration, discount, QR data, or payment status is calculated or stored by Lite.
- Removed Total Journeys and the reflective journal from the completion modal. Historical journey statistics and existing `chakra_journal` data remain untouched in local storage; only the completion-page journal interface and its now-unused locale/runtime handlers were removed.
- Removed the blocking post-session Do Not Disturb alert because it interrupted the quiet automatic transition. The background-music fade now completes within the three-second closing window.
- `Return to Room` remains as a non-financial escape action and cancels the pending handoff if selected before navigation.
- Added `npm run test:handoff` to lock the exact destination, `Source=Lite`-only query contract, three-second sequencing, normal HTTPS navigation, and absence of the removed completion controls. Bumped the app query version and PWA shell cache so installed users receive the flow.
- Validation: `static` PASS — handoff contract, audio-safety regression, assessment contract, bilingual content-safety regression, JavaScript syntax, English/Malayalam/package JSON parsing, and `git diff --check`. No Playwright or screenshots were used, per owner instruction.
- Earn remains independently responsible for installed-PWA/custom-protocol handling and every financial decision after the HTTPS handoff.

### CP-HRIM-002 — Extended daytime availability

- Date: 2026-08-15 (Asia/Kolkata).
- HRIM is available from 3:30 AM through 5:59 PM according to the device's local time. At exactly 6:00 PM, HRIM is blocked and the existing evening Sleep Mode decision takes priority, so the modes do not overlap.
- Updated the runtime boundary and all visible English/Malayalam settings-help and blocked-time guidance from noon to 6:00 PM. The original 3:30 AM start remains unchanged.
- Added `npm run test:hrim-time` covering 3:29 AM, 3:30 AM, noon, 5:59 PM, and 6:00 PM. The existing browser specification now uses 6:00 PM as its blocked boundary, but Playwright was not run per owner instruction.
- Bumped the app query version and PWA shell cache so installed users receive the revised timing and copy.

### CP-JOURNEY-002 — User-activated Earn PWA handoff

- Date: 2026-08-15 (Asia/Kolkata).
- Supersedes the automatic navigation described in CP-JOURNEY-001. Journey Complete still preserves a three-second quiet blessing, but the timer now only reveals and focuses a localized `Continue to Earn` anchor.
- Earn navigation occurs only when the guide taps the native HTTPS anchor. This preserves fresh user activation and gives supported Android/Chromium environments the best opportunity to open the installed Earn PWA instead of navigating Lite's standalone window out of scope.
- The exact destination remains `https://missionode.github.io/earn-app/receive.html?Source=Lite`, carrying no amount, count, client, meditation, or payment data. `Return to Room` remains available and cancels/hides a pending handoff.
- The regression contract verifies that the control begins hidden, appears after three seconds, uses a genuine anchor with the exact `Source=Lite`-only URL, and contains no timer-driven `window.location` navigation.
- Updated English/Malayalam labels and completion-control styling; bumped stylesheet, app, and PWA shell versions. No custom protocol is invoked by Lite.

### CP-CONTENT-002 — Receiving, Aura, and Healing journey

- Date: 2026-08-16 (Asia/Kolkata).
- Rewrote the production English and Malayalam gratitude opening, returning opening, seven chakra meditations, seven affirmations, and closing as one progressive spiritual journey centred on Receiving, Aura, and Healing.
- The aura progression is intentional: Root establishes grounded protection; Sacral restores receptive flow; Solar strengthens clear boundaries; Heart supports healing and compassionate receiving; Throat protects authentic expression; Third Eye adds discernment; Crown integrates the colours into sacred protection; Closing carries the practice into familiar or unfamiliar surroundings.
- Traveller awareness is inclusive rather than logistical. The opening and closing welcome clients for whom the setting may be familiar or new, without adding transport, destination, itinerary, or tourism instructions to meditation.
- Aura language builds confidence through luminous imagery, dignity, consent, boundaries, support, discernment, and spiritual connection. It does not promise invulnerability, diagnose blocked chakras, claim medical or psychological cure, or force release, forgiveness, or healing.
- No JSON fields were added or removed. `test-script.json` and the custom facilitator content in `docs/dot.json` remain untouched. Existing names, mantras, frequencies, colours, symbols, moon scripts, HRIM, care practices, Yoga, and Ho'oponopono remain unchanged.
- Extended the bilingual content contract to preserve all three themes and the chakra-by-chakra aura progression while rejecting absolute protection, cure, diagnosis, and coercive-healing phrases. Bumped the PWA shell cache for production delivery.

### CP-ASSESSMENT-002 — Reliable chakra theming and lobby return

- Date: 2026-08-16 (Asia/Kolkata).
- Replaced the narrow Intersection Observer activation band with deterministic viewport-marker syncing, so scrolling through each large assessment card updates the complete page, toolbar, navigation, hero, and browser theme colour to that chakra.
- Chakra navigation, answer selection, and counsellor-note interaction now use the same activation path and apply the corresponding theme immediately.
- Added a visible `Return to Lobby` link beside `Clear for New Client`. It uses the app-relative `../index.html` destination so GitHub Pages and local hosting both return to Lite rather than the domain root.
- Extended the static assessment contract for all activation paths and the lower lobby link; bumped the PWA shell cache so installed clients receive the corrected assessment page. No questions, responses, scoring, notes, or stored client data were changed.

### CP-AUDIO-004 — Main-drone duration modes

- Date: 2026-08-16 (Asia/Kolkata).
- Commit: `b7563b7` — `feat(audio): add progressive drone duration modes`.
- Added a localized Lobby control with four persisted modes: Beginner 20%, Intermediate 50%, Advanced 70%, and Expert 100%. New and invalid preferences resolve to Beginner.
- The drone still begins before each chakra narration. Its timer uses the active core-practice duration (`timePerChakra`, or `timeHighEnergy` for HRIM), pauses with the journey, and starts the existing five-second release when the selected percentage elapses. Generation guards prevent a cancelled or previous chakra timer from stopping a later stage.
- Removed the half-frequency lower oscillator completely while retaining one main drone, elemental texture, and optional Eyes Close binaural support. Yoga keeps its independent untimed 136.1 Hz bridge-drone lifecycle.
- Added a live `MM:SS` preview so the guide can see the exact fade-start time before beginning. Music Only hides the control because that path creates no chakra drone.
- Strengthened custom-script handling by requiring HRIM's audio identity fields, validating every active chakra/HRIM frequency from 1–20,000 Hz, and retaining a defensive 110 Hz fallback at the audio boundary.
- Added `npm run test:drone-duration` for exact ratios, defaulting, localization, stage ordering, pause behavior, stale-timer protection, one-main-oscillator output, persistence, and frequency validation. Bumped app/style query versions plus the PWA shell and language caches. No Playwright or screenshots were used.

### CP-AUDIO-005 — Exact script-defined main-drone frequencies

- Date: 2026-08-16 (Asia/Kolkata).
- Commit: `99bc581` — `fix(audio): preserve exact script drone frequencies`.
- Removed the remaining octave-reduction rules that halved script frequencies above 600 Hz and quartered frequencies above 900 Hz. The main oscillator now uses the validated active chakra or HRIM JSON value as its centre frequency: 396, 417, 528, 639, 741, 852, 963, and HRIM 528 Hz in the production bundle.
- Preserved the separate 80/82 Hz optional Eyes Close binaural support, 40 Hz Eyes Close grounding anchor, elemental texture, and Yoga's independent 136.1 Hz drone. These supporting layers do not replace or retune the JSON-driven main oscillator.
- Preserved the existing 0.04 Hz vibration LFO, which moves the centre pitch by approximately ±0.1%; no octave or secondary lower-tone layer remains.
- Preserved the explicit Chakra Frequencies Off behavior and malformed-input defense, both of which use the neutral 110 Hz fallback intentionally.
- Strengthened `npm run test:drone-duration` to reject any return of `/2` or `/4` main-frequency shifting and to require direct use of the validated active frequency. No Playwright or screenshots were used.

### CP-AUDIO-006 — HRIM Intermediate-default drone mode

- Date: 2026-08-16 (Asia/Kolkata).
- Commit: `fc243a1` — `fix(audio): use separate HRIM drone duration default`.
- Normal chakra journeys retain the persisted Beginner default. HRIM now has a separate `chakra_hrim_drone_duration_mode` preference with Intermediate as the default; saved Beginner or invalid HRIM values normalize to Intermediate.
- The Lobby disables the Beginner radio while HRIM is selected, shows a localized English/Malayalam explanation, and keeps Advanced/Expert available. The runtime passes the correct normal or HRIM mode into the pause-aware drone timer.
- Bumped `app.js` to `v=1.67`, shell cache to `chakra-v5.30`, and language cache to `chakra-language-v5`. Updated the drone contract for HRIM normalization, separate persistence, UI disabling, and localization.
- Validation: `static/unit` PASS — JavaScript syntax, `npm run test:drone-duration`, `npm run test:content-safety`, and `git diff --check`. No Playwright or screenshots were used.

### CP-AUDIO-007 — Session-only frequency Shots and script-defined Sleep Mode

- Date: 2026-08-16 (Asia/Kolkata).
- Branch: `shots-feature`; not merged or pushed.
- Added a Lobby-only Shots toggle with Meditation, High Energy, Sleep, and Custom Shot types. The common timing contract is 7 seconds by default and 20 seconds maximum; the selected mode is not persisted.
- Shots require explicit confirmation, play only a dedicated direct-frequency oscillator, exclude narration/mantra/background music, add two-second gaps between stages, and permanently disable the Shot controls after activation until refresh.
- Sleep Mode now loads its five stage frequencies and interval from `scripts.json.sleep_mode`. Only the missing `sleep_mode` schema fields were added to `test-script.json` and `docs/dot.json`; existing fixture content was preserved.
- Validation: `static/unit` PASS — JavaScript syntax, JSON parsing, drone-duration/Shot contract, content safety, zero-volume audio safety, assessment, journey handoff, HRIM timing, and `git diff --check`. No Playwright or screenshots were used.

### CP-ASSESSMENT-003 — Consultant insight review layer

- Date: 2026-08-17 (Asia/Kolkata).
- Branch: `assessment-insights`; not merged or pushed.
- Preserved the consultant-led interview structure, all 35 questions, the visible balanced-reference answers, private device-local autosave, notes, and manual new-client reset.
- Balanced references now remain green without appearing selected; the client’s recorded response receives the selection indicator. Every question has consultant-only topic, pattern-direction, follow-up, recurring-theme, and meditation-consideration metadata.
- Completing a chakra reveals a neutral consultant reflection containing reported strengths, patterns to explore, uncertainties, follow-up questions, client context, and a possible meditation consideration. Completing all 35 questions reveals a cross-chakra synthesis with conversation priorities and recurring themes.
- The synthesis cannot diagnose the client or alter the session plan. It explicitly requires the consultant to confirm observations with the client and manually approve any meditation focus.
- Extended `npm run test:assessment` to validate metadata alignment and a mixed-answer insight result. Bumped the PWA shell cache so installed clients receive the updated assessment.
- Validation: `static/unit` PASS — assessment contract, bilingual content-safety contract, script syntax, and `git diff --check`. No Playwright or screenshots were used; the browser surface was unavailable for live visual inspection.

## Documentation checkpoint

- Checkpoint: `CP-CONTEXT-001` — active audio-branch context refresh.
- Date: 2026-08-16 (Asia/Kolkata).
- Baseline `HEAD`: `99bc581` — `fix(audio): preserve exact script drone frequencies`.
- Pre-refresh status: clean `drone-duration-modes` working tree; local branch two commits ahead of `origin/production`, with no upstream and no push performed.
- Scope: documentation accuracy only. Runtime behavior, JSON content, locales, styles, tests, and protected `loop.md` are intentionally unchanged by this checkpoint.
- Validation: `static/unit` PASS — documentation consistency, current Git state, current cache/query versions, npm test inventory, `npm run test:drone-duration`, `npm run test:hrim-time`, and `git diff --check`. Browser/manual evidence is intentionally not part of this refresh.
- Next checkpoint: resolve the pending HRIM duration-mode policy; do not merge or push until explicitly requested.

### CP-SHOTS-001 — Searchable frequency repertory and one-second handoff

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Rebuilt `docs/repertory.html` as a searchable bilingual reference table. It covers the five supplied brainwave bands plus 174, 285, 396, 417, 432, 528, 639, 741, 852, and 963 Hz, including the previously absent 285 Hz and 432 Hz references.
- Added `data/frequency-repertory.json` as the reference metadata source for English/Malayalam names, focus, commonly associated features, search terms, category, source attribution, and a validated Shot value. Runtime narration and active audio frequencies remain authoritative in `scripts.json` and were not changed.
- Benefits are explicitly framed as traditional or commonly reported associations rather than diagnosis, treatment, cure, guaranteed brainwave entrainment, or another medical outcome. Brainwave ranges use clearly identified in-range reference tones for the single-frequency Shot handoff.
- Each row provides a `Prepare 1 sec Shot` action. It returns to the Lobby with only `shotSource=repertory` and the selected frequency, consumes those parameters immediately, validates the 0–20,000 Hz boundary, selects Custom Shot, resets its duration to the configured one-second default, and dispatches the existing Shots confirmation. Cancelling the confirmation leaves Shots inactive; confirming reveals the prefilled Custom Shot ready for deliberate activation.
- Updated the PWA shell cache and app query version so installed copies receive the catalog, page, and handoff. `docs/dot.json`, `test-script.json`, narration content, active audio frequencies, and the owner's in-progress documentation files remain unchanged.
- The Shot confirmation now tells the guide to disconnect Bluetooth or other external speakers before activation and makes the browser limitation explicit: Lite cannot disconnect an OS-managed Bluetooth audio connection itself.
- Validation: `static/unit` PASS — JavaScript syntax, repertory/search/handoff contract, exact-frequency drone contract, zero-volume audio safety, assessment contract, journey-completion handoff, HRIM availability, bilingual content safety, JSON parsing, and `git diff --check`. Browser/visual/manual evidence was not run, following the owner's instruction not to use Playwright or screenshots unless requested.

### CP-AUDIO-008 — No Frequency Mode

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Replaced the former Chakra Frequencies switch, which merely substituted a 110 Hz fallback, with an explicit persisted No Frequency Mode that defaults off.
- When enabled, normal guided journeys keep spoken narration and background music while skipping intentional frequency generators: chakra/HRIM drones, sleep-stage drones, binaural layers, the Eyes Close 40 Hz anchor, singing bowls, and mantra tracks. Enabling it during a journey stops those active frequency sources and cancels the current drone timer.
- Shots are frequency-only by design, so the Lobby toggle is disabled and direct activation is rejected with a localized explanation while No Frequency Mode is active. The drone-duration control is hidden because it has no effect in this mode.
- Updated the shell and language cache versions so installed PWA copies receive the changed application and bilingual labels. Updated the static test contract plus legacy E2E selectors without running Playwright, per the owner's instruction.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-PRACTICE-001 — Focused Box Breathing and Ho’oponopono

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Moved Box Breathing and Ho’oponopono from persistent Settings add-ons to session-only Lobby Experience Modes. Legacy saved add-on flags are removed on load and cannot cause either practice to appear in a normal chakra journey.
- Each practice now completes as its own guided experience: Box Breathing uses its existing timed visual/narrated breath routine; Ho’oponopono uses its existing narrated reflection sequence. Both retain background music and finish directly, without arrival, gratitude, chakra, or normal closing stages.
- Experience modes are mutually exclusive with one another, HRIM, Sleep, Music Only, and Shots. The Lobby shows a focused roadmap, suitable Begin action, and focused estimate; normal intention, returning-journey, core-duration, and drone controls are hidden while a focused practice is selected.
- Updated English/Malayalam labels, static contracts, and legacy E2E selectors. Bumped the shell and language caches for installed PWA updates.
- Validation: `static/unit` PASS — focused-practice contract, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, JavaScript/service-worker syntax, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-001 — Standalone Yoga Experience and optional chakras

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Removed Yoga Bridge from the normal chakra flow. Yoga can no longer be injected between Third Eye and Crown, so none of the seven chakra choices are structurally required, locked, or selected by default for a new client.
- Added Yoga Experience as a session-only Lobby Experience Mode. It uses the saved Yoga setup—selected poses plus optional Corpse Pose, Bath, Massage, Perineal Care, and Assisted Bathing—and finishes directly without meditation arrival, gratitude, chakra, or closing stages.
- Yoga setup remains in Settings, while the Yoga Experience selection is deliberately not persisted. Bath add-ons remain dependent on Bath Session; legacy `chakra_yoga_bridge` state is removed on load.
- Updated English/Malayalam terminology, help text, Lobby roadmap, focused estimates, legacy E2E selectors, and PWA cache versions.
- Validation: `static/unit` PASS — Yoga Experience/optional-chakra contract, focused-practice contract, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, JavaScript/service-worker syntax, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-002 — Lobby-owned Yoga Experience setup

- Date: 2026-08-20 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Moved the complete Yoga setup from normal Settings to an expandable Lobby panel that appears only when Yoga Experience is selected. It contains pose selection, preparation/per-pose timings, optional Corpse Pose, Bath Session, Perineal Care, Assisted Bathing, Massage, and their durations.
- Yoga setup choices now persist immediately from the Lobby, update the focused estimate and roadmap, and are used by the next Yoga Experience without requiring a return to Settings.
- Updated static E2E selectors to open Yoga Experience before operating Yoga controls. Bumped the application shell cache and app query so installed copies receive the relocated panel.
- Validation: `static/unit` PASS — Yoga Experience/optional-chakra contract, focused-practice contract, No Frequency Mode contract, zero-volume audio safety, drone-duration contract, repertory, bilingual content safety, assessment, Earn handoff, HRIM availability, JavaScript/service-worker syntax, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-003 — Guide-controlled bath-to-Yoga rest module

- Date: 2026-08-21 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Added a reusable `runGuideControlledRest` module. It accepts its own timing, title, guidance, completion wording, and guide action, so later experience flows can use the same timer-plus-explicit-continue pattern without duplicating Yoga logic.
- When Bath Session is enabled, Yoga Experience now follows: optional Corpse Pose → selected care/bath stages → 15-minute quiet rest → guide-controlled Begin Yoga → Yoga introduction, preparation, and selected asanas. The rest does not appear when Bath Session is off.
- The rest is pause-aware and a stopped session cancels any pending guide action. The focused estimate and Lobby roadmap include the rest stage. Production timing is 900 seconds; the fast-test profile is one second.
- Updated English/Malayalam labels and PWA app/language cache versions. No Playwright, screenshots, or browser/manual evidence was run.

### CP-YOGA-004 — Guide-controlled care-stage handoffs

- Date: 2026-08-21 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Generalized the earlier rest helper into `runGuideControlledTransition`, a reusable module that supports either a visible timed countdown or an immediate approval screen.
- Massage, Perineal Care, Bath Session, and Assisted Bathing now stop at their configured timer end and show “Ready for the next session?” The flow remains there until the guide selects “Proceed to Next Session”; it cannot auto-advance through a real-world delay.
- The existing Bath-to-Yoga rest remains a 15-minute timed use of the same module, followed by the guide-controlled Begin Yoga action. Stopping the session still cancels any pending transition.

### CP-SPLASH-001 — Full-image splash reveal

- Date: 2026-08-21 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Replaced the cropping `cover` splash treatment with a full-image `contain` reveal. The complete source image is visible first, then gently expands during the existing 2.5-second launch window.
- Added a dimmed, blurred Splash image backdrop so wide screens retain an immersive full-screen presentation without cropping the primary artwork. Reduced-motion preference disables the zoom.
- Added a static splash contract test. No Playwright, screenshots, or browser/manual evidence was run.

### CP-POLICY-002 — Loop 0.3 root package refresh

- Date: 2026-08-27 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Installed the supplied `Loop/` source package into the Lite repository root so its root policy documents, plugin manifest, Loop skill, delivery workflow, benchmark, installation guide, local/model routing policies, routing configuration, Codex adapter, and tests remain together with valid relative links.
- The original untracked source folder was moved, not deleted, to `/private/tmp/lite-loop-source-20260827` after the overlay. The root-level `communication-architecture.md` was already identical to the supplied version.
- Validation: Loop manifest/routing JSON parse PASS; six model-router unit tests PASS; `git diff --check` PASS.

### CP-AUDIO-009 — Null-safe No Frequency Mode activation

- Date: 2026-08-27 (Asia/Kolkata).
- Branch: `production`; local checkpoint only, with no push performed.
- Fixed No Frequency Mode activation before Web Audio initialization. `stopBinaural()` and `stopDrone()` now clear dormant node state and return safely when `AudioEngine.ctx` is still null, preventing the `currentTime` TypeError reported at the former line 1634.
- Added regression assertions for both null-safe stop boundaries and refreshed the PWA shell/app cache versions.
- Validation: JavaScript/service-worker syntax PASS; No Frequency Mode, zero-volume audio safety, bilingual content safety, and `git diff --check` PASS. No Playwright or screenshots were used.

### CP-AUDIO-010 — Fixed drone exposure window and continuous narration ticker

- Date: 2026-08-27 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Replaced core-practice-based drone duration with a fixed 20-second exposure reference: Beginner 4s, Intermediate 10s, Advanced 14s, and Expert 20s. Chakra, HRIM, Sleep, and Yoga drone paths use the shared timer; the previously unbounded Yoga grounding drone is now timed.
- Narration ticker behavior is continuous at the complete narration-block level rather than sentence-by-sentence. It clears on actual narration completion and cancellation. Mobile uses a modest speed increase constrained by a conservative voice-duration estimate so it does not intentionally outrun Piper or browser speech.
- Updated bilingual guidance and regression contracts. Validation: JavaScript syntax, narration ticker, drone-duration, and `git diff --check` PASS. No Playwright or screenshots were used.
- Remaining release evidence: real-device listening and visual UX validation; this checkpoint does not claim browser/manual evidence.

### CP-AUDIO-011 — Centered ethereal narration for Spatial Sound

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Spatial Sound now adds a restrained ethereal presence to narration through the existing voice-only ambience bus. The dry narration remains centered and unchanged, while only the stereo wet return receives a short delay, airy filtered tail, and gradual 13% wet mix.
- The effect is derived from the selected spatial mode: it activates for Stereo Wide, Headphone 3D, and Room Spatial, and returns to the guide's saved Voice Space preference when Spatial Sound is Off. The saved voice preference is not overwritten.
- Updated bilingual Spatial Sound guidance and bumped the application shell/app cache versions. No content schema or facilitator script fields changed.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, locale JSON parsing, spatial routing, background-music/mantra echo, drone-duration, bilingual content safety, and `git diff --check`. No Playwright, screenshots, or browser/manual evidence were used.
- Open risk: headphone and speaker listening quality still needs real-device confirmation, especially perceived reverb level and intelligibility across spatial modes.

### CP-AUDIO-012 — Stage countdown and stronger ethereal presence

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Added a circular countdown indicator to the active meditation view. It is driven by the real remaining time for chakra practice, Sleep stages, Shots, Yoga pose holds, intervals, and final silence, and is hidden when no timed stage is active.
- Strengthened the Spatial Sound narration ambience to a perceptible but controlled 110 ms delay, 22% wet return, and 5 kHz filtered tail. The dry narration remains centered, and the saved Voice Space preference is restored when Spatial Sound is turned off.
- Updated cache versions, bilingual countdown/spatial guidance, and static regression contracts. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: `static/unit` PASS — JavaScript/service-worker syntax, locale JSON parsing, spatial audio, narration ticker, background-music/mantra echo, drone-duration, bilingual content safety, chakra selection, and `git diff --check`.
- Open risk: the new ambience level should be listened to on both headphones and speakers before release to confirm it feels ethereal without masking words.

### CP-AUDIO-013 — Journey-level countdown and quiet focus hierarchy

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Corrected the countdown behavior so it starts once from the estimated complete journey duration and remains continuous across preparation, narration, every chakra, intervals, silence, Sleep stages, Shots, Yoga poses, and closing transitions. It no longer resets to an individual chakra or stage timer.
- Kept the circular indicator compact and low-emphasis at the edge of the meditation overlay. The chakra symbol/deity image remains the primary visual focus; the mantra/title and progress dots are intentionally dimmed. The legacy timer node remains synchronized for compatibility but is visually suppressed to avoid a second, conflicting timer.
- Updated cache versions and static regression contracts. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-016 — Full-viewport ambient gradient and ring-only countdown

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Expanded the breathing tutorial’s live gradient across the full viewport with broad layered fields and slow-moving organic forms. Reduced brightness, saturation, and animation intensity so the effect remains atmospheric and comfortable for the eyes.
- Moved the countdown layer above the meditation screen stacking context so the mirrored rings remain visible during mantra playback and throughout the complete journey. Removed the numeric time and label content; only the small circular progress rings remain.
- Bumped cache versions and expanded the static regression contract. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS.

### CP-AUDIO-014 — Mirrored low-distraction journey countdown

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Repositioned the journey-level countdown as two smaller synchronized circular indicators pinned to the lower left and lower right screen corners, keeping them clear of the controls and reducing their visual weight.
- Removed the legacy text timer entirely. The circular indicators are now the only countdown display; both are updated from the same continuous session state and are hidden together when the session ends or a non-timed mode is active.
- Bumped cache versions and refreshed the static countdown regression contract. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS.

### CP-AUDIO-015 — Full-screen live chakra gradient and global countdown visibility

- Date: 2026-08-28 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Made the breathing tutorial a true full-viewport responsive layer with safe-area spacing and overflow handling. Added a slow, low-contrast live gradient made from blurred irregular forms, vibrant complementary colors, and the selected chakra color; no flashing or rapid brightness changes are used.
- Moved the mirrored circular countdown layer outside individual screen sections so it remains visible from journey preparation through completion. Its single continuous session estimate is now visible during the breathing tutorial instead of appearing only after the meditation screen opens.
- Bumped cache versions and expanded the static regression contract. No Playwright, screenshots, or browser/manual evidence were used.
- Validation: JavaScript/service-worker syntax, focused static tests, and `git diff --check` PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-017 — Session-only pleasure ambience intensity

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Added Gentle, Immersive, and Deep ambience profiles in Journey Tuning. The choice is deliberately session-only and resets to Gentle after reload.
- The existing 0.2–7.0% Ambience Level remains the source-level ceiling. Profiles instead change blur clarity, subtle harmonic texture, and the speed/proximity of spatial approach. Immersive and Deep make the optional pleasure layer cleaner and more present without changing other session audio paths.
- Optional local/URL asset recovery, the existing 5% confirmation, and all fade behavior remain unchanged.
- Brought the spatial source and end position closer in Stereo, Headphones, and Room. Language-cache rotation plus a readable fallback guard prevents raw `ui.*` keys from appearing while a device still holds an older language bundle.
- Validation: JavaScript/service-worker syntax, English/Malayalam locale JSON parsing, background-music, spatial-audio, audio-safety, and no-frequency static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-018 — More present background-music room

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Raised Background Music → Soft Room from 10% to 16% wet with a 65 ms delay, and Temple Air from 15% to 24% wet with a 110 ms delay. The convolved, low-passed echo remains music-only and continues to be fully muted with the background bus before mantra playback.
- Validation: JavaScript/service-worker syntax, background-music, spatial-audio, and audio-safety static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-019 — Heavenly narration ambience

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Raised Voice Space → Soft Room to 19% wet at 50 ms, Temple Air to 28% wet at 95 ms, and the automatic Spatial Sound ethereal return to 32% wet at 140 ms. The ethereal return opens to 5.6 kHz so it feels airy rather than muffled.
- Narration remains dry and centered; only its convolved wet return widens. Background music, mantra, frequency, and safety paths are unchanged.
- Validation: JavaScript/service-worker syntax, background-music, spatial-audio, audio-safety, and no-frequency static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-AUDIO-020 — Extended narration and mantra tails

- Date: 2026-08-31 (Asia/Kolkata).
- Branch: `production`; local checkpoint pending commit and push.
- Extended narration’s convolved tail from 1.1 seconds to 3.0 seconds with a slow but clearer decay. Added a separate 3.6-second, low-passed 26% wet convolved tail for recorded mantra audio.
- The mantra tail follows the same spatial panner as the dry mantra. It does not enter the background-music or narration buses, so mantra handoff muting and volume controls remain independent.
- Corrected Music `+`/`−` handling: it now preserves whether the background is full, ducked below narration, or intentionally faded to silence. In particular, it cannot restart music during Box Breathing just by changing the level.
- Validation: JavaScript/service-worker syntax, background-music, spatial-audio, audio-safety, and no-frequency static contracts, plus `git diff --check`, PASS. No Playwright, screenshots, or browser/manual evidence were used.

### CP-VIDEO-075 — Conversion paused after duplicate encoder load

- Date: 2026-09-08 (Asia/Kolkata).
- Branch: `production`; no commit or push made for this conversion attempt.
- Objective: create a performance-oriented H.264/AAC MP4 derivative of the original universe fly-through WebM while preserving the original WebM as the primary source of truth/fallback.
- Environment evidence: local FFmpeg exposes Apple `h264_videotoolbox`, so hardware-assisted H.264 encoding is available after the system restart. No browser or device playback benchmark has been run.
- Incident: two FFmpeg processes were started concurrently and targeted `video/universe-fly-through-fhd.mp4`. This caused unnecessary sustained system load and left the generated MP4 invalid/incomplete. Both processes were stopped. The source WebM was not modified.
- Current artifact state: `video/universe-fly-through-fhd.mp4` is an untrusted generated artifact and must not be published or used until it is replaced and validated. Do not start another encoder until no previous FFmpeg process is running.
- Safety/performance decision: after restart, run one process only, prefer `h264_videotoolbox` with a bounded bitrate and `-movflags +faststart`, validate the finished file, and retain the WebM. Part-by-part conversion is optional for recovery but does not inherently reduce total decode work or heat; it must never run in parallel.
- Buffering decision: the browser’s safe-start gate should remain separate from encoding. Prebuffering a bounded initial window is useful; attempting to preload the entire FHD file is not required and may increase memory/network pressure.
- Validation required before release: confirm no active FFmpeg process; replace the invalid derivative; verify complete duration against the source, 1920×1080 (or an explicitly approved lower profile), H.264 video, AAC audio, playable MP4 metadata, and `git diff --check`; run the relevant static video-prelude contract. No Playwright/screenshots unless explicitly requested.
- Pickup note: after the user restarts/reopens the system, inspect `git status`, `ps -Ao pid=,command= | grep '[f]fmpeg'`, the source WebM, and the generated MP4. If the generated MP4 is still invalid, replace it only through a single controlled hardware-accelerated encode. Update this checkpoint with the final command, file metadata, and validation result before committing or pushing.
- Unrelated working-tree changes to preserve: `.DS_Store` modifications, deleted `docs/dot.json`, `.codex/`, and `audio/BACKUP/background_music.mp3`. Do not rewrite or restore `docs/dot.json`.

### CP-VIDEO-076 — Validated MP4 activated and Loop project refresh

- Date: 2026-09-08 (Asia/Kolkata).
- Branch: `production`, currently 15 commits ahead of `origin/production`; no commit or push was made during this refresh.
- Loop activation: reusable instructions root is `Loop/`; target application root is `/Users/lekshmisyam/Desktop/Ikigai/lite`. This is an existing static HTML/CSS/JavaScript PWA with local JSON content, Web Audio, narration, service-worker caching, and npm-based static regression tests. No backend, database, authentication layer, or production build step is present.
- Environment profile: Darwin 24.1.0, Apple arm64 (`T8103`), Node v25.9.0, npm 11.12.1, FFmpeg/FFprobe from `/opt/homebrew/bin`, approximately 56 GiB free on the project volume. Local listeners include the host control service on ports 5000/7000 and Ollama on 127.0.0.1:11434; no project application server was identified.
- Documentation reconciliation: `HANDOFF.md` is the compact project context source. `PROJECT-BRIEF.md`, root `TECH-STACK.md`, `DEVELOPMENT-SAFETY.md`, `.codex/context-index.md`, and `.codex/project-map.md` are absent; for this small static project, the existing handoff remains sufficient. Historical `.codex/loop-routing/*.json` records are local routing evidence, not application runtime state.
- Media result: the original `video/Stunning New Universe Fly-Through Really Puts Things Into Perspective [nGnX6GkrOgk].webm` remains unchanged. The validated `video/universe-fly-through-fhd.mp4` is 1920×1080 H.264 High + AAC stereo, 344.084917 seconds, 183,194,587 bytes, and passed a full decode scan. The prior invalid artifact is retained as `video/universe-fly-through-fhd.mp4.corrupt-backup`.
- Hardware note: `h264_videotoolbox` and `-allow_sw 1` both failed to create a VideoToolbox compression session (`-12908`). With owner approval, the final derivative was created using bounded two-thread `libx264` software encoding; this is not hardware-accelerated evidence.
- Runtime wiring: `index.html` now uses `video/universe-fly-through-fhd.mp4` as the primary Restart Journey prelude and retains `video/nature-upgrade.mp4` as the MP4 fallback. The focused journey-video-prelude test was updated to require the converted MP4 and passed.
- Validation: `static/unit` PASS — journey video prelude contract, `node --check app.js`, `node --check sw.js`, `git diff --check`, `ffprobe` metadata validation, and full FFmpeg decode scan. No Playwright, screenshots, browser, or device playback evidence was run; those remain opt-in and open.
- Current working-tree changes to preserve: `.DS_Store` modifications, this handoff refresh, the MP4 source/fallback wiring and focused test update, deleted `docs/dot.json`, `.codex/`, `audio/BACKUP/background_music.mp3`, and the validated MP4 plus corrupt backup. Do not restore or rewrite `docs/dot.json`.
- Next action: owner review of the new MP4 on target devices/browser surfaces; after approval, decide separately whether to stage/commit the intended code, handoff, and media artifacts and whether to push. Do not merge, deploy, or push automatically.

### CP-VIDEO-077 — Lower-bitrate delivery encode

- Date: 2026-09-08 (Asia/Kolkata).
- Re-encoded directly from the original WebM using one bounded two-thread `libx264` process with `-preset fast`, `-crf 26`, `-maxrate 3M`, `-bufsize 6M`, AAC 128 kbps, and `-movflags +faststart`. No parallel encoders or chunk concatenation were used.
- The active `video/universe-fly-through-fhd.mp4` is now approximately 99 MiB / 103,360,947 bytes, compared with the previous valid 175 MiB derivative, while retaining 1920×1080, H.264 High, AAC stereo, 25 fps, and 344.084917 seconds.
- Validation: `ffprobe` metadata PASS and full FFmpeg decode scan PASS. The original WebM remains unchanged. The previous valid MP4 is retained as `video/universe-fly-through-fhd.mp4.previous-valid`; the earlier corrupt artifact remains separately retained.
- Runtime wiring is unchanged: `index.html` already points to the stable filename `video/universe-fly-through-fhd.mp4`. No code change was needed for this media-only optimization.
- Open risk: actual smoothness still requires browser/device playback evidence. If stutter continues, investigate runtime buffering/network throughput and target-device decode performance before reducing resolution further; Playwright/manual playback remains opt-in.

### CP-VIDEO-078 — Adaptive stable prebuffer gate

- Date: 2026-09-08 (Asia/Kolkata).
- Updated `JourneyVideoPrelude` to wait for a measured, stable buffer before revealing Begin: 20 seconds on healthy connections, 30 seconds below 8 Mbps, 45 seconds below 3 Mbps, and up to 60 seconds for Save-Data/2G conditions. The threshold is based on buffered playback seconds, not a percentage of the file or assumed RAM, and must remain satisfied for two seconds.
- Added a playback safety guard: if buffered-ahead time falls below eight seconds during the active video, playback pauses and resumes after at least 20 seconds are available. The existing 15-second meditator hold remains, providing additional time for buffering after the guide begins.
- Rotated delivery identifiers to `app.js?v=2.43` and shell cache `chakra-v5.127` so installed clients receive the buffering logic. Service-worker precaching remains unchanged; it is not used as the first-play buffering mechanism.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. No browser/device playback evidence was run; real smoothness remains an open runtime/manual validation item.
- Next action: test on target network/device combinations. If stalls persist, add a 720p lower-bitrate rendition and select it for constrained devices/connections rather than increasing the initial buffer indefinitely.

### CP-VIDEO-079 — Prevent slow-buffer timeout from skipping prelude

- Date: 2026-09-08 (Asia/Kolkata).
- Fixed the Begin introduction invisibility/automatic-skip path. A 90-second buffering timeout is no longer treated as `unavailable`; it now reveals Begin and leaves actual media failure handling to the video `error` event.
- The adaptive stable-buffer gate remains active, so normal playback still waits for the measured 20–60 second target and two-second stability window. The change only prevents slow delivery from silently closing the prelude.
- Rotated delivery identifiers to `app.js?v=2.44` and shell cache `chakra-v5.128`.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device playback evidence remains open and opt-in.

### CP-VIDEO-080 — Fullscreen playback jerk mitigation

- Date: 2026-09-08 (Asia/Kolkata).
- Changed the prelude video from dynamic `100vw`/`100dvh` sizing to an absolute `inset: 0` layer sized at `100%` of the stable prelude container. Added compositor hints (`translateZ(0)` and `backface-visibility: hidden`) to reduce fullscreen resize/rasterization hitches.
- Softened the playback rebuffer guard: it now pauses only below four seconds of buffered-ahead media and resumes after fifteen seconds, reducing false pause/resume jerks while retaining protection against a genuine stall.
- The source remains 25 fps and the validated 1920×1080 MP4 remains unchanged; no unnecessary frame-rate conversion or re-encode was introduced.
- Rotated delivery identifiers to `app.js?v=2.45` and shell cache `chakra-v5.129`.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device playback evidence remains open; test fullscreen playback on the target device before release.

### CP-VIDEO-081 — Fullscreen requested at Restart gesture

- Date: 2026-09-08 (Asia/Kolkata).
- Moved the persistent `#app` fullscreen request from the delayed Begin introduction action to the confirmed Restart Journey click. The viewport now enters fullscreen before prelude buffering and before the 15-second meditator hold, allowing layout and video sizing to settle before playback.
- Begin now only starts the cinematic sequence; it no longer triggers a late fullscreen transition. Existing fullscreen exit behavior and fallback handling remain unchanged.
- Rotated delivery identifiers to `app.js?v=2.46` and shell cache `chakra-v5.130`.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device fullscreen playback evidence remains open.

### CP-VIDEO-082 — Stable crop frame and visible buffer countdown

- Date: 2026-09-08 (Asia/Kolkata).
- Changed the prelude video presentation from `object-fit: contain` to a stable cropped `object-fit: cover` frame sized relative to the fixed prelude container. This preserves the 16:9 proportion while cropping excess edges, reducing fullscreen fit/resizing work.
- Added localized loading guidance and a live seconds-remaining indicator while the adaptive buffer gate is filling. Begin remains hidden until the stable buffer gate succeeds; the status is hidden when Begin becomes available.
- Rotated delivery identifiers to `app.js?v=2.47` and shell cache `chakra-v5.131`.
- Validation: `npm run test:journey-video-prelude`, locale JSON parsing through the focused test, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device evidence remains open.

### CP-VIDEO-084 — Fullscreen compositor stabilization

- Date: 2026-09-08 (Asia/Kolkata).
- Stabilized the fullscreen rendering path by locking `#app:fullscreen` to `100vh`, sizing the prelude to `100%` of that container, and applying layout/paint containment to the prelude and video layers.
- Removed the loading card’s backdrop blur and shadow while playback is active, reducing unnecessary fullscreen compositor work. The video remains cropped with `object-fit: cover` and its aspect ratio is preserved.
- Rotated delivery identifiers to `app.js?v=2.48` and shell cache `chakra-v5.132`.
- Validation: `npm run test:journey-video-prelude`, locale JSON parsing, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device fullscreen evidence remains open.

### CP-VIDEO-085 — Remove automatic fullscreen transitions

- Date: 2026-09-08 (Asia/Kolkata).
- Removed automatic fullscreen entry from Restart Journey and automatic fullscreen exit from Stop/completion paths. Fullscreen is now entirely guide-controlled through the browser/device, so the prelude does not trigger a viewport transition during preparation or playback and does not undo a manually entered fullscreen state.
- Retained the existing fullscreen lifecycle CSS/class support for user-controlled app fullscreen, but the application no longer calls `requestFullscreen()` or video-specific fullscreen APIs.
- Rotated delivery identifiers to `app.js?v=2.49` and shell cache `chakra-v5.133`.
- Validation: `npm run test:journey-video-prelude`, locale JSON parsing, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device playback evidence remains open.

### CP-VIDEO-083 — Correct loading label for Begin introduction

- Date: 2026-09-08 (Asia/Kolkata).
- Corrected the loading guidance so it names the actual action, “Begin introduction,” rather than shortening it to “Begin.” Updated the English, Malayalam, Russian, Hindi, and HTML fallback copy.
- Validation: `npm run test:journey-video-prelude`, all shipped locale JSON parsing, and `git diff --check` PASS.

### CP-VIDEO-089 — Video folder cleanup

- Date: 2026-09-08 (Asia/Kolkata).
- Removed all other files from `video/`, preserving only `video/generate.mp4` and `video/meditator.png` as requested. The original WebM, previous MP4 renditions, corrupt backup, valid backup, and nature fallback were removed.
- Removed stale fallback `<source>` entries from `index.html`; `generate.mp4` is now the sole prelude video source. Updated the focused test to enforce the cleaned media contract.
- Validation: `npm run test:journey-video-prelude` and `git diff --check` PASS. No commit or push was performed.

### CP-VIDEO-086 — Restore full-frame proportioned video

- Date: 2026-09-08 (Asia/Kolkata).
- Restored the prelude video to `object-fit: contain` with an explicit `16 / 9` aspect ratio. The complete original frame is now visible; mismatched screens show black letterboxing instead of cropping or stretching.
- Manual fullscreen remains available, but the application does not enter or exit fullscreen automatically.
- Rotated delivery identifiers to `app.js?v=2.50` and shell cache `chakra-v5.134`.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, and `git diff --check` PASS. Browser/device evidence remains open.

### CP-VIDEO-087 — 720p smoothness test rendition activated

- Date: 2026-09-08 (Asia/Kolkata).
- Created a separate 720p rendition directly from the untouched source WebM using one sequential, bounded two-thread encode: 1280×720, fixed 25 fps, H.264 Main, `-tune fastdecode`, keyframes every 2 seconds, CRF 27, 1.8 Mbps maximum bitrate, AAC stereo 96 kbps, and `+faststart`.
- The validated rendition is 63,165,171 bytes / approximately 60 MiB, 344.084917 seconds, 1280×720, H.264 Main, AAC stereo, and passed a full decode scan. It is approximately 40% smaller than the 67 MiB WebM and substantially smaller than the 99 MiB 1080p MP4.
- `index.html` now selects `video/universe-fly-through-720p.mp4` first, followed by the preserved 1080p MP4 and the existing nature fallback. The original WebM remains untouched for later reference.
- Rotated delivery identifiers to `app.js?v=2.51` and shell cache `chakra-v5.135`.
- Validation: `ffprobe` metadata, full FFmpeg decode scan, `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, locale JSON parsing, and `git diff --check` PASS. Browser/device smoothness testing remains the next evidence gate.

### CP-VIDEO-088 — Use updated generate.mp4 prelude

- Date: 2026-09-08 (Asia/Kolkata).
- Inspected the owner-provided `video/generate.mp4`: valid 1280×720 H.264 High + AAC stereo, 24 fps, 10.005 seconds, 8,386,322 bytes, approximately 6.7 Mbps. It is a compressed 10-second version of the same visual content and passed metadata inspection.
- `index.html` now selects `video/generate.mp4` first, followed by the preserved 1080p and 720p universe renditions and the existing nature fallback. Existing longer videos remain intact for later testing.
- Adjusted buffer countdown and recovery thresholds to cap against the actual clip duration, preventing impossible 15–60 second targets for the 10-second asset.
- Rotated delivery identifiers to `app.js?v=2.52` and shell cache `chakra-v5.136`.
- Validation: `npm run test:journey-video-prelude`, `node --check app.js`, `node --check sw.js`, locale JSON parsing, and `git diff --check` PASS. Full decode scan and browser/device playback evidence remain recommended before release.

### CP-VIDEO-091 — Match prelude fade to ten-second generate.mp4

- Date: 2026-09-08 (Asia/Kolkata).
- Fixed the short-clip presentation: the previous eight-second exit fade began around two seconds into the 10.005-second `generate.mp4`, making the video appear to end early. The exit fade is now 1.5 seconds and begins only during the final portion of the clip.
- Rotated delivery identifiers to `app.js?v=2.53` and shell cache `chakra-v5.137` so installed clients receive the timing correction.
- Validation required: focused journey-video-prelude test, JavaScript/service-worker syntax, and `git diff --check`. Browser/device playback remains the final visual evidence gate.

### CP-VISUAL-092 — Restore visible live star-field depth

- Date: 2026-09-08 (Asia/Kolkata).
- Improved the shared sky without WebGL or bitmap dependencies: the background now uses deeper midnight/obsidian blue gradients with more restrained nebula colour volumes, while the canvas uses a capped two-dimensional field with mostly tiny stars and a small bright foreground population.
- Stars now use blue-white, warm-white, orange, and soft-white colour temperatures. Bright stars receive independent blended sine-wave scintillation and subtle drift, so twinkles are unsynchronized and visibly alive rather than a static white field. Canvas rendering remains capped at 1.5 device-pixel density and pauses when the document is hidden.
- Rotated the stylesheet delivery identifier to `style.css?v=1.81`; no new external assets or service dependencies were added.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Browser/device visual smoothness remains open for manual confirmation.

### CP-VISUAL-093 — Increase perceptible sky motion

- Date: 2026-09-08 (Asia/Kolkata).
- The first twinkle revision was too subtle in practice. Increased the bounded independent scintillation depth, raised the canvas presentation slightly, and added a very faint diagonal Milky Way-style dust band to the CSS sky.
- Added a capped two-meteor effect: one short, soft-tail shooting star appears at an 8–15 second randomized interval, with at most two active meteor objects. This remains in the existing canvas loop and inherits hidden-tab and reduced-motion protections.
- Rotated the stylesheet identifier to `style.css?v=1.82`; no external image, WebGL, service worker, or continuous particle allocation was added.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Target-device visual smoothness remains open for manual confirmation.

### CP-VISUAL-094 — Add location-aware Moon and bright celestial objects

- Date: 2026-09-08 (Asia/Kolkata).
- Added an offline location-aware celestial layer to the existing canvas. With browser permission, the current observer latitude/longitude and UTC time position the Moon, Venus, Jupiter, Mars, Saturn, Polaris, Sirius, Vega, Arcturus, Altair, and Betelgeuse above the horizon.
- The Moon is rendered as a softly glowing phase-shaped disc; planets and bright stars use separate apparent size and colour-temperature treatments. If location is unavailable or declined, the atmospheric star field remains available without a permission error.
- This is a lightweight visual ephemeris intended for presentation, not an observatory-grade almanac. Exact sky accuracy still depends on the device’s location/time quality and should be manually checked against a planetarium for any educational or ceremonial claim.
- Rotated delivery identifiers to `app.js?v=2.54` and shell cache `chakra-v5.138`; no network request or external astronomy asset was added.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Target-device visual and location-permission behavior remains open for manual confirmation.

### CP-VISUAL-095 — Remove opaque Moon phase overlay

- Date: 2026-09-08 (Asia/Kolkata).
- Replaced the Moon’s opaque dark offset disc with a `destination-out` cutout on the transparent celestial canvas. The unlit side now reveals the actual nebula and star field instead of appearing as a pasted black overlay, while the lit crescent retains its glow.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Target-device Moon rendering remains open for manual confirmation.

### CP-VISUAL-099 — Localized subtle celestial labels

- Date: 2026-09-08 (Asia/Kolkata).
- Added very small, low-contrast labels for the Moon, Venus, Jupiter, Mars, Saturn, Polaris, Sirius, Vega, Arcturus, Altair, and Betelgeuse. Labels use matching object colour/glow, stay near the calculated body, and avoid the edge where possible.
- Labels resolve through the selected Display Language (`en`, `ml`, `ru`, or `hi`) at draw time, so changing the interface language updates the sky without a reload or a second label layer.
- Rotated delivery identifiers to `app.js?v=2.58` and shell cache `chakra-v5.142`.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Target-device readability remains open for manual confirmation.

### CP-DESIGN-100 — Cosmic sacred splash redesign

- Date: 2026-09-08 (Asia/Kolkata).
- Generated a new portrait splash artwork, `Splash-v2.png`, using the imagegen skill. It matches the live theme with deep navy/obsidian space, violet-blue nebula depth, sacred-gold chakra geometry, luminous star dust, and a small meditating silhouette. The artwork contains no text so localized overlay copy remains available.
- Updated the launch image, Apple startup image, softened wide-screen backdrop, and service-worker precache to use `Splash-v2.png`. The original `Splash.png` remains preserved for rollback.
- Rotated delivery identifiers to `style.css?v=1.83` and shell cache `chakra-v5.143`.
- Validation: splash contract, visual-effect contract, journey-video-prelude contract, JavaScript/service-worker syntax, and `git diff --check` required before release. No commit or push was performed for this design change.

### CP-VISUAL-101 — Keep the celestial layer populated without location

- Date: 2026-09-08 (Asia/Kolkata).
- Fixed the Moon’s orbital-node conversion before RA/Dec projection and added an immediate approximate equatorial fallback observer. Granted device location now replaces that fallback when available, so a denied, unavailable, or insecure-context geolocation request no longer leaves the celestial layer empty.
- The altitude gate remains physically honest: the Moon and named objects are hidden when genuinely below the visible horizon. The fallback is continuity presentation only and is marked internally as approximate.
- Rotated delivery identifiers to `app.js?v=2.59` and shell cache `chakra-v5.144`.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Device location permission and Moon visibility remain open for manual confirmation.

### CP-UX-102 — Four-tap reveal for Intimate Service in Lobby

- Date: 2026-09-08 (Asia/Kolkata).
- The Lobby’s Intimate Service section is blurred and its controls are disabled on each page load. A visible section-local reveal control requires four deliberate taps; progress text appears after each tap and the section then becomes usable.
- Existing stored Intimate Service selections are cleared at initialization so stale localStorage cannot bypass the reveal gate. Other Lobby experience controls are unchanged.
- Added localized reveal/progress copy for English, Malayalam, Russian, and Hindi. Rotated delivery identifiers to `app.js?v=2.60` and shell cache `chakra-v5.145`.
- Validation required: focused Yoga/Intimate Service contract, visual/video/splash contracts, JavaScript/service-worker syntax, and `git diff --check`. No commit or push was performed for this UX change.

### CP-UX-104 — Hide the Intimate Service reveal affordance

- Date: 2026-09-08 (Asia/Kolkata).
- Removed the visible four-tap reveal button and progress copy. The blurred Intimate Service section in the Lobby is now itself the mystery tap target; four taps on the section unlock its controls.
- Applied the blur to the complete section container so its border/corners are softened as well as its contents. Inner controls remain pointer-disabled while locked, allowing taps to land on the section without accidental activation.
- Removed the stale button reference from the unlock handler. Rotated delivery identifiers to `app.js?v=2.62` and shell cache `chakra-v5.147`; no commit or push was performed.
- Validation required: focused Yoga/Intimate Service contract, visual/video/splash contracts, JavaScript/service-worker syntax, and `git diff --check`.

### CP-VISUAL-096 — Correct Moon transparency and planetary scale

- Date: 2026-09-08 (Asia/Kolkata).
- Corrected the Moon phase renderer so the transparent cutout is slightly larger than the lit disc and has shadow disabled during erasure. The unlit side now reveals the underlying sky without a visible dark lower rim or overlay disc.
- Reworked planet sizing around apparent angular diameters as seen from Earth: the Moon is the 26px reference disc, Jupiter is the largest planet point, and Venus/Mars/Saturn remain appropriately small. Added soft radial highlight-to-limb gradients and a subtle Saturn ring.
- Rotated delivery identifiers to `app.js?v=2.55` and shell cache `chakra-v5.139`.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Target-device rendering remains open for manual confirmation.

### CP-VISUAL-097 — Correct Moon phase visibility and celestial glow

- Date: 2026-09-08 (Asia/Kolkata).
- Corrected Moon illumination to use the 29.530588853-day synodic cycle from a known new-moon reference instead of deriving phase from right ascension. The transparent cutout is now geometrically bounded so it cannot erase the entire lit disc from rounding or coordinate errors.
- Added soft radial halos for the Moon, planets, and named bright stars. The halos use each object’s colour temperature and remain small enough to identify the body without turning it into a flat overlay.
- Rotated delivery identifiers to `app.js?v=2.56` and shell cache `chakra-v5.140`.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Target-device Moon/planet appearance remains open for manual confirmation.

### CP-VISUAL-098 — Composite the Moon through an offscreen boolean mask

- Date: 2026-09-08 (Asia/Kolkata).
- Replaced visible-canvas Moon subtraction with an offscreen boolean operation: render a whitish shaded lunar disc (A), subtract the unlit shadow disc (B) using `destination-out`, then composite only `A minus B` onto the transparent sky. This prevents the Moon’s glow or surrounding stars from being mistaken for a dark overlay disc.
- The Moon halo remains a separate soft radial glow, and the lunar surface now uses a pale white-to-warm-grey gradient. Planet halos and Earth-relative apparent sizing remain unchanged.
- Rotated delivery identifiers to `app.js?v=2.57` and shell cache `chakra-v5.141`.
- Validation: `npm run test:visual-effect`, `npm run test:journey-video-prelude`, JavaScript/service-worker syntax, and `git diff --check` PASS. Target-device Moon rendering remains open for manual confirmation.

### CP-AUDIT-090 — Read-only resource and requirements audit

- Date: 2026-09-08 (Asia/Kolkata).
- No files were deleted, restored, committed, or pushed. Current live video assets are intentionally limited to `video/generate.mp4` and `video/meditator.png`; `index.html` and the focused test reference `generate.mp4` as the sole prelude source.
- Strong cleanup candidates requiring owner confirmation: `symbols/Paschimottanasana.png` (no live reference found), `cloud-planner-sample.csv` (no live reference found), and generated `playwright-report/` plus `test-results/` (ignored, non-runtime artifacts). `.DS_Store` files are OS metadata, but existing modifications remain unrelated state and must not be removed automatically.
- Protected context: `HANDOFF.md`, `INITIAL-HANDOFF.md`, `Loop/`, `.loop/tracks/premium-script-refinement/`, `.codex/loop-routing/`, `docs/superpowers/`, and the temporary consultation/multilingual architecture notes contain active continuity, requirements, or historical decisions. `audio/BACKUP/` is recovery material; preserve it, including the explicitly noted untracked `audio/BACKUP/background_music.mp3`.
- `docs/dot.json` remains owner-deleted and must not be restored or rewritten. The consultation architecture remains planning-only; couple support, recording/sharing infrastructure, authenticated access, retention automation, and server-side storage are future scope.
- Handoff ordering note: the recent video entries are not strictly chronological (`CP-VIDEO-089` appears before `CP-VIDEO-086`–`088`); preserve the entries and use the latest live source/test state as authoritative until a separate documentation-reordering request is approved.
- Cleanup decision remains pending owner approval. Any deletion should be a separately scoped, reversible pass followed by static tests and `git diff --check`; no merge, deploy, commit, or push is automatic.
