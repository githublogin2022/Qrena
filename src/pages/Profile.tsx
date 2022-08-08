import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { hooks } from '../modules/redux';

const Profile: () => JSX.Element = () => {
  const {
    auth: { me },
  } = hooks.useTypedSelector((state) => state);

  return (
    <View style={styles.Container}>
      <Text> FirstName : {me?.firstName} </Text>
      <Text> LastName : {me?.lastName} </Text>
      <Text> Email : {me?.email} </Text>
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

export default Profile;
