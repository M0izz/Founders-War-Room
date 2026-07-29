import React from 'react';

const AGENTS = [
  { emoji: '👔', name: 'CEO Advisor', role: 'Vision & Strategy' },
  { emoji: '⚙️', name: 'CTO Advisor', role: 'Technical Feasibility' },
  { emoji: '💰', name: 'Investor Advisor', role: 'Investment Potential' },
  { emoji: '👤', name: 'Customer Advisor', role: 'Market Fit & UX' },
  { emoji: '📢', name: 'Marketing Advisor', role: 'Growth Strategy' },
  { emoji: '🎯', name: 'Competitor Analyst', role: 'Competitive Landscape' },
  { emoji: '⚠️', name: 'Risk Advisor', role: 'Risk Assessment' },
  { emoji: '💀', name: 'Grim Reaper', role: 'Startup Autopsy' },
];

const PIPELINE_STEPS = [
  { icon: '🔍', label: 'Analyze' },
  { icon: '⚔️', label: 'Debate' },
  { icon: '💀', label: 'Predict Failure' },
  { icon: '⚖️', label: 'Decide' },
  { icon: '✅', label: 'Validate' },
];

export default function Landing({ onEnter }) {
  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="landing-grid" />
        <div className="landing-particles">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
      </div>

      {/* Content */}
      <div className="landing-content">
        {/* Hero */}
        <section className="landing-hero">
          <div className="landing-eyebrow">
            <span>⚡</span> AI-Powered Startup Validation
          </div>

          <h1 className="title-hero animate-fade-in-up">
            Founder's War Room
          </h1>

          <p className="landing-tagline">
            Before the Market Judges You, We Will. 8 AI experts debate, dissect, 
            and deliver a verdict on your startup idea — in minutes.
          </p>

          <div className="landing-cta">
            <button className="btn-enter" onClick={onEnter}>
              ⚡ Enter the War Room
            </button>
          </div>
        </section>

        {/* Pipeline */}
        <section className="landing-pipeline container">
          <h2 className="title-lg" style={{ textAlign: 'center' }}>
            The <span className="text-gradient">5-Stage Pipeline</span>
          </h2>
          <p className="text-lg" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            Your idea goes through a rigorous multi-agent evaluation pipeline
          </p>

          <div className="pipeline-steps stagger">
            {PIPELINE_STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <div className="pipeline-step">
                  <div className="pipeline-step-icon">{step.icon}</div>
                  <span className="pipeline-step-label">{step.label}</span>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <span className="pipeline-arrow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Agent Cards */}
        <section className="landing-agents container">
          <h2 className="title-lg" style={{ textAlign: 'center' }}>
            Meet Your <span className="text-gradient">Board of Advisors</span>
          </h2>
          <p className="text-lg" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            8 specialized AI agents, each with a unique perspective on your startup
          </p>

          <div className="agents-grid stagger">
            {AGENTS.map((agent, i) => (
              <div key={i} className="agent-preview-card glass-card glass-card-hover">
                <div className="agent-preview-emoji">{agent.emoji}</div>
                <div className="agent-preview-name">{agent.name}</div>
                <div className="agent-preview-role">{agent.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Shark Tank Teaser */}
        <section className="container" style={{ paddingBottom: 'var(--space-4xl)' }}>
          <div className="shark-tank-teaser">
            <div className="shark-tank-teaser-icon">🦈</div>
            <h3 className="title-md" style={{ marginBottom: 'var(--space-sm)' }}>
              Shark Tank Mode
            </h3>
            <p className="text-md" style={{ maxWidth: 480, margin: '0 auto' }}>
              Enable brutal honesty mode. No sugar-coating, no mercy — just raw, 
              unfiltered investor feedback on your startup.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
