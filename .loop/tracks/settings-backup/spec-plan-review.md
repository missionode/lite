# CP-SETTINGS-001 — Advanced Settings backup and restore

## Specification

- Status: COMPLETE locally
- Objective: expose a developer-only Settings manager after the existing Advanced Features unlock, able to export and import all persisted Chakra Meditation settings.
- Scope: local `chakra_` preference keys only; versioned JSON export; bounded validated import; explicit replacement confirmation; reload after import; localized UI; flow atlas and regression coverage.
- Exclusions: cloud sync, encryption, credentials, extension/browser storage, session-only mode/Advanced state restoration, automatic remote upload, production publication.
- Acceptance: locked users cannot open or invoke backup operations; valid exports contain only app keys; invalid imports preserve settings; confirmed imports replace only app keys; all supported UI locales have labels.

## Plan and review

1. Add developer-only CTA and separate manager screen — complete.
2. Implement scoped backup schema, local download, validation and confirmed replacement — complete.
3. Add behavior test, synchronize atlas and regenerate references — complete.
4. Review: import is a deliberate destructive preference replacement, so confirmation is required; strict schema/key/value/size limits prevent unrelated storage writes. No network path was added. Direct handlers independently require the in-memory unlock state. — accepted.

## Evidence

- `node tests/settings-backup.test.mjs` — pass.
- 31 applicable app test files — pass. Excluded established `content-safety`/`drone-duration` missing fixture and stale `hindi-language` app-version assertion.
- `node docs/app-map/build-atlas.mjs` — 25 graphs, 230 nodes, 264 edges.
- `node docs/app-map/verify-atlas.mjs` — pass with local headless browser after sandbox permission escalation.
- No device download/import verification or playback evidence.
