import React, { useState, useEffect, useRef } from 'react';
import AppIcon from './AppIcon.jsx';

const BOARD_MEMBERS = [
  {
    id: 'ceo',
    name: 'CEO',
    role: 'Vision Strategist',
    emoji: '🏛️',
    color: '#4F8CFF',
    quote: 'The problem is real and the vision is compelling.',
    domain: 'Strategic Vision & Category Creation',
  },
  {
    id: 'cto',
    name: 'CTO',
    role: 'Feasibility Engineer',
    emoji: '⚙️',
    color: '#38BDF8',
    quote: 'Technically feasible but MVP scope is too bloated.',
    domain: 'Technical Feasibility & Architecture',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    role: 'Growth Architect',
    emoji: '📢',
    color: '#A855F7',
    quote: 'Positioning lacks viral loop.',
    domain: 'Acquisition Channels & Positioning',
  },
  {
    id: 'chairman',
    name: 'The Chairman',
    role: 'Executive Arbitrator',
    emoji: '👑',
    color: '#F5F5F5',
    quote: "Let's hear every perspective.",
    domain: 'Consensus & Final Verdict',
  },
  {
    id: 'investor',
    name: 'Investor',
    role: 'Business Viability Analyst',
    emoji: '💰',
    color: '#FBBF24',
    quote: 'Revenue model is unclear. How do you scale?',
    domain: 'Monetization, Unit Economics & TAM',
  },
  {
    id: 'reaper',
    name: 'Grim Reaper',
    role: 'Death Predictor',
    emoji: '💀',
    color: '#EF4444',
    quote: 'This dies in Year 2.',
    domain: 'Startup Autopsy & Fatal Flaws',
  },
];

const FULL_BOARD = [
  ...BOARD_MEMBERS,
  {
    id: 'customer',
    name: 'Customer',
    role: 'Demand Validator',
    emoji: '🧑‍💻',
    color: '#22C55E',
    quote: 'I am not opening my wallet for nice-to-haves.',
    domain: 'Willingness to Pay & Pain Urgency',
  },
  {
    id: 'risk',
    name: 'Risk Advisor',
    role: 'Operational Risk Analyst',
    emoji: '🛡️',
    color: '#F97316',
    quote: 'Here are the legal & compliance landmines you overlooked.',
    domain: 'Regulatory, Legal & Operational Risk',
  },
];

const SIMULATED_DEBATE = [
  {
    speaker: 'CEO',
    role: 'Vision Strategist',
    color: '#4F8CFF',
    emoji: '🏛️',
    text: 'The problem is real and the vision is compelling for a multi-billion dollar market.',
  },
  {
    speaker: 'Investor',
    role: 'Business Viability Analyst',
    color: '#FBBF24',
    emoji: '💰',
    text: 'Revenue model is unclear. Customer acquisition costs will crush your margins.',
  },
  {
    speaker: 'CTO',
    role: 'Feasibility Engineer',
    color: '#38BDF8',
    emoji: '⚙️',
    text: 'Technically feasible but MVP scope is too bloated for a 90-day launch.',
  },
  {
    speaker: 'Marketing',
    role: 'Growth Architect',
    color: '#A855F7',
    emoji: '📢',
    text: 'Positioning lacks viral loop. Pivot directly to enterprise distribution.',
  },
  {
    speaker: 'Grim Reaper',
    role: 'Death Predictor',
    color: '#EF4444',
    emoji: '💀',
    text: 'This dies in Year 2. Zero defensibility once incumbents copy your core feature.',
  },
  {
    speaker: 'The Chairman',
    role: 'Executive Arbitrator',
    color: '#F5F5F5',
    emoji: '👑',
    text: "Order in the room. Pivot to enterprise security approved. Score: 8.4/10.",
  },
];

export default function Landing({ onEnter, onLogin, onConvene }) {
  const [activeMember, setActiveMember] = useState(FULL_BOARD[0]);
  const [demoStep, setDemoStep] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);

  // Auto-play demo debate
  useEffect(() => {
    if (!isPlayingDemo) return;
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % SIMULATED_DEBATE.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlayingDemo]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = onLogin || onEnter;
  const handleConveneClick = onConvene || onEnter;

  return (
    <div className="cinematic-landing">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TOP NAVIGATION BAR                                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <nav className="landing-nav-bar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/war_room_logo.png" alt="Founder's War Room Logo" className="official-logo-img" />
            <span className="logo-text">FOUNDER'S WAR ROOM</span>
          </div>

          <div className="nav-links">
            <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('section-how-it-works'); }}>How It Works</a>
            <a href="#the-board" onClick={(e) => { e.preventDefault(); scrollToSection('section-the-board'); }}>The Board</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('section-capabilities'); }}>Features</a>
            <a href="#comparison" onClick={(e) => { e.preventDefault(); scrollToSection('section-comparison'); }}>Comparison</a>
          </div>

          <div className="nav-actions">
            <button className="btn-nav-login" onClick={handleLoginClick}>Log in</button>
            <button className="btn-nav-convene" onClick={handleConveneClick}>Convene the Board</button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION — REALISTIC CINEMATIC BOARDROOM (MATCHES IMAGE 2)        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="hero-boardroom-v2">
        {/* Background Realistic Boardroom Image */}
        <div className="boardroom-bg-img-wrap">
          <img src="/boardroom_hero.png" alt="Executive Boardroom" className="boardroom-bg-img" />
          <div className="boardroom-overlay-vignette" />
        </div>

        {/* Central Hero Typography & Actions */}
        <div className="hero-content-v2">
          <div className="hero-eyebrow-v2">
            <span className="star-sparkle">✦</span> AI EXECUTIVE BOARD OF DIRECTORS <span className="star-sparkle">✦</span>
          </div>

          <h1 className="hero-title-v2">
            Your startup.<br />
            Their <span className="gold-highlight">toughest</span> meeting.
          </h1>

          <p className="hero-subtitle-v2">
            "Before the Market Judges You, We Will."
          </p>

          <div className="hero-buttons-v2">
            <button className="btn-hero-v2-primary" onClick={handleConveneClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AppIcon emoji="🏛" size={18} /></span> ENTER THE WAR ROOM
            </button>
            <button className="btn-hero-v2-secondary" onClick={() => scrollToSection('interactive-demo-section')}>
              <span className="btn-icon">▷</span> WATCH DEMO
            </button>
          </div>
        </div>

        {/* Callout Speech Bubbles Tailored to Board Seats */}
        <div className="hero-callouts-container">
          {/* CEO — Top Left */}
          <div className="hero-callout callout-ceo">
            <div className="callout-header header-ceo">
              <span className="callout-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AppIcon emoji="🏛" size={16} color="#4F8CFF" /></span>
              <span className="callout-title">CEO</span>
            </div>
            <p className="callout-text">"The problem is real and the vision is compelling."</p>
            <div className="callout-stem stem-ceo" />
          </div>

          {/* CTO — Bottom Left */}
          <div className="hero-callout callout-cto">
            <div className="callout-header header-cto">
              <span className="callout-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AppIcon emoji="⚙️" size={16} color="#38BDF8" /></span>
              <span className="callout-title">CTO</span>
            </div>
            <p className="callout-text">"Technically feasible but MVP scope is too bloated."</p>
            <div className="callout-stem stem-cto" />
          </div>

          {/* Marketing — Center Left */}
          <div className="hero-callout callout-marketing">
            <div className="callout-header header-marketing">
              <span className="callout-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AppIcon emoji="📢" size={16} color="#A855F7" /></span>
              <span className="callout-title">MARKETING</span>
            </div>
            <p className="callout-text">"Positioning lacks viral loop."</p>
            <div className="callout-stem stem-marketing" />
          </div>

          {/* The Chairman — Center Head of Table */}
          <div className="hero-callout callout-chairman">
            <div className="callout-header header-chairman">
              <span className="callout-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AppIcon emoji="👑" size={16} color="#F5F5F5" /></span>
              <span className="callout-title">THE CHAIRMAN</span>
            </div>
            <p className="callout-text">"Let's hear every perspective."</p>
            <div className="callout-stem stem-chairman" />
          </div>

          {/* Investor — Top Right */}
          <div className="hero-callout callout-investor">
            <div className="callout-header header-investor">
              <span className="callout-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AppIcon emoji="💰" size={16} color="#FBBF24" /></span>
              <span className="callout-title">INVESTOR</span>
            </div>
            <p className="callout-text">"Revenue model is unclear. How do you scale?"</p>
            <div className="callout-stem stem-investor" />
          </div>

          {/* Grim Reaper — Bottom Right */}
          <div className="hero-callout callout-reaper">
            <div className="callout-header header-reaper">
              <span className="callout-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><AppIcon emoji="💀" size={16} color="#EF4444" /></span>
              <span className="callout-title">GRIM REAPER</span>
            </div>
            <p className="callout-text">"This dies in Year 2."</p>
            <div className="callout-stem stem-reaper" />
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — MOST FOUNDERS BUILD ALONE (STORY)                         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-story container">
        <div className="story-split-container">
          {/* Alone card */}
          <div className="story-card alone-card">
            <div className="story-card-badge">THE OLD WAY</div>
            <div className="story-visual-alone">
              <div className="founder-alone-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppIcon emoji="🧑‍💻" size={32} color="#A855F7" />
              </div>
              <div className="single-laptop-glow" />
            </div>
            <h3>Most founders build alone.</h3>
            <p>
              Relying on guesswork, echo-chamber feedback, or generic single-prompt AI chat
              that approves every idea without questioning it.
            </p>
          </div>

          {/* Transition Divider */}
          <div className="story-transition-divider">
            <div className="divider-line" />
            <div className="divider-badge">VS</div>
            <div className="divider-line" />
          </div>

          {/* Boardroom card */}
          <div className="story-card board-card">
            <div className="story-card-badge badge-gold">THE WAR ROOM WAY</div>
            <div className="story-visual-board">
              <div className="mini-board-seats">
                {FULL_BOARD.map((m, i) => (
                  <span
                    key={i}
                    className="seat-dot"
                    style={{ backgroundColor: m.color, boxShadow: `0 2px 8px ${m.color}40`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <AppIcon emoji={m.emoji} size={18} color="#fff" />
                  </span>
                ))}
              </div>
            </div>
            <h3>What if you had an entire executive board?</h3>
            <p>
              Imagine walking into a high-stakes boardroom where 8 specialized C-Suite leaders
              cross-examine every flaw before your launch.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — INTRODUCE THE AI BOARD OF DIRECTORS                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-the-board" className="section-board container">
        <div className="section-header">
          <h2 className="section-title">
            Meet Your <span className="gold-text">Executive Board</span>
          </h2>
          <p className="section-subtitle">
            Hover over any board member to inspect their role and analytical domain.
          </p>
        </div>

        <div className="board-interactive-layout">
          {/* Member Selection Grid */}
          <div className="board-grid">
            {FULL_BOARD.map((member) => {
              const isSelected = activeMember.id === member.id;
              return (
                <div
                  key={member.id}
                  className={`board-member-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveMember(member)}
                  onMouseEnter={() => setActiveMember(member)}
                  style={{
                    '--member-color': member.color,
                  }}
                >
                  <div
                    className="member-avatar-circle"
                    style={{
                      borderColor: member.color,
                      boxShadow: isSelected ? `0 0 25px ${member.color}60` : `0 0 10px ${member.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="member-emoji" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AppIcon emoji={member.emoji} size={22} color={member.color} />
                    </span>
                  </div>
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
              );
            })}
          </div>

          {/* Active Member Focus Card */}
          <div
            className="board-focus-card"
            style={{
              borderColor: activeMember.color,
              boxShadow: `0 0 40px ${activeMember.color}25`,
            }}
          >
            <div className="focus-header">
              <div
                className="focus-avatar-large"
                style={{ backgroundColor: `${activeMember.color}15`, border: `2px solid ${activeMember.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <AppIcon emoji={activeMember.emoji} size={36} color={activeMember.color} />
              </div>
              <div>
                <h3 className="focus-name" style={{ color: activeMember.color }}>
                  {activeMember.name}
                </h3>
                <span className="focus-role">{activeMember.role}</span>
              </div>
            </div>

            <div className="focus-domain">
              <span className="domain-label">ANALYTICAL DOMAIN</span>
              <p className="domain-value">{activeMember.domain}</p>
            </div>

            <div className="focus-quote">
              <span className="quote-mark">“</span>
              <p>{activeMember.quote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — ANIMATED TIMELINE / BOARDROOM JOURNEY                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-timeline container">
        <div className="section-header">
          <h2 className="section-title">
            The Startup <span className="blue-text">Evolution Timeline</span>
          </h2>
          <p className="section-subtitle">
            How a raw concept evolves into an investor-approved blueprint.
          </p>
        </div>

        <div className="timeline-track">
          {[
            { step: '01', title: 'Idea', desc: 'Input your concept & goals', icon: '💡' },
            { step: '02', title: 'Board Meeting', desc: 'Convene 8 AI executives', icon: '🏛️' },
            { step: '03', title: 'Debate', desc: 'Cross-examine weaknesses', icon: '⚔️' },
            { step: '04', title: 'Improve', desc: 'Refine business & tech model', icon: '📈' },
            { step: '05', title: 'Approve', desc: 'Receive Chairman verdict', icon: '🎖️' },
            { step: '06', title: 'Build MVP', desc: 'Launch with 0 blind spots', icon: '🚀' },
          ].map((item, idx) => (
            <div key={idx} className="timeline-node">
              <div className="timeline-node-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="node-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AppIcon emoji={item.icon} size={20} color="var(--primary)" />
                </span>
                <span className="node-step">{item.step}</span>
              </div>
              <h4 className="node-title">{item.title}</h4>
              <p className="node-desc">{item.desc}</p>
              {idx < 5 && <div className="timeline-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — INTERACTIVE DEMO (LIVE BOARD DEBATE SIMULATION)           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="interactive-demo-section" className="section-demo container">
        <div className="section-header">
          <div className="live-demo-badge">LIVE SIMULATION</div>
          <h2 className="section-title">
            Experience a <span className="gold-text">Live Board Debate</span>
          </h2>
          <p className="section-subtitle">
            Watch how your board interrogates ideas in real time before rendering a verdict.
          </p>
        </div>

        <div className="demo-player-container">
          <div className="demo-player-header">
            <div className="window-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="demo-title">
              FOUNDER'S WAR ROOM — SIMULATED SESSION ● LIVE
            </div>
            <div className="demo-controls">
              <button
                className="btn-demo-toggle"
                onClick={() => setIsPlayingDemo(!isPlayingDemo)}
              >
                {isPlayingDemo ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
          </div>

          <div className="demo-dialogue-body">
            {SIMULATED_DEBATE.map((item, idx) => {
              const isActive = idx === demoStep;
              return (
                <div
                  key={idx}
                  className={`demo-message-row ${isActive ? 'active-row' : 'dim-row'}`}
                  onClick={() => {
                    setDemoStep(idx);
                    setIsPlayingDemo(false);
                  }}
                  style={{
                    '--speaker-color': item.color,
                  }}
                >
                  <div
                    className="demo-speaker-avatar"
                    style={{
                      borderColor: item.color,
                      backgroundColor: `${item.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AppIcon emoji={item.emoji} size={20} color={item.color} />
                  </div>
                  <div className="demo-message-content">
                    <div className="demo-speaker-header">
                      <span className="speaker-name" style={{ color: item.color }}>
                        {item.speaker}
                      </span>
                      <span className="speaker-role">{item.role}</span>
                      {isActive && <span className="speaking-badge">● SPEAKING</span>}
                    </div>
                    <p className="demo-speech-text">"{item.text}"</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="demo-player-footer">
            <div className="demo-step-dots">
              {SIMULATED_DEBATE.map((_, i) => (
                <span
                  key={i}
                  className={`step-dot ${i === demoStep ? 'active' : ''}`}
                  onClick={() => {
                    setDemoStep(i);
                    setIsPlayingDemo(false);
                  }}
                />
              ))}
            </div>
            <span className="demo-hint">Click any speaker to jump straight to their turn</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — TRADITIONAL AI VS WAR ROOM (COMPARISON TABLE)             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-comparison" className="section-comparison container">
        <div className="section-header">
          <h2 className="section-title">
            Why War Room <span className="gold-text">Beats Chatbots</span>
          </h2>
          <p className="section-subtitle">
            Generic AI tools flatter your idea. War Room puts it through stress-test battle.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>DIMENSION</th>
                <th className="th-old">TRADITIONAL AI CHAT</th>
                <th className="th-new">FOUNDER'S WAR ROOM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-feature">Structure</td>
                <td className="td-old">Single AI Model</td>
                <td className="td-new highlighted-cell">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><AppIcon emoji="🏛️" size={16} /> 8 Executive C-Suite Agents</span>
                </td>
              </tr>
              <tr>
                <td className="td-feature">Perspective</td>
                <td className="td-old">Single Agreeable Output</td>
                <td className="td-new highlighted-cell">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><AppIcon emoji="⚔️" size={16} /> Multi-Agent Real-Time Debate</span>
                </td>
              </tr>
              <tr>
                <td className="td-feature">Risk Analysis</td>
                <td className="td-old">Generic Disclaimer</td>
                <td className="td-new highlighted-cell">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><AppIcon emoji="💀" size={16} /> Grim Reaper Startup Autopsy</span>
                </td>
              </tr>
              <tr>
                <td className="td-feature">Output Format</td>
                <td className="td-old">Static Text Report</td>
                <td className="td-new highlighted-cell">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><AppIcon emoji="🎬" size={16} /> Live Boardroom Meeting Experience</span>
                </td>
              </tr>
              <tr>
                <td className="td-feature">Execution Plan</td>
                <td className="td-old">Vague Bullet Points</td>
                <td className="td-new highlighted-cell">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><AppIcon emoji="📈" size={16} /> Iterative Evolution Roadmap</span>
                </td>
              </tr>
              <tr>
                <td className="td-feature">Session Feel</td>
                <td className="td-old">Generic Chatbot Prompt</td>
                <td className="td-new highlighted-cell">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><AppIcon emoji="🔥" size={16} /> High-Stakes Strategy Session</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — HOW IT WORKS (5 STEPS)                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-how-it-works" className="section-steps container">
        <div className="section-header">
          <h2 className="section-title">
            How It <span className="blue-text">Works</span>
          </h2>
          <p className="section-subtitle">
            5 clear steps from raw concept to verified execution strategy.
          </p>
        </div>

        <div className="steps-grid">
          {[
            {
              num: '01',
              title: 'Present Idea',
              desc: 'Input your startup pitch, target audience, and business model.',
              icon: '📝',
            },
            {
              num: '02',
              title: 'Board Debates',
              desc: '8 specialized agents evaluate feasibility, risk, and growth.',
              icon: '🏛️',
            },
            {
              num: '03',
              title: 'Improve Startup',
              desc: 'Identify hidden flaws, cross-examinations, and failure risks.',
              icon: '⚡',
            },
            {
              num: '04',
              title: 'Generate Blueprint',
              desc: 'Receive consolidated Chairman verdict & action roadmap.',
              icon: '📊',
            },
            {
              num: '05',
              title: 'Launch MVP',
              desc: 'Execute with maximum confidence and zero blind spots.',
              icon: '🚀',
            },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{s.num}</div>
              <div className="step-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppIcon emoji={s.icon} size={28} color="var(--primary)" />
              </div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — BOARD CAPABILITIES (GLASS CARDS)                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-capabilities" className="section-capabilities container">
        <div className="section-header">
          <h2 className="section-title">
            Board <span className="gold-text">Capabilities</span>
          </h2>
          <p className="section-subtitle">
            Built specifically to deliver high-octane strategic clarity.
          </p>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card glass-card">
            <div className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AppIcon emoji="⚔️" size={28} color="var(--primary)" /></div>
            <h3>Cross Examination</h3>
            <div className="cap-divider" />
            <p>Agents challenge each other’s assumptions to spot contradictions before market launch.</p>
          </div>

          <div className="capability-card glass-card card-reaper">
            <div className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AppIcon emoji="💀" size={28} color="var(--danger)" /></div>
            <h3>Failure Prediction</h3>
            <div className="cap-divider" />
            <p>The Grim Reaper identifies exact causes of death and hidden risks early.</p>
          </div>

          <div className="capability-card glass-card">
            <div className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AppIcon emoji="🎖️" size={28} color="var(--warning)" /></div>
            <h3>Executive Verdict</h3>
            <div className="cap-divider" />
            <p>The Chairman delivers a definitive final decision, overall score, and strategic action plan.</p>
          </div>

          <div className="capability-card glass-card">
            <div className="cap-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AppIcon emoji="📈" size={28} color="var(--success)" /></div>
            <h3>Evolution Timeline</h3>
            <p>Track every iteration and score change as your startup model refines.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FINAL CTA SECTION — YOUR BOARD IS WAITING                             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-final-cta">
        <div className="final-cta-glow" />
        <div className="container final-cta-content">
          <div className="spotlight-chair-visual">
            <div className="spotlight-beam" />
            <div className="chair-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon emoji="🪑" size={40} color="var(--primary)" />
            </div>
          </div>

          <h2 className="final-cta-title">
            Your Board Is Waiting.
          </h2>

          <p className="final-cta-subtext">
            Take your seat at the head of the table. Put your startup through the ultimate test.
          </p>

          <button className="btn-final-convene" onClick={handleConveneClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <AppIcon emoji="🏛" size={18} /> Start Your First Board Meeting
          </button>
        </div>
      </section>
    </div>
  );
}
