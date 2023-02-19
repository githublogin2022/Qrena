import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useTypedSelector, useTypedNavigation } from '../../../modules/app/hooks';
import { Chat as ChatType } from '../types';

type ChatProps = ChatType;

const Chat = (props: ChatProps) => {
  const { t } = useTranslation();
  const { _id, receiver, lastMessage, notifications } = props;
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);
  const navigation = useTypedNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', { id: _id })} style={[styles.Container]}>
      <View style={styles.ContentContainer}>
        {receiver.profilePictureUrl ? (
          <Avatar.Image size={55} source={{ uri: receiver.profilePictureUrl }} style={[styles.AvatarContainer]} />
        ) : (
          <Avatar.Text
            size={55}
            label={`${receiver.displayName.split(' ')[0].charAt(0)}${receiver.displayName.split(' ')[1].charAt(0)}`}
            color={theme.colors.white}
            labelStyle={styles.InitialsContainer}
            style={[styles.AvatarContainer, { backgroundColor: theme.colors.tertiary }]}
          />
        )}
        <View style={styles.textContainer}>
          <Text variant='titleMedium' style={[styles.titleContainer, { color: theme.colors.contrastText }]}>
            {receiver.displayName}
          </Text>
          <Text
            variant='bodyMedium'
            style={{
              color: theme.colors.grey['500'],
            }}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {lastMessage ? lastMessage.body : t('chats_body_text')}
          </Text>
        </View>
      </View>
      <View style={styles.InfoContainer}>
        {lastMessage && (
          <Text variant='bodySmall' style={{ color: theme.colors.grey['500'] }}>
            {new Date(lastMessage.date).toLocaleString('en-GB').slice(0, 5)}
          </Text>
        )}
        {notifications && (
          <Badge style={{ backgroundColor: theme.colors.lightPurple, color: theme.colors.grey['800'] }} size={25}>
            {notifications}
          </Badge>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, flexDirection: 'row', marginHorizontal: 20, marginTop: 30, justifyContent: 'space-between' },
  textContainer: { flex: 1 },
  titleContainer: { marginBottom: 5 },
  AvatarContainer: { marginRight: 20 },
  InitialsContainer: { fontSize: 18, fontWeight: '600' },
  ContentContainer: { flexDirection: 'row', flex: 1 },
  InfoContainer: { justifyContent: 'space-between' },
});

export default Chat;
