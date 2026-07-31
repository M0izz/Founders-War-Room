import React from 'react';
import AppIcon from './AppIcon.jsx';

const RECENT_STARTUPS = [
  { id: 'vitalink-1', name: 'VITALINK', score: 8.4 },
  { id: 'h-1', name: 'h', score: 8.4 },
  { id: 'vitalink-2', name: 'VITALINK', score: 8.4 },
];

const BOARD_MEMBERS = [
  { role: 'CEO', status: 'Ready' },
  { role: 'CTO', status: 'Ready' },
  { role: 'Investor', status: 'Ready' },
  { role: 'Marketing', status: 'Ready' },
  { role: 'Customer', status: 'Ready' },
  { role: 'Risk', status: 'Ready' },
  { role: 'Grim Reaper', status: 'Ready' },
  { role: 'Chairman', status: 'Ready' },
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
        score: history[0].overallScore || 8.4,
        status: 'Ready for Board Review',
        updatedAt: '2 Hours Ago',
        raw: history[0],
      }
    : {
        name: 'VITALINK',
        industry: 'HealthTech',
        score: 8.4,
        status: 'Ready for Board Review',
        updatedAt: '2 Hours Ago',
      };

  const recentList = history.length > 0
    ? history.slice(0, 3).map((h) => ({
        id: h.id,
        name: h.ideaData?.name || 'Unnamed',
        score: h.overallScore || 8.4,
        raw: h,
      }))
    : RECENT_STARTUPS;

  return (
    <div className="exact-dashboard-page">
      {/* Background Subtle Grid & Ambient Glow */}
      <div className="command-bg-grid" />
      <div className="command-ambient-glow" />

      {/* Top Navigation Bar */}
      <header className="exact-header">
        <div className="exact-logo-brand" onClick={() => onNavigate('landing')}>
          <img src="/war_room_logo.png" alt="Logo" className="exact-logo-img" />
          <span className="exact-logo-title">FOUNDER'S WAR ROOM</span>
        </div>

        <div className="exact-header-right">
          <button className="exact-icon-btn" title="Notifications" onClick={() => alert('All 8 Board members are online & ready.')}>
            <AppIcon emoji="⚡" size={16} />
            <span className="exact-unread-dot" />
          </button>
          <button className="exact-icon-btn" title="Settings" onClick={() => onNavigate('settings')}>
            <AppIcon emoji="⚙️" size={16} />
          </button>
          <div className="exact-user-pill">
            <div className="exact-avatar-circle">
              <AppIcon emoji="👤" size={14} color="#fff" />
            </div>
            <span className="exact-user-name">{userName}</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="exact-body-container">
        {/* Left Sidebar Navigation */}
        <aside className="exact-sidebar">
          <nav className="exact-sidebar-nav">
            <button className="exact-nav-item active" onClick={() => onNavigate('dashboard')}>
              <span className="nav-icon"><AppIcon emoji="🪄" size={18} /></span>
              <span>Dashboard</span>
            </button>
            <button className="exact-nav-item" onClick={onConveneBoard}>
              <span className="nav-icon"><AppIcon emoji="🚀" size={18} /></span>
              <span>New Startup</span>
            </button>
            <button className="exact-nav-item" onClick={() => onNavigate('boardroom')}>
              <span className="nav-icon"><AppIcon emoji="🏛️" size={18} /></span>
              <span>War Room</span>
            </button>
            <button className="exact-nav-item" onClick={() => onNavigate('timeline')}>
              <span className="nav-icon"><AppIcon emoji="📈" size={18} /></span>
              <span>Evolution</span>
            </button>
            <button className="exact-nav-item" onClick={() => onNavigate('reports')}>
              <span className="nav-icon"><AppIcon emoji="📄" size={18} /></span>
              <span>Reports</span>
            </button>
            <button className="exact-nav-item" onClick={() => onNavigate('settings')}>
              <span className="nav-icon"><AppIcon emoji="⚙️" size={18} /></span>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Section */}
        <main className="exact-main-content">
          <div className="exact-grid-layout">
            
            {/* Center Area: Hero Card + Recent Startups */}
            <div className="exact-center-column">
              
              {/* Active Hero Card */}
              <div className="exact-hero-card">
                <div className="exact-hero-top-row">
                  <span className="exact-welcome-text">Welcome Back, {userName} 👏</span>
                  <span className="exact-mission-tag">CURRENT MISSION</span>
                </div>

                <h1 className="exact-hero-title">{activeStartup.name}</h1>

                <div className="exact-stats-boxes">
                  <div className="exact-stat-box">
                    <span className="exact-stat-label">Status</span>
                    <span className="exact-stat-val-gold">Ready for Board Review</span>
                  </div>
                  <div className="exact-stat-box">
                    <span className="exact-stat-label">Last Analysis</span>
                    <span className="exact-stat-val-white">2 Hours Ago</span>
                  </div>
                </div>

                <button
                  className="exact-btn-enter-warroom"
                  onClick={() => onOpenStartup(activeStartup.raw || activeStartup)}
                >
                  <AppIcon emoji="🏛️" size={18} style={{ marginRight: '8px' }} />
                  ENTER WAR ROOM
                </button>
              </div>

              {/* Recent Startups Section */}
              <div className="exact-recent-section">
                <h3 className="exact-recent-heading">Recent Startups</h3>
                <div className="exact-recent-grid">
                  {recentList.map((item, idx) => (
                    <div
                      key={idx}
                      className="exact-recent-card"
                      onClick={() => onOpenStartup(item.raw || item)}
                    >
                      <div className="recent-card-name">{item.name}</div>
                      <div className="recent-card-score">{item.score}</div>
                    </div>
                  ))}

                  <div className="exact-new-card" onClick={onConveneBoard}>
                    <span className="new-card-sparkle">✨</span>
                    <span className="new-card-text">New Startup</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Board Status Panel */}
            <div className="exact-right-column">
              <div className="exact-board-status-card">
                <div className="exact-status-header">
                  <h3 className="exact-status-title">Board Status</h3>
                  <span className="exact-ready-pill">Ready</span>
                </div>

                <div className="exact-members-list">
                  {BOARD_MEMBERS.map((m, i) => (
                    <div key={i} className="exact-member-row">
                      <div className="member-left">
                        <span className="green-dot-pulse" />
                        <span className="member-name">{m.role}</span>
                      </div>
                      <span className="member-status-txt">Ready</span>
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
