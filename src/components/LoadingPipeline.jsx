import React, { useState, useEffect } from 'react';
import AppIcon from './AppIcon.jsx';

const LOADING_STAGES = [
  { role: 'CEO', message: 'CEO entering executive chamber...', iconName: 'ceo', color: '#3b82f6' },
  { role: 'CTO', message: 'CTO joining technical feasibility mesh...', iconName: 'cto', color: '#38bdf8' },
  { role: 'Investor', message: 'Investor connected to financial feeds...', iconName: 'investor', color: '#fbbf24' },
  { role: 'Marketing', message: 'Marketing analyzing viral distribution...', iconName: 'marketing', color: '#c084fc' },
  { role: 'Customer', message: 'Customer persona validator online...', iconName: 'customer', color: '#4ade80' },
  { role: 'Risk Advisor', message: 'Risk Advisor checking compliance landmines...', iconName: 'risk', color: '#fb923c' },
  { role: 'Grim Reaper', message: 'Grim Reaper inspecting failure modes...', iconName: 'reaper', color: '#f87171' },
  { role: 'Chairman', message: 'Board quorum reached. Meeting begins...', iconName: 'chairman', color: '#ffffff' },
];

export default function LoadingPipeline({ ideaData, sharkTankMode }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [isDoorOpening, setIsDoorOpening] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedCount((prev) => {
        if (prev < LOADING_STAGES.length) {
          return prev + 1;
        }
        clearInterval(timer);
        setIsDoorOpening(true);
        return prev;
      });
    }, 1100);

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
            <span className="live-status-dot" /> {sharkTankMode ? 'SHARK TANK SCRUTINY ACTIVE' : 'EXECUTIVE CHAMBER INITIALIZING'}
          </div>
          <h1 className="transition-title">ENTERING EXECUTIVE CHAMBER...</h1>
          <p className="transition-sub">
            Inviting Board Members for <strong style={{ color: '#ffffff' }}>{ideaData?.name || 'Your Startup'}</strong>...
          </p>
        </div>

        {/* Executive Verification Checklist */}
        <div className="executive-checklist-grid">
          {LOADING_STAGES.map((exec, idx) => {
            const isReady = idx < completedCount;
            const isCurrent = idx === completedCount;
            return (
              <div key={idx} className={`checklist-item ${isReady ? 'ready' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="exec-info">
                  <span className="exec-icon">
                    <AppIcon name={exec.iconName} size={18} color={exec.color} />
                  </span>
                  <span className="exec-role">{exec.message}</span>
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
          {completedCount >= LOADING_STAGES.length ? (
            <div className="board-ready-announcement glow-green animate-pulse">
              <AppIcon name="chairman" size={20} color="#fbbf24" style={{ marginRight: '8px' }} />
              BOARD QUORUM REACHED. MEETING BEGINS...
            </div>
          ) : (
            <div className="board-ready-announcement">
              Assembling AI Board ({completedCount} / {LOADING_STAGES.length})...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
