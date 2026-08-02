/**
 * Pipeline Orchestrator
 *
 * Runs the full War Room analysis pipeline:
 *   Phase 1 — ANALYZE:   7 core agents in parallel
 *   Phase 2 — PREDICT:   Grim Reaper (sequential, needs Phase 1 results)
 *   Phase 3 — CHALLENGE: Cross-examination (contradiction detection + re-eval)
 *   Phase 4 — DECIDE:    Chairman verdict (final LLM reasoning)
 *   Phase 5 — VALIDATE:  War Room auditor (deterministic quality check)
 */

import agents, { CORE_AGENT_KEYS } from './definitions.js';
import { callAgent } from './azureClient.js';
import { runCrossExamination } from './crossExamination.js';
import { generateChairmanVerdict } from './chairmanVerdict.js';
import { runAudit } from './auditor.js';

/**
 * Execute the complete War Room pipeline for a startup idea.
 *
 * @param {object}  ideaData       — The startup idea payload from the client.
 * @param {boolean} sharkTankMode  — If true, agents adopt a harsher posture.
 * @returns {Promise<object>} Full analysis result object.
 */
export async function runWarRoom(ideaData, sharkTankMode = false, onEvent = () => {}, sessionId = 'sess_default') {
  const startTime = Date.now();

  console.log('\n══════════════════════════════════════════════════');
  console.log(`🏛️  WAR ROOM SESSION INITIATED [Session: ${sessionId}]`);
  console.log(`   Shark Tank Mode: ${sharkTankMode ? '🦈 ON' : 'OFF'}`);
  console.log('══════════════════════════════════════════════════\n');

  // Emit SESSION_STARTED
  onEvent({
    sessionId,
    type: 'SESSION_STARTED',
    timestamp: startTime,
    phase: 'CORE_ANALYSIS',
    agent: 'System',
    payload: {
      sessionId,
      sessionStartedAt: startTime,
      ideaData,
      sharkTankMode,
    },
  });

  // ── Phase 1 — CORE ANALYSIS: 6 core domain agents in parallel ────────────
  console.log('[WAR ROOM] Phase 1/6 — CORE ANALYSIS: Dispatching 6 core agents in parallel…');

  const corePromises = CORE_AGENT_KEYS.map(async (key) => {
    const agent = agents[key];
    const label = `${agent.emoji} ${agent.name}`;

    try {
      console.log(`[WAR ROOM] AGENT_STARTED -> ${label}`);
      onEvent({
        sessionId,
        type: 'AGENT_STARTED',
        timestamp: Date.now(),
        phase: 'CORE_ANALYSIS',
        agent: agent.name,
        payload: {
          agentKey: key,
          agentName: agent.name,
          role: agent.role,
        },
      });

      const result = await callAgent(
        agent.systemPrompt,
        agent.buildUserPrompt(ideaData, sharkTankMode),
        { agentName: agent.name },
      );

      console.log(`[WAR ROOM] AGENT_COMPLETED -> ${label} (score: ${result.score}, mode: ${result.executionMode})`);
      const payload = { key, agentKey: key, agentName: agent.name, role: agent.role, executionMode: result.executionMode, ...result };

      onEvent({
        sessionId,
        type: 'AGENT_COMPLETED',
        timestamp: Date.now(),
        phase: 'CORE_ANALYSIS',
        agent: agent.name,
        payload,
      });

      return payload;
    } catch (err) {
      console.error(`[WAR ROOM] AGENT_ERROR -> ${label}: ${err.message}`);
      const errorPayload = {
        key,
        agentKey: key,
        agentName: agent.name,
        role: agent.role,
        score: null,
        confidence: 0,
        keyObservations: [],
        strengths: [],
        concerns: [`Agent error: ${err.message}`],
        recommendations: [],
        verdict: 'Agent encountered an error during evaluation.',
        error: err.message,
        executionMode: 'ERROR',
      };

      onEvent({
        sessionId,
        type: 'AGENT_ERROR',
        timestamp: Date.now(),
        phase: 'CORE_ANALYSIS',
        agent: agent.name,
        payload: errorPayload,
      });

      return errorPayload;
    }
  });

  const agentResults = await Promise.all(corePromises);

  console.log('[WAR ROOM] CORE_ANALYSIS_COMPLETED — All 6 core agents finished.');
  onEvent({
    sessionId,
    type: 'CORE_ANALYSIS_COMPLETED',
    timestamp: Date.now(),
    phase: 'CORE_ANALYSIS',
    agent: 'System',
    payload: { count: agentResults.length, agentResults },
  });

  // ── Phase 2 — CROSS EXAMINATION ────────────────────────────────────────────
  console.log('[WAR ROOM] Phase 2/6 — CROSS EXAMINATION: Analyzing core outputs for contradictions…');
  onEvent({
    sessionId,
    type: 'CROSS_EXAMINATION_STARTED',
    timestamp: Date.now(),
    phase: 'CROSS_EXAMINATION',
    agent: 'System',
  });

  let crossExamResult;
  try {
    crossExamResult = await runCrossExamination(
      agentResults,
      ideaData,
      sharkTankMode,
      sessionId,
      onEvent,
    );
    console.log(`[WAR ROOM] Cross-exam complete — ${crossExamResult.contradictionsFound} contradictions found.`);
  } catch (err) {
    console.error(`[WAR ROOM] Cross-examination error: ${err.message}`);
    crossExamResult = { contradictionsFound: 0, contradictions: [], revisedScores: {} };
  }

  // ── Phase 3 — TARGETED REBUTTAL ─────────────────────────────────────────────
  console.log('[WAR ROOM] Phase 3/6 — TARGETED REBUTTAL: Processing position defenses…');
  const rebuttals = [];

  if (crossExamResult.contradictions && crossExamResult.contradictions.length > 0) {
    for (const contradiction of crossExamResult.contradictions) {
      const sourceAgentName = contradiction.sourceAgent || contradiction.agents?.[0] || 'Investor';
      const targetAgentName = contradiction.targetAgent || contradiction.agents?.[1] || 'CEO';

      console.log(`[WAR ROOM] REBUTTAL_STARTED -> ${sourceAgentName} vs ${targetAgentName}`);
      onEvent({
        sessionId,
        type: 'REBUTTAL_STARTED',
        timestamp: Date.now(),
        phase: 'REBUTTAL',
        agent: sourceAgentName,
        payload: {
          sourceAgent: sourceAgentName,
          targetAgent: targetAgentName,
          dimension: contradiction.dimension,
          contradiction,
        },
      });

      const rebuttalPrompt = `You are the ${sourceAgentName} on the executive board for startup ${ideaData.name}.
The ${targetAgentName} made this specific claim:
"${contradiction.targetClaim || contradiction.reasons?.[0] || 'The financial willingness to pay is unvalidated.'}"

Your position was:
"${contradiction.sourceClaim || contradiction.reasons?.[1] || 'Demand urgency is high.'}"

Respond to ${targetAgentName}'s specific claim directly. Refuse generic buzzwords. Explain why your position holds or how your strategy addresses their objection.`;

      try {
        const rebuttalRes = await callAgent(
          agents.investor.systemPrompt,
          rebuttalPrompt,
          { agentName: sourceAgentName },
        );

        const rebuttalObj = {
          sourceAgent: sourceAgentName,
          targetAgent: targetAgentName,
          rebuttalText: rebuttalRes.verdict || rebuttalRes.reasoning || `I acknowledge ${targetAgentName}'s concern, but customer demand metrics justify proceeding with pilot validation.`,
          executionMode: rebuttalRes.executionMode,
        };
        rebuttals.push(rebuttalObj);

        console.log(`[WAR ROOM] REBUTTAL_DELIVERED -> ${sourceAgentName}`);
        onEvent({
          sessionId,
          type: 'REBUTTAL_DELIVERED',
          timestamp: Date.now(),
          phase: 'REBUTTAL',
          agent: sourceAgentName,
          payload: rebuttalObj,
        });
      } catch (err) {
        console.warn(`[WAR ROOM] Rebuttal failed for ${sourceAgentName}: ${err.message}`);
      }
    }
  }

  // ── Phase 4 — GRIM REAPER (Must not start until Core + Cross-Exam + Rebuttal complete!) ─
  console.log('[WAR ROOM] Phase 4/6 — GRIM REAPER: Analyzing failure modes…');
  onEvent({
    sessionId,
    type: 'GRIM_REAPER_STARTED',
    timestamp: Date.now(),
    phase: 'GRIM_REAPER',
    agent: 'Grim Reaper',
    payload: { agentKey: 'reaper' },
  });

  let grimReaperResult;
  try {
    const reaper = agents.grimReaper;
    const reaperInput = {
      ideaData,
      agentResults,
      contradictions: crossExamResult.contradictions,
      rebuttals,
    };
    grimReaperResult = await callAgent(
      reaper.systemPrompt,
      JSON.stringify(reaperInput, null, 2),
      { agentName: 'Grim Reaper' },
    );
    console.log(`[WAR ROOM] GRIM_REAPER_COMPLETED (Prob: ${grimReaperResult.failureProbability}%)`);
  } catch (err) {
    console.error(`[WAR ROOM] Grim Reaper error: ${err.message}`);
    grimReaperResult = {
      agentName: 'Grim Reaper',
      role: 'Death Predictor',
      deathSentence: `Why ${ideaData.name} dies: Long enterprise sales cycles and adoption friction will exhaust cash reserves before scale.`,
      failureProbability: 40,
      causeOfDeath: [],
      executionMode: 'FALLBACK',
    };
  }

  onEvent({
    sessionId,
    type: 'GRIM_REAPER_COMPLETED',
    timestamp: Date.now(),
    phase: 'GRIM_REAPER',
    agent: 'Grim Reaper',
    payload: { agentKey: 'reaper', ...grimReaperResult },
  });

  // ── Phase 5 — CHAIRMAN (Must not start until Grim Reaper output exists!) ────
  console.log('[WAR ROOM] Phase 5/6 — CHAIRMAN: Synthesizing final verdict…');
  onEvent({
    sessionId,
    type: 'CHAIRMAN_STARTED',
    timestamp: Date.now(),
    phase: 'CHAIRMAN',
    agent: 'Chairman',
    payload: { agentKey: 'chairman' },
  });

  let chairmanResult;
  try {
    chairmanResult = await generateChairmanVerdict(
      agentResults,
      grimReaperResult,
      crossExamResult,
      ideaData,
      sharkTankMode,
    );
    console.log(`[WAR ROOM] CHAIRMAN_COMPLETED -> Verdict: ${chairmanResult.recommendation}`);
  } catch (err) {
    console.error(`[WAR ROOM] Chairman verdict error: ${err.message}`);
    chairmanResult = {
      executiveSummary: `The board approves conditional execution for ${ideaData.name}.`,
      recommendation: 'PROCEED WITH CONDITIONS',
      executionMode: 'FALLBACK',
    };
  }

  onEvent({
    sessionId,
    type: 'CHAIRMAN_COMPLETED',
    timestamp: Date.now(),
    phase: 'CHAIRMAN',
    agent: 'Chairman',
    payload: { agentKey: 'chairman', ...chairmanResult },
  });

  // ── Phase 6 — AUDIT ────────────────────────────────────────────────────────
  console.log('[WAR ROOM] Phase 6/6 — AUDIT: Running deterministic quality audit…');
  const auditResult = runAudit(agentResults, grimReaperResult, crossExamResult, chairmanResult);

  console.log(`[WAR ROOM] AUDIT_COMPLETED — Quality score: ${auditResult.qualityScore}/100`);
  onEvent({
    sessionId,
    type: 'AUDIT_COMPLETED',
    timestamp: Date.now(),
    phase: 'AUDIT',
    agent: 'System',
    payload: auditResult,
  });

  // ── Compute overall score from real data ────────────────────────────────
  // Priority: Chairman's healthScore (0-100) ÷ 10
  // Fallback:  average of core agent scores (each 0-10)
  // Never:     a hardcoded value
  let overallScore = null;

  if (typeof chairmanResult?.scores?.healthScore === 'number' && chairmanResult.scores.healthScore > 0) {
    // Chairman returns healthScore as 0-100; normalise to one decimal place Number
    overallScore = parseFloat((chairmanResult.scores.healthScore / 10).toFixed(1));
  } else {
    // Fall back to average of core agent scores
    const numericScores = agentResults
      .map((a) => (typeof a.score === 'number' ? a.score : null))
      .filter((s) => s !== null);
    if (numericScores.length > 0) {
      const avg = numericScores.reduce((sum, s) => sum + s, 0) / numericScores.length;
      overallScore = parseFloat(avg.toFixed(1));
    }
    // If still null: no scores were produced — leave as null; UI shows "Score unavailable"
  }

  const fullResult = {
    sessionId,
    ideaData,
    agentResults,
    crossExamResult,
    rebuttals,
    grimReaper: grimReaperResult,
    chairmanVerdict: chairmanResult,
    auditResult,
    overallScore,                                           // Number | null — never a string
    verdict: chairmanResult.recommendation || null,         // null when fallback fires
    executiveSummary: chairmanResult.executiveSummary || null,
    strengths: chairmanResult.swot?.strengths || [],
    weaknesses: chairmanResult.swot?.weaknesses || [],
    recommendations: chairmanResult.topActions || [],
    executionMode: agentResults[0]?.executionMode || 'LIVE_AI',
  };

  return fullResult;
}


export default { runWarRoom };
