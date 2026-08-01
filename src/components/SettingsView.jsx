import React, { useState } from 'react';
import AppIcon from './AppIcon.jsx';

const TRANSLATIONS = {
  English: {
    settingsTitle: "Settings",
    settingsSub: "Customize your experience and manage your preferences.",
    searchPlaceholder: "Search settings (e.g. Models, Privacy, Theme, Slack, Password)...",
    generalPref: "General Preferences",
    missionPrivacy: "Default Mission Privacy",
    missionPrivacyDesc: "Choose privacy for new missions",
    autoSave: "Auto-Save Missions",
    autoSaveDesc: "Automatically save your progress",
    confirmDelete: "Confirm Before Deleting",
    confirmDeleteDesc: "Show confirmation before deleting",
    defaultLang: "Default Language",
    defaultLangDesc: "Select your preferred language",
    meetingAnalysis: "Meeting & Analysis",
    meetingLength: "Default Meeting Length",
    meetingLengthDesc: "Estimated time for board meetings",
    responseDepth: "AI Response Depth",
    responseDepthDesc: "Control response detail level",
    enableDebate: "Enable Debate Mode",
    enableDebateDesc: "Allow members to challenge each other",
    includeSources: "Include Data Sources",
    includeSourcesDesc: "Show data sources in reports",
    advancedOptions: "Advanced Options",
    betaFeatures: "Beta Features",
    betaFeaturesDesc: "Try experimental features",
    boardRoster: "Board Roster Toggles",
    debateDynamics: "Debate Dynamics",
    debateAggressiveness: "Debate Aggressiveness",
    debateAggressivenessDesc: "Tone & pushback strictness",
    interruptionRate: "Interruption Rate",
    interruptionRateDesc: "Cross-examination frequency",
    themeVisuals: "Theme & Visuals",
    interfaceTheme: "Interface Theme",
    accentColor: "Accent Color",
    vfxTypography: "VFX & Typography",
    glowEffects: "Glow Effects",
    fontScale: "Font Scale",
    emailNotifications: "Email Notifications",
    weeklyDigest: "Weekly War Room Digest",
    riskWarnings: "Critical Risk Warnings",
    audioWebhooks: "Audio & Webhooks",
    soundEffects: "Sound Effects",
    slackWebhook: "Slack Webhook",
    dataStorage: "Data & Storage",
    exportQuality: "Export Quality",
    autoArchive: "Auto-Archive Old Missions",
    privacySecurity: "Privacy & Security",
    localEncryption: "Local Encryption",
    zeroRetention: "Zero-Data Retention",
    dangerZone: "Danger Zone",
    clearCache: "Clear Cache",
    resetPref: "Reset Preferences",
    yourProfile: "Your Profile",
    editProfile: "Edit Profile",
    freePlan: "Free Plan",
    managePlan: "Manage Plan",
    about: "About",
    appVersion: "App Version",
    lastUpdated: "Last Updated",
    status: "Status",
    checkUpdates: "Check for Updates",
  },
  Spanish: {
    settingsTitle: "Configuración",
    settingsSub: "Personaliza tu experiencia y gestiona tus preferencias.",
    searchPlaceholder: "Buscar opciones (p. ej. Modelos, Privacidad, Tema, Contraseña)...",
    generalPref: "Preferencias Generales",
    missionPrivacy: "Privacidad por Defecto",
    missionPrivacyDesc: "Elige la privacidad para nuevas misiones",
    autoSave: "Guardado Automático",
    autoSaveDesc: "Guarda automáticamente tu progreso",
    confirmDelete: "Confirmar Antes de Eliminar",
    confirmDeleteDesc: "Muestra confirmación antes de borrar",
    defaultLang: "Idioma Predeterminado",
    defaultLangDesc: "Selecciona tu idioma preferido",
    meetingAnalysis: "Reunión y Análisis",
    meetingLength: "Duración de Reunión",
    meetingLengthDesc: "Tiempo estimado para las reuniones",
    responseDepth: "Profundidad de Respuesta IA",
    responseDepthDesc: "Controla el nivel de detalle",
    enableDebate: "Activar Modo Debate",
    enableDebateDesc: "Permite que los miembros debatan",
    includeSources: "Incluir Fuentes de Datos",
    includeSourcesDesc: "Muestra fuentes en los informes",
    advancedOptions: "Opciones Avanzadas",
    betaFeatures: "Funciones Beta",
    betaFeaturesDesc: "Prueba funciones experimentales",
    boardRoster: "Miembros del Consejo",
    debateDynamics: "Dinámica de Debate",
    debateAggressiveness: "Nivel de Agresividad",
    debateAggressivenessDesc: "Fricción y tono de desacuerdo",
    interruptionRate: "Frecuencia de Interrupción",
    interruptionRateDesc: "Frecuencia de contra-interrogatorio",
    themeVisuals: "Tema y Estilo Visual",
    interfaceTheme: "Tema de Interfaz",
    accentColor: "Color de Acento",
    vfxTypography: "Efectos y Tipografía",
    glowEffects: "Efectos de Resplandor",
    fontScale: "Escala de Fuente",
    emailNotifications: "Notificaciones por Correo",
    weeklyDigest: "Resumen Semanal de War Room",
    riskWarnings: "Alertas de Riesgo Crítico",
    audioWebhooks: "Audio y Webhooks",
    soundEffects: "Efectos de Sonido",
    slackWebhook: "Webhook de Slack",
    dataStorage: "Datos y Almacenamiento",
    exportQuality: "Calidad de Exportación",
    autoArchive: "Archivar Misiones Antiguas",
    privacySecurity: "Privacidad y Seguridad",
    localEncryption: "Encriptación Local",
    zeroRetention: "Retención Cero de Datos",
    dangerZone: "Zona de Peligro",
    clearCache: "Borrar Caché",
    resetPref: "Restablecer Preferencias",
    yourProfile: "Tu Perfil",
    editProfile: "Editar Perfil",
    freePlan: "Plan Gratuito",
    managePlan: "Gestionar Plan",
    about: "Acerca de",
    appVersion: "Versión de App",
    lastUpdated: "Última Actualización",
    status: "Estado",
    checkUpdates: "Buscar Actualizaciones",
  },
  German: {
    settingsTitle: "Einstellungen",
    settingsSub: "Passen Sie Ihre Erfahrung an und verwalten Sie Ihre Einstellungen.",
    searchPlaceholder: "Einstellungen suchen (z.B. Modelle, Datenschutz, Theme)...",
    generalPref: "Allgemeine Einstellungen",
    missionPrivacy: "Standard-Datenschutz",
    missionPrivacyDesc: "Datenschutz für neue Missionen wählen",
    autoSave: "Automatisch speichern",
    autoSaveDesc: "Speichert Ihren Fortschritt automatisch",
    confirmDelete: "Vor dem Löschen bestätigen",
    confirmDeleteDesc: "Bestätigung vor dem Löschen anzeigen",
    defaultLang: "Standardsprache",
    defaultLangDesc: "Wählen Sie Ihre bevorzugte Sprache",
    meetingAnalysis: "Sitzung & Analyse",
    meetingLength: "Standard-Sitzungsdauer",
    meetingLengthDesc: "Geschätzte Zeit für Vorstandssitzungen",
    responseDepth: "KI-Antworttiefe",
    responseDepthDesc: "Detailgenauigkeit der KI steuern",
    enableDebate: "Debattenmodus aktivieren",
    enableDebateDesc: "Mitgliedern Herausforderungen ermöglichen",
    includeSources: "Datenquellen einbeziehen",
    includeSourcesDesc: "Quellen in Berichten anzeigen",
    advancedOptions: "Erweiterte Optionen",
    betaFeatures: "Beta-Funktionen",
    betaFeaturesDesc: "Experimentelle Funktionen testen",
    boardRoster: "Vorstandsmitglieder",
    debateDynamics: "Debattendynamik",
    debateAggressiveness: "Debatten-Aggressivität",
    debateAggressivenessDesc: "Ton & Strenge der Einwände",
    interruptionRate: "Unterbrechungsrate",
    interruptionRateDesc: "Häufigkeit des Kreuzverhörs",
    themeVisuals: "Design & Visuelles",
    interfaceTheme: "Benutzeroberfläche-Design",
    accentColor: "Akzentfarbe",
    vfxTypography: "VFX & Typografie",
    glowEffects: "Leuchteffekte",
    fontScale: "Schriftgröße",
    emailNotifications: "E-Mail-Benachrichtigungen",
    weeklyDigest: "Wöchentlicher Vorstandsbericht",
    riskWarnings: "Kritische Risikowarnungen",
    audioWebhooks: "Audio & Webhooks",
    soundEffects: "Soundeffekte",
    slackWebhook: "Slack Webhook",
    dataStorage: "Daten & Speicher",
    exportQuality: "Exportqualität",
    autoArchive: "Alte Missionen archivieren",
    privacySecurity: "Datenschutz & Sicherheit",
    localEncryption: "Lokale Verschlüsselung",
    zeroRetention: "Keine Datenspeicherung",
    dangerZone: "Gefahrenzone",
    clearCache: "Cache leeren",
    resetPref: "Einstellungen zurücksetzen",
    yourProfile: "Ihr Profil",
    editProfile: "Profil bearbeiten",
    freePlan: "Kostenloser Tarif",
    managePlan: "Tarif verwalten",
    about: "Über uns",
    appVersion: "App-Version",
    lastUpdated: "Zuletzt aktualisiert",
    status: "Status",
    checkUpdates: "Auf Updates prüfen",
  },
  French: {
    settingsTitle: "Paramètres",
    settingsSub: "Personnalisez votre expérience et gérez vos préférences.",
    searchPlaceholder: "Rechercher des paramètres (ex. Modèles, Confidentialité)...",
    generalPref: "Préférences Générales",
    missionPrivacy: "Confidentialité par Défaut",
    missionPrivacyDesc: "Choisir la confidentialité des misiones",
    autoSave: "Sauvegarde Automatique",
    autoSaveDesc: "Sauvegarde automatiquement vos progrès",
    confirmDelete: "Confirmer Avant de Supprimer",
    confirmDeleteDesc: "Afficher confirmation avant suppression",
    defaultLang: "Langue par Défaut",
    defaultLangDesc: "Sélectionnez votre langue préférée",
    meetingAnalysis: "Réunion et Analyse",
    meetingLength: "Durée de Réunion par Défaut",
    meetingLengthDesc: "Temps estimé des réunions",
    responseDepth: "Profondeur de Réponse IA",
    responseDepthDesc: "Contrôler le niveau de détail",
    enableDebate: "Activer le Mode Débat",
    enableDebateDesc: "Permettre aux membres de débattre",
    includeSources: "Inclure les Sources de Données",
    includeSourcesDesc: "Afficher les sources dans les rapports",
    advancedOptions: "Options Avancées",
    betaFeatures: "Fonctionnalités Bêta",
    betaFeaturesDesc: "Essayer des fonctionnalités expérimentales",
    boardRoster: "Membres du Conseil",
    debateDynamics: "Dynamique de Débat",
    debateAggressiveness: "Agressivité du Débat",
    debateAggressivenessDesc: "Tonalité et niveau d'objection",
    interruptionRate: "Taux d'Interruption",
    interruptionRateDesc: "Fréquence du contre-interrogatoire",
    themeVisuals: "Thème et Visuels",
    interfaceTheme: "Thème d'Interface",
    accentColor: "Couleur d'Accentuation",
    vfxTypography: "VFX et Typographie",
    glowEffects: "Effets de Lueur",
    fontScale: "Échelle de Police",
    emailNotifications: "Notifications par E-mail",
    weeklyDigest: "Résumé Hebdomadaire War Room",
    riskWarnings: "Avertissements de Risque Critique",
    audioWebhooks: "Audio et Webhooks",
    soundEffects: "Effets Sonores",
    slackWebhook: "Webhook Slack",
    dataStorage: "Données et Stockage",
    exportQuality: "Qualité d'Exportation",
    autoArchive: "Archiver Anciennes Missions",
    privacySecurity: "Confidentialité et Sécurité",
    localEncryption: "Chiffrement Local",
    zeroRetention: "Rétention Zéro de Données",
    dangerZone: "Zone de Danger",
    clearCache: "Vider le Cache",
    resetPref: "Réinitialiser les Préférences",
    yourProfile: "Votre Profil",
    editProfile: "Modifier le Profil",
    freePlan: "Offre Gratuite",
    managePlan: "Gérer l'Offre",
    about: "À Propos",
    appVersion: "Version App",
    lastUpdated: "Dernière Mise à Jour",
    status: "Statut",
    checkUpdates: "Vérifier les Mises à Jour",
  }
};

export default function SettingsView({
  onNavigate,
  userName = 'Moiz',
  language: propLanguage,
  onLanguageChange,
}) {
  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Search helper
  const matchesSearch = (title, keywords = []) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (title.toLowerCase().includes(q)) return true;
    return keywords.some((k) => k.toLowerCase().includes(q));
  };

  // Toggle states
  const [autoSave, setAutoSave] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [debateMode, setDebateMode] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [autoArchive, setAutoArchive] = useState(false);
  const [betaFeatures, setBetaFeatures] = useState(false);

  // Dropdown states
  const [privacy, setPrivacy] = useState('Private');
  const [language, setLanguage] = useState(() => propLanguage || localStorage.getItem('fwr_language') || 'English');

  useEffect(() => {
    if (propLanguage && propLanguage !== language) {
      setLanguage(propLanguage);
    }
  }, [propLanguage]);
  const [meetingLength, setMeetingLength] = useState('4 Minutes');
  const [responseDepth, setResponseDepth] = useState('Detailed');
  const [exportQuality, setExportQuality] = useState('High (PDF)');

  // AI & Models state
  const [primaryModel, setPrimaryModel] = useState('Gemini 1.5 Pro');
  const [modelTemperature, setModelTemperature] = useState(0.7);
  const [webSearch, setWebSearch] = useState(true);
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  // Board Members state (8 Agents)
  const [activeBoardMembers, setActiveBoardMembers] = useState({
    ceo: true,
    cto: true,
    cmo: true,
    cfo: true,
    investor: true,
    risk: true,
    customer: true,
    devilsAdvocate: true,
  });
  const [debateIntensity, setDebateIntensity] = useState('Aggressive');
  const [interruptionRate, setInterruptionRate] = useState('Medium');
  const [factCheckStrictness, setFactCheckStrictness] = useState('High');

  // Appearance state
  const [themeMode, setThemeMode] = useState('Cyberpunk Dark');
  const [accentColor, setAccentColor] = useState('Gold');
  const [vfxGlow, setVfxGlow] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [fontScale, setFontScale] = useState('Standard');
  const [fontFamily, setFontFamily] = useState('Inter');

  // Notifications state
  const [emailDigest, setEmailDigest] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('');

  // Data & Privacy state
  const [localEncryption, setLocalEncryption] = useState(true);
  const [zeroRetention, setZeroRetention] = useState(false);

  // Account & Profile modal state
  const [profileName, setProfileName] = useState(userName);
  const [profileEmail, setProfileEmail] = useState('moiz@example.com');
  const [profileRole, setProfileRole] = useState('Founder');
  const [twoFactor, setTwoFactor] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Interactive Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'Board Review Complete', desc: 'VITALINK V6 scored 8.4/10 with strong commercial traction.', time: '10m ago', type: 'info' },
    { id: 2, title: 'Risk Alert Flagged', desc: 'Grim Reaper flagged unit economics for B2C SaaS model.', time: '1h ago', type: 'risk' },
    { id: 3, title: 'Roster Active', desc: 'All 8 Executive Board AI Agents are operational.', time: '3h ago', type: 'info' },
  ]);

  // Translation helper function
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.English[key] || key;
  };

  return (
    <div className="v2-dashboard-page">
      {/* Background Grid & Glow */}
      <div className="v2-bg-grid" />
      <div className="v2-bg-ambient-glow" />

      {/* Header */}
      <header className="v2-header">
        <div className="v2-header-brand" onClick={() => onNavigate && onNavigate('landing')}>
          <img src="/war_room_logo.png" alt="War Room Crest" className="v2-header-logo-img" />
          <div className="v2-header-brand-titles">
            <span className="v2-brand-title">FOUNDER'S WAR ROOM</span>
            <span className="v2-brand-subtitle">AI BOARD OF DIRECTORS</span>
          </div>
        </div>

        <div className="v2-header-actions" style={{ position: 'relative' }}>
          <button
            className="v2-icon-btn"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative' }}
          >
            <AppIcon name="bell" size={16} />
            {notificationsList.length > 0 && <span className="v2-notification-dot" />}
          </button>

          {/* Interactive Notifications Popover */}
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '44px',
              right: '90px',
              width: '320px',
              background: 'rgba(13, 21, 41, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              padding: '16px',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AppIcon name="bell" size={16} color="#fbbf24" />
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>Notifications</span>
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                  onClick={() => setNotificationsList([])}
                >
                  Clear All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                {notificationsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '0.82rem' }}>
                    No new notifications
                  </div>
                ) : (
                  notificationsList.map((n) => (
                    <div key={n.id} style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: n.type === 'risk' ? '3px solid #f87171' : '3px solid #38bdf8'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: n.type === 'risk' ? '#f87171' : '#e2e8f0' }}>{n.title}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{n.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="v2-user-dropdown-pill">
            <div className="v2-user-avatar">
              <AppIcon name="user" size={14} color="#fff" />
            </div>
            <span className="v2-user-name">{userName}</span>
            <AppIcon name="chevron" size={14} className="v2-dropdown-arrow" />
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="v2-body">
        {/* Left Sidebar */}
        <aside className="v2-sidebar">
          <nav className="v2-sidebar-nav">
            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('dashboard')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Dashboard</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('form')}>
              <span className="nav-item-icon"><AppIcon name="build" size={18} /></span>
              <span>New Startup</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('boardroom')}>
              <span className="nav-item-icon"><AppIcon name="ceo" size={18} /></span>
              <span>War Room</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('timeline')}>
              <span className="nav-item-icon"><AppIcon name="activity" size={18} /></span>
              <span>Evolution</span>
            </button>

            <button className="v2-nav-item" onClick={() => onNavigate && onNavigate('reports')}>
              <span className="nav-item-icon"><AppIcon name="history" size={18} /></span>
              <span>Reports</span>
            </button>

            <button className="v2-nav-item active" onClick={() => onNavigate && onNavigate('settings')}>
              <span className="nav-item-icon"><AppIcon name="cto" size={18} color="#f59e0b" /></span>
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>Settings</span>
            </button>
          </nav>

          <div className="v2-sidebar-widgets-container" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="v2-upgrade-box">
              <div className="upgrade-title-row">
                <AppIcon name="crown" size={16} color="#c084fc" />
                <span className="upgrade-title">Upgrade Plan</span>
              </div>
              <span className="upgrade-subtext">Unlock advanced features and more credits. &gt;</span>
            </div>

            <div className="v2-upgrade-box" style={{ background: 'rgba(13, 21, 41, 0.85)' }}>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 800, marginBottom: '4px' }}>
                AI Credits Used
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#e2e8f0', marginBottom: '6px' }}>
                8,450 / 10,000
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '84.5%', height: '100%', background: 'linear-gradient(90deg, #c084fc, #38bdf8)', borderRadius: '10px' }} />
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>Reset on Aug 15, 2026</span>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace Grid */}
        <main className="v2-main-content" style={{ maxWidth: '1440px' }}>
          <div className="settings-feed-column">
            
            {/* Header Title Row with Profile Card on Right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 className="settings-main-heading">{t('settingsTitle')}</h1>
                <p className="settings-subtext">{t('settingsSub')}</p>
              </div>

              {/* Profile Box Card in Top Right */}
              <div className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 24px',
                borderRadius: '20px',
                background: 'rgba(13, 21, 41, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 16px rgba(168, 85, 247, 0.3)'
                }}>
                  <AppIcon name="user" size={26} color="#fff" />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>{profileName}</h4>
                    <span style={{
                      padding: '3px 10px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid #a855f7',
                      borderRadius: '12px',
                      color: '#c084fc',
                      fontSize: '0.78rem',
                      fontWeight: 800
                    }}>
                      {profileRole}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 500 }}>{profileEmail}</span>
                </div>

                <button
                  className="btn-view-evolution"
                  style={{ marginLeft: '16px', padding: '9px 20px', fontSize: '0.86rem', fontWeight: 800 }}
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  Edit Profile →
                </button>
              </div>
            </div>

            {/* Search Bar with ⌘ K shortcut badge */}
            <div style={{ marginBottom: '24px' }}>
              <div className="settings-search-wrapper" style={{ position: 'relative' }}>
                <AppIcon name="analyzing" size={18} color="#fbbf24" />
                <input
                  type="text"
                  className="settings-search-input"
                  placeholder="Search settings (e.g. Models, Privacy, Theme, Slack)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingRight: '80px' }}
                />
                <span style={{
                  position: 'absolute',
                  right: searchQuery ? '60px' : '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.72rem',
                  color: '#64748b',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontFamily: 'monospace'
                }}>
                  ⌘ K
                </span>
                {searchQuery && (
                  <button className="settings-search-clear" style={{ right: '16px' }} onClick={() => setSearchQuery('')}>
                    ✕
                  </button>
                )}
              </div>
            </div>

              {/* Dynamic Grid of Settings Cards Filtered by Search */}
              <div className="settings-cards-grid">
                {/* Card 1: General Preferences */}
                {matchesSearch('General Preferences', ['privacy', 'auto-save', 'delete', 'language', 'english', 'spanish']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="cto" size={18} color="#c084fc" />
                      <h3>{t('generalPref')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('missionPrivacy')}</span>
                          <span className="setting-desc">{t('missionPrivacyDesc')}</span>
                        </div>
                        <select className="settings-select" value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                          <option value="Private">Private</option>
                          <option value="Public">Public</option>
                          <option value="Team">Team Only</option>
                        </select>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('autoSave')}</span>
                          <span className="setting-desc">{t('autoSaveDesc')}</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
                          <span className="switch-slider" />
                        </label>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('confirmDelete')}</span>
                          <span className="setting-desc">{t('confirmDeleteDesc')}</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={confirmDelete} onChange={() => setConfirmDelete(!confirmDelete)} />
                          <span className="switch-slider" />
                        </label>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('defaultLang')}</span>
                          <span className="setting-desc">{t('defaultLangDesc')}</span>
                        </div>
                        <select
                          className="settings-select"
                          value={language}
                          onChange={(e) => {
                            const newLang = e.target.value;
                            setLanguage(newLang);
                            localStorage.setItem('fwr_language', newLang);
                            if (onLanguageChange) {
                              onLanguageChange(newLang);
                            }
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Español</option>
                          <option value="German">Deutsch</option>
                          <option value="French">Français</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 2: Meeting & Analysis */}
                {matchesSearch('Meeting & Analysis', ['meeting', 'length', 'depth', 'debate', 'sources', 'analysis', 'time']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="history" size={18} color="#38bdf8" />
                      <h3>{t('meetingAnalysis')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('meetingLength')}</span>
                          <span className="setting-desc">{t('meetingLengthDesc')}</span>
                        </div>
                        <select className="settings-select" value={meetingLength} onChange={(e) => setMeetingLength(e.target.value)}>
                          <option value="2 Minutes">2 Minutes</option>
                          <option value="4 Minutes">4 Minutes</option>
                          <option value="8 Minutes">8 Minutes</option>
                        </select>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('responseDepth')}</span>
                          <span className="setting-desc">{t('responseDepthDesc')}</span>
                        </div>
                        <select className="settings-select" value={responseDepth} onChange={(e) => setResponseDepth(e.target.value)}>
                          <option value="Concise">Concise</option>
                          <option value="Detailed">Detailed</option>
                          <option value="Exhaustive">Exhaustive</option>
                        </select>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('enableDebate')}</span>
                          <span className="setting-desc">{t('enableDebateDesc')}</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={debateMode} onChange={() => setDebateMode(!debateMode)} />
                          <span className="switch-slider" />
                        </label>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('includeSources')}</span>
                          <span className="setting-desc">{t('includeSourcesDesc')}</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={includeSources} onChange={() => setIncludeSources(!includeSources)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 3 (Row 1): Board Member Roster (8 Agents in 2 Columns) */}
                {matchesSearch('Board Member Roster', ['board', 'members', 'roster', 'ceo', 'cto', 'cmo', 'cfo', 'investor', 'risk', 'customer', 'devils advocate', 'advocate']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header" style={{ justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AppIcon name="ceo" size={18} color="#fbbf24" />
                        <h3>{t('boardRoster')}</h3>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 800 }}>
                        {Object.values(activeBoardMembers).filter(Boolean).length} / 8 Active
                      </span>
                    </div>
                    <div className="settings-form-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                      {Object.entries({
                        ceo: { title: 'Marcus Vance (CEO)', tag: 'CEO' },
                        cto: { title: 'Dr. Aris Thorne (CTO)', tag: 'CTO' },
                        cmo: { title: 'Elena Rostova (CMO)', tag: 'CMO' },
                        cfo: { title: 'Victor Sterling (CFO)', tag: 'CFO' },
                        investor: { title: 'Priya Desai (Investor)', tag: 'Investor' },
                        risk: { title: 'Dr. Quinn Hayes (Risk)', tag: 'Risk' },
                        customer: { title: 'Samir Khan (Customer)', tag: 'Customer' },
                        devilsAdvocate: { title: "Grim Reaper (Devil's Advocate)", tag: "Devil's Advocate" },
                      }).map(([key, item]) => (
                        <div className="setting-row" key={key} style={{ padding: '6px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="setting-info" style={{ flexDirection: 'row', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                            <span className="setting-label" style={{ fontWeight: 800, fontSize: '0.82rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.title}>
                              {item.tag}
                            </span>
                          </div>
                          <label className="settings-switch" style={{ flexShrink: 0 }}>
                            <input
                              type="checkbox"
                              checked={activeBoardMembers[key]}
                              onChange={() =>
                                setActiveBoardMembers((prev) => ({ ...prev, [key]: !prev[key] }))
                              }
                            />
                            <span className="switch-slider" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card 4 (Row 2): Debate Dynamics */}
                {matchesSearch('Debate Dynamics', ['debate', 'aggressiveness', 'interruption', 'strictness', 'fact-check', 'tone', 'friction']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="debate" size={18} color="#f43f5e" />
                      <h3>{t('debateDynamics')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('debateAggressiveness')}</span>
                          <span className="setting-desc">{t('debateAggressivenessDesc')}</span>
                        </div>
                        <select className="settings-select" value={debateIntensity} onChange={(e) => setDebateIntensity(e.target.value)}>
                          <option value="Polite">Polite</option>
                          <option value="Balanced">Balanced</option>
                          <option value="Aggressive">Aggressive</option>
                          <option value="Relentless">Relentless</option>
                        </select>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('interruptionRate')}</span>
                          <span className="setting-desc">{t('interruptionRateDesc')}</span>
                        </div>
                        <select className="settings-select" value={interruptionRate} onChange={(e) => setInterruptionRate(e.target.value)}>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">Fact-Check Strictness</span>
                          <span className="setting-desc">How strictly agents fact-check</span>
                        </div>
                        <select className="settings-select" value={factCheckStrictness} onChange={(e) => setFactCheckStrictness(e.target.value)}>
                          <option value="Standard">Standard</option>
                          <option value="High">High</option>
                          <option value="Maximum">Maximum</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 5 (Row 2): Theme & Visuals */}
                {matchesSearch('Theme & Visuals', ['theme', 'appearance', 'visuals', 'dark', 'cyberpunk', 'midnight', 'obsidian', 'color', 'accent', 'gold', 'purple', 'font', 'scale']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="activity" size={18} color="#c084fc" />
                      <h3>{t('themeVisuals')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('interfaceTheme')}</span>
                          <span className="setting-desc">Choose your theme</span>
                        </div>
                        <select className="settings-select" value={themeMode} onChange={(e) => setThemeMode(e.target.value)}>
                          <option value="Cyberpunk Dark">Cyberpunk Dark</option>
                          <option value="Midnight Blue">Midnight Blue</option>
                          <option value="Obsidian Black">Obsidian Stealth</option>
                        </select>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('accentColor')}</span>
                          <span className="setting-desc">Highlight elements</span>
                        </div>
                        <select className="settings-select" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}>
                          <option value="Gold">Gold Amber</option>
                          <option value="Purple">Neon Purple</option>
                          <option value="Cyan">Electric Cyan</option>
                          <option value="Emerald">Emerald Green</option>
                        </select>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('fontScale')}</span>
                          <span className="setting-desc">UI text sizing</span>
                        </div>
                        <select className="settings-select" value={fontScale} onChange={(e) => setFontScale(e.target.value)}>
                          <option value="Compact">Compact</option>
                          <option value="Standard">Standard</option>
                          <option value="Large">Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 6 (Row 2): VFX & Typography */}
                {matchesSearch('VFX & Typography', ['glow', 'vfx', 'font', 'scale', 'text', 'size', 'effects', 'animations', 'family']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="sparkles" size={18} color="#38bdf8" />
                      <h3>{t('vfxTypography')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('glowEffects')}</span>
                          <span className="setting-desc">Ambient background glow</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={vfxGlow} onChange={() => setVfxGlow(!vfxGlow)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">Animations</span>
                          <span className="setting-desc">Enable smooth animations</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={enableAnimations} onChange={() => setEnableAnimations(!enableAnimations)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 10: Email Notifications */}
                {matchesSearch('Email Notifications', ['email', 'notifications', 'digest', 'weekly', 'warnings', 'alerts', 'risk']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="bell" size={18} color="#fbbf24" />
                      <h3>{t('emailNotifications')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('weeklyDigest')}</span>
                          <span className="setting-desc">Weekly executive AI briefing</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={emailDigest} onChange={() => setEmailDigest(!emailDigest)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('riskWarnings')}</span>
                          <span className="setting-desc">Red flag alerts</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={riskAlerts} onChange={() => setRiskAlerts(!riskAlerts)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 11 (Row 3): Audio & Webhooks */}
                {matchesSearch('Audio & Webhooks', ['audio', 'sound', 'sfx', 'webhook', 'slack', 'discord', 'integrations']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="target" size={18} color="#38bdf8" />
                      <h3>{t('audioWebhooks')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('soundEffects')}</span>
                          <span className="setting-desc">In-app alert audio</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={soundEffects} onChange={() => setSoundEffects(!soundEffects)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                      <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                        <div className="setting-info">
                          <span className="setting-label">{t('slackWebhook')}</span>
                          <span className="setting-desc">Post alerts to channel</span>
                        </div>
                        <input
                          type="text"
                          className="settings-input"
                          placeholder="https://hooks.slack.com/services/..."
                          value={slackWebhook || 'https://hooks.slack.com/d...'}
                          onChange={(e) => setSlackWebhook(e.target.value)}
                          style={{ width: '100%' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            ● Connected
                          </span>
                          <button className="connect-btn outline" style={{ padding: '3px 14px', fontSize: '0.78rem', height: '28px' }} onClick={() => alert('Editing Slack Webhook...')}>
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 12 (Row 3): Data & Storage */}
                {matchesSearch('Data & Storage', ['data', 'storage', 'export', 'pdf', 'png', 'json', 'archive', 'quality']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="briefcase" size={18} color="#4ade80" />
                      <h3>{t('dataStorage')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('exportQuality')}</span>
                          <span className="setting-desc">Quality for exported reports</span>
                        </div>
                        <select className="settings-select" value={exportQuality} onChange={(e) => setExportQuality(e.target.value)}>
                          <option value="High (PDF)">High (PDF)</option>
                          <option value="Standard (PNG)">Standard (PNG)</option>
                          <option value="Raw (JSON)">Raw (JSON)</option>
                        </select>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('autoArchive')}</span>
                          <span className="setting-desc">Archive missions older than 90 days</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={autoArchive} onChange={() => setAutoArchive(!autoArchive)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                      <div className="storage-bar-block" style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div className="storage-lbl-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span className="setting-label" style={{ fontSize: '0.82rem', color: '#ffffff' }}>Storage Used</span>
                          <span className="storage-sub-txt" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>12.4 GB / 50 GB</span>
                        </div>
                        <div className="storage-progress-bg" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div className="storage-progress-fill" style={{ width: '24%', height: '100%', background: '#4ade80', borderRadius: '10px' }} />
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>24%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 13 (Row 4): Privacy & Security */}
                {matchesSearch('Privacy & Security', ['privacy', 'encryption', 'zero-data', 'retention', 'security', 'confidentiality']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="risk" size={18} color="#38bdf8" />
                      <h3>{t('privacySecurity')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('localEncryption')}</span>
                          <span className="setting-desc">Encrypt stored browser state</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={localEncryption} onChange={() => setLocalEncryption(!localEncryption)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('zeroRetention')}</span>
                          <span className="setting-desc">Do not log conversations</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={zeroRetention} onChange={() => setZeroRetention(!zeroRetention)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 14 (Row 4): Danger Zone */}
                {matchesSearch('Danger Zone', ['danger', 'cache', 'reset', 'clear', 'delete']) && (
                  <div className="settings-card glass-panel danger-card">
                    <div className="settings-card-header">
                      <AppIcon name="risk" size={18} color="#f87171" />
                      <h3 style={{ color: '#f87171' }}>{t('dangerZone')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label red" style={{ color: '#f87171' }}>Clear Cache</span>
                          <span className="setting-desc">Remove temporary data</span>
                        </div>
                        <button className="danger-btn" onClick={() => alert('Cache cleared successfully!')}>
                          Clear
                        </button>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label red" style={{ color: '#f87171' }}>Reset Preferences</span>
                          <span className="setting-desc">Reset all settings to default</span>
                        </div>
                        <button className="danger-btn" onClick={() => alert('Preferences reset to default.')}>
                          Reset
                        </button>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label red" style={{ color: '#f87171' }}>Delete Account</span>
                          <span className="setting-desc">Permanently delete your account</span>
                        </div>
                        <button className="danger-btn" onClick={() => alert('Account deletion request initiated.')}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 15 (Row 4): Advanced Options */}
                {matchesSearch('Advanced Options', ['beta', 'features', 'experimental', 'advanced', 'api', 'custom', 'prompts']) && (
                  <div className="settings-card glass-panel">
                    <div className="settings-card-header">
                      <AppIcon name="cto" size={18} color="#fb923c" />
                      <h3>{t('advancedOptions')}</h3>
                    </div>
                    <div className="settings-form-list">
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">{t('betaFeatures')}</span>
                          <span className="setting-desc">{t('betaFeaturesDesc')}</span>
                        </div>
                        <label className="settings-switch">
                          <input type="checkbox" checked={betaFeatures} onChange={() => setBetaFeatures(!betaFeatures)} />
                          <span className="switch-slider" />
                        </label>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">API Access</span>
                          <span className="setting-desc">Enable API for advanced usage</span>
                        </div>
                        <button className="connect-btn outline" style={{ padding: '4px 14px', fontSize: '0.8rem', height: '30px' }} onClick={() => alert('Opening API configuration...')}>
                          Configure
                        </button>
                      </div>
                      <div className="setting-row">
                        <div className="setting-info">
                          <span className="setting-label">Custom Prompts</span>
                          <span className="setting-desc">Manage your custom AI prompts</span>
                        </div>
                        <button className="connect-btn outline" style={{ padding: '4px 14px', fontSize: '0.8rem', height: '30px' }} onClick={() => alert('Opening custom prompt manager...')}>
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quote Banner */}
              <div className="settings-quote-banner">
                <p className="quote-text">“ Great decisions start with better insights. ”</p>
                <span className="quote-author">— Your AI Board of Directors</span>
            </div>

          </div>
        </main>
      </div>

      {/* Edit Profile Modal Popup */}
      {isEditProfileOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="profile-modal-header">
              <div className="profile-modal-title">
                <AppIcon name="user" size={20} color="#fbbf24" />
                <span>Edit Profile & Security</span>
              </div>
              <button className="profile-modal-close-btn" onClick={() => setIsEditProfileOpen(false)}>
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="profile-modal-body">
              
              {/* Account Details Section */}
              <div>
                <div className="profile-modal-section-title">
                  <AppIcon name="user" size={14} color="#fbbf24" />
                  <span>Account Details</span>
                </div>
                <div className="settings-form-list" style={{ marginTop: '10px' }}>
                  <div className="setting-row">
                    <div className="setting-info">
                      <span className="setting-label">Display Name</span>
                      <span className="setting-desc">Your public name in the War Room</span>
                    </div>
                    <input
                      type="text"
                      className="settings-input"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      style={{ width: '170px' }}
                    />
                  </div>
                  <div className="setting-row">
                    <div className="setting-info">
                      <span className="setting-label">Email Address</span>
                      <span className="setting-desc">Primary notification email</span>
                    </div>
                    <input
                      type="email"
                      className="settings-input"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      style={{ width: '180px' }}
                    />
                  </div>
                  <div className="setting-row">
                    <div className="setting-info">
                      <span className="setting-label">Founder Role</span>
                      <span className="setting-desc">Your title in the organization</span>
                    </div>
                    <input
                      type="text"
                      className="settings-input"
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value)}
                      style={{ width: '170px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Security & Auth Section */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="profile-modal-section-title">
                  <AppIcon name="risk" size={14} color="#fbbf24" />
                  <span>Security & Authentication</span>
                </div>
                <div className="settings-form-list" style={{ marginTop: '10px' }}>
                  <div className="setting-row">
                    <div className="setting-info">
                      <span className="setting-label">Two-Factor Auth (2FA)</span>
                      <span className="setting-desc">Secure account login with TOTP</span>
                    </div>
                    <label className="settings-switch">
                      <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
                      <span className="switch-slider" />
                    </label>
                  </div>
                  <div className="setting-row">
                    <div className="setting-info">
                      <span className="setting-label">Change Password</span>
                      <span className="setting-desc">Send password reset email link</span>
                    </div>
                    <button className="connect-btn outline" onClick={() => alert('Password reset link sent to ' + profileEmail)}>
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="profile-modal-footer">
              <button className="btn-cancel-profile" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-save-profile"
                onClick={() => {
                  alert('Profile & Security settings saved successfully!');
                  setIsEditProfileOpen(false);
                }}
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
