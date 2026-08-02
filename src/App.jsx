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
import LoginPage from './components/auth/LoginPage.jsx';
import SignupPage from './components/auth/SignupPage.jsx';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { analyzeIdea, analyzeIdeaStream } from './utils/api.js';
import {
  saveAnalysis,
  getHistory,
  createSession,
  updateSession,
  appendSessionEvent,
  migrateExistingSessions,
  sanitiseHistory,
} from './utils/storage.js';

// Auth views — unauthenticated only
const AUTH_VIEWS = new Set(['landing', 'login', 'signup', 'forgot-password']);

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [currentView, setCurrentView] = useState('landing');
  const [sharkTankMode, setSharkTankMode] = useState(false);
  const [ideaData, setIdeaData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [error, setError] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('fwr_language') || 'English');

  // Sanitise + migrate any pre-auth / pre-fix localStorage sessions on mount
  useEffect(() => {
    migrateExistingSessions();
    sanitiseHistory();
    setHistoryList(getHistory());
  }, []);

  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang);
    localStorage.setItem('fwr_language', newLang);
  }, []);

  // Load history whenever view changes
  useEffect(() => {
    setHistoryList(getHistory());
  }, [currentView]);

  // ── Auth state guards ─────────────────────────────────────────────────────
  // Synchronously compute the view to render — avoids post-redirect
  // timing issues where useEffect fires a tick too late.
  // If auth has resolved and the user is logged in while on an auth-only page,
  // treat it as 'dashboard' immediately without waiting for state updates.
  const effectiveView = (() => {
    if (!authLoading && user && AUTH_VIEWS.has(currentView)) return 'dashboard';
    return currentView;
  })();

  // Keep currentView in sync for future renders (e.g. sign-out, navigation)
  useEffect(() => {
    if (!authLoading && user && AUTH_VIEWS.has(currentView)) {
      setCurrentView('dashboard');
    }
  }, [user, authLoading, currentView]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleAuthSuccess = useCallback(() => {
    setCurrentView('dashboard');
    setError(null);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setCurrentView('landing');
    setActiveSession(null);
    setAnalysisResult(null);
    setIdeaData(null);
    setError(null);
  }, [signOut]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleEnterWarRoom = useCallback(() => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
    setError(null);
  }, [user]);

  const handleConveneBoard = useCallback(() => {
    setCurrentView('form');
    setError(null);
  }, []);

  const handleOpenStartup = useCallback((startupItem) => {
    const raw = startupItem?.raw || startupItem;
    if (raw?.ideaData) {
      setIdeaData(raw.ideaData);
      setAnalysisResult(raw.analysisResult || null);
      setActiveSession(raw);
      setSharkTankMode(raw.sharkTankMode || false);
      setCurrentView('boardroom');
    } else {
      setIdeaData({
        name: startupItem?.name || 'VITALINK',
        description: startupItem?.description || 'QR-code based emergency medical history & allergy access for surgery & emergency care.',
        industry: startupItem?.industry || 'HealthTech',
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
      if (activeSession || ideaData) setCurrentView('boardroom');
      else setCurrentView('form');
    } else if (viewKey === 'timeline' || viewKey === 'startups') {
      setCurrentView('timeline');
    } else if (viewKey === 'reports') {
      setCurrentView('reports');
    } else if (viewKey === 'settings') {
      setCurrentView('settings');
    }
  }, [activeSession, ideaData]);

  // ── War Room submission ───────────────────────────────────────────────────
  const handleSubmit = useCallback(async (formData, isSharkTank) => {
    setIdeaData(formData);
    setSharkTankMode(isSharkTank);
    setError(null);
    setAnalysisResult(null);

    // Create session with current user's uid (null if anonymous)
    const newSession = createSession(formData, isSharkTank, user?.uid || null);
    setActiveSession(newSession);

    setCurrentView('boardroom');
    setHistoryList(getHistory());

    try {
      await analyzeIdeaStream(
        formData,
        isSharkTank,
        (event) => {
          if (event.sessionId && event.sessionId !== newSession.sessionId) return;

          appendSessionEvent(newSession.sessionId, event);

          setActiveSession((prev) => {
            if (!prev || (prev.sessionId && prev.sessionId !== newSession.sessionId)) return prev;
            const currentEvents = prev.events ? [...prev.events, event] : [event];
            return { ...prev, events: currentEvents };
          });

          if (event.type === 'SESSION_COMPLETED') {
            const finalResult = event.payload;
            setAnalysisResult(finalResult);
            updateSession(newSession.sessionId, { analysisResult: finalResult, status: 'COMPLETED' });
            setHistoryList(getHistory());
          }
        },
        newSession.sessionId,
      );
    } catch (err) {
      console.error('Streaming session failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    }
  }, [user]);

  const handleNewAnalysis = useCallback(() => {
    setCurrentView('form');
    setAnalysisResult(null);
    setIdeaData(null);
    setError(null);
  }, []);

  const handleBack = useCallback(() => {
    if (currentView === 'form') setCurrentView('dashboard');
    else if (currentView === 'boardroom') setCurrentView('dashboard');
    else if (['timeline', 'reports', 'settings'].includes(currentView)) setCurrentView('dashboard');
    else if (currentView === 'dashboard') setCurrentView('landing');
    setError(null);
  }, [currentView]);

  // Readable display name for the authenticated user
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Founder';

  const appClass = sharkTankMode ? 'app shark-tank-mode' : 'app';

  // ── Show spinner while Firebase resolves initial auth state ─────────────
  // Prevents flash of login page on refresh when already authenticated,
  // and prevents flash of landing page after Google redirect.
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#080c12',
      }}>
        <div style={{
          width: '32px', height: '32px',
          border: '2px solid rgba(255,255,255,0.06)',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  // ── Auth-only views ───────────────────────────────────────────────────────
  if (effectiveView === 'login') {
    return (
      <LoginPage
        onSuccess={handleAuthSuccess}
        onSignup={() => setCurrentView('signup')}
        onForgotPassword={() => setCurrentView('forgot-password')}
      />
    );
  }
  if (effectiveView === 'signup') {
    return (
      <SignupPage
        onSuccess={handleAuthSuccess}
        onLogin={() => setCurrentView('login')}
      />
    );
  }
  if (effectiveView === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onBack={() => setCurrentView('login')}
      />
    );
  }

  // ── Landing (unauthenticated only) ──────────────────────────────────────
  if (effectiveView === 'landing') {
    return (
      <Landing
        onLogin={handleEnterWarRoom}
        onConvene={handleConveneBoard}
        onEnter={handleEnterWarRoom}
      />
    );
  }

  // ── Authenticated views ───────────────────────────────────────────────────
  return (
    <ProtectedRoute onRedirect={() => setCurrentView('login')}>
      <div className={appClass}>
        {sharkTankMode && effectiveView !== 'dashboard' && (
          <div className="shark-tank-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <AppIcon name="risk" size={16} color="#f87171" /> Shark Tank Mode
          </div>
        )}

        {effectiveView === 'dashboard' && (
          <Dashboard
            onConveneBoard={handleConveneBoard}
            onOpenStartup={handleOpenStartup}
            onNavigate={handleNavigate}
            history={historyList}
            userName={displayName}
            user={user}
            onSignOut={handleSignOut}
          />
        )}

        {effectiveView === 'form' && (
          <IdeaForm
            onSubmit={handleSubmit}
            onBack={handleBack}
            initialData={ideaData}
            error={error}
          />
        )}

        {effectiveView === 'analyzing' && (
          <LoadingPipeline
            ideaData={ideaData}
            sharkTankMode={sharkTankMode}
          />
        )}

        {effectiveView === 'boardroom' && (
          <BoardroomScene
            ideaData={activeSession?.ideaData || ideaData}
            result={activeSession?.analysisResult}
            activeSession={activeSession}
            sharkTankMode={sharkTankMode}
            onNewAnalysis={handleNewAnalysis}
            onViewHistory={() => setCurrentView('timeline')}
            onBack={handleBack}
          />
        )}

        {effectiveView === 'timeline' && (
          <EvolutionTimeline
            onNavigate={handleNavigate}
            onOpenStartup={handleOpenStartup}
            history={historyList}
            userName={displayName}
            onClose={() => setCurrentView('dashboard')}
          />
        )}

        {effectiveView === 'reports' && (
          <ReportsView
            onNavigate={handleNavigate}
            userName={displayName}
            history={historyList}
            selectedReportId={selectedReportId}
            onSelectReport={(id) => setSelectedReportId(id)}
            onOpenStartup={handleOpenStartup}
            onConveneBoard={handleConveneBoard}
          />
        )}

        {effectiveView === 'settings' && (
          <SettingsView
            onNavigate={handleNavigate}
            userName={displayName}
            user={user}
            onSignOut={handleSignOut}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
