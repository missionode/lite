# Temporary Consultation and Consent Architecture — Open Items

## Reconciliation status — 2026-08-09

The implemented single-participant consultation slice was compared with this plan after the full Playwright run. The completed items have been removed from this temporary checklist. The current app supports the local consultation flow:

- Consent-recorded consultations own chakra timing until the guide explicitly ends and resets the client session. Chakra focus customizes independent 1–7 minute timings without replacing the active journey list; the Meditation Room shows the active schedule and uses its sum for the session estimate.

```text
Settings → Consultation intake → Guide Review → Consent prompter → Lobby → Meditation
```

The app now covers contact identity fields, independent meditation/display languages, required intake validation, three-question chakra reflections with bounded adaptive timing, Yoga and care dependencies, voice preference, safety routing, Sleep Mode/Savasana behavior, HRIM/Music Only/Reverse Journey ownership, detailed Guide Review with highlighted safety rows and persistent guide notes, reusable A4 print/PDF output, local consent-prompter controls, and the existing return-to-Lobby handoff.

Playwright result: **34 passed** using `timingProfile=fast-test`, including the plan-first consent composition, reading lead-in, privacy allowlist, preview sequence, and retry flow.

Static checks: `node --check app.js`, JSON parsing for runtime manifests/configuration, and `git diff --check` all pass.

## Still open before production consent/sharing

- [ ] Replace browser-local recording with authenticated storage and access control.
- [ ] Implement authorized client-copy/video sharing; do not expose recordings through public URLs.
- [ ] Add retention, deletion/withdrawal handling, consent-version history, and access/download audit logs.
- [ ] Complete privacy/security and jurisdictional review for identifiable recordings and sensitive intake data.
- [ ] Validate real camera/microphone permission, MediaRecorder output, pause/stop/retry behavior, mobile rotation, and low-memory behavior on representative devices. The repository Playwright run cannot prove real-device media capture.
- [ ] Add production backend/session identity and guide/client authorization. The current plan is local-only.
- [ ] Keep couple/representative-reader support deferred until a separate participant model and mutual-approval flow are designed and tested.

## Test coverage limitations to carry forward

- [ ] Add a supported fake-media fixture or device test for the actual consent recording Blob and preview playback.
- [ ] Add explicit negative validation tests for invalid email/contact values and every required intake field.
- [ ] Add a generated all-combinations test report for every safety answer crossed with Yoga, Bath, Massage, Perineal Care, and Assisted Bathing. Current tests cover the important dependency paths and option matrix, but not the full Cartesian product.
- [ ] Add full Malayalam consent/prompter assertions and native-device Piper playback validation. Current automated checks verify locale switching and script/runtime behavior, not human audio quality.

## Deliberate product boundaries

- HRIM and its daytime safety gate remain Lobby-owned; `timeHighEnergy` is not duplicated in consultation.
- Music Only remains a Lobby mode; Reverse Journey remains in Settings.
- Sleep Mode is collected as a preference but the evening start prompt remains the final runtime authority.
- The first release is single-participant only. Couple approval is not enabled by this checklist.
- The existing local PWA and handoff flow remain the stable core; no framework migration is required for these completed features.

## Closure rule

This file should be removed only after the open production items and the remaining media/combination test gaps are either implemented and verified or explicitly moved into a maintained release roadmap. Until then, it is intentionally retained as an open-work record rather than marked complete.
### Latest implementation checkpoint — 2026-08-10

- [x] Country-select citizenship with editable automatic dial-code prefills.
- [x] Required email/client-phone validation and optional emergency-phone validation.
- [x] Mobile consultation-card horizontal inset and focused Playwright verification.
- [x] Grounding/reconnection question with Guide Review recommendation and explicit Reverse Journey approval.
