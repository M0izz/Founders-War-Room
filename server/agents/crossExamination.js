/**
 * Cross-Examination Engine
 *
 * Deterministically detects contradictions between paired agents, then uses
 * the LLM to re-evaluate positions where genuine conflicts exist.
 *
 * Agent pairing rules:
 *   Investor  ↔ Customer      (viability vs demand)
 *   CEO       ↔ CTO           (vision vs feasibility)
 *   Marketing ↔ Competitor    (growth vs saturation)
 *   CEO       ↔ Competitor    (positioning vs landscape)
 *   Investor  ↔ Risk Advisor  (opportunity vs risk)
 */

import { callAgent } from './azureClient.js';
import agents from './definitions.js';

// ── Defined pairings ────────────────────────────────────────────────────────
const AGENT_PAIRINGS = [
  { a: 'investor', b: 'customer', dimension: 'viability vs demand' },
  { a: 'ceo', b: 'cto', dimension: 'vision vs feasibility' },
  { a: 'marketing', b: 'competitor', dimension: 'growth vs saturation' },
  { a: 'ceo', b: 'competitor', dimension: 'positioning vs landscape' },
  { a: 'investor', b: 'riskAdvisor', dimension: 'opportunity vs risk' },
];

/**
 * Tokenise a string into lowercase words for keyword overlap detection.
 * @param {string} text
 * @returns {Set<string>}
 */
function tokenise(text) {
  return new Set(
    (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
}

/**
 * Detect keyword overlap between two arrays of short phrases.
 * @param {string[]} listA
 * @param {string[]} listB
 * @returns {string[]} Matching keywords
 */
function findKeywordOverlap(listA, listB) {
  const tokensA = new Set();
  listA.forEach((phrase) => tokenise(phrase).forEach((t) => tokensA.add(t)));

  const matches = [];
  listB.forEach((phrase) => {
    tokenise(phrase).forEach((t) => {
      if (tokensA.has(t)) matches.push(t);
    });
  });

  return [...new Set(matches)];
}

/**
 * Look up an agent result by its definition key.
 * @param {object[]} results
 * @param {string}   key
 * @returns {object|undefined}
 */
function findResult(results, key) {
  const agentName = agents[key]?.name;
  return results.find((r) => r.key === key || r.agentName === agentName);
}

/**
 * Run the cross-examination engine.
 *
 * @param {object[]} agentResults     — The 7 core agent results.
 * @param {object}   grimReaperResult — Grim Reaper analysis.
 * @param {object}   ideaData         — Original startup idea payload.
 * @param {boolean}  sharkTankMode    — Harsh mode flag.
 * @returns {Promise<object>}
 */
export async function runCrossExamination(
  agentResults,
  grimReaperResult,
  ideaData,
  sharkTankMode,
) {
  const contradictions = [];

  // ── Step 1: Deterministic contradiction detection ─────────────────────────
  for (const pairing of AGENT_PAIRINGS) {
    const resultA = findResult(agentResults, pairing.a);
    const resultB = findResult(agentResults, pairing.b);

    if (!resultA || !resultB) continue;

    // Skip agents that errored out
    if (resultA.score === null || resultB.score === null) continue;

    const reasons = [];

    // ── Check 1: High-confidence disagreement (both > 0.6, score diff > 3)
    if (
      resultA.confidence > 0.6 &&
      resultB.confidence > 0.6 &&
      Math.abs(resultA.score - resultB.score) > 3
    ) {
      reasons.push(
        `High-confidence disagreement: ${resultA.agentName} scored ${resultA.score} (conf ${resultA.confidence}) vs ${resultB.agentName} scored ${resultB.score} (conf ${resultB.confidence})`,
      );
    }

    // ── Check 2: Strength-concern keyword overlap
    const overlapAB = findKeywordOverlap(
      resultA.strengths || [],
      resultB.concerns || [],
    );
    const overlapBA = findKeywordOverlap(
      resultB.strengths || [],
      resultA.concerns || [],
    );

    if (overlapAB.length > 0) {
      reasons.push(
        `${resultA.agentName}'s strengths overlap with ${resultB.agentName}'s concerns on: ${overlapAB.join(', ')}`,
      );
    }
    if (overlapBA.length > 0) {
      reasons.push(
        `${resultB.agentName}'s strengths overlap with ${resultA.agentName}'s concerns on: ${overlapBA.join(', ')}`,
      );
    }

    // ── Check 3: Score extremes (one > 7, other < 4)
    if (
      (resultA.score > 7 && resultB.score < 4) ||
      (resultB.score > 7 && resultA.score < 4)
    ) {
      reasons.push(
        `Extreme score divergence: ${resultA.agentName} (${resultA.score}) vs ${resultB.agentName} (${resultB.score})`,
      );
    }

    if (reasons.length > 0) {
      contradictions.push({
        agentA: pairing.a,
        agentB: pairing.b,
        dimension: pairing.dimension,
        reasons,
        resultA,
        resultB,
      });
    }
  }

  // ── Step 2: LLM re-evaluation for found contradictions ────────────────────
  const revisedScores = {};
  const resolvedContradictions = [];

  for (const contradiction of contradictions) {
    // Determine the higher-scoring agent (they must defend their position)
    const higher =
      (contradiction.resultA.score ?? 0) >= (contradiction.resultB.score ?? 0)
        ? contradiction.resultA
        : contradiction.resultB;
    const lower =
      higher === contradiction.resultA
        ? contradiction.resultB
        : contradiction.resultA;

    const higherKey =
      higher === contradiction.resultA
        ? contradiction.agentA
        : contradiction.agentB;

    const reEvalPrompt = `You are the ${higher.agentName} agent (${higher.role}).

You previously scored this startup ${higher.score}/10 with confidence ${higher.confidence}.

However, the ${lower.agentName} agent (${lower.role}) scored it ${lower.score}/10 with confidence ${lower.confidence}.

Their concerns were:
${JSON.stringify(lower.concerns, null, 2)}

Their key observations:
${JSON.stringify(lower.keyObservations, null, 2)}

The detected contradiction:
${contradiction.reasons.join('\n')}

Re-evaluate your position. Either:
1. DEFEND your original score with stronger evidence
2. REVISE your score in light of this opposing analysis

Respond in JSON:
{
  "action": "DEFEND" or "REVISE",
  "originalScore": ${higher.score},
  "revisedScore": <number 0-10>,
  "revisedConfidence": <number 0.0-1.0>,
  "reasoning": "Why you are defending or revising"
}`;

    try {
      const agentDef = agents[higherKey];
      const reEval = await callAgent(agentDef.systemPrompt, reEvalPrompt);

      revisedScores[higherKey] = {
        agent: higher.agentName,
        originalScore: higher.score,
        revisedScore: reEval.revisedScore ?? higher.score,
        revisedConfidence: reEval.revisedConfidence ?? higher.confidence,
        action: reEval.action,
        reasoning: reEval.reasoning,
      };

      resolvedContradictions.push({
        dimension: contradiction.dimension,
        agents: [contradiction.agentA, contradiction.agentB],
        reasons: contradiction.reasons,
        resolution: reEval,
      });

      console.log(
        `   ⚖️  ${higher.agentName} ${reEval.action === 'REVISE' ? 'REVISED' : 'DEFENDED'}: ${higher.score} → ${reEval.revisedScore ?? higher.score}`,
      );
    } catch (err) {
      console.warn(
        `   ⚠️  Re-evaluation failed for ${higher.agentName}: ${err.message}`,
      );
      resolvedContradictions.push({
        dimension: contradiction.dimension,
        agents: [contradiction.agentA, contradiction.agentB],
        reasons: contradiction.reasons,
        resolution: { error: err.message },
      });
    }
  }

  return {
    contradictionsFound: contradictions.length,
    contradictions: resolvedContradictions,
    revisedScores,
  };
}

export default { runCrossExamination };
