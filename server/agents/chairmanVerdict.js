/**
 * Chairman Verdict
 *
 * Aggregates all pipeline evidence (7 agents, Grim Reaper, cross-examination)
 * into a single structured summary, then makes ONE LLM call to produce the
 * final reasoned verdict with composite scores, SWOT, and recommendation.
 */

import { callAgent } from './azureClient.js';

/** Chairman's system prompt */
const CHAIRMAN_SYSTEM_PROMPT = `You are the Chairman of the Founder's War Room — the ultimate decision-maker.

You have received the complete dossier: analyses from 7 specialist agents, the Grim Reaper's death prediction, and the results of cross-examination where agents were challenged on contradictions.

Your responsibilities:
  1. IDENTIFY CONSENSUS — Where do 4+ agents agree? These are high-confidence findings.
  2. RESOLVE DISAGREEMENTS — When agents conflict, weigh by confidence level. Higher-confidence positions carry more weight. Cross-examination resolutions should be acknowledged.
  3. INCORPORATE DEATH PREDICTION — The Grim Reaper's failure probability and causes of death must be factored into your risk assessment. Do not dismiss them.
  4. REASON STEP-BY-STEP — Show your logic chain. "Because Agent X found Y, and Agent Z confirmed W, therefore…"
  5. GENERATE COMPOSITE SCORES — Produce 5 scores (0-100):
     • healthScore: Overall startup health (weighted average of agent scores × 10)
     • investmentReadiness: How ready is this for funding?
     • marketPotential: Total addressable opportunity
     • riskIndex: Overall risk level (higher = riskier)
     • innovationScore: How novel and defensible is this?
  6. PRODUCE SWOT — Synthesize a SWOT matrix from all agents' strengths, concerns, and observations.
  7. ISSUE RECOMMENDATION — Pick exactly one:
     • INVEST — Strong across the board, ready for funding
     • INVEST_WITH_CONDITIONS — Promising but specific issues must be addressed first
     • IMPROVE — Good foundation, needs significant work
     • PIVOT — Core thesis has issues, needs fundamental rethinking
     • REJECT — Fatal flaws, not viable
  8. LIST TOP 3 ACTIONS — The three most impactful things the founder should do next.

Your personality:
  • Authoritative — your word is final.
  • Fair — you weigh all evidence, even if agents disagree.
  • Decisive — you do not hedge. You pick a recommendation and own it.
  • In Shark Tank mode: even more demanding, scores skew lower, REJECT is used more freely.

Respond with valid JSON ONLY (no markdown code fences):
{
  "executiveSummary": "2-3 sentence high-level summary",
  "consensus": ["point 1", "point 2", ...],
  "criticalSplits": ["split 1", "split 2", ...],
  "recommendation": "INVEST | INVEST_WITH_CONDITIONS | IMPROVE | PIVOT | REJECT",
  "reasoningChain": "Step-by-step reasoning explaining how you arrived at the recommendation...",
  "topActions": ["action 1", "action 2", "action 3"],
  "scores": {
    "healthScore": <0-100>,
    "investmentReadiness": <0-100>,
    "marketPotential": <0-100>,
    "riskIndex": <0-100>,
    "innovationScore": <0-100>
  },
  "swot": {
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "opportunities": ["...", "..."],
    "threats": ["...", "..."]
  }
}`;

/**
 * Build the Chairman's user prompt by aggregating all pipeline evidence.
 *
 * @param {object[]} agentResults
 * @param {object}   grimReaper
 * @param {object}   crossExam
 * @param {object}   ideaData
 * @param {boolean}  sharkTankMode
 * @returns {string}
 */
function buildChairmanUserPrompt(
  agentResults,
  grimReaper,
  crossExam,
  ideaData,
  sharkTankMode,
) {
  const mode = sharkTankMode
    ? '\n⚠️  SHARK TANK MODE — apply maximum scrutiny. Be harsher with scores and more willing to REJECT.\n'
    : '';

  // ── Agent summaries
  const agentSummaries = agentResults
    .map(
      (r) => `▸ ${r.agentName} (${r.role})
    Score: ${r.score}/10 | Confidence: ${r.confidence}
    Strengths: ${(r.strengths || []).join('; ')}
    Concerns: ${(r.concerns || []).join('; ')}
    Verdict: ${r.verdict}`,
    )
    .join('\n\n');

  // ── Grim Reaper summary
  const reaperSummary = `▸ Grim Reaper — Death Predictor
    Failure Probability: ${grimReaper.failureProbability}%
    Death Sentence: ${grimReaper.deathSentence}
    Causes of Death: ${(grimReaper.causeOfDeath || []).map((c) => `#${c.rank} ${c.cause}`).join('; ')}
    Hidden Risks: ${(grimReaper.hiddenRisks || []).join('; ')}`;

  // ── Cross-examination summary
  const crossExamSummary = crossExam.contradictionsFound > 0
    ? `${crossExam.contradictionsFound} contradictions detected:\n${crossExam.contradictions
        .map(
          (c) =>
            `  • ${c.dimension}: ${c.reasons.join(' | ')} → Resolution: ${JSON.stringify(c.resolution)}`,
        )
        .join('\n')}`
    : 'No contradictions detected between agents.';

  return `${mode}
=== STARTUP IDEA ===
${JSON.stringify(ideaData, null, 2)}

=== AGENT ANALYSES ===
${agentSummaries}

=== GRIM REAPER ANALYSIS ===
${reaperSummary}

=== CROSS-EXAMINATION RESULTS ===
${crossExamSummary}

=== REVISED SCORES (from cross-examination) ===
${Object.keys(crossExam.revisedScores || {}).length > 0
  ? Object.entries(crossExam.revisedScores)
      .map(
        ([key, v]) =>
          `  • ${v.agent}: ${v.originalScore} → ${v.revisedScore} (${v.action}) — ${v.reasoning}`,
      )
      .join('\n')
  : 'No scores were revised.'}

Now deliberate and issue your final verdict.`;
}

/**
 * Generate the Chairman's final verdict.
 *
 * @param {object[]} agentResults
 * @param {object}   grimReaper
 * @param {object}   crossExam
 * @param {object}   ideaData
 * @param {boolean}  sharkTankMode
 * @returns {Promise<object>}
 */
export async function generateChairmanVerdict(
  agentResults,
  grimReaper,
  crossExam,
  ideaData,
  sharkTankMode,
) {
  const userPrompt = buildChairmanUserPrompt(
    agentResults,
    grimReaper,
    crossExam,
    ideaData,
    sharkTankMode,
  );

  const result = await callAgent(CHAIRMAN_SYSTEM_PROMPT, userPrompt, {
    temperature: 0.5,
    maxTokens: 4096,
    agentName: 'Chairman',
  });

  return result;
}

export default { generateChairmanVerdict };
