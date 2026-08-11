# Temporary Consent Video Composition Plan

## Objective

Create a readable, timestamped consent recording that presents the approved session plan before the client reads the consent prompt, then composes the prompt and the client's circular face video into one Gmail-compatible export.

## Current scope

- [x] Render the approved session plan as a pre-roll frame.
- [x] Capture the actual recording start date/time and live elapsed time.
- [x] Display the live local wall-clock time derived from the actual recording start, then freeze the final end time into the final video frame.
- [x] Show the consent prompt as the recording background while the client reads.
- [x] Composite the face video as a circular lower-right thumbnail with safe padding.
- [x] Capture end date/time and freeze the final elapsed duration.
- [x] Finish on the consent background after the recording stops.
- [x] Keep the plan pre-roll silent; enable microphone audio exactly when the consent prompt and face thumbnail begin.
- [x] Start the consent wall-clock timer at the same prompt/thumbnail/audio transition, not at the silent pre-roll.
- [x] Use a controlled WebM bitrate and reject files above Gmail's 25 MB attachment limit.
- [x] Add permission-based latitude/longitude metadata, or show Location unavailable.
- [x] Preserve retry/preview behavior and clear composition state on reset.
- [x] Use structured label/value rows, pixel-aware pagination, typography hierarchy, safe all-side padding, and prompt-area space reserved for the face thumbnail.
- [x] Include the approved goal and selected service names/durations in the spoken consent prompt; omit unselected services.
- [x] Make the A4 printable session plan available from every Guide Review page and brand the document header with the uploaded logo.
- [x] Remove the visible Session Plan title, generated date, and app-generated footer from both print variants.
- [x] Add Playwright coverage for the plan-first composition phases, privacy allowlist, reading lead-in, pause/resume, preview sequence, and retry state.
- [ ] Add explicit automated coverage for geolocation denial/fallback metadata.

## Deferred boundary

- [ ] Secure email delivery requires authenticated storage, authorization, retention/deletion controls, and an email provider/backend. The current static PWA must not send sensitive recordings directly from the browser.
- [ ] Real camera/microphone, MediaRecorder codec, mobile memory, and Gmail attachment validation require physical-device testing.

## Design decisions

- Prefer still plan frames/page sections over continuous scrolling because they preserve text clarity and reduce composition complexity.
- The actual media recording clock, based on the recording start timestamp and elapsed monotonic time, is authoritative; interval callbacks only refresh the display.
- Private medication details and emergency-contact details should not be included in a client-facing recording without explicit approval.

## Completion rule

Remove this file only after all local browser-side items are implemented, tested, and documented. Keep the file while secure email delivery and real-device validation remain open.

## 2026-08-11 design reconciliation

- Historical composition: silent, still session-plan pages first; spoken consent prompt second with the timer, microphone audio, and circular lower-right face thumbnail starting together.
- Confirmed final contract: the exported video must always contain the approved session-plan pages first and the spoken consent section last. The plan section is not optional.
- Implemented Consent Confirmation corrections: camera thumbnail above the script, bounded manual scrolling, and inline Continue/Cancel actions.
- The live recording experience remains a full app-viewport selfie camera. After the plan pre-roll and `3–2–1` countdown, consent capture starts with a three-second reading lead before automatic teleprompter scrolling.
- Restored the historical saved-video layout for the spoken section: consent script as the primary surface, circular face thumbnail at the side, synchronized voice/timer, and no microphone audio during plan pages.
- Plan video data now comes from an explicit approved-plan allowlist rather than copying the complete Guide Review DOM. Client contact data, emergency-contact data, medication details, private reflection notes, and guide notes are excluded.
- Review Recording identifies and plays the complete sequence: silent approved-plan pages followed by spoken consent. Retry clears the complete composition state.
- No committed historical implementation can be checked out: these consent iterations exist in the uncommitted working tree and documentation rather than a Git commit after baseline `969ff2e`.
