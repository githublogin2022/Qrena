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
  Messages: {
    receiver?: { _id?: string; profilePictureUrl?: string; displayName: string };
    sender?: string;
    chatId?: string;
    receiverQrCode?: { _id?: string; combination: string; name: string };
    senderQrCode?: { _id?: string; combination: string; name: string };
  };
  Image: {
    url: string;
    fileName?: string;
  };
  Video: {
    url: string;
    fileName?: string;
  };
  SendCapturedAttachment: {
    url: string;
    type: 'image' | 'video';
    name?: string;
    size?: number;
    chatId?: string;
    receiverId?: string;
    receiverQrCode?: string;
    senderQrCode?: string;
  };
  Camera: {
    senderQrCode?: string;
    receiverId?: string;
    receiverQrCode?: string;
    chatId?: string;
  };
  SelectContact: {
    receiver?: { _id?: string; profilePictureUrl?: string; displayName: string };
    sender?: string;
    chatId?: string;
    receiverQrCode?: { _id?: string; combination: string; name: string };
    senderQrCode?: { _id?: string; combination: string; name: string };
  };
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
