const STORAGE_KEY = 'warroom_history';

function slugify(name) {
  return 'startup_' + (name || 'unnamed').toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

// Save a new analysis entry with startupId + sessionId schema and delta calculation
export function saveAnalysis(ideaData, analysisResult, sharkTankMode) {
  const history = getHistory();
  const startupId = slugify(ideaData?.name);
  const previousVersions = history.filter((h) => h.startupId === startupId);
  const previousEntry = previousVersions[0] || null;
  const versionNumber = previousEntry ? (previousEntry.versionNumber || previousVersions.length) + 1 : 1;
  const sessionId = 'sess_' + generateId();

  // Compute whatChanged & addressedRecommendations
  const whatChanged = computeWhatChanged(previousEntry?.ideaData, ideaData, previousEntry?.overallScore, analysisResult?.overallScore);
  const addressedRecommendations = computeAddressedRecommendations(previousEntry?.analysisResult, ideaData, analysisResult);

  const entry = {
    id: sessionId,
    sessionId,
    startupId,
    createdAt: new Date().toISOString(),
    versionNumber,
    ideaData,
    analysisResult,
    whatChanged,
    addressedRecommendations,
    founderNotes: '',
    tags: [],
    isFavorite: false,
    overallScore: analysisResult?.overallScore ?? null,
    verdict: analysisResult?.verdict ?? null,
    previousVersionId: previousEntry ? previousEntry.sessionId || previousEntry.id : null,
    sharkTankMode: !!sharkTankMode,
  };

  history.unshift(entry);
  if (history.length > 50) history.pop();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }

  return entry;
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
