import React from 'react';
import { Image, StyleSheet, StatusBar } from 'react-native';
import { Appbar } from 'react-native-paper';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

import { useTypedSelector } from '../../../modules/app/hooks';
import { t } from 'i18next';

const Header = (props: BottomTabHeaderProps) => {
  const { navigation, route } = props;
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <Appbar.Header
      statusBarHeight={35}
      style={{
        backgroundColor: theme.colors.header,
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
      mode='small'>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor='transparent' />
      <Appbar.Content
        title={t(`header_${route.name.toLowerCase()}_title_text`)}
        titleStyle={{ color: theme.colors.contrastText }}
      />
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
            <Image
              resizeMode='stretch'
              source={require('../assets/png/notifications.png')}
              style={styles.notifications}
            />
          )}
          onPress={() => navigation.navigate('Notifications')}
        />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({ notifications: { width: 30, height: 30 } });

export default Header;
