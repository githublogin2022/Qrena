import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Scan: () => JSX.Element = () => {
  return (
    <View style={styles.Container}>
      <Text> welcome from Scan </Text>
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

export default Scan;
