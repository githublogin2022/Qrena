import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../modules/app/hooks';
import { PrivacyList } from '../modules/settings/components';

const Privacy = () => {
  const {
    theme: { theme },
    auth: { me },
  } = useTypedSelector((state) => state);
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <>
      <FlatList
        style={[{ backgroundColor: theme.colors.background }]}
        data={me?.blockedList}
        renderItem={({ item }) => <PrivacyList {...item.user} onToggleSnackBar={onToggleSnackBar} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainer}
        ListEmptyComponent={
          <View style={styles.flatListContainer}>
            <Text variant='titleLarge' style={{ color: theme.colors.contrastText }}>
              {t('privacy_no_results_text')}
            </Text>
          </View>
        }
      />
      <Snackbar style={{ backgroundColor: theme.colors.tertiary }} visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={[styles.snackbarText, { color: theme.colors.white }]}> {snackbarMessage} </Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  flatListContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flatListContentContainer: { flexGrow: 1, padding: 20 },
  snackbarText: { textAlign: 'center' },
});

export default Privacy;
