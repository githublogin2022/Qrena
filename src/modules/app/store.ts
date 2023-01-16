import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../auth';
import { phoneOtpReducer } from '../phone-otp';
import loader from './loader';
import theme from './theme';
import visibility from '../onboarding/visibility';
import searchBarReducer from './searchBarSlice';
import notificationsReducer from '../notifications/reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader,
    theme,
    phoneOtp: phoneOtpReducer,
    onBoardingVisibility: visibility,
    searchBar: searchBarReducer,
    notification: notificationsReducer,
  },
});

export default store;
