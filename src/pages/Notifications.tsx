import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, Snackbar } from 'react-native-paper';

import { useTypedSelector, useTypedDispatch } from '../modules/app/hooks';
import { Notification } from '../modules/notifications/components';
import { read } from '../modules/notifications/actions';

const Notifications = () => {
  const dispatch = useTypedDispatch();
  const {
    theme: { theme },
    loader: { actions },
    notification: { notifications },
  } = useTypedSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(read({ userType: 'user' }))
      .unwrap()
      .catch((error) => {
        error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
      });
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={[styles.flatListContainer, { backgroundColor: theme.colors.background }]}>
      {actions.includes('notificationRead') ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={styles.flatList}
          data={notifications}
          renderItem={({ item: notification }) => <Notification {...notification} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContentContainer}
          ListEmptyComponent={
            <View style={styles.listEmptyComponentContainer}>
              <Text variant='titleLarge' style={{ color: theme.colors.contrastText }}>
                No notifications!
              </Text>
            </View>
          }
        />
      )}
      <Snackbar style={{ backgroundColor: theme.colors.tertiary }} visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={styles.snackbarText}> {snackbarMessage} </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: { flex: 1, justifyContent: 'center' },
  flatList: { marginTop: 15 },
  flatListContentContainer: { flexGrow: 1 },
  listEmptyComponentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  snackbarText: { textAlign: 'center' },
});

export default Notifications;
