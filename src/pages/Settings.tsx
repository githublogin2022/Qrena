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
      title: t('account_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/account-filled-white.png')
        : require('../modules/settings/assets/png/account-outlined-black.png'),
      onPress: () => {
        navigation.navigate('Account');
      },
    },
    {
      title: t('chats_text'),
      icon: theme.dark
        ? require('../modules/settings/assets/png/chat-filled-white.png')
        : require('../modules/settings/assets/png/chat-outlined-black.png'),
      onPress: () => {
        navigation.navigate('ChatSettings');
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
