import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

export default function SettingsView({
  onNavigate,
  userName = 'Moiz',
}) {
  const [activeTab, setActiveTab] = useState('General');

  // Toggle states
  const [autoSave, setAutoSave] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [debateMode, setDebateMode] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [autoArchive, setAutoArchive] = useState(false);
  const [betaFeatures, setBetaFeatures] = useState(false);

  // Dropdown states
  const [privacy, setPrivacy] = useState('Private');
  const [language, setLanguage] = useState('English');
  const [meetingLength, setMeetingLength] = useState('4 Minutes');
  const [responseDepth, setResponseDepth] = useState('Detailed');
  const [exportQuality, setExportQuality] = useState('High (PDF)');

  const tabs = [
    { name: 'General', icon: 'cto' },
    { name: 'AI & Models', icon: 'zap' },
    { name: 'Board Members', icon: 'ceo' },
    { name: 'Appearance', icon: 'activity' },
    { name: 'Notifications', icon: 'bell' },
    { name: 'Data & Privacy', icon: 'risk' },
    { name: 'Account', icon: 'user' },
  ];

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

        <div className="v2-header-actions">
          <button className="v2-icon-btn" title="Power Status">
            <AppIcon name="zap" size={16} />
          </button>
          <button className="v2-icon-btn" title="Notifications">
            <AppIcon name="bell" size={16} />
            <span className="v2-notification-dot" />
          </button>
          <button className="v2-icon-btn" title="Help">
            <AppIcon name="history" size={16} />
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

      {/* Main Body */}
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
              <span>New Startup</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('boardroom')}>
              <span className="nav-item-icon"><AppIcon name="ceo" size={18} /></span>
              <span>War Room</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('timeline')}>
              <span className="nav-item-icon"><AppIcon name="activity" size={18} /></span>
              <span>Evolution</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('reports')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Reports</span>
            </button>

            <button className="v2-nav-item active" onClick={() => onNavigate && onNavigate('settings')}>
              <span className="nav-item-icon"><AppIcon name="cto" size={18} color="#f59e0b" /></span>
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>Settings</span>
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

        {/* Main Content Workspace Grid */}
        <main className="v2-main-content" style={{ maxWidth: '1440px' }}>
          <div className="settings-exact-grid">

            {/* Left Area: Settings Feed */}
            <div className="settings-feed-column">
              
              {/* Header Title Row */}
              <div className="settings-title-row">
                <div>
                  <h1 className="settings-main-heading">Settings</h1>
                  <p className="settings-subtext">Customize your experience and manage your preferences.</p>
                </div>
              </div>

              {/* Settings Category Tabs */}
              <div className="settings-category-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    className={`settings-cat-tab ${activeTab === tab.name ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    <AppIcon name={tab.icon} size={14} style={{ marginRight: '6px' }} />
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* 3x2 Grid of Settings Cards */}
              <div className="settings-cards-grid">

                {/* Card 1: General Preferences */}
                <div className="settings-card glass-panel">
                  <div className="settings-card-header">
                    <AppIcon name="cto" size={18} color="#c084fc" />
                    <h3>General Preferences</h3>
                  </div>

                  <div className="settings-form-list">
                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Default Mission Privacy</span>
                        <span className="setting-desc">Choose privacy for new missions</span>
                      </div>
                      <select className="settings-select" value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                        <option value="Private">🔒 Private</option>
                        <option value="Public">🌐 Public</option>
                        <option value="Team">👥 Team Only</option>
                      </select>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Auto-Save Missions</span>
                        <span className="setting-desc">Automatically save your progress</span>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Confirm Before Deleting</span>
                        <span className="setting-desc">Show confirmation before deleting</span>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" checked={confirmDelete} onChange={() => setConfirmDelete(!confirmDelete)} />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Default Language</span>
                        <span className="setting-desc">Select your preferred language</span>
                      </div>
                      <select className="settings-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="English">🌐 English</option>
                        <option value="Spanish">Español</option>
                        <option value="German">Deutsch</option>
                        <option value="French">Français</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card 2: Meeting & Analysis */}
                <div className="settings-card glass-panel">
                  <div className="settings-card-header">
                    <AppIcon name="history" size={18} color="#38bdf8" />
                    <h3>Meeting & Analysis</h3>
                  </div>

                  <div className="settings-form-list">
                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Default Meeting Length</span>
                        <span className="setting-desc">Estimated time for board meetings</span>
                      </div>
                      <select className="settings-select" value={meetingLength} onChange={(e) => setMeetingLength(e.target.value)}>
                        <option value="2 Minutes">2 Minutes</option>
                        <option value="4 Minutes">4 Minutes</option>
                        <option value="8 Minutes">8 Minutes</option>
                      </select>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">AI Response Depth</span>
                        <span className="setting-desc">Control response detail level</span>
                      </div>
                      <select className="settings-select" value={responseDepth} onChange={(e) => setResponseDepth(e.target.value)}>
                        <option value="Concise">Concise</option>
                        <option value="Detailed">Detailed</option>
                        <option value="Exhaustive">Exhaustive</option>
                      </select>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Enable Debate Mode</span>
                        <span className="setting-desc">Allow members to challenge each other</span>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" checked={debateMode} onChange={() => setDebateMode(!debateMode)} />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Include Data Sources</span>
                        <span className="setting-desc">Show data sources in reports</span>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" checked={includeSources} onChange={() => setIncludeSources(!includeSources)} />
                        <span className="switch-slider" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Card 3: Data & Storage */}
                <div className="settings-card glass-panel">
                  <div className="settings-card-header">
                    <AppIcon name="briefcase" size={18} color="#4ade80" />
                    <h3>Data & Storage</h3>
                  </div>

                  <div className="settings-form-list">
                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Export Quality</span>
                        <span className="setting-desc">Quality for exported reports</span>
                      </div>
                      <select className="settings-select" value={exportQuality} onChange={(e) => setExportQuality(e.target.value)}>
                        <option value="High (PDF)">High (PDF)</option>
                        <option value="Standard (PNG)">Standard (PNG)</option>
                        <option value="Raw (JSON)">Raw (JSON)</option>
                      </select>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Auto-Archive Old Missions</span>
                        <span className="setting-desc">Archive missions older than 90 days</span>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" checked={autoArchive} onChange={() => setAutoArchive(!autoArchive)} />
                        <span className="switch-slider" />
                      </label>
                    </div>

                    <div className="storage-bar-block">
                      <div className="storage-lbl-line">
                        <span className="setting-label">Storage Used</span>
                        <span className="storage-percent">24%</span>
                      </div>
                      <span className="storage-sub-txt">12.4 GB of 50 GB used</span>
                      <div className="storage-progress-bg">
                        <div className="storage-progress-fill" style={{ width: '24%' }} />
                      </div>
                    </div>

                    <button className="settings-action-btn-ghost" onClick={() => alert('Opening storage manager...')}>
                      <AppIcon name="briefcase" size={14} /> Manage Storage &gt;
                    </button>
                  </div>
                </div>

                {/* Card 4: Integrations */}
                <div className="settings-card glass-panel">
                  <div className="settings-card-header">
                    <AppIcon name="target" size={18} color="#c084fc" />
                    <h3>Integrations</h3>
                  </div>

                  <div className="settings-form-list">
                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Google Drive</span>
                        <span className="setting-desc">Connect your Google Drive</span>
                      </div>
                      <button className="connect-btn" onClick={() => alert('Google Drive connected!')}>
                        <span className="g-icon">G</span> Connect
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Notion</span>
                        <span className="setting-desc">Sync reports to Notion workspace</span>
                      </div>
                      <button className="connect-btn" onClick={() => alert('Notion connected!')}>
                        <span className="n-icon">N</span> Connect
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Slack</span>
                        <span className="setting-desc">Get notifications in Slack</span>
                      </div>
                      <button className="connect-btn" onClick={() => alert('Slack connected!')}>
                        <span className="s-icon">S</span> Connect
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Email</span>
                        <span className="setting-desc">Send reports via email</span>
                      </div>
                      <button className="connect-btn outline" onClick={() => alert('Email settings opened.')}>
                        ✉ Configure
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 5: Advanced */}
                <div className="settings-card glass-panel">
                  <div className="settings-card-header">
                    <AppIcon name="cto" size={18} color="#fb923c" />
                    <h3>Advanced</h3>
                  </div>

                  <div className="settings-form-list">
                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">API Access</span>
                        <span className="setting-desc">Enable API for advanced usage</span>
                      </div>
                      <button className="connect-btn outline" onClick={() => alert('API credentials configured.')}>
                        Configure
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Webhooks</span>
                        <span className="setting-desc">Receive real-time event updates</span>
                      </div>
                      <button className="connect-btn outline" onClick={() => alert('Webhooks configured.')}>
                        Configure
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Custom Prompts</span>
                        <span className="setting-desc">Manage your custom AI prompts</span>
                      </div>
                      <button className="connect-btn outline" onClick={() => alert('Prompt editor opened.')}>
                        Manage
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label">Beta Features</span>
                        <span className="setting-desc">Try new features before release</span>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" checked={betaFeatures} onChange={() => setBetaFeatures(!betaFeatures)} />
                        <span className="switch-slider" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Card 6: Danger Zone */}
                <div className="settings-card glass-panel danger-card">
                  <div className="settings-card-header">
                    <AppIcon name="risk" size={18} color="#f87171" />
                    <h3 style={{ color: '#f87171' }}>Danger Zone</h3>
                  </div>

                  <div className="settings-form-list">
                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label red">Clear Cache</span>
                        <span className="setting-desc">Remove temporary data</span>
                      </div>
                      <button className="danger-btn" onClick={() => alert('Cache cleared successfully!')}>
                        🗑 Clear
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label red">Reset Preferences</span>
                        <span className="setting-desc">Reset all settings to default</span>
                      </div>
                      <button className="danger-btn" onClick={() => alert('Preferences reset to default.')}>
                        🗑 Reset
                      </button>
                    </div>

                    <div className="setting-row">
                      <div className="setting-info">
                        <span className="setting-label red">Delete Account</span>
                        <span className="setting-desc">Permanently delete your account</span>
                      </div>
                      <button className="danger-btn" onClick={() => alert('Account deletion requested.')}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Quote Banner */}
              <div className="settings-quote-banner">
                <p className="quote-text">“ Great decisions start with better insights. ”</p>
                <span className="quote-author">— Your AI Board of Directors</span>
              </div>

            </div>

            {/* Right Side Column: Profile, Plan & Usage, About */}
            <div className="settings-side-column">

              {/* Your Profile Card */}
              <div className="profile-widget-card glass-panel">
                <h3 className="widget-heading">Your Profile</h3>

                <div className="profile-user-center">
                  <div className="profile-avatar-large">
                    <AppIcon name="user" size={32} color="#fff" />
                  </div>
                  <h4 className="profile-user-name">{userName}</h4>
                  <span className="profile-user-email">moiz@example.com</span>
                  <span className="profile-role-badge">Founder</span>
                </div>

                <button className="btn-edit-profile-ghost" onClick={() => alert('Opening profile editor...')}>
                  🖊 Edit Profile
                </button>
              </div>

              {/* Plan & Usage Card (EXPLICIT DIRECTIVE: Free Plan instead of Pro Plan) */}
              <div className="plan-usage-card glass-panel">
                <div className="plan-header-row">
                  <div className="plan-title-group">
                    <AppIcon name="crown" size={18} color="#c084fc" />
                    <h3 className="plan-name-text">Free Plan</h3>
                  </div>
                  <button className="manage-plan-link" onClick={() => alert('Upgrade to Pro plan for unlimited board reviews.')}>
                    Manage Plan
                  </button>
                </div>

                <div className="usage-bars-list">
                  {/* AI Credits */}
                  <div className="usage-item">
                    <div className="usage-lbl-row">
                      <span className="usage-lbl">AI Credits</span>
                      <span className="usage-vals"><strong>8,450</strong> / 10,000</span>
                    </div>
                    <div className="usage-bar-bg">
                      <div className="usage-bar-fill purple" style={{ width: '84.5%' }} />
                    </div>
                  </div>

                  {/* Board Meetings */}
                  <div className="usage-item">
                    <div className="usage-lbl-row">
                      <span className="usage-lbl">Board Meetings</span>
                      <span className="usage-vals"><strong>23</strong> / 50</span>
                    </div>
                    <div className="usage-bar-bg">
                      <div className="usage-bar-fill blue" style={{ width: '46%' }} />
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="usage-item">
                    <div className="usage-lbl-row">
                      <span className="usage-lbl">Storage</span>
                      <span className="usage-vals"><strong>12.4 GB</strong> / 50 GB</span>
                    </div>
                    <div className="usage-bar-bg">
                      <div className="usage-bar-fill green" style={{ width: '24.8%' }} />
                    </div>
                  </div>

                  {/* Reports Generated */}
                  <div className="usage-item">
                    <div className="usage-lbl-row">
                      <span className="usage-lbl">Reports Generated</span>
                      <span className="usage-vals"><strong>28</strong> / 100</span>
                    </div>
                    <div className="usage-bar-bg">
                      <div className="usage-bar-fill yellow" style={{ width: '28%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Card */}
              <div className="about-widget-card glass-panel">
                <h3 className="widget-heading">About</h3>

                <div className="about-rows-list">
                  <div className="about-row">
                    <span className="about-lbl">App Version</span>
                    <span className="about-val">v1.0.0</span>
                  </div>

                  <div className="about-row">
                    <span className="about-lbl">Last Updated</span>
                    <span className="about-val">July 31, 2026</span>
                  </div>

                  <div className="about-row">
                    <span className="about-lbl">Status</span>
                    <span className="status-operational">● All Systems Operational</span>
                  </div>
                </div>

                <button className="btn-check-updates-ghost" onClick={() => alert('Checking for updates... You are running the latest version.')}>
                  🔄 Check for Updates
                </button>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
