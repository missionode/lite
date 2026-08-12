# Pro Consultation Branch Status

## Decision

`pro-consultation` is a preserved research and future-development branch. Its consultation, consent-recording, teleprompter, client-verification, and individual chakra-timing features are intentionally **not approved for the current production release**.

The stable production branch remains `production` at commit `969ff2e`.

## Preserved checkpoint

- Branch: `pro-consultation`
- Production base: `969ff2e`
- Last product-feature commit before this status record: `9520b94`
- Difference from production: 12 product commits
- Release decision date: 2026-08-12
- Decision: retain for future evaluation; do not merge into `production`

The annotated Git tags created for recovery are:

- `stable-production-2026-08-12` — the approved production baseline
- `research-pro-consultation-2026-08-12` — this preserved research checkpoint

## Why it is not being released

The branch implements a substantially more advanced facilitator workflow than the currently approved product. Releasing it now would introduce consultation planning, recorded consent evidence, camera/teleprompter behavior, native recording sharing, client-specific chakra schedules, and associated privacy/device responsibilities before the product and operational processes are ready.

## Known release gates

- Resolve and validate the reported journey-start issue where neither narration nor background music is audible after starting a consultation-backed session.
- Complete representative-device testing for camera, microphone, recording codecs, orientation, memory, thermal behavior, playback, and native sharing.
- Confirm privacy, consent-record retention, deletion, access, and client-delivery policies before production use.
- Review the full consultation and consent language with the appropriate professional stakeholders.
- Reconcile this future workflow with the production roadmap and decide which capabilities should ship together or in smaller stages.
- Run the complete regression suite and a real-device release checklist after any future rebase or production integration.

## Safe continuation procedure

1. Keep `production` as the deployment/default release branch.
2. Resume future work from `pro-consultation` or from the research recovery tag.
3. Read `HANDOFF.md`, `TECH-STACK.md`, and the temporary consultation/consent architecture documents before changing behavior.
4. Do not merge the branch wholesale without a fresh product-scope review.
5. Prefer extracting approved capabilities into focused branches and pull requests when production adoption begins.
6. Preserve feature-level commits and update this status document when the release decision changes.

## Recovery commands

```sh
git fetch origin --tags
git switch pro-consultation
```

To inspect the frozen research checkpoint without moving the branch:

```sh
git switch --detach research-pro-consultation-2026-08-12
```

To return to the stable production baseline:

```sh
git switch production
```
