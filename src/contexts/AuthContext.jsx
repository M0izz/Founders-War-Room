import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';

const AuthContext = createContext(null);

/**
 * AuthProvider — provides centralized Firebase Auth state & methods.
 * Ensures an explicit loading state until Firebase resolves onAuthStateChanged.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Single authoritative listener for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  /** Sign in with Google popup */
  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setAuthError(formatAuthError(err));
      }
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

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
    'auth/argument-error':          'Invalid configuration parameter.',
  };
  return map[code] || err?.message || 'An unexpected error occurred.';
}
