/**
 * War Room Auditor
 *
 * PURE DETERMINISTIC — no LLM calls.
 * Validates the quality and internal consistency of the entire War Room
 * analysis pipeline output.
 *
 * Checks:
 *   1. Score-Sentiment Consistency
 *   2. Confidence Calibration
 *   3. Cross-Exam Coverage
 *   4. Grim Reaper Corroboration
 *   5. Recommendation Alignment
 */

/**
 * Run the quality audit on the complete pipeline output.
 *
 * @param {object[]} agentResults     — The 7 core agent results.
 * @param {object}   grimReaper       — Grim Reaper analysis.
 * @param {object}   crossExam        — Cross-examination results.
 * @param {object}   chairmanVerdict  — Chairman's final verdict.
 * @returns {object} Audit report.
 */
export function runAudit(agentResults, grimReaper, crossExam, chairmanVerdict) {
  const flags = [];

  // ── 1. Score-Sentiment Consistency ────────────────────────────────────────
  // If an agent lists ≥3 concerns but scores > 7, something is off.
  for (const agent of agentResults) {
    if (agent.score === null) continue; // Skip errored agents

    const concernCount = (agent.concerns || []).length;
    if (concernCount >= 3 && agent.score > 7) {
      flags.push({
        type: 'score_inconsistency',
        agent: agent.agentName,
        severity: 'warning',
        detail: `${concernCount} concerns listed but scored ${agent.score}/10 — sentiment does not match score`,
      });
    }

    // Also flag very few strengths with a high score
    const strengthCount = (agent.strengths || []).length;
    if (strengthCount === 0 && agent.score > 6) {
      flags.push({
        type: 'score_inconsistency',
        agent: agent.agentName,
        severity: 'warning',
        detail: `No strengths listed but scored ${agent.score}/10`,
      });
    }
  }

  // ── 2. Confidence Calibration ─────────────────────────────────────────────
  // High score + low confidence → agent unsure about positive assessment
  // Low score + low confidence → agent unsure about negative assessment
  for (const agent of agentResults) {
    if (agent.score === null) continue;

    if (agent.score > 8 && agent.confidence < 0.4) {
      flags.push({
        type: 'confidence_calibration',
        agent: agent.agentName,
        severity: 'warning',
        detail: `Very high score (${agent.score}) with low confidence (${agent.confidence}) — assessment may be unreliable`,
      });
    }

    if (agent.score < 3 && agent.confidence < 0.3) {
      flags.push({
        type: 'confidence_calibration',
        agent: agent.agentName,
        severity: 'info',
        detail: `Very low score (${agent.score}) with low confidence (${agent.confidence}) — negative assessment weakly held`,
      });
    }
  }

  // ── 3. Cross-Exam Coverage ────────────────────────────────────────────────
  const totalContradictions = crossExam?.contradictionsFound ?? 0;
  const resolvedContradictions = (crossExam?.contradictions || []).filter(
    (c) => c.resolution && !c.resolution.error,
  ).length;

  const crossExamCoverage =
    totalContradictions > 0
      ? `${resolvedContradictions}/${totalContradictions} contradictions resolved`
      : 'No contradictions detected';

  if (totalContradictions > 0 && resolvedContradictions < totalContradictions) {
    flags.push({
      type: 'cross_exam_incomplete',
      severity: 'warning',
      detail: `Only ${resolvedContradictions} of ${totalContradictions} contradictions were successfully resolved`,
    });
  }

  // ── 4. Grim Reaper Corroboration ──────────────────────────────────────────
  // Check if the Reaper's top causes align with the lowest-scoring agents
  if (grimReaper && grimReaper.causeOfDeath && grimReaper.causeOfDeath.length > 0) {
    const validAgents = agentResults.filter((a) => a.score !== null);
    const sortedByScore = [...validAgents].sort((a, b) => a.score - b.score);
    const lowestAgents = sortedByScore.slice(0, 2).map((a) => a.agentName.toLowerCase());

    const reaperCauses = grimReaper.causeOfDeath
      .map((c) => (c.cause || '').toLowerCase())
      .join(' ');

    const corroborated = lowestAgents.some((name) =>
      reaperCauses.includes(name),
    );

    if (!corroborated && validAgents.length > 0) {
      flags.push({
        type: 'reaper_misalignment',
        severity: 'info',
        detail: `Grim Reaper's top causes of death don't explicitly reference the lowest-scoring agents (${sortedByScore.slice(0, 2).map((a) => `${a.agentName}: ${a.score}`).join(', ')})`,
      });
    }
  }

  // ── 5. Recommendation Alignment ───────────────────────────────────────────
  // Check if the Chairman's recommendation aligns with the average agent score
  if (chairmanVerdict && chairmanVerdict.recommendation) {
    const validScores = agentResults
      .filter((a) => a.score !== null)
      .map((a) => a.score);

    if (validScores.length > 0) {
      const avgScore =
        validScores.reduce((sum, s) => sum + s, 0) / validScores.length;

      const recommendation = chairmanVerdict.recommendation;

      // Expected alignment:
      //   avg > 7   → INVEST or INVEST_WITH_CONDITIONS
      //   avg 5-7   → INVEST_WITH_CONDITIONS or IMPROVE
      //   avg 3-5   → IMPROVE or PIVOT
      //   avg < 3   → PIVOT or REJECT
      const misaligned =
        (avgScore > 7 && ['PIVOT', 'REJECT'].includes(recommendation)) ||
        (avgScore < 3 && ['INVEST', 'INVEST_WITH_CONDITIONS'].includes(recommendation));

      if (misaligned) {
        flags.push({
          type: 'recommendation_misalignment',
          severity: 'warning',
          detail: `Chairman recommended "${recommendation}" but average agent score is ${avgScore.toFixed(1)}/10 — potential misalignment`,
        });
      }
    }
  }

  // ── Calculate quality score ───────────────────────────────────────────────
  // Start at 100, deduct for each flag based on severity
  const deductions = {
    critical: 20,
    warning: 8,
    info: 3,
  };

  let qualityScore = 100;
  for (const flag of flags) {
    qualityScore -= deductions[flag.severity] || 5;
  }
  qualityScore = Math.max(0, Math.min(100, qualityScore));

  // ── Overall assessment ────────────────────────────────────────────────────
  let overallAssessment;
  if (qualityScore >= 90) {
    overallAssessment =
      'Excellent analysis quality — high internal consistency and thorough cross-examination.';
  } else if (qualityScore >= 70) {
    overallAssessment =
      'Good analysis quality — minor inconsistencies detected but overall well-reasoned.';
  } else if (qualityScore >= 50) {
    overallAssessment =
      'Moderate analysis quality — several inconsistencies that may affect reliability.';
  } else {
    overallAssessment =
      'Poor analysis quality — significant inconsistencies undermine confidence in results.';
  }

  return {
    auditPassed: qualityScore >= 50,
    qualityScore,
    flags,
    crossExamCoverage,
    overallAssessment,
  };
}

export default { runAudit };
