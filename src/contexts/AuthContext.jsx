import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides auth state + actions.
 *
 * Google Sign-In uses signInWithRedirect (not popup) to avoid the
 * Firebase "Database is closing/hidden" IndexedDB error that appears
 * when the popup closes before auth state can be persisted.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Ensure auth persistence is set to localStorage (not session)
    setPersistence(auth, browserLocalPersistence).catch(() => {});

    // Handle redirect result first (Google sign-in redirect flow)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        // Ignore cancelled-popup or redirect errors silently;
        // only surface real errors
        const silent = [
          'auth/popup-closed-by-user',
          'auth/cancelled-popup-request',
          'auth/redirect-cancelled-by-user',
        ];
        if (!silent.includes(err?.code)) {
          setAuthError(formatAuthError(err));
        }
      });

    // Then subscribe to ongoing auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  /**
   * Sign in with Google — uses redirect (more reliable than popup).
   * After redirect back to the app, getRedirectResult() above handles the result.
   */
  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      // signInWithRedirect navigates away; the result is handled on return via getRedirectResult
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      setAuthError(formatAuthError(err));
      throw err;
    }
  }, []);

  /** Sign in with email + password */
  const signInWithEmail = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setAuthError(formatAuthError(err));
      throw err;
    }
  }, []);

  /** Create new account with email + password, then set displayName */
  const signUpWithEmail = useCallback(async (name, email, password) => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(result.user, { displayName: name });
        setUser({ ...result.user, displayName: name });
      }
      return result.user;
    } catch (err) {
      setAuthError(formatAuthError(err));
      throw err;
    }
  }, []);

  /** Send password reset email */
  const sendPasswordReset = useCallback(async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setAuthError(formatAuthError(err));
      throw err;
    }
  }, []);

  /** Sign out */
  const signOut = useCallback(async () => {
    setAuthError(null);
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      clearError,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      sendPasswordReset,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook — call inside any component inside AuthProvider */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// ── Readable Firebase error messages ─────────────────────────────────────────
function formatAuthError(err) {
  const code = err?.code || '';
  const map = {
    'auth/user-not-found':          'No account found with that email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Invalid email or password.',
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/too-many-requests':       'Too many attempts. Please wait a moment and try again.',
    'auth/popup-closed-by-user':    'Google sign-in was cancelled.',
    'auth/network-request-failed':  'Network error. Check your connection.',
    'auth/cancelled-popup-request': 'Another sign-in is already in progress.',
    'auth/internal-error':          'Firebase internal error. Please try again.',
  };
  return map[code] || err?.message || 'An unexpected error occurred.';
}
