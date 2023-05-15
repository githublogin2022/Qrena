import React, { useState } from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../app/types';

import { Attachment as VideoType } from '../types';
import { Button } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import { useTypedNavigation } from '../../app/hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBaseUrl } from '../../app/utils/getUrl';

type VideoProps = VideoType;

const VideoTag = (props: VideoProps) => {
  //const baseUrl = 'http://13.232.69.252:5001';
  const baseUrl = getBaseUrl();
  const {
    params: { chatId },
  } = useRoute<RouteProp<RootStackParams, 'Messages'>>();
  const { side, fileName } = props;
  const url = `${baseUrl}/${chatId}/video/${fileName}`;
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useTypedNavigation();

  return (
    <>
      <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
        <View>
          <VideoPlayer
            disablePlayPause
            disableFullscreen
            disableBack
            disableVolume
            disableSeekbar
            style={styles.video}
            source={{ uri: url }}
            paused={!isPlaying}
            controls={false}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => {
              console.log('video player clicked');
              navigation.navigate('Video', { url: url, fileName: fileName });
            }}>
            <Icon color='#fff' size={36} name='play-circle-outline' />
          </TouchableOpacity>
        </View>
        <Button color='#79D44E' onPress={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause' : 'Play'} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 4,
    paddingTop: 8,
    maxWidth: '70%',
    marginHorizontal: 8,
  },
  containerLeft: {
    backgroundColor: 'grey',
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  containerRight: {
    backgroundColor: '#79D44E',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  video: {
    width: 200,
    height: 200,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
    top: 82,
  },
});

export default VideoTag;
