import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { Button } from '../modules/common/components';
import { useTypedDispatch, useTypedSelector } from '../modules/app/hooks';
import { logout } from '../modules/auth/actions';

const Account = () => {
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();
  const {
    loader: { actions },
    theme: { theme },
  } = useTypedSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  const handleLogOut = async () => {
    await dispatch(logout({ userType: 'user' }))
      .unwrap()
      .catch((error) => (error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error)));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Button
        mode='contained'
        loading={actions.includes('logout')}
        disabled={actions.includes('logout')}
        LinearGradientProps={{
          style: { borderRadius: 30, width: 150, alignSelf: 'center' },
          colors: ['#1897D3', '#79D44E'],
          useAngle: true,
          angle: 170,
          locations: [0, 1],
        }}
        contentStyle={styles.buttonContainer}
        style={styles.button}
        labelStyle={[styles.buttonLabel, { ...theme.typescale.titleMedium, color: theme.colors.white }]}
        onPress={handleLogOut}>
        {t('account_logout_button_title_text')}
      </Button>
      <Snackbar style={{ backgroundColor: theme.colors.tertiary }} visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={[styles.snackbarText, { color: theme.colors.white }]}>{snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  buttonContainer: { height: 45 },
  button: { width: 150, backgroundColor: 'transparent' },
  buttonLabel: { fontWeight: 'bold' },
  snackbarText: { textAlign: 'center' },
});

export default Account;
