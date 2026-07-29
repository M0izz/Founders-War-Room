import React, { useEffect, useState } from 'react';
import { fetchBoardroom } from '../utils/api.js';

export default function BoardroomScene({ ideaData, result, sharkTankMode, onNewAnalysis, onViewHistory }) {
  const [conversation, setConversation] = useState([]);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If result already contains boardroom‑style payload, use it directly.
    if (result && result.conversation) {
      setConversation(result.conversation);
      setScores(result.scores || null);
      return;
    }
    // Otherwise fetch from the new endpoint.
    setLoading(true);
    fetchBoardroom(ideaData, sharkTankMode)
      .then((data) => {
        setConversation(data.conversation || []);
        setScores(data.scores || {});
      })
      .catch((err) => console.error('Boardroom fetch error:', err))
      .finally(() => setLoading(false));
  }, [ideaData, sharkTankMode, result]);

  if (loading) {
    return <div className="boardroom-scene"><p>Loading boardroom...</p></div>;
  }

  return (
    <div className="boardroom-scene">
      <h2>Live Boardroom Meeting</h2>
      {conversation.length > 0 ? (
        <div className="conversation">
          {conversation.map((c, idx) => (
            <div key={idx} className="utterance">
              <strong>{c.speaker.toUpperCase()}</strong>: {c.text.join(' ')}
            </div>
          ))}
        </div>
      ) : (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
      {scores && (
        <div className="scores">
          <h3>Session Info</h3>
          <pre>{JSON.stringify(scores, null, 2)}</pre>
        </div>
      )}
      <button onClick={onNewAnalysis}>Start New Analysis</button>
      <button onClick={onViewHistory}>View History</button>
    </div>
  );
}
