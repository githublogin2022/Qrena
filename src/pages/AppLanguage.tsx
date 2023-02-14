import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import { getI18n } from 'react-i18next';
import RNRestart from 'react-native-restart';

import { RadioButton } from '../modules/common/components';
import { useTypedSelector } from '../modules/app/hooks';
import { getDeviceLanguage } from '../modules/app/utils';

type Language = { value: 'en' | 'ar' | 'default'; name: string; isSelected: boolean };

const AppLanguage = () => {
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([
    { value: 'default', name: t('language_default_title_text'), isSelected: false },
    { value: 'en', name: t('language_english_title_text'), isSelected: false },
    { value: 'ar', name: t('language_arabic_title_text'), isSelected: false },
  ]);

  useEffect(() => {
    (async () => {
      let language = await AsyncStorage.getItem('userLanguage');

      if (!language) {
        language = 'default';
      }

      setLanguages(
        languages.map((_language) =>
          _language.value === language ? { ..._language, isSelected: true } : { ..._language, isSelected: false }
        )
      );
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanguageChange = async (language: string) => {
    if (language === 'default') {
      await AsyncStorage.removeItem('userLanguage');

      language = getDeviceLanguage();
    } else {
      await AsyncStorage.setItem('userLanguage', language);
    }

    const isRTL = language === 'ar';

    await getI18n().changeLanguage(language);

    if (isRTL !== I18nManager.isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);

      RNRestart.Restart();
    }
  };

  const onSelectLanguage = async (language: Language) => {
    await handleLanguageChange(language.value);

    setLanguages(
      languages.map((_language) =>
        _language.value === language.value ? { ..._language, isSelected: true } : { ..._language, isSelected: false }
      )
    );
  };

  return (
    <View style={[styles.Container, { backgroundColor: theme.colors.background }]}>
      <Text variant='titleMedium' style={{ color: theme.colors.contrastText }}>
        {t('language_choose_language_title_text')}
      </Text>
      {languages.map((language) => (
        <RadioButton
          key={language.value}
          isSelected={language.isSelected}
          onPress={async () => await onSelectLanguage(language)}
          label={language.name}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, paddingTop: 15, paddingLeft: 15 },
});

export default AppLanguage;
