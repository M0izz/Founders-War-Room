import React, { useState, useEffect } from 'react';

const STAGES = [
  { icon: '🔍', label: 'Analyzing', messages: [
    'CEO is evaluating your vision...',
    'CTO is assessing technical feasibility...',
    'Investor is analyzing unit economics...',
  ]},
  { icon: '⚔️', label: 'Debating', messages: [
    'Agents are debating your value proposition...',
    'Cross-examining inconsistencies...',
    'Resolving contradictions between agents...',
  ]},
  { icon: '💀', label: 'Predicting', messages: [
    'Grim Reaper is performing the startup autopsy...',
    'Calculating failure probability...',
    'Identifying hidden risks and death scenarios...',
  ]},
  { icon: '⚖️', label: 'Deciding', messages: [
    'Chairman is reviewing all evidence...',
    'Formulating the final verdict...',
    'Preparing investment recommendation...',
  ]},
  { icon: '✅', label: 'Validating', messages: [
    'Auditor is verifying analysis quality...',
    'Running final consistency checks...',
    'Compiling the War Room report...',
  ]},
];

export default function LoadingPipeline({ ideaData, sharkTankMode }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 4000);

    return () => clearInterval(stageInterval);
  }, []);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const msgs = STAGES[currentStage].messages;
        return (prev + 1) % msgs.length;
      });
    }, 2000);

    return () => clearInterval(msgInterval);
  }, [currentStage]);

  return (
    <div className="loading-page">
      <div className="loading-title">
        <div className="landing-eyebrow" style={{ marginBottom: 'var(--space-md)' }}>
          {sharkTankMode ? '🦈 Shark Tank Mode Active' : '⚡ Analysis In Progress'}
        </div>
        <h1 className="title-xl animate-fade-in-up">
          War Room in Session
        </h1>
        <p className="text-lg" style={{ marginTop: 'var(--space-sm)' }}>
          Evaluating <strong style={{ color: 'var(--text-primary)' }}>{ideaData?.name || 'your idea'}</strong>
        </p>
      </div>

      {/* Pipeline Track */}
      <div className="loading-pipeline-track glass-card">
        {STAGES.map((stage, i) => (
          <React.Fragment key={i}>
            <div className={`loading-stage ${i === currentStage ? 'active' : ''} ${i < currentStage ? 'complete' : ''}`}>
              <div className="loading-stage-icon">
                {stage.icon}
                {i === currentStage && <div className="loading-spinner" />}
              </div>
              <span className="loading-stage-label">{stage.label}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`loading-connector ${i < currentStage ? 'complete' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current Message */}
      <div className="loading-message animate-fade-in" key={`${currentStage}-${currentMessage}`}>
        {STAGES[currentStage].messages[currentMessage]}
      </div>

      <p className="text-sm" style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
        This typically takes 30-60 seconds
      </p>
    </div>
  );
}
