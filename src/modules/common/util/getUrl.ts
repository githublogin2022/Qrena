import { Platform } from 'react-native';
import { BASE_URL, IOS_BASE_URL, ANDROID_BASE_URL } from '@env';

const getUrl = (): string => {
  if (__DEV__) {
    switch (Platform.OS) {
      case 'ios':
        return IOS_BASE_URL;

      case 'android':
        return ANDROID_BASE_URL;
    }
  }
  return BASE_URL;
};

export default getUrl;
