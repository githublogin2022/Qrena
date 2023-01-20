import React from 'react';
import { Image, StyleSheet, StatusBar, View } from 'react-native';
import { Appbar, Badge, Searchbar } from 'react-native-paper';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { useTypedSelector, useTypedDispatch } from '../../../modules/app/hooks';
import { updateVisibility, updateSearchText } from '../searchBarSlice';

const Header = (props: BottomTabHeaderProps) => {
  const { t } = useTranslation();
  const { navigation, route } = props;
  const dispatch = useTypedDispatch();
  const {
    theme: { theme },
    searchBar: { isVisible, searchText },
    notification: { count },
  } = useTypedSelector((state) => state);

  const renderStatusBar = () => (
    <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor='transparent' />
  );

  if (isVisible) {
    return (
      <View style={[styles.searchbarContainer, { backgroundColor: theme.colors.header }]}>
        {renderStatusBar()}
        <Searchbar
          autoFocus
          placeholder='Search...'
          onChangeText={(text) => dispatch(updateSearchText(text))}
          value={searchText}
          style={{ backgroundColor: theme.colors.header }}
          iconColor={theme.colors.contrastText}
          placeholderTextColor={theme.colors.contrastText}
          inputStyle={{ color: theme.colors.contrastText }}
          elevation={0}
          autoComplete='off'
          autoCapitalize='none'
          autoCorrect={false}
        />
      </View>
    );
  }

  return (
    <Appbar.Header
      statusBarHeight={35}
      style={{ backgroundColor: theme.colors.header, borderBottomWidth: StyleSheet.hairlineWidth }}
      mode='small'>
      {renderStatusBar()}
      <Appbar.Content
        title={t(`header_${route.name.toLowerCase()}_title_text`)}
        titleStyle={{ color: theme.colors.contrastText }}
      />
      {route.name === 'Chats' && (
        <Appbar.Action
          icon={() => (
            <Image resizeMode='stretch' source={require('../assets/png/search.png')} style={styles.notifications} />
          )}
          onPress={() => dispatch(updateVisibility(true))}
        />
      )}
      {route.name !== 'Settings' && (
        <Appbar.Action
          icon={() => (
            <Image resizeMode='stretch' source={require('../assets/png/scan.png')} style={styles.notifications} />
          )}
          onPress={() => navigation.navigate('Scan')}
        />
      )}
      {route.name !== 'Settings' && (
        <Appbar.Action
          icon={() => (
            <>
              {count > 0 && (
                <Badge style={styles.notificationBadge} size={16}>
                  {count}
                </Badge>
              )}
              <Image
                style={styles.notifications}
                resizeMode='stretch'
                source={require('../assets/png/bell-green.png')}
              />
            </>
          )}
          onPress={() => navigation.navigate('Notifications')}
        />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  searchbarContainer: { height: 95, justifyContent: 'flex-end', borderBottomWidth: StyleSheet.hairlineWidth },
  notifications: { width: 25, height: 25 },
  notificationBadge: { backgroundColor: '#2CC069', position: 'absolute', right: 13, top: -2 },
});

export default Header;
