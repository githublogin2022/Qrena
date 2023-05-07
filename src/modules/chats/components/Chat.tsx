import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useTypedSelector, useTypedNavigation } from '../../../modules/app/hooks';
import { Chat as ChatType } from '../types';

type ChatProps = ChatType;

const Chat = (props: ChatProps) => {
  const { receiver, sender, lastMessage, notifications, _id, receiverQrCode, senderQrCode } = props;
  const navigation = useTypedNavigation();
  const { t } = useTranslation();
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);
  const displayName = receiver.displayName.split(' ');

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Messages', {
          receiver: {
            _id: receiver._id,
            profilePictureUrl: receiver.profilePictureUrl,
            displayName: receiver.displayName,
          },
          chatId: _id,
          receiverQrCode: {
            _id: receiverQrCode._id,
            combination: receiverQrCode.combination,
            name: receiverQrCode.name,
          },
          senderQrCode: {
            _id: senderQrCode._id,
            combination: senderQrCode.combination,
            name: senderQrCode.name,
          },
          sender: sender,
        })
      }
      style={[styles.container]}>
      <View style={styles.contentContainer}>
        {receiver.profilePictureUrl ? (
          <Avatar.Image size={55} source={{ uri: receiver.profilePictureUrl }} style={[styles.avatar]} />
        ) : (
          <Avatar.Text
            size={55}
            label={
              displayName.length > 1
                ? `${displayName[0].charAt(0).toUpperCase()}${displayName[1].charAt(0).toUpperCase()}`
                : `${displayName[0].charAt(0).toUpperCase()}`
            }
            color={theme.colors.white}
            labelStyle={styles.avatarText}
            style={[styles.avatar, { backgroundColor: theme.colors.tertiary }]}
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
      <View style={styles.infoContainer}>
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
  container: { flex: 1, flexDirection: 'row', marginHorizontal: 20, marginTop: 30, justifyContent: 'space-between' },
  textContainer: { flex: 1 },
  titleContainer: { marginBottom: 5 },
  avatar: { marginRight: 20 },
  avatarText: { fontSize: 18, fontWeight: '600' },
  contentContainer: { flexDirection: 'row', flex: 1 },
  infoContainer: { justifyContent: 'space-between' },
});

export default Chat;
