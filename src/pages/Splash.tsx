import React, { useEffect } from 'react';
import { StyleSheet, Text, StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { readMe } from '../modules/auth/actions';
import { read } from '../modules/app/theme';
import { useTypedDispatch } from '../modules/app/hooks';
import LogoLg from '../modules/app/assets/svg/LogoLg';
import { getCount } from '../modules/notifications/actions';

const Splash = () => {
  const dispatch = useTypedDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(read());
      dispatch(getCount({ userType: 'user', queries: 'status=unread' }));
      dispatch(readMe({ userType: 'user' }));
    }, 2000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <LinearGradient
      colors={['#1897D3', '#79D44E']}
      locations={[0.1, 1]}
      useAngle={true}
      angle={140}
      angleCenter={{ x: 0.5, y: 0.5 }}
      style={styles.Container}>
      <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
      <View>
        <LogoLg height={200} width={200} />
      </View>
      <Text style={styles.text}> Qrena </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 70, color: 'white', fontWeight: 'bold', letterSpacing: 3 },
});

export default Splash;
