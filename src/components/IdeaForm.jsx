import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

const INDUSTRIES = [
  'AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'E-Commerce',
  'SaaS', 'Marketplace', 'Social', 'Gaming', 'CleanTech', 'Other'
];

const REVENUE_MODELS = [
  'SaaS Subscription', 'Marketplace Commission', 'Freemium',
  'Advertising', 'Transaction Fees', 'License', 'Usage-Based', 'Other'
];

export default function IdeaForm({ onSubmit, onBack, initialData, error }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    targetAudience: initialData?.targetAudience || '',
    industry: initialData?.industry || '',
    revenueModel: initialData?.revenueModel || '',
    additionalContext: initialData?.additionalContext || '',
  });
  const [sharkTank, setSharkTank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;
    setIsSubmitting(true);
    await onSubmit(formData, sharkTank);
    setIsSubmitting(false);
  };

  const isValid = formData.name.trim() && formData.description.trim();

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <div className="landing-eyebrow" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <AppIcon emoji="📋" size={16} /> Idea Submission
          </div>
          <h1 className="title-xl">Describe Your Startup</h1>
          <p className="text-lg" style={{ marginTop: 'var(--space-sm)' }}>
            Tell us about your startup idea. The more detail, the better the board analysis.
          </p>
        </div>

        {error && (
          <div className="glass-card animate-fade-in" style={{
            marginBottom: 'var(--space-lg)',
            borderColor: 'rgba(220, 38, 38, 0.3)',
            background: 'rgba(220, 38, 38, 0.08)',
          }}>
            <p style={{ color: 'var(--danger-hover)', fontSize: 'var(--font-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AppIcon emoji="⚠️" size={16} /> {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card-lg">
          <div className="form-grid">
            {/* Startup Name */}
            <div className="form-group">
              <label className="form-label">Startup Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g., NeuraLink Health"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe your startup in detail. What problem does it solve? How does it work? What makes it unique?"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                style={{ minHeight: '160px' }}
              />
              <span className="form-hint">Be as detailed as possible for better board analysis</span>
            </div>

            {/* Industry & Revenue Model Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select
                  name="industry"
                  className="form-select"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Revenue Model</label>
                <select
                  name="revenueModel"
                  className="form-select"
                  value={formData.revenueModel}
                  onChange={handleChange}
                >
                  <option value="">Select Revenue Model</option>
                  {REVENUE_MODELS.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Audience */}
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <input
                type="text"
                name="targetAudience"
                className="form-input"
                placeholder="e.g., Small business owners aged 25-45"
                value={formData.targetAudience}
                onChange={handleChange}
              />
            </div>

            {/* Extra Context */}
            <div className="form-group">
              <label className="form-label">Extra Context <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
              <textarea
                name="additionalContext"
                className="form-textarea"
                placeholder="Any extra context: team background, traction, funding stage, competitors, etc."
                value={formData.additionalContext}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Shark Tank Toggle */}
            <div className={`shark-toggle-section ${sharkTank ? 'active' : ''}`}>
              <div className="toggle-wrapper" onClick={() => setSharkTank(!sharkTank)}>
                <div className={`toggle-track ${sharkTank ? 'active' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: sharkTank ? 'var(--warning)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AppIcon emoji="🦈" size={18} /> Shark Tank Mode
                </div>
                <div className="text-sm" style={{ marginTop: '2px' }}>
                  Enable brutal honesty. No sugar-coating, maximum scrutiny.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              ← Back
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-glow"
              disabled={!isValid || isSubmitting}
              style={{ opacity: isValid && !isSubmitting ? 1 : 0.5, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {isSubmitting ? (
                <>
                  <AppIcon emoji="⚡" size={16} className="animate-spin" />
                  Initializing War Room...
                </>
              ) : (
                <>
                  <AppIcon emoji="🏛️" size={18} /> Convene the Board
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
