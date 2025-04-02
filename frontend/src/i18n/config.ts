import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './translations/en.json';
import spTranslations from './translations/sp.json';
import frTranslations from './translations/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: spTranslations },
      fr: { translation: frTranslations }
    },
    supportedLngs: ['en', 'es', 'fr'],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;