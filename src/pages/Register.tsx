import React, { useEffect } from 'react';
import { Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';

import { create } from '../modules/auth/authActions';
import { hooks } from '../modules/redux';
import { firebase } from '../modules/common/services';
import i18n from '../modules/I18n/i18n';

const Register: () => JSX.Element = () => {
  const dispatch = hooks.useTypedDispatch();
  const {
    loader: { actions },
  } = hooks.useTypedSelector((state) => state);

  useEffect(() => {
    (async () => {
      try {
        // const token = await firebase.requestUserPermission();
      } catch (_error) {
        const error = _error as { name: string; message: string };
        console.log(error);
      }
    })();
  }, []);

  const handleRegister = () => {
    dispatch(
      create({
        userType: 'guest',
        user: {
          firstName: 'Mona',
          lastName: 'Zaki',
          gender: 'Male',
          phoneNumber: '01004564332',
          displayName: 'Mona Zaki',
          email: 'user120@qrena.com',
          password: 'qrenaapp',
          // token,
          // platform: Platform.OS === 'ios' ? 'Ios' : 'Android',
        },
      })
    )
      .unwrap()
      .catch((error: string) => {
        console.log(error);
      });
  };

  return (
    <TouchableOpacity onPress={() => handleRegister()} style={styles.Container}>
      {actions.includes('create') ? (
        <ActivityIndicator size={'large'} color={'green'} />
      ) : (
        <Text> {i18n.translate('register_register_button')}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Register;
