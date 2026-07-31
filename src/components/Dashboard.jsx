import React from 'react';
import AppIcon from './AppIcon.jsx';

const RECENT_STARTUPS_DATA = [
  { id: 'vitalink', name: 'VITALINK', industry: 'HealthTech', iconName: 'heart', iconColor: '#38bdf8', score: 8.4, status: 'Approved', statusColor: '#22c55e', lastMeeting: '2 hours ago' },
  { id: 'foodai', name: 'FoodAI', industry: 'FoodTech', iconName: 'food', iconColor: '#c084fc', score: 7.1, status: 'In Review', statusColor: '#f59e0b', lastMeeting: '1 day ago' },
  { id: 'edubot', name: 'EduBot', industry: 'EdTech', iconName: 'edu', iconColor: '#4ade80', score: 9.2, status: 'Approved', statusColor: '#22c55e', lastMeeting: '3 days ago' },
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
  onNavigate,
  history = [],
  userName = 'Moiz',
}) {
  const activeStartup = history[0]
    ? {
        id: history[0].id,
        name: history[0].ideaData?.name || 'VITALINK',
        industry: history[0].ideaData?.industry || 'HealthTech',
        description: history[0].ideaData?.description || 'An app that tells users medical history, allergies, diagnosis, etc. by scanning the QR code.',
        score: history[0].overallScore || 8.4,
        status: 'Ready for Board Review',
        updatedAt: '2 Hours Ago',
        raw: history[0],
      }
    : {
        name: 'VITALINK',
        industry: 'HealthTech',
        description: 'An app that tells users medical history, allergies, diagnosis, etc. by scanning the QR code.',
        score: 8.4,
        status: 'Ready for Board Review',
        updatedAt: '2 Hours Ago',
      };

  const recentList = history.length > 0
    ? history.slice(0, 3).map((h, i) => ({
        id: h.id,
        name: h.ideaData?.name || 'Unnamed',
        industry: h.ideaData?.industry || 'General',
        iconName: RECENT_STARTUPS_DATA[i % 3].iconName,
        iconColor: RECENT_STARTUPS_DATA[i % 3].iconColor,
        score: h.overallScore || 8.4,
        status: h.verdict || 'Approved',
        statusColor: h.verdict === 'Approved' ? '#22c55e' : '#f59e0b',
        lastMeeting: new Date(h.createdAt).toLocaleDateString(),
        raw: h,
      }))
    : RECENT_STARTUPS_DATA;

  return (
    <div className="v2-dashboard-page">
      {/* Background Grid & Glow */}
      <div className="v2-bg-grid" />
      <div className="v2-bg-ambient-glow" />

      {/* Header */}
      <header className="v2-header">
        <div className="v2-header-brand" onClick={() => onNavigate('landing')}>
          <img src="/war_room_logo.png" alt="War Room Crest" className="v2-header-logo-img" />
          <div className="v2-header-brand-titles">
            <span className="v2-brand-title">FOUNDER'S WAR ROOM</span>
            <span className="v2-brand-subtitle">AI BOARD OF DIRECTORS</span>
          </div>
        </div>

        <div className="v2-header-actions">
          <button className="v2-icon-btn" title="Power Status" onClick={() => alert('All 8 Executive Board Agents are active.')}>
            <AppIcon name="zap" size={16} />
          </button>

          <button className="v2-icon-btn" title="Notifications">
            <AppIcon name="bell" size={16} />
            <span className="v2-notification-dot" />
          </button>

          <button className="v2-icon-btn" title="Settings" onClick={() => onNavigate('settings')}>
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

          {/* Bottom Upgrade Box */}
          <div className="v2-upgrade-box">
            <div className="upgrade-title-row">
              <AppIcon name="crown" size={16} color="#fbbf24" />
              <span className="upgrade-title">Upgrade Plan</span>
            </div>
            <span className="upgrade-subtext">Unlock advanced features &gt;</span>
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
                      <h1 className="v2-mission-heading">{activeStartup.name}</h1>
                      <span className="v2-industry-pill">{activeStartup.industry}</span>
                    </div>

                    <p className="v2-mission-description">
                      {activeStartup.description}
                    </p>

                    {/* Stats Boxes */}
                    <div className="v2-hero-stats-row">
                      <div className="v2-stat-card">
                        <AppIcon name="target" size={18} color="#fbbf24" />
                        <div className="stat-text-stack">
                          <span className="stat-label-muted">STATUS</span>
                          <span className="stat-value-gold">Ready for Board Review</span>
                        </div>
                      </div>

                      <div className="v2-stat-card">
                        <AppIcon name="clock" size={18} color="#38bdf8" />
                        <div className="stat-text-stack">
                          <span className="stat-label-muted">LAST ANALYSIS</span>
                          <span className="stat-value-white">2 Hours Ago</span>
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
                <div className="v2-hero-action-footer">
                  <button
                    className="v2-btn-enter-warroom-glowing"
                    onClick={() => onOpenStartup(activeStartup.raw || activeStartup)}
                  >
                    <AppIcon name="ceo" size={18} color="#fbbf24" />
                    <span>Enter War Room</span>
                    <span className="btn-arrow-right">&gt;</span>
                  </button>
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
                          <span className="recent-app-ind">{item.industry}</span>
                        </div>
                      </div>

                      <div className="recent-card-mid">
                        <span className="recent-score-val">{item.score}</span>
                        <span className="recent-status-pill" style={{ color: item.statusColor }}>
                          ● {item.status}
                        </span>
                      </div>

                      <div className="recent-card-bottom">
                        <span className="recent-time-lbl">Last meeting: {item.lastMeeting}</span>
                        <span className="recent-continue-txt">Continue &rarr;</span>
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
