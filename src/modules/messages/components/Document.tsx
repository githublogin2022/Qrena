import React from 'react';

import { StyleSheet, Text as TextTag, View } from 'react-native';
import { Attachment as DocumentType } from '../types';

type DocumentProps = DocumentType;

const Document = (props: DocumentProps) => {
  const { side, fileName } = props;

  return (
    <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
      <View style={[styles.textContainer, side === 'left' ? styles.textContainerLeft : styles.textContainerRight]}>
        <TextTag style={[styles.text, side === 'left' ? styles.blackText : styles.whiteText]}>{fileName}</TextTag>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textContainerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  text: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
  whiteText: {
    color: 'white',
  },
  blackText: {
    color: 'black',
  },
});

export default Document;
