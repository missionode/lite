# Codex Model Routing Policy

This optional policy defines capability-aware model routing for Codex-based work. It is an orchestration policy, not a guarantee that the current Codex conversation can change models in place.

## Boundary

The routing layer may classify a task, select a compatible model, check current availability and usage signals, record the decision, and launch or resume a separate Codex session with the selected model when the environment supports it.

It must not silently switch the model inside an existing conversation. If a new session is required, preserve the project root, task scope, approvals, and handoff context. A user-selected model or explicit model request takes precedence over automatic routing.

## Routing objectives

Choose the least expensive and lowest-latency model that can reliably satisfy the task. Escalate when reasoning, context, tools, safety, or validation requirements exceed the selected model’s capability.

Do not hard-code a model name as a permanent default. Model names, availability, context windows, capabilities, pricing, and deprecation status can change. Use stable capability classes and refresh the model registry from the available official catalog or provider integration.

## Task classes

```text
simple                deterministic calculation, formatting, extraction, classification
focused               short explanation, small documentation edit, isolated code change
standard              normal implementation, debugging, tests, or project analysis
reasoning             algorithm design, multi-file refactor, architecture, complex diagnosis
high-risk             security, privacy, migration, concurrency, production, or recovery work
large-context         repository mapping, broad review, or work near context limits
browser               browser, Playwright, responsive, accessibility, or visual behavior
```

## Capability requirements

Each routing decision should derive these requirements before choosing a model:

```text
reasoning: none | low | medium | high | xhigh | max
contextRequired: estimated input and retained context size
maxOutputRequired: expected response/output size
tools: shell | patch | browser | web | file | MCP | other
modalities: text | image | audio | other
latencyTarget: low | normal | flexible
qualityTarget: normal | high | critical
```

## Default routing policy

```text
simple       -> small/fast model, no or low reasoning
focused      -> small or balanced model, low reasoning
standard     -> balanced coding model, low or medium reasoning
reasoning    -> stronger coding/reasoning model, medium/high reasoning
high-risk    -> strongest compatible model, high reasoning and explicit review
large-context-> model whose context window safely fits the task, then choose quality/cost
browser      -> model with required tool and modality support; use Playwright for browser evidence
```

Use the current provider catalog to fill the classes. The policy should use capability classes rather than assuming older model names remain available.

## Model registry

The router should maintain or obtain a current registry with:

```text
modelId
status: available | unavailable | deprecated | unknown
reasoningLevels
contextWindow
maxOutputTokens
tools
modalities
latencyClass
costClass
provider
catalogCheckedAt
```

For API-backed integrations, query the provider’s model catalog when permitted. The OpenAI Models API lists currently available model objects; model documentation supplies capability and context details.

## Health and usage signals

Health is separate from static capability. Track, without storing secrets:

```text
lastSuccessAt
lastFailureAt
rollingSuccessRate
rollingErrorRate
p50LatencyMs
p95LatencyMs
recent429Count
remainingRequests
remainingTokens
resetRequestsAt
resetTokensAt
lastRequestId
```

For OpenAI API integrations, capture rate-limit response headers such as `x-ratelimit-remaining-requests`, `x-ratelimit-remaining-tokens`, and their reset values, plus request IDs. Account limits are dynamic and must not be copied from model documentation into project configuration.

Use health states:

```text
GREEN  compatible, available, recent success, sufficient remaining budget
YELLOW elevated latency/errors, low remaining budget, or recent throttling
RED    unavailable, deprecated, repeated failures, or no usable quota
```

Do not treat a static catalog as proof that a particular account/model request will succeed. Request telemetry and account-specific rate-limit signals are the operational evidence.

## Selection algorithm

```text
1. Classify the task from the user request and project context.
2. Honor an explicit user-selected model or quality requirement.
3. Estimate context size, output size, tools, modalities, and reasoning need.
4. Filter models that cannot satisfy those requirements.
5. Remove RED models and penalize YELLOW models.
6. Prefer the lowest cost/latency GREEN model that meets the quality threshold.
7. Use the stronger model when the task is high-risk or the smaller model fails validation.
8. If no model qualifies, return BLOCKED or request user direction; do not silently lower a safety or quality requirement.
9. Record the decision and fallback plan in the handoff or task log.
```

## Fallback and escalation

- A fallback must preserve required tools, context capacity, modality, and safety level.
- Rate-limit failures may use a compatible fallback or wait until the recorded reset time.
- Capability failures require escalation, not blind retries.
- A model that produces an incomplete, uncertain, or validation-failing result may be escalated once to the next suitable class.
- Do not endlessly retry or cycle models.
- High-risk tasks require explicit review even when the strongest model succeeds.

## Decision record

Record a compact routing record:

```text
taskClass: reasoning
selectedModel: <actual provider model ID>
reasoning: high
contextRequired: <estimate>
requiredTools: <tools>
health: GREEN | YELLOW | RED
usageSignal: <remaining/reset summary or unavailable>
fallback: <compatible model or none>
reason: <why this model met the task requirements>
session: <current or newly launched session reference>
```

Never record API keys, tokens, private prompts, private user data, or full request payloads.

## Local-first operation

Routing decisions are local metadata. The project remains usable without a provider API, health endpoint, or network access. If live model health cannot be checked, mark it `UNKNOWN`, use the configured safe model policy, and report the limitation. Do not claim live availability from stale metadata.

Model routing does not replace the Loop’s context routing. The context index and project map reduce what is loaded; model routing selects the capability needed for the remaining task.

## Measurement

Evaluate routing using representative tasks and compare:

- Task success rate
- Required validation pass rate
- Escalation rate
- Latency
- Input, cached, output, and reasoning tokens where available
- Rate-limit incidents
- Cost or quota consumption
- User correction and rework rate

The routing policy is successful only if it reduces cost or latency without increasing failed work, unsafe decisions, or rework.
