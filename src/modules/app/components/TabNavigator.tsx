import React, { ReactElement } from 'react';
import { StyleSheet, Image, Platform, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';

import { Chats, Home, Settings } from '../../../pages';
import Header from './Header';

type Tab = {
  name: string;
  component: () => ReactElement;
  iconFilled: ImageSourcePropType;
  iconOutlined: ImageSourcePropType;
  options?: BottomTabNavigationOptions;
};

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const tabs: Tab[] = [
    {
      name: 'Home',
      component: Home,
      iconFilled: require('../assets/png/home-filled.png'),
      iconOutlined: require('../assets/png/home-outlined.png'),
    },
    {
      name: 'Chats',
      component: Chats,
      iconFilled: require('../assets/png/chat-filled.png'),
      iconOutlined: require('../assets/png/chat-outlined.png'),
    },
    {
      name: 'Settings',
      component: Settings,
      iconFilled: require('../assets/png/gear-filled.png'),
      iconOutlined: require('../assets/png/gear-outlined.png'),
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        header: (rest) => <Header {...rest} />,
        tabBarBackground: () => (
          <LinearGradient
            style={styles.linearGradient}
            colors={['#1897D3', '#79D44E']}
            useAngle={true}
            angle={170}
            locations={[0.11, 1]}
          />
        ),
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: { marginTop: Platform.OS === 'ios' ? 10 : 0 },
      }}>
      {tabs.map((tab, index) => (
        <Tab.Screen
          key={index}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Image source={focused ? tab.iconFilled : tab.iconOutlined} style={styles.image} />
            ),
            ...tab.options,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  linearGradient: { height: Platform.OS === 'ios' ? 80 : 70 },
  tabBar: { height: Platform.OS === 'ios' ? 80 : 65 },
  image: { height: 40, width: 40 },
});

export default TabNavigator;
