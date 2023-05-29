import React, { useEffect, useRef, useState } from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../modules/app/types';
import { useTypedNavigation } from '../modules/app/hooks';

import { stat } from 'react-native-fs';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { permission } from '../modules/app/services';

const CameraScreen = () => {
  const {
    params: { receiverId, receiverQrCode, senderQrCode, chatId },
  } = useRoute<RouteProp<RootStackParams, 'Camera'>>();
  const camera = useRef<Camera>(null);
  const navigation = useTypedNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  // useEffect(() => {
  //   const loadPermissions = async () => {
  //     const cameraPermission = await Camera.getCameraPermissionStatus();
  //     const microphonePermission = await Camera.getMicrophonePermissionStatus();

  //     console.log('original camera permission', cameraPermission);
  //     console.log('original camera permission', cameraPermission);

  //     if (cameraPermission) {
  //       if (cameraPermission === 'not-determined' || cameraPermission === 'denied') {
  //         // permission not asked yet

  //         // request permission
  //         console.log('requesting camera permission');
  //         Camera.requestCameraPermission()
  //           .then((value) => {
  //             console.log('new camera permission: ', value);
  //             if (value === 'authorized') {
  //               // permission granted
  //               setCameraPermission(true);
  //               micPermissions(microphonePermission);
  //             } else {
  //               // permission denied
  //               setCameraPermission(false);
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       } else if (cameraPermission === 'authorized') {
  //         // permission already granted
  //         setCameraPermission(true);
  //         micPermissions(microphonePermission);
  //       } else {
  //         // permission denied
  //         setCameraPermission(false);
  //       }
  //     }

  //     console.log('camera: ', cameraPermissionBool);
  //     console.log('microphone: ', microphonePermissionBool);
  //     if (cameraPermissionBool && microphonePermissionBool) {
  //       // permissions granted
  //       setDevice(devices.back);
  //     }
  //   };

  //   loadPermissions();
  // }, [cameraPermissionBool, devices.back, microphonePermissionBool, navigation]);

  // const micPermissions = (microphonePermission: CameraPermissionStatus) => {
  //   if (microphonePermission) {
  //     if (microphonePermission === 'not-determined' || microphonePermission === 'denied') {
  //       // permission not asked yet

  //       // request permission
  //       console.log('requesting microphone permission');
  //       Camera.requestMicrophonePermission().then((value) => {
  //         console.log('new mic permission: ', value);
  //         if (value === 'authorized') {
  //           // permission granted
  //           setMicrophonePermission(true);
  //         } else {
  //           // permission denied
  //           setMicrophonePermission(false);
  //         }
  //       });
  //     } else if (microphonePermission === 'authorized') {
  //       // permission already granted
  //       setMicrophonePermission(true);
  //     } else {
  //       // permission denied
  //       setMicrophonePermission(false);
  //     }
  //   }
  // };

  // capture an image

  useEffect(() => {
    (async () => {
      try {
        setHasPermission(await permission.checkPermission(permission.permissionTypes.camera));
        setHasPermission(await permission.checkPermission(permission.permissionTypes.microphone));
      } catch (error) {}
    })();
  }, []);

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
      {device && hasPermission ? (
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
