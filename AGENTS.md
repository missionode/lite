# Project working agreement

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
