import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useTypedNavigation, useTypedSelector } from '../modules/app/hooks';

const Chats = () => {
  const navigation = useTypedNavigation();

  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <TouchableOpacity
      style={[styles.Container, { backgroundColor: theme.colors.background }]}
      onPress={() => navigation.navigate('Chat')}>
      <Text style={{ color: theme.colors.contrastText }}> Press to go to Chat </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chats;
