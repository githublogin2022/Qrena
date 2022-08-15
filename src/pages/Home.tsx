import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

interface IconProps {
  toggleTabBar: (display: 'none' | undefined) => void;
}

const Home: React.FC<IconProps> = (props) => {
  const { toggleTabBar } = props;

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    toggleTabBar(undefined);
  }, [toggleTabBar]);

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
