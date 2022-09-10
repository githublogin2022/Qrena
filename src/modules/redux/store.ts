import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../auth';
import loader from '../common/loader';
import { localizationSlice } from '../I18n';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader,
    localization: localizationSlice.default,
  },
});

export default store;
