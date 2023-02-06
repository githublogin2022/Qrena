import React from 'react';
import { TouchableOpacity, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';

import { useTypedSelector } from '../../../modules/app/hooks';

type ChatProps = { user: string; content: string; avatar?: ImageSourcePropType; date: string; notifications?: number };

const Chat = (props: ChatProps) => {
  const { user, content, avatar, date, notifications } = props;
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <TouchableOpacity style={[styles.Container]}>
      <View style={styles.ContentContainer}>
        {avatar ? (
          <Avatar.Image size={55} source={avatar} style={[styles.AvatarContainer]} />
        ) : (
          <Avatar.Text
            size={55}
            label={`${user.split(' ')[0].charAt(0)}${user.split(' ')[1].charAt(0)}`}
            color={theme.colors.white}
            labelStyle={styles.InitialsContainer}
            style={[styles.AvatarContainer, { backgroundColor: theme.colors.tertiary }]}
          />
        )}
        <View>
          <Text variant='titleMedium' style={[styles.titleContainer, { color: theme.colors.contrastText }]}>
            {user}
          </Text>
          <Text variant='bodyMedium' style={{ color: theme.colors.grey['500'] }}>
            {content}
          </Text>
        </View>
      </View>
      <View style={styles.InfoContainer}>
        <Text variant='bodySmall' style={{ color: theme.colors.grey['500'] }}>
          {date}
        </Text>
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
  Container: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    height: 55,
    marginTop: 30,
    justifyContent: 'space-between',
  },
  titleContainer: { marginBottom: 5 },
  AvatarContainer: { borderRadius: 15, marginRight: 20 },
  InitialsContainer: { fontSize: 18, fontWeight: '600' },
  ContentContainer: { flexDirection: 'row' },
  InfoContainer: { justifyContent: 'space-between' },
});

export default Chat;
