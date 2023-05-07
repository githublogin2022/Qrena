import React from 'react';

import { Image, StyleSheet, View, Button } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../app/types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthTokenService } from '../../app/services';
import axios from 'axios';

import { useTypedNavigation, useTypedDispatch } from '../../app/hooks';
import { read, receive } from '../../messages/actions';
import io from 'socket.io-client';

type FileType = {
  uri: string;
  type: string;
  name?: string;
  fileName?: string;
  size?: number;
};

const SendCapturedAttachment = () => {
  const {
    params: { url, size, name, type, senderQrCode, receiverId, receiverQrCode, chatId },
  } = useRoute<RouteProp<RootStackParams, 'SendCapturedAttachment'>>();
  const socket = io('13.232.69.252:5001');
  const navigation = useTypedNavigation();
  const dispatch = useTypedDispatch();
  const typeToSend = type === 'image' ? 'image/jpeg' : 'video/mp4';
  const file: FileType = {
    uri: url,
    name,
    fileName: name,
    size,
    type: typeToSend,
  };

  const refreshMessages = async (body: string) => {
    // load messages
    await dispatch(
      read({
        userType: 'user',
        queries: `limit=20&receiver=${receiverId}&senderQrCode=${senderQrCode}&receiverQrCode=${receiverQrCode}`,
      })
    )
      .unwrap()
      .then(() => console.log('Function: ', body))
      .catch((error: any) => {
        console.log('Error', error);
      });
  };

  const sendAttachment = async () => {
    console.log('sending data');

    const token = await AsyncStorage.getItem('userToken');
    console.log('token:', token);
    setAuthTokenService(token);

    var data = new FormData();
    data.append('type', type);
    data.append('body', type);
    //data.append('chat', '64401482a576b5f95c4190ab');
    data.append('chat', chatId);
    //data.append('receiver', '643943106fbc522274fb1f21');
    data.append('receiver', receiverId);
    //data.append('receiverQrCode', '6440143078d713e3279f726c');
    //data.append('senderQrCode', '643fa5a61e35cd093b08dd45');
    data.append('receiverQrCode', receiverQrCode);
    data.append('senderQrCode', senderQrCode);
    data.append('files', file);

    let header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios
      .post('/messages/attachment?userType=user', data, header)
      .then((res) => {
        console.log(res.data);
        console.log(res);
        console.log(res.headers);
        socket.emit('send-message', { message: res.data });
        dispatch(receive({ userType: 'user', message: res.data }));
        refreshMessages('sendCapturedAttachment()');
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
        console.log(error.response.headers);
        if (typeof error === 'string') {
          console.log('string');
          console.log(error.toUpperCase());
        } else if (error instanceof Error) {
          console.log('exception');
          let message = error.message;
          console.log(message);
        } else {
          console.warn(error);
        }
      });
    console.log(response);
    navigation.goBack();
  };

  return (
    <View>
      {console.log('attachment type:', type)}
      {type === 'image' ? <Image style={styles.image} source={{ uri: url }} /> : null}
      {type === 'video' ? (
        <VideoPlayer
          disableFullscreen
          disableBack
          disableVolume
          style={styles.video}
          source={{ uri: url }}
          paused={false}
          controls={false}
        />
      ) : null}
      <View style={styles.button}>
        <Button color='#79D44E' onPress={() => sendAttachment()} title='Send' />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '96%',
  },
  video: {
    width: '100%',
    height: '96%',
  },
  button: {
    width: '100%',
    height: '4%',
  },
});

export default SendCapturedAttachment;
