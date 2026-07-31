import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

const DEFAULT_EVOLUTION_VERSIONS = [
  {
    version: 6,
    isLatest: true,
    name: 'VITALINK',
    industry: 'HealthTech',
    date: '7/31/2026',
    fullTimestamp: 'Thursday, July 31, 2026 at 10:30 PM',
    reviewedTime: 'July 31, 2026 · 10:30 PM',
    focus: 'Monetization Strategy & Scaling Plan',
    status: 'REVIEWED',
    score: 8.4,
    improvements: [
      'Clearer monetization strategy defined',
      'Stronger go-to-market plan',
      'Better understanding of target customers',
    ],
    concerns: [
      'Unit economics still need refinement',
      'Competitive moat can be stronger',
    ],
    nextSteps: [
      'Validate pricing with real customers',
      'Build MVP and measure key metrics',
      'Strengthen defensibility',
    ],
  },
  {
    version: 5,
    isLatest: false,
    name: 'VITALINK',
    industry: 'HealthTech',
    date: '7/31/2026',
    fullTimestamp: 'Thursday, July 31, 2026 at 04:15 PM',
    reviewedTime: 'July 31, 2026 · 04:15 PM',
    focus: 'Go-to-Market Strategy',
    status: 'REVIEWED',
    score: 7.8,
    improvements: [
      'Identified primary healthcare provider personas',
      'Formulated enterprise B2B partner distribution',
    ],
    concerns: [
      'High initial marketing acquisition cost',
    ],
    nextSteps: [
      'Refine value proposition for ER doctors',
      'Test pilot pricing model',
    ],
  },
  {
    version: 4,
    isLatest: false,
    name: 'VITALINK',
    industry: 'HealthTech',
    date: '7/30/2026',
    fullTimestamp: 'Wednesday, July 30, 2026 at 08:20 PM',
    reviewedTime: 'July 30, 2026 · 08:20 PM',
    focus: 'Product & MVP Validation',
    status: 'REVIEWED',
    score: 7.1,
    improvements: [
      'Simplified QR access workflow to 1-tap',
      'Defined core security & data encryption requirements',
    ],
    concerns: [
      'HIPAA compliance clearing process takes time',
    ],
    nextSteps: [
      'Draft technical architectural spec',
    ],
  },
  {
    version: 3,
    isLatest: false,
    name: 'VITALINK',
    industry: 'HealthTech',
    date: '7/29/2026',
    fullTimestamp: 'Tuesday, July 29, 2026 at 02:45 PM',
    reviewedTime: 'July 29, 2026 · 02:45 PM',
    focus: 'Market Research & Problem Validation',
    status: 'REVIEWED',
    score: 6.4,
    improvements: [
      'Validated high user demand for emergency QR access',
    ],
    concerns: [
      'Monetization model unclear',
    ],
    nextSteps: [
      'Explore B2B vs B2C revenue paths',
    ],
  },
  {
    version: 2,
    isLatest: false,
    name: 'VITALINK',
    industry: 'HealthTech',
    date: '7/29/2026',
    fullTimestamp: 'Tuesday, July 29, 2026 at 11:00 AM',
    reviewedTime: 'July 29, 2026 · 11:00 AM',
    focus: 'Idea Feasibility',
    status: 'REVIEWED',
    score: 5.6,
    improvements: [
      'Confirmed technical feasibility of emergency QR payload',
    ],
    concerns: [
      'Incumbent EHR integration risk',
    ],
    nextSteps: [
      'Conduct competitive analysis',
    ],
  },
  {
    version: 1,
    isLatest: false,
    name: 'VITALINK',
    industry: 'HealthTech',
    date: '7/28/2026',
    fullTimestamp: 'Monday, July 28, 2026 at 09:30 AM',
    reviewedTime: 'July 28, 2026 · 09:30 AM',
    focus: 'Initial Concept',
    status: 'REVIEWED',
    score: 4.8,
    improvements: [
      'Initial concept submission',
    ],
    concerns: [
      'Unstructured product definition',
    ],
    nextSteps: [
      'Define core target user persona',
    ],
  },
];

function RadarChart() {
  return (
    <svg width="180" height="150" viewBox="0 0 200 180" className="radar-chart-svg">
      <polygon points="100,20 176,55 147,140 53,140 24,55" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <polygon points="100,45 150,68 131,123 69,123 50,68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <polygon points="100,70 125,81 115,106 85,106 75,81" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      <line x1="100" y1="90" x2="100" y2="20" stroke="rgba(255,255,255,0.1)" />
      <line x1="100" y1="90" x2="176" y2="55" stroke="rgba(255,255,255,0.1)" />
      <line x1="100" y1="90" x2="147" y2="140" stroke="rgba(255,255,255,0.1)" />
      <line x1="100" y1="90" x2="53" y2="140" stroke="rgba(255,255,255,0.1)" />
      <line x1="100" y1="90" x2="24" y2="55" stroke="rgba(255,255,255,0.1)" />

      <polygon
        points="100,28 168,60 138,132 60,135 32,60"
        fill="rgba(59, 130, 246, 0.25)"
        stroke="#38bdf8"
        strokeWidth="2"
      />

      <circle cx="100" cy="28" r="3.5" fill="#38bdf8" />
      <circle cx="168" cy="60" r="3.5" fill="#38bdf8" />
      <circle cx="138" cy="132" r="3.5" fill="#38bdf8" />
      <circle cx="60" cy="135" r="3.5" fill="#38bdf8" />
      <circle cx="32" cy="60" r="3.5" fill="#38bdf8" />

      <text x="100" y="12" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="700">Market</text>
      <text x="182" y="55" fill="#94a3b8" fontSize="10" textAnchor="start" fontWeight="700">Product</text>
      <text x="152" y="152" fill="#94a3b8" fontSize="10" textAnchor="start" fontWeight="700">Execution</text>
      <text x="48" y="152" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="700">Financials</text>
      <text x="18" y="55" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="700">Team</text>
    </svg>
  );
}

export default function EvolutionTimeline({
  onNavigate,
  onOpenStartup,
  history = [],
  userName = 'Moiz',
  onClose,
}) {
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const list = DEFAULT_EVOLUTION_VERSIONS;
  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.focus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSelected = filteredList[selectedVersionIndex] || filteredList[0] || list[0];

  const handleToggleMenu = (e, idx) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === idx ? null : idx);
  };

  return (
    <div className="v2-dashboard-page" onClick={() => setOpenMenuIndex(null)}>
      {/* Background Grid & Glow */}
      <div className="v2-bg-grid" />
      <div className="v2-bg-ambient-glow" />

      {/* Header */}
      <header className="v2-header">
        <div className="v2-header-brand" onClick={() => onNavigate && onNavigate('landing')}>
          <img src="/war_room_logo.png" alt="War Room Crest" className="v2-header-logo-img" />
          <div className="v2-header-brand-titles">
            <span className="v2-brand-title">FOUNDER'S WAR ROOM</span>
            <span className="v2-brand-subtitle">AI BOARD OF DIRECTORS</span>
          </div>
        </div>

        <div className="v2-header-actions">
          <button className="v2-icon-btn" title="Power Status">
            <AppIcon name="zap" size={16} />
          </button>
          <button className="v2-icon-btn" title="Notifications">
            <AppIcon name="bell" size={16} />
            <span className="v2-notification-dot" />
          </button>
          <button className="v2-icon-btn" title="Settings" onClick={() => onNavigate && onNavigate('settings')}>
            <AppIcon name="cto" size={16} />
          </button>
          <div className="v2-user-dropdown-pill">
            <div className="v2-user-avatar">
              <AppIcon name="user" size={14} color="#fff" />
            </div>
            <span className="v2-user-name">{userName}</span>
            <AppIcon name="chevron" size={14} className="v2-dropdown-arrow" />
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="v2-body">
        {/* Left Sidebar */}
        <aside className="v2-sidebar">
          <nav className="v2-sidebar-nav">
            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('dashboard')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Dashboard</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('form')}>
              <span className="nav-item-icon"><AppIcon name="build" size={18} /></span>
              <span>New Mission</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('boardroom')}>
              <span className="nav-item-icon"><AppIcon name="ceo" size={18} /></span>
              <span>War Room</span>
            </button>

            <button className="v2-nav-item active" onClick={() => onNavigate && onNavigate('timeline')}>
              <span className="nav-item-icon"><AppIcon name="activity" size={18} color="#f59e0b" /></span>
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>Evolution</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('reports')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Reports</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('settings')}>
              <span className="nav-item-icon"><AppIcon name="cto" size={18} /></span>
              <span>Settings</span>
            </button>
          </nav>

          <div className="v2-upgrade-box">
            <div className="upgrade-title-row">
              <AppIcon name="crown" size={16} color="#fbbf24" />
              <span className="upgrade-title">Upgrade Plan</span>
            </div>
            <span className="upgrade-subtext">Unlock advanced features &gt;</span>
          </div>
        </aside>

        {/* Center & Right Content Grid */}
        <main className="v2-main-content" style={{ maxWidth: '1440px' }}>
          <div className="evolution-exact-grid">

            {/* Left Area: Timeline Node Feed */}
            <div className="evolution-feed-column">
              
              {/* Header Title Row */}
              <div className="evolution-title-row">
                <div>
                  <h1 className="evolution-main-heading">Evolution Timeline</h1>
                  <p className="evolution-subtext">Track how your mission has evolved with every board review.</p>
                </div>

                {/* Real-time Search Input by Name */}
                <div className="evolution-search-box">
                  <AppIcon name="analyzing" size={14} className="search-icon-left" />
                  <input
                    type="text"
                    className="evolution-search-input"
                    placeholder="Search by startup name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Vertical Timeline List with Clean Glowing Dots */}
              <div className="evolution-nodes-list">
                <div className="evolution-timeline-line" />

                {filteredList.length > 0 ? (
                  filteredList.map((item, idx) => {
                    const isSelected = selectedVersionIndex === idx;
                    const isMenuOpen = openMenuIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`evolution-version-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedVersionIndex(idx)}
                      >
                        {/* Left Glowing Node Dot */}
                        <div className={`version-dot-node ${isSelected ? 'selected' : ''}`} />

                        {/* Card Content */}
                        <div className="v-card-body">
                          <div className="v-card-top">
                            <div className="v-title-stack">
                              <div className="v-name-row">
                                <span className="v-version-pill-tag">v{item.version}</span>
                                {item.isLatest && <span className="v-latest-tag">✦ LATEST</span>}
                                <h3 className="v-startup-name">{item.name}</h3>
                              </div>
                              <span className="v-industry-label">{item.industry}</span>
                            </div>

                            <div className="v-score-row">
                              <span className="v-reviewed-pill">✔ REVIEWED</span>
                              <div className="v-score-display">
                                <span className="v-score-big">{item.score}</span>
                                <span className="v-score-denom">/10</span>
                              </div>
                              
                              {/* Interactive 3-Dots Button */}
                              <div className="v-menu-container">
                                <button
                                  className="v-menu-dots-btn"
                                  onClick={(e) => handleToggleMenu(e, idx)}
                                  title="Version Options"
                                >
                                  ⋮
                                </button>

                                {/* Dropdown Options Popup */}
                                {isMenuOpen && (
                                  <div className="v-options-menu-popup glass-panel animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                                    <div className="menu-timestamp-header">
                                      <AppIcon name="clock" size={14} color="#38bdf8" />
                                      <span>{item.fullTimestamp}</span>
                                    </div>

                                    <div className="menu-items-list">
                                      <button
                                        className="menu-option-item"
                                        onClick={() => {
                                          setOpenMenuIndex(null);
                                          if (onOpenStartup) onOpenStartup({ name: item.name });
                                        }}
                                      >
                                        <AppIcon name="history" size={14} /> View Full Report
                                      </button>

                                      <button
                                        className="menu-option-item"
                                        onClick={() => {
                                          setOpenMenuIndex(null);
                                          if (onNavigate) onNavigate('boardroom');
                                        }}
                                      >
                                        <AppIcon name="zap" size={14} color="#60a5fa" /> Replay Board Meeting
                                      </button>

                                      <button
                                        className="menu-option-item delete-option"
                                        onClick={() => {
                                          setOpenMenuIndex(null);
                                          alert(`Deleted version v${item.version}`);
                                        }}
                                      >
                                        <AppIcon name="close" size={14} color="#f87171" /> Delete Version
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>

                          <div className="v-card-bottom">
                            <span className="v-focus-text">
                              <strong>Focus:</strong> {item.focus}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-search-results" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    No version history found matching "{searchQuery}"
                  </div>
                )}
              </div>

            </div>

            {/* Right Side Detail Panel */}
            <div className="evolution-detail-column">
              <div className="evolution-detail-card glass-panel">
                
                {/* Top Detail Header */}
                <div className="detail-header-row">
                  <div className="detail-title-group">
                    <div className="detail-title-line">
                      <h2 className="detail-v-title">Version {currentSelected.version}</h2>
                      {currentSelected.isLatest && <span className="v-latest-tag">✦ LATEST</span>}
                    </div>
                    <span className="detail-reviewed-date">Reviewed on {currentSelected.reviewedTime}</span>
                  </div>
                  {onClose && (
                    <button className="detail-close-btn" onClick={onClose}>
                      <AppIcon name="close" size={18} />
                    </button>
                  )}
                </div>

                {/* Score & Radar Chart Section */}
                <div className="detail-score-radar-row">
                  {/* Left Score Box */}
                  <div className="detail-score-box">
                    <div className="score-big-row">
                      <span className="score-big-val">{currentSelected.score}</span>
                      <span className="score-denom-sm">/10</span>
                    </div>
                    <span className="score-sub-label">Board Score</span>
                    <div className="stars-row-gold">
                      ★★★★★
                    </div>
                  </div>

                  {/* Right Radar SVG Pentagon Chart */}
                  <div className="detail-radar-box">
                    <RadarChart />
                  </div>
                </div>

                {/* Key Improvements */}
                <div className="detail-section-block">
                  <h4 className="section-block-title green">Key Improvements</h4>
                  <ul className="detail-check-list">
                    {currentSelected.improvements.map((imp, i) => (
                      <li key={i}>
                        <span className="icon-check-green">✔</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Board Concerns */}
                <div className="detail-section-block">
                  <h4 className="section-block-title red">Board Concerns</h4>
                  <ul className="detail-warn-list">
                    {currentSelected.concerns.map((con, i) => (
                      <li key={i}>
                        <span className="icon-warn-red">⚠</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="detail-section-block">
                  <h4 className="section-block-title blue">Next Steps</h4>
                  <ul className="detail-arrow-list">
                    {currentSelected.nextSteps.map((step, i) => (
                      <li key={i}>
                        <span className="icon-arrow-blue">→</span> {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="detail-actions-footer">
                  <button
                    className="detail-btn-ghost"
                    onClick={() => onOpenStartup && onOpenStartup({ name: currentSelected.name })}
                  >
                    <AppIcon name="history" size={16} /> View Full Report
                  </button>

                  <button
                    className="detail-btn-primary"
                    onClick={() => onNavigate && onNavigate('boardroom')}
                  >
                    <AppIcon name="zap" size={16} color="#fff" /> Replay Meeting
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
