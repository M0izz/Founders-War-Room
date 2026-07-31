import React, { useState, useEffect, useRef } from 'react';
import AppIcon from './AppIcon.jsx';

// Web Audio API Synthesizer (Zero External Audio File Dependency)
function playBoardroomSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'chime') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'chair') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

const BOARD_SEATS_MAP = [
  { id: 'chairman', role: 'Chairman', iconName: 'chairman', color: '#F5F5F5', pos: 'top' },
  { id: 'ceo', role: 'CEO', iconName: 'ceo', color: '#3b82f6', pos: 'left-top' },
  { id: 'investor', role: 'Investor', iconName: 'investor', color: '#fbbf24', pos: 'right-top' },
  { id: 'marketing', role: 'Marketing', iconName: 'marketing', color: '#c084fc', pos: 'left-mid' },
  { id: 'cto', role: 'CTO', iconName: 'cto', color: '#38bdf8', pos: 'right-mid' },
  { id: 'customer', role: 'Customer', iconName: 'customer', color: '#4ade80', pos: 'left-bot' },
  { id: 'risk', role: 'Risk Advisor', iconName: 'risk', color: '#fb923c', pos: 'right-bot' },
  { id: 'reaper', role: 'Grim Reaper', iconName: 'reaper', color: '#f87171', pos: 'bot' },
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

  // Easter Egg checks
  const isCatIdea = ideaData?.name?.toLowerCase().includes('cat') || ideaData?.description?.toLowerCase().includes('cat') || ideaData?.description?.toLowerCase().includes('uber for cats');

  const debateTimeline = [
    {
      speaker: 'CEO',
      role: 'Vision Strategist',
      color: '#3b82f6',
      iconName: 'ceo',
      time: '10:42 AM',
      quote: `This startup idea addresses a critical gap in ${ideaData?.industry || 'the market'} with strong category-defining potential.`,
    },
    {
      speaker: 'Investor',
      role: 'Business Viability Analyst',
      color: '#fbbf24',
      iconName: 'investor',
      time: '10:43 AM',
      quote: isCatIdea ? "I'd invest... emotionally." : 'The initial customer acquisition cost is high, but the unit economics scale gracefully at enterprise level.',
    },
    {
      speaker: 'Marketing',
      role: 'Growth Architect',
      color: '#c084fc',
      iconName: 'marketing',
      time: '10:43 AM',
      quote: 'We need an organic viral loop. Pivot directly to B2B partnership distribution channels immediately.',
    },
    {
      speaker: 'CTO',
      role: 'Feasibility Engineer',
      color: '#38bdf8',
      iconName: 'cto',
      time: '10:44 AM',
      quote: 'Technically sound architecture. We can deploy the initial core MVP in under 90 days.',
    },
    {
      speaker: 'Customer',
      role: 'Demand Validator',
      color: '#4ade80',
      iconName: 'customer',
      time: '10:44 AM',
      quote: 'Willingness to pay is high if onboarding friction is zero and security is guaranteed.',
    },
    {
      speaker: 'Risk Advisor',
      role: 'Operational Risk Analyst',
      color: '#fb923c',
      iconName: 'risk',
      time: '10:45 AM',
      quote: 'Regulatory compliance and data protection landmines must be cleared before public rollout.',
    },
    {
      speaker: 'Grim Reaper',
      role: 'Death Predictor',
      color: '#f87171',
      iconName: 'reaper',
      time: '10:45 AM',
      quote: isCatIdea
        ? "Nine lives still won't save this business model."
        : 'This startup dies in Year 2 if incumbent platform players copy your primary hook as a free feature.',
    },
    {
      speaker: 'Chairman',
      role: 'Executive Arbitrator',
      color: '#ffffff',
      iconName: 'chairman',
      time: '10:46 AM',
      quote: `Quorum reached. The board approves conditional execution. Final Overall Score: ${result?.overallScore || 8.7}/10.`,
    },
  ];

  // Extract structured analysis
  const overallScore = result?.overallScore || 8.7;
  const verdict = result?.verdict || 'APPROVED WITH CONDITIONAL MVP';
  const strengths = result?.strengths || [
    'Huge addressable market with high demand urgency',
    'Feasible technical architecture for 90-day deployment',
    'Strong category-defining potential and clear value proposition',
  ];
  const weaknesses = result?.weaknesses || [
    'Initial customer acquisition cost requires optimization',
    'Regulatory compliance & data privacy risk management',
  ];
  const recommendations = result?.recommendations || [
    'Build 90-Day core MVP with zero onboarding friction',
    'Establish strategic enterprise distribution partnerships',
    'Implement automated referral viral loops',
    'Clear regulatory and security compliance early',
  ];

  // Auto-advance debate steps & trigger sound synth
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < debateTimeline.length - 1) {
          playBoardroomSound('chair');
          return prev + 1;
        }
        setIsPlaying(false);
        playBoardroomSound('chime');
        return prev;
      });
    }, 3800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeStep]);

  const handleReplayDebate = () => {
    setActiveStep(0);
    setIsPlaying(true);
    playBoardroomSound('click');
  };

  const currentSpeaker = debateTimeline[activeStep];
  const progressPct = Math.round(((activeStep + 1) / debateTimeline.length) * 100);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="war-room-product-page">
      <div className="command-bg-grid" />
      <div className="command-ambient-glow" />

      {/* Top Header */}
      <header className="war-room-header">
        <div className="header-left">
          <span className="live-pill"><span className="pulse-dot-green" /> LIVE BOARDROOM SESSION</span>
          <h2 className="header-startup-name">{ideaData?.name || 'VITALINK'}</h2>
        </div>

        <div className="header-nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'debate' ? 'active' : ''}`}
            onClick={() => { setActiveTab('debate'); playBoardroomSound('click'); }}
          >
            <AppIcon name="ceo" size={16} /> Live Debate
          </button>
          <button
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => { setActiveTab('report'); playBoardroomSound('click'); }}
          >
            <AppIcon name="history" size={16} /> Executive Report
          </button>
        </div>

        <div className="header-actions">
          <button className="btn-sm btn-ghost" onClick={handleReplayDebate} title="Replay Board Meeting">
            <AppIcon name="zap" size={16} /> Replay Meeting
          </button>
          <button className="btn-sm btn-ghost" onClick={handleExportPDF} title="Export PDF Report">
            <AppIcon name="history" size={16} /> Export PDF
          </button>
          <button className="btn-sm btn-primary btn-glow" onClick={onNewAnalysis}>
            <AppIcon name="plus" size={16} /> New Session
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      {activeTab === 'debate' ? (
        <div className="war-room-main-layout">
          {/* Left Area: Oval Boardroom Scene (60% Product Focus) */}
          <div className="war-room-center-stage glass-card-lg">
            <div className="boardroom-stage-header">
              <span className="stage-eyebrow">EXECUTIVE DEBATE IN PROGRESS</span>
              <div className="playback-controls">
                <button
                  className="control-btn"
                  onClick={() => { setIsPlaying(!isPlaying); playBoardroomSound('click'); }}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  className="control-btn"
                  onClick={handleReplayDebate}
                >
                  Replay Debate
                </button>
              </div>
            </div>

            {/* Oval Table Diagram */}
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
                            <AppIcon name={currentSpeaker.iconName} size={14} color={currentSpeaker.color} /> {currentSpeaker.speaker}
                          </div>
                          <p className="bubble-text">"{currentSpeaker.quote}"</p>
                        </div>
                      )}

                      <div
                        className="seat-avatar-circle"
                        style={{
                          backgroundColor: seat.color,
                          boxShadow: isSpeaking ? `0 0 28px ${seat.color}` : 'none',
                        }}
                      >
                        <AppIcon name={seat.iconName} size={20} color="#fff" />
                      </div>
                      <span className="seat-role-title">{seat.role}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Checklist */}
            <div className="war-room-bottom-progress">
              <div className="progress-checklist">
                {debateTimeline.map((d, i) => (
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

          {/* Right Sidebar Transcript */}
          <aside className="war-room-transcript-sidebar glass-panel">
            <div className="transcript-header">
              <AppIcon name="ceo" size={18} color="#60a5fa" />
              <h3>Meeting Transcript</h3>
            </div>

            <div className="transcript-feed">
              {debateTimeline.slice(0, activeStep + 1).map((item, idx) => (
                <div key={idx} className="transcript-item animate-fade-in-up">
                  <div
                    className="transcript-avatar"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}66` }}
                  >
                    <AppIcon name={item.iconName} size={14} color="#fff" />
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
        /* Keynote-Style Final Verdict & Report View */
        <div className="executive-report-container animate-fade-in">
          <div className="keynote-verdict-card glass-card-lg">
            
            {/* Verdict Banner */}
            <div className="keynote-verdict-header">
              <span className="keynote-approved-tag">APPROVED</span>
              <h1 className="keynote-startup-title">{ideaData?.name || 'VITALINK'}</h1>
              <p className="keynote-industry">{ideaData?.industry || 'HealthTech'}</p>
            </div>

            {/* Overall Score Keynote Hero */}
            <div className="keynote-score-hero">
              <span className="score-hero-label">Overall Score</span>
              <div className="score-hero-number-row">
                <span className="score-hero-big">{overallScore}</span>
                <span className="score-hero-denom">/ 10</span>
              </div>
              <div className="star-rating-row">
                <span className="star-fill">★★★★★★★★★</span>
                <span className="star-empty">☆</span>
              </div>
            </div>

            {/* Grid for Strengths & Weaknesses */}
            <div className="keynote-grid-2col">
              
              <div className="keynote-block block-strengths">
                <h3 className="block-title green-text">
                  <AppIcon name="check" size={18} color="#4ade80" /> Key Strengths
                </h3>
                <ul className="keynote-list">
                  {strengths.map((s, i) => (
                    <li key={i}><span className="check-mark">✔</span> {s}</li>
                  ))}
                </ul>
              </div>

              <div className="keynote-block block-weaknesses">
                <h3 className="block-title yellow-text">
                  <AppIcon name="warning" size={18} color="#fbbf24" /> Weaknesses & Risks
                </h3>
                <ul className="keynote-list">
                  {weaknesses.map((w, i) => (
                    <li key={i}><span className="warn-mark">⚠</span> {w}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Recommended MVP */}
            <div className="keynote-mvp-section">
              <h3 className="block-title blue-text">
                <AppIcon name="target" size={18} color="#38bdf8" /> Recommended 90-Day MVP Roadmap
              </h3>
              <ol className="mvp-numbered-list">
                {recommendations.map((rec, i) => (
                  <li key={i}><strong>Step {i + 1}:</strong> {rec}</li>
                ))}
              </ol>
            </div>

            {/* Actions Bar */}
            <div className="keynote-actions-bar">
              <button className="btn btn-secondary btn-lg" onClick={handleExportPDF}>
                Download McKinsey PDF Report
              </button>
              <button className="btn btn-secondary btn-lg" onClick={onViewHistory}>
                View Version Timeline
              </button>
              <button className="btn btn-primary btn-lg btn-glow" onClick={onNewAnalysis}>
                Run Again / Convene Board
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
