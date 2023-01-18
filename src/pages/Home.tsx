import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

import { useTypedDispatch, useTypedSelector } from '../modules/app/hooks';
import { getUrl } from '../modules/app/utils';
import { read } from '../modules/home/actions';

const Home = () => {
  const {
    loader: { actions },
    auth: { me },
    theme: { theme },
    qrCode: { qrCodes },
  } = useTypedSelector((state) => state);
  const dispatch = useTypedDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, SetSnackbarMessage] = useState<string>('');

  const onToggleSnackBar = useCallback(
    (message: string) => {
      SetSnackbarMessage(message);
      setVisible((_visible) => !_visible);
    },
    [SetSnackbarMessage, setVisible]
  );

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    (async () => {
      await dispatch(read({ userType: 'user' }))
        .unwrap()
        .catch((error) => {
          error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
        });
    })();
  }, [dispatch, onToggleSnackBar]);

  return (
    <View style={[styles.Container, { backgroundColor: theme.colors.background }]}>
      {actions.includes('qrCodeRead') || qrCodes.length === 0 || !me ? (
        <ActivityIndicator size='large' color={theme.colors.tertiary} />
      ) : (
        <View
          style={[
            styles.QrCodeContainer,
            {
              backgroundColor: theme.colors.white,
              height: theme.windowHeight / 4 + 50,
              width: theme.windowHeight / 4 + 50,
            },
          ]}>
          <QRCode
            value={`${getUrl('webClient')}/chats/${me._id}-${qrCodes[0].combination}`}
            size={theme.windowHeight / 4}
          />
        </View>
      )}
      <Snackbar style={{ backgroundColor: theme.colors.tertiary }} visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={[styles.snackbarText, { color: theme.colors.white }]}> {snackbarMessage} </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  QrCodeContainer: { borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  snackbarText: { textAlign: 'center' },
});

export default Home;
