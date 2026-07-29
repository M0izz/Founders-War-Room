const STORAGE_KEY = 'warroom_history';

export function saveAnalysis(ideaData, analysisResult, sharkTankMode) {
  const history = getHistory();
  const entry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ideaData,
    analysisResult,
    sharkTankMode,
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

export function deleteAnalysis(id) {
  const history = getHistory();
  const filtered = history.filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
