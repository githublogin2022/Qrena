import React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { HStack } from 'react-native-flex-layout';

import { ForwardChatProps } from '../types';

const ForwardChat = (props: ForwardChatProps) => {
  const { chat, checked, onPress } = props;

  return (
    <TouchableOpacity onPress={() => onPress()}>
      <HStack>
        <CheckBox onCheckColor='#000' onFillColor='#000' onTintColor='#000' tintColor='#000' value={checked} />
        <Text style={styles.text}>{chat.receiver.displayName}</Text>
      </HStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    paddingVertical: 6,
  },
});

export default ForwardChat;
