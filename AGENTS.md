# Project working agreement

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
