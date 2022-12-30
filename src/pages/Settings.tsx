import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTypedSelector } from '../modules/app/hooks';

const Profile = () => {
  const {
    auth: { me },
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <View style={[styles.Container, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.contrastText }}> FirstName : {me?.firstName} </Text>
      <Text style={{ color: theme.colors.contrastText }}> LastName : {me?.lastName} </Text>
    </View>
  );
};

const styles = StyleSheet.create({ Container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });

export default Profile;
