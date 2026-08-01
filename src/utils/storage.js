const STORAGE_KEY = 'warroom_history';

function slugify(name) {
  return 'startup_' + (name || 'unnamed').toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

// Create and initialize a new active session
// userId: the Firebase UID of the authenticated user (null for anonymous/legacy sessions)
export function createSession(ideaData, sharkTankMode = false, userId = null) {
  const history = getHistory();
  const startupId = slugify(ideaData?.name);
  const previousVersions = history.filter((h) => h.startupId === startupId);
  const previousEntry = previousVersions[0] || null;
  const versionNumber = previousEntry ? (previousEntry.versionNumber || previousVersions.length) + 1 : 1;
  const sessionId = 'sess_' + generateId();
  const now = Date.now();

  const session = {
    id: sessionId,
    sessionId,
    startupId,
    userId,             // Firebase UID — null for legacy/anonymous sessions
    isLegacy: !userId,  // true = stored locally only, not linked to an account
    createdAt: new Date(now).toISOString(),
    sessionStartedAt: now,
    completedAt: null,
    status: 'RUNNING', // 'RUNNING' | 'COMPLETED' | 'FAILED'
    versionNumber,
    ideaData,
    analysisResult: null,
    events: [],
    whatChanged: computeWhatChanged(previousEntry?.ideaData, ideaData, previousEntry?.overallScore, null),
    addressedRecommendations: [],
    founderNotes: '',
    tags: [],
    isFavorite: false,
    overallScore: null,
    verdict: null,
    previousVersionId: previousEntry ? previousEntry.sessionId || previousEntry.id : null,
    sharkTankMode: !!sharkTankMode,
  };

  history.unshift(session);
  if (history.length > 50) history.pop();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save session to localStorage:', e);
  }

  return session;
}

export function updateSession(sessionId, patchData) {
  const history = getHistory();
  const index = history.findIndex((h) => h.id === sessionId || h.sessionId === sessionId);
  if (index === -1) return null;

  const target = history[index];
  const updated = {
    ...target,
    ...patchData,
  };

  // Re-compute deltas if analysisResult is completed
  if (patchData.analysisResult) {
    const previousVersions = history.filter((h) => h.startupId === target.startupId && h.sessionId !== sessionId);
    const previousEntry = previousVersions[0] || null;
    updated.whatChanged = computeWhatChanged(previousEntry?.ideaData, target.ideaData, previousEntry?.overallScore, patchData.analysisResult.overallScore);
    updated.addressedRecommendations = computeAddressedRecommendations(previousEntry?.analysisResult, target.ideaData, patchData.analysisResult);
    updated.overallScore = patchData.analysisResult.overallScore;
    updated.verdict = patchData.analysisResult.verdict;
    updated.completedAt = new Date().toISOString();
  }

  history[index] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to update session in localStorage:', e);
  }

  return updated;
}

export function appendSessionEvent(sessionId, event) {
  const history = getHistory();
  const target = history.find((h) => h.id === sessionId || h.sessionId === sessionId);
  if (!target) return null;

  if (!target.events) target.events = [];
  target.events.push(event);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to append event to localStorage:', e);
  }
  return target;
}

// Legacy save helper
export function saveAnalysis(ideaData, analysisResult, sharkTankMode) {
  const session = createSession(ideaData, sharkTankMode);
  return updateSession(session.sessionId, { analysisResult, status: 'COMPLETED' });
}

function computeWhatChanged(oldIdea, newIdea, oldScore, newScore) {
  if (!oldIdea) return ['Initial Board Session & Thesis Formulation'];

  const changes = [];
  if (oldIdea.targetMarket !== newIdea.targetMarket) {
    changes.push(`Target Market updated to "${newIdea.targetMarket || 'Refined target market'}"`);
  }
  if (oldIdea.revenueModel !== newIdea.revenueModel) {
    changes.push(`Monetization model updated to "${newIdea.revenueModel || 'New revenue model'}"`);
  }
  if (oldIdea.description !== newIdea.description) {
    changes.push('Refined core value proposition and product description');
  }

  if (oldScore != null && newScore != null) {
    const delta = (newScore - oldScore).toFixed(1);
    if (delta > 0) changes.push(`Overall Board Score improved by +${delta} points`);
    else if (delta < 0) changes.push(`Overall Board Score changed by ${delta} points`);
  }

  if (changes.length === 0) {
    changes.push('Incorporated board review feedback and optimized execution strategy');
  }

  return changes;
}

function computeAddressedRecommendations(oldResult, newIdea, newResult) {
  if (!oldResult) return ['Established baseline MVP specs & board recommendations'];

  const prevActions = oldResult.actionItems || oldResult.recommendations || [];
  if (prevActions.length === 0) return ['Addressed initial board concerns'];

  // Cross-reference previous recommendations against new strengths/observations
  const newStrengths = (newResult?.strengths || []).join(' ').toLowerCase();
  const newObs = (newResult?.agentResults || []).flatMap((a) => a.keyObservations || []).join(' ').toLowerCase();
  const newIdeaText = (newIdea?.description || '' + ' ' + (newIdea?.revenueModel || '')).toLowerCase();

  const addressed = prevActions.filter((action) => {
    const actLower = action.toLowerCase();
    return newStrengths.includes(actLower.slice(0, 15)) || newObs.includes(actLower.slice(0, 15)) || newIdeaText.includes(actLower.slice(0, 15));
  });

  return addressed.length > 0 ? addressed : [prevActions[0] || 'Updated strategic alignment'];
}

export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getVersions(startupName) {
  const history = getHistory();
  return history.filter(
    (entry) =>
      entry.ideaData?.name?.toLowerCase().trim() ===
      startupName?.toLowerCase().trim()
  );
}

export function getAnalysisById(id) {
  const history = getHistory();
  return history.find((entry) => entry.id === id) || null;
}

export function updateNotes(id, notes) {
  const history = getHistory();
  const updated = history.map((entry) =>
    entry.id === id ? { ...entry, founderNotes: notes } : entry
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function toggleFavorite(id) {
  const history = getHistory();
  const updated = history.map((entry) =>
    entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteVersion(id) {
  const history = getHistory();
  const filtered = history.filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getLatestVersion() {
  const history = getHistory();
  return history[0] || null;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * One-time migration: tag any existing sessions that have no userId as legacy.
 * Call this once on app mount.
 */
export function migrateExistingSessions() {
  const history = getHistory();
  let changed = false;
  const migrated = history.map((entry) => {
    if (entry.userId === undefined || entry.isLegacy === undefined) {
      changed = true;
      return { ...entry, userId: entry.userId ?? null, isLegacy: entry.isLegacy ?? !entry.userId };
    }
    return entry;
  });
  if (changed) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch (e) {
      console.warn('Failed to migrate sessions:', e);
    }
  }
}

/**
 * Import a legacy session into an authenticated account.
 * Sets userId and clears isLegacy flag.
 */
export function importSessionToAccount(sessionId, userId) {
  const history = getHistory();
  const idx = history.findIndex((h) => h.id === sessionId || h.sessionId === sessionId);
  if (idx === -1 || !userId) return null;
  history[idx] = { ...history[idx], userId, isLegacy: false };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to import session:', e);
  }
  return history[idx];
}
