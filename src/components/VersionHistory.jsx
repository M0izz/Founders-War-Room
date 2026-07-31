import React from 'react';
import AppIcon from './AppIcon.jsx';
import { getHistory } from '../utils/storage.js';

const DEMO_TIMELINE = [
  { version: 1, name: 'VITALINK v1', score: 6.2, verdict: 'Needs Work', date: 'Monday', ideaData: { name: 'VITALINK v1', industry: 'HealthTech' } },
  { version: 2, name: 'VITALINK v2', score: 7.5, verdict: 'In Review', date: 'Wednesday', ideaData: { name: 'VITALINK v2', industry: 'HealthTech' } },
  { version: 3, name: 'VITALINK v3', score: 8.4, verdict: 'Needs Refinement', date: 'Today', ideaData: { name: 'VITALINK v3', industry: 'HealthTech' } },
];

export default function VersionHistory({ onClose, onSelect }) {
  const realHistory = getHistory();
  const list = realHistory.length > 0
    ? realHistory.map((entry, idx) => ({
        version: entry.versionNumber || (realHistory.length - idx),
        name: entry.ideaData?.name || `Version #${realHistory.length - idx}`,
        score: entry.overallScore || 8.4,
        verdict: entry.verdict || 'Reviewed',
        date: new Date(entry.createdAt).toLocaleDateString(),
        raw: entry,
      }))
    : DEMO_TIMELINE;

  return (
    <div className="version-history-overlay animate-fade-in">
      <div className="version-history-modal glass-card-lg animate-fade-in-up">
        <div className="history-header">
          <div>
            <div className="greeting-pill" style={{ marginBottom: '6px' }}>
              <AppIcon emoji="📈" size={14} /> EVOLUTION TIMELINE
            </div>
            <h2 className="history-title">Startup Progress & Refinement</h2>
          </div>
          <button className="close-btn-glow" onClick={onClose}>
            <AppIcon emoji="✖" size={18} />
          </button>
        </div>

        {/* Horizontal Linear Evolution Chain */}
        <div className="evolution-linear-chain">
          {list.map((item, i) => (
            <React.Fragment key={i}>
              <div
                className="evolution-node-card glass-card"
                onClick={() => onSelect(item.raw || item)}
              >
                <span className="version-badge">Version {item.version}</span>
                <span className="version-score-gold">{item.score}</span>
                <span className="version-verdict">{item.verdict}</span>
                <span className="version-date">{item.date}</span>
                <span className="node-click-hint">View Session →</span>
              </div>
              {i < list.length - 1 && (
                <div className="chain-arrow">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
