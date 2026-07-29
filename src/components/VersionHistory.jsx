import React from 'react';

export default function VersionHistory({ onClose, onSelect }) {
  // Placeholder: fetch history from localStorage (if any)
  const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');

  return (
    <div className="version-history overlay">
      <div className="header">
        <h2>📜 Version History</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      {history.length === 0 ? (
        <p>No previous analyses found.</p>
      ) : (
        <ul className="history-list">
          {history.map((entry, idx) => (
            <li key={idx} onClick={() => onSelect(entry)} className="history-item">
              <strong>{entry.title || `Analysis #${idx + 1}`}</strong>
              <span>{new Date(entry.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
