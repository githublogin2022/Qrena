import React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { useTypedSelector } from '../../../modules/app/hooks';

type NotificationProps = {
  title: string;
  body: string;
};

const Notification = (props: NotificationProps) => {
  const { title, body } = props;
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <TouchableOpacity style={[styles.Container, { borderBottomColor: theme.colors.contrastText }]}>
      <Image
        style={styles.icon}
        resizeMode='stretch'
        source={
          theme.dark
            ? require('../../notifications/assets/png/bell-white.png')
            : require('../../notifications/assets/png/bell-black.png')
        }
      />
      <View style={styles.contentContainer}>
        <Text variant='titleMedium' style={{ color: theme.colors.contrastText }}>
          {title}
        </Text>
        <Text numberOfLines={2} variant='bodyMedium' style={{ color: theme.colors.contrastText }}>
          {body}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: {
    width: Dimensions.get('window').width - 20,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 8,
    marginBottom: 8,
    marginHorizontal: 10,
  },
  icon: { height: 30, width: 30, alignSelf: 'center' },
  contentContainer: { flex: 1, paddingLeft: 5 },
});

export default Notification;
