import React, { useState, useMemo } from 'react';
import AppIcon from './AppIcon.jsx';

// Pre-populated initial startup dataset
const BASE_STARTUPS = {
  VITALINK: {
    id: 'VITALINK',
    name: 'VITALINK',
    category: 'HealthTech',
    versions: [
      {
        version: 'V6',
        isLatest: true,
        score: 8.4,
        date: 'Jul 31, 2026',
        focus: 'Monetization & Scaling',
        targetAudience: 'Emergency healthcare providers',
        revenue: 'B2B SaaS ($299/mo)',
        mvp: 'QR emergency profile',
        risk: 'Medium',
        verdictStatus: 'Proceed',
        verdictQuote: '"Promising concept with a clearer path to enterprise commercialization."',
        whatChanged: [
          'Clearer monetization strategy defined',
          'Stronger GTM plan for ER providers',
          'Better target customer definition',
        ],
        positiveChanges: [
          'Revenue model clarified to B2B SaaS',
          'Target customer narrowed to emergency care providers',
          'MVP scope reduced to QR emergency profile',
          'Emergency use case strengthened',
        ],
        negativeChanges: [
          'Unit economics still need validation',
        ],
      },
      {
        version: 'V5',
        isLatest: false,
        score: 7.8,
        date: 'Jul 31, 2026',
        focus: 'Go-to-Market Strategy',
        targetAudience: 'Healthcare providers & EMTs',
        revenue: 'Per-device license',
        mvp: 'Mobile app + QR band',
        risk: 'Medium-High',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Strong traction on usability, but CAC remains high."',
        whatChanged: [
          'Identified primary healthcare provider personas',
          'Formulated enterprise B2B partner distribution',
        ],
        positiveChanges: [
          'B2B partner channel identified',
          'User personas refined',
        ],
        negativeChanges: [
          'CAC model not yet cost-efficient',
        ],
      },
      {
        version: 'V4',
        isLatest: false,
        score: 7.1,
        date: 'Jul 30, 2026',
        focus: 'Product & MVP Validation',
        targetAudience: 'Hospital emergency departments',
        revenue: 'Undecided',
        mvp: 'Mobile app + hardware scanner',
        risk: 'High',
        verdictStatus: 'Pivot Required',
        verdictQuote: '"HIPAA compliance roadmap needs immediate clarification."',
        whatChanged: [
          'Simplified QR access workflow to 1-tap',
          'Defined core security & data encryption requirements',
        ],
        positiveChanges: [
          '1-tap UI simplification',
          'Security architecture mapped',
        ],
        negativeChanges: [
          'Hardware reliance increases friction',
        ],
      },
      {
        version: 'V3',
        isLatest: false,
        score: 6.8,
        date: 'Jul 29, 2026',
        focus: 'Market Research & Problem Validation',
        targetAudience: 'General consumers',
        revenue: 'Freemium consumer app',
        mvp: 'Full health dashboard',
        risk: 'High',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Consumer health app market is oversaturated."',
        whatChanged: [
          'Validated high user demand for emergency QR access',
        ],
        positiveChanges: [
          'Emergency access feature validated',
        ],
        negativeChanges: [
          'Consumer subscription model unviable',
        ],
      },
      {
        version: 'V2',
        isLatest: false,
        score: 6.8,
        date: 'Jul 29, 2026',
        focus: 'Idea Feasibility',
        targetAudience: 'General consumers',
        revenue: 'Ad-supported model',
        mvp: 'Health portal',
        risk: 'High',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Ad revenue model is weak for healthcare privacy."',
        whatChanged: [
          'Confirmed technical feasibility of emergency QR payload',
        ],
        positiveChanges: [
          'Technical feasibility proven',
        ],
        negativeChanges: [
          'Ad revenue model rejected by board',
        ],
      },
      {
        version: 'V1',
        isLatest: false,
        score: 6.3,
        date: 'Jul 28, 2026',
        focus: 'Initial Concept Submission',
        targetAudience: 'Broad consumer healthcare',
        revenue: 'Unclear',
        mvp: 'Too broad platform',
        risk: 'High',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Value proposition is unfocused and target demographic is overly broad."',
        whatChanged: [
          'Initial concept submission',
          'Basic market hypothesis',
        ],
        positiveChanges: [
          'Initial concept submitted',
        ],
        negativeChanges: [
          'Unfocused value proposition',
        ],
      },
    ],
  },
  MEDORA: {
    id: 'MEDORA',
    name: 'MEDORA',
    category: 'HealthTech',
    versions: [
      {
        version: 'V4',
        isLatest: true,
        score: 7.9,
        date: 'Jul 28, 2026',
        focus: 'Clinical Integration & Pilots',
        targetAudience: 'Private clinics & diagnostic labs',
        revenue: 'Monthly subscription ($499/mo)',
        mvp: 'Diagnostic AI assistant',
        risk: 'Medium',
        verdictStatus: 'Proceed',
        verdictQuote: '"Strong pilot engagement with diagnostic accuracy > 94%."',
        whatChanged: [
          'Diagnostic AI accuracy improved to 94%',
          'SaaS pricing validated with 5 pilot clinics',
        ],
        positiveChanges: [
          '94% AI accuracy achieved',
          'Paid pilot traction established',
        ],
        negativeChanges: [
          'Regulatory clearance still pending',
        ],
      },
      {
        version: 'V3',
        isLatest: false,
        score: 7.4,
        date: 'Jul 25, 2026',
        focus: 'AI Model Accuracy',
        targetAudience: 'Diagnostic labs',
        revenue: 'Per-scan fee',
        mvp: 'Scan analyzer web app',
        risk: 'Medium',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Per-scan fee model creates unpredictable revenue."',
        whatChanged: [
          'Model retrained on 50k annotated medical scans',
        ],
        positiveChanges: [
          'Model training dataset expanded',
        ],
        negativeChanges: [
          'Per-scan pricing rejected',
        ],
      },
      {
        version: 'V2',
        isLatest: false,
        score: 7.0,
        date: 'Jul 20, 2026',
        focus: 'Architecture & Security',
        targetAudience: 'Individual doctors',
        revenue: 'Freemium',
        mvp: 'Desktop scan tool',
        risk: 'High',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Individual doctor sales cycle is too slow."',
        whatChanged: [
          'Added DICOM imaging format support',
        ],
        positiveChanges: [
          'DICOM format compatibility',
        ],
        negativeChanges: [
          'Single-doctor sales model inefficient',
        ],
      },
      {
        version: 'V1',
        isLatest: false,
        score: 6.5,
        date: 'Jul 15, 2026',
        focus: 'Initial Prototype',
        targetAudience: 'General medical practitioners',
        revenue: 'Unclear',
        mvp: 'Basic scan viewer',
        risk: 'High',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Prototype shows promise but lacks enterprise compliance."',
        whatChanged: [
          'Initial prototype submission',
        ],
        positiveChanges: [
          'Proof of concept built',
        ],
        negativeChanges: [
          'Lacks HIPAA compliance',
        ],
      },
    ],
  },
  EVFLOW: {
    id: 'EVFLOW',
    name: 'EVFLOW',
    category: 'Mobility / EV',
    versions: [
      {
        version: 'V3',
        isLatest: true,
        score: 8.7,
        date: 'Jul 20, 2026',
        focus: 'Grid Integration & Fleet Partnerships',
        targetAudience: 'Commercial EV fleet operators',
        revenue: 'Software license + peak savings share',
        mvp: 'Smart charging orchestration API',
        risk: 'Low-Medium',
        verdictStatus: 'Proceed',
        verdictQuote: '"Exceptional unit economics and clear utility partner commitments."',
        whatChanged: [
          'Grid peak-shaving algorithm patent filed',
          'Secured pilot with 2 commercial logistics fleets',
        ],
        positiveChanges: [
          'Fleet pilots secured',
          'Patent filed for grid balancing algorithm',
          'Shared-savings revenue model adopted',
        ],
        negativeChanges: [
          'Hardware firmware integration dependency',
        ],
      },
      {
        version: 'V2',
        isLatest: false,
        score: 7.5,
        date: 'Jul 10, 2026',
        focus: 'Charging Station Hardware Protocol',
        targetAudience: 'Residential EV owners',
        revenue: 'Consumer app subscription',
        mvp: 'Consumer charger app',
        risk: 'Medium',
        verdictStatus: 'Needs Work',
        verdictQuote: '"B2C EV charging apps face high churn."',
        whatChanged: [
          'OCPP 2.0 protocol support implemented',
        ],
        positiveChanges: [
          'OCPP 2.0 protocol integration',
        ],
        negativeChanges: [
          'Pivoted away from B2C to commercial fleets',
        ],
      },
      {
        version: 'V1',
        isLatest: false,
        score: 6.8,
        date: 'Jun 30, 2026',
        focus: 'Initial Concept',
        targetAudience: 'EV owners',
        revenue: 'Ad revenue',
        mvp: 'Station locator map',
        risk: 'High',
        verdictStatus: 'Needs Work',
        verdictQuote: '"Station map is a commodity feature."',
        whatChanged: [
          'Initial EV charging concept',
        ],
        positiveChanges: [
          'EV market opportunity identified',
        ],
        negativeChanges: [
          'Commodity feature set',
        ],
      },
    ],
  },
};

// SVG Line/Area Graph for Score Evolution
function ScoreEvolutionChart({ versions = [] }) {
  // Sort versions chronologically (V1 -> V6)
  const chronoVersions = [...versions].reverse();
  const width = 680;
  const height = 180;
  const paddingX = 50;
  const paddingY = 30;

  const minScore = 4.0;
  const maxScore = 10.0;

  const points = chronoVersions.map((v, idx) => {
    const step = (width - paddingX * 2) / Math.max(1, chronoVersions.length - 1);
    const x = paddingX + idx * step;
    const y = height - paddingY - ((v.score - minScore) / (maxScore - minScore)) * (height - paddingY * 2);
    return { x, y, version: v.version, score: v.score };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: 'transparent' }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[5.0, 7.0, 9.0].map((sVal) => {
          const y = height - paddingY - ((sVal - minScore) / (maxScore - minScore)) * (height - paddingY * 2);
          return (
            <g key={sVal}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <text x={paddingX - 12} y={y + 4} fill="#64748b" fontSize="10" fontWeight="700" textAnchor="end">{sVal}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#scoreGrad)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points & labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="#0d1529" stroke="#38bdf8" strokeWidth="3" />
            <text x={p.x} y={p.y - 12} fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">{p.score}</text>
            <text x={p.x} y={height - 10} fill="#94a3b8" fontSize="11" fontWeight="800" textAnchor="middle">{p.version}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function EvolutionTimeline({
  onNavigate,
  onOpenStartup,
  history = [],
  userName = 'Moiz',
  onClose,
}) {
  // Navigation level: 'library' (Level 1) or 'detail' (Level 2)
  const [currentLevel, setCurrentLevel] = useState('library');
  const [selectedStartupId, setSelectedStartupId] = useState('VITALINK');

  // Search & Filter state for Level 1
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'score', 'versions'

  // Version comparison state for Level 2
  const [compareVersionA, setCompareVersionA] = useState('V1');
  const [compareVersionB, setCompareVersionB] = useState('V6');

  // Level 3 Full Analysis modal state
  const [viewingFullAnalysisVersion, setViewingFullAnalysisVersion] = useState(null);

  // Dynamic discovery of startups from BASE_STARTUPS + history prop
  const startupDict = useMemo(() => {
    const dict = { ...BASE_STARTUPS };

    if (history && history.length > 0) {
      history.forEach((item) => {
        const startupName = (item.title || item.ideaName || 'NEW_STARTUP').toUpperCase();
        if (!dict[startupName]) {
          dict[startupName] = {
            id: startupName,
            name: startupName,
            category: item.category || 'Tech Startup',
            versions: [],
          };
        }

        const nextVerNum = dict[startupName].versions.length + 1;
        dict[startupName].versions.unshift({
          version: `V${nextVerNum}`,
          isLatest: nextVerNum === 1,
          score: item.score || 7.5,
          date: item.date || 'Jul 31, 2026',
          focus: item.focus || 'Board Execution Review',
          targetAudience: item.targetAudience || 'Target Market Segment',
          revenue: item.revenue || 'Subscription SaaS',
          mvp: item.mvp || 'Core Product Feature',
          risk: item.risk || 'Medium',
          verdictStatus: item.verdictStatus || 'Proceed',
          verdictQuote: `"${item.summary || 'Board review completed with actionable insights.'}"`,
          whatChanged: item.keyChanges || ['Board analysis generated', 'Value proposition evaluated'],
          positiveChanges: item.positives || ['Key strengths highlighted', 'Target audience defined'],
          negativeChanges: item.negatives || ['Execution risks identified'],
        });
      });
    }

    return dict;
  }, [history]);

  // List of all startups formatted with meta stats
  const startupList = useMemo(() => {
    return Object.values(startupDict).map((s) => {
      const versions = s.versions || [];
      const latestVer = versions[0] || { score: 7.0, date: 'Jul 31, 2026' };
      const initialVer = versions[versions.length - 1] || latestVer;

      const latestScore = latestVer.score;
      const initialScore = initialVer.score;
      const improvement = (latestScore - initialScore).toFixed(1);
      const isPositiveImp = parseFloat(improvement) >= 0;

      return {
        ...s,
        latestScore,
        initialScore,
        improvement: isPositiveImp ? `+${improvement}` : improvement,
        lastReviewed: latestVer.date,
        versionCount: versions.length,
        versionTrail: [...versions].reverse(),
      };
    });
  }, [startupDict]);

  // Filtered & Sorted startups for Level 1 Library
  const filteredStartups = useMemo(() => {
    let list = startupList.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'score') {
      list.sort((a, b) => b.latestScore - a.latestScore);
    } else if (sortBy === 'versions') {
      list.sort((a, b) => b.versionCount - a.versionCount);
    } // default 'updated' keeps raw chronological order

    return list;
  }, [startupList, searchQuery, sortBy]);

  // Active startup for Level 2 Detail View
  const activeStartup = startupDict[selectedStartupId] || startupDict['VITALINK'] || Object.values(startupDict)[0];
  const activeVersions = activeStartup?.versions || [];
  const latestVersion = activeVersions[0] || {};
  const initialVersion = activeVersions[activeVersions.length - 1] || {};
  const totalScoreDiff = (latestVersion.score - initialVersion.score).toFixed(1);

  // Comparison items
  const verAObj = activeVersions.find((v) => v.version === compareVersionA) || initialVersion;
  const verBObj = activeVersions.find((v) => v.version === compareVersionB) || latestVersion;

  // Interactive Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'Board Review Complete', desc: 'VITALINK V6 scored 8.4/10 with strong commercial traction.', time: '10m ago', type: 'info' },
    { id: 2, title: 'Risk Alert Flagged', desc: 'Grim Reaper flagged unit economics for B2C SaaS model.', time: '1h ago', type: 'risk' },
    { id: 3, title: 'Roster Active', desc: 'All 8 Executive Board AI Agents are operational.', time: '3h ago', type: 'info' },
  ]);

  return (
    <div className="v2-dashboard-page">
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

        <div className="v2-header-actions" style={{ position: 'relative' }}>
          <button
            className="v2-icon-btn"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative' }}
          >
            <AppIcon name="bell" size={16} />
            {notificationsList.length > 0 && <span className="v2-notification-dot" />}
          </button>

          {/* Interactive Notifications Popover */}
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '44px',
              right: '90px',
              width: '320px',
              background: 'rgba(13, 21, 41, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              padding: '16px',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AppIcon name="bell" size={16} color="#fbbf24" />
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>Notifications</span>
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                  onClick={() => setNotificationsList([])}
                >
                  Clear All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                {notificationsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '0.82rem' }}>
                    No new notifications
                  </div>
                ) : (
                  notificationsList.map((n) => (
                    <div key={n.id} style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: n.type === 'risk' ? '3px solid #f87171' : '3px solid #38bdf8'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: n.type === 'risk' ? '#f87171' : '#e2e8f0' }}>{n.title}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{n.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

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
        {/* Left Sidebar Nav */}
        <aside className="v2-sidebar">
          <nav className="v2-sidebar-nav">
            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('dashboard')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Dashboard</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('form')}>
              <span className="nav-item-icon"><AppIcon name="build" size={18} /></span>
              <span>New Startup</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('boardroom')}>
              <span className="nav-item-icon"><AppIcon name="ceo" size={18} /></span>
              <span>War Room</span>
            </button>

            <button className="v2-nav-item active" onClick={() => onNavigate && onNavigate('timeline')}>
              <span className="nav-item-icon"><AppIcon name="activity" size={18} color="#38bdf8" /></span>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>Evolution</span>
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

          {/* Constant Sidebar Widgets */}
          <div className="v2-sidebar-widgets-container" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="v2-upgrade-box">
              <div className="upgrade-title-row">
                <AppIcon name="crown" size={16} color="#c084fc" />
                <span className="upgrade-title">Upgrade Plan</span>
              </div>
              <span className="upgrade-subtext">Unlock advanced features and more credits. &gt;</span>
            </div>

            <div className="v2-upgrade-box" style={{ background: 'rgba(13, 21, 41, 0.85)' }}>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 800, marginBottom: '4px' }}>
                AI Credits Used
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#e2e8f0', marginBottom: '6px' }}>
                8,450 / 10,000
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '84.5%', height: '100%', background: 'linear-gradient(90deg, #c084fc, #38bdf8)', borderRadius: '10px' }} />
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>Reset on Aug 15, 2026</span>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="v2-main-content" style={{ maxWidth: '1440px' }}>
          
          {/* LEVEL 1: STARTUP EVOLUTION LIBRARY */}
          {currentLevel === 'library' && (
            <div>
              {/* Header Title Row */}
              <div className="evolution-title-row">
                <div>
                  <h1 className="evolution-main-heading">EVOLUTION</h1>
                  <p className="evolution-subtext">Track how your startups changed through every board review.</p>
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '20px',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  letterSpacing: '0.5px'
                }}>
                  {filteredStartups.length} Startups Library
                </span>
              </div>

              {/* Search & Sort Controls Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 24px' }}>
                <div className="evolution-search-box" style={{ width: '320px' }}>
                  <AppIcon name="analyzing" size={16} className="search-icon-left" />
                  <input
                    type="text"
                    className="evolution-search-input"
                    placeholder="Search startups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700 }}>Sort:</span>
                  <select
                    className="settings-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '170px' }}
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="score">Highest Score</option>
                    <option value="versions">Most Versions</option>
                  </select>
                </div>
              </div>

              {/* Startup Library Cards Grid */}
              <div className="evolution-startup-grid">
                {filteredStartups.map((startup) => (
                  <div
                    key={startup.id}
                    className="startup-library-card"
                    onClick={() => {
                      setSelectedStartupId(startup.id);
                      setCurrentLevel('detail');
                    }}
                  >
                    {/* Header Row */}
                    <div className="startup-card-header">
                      <div>
                        <h2 className="startup-card-title">{startup.name}</h2>
                        <span className="startup-card-cat">{startup.category}</span>
                      </div>
                      <span className="startup-score-badge">
                        {startup.latestScore} / 10
                      </span>
                    </div>

                    {/* Meta Stats Row */}
                    <div className="startup-meta-row">
                      <span>{startup.versionCount} versions · Last reviewed: {startup.lastReviewed}</span>
                      <span className="startup-delta-badge">
                        ↑ {startup.improvement} improvement
                      </span>
                    </div>

                    {/* Version Progression Trail */}
                    <div className="version-trail-container">
                      {startup.versionTrail.map((v, idx) => (
                        <React.Fragment key={v.version}>
                          <div className={`version-trail-node ${v.isLatest ? 'latest' : ''}`}>
                            <span className="trail-v-label">{v.version}</span>
                            <span className="trail-v-score">{v.score}</span>
                          </div>
                          {idx < startup.versionTrail.length - 1 && (
                            <span className="trail-arrow">──→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div className="startup-card-footer">
                      <button className="btn-view-evolution">
                        View Evolution →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 2: STARTUP EVOLUTION DETAIL & TIMELINE */}
          {currentLevel === 'detail' && (
            <div>
              {/* Back to Evolution Button */}
              <button
                className="evo-back-btn"
                onClick={() => setCurrentLevel('library')}
              >
                <span>←</span> Back to Evolution
              </button>

              {/* Startup Header Banner */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <h1 className="evolution-main-heading">{activeStartup.name}</h1>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 12px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '20px',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    letterSpacing: '0.5px'
                  }}>
                    {activeStartup.category}
                  </span>
                </div>
                <p className="evolution-subtext">
                  <strong>{activeVersions.length} Versions</strong> · <strong>{latestVersion.score}/10 Current Score</strong> ·
                  <span style={{ color: '#4ade80', fontWeight: 800, marginLeft: '8px' }}>
                    ↑ +{totalScoreDiff} improvement since {initialVersion.version}
                  </span>
                </p>
              </div>

              {/* Score Evolution SVG Chart Card */}
              <div className="score-chart-card">
                <h3 className="chart-title">📈 SCORE EVOLUTION</h3>
                <ScoreEvolutionChart versions={activeVersions} />
              </div>

              {/* COMPARE VERSIONS TOOL */}
              <div className="compare-box-card">
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <h3 className="chart-title" style={{ margin: 0 }}>⚡ COMPARE VERSIONS</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Inspect side-by-side progression between any two board reviews</span>
                </div>

                {/* Dropdown Version Selectors */}
                <div className="compare-selectors-row">
                  <select
                    className="compare-select"
                    value={compareVersionA}
                    onChange={(e) => setCompareVersionA(e.target.value)}
                  >
                    {activeVersions.map((v) => (
                      <option key={v.version} value={v.version}>
                        {v.version} ({v.score}/10)
                      </option>
                    ))}
                  </select>

                  <span className="compare-badge-pill">COMPARE</span>

                  <select
                    className="compare-select"
                    value={compareVersionB}
                    onChange={(e) => setCompareVersionB(e.target.value)}
                  >
                    {activeVersions.map((v) => (
                      <option key={v.version} value={v.version}>
                        {v.version} ({v.score}/10)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comparison Matrix Table */}
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Metric</th>
                      <th style={{ width: '37.5%' }}>{verAObj.version} ({verAObj.date})</th>
                      <th style={{ width: '37.5%' }}>{verBObj.version} ({verBObj.date})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Score</strong></td>
                      <td><span style={{ color: '#fbbf24', fontWeight: 800 }}>{verAObj.score} / 10</span></td>
                      <td><span style={{ color: '#4ade80', fontWeight: 900 }}>{verBObj.score} / 10</span></td>
                    </tr>
                    <tr>
                      <td><strong>Target Audience</strong></td>
                      <td>{verAObj.targetAudience}</td>
                      <td>{verBObj.targetAudience}</td>
                    </tr>
                    <tr>
                      <td><strong>Revenue Model</strong></td>
                      <td>{verAObj.revenue}</td>
                      <td>{verBObj.revenue}</td>
                    </tr>
                    <tr>
                      <td><strong>MVP Scope</strong></td>
                      <td>{verAObj.mvp}</td>
                      <td>{verBObj.mvp}</td>
                    </tr>
                    <tr>
                      <td><strong>Risk Profile</strong></td>
                      <td>{verAObj.risk}</td>
                      <td>{verBObj.risk}</td>
                    </tr>
                    <tr>
                      <td><strong>Board Verdict</strong></td>
                      <td>{verAObj.verdictStatus}</td>
                      <td><span style={{ color: '#4ade80', fontWeight: 800 }}>{verBObj.verdictStatus}</span></td>
                    </tr>
                  </tbody>
                </table>

                {/* What Changed Summary Box */}
                <div className="changes-summary-grid">
                  <div className="changes-box-positive">
                    <div className="changes-box-title">✓ What Changed / Improvements</div>
                    <ul className="changes-list">
                      {(verBObj.positiveChanges || verBObj.whatChanged || []).map((item, idx) => (
                        <li key={idx}>+ {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="changes-box-negative">
                    <div className="changes-box-title">⚠ Remaining Concerns & Risks</div>
                    <ul className="changes-list">
                      {(verBObj.negativeChanges || ['Unit economics still require ongoing market validation']).map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* VERSION TIMELINE FEED */}
              <div>
                <h3 className="chart-title" style={{ marginBottom: '20px' }}>🗓 VERSION TIMELINE</h3>

                <div className="version-timeline-scrollable">
                  {activeVersions.map((ver) => (
                    <div
                      key={ver.version}
                      className={`timeline-version-card ${ver.isLatest ? 'is-current' : ''}`}
                    >
                      {/* Version Card Header */}
                      <div className="version-card-header">
                        <div className="version-v-tag">
                          <span>{ver.version}</span>
                          {ver.isLatest && <span className="version-badge-current">CURRENT</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{ver.date}</span>
                          <span className="startup-score-badge" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                            Score: {ver.score}
                          </span>
                        </div>
                      </div>

                      {/* Strategic Focus */}
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Focus: </span>
                        <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 800 }}>{ver.focus}</span>
                      </div>

                      {/* What Changed Bullets */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                          What Changed:
                        </div>
                        <ul className="changes-list" style={{ color: '#e2e8f0' }}>
                          {(ver.whatChanged || []).map((c, i) => (
                            <li key={i}>✓ {c}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Board Verdict Quote */}
                      {ver.verdictQuote && (
                        <div className="verdict-quote-block">
                          <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', fontStyle: 'normal', marginBottom: '4px' }}>
                            Board Verdict
                          </div>
                          {ver.verdictQuote}
                        </div>
                      )}

                      {/* Full Analysis Button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button
                          className="btn-view-evolution"
                          onClick={() => setViewingFullAnalysisVersion(ver)}
                        >
                          View Full Analysis →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* LEVEL 3: FULL ANALYSIS MODAL OVERLAY */}
      {viewingFullAnalysisVersion && (
        <div className="profile-modal-overlay" onClick={() => setViewingFullAnalysisVersion(null)}>
          <div className="profile-modal-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div className="profile-modal-title">
                <AppIcon name="ceo" size={20} color="#fbbf24" />
                <span>Full Board Analysis — {activeStartup.name} ({viewingFullAnalysisVersion.version})</span>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setViewingFullAnalysisVersion(null)}>
                ✕
              </button>
            </div>

            <div className="profile-modal-body">
              {/* Executive Summary */}
              <div>
                <div className="profile-modal-section-title">
                  <span>Executive Board Summary</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                  {viewingFullAnalysisVersion.verdictQuote}
                </div>
              </div>

              {/* Version Specs */}
              <div className="changes-summary-grid">
                <div className="changes-box-positive">
                  <div className="changes-box-title">Key Strengths</div>
                  <ul className="changes-list">
                    {(viewingFullAnalysisVersion.positiveChanges || viewingFullAnalysisVersion.whatChanged).map((p, i) => (
                      <li key={i}>✓ {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="changes-box-negative">
                  <div className="changes-box-title">Risk Directives</div>
                  <ul className="changes-list">
                    {(viewingFullAnalysisVersion.negativeChanges || ['Validate pricing with target users']).map((n, i) => (
                      <li key={i}>⚠ {n}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button className="btn-cancel-profile" onClick={() => setViewingFullAnalysisVersion(null)}>
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
