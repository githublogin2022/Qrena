import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTypedSelector } from '../modules/app/hooks';

const Home = () => {
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <View style={[styles.Container, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.contrastText }}> welcome from Home </Text>
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
