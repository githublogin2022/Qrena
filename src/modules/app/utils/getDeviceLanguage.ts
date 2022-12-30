import { Platform, NativeModules } from 'react-native';

const getDeviceLanguage = (): string => {
  const appLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  return appLanguage.search(/-|_/g) !== -1 ? appLanguage.slice(0, 2) : appLanguage;
};

export default getDeviceLanguage;
