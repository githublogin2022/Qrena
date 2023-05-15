import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../auth';
import { chatReducer } from '../chats';
import { phoneOtpReducer } from '../phone-otp';
import { qrCodeReducer } from '../home';
import loader from './loader';
import theme from './theme';
import visibility from '../onboarding/visibility';
import searchBarReducer from './searchBarSlice';
import notificationsReducer from '../notifications/reducer';
import { messageReducer } from '../messages';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    message: messageReducer,
    loader,
    theme,
    phoneOtp: phoneOtpReducer,
    qrCode: qrCodeReducer,
    onBoarding: visibility,
    searchBar: searchBarReducer,
    notification: notificationsReducer,
  },
});

export default store;
