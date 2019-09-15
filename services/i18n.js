import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as en from 'assets/i18n/en.json';
import * as fr from 'assets/i18n/fr.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    return Localization.getLocalizationAsync().then(({ locale }) => {
      callback(locale);
    });
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    keySeparator: false,
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
  });

export const i18n = i18next;
export const { t } = i18next;
