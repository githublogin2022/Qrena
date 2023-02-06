import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { RadioButton } from '../modules/common/components';
import { useTypedSelector, useTypedDispatch } from '../modules/app/hooks';
import { update } from '../modules/app/theme';

type Theme = { value: 'light' | 'dark' | 'default'; name: string; selected: boolean };

const AppTheme = () => {
  const { t } = useTranslation();
  const {
    theme: { theme: globalTheme },
  } = useTypedSelector((state) => state);
  const [themes, setThemes] = useState<Theme[]>([
    { value: 'default', name: t('theme_default_title_text'), selected: false },
    { value: 'light', name: t('theme_light_title_text'), selected: false },
    { value: 'dark', name: t('theme_dark_title_text'), selected: false },
  ]);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    (async () => {
      let storageTheme = await AsyncStorage.getItem('colorScheme');

      if (!storageTheme) {
        storageTheme = 'default';
      } else {
        storageTheme = globalTheme.dark ? 'dark' : 'light';
      }

      setThemes(
        themes.map((theme) =>
          theme.value === storageTheme ? { ...theme, selected: true } : { ...theme, selected: false }
        )
      );
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelectTheme = async (_theme: Theme) => {
    await dispatch(
      update({
        type: _theme.value === 'default' ? 'phone' : 'user',
        colorScheme: _theme.value === 'default' ? null : _theme.value,
      })
    );

    setThemes(
      themes.map((theme) =>
        theme.value === _theme.value ? { ...theme, selected: true } : { ...theme, selected: false }
      )
    );
  };

  return (
    <View style={[styles.Container, { backgroundColor: globalTheme.colors.background }]}>
      <Text variant='titleMedium' style={{ color: globalTheme.colors.contrastText }}>
        {t('theme_choose_theme_title_text')}
      </Text>
      {themes.map((_theme) => (
        <RadioButton
          key={_theme.value}
          selected={_theme.selected}
          onPress={async () => await onSelectTheme(_theme)}
          label={_theme.name}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, paddingTop: 15, paddingLeft: 15 },
});

export default AppTheme;
