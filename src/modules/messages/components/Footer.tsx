import React, { useRef, useState } from 'react';
import { HStack } from 'react-native-flex-layout';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import Attachment from './Attachment';
import { setAuthTokenService } from '../../app/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { read, receive } from '../actions';
import { useTypedDispatch } from '../../app/hooks';
import { FooterProps } from '../types';
import io from 'socket.io-client';

const Footer = (props: FooterProps) => {
  const { receiver, sender, chatId, receiverQrCode, senderQrCode } = props;
  const socket = io('13.232.69.252:5001');
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const dispatch = useTypedDispatch();

  const refreshMessages = async (body: string) => {
    // load messages
    await dispatch(
      read({
        userType: 'user',
        queries: `limit=20&receiver=${receiver?._id}&senderQrCode=${senderQrCode?._id}&receiverQrCode=${receiverQrCode?._id}`,
      })
    )
      .unwrap()
      .then(() => console.log('Function: ', body))
      .catch((error: any) => {
        console.log('Error', error);
      });
  };

  const send = async () => {
    console.log('text: ', text);
    if (text) {
      console.log('sending text');

      const token = await AsyncStorage.getItem('userToken');
      console.log('token:', token);
      setAuthTokenService(token);

      let data = JSON.stringify({
        sender: sender,
        receiver: receiver?._id,
        body: text,
        type: 'Text',
        receiverQrCode: receiverQrCode?._id,
        senderQrCode: senderQrCode?._id,
        chat: chatId,
      });

      let header = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      console.log('data: ', data);
      console.log('header: ', header);

      const response = await axios
        .post('/messages/?userType=user', data, header)
        .then((res) => {
          console.log(res.data);
          console.log(res.headers);
          socket.emit('send-message', { message: res.data });
          dispatch(receive({ userType: 'user', message: res.data }));
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

      await refreshMessages('send()');
    } else {
      console.log('text is empty');
    }
  };

  return (
    <HStack style={styles.footer}>
      <View style={styles.left}>
        <Attachment {...props} />
      </View>
      <View style={styles.middle}>
        <TextInput
          ref={inputRef}
          onChangeText={(value) => {
            console.log('text changed: ', value);
            setText(value);
            console.log('text: ', text);
          }}
          style={styles.input}
          placeholder='Message'
        />
      </View>
      <View style={styles.right}>
        <Button
          color='#79D44E'
          title='Send'
          onPress={() => {
            inputRef.current?.clear();
            send();
          }}
        />
      </View>
    </HStack>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 60,
    alignItems: 'center',
    //verticalAlign: 'middle',
    //alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  left: { width: '5%' },
  right: { width: '25%', marginStart: '5%' },
  middle: { width: '60%', marginStart: '5%' },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 1,
  },
});

export default Footer;
