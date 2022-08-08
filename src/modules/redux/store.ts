import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../auth';
import loader from './loader';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader,
  },
});

export default store;
