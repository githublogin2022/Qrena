import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTypedSelector } from '../modules/app/hooks';

const Help = () => {
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <View style={[styles.Container, { backgroundColor: theme.colors.background }]}>
      <Text>Welcome to Help Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Help;
