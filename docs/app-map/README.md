# Chakra Meditation flow atlas

Open [index.html](./index.html) in a browser. It is self-contained and needs no server or internet connection.

- 24 selectable maps covering navigation, journey branches, live controls, supporting pages and runtime services.
- Select any step to inspect its behavior and incoming/outgoing connections.
- Numbered arrows correspond to the expandable connection list.
- Save the current map as SVG, or use Print / Save all as PDF to print the entire atlas.
- [Written flow reference](./FLOW-REFERENCE.md) includes Mermaid diagrams and detailed step descriptions.
- [Control inventory](./CONTROL-INVENTORY.md) covers static controls plus notes on generated UI.
- [Fix queue](./FIX-QUEUE.md) records findings and a proposed incremental repair sequence.
- [Structured atlas data](./atlas.json) supports later maintenance and reuse.

## Evidence

Source baseline: production commit `6a0ee84` plus the uncommitted natural-sky update, 2026-09-08. The visuals map describes the new cached renderer, motion lifecycle, lunar texture and illustrative star field. New sky behavior has static/unit evidence; browser preview was declined. This atlas captures source-identified branches and explicitly labels uncertainty; it is not an exhaustive runtime-state proof. Independent settings combine with journey flows rather than appearing as thousands of duplicated diagrams.

The atlas itself is browser-checked for all maps and node selections, diagram label bounds, keyboard selection, mobile page overflow, print construction and SVG download. Application playback, audibility and mobile lifecycle behavior were not tested during mapping.

## Maintenance

Owner agreement: every feature or behavior change updates its corresponding flow map in the same change. The atlas is the shared visual reference for current behavior; proposed changes remain in the fix queue until implemented. See the repository's AGENTS.md for the working agreement.

Edit atlas-data.mjs for graph content and atlas-template.html for presentation. Run `node docs/app-map/build-atlas.mjs` from the project root to regenerate the HTML, JSON, Mermaid reference and control inventory. Run `node docs/app-map/verify-atlas.mjs` to check the atlas in a local headless browser. The verifier inspects the documentation only; it does not start the meditation app.

After application changes, update the snapshot and affected source references. Keep the map of current behavior separate from proposed changes in the fix queue.
