import React from 'react';
import { Attachment as AudioType } from '../types';
import { StyleSheet, View } from 'react-native';
import { HStack } from 'react-native-flex-layout';
import AudioPlayer from './AudioPlayer';
import { getBaseUrl } from '../../app/utils/getUrl';

type AudioProps = AudioType;

const AudioView = (props: AudioProps) => {
  //const baseUrl = 'http://13.232.69.252:5001';
  const baseUrl = getBaseUrl();
  const { side, fileName, type, chat } = props;
  const url = `${baseUrl}/${chat}/${type}/${fileName}`;
  const audioProps = { url };

  return (
    <>
      <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
        <HStack>
          <AudioPlayer {...audioProps} />
        </HStack>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    maxWidth: '75%',
    marginHorizontal: 8,
  },
  containerLeft: {
    paddingRight: 8,
    paddingLeft: 16,
    backgroundColor: 'grey',
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  containerRight: {
    paddingRight: 16,
    paddingLeft: 8,
    backgroundColor: '#79D44E',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
});

export default AudioView;
