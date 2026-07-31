import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

const INDUSTRIES = [
  'HealthTech', 'FinTech', 'FoodTech', 'EdTech', 'AI / SaaS',
  'E-Commerce', 'Marketplace', 'Social Media', 'CleanTech', 'Gaming', 'Other'
];

const TARGET_USERS = [
  'Consumers (B2C)', 'Small Businesses (SMB)', 'Enterprise Companies (B2B)',
  'Doctors / Healthcare Professionals', 'Developers & Engineers', 'Students & Educators'
];

const REVENUE_MODELS = [
  'Subscription (SaaS)', 'Marketplace Commission', 'Freemium Tier',
  'Usage-Based API Pricing', 'Advertising & Data', 'Enterprise Licensing'
];

const DEMO_PRESETS = [
  {
    label: 'Food Delivery AI',
    iconName: 'food',
    name: 'FoodAI Direct',
    description: 'An autonomous AI kitchen operator that predicts food demand, orders ingredients from local farms, and cooks meals in 5 minutes.',
    industry: 'FoodTech',
    targetAudience: 'Busy urban professionals & college students',
    revenueModel: 'Subscription (SaaS)',
  },
  {
    label: 'FinTech Engine',
    iconName: 'investor',
    name: 'VaultPulse',
    description: 'An AI financial co-pilot that scans corporate bank accounts, predicts cash runway bottlenecks 90 days ahead, and auto-negotiates vendor bills.',
    industry: 'FinTech',
    targetAudience: 'Small Businesses (SMB)',
    revenueModel: 'Subscription (SaaS)',
  },
  {
    label: 'VITALINK Medical',
    iconName: 'heart',
    name: 'VITALINK',
    description: 'An emergency QR code scanner app that gives ER doctors instant access to a patient’s verified medical history, allergies, and prescriptions.',
    industry: 'HealthTech',
    targetAudience: 'Doctors / Healthcare Professionals',
    revenueModel: 'Enterprise Licensing',
  },
  {
    label: 'Social Media AI',
    iconName: 'marketing',
    name: 'VibeDraft',
    description: 'An autonomous viral video generator that turns audio voice notes into fully edited TikToks & Reels with AI avatars and auto-captions.',
    industry: 'Social Media',
    targetAudience: 'Consumers (B2C)',
    revenueModel: 'Freemium Tier',
  },
];

export default function IdeaForm({ onSubmit, onBack, initialData, error }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    targetAudience: initialData?.targetAudience || '',
    industry: initialData?.industry || 'HealthTech',
    revenueModel: initialData?.revenueModel || 'Subscription (SaaS)',
    additionalContext: initialData?.additionalContext || '',
  });
  const [sharkTank, setSharkTank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyPreset = (preset) => {
    setFormData({
      name: preset.name,
      description: preset.description,
      industry: preset.industry,
      targetAudience: preset.targetAudience,
      revenueModel: preset.revenueModel,
      additionalContext: 'Demo mode automated run',
    });
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
    <div className="notion-form-page">
      <div className="notion-form-wrapper">
        
        {/* Top Header */}
        <div className="notion-header-group">
          <div className="notion-eyebrow">
            <AppIcon name="ceo" size={16} color="#60a5fa" />
            <span>EXECUTIVE BRIEFING</span>
          </div>
          <h1 className="notion-greeting-title">Good Evening, Founder.</h1>
          <p className="notion-greeting-sub">What are we building today?</p>

          {/* Quick Demo Mode Presets */}
          <div className="demo-mode-bar">
            <span className="demo-bar-label">⚡ Demo Presets:</span>
            {DEMO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="demo-preset-btn"
                onClick={() => applyPreset(preset)}
              >
                <AppIcon name={preset.iconName} size={14} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="form-error-banner">
            <AppIcon name="warning" size={16} color="#f87171" />
            <span>{error}</span>
          </div>
        )}

        {/* Conversational Notion Form */}
        <form onSubmit={handleSubmit} className="notion-card-form">
          
          {/* Startup Name */}
          <div className="notion-field-group">
            <label className="notion-label">Startup Name</label>
            <input
              type="text"
              name="name"
              className="notion-input-lg"
              placeholder="e.g. VITALINK"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Vision Description */}
          <div className="notion-field-group">
            <label className="notion-label">Describe your vision...</label>
            <textarea
              name="description"
              className="notion-textarea"
              placeholder="An app that gives ER doctors instant access to a patient's medical history, allergies, and diagnosis by scanning a QR code..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          {/* Select Row: Industry, Target Users, Revenue Model */}
          <div className="notion-select-row">
            
            <div className="notion-select-group">
              <label className="notion-label-sm">Industry</label>
              <div className="notion-select-wrapper">
                <select
                  name="industry"
                  className="notion-select"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <AppIcon name="chevron" size={14} className="select-chevron" />
              </div>
            </div>

            <div className="notion-select-group">
              <label className="notion-label-sm">Target Users</label>
              <div className="notion-select-wrapper">
                <select
                  name="targetAudience"
                  className="notion-select"
                  value={formData.targetAudience}
                  onChange={handleChange}
                >
                  <option value="">Select Target Users</option>
                  {TARGET_USERS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <AppIcon name="chevron" size={14} className="select-chevron" />
              </div>
            </div>

            <div className="notion-select-group">
              <label className="notion-label-sm">Revenue Model</label>
              <div className="notion-select-wrapper">
                <select
                  name="revenueModel"
                  className="notion-select"
                  value={formData.revenueModel}
                  onChange={handleChange}
                >
                  {REVENUE_MODELS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <AppIcon name="chevron" size={14} className="select-chevron" />
              </div>
            </div>

          </div>

          {/* Extra Context */}
          <div className="notion-field-group">
            <label className="notion-label-sm">Extra Context (Optional)</label>
            <input
              type="text"
              name="additionalContext"
              className="notion-input-sm"
              placeholder="e.g. Pre-seed stage, 2 co-founders with medical experience..."
              value={formData.additionalContext}
              onChange={handleChange}
            />
          </div>

          {/* Brutal Scrutiny / Shark Tank Mode */}
          <div className={`notion-toggle-row ${sharkTank ? 'active' : ''}`} onClick={() => setSharkTank(!sharkTank)}>
            <div className="toggle-info">
              <span className="toggle-heading">Shark Tank Mode (Brutal Scrutiny)</span>
              <span className="toggle-sub">Enable aggressive cross-examination & zero mercy from Grim Reaper</span>
            </div>
            <div className={`notion-toggle-switch ${sharkTank ? 'on' : ''}`}>
              <div className="toggle-knob" />
            </div>
          </div>

          {/* Form Actions */}
          <div className="notion-actions-row">
            <button type="button" className="notion-btn-back" onClick={onBack}>
              ← Back to Dashboard
            </button>

            <button
              type="submit"
              className="notion-btn-submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <AppIcon name="zap" size={18} className="animate-spin" />
                  <span>INITIALIZING WAR ROOM...</span>
                </>
              ) : (
                <>
                  <AppIcon name="ceo" size={18} color="#000" />
                  <span>Convene Board</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
