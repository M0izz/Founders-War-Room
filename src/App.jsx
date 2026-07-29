import React, { useState, useCallback } from 'react';
import Landing from './components/Landing.jsx';
import IdeaForm from './components/IdeaForm.jsx';
import LoadingPipeline from './components/LoadingPipeline.jsx';
import Boardroom from './components/Boardroom.jsx';
import VersionHistory from './components/VersionHistory.jsx';
import { analyzeIdea } from './utils/api.js';
import { saveAnalysis, getHistory, getAnalysisById } from './utils/storage.js';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [sharkTankMode, setSharkTankMode] = useState(false);
  const [ideaData, setIdeaData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleEnterWarRoom = useCallback(() => {
    setCurrentView('form');
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (formData, isSharkTank) => {
    setIdeaData(formData);
    setSharkTankMode(isSharkTank);
    setCurrentView('analyzing');
    setError(null);

    try {
      const result = await analyzeIdea(formData, isSharkTank);
      setAnalysisResult(result);
      saveAnalysis(formData, result, isSharkTank);
      setCurrentView('boardroom');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
      setCurrentView('form');
    }
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setCurrentView('form');
    setAnalysisResult(null);
    setIdeaData(null);
    setError(null);
  }, []);

  const handleBack = useCallback(() => {
    if (currentView === 'form') {
      setCurrentView('landing');
    } else if (currentView === 'boardroom') {
      setCurrentView('form');
    }
    setError(null);
  }, [currentView]);

  const handleViewHistoryItem = useCallback((entry) => {
    setIdeaData(entry.ideaData);
    setAnalysisResult(entry.analysisResult);
    setSharkTankMode(entry.sharkTankMode || false);
    setShowHistory(false);
    setCurrentView('boardroom');
  }, []);

  const appClass = sharkTankMode ? 'app shark-tank-mode' : 'app';

  return (
    <div className={appClass}>
      {sharkTankMode && currentView !== 'landing' && (
        <div className="shark-tank-badge">🦈 Shark Tank Mode</div>
      )}

      {currentView === 'landing' && (
        <Landing onEnter={handleEnterWarRoom} />
      )}

      {currentView === 'form' && (
        <IdeaForm
          onSubmit={handleSubmit}
          onBack={handleBack}
          initialData={ideaData}
          error={error}
        />
      )}

      {currentView === 'analyzing' && (
        <LoadingPipeline
          ideaData={ideaData}
          sharkTankMode={sharkTankMode}
        />
      )}

      {currentView === 'boardroom' && analysisResult && (
        <Boardroom
          ideaData={ideaData}
          result={analysisResult}
          sharkTankMode={sharkTankMode}
          onNewAnalysis={handleNewAnalysis}
          onViewHistory={() => setShowHistory(true)}
        />
      )}

      {showHistory && (
        <VersionHistory
          onClose={() => setShowHistory(false)}
          onSelect={handleViewHistoryItem}
        />
      )}
    </div>
  );
}
