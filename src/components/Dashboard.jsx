import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

const RECENT_STARTUPS_DATA = [
  { id: 'vitalink', name: 'VITALINK', industry: 'HealthTech', iconName: 'heart', iconColor: '#38bdf8', score: 8.4, status: 'Approved', statusColor: '#22c55e', lastMeeting: '2 hours ago' },
  { id: 'medora', name: 'MEDORA', industry: 'HealthTech', iconName: 'cto', iconColor: '#c084fc', score: 7.9, status: 'Approved', statusColor: '#22c55e', lastMeeting: '3 days ago' },
];

const BOARD_MEMBERS_ASSEMBLED = [
  { role: 'CEO', iconName: 'ceo', color: '#3b82f6', borderColor: '#60a5fa' },
  { role: 'CTO', iconName: 'cto', color: '#0284c7', borderColor: '#38bdf8' },
  { role: 'Investor', iconName: 'investor', color: '#d97706', borderColor: '#fbbf24' },
  { role: 'Marketing', iconName: 'marketing', color: '#7e22ce', borderColor: '#c084fc' },
  { role: 'Customer', iconName: 'customer', color: '#15803d', borderColor: '#4ade80' },
  { role: 'Risk Advisor', iconName: 'risk', color: '#c2410c', borderColor: '#fb923c' },
  { role: 'Grim Reaper', iconName: 'reaper', color: '#991b1b', borderColor: '#f87171' },
  { role: 'Chairman', iconName: 'chairman', color: '#b45309', borderColor: '#fde047' },
];

const BOARD_STATUS_LIST = [
  { role: 'CEO', status: 'Ready' },
  { role: 'CTO', status: 'Ready' },
  { role: 'Investor', status: 'Ready' },
  { role: 'Marketing', status: 'Ready' },
  { role: 'Customer', status: 'Ready' },
  { role: 'Risk Advisor', status: 'Ready' },
  { role: 'Grim Reaper', status: 'Ready' },
  { role: 'Chairman', status: 'Ready' },
];

const LIVE_ACTIVITY_FEED = [
  { text: 'Investor finished market analysis', time: '1m ago', iconName: 'investor', color: '#d97706' },
  { text: 'Marketing submitted growth plan', time: '3m ago', iconName: 'marketing', color: '#7e22ce' },
  { text: 'CTO uploaded technical review', time: '5m ago', iconName: 'cto', color: '#0284c7' },
  { text: 'Risk Advisor flagged 2 risks', time: '6m ago', iconName: 'risk', color: '#c2410c' },
  { text: 'Chairman awaiting quorum', time: '7m ago', iconName: 'chairman', color: '#b45309' },
];

export default function Dashboard({
  onConveneBoard,
  onOpenStartup,
  onCreateNewVersion,
  onNavigate,
  history = [],
  userName = 'Founder',
  user = null,
  onSignOut,
}) {
  const activeStartup = history[0]
    ? {
      id: history[0].id,
      name: history[0].ideaData?.name || 'Unnamed Startup',
      industry: history[0].ideaData?.industry || null,
      description: history[0].ideaData?.description || '',
      score: typeof history[0].overallScore === 'number' ? history[0].overallScore : null,
      status: 'Ready for Board Review',
      updatedAt: history[0].createdAt ? new Date(history[0].createdAt).toLocaleDateString() : '—',
      raw: history[0],
    }
    : {
      id: 'vitalink-v6',
      name: 'VITALINK',
      industry: 'HealthTech',
      description: 'QR-code based emergency medical history & allergy access for surgery & emergency care.',
      score: 8.4,
      status: 'Ready for Board Review',
      updatedAt: 'Jul 31, 2026',
      raw: null,
    };

  const recentList = history.length > 0
    ? history.slice(0, 3).map((h, i) => ({
      id: h.sessionId || h.id,
      sessionId: h.sessionId || h.id,
      name: h.ideaData?.name || 'Unnamed',
      industry: h.ideaData?.industry || null,
      iconName: RECENT_STARTUPS_DATA[i % RECENT_STARTUPS_DATA.length].iconName,
      iconColor: RECENT_STARTUPS_DATA[i % RECENT_STARTUPS_DATA.length].iconColor,
      score: typeof h.overallScore === 'number' ? h.overallScore : null,
      verdict: h.verdict || null,
      statusColor: h.overallScore >= 8 ? '#22c55e' : '#f59e0b',
      lastMeeting: h.createdAt ? new Date(h.createdAt).toLocaleDateString() : '—',
      raw: h,
    }))
    : RECENT_STARTUPS_DATA.map((s) => ({
      id: s.id,
      sessionId: s.id,
      name: s.name,
      industry: s.industry,
      iconName: s.iconName,
      iconColor: s.iconColor,
      score: s.score,
      verdict: s.status,
      statusColor: s.statusColor,
      lastMeeting: s.lastMeeting,
      raw: {
        id: s.id,
        ideaData: { name: s.name, industry: s.industry, description: `${s.name} startup idea analysis.` },
        overallScore: s.score,
        verdict: s.status,
      },
    }));

  // Interactive Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'Board Review Complete', desc: 'VITALINK V6 scored 8.4/10 with strong commercial traction.', time: '10m ago', type: 'info' },
    { id: 2, title: 'Risk Alert Flagged', desc: 'Grim Reaper flagged unit economics for B2C SaaS model.', time: '1h ago', type: 'risk' },
    { id: 3, title: 'Roster Active', desc: 'All 8 Executive Board AI Agents are operational.', time: '3h ago', type: 'info' },
  ]);

  return (
    <div className="v2-dashboard-page">
      {/* Background Grid & Ambient Glow */}
      <div className="v2-bg-grid" />
      <div className="v2-bg-ambient-glow" />

      {/* Navigation Header */}
      <header className="v2-header">
        <div className="v2-header-brand" onClick={() => onNavigate('landing')}>
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

          <div className="v2-user-dropdown-pill" style={{ position: 'relative' }}>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => setShowUserMenu(m => !m)}
            >
              <div className="v2-user-avatar" style={{
                background: user ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : undefined,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '12px', color: '#fff',
              }}>
                {user?.displayName ? user.displayName[0].toUpperCase() : <AppIcon name="user" size={14} color="#fff" />}
              </div>
              <span className="v2-user-name">{userName}</span>
              <AppIcon name="chevron" size={14} className="v2-dropdown-arrow" />
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute', top: '40px', right: 0, zIndex: 1000,
                background: 'rgba(13,21,41,0.98)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '8px', minWidth: '180px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
              }}>
                {user?.email && (
                  <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '2px', letterSpacing: '0.05em' }}>SIGNED IN AS</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>
                )}
                <button
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#9ca3af', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                >
                  <AppIcon name="cto" size={14} /> Settings
                </button>
                {onSignOut && (
                  <button
                    id="btn-sign-out"
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#f87171', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => { setShowUserMenu(false); onSignOut(); }}
                  >
                    <AppIcon name="risk" size={14} color="#f87171" /> Sign Out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <div className="v2-body">
        {/* Left Sidebar */}
        <aside className="v2-sidebar">
          <nav className="v2-sidebar-nav">
            <button className="v2-nav-item active" onClick={() => onNavigate('dashboard')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Dashboard</span>
            </button>

            <button className="v2-nav-item" onClick={onConveneBoard}>
              <span className="nav-item-icon"><AppIcon name="build" size={18} /></span>
              <span>New Startup</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate('boardroom')}>
              <span className="nav-item-icon"><AppIcon name="ceo" size={18} /></span>
              <span>War Room</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate('timeline')}>
              <span className="nav-item-icon"><AppIcon name="activity" size={18} /></span>
              <span>Evolution</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate('reports')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Reports</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate('settings')}>
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
                {(parseInt(localStorage.getItem('fwr_ai_credits_used') || '0', 10)).toLocaleString()} / 10,000
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, ((parseInt(localStorage.getItem('fwr_ai_credits_used') || '0', 10)) / 10000) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #c084fc, #38bdf8)', borderRadius: '10px' }} />
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>10,000 Monthly Limit</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="v2-main-content">
          <div className="v2-main-grid">

            {/* Left/Center Column */}
            <div className="v2-center-col">

              {/* Cinematic Boardroom Hero Card */}
              <div className="v2-hero-card">
                <div className="v2-hero-layout">

                  {/* Hero Left Side: Mission Info */}
                  <div className="v2-hero-info">
                    <span className="v2-welcome-eyebrow">WELCOME BACK, {userName.toUpperCase()}</span>

                    <div className="v2-mission-title-group">
                      <span className="v2-mission-sub">Today's Mission</span>
                      {activeStartup ? (
                        <>
                          <h1 className="v2-mission-heading">{activeStartup.name}</h1>
                          {activeStartup.industry && <span className="v2-industry-pill">{activeStartup.industry}</span>}
                        </>
                      ) : (
                        <h1 className="v2-mission-heading" style={{ color: '#64748b' }}>No sessions yet</h1>
                      )}
                    </div>

                    <p className="v2-mission-description">
                      {activeStartup?.description || 'Convene the board to evaluate your first startup idea.'}
                    </p>

                    {/* Stats Boxes */}
                    <div className="v2-hero-stats-row">
                      <div className="v2-stat-card">
                        <AppIcon name="target" size={18} color="#fbbf24" />
                        <div className="stat-text-stack">
                          <span className="stat-label-muted">STATUS</span>
                          <span className="stat-value-gold">{activeStartup ? 'Ready for Board Review' : 'Awaiting First Session'}</span>
                        </div>
                      </div>

                      <div className="v2-stat-card">
                        <AppIcon name="clock" size={18} color="#38bdf8" />
                        <div className="stat-text-stack">
                          <span className="stat-label-muted">LAST ANALYSIS</span>
                          <span className="stat-value-white">{activeStartup?.updatedAt || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Center Portal Visual */}
                  <div className="v2-portal-visual">
                    <div className="portal-door-glow">
                      <img src="/war_room_logo.png" alt="W Shield" className="portal-shield-icon" />
                    </div>
                  </div>

                  {/* Hero Right Side: Board Assembled Grid */}
                  <div className="v2-board-assembled-panel">
                    <div className="assembled-header">
                      <span className="assembled-tag">BOARD ASSEMBLED</span>
                      <span className="assembled-count">8/8 Members Online</span>
                    </div>

                    <div className="assembled-avatars-grid">
                      {BOARD_MEMBERS_ASSEMBLED.map((m, i) => (
                        <div key={i} className="assembled-avatar-node">
                          <div
                            className="avatar-glow-ring"
                            style={{
                              borderColor: m.borderColor,
                              boxShadow: `0 0 12px ${m.borderColor}66`,
                            }}
                          >
                            <AppIcon name={m.iconName} size={18} color={m.borderColor} />
                          </div>
                          <span className="avatar-role-label">{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Golden Action Button */}
                <div className="v2-hero-action-footer" style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="v2-btn-enter-warroom-glowing"
                    onClick={() => activeStartup ? onOpenStartup(activeStartup.raw || activeStartup) : onConveneBoard()}
                  >
                    <AppIcon name="ceo" size={18} color="#fbbf24" />
                    <span>{activeStartup ? 'Enter War Room' : 'Convene the Board'}</span>
                    <span className="btn-arrow-right">&gt;</span>
                  </button>
                  {activeStartup && onCreateNewVersion && (
                    <button
                      className="v2-btn-enter-warroom-glowing"
                      style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        boxShadow: 'none',
                        color: '#38bdf8'
                      }}
                      onClick={() => onCreateNewVersion(activeStartup.raw || activeStartup)}
                    >
                      <AppIcon name="plus" size={18} color="#38bdf8" />
                      <span>+ Create V{(activeStartup.raw?.versionNumber || 1) + 1}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Recent Startups Section */}
              <div className="v2-recent-section">
                <div className="v2-recent-header">
                  <h3 className="v2-section-title">Recent Startups</h3>
                  <button className="v2-view-all-link" onClick={() => onNavigate('startups')}>
                    &rarr; View All
                  </button>
                </div>

                <div className="v2-recent-cards-grid">
                  {recentList.map((item, idx) => (
                    <div
                      key={idx}
                      className="v2-recent-card"
                      onClick={() => onOpenStartup(item.raw || item)}
                    >
                      <div className="recent-card-top">
                        <div className="recent-app-icon-badge">
                          <AppIcon name={item.iconName} size={18} color={item.iconColor} />
                        </div>
                        <div>
                          <h4 className="recent-app-title">{item.name}</h4>
                          {item.industry && <span className="recent-app-ind">{item.industry}</span>}
                        </div>
                      </div>

                      <div className="recent-card-mid">
                        <span className="recent-score-val">
                          {item.score !== null && item.score !== undefined ? item.score : '—'}
                        </span>
                        {item.verdict && (
                          <span className="recent-status-pill" style={{ color: '#f59e0b' }}>
                            ● {item.verdict}
                          </span>
                        )}
                      </div>

                      <div className="recent-card-bottom">
                        <span className="recent-time-lbl">Last meeting: {item.lastMeeting}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {/* Legacy session badge */}
                          {item.raw?.isLegacy && (
                            <span style={{
                              fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                              color: '#b45309', background: 'rgba(180,83,9,0.1)',
                              border: '1px solid rgba(180,83,9,0.2)',
                              borderRadius: '4px', padding: '2px 5px',
                            }}>LOCAL</span>
                          )}
                          {item.raw && !item.raw.isLegacy && item.raw.userId && (
                            <span style={{
                              fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                              color: '#0d9488', background: 'rgba(13,148,136,0.1)',
                              border: '1px solid rgba(13,148,136,0.2)',
                              borderRadius: '4px', padding: '2px 5px',
                            }}>SYNCED</span>
                          )}
                          {onCreateNewVersion && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCreateNewVersion(item.raw || item);
                              }}
                              style={{
                                fontSize: '9px',
                                fontWeight: 800,
                                color: '#38bdf8',
                                background: 'rgba(56,189,248,0.1)',
                                border: '1px solid rgba(56,189,248,0.2)',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                cursor: 'pointer',
                              }}
                            >
                              + V{(item.raw?.versionNumber || 1) + 1}
                            </button>
                          )}
                          <span className="recent-continue-txt">Continue &rarr;</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* New Startup Dashed Card */}
                  <div className="v2-new-startup-card" onClick={onConveneBoard}>
                    <div className="new-startup-plus-circle">
                      <AppIcon name="plus" size={18} color="#60a5fa" />
                    </div>
                    <h4 className="new-startup-title">New Startup</h4>
                    <span className="new-startup-sub">Start a new mission</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side Column */}
            <div className="v2-right-col">

              {/* Board Status Panel */}
              <div className="v2-side-panel">
                <div className="side-panel-header">
                  <h3 className="side-panel-title">BOARD STATUS</h3>
                  <span className="all-ready-pill">All Ready</span>
                </div>

                <div className="side-panel-list">
                  {BOARD_STATUS_LIST.map((m, i) => (
                    <div key={i} className="side-member-item">
                      <div className="side-member-left">
                        <span className="v2-green-dot" />
                        <span className="side-member-role">{m.role}</span>
                      </div>
                      <span className="side-member-status">Ready</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Activity Feed Panel */}
              <div className="v2-side-panel">
                <div className="side-panel-header">
                  <h3 className="side-panel-title">LIVE ACTIVITY</h3>
                  <AppIcon name="activity" size={18} color="#60a5fa" />
                </div>

                <div className="live-activity-list">
                  {LIVE_ACTIVITY_FEED.map((act, i) => (
                    <div key={i} className="activity-feed-item">
                      <div className="activity-icon-badge" style={{ backgroundColor: `${act.color}22` }}>
                        <AppIcon name={act.iconName} size={14} color={act.color} />
                      </div>
                      <div className="activity-text-stack">
                        <span className="activity-msg">{act.text}</span>
                        <span className="activity-time">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
