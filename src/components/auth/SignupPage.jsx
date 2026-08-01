import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

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
 * SignupPage — create a new Founders War Room account.
 * Props:
 *   onSuccess(user) — called after successful signup
 *   onLogin()       — navigate back to login
 */
export default function SignupPage({ onSuccess, onLogin }) {
  const { signUpWithEmail, authError, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const displayError = localError || authError;

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (!name.trim())           { setLocalError('Please enter your name.'); return; }
    if (!email.trim())          { setLocalError('Please enter your email.'); return; }
    if (password.length < 6)    { setLocalError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const user = await signUpWithEmail(name.trim(), email.trim(), password);
      onSuccess(user);
    } catch {
      // Error set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const fieldChange = (setter) => (e) => {
    setter(e.target.value);
    setLocalError('');
    clearError();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.starIcon}>✦</div>
          <h1 style={styles.title}>CREATE ACCOUNT</h1>
          <p style={styles.subtitle}>Join the Executive Board</p>
        </div>

        {displayError && (
          <div style={styles.errorBanner} role="alert">
            <span>●</span> {displayError}
          </div>
        )}

        <form onSubmit={handleSignup} style={styles.form} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="signup-name">YOUR NAME</label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Moiz Khan"
              value={name}
              onChange={fieldChange(setName)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="signup-email">EMAIL</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={fieldChange(setEmail)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="signup-password">PASSWORD</label>
            <div style={styles.passwordWrap}>
              <input
                id="signup-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={fieldChange(setPassword)}
                style={{ ...styles.input, paddingRight: '44px' }}
                disabled={loading}
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPwd(p => !p)} tabIndex={-1}>
                <EyeIcon open={showPwd} />
              </button>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="signup-confirm-password">CONFIRM PASSWORD</label>
            <div style={styles.passwordWrap}>
              <input
                id="signup-confirm-password"
                type={showConfirmPwd ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={fieldChange(setConfirmPassword)}
                style={{ ...styles.input, paddingRight: '44px' }}
                disabled={loading}
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowConfirmPwd(p => !p)} tabIndex={-1}>
                <EyeIcon open={showConfirmPwd} />
              </button>
            </div>
          </div>

          <button
            id="btn-create-account"
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p style={styles.loginText}>
          Already a founder?{' '}
          <button type="button" style={styles.loginLink} onClick={onLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

const base = {
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
    position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute', bottom: '-200px', right: '-100px',
    width: '400px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px',
    background: 'rgba(13,17,23,0.96)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '40px 36px 32px',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  starIcon: { fontSize: '22px', color: '#3b82f6', marginBottom: '12px', display: 'block' },
  title: { fontSize: '13px', fontWeight: '700', letterSpacing: '0.2em', color: '#e2e8f0', margin: '0 0 6px', textTransform: 'uppercase' },
  subtitle: { fontSize: '11px', letterSpacing: '0.12em', color: '#4b5563', margin: 0, textTransform: 'uppercase' },
  errorBanner: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
    fontSize: '13px', color: '#f87171',
  },
  form: { display: 'flex', flexDirection: 'column' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' },
  input: {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', color: '#e2e8f0', fontSize: '14px',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s',
  },
  passwordWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center',
  },
  submitBtn: {
    width: '100%', padding: '12px', marginTop: '4px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    border: 'none', borderRadius: '8px', color: '#fff',
    fontSize: '13px', fontWeight: '700', letterSpacing: '0.12em',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
  },
  loginText: { textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#4b5563' },
  loginLink: {
    background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer',
    fontSize: '13px', fontFamily: 'inherit', fontWeight: '500', padding: 0,
  },
};
const styles = base;
