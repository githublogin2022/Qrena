import React, { useEffect, useRef, useState } from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../modules/app/types';
import { useTypedNavigation } from '../modules/app/hooks';

import { stat } from 'react-native-fs';
import { Camera, CameraDevice, useCameraDevices } from 'react-native-vision-camera';

const CameraScreen = () => {
  const {
    params: { receiverId, receiverQrCode, senderQrCode, chatId },
  } = useRoute<RouteProp<RootStackParams, 'Camera'>>();
  const camera = useRef<Camera>(null);
  const navigation = useTypedNavigation();
  const [cameraPermissionBool, setCameraPermission] = useState(false);
  const [microphonePermissionBool, setMicrophonePermission] = useState(false);
  const devices = useCameraDevices();
  const [device, setDevice] = useState<CameraDevice | undefined>(undefined);

  useEffect(() => {
    const loadPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const microphonePermission = await Camera.getMicrophonePermissionStatus();

      if (cameraPermission) {
        if (cameraPermission === 'not-determined') {
          // permission not asked yet

          // request permission
          const newCameraPermission = await Camera.requestCameraPermission();
          if (newCameraPermission === 'authorized') {
            // permission granted
            setCameraPermission(true);
          } else {
            // permission denied
            setCameraPermission(false);
          }
        } else if (cameraPermission === 'authorized') {
          // permission already granted
          setCameraPermission(true);
        } else {
          // permission denied
          setCameraPermission(false);
        }
      }

      if (microphonePermission) {
        if (microphonePermission === 'not-determined') {
          // permission not asked yet

          // request permission
          const newMicrophonePermission = await Camera.requestMicrophonePermission();
          if (newMicrophonePermission === 'authorized') {
            // permission granted
            setMicrophonePermission(true);
          } else {
            // permission denied
            setMicrophonePermission(false);
          }
        } else if (microphonePermission === 'authorized') {
          // permission already granted
          setMicrophonePermission(true);
        } else {
          // permission denied
          setMicrophonePermission(false);
        }
      }

      console.log('camera: ', cameraPermissionBool);
      console.log('microphone: ', microphonePermissionBool);
      if (cameraPermissionBool && microphonePermissionBool) {
        // permissions granted
        setDevice(devices.back);
      }
    };

    loadPermissions();
  }, [cameraPermissionBool, devices.back, microphonePermissionBool, navigation]);

  // capture an image
  const takePicture = async () => {
    // const options = { quality: 0.5, base64: true };
    const data = await camera.current?.takePhoto({ qualityPrioritization: 'balanced' });
    console.log(data);
    if (data?.path) {
      console.log(`file://${data?.path}`);
      const name = data?.path.split('/').pop();
      const extension = name?.split('.').pop();
      const stats = await stat(`file://${data?.path}`);
      const size = stats.size;
      navigation.navigate('SendCapturedAttachment', {
        url: `file://${data?.path}`,
        name,
        size,
        type: 'image',
        receiverId,
        receiverQrCode,
        senderQrCode,
        chatId,
        extension,
      });
    }
  };

  // stop recording the video
  const stopRecording = async () => {
    await camera.current?.stopRecording();
  };

  // start recording the video
  const takeVideo = () => {
    camera.current?.startRecording({
      onRecordingError(error) {
        // error occurred
        console.log(error.name, error.message);
      },
      async onRecordingFinished(data) {
        // recording finished
        const name = data.path.split('/').pop();
        const extension = name?.split('.').pop();
        const stats = await stat(data.path);
        const size = stats.size;
        navigation.navigate('SendCapturedAttachment', {
          url: data.path,
          name,
          size,
          type: 'video',
          receiverId,
          receiverQrCode,
          senderQrCode,
          chatId,
          extension,
        });
      },
    });
  };

  return (
    <View style={styles.container}>
      {device ? (
        (console.log('device not null'),
        (
          <Camera
            ref={camera}
            style={styles.preview}
            device={device}
            isActive={true}
            photo={true}
            video={true}
            audio={true}
            //   type={RNCamera.Constants.Type.back}
            //   flashMode={RNCamera.Constants.FlashMode.on}
            //   androidCameraPermissionOptions={{
            //     title: 'Permission to use camera',
            //     message: 'We need your permission to use your camera',
            //     buttonPositive: 'Ok',
            //     buttonNegative: 'Cancel',
            //   }}
            //   androidRecordAudioPermissionOptions={{
            //     title: 'Permission to use audio recording',
            //     message: 'We need your permission to use your audio',
            //     buttonPositive: 'Ok',
            //     buttonNegative: 'Cancel',
            //   }}>
            //   {({ camera, status }) => {
            //     if (status !== 'READY') {
            //       return <Text>Waiting</Text>;
            //     }
            //     return (
            //       <View style={styles.button}>
            //         <TouchableOpacity
            //           onLongPress={() => takeVideo(camera)}
            //           onPress={() => takePicture(camera)}
            //           onPressOut={() => stopRecording(camera)}
            //           style={styles.btnAlignment}>
            //           <Icon color='#fff' size={45} name='camera' />
            //         </TouchableOpacity>
            //       </View>
            //     );
            //   }}
            // </Camera>
          />
        ))
      ) : (
        <Text>Permissions not granted</Text>
      )}
      <View style={styles.button}>
        <TouchableOpacity
          onLongPress={() => takeVideo()}
          onPress={() => takePicture()}
          onPressOut={() => stopRecording()}
          style={styles.btnAlignment}>
          <Icon color='#fff' size={45} name='camera' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: { flex: 0, flexDirection: 'row', justifyContent: 'center' },
  btnAlignment: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default CameraScreen;
