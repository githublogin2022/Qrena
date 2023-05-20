import React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { HStack, VStack } from 'react-native-flex-layout';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Attachment as ContactType } from '../types';

type ContactProps = ContactType;

const Image = (props: ContactProps) => {
  const { side, contact } = props;

  return (
    <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
      <View style={styles.contact}>
        <HStack>
          <View style={styles.left}>
            <Icon size={26} color='#fff' name='person' />
          </View>
          <View style={styles.right}>
            <VStack>
              <Text style={styles.textName}>{contact?.name}</Text>
              <Text style={styles.textPhone}>{contact?.phone}</Text>
            </VStack>
          </View>
        </HStack>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    maxWidth: '70%',
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
  contact: {
    backgroundColor: '#60BB35',
  },
  textName: {
    color: '#fff',
  },
  textPhone: {
    color: '#fff',
  },
  left: { width: '20%' },
  right: { width: '80%' },
});

export default Image;
