import React from 'react';

import { Image, StyleSheet, View, Button } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../app/types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthTokenService } from '../../app/services';
import axios from 'axios';

import { useTypedNavigation, useTypedDispatch } from '../../app/hooks';
import { receive } from '../../messages/actions';
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

  // const refreshMessages = async (body: string) => {
  //   // load messages
  //   console.log('function: ', body);
  //   await dispatch(
  //     read({
  //       userType: 'user',
  //       queries: `limit=10&receiver=${receiverId}&senderQrCode=${senderQrCode}&receiverQrCode=${receiverQrCode}`,
  //     })
  //   )
  //     .unwrap()
  //     .catch((error: any) => {
  //       console.warn(error);
  //     });
  // };

  const sendAttachment = async () => {
    const token = await AsyncStorage.getItem('userToken');

    setAuthTokenService(token);

    var data = new FormData();
    data.append('type', type);
    data.append('body', type);
    data.append('chat', chatId);
    data.append('receiver', receiverId);
    data.append('receiverQrCode', receiverQrCode);
    data.append('senderQrCode', senderQrCode);
    data.append('files', file);
    console.log('send captured attachment file: ', file);
    console.log('send captured attachment data: ', data);

    let header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    await axios
      .post('/messages/attachment?userType=user', data, header)
      .then((res) => {
        socket.emit('send-message', { message: res.data });
        dispatch(receive({ userType: 'user', message: res.data }));
        //refreshMessages('sendCapturedAttachment()');
      })
      .catch((error) => {
        if (typeof error === 'string') {
        } else if (error instanceof Error) {
          let message = error.message;
          console.warn(message);
        } else {
          console.warn(error);
        }
      });

    navigation.goBack();
  };

  const multiMedia = () => {
    console.log('url: ', url);
    if (type === 'image') {
      return <Image style={styles.image} source={{ uri: url }} />;
    } else if (type === 'video') {
      return (
        <VideoPlayer
          disableFullscreen
          disableBack
          disableVolume
          style={styles.video}
          source={{ uri: url }}
          paused={false}
          controls={false}
        />
      );
    }
  };

  return (
    <View>
      <View>
        {console.log('type: ', type)}
        {console.log('image: ', type === 'image')}
        {console.log('video: ', type === 'video')}
        {multiMedia()}
        <View style={styles.button}>
          <Button color='#79D44E' onPress={() => sendAttachment()} title='Send' />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '95%',
  },
  video: {
    width: '100%',
    height: '95%',
  },
  button: {
    width: '100%',
    height: '5%',
  },
});

export default SendCapturedAttachment;
