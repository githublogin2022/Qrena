import messaging from '@react-native-firebase/messaging';

const requestUserPermission = async (): Promise<string | undefined> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    return token;
  }

  return undefined;
};

export { requestUserPermission };
