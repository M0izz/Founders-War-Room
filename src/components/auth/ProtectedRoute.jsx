import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * ProtectedRoute — guards authenticated-only views.
 *
 * Props:
 *   onRedirect()  — called when user is not authenticated; parent navigates to login
 *   children      — content to render when authenticated
 */
export default function ProtectedRoute({ children, onRedirect }) {
  const { user, loading } = useAuth();

  // Auth state still resolving — show a minimal centred spinner
  // This prevents a flash of the login page on refresh when already authenticated
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
      </div>
    );
  }

  // Not authenticated — call parent's redirect handler
  if (!user) {
    // Use effect-free redirect: schedule on next tick so React doesn't warn about state-in-render
    setTimeout(() => onRedirect(), 0);
    return null;
  }

  return children;
}

const styles = {
  loadingWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#080c12',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '2px solid rgba(255,255,255,0.06)',
    borderTop: '2px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
