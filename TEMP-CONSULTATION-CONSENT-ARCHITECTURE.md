# Temporary Consultation and Consent Architecture Plan

## Status

Planning only. No consultation, recording, sharing, or modularization implementation has started.

## Product direction

Add a decoupled Pre-Session Consultation flow between the guide/client intake and the existing Lobby. The current meditation flow remains available for trusted returning clients.

Proposed paths:

```text
Regular returning client:
Settings → Lobby → Meditation

Consultation client:
Guided intake → Session plan → Client review → Consent prompter/recording → Shared client copy → Lobby → Meditation
```

The consultation is a wellness intake and informed-consent workflow, not a medical diagnosis unless it is operated by an appropriately qualified healthcare professional under the required governance.

## Consent prompter requirements

- Show the consent text in a readable, large-type prompter.
- Provide a short preparation countdown before recording begins.
- Allow the client to read while recording.
- Support pause, retry, discard, preview, and final submit.
- A retry must delete or mark the previous attempt as uncommitted.
- Do not treat an incomplete recording as consent.
- Capture timestamp, timezone, consent-version, client/session ID, and guide ID.
- Keep session participation consent separate from video-recording/sharing consent.
- Show the exact final session plan before the client records consent.

Suggested spoken consent:

> I have reviewed my preferences and the proposed session plan. I understand that this is a guided wellness experience, not medical treatment. I agree to participate, and I understand that I may pause, change, or stop the session at any time.

Suggested separate recording consent:

> I consent to this confirmation being recorded and shared with me as a copy of my session agreement. I understand who may access it, how long it will be retained, and how I can request deletion or withdrawal.

## Couple/session-group support

- The session plan must contain participants, not only one client record.
- Each adult participant should be identified in the final summary.
- The prompter should support speaker labels: Participant 1, Participant 2, or Guide.
- Both adults should appear in the recording when the recording is intended to confirm both people’s participation.
- One adult should not be assumed to consent for another adult without clear authority or an explicit product policy.
- If one person reads on behalf of the group, the video should still show each participant’s separate confirmation or record the authorized representative relationship.
- Each participant needs their own preference, trigger, limitation, and consent state; couple-level preferences must not overwrite individual safety preferences.

## Intake data model

Separate the data into three scopes:

### Client profile

Name, preferred language, contact, meditation experience, long-term audio preferences, and accessibility preferences.

### Session safety check

Current physical/mental state, movement limitations, discomfort, audio or imagery triggers, driving/exercise plans, and activities to avoid.

Medication information should be minimized. Prefer asking whether anything affects alertness, movement, breathing, balance, or participation unless a more detailed record is genuinely necessary.

### Session plan and consent

Selected mode, selected stages, durations, voice/audio profile, excluded content, guide review, client confirmations, consent version, timestamp, and recording reference.

The final approved plan must be stored as a snapshot. The meditation should run from that snapshot rather than reading mutable form fields during the journey.

## Sharing model

Preferred default: share a secure client copy of the final summary and consent record. Do not expose raw form data or video through a public URL.

If video is retained:

- show recording purpose, audience, retention period, and deletion process before recording;
- allow preview and re-recording;
- keep sensitive fields such as medication and emergency contacts out of the spoken video unless strictly necessary;
- use encrypted storage and authenticated access;
- record access and download events;
- provide withdrawal/deletion handling;
- do not make video consent a hidden condition for receiving the meditation unless there is a documented reason and an equivalent alternative.

Health and mental-health information and identifiable recordings require stronger privacy controls. Jurisdiction-specific legal review is required before production deployment.

## Modularization recommendation

Modularization is recommended because the current `app.js` combines state, localStorage, UI, audio, Piper, journey sequencing, and event wiring in one file. The consultation feature would otherwise increase coupling and regression risk.

Use incremental domain modules while retaining the current static PWA architecture:

```text
src/
  core/
    state.js
    storage.js
    timing.js
    events.js
  consultation/
    schema.js
    intake-controller.js
    session-plan.js
    consent-prompter.js
    recording.js
    participant-model.js
    sharing.js
  journey/
    meditation-controller.js
    journey-options.js
  audio/
    audio-engine.js
    piper-tts.js
    voice-profiles.js
  ui/
    screens.js
    localization.js
    controls.js
```

Do not migrate to React, Tailwind, or a build framework solely for this feature. First establish stable module boundaries and tests. A build pipeline can be considered later if the consultation workflow requires code splitting, authenticated APIs, or a larger component system.

## Architecture boundary

The existing local-only PWA can support a local prototype of the form, prompter, retry, session-plan hydration, and Lobby handoff. It is not sufficient for safe multi-device video sharing or guide/client access control.

Production video sharing requires a backend or managed secure storage layer with authentication, authorization, encrypted object storage, retention/deletion jobs, audit logs, and a clear data-residency/privacy policy.

## Required test matrix before implementation is complete

- single participant, regular journey;
- single participant, HRIM journey;
- returning client bypasses consultation;
- consultation settings hydrate the Lobby correctly;
- retry removes the uncommitted recording;
- cancel leaves the existing meditation flow unchanged;
- incomplete consent cannot start the session;
- single participant only for the first release;
- couple/representative-reader scenarios are deferred and must not be enabled by the first release;
- video copy is available only to authorized recipients;
- pause, stop, reload, and permission-denied recording paths;
- Malayalam and English prompter/consent content;
- mobile camera/microphone permissions and screen rotation.

## Decision awaiting implementation

Proceed with incremental modularization and a decoupled consultation feature. Preserve the current Lobby and meditation journey as the stable core, and introduce the consultation flow through a versioned session-plan contract.

## Initial reverse-engineered tone mapping proposal

The existing application already exposes the relevant controls through `state`, Settings, and the Journey Tuning mixer. The consultation should produce normalized answers and pass them through a mapping adapter rather than writing individual `localStorage` keys directly.

Form answer:

```text
Soft, whisper-like, and highly gentle
```

Proposed session-plan result:

```text
voicePreset: soft
voiceWarmth: 65
voiceClarity: 35
voicePace: 0.90
voiceSpace: Temple Air (current regular journey profile)
audioFilters: true, only when explicitly confirmed
eyesCloseMode: true, only when explicitly confirmed
```

Form answer:

```text
Deep, resonant, and steady
```

Proposed session-plan result:

```text
voicePreset: deep (new consultation preset; do not silently reuse Balanced)
voiceWarmth: approximately 70
voiceClarity: approximately 40
voicePace: approximately 0.95
voiceSpace: Soft Room
audioFilters: true, only when explicitly confirmed
eyesCloseMode: true, only when explicitly confirmed
```

Form answer:

```text
I have no preference; I easily adapt to the guide's rhythm
```

Proposed session-plan result:

```text
voicePreset: guide/default
preserve existing guide-selected profile
do not enable audio filters or Eyes Close Mode automatically
```

The final form should use a single-choice tone field. Audio Filters and Eyes Close Mode should be separate explicit confirmations, even if the guide’s current manual practice usually enables them for Soft or Deep preferences. The client must see the resulting settings in the final session summary before consent.

Every applied setting should record its source:

```text
source: client_preference | guide_default | guide_override | system_safety
```

This preserves transparency when a guide changes a setting after the form is completed.

## Missing consultation additions found from the current app

The original form covers personal context, audio tone, goals, injuries, triggers, activity after the session, and medication-related safety. It does not yet capture all current application controls.

### Essential additions

- **Meditation language**: English or Malayalam narration.
- **Display language**: language the client wants to read on screen; this can differ from narration language.
- **Narration voice**: selected Piper voice or guide-selected voice, followed by a preview confirmation.
- **Mantra preference**: mantra on/off, and whether the client prefers it as a background layer or not at all.
- **Audio sensitivity details**: voice, music, drone, bell, mantra, and background-music comfort.
- **Visual preference**: open eyes, eyes-closed guidance, reduced brightness, or no visual imagery.
- **Spiritual imagery preference**: chakras, deities, moon imagery, ocean imagery, frequencies, or secular wording.
- **Journey mode**: Regular Meditation, High Energy/Hreem, or Music Only.
- **Returning Journey**: whether the timeless sea opening should be used.
- **Desired session duration**: target duration and whether the guide may shorten or extend within safe limits.

### Journey composition additions

- **Chakra selection**: Root, Sacral, Solar, Heart, Throat, Third Eye, and Crown. Third Eye and Crown are currently structurally retained as closing centers.
- **Journey direction**: standard or Reverse Journey.
- **Box Meditation**: enabled, disabled, or guide-approved only.
- **Ho'oponopono**: enabled, disabled, or guide-approved only.
- **Chakra Frequencies/Solfeggio**: active or inactive.
- **Yoga Bridge**: enabled or disabled.
- **Yoga pose selection**: Vrikshasana, Downward Dog, Marjaryasana, Balasana, and Ananda Balasana.
- **Corpse Pose/Savasana**: enabled or disabled.
- **Bath Session**: enabled or disabled.
- **Bath add-ons**: Massage, Perineal Care, Assisted Bathing.
- **Consent for touch or assistance**: separate from general session consent.
- **Presiding imagery**: None, Shakti, or Shiva.

### Timing additions

The form should not expose every technical slider by default. It should collect a target duration and allow the guide to confirm the detailed plan. The plan may contain:

- Arriving/icebreaker duration;
- Box Breathing step duration;
- Core practice duration per chakra;
- HRIM duration, subject to the existing 3:30 AM–12:00 PM gate;
- Intervals between chakras;
- Corpse Pose duration;
- Yoga preparation and per-pose duration;
- Bath, Perineal Care, Assisted Bathing, and Massage durations.

### Generated confirmation fields

The app should calculate and show these rather than ask the client to enter them:

- final journey roadmap;
- exact stage order;
- estimated total duration;
- selected voice profile;
- activated audio/visual filters;
- excluded content;
- touch/assistance status;
- Sleep Mode decision when the journey begins in the evening;
- HRIM availability result when High Energy is selected.

### Guide-only fields

These should not be changed directly by the client without guide review:

- final yoga pose suitability;
- bath/massage/assisted-care approval;
- timing override;
- whether a client’s answer requires a modified session;
- guide notes;
- escalation or stop recommendation.

### Existing controls that should remain outside consultation

- custom script upload or URL loading;
- service-worker/cache behavior;
- Piper model registry details;
- technical audio-engine settings;
- developer timing profile;
- raw localStorage values.

The consultation should map to the user-facing session plan, not expose implementation details.

## Second-pass gap audit

The following items are still missing or need explicit conditional handling before implementation:

### Missing client questions

- **Age/eligibility and capacity**: confirm adult/minor status and guardian process where applicable; citizenship alone is not an eligibility or consent check.
- **Accessibility**: hearing, vision, language literacy, mobility aids, seated/standing/lying preference, and whether the client needs the guide to repeat or simplify instructions.
- **Session setting**: in-person or remote, private space, headphones/speaker, who else is present, and whether a helper is present.
- **Emergency-contact relationship and permitted use**: emergency contact alone is not enough; record when the guide may contact them.
- **Physical care details**: water-temperature comfort, slip/fall concerns, skin sensitivity/allergy concerns, areas to avoid during massage, preferred pressure, and a stop signal.
- **Emotional intensity**: whether the client wants gentle reflection, moderate emotional work, or minimal introspection.
- **Post-session readiness**: whether the client needs to drive, work, sleep, exercise, or interact socially immediately afterward.
- **Data permissions**: permission to store intake answers, permission to share the summary/video, authorized recipients, retention preference, and withdrawal/deletion request path.
- **Couple/participant identity**: each participant’s name, individual answers, individual consent, and whether one person is an authorized representative.

### Conditional rules that must be enforced

- If the client declines all touch or assistance, automatically disable Massage, Perineal Care, and Assisted Bathing.
- Standard Bath may remain available only when the client explicitly accepts self-directed bathing.
- Perineal Care requires its own explicit opt-in and privacy/stop confirmation.
- Massage requires its own opt-in, pressure preference, areas-to-avoid answer, and stop signal.
- Assisted Bathing requires helper identity/role, privacy confirmation, and an agreed communication method.
- Any bath add-on requires `Yoga Bridge = on` and `Bath Session = on` because of the current app dependency.
- Assisted Bathing replaces Standard Bath; it must never run alongside Standard Bath.
- Current stage order is `Massage → Perineal Care → Assisted Bathing OR Standard Bath → Yoga → Crown`.
- High Energy/Hreem must hide or clear regular-only choices: chakra selection, Yoga Bridge, Box Meditation, Corpse Pose, Ho’oponopono, and Returning Journey.
- Music Only must hide or clear guided narration choices, chakra options, HRIM, Yoga, Bath, and guided practices.
- Reverse Journey and Yoga Bridge are currently mutually exclusive; the form must explain this before either option is approved.
- Third Eye and Crown are structurally retained even when the client selects a partial chakra journey; the summary must explain this.
- Sleep Mode cannot be finalized during an earlier consultation because it is offered at journey start after 6 PM; the final plan must show it as pending until start.
- HRIM availability is a system rule from 3:30 AM to 12:00 PM and must be rechecked at start, even if the consultation was completed earlier.
- Any guide override must appear in the final summary and be separately acknowledged when it changes a client preference.

### Flow-state gaps

The consultation needs explicit states for draft, autosaved, guide-review, client-review, recording, paused, retry, submitted, expired, cancelled, and superseded. A partially completed form or failed video must never hydrate the meditation settings.

The session plan should also have a version and expiry time. If the guide changes the plan after consent, the client must review and confirm the new version before starting.

## Final experience ownership and adaptive timing decisions

The following decisions are authoritative and supersede the earlier exploratory notes in this document.

- **High Energy/Hreem** remains a separate Experience Mode in the Lobby. The consultation may collect the client’s desired outcome and energy preference, but it does not own HRIM selection or duration. The Lobby’s `timeHighEnergy` control and the existing 3:30 AM–12:00 PM system gate remain authoritative.
- **Music Only** remains a separate Lobby Experience Mode. It should not be forced through the guided consultation path; the consultation may record it as a recommendation or client preference for the guide to review.
- **Reverse Journey** remains in Settings as it is today. The consultation should not silently change it. If the guide wants the form to preserve the current choice, the session plan should record the existing Settings value as `guide/current-setting`, not as a new client selection.
- **Sleep Mode** is collected as a consultation preference (`needed`, `not needed`, or `guide to decide`) and shown to the guide before the Lobby. The existing evening prompt and runtime behavior remain authoritative; consultation data must not bypass that prompt.

### Final ownership clarification

- HRIM selection and `timeHighEnergy` remain entirely in the Lobby Experience Mode. The guide may review the consultation’s desired outcome, but the duration control stays in the Lobby and is not duplicated in the consultation form.
- The consultation should ask only for a sleep-support preference: `needed`, `not needed`, or `guide to decide`. The guide can review this before the client enters the Lobby. The existing evening Sleep Mode prompt and time behavior remain the final runtime authority.
- Yoga Bridge should not automatically disable Sleep Mode merely because Yoga is enabled. The guide should decide based on the selected yoga poses and whether the planned session is restorative or energizing. If the product later requires a strict Yoga/Sleep exclusion, that should be a separate explicit rule and user-facing explanation.
- The first implementation is single-participant only. Couple participants, mutual approval, representative reading, and participant-specific plan merging are deferred to a later phase after the single-client flow is stable. The couple rules remain documented as future architecture, not current scope.

## Adaptive per-chakra timing

The consultation may ask a short, non-clinical question for each selected chakra. Use experiential language rather than treating chakra strength as a medical or objective measurement.

Suggested prompts:

- Root: “How supported and steady do you feel right now?”
- Sacral: “How satisfied do you feel with your creativity, emotional flow, and enjoyment today?”
- Solar: “How confident and ready to take purposeful action do you feel?”
- Heart: “How connected and compassionate do you feel toward yourself and others?”
- Throat: “How freely and clearly are you able to express what matters?”
- Third Eye: “How clear and focused does your inner direction feel?”
- Crown: “How connected to meaning, perspective, or stillness do you feel?”

Use a small scale such as `low support`, `mixed`, and `strong support`, followed by an optional “I would like more attention here” choice. Lower support or an explicit request for attention can receive more time; strong support can receive less time without being removed.

The timing engine should use a fixed total practice budget and bounded weights, for example:

```text
chakraDurations = baseDuration × boundedFocusWeight
sum(chakraDurations) ≤ approvedCorePracticeBudget
minimumPerSelectedChakra ≤ duration ≤ maximumPerSelectedChakra
```

The current shared `timePerChakra` slider remains the fallback when no consultation plan exists. A consultation plan should add a `chakraDurations` map and show the allocation in the final review. The guide can override the allocation, and every override must be visible to the client.

Do not label a chakra as “weak” or “blocked” based only on a self-report. Use “more attention requested” and “already supported” to preserve client dignity and avoid diagnostic interpretation.

## First implementation boundary and readiness

- The Lobby now contains the consultation entry CTA. It is intentionally a non-mutating placeholder until the consultation screen/state machine is implemented; the existing Begin Journey and Settings actions remain unchanged.
- First implementation is single-participant consultation only.
- HRIM and Music Only remain Lobby modes; Reverse Journey remains in Settings.
- Sleep preference is captured in consultation, but the evening runtime prompt remains the final authority.
- Yoga and Sleep Mode are compatible; the guide reviews whether the selected Yoga plan is restorative or energizing.
- Couple support, video-sharing infrastructure hardening, authenticated access, retention automation, and server-side storage are future phases.
- Implementation can begin once the form schema, versioned `sessionPlan` contract, recording state machine, and browser test fixtures are approved. No production consultation code has been started yet.

## Couple mutual approval

For every optional shared feature, enable it only when both participants explicitly approve it:

```text
featureEnabled = participantA.approved && participantB.approved
```

If either participant declines Massage, Perineal Care, Assisted Bathing, Ho’oponopono, eyes-closed guidance, or another shared-sensitive feature, that feature is removed from the couple session plan. Record the decline privately without exposing one participant’s reason to the other unless they choose to share it.

For shared audio and timing preferences that differ, use the more conservative setting or ask the guide to propose a compromise. Do not silently choose the more intense option.
