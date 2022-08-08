import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { readMe } from '../modules/auth/authActions';
import { useTypedDispatch } from '../modules/redux/hooks';

const Splash: () => JSX.Element = () => {
  const dispatch = useTypedDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(readMe({ userType: 'user' })), 5000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <View style={styles.Container}>
      <Image source={require('../modules/common/assets/images/apple-touch-icon.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(4,75,67)',
  },
});

export default Splash;
