import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { HStack, VStack } from 'react-native-flex-layout';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ContactProps } from '../types';
import CheckBox from '@react-native-community/checkbox';

const ContactItem = (contactProps: ContactProps) => {
  const { contact, selectContact, checked } = contactProps;
  return (
    <View>
      <TouchableOpacity onPress={() => selectContact(contact)}>
        <HStack>
          <View style={styles.left}>
            <CheckBox onCheckColor='black' onFillColor='black' onTintColor='black' tintColor='black' value={checked} />
          </View>
          <HStack style={styles.right}>
            <View style={styles.rightLeft}>
              <Icon size={26} color='#fff' name='person' />
            </View>
            <View style={styles.rightRight}>
              <VStack>
                <Text>{contact.name}</Text>
                <Text>{contact.phone}</Text>
              </VStack>
            </View>
          </HStack>
        </HStack>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  left: { width: '20%' },
  right: { width: '80%' },
  rightLeft: {
    width: '15%',
  },
  rightRight: {
    width: '65%',
  },
  divider: {
    height: 1,
    backgroundColor: '#888',
    marginVertical: 12,
  },
});

export default ContactItem;
