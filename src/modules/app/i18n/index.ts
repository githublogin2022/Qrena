import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initReactI18next } from 'react-i18next';
import RNRestart from 'react-native-restart';
import i18n from 'i18next';

import { getDeviceLanguage } from '../utils';
import appEn from './languages/en';
import appAr from './languages/ar';
import { OnboardingEn, OnboardingAr } from '../../onboarding/i18n';
import { AuthEn, AuthAr } from '../../auth/i18n';
import { SettingsEn, SettingsAr } from '../../settings/i18n';
import { ChatsEn, ChatsAr } from '../../chats/i18n';

const en = { translation: { ...appEn, ...OnboardingEn, ...AuthEn, ...SettingsEn, ...ChatsEn } };
const ar = { translation: { ...appAr, ...OnboardingAr, ...AuthAr, ...SettingsAr, ...ChatsAr } };

i18n
  .use({
    init: Function.prototype,
    type: 'languageDetector',
    async: true,
    detect: async (callback: any) => {
      const userLang = await AsyncStorage.getItem('userLanguage');

      const deviceLang = userLang || getDeviceLanguage();
      const isLangRTL = deviceLang === 'ar';

      if (isLangRTL !== I18nManager.isRTL) {
        I18nManager.allowRTL(isLangRTL);
        I18nManager.forceRTL(isLangRTL);
        RNRestart.Restart();
      }

      callback(deviceLang);
    },
    cacheUserLanguage: () => {},
  })
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources: { en, ar },
  });

export default i18n;
