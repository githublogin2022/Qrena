import React, { useEffect, useRef, useState } from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HStack } from 'react-native-flex-layout';

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
  const [isRecording, setIsRecording] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    (async () => {
      try {
        setHasPermission(await permission.checkPermission(permission.permissionTypes.camera));
        setHasPermission(await permission.checkPermission(permission.permissionTypes.microphone));
      } catch (error) {}
    })();
  }, []);

  const takePicture = async () => {
    const data = await camera.current?.takePhoto({ qualityPrioritization: 'balanced' });
    console.log(data);
    if (data?.path) {
      console.log(`file://${data?.path}`);
      const name = data?.path.split('/').pop();
      const extension = name?.split('.').pop();
      const stats = await stat(`file://${data?.path}`);
      const size = stats.size;
      navigation.replace('SendCapturedAttachment', {
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
    setIsRecording(false);
    await camera.current?.stopRecording();
  };

  // start recording the video
  const takeVideo = () => {
    setIsRecording(true);
    camera.current?.startRecording({
      onRecordingError(error) {
        // error occurred
        setIsRecording(false);
        console.log(error.name, error.message);
      },
      async onRecordingFinished(data) {
        // recording finished
        setIsRecording(false);
        const name = data.path.split('/').pop();
        const extension = name?.split('.').pop();
        const stats = await stat(data.path);
        const size = stats.size;
        navigation.replace('SendCapturedAttachment', {
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

  const Recording = () => (
    <View>
      <HStack>
        <Icon style={styles.icon} size={26} color='#f00' name='circle' />
        <Text>Recording</Text>
      </HStack>
    </View>
  );

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
      {isRecording ? (
        <View style={styles.recording}>
          <Recording />
        </View>
      ) : null}
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
  recording: {
    position: 'absolute',
    top: '4%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    zIndex: 1000,
    alignSelf: 'center',
  },
  icon: {
    marginRight: 10,
  },
});

export default CameraScreen;
