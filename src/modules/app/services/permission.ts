import { Platform } from 'react-native';
import { request, PERMISSIONS, check, Permission } from 'react-native-permissions';

type RequestTypes = {
  [key: string]: {
    [key: string]: string;
  };
};

const requestTypes: RequestTypes = {
  camera: {
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  },
};

export const permissionTypes = {
  camera: 'camera',
};

export const checkPermission = async (type: string): Promise<boolean> => {
  try {
    const permission: any = requestTypes[type][Platform.OS];

    if (!permission) {
      return true;
    }

    const result = await check(permission);

    if (result === 'granted') {
      return true;
    }
    return requestPermission(permission);
  } catch (error) {
    return false;
  }
};

const requestPermission = async (permission: Permission): Promise<boolean> => {
  try {
    const result = await request(permission);
    return result === 'granted';
  } catch (error) {
    return false;
  }
};
