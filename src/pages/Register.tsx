import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';

import { create } from '../modules/auth/authActions';
import { hooks } from '../modules/redux';
const Register: () => JSX.Element = () => {
  const dispatch = hooks.useTypedDispatch();
  const {
    auth: { me },
    loader: { actions },
  } = hooks.useTypedSelector((state) => state);
  const [error, setError] = useState('');

  useEffect(() => {
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
        },
      })
    )
      .unwrap()
      .catch((_error) => {
        setError(JSON.stringify(_error));
      });
  }, [dispatch]);

  return (
    <View style={styles.Container}>
      <Text> {me?.email}</Text>
      {actions.includes('create') ? (
        <ActivityIndicator size={'large'} color={'green'} />
      ) : error ? (
        <Text> {error}</Text>
      ) : (
        <Text> Hello World</Text>
      )}
    </View>
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
