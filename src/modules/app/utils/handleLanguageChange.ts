import { I18nManager } from 'react-native';
import { getI18n } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

import getDeviceLanguage from './getDeviceLanguage';

const handleLanguageChange = async () => {
  const userLang = await AsyncStorage.getItem('userLanguage');
  const lang = (userLang || getDeviceLanguage()) === 'ar' ? 'en' : 'ar';

  const isLangRTL = lang === 'ar';

  await AsyncStorage.setItem('userLanguage', lang);

  await getI18n().changeLanguage(lang);

  if (isLangRTL !== I18nManager.isRTL) {
    await I18nManager.allowRTL(isLangRTL);
    await I18nManager.forceRTL(isLangRTL);

    RNRestart.Restart();
  }
};

export default handleLanguageChange;
