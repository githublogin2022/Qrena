import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';

import { login } from '../modules/auth/authActions';
import { hooks } from '../modules/redux';
import { firebase } from '../modules/common/services';

const Login: () => JSX.Element = () => {
  const dispatch = hooks.useTypedDispatch();
  const {
    auth: { me },
    loader: { actions },
  } = hooks.useTypedSelector((state) => state);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // const token = await firebase.requestUserPermission();
        dispatch(
          login({
            userType: 'guest',
            user: {
              email: 'user1@qrena.com',
              password: 'qrenaapp',
              // token,
              // platform: Platform.OS === 'ios' ? 'Ios' : 'Android',
            },
          })
        )
          .unwrap()
          .catch((_error) => {
            setError(JSON.stringify(_error));
          });
      } catch (_error) {
        console.log(_error);
      }
    })();
  }, [dispatch]);

  return (
    <View style={styles.Container}>
      <Text> {me?.email}</Text>
      {actions.includes('login') ? (
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

export default Login;
