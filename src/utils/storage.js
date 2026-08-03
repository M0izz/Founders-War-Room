import { db } from '../firebase.js';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

const STORAGE_KEY_PREFIX = 'warroom_history';

// Per-user scoping: when a user is authenticated the storage key becomes
// warroom_history_{uid}. Before auth resolves we use the bare key so that
// pre-existing anonymous/legacy data can still be read for migration.
let _currentUserId = null;

function storageKey() {
  return _currentUserId
    ? `${STORAGE_KEY_PREFIX}_${_currentUserId}`
    : STORAGE_KEY_PREFIX;
}

/** Call on login — scopes all localStorage reads/writes to this user. */
export function setCurrentUserId(uid) {
  _currentUserId = uid || null;
}

/** Call on logout — resets to anonymous/unscoped key. */
export function clearCurrentUserId() {
  _currentUserId = null;
}

function slugify(name) {
  return 'startup_' + (name || 'unnamed').toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

/**
 * Write a session object to Firestore with structured startup/version schema:
 * 1) startups/{startupId} (parent startup meta)
 * 2) startups/{startupId}/versions/{versionId} (version subcollection)
 * 3) sessions/{sessionId} (flat collection for backwards compatibility)
 */
export async function saveSessionToFirestore(session) {
  if (!db || !session || (!session.sessionId && !session.id)) return;
  const sid = session.sessionId || session.id;
  const startupId = session.startupId || slugify(session.ideaData?.name);

  try {
    // 1) Update parent startup doc
    const startupRef = doc(db, 'startups', startupId);
    await setDoc(startupRef, {
      name: session.ideaData?.name || 'Startup',
      startupId,
      userId: session.userId || null,
      currentVersion: session.versionNumber || 1,
      latestScore: session.overallScore || null,
      verdict: session.verdict || null,
      updatedAt: new Date().toISOString(),
      createdAt: session.createdAt || new Date().toISOString(),
    }, { merge: true });

    // 2) Write to subcollection startups/{startupId}/versions/{versionId}
    const versionRef = doc(db, 'startups', startupId, 'versions', sid);
    await setDoc(versionRef, {
      versionId: sid,
      versionNumber: session.versionNumber || 1,
      createdAt: session.createdAt || new Date().toISOString(),
      basedOnVersion: session.previousVersionId || null,
      startupDetails: session.ideaData || {},
      analysis: session.analysisResult || null,
      events: session.events || [],
      overallScore: session.overallScore || null,
      verdict: session.verdict || null,
      whatChanged: session.whatChanged || [],
      addressedRecommendations: session.addressedRecommendations || [],
      syncedAt: new Date().toISOString(),
    }, { merge: true });

    // 3) Flat sessions collection for legacy queries & backward compatibility
    const sessionRef = doc(db, 'sessions', sid);
    await setDoc(sessionRef, {
      ...session,
      syncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[FIRESTORE SESSION & VERSION SYNC ERROR]', err);
  }
}

/**
 * Fetch sessions from Firestore for authenticated user
 */
export async function fetchUserSessionsFromFirestore(userId) {
  if (!db || !userId) return [];
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  } catch (err) {
    console.warn('[FIRESTORE FETCH SESSIONS ERROR]', err);
    return [];
  }
}

/**
 * Sync all unsynced or local sessions to Firestore for logged in user
 */
export async function syncLocalHistoryToFirestore(userId) {
  if (!db || !userId) return;
  const history = getHistory();
  for (const session of history) {
    // Only sync sessions that already belong to this user (or have no owner).
    // NEVER re-stamp another user's session with the current UID.
    if (session.userId && session.userId !== userId) continue;
    const updated = { ...session, userId, isLegacy: false };
    await saveSessionToFirestore(updated);
  }
}

// Create and initialize a new active session
// userId: the Firebase UID of the authenticated user (null for anonymous/legacy sessions)
export function createSession(ideaData, sharkTankMode = false, userId = null) {
  const history = getHistory();
  const startupId = ideaData?.startupId || slugify(ideaData?.name);
  const previousVersions = history.filter((h) => h.startupId === startupId || (h.ideaData?.name && h.ideaData.name.toLowerCase().trim() === ideaData?.name?.toLowerCase().trim()));
  const previousEntry = previousVersions.find(h => h.id === ideaData?.parentVersionId || h.sessionId === ideaData?.parentVersionId) || previousVersions[0] || null;

  let versionNumber = 1;
  if (ideaData?.targetVersionNumber) {
    versionNumber = ideaData.targetVersionNumber;
  } else if (previousVersions.length > 0) {
    const maxVer = previousVersions.reduce((max, h) => Math.max(max, h.versionNumber || 1), 0);
    versionNumber = maxVer + 1;
  }

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
    localStorage.setItem(storageKey(), JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save session to localStorage:', e);
  }

  // Asynchronously sync to Firestore DB
  saveSessionToFirestore(session);

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
    localStorage.setItem(storageKey(), JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to update session in localStorage:', e);
  }

  // Asynchronously sync to Firestore DB
  saveSessionToFirestore(updated);

  return updated;
}

export function appendSessionEvent(sessionId, event) {
  const history = getHistory();
  const target = history.find((h) => h.id === sessionId || h.sessionId === sessionId);
  if (!target) return null;

  if (!target.events) target.events = [];
  target.events.push(event);

  try {
    localStorage.setItem(storageKey(), JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to append event to localStorage:', e);
  }

  // Asynchronously sync to Firestore DB
  saveSessionToFirestore(target);

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
    const data = localStorage.getItem(storageKey());
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
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
  return history.find((entry) => entry.id === id || entry.sessionId === id) || null;
}

export function updateNotes(id, notes) {
  const history = getHistory();
  const updated = history.map((entry) =>
    entry.id === id ? { ...entry, founderNotes: notes } : entry
  );
  localStorage.setItem(storageKey(), JSON.stringify(updated));
}

export function toggleFavorite(id) {
  const history = getHistory();
  const updated = history.map((entry) =>
    entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
  );
  localStorage.setItem(storageKey(), JSON.stringify(updated));
}

export function deleteVersion(id) {
  const history = getHistory();
  const filtered = history.filter((entry) => entry.id !== id);
  localStorage.setItem(storageKey(), JSON.stringify(filtered));
}

export function clearHistory() {
  localStorage.removeItem(storageKey());
}

/** Wipe the current user's local cache on sign-out. */
export function clearLocalHistory() {
  try {
    localStorage.removeItem(storageKey());
  } catch (e) {
    console.warn('clearLocalHistory failed:', e);
  }
}

export function getLatestVersion() {
  const history = getHistory();
  return history[0] || null;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * One-time migration: sanitise all existing sessions in localStorage.
 * - Converts string overallScore (e.g. "8.4") to a real Number
 * - Sets status = 'INCOMPLETE' on records that have no analysisResult
 * - This is safe to run on every app mount (idempotent)
 */
export function sanitiseHistory() {
  const history = getHistory();
  let changed = false;
  const sanitised = history.map((entry) => {
    let updated = { ...entry };

    // Convert string overallScore → Number
    if (typeof updated.overallScore === 'string') {
      const parsed = parseFloat(updated.overallScore);
      updated.overallScore = isNaN(parsed) ? null : parsed;
      changed = true;
    }

    // Mark sessions that completed but have no real analysis
    if (
      updated.status === 'COMPLETED' &&
      !updated.analysisResult
    ) {
      updated.status = 'INCOMPLETE';
      changed = true;
    }

    // Null out the hardcoded fallback verdict if it's still on old records with no real analysis
    if (
      updated.verdict === 'PROCEED WITH CONDITIONS' &&
      !updated.analysisResult?.verdict &&
      !updated.analysisResult?.recommendation
    ) {
      updated.verdict = null;
      changed = true;
    }

    return updated;
  });

  if (changed) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(sanitised));
    } catch (e) {
      console.warn('sanitiseHistory: failed to write:', e);
    }
  }
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
      localStorage.setItem(storageKey(), JSON.stringify(migrated));
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
    localStorage.setItem(storageKey(), JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to import session:', e);
  }
  return history[idx];
}
