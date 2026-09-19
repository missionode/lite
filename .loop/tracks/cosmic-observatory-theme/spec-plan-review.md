# CP-THEME-PLAN-001 — Cosmic Observatory theme

Status: design direction APPROVED; implementation QUEUED.

## Approved reference and dependency order

Owner-approved desktop/mobile concept: [approved-concept-v1.png](../../../docs/design/lite-cosmic-observatory/approved-concept-v1.png).

Complete the separately planned assessment, then resume and complete modularization and its measured loading review. Implement this theme afterward as a separate visual checkpoint. This adds no work to an active extraction checkpoint and changes no existing feature requirement.

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
- Preserve centered Earth and five softly merged atmospheric layers, clearly visible cool-aqua 26°C comfort styling and the Sun's soft protective shield. Keep Earth-only labeling and the authoritative content-clearance guards; do not infer changes to scrolling/placement behavior from this static image.
- Use the actual observer calculations for planets, stars, Sun and Moon. The concept's positions, cardinal ordering and curved horizon are illustrative: retain the implemented truthful coordinates, proper cardinal order and straight horizon. Use softly blended atmosphere, not the image's conspicuous separated bands.
- All functional controls must remain live HTML/CSS; do not use the full mockup as the interface or replace the calculated sky with its decorative star field.

## Implementation checkpoints after prerequisites

1. Inventory the completed module interfaces, all controls and languages; capture behavior and performance baselines.
2. Establish shared color, typography, spacing, surface and focus tokens from the approved concept; verify text contrast and font fallback.
3. Restyle the Lobby and responsive summary using existing state and control handlers; preserve full feature coverage and duration semantics.
4. Carry the theme through Settings/dialogs and applicable supporting surfaces with their existing translation/access contracts. Preserve minimal active-journey screens.
5. Validate all controls, keyboard/focus, touch targets, language wrapping, video readability, long content, mobile/tablet/desktop layouts, reduced motion, protected sky effects, offline updates and audio/journey regressions.
6. Compare startup and journey CPU/memory with the baseline. Resolve regressions before acceptance. Synchronize affected implemented maps and present the working visual checkpoint for review; production publication remains a separate request.

## Planning review

Scope review: approved appearance recorded with explicit behavior-preservation requirements. Quality review: concept discrepancies in sky geometry, atmospheric banding, omitted options and timing labels are documented above for implementation. No runtime change or performance improvement is claimed. Assessment and modularization remain prerequisites.

Planning validation: atlas regeneration and browser verification of all 32 maps passed, including mobile overflow, keyboard navigation, labels, print, SVG export and the direct-template fallback; no page errors. Runtime implementation, playback and device-performance verification remain future work.
