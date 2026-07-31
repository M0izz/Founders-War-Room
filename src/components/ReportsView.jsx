import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

const REPORT_TEMPLATES = [
  {
    id: 'exec-summary',
    title: 'Executive Summary',
    description: "High-level overview of the board's decision and key insights.",
    category: 'Strategy',
    iconName: 'history',
    iconColor: '#c084fc',
    bgGlow: 'rgba(192, 132, 252, 0.1)',
  },
  {
    id: 'investor-report',
    title: 'Investor Report',
    description: 'Comprehensive report for potential investors and stakeholders.',
    category: 'Financial',
    iconName: 'investor',
    iconColor: '#4ade80',
    bgGlow: 'rgba(74, 222, 128, 0.1)',
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    description: 'In-depth market size, trends, and competitive landscape.',
    category: 'Market',
    iconName: 'activity',
    iconColor: '#38bdf8',
    bgGlow: 'rgba(56, 189, 248, 0.1)',
  },
  {
    id: 'tech-feasibility',
    title: 'Technical Feasibility',
    description: 'Technical evaluation, architecture suggestions, and feasibility score.',
    category: 'Technical',
    iconName: 'cto',
    iconColor: '#fb923c',
    bgGlow: 'rgba(251, 146, 60, 0.1)',
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Detailed risk analysis with mitigation strategies and impact assessment.',
    category: 'Risk',
    iconName: 'risk',
    iconColor: '#f87171',
    bgGlow: 'rgba(248, 113, 113, 0.1)',
  },
  {
    id: 'business-canvas',
    title: 'Business Model Canvas',
    description: 'Visual business model canvas with key components.',
    category: 'Financial',
    iconName: 'briefcase',
    iconColor: '#2dd4bf',
    bgGlow: 'rgba(45, 212, 191, 0.1)',
  },
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis',
    description: 'Strengths, weaknesses, opportunities, and threats breakdown.',
    category: 'Strategy',
    iconName: 'target',
    iconColor: '#60a5fa',
    bgGlow: 'rgba(96, 165, 250, 0.1)',
  },
  {
    id: 'pitch-deck-summary',
    title: 'Pitch Deck Summary',
    description: 'Investor-ready pitch deck content and key speaking points.',
    category: 'Financial',
    iconName: 'history',
    iconColor: '#c084fc',
    bgGlow: 'rgba(192, 132, 252, 0.1)',
  },
  {
    id: 'board-transcript',
    title: 'Boardroom Transcript',
    description: 'Complete conversation transcript from the boardroom meeting.',
    category: 'Other',
    iconName: 'ceo',
    iconColor: '#fbbf24',
    bgGlow: 'rgba(251, 191, 36, 0.1)',
  },
];

const RECENT_REPORTS_LIST = [
  {
    title: 'Investor Report',
    startup: 'VITALINK',
    tagColor: '#38bdf8',
    date: 'Jul 31, 2026 · 10:30 PM',
    iconName: 'history',
    iconColor: '#c084fc',
  },
  {
    title: 'Executive Summary',
    startup: 'VITALINK',
    tagColor: '#38bdf8',
    date: 'Jul 31, 2026 · 10:30 PM',
    iconName: 'history',
    iconColor: '#c084fc',
  },
  {
    title: 'Market Analysis',
    startup: 'VITALINK',
    tagColor: '#38bdf8',
    date: 'Jul 30, 2026 · 08:15 PM',
    iconName: 'activity',
    iconColor: '#38bdf8',
  },
  {
    title: 'Risk Assessment',
    startup: 'FoodAI',
    tagColor: '#c084fc',
    date: 'Jul 30, 2026 · 08:15 PM',
    iconName: 'risk',
    iconColor: '#f87171',
  },
  {
    title: 'Technical Feasibility',
    startup: 'EduBot',
    tagColor: '#4ade80',
    date: 'Jul 29, 2026 · 06:45 PM',
    iconName: 'cto',
    iconColor: '#4ade80',
  },
];

export default function ReportsView({
  onNavigate,
  userName = 'Moiz',
}) {
  const [activeCategory, setActiveCategory] = useState('All Reports');
  const [openRecentMenu, setOpenRecentMenu] = useState(null);

  const categories = ['All Reports', 'Strategy', 'Financial', 'Market', 'Technical', 'Risk', 'Other'];

  const filteredTemplates = activeCategory === 'All Reports'
    ? REPORT_TEMPLATES
    : REPORT_TEMPLATES.filter(t => t.category === activeCategory);

  const handleGenerate = (template) => {
    alert(`Generating ${template.title}... Executive report compiling.`);
    window.print();
  };

  return (
    <div className="v2-dashboard-page" onClick={() => setOpenRecentMenu(null)}>
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

            <button className="v2-nav-item active" onClick={() => onNavigate && onNavigate('reports')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} color="#f59e0b" /></span>
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>Reports</span>
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

        {/* Main Content Workspace Grid */}
        <main className="v2-main-content" style={{ maxWidth: '1440px' }}>
          <div className="reports-exact-grid">

            {/* Left Area: Reports Templates Grid */}
            <div className="reports-templates-column">
              
              {/* Header Title Row */}
              <div className="reports-title-row">
                <div>
                  <h1 className="reports-main-heading">Reports</h1>
                  <p className="reports-subtext">Generate professional reports and documents from your boardroom analyses.</p>
                </div>

                <button className="btn-generate-new-report-glowing" onClick={() => alert('Select a report template below to generate.')}>
                  <span>+</span> Generate New Report &gt;
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="reports-category-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`reports-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat === 'All Reports' && <AppIcon name="history" size={14} style={{ marginRight: '6px' }} />}
                    {cat}
                  </button>
                ))}
              </div>

              {/* Report Templates Section Subtitle */}
              <h3 className="templates-section-subtitle">Report Templates</h3>

              {/* 3x3 Grid of Report Templates */}
              <div className="report-templates-grid">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="report-template-card glass-panel">
                    <div className="template-card-top">
                      <div className="template-icon-box" style={{ backgroundColor: template.bgGlow }}>
                        <AppIcon name={template.iconName} size={22} color={template.iconColor} />
                      </div>
                      <div className="template-title-stack">
                        <h4 className="template-card-title">{template.title}</h4>
                        <p className="template-card-desc">{template.description}</p>
                      </div>
                    </div>

                    <button className="template-generate-btn" onClick={() => handleGenerate(template)}>
                      Generate Report &rarr;
                    </button>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Side Column: Reports Overview & Recent Reports */}
            <div className="reports-overview-column">

              {/* Reports Overview Panel */}
              <div className="reports-overview-card glass-panel">
                <h3 className="overview-heading">Reports Overview</h3>

                <div className="overview-stats-2x2">
                  {/* Total Reports */}
                  <div className="overview-stat-box">
                    <div className="stat-top-row">
                      <span className="stat-lbl-gray">Total Reports</span>
                      <AppIcon name="history" size={16} color="#60a5fa" />
                    </div>
                    <span className="stat-num-big">28</span>
                    <span className="stat-sub-txt">Across all missions</span>
                  </div>

                  {/* This Month */}
                  <div className="overview-stat-box">
                    <div className="stat-top-row">
                      <span className="stat-lbl-gray">This Month</span>
                      <AppIcon name="activity" size={16} color="#4ade80" />
                    </div>
                    <span className="stat-num-big">12</span>
                    <span className="stat-sub-txt">Reports generated</span>
                  </div>

                  {/* Most Used */}
                  <div className="overview-stat-box">
                    <div className="stat-top-row">
                      <span className="stat-lbl-gray">Most Used</span>
                      <AppIcon name="crown" size={16} color="#c084fc" />
                    </div>
                    <span className="stat-text-bold">Investor Report</span>
                    <span className="stat-sub-txt">Used 8 times</span>
                  </div>

                  {/* Avg Quality */}
                  <div className="overview-stat-box">
                    <div className="stat-top-row">
                      <span className="stat-lbl-gray">Avg. Quality</span>
                      <AppIcon name="target" size={16} color="#fbbf24" />
                    </div>
                    <div className="stat-score-inline">
                      <span className="stat-score-num">8.4</span>
                      <span className="stat-score-denom">/10</span>
                    </div>
                    <span className="stat-sub-txt">Board satisfaction</span>
                  </div>
                </div>
              </div>

              {/* Recent Reports Panel */}
              <div className="recent-reports-card glass-panel">
                <div className="recent-reports-header">
                  <h3 className="overview-heading">Recent Reports</h3>
                  <button className="view-all-link-btn" onClick={() => setActiveCategory('All Reports')}>
                    View All
                  </button>
                </div>

                <div className="recent-reports-list">
                  {RECENT_REPORTS_LIST.map((item, idx) => (
                    <div key={idx} className="recent-report-row">
                      <div className="recent-left-info">
                        <div className="recent-icon-badge" style={{ backgroundColor: `${item.iconColor}22` }}>
                          <AppIcon name={item.iconName} size={16} color={item.iconColor} />
                        </div>
                        <div className="recent-text-stack">
                          <div className="recent-title-line">
                            <span className="recent-item-title">{item.title}</span>
                            <span className="recent-startup-tag" style={{ color: item.tagColor, background: `${item.tagColor}1a` }}>
                              {item.startup}
                            </span>
                          </div>
                          <span className="recent-item-date">{item.date}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="recent-action-btns">
                        <button className="row-action-icon-btn" title="Download" onClick={() => window.print()}>
                          <AppIcon name="history" size={14} color="#94a3b8" />
                        </button>
                        <button className="row-action-icon-btn" title="View" onClick={() => onNavigate && onNavigate('boardroom')}>
                          <AppIcon name="analyzing" size={14} color="#94a3b8" />
                        </button>
                        <button
                          className="row-action-icon-btn"
                          title="Options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenRecentMenu(openRecentMenu === idx ? null : idx);
                          }}
                        >
                          ⋮
                        </button>

                        {openRecentMenu === idx && (
                          <div className="recent-options-menu-popup glass-panel" onClick={(e) => e.stopPropagation()}>
                            <button className="recent-menu-option" onClick={() => { setOpenRecentMenu(null); window.print(); }}>
                              📥 Download PDF
                            </button>
                            <button className="recent-menu-option" onClick={() => { setOpenRecentMenu(null); onNavigate && onNavigate('boardroom'); }}>
                              👁️ View Meeting
                            </button>
                            <button className="recent-menu-option delete-option" onClick={() => { setOpenRecentMenu(null); alert('Deleted report'); }}>
                              🗑️ Delete Report
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Full-Width Export All Reports Button */}
                <div className="export-all-wrapper">
                  <button className="btn-export-all-reports" onClick={() => alert('Downloading all boardroom reports as ZIP archive...')}>
                    <AppIcon name="history" size={16} /> Export All Reports
                  </button>
                  <span className="export-all-subtext">Download all reports as ZIP</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
