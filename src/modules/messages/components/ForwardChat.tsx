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
        <CheckBox onCheckColor='white' onFillColor='white' onTintColor='white' tintColor='#fff' value={checked} />
        <Text style={styles.text}>{chat.receiver.displayName}</Text>
      </HStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    paddingVertical: 6,
  },
});

export default ForwardChat;
