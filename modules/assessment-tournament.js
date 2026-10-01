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
            invariant(typeof item.conversationTopic === 'string' && item.conversationTopic.trim(), `${item.id}.conversationTopic is required`);
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
        invariant(settings.valueRounds <= contrastSchedule(bank).length,
            'valueRounds cannot exceed the pleasure-vs-caution value pairs');
        if (settings.dotDecisiveShare !== undefined) {
            invariant(Number.isFinite(settings.dotDecisiveShare) && settings.dotDecisiveShare > 0.5 && settings.dotDecisiveShare <= 1,
                'settings.dotDecisiveShare must be above 0.5 and at most 1');
        }
        invariant(settings.minimumDotResponses <= settings.valueRounds, 'minimumDotResponses cannot exceed valueRounds');
        return true;
    }

    // Value rounds only compare one pleasure-leaning card (signal >= 1) with
    // one cautious card (signal <= -1), so every answer is informative for
    // the dot. The order never shows the same card in two rounds in a row.
    function contrastSchedule(bank) {
        const positive = bank.values.filter(item => item.operatorSignal >= 1).map(item => item.id);
        const cautious = bank.values.filter(item => item.operatorSignal <= -1).map(item => item.id);
        const remaining = [];
        positive.forEach(a => cautious.forEach(b => remaining.push([a, b])));
        const order = [];
        const seen = Object.fromEntries([...positive, ...cautious].map(id => [id, 0]));
        while (remaining.length) {
            const last = order.at(-1) || [];
            const pickIndex = remaining
                .map((pair, index) => ({ pair, index, clash: pair.some(id => last.includes(id)) ? 1 : 0, load: seen[pair[0]] + seen[pair[1]] }))
                .sort((x, y) => x.clash - y.clash || x.load - y.load || x.index - y.index)[0].index;
            const [pair] = remaining.splice(pickIndex, 1);
            pair.forEach(id => { seen[id] += 1; });
            order.push(pair);
        }
        return order;
    }

    // The healthier answer is stored first in the bank. Show it on the right
    // for about half of the questions, so clients cannot learn "left is right".
    function choiceOrderSwapped(questionId) {
        let hash = 0;
        for (const character of String(questionId)) hash = (hash * 31 + character.codePointAt(0)) % 1000003;
        return hash % 2 === 1;
    }

    function createState(bank) {
        validateBank(bank);
        return {
            schemaVersion: 1,
            contentVersion: bank.contentVersion,
            answers: {},
            answeredIds: [],
            valueHistory: [],
            history: []
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
        const restored = { schemaVersion: 1, contentVersion: bank.contentVersion, answers, answeredIds, valueHistory, history: [] };
        restored.history = reconstructResponseHistory(bank, restored);
        return restored;
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
        const pair = contrastSchedule(bank)
            .map(([a, b]) => ({ a, b, pairId: canonicalPairId(a, b) }))
            .find(candidate => !seen.has(candidate.pairId));
        if (!pair) return null;
        const valuesById = Object.fromEntries(bank.values.map(item => [item.id, item]));
        // Each card moves between the left and the right side over the rounds.
        const aBalance = stats[pair.a].left - stats[pair.a].right;
        const bBalance = stats[pair.b].left - stats[pair.b].right;
        const aOnLeft = aBalance < bBalance || (aBalance === bBalance && state.valueHistory.length % 2 === 0);
        const left = valuesById[aOnLeft ? pair.a : pair.b];
        const right = valuesById[aOnLeft ? pair.b : pair.a];
        return {
            kind: 'value',
            id: `value:${pair.pairId}`,
            pairId: pair.pairId,
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
            choices: (choiceOrderSwapped(question.id) ? [...question.choices].reverse() : question.choices)
                .map(choice => ({ id: choice.id, label: choice.label })),
            coverage: [...question.coverage],
            tier: question.tier
        };
    }

    function selectNextFromState(bank, state) {
        const coverageQuestion = nextCoverageQuestion(bank, state);
        if (coverageQuestion) return questionItem(coverageQuestion);
        const valuePair = nextValuePair(bank, state);
        if (valuePair) return valuePair;
        const tieBreaker = nextTieBreaker(bank, state);
        return tieBreaker ? questionItem(tieBreaker) : { kind: 'complete', id: 'complete' };
    }

    function selectNext(bank, stateCandidate) {
        validateBank(bank);
        return selectNextFromState(bank, restoreState(bank, stateCandidate));
    }

    function applyAnswer(bank, state, item, response) {
        if (item.kind === 'question') {
            invariant(!state.answeredIds.includes(item.id), `question ${item.id} was already consumed`);
            const question = bank.questions.find(candidate => candidate.id === item.id);
            invariant(question, `question ${item.id} is unknown`);
            const allowed = [...question.choices.map(choice => choice.id), RESPONSE_EQUAL, RESPONSE_SKIP];
            invariant(allowed.includes(response), `response ${response} is invalid for ${item.id}`);
            return {
                ...state,
                answers: { ...state.answers, [item.id]: response },
                answeredIds: [...state.answeredIds, item.id],
                history: [...state.history, { kind: 'question', id: item.id }]
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
                }],
                history: [...state.history, { kind: 'value', id: item.pairId }]
            };
        }
        throw new Error(`Assessment item cannot be answered: ${item.kind}`);
    }

    function reconstructResponseHistory(bank, target) {
        const questionIds = new Set(target.answeredIds);
        const valuesByPair = new Map(target.valueHistory.map(entry => [entry.pairId, entry]));
        let replay = createState(bank);
        const history = [];
        const maxSteps = bank.questions.length + bank.settings.valueRounds;
        for (let step = 0; step < maxSteps; step += 1) {
            const item = selectNextFromState(bank, replay);
            if (item.kind === 'complete') break;
            let response;
            if (item.kind === 'question') {
                if (!questionIds.has(item.id)) break;
                response = target.answers[item.id];
            } else {
                const value = valuesByPair.get(item.pairId);
                if (!value) break;
                response = value.response;
            }
            replay = applyAnswer(bank, replay, item, response);
            history.push(replay.history[replay.history.length - 1]);
        }
        return history;
    }

    function answerItem(bank, stateCandidate, item, response) {
        validateBank(bank);
        return applyAnswer(bank, restoreState(bank, stateCandidate), item, response);
    }

    function undoLast(bank, stateCandidate) {
        validateBank(bank);
        const state = restoreState(bank, stateCandidate);
        const last = state.history[state.history.length - 1];
        if (!last) return state;
        if (last.kind === 'question') {
            const answers = { ...state.answers };
            delete answers[last.id];
            return restoreState(bank, {
                ...state,
                answers,
                answeredIds: state.answeredIds.filter(id => id !== last.id)
            });
        }
        return restoreState(bank, {
            ...state,
            valueHistory: state.valueHistory.filter(entry => entry.pairId !== last.id)
        });
    }

    // Private service-fit dot. Each round is pleasure-leaning vs cautious, so
    // the dot counts picks: green when at least 75% of the client's choices
    // lean to pleasure, red when at least 75% lean to caution, orange
    // otherwise or when there are too few answers. Equal and Skip never count.
    function dotResult(bank, state) {
        const valuesById = Object.fromEntries(bank.values.map(item => [item.id, item]));
        const selected = state.valueHistory
            .map(entry => entry.response)
            .filter(response => valuesById[response]);
        const distinct = new Set(selected);
        if (selected.length < bank.settings.minimumDotResponses || distinct.size < bank.settings.minimumDotDistinctValues) {
            return DOT_ORANGE;
        }
        const share = bank.settings.dotDecisiveShare ?? 0.75;
        const needed = Math.ceil(selected.length * share);
        const positive = selected.filter(id => valuesById[id].operatorSignal >= 1).length;
        const cautious = selected.filter(id => valuesById[id].operatorSignal <= -1).length;
        if (positive >= needed) return 'green';
        if (cautious >= needed) return 'red';
        return DOT_ORANGE;
    }

    function statusFor(score, evidenceCount, minimumEvidence) {
        if (evidenceCount < minimumEvidence) return 'Not enough answers';
        if (score >= 0.67) return 'Higher answer-support signal';
        if (score >= 0.45) return 'Mixed answer-support signal';
        return 'Lower answer-support signal';
    }

    function buildResult(bank, stateCandidate) {
        validateBank(bank);
        const state = restoreState(bank, stateCandidate);
        const totals = questionScore(bank, state);
        const chakraById = Object.fromEntries(bank.chakras.map(item => [item.id, item]));
        const chakras = CHAKRA_IDS.map(id => {
            const evidence = totals[id].evidence;
            const score = evidence ? totals[id].sum / evidence : 0.5;
            return {
                id,
                name: chakraById[id].name,
                score,
                evidenceCount: evidence,
                status: statusFor(score, evidence, bank.settings.minimumEvidencePerChakra),
                archetype: chakraById[id].archetype
            };
        });
        const eligibleChakras = chakras.filter(item => item.evidenceCount >= bank.settings.minimumEvidencePerChakra);
        let focusAreas = [];
        let focusStatus = 'insufficient-evidence';
        // A relative weakest-area comparison needs minimum coverage for all seven chakras.
        if (eligibleChakras.length === CHAKRA_IDS.length) {
            const lowestScore = Math.min(...eligibleChakras.map(item => item.score));
            // Treat near-ties as shared focus candidates; this is a prompt threshold, not a confidence interval.
            const tolerance = 0.1;
            focusAreas = eligibleChakras.filter(item => item.score <= lowestScore + tolerance);
            if (focusAreas.length === eligibleChakras.length) {
                focusAreas = [];
                focusStatus = 'no-clear-lowest';
            } else {
                focusStatus = 'candidate';
            }
        }
        const valueWins = valueStats(bank, state);
        const leadingValues = [...bank.values]
            .sort((a, b) => valueWins[b.id].wins - valueWins[a.id].wins || a.id.localeCompare(b.id))
            .filter(item => valueWins[item.id].wins > 0)
            .slice(0, 2)
            .map(item => item.archetype);
        const leadingChakras = [...chakras].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, 2).map(item => item.archetype);
        const bestSupportedChakra = chakras
            .filter(item => item.evidenceCount >= bank.settings.minimumEvidencePerChakra)
            .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0];
        const rapportChakra = bestSupportedChakra && chakraById[bestSupportedChakra.id];
        return {
            complete: selectNext(bank, state).kind === 'complete',
            chakras,
            focusAreas,
            focusStatus,
            archetypes: [...new Set([...leadingChakras, ...leadingValues])].slice(0, 3),
            rapportCue: rapportChakra?.conversationTopic
                ? { chakraId: rapportChakra.id, topic: rapportChakra.conversationTopic }
                : null,
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
        undoLast,
        buildResult,
        canonicalPairId,
        contrastSchedule,
        choiceOrderSwapped
    });
})(typeof window === 'undefined' ? globalThis : window);
