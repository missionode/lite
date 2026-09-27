# CP-THEME-PLAN-001 — Cosmic Observatory theme

Status: design direction APPROVED; first Lobby implementation slice delivered locally; remaining theme/Sky work is queued.

## Approved reference and dependency order

Owner-approved desktop/mobile concept: [approved-concept-v1.png](../../../docs/design/lite-cosmic-observatory/approved-concept-v1.png).

The operator assessment and modularization are complete and merged to production (assessment PR #78; modularization PRs #81–82). Before changing the visual theme, complete the UI architecture/componentization checkpoint below. Then implement this theme as a separate visual checkpoint without changing existing feature requirements.

## Pre-redesign checkpoint: CP-THEME-ARCH-001 — UI componentization and repository organization

Status: architecture review complete; no standalone component extraction justified before the redesign. Implement presentational boundaries incrementally as the approved redesign reveals repeated patterns.

### Why this is warranted

- Production baseline `0e46689` has about 86 files directly under `modules/`, `app.js` at 3,412 lines, `index.html` at 821 lines, and a single `style.css` at 2,550 lines. Existing `modules/*view*.js` and selection/navigation modules already separate much UI behavior, but the visual markup and styling are still largely page-wide.
- The approved redesign will alter Lobby, Settings, dialogs, cards, controls and supporting screens together. Repeating visual patterns without clear ownership would increase cross-screen CSS overrides and make later corrections harder.
- This does not justify a framework migration, a wholesale rewrite, or moving every element into a component. The app is a static, offline-capable PWA with Google-Translate use on assessment content and existing global localization/accessibility contracts.

### Inventory findings and pilot decision

- Production source review confirms the architecture split: `index.html` owns the page/screen markup and `style.css` owns presentation, while modules such as `settings-manager-view.js`, `mood-ambience-settings-view.js`, `drone-duration-settings-view.js`, and `range-controls.js` already own selected view bindings/rendering. Keep these behavioral owners; do not wrap them in a second component state layer.
- The proposed low-coupling pilot was the shared modal shell. Source review shows `.modal` and `.modal-content` already provide a shared presentation base for Settings help, the Advanced Features password dialog and completion; their distinct contents and behavior remain with separate owners. A second modal component would duplicate the existing boundary, so no extraction is warranted. The module/view layer already owns selected behavior and rendering concerns.
- Keep HTML statically present and semantic; no runtime fragment fetch or new framework. During redesign, formalize presentation components only where repeated patterns emerge, keep their CSS ownership explicit, and avoid new eager scripts/service-worker dependencies unless a concrete need is demonstrated.
- Initial repository hygiene is reference-first: no deletions or mass `modules/` folder moves in this checkpoint. Preserve user-owned backups, tracked metadata and generated asset references. The 86-file flat `modules/` directory is not, by itself, sufficient evidence for a move.

### Planned scope, before CP-THEME-PLAN-001 implementation

1. Inventory screen markup, repeated visual patterns, CSS ownership, existing view-controller APIs, translated strings, focus/keyboard behavior and service-worker/offline dependencies. Keep the production flow atlas as the source for behavioral invariants.
2. Record the architecture decision: the common modal shell is already shared, so do not create a redundant pilot component. Prefer the current vanilla HTML/CSS/JS stack; keep important first-render markup static and component content in the light DOM so localization, Google Translate, semantic controls and accessibility remain observable.
3. Compare a light-DOM/template-based boundary with existing view modules before choosing any fragment/build mechanism. Avoid Shadow DOM, a new UI framework, or runtime-fetching HTML by default; adopt one only if the pilot demonstrates a concrete benefit and proves translation, focus, first-render and offline behavior.
4. Organize CSS into explicit tokens/base/layout/components/page layers and give extracted UI styles clear ownership. Group flat `modules/` paths by domain only when the pilot confirms navigation benefits justify updating every script, service-worker and test reference; do not combine a mass file move with the theme restyle.
5. Leave existing behavior controllers and state owners in place. Componentization owns rendering/markup and scoped presentation; it must not duplicate app state, persistence, journey routing, audio, timing or authorization policy.
6. Audit assets and dead code by references before proposing deletion. Preserve user-owned backups and tracked metadata unless their ownership and removal are explicitly approved; add no cleanup deletion to this checkpoint.

### Acceptance gates

- Architecture decision records existing owners, the already-shared modal shell, CSS/directory policy, and why a new pre-redesign extraction is not warranted. No open-ended cleanup or framework migration.
- During CP-THEME-PLAN-001, each new/changed presentation boundary must preserve existing modes/options, semantic labels, English/Malayalam/Hindi/Russian UI localization, assessment translation behavior, keyboard/focus, responsive touch targets, static journey rendering, audio lifecycle, and offline shell delivery.
- Update relevant automated view/flow tests and atlas references with behavior changes; browser checks remain opt-in and visual parity must not be claimed without them.
- Defer any domain-folder mass move that is not needed by the redesign.

The reference was generated using the built-in image tool. The tool did not expose the requested Images 2.5 model selection or Max effort control; those settings are not verified. The image is a design reference, not executable UI or an astronomy reference.

## Visual direction

- Midnight blue-black sky, near-opaque readable panels, warm ivory type, restrained champagne buttons and selection borders, and cool-aqua Earth atmosphere.
- Clear chakra tiles, visible selection checks, generous touch targets, compact preparation controls, readable video controls and a prominent Begin journey action.
- Desktop uses a spacious configuration area and session summary; mobile stacks the same functional controls. Adapt typography and spacing for the existing languages.
- Apply the visual language consistently to existing Settings, dialogs and session controls while respecting each screen's current behavior.

## Requirements that take precedence over the illustration

- Preserve all modes, add-ons, options, defaults, validation, ordering, navigation, Advanced Features access rules, settings import/export, persistence and offline behavior. An item absent from the concept is not authorization to remove it, hide it behind a new gate or change its order.
- Preserve app English/Malayalam/Hindi/Russian localization and the assessment's Google Translate contract. Generated English headlines are illustrative and require proper localization if adopted.
- Derive the summary and duration labels from actual existing semantics. The image's selected chakras, 15-minute value, duration presets and sample copy are not new defaults or total-session timing requirements.
- Keep the assessment independent; this theme does not add assessment-to-journey automation or alter its planned algorithm.
- Preserve all narration, sound, fades, pause/stop/restart behavior, pitch-black practice scenes, reduced motion, static journey sky and thermal constraints. Do not add continuous animation, expensive backdrop blur or new effects merely to match the image.
- The owner now permits the redesigned core UI to simplify or replace the current dynamic-sky background where needed to achieve the approved concept. This is a redesign-only exception, not permission to remove the capability before that checkpoint.
- Move the current dynamic observational sky into a dedicated responsive Sky page and add a clear Settings CTA to open it. On that page preserve truthful observer calculations, proper cardinal order, straight horizon, Earth-only labeling, static/performance safeguards, the five softly merged atmospheric layers with the cool-aqua 26°C theme and the Sun shield unless separately revised.
- The concept's generated celestial positions, cardinal ordering, curved horizon and separated atmosphere bands remain illustrative; they must not be presented as observationally accurate.
- All functional controls must remain live HTML/CSS; do not use the full mockup as the interface or replace the calculated sky with its decorative star field.

## Implementation checkpoints after prerequisites

1. Inventory complete for the Lobby slice: existing state/view owners and controls were retained; focused journey tests establish the behavior baseline. Capture device/browser performance only if implementation introduces measurable work.
2. Shared Lobby color, type, spacing, panel and focus tokens established in `style.css`; component-style ownership remains CSS-only to avoid runtime loading overhead.
3. CP-THEME-IMPL-001 first Lobby pass delivered locally: responsive single-column mobile / two-column wide layout, readable high-opacity surfaces, chakra option tiles, and gold Begin action. Existing control order/IDs and selection logic are unchanged. Browser visual verification remains intentionally skipped per owner direction.
4. CP-THEME-IMPL-002 implemented locally: added localized Settings → Sky Observatory navigation and retained observer calculations, Earth/Sun artwork, and reduced-motion safeguards. Only the dedicated page runs the animation loop.
5. CP-THEME-IMPL-003 completes supporting surfaces and restores the required one-shot static sky frame on journey/support screens. Lobby and Settings remain clear; Observatory alone animates. No journey, sound, timing, or navigation control behavior changes.
6. Pending: owner visual verification across language wrapping, long content, mobile/tablet/desktop, keyboard/touch, reduced motion, video readability and the dedicated Sky page; apply owner-requested corrections and run offline/journey regressions.
7. No quantified performance benefit is claimed. No repeating sky loop or periodic astronomy refresh runs outside the dedicated page. The atlas records this behavior; production publication remains separate.

## Checkpoint log

### CP-THEME-IMPL-001 — Lobby theme foundation and responsive layout

Status: implemented locally on `codex/ui-componentization-modal-pilot`; awaiting owner browser review.

- Added scoped Lobby design tokens and reusable `.lobby-panel` presentation styles in the existing stylesheet; no additional stylesheet/module request was introduced.
- Applied near-opaque readable surfaces, responsive chakra tiles, wide-screen two-column placement, touch-friendly controls, gold primary action and visible keyboard focus. DOM order, control IDs, options, data-i18n strings, current dynamic sky and existing state/view owners remain unchanged.
- Bumped the stylesheet URL and offline shell cache generation together.
- Focused journey/Lobby tests and the static theme contract pass; `git diff --check` passes. Browser visual comparison was not run per owner preference; no visual parity or runtime performance gain is claimed.
- No user-flow topology changed, so the atlas does not require a flow update for this slice. The Settings-linked dedicated Sky page remains a future flow-changing checkpoint.

### CP-THEME-IMPL-002 — Settings/dialogs and dedicated Sky Observatory

Status: implemented locally on `codex/ui-componentization-modal-pilot`; ready for owner browser review.

- Styled Settings surfaces and shared dialogs with near-opaque midnight panels, champagne accents, readable controls and visible keyboard focus; no backdrop blur was added.
- Added English, Malayalam, Hindi and Russian labels plus Settings → Sky Observatory → Settings navigation. Moved the existing sky canvas into a dedicated page; its animation, location request and astronomy refresh now run only while that page is active. The Earth atmosphere and Sun treatment remain illustrative; calculated observer positions and the label-avoidance bounds are retained.
- Updated the flow atlas and generated references (44 maps / 369 nodes / 434 edges), language-cache generation and PWA shell/style versions. No new eager script or module was added.
- Focused screen-navigation, natural-sky, thermal-budget, theme, locale, Settings, journey-routing and lobby checks pass; changed JavaScript parses and `git diff --check` passes. Atlas generation succeeded. Interactive `verify-atlas.mjs` requires unavailable Playwright, and the app browser test was skipped at the owner's request. No browser visual parity or measured performance result is claimed.

### CP-THEME-IMPL-003 — Supporting surfaces and static journey sky

Status: implemented locally on `codex/ui-componentization-modal-pilot`; ready for owner browser review.

- Journey and support pages draw one cached sky frame on entry, with no recurring animation or astronomy timer. The dedicated Sky Observatory remains the only animated sky; Lobby and Settings stay clear. Reduced motion continues to suppress Observatory animation.
- Finished high-contrast styling for newcomer chakra labels/callouts, settings management and experiment panels, breathing narration, arrival/icebreaker text, video-prelude readiness, session controls and the Journey Tuning mixer. No functional controls, IDs, timing, audio, video imagery or session geometry were changed.
- Rotated stylesheet and offline shell cache versions together. Atlas now describes the static-vs-animated canvas lifecycle.
- Browser visual verification remains owner-run as requested. No measured performance result is claimed.

## Planning review

Scope review: approved appearance recorded with explicit behavior-preservation requirements. Quality review: concept discrepancies in sky geometry, atmospheric banding, omitted options and timing labels are documented above for implementation. Assessment, modularization and the pre-redesign architecture review are complete. CP-THEME-IMPL-001/002/003 preserve existing journey and control behavior while isolating the sky loop to its own route and restoring a static journey/support canvas. Runtime performance gains are not quantified. Browser visual review is pending owner verification.

Planning validation: the current atlas builds successfully at 44 maps / 369 nodes / 434 edges. Focused source/unit checks pass; interactive atlas verification, browser layout, playback and device-performance evidence remain outstanding. Browser visual verification is intentionally owner-run.
