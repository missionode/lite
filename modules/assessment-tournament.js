(function installAssessmentTournament(global) {
    'use strict';

    const RESPONSE_EQUAL = 'equal';
    const RESPONSE_SKIP = 'skip';
    const DOT_ORANGE = 'orange';
    const CHAKRA_IDS = Object.freeze(['root', 'sacral', 'solar', 'heart', 'throat', 'third-eye', 'crown']);

    function invariant(condition, message) {
        if (!condition) throw new Error(`Assessment bank invalid: ${message}`);
    }

    function isPlainObject(value) {
        return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    }

    function uniqueStrings(values, label) {
        invariant(Array.isArray(values) && values.length > 0, `${label} must be a non-empty array`);
        values.forEach(value => invariant(typeof value === 'string' && value.trim(), `${label} contains an empty value`));
        invariant(new Set(values).size === values.length, `${label} contains duplicates`);
    }

    function validateBank(bank) {
        invariant(isPlainObject(bank), 'root must be an object');
        invariant(bank.schemaVersion === 1, 'schemaVersion must be 1');
        invariant(typeof bank.contentVersion === 'string' && bank.contentVersion.trim(), 'contentVersion is required');
        invariant(Array.isArray(bank.chakras) && bank.chakras.length === CHAKRA_IDS.length, 'seven chakras are required');
        uniqueStrings(bank.chakras.map(item => item.id), 'chakra IDs');
        invariant(CHAKRA_IDS.every(id => bank.chakras.some(item => item.id === id)), 'canonical chakra IDs are required');
        bank.chakras.forEach(item => {
            invariant(typeof item.name === 'string' && item.name.trim(), `${item.id}.name is required`);
            invariant(typeof item.archetype === 'string' && item.archetype.trim(), `${item.id}.archetype is required`);
        });

        invariant(Array.isArray(bank.questions) && bank.questions.length >= 21, 'at least 21 chakra questions are required');
        uniqueStrings(bank.questions.map(item => item.id), 'question IDs');
        bank.questions.forEach(question => {
            invariant(typeof question.prompt === 'string' && question.prompt.trim(), `${question.id}.prompt is required`);
            invariant(question.tier === 'core' || question.tier === 'tie-breaker', `${question.id}.tier is unsupported`);
            uniqueStrings(question.coverage, `${question.id}.coverage`);
            question.coverage.forEach(id => invariant(CHAKRA_IDS.includes(id), `${question.id} covers an unknown chakra`));
            invariant(Array.isArray(question.choices) && question.choices.length === 2, `${question.id} must have two choices`);
            uniqueStrings(question.choices.map(choice => choice.id), `${question.id} choice IDs`);
            question.choices.forEach(choice => {
                invariant(typeof choice.label === 'string' && choice.label.trim(), `${question.id}.${choice.id}.label is required`);
                invariant(isPlainObject(choice.weights), `${question.id}.${choice.id}.weights must be an object`);
                Object.entries(choice.weights).forEach(([chakraId, weight]) => {
                    invariant(CHAKRA_IDS.includes(chakraId), `${question.id}.${choice.id} weights an unknown chakra`);
                    invariant(Number.isFinite(weight) && weight >= 0 && weight <= 1, `${question.id}.${choice.id}.${chakraId} weight is outside 0..1`);
                });
            });
        });

        invariant(Array.isArray(bank.values) && bank.values.length === 8, 'eight value cards are required');
        uniqueStrings(bank.values.map(item => item.id), 'value IDs');
        bank.values.forEach(item => {
            invariant(typeof item.label === 'string' && item.label.trim(), `${item.id}.label is required`);
            invariant(typeof item.archetype === 'string' && item.archetype.trim(), `${item.id}.archetype is required`);
            invariant(Number.isFinite(item.operatorSignal) && item.operatorSignal >= -2 && item.operatorSignal <= 2, `${item.id}.operatorSignal is outside -2..2`);
        });

        const settings = bank.settings;
        invariant(isPlainObject(settings), 'settings are required');
        ['minimumEvidencePerChakra', 'valueRounds', 'minimumDotResponses', 'minimumDotDistinctValues'].forEach(key => {
            invariant(Number.isInteger(settings[key]) && settings[key] > 0, `settings.${key} must be a positive integer`);
        });
        invariant(settings.valueRounds <= 28, 'valueRounds cannot exceed the 28 unique pairs');
        invariant(settings.minimumDotResponses <= settings.valueRounds, 'minimumDotResponses cannot exceed valueRounds');
        return true;
    }

    function createState(bank) {
        validateBank(bank);
        return {
            schemaVersion: 1,
            contentVersion: bank.contentVersion,
            answers: {},
            answeredIds: [],
            valueHistory: []
        };
    }

    function restoreState(bank, candidate) {
        validateBank(bank);
        if (!isPlainObject(candidate) || candidate.schemaVersion !== 1 || candidate.contentVersion !== bank.contentVersion) {
            return createState(bank);
        }
        const questionsById = Object.fromEntries(bank.questions.map(item => [item.id, item]));
        const questionIds = new Set(Object.keys(questionsById));
        const answers = {};
        const answeredIds = [];
        const seen = new Set();
        (Array.isArray(candidate.answeredIds) ? candidate.answeredIds : []).forEach(id => {
            if (!questionIds.has(id) || seen.has(id)) return;
            const response = candidate.answers?.[id];
            const question = questionsById[id];
            const allowed = [...question.choices.map(choice => choice.id), RESPONSE_EQUAL, RESPONSE_SKIP];
            if (!allowed.includes(response)) return;
            answers[id] = response;
            answeredIds.push(id);
            seen.add(id);
        });
        const validValueIds = new Set(bank.values.map(item => item.id));
        const seenPairs = new Set();
        const valueHistory = [];
        (Array.isArray(candidate.valueHistory) ? candidate.valueHistory : []).slice(0, bank.settings.valueRounds).forEach(entry => {
            if (!isPlainObject(entry) || !validValueIds.has(entry.leftId) || !validValueIds.has(entry.rightId) || entry.leftId === entry.rightId) return;
            const pairId = canonicalPairId(entry.leftId, entry.rightId);
            if (seenPairs.has(pairId) || entry.pairId !== pairId) return;
            if (![entry.leftId, entry.rightId, RESPONSE_EQUAL, RESPONSE_SKIP].includes(entry.response)) return;
            valueHistory.push({ pairId, leftId: entry.leftId, rightId: entry.rightId, response: entry.response });
            seenPairs.add(pairId);
        });
        return { schemaVersion: 1, contentVersion: bank.contentVersion, answers, answeredIds, valueHistory };
    }

    function canonicalPairId(firstId, secondId) {
        return [firstId, secondId].sort().join('::');
    }

    function questionEvidence(bank, state) {
        const evidence = Object.fromEntries(CHAKRA_IDS.map(id => [id, 0]));
        bank.questions.forEach(question => {
            const response = state.answers[question.id];
            if (!response || response === RESPONSE_SKIP) return;
            question.coverage.forEach(id => { evidence[id] += 1; });
        });
        return evidence;
    }

    function unusedQuestions(bank, state, tier) {
        const used = new Set(state.answeredIds);
        return bank.questions.filter(item => item.tier === tier && !used.has(item.id));
    }

    function nextCoverageQuestion(bank, state) {
        const evidence = questionEvidence(bank, state);
        const target = CHAKRA_IDS
            .filter(id => evidence[id] < bank.settings.minimumEvidencePerChakra)
            .sort((a, b) => evidence[a] - evidence[b] || CHAKRA_IDS.indexOf(a) - CHAKRA_IDS.indexOf(b))[0];
        if (!target) return null;
        return unusedQuestions(bank, state, 'core').find(item => item.coverage.includes(target))
            || unusedQuestions(bank, state, 'tie-breaker').find(item => item.coverage.includes(target))
            || null;
    }

    function valueStats(bank, state) {
        const stats = Object.fromEntries(bank.values.map(item => [item.id, { appearances: 0, left: 0, right: 0, wins: 0 }]));
        state.valueHistory.forEach(entry => {
            stats[entry.leftId].appearances += 1;
            stats[entry.leftId].left += 1;
            stats[entry.rightId].appearances += 1;
            stats[entry.rightId].right += 1;
            if (entry.response === entry.leftId) stats[entry.leftId].wins += 1;
            if (entry.response === entry.rightId) stats[entry.rightId].wins += 1;
        });
        return stats;
    }

    function nextValuePair(bank, state) {
        if (state.valueHistory.length >= bank.settings.valueRounds) return null;
        const seen = new Set(state.valueHistory.map(entry => entry.pairId));
        const stats = valueStats(bank, state);
        const candidates = [];
        for (let first = 0; first < bank.values.length; first += 1) {
            for (let second = first + 1; second < bank.values.length; second += 1) {
                const a = bank.values[first];
                const b = bank.values[second];
                const pairId = canonicalPairId(a.id, b.id);
                if (seen.has(pairId)) continue;
                candidates.push({ a, b, pairId });
            }
        }
        candidates.sort((left, right) => {
            const leftMax = Math.max(stats[left.a.id].appearances, stats[left.b.id].appearances);
            const rightMax = Math.max(stats[right.a.id].appearances, stats[right.b.id].appearances);
            const leftSum = stats[left.a.id].appearances + stats[left.b.id].appearances;
            const rightSum = stats[right.a.id].appearances + stats[right.b.id].appearances;
            return leftMax - rightMax || leftSum - rightSum || left.pairId.localeCompare(right.pairId);
        });
        const candidate = candidates[0];
        if (!candidate) return null;
        const aBalance = stats[candidate.a.id].left - stats[candidate.a.id].right;
        const bBalance = stats[candidate.b.id].left - stats[candidate.b.id].right;
        const aOnLeft = aBalance < bBalance || (aBalance === bBalance && state.valueHistory.length % 2 === 0);
        const left = aOnLeft ? candidate.a : candidate.b;
        const right = aOnLeft ? candidate.b : candidate.a;
        return {
            kind: 'value',
            id: `value:${candidate.pairId}`,
            pairId: candidate.pairId,
            prompt: bank.valuePrompt,
            left: { id: left.id, label: left.label },
            right: { id: right.id, label: right.label }
        };
    }

    function questionScore(bank, state) {
        const totals = Object.fromEntries(CHAKRA_IDS.map(id => [id, { sum: 0, evidence: 0 }]));
        bank.questions.forEach(question => {
            const response = state.answers[question.id];
            if (!response || response === RESPONSE_SKIP) return;
            const selected = question.choices.find(choice => choice.id === response);
            question.coverage.forEach(chakraId => {
                let weight;
                if (response === RESPONSE_EQUAL) {
                    weight = question.choices.reduce((sum, choice) => sum + (choice.weights[chakraId] ?? 0.5), 0) / question.choices.length;
                } else {
                    weight = selected?.weights[chakraId] ?? 0.5;
                }
                totals[chakraId].sum += weight;
                totals[chakraId].evidence += 1;
            });
        });
        return totals;
    }

    function nextTieBreaker(bank, state) {
        const scores = questionScore(bank, state);
        const ambiguous = CHAKRA_IDS
            .filter(id => scores[id].evidence < bank.settings.minimumEvidencePerChakra
                || Math.abs((scores[id].sum / Math.max(1, scores[id].evidence)) - 0.5) < 0.16)
            .sort((a, b) => scores[a].evidence - scores[b].evidence || CHAKRA_IDS.indexOf(a) - CHAKRA_IDS.indexOf(b));
        const unused = unusedQuestions(bank, state, 'tie-breaker');
        for (const chakraId of ambiguous) {
            const question = unused.find(item => item.coverage.includes(chakraId));
            if (question) return question;
        }
        return null;
    }

    function questionItem(question) {
        return {
            kind: 'question',
            id: question.id,
            prompt: question.prompt,
            choices: question.choices.map(choice => ({ id: choice.id, label: choice.label })),
            coverage: [...question.coverage],
            tier: question.tier
        };
    }

    function selectNext(bank, stateCandidate) {
        validateBank(bank);
        const state = restoreState(bank, stateCandidate);
        const coverageQuestion = nextCoverageQuestion(bank, state);
        if (coverageQuestion) return questionItem(coverageQuestion);
        const valuePair = nextValuePair(bank, state);
        if (valuePair) return valuePair;
        const tieBreaker = nextTieBreaker(bank, state);
        return tieBreaker ? questionItem(tieBreaker) : { kind: 'complete', id: 'complete' };
    }

    function answerItem(bank, stateCandidate, item, response) {
        validateBank(bank);
        const state = restoreState(bank, stateCandidate);
        if (item.kind === 'question') {
            invariant(!state.answeredIds.includes(item.id), `question ${item.id} was already consumed`);
            const question = bank.questions.find(candidate => candidate.id === item.id);
            invariant(question, `question ${item.id} is unknown`);
            const allowed = [...question.choices.map(choice => choice.id), RESPONSE_EQUAL, RESPONSE_SKIP];
            invariant(allowed.includes(response), `response ${response} is invalid for ${item.id}`);
            return {
                ...state,
                answers: { ...state.answers, [item.id]: response },
                answeredIds: [...state.answeredIds, item.id]
            };
        }
        if (item.kind === 'value') {
            const valueIds = new Set(bank.values.map(value => value.id));
            invariant(valueIds.has(item.left?.id) && valueIds.has(item.right?.id), `value pair ${item.pairId} contains an unknown value`);
            invariant(item.left.id !== item.right.id && item.pairId === canonicalPairId(item.left.id, item.right.id), `value pair ${item.pairId} is malformed`);
            invariant(!state.valueHistory.some(entry => entry.pairId === item.pairId), `value pair ${item.pairId} was already consumed`);
            const allowed = [item.left.id, item.right.id, RESPONSE_EQUAL, RESPONSE_SKIP];
            invariant(allowed.includes(response), `response ${response} is invalid for ${item.id}`);
            return {
                ...state,
                valueHistory: [...state.valueHistory, {
                    pairId: item.pairId,
                    leftId: item.left.id,
                    rightId: item.right.id,
                    response
                }]
            };
        }
        throw new Error(`Assessment item cannot be answered: ${item.kind}`);
    }

    function dotResult(bank, state) {
        const valuesById = Object.fromEntries(bank.values.map(item => [item.id, item]));
        const selected = state.valueHistory
            .map(entry => entry.response)
            .filter(response => valuesById[response]);
        const distinct = new Set(selected);
        if (selected.length < bank.settings.minimumDotResponses || distinct.size < bank.settings.minimumDotDistinctValues) {
            return DOT_ORANGE;
        }
        const signals = selected.map(id => valuesById[id].operatorSignal);
        const mean = signals.reduce((sum, value) => sum + value, 0) / signals.length;
        const positive = signals.filter(value => value >= 1).length;
        const cautious = signals.filter(value => value <= -1).length;
        if (mean >= 0.75 && positive >= 5) return 'green';
        if (mean <= -0.5 && cautious >= 5) return 'red';
        return DOT_ORANGE;
    }

    function statusFor(score, confidence) {
        if (confidence < 1) return 'More conversation needed';
        if (score >= 0.67) return 'Currently supported';
        if (score >= 0.45) return 'Developing';
        return 'May benefit from support';
    }

    function buildResult(bank, stateCandidate) {
        validateBank(bank);
        const state = restoreState(bank, stateCandidate);
        const totals = questionScore(bank, state);
        const chakraById = Object.fromEntries(bank.chakras.map(item => [item.id, item]));
        const chakras = CHAKRA_IDS.map(id => {
            const evidence = totals[id].evidence;
            const score = evidence ? totals[id].sum / evidence : 0.5;
            const confidence = Math.min(1, evidence / bank.settings.minimumEvidencePerChakra);
            return { id, name: chakraById[id].name, score, confidence, status: statusFor(score, confidence), archetype: chakraById[id].archetype };
        });
        const valueWins = valueStats(bank, state);
        const leadingValues = [...bank.values]
            .sort((a, b) => valueWins[b.id].wins - valueWins[a.id].wins || a.id.localeCompare(b.id))
            .filter(item => valueWins[item.id].wins > 0)
            .slice(0, 2)
            .map(item => item.archetype);
        const leadingChakras = [...chakras].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, 2).map(item => item.archetype);
        return {
            complete: selectNext(bank, state).kind === 'complete',
            chakras,
            archetypes: [...new Set([...leadingChakras, ...leadingValues])].slice(0, 3),
            dot: dotResult(bank, state),
            progress: {
                questionsConsumed: state.answeredIds.length,
                valuePairsConsumed: state.valueHistory.length
            }
        };
    }

    global.ChakraAssessmentTournament = Object.freeze({
        CHAKRA_IDS,
        RESPONSE_EQUAL,
        RESPONSE_SKIP,
        validateBank,
        createState,
        restoreState,
        selectNext,
        answerItem,
        buildResult,
        canonicalPairId
    });
})(typeof window === 'undefined' ? globalThis : window);
