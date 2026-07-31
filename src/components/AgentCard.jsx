import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

const AGENT_CONFIG = {
  'CEO': { emoji: '👔', color: 'var(--agent-ceo)' },
  'CTO': { emoji: '⚙️', color: 'var(--agent-cto)' },
  'Investor': { emoji: '💰', color: 'var(--agent-investor)' },
  'Customer': { emoji: '👤', color: 'var(--agent-customer)' },
  'Marketing': { emoji: '📢', color: 'var(--agent-marketing)' },
  'Competitor': { emoji: '🎯', color: 'var(--agent-competitor)' },
  'Risk': { emoji: '⚠️', color: 'var(--agent-risk)' },
};

function getAgentConfig(agentName) {
  const key = Object.keys(AGENT_CONFIG).find(k =>
    agentName?.toLowerCase().includes(k.toLowerCase())
  );
  return AGENT_CONFIG[key] || { emoji: '🤖', color: 'var(--primary)' };
}

function getScoreColor(score) {
  if (score >= 8) return 'var(--success)';
  if (score >= 6) return 'var(--primary)';
  if (score >= 4) return 'var(--warning)';
  return 'var(--danger)';
}

function getVerdictStyle(verdict) {
  const v = verdict?.toLowerCase() || '';
  if (v.includes('strong') || v.includes('invest') || v.includes('approve')) {
    return { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-hover)', border: 'rgba(16, 185, 129, 0.3)' };
  }
  if (v.includes('caution') || v.includes('pivot') || v.includes('conditional')) {
    return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning-hover)', border: 'rgba(245, 158, 11, 0.3)' };
  }
  if (v.includes('reject') || v.includes('fail') || v.includes('no')) {
    return { bg: 'rgba(220, 38, 38, 0.15)', color: 'var(--danger-hover)', border: 'rgba(220, 38, 38, 0.3)' };
  }
  return { bg: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-hover)', border: 'rgba(59, 130, 246, 0.3)' };
}

export default function AgentCard({ agent, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const config = getAgentConfig(agent.agentName);
  const scoreColor = getScoreColor(agent.score);
  const verdictStyle = getVerdictStyle(agent.verdict);

  const circumference = 2 * Math.PI * 34;
  const scoreOffset = circumference - (circumference * (agent.score || 0)) / 10;

  return (
    <div
      className="agent-card glass-card animate-fade-in-up"
      style={{
        '--agent-color': config.color,
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
      }}
    >
      {/* Header */}
      <div className="agent-card-header">
        <div className="agent-avatar" style={{ borderColor: config.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AppIcon emoji={config.emoji} size={22} color={config.color} />
        </div>
        <div className="agent-info">
          <div className="agent-name">{agent.agentName}</div>
          <div className="agent-role">{agent.role}</div>
        </div>
      </div>

      {/* Score Section */}
      <div className="agent-score-section">
        <div className="score-ring">
          <svg viewBox="0 0 76 76">
            <circle className="score-ring-bg" cx="38" cy="38" r="34" />
            <circle
              className="score-ring-fill"
              cx="38" cy="38" r="34"
              stroke={scoreColor}
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
            />
          </svg>
          <div className="score-ring-value" style={{ color: scoreColor }}>
            {agent.score ?? '—'}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="agent-score-label">Confidence</div>
          <div className="score-bar" style={{ marginTop: '6px' }}>
            <div
              className="score-bar-fill"
              style={{
                width: `${(agent.confidence || 0) * 100}%`,
                background: `linear-gradient(90deg, ${config.color}, ${config.color}88)`,
              }}
            />
          </div>
          <div className="text-sm" style={{ marginTop: '4px' }}>
            {Math.round((agent.confidence || 0) * 100)}%
          </div>

          {agent.verdict && (
            <div
              className="agent-verdict"
              style={{
                background: verdictStyle.bg,
                color: verdictStyle.color,
                border: `1px solid ${verdictStyle.border}`,
                marginTop: '8px',
              }}
            >
              {agent.verdict}
            </div>
          )}
        </div>
      </div>

      {/* Key Observations */}
      {agent.keyObservations && agent.keyObservations.length > 0 && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div className="agent-list-label">Key Observations</div>
          <div className="agent-list">
            {agent.keyObservations.slice(0, 3).map((obs, i) => (
              <div key={i} className="agent-list-item">{obs}</div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Details */}
      <div className="agent-expand-section">
        <button className="agent-expand-toggle" onClick={() => setExpanded(!expanded)}>
          <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
          <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
        </button>

        {expanded && (
          <div className="agent-expand-content animate-fade-in">
            {agent.strengths && agent.strengths.length > 0 && (
              <>
                <div className="agent-list-label" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AppIcon emoji="✅" size={16} /> Strengths
                </div>
                <div className="agent-list">
                  {agent.strengths.map((s, i) => (
                    <div key={i} className="agent-list-item">{s}</div>
                  ))}
                </div>
              </>
            )}

            {agent.concerns && agent.concerns.length > 0 && (
              <>
                <div className="agent-list-label" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AppIcon emoji="⚠️" size={16} /> Concerns
                </div>
                <div className="agent-list">
                  {agent.concerns.map((c, i) => (
                    <div key={i} className="agent-list-item">{c}</div>
                  ))}
                </div>
              </>
            )}

            {agent.recommendations && agent.recommendations.length > 0 && (
              <>
                <div className="agent-list-label" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AppIcon emoji="💡" size={16} /> Recommendations
                </div>
                <div className="agent-list">
                  {agent.recommendations.map((r, i) => (
                    <div key={i} className="agent-list-item">{r}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
