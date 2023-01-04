import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Chat, Login, Notifications, OnBoarding, Register, Scan, Splash, VerifyOtp } from './src/pages';
import { useTypedDispatch, useTypedSelector } from './src/modules/app/hooks';
import { RootStackParams } from './src/modules/app/types';
import { read } from './src/modules/onboarding/visibility';
import { update } from './src/modules/app/theme';
import { TabNavigator } from './src/modules/app/components';

const App: () => JSX.Element = () => {
  const dispatch = useTypedDispatch();
  const {
    theme: { theme },
    auth: { isAuthenticated, withSplash },
    onBoardingVisibility: { isVisible },
  } = useTypedSelector((state) => state);
  const Stack = createNativeStackNavigator<RootStackParams>();

  useEffect(() => {
    dispatch(read());
  }, [dispatch]);

  Appearance.addChangeListener(async ({ colorScheme }) => {
    const userColorScheme = await AsyncStorage.getItem('colorScheme');

    if (!userColorScheme) {
      dispatch(update({ type: 'phone', colorScheme }));
    }
  });

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash'>
          {isAuthenticated ? (
            <>
              <Stack.Screen name='Main' component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name='Chat' component={Chat} options={{ headerBackTitleVisible: false }} />
              <Stack.Screen
                name='Notifications'
                component={Notifications}
                options={{ headerBackTitleVisible: false }}
              />
              <Stack.Screen name='Scan' component={Scan} />
            </>
          ) : (
            <>
              {withSplash && <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />}
              {isVisible === null && (
                <Stack.Screen name='OnBoarding' component={OnBoarding} options={{ headerShown: false }} />
              )}
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='VerifyOtp' component={VerifyOtp} options={{ headerShown: false }} />
              <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
