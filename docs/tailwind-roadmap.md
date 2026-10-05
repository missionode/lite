# Tailwind CSS roadmap

Owner decision (2026-10-05): option A — set up Tailwind on the Lite design system and move the Lobby first; other screens follow in later sessions.

## How it is set up

| Part | What |
| --- | --- |
| Tailwind | v4.3.3 CLI (`tailwindcss`, `@tailwindcss/cli` dev dependencies). No CDN, nothing runs in the browser. |
| Entry | `tailwind/input.css` — design tokens (`@theme`), preflight, shared defaults (`@layer ds-base`), screen components (`@layer components`); it imports `tailwind/legacy.css` (screen rules not yet rewritten, was `style.css`). |
| Output | `tailwind.css` — the app's only stylesheet (minified, committed, precached offline). Rebuild after every change: `npm run build:css` (or `npm run watch:css`). |
| Tokens | Colours, font, spacing (`s1`–`s6`), radii, shadows and breakpoints copied from the **Lite** design system (Claude Design System artifact). Only design-system colours exist: Tailwind's default palette is removed. |
| Prefix | Every utility starts with `tw:` (for example `tw:grid-cols-2`, `tw:lobby2:col-[2]`), so nothing collides with old class names such as `hidden` or `container`. |
| Cascade | Layer order `theme, base, ds-base, legacy, components, utilities`. `base` is Tailwind preflight (lowest). `ds-base` holds app-wide defaults (element resets, old browser defaults kept for line height, headings, lists and inline images, buttons, sliders, chips, modals…) **below** `legacy`, so screen rules in `tailwind/legacy.css` keep winning until their screen is rewritten. Screen components (`.ds-lobby`, `.ds-settings`, `.ds-sky`, `.ds-support`) and `tw:` utilities sit above and always win. |
| Breakpoints | `tile4` = 560px (4 chakra tiles), `lobby2` = 920px (two-column Lobby), plus Tailwind's defaults. |
| Safety net | `tests/tailwind-setup.test.mjs` checks the pipeline, tokens, cascade, offline cache and that `tailwind.css` matches a fresh build. Screens are compared with before/after screenshots at phone, tablet and desktop widths. |

On a Mac, run `npm install` once in the project folder before `npm run build:css` (the CLI uses a platform-specific binary).

## Rules while moving a screen

1. Keep DOM order, IDs, `data-i18n` keys and the classes view modules toggle (`hidden`, `chip-active`, `is-off`, …).
2. Layout and one-off spacing go in markup as `tw:` utilities; screen patterns become components in `@layer components`; app-wide defaults go in `@layer ds-base` together with any element rules they compete with (a rule moved below `legacy` loses to every legacy rule, even `*` or `label`). Use the token variables (`var(--tw-color-…)`).
3. Delete the screen's old rules from `tailwind/legacy.css` in the same change.
4. Screenshots before and after (390 / 760 / 1280 px); differences must be intended.
5. Bump the `tailwind.css` and shell-cache versions; update tests, atlas, handoff and fix queue.

## Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Install Tailwind v4, tokens from the design system, `tw:` prefix, legacy layer, offline cache, tests | **Done** (2026-10-05) — pixel-identical screenshots |
| 1 | Lobby (Cosmic Observatory block, ~310 lines out of `style.css`), per-chakra time panel, Benefits and safety styles; Inter 500/600/700 loaded; FAQ link uses Settings gold instead of the old amber | **Done** (2026-10-05) — Lobby pixel-identical; only the per-chakra rows changed slightly (design-system borders) |
| 2 | Settings and the Sky Observatory page (`.ds-settings`, `.ds-sky`); merged the near-duplicate Settings colours into the Lobby set (one ink, one muted, one gold primary button in sentence case); select chevron and focus in design-system gold | **Done** (2026-10-05) — Lobby, Sky and FAQ unchanged; Settings shows the intended changes (brighter gold Save button, gold chevrons) |
| 3 | Shared pieces: buttons (one gold primary app-wide), range sliders (gold fill), steppers (− value +), checkbox chips, segmented options (Drone Duration), modals and close buttons, help/FAQ entries as tiles, in-app notices; Settings title, subtitle and stats bar in sentence case | **Done** (2026-10-05) — intended look changes on Lobby, Settings and dialogs; help/FAQ dialogs now left-aligned and wider (their own size wins) |
| 4 | Journey screens (meditation, chakra, Pitch, Sleep wind-down, completion): retire legacy violet `#7c3aed` and amber `#fbbf24` | **Done** (2026-10-05) — legacy variables now point at design-system tokens (ink text, gold accent, tile glass); every amber literal → gold `#e8c27e`; violet glows, dots, icon buttons and the breathing orb → gold; calm default colour → sky teal `#a9d9df` (the chakra colour still replaces it during a journey); aura glows set by scripts → soft gold. Rules stayed in the legacy file (state overrides such as Sleep and sky modes depend on order). Game palettes in Play Zone and the Dharana practice shape colours are content, kept as they are. |
| 5 | Practice and support screens (Yoga, care sessions, games in Play Zone, repertory page, assessment page) | **Done** (2026-10-05) — Manage Settings and Experiment Mode use `.ds-settings` (sentence-case title, one gold chevron, stacked backup-file field); Arriving uses `.ds-support`; lavender/violet surfaces in Final Challenge, Pitch moods, orientation scene and Play Zone chrome → design-system ink, gold and surfaces (per-player and rating colours kept); orientation title now really screen-reader only (`tw:sr-only`); Assessment and Repertory pages on design-system ink, gold, surfaces and Inter, gold primary button (the assessment's three agreed result colours kept). |
| 6 | Turn on Tailwind preflight, delete what is left of `style.css`, remove the legacy layer | **Done** (2026-10-05), with one owner-visible choice — `style.css` is gone: its remaining ~2,700 lines moved unchanged to `tailwind/legacy.css` and are bundled into `tailwind.css`, so the app loads one stylesheet. Preflight is on, below everything; old browser defaults (line height, heading sizes, lists, inline images) are kept in `ds-base`, so screens look the same. Intended changes: links in design-system gold, the backup-file picker button, the frequency-reminder and voice-download gold. The legacy **layer** stays: rewriting 2,700 lines of screen rules (many depend on order for Sleep, sky and journey states) gives no visible gain and is risky in one go; do it screen by screen when a screen is next touched. |
| 7 (optional) | Rewrite `tailwind/legacy.css` into components screen by screen; remove the legacy layer when empty | When a screen is touched |

Each phase is one session of work with its own screenshots, tests and push.

## Design system follow-ups (Claude Design System "Lite")

- Add Tamil (the app has five languages; the README lists four).
- Mark the Inter weight gap as fixed (500/600/700 now load).
- Merged in the app (phase 2): `ink-settings` → `ink`, `muted-settings` → `muted`, the Settings CTA gradient → the one primary gradient. Update the design system the same way. `gold-label` stays as the heading role.
- Add components the app now has in Tailwind (phase 3): Chip/Toggle, Range slider, Stepper, Segmented options, Modal, Notice; update Button (one gold primary app-wide, sentence case).
- Keep `tailwind/input.css` `@theme` and the design system `tokens.json` in step: change a token in both, then rebuild.

Note: `npm audit` reports a high-severity `braces` issue inside `@parcel/watcher`, used only by the Tailwind CLI watch mode on the developer machine. It is never shipped to users. Re-check when Tailwind releases an update.
