import React from 'react';

export default function Boardroom({ ideaData, result, sharkTankMode, onNewAnalysis, onViewHistory }) {
  return (
    <div className="boardroom">
      <h2>📊 War Room Results</h2>
      <pre className="idea-data">{JSON.stringify(ideaData, null, 2)}</pre>
      <pre className="analysis-result">{JSON.stringify(result, null, 2)}</pre>
      <button onClick={onNewAnalysis}>Start New Analysis</button>
      <button onClick={onViewHistory}>View History</button>
    </div>
  );
}
