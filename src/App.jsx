import React, { useState, useCallback, useEffect } from 'react';
import Landing from './components/Landing.jsx';
import Dashboard from './components/Dashboard.jsx';
import IdeaForm from './components/IdeaForm.jsx';
import LoadingPipeline from './components/LoadingPipeline.jsx';
import BoardroomScene from './components/BoardroomScene.jsx';
import EvolutionTimeline from './components/EvolutionTimeline.jsx';
import ReportsView from './components/ReportsView.jsx';
import SettingsView from './components/SettingsView.jsx';
import AppIcon from './components/AppIcon.jsx';
import { analyzeIdea } from './utils/api.js';
import { saveAnalysis, getHistory } from './utils/storage.js';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [sharkTankMode, setSharkTankMode] = useState(false);
  const [ideaData, setIdeaData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [language, setLanguage] = useState(() => localStorage.getItem('fwr_language') || 'English');

  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang);
    localStorage.setItem('fwr_language', newLang);
  }, []);

  // Load history on mount
  useEffect(() => {
    setHistoryList(getHistory());
  }, [currentView]);

  const handleEnterWarRoom = useCallback(() => {
    setCurrentView('dashboard');
    setError(null);
  }, []);

  const handleConveneBoard = useCallback(() => {
    setCurrentView('form');
    setError(null);
  }, []);

  const handleOpenStartup = useCallback((startupItem) => {
    if (startupItem?.ideaData && startupItem?.analysisResult) {
      setIdeaData(startupItem.ideaData);
      setAnalysisResult(startupItem.analysisResult);
      setSharkTankMode(startupItem.sharkTankMode || false);
      setCurrentView('boardroom');
    } else if (startupItem?.raw) {
      setIdeaData(startupItem.raw.ideaData);
      setAnalysisResult(startupItem.raw.analysisResult);
      setSharkTankMode(startupItem.raw.sharkTankMode || false);
      setCurrentView('boardroom');
    } else {
      setIdeaData({
        name: startupItem.name || 'VITALINK',
        description: startupItem.description || 'QR-code based emergency medical history & allergy access for surgery & emergency care.',
        industry: startupItem.industry || 'HealthTech',
        revenueModel: 'Subscription (SaaS)',
        targetAudience: 'Emergency medical teams & patient families',
      });
      setCurrentView('form');
    }
  }, []);

  const handleNavigate = useCallback((viewKey) => {
    if (viewKey === 'dashboard') setCurrentView('dashboard');
    else if (viewKey === 'landing') setCurrentView('landing');
    else if (viewKey === 'form') setCurrentView('form');
    else if (viewKey === 'boardroom') {
      if (analysisResult) setCurrentView('boardroom');
      else setCurrentView('form');
    } else if (viewKey === 'timeline' || viewKey === 'startups') {
      setCurrentView('timeline');
    } else if (viewKey === 'reports') {
      setCurrentView('reports');
    } else if (viewKey === 'settings') {
      setCurrentView('settings');
    }
  }, [analysisResult]);

  const handleSubmit = useCallback(async (formData, isSharkTank) => {
    setIdeaData(formData);
    setSharkTankMode(isSharkTank);
    setCurrentView('analyzing');
    setError(null);

    try {
      const result = await analyzeIdea(formData, isSharkTank);
      setAnalysisResult(result);
      saveAnalysis(formData, result, isSharkTank);
      setHistoryList(getHistory());
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
      setCurrentView('dashboard');
    } else if (currentView === 'boardroom') {
      setCurrentView('dashboard');
    } else if (currentView === 'timeline' || currentView === 'reports' || currentView === 'settings') {
      setCurrentView('dashboard');
    } else if (currentView === 'dashboard') {
      setCurrentView('landing');
    }
    setError(null);
  }, [currentView]);

  const appClass = sharkTankMode ? 'app shark-tank-mode' : 'app';

  return (
    <div className={appClass}>
      {sharkTankMode && currentView !== 'landing' && currentView !== 'dashboard' && (
        <div className="shark-tank-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <AppIcon name="risk" size={16} color="#f87171" /> Shark Tank Mode
        </div>
      )}

      {currentView === 'landing' && (
        <Landing
          onLogin={handleEnterWarRoom}
          onConvene={handleConveneBoard}
          onEnter={handleEnterWarRoom}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          onConveneBoard={handleConveneBoard}
          onOpenStartup={handleOpenStartup}
          onNavigate={handleNavigate}
          history={historyList}
          userName="Moiz"
        />
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
        <BoardroomScene
          ideaData={ideaData}
          result={analysisResult}
          sharkTankMode={sharkTankMode}
          onNewAnalysis={handleNewAnalysis}
          onViewHistory={() => setCurrentView('timeline')}
        />
      )}

      {currentView === 'timeline' && (
        <EvolutionTimeline
          onNavigate={handleNavigate}
          onOpenStartup={handleOpenStartup}
          history={historyList}
          userName="Moiz"
          onClose={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'reports' && (
        <ReportsView
          onNavigate={handleNavigate}
          userName="Moiz"
          history={historyList}
          onOpenStartup={handleOpenStartup}
          onConveneBoard={handleConveneBoard}
        />
      )}

      {currentView === 'settings' && (
        <SettingsView
          onNavigate={handleNavigate}
          userName="Moiz"
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}
    </div>
  );
}
