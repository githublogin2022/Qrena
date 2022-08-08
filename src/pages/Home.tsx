import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const Home: () => JSX.Element = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.Container}>
      <Text> welcome from Home </Text>
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

export default Home;
