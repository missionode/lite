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

## Participant-friendly archetypes

Steady Grounder, Creative Explorer, Purposeful Achiever, Compassionate Connector, Authentic Communicator, Insightful Observer, Meaning Seeker, Independent Navigator, Receptive Collaborator, Embodied Observer, Thoughtful Trust Builder and Clear Preference Communicator.

## Acceptance criteria

- Stable schema validation rejects missing IDs, duplicate IDs, malformed choices, invalid weights and unsupported signals.
- Tests prove no question repeats after answer, equal or skip; minimum chakra evidence is balanced; close/uncertain results use only unused tie-breakers; incomplete evidence cannot produce a decisive dot.
- A single answer cannot produce green or red. The final dot requires several consistent independent signals.
- Refresh/resume and new-client clearing behave explicitly and safely.
- English content receives operator approval before Malayalam, Hindi and Russian adaptation.
- The current and planned atlas maps remain distinct until implementation replaces the current consultation.

## Exclusions

- No journey recommendation, Lobby handoff, automatic session configuration, service activation or sales prompt.
- No Advanced Features assessment settings panel.
- No implementation before the weekly usage reset; this approved plan is the next feature before modularization resumes.
