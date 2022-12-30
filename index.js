import React from 'react';
import axios from 'axios';
import { AppRegistry } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

import App from './App';
import './src/modules/app/i18n';
import store from './src/modules/app/store';
import { name as appName } from './app.json';
import { getUrl } from './src/modules/app/utils';

const onMessageReceived = async (remoteMessage) => {
  const { title, body, ios: iosStringified, android: androidStringified, ...rest } = remoteMessage.data;
  const ios = JSON.parse(iosStringified);
  const android = JSON.parse(androidStringified);

  await notifee.setNotificationCategories(ios.categories);

  try {
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

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { pressAction, input } = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
    console.log(input);
  }
});

axios.defaults.baseURL = getUrl();

const Root = () => {
  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
