import store from './store';

export type RootStackParams = {
  Splash: undefined;
  OnBoarding: undefined;
  Login: undefined;
  VerifyOtp: undefined;
  Register: { token?: string | undefined; platform?: 'Ios' | 'Android' };
  Main: undefined;
  Home: undefined;
  Chat: undefined;
  Chats: undefined;
  Scan: undefined;
  Settings: undefined;
  Notifications: undefined;
};
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type ApiError = {
  name: string;
  message: string;
  response?: {
    data?: {
      message: string;
      statusCode: string;
    };
  };
};
export type UserType = 'guest' | 'phoneOtp' | 'user';
