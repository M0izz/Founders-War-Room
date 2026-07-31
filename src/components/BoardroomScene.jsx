import React, { useState, useEffect, useRef } from 'react';
import AppIcon from './AppIcon.jsx';

const DEFAULT_BOARD_DEBATE = [
  {
    speaker: 'CEO',
    role: 'Vision Strategist',
    color: '#4F8CFF',
    icon: '🏛️',
    time: '10:42 AM',
    quote: 'This idea addresses a critical gap in emergency medical care with strong category-defining potential.',
  },
  {
    speaker: 'Investor',
    role: 'Business Viability Analyst',
    color: '#FBBF24',
    icon: '💰',
    time: '10:43 AM',
    quote: 'The revenue model concerns me. Customer acquisition cost will be high without institutional buy-in.',
  },
  {
    speaker: 'Marketing',
    role: 'Growth Architect',
    color: '#A855F7',
    icon: '📢',
    time: '10:43 AM',
    quote: 'Positioning lacks an organic viral loop. You must pivot directly to enterprise B2B hospital distribution.',
  },
  {
    speaker: 'CTO',
    role: 'Feasibility Engineer',
    color: '#38BDF8',
    icon: '⚙️',
    time: '10:44 AM',
    quote: 'Technically feasible. The MVP architecture can be deployed securely in under 90 days.',
  },
  {
    speaker: 'Customer',
    role: 'Demand Validator',
    color: '#22C55E',
    icon: '🧑‍💻',
    time: '10:44 AM',
    quote: 'Willingness to pay requires clear evidence of ROI and zero friction during emergency access.',
  },
  {
    speaker: 'Risk Advisor',
    role: 'Operational Risk Analyst',
    color: '#F97316',
    icon: '🛡️',
    time: '10:45 AM',
    quote: 'HIPAA and medical data compliance landmines must be cleared before public deployment.',
  },
  {
    speaker: 'Grim Reaper',
    role: 'Death Predictor',
    color: '#EF4444',
    icon: '💀',
    time: '10:45 AM',
    quote: 'This startup dies in Year 2 if hospital EHR incumbents copy your QR access model as a free feature.',
  },
  {
    speaker: 'Chairman',
    role: 'Executive Arbitrator',
    color: '#F5F5F5',
    icon: '👑',
    time: '10:46 AM',
    quote: 'Order in the room. The board recommends refinement on enterprise distribution and compliance. Overall Score: 8.4/10.',
  },
];

const BOARD_SEATS_MAP = [
  { id: 'chairman', role: 'Chairman', icon: '👑', color: '#F5F5F5', pos: 'top' },
  { id: 'ceo', role: 'CEO', icon: '🏛️', color: '#4F8CFF', pos: 'left-top' },
  { id: 'investor', role: 'Investor', icon: '💰', color: '#FBBF24', pos: 'right-top' },
  { id: 'marketing', role: 'Marketing', icon: '📢', color: '#A855F7', pos: 'left-mid' },
  { id: 'cto', role: 'CTO', icon: '⚙️', color: '#38BDF8', pos: 'right-mid' },
  { id: 'customer', role: 'Customer', icon: '🧑‍💻', color: '#22C55E', pos: 'left-bot' },
  { id: 'risk', role: 'Risk Advisor', icon: '🛡️', color: '#F97316', pos: 'right-bot' },
  { id: 'reaper', role: 'Grim Reaper', icon: '💀', color: '#EF4444', pos: 'bot' },
];

export default function BoardroomScene({
  ideaData,
  result,
  sharkTankMode,
  onNewAnalysis,
  onViewHistory,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('debate'); // 'debate' | 'report'
  const transcriptEndRef = useRef(null);

  // Extract structured analysis from API result or default fallback
  const overallScore = result?.overallScore || 8.4;
  const verdict = result?.verdict || 'Needs Refinement';
  const strengths = result?.strengths || [
    'Critical emergency medical problem with immediate high utility.',
    'Feasible technical architecture for rapid 90-day deployment.',
    'Clear value proposition for patients and emergency response teams.',
  ];
  const weaknesses = result?.weaknesses || [
    'High customer acquisition cost in early B2C marketing.',
    'Monetization model requires institutional hospital validation.',
    'Lack of viral loop in initial consumer onboarding flow.',
  ];
  const risks = result?.risks || [
    'Regulatory & HIPAA data compliance requirements.',
    'Risk of incumbents integrating QR access into existing EHR systems.',
  ];
  const recommendations = result?.recommendations || [
    'Pivot marketing strategy to enterprise B2B hospital networks.',
    'Implement end-to-end medical encryption to ensure compliance.',
    'Introduce automated patient referral loops to lower acquisition costs.',
    'Establish strategic partnerships with emergency medical services.',
  ];

  // Auto-advance debate steps
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < DEFAULT_BOARD_DEBATE.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Auto-scroll transcript to latest utterance
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeStep]);

  const currentSpeaker = DEFAULT_BOARD_DEBATE[activeStep];
  const progressPct = Math.round(((activeStep + 1) / DEFAULT_BOARD_DEBATE.length) * 100);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="war-room-product-page">
      <div className="command-bg-grid" />
      <div className="command-ambient-glow" />

      {/* Top War Room Command Header */}
      <header className="war-room-header">
        <div className="header-left">
          <span className="live-pill"><span className="pulse-dot-green" /> LIVE BOARDROOM SESSION</span>
          <h2 className="header-startup-name">{ideaData?.name || 'VITALINK'}</h2>
        </div>

        <div className="header-nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'debate' ? 'active' : ''}`}
            onClick={() => setActiveTab('debate')}
          >
            <AppIcon emoji="🏛️" size={16} /> Live Debate
          </button>
          <button
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <AppIcon emoji="📄" size={16} /> Executive Report
          </button>
        </div>

        <div className="header-actions">
          <button className="btn-sm btn-ghost" onClick={handleExportPDF} title="Export Report PDF">
            <AppIcon emoji="📄" size={16} /> Export PDF
          </button>
          <button className="btn-sm btn-primary btn-glow" onClick={onNewAnalysis}>
            <AppIcon emoji="➕" size={16} /> New Session
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'debate' ? (
        <div className="war-room-main-layout">
          {/* Left Column: Interactive Oval Boardroom Table (60% Focus) */}
          <div className="war-room-center-stage glass-card-lg">
            <div className="boardroom-stage-header">
              <span className="stage-eyebrow">EXECUTIVE DEBATE IN PROGRESS</span>
              <div className="playback-controls">
                <button
                  className="control-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                  className="control-btn"
                  onClick={() => setActiveStep((prev) => (prev + 1) % DEFAULT_BOARD_DEBATE.length)}
                >
                  Next Speaker ⏭
                </button>
              </div>
            </div>

            {/* Oval Table & Agent Seats */}
            <div className="interactive-oval-boardroom">
              <div className="oval-table-core">
                <div className="table-center-brand">
                  <img src="/war_room_logo.png" alt="Logo" className="table-logo-img" />
                  <span>FOUNDER'S WAR ROOM</span>
                </div>
              </div>

              {/* 8 Agent Seats */}
              <div className="board-seats-layout">
                {BOARD_SEATS_MAP.map((seat) => {
                  const isSpeaking = currentSpeaker.speaker.toLowerCase() === seat.role.toLowerCase() || (seat.role === 'Chairman' && currentSpeaker.speaker === 'Chairman');
                  return (
                    <div
                      key={seat.id}
                      className={`seat-position-node ${seat.pos} ${isSpeaking ? 'active-speaking-node' : ''}`}
                    >
                      {/* Active Speech Bubble */}
                      {isSpeaking && (
                        <div className="speech-bubble-pop glass-panel animate-fade-in-up">
                          <div className="bubble-speaker-tag" style={{ color: currentSpeaker.color }}>
                            <AppIcon emoji={currentSpeaker.icon} size={14} /> {currentSpeaker.speaker}
                          </div>
                          <p className="bubble-text">"{currentSpeaker.quote}"</p>
                        </div>
                      )}

                      <div
                        className="seat-avatar-circle"
                        style={{
                          backgroundColor: seat.color,
                          boxShadow: isSpeaking ? `0 0 25px ${seat.color}` : 'none',
                        }}
                      >
                        <AppIcon emoji={seat.icon} size={20} color="#fff" />
                      </div>
                      <span className="seat-role-title">{seat.role}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="war-room-bottom-progress">
              <div className="progress-checklist">
                {DEFAULT_BOARD_DEBATE.map((d, i) => (
                  <span
                    key={i}
                    className={`progress-chip ${i <= activeStep ? 'done' : ''}`}
                  >
                    {d.speaker} {i <= activeStep ? '✓' : ''}
                  </span>
                ))}
              </div>
              <div className="progress-pct-badge">{progressPct}% Complete</div>
            </div>
          </div>

          {/* Right Sidebar: Meeting Transcript (Discord/Slack Style) */}
          <aside className="war-room-transcript-sidebar glass-panel">
            <div className="transcript-header">
              <AppIcon emoji="💬" size={18} color="#60a5fa" />
              <h3>Meeting Transcript</h3>
            </div>

            <div className="transcript-feed">
              {DEFAULT_BOARD_DEBATE.slice(0, activeStep + 1).map((item, idx) => (
                <div key={idx} className="transcript-item animate-fade-in-up">
                  <div
                    className="transcript-avatar"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}66` }}
                  >
                    <AppIcon emoji={item.icon} size={14} color="#fff" />
                  </div>

                  <div className="transcript-body">
                    <div className="transcript-meta">
                      <span className="transcript-speaker" style={{ color: item.color }}>{item.speaker}</span>
                      <span className="transcript-time">{item.time}</span>
                    </div>
                    <p className="transcript-text">{item.quote}</p>
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </aside>
        </div>
      ) : (
        /* Executive Report View (Investor-Style Document) */
        <div className="executive-report-container animate-fade-in">
          <div className="executive-report-document glass-card-lg">
            <div className="report-doc-header">
              <div className="report-brand">
                <img src="/war_room_logo.png" alt="Logo" className="report-logo" />
                <div>
                  <h1 className="doc-title">EXECUTIVE REPORT</h1>
                  <p className="doc-subtitle">AI Executive Board Verdict & Strategic Brief</p>
                </div>
              </div>
              <div className="report-date-badge">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="report-score-hero">
              <div className="score-box-gold">
                <span className="score-lbl">OVERALL SCORE</span>
                <span className="score-num">{overallScore} <small>/ 10</small></span>
              </div>
              <div className="verdict-box">
                <span className="verdict-lbl">BOARD DECISION</span>
                <span className="verdict-val">{verdict}</span>
              </div>
            </div>

            <div className="report-sections-grid">
              {/* Strengths */}
              <div className="report-block block-strengths">
                <h3><span className="icon-green">✓</span> Key Strengths</h3>
                <ul>
                  {strengths.map((s, i) => (
                    <li key={i}><span className="bullet-check">✓</span> {s}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="report-block block-weaknesses">
                <h3><span className="icon-red">✗</span> Strategic Weaknesses</h3>
                <ul>
                  {weaknesses.map((w, i) => (
                    <li key={i}><span className="bullet-cross">✗</span> {w}</li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="report-block block-risks">
                <h3><span className="icon-yellow">⚠</span> Fatal Risks & Vulnerabilities</h3>
                <ul>
                  {risks.map((r, i) => (
                    <li key={i}><span className="bullet-warn">⚠</span> {r}</li>
                  ))}
                </ul>
              </div>

              {/* Actionable Recommendations */}
              <div className="report-block block-recommendations">
                <h3><span className="icon-blue">💡</span> Board Recommendations</h3>
                <ol>
                  {recommendations.map((rec, i) => (
                    <li key={i}><strong>{i + 1}.</strong> {rec}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="report-actions-row">
              <button className="btn btn-primary btn-lg btn-glow" onClick={onNewAnalysis}>
                <AppIcon emoji="🔄" size={18} /> Generate Improved Version
              </button>
              <button className="btn btn-secondary btn-lg" onClick={handleExportPDF}>
                <AppIcon emoji="📄" size={18} /> Export PDF / Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
