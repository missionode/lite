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

## Automatic execution modes

Loop selects the least expensive safe mode from the bounded task after reading the active handoff and affected atlas map. The user does not need to select a mode manually.

| Mode | Automatic trigger | Execution |
|---|---|---|
| **Caveman** | Clear, low-risk lookup or tiny one-file text/style/documentation correction with a deterministic check | One direct agent, minimal files, no worktree, no sub-agent, no broad scan, smallest relevant check and concise result. Escalate immediately if scope expands. |
| **Focused** | Small bounded implementation or bug with limited coupling | One direct agent, targeted source/test context and focused validation; use a branch only when isolation adds value. |
| **Isolated autonomy** | Feature, refactor, assessment, performance, audio, persistence, localization or broad visual work | Compact task packet, task worktree/branch, checkpoint loop, two-stage review, atlas/handoff update and PR-ready output. |
| **Ephemeral specialists** | Two or more genuinely independent subtasks where specialist analysis is expected to save more rework than its context cost | The primary agent dispatches the smallest useful number of short-lived sub-agents, validates their output and remains the sole integrator. |
| **High-risk gate** | Merge, production publication, auth/secrets, migration, destructive recovery or another consequential external action | Prepare and validate autonomously, then stop at the required approval boundary. |

Mode selection is automatic and may escalate when evidence reveals more coupling or risk. De-escalation is allowed at a clean checkpoint. The selected mode, actual routing evidence and reason are recorded; a planned recommendation is never reported as an executed switch.

## AST repository mapping

- Before substantial implementation, build a task-scoped syntax-aware map of the affected entry points, exported symbols, callers, imports, state owners, event handlers, tests and atlas nodes. Prefer an available language parser or AST index; use bounded textual fallback only when parser support is unavailable and label that limitation.
- Map only the dependency neighborhood needed for the checkpoint. Do not load or serialize the whole repository merely because an AST tool can do so.
- Treat the map as navigation evidence, not source truth. Verify every intended edit against current source and refresh the affected portion after structural changes.
- Keep ephemeral machine indexes outside commits. Preserve only the concise ownership/dependency findings needed in the track, handoff or atlas.

## Ephemeral sub-agents and unified diffs

- The primary agent may call short-lived sub-agents automatically when the task has independent ownership boundaries or needs a distinct specialist review. Caveman Mode never dispatches a sub-agent.
- Each sub-agent receives a minimal immutable packet: objective, allowed files, relevant symbols, invariants, expected tests and forbidden actions. It may not recursively dispatch, merge, push, deploy or broaden scope.
- Prefer sub-agent output as a unified diff plus concise rationale, tests proposed/run, assumptions and risks. A read-only reviewer returns findings with exact paths/lines instead of rewriting files.
- The primary agent inspects the current source, validates and applies accepted diff hunks. Sub-agent output is advisory and never proves completion by itself.
- End the sub-agent after its bounded response. Do not preserve a long-running parallel chat or repeatedly resend full project history.

## Chat history and session resets

- Reset at natural boundaries: completed checkpoint, major feature transition, context saturation or a materially different task. Do not reset in the middle of an unresolved edit/test cycle.
- Before reset, write a compact resume packet containing baseline commit, objective, decisions, invariants, owned files/symbols, completed evidence, unresolved risks and exact next command/action.
- Start the next bounded task as a fresh session when possible. Do not fork a long conversation merely to save tokens because a fork retains its history.
- Durable truth remains in source, track, atlas, handoff and Git—not private chat memory. Never discard unresolved approvals, failures or recovery information during reset.

## Automatic model tiering

- Route each bounded task through `Loop/scripts/codex_model_router.py --task-class auto` when a separate run adds value. Wrap the concise classification objective in `[LOOP_CLASSIFY]...[/LOOP_CLASSIFY]`; keep permissions and forbidden-action constraints outside that slice so words such as “do not delete” cannot falsely select the high-risk lane. The complete packet still reaches the child. Choose the least-cost healthy tier that satisfies context, reasoning, browser, safety and modality needs.
- Caveman and simple focused work use the lightest capable tier. Normal implementation uses the standard tier; architecture/root-cause/performance work uses reasoning; repository-wide mapping uses large-context; browser/visual validation uses browser; releases and consequential actions use high-risk.
- Use a self-contained fresh child for compact independent work. Use retained history only when the task truly depends on it. Never recursively route an already routed child.
- Record recommended versus actually executed model and effort. If automatic dispatch is unavailable, continue safely with the active model or request a human switch when capability is essential; never claim a switch that did not occur.

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
- Produce bounded unified diffs and summaries rather than replaying entire files between agents. Reset sessions only after a durable resume packet exists.

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
