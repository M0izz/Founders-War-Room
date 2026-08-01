import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * ForgotPasswordPage — sends Firebase password reset email.
 * Props:
 *   onBack() — navigate back to login
 */
export default function ForgotPasswordPage({ onBack }) {
  const { sendPasswordReset, authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [sent, setSent] = useState(false);

  const displayError = localError || authError;

  const handleReset = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    if (!email.trim()) { setLocalError('Please enter your email.'); return; }

    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch {
      // Error set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.bgGlow} />

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.starIcon}>✦</div>
          <h1 style={styles.title}>RESET PASSWORD</h1>
          <p style={styles.subtitle}>We'll send you a link to reset your password.</p>
        </div>

        {sent ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <p style={styles.successTitle}>Check your inbox</p>
            <p style={styles.successBody}>
              We sent a reset link to <strong style={{ color: '#e2e8f0' }}>{email}</strong>.
              Check your email and follow the link to set a new password.
            </p>
            <button
              id="btn-back-to-login"
              type="button"
              style={styles.backBtn}
              onClick={onBack}
            >
              ← Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {displayError && (
              <div style={styles.errorBanner} role="alert">
                <span>●</span> {displayError}
              </div>
            )}

            <form onSubmit={handleReset} style={styles.form} noValidate>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="reset-email">EMAIL</label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLocalError(''); clearError(); }}
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <button
                id="btn-send-reset"
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'SENDING…' : 'SEND RESET LINK'}
              </button>
            </form>

            <p style={styles.backText}>
              <button type="button" style={styles.backLink} onClick={onBack}>
                ← Back to Sign In
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(ellipse at 50% 0%, #0d1117 0%, #080c12 100%)',
    position: 'relative', overflow: 'hidden',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", padding: '20px',
  },
  bgGlow: {
    position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px',
    background: 'rgba(13,17,23,0.96)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '40px 36px 32px',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  starIcon: { fontSize: '22px', color: '#3b82f6', marginBottom: '12px', display: 'block' },
  title: { fontSize: '13px', fontWeight: '700', letterSpacing: '0.2em', color: '#e2e8f0', margin: '0 0 8px', textTransform: 'uppercase' },
  subtitle: { fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' },
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
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%', padding: '12px', marginTop: '4px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    border: 'none', borderRadius: '8px', color: '#fff',
    fontSize: '13px', fontWeight: '700', letterSpacing: '0.12em',
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
  },
  backText: { textAlign: 'center', marginTop: '20px' },
  backLink: {
    background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer',
    fontSize: '13px', fontFamily: 'inherit', fontWeight: '500', padding: 0,
  },
  // Success state
  successBox: { textAlign: 'center', padding: '8px 0' },
  successIcon: {
    width: '48px', height: '48px', borderRadius: '50%',
    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px', fontSize: '20px', color: '#22c55e',
  },
  successTitle: { fontSize: '16px', fontWeight: '600', color: '#e2e8f0', margin: '0 0 8px' },
  successBody: { fontSize: '13px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 24px' },
  backBtn: {
    background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#9ca3af', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
    padding: '10px 20px',
  },
};
