import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../auth';
import { phoneOtpReducer } from '../phone-otp';
import loader from './loader';
import theme from './theme';
import visibility from '../onboarding/visibility';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader,
    theme,
    phoneOtp: phoneOtpReducer,
    onBoardingVisibility: visibility,
  },
});

export default store;
