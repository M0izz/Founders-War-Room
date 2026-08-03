import { db } from '../firebase.js';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

const STORAGE_KEY = 'warroom_history';

function slugify(name) {
  return 'startup_' + (name || 'unnamed').toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

/**
 * Write a session object to Firestore collection 'sessions'
 */
export async function saveSessionToFirestore(session) {
  if (!db || !session || (!session.sessionId && !session.id)) return;
  const sid = session.sessionId || session.id;
  try {
    const ref = doc(db, 'sessions', sid);
    await setDoc(ref, {
      ...session,
      syncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[FIRESTORE SESSION SYNC ERROR]', err);
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
    const updated = { ...session, userId: session.userId || userId, isLegacy: false };
    await saveSessionToFirestore(updated);
  }
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
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

const DEFAULT_SEED_HISTORY = [
  {
    id: 'vitalink-v6',
    sessionId: 'vitalink-v6',
    startupId: 'startup_vitalink',
    userId: null,
    isLegacy: true,
    createdAt: '2026-07-31T12:00:00.000Z',
    sessionStartedAt: 1785499200000,
    completedAt: '2026-07-31T12:05:00.000Z',
    status: 'COMPLETED',
    versionNumber: 6,
    overallScore: 8.4,
    verdict: 'APPROVED WITH CONDITIONS',
    sharkTankMode: false,
    ideaData: {
      name: 'VITALINK',
      industry: 'HealthTech',
      description: 'QR-code based emergency medical history & allergy access for surgery & emergency care.',
      targetAudience: 'Emergency medical teams & patient families',
      revenueModel: 'Subscription (SaaS)'
    },
    analysisResult: {
      overallScore: 8.4,
      verdict: 'APPROVED WITH CONDITIONS',
      executiveSummary: 'The board believes VITALINK has strong emergency-healthcare potential, but monetization and hospital adoption remain the primary concerns before scaling.',
      strengths: [
        'Strong emergency-use proposition',
        'Clear target customer identified',
        'QR-based workflow is differentiated'
      ],
      weaknesses: [
        'Monetization strategy remains unclear',
        'Hospital onboarding may be difficult',
        'Regulatory considerations need investigation'
      ],
      actionItems: [
        { id: 'act-1', code: '01', title: 'Validate pricing', description: 'Interview 10 hospital administrators', priority: 'HIGH' },
        { id: 'act-2', code: '02', title: 'Test QR workflow', description: 'Run 20 emergency-use simulations', priority: 'HIGH' },
        { id: 'act-3', code: '03', title: 'Research regulatory requirements', description: 'Identify applicable healthcare regulations', priority: 'MEDIUM' }
      ],
      agentResults: [
        { agentName: 'Marcus Vance (CEO)', agentKey: 'ceo', role: 'CEO', score: 8.6, verdict: 'The core proposition is compelling, but hospital partnerships need validation.' },
        { agentName: 'Priya Desai (Investor)', agentKey: 'investor', role: 'INVESTOR', score: 7.1, verdict: 'Revenue model remains insufficiently validated.' },
        { agentName: 'Dr. Aris Thorne (CTO)', agentKey: 'cto', role: 'CTO', score: 8.8, verdict: 'Architecture is solid, but HIPAA compliance & QR encryption need rigorous audit.' },
        { agentName: 'Elena Rostova (CMO)', agentKey: 'marketing', role: 'MARKETING', score: 7.8, verdict: 'B2C messaging resonates, but B2B hospital sales cycle is long.' },
        { agentName: 'Samir Khan (Customer)', agentKey: 'customer', role: 'CUSTOMER', score: 9.0, verdict: 'Emergency doctors love immediate QR scanning without logins.' },
        { agentName: 'Dr. Quinn Hayes (Risk)', agentKey: 'risk', role: 'RISK ADVISOR', score: 6.9, verdict: 'Data privacy liability in trauma cases requires legal coverage.' },
        { agentName: 'Grim Reaper', agentKey: 'reaper', role: 'DEVIL\'S ADVOCATE', score: 6.5, verdict: 'If hospitals refuse API integration, this model dies in 6 months.' },
        { agentName: 'Board Chair', agentKey: 'chairman', role: 'CHAIRMAN', score: 8.4, verdict: 'Promising foundation. Proceed with strict hospital pilot criteria.' }
      ]
    }
  },
  {
    id: 'medora-v4',
    sessionId: 'medora-v4',
    startupId: 'startup_medora',
    userId: null,
    isLegacy: true,
    createdAt: '2026-07-28T10:00:00.000Z',
    sessionStartedAt: 1785235200000,
    completedAt: '2026-07-28T10:05:00.000Z',
    status: 'COMPLETED',
    versionNumber: 4,
    overallScore: 7.9,
    verdict: 'APPROVED WITH CONDITIONS',
    sharkTankMode: false,
    ideaData: {
      name: 'MEDORA',
      industry: 'HealthTech',
      description: 'AI-driven diagnostic laboratory framework for blood analysis and diagnostic accuracy.',
      targetAudience: 'Private clinics & diagnostic labs',
      revenueModel: 'Monthly subscription ($499/mo)'
    },
    analysisResult: {
      overallScore: 7.9,
      verdict: 'APPROVED WITH CONDITIONS',
      executiveSummary: 'Medora presents an AI-driven blood diagnostic framework with strong initial laboratory trial scores.',
      strengths: [
        'Proprietary AI diagnostic accuracy',
        '94% diagnostic accuracy achieved in clinical trials',
        'Strong pilot engagement with 5 private clinics'
      ],
      weaknesses: [
        'FDA clinical trial timeline is 18 months',
        'Regulatory clearance still pending'
      ],
      actionItems: [
        { id: 'act-med-1', code: '01', title: 'Engage FDA consultant', description: 'Map Class II medical device approval pathway', priority: 'HIGH' },
        { id: 'act-med-2', code: '02', title: 'Expand Clinic Pilots', description: 'Onboard 5 additional diagnostic labs', priority: 'MEDIUM' }
      ],
      agentResults: [
        { agentName: 'Marcus Vance (CEO)', agentKey: 'ceo', role: 'CEO', score: 8.2, verdict: 'Clinical pilot traction is encouraging.' },
        { agentName: 'Priya Desai (Investor)', agentKey: 'investor', role: 'INVESTOR', score: 7.5, verdict: 'SaaS pricing validated, but capital requirement for FDA trial is high.' },
        { agentName: 'Dr. Aris Thorne (CTO)', agentKey: 'cto', role: 'CTO', score: 8.5, verdict: 'Diagnostic AI algorithm achieves >94% precision on test datasets.' },
        { agentName: 'Elena Rostova (CMO)', agentKey: 'marketing', role: 'MARKETING', score: 7.9, verdict: 'Diagnostic accuracy data is compelling for private clinic sales reps.' },
        { agentName: 'Samir Khan (Customer)', agentKey: 'customer', role: 'CUSTOMER', score: 8.4, verdict: 'Pathologists report significant time reduction per diagnostic scan.' },
        { agentName: 'Dr. Quinn Hayes (Risk)', agentKey: 'risk', role: 'RISK ADVISOR', score: 7.0, verdict: 'Class II medical device classification carries liability risks.' },
        { agentName: 'Grim Reaper', agentKey: 'reaper', role: 'DEVIL\'S ADVOCATE', score: 6.8, verdict: 'FDA approval delays could exhaust runway before commercialization.' },
        { agentName: 'Board Chair', agentKey: 'chairman', role: 'CHAIRMAN', score: 7.9, verdict: 'Medora presents an AI-driven blood diagnostic framework with strong trial scores.' }
      ]
    }
  }
];

export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    if (!parsed || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_HISTORY));
      return DEFAULT_SEED_HISTORY;
    }
    return parsed;
  } catch {
    return DEFAULT_SEED_HISTORY;
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitised));
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
