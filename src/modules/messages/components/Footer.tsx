import React, { useRef, useState } from 'react';
import { HStack } from 'react-native-flex-layout';
import { View, StyleSheet, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import Attachment from './Attachment';
import { setAuthTokenService } from '../../app/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { read, receive } from '../actions';
import { useTypedDispatch } from '../../app/hooks';
import { FooterProps } from '../types';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import { stat } from 'react-native-fs';
import { toast } from '@backpackapp-io/react-native-toast';

type FileType = {
  uri: string;
  type: string;
  name?: string;
  fileName?: string;
  size?: number;
};

const Footer = (props: FooterProps) => {
  const { receiver, sender, chatId, receiverQrCode, senderQrCode } = props;
  const socket = io('13.232.69.252:5001');
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const dispatch = useTypedDispatch();
  const [showSendButton, setShowSendButton] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(true);
  const [showAudioPlayView, setShowAudioPlayView] = useState(false);
  const [showPlay, setShowPlay] = useState(true);
  //const [isLoggingIn, setIsLoggingIn] = useState(false);
  //const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  //const [currentPositionSec, setCurrentPositionSec] = useState(0);
  //const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const [audioUri, setAudioUri] = useState('');
  const audioRecorderPlayer = useRef<AudioRecorderPlayer>(new AudioRecorderPlayer());

  // const refreshMessages = async (body: string) => {
  //   // load messages
  //   console.log('function: ', body);
  //   await dispatch(
  //     read({
  //       userType: 'user',
  //       queries: `limit=10&receiver=${receiver?._id}&senderQrCode=${senderQrCode?._id}&receiverQrCode=${receiverQrCode?._id}`,
  //     })
  //   )
  //     .unwrap()
  //     .catch((error: any) => {
  //       console.warn(error);
  //     });
  // };

  const onStartRecord = async () => {
    setPlayTime('00:00:00');
    setDuration('00:00:00');
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    console.log('audioSet', audioSet);
    const uri = await audioRecorderPlayer.current.startRecorder(undefined, audioSet);
    audioRecorderPlayer.current.addRecordBackListener((e) => {
      //setRecordSecs(e.currentPosition);
      console.log('currentMetering', e.currentMetering);
      console.log('currentPosition', e.currentPosition);
      setRecordTime(audioRecorderPlayer.current.mmssss(e.currentPosition / 100));
      setDuration(audioRecorderPlayer.current.mmssss(e.currentPosition / 100));
    });
    console.log(`started recording uri: ${uri}`);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
    //setRecordSecs(0);
    setRecordTime('00:00:00');
    setShowSendButton(true);
    setAudioUri(result);
    console.log('stopped recording result: ', result);
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.current.startPlayer();
    setShowPlay(false);
    audioRecorderPlayer.current.setVolume(1.0);
    console.log(msg);
    audioRecorderPlayer.current.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        console.log('finished playing');
        audioRecorderPlayer.current.stopPlayer();
        setShowPlay(true);
      }
      // setCurrentPositionSec(e.currentPosition);
      // setCurrentDurationSec(e.duration);
      console.log('duration', e.duration);
      console.log('currentPosition', e.currentPosition);
      setPlayTime(audioRecorderPlayer.current.mmssss(Math.floor(e.currentPosition / 100)));
      setDuration(audioRecorderPlayer.current.mmssss(Math.floor(e.duration / 100)));
    });
  };

  const onPausePlay = async () => {
    setShowPlay(true);
    await audioRecorderPlayer.current.pausePlayer();
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    setShowPlay(true);
    setPlayTime('00:00:00');
    await audioRecorderPlayer.current.stopPlayer();
    audioRecorderPlayer.current.removePlayBackListener();
  };

  const send = async () => {
    toast('Sending...', { duration: 2000 });
    if (duration.toLowerCase().trim() === '00:00:00') {
      // send text
      sendText();
    } else {
      // send audio
      const stats = await stat(audioUri);
      const size = stats.size;
      const name = audioUri.split('/').pop();
      const extension = name?.split('.').pop();
      let newUri: string = audioUri;
      if (audioUri.trim().startsWith('file:\/\/\/\/')) {
        newUri = audioUri.replace('\/\/\/\/', '\/\/\/');
      }
      const audioFile: FileType = {
        uri: newUri,
        type: `audio/${extension}`,
        name,
        fileName: name,
        size,
      };
      console.log('audioFile: ', audioFile);
      sendAudio(audioFile);
    }
  };

  const sendText = async () => {
    if (text) {
      const token = await AsyncStorage.getItem('userToken');

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

      await axios
        .post('/messages/?userType=user', data, header)
        .then((res) => {
          socket.emit('send-message', { message: res.data });
          dispatch(receive({ userType: 'user', message: res.data }));
        })
        .catch((error) => {
          console.warn(error);
          toast("Couldn't send", { duration: 2500 });
        });
      //await refreshMessages('send()');
    }
  };

  const sendAudio = async (file: FileType) => {
    const token = await AsyncStorage.getItem('userToken');

    setAuthTokenService(token);

    var data = new FormData();
    data.append('type', 'recording');
    data.append('body', 'voice note');
    data.append('chat', chatId);
    data.append('receiver', receiver?._id);
    data.append('receiverQrCode', receiverQrCode?._id);
    data.append('senderQrCode', senderQrCode?._id);
    data.append('files', file);
    console.log('sendAudio data: ', data);

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
        toast("Couldn't send", { duration: 2500 });
        if (typeof error === 'string') {
          console.warn(error);
        } else if (error instanceof Error) {
          let message = error.message;
          console.warn(message);
        } else {
          console.warn(error);
        }
      });
  };

  return (
    <HStack style={styles.footer}>
      <View style={styles.left}>
        <Attachment {...props} />
      </View>
      <View style={styles.middle}>
        {showMessageInput ? (
          <TextInput
            placeholderTextColor='grey'
            ref={inputRef}
            onChangeText={(value) => {
              setText(value);
              if (value.trim() === '') {
                setShowSendButton(false);
              } else {
                setShowSendButton(true);
              }
            }}
            style={styles.input}
            placeholder='Message'
          />
        ) : (
          <View>
            {showAudioPlayView ? (
              <HStack>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => {
                    // play/pause
                    showPlay ? onStartPlay() : onPausePlay();
                  }}>
                  <Icon color='#fff' size={35} name={showPlay ? 'play-arrow' : 'pause'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => {
                    // stop
                    onStopPlay();
                  }}>
                  <Icon color='#fff' size={35} name='stop' />
                </TouchableOpacity>
                <Text style={styles.playTime}>
                  {playTime} / {duration}
                </Text>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => {
                    // cancel the recording
                    setRecordTime('00:00:00');
                    setDuration('00:00:00');
                    setPlayTime('00:00:00');
                    setShowMessageInput(true);
                    setShowSendButton(false);
                    setAudioUri('');
                  }}>
                  <Icon color='#f00' size={35} name='cancel' />
                </TouchableOpacity>
              </HStack>
            ) : (
              <Text>{recordTime}</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.right}>
        {showSendButton ? (
          <Button
            color='#79D44E'
            title='Send'
            onPress={() => {
              inputRef.current?.clear();
              send();
              setShowMessageInput(true);
              setPlayTime('00:00:00');
              setDuration('00:00:00');
              setShowSendButton(false);
            }}
          />
        ) : (
          <View style={styles.iconButton}>
            <TouchableOpacity
              style={styles.icon}
              onPressOut={() => {
                onStopRecord();
                setShowAudioPlayView(true);
                setShowPlay(true);
              }}
              onLongPress={() => {
                setShowMessageInput(false);
                setShowAudioPlayView(false);
                onStartRecord();
              }}>
              <Icon color='#fff' size={35} name='mic' />
            </TouchableOpacity>
          </View>
        )}
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
    color: '#000',
  },
  iconButton: {
    backgroundColor: '#79D44E',
    borderRadius: 50,
    alignContent: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingVertical: 4,
  },
  playTime: {
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default Footer;
