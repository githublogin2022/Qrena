import React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { useTypedSelector, useTypedDispatch, useTypedNavigation } from '../../../modules/app/hooks';
import { updateById } from '../actions';
import { Notification as NotificationType } from '../types';

type NotificationProps = {
  _id?: string;
  title?: string;
  body?: string;
  status?: 'Read' | 'UnRead';
};

const Notification = (props: NotificationProps) => {
  const { title, body, _id, status } = props;
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);
  const dispatch = useTypedDispatch();
  const navigation = useTypedNavigation();

  const onPress = async (notification: NotificationType) => {
    notification._id && navigation.navigate('Chat', { id: notification._id });

    if (notification.status === 'UnRead') {
      await dispatch(updateById({ userType: 'user', id: notification._id, notification: { status: 'Read' } })).unwrap();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress({ _id, status })}
      style={[styles.Container, { borderBottomColor: theme.colors.contrastText }]}>
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
