import React, { useState, useEffect } from 'react';
import AppIcon from './AppIcon.jsx';

const EXECUTIVES_LIST = [
  { role: 'CEO', name: 'Vision Strategist', emoji: '🏛️' },
  { role: 'Investor', name: 'Business Viability Analyst', emoji: '💰' },
  { role: 'CTO', name: 'Feasibility Engineer', emoji: '⚙️' },
  { role: 'Marketing', name: 'Growth Architect', emoji: '📢' },
  { role: 'Customer', name: 'Demand Validator', emoji: '🧑‍💻' },
  { role: 'Risk', name: 'Operational Risk Analyst', emoji: '🛡️' },
  { role: 'Grim Reaper', name: 'Death Predictor', emoji: '💀' },
  { role: 'Chairman', name: 'Executive Arbitrator', emoji: '👑' },
];

export default function LoadingPipeline({ ideaData, sharkTankMode }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [isDoorOpening, setIsDoorOpening] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedCount((prev) => {
        if (prev < EXECUTIVES_LIST.length) {
          return prev + 1;
        }
        clearInterval(timer);
        setIsDoorOpening(true);
        return prev;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`loading-page transition-screen ${isDoorOpening ? 'door-opening-active' : ''}`}>
      {/* Cinematic Door Animation Layers */}
      <div className="boardroom-door door-left" />
      <div className="boardroom-door door-right" />

      <div className="transition-content glass-card-lg animate-fade-in">
        <div className="transition-header">
          <div className="greeting-pill" style={{ marginBottom: '12px' }}>
            <span className="live-status-dot" /> {sharkTankMode ? 'SHARK TANK SCRUTINY ACTIVE' : 'EXECUTIVE QUORUM IN PROGRESS'}
          </div>
          <h1 className="transition-title">INITIALIZING WAR ROOM...</h1>
          <p className="transition-sub">
            Inviting Executives for <strong style={{ color: '#fff' }}>{ideaData?.name || 'Your Startup'}</strong>...
          </p>
        </div>

        {/* Executive Verification Checklist */}
        <div className="executive-checklist-grid">
          {EXECUTIVES_LIST.map((exec, idx) => {
            const isReady = idx < completedCount;
            const isCurrent = idx === completedCount;
            return (
              <div key={idx} className={`checklist-item ${isReady ? 'ready' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="exec-info">
                  <span className="exec-icon"><AppIcon emoji={exec.emoji} size={18} /></span>
                  <span className="exec-role">{exec.role}</span>
                </div>
                <div className="exec-status">
                  {isReady ? (
                    <span className="check-mark">✓</span>
                  ) : isCurrent ? (
                    <span className="spinner-dots">● ● ●</span>
                  ) : (
                    <span className="pending-txt">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="transition-footer">
          {completedCount >= EXECUTIVES_LIST.length ? (
            <div className="board-ready-announcement glow-green animate-pulse">
              <AppIcon emoji="👑" size={20} style={{ marginRight: '8px' }} />
              BOARD READY. OPENING BOARDROOM DOORS...
            </div>
          ) : (
            <div className="board-ready-announcement">
              Awaiting executive quorum ({completedCount} / {EXECUTIVES_LIST.length})...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
