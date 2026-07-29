import React from 'react';

// Simple Sidebar component for navigation
export default function Sidebar({ currentView, setCurrentView }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'boardroom', label: 'Boardroom' },
    { key: 'timeline', label: 'Evolution Timeline' },
    { key: 'workspace', label: 'Workspace' },
    { key: 'pitchdeck', label: 'Pitch Deck' },
    { key: 'settings', label: 'Settings' },
  ];

  const handleClick = (key) => {
    // Map keys to App view identifiers
    if (key === 'dashboard') setCurrentView('landing');
    else if (key === 'boardroom') setCurrentView('boardroom');
    else if (key === 'timeline') setCurrentView('timeline');
    else if (key === 'workspace') setCurrentView('workspace'); // placeholder
    else if (key === 'pitchdeck') setCurrentView('pitchdeck'); // placeholder
    else if (key === 'settings') setCurrentView('settings'); // placeholder
  };

  return (
    <aside className="sidebar glass">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li
              key={item.key}
              className={currentView === item.key ? 'active' : ''}
              onClick={() => handleClick(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
