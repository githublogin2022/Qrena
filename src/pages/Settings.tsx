import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTypedSelector, useTypedNavigation } from '../modules/app/hooks';
import { Setting } from '../modules/settings/components';

const Settings = () => {
  const { t } = useTranslation();
  const navigation = useTypedNavigation();
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  const data = [
    {
      title: t('settings_profile_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/profile-filled-white.png')
        : require('../modules/settings/assets/png/profile-outlined-black.png'),
      onPress: () => {
        navigation.navigate('Profile');
      },
    },
    {
      title: t('settings_theme_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/theme-filled-white.png')
        : require('../modules/settings/assets/png/theme-outlined-black.png'),
      onPress: () => {
        navigation.navigate('Theme');
      },
    },
    {
      title: t('settings_user_codes_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/qr-code-filled-white.png')
        : require('../modules/settings/assets/png/qr-code-outlined-black.png'),
      onPress: () => {
        navigation.navigate('Codes');
      },
    },
    {
      title: t('settings_notifications_settings_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/notifications-settings-filled-white.png')
        : require('../modules/settings/assets/png/notifications-settings-outlined-black.png'),
      onPress: () => {
        navigation.navigate('NotificationsSettings');
      },
    },
    {
      title: t('settings_privacy_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/privacy-filled-white.png')
        : require('../modules/settings/assets/png/privacy-outlined-black.png'),
      onPress: () => {
        navigation.navigate('Privacy');
      },
    },
    {
      title: t('settings_language_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/language-filled-white.png')
        : require('../modules/settings/assets/png/language-outlined-black.png'),
      onPress: () => {
        navigation.navigate('AppLanguage');
      },
    },
    {
      title: t('settings_account_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/account-filled-white.png')
        : require('../modules/settings/assets/png/account-outlined-black.png'),
      onPress: () => {
        navigation.navigate('Account');
      },
    },
    {
      title: t('settings_invite_title_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/invite-filled-white.png')
        : require('../modules/settings/assets/png/invite-outlined-black.png'),
      onPress: () => {},
    },
    {
      title: t('settings_help_title_text'),
      icon: require('../modules/settings/assets/png/help-filled-blue.png'),
      onPress: () => {
        navigation.navigate('Help');
      },
    },
  ];

  return (
    <FlatList
      style={[{ backgroundColor: theme.colors.background }]}
      data={data}
      renderItem={({ item }) => <Setting title={item.title} icon={item.icon} onPress={item.onPress} />}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.title}
      contentContainerStyle={styles.FlatListContentContainer}
    />
  );
};

const styles = StyleSheet.create({
  FlatListContentContainer: { flexGrow: 1 },
});

export default Settings;
