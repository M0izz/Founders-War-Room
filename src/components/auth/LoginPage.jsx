import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

// ── Google Icon SVG ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

// ── Eye icons ─────────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/**
 * LoginPage — dark executive auth screen.
 * Props:
 *   onSuccess(user)  — called after successful sign-in
 *   onSignup()       — navigate to signup page
 *   onForgotPassword() — navigate to forgot password page
 */
export default function LoginPage({ onSuccess, onSignup, onForgotPassword }) {
  const { signInWithGoogle, signInWithEmail, authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const displayError = localError || authError;

  const [redirecting, setRedirecting] = useState(false);

  const handleGoogleSignIn = async () => {
    clearError();
    setLocalError('');
    setLoading(true);
    setRedirecting(true);
    try {
      await signInWithGoogle();
      // signInWithGoogle triggers a page redirect — execution stops here.
      // If it returns (e.g. error before redirect), reset loading.
    } catch {
      setLoading(false);
      setRedirecting(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    if (!email.trim()) { setLocalError('Please enter your email.'); return; }
    if (!password) { setLocalError('Please enter your password.'); return; }
    setLoading(true);
    try {
      const user = await signInWithEmail(email.trim(), password);
      onSuccess(user);
    } catch {
      // Error set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      {/* Ambient background particles */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <div style={styles.card}>
        {/* Logo / Header */}
        <div style={styles.header}>
          <div style={styles.starIcon}>✦</div>
          <h1 style={styles.title}>FOUNDER'S WAR ROOM</h1>
          <p style={styles.subtitle}>Executive Access</p>
          <p style={styles.tagline}>Your AI board is waiting.</p>
        </div>

        {/* Error banner */}
        {displayError && (
          <div style={styles.errorBanner} role="alert">
            <span style={styles.errorDot}>●</span>
            {displayError}
          </div>
        )}

        {/* Google Sign-In */}
        <button
          id="btn-google-signin"
          style={{ ...styles.googleBtn, opacity: (loading || redirecting) ? 0.6 : 1 }}
          onClick={handleGoogleSignIn}
          disabled={loading || redirecting}
        >
          <GoogleIcon />
          {redirecting ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>

        {/* OR divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleEmailSignIn} style={styles.form} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="login-email">EMAIL</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLocalError(''); clearError(); }}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="login-password">PASSWORD</label>
            <div style={styles.passwordWrap}>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLocalError(''); clearError(); }}
                style={{ ...styles.input, paddingRight: '44px' }}
                disabled={loading}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPwd((p) => !p)}
                tabIndex={-1}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPwd} />
              </button>
            </div>
          </div>

          <button
            type="button"
            style={styles.forgotLink}
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>

          <button
            id="btn-enter-war-room"
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'SIGNING IN…' : 'ENTER WAR ROOM'}
          </button>
        </form>

        {/* Signup link */}
        <p style={styles.signupText}>
          New founder?{' '}
          <button type="button" style={styles.signupLink} onClick={onSignup}>
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  overlay: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 50% 0%, #0d1117 0%, #080c12 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    padding: '20px',
  },
  bgGlow1: {
    position: 'absolute',
    top: '-200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '-200px',
    right: '-100px',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(13,17,23,0.96)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '40px 36px 32px',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  starIcon: {
    fontSize: '22px',
    color: '#3b82f6',
    marginBottom: '12px',
    display: 'block',
    letterSpacing: '0',
  },
  title: {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.2em',
    color: '#e2e8f0',
    margin: '0 0 6px',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '11px',
    letterSpacing: '0.12em',
    color: '#4b5563',
    margin: '0 0 8px',
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    fontStyle: 'italic',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#f87171',
  },
  errorDot: {
    fontSize: '8px',
    flexShrink: 0,
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '11px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
  },
  dividerText: {
    fontSize: '11px',
    color: '#374151',
    letterSpacing: '0.1em',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.15em',
    color: '#4b5563',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  passwordWrap: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
  },
  forgotLink: {
    background: 'none',
    border: 'none',
    color: '#4b5563',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'right',
    padding: '0',
    marginBottom: '20px',
    fontFamily: 'inherit',
    transition: 'color 0.2s',
    alignSelf: 'flex-end',
    display: 'block',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.12em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
  },
  signupText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '13px',
    color: '#4b5563',
  },
  signupLink: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit',
    fontWeight: '500',
    padding: 0,
  },
};
