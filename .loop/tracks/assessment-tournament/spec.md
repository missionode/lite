# Operator-led chakra assessment tournament

## Objective

Replace the standalone `/docs/assesment.html` consultation with an operator-led, two-choice card tournament that estimates the relative status of all seven chakras without repeating a question. The result helps the trained operator understand the client; it does not configure or start a meditation journey.

## Approved behavior

- The assessment remains independent from the Lobby and every journey route.
- The operator asks one question at a time; the meditator chooses one of two neutral cards, equal, or skip.
- Questions load from a versioned JSON file. Selection, scoring, normalization, confidence, archetype aggregation and no-repeat behavior remain executable code.
- Every answered, equal or skipped question ID is excluded for the rest of that assessment. Additional evidence uses a genuinely different question.
- A hybrid bracket balances minimum evidence for Root, Sacral, Solar, Heart, Throat, Third Eye and Crown, then uses new tie-breakers only where confidence is insufficient or scores are close.
- Results show seven relative chakra scores/statuses and participant-friendly archetypes.
- Results also show one small unlabelled green, orange or red dot. No heading, percentage, explanation, intimate-service wording or automatic action accompanies it. Orange is the default until enough independent evidence exists.
- The dot is an operator interpretation aid only. It is not consent and has no connection to service activation, journey configuration or navigation.
- There are no assessment controls in Advanced Features. The question bank is JSON; the algorithm and conservative thresholds are code-owned.
- Clear for New Client removes the current assessment state. Current browser-local persistence must not leak one client’s answers into another assessment.

## Value-priority bracket

Include a neutral pairwise value bracket using the participant-facing prompt “Which of these two do you prioritize more?” and the approved value cards: Sensual Joy, Luxury, Independence, Spontaneity, Commitment, Social Approval, Emotional Safety and Romantic Idealism.

- Randomize or balance pairings so position and repeated-card order do not bias the result; never repeat the same unordered pairing in one assessment.
- Treat these choices as preferences in the current context, not permanent personality facts, consent, relationship status or a diagnosis.
- Use several independent comparisons before contributing to the conservative unlabelled operator dot. No single value or answer may determine green or red.
- Keep participant-visible wording neutral. Intimate-care interpretation remains limited to the trained operator’s unlabelled dot; do not expose hidden weights, service labels, sales language or automatic recommendations.
- Equal and skip remain valid, non-punitive responses. Clear for New Client removes these answers with all other assessment state.

## Participant-friendly archetypes

Steady Grounder, Creative Explorer, Purposeful Achiever, Compassionate Connector, Authentic Communicator, Insightful Observer, Meaning Seeker, Independent Navigator, Receptive Collaborator, Embodied Observer, Thoughtful Trust Builder and Clear Preference Communicator.

## Acceptance criteria

- Stable schema validation rejects missing IDs, duplicate IDs, malformed choices, invalid weights and unsupported signals.
- Tests prove no question repeats after answer, equal or skip; minimum chakra evidence is balanced; close/uncertain results use only unused tie-breakers; incomplete evidence cannot produce a decisive dot.
- Tests prove all eight approved value cards receive balanced opportunities, unordered value pairings do not repeat, position is counterbalanced and value evidence cannot override the multi-signal minimum for the dot.
- A single answer cannot produce green or red. The final dot requires several consistent independent signals.
- Refresh/resume and new-client clearing behave explicitly and safely.
- The source question bank remains English. The existing Google Translate widget translates the page, dynamically generated questions, choices, progress and results; translation therefore requires an internet connection, matching the current assessment page.
- The atlas describes the delivered tournament; trained-operator wording and usability remain pending follow-up evidence.

## Exclusions

- No journey recommendation, Lobby handoff, automatic session configuration, service activation or sales prompt.
- No Advanced Features assessment settings panel.
- No separate native Malayalam, Hindi or Russian assessment bundles in this feature; multilingual readiness uses the existing Google Translate integration.
- The software implementation is delivered and synchronized into `modularize`; trained-operator acceptance remains a separate follow-up and does not block modularization.

## Local integration — Advanced Features, undo and rapport guidance

- The assessment has exactly one in-app entry point: the Lobby consultation CTA, available only while Advanced Features is unlocked. Settings has no assessment link. The Lobby entry creates a 15-minute same-tab grant; relocking revokes it, and direct page entry without it remains on an access-required view without fetching the question bank. This is a client-side feature gate, not server authentication.
- Undo removes exactly the most recent question or value-pair response and re-presents it for correction. Older persisted assessments reconstruct chronological history from their deterministic response sequence.
- Results include a tentative conversation topic only when a chakra has full evidence confidence, plus a client-led icebreaker. This must not claim character/behavior prediction. Topic selection is based only on chakra-question answers; intimate-value choices and the private dot are excluded. Insufficient evidence gets a generic open question.
- The result card and undo controls must appear in the localhost-served build, not only an isolated worktree. New dynamic text follows the existing Google Translate path; service-worker asset versions and atlas branches must match the running code.
