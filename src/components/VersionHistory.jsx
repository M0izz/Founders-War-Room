import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';
import { getHistory } from '../utils/storage.js';

const DEMO_TIMELINE = [
  { version: 5, name: 'VITALINK', score: 8.6, verdict: 'APPROVED', date: 'Today', commitHash: 'c8f1a20', ideaData: { name: 'VITALINK', industry: 'HealthTech' } },
  { version: 4, name: 'VITALINK', score: 7.8, verdict: 'CONDITIONAL', date: 'Yesterday', commitHash: 'b4a9e12', ideaData: { name: 'VITALINK', industry: 'HealthTech' } },
  { version: 3, name: 'VITALINK', score: 6.4, verdict: 'NEEDS REFINEMENT', date: 'Monday', commitHash: 'a10f948', ideaData: { name: 'VITALINK', industry: 'HealthTech' } },
];

const COMPARISON_METRICS = [
  { metric: 'Overall Board Score', v4: '7.4', v5: '8.6', change: '+1.2 ↑', positive: true },
  { metric: 'Revenue Model Stability', v4: 'Weak', v5: 'Strong', change: 'Improved', positive: true },
  { metric: 'Market Opportunity Size', v4: 'Medium ($4B)', v5: 'High ($18B)', change: 'Expanded', positive: true },
  { metric: 'Operational Risk Level', v4: 'High (HIPAA)', v5: 'Low (Encrypted)', change: 'Mitigated', positive: true },
  { metric: '90-Day MVP Readiness', v4: '60%', v5: '95%', change: '+35%', positive: true },
];

export default function VersionHistory({ onClose, onSelect }) {
  const [showComparison, setShowComparison] = useState(false);
  const realHistory = getHistory();
  const list = realHistory.length > 0
    ? realHistory.map((entry, idx) => ({
        version: entry.versionNumber || (realHistory.length - idx),
        name: entry.ideaData?.name || `Version #${realHistory.length - idx}`,
        score: entry.overallScore || 8.4,
        verdict: entry.verdict || 'REVIEWED',
        date: new Date(entry.createdAt).toLocaleDateString(),
        commitHash: Math.random().toString(36).substring(2, 9),
        raw: entry,
      }))
    : DEMO_TIMELINE;

  return (
    <div className="version-history-overlay animate-fade-in">
      <div className="version-history-modal glass-card-lg animate-fade-in-up">
        
        {/* Header */}
        <div className="history-header">
          <div>
            <div className="greeting-pill" style={{ marginBottom: '6px' }}>
              <AppIcon name="activity" size={14} /> GIT-STYLE EVOLUTION TIMELINE
            </div>
            <h2 className="history-title">Startup Version Evolution & Commit History</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Hide Comparison' : 'Compare V4 vs V5'}
            </button>
            <button className="close-btn-glow" onClick={onClose}>
              <AppIcon name="close" size={18} />
            </button>
          </div>
        </div>

        {/* Side-by-side Version Comparison Drawer */}
        {showComparison && (
          <div className="version-compare-drawer glass-card animate-fade-in" style={{ marginBottom: '24px', padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: '#60a5fa' }}>
              ⚡ Version Comparison: V4 vs V5
            </h3>
            <table className="compare-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '10px', color: '#94a3b8' }}>Metric</th>
                  <th style={{ padding: '10px', color: '#fb923c' }}>Version 4 (Previous)</th>
                  <th style={{ padding: '10px', color: '#4ade80' }}>Version 5 (Current)</th>
                  <th style={{ padding: '10px', color: '#60a5fa' }}>Delta</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_METRICS.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>{row.metric}</td>
                    <td style={{ padding: '10px', color: '#cbd5e1' }}>{row.v4}</td>
                    <td style={{ padding: '10px', color: '#ffffff', fontWeight: 800 }}>{row.v5}</td>
                    <td style={{ padding: '10px', color: '#4ade80', fontWeight: 800 }}>{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Git Commit Style Timeline Feed */}
        <div className="git-commit-timeline">
          {list.map((item, i) => (
            <div
              key={i}
              className="git-commit-row glass-card"
              onClick={() => onSelect(item.raw || item)}
            >
              <div className="commit-hash-node">
                <span className="commit-dot" />
                <span className="commit-hash">commit {item.commitHash}</span>
              </div>

              <div className="commit-main-info">
                <div className="commit-title-line">
                  <span className="commit-version-tag">v{item.version}</span>
                  <span className="commit-startup-name">{item.name}</span>
                  <span className="commit-verdict-pill">{item.verdict}</span>
                </div>
                <span className="commit-date">{item.date}</span>
              </div>

              <div className="commit-score-badge">
                <span className="score-num">{item.score}</span>
                <span className="score-label">/ 10</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
