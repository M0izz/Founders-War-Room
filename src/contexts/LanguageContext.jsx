import React, { createContext, useState, useCallback } from 'react';
import { TRANSLATIONS } from '../i18n/translations.js';

export const LanguageContext = createContext({
  language: 'English',
  changeLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('fwr_language') || 'English');

  const changeLanguage = useCallback((newLang) => {
    setLanguage(newLang);
    localStorage.setItem('fwr_language', newLang);
  }, []);

  const t = useCallback((key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.English;
    const parts = key.split('.');
    let value = dict;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        // Fallback to English if missing in current language
        const englishDict = TRANSLATIONS.English;
        let fallbackVal = englishDict;
        for (const fbPart of parts) {
          if (fallbackVal && typeof fallbackVal === 'object' && fbPart in fallbackVal) {
            fallbackVal = fallbackVal[fbPart];
          } else {
            return key;
          }
        }
        return typeof fallbackVal === 'string' ? fallbackVal : key;
      }
    }
    return typeof value === 'string' ? value : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
