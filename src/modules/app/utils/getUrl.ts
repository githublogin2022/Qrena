import { Platform } from 'react-native';
import { BASE_URL, DEV_IOS_BASE_URL, DEV_ANDROID_BASE_URL, DEV_WEB_CLIENT_URL, WEB_CLIENT_URL } from '@env';

const getUrl = (type: string): string => {
  switch (type) {
    case 'webClient':
      if (__DEV__) {
        return DEV_WEB_CLIENT_URL;
      }
      return WEB_CLIENT_URL;

    case 'server':
      if (__DEV__) {
        return Platform.OS === 'ios' ? DEV_IOS_BASE_URL : DEV_ANDROID_BASE_URL;
      }
      return BASE_URL;

    default:
      break;
  }

  return BASE_URL;
};

export default getUrl;
