import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import {
  Chat,
  Login,
  Notifications,
  OnBoarding,
  Register,
  Scan,
  Splash,
  VerifyOtp,
  ChatSettings,
  Profile,
  Account,
  Theme,
  AppLanguage,
  Codes,
  NotificationsSettings,
  Privacy,
  Help,
} from './src/pages';
import { useTypedDispatch, useTypedSelector } from './src/modules/app/hooks';
import { RootStackParams, Android, IOS, RemoteMessage } from './src/modules/app/types';
import { read } from './src/modules/onboarding/visibility';
import { update } from './src/modules/app/theme';
import { TabNavigator } from './src/modules/app/components';
import { create } from './src/modules/notifications/actions';

const App: () => JSX.Element = () => {
  const dispatch = useTypedDispatch();
  const {
    theme: { theme },
    auth: { isAuthenticated, withSplash },
    onBoarding: { isVisible },
  } = useTypedSelector((state) => state);
  const Stack = createNativeStackNavigator<RootStackParams>();

  useEffect(() => {
    dispatch(read());
  }, [dispatch]);

  const onMessageReceived = async (message: any) => {
    const remoteMessage: RemoteMessage = message;
    const { title, body, sender, url, androidStringified, iosStringified, ...rest } = remoteMessage.data;
    const ios: IOS = JSON.parse(iosStringified);
    const android: Android = JSON.parse(androidStringified);

    await notifee.setNotificationCategories(ios.categories);

    try {
      dispatch(create({ userType: 'user', notification: { sender, title, body, redirectionURL: url } }));

      await notifee.displayNotification({
        body,
        title,
        android: { ...android, channelId: await notifee.createChannel(android.channel) },
        ios: { ...ios, categoryId: ios.categories[0].id },
        ...rest,
      });
    } catch (error) {
      console.log(error);
    }
  };

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { pressAction, input } = detail;

    if (type === EventType.ACTION_PRESS && pressAction?.id === 'reply') {
      console.log(input);
    }
  });

  Appearance.addChangeListener(async ({ colorScheme }) => {
    const userColorScheme = await AsyncStorage.getItem('colorScheme');

    if (!userColorScheme) {
      dispatch(update({ type: 'phone', colorScheme }));
    }
  });

  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Splash'
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTitleStyle: { color: theme.colors.contrastText },
            headerTintColor: theme.colors.contrastText,
            headerBackTitleVisible: false,
            statusBarTranslucent: true,
          }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name='Main' component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name='Chat' component={Chat} />
              <Stack.Screen name='Notifications' component={Notifications} />
              <Stack.Screen name='Scan' component={Scan} />
              <Stack.Screen name='ChatSettings' component={ChatSettings} />
              <Stack.Screen name='Profile' component={Profile} />
              <Stack.Screen name='Account' component={Account} />
              <Stack.Screen name='Theme' component={Theme} />
              <Stack.Screen name='AppLanguage' component={AppLanguage} />
              <Stack.Screen name='Codes' component={Codes} />
              <Stack.Screen name='NotificationsSettings' component={NotificationsSettings} />
              <Stack.Screen name='Privacy' component={Privacy} />
              <Stack.Screen name='Help' component={Help} />
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
