import React from 'react';
import axios from 'axios';
import { AppRegistry } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import App from './App';
import './src/modules/app/i18n';
import store from './src/modules/app/store';
import { name as appName } from './app.json';
import { getUrl } from './src/modules/app/utils';

//axios.defaults.baseURL = getUrl('server');
axios.defaults.baseURL = getUrl();

const Root = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </StoreProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
