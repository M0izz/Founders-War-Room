import React from 'react';

export default function GrimReaper({ data }) {
  if (!data) return null;

  return (
    <div className="reaper-section glass-card-lg">
      {/* Header */}
      <div className="reaper-header">
        <div className="reaper-icon">💀</div>
        <div>
          <div className="reaper-title">Startup Autopsy</div>
          <div className="reaper-subtitle">The Grim Reaper's Analysis</div>
        </div>
      </div>

      {/* Death Sentence */}
      {data.deathSentence && (
        <div className="reaper-death-sentence">
          "{data.deathSentence}"
        </div>
      )}

      {/* Failure Probability */}
      {data.failureProbability != null && (
        <div className="reaper-probability">
          <div className="reaper-probability-value">
            {typeof data.failureProbability === 'number'
              ? `${Math.round(data.failureProbability)}%`
              : data.failureProbability}
          </div>
          <div className="reaper-probability-label">
            Failure Probability
          </div>
        </div>
      )}

      {/* Grid of Details */}
      <div className="reaper-grid">
        {/* Cause of Death */}
        {data.causeOfDeath && (
          <div className="reaper-card">
            <div className="reaper-card-title">
              <span>⚰️</span> Cause of Death
            </div>
            {Array.isArray(data.causeOfDeath) ? (
              data.causeOfDeath.map((cause, i) => (
                <div key={i} className="reaper-list-item">{cause}</div>
              ))
            ) : (
              <p className="text-md">{data.causeOfDeath}</p>
            )}
          </div>
        )}

        {/* Hidden Risks */}
        {data.hiddenRisks && data.hiddenRisks.length > 0 && (
          <div className="reaper-card">
            <div className="reaper-card-title">
              <span>🔍</span> Hidden Risks
            </div>
            {data.hiddenRisks.map((risk, i) => (
              <div key={i} className="reaper-list-item">{risk}</div>
            ))}
          </div>
        )}

        {/* Early Warning Signals */}
        {data.earlyWarningSignals && data.earlyWarningSignals.length > 0 && (
          <div className="reaper-card">
            <div className="reaper-card-title">
              <span>🚨</span> Early Warning Signals
            </div>
            {data.earlyWarningSignals.map((signal, i) => (
              <div key={i} className="reaper-list-item">{signal}</div>
            ))}
          </div>
        )}

        {/* Survival Recommendations */}
        {data.survivalRecommendations && data.survivalRecommendations.length > 0 && (
          <div className="reaper-card" style={{
            background: 'rgba(16, 185, 129, 0.04)',
            borderColor: 'rgba(16, 185, 129, 0.15)',
          }}>
            <div className="reaper-card-title" style={{ color: 'var(--success-hover)' }}>
              <span>🛡️</span> Survival Recommendations
            </div>
            {data.survivalRecommendations.map((rec, i) => (
              <div key={i} className="reaper-list-item reaper-survival-item">{rec}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
