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

  // Extract dynamic agent quotes from result object
  const agentMap = {};
  if (result?.agentResults && Array.isArray(result.agentResults)) {
    result.agentResults.forEach((a) => {
      if (a.key) agentMap[a.key] = a;
      if (a.agentName) agentMap[a.agentName.toLowerCase().replace(/\s+/g, '')] = a;
    });
  }

  const ceoQuote = agentMap['ceo']?.verdict || `This startup idea addresses a critical gap in ${ideaData?.industry || 'the market'} with strong category-defining potential.`;
  const investorQuote = agentMap['investor']?.verdict || 'The initial customer acquisition cost is high, but the unit economics scale gracefully at enterprise level.';
  const marketingQuote = agentMap['marketing']?.verdict || 'We need an organic viral loop. Pivot directly to strategic distribution channels.';
  const ctoQuote = agentMap['cto']?.verdict || 'Technically sound architecture. We can deploy the initial core MVP in under 90 days.';
  const customerQuote = agentMap['customer']?.verdict || 'Willingness to pay is high if onboarding friction is zero and security is guaranteed.';
  const riskQuote = agentMap['riskadvisor']?.verdict || agentMap['risk']?.verdict || 'Regulatory compliance and data protection landmines must be cleared before public rollout.';
  const reaperQuote = result?.grimReaper?.deathSentence || 'This startup dies in Year 2 if incumbent platform players copy your primary hook as a free feature.';
  const chairmanQuote = result?.executiveSummary 
    ? `${result.executiveSummary} Final Score: ${result.overallScore || 8.4}/10 (${result.verdict || 'PROCEED WITH CONDITIONS'}).`
    : `Quorum reached. The board approves conditional execution. Final Overall Score: ${result?.overallScore || 8.4}/10.`;

  const debateTimeline = [
    {
      speaker: 'CEO',
      role: 'Vision Strategist',
      color: '#3b82f6',
      iconName: 'ceo',
      time: '10:42 AM',
      quote: ceoQuote,
    },
    {
      speaker: 'Investor',
      role: 'Business Viability Analyst',
      color: '#fbbf24',
      iconName: 'investor',
      time: '10:43 AM',
      quote: isCatIdea ? "I'd invest... emotionally." : investorQuote,
    },
    {
      speaker: 'Marketing',
      role: 'Growth Architect',
      color: '#c084fc',
      iconName: 'marketing',
      time: '10:43 AM',
      quote: marketingQuote,
    },
    {
      speaker: 'CTO',
      role: 'Feasibility Engineer',
      color: '#38bdf8',
      iconName: 'cto',
      time: '10:44 AM',
      quote: ctoQuote,
    },
    {
      speaker: 'Customer',
      role: 'Demand Validator',
      color: '#4ade80',
      iconName: 'customer',
      time: '10:44 AM',
      quote: customerQuote,
    },
    {
      speaker: 'Risk Advisor',
      role: 'Operational Risk Analyst',
      color: '#fb923c',
      iconName: 'risk',
      time: '10:45 AM',
      quote: riskQuote,
    },
    {
      speaker: 'Grim Reaper',
      role: 'Death Predictor',
      color: '#f87171',
      iconName: 'reaper',
      time: '10:45 AM',
      quote: isCatIdea ? "Nine lives still won't save this business model." : reaperQuote,
    },
    {
      speaker: 'Chairman',
      role: 'Executive Arbitrator',
      color: '#ffffff',
      iconName: 'chairman',
      time: '10:46 AM',
      quote: chairmanQuote,
    },
  ];

  // Timer counter (mm:ss)
  const [secondsElapsed, setSecondsElapsed] = useState(767); // Default 12:47 to match mockup
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startupName = ideaData?.name || 'VaultPulse';

  // Extract structured analysis
  const overallScore = result?.overallScore || 8.7;
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

  const handleReplayDebate = () => {
    setActiveStep(0);
    setIsPlaying(true);
    playBoardroomSound('click');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="wr-mockup-container">
      {/* Top Header Controls */}
      <header className="war-room-header" style={{ marginBottom: '8px' }}>
        <div className="header-left">
          <span className="live-pill"><span className="pulse-dot-green" /> LIVE BOARDROOM SESSION</span>
          <h2 className="header-startup-name">{startupName}</h2>
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
            <AppIcon name="zap" size={16} /> Replay
          </button>
          <button className="btn-sm btn-primary btn-glow" onClick={onNewAnalysis}>
            <AppIcon name="plus" size={16} /> New Session
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      {activeTab === 'debate' ? (
        <div className="wr-mockup-layout">
          
          {/* Left Stage Container */}
          <div className="wr-left-stage-card">
            
            {/* Topbar Headline & Metrics */}
            <div className="wr-topbar-row">
              <div className="wr-topbar-headline">
                <h2>EXECUTIVE DEBATE IN PROGRESS</h2>
                <p>8 AI Executives analyzing {startupName} from every angle</p>
              </div>

              <div className="wr-topbar-metrics">
                <div className="wr-metric-item">
                  <span className="wr-metric-label">BOARD PROGRESS</span>
                  <span className="wr-metric-value">7 / 8 Complete</span>
                  <div className="wr-progress-bar-sm">
                    <div className="wr-progress-fill-sm" style={{ width: '87.5%' }} />
                  </div>
                </div>

                <div className="wr-metric-item">
                  <span className="wr-metric-label">DEBATE PHASE</span>
                  <span className="wr-metric-value" style={{ color: '#38bdf8' }}>
                    Chairman Synthesis
                  </span>
                </div>

                <div className="wr-metric-item">
                  <span className="wr-metric-label">TIME ELAPSED</span>
                  <div className="wr-timer-box">
                    <AppIcon name="clock" size={16} color="#38bdf8" />
                    <span>{formatTimer(secondsElapsed)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Radial Canvas */}
            <div className="wr-radial-canvas">
              {/* SVG Dotted Connection Lines */}
              <svg className="wr-svg-lines" viewBox="0 0 800 480">
                <line x1="400" y1="240" x2="400" y2="45" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="240" x2="210" y2="135" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="240" x2="590" y2="135" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="240" x2="140" y2="240" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="240" x2="660" y2="240" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="240" x2="210" y2="345" stroke="rgba(74, 222, 128, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="240" x2="590" y2="345" stroke="rgba(251, 146, 60, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="240" x2="400" y2="435" stroke="rgba(248, 113, 113, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Central Glowing Orb */}
              <div className="wr-center-orb-node">
                <img src="/war_room_logo.png" alt="W" />
                <span>FOUNDER'S<br />WAR ROOM</span>
              </div>

              {/* 8 Agent Seat Nodes */}

              {/* Chairman (Top) */}
              <div className="wr-agent-seat-node seat-chairman">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                  <AppIcon name="chairman" size={18} color="#fbbf24" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">CHAIRMAN</span>
                  <span className="wr-node-role">Executive Arbitrator</span>
                  <span className="wr-node-status-pill status-synthesizing">● SYNTHESIZING</span>
                </div>
              </div>

              {/* CEO (Top-Left) */}
              <div className="wr-agent-seat-node seat-ceo">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                  <AppIcon name="ceo" size={18} color="#3b82f6" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">CEO</span>
                  <span className="wr-node-role">Vision Strategist</span>
                  <span className="wr-node-status-pill status-complete">✓ COMPLETE</span>
                </div>
              </div>

              {/* Investor (Top-Right) */}
              <div className="wr-agent-seat-node seat-investor">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
                  <AppIcon name="investor" size={18} color="#fbbf24" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">INVESTOR</span>
                  <span className="wr-node-role">Business Analyst</span>
                  <span className="wr-node-status-pill status-complete">✓ COMPLETE</span>
                </div>
              </div>

              {/* Marketing (Mid-Left) */}
              <div className="wr-agent-seat-node seat-marketing">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc' }}>
                  <AppIcon name="marketing" size={18} color="#c084fc" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">MARKETING</span>
                  <span className="wr-node-role">Growth Architect</span>
                  <span className="wr-node-status-pill status-complete">✓ COMPLETE</span>
                </div>
              </div>

              {/* CTO (Mid-Right) */}
              <div className="wr-agent-seat-node seat-cto">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                  <AppIcon name="cto" size={18} color="#38bdf8" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">CTO</span>
                  <span className="wr-node-role">Feasibility Engineer</span>
                  <span className="wr-node-status-pill status-complete">✓ COMPLETE</span>
                </div>
              </div>

              {/* Customer (Bottom-Left) */}
              <div className="wr-agent-seat-node seat-customer">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>
                  <AppIcon name="customer" size={18} color="#4ade80" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">CUSTOMER</span>
                  <span className="wr-node-role">Demand Validator</span>
                  <span className="wr-node-status-pill status-complete">✓ COMPLETE</span>
                </div>
              </div>

              {/* Risk Advisor (Bottom-Right) */}
              <div className="wr-agent-seat-node seat-risk">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(251, 146, 60, 0.2)', color: '#fb923c' }}>
                  <AppIcon name="risk" size={18} color="#fb923c" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">RISK ADVISOR</span>
                  <span className="wr-node-role">Risk Analyst</span>
                  <span className="wr-node-status-pill status-complete">✓ COMPLETE</span>
                </div>
              </div>

              {/* Grim Reaper (Bottom) */}
              <div className="wr-agent-seat-node seat-reaper">
                <div className="wr-node-icon-avatar" style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }}>
                  <AppIcon name="reaper" size={18} color="#f87171" />
                </div>
                <div className="wr-node-info">
                  <span className="wr-node-title">GRIM REAPER</span>
                  <span className="wr-node-role">Death Predictor</span>
                  <span className="wr-node-status-pill status-challenging">● CHALLENGING</span>
                </div>
              </div>

            </div>

            {/* Bottom Stepper Pipeline Row */}
            <div className="wr-stepper-pipeline-row">
              
              <div className="wr-step-card completed-step">
                <div className="wr-step-title-group">
                  <AppIcon name="check" size={14} color="#4ade80" />
                  <span className="wr-step-name">1 Core Analysis</span>
                </div>
                <span className="wr-step-subtext" style={{ color: '#4ade80' }}>6/6 Complete</span>
              </div>

              <div className="wr-step-card completed-step">
                <div className="wr-step-title-group">
                  <AppIcon name="reaper" size={14} color="#4ade80" />
                  <span className="wr-step-name">2 Reaper Review</span>
                </div>
                <span className="wr-step-subtext" style={{ color: '#4ade80' }}>Complete</span>
              </div>

              <div className="wr-step-card completed-step">
                <div className="wr-step-title-group">
                  <AppIcon name="target" size={14} color="#c084fc" />
                  <span className="wr-step-name">3 Cross-Exam</span>
                </div>
                <span className="wr-step-subtext" style={{ color: '#c084fc' }}>Contradictions Found</span>
              </div>

              <div className="wr-step-card active-step">
                <div className="wr-step-title-group">
                  <AppIcon name="chairman" size={14} color="#38bdf8" />
                  <span className="wr-step-name">4 Chairman Verdict</span>
                </div>
                <span className="wr-step-subtext" style={{ color: '#38bdf8' }}>In Progress</span>
              </div>

              <div className="wr-step-card">
                <div className="wr-step-title-group">
                  <AppIcon name="risk" size={14} color="#64748b" />
                  <span className="wr-step-name">5 Audit & Finalize</span>
                </div>
                <span className="wr-step-subtext">Pending</span>
              </div>

            </div>

          </div>

          {/* Right Side Transcript Panel */}
          <aside className="wr-transcript-panel-card">
            <div className="wr-transcript-header-row">
              <div className="wr-transcript-title">
                <AppIcon name="activity" size={16} color="#38bdf8" />
                <span>MEETING TRANSCRIPT</span>
              </div>

              <select className="wr-transcript-filter-select">
                <option>All Agents</option>
                <option>Core Agents</option>
                <option>Grim Reaper</option>
                <option>Chairman</option>
              </select>
            </div>

            <div className="wr-transcript-feed-scroll">
              
              {/* CEO Card */}
              <div className="wr-msg-card-item theme-ceo">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                  <AppIcon name="ceo" size={16} color="#3b82f6" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <span className="wr-msg-speaker-name" style={{ color: '#3b82f6' }}>CEO</span>
                    <span className="wr-msg-timestamp">10:42 AM</span>
                  </div>
                  <p className="wr-msg-quote-text">{ceoQuote}</p>
                </div>
              </div>

              {/* Investor Card */}
              <div className="wr-msg-card-item theme-investor">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                  <AppIcon name="investor" size={16} color="#fbbf24" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <span className="wr-msg-speaker-name" style={{ color: '#fbbf24' }}>Investor</span>
                    <span className="wr-msg-timestamp">10:43 AM</span>
                  </div>
                  <p className="wr-msg-quote-text">{investorQuote}</p>
                </div>
              </div>

              {/* Marketing Card */}
              <div className="wr-msg-card-item theme-marketing">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(192, 132, 252, 0.2)' }}>
                  <AppIcon name="marketing" size={16} color="#c084fc" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <span className="wr-msg-speaker-name" style={{ color: '#c084fc' }}>Marketing</span>
                    <span className="wr-msg-timestamp">10:43 AM</span>
                  </div>
                  <p className="wr-msg-quote-text">{marketingQuote}</p>
                </div>
              </div>

              {/* CTO Card */}
              <div className="wr-msg-card-item theme-cto">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(56, 189, 248, 0.2)' }}>
                  <AppIcon name="cto" size={16} color="#38bdf8" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <span className="wr-msg-speaker-name" style={{ color: '#38bdf8' }}>CTO</span>
                    <span className="wr-msg-timestamp">10:44 AM</span>
                  </div>
                  <p className="wr-msg-quote-text">{ctoQuote}</p>
                </div>
              </div>

              {/* Customer Card */}
              <div className="wr-msg-card-item theme-customer">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(74, 222, 128, 0.2)' }}>
                  <AppIcon name="customer" size={16} color="#4ade80" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <span className="wr-msg-speaker-name" style={{ color: '#4ade80' }}>Customer</span>
                    <span className="wr-msg-timestamp">10:44 AM</span>
                  </div>
                  <p className="wr-msg-quote-text">{customerQuote}</p>
                </div>
              </div>

              {/* Risk Advisor Card */}
              <div className="wr-msg-card-item theme-risk">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(251, 146, 60, 0.2)' }}>
                  <AppIcon name="risk" size={16} color="#fb923c" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <span className="wr-msg-speaker-name" style={{ color: '#fb923c' }}>Risk Advisor</span>
                    <span className="wr-msg-timestamp">10:45 AM</span>
                  </div>
                  <p className="wr-msg-quote-text">{riskQuote}</p>
                </div>
              </div>

              {/* Grim Reaper Card (with ADVERSARIAL REVIEW badge) */}
              <div className="wr-msg-card-item theme-reaper">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(248, 113, 113, 0.2)' }}>
                  <AppIcon name="reaper" size={16} color="#f87171" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="wr-msg-speaker-name" style={{ color: '#f87171' }}>Grim Reaper</span>
                      <span className="wr-msg-timestamp">10:46 AM</span>
                    </div>
                    <span className="wr-msg-tag-badge" style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }}>
                      ADVERSARIAL REVIEW
                    </span>
                  </div>
                  <p className="wr-msg-quote-text">{reaperQuote}</p>
                </div>
              </div>

              {/* Chairman Card (with SYNTHESIZING badge) */}
              <div className="wr-msg-card-item theme-chairman">
                <div className="wr-msg-avatar-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                  <AppIcon name="chairman" size={16} color="#fbbf24" />
                </div>
                <div className="wr-msg-content-stack">
                  <div className="wr-msg-header-line">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="wr-msg-speaker-name" style={{ color: '#fbbf24' }}>Chairman</span>
                      <span className="wr-msg-timestamp">10:47 AM</span>
                    </div>
                    <span className="wr-msg-tag-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                      SYNTHESIZING
                    </span>
                  </div>
                  <p className="wr-msg-quote-text">Evaluating all perspectives and forming final verdict...</p>
                </div>
              </div>

              <div ref={transcriptEndRef} />
            </div>
          </aside>

        </div>
      ) : (
        /* Executive Report Tab */
        <div className="executive-report-container animate-fade-in">
          <div className="keynote-verdict-card glass-card-lg">
            
            <div className="keynote-verdict-header">
              <span className="keynote-approved-tag">APPROVED</span>
              <h1 className="keynote-startup-title">{startupName}</h1>
              <p className="keynote-industry">{ideaData?.industry || 'HealthTech'}</p>
            </div>

            <div className="keynote-score-hero">
              <span className="score-hero-label">Overall Score</span>
              <div className="score-hero-number-row">
                <span className="score-hero-big">{overallScore}</span>
                <span className="score-hero-denom">/ 10</span>
              </div>
            </div>

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

            <div className="keynote-mvp-section">
              <h3 className="block-title blue-text">
                <AppIcon name="target" size={18} color="#38bdf8" /> Required Action Items
              </h3>
              <ol className="mvp-numbered-list">
                {recommendations.map((rec, i) => (
                  <li key={i}><strong>Step {i + 1}:</strong> {rec}</li>
                ))}
              </ol>
            </div>

            <div className="keynote-actions-bar">
              <button className="btn btn-secondary btn-lg" onClick={handleExportPDF}>
                Download PDF Report
              </button>
              <button className="btn btn-primary btn-glow btn-lg" onClick={onNewAnalysis}>
                Start New Session
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
