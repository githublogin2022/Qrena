import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Chats, Home, Landing, Login, Notifications, Profile, Register, Scan, Splash } from './src/pages';
import { Icon } from './src/modules/common/components';
import { hooks } from './src/modules/redux';
import { types } from './src/modules/common/navigation';

const App: () => JSX.Element = () => {
  const Stack = createNativeStackNavigator<types.RootStackParams>();
  const Tab = createBottomTabNavigator();
  const {
    auth: { isAuthenticated, withSplash },
  } = hooks.useTypedSelector((state) => state);
  const tabs = [
    { name: 'Home', component: Home, iconName: 'home' },
    { name: 'Chats', component: Chats, iconName: 'wechat' },
    { name: 'Scan', component: Scan, iconName: 'camera' },
    { name: 'Notifications', component: Notifications, iconName: 'bell' },
    { name: 'Profile', component: Profile, iconName: 'notification-clear-all' },
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'>
        {isAuthenticated ? (
          <Stack.Screen name='Main' options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
                {tabs.map((tab, index) => (
                  <Tab.Screen
                    key={index}
                    name={tab.name}
                    component={tab.component}
                    options={{
                      tabBarLabelStyle: styles.tabBarLabelStyle,
                      tabBarLabel: tab.name,
                      tabBarIcon: ({ focused }) => <Icon name={tab.iconName} focused={focused} />,
                    }}
                  />
                ))}
              </Tab.Navigator>
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name='Landing' component={Landing} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Register' component={Register} />
            {withSplash && <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontSize: 13,
    marginBottom: Platform.OS === 'android' ? 3 : 0,
  },
});

export default App;
