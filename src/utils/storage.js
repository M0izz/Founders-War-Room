const STORAGE_KEY = 'warroom_history';

// Save a new analysis entry with extended schema
export function saveAnalysis(ideaData, analysisResult, sharkTankMode) {
  const history = getHistory();
  const previousEntry = history[0] || null;
  const versionNumber = previousEntry ? previousEntry.versionNumber + 1 : 1;
  const entry = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    versionNumber,
    ideaData,
    analysisResult,
    founderNotes: '',
    tags: [],
    isFavorite: false,
    overallScore: analysisResult?.overallScore ?? null,
    verdict: analysisResult?.verdict ?? null,
    previousVersionId: previousEntry ? previousEntry.id : null,
    sharkTankMode: !!sharkTankMode,
  };
  history.unshift(entry);
  // Keep max 50 entries
  if (history.length > 50) history.pop();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
  return entry;
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
