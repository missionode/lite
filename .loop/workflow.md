# Lite isolated delivery workflow

Status: APPROVED project default for upcoming work.

## Objective

Use isolated Git worktrees and focused pull requests for substantial, risky, experimental or parallel work while preserving Lite's existing product, localization, audio, performance, sky and flow-atlas requirements. The workflow must reduce re-reading and rework; it must not create a fleet of agents or extra reviews merely to appear thorough.

## Delivery path

```text
approved bounded checkpoint
  -> clean integration baseline and compact task packet
  -> task-specific worktree + branch
  -> implementation with targeted checks
  -> spec-compliance review
  -> quality, performance and risk review
  -> atlas + handoff synchronization
  -> validated checkpoint commit
  -> focused pull request
  -> approved merge into the integration branch
  -> local fast-forward synchronization
  -> combined regression checks
  -> separately approved production publication
```

The integration branch is currently `modularize`. `production` remains the stable release branch. Assessment, remaining modularization and the approved Cosmic Observatory redesign receive separate worktrees and review boundaries.

## When isolation is required

Use one task-specific worktree and branch for:

- features, architecture or modularization checkpoints;
- assessment work, performance work and broad visual redesigns;
- changes spanning shared runtime state, audio, persistence, service workers or multiple languages;
- experiments whose failure should not disturb the integration workspace.

Use direct work on the active branch for a genuinely tiny, isolated documentation, wording or styling correction when worktree and PR overhead would exceed its risk. It still needs the relevant checks, atlas decision and checkpoint record. Do not split one coherent small change into artificial pull requests.

## Token and context efficiency

- Give each sandbox a compact task packet: objective, approved decisions, invariants, affected maps/files, acceptance criteria, baseline revision and exact checks. Do not copy the full conversation.
- Read the active handoff, relevant atlas map and targeted source ranges first. Do not repeatedly scan the whole repository or historical handoff.
- Use one agent/run per checkpoint by default. Parallel work is allowed only for independent ownership with a measurable benefit; count all parent, child, retry and review usage.
- Prefer deterministic scripts and focused diffs over repeated model analysis. Review the changed files and affected flows, then run the broader suite once at the integration gate.
- A new bounded task may receive a compact fresh context. Forking a long conversation is not a token-saving strategy because it retains history.
- Record usage only when host telemetry is available. Never invent token savings or claim that a worktree itself reduces tokens.

## Performance and quality gates

- Capture a clean functional baseline before implementation. For performance-sensitive work, also capture comparable CPU, memory, startup or playback evidence when available.
- Preserve static journey rendering, reduced-motion behavior, audio lifecycle cleanup and the protected Earth atmosphere/Sun shield requirements.
- Avoid persistent background processes, duplicate listeners, unbounded timers, unnecessary animation and eager loading introduced only for development convenience.
- Run targeted checks during implementation. Before PR readiness, run fresh applicable behavior, localization, error-surface, atlas and performance checks.
- Review in two stages: requirements and scope first; maintainability, accessibility, security, performance and regression risk second. Unresolved high-severity findings block merge.
- Browser, device audio and thermal claims require matching evidence; otherwise record them as pending manual verification.

## Ownership and integration safety

- Only one active sandbox may own a shared integration hotspot at a time: `docs/app-map/`, app shell/bootstrap, service worker/cache versioning, shared translations, settings schema or common audio engine.
- Independent sandboxes must declare file ownership before parallel execution. If ownership begins to overlap, serialize the work rather than resolving avoidable conflicts later.
- Never include secrets, `.env` values, local caches, `.DS_Store`, browser state, generated noise or unrelated user changes in commits or pull requests.
- Large binary media changes need an explicit asset review and should not be mixed with unrelated code changes.
- Resolve review fixes in the originating sandbox and re-run affected checks before merge.

## Pull request and merge rules

- A substantial checkpoint becomes PR-ready only after its checkpoint commit, fresh validation, atlas update and concise handoff are complete.
- Keep each PR focused on one checkpoint. Its summary states behavior, preserved requirements, validation evidence, skipped/manual checks, performance impact and rollback boundary.
- Pushing a task branch, opening or merging a PR, synchronizing a remote integration branch, and publishing production remain explicit external-state actions. Follow the current owner authorization and Loop approval gates; never silently deploy.
- After an approved remote PR merge, update the local integration branch with a clean fast-forward synchronization, then run combined regression checks. Do not overwrite unrelated local changes.
- Production merge and deployment are a separate reviewed checkpoint even when the feature PR is green.

## Current sequence

1. Implement and review the standalone assessment in its own sandbox.
2. Resume modularization as bounded sandbox checkpoints, including the deferred loading/performance work.
3. Implement the approved Cosmic Observatory theme in a separate sandbox after both prerequisites.
4. Integrate and release only after combined regression and owner approval.
