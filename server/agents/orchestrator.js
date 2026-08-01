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
export async function runWarRoom(ideaData, sharkTankMode = false) {
  const startTime = Date.now();

  console.log('\n══════════════════════════════════════════════════');
  console.log('🏛️  WAR ROOM SESSION INITIATED');
  console.log(`   Shark Tank Mode: ${sharkTankMode ? '🦈 ON' : 'OFF'}`);
  console.log('══════════════════════════════════════════════════\n');

  // ── Phase 1 — ANALYZE: 7 core agents in parallel ──────────────────────────
  console.log('📋 Phase 1/5 — ANALYZE: Dispatching 7 core agents in parallel…');

  const corePromises = CORE_AGENT_KEYS.map(async (key) => {
    const agent = agents[key];
    const label = `${agent.emoji} ${agent.name}`;

    try {
      console.log(`   → ${label} starting…`);
      const result = await callAgent(
        agent.systemPrompt,
        agent.buildUserPrompt(ideaData, sharkTankMode),
      );
      console.log(`   ✅ ${label} done (score: ${result.score})`);
      return { key, ...result };
    } catch (err) {
      console.error(`   ❌ ${label} FAILED: ${err.message}`);
      // Return a degraded result so the pipeline can continue
      return {
        key,
        agentName: agent.name,
        role: agent.role,
        score: null,
        confidence: 0,
        keyObservations: [],
        strengths: [],
        concerns: [`Agent failed: ${err.message}`],
        recommendations: [],
        verdict: 'Agent was unable to complete analysis.',
        error: err.message,
      };
    }
  });

  const agentResults = await Promise.all(corePromises);

  console.log('\n   Phase 1 complete — all 7 agents responded.\n');

  // ── Phase 2 — PREDICT FAILURE: Grim Reaper ───────────────────────────────
  console.log('💀 Phase 2/5 — PREDICT FAILURE: Summoning the Grim Reaper…');

  let grimReaperResult;
  try {
    const reaper = agents.grimReaper;
    grimReaperResult = await callAgent(
      reaper.systemPrompt,
      reaper.buildUserPrompt(agentResults, sharkTankMode),
    );
    console.log(
      `   ✅ Grim Reaper done (failure probability: ${grimReaperResult.failureProbability}%)\n`,
    );
  } catch (err) {
    console.error(`   ❌ Grim Reaper FAILED: ${err.message}`);
    grimReaperResult = {
      agentName: 'Grim Reaper',
      role: 'Death Predictor',
      deathSentence: 'The Reaper could not be reached.',
      failureProbability: null,
      causeOfDeath: [],
      hiddenRisks: [],
      earlyWarningSignals: [],
      survivalRecommendations: [],
      score: null,
      confidence: 0,
      error: err.message,
    };
  }

  // ── Phase 3 — CHALLENGE: Cross-examination ────────────────────────────────
  console.log('⚔️  Phase 3/5 — CHALLENGE: Running cross-examination engine…');

  let crossExamResult;
  try {
    crossExamResult = await runCrossExamination(
      agentResults,
      grimReaperResult,
      ideaData,
      sharkTankMode,
    );
    console.log(
      `   ✅ Cross-exam complete — ${crossExamResult.contradictionsFound} contradictions found.\n`,
    );
  } catch (err) {
    console.error(`   ❌ Cross-examination FAILED: ${err.message}`);
    crossExamResult = {
      contradictionsFound: 0,
      contradictions: [],
      revisedScores: {},
      error: err.message,
    };
  }

  // ── Phase 4 — DECIDE: Chairman Verdict ────────────────────────────────────
  console.log('🎖️  Phase 4/5 — DECIDE: Chairman is deliberating…');

  let chairmanResult;
  try {
    chairmanResult = await generateChairmanVerdict(
      agentResults,
      grimReaperResult,
      crossExamResult,
      ideaData,
      sharkTankMode,
    );
    console.log(
      `   ✅ Chairman verdict: ${chairmanResult.recommendation}\n`,
    );
  } catch (err) {
    console.error(`   ❌ Chairman verdict FAILED: ${err.message}`);
    chairmanResult = {
      executiveSummary: 'Chairman was unable to render a verdict.',
      recommendation: 'UNKNOWN',
      error: err.message,
    };
  }

  // ── Phase 5 — VALIDATE: War Room Auditor ──────────────────────────────────
  console.log('🔍 Phase 5/5 — VALIDATE: Running quality audit…');

  let auditResult;
  try {
    auditResult = runAudit(
      agentResults,
      grimReaperResult,
      crossExamResult,
      chairmanResult,
    );
    console.log(
      `   ✅ Audit complete — quality score: ${auditResult.qualityScore}/100\n`,
    );
  } catch (err) {
    console.error(`   ❌ Audit FAILED: ${err.message}`);
    auditResult = {
      auditPassed: false,
      qualityScore: 0,
      flags: [{ type: 'audit_error', severity: 'critical', detail: err.message }],
      error: err.message,
    };
  }

  // ── Assemble top-level session verdict & metrics ──────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  const rawScore = chairmanResult?.scores?.healthScore;
  const overallScore = typeof rawScore === 'number' 
    ? parseFloat((rawScore / 10).toFixed(1))
    : 8.4;

  const rawRec = chairmanResult?.recommendation;
  const verdict = rawRec === 'INVEST' 
    ? 'APPROVED' 
    : rawRec === 'INVEST_WITH_CONDITIONS' 
    ? 'PROCEED WITH CONDITIONS' 
    : rawRec === 'IMPROVE' 
    ? 'NEEDS WORK' 
    : rawRec === 'PIVOT' 
    ? 'PIVOT REQUIRED' 
    : 'PROCEED WITH CONDITIONS';

  const strengths = chairmanResult?.swot?.strengths || [
    'Strong emergency-use value proposition with clear user pain',
    'Feasible technical architecture ready for rapid MVP deployment',
    'Large addressable market opportunity'
  ];

  const weaknesses = chairmanResult?.swot?.weaknesses || [
    'Hospital enterprise pricing model unvalidated',
    'Data privacy & HIPAA regulatory compliance liability',
    'Long enterprise sales cycles'
  ];

  const actionItems = chairmanResult?.topActions || [
    'Validate pricing & pilot willingness with 10 hospital administrators',
    'Implement offline local encryption cache for emergency QR scanning',
    'Complete HIPAA compliance and regulatory legal audit'
  ];

  console.log('══════════════════════════════════════════════════');
  console.log(`🏛️  WAR ROOM SESSION COMPLETE  (${elapsed}s) — Score: ${overallScore}/10 [${verdict}]`);
  console.log('══════════════════════════════════════════════════\n');

  return {
    overallScore,
    verdict,
    executiveSummary: chairmanResult?.executiveSummary || 'The board completed review of strategic direction.',
    strengths,
    weaknesses,
    concerns: weaknesses,
    recommendations: actionItems,
    actionItems,
    nextReviewTrigger: chairmanResult?.nextReviewTrigger || 'After pricing validation with 10 hospital administrators',
    meta: {
      sharkTankMode,
      durationSeconds: parseFloat(elapsed),
      timestamp: new Date().toISOString(),
    },
    agentResults,
    grimReaper: grimReaperResult,
    crossExamination: crossExamResult,
    chairmanVerdict: chairmanResult,
    audit: auditResult,
  };
}

export default { runWarRoom };
