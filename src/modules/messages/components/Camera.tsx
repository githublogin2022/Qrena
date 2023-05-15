import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../app/types';
import { useTypedNavigation } from '../../app/hooks';

import { stat } from 'react-native-fs';

const Camera = () => {
  const {
    params: { receiverId, receiverQrCode, senderQrCode, chatId },
  } = useRoute<RouteProp<RootStackParams, 'Camera'>>();
  const navigation = useTypedNavigation();

  // capture an image
  const takePicture = async (camera: RNCamera) => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    const name = data.uri.split('/').pop();
    const stats = await stat(data.uri);
    const size = stats.size;
    navigation.navigate('SendCapturedAttachment', {
      url: data.uri,
      name,
      size,
      type: 'image',
      receiverId,
      receiverQrCode,
      senderQrCode,
      chatId,
    });
  };

  // stop recording the video
  const stopRecording = async (camera: RNCamera) => {
    camera.stopRecording();
  };

  // start recording the video
  const takeVideo = async (camera: RNCamera) => {
    const data = await camera.recordAsync({ quality: '480p' });
    const name = data.uri.split('/').pop();
    const stats = await stat(data.uri);
    const size = stats.size;
    navigation.navigate('SendCapturedAttachment', {
      url: data.uri,
      name,
      size,
      type: 'video',
      receiverId,
      receiverQrCode,
      senderQrCode,
      chatId,
    });
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') {
            return <Text>Waiting</Text>;
          }
          return (
            <View style={styles.button}>
              <TouchableOpacity
                onLongPress={() => takeVideo(camera)}
                onPress={() => takePicture(camera)}
                onPressOut={() => stopRecording(camera)}
                style={styles.btnAlignment}>
                <Icon color='#fff' size={45} name='camera' />
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
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

export default Camera;
