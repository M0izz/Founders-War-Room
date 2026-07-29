import React from 'react';

export default function CrossExamination({ data }) {
  if (!data) return null;

  const contradictions = data.contradictions || [];

  return (
    <div className="cross-exam-section">
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <span style={{ fontSize: '36px' }}>⚔️</span>
          <div>
            <h2 className="title-lg">Cross-Examination</h2>
            <p className="text-sm">Agent debates and contradiction resolution</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div className="badge badge-warning">
            {data.contradictionsFound ?? contradictions.length} Contradictions Found
          </div>
          {data.revisedScores && (
            <div className="badge badge-primary">
              Scores Revised
            </div>
          )}
        </div>
      </div>

      {/* Contradictions List */}
      {contradictions.length > 0 ? (
        <div className="stagger">
          {contradictions.map((item, i) => (
            <div key={i} className="contradiction-card glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
              {/* Type badge */}
              {item.type && (
                <div className="badge badge-secondary" style={{ alignSelf: 'flex-start' }}>
                  {item.type}
                </div>
              )}

              {/* Agent vs Agent */}
              <div className="contradiction-agents">
                <div className="contradiction-agent glass-panel">
                  <div className="contradiction-agent-name">{item.agentA || 'Agent A'}</div>
                </div>
                <div className="contradiction-vs">VS</div>
                <div className="contradiction-agent glass-panel">
                  <div className="contradiction-agent-name">{item.agentB || 'Agent B'}</div>
                </div>
              </div>

              {/* Detail */}
              {item.detail && (
                <div className="contradiction-detail">
                  <div className="text-xs" style={{ marginBottom: '4px', color: 'var(--warning)' }}>
                    Disagreement
                  </div>
                  {item.detail}
                </div>
              )}

              {/* Resolution */}
              {item.resolution && (
                <div className="contradiction-resolution">
                  <div className="text-xs" style={{ marginBottom: '4px', color: 'var(--success)' }}>
                    Resolution
                  </div>
                  {item.resolution}
                </div>
              )}

              {/* Status */}
              <div className="contradiction-status">
                {item.resolved ? (
                  <span className="badge badge-success">✅ Resolved</span>
                ) : (
                  <span className="badge badge-danger">⚠️ Unresolved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <p className="text-lg" style={{ color: 'var(--success)' }}>
            ✅ No major contradictions found — agents are largely in agreement.
          </p>
        </div>
      )}

      {/* Revised Scores */}
      {data.revisedScores && Object.keys(data.revisedScores).length > 0 && (
        <div className="glass-card" style={{ marginTop: 'var(--space-xl)' }}>
          <h3 className="title-sm" style={{ marginBottom: 'var(--space-md)' }}>
            📊 Revised Scores After Cross-Examination
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)' }}>
            {Object.entries(data.revisedScores).map(([agent, score]) => (
              <div key={agent} className="glass-panel" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {score}
                </div>
                <div className="text-sm">{agent}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
