import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext.jsx';
import AppIcon from './AppIcon.jsx';

// Standardized Board Reports Database
const DEFAULT_REPORTS_LIST = [
  {
    id: 'vitalink-v6',
    name: 'VITALINK',
    subtitle: 'FINAL BOARD REVIEW',
    industry: 'HealthTech',
    date: 'July 31, 2026',
    session: 'Board Session #06',
    score: 8.4,
    scoreStatus: 'STRONG',
    verdictStatus: 'APPROVED WITH CONDITIONS',
    verdictQuote: 'VITALINK is ready for the next stage, provided the founder validates pricing and hospital adoption.',
    tags: ['Monetization', 'GTM', 'Product', 'Risk'],
    executiveSummary: 'The board believes VITALINK has strong emergency-healthcare potential, but monetization and hospital adoption remain the primary concerns before scaling.',
    verdictGrid: [
      { name: 'PRODUCT', status: 'Strong', level: '🟢', color: '#22c55e' },
      { name: 'MARKET', status: 'Strong', level: '🟢', color: '#22c55e' },
      { name: 'MONETIZATION', status: 'Needs Work', level: '🟡', color: '#f59e0b' },
      { name: 'EXECUTION', status: 'Moderate', level: '🟡', color: '#f59e0b' },
      { name: 'RISK', status: 'High', level: '🔴', color: '#f87171' },
    ],
    perspectives: [
      {
        role: 'CEO',
        title: 'Marcus Vance (CEO)',
        iconName: 'ceo',
        color: '#3b82f6',
        quote: '"The core proposition is compelling, but hospital partnerships need validation."',
        verdict: 'Positive',
        verdictIcon: '🟢',
        verdictColor: '#22c55e',
      },
      {
        role: 'INVESTOR',
        title: 'Priya Desai (Investor)',
        iconName: 'investor',
        color: '#d97706',
        quote: '"Revenue model remains insufficiently validated."',
        verdict: 'Concern',
        verdictIcon: '🟡',
        verdictColor: '#f59e0b',
      },
      {
        role: 'CTO',
        title: 'Dr. Aris Thorne (CTO)',
        iconName: 'cto',
        color: '#0284c7',
        quote: '"Architecture is solid, but HIPAA compliance & QR encryption need rigorous audit."',
        verdict: 'Positive',
        verdictIcon: '🟢',
        verdictColor: '#22c55e',
      },
      {
        role: 'CMO',
        title: 'Elena Rostova (CMO)',
        iconName: 'marketing',
        color: '#7e22ce',
        quote: '"B2C messaging resonates, but B2B hospital sales cycle is long."',
        verdict: 'Concern',
        verdictIcon: '🟡',
        verdictColor: '#f59e0b',
      },
      {
        role: 'CUSTOMER',
        title: 'Samir Khan (Customer)',
        iconName: 'customer',
        color: '#15803d',
        quote: '"Emergency doctors love immediate QR scanning without logins."',
        verdict: 'Positive',
        verdictIcon: '🟢',
        verdictColor: '#22c55e',
      },
      {
        role: 'RISK ADVISOR',
        title: 'Dr. Quinn Hayes (Risk)',
        iconName: 'risk',
        color: '#c2410c',
        quote: '"Data privacy liability in trauma cases requires legal coverage."',
        verdict: 'High Risk',
        verdictIcon: '🔴',
        verdictColor: '#f87171',
      },
      {
        role: 'DEVIL\'S ADVOCATE',
        title: 'Grim Reaper (Devil\'s Advocate)',
        iconName: 'reaper',
        color: '#991b1b',
        quote: '"If hospitals refuse API integration, this model dies in 6 months."',
        verdict: 'High Risk',
        verdictIcon: '🔴',
        verdictColor: '#f87171',
      },
      {
        role: 'CHAIRMAN',
        title: 'Board Chair',
        iconName: 'chairman',
        color: '#b45309',
        quote: '"Promising foundation. Proceed with strict hospital pilot criteria."',
        verdict: 'Positive',
        verdictIcon: '🟢',
        verdictColor: '#22c55e',
      },
    ],
    debates: [
      {
        agentA: 'CEO',
        agentB: 'Investor',
        quoteA: '"Hospital adoption should be our first priority."',
        quoteB: '"Not until we prove willingness to pay."',
        resolution: 'Validate willingness-to-pay with 10 hospitals before pursuing large-scale partnerships.',
      },
      {
        agentA: 'CTO',
        agentB: 'Grim Reaper',
        quoteA: '"QR code generation requires zero backend latency."',
        quoteB: '"Offline emergency access will fail if internet drops in ICU."',
        resolution: 'Implement offline local encryption cache on mobile client.',
      },
    ],
    keyFindings: [
      { text: 'Strong emergency-use proposition', isPositive: true },
      { text: 'Clear target customer identified', isPositive: true },
      { text: 'QR-based workflow is differentiated', isPositive: true },
      { text: 'Monetization strategy remains unclear', isPositive: false },
      { text: 'Hospital onboarding may be difficult', isPositive: false },
      { text: 'Regulatory considerations need investigation', isPositive: false },
    ],
    nextActions: [
      {
        id: 'act-1',
        code: '01',
        title: 'Validate pricing',
        desc: 'Interview 10 hospital administrators',
        priority: 'HIGH',
      },
      {
        id: 'act-2',
        code: '02',
        title: 'Test QR workflow',
        desc: 'Run 20 emergency-use simulations',
        priority: 'HIGH',
      },
      {
        id: 'act-3',
        code: '03',
        title: 'Research regulatory requirements',
        desc: 'Identify applicable healthcare regulations',
        priority: 'MEDIUM',
      },
    ],
    scoreBreakdown: [
      { category: 'Market', current: 8.9, previous: 8.1, trend: 'up' },
      { category: 'Product', current: 8.6, previous: 8.2, trend: 'up' },
      { category: 'Execution', current: 7.8, previous: 7.4, trend: 'up' },
      { category: 'Financials', current: 7.1, previous: 6.8, trend: 'up' },
      { category: 'Risk', current: 6.9, previous: 7.2, trend: 'down' },
      { category: 'Team', current: 8.5, previous: 8.0, trend: 'up' },
    ],
  },
  {
    id: 'vitalink-v5',
    name: 'VITALINK',
    subtitle: 'BOARD REVIEW V5',
    industry: 'HealthTech',
    date: 'July 28, 2026',
    session: 'Board Session #05',
    score: 7.8,
    scoreStatus: 'MODERATE',
    verdictStatus: 'NEEDS WORK',
    verdictQuote: 'Product & MVP validation required before proceeding to commercialization.',
    tags: ['MVP', 'Product', 'Technical'],
    executiveSummary: 'The board evaluated VITALINK V5 focusing on product architecture and MVP readiness. Core technical workflows are sound.',
    verdictGrid: [
      { name: 'PRODUCT', status: 'Moderate', level: '🟡', color: '#f59e0b' },
      { name: 'MARKET', status: 'Strong', level: '🟢', color: '#22c55e' },
      { name: 'MONETIZATION', status: 'Needs Work', level: '🟡', color: '#f59e0b' },
      { name: 'EXECUTION', status: 'Moderate', level: '🟡', color: '#f59e0b' },
      { name: 'RISK', status: 'High', level: '🔴', color: '#f87171' },
    ],
    perspectives: [
      {
        role: 'CEO',
        title: 'Marcus Vance (CEO)',
        iconName: 'ceo',
        color: '#3b82f6',
        quote: '"MVP scope must stay tight for V5."',
        verdict: 'Positive',
        verdictIcon: '🟢',
        verdictColor: '#22c55e',
      },
      {
        role: 'INVESTOR',
        title: 'Priya Desai (Investor)',
        iconName: 'investor',
        color: '#d97706',
        quote: '"Focus on early customer retention metrics."',
        verdict: 'Concern',
        verdictIcon: '🟡',
        verdictColor: '#f59e0b',
      },
    ],
    debates: [
      {
        agentA: 'CEO',
        agentB: 'Investor',
        quoteA: '"We should launch MVP next month."',
        quoteB: '"Not before 5 pilot agreements are signed."',
        resolution: 'Secure 3 signed hospital pilot letters of intent prior to public launch.',
      },
    ],
    keyFindings: [
      { text: 'Core MVP feature set defined', isPositive: true },
      { text: 'Hospital pilot terms require refinement', isPositive: false },
    ],
    nextActions: [
      {
        id: 'act-v5-1',
        code: '01',
        title: 'Finalize MVP specs',
        desc: 'Lock feature freeze for V5 build',
        priority: 'HIGH',
      },
    ],
    scoreBreakdown: [
      { category: 'Market', current: 8.1, previous: 7.8, trend: 'up' },
      { category: 'Product', current: 8.2, previous: 7.8, trend: 'up' },
      { category: 'Execution', current: 7.4, previous: 7.0, trend: 'up' },
      { category: 'Financials', current: 6.8, previous: 6.5, trend: 'up' },
      { category: 'Risk', current: 7.2, previous: 7.5, trend: 'down' },
      { category: 'Team', current: 8.0, previous: 7.6, trend: 'up' },
    ],
  },
  {
    id: 'medora-v1',
    name: 'MEDORA',
    subtitle: 'INITIAL BOARD REVIEW',
    industry: 'BioTech',
    date: 'July 20, 2026',
    session: 'Board Session #01',
    score: 7.9,
    scoreStatus: 'STRONG',
    verdictStatus: 'APPROVED WITH CONDITIONS',
    verdictQuote: 'Promising diagnostic tech stack; regulatory clearance path must be mapped.',
    tags: ['BioTech', 'Regulatory', 'R&D'],
    executiveSummary: 'Medora presents an AI-driven blood diagnostic framework with strong initial laboratory trial scores.',
    verdictGrid: [
      { name: 'PRODUCT', status: 'Strong', level: '🟢', color: '#22c55e' },
      { name: 'MARKET', status: 'Strong', level: '🟢', color: '#22c55e' },
      { name: 'MONETIZATION', status: 'Moderate', level: '🟡', color: '#f59e0b' },
      { name: 'EXECUTION', status: 'Needs Work', level: '🟡', color: '#f59e0b' },
      { name: 'RISK', status: 'High', level: '🔴', color: '#f87171' },
    ],
    perspectives: [],
    debates: [],
    keyFindings: [
      { text: 'Proprietary AI diagnostic accuracy', isPositive: true },
      { text: 'FDA clinical trial timeline is 18 months', isPositive: false },
    ],
    nextActions: [
      {
        id: 'act-med-1',
        code: '01',
        title: 'Engage FDA consultant',
        desc: 'Map Class II medical device approval pathway',
        priority: 'HIGH',
      },
    ],
    scoreBreakdown: [
      { category: 'Market', current: 8.5, previous: 8.0, trend: 'up' },
      { category: 'Product', current: 8.4, previous: 8.0, trend: 'up' },
      { category: 'Execution', current: 7.2, previous: 7.0, trend: 'up' },
      { category: 'Financials', current: 7.0, previous: 6.8, trend: 'up' },
      { category: 'Risk', current: 7.5, previous: 7.8, trend: 'down' },
      { category: 'Team', current: 8.2, previous: 7.9, trend: 'up' },
    ],
  },
];

export default function ReportsView({
  onNavigate,
  userName = 'Moiz',
  history = [],
  onOpenStartup,
  onConveneBoard,
}) {
  const { t } = useContext(LanguageContext);
  // Navigation & Level State: null = Level 1 Landing, String ID = Level 2 Memo Detail
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Search & Filter state for Level 1
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Approved', 'Needs Work'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'score'

  // Interactive Action States for Level 2
  const [completedActions, setCompletedActions] = useState(new Set());
  const [addedToMissionActions, setAddedToMissionActions] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  // Interactive Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'Board Review Complete', desc: 'VITALINK V6 scored 8.4/10 with strong commercial traction.', time: '10m ago', type: 'info' },
    { id: 2, title: 'Risk Alert Flagged', desc: 'Grim Reaper flagged unit economics for B2C SaaS model.', time: '1h ago', type: 'risk' },
    { id: 3, title: 'Roster Active', desc: 'All 8 Executive Board AI Agents are operational.', time: '3h ago', type: 'info' },
  ]);

  // ── Build report list EXCLUSIVELY from real stored sessions ──────────────
  // Each report card is bound 1:1 to its sessionId. No defaults, no shared data.
  const allReports = (history || []).map((h) => {
    const sid = h.sessionId || h.id;
    const result = h.analysisResult || null;

    // ── Agent perspectives from real agentResults ─────────────────────────
    const AGENT_ICON_MAP = {
      ceo: 'ceo', cto: 'cto', investor: 'investor', marketing: 'marketing',
      customer: 'customer', risk: 'risk', 'risk advisor': 'risk',
      'grim reaper': 'reaper', reaper: 'reaper', chairman: 'chairman',
    };
    const AGENT_COLOR_MAP = {
      ceo: '#3b82f6', cto: '#0284c7', investor: '#d97706', marketing: '#7e22ce',
      customer: '#15803d', risk: '#c2410c', 'risk advisor': '#c2410c',
      'grim reaper': '#991b1b', reaper: '#991b1b', chairman: '#b45309',
    };
    const agentResults = result?.agentResults || [];
    const perspectives = agentResults.map((a) => {
      const key = (a.agentKey || a.key || a.agentName || '').toLowerCase();
      const score = typeof a.score === 'number' ? a.score : null;
      const isPositive = score !== null ? score >= 7.5 : true;
      return {
        role: (a.agentName || a.role || 'EXECUTIVE').toUpperCase(),
        title: a.agentName || a.name || 'Agent',
        iconName: AGENT_ICON_MAP[key] || 'ceo',
        color: AGENT_COLOR_MAP[key] || '#3b82f6',
        quote: a.verdict ? `"${a.verdict}"` : (a.analysis ? `"${String(a.analysis).slice(0, 120)}…"` : '"Analysis completed."'),
        verdict: isPositive ? 'Positive' : 'Concern',
        verdictIcon: isPositive ? '🟢' : '🟡',
        verdictColor: isPositive ? '#22c55e' : '#f59e0b',
      };
    });

    // ── Key findings from real strengths / concerns ───────────────────────
    const rawStrengths = result?.strengths || [];
    const rawWeaknesses = result?.weaknesses || result?.concerns || [];
    const keyFindings = [
      ...rawStrengths.slice(0, 3).map((s) => ({ text: s, isPositive: true })),
      ...rawWeaknesses.slice(0, 3).map((w) => ({ text: w, isPositive: false })),
    ];

    // ── Action items from real recommendations ────────────────────────────
    const rawActions = result?.actionItems || result?.recommendations || [];
    const nextActions = rawActions.map((act, i) => ({
      id: `act-${sid}-${i}`,
      code: String(i + 1).padStart(2, '0'),
      title: typeof act === 'string' ? act : act?.title || 'Review this item',
      desc: typeof act === 'object' && act?.description ? act.description : 'Action item identified by the board.',
      priority: i === 0 ? 'HIGH' : 'MEDIUM',
    }));

    // ── Score breakdown from per-agent scores (real data only) ────────────
    const scoreBreakdown = agentResults
      .filter((a) => typeof a.score === 'number')
      .map((a) => ({
        category: a.agentName || a.name || 'Agent',
        current: a.score,
        previous: null,
        trend: 'neutral',
      }));

    // ── Tags derived from real session data ───────────────────────────────
    const industry = h.ideaData?.industry || null;
    const verdict = h.verdict || result?.verdict || null;
    const tags = [
      industry,
      verdict,
      h.sharkTankMode ? 'Shark Tank Mode' : null,
    ].filter(Boolean);
    if (tags.length === 0) tags.push('Board Review');

    // ── Verdict grid from real scores (or omit if no data) ───────────────
    const verdictGrid = [
      'VISION', 'FEASIBILITY', 'VIABILITY', 'GTM', 'RISK'
    ].map((dim) => {
      const match = agentResults.find((a) =>
        (a.agentName || a.name || '').toUpperCase().includes(dim) ||
        (a.agentKey || '').toUpperCase().includes(dim)
      );
      const s = match?.score;
      if (s === undefined || s === null) {
        return { name: dim, status: '—', level: '⬜', color: '#4b5563' };
      }
      return {
        name: dim,
        status: s >= 8.0 ? 'Strong' : s >= 6.5 ? 'Moderate' : 'Needs Work',
        level: s >= 8.0 ? '🟢' : s >= 6.5 ? '🟡' : '🔴',
        color: s >= 8.0 ? '#22c55e' : s >= 6.5 ? '#f59e0b' : '#f87171',
      };
    });

    // ── Score: strictly from stored value, never invented ─────────────────
    const overallScore = (typeof h.overallScore === 'number') ? h.overallScore : null;
    const scoreStatus = overallScore === null ? 'UNKNOWN' : overallScore >= 8.0 ? 'STRONG' : 'MODERATE';

    return {
      id: sid,
      sessionId: sid,
      name: (h.ideaData?.name || 'Unnamed Startup').toUpperCase(),
      subtitle: `BOARD REVIEW V${h.versionNumber || 1}`,
      industry: industry || 'Technology',
      date: h.createdAt
        ? new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Date unavailable',
      session: `Board Session #${h.versionNumber || 1}`,
      score: overallScore,
      scoreStatus,
      verdictStatus: verdict || 'PENDING',
      verdictQuote: result?.chairmanVerdict || result?.executiveSummary || null,
      tags,
      executiveSummary: result?.executiveSummary || result?.chairmanVerdict || null,
      verdictGrid,
      perspectives,
      debates: result?.debates || result?.contradictions || [],
      keyFindings,
      nextActions,
      scoreBreakdown,
      rawSession: h,
    };
  });

  // Sort newest first (by sessionStartedAt or createdAt)
  allReports.sort((a, b) => {
    const ta = a.rawSession?.sessionStartedAt || new Date(a.rawSession?.createdAt || 0).getTime();
    const tb = b.rawSession?.sessionStartedAt || new Date(b.rawSession?.createdAt || 0).getTime();
    return tb - ta;
  });

  // Filter Level 1 list
  const filteredReports = allReports.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.subtitle.toLowerCase().includes(q) ||
      r.industry.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Approved' && r.verdictStatus.includes('APPROVED')) ||
      (statusFilter === 'Needs Work' && r.verdictStatus.includes('NEEDS WORK'));

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    return 0; // default newest
  });

  const selectedReport = selectedReportId
    ? allReports.find((r) => r.id === selectedReportId) || null
    : null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleActionComplete = (actionId) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) next.delete(actionId);
      else next.add(actionId);
      return next;
    });
  };

  const handleAddToMission = (action) => {
    setAddedToMissionActions((prev) => new Set(prev).add(action.id));
    showToast(`Added "${action.title}" to Mission & Evolution tracker!`);
  };

  return (
    <div className="v2-dashboard-page">
      {/* Background Grid & Glow */}
      <div className="v2-bg-grid" />
      <div className="v2-bg-ambient-glow" />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(34, 197, 94, 0.95)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          fontWeight: 800,
          fontSize: '0.88rem',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Navigation Header */}
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
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
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
            }} onClick={(e) => e.stopPropagation()}>
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

      {/* Main Body */}
      <div className="v2-body">
        {/* Left Sidebar */}
        <aside className="v2-sidebar">
          <nav className="v2-sidebar-nav">
            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('dashboard')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>{t('navigation.dashboard')}</span>
            </button>

            <button className="v2-nav-item" onClick={() => onConveneBoard && onConveneBoard()}>
              <span className="nav-item-icon"><AppIcon name="build" size={18} /></span>
              <span>{t('navigation.newStartup')}</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('boardroom')}>
              <span className="nav-item-icon"><AppIcon name="ceo" size={18} /></span>
              <span>{t('navigation.boardroom')}</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('timeline')}>
              <span className="nav-item-icon"><AppIcon name="activity" size={18} /></span>
              <span>{t('navigation.timeline')}</span>
            </button>

            <button className="v2-nav-item active" onClick={() => setSelectedReportId(null)}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} color="#f59e0b" /></span>
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>{t('navigation.reports')}</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('settings')}>
              <span className="nav-item-icon"><AppIcon name="cto" size={18} /></span>
              <span>{t('navigation.settings')}</span>
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

        {/* Main Content Area */}
        <main className="v2-main-content" style={{ maxWidth: '1440px' }}>
          
          {/* LEVEL 1: REPORTS LANDING PAGE */}
          {selectedReportId === null && (
            <div>
              {/* Header Title Row */}
              <div style={{ marginBottom: '24px' }}>
                <h1 className="settings-main-heading">{t('reports.title')}</h1>
                <p className="settings-subtext">Your board's analysis, decisions, and recommendations</p>
              </div>

              {/* Search & Filter Bar */}
              <div className="glass-panel" style={{
                padding: '14px 20px',
                borderRadius: '16px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(13, 21, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <AppIcon name="history" size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 40px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <select
                  className="settings-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="All">Filter: All</option>
                  <option value="Approved">Filter: Approved</option>
                  <option value="Needs Work">Filter: Needs Work</option>
                </select>

                <select
                  className="settings-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: '160px' }}
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="score">Sort: Highest Score</option>
                </select>
              </div>

              {/* Section Subheading */}
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '16px', tracking: '0.5px' }}>
                RECENT REPORTS
              </h2>

              {/* Report List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allReports.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📋</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>No Board Reports Yet</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      Run your first War Room session to generate a board report.
                    </div>
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No reports match your search query.
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="glass-panel"
                      style={{
                        padding: '20px 24px',
                        borderRadius: '18px',
                        background: 'rgba(13, 21, 41, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Left Information */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                            {report.name}
                          </h3>
                          <span style={{
                            padding: '3px 10px',
                            background: 'rgba(56, 189, 248, 0.12)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '8px',
                            color: '#38bdf8',
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}>
                            {report.industry}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
                            {report.subtitle}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '12px' }}>
                          {report.date} • {report.session}
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {report.tags.map((tag, i) => (
                            <span key={i} style={{
                              fontSize: '0.76rem',
                              color: '#cbd5e1',
                              background: 'rgba(255, 255, 255, 0.04)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255, 255, 255, 0.06)'
                            }}>
                              • {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Score & View Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        <div style={{ textAlign: 'right', minWidth: '130px' }}>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, marginBottom: '2px' }}>
                            Board Score
                          </div>
                          {report.score !== null && report.score !== undefined ? (
                            <>
                              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: report.score >= 8.0 ? '#4ade80' : '#fbbf24' }}>
                                {report.score} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 10</span>
                              </div>
                              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', marginTop: '6px', overflow: 'hidden' }}>
                                <div style={{
                                  width: `${(report.score / 10) * 100}%`,
                                  height: '100%',
                                  background: report.score >= 8.0 ? 'linear-gradient(90deg, #4ade80, #38bdf8)' : 'linear-gradient(90deg, #fbbf24, #f87171)',
                                  borderRadius: '10px'
                                }} />
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize: '0.88rem', color: '#64748b', fontStyle: 'italic' }}>
                              Score unavailable
                            </div>
                          )}
                        </div>

                        <button
                          className="btn-view-evolution"
                          onClick={() => setSelectedReportId(report.id)}
                          style={{ padding: '10px 20px', fontSize: '0.88rem', fontWeight: 800 }}
                        >
                          View Report →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* LEVEL 2: DETAILED STARTUP BOARD MEMO VIEW */}
          {selectedReportId !== null && selectedReport && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Back Header & Title Banner */}
              <div className="glass-panel" style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'rgba(13, 21, 41, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '12px',
                      padding: 0
                    }}
                    onClick={() => setSelectedReportId(null)}
                  >
                    ← Back to Reports
                  </button>

                  <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>
                    {selectedReport.name}
                  </h1>
                  <h3 style={{ margin: '4px 0 6px 0', fontSize: '1.1rem', color: '#c084fc', fontWeight: 800 }}>
                    {selectedReport.subtitle}
                  </h3>
                  <div style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 500 }}>
                    {selectedReport.date} • {selectedReport.session}
                  </div>
                </div>

                {/* Score Big Badge */}
                <div style={{
                  padding: '16px 28px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'center'
                }}>
                  {selectedReport.score !== null && selectedReport.score !== undefined ? (
                    <>
                      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: selectedReport.score >= 8.0 ? '#4ade80' : '#fbbf24', lineHeight: 1 }}>
                        {selectedReport.score} <span style={{ fontSize: '1.1rem', color: '#64748b' }}>/ 10</span>
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 900,
                        color: selectedReport.score >= 8.0 ? '#4ade80' : '#fbbf24',
                        letterSpacing: '1px',
                        marginTop: '4px'
                      }}>
                        {selectedReport.scoreStatus}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>
                      Score unavailable
                    </div>
                  )}
                </div>
              </div>

              {/* 1. EXECUTIVE SUMMARY & BOARD VERDICT GRID */}
              <div className="glass-panel" style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'rgba(13, 21, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                  Executive Summary
                </h3>
                <p style={{ margin: '0 0 24px 0', fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {selectedReport.executiveSummary || <span style={{ color: '#4b5563', fontStyle: 'italic' }}>Analysis summary not available — the board session may still be in progress.</span>}
                </p>

                <h4 style={{ margin: '0 0 14px 0', fontSize: '0.85rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>
                  BOARD VERDICT
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {selectedReport.verdictGrid.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0' }}>
                        {item.level} {item.name}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: item.color }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. BOARD PERSPECTIVES (THE 8 AGENTS) */}
              <div className="glass-panel" style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'rgba(13, 21, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                  BOARD PERSPECTIVES
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {selectedReport.perspectives.map((agent, i) => (
                    <div key={i} style={{
                      padding: '16px 18px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <AppIcon name={agent.iconName} size={18} color={agent.color} />
                          <span style={{ fontWeight: 900, fontSize: '0.88rem', color: '#ffffff' }}>
                            {agent.title}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.5' }}>
                          {agent.quote}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                      }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Verdict:</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 900, color: agent.verdictColor }}>
                          {agent.verdictIcon} {agent.verdict}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. BOARD DEBATE / DISAGREEMENTS */}
              {selectedReport.debates && selectedReport.debates.length > 0 && (
                <div className="glass-panel" style={{
                  padding: '24px 28px',
                  borderRadius: '20px',
                  background: 'rgba(13, 21, 41, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                    BOARD DEBATE & DISAGREEMENTS
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedReport.debates.map((d, idx) => (
                      <div key={idx} style={{
                        padding: '18px 20px',
                        borderRadius: '14px',
                        background: 'rgba(244, 63, 94, 0.03)',
                        border: '1px solid rgba(244, 63, 94, 0.15)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '1.1rem' }}>⚡</span>
                          <span style={{ fontWeight: 900, fontSize: '0.92rem', color: '#f43f5e' }}>
                            {d.agentA} vs {d.agentB}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                          <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>{d.agentA}:</div>
                            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic' }}>{d.quoteA}</div>
                          </div>
                          <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>{d.agentB}:</div>
                            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic' }}>{d.quoteB}</div>
                          </div>
                        </div>

                        <div style={{
                          padding: '10px 14px',
                          background: 'rgba(56, 189, 248, 0.08)',
                          borderRadius: '10px',
                          borderLeft: '3px solid #38bdf8'
                        }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.5px' }}>
                            CHAIRMAN'S RESOLUTION:
                          </span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#ffffff', fontWeight: 700 }}>
                            {d.resolution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. KEY FINDINGS */}
              <div className="glass-panel" style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'rgba(13, 21, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                  KEY FINDINGS
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {selectedReport.keyFindings.map((item, i) => (
                    <div key={i} style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: item.isPositive ? 'rgba(34, 197, 94, 0.04)' : 'rgba(251, 146, 60, 0.04)',
                      border: item.isPositive ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid rgba(251, 146, 60, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ color: item.isPositive ? '#4ade80' : '#fb923c', fontWeight: 900, fontSize: '1.1rem' }}>
                        {item.isPositive ? '✓' : '⚠'}
                      </span>
                      <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. RECOMMENDED ACTIONS (NEXT ACTIONS) */}
              <div className="glass-panel" style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'rgba(13, 21, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                  NEXT ACTIONS
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedReport.nextActions.map((action) => {
                    const isDone = completedActions.has(action.id);
                    const isAdded = addedToMissionActions.has(action.id);

                    return (
                      <div key={action.id} style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        opacity: isDone ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#c084fc', width: '28px' }}>
                            {action.code}
                          </span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', textDecoration: isDone ? 'line-through' : 'none' }}>
                                {action.title}
                              </h4>
                              <span style={{
                                padding: '1px 7px',
                                background: action.priority === 'HIGH' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                border: action.priority === 'HIGH' ? '1px solid #f87171' : '1px solid #fbbf24',
                                borderRadius: '6px',
                                color: action.priority === 'HIGH' ? '#f87171' : '#fbbf24',
                                fontSize: '0.72rem',
                                fontWeight: 800
                              }}>
                                {action.priority}
                              </span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
                              {action.desc}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => toggleActionComplete(action.id)}
                            style={{
                              padding: '6px 14px',
                              background: isDone ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: isDone ? '1px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: isDone ? '#4ade80' : '#cbd5e1',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            {isDone ? '✓ Completed' : 'Mark Complete'}
                          </button>

                          <button
                            onClick={() => handleAddToMission(action)}
                            disabled={isAdded}
                            style={{
                              padding: '6px 14px',
                              background: isAdded ? 'rgba(192, 132, 252, 0.2)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
                              border: isAdded ? '1px solid #c084fc' : 'none',
                              borderRadius: '8px',
                              color: '#ffffff',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: isAdded ? 'default' : 'pointer'
                            }}
                          >
                            {isAdded ? '✓ Added to Mission' : 'Add to Mission'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. BOARD SCORE BREAKDOWN */}
              <div className="glass-panel" style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'rgba(13, 21, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                  BOARD SCORE BREAKDOWN
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {selectedReport.scoreBreakdown.map((s, idx) => (
                    <div key={idx} style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#94a3b8' }}>
                          {s.category}
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                          {s.current} <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>prev {s.previous !== null && s.previous !== undefined ? s.previous : '—'}</span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: s.trend === 'up' ? '#4ade80' : '#f87171'
                      }}>
                        {s.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. BOARD DECISION CALLOUT */}
              <div className="glass-panel" style={{
                padding: '28px 32px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(13, 21, 41, 0.95) 100%)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                textAlign: 'center',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
              }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 900, color: '#60a5fa', letterSpacing: '0.5px' }}>
                  {selectedReport.verdictStatus}
                </h2>
                <p style={{ margin: '0 auto 24px auto', maxWidth: '640px', fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  "{selectedReport.verdictQuote}"
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button
                    className="btn-view-evolution"
                    onClick={() => {
                      if (onConveneBoard) onConveneBoard();
                      else if (onNavigate) onNavigate('form');
                    }}
                    style={{ padding: '12px 28px', fontSize: '0.92rem', fontWeight: 900 }}
                  >
                    Start Next Mission
                  </button>

                  <button
                    onClick={() => showToast('Report exported as Executive Board Memo (PDF)!')}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Export Report
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
