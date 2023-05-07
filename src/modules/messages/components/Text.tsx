import React from 'react';

import { StyleSheet, Text as TextTag, View } from 'react-native';
import { Text as TextType } from '../types';

type TextProps = TextType;

const Text = (props: TextProps) => {
  const { side, text } = props;

  return (
    <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
      <View style={[styles.textContainer, side === 'left' ? styles.textContainerLeft : styles.textContainerRight]}>
        <TextTag style={side === 'left' ? styles.blackText : styles.whiteText}>{text}</TextTag>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    maxWidth: '75%',
    marginHorizontal: 8,
  },
  containerLeft: {
    backgroundColor: 'grey',
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  containerRight: {
    backgroundColor: '#79D44E',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  textContainerRight: {
    justifyContent: 'flex-end',
    color: 'white',
  },
  textContainerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  whiteText: {
    color: 'white',
  },
  blackText: {
    color: 'black',
  },
});

export default Text;
