import React from 'react';
import { AppRegistry } from 'react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';

import App from './App';
import store from './src/modules/redux/store';
import { name as appName } from './app.json';
import { getUrl } from './src/modules/common/util';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

axios.defaults.baseURL = getUrl();

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
