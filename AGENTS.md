# Project working agreement

## Automatic project pickup on handoff

At the start of a new task in this repository, after context compaction, or when resuming a handoff:

1. Read the `CURRENT RESUME` block at the top of `HANDOFF.md` before selecting work. It is the active checkpoint; older `NOW`, `NEXT`, `LOCAL` and release entries below the history heading are historical context.
2. Read `Loop/README.md` and follow `Loop/loop.md`, `Loop/EFFICIENT-WORKFLOW.md` and `.loop/workflow.md`. Load the Lite-specific technology/communication guide and affected atlas/track only when relevant. Apply this project profile even if the installed Loop plugin is older.
3. Verify the current repository root, branch, working-tree changes and relevant source before trusting recorded status. Local remote-tracking refs are last-known information until refreshed; permission/network failures are session-specific evidence.
4. Pick up the recorded next action within the owner's existing authorization, unless the newest request changes the task. Do not restart completed checkpoints, ask the user to repeat known requirements, restore intentionally removed files, or interpret a postponed feature as approved.
5. Before handing off, update the same `CURRENT RESUME` block with the objective, completed work, exact next action, relevant files, latest validation and limits, approvals and local-versus-published status. Preserve historical entries below it. Do not create competing current-state documents.

This is context pickup when an assistant session is opened or resumed in this repository. It does not schedule background work or launch a new task by itself.

## Preserve the dynamic sky until its approved redesign relocation

Until the approved Cosmic Observatory redesign is implemented, preserve the current centered Earth reference with five softly merged atmospheric layers (troposphere through exosphere), its clearly visible cool-aqua **26°C comfort theme**, the Sun's soft protective shield ring, Earth-only labeling, text/control-clearance guards, truthful observer coordinates and static journey performance. During that redesign, the owner explicitly permits the main application background to simplify or diverge from these sky requirements to achieve the approved interface. Move the current dynamic observational sky into a dedicated Sky page and add a Settings CTA to it; preserve its astronomy behavior and illustrative atmosphere/Sun treatments there unless the owner changes them again. Keep `earth-atmosphere`, `solar-containment`, Settings navigation and dedicated-sky atlas maps/tests synchronized. The temperature and protection remain illustrative, never physical safety or climate claims.

## Follow the efficient Loop workflow

For meaningful project work, follow `Loop/EFFICIENT-WORKFLOW.md`: bounded context, honest routing evidence, deterministic repeatable checks, behavior-focused tests and concise continuity. Keep required atlas updates and approval gates. This project-local companion applies even when the installed Loop plugin is older. Recommendations/`PLANNED` routing results do not switch the active model; use direct execution when a separate run adds no value.

## Keep the flow atlas synchronized

The owner has designated `docs/app-map/index.html` as the project's shared visual reference. Every feature addition, removal, or behavior-changing fix must update the affected flow maps in the same change. This applies to user navigation, journey stages, options, audio/narration, persistence, supporting pages, and failure or cancellation paths.

- Inspect the relevant atlas maps before changing behavior.
- Update `docs/app-map/atlas-data.mjs` to describe the implemented behavior, including changed branches, guards, exits, and defaults. Add maps when an existing map cannot clearly represent a new flow.
- Keep the diagrams faithful to executable behavior. Record proposed behavior separately in `docs/app-map/FIX-QUEUE.md`; do not present planned work as delivered.
- Regenerate the atlas and references with `node docs/app-map/build-atlas.mjs`. Refresh affected source references and baseline metadata accurately; label uncommitted changes as such rather than attributing them to an earlier commit.
- Verify the affected app behavior and the updated diagrams. Use `node docs/app-map/verify-atlas.mjs` when changing graph structure or the atlas interface; keep its assertions consistent if the map count changes.
- Update the fix queue and relevant handoff documentation when a tracked fix is completed.
- In the final handoff, identify the affected maps and distinguish source review, automated tests, and device/playback evidence.

For a change that does not affect flows, confirm that the atlas remains accurate; do not invent a flow change merely to edit a diagram. Feature work is not complete while its corresponding map is stale. If source and map disagree, inspect the implementation and reconcile them explicitly.

## Route model intensity automatically

Use the local Loop model router for meaningful project work. The default route is `--task-class auto`, which classifies the bounded task from the actual prompt and selects the least-cost capable Codex model and reasoning effort from `Loop/config/model-routing.json`.

- Preserve an explicit user-selected model or reasoning level.
- Route small searches, formatting, and status checks to the light lane.
- Route isolated wording, label, opacity, color, and one-file edits to the focused lane.
- Route normal implementation, debugging, tests, and project analysis to the standard lane.
- Route architecture, root-cause diagnosis, research synthesis, complex refactors, and performance work to the reasoning lane.
- Route whole-app mapping, broad audits, and near-context-limit reviews to the large-context lane.
- Route browser, responsive, visual layout, canvas, WebGL, and animation verification to the browser lane; browser testing still remains opt-in under Loop policy.
- Route production pushes, releases, security, privacy, auth, migrations, destructive recovery, payment, legal, medical, or financial-impact work to the high-risk lane.

The router may launch model-specific child Codex runs only through `Loop/scripts/codex_model_router.py`; it must not rewrite global Codex settings. Record routing outcomes under `.codex/loop-routing/` when automatic dispatch actually runs. If automatic switching is unavailable, report the recommended model and effort instead of claiming the active model changed.
