import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

import { hooks } from '../modules/common/navigation';

const Landing: () => JSX.Element = () => {
  const navigation = hooks.useTypedNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
        <Text style={styles.text}> Login </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
        <Text style={styles.text}> Register </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 25,
  },
  text: {
    fontSize: 30,
  },
});

export default Landing;
