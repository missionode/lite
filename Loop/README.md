# Loop for Lite

This folder contains Lite's project workflow and its development tools. Repository entry instructions in [AGENTS.md](../AGENTS.md) route new/resumed sessions to the `CURRENT RESUME` block at the top of [HANDOFF.md](../HANDOFF.md). Read it with the newest request, verify the current source/Git state and continue the recorded work within existing authorization. Older checkpoint headings are history, not a new work queue. Then load only the relevant reference:

| Need | Reference |
| --- | --- |
| Project operating rules | [Lite Loop policy](./loop.md), [efficient workflow](./EFFICIENT-WORKFLOW.md) |
| Actual application technologies | [Lite technology stack](./TECH-STACK.md) |
| Browser modules, worker messages, fetch/cache and local data | [Lite communication architecture](./communication-architecture.md) |
| Implementation and release procedure | [Project workflow](../.loop/workflow.md), [delivery lifecycle](./DELIVERY-WORKFLOW.md) |
| Delivered flows and planned checkpoints | [Visual atlas](../docs/app-map/index.html), [fix queue](../docs/app-map/FIX-QUEUE.md) |
| Development model routing | [Model routing](./MODEL-ROUTING.md); [optional local route](./LOCAL-MODEL-ROUTING.md) only when needed |

The policy, stack and communication files describe this static browser application. The former generic server/PHP profile has been replaced with source-backed Lite guidance. Application behavior is owned by the source and atlas; this documentation cleanup does not introduce a new architecture.

`INSTALL.md`, `skills/`, optional model profiles and `FRAMEWORK-BENCHMARK.md` are reusable-tooling or historical references. They are not routine context, an application dependency list or evidence of current delivery. Read them only for a relevant tooling task. Editing this folder does not modify the installed Loop plugin cache.
