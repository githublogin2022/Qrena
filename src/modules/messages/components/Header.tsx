import React, { useState } from 'react';
import { View, Image, StyleSheet, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { Appbar, Text, Menu, Avatar, ActivityIndicator } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { useTypedSelector, useTypedDispatch } from '../../app/hooks';
import { RootStackParams } from '../../app/types';
import { updateMe } from '../../auth/actions';
import { update } from '../../chats/reducer';
import MuteDialogOptions from './MuteDialogOptions';

const Header = (props: NativeStackHeaderProps) => {
  const { navigation } = props;
  const {
    theme: { theme },
    auth: { me },
    loader: { actions },
    chat: { chats },
  } = useTypedSelector((state) => state);
  const dispatch = useTypedDispatch();
  const { t, i18n } = useTranslation();
  const {
    params: { receiver, chatId },
  } = useRoute<RouteProp<RootStackParams, 'Messages'>>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuteDialogVisible, setIsMuteDialogVisible] = useState(false);

  const handleMuteMenuO = () => setIsMenuOpen(true);

  const handleHeaderMenuClose = () => setIsMenuOpen(false);

  const handleMuteDialogOpen = () => setIsMuteDialogVisible(true);

  const handleMuteDialogClose = () => setIsMuteDialogVisible(false);

  const handleOnBlock = async () => {
    if (me?.blockedList && receiver) {
      handleHeaderMenuClose();

      const index = me.blockedList.findIndex((user) => user.user._id === receiver?._id);

      if (index === -1) {
        await dispatch(
          updateMe({ userType: 'user', user: { blockedList: [...me.blockedList, { user: { _id: receiver._id } }] } })
        )
          .unwrap()
          .catch(() => {});

        dispatch(update(chats.filter((chat) => chat.receiver._id !== receiver?._id)));
      }

      navigation.navigate('Chats');
    }
  };

  return (
    <Appbar.Header
      statusBarHeight={35}
      style={[styles.container, { backgroundColor: theme.colors.header, borderBottomWidth: StyleSheet.hairlineWidth }]}
      mode='small'>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor='transparent' />
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={
              Platform.OS === 'android'
                ? theme.dark
                  ? require('../assets/png/arrow-white-android.png')
                  : require('../assets/png/arrow-black-android.png')
                : theme.dark
                ? require('../assets/png/arrow-white-ios.png')
                : require('../assets/png/arrow-black-ios.png')
            }
            style={[styles.icon, i18n.language === 'ar' && { transform: [{ rotate: '180deg' }] }]}
          />
        </TouchableOpacity>
        {receiver &&
          (receiver.profilePictureUrl ? (
            <Avatar.Image size={50} source={{ uri: receiver.profilePictureUrl }} />
          ) : (
            <Avatar.Text
              size={50}
              label={receiver.displayName}
              color={theme.colors.white}
              labelStyle={styles.text}
              style={{ backgroundColor: theme.colors.tertiary }}
            />
          ))}
        <Text
          variant='titleMedium'
          style={[styles.title, { color: theme.colors.contrastText }]}
          numberOfLines={1}
          ellipsizeMode='tail'>
          {receiver?.displayName}
        </Text>
      </View>
      <Menu
        contentStyle={[{ backgroundColor: theme.colors.background }]}
        visible={isMenuOpen}
        onDismiss={handleHeaderMenuClose}
        anchor={
          actions.includes('userUpdateMe') ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity onPress={handleMuteMenuO}>
              <Image
                source={
                  theme.dark
                    ? require('../assets/png/menu-vertical-white.png')
                    : require('../assets/png/menu-vertical-black.png')
                }
                style={[styles.icon, i18n.language === 'ar' && { transform: [{ rotate: '180deg' }] }]}
              />
            </TouchableOpacity>
          )
        }>
        <Menu.Item
          onPress={handleOnBlock}
          title={t('header_menu_item_first_title_text')}
          titleStyle={{ color: theme.colors.contrastText }}
        />
        <Menu.Item
          titleStyle={{ color: theme.colors.contrastText }}
          onPress={() => {
            handleHeaderMenuClose();
            handleMuteDialogOpen();
          }}
          title={t('header_menu_item_second_title_text')}
        />
      </Menu>
      <MuteDialogOptions visible={isMuteDialogVisible} handleDialogClose={handleMuteDialogClose} chatId={chatId} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between' },
  contentContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  icon: { width: 26, height: 26, marginRight: 7 },
  title: { flexShrink: 1, marginLeft: 7 },
  text: { fontSize: 18, fontWeight: '600' },
});

export default Header;
