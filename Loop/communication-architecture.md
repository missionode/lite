# Lite browser communication architecture

This document describes the current static PWA. The related [technology profile](./TECH-STACK.md), executable source and [flow atlas](../docs/app-map/index.html) are the references for changes.

## Runtime relationships

```text
Browser interface
  -> app controller and focused module APIs
     -> journey state, stage routing and UI updates
     -> JSON content, language, timing and media fetches
     -> Web Audio / media playback
     -> Piper lifecycle -> Web Worker -> local ONNX/WASM synthesis
     -> browser settings and assessment storage

Service worker
  -> intercepts eligible asset requests
  -> versioned Cache Storage and network fetches
```

The application calls browser modules directly. There is no central server message hub or application API gateway. Most extracted modules expose named browser APIs; the selected-practice loader injects scripts only when required and reuses an in-flight load.

## Boundaries and owners

| Boundary | Responsibility | Source |
| --- | --- | --- |
| Interface to journey | Validate Lobby choices before optional video/audio; sequence selected stages; respect cancellation | `app.js`, `modules/journey-routing.js` |
| Selected practice loading | Deduplicate requests, validate registration, clear failed loads for retry; await loading before startup | `modules/practice-module-loader.js` |
| Content loading | Resolve language/custom source, fetch JSON and validate required sections | `modules/content-localization.js`, `modules/journey-content-loader.js` |
| Narration to worker | Queue synthesis requests, track request IDs, handle progress/audio/error replies and cancellation | `modules/piper-lifecycle.js`, `piper-worker.js` |
| Audio output | Decode/play buffers, control gains and effects, preserve fades, retire sources and release resources | `modules/audio-*.js`, `modules/media-lifecycle.js` |
| Settings import/export | Validate and replace only managed settings; preserve the current import/export visibility rules | `modules/settings-backup.js`, `modules/settings-manager-view.js` |
| Assessment | Read local question data, compute results and persist/reset the device-local session | `docs/assesment.html`, `modules/assessment-tournament.js`, `modules/assessment-persistence.js` |
| Offline assets | Cache by resource policy, version app assets and retire obsolete caches | `sw.js` |

## Piper worker messages

The current request types are `warmup`, `synthesize` and `cancel`. Replies include `ready`, `progress`, `audio` and `error`, correlated by `requestId`. The worker imports the local Piper runtime and uses the configured voice definition; a voice change requires worker replacement.

Keep inference out of the service worker. Stop or skip must cancel pending narration, reject stale results at the lifecycle boundary and clean up playback. Do not promise immediate interruption of an in-progress synchronous inference call. Handle worker, model-download and decode failures using the app's existing recovery paths.

## Fetch, cache and navigation

- Built-in scripts, dictionaries, timing, assessment questions, media and optional module scripts are static resources. Preserve relative URLs under GitHub Pages' `/lite/` path.
- The service worker has shell, language and Piper caching rules. Validate every precache URL; a failed required request can reject installation. Model/runtime bytes and app-shell versions must stay compatible.
- Custom JSON/audio URLs depend on browser access and the remote host. Validate imported content and show useful errors; avoid repeated failing requests or uncontrolled retries.
- Settings and assessment data stay in browser storage unless an explicit existing action exports them. Current ephemeral challenge responses are not stored.
- The assessment translation widget and web fonts are external services. A cached shell does not make those services offline.
- The completion flow includes the existing explicit Earn handoff. Follow the current language/eligibility guards in source; this is navigation to a separate application.
- Advanced Features unlock is a local UI state, not server-side authorization.

## Privacy and lifecycle

Deep Secrets has no microphone request or speech recording path. Its narration uses first-person wording and warns that someone in the room may hear. The separate consent-recording proposal remains postponed.

Preserve pause/resume, current-item skip, close, visibility changes, reduced motion and static journey rendering. Bound queues and caches, remove task-owned listeners and timers, and stop/release audio and visual resources when their owner exits. User-facing errors must avoid private content or credentials.

## Checks for a communication change

Use existing tests for routing, practice loading, content validation, Piper lifecycle, cancellation, media cleanup, persistence and settings backup as relevant. Inspect failures and stderr before reporting completion.

HTTP smoke checks can verify asset responses. Browser interaction, service-worker updates, offline reloads and real device playback require matching evidence; Playwright/screenshots remain opt-in. Keep the affected atlas map and source references synchronized. Documentation-only wording changes do not require inventing a new runtime branch.
