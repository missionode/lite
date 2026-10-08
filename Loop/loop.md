# Lite — Project Loop

This is Lite's project-local collaboration policy. It applies to the meditation PWA in the parent directory. The owner requested this profile to replace generic server architecture and unrelated technology examples.

## Project references

- [AGENTS.md](../AGENTS.md): project requirements, protected visuals and atlas rules.
- [Efficient workflow](./EFFICIENT-WORKFLOW.md): bounded context, execution costs, repeatable checks and concise continuity.
- [Project delivery workflow](../.loop/workflow.md): isolation, model routing, review and release procedure.
- [Technology stack](./TECH-STACK.md) and [communication architecture](./communication-architecture.md): Lite's current implementation.
- [Owner communication](./OWNER-COMMUNICATION.md): plain words, A/B/C options, focus-friendly replies, honest status and the release boundary.
- [HANDOFF.md](../HANDOFF.md): current checkpoint, decisions, evidence, outstanding work and historical references.
- [Flow atlas](../docs/app-map/index.html), [atlas source](../docs/app-map/atlas-data.mjs) and [fix queue](../docs/app-map/FIX-QUEUE.md): delivered flows and separately marked plans.
- [Delivery lifecycle](./DELIVERY-WORKFLOW.md) and [model routing](./MODEL-ROUTING.md): supporting procedures, applied only where relevant.

The project root is the directory containing `index.html`, `app.js` and `package.json`; `Loop/` contains development instructions. Changes here do not update an installed plugin or another project.

## Start with the existing project

Read the current request, project instructions, the top `CURRENT RESUME` block in `HANDOFF.md` and the affected map. `AGENTS.md` defines this automatic pickup sequence for new sessions, handoffs and compaction. Inspect the relevant source, tests and working-tree changes; resume the recorded next action within existing authorization unless the current request changes it. Use targeted searches and source ranges; do not reread the whole repository or handoff history for a small task.

Lite is an existing static HTML/CSS/JavaScript PWA. Do not restart product discovery, choose an example stack or create scaffolding for unrelated services. Clarify only a decision that is missing and materially changes the requested outcome.

Recheck files before editing when another actor may have changed them. Preserve unrelated work and any intentional file removal. Record a concrete contradiction between source and documentation and reconcile it within the authorized scope.

## Bounded checkpoint loop

1. Define the requested outcome, relevant files, acceptance criteria and existing constraints.
2. Trace the affected module, callers, state owners, test coverage and atlas map. Use a bounded AST/symbol map for substantial work; label textual fallback honestly.
3. Classify once and choose direct execution or justified delegation.
4. Implement the smallest coherent change. For bugs, reproduce or establish the cause, test one hypothesis, and add meaningful regression coverage when practical.
5. Review requirements and scope, then correctness, maintainability, accessibility, privacy and performance.
6. Run applicable checks, inspect errors and record limitations.
7. Update the affected atlas, track and handoff. Commit only intended validated files when the environment permits; publish only within the owner's authorization.

### Craft rules for every change

- **Say your assumption.** When you go ahead on a reasonable reading, state the assumption in one line. When two readings would build different things, ask first.
- **Simplest thing that works.** No features, options, abstractions or error handling for cases that cannot happen unless the task needs them. If the change could be much shorter, make it shorter. Before writing new code, stop at the first step that fits:
  1. Is it needed now? If not, skip it and say so in one line.
  2. Does the language's standard library do it?
  3. Does the platform do it natively (a built-in input, a database rule, an OS setting)?
  4. Does a package the project already has do it? Add a new package only with a reason (approval gate when it needs the network).
  5. Only then write the smallest code that works.
- **Never trim the safety net.** Simplicity never removes input checks at trust boundaries, error handling that prevents data loss, security, accessibility or privacy protections.
- **Mark deliberate shortcuts.** When you knowingly take a simpler route with a limit, leave a short code comment starting `Known limit:` and add a line to `docs/app-map/FIX-QUEUE.md`, so it is found later.
- **Surgical edits.** Before removing or changing odd-looking code, find out why it exists (history, tests, map notes); remove it only when the reason is gone. Touch only the lines the task needs. Do not reformat, rename or refactor nearby code. Remove only what your own change made unused. Note other problems in `docs/app-map/FIX-QUEUE.md` instead of fixing them on the side.
- **Check the real docs.** For an API, package or platform feature you are not sure about, read its current official documentation or the installed version's source; do not code from memory.
- **Done means a check passes.** Before coding, turn the task into a check (a test, a command or a screenshot) that fails or is missing now and will pass when the work is right. Loop until it passes.

After three failed debugging hypotheses, reassess the cause before adding more changes. Small wording/documentation changes need proportionate verification, not a new testing framework or repeated full-suite runs.

## Efficient execution and routing

Use the modes and model adapter in [the project workflow](../.loop/workflow.md). Tiny changes use one direct agent. Substantial or risky work uses an isolated checkout and focused review. Independent specialists are useful only when their bounded work saves duplication; one owner integrates shared files.

Preserve an explicitly selected model and reasoning level. `scripts/codex_model_router.py` uses the task classification and `config/model-routing.json`; default to `--task-class auto`, or give the evidence-backed class already determined for the bounded task. A `PLANNED` result is a recommendation, not execution or a model switch.

Continue directly when the current model is capable and another run adds no value. When a required capability is unavailable, record it and use the supported escalation or human-selection path. Do not rewrite global model settings, claim unmeasured savings or invent token budgets.

Delegated work gets a compact packet: objective, exact files, constraints, expected output and checks. Prefer a self-contained child; use retained history only when needed. Specialists return a focused diff or findings. No recursive delegation or overlapping writes.

[Local model routing](./LOCAL-MODEL-ROUTING.md) is optional development tooling. It is not Lite's narration engine and is not a prerequisite for the app. Read it only when that route is relevant.

## Implementation rules for Lite

- Keep module APIs and their actual classic-script/dynamic-loading behavior clear. Do not assume every file is an ES module.
- Preserve selection-based optional loading, retry behavior and offline asset coverage. Precaching bytes is different from executing code; performance gains need measurements.
- Preserve stage order, pause, skip, close, audio fades and cleanup. Avoid duplicate listeners, unbounded queues and unnecessary background loops.
- Keep all supported UI and narration languages synchronized; display and meditation language are separate choices.
- Follow the sky and visual requirements in `AGENTS.md`. Confirm whether a redesign change is planned or delivered before changing protected behavior.
- Styling uses Tailwind on the Lite design system: tokens and components in `tailwind/input.css`, old screen rules in `tailwind/legacy.css`, built to `tailwind.css` (see `AGENTS.md` → Styling). New design decisions follow the Lite design system, not an unrelated framework example.
- Treat imported JSON and URLs as untrusted input. Validate them through the existing owners.
- Preserve local settings/assessment storage boundaries and the current Advanced Features gate. Client-side gating is not server authentication.
- Consent capture remains postponed pending renewed owner approval. Keep proposals separate from current functionality.
- `docs/dot.json` is intentionally removed from Lite. Do not restore it or copy a neighboring project's file to satisfy a legacy test.

## Validation and evidence

| Evidence | What it establishes |
| --- | --- |
| Source/static | Inspected paths, JSON/schema, syntax, references and diffs |
| Unit/contract | Behavior exercised by a deterministic local test, including mocks where stated |
| Runtime | A real local process or HTTP asset response was exercised |
| Browser | Actual interaction, rendering, storage or service-worker behavior |
| Device/playback | Observed listening, performance or thermal behavior on the stated device |

Use relevant existing scripts from `package.json`. Before a release, run the applicable combined checks on the integrated source. Keep failures, warnings, missing prerequisites and skipped checks visible; historical results are not fresh proof.

Playwright and screenshots remain opt-in. When requested, use the local application, isolated data, stable locators and task-owned temporary artifacts. The default Playwright configuration blocks service workers, so it does not establish offline/PWA-update behavior. Never infer audio quality or thermal improvement from source tests.

For documentation-only work, check accuracy, links, diffs and affected generation. Do not add tests that merely mirror wording. New or unexplained errors require investigation; known stale tests remain limitations until reconciled. A missing intentionally removed fixture is not permission to recreate it.

## Flow atlas maintenance

Inspect affected maps before a behavior change. Update `docs/app-map/atlas-data.mjs` with executable guards, defaults, exits, persistence and failure paths. Keep proposed behavior in `FIX-QUEUE.md`.

Separate fact from guess: a step inferred but not yet read in code ends with `(inferred)` until checked. Look in the atlas and track before searching files. Keep every `file:line` source pointing at the code it describes; the build now stops on a reference that is out of range or lands on a blank or closing line, so re-point it when code moves.

Regenerate with `node docs/app-map/build-atlas.mjs`; check affected source references and snapshot metadata. Label uncommitted work accurately. Use `verify-atlas.mjs` for structural/interface changes when browser execution is authorized; otherwise report the validation boundary explicitly. When runtime flow is unchanged, update only relevant descriptions or confirm the map remains accurate.

## Git, release and permission boundaries

Preserve dirty files, private routing records and recovery assets. Use task isolation for shared or risky work as described in `.loop/workflow.md`. Inspect staged paths and diffs; exclude secrets, machine metadata, caches, unrelated backups and temporary output.

Use the user's existing authorization for the stated action. Ask again only when the action introduces a material new scope, irreversible change, spending or required permission. A production release needs the integrated source, applicable checks and verified remote state.

If Git or network access fails, report the actual operation and error. Use an available approved permission-escalation mechanism when needed; do not infer that the repository is corrupt or require a new checkout from one failed command. Continue independent local work and distinguish local files, commits, remote push and live deployment.

Never reset, discard or overwrite unrelated work. Resolve overlap by inspecting the exact changes; ask for direction only if the intent cannot be recovered safely. Use recoverable corrective commits for published changes rather than rewriting history.

## Data and resource hygiene

Keep credentials, tokens, private disclosures, browser state and logs containing sensitive content out of source, artifacts and narration. Do not claim that local storage or a password-hidden control provides server security.

Register cleanup for temporary servers, workers, media, timers and listeners. Stop only task-owned processes and remove only identified disposable artifacts. Do not install packages, browser binaries or models without applicable authorization.

Loop and handoff files are development material. Keep them out of the app precache and runtime bundles. Check the actual hosting configuration before asserting that they are excluded from public access.

## Handoff and history

Maintain the single top-level `CURRENT RESUME` block in `HANDOFF.md` as the active continuation reference. Update it in place before handoff with the current baseline, approved objective, decisions, files, fresh checks, limitations and exact next step. Distinguish implemented, planned, postponed, local and published status. Preserve older checkpoint records below the history heading; an old `NOW` or `NEXT` heading must not override the current block. New sessions recheck source and access rather than treating historical limitations as permanent.

When shortening history, preserve old entries in an append-only archive with an index and correction references. Do not erase unresolved risks, approvals or recovery instructions. Retrieve historical detail only when the current task needs it.

At a completed boundary, provide a compact resume packet when a new session helps. Do not create a separate task without the user's request. Report measured usage/progress only when available; do not invent savings or completion percentages.

## Policy maintenance

The owner may explicitly request changes to this project copy, as with this Lite-specific cleanup. Keep policy changes reviewable and separate from unrelated application code. The installed reusable plugin cache and global configuration require their own update workflow.

The files `INSTALL.md`, `FRAMEWORK-BENCHMARK.md`, `skills/` and optional routing profiles are tooling/history references. Their generic examples do not define Lite's technology or introduce application requirements.
