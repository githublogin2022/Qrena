import React from 'react';
import { AppRegistry } from 'react-native';
import axios from 'axios';
import notifee, { EventType } from '@notifee/react-native';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';

import App from './App';
import store from './src/modules/redux/store';
import { name as appName } from './app.json';
import { getUrl } from './src/modules/common/util';

const onMessageReceived = async (remoteMessage) => {
  const { title, body, ios: iosStringified, android: androidStringified, ...rest } = remoteMessage.data;
  const ios = JSON.parse(iosStringified);
  const android = JSON.parse(androidStringified);

  await notifee.setNotificationCategories(ios.categories);

  try {
    await notifee.displayNotification({
      body,
      title,
      android: {
        ...android,
        channelId: await notifee.createChannel(android.channel),
      },
      ios: { ...ios, categoryId: ios.categories[0].id },
      ...rest,
    });
  } catch (error) {
    console.log(error);
  }
};

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { pressAction, input } = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
    console.log(input);
  }
});

axios.defaults.baseURL = getUrl();

const Root = () => (
  <StoreProvider store={store}>
    <PaperProvider theme={DefaultTheme}>
      <App />
    </PaperProvider>
  </StoreProvider>
);

AppRegistry.registerComponent(appName, () => Root);
