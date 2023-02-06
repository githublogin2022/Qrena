import { NotificationAndroid, NotificationIOS, AndroidChannel, IOSNotificationCategory } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

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
  ChatSettings: undefined;
  Account: undefined;
  Theme: undefined;
  AppLanguage: undefined;
  Profile: undefined;
  Codes: undefined;
  NotificationsSettings: undefined;
  Privacy: undefined;
  Invite: undefined;
  Help: undefined;
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
export type RemoteMessage = {
  data: {
    androidStringified: string;
    iosStringified: string;
    title: string;
    body: string;
    sender?: string;
    url?: string;
  };
} & FirebaseMessagingTypes.RemoteMessage;
export type Android = { channel: AndroidChannel } & NotificationAndroid;
export type IOS = { categories: IOSNotificationCategory[] } & NotificationIOS;
