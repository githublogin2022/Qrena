import React from 'react';

import { StyleSheet, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../modules/app/types';
import VideoPlayer from 'react-native-video-controls';

const VideoView = () => {
  const {
    params: { url, fileName },
  } = useRoute<RouteProp<RootStackParams, 'Video'>>();

  return (
    <>
      {console.log(fileName)}
      <View style={styles.container}>
        <VideoPlayer disableFullscreen disableBack disableVolume style={styles.video} source={{ uri: url }} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  video: {
    width: '80%',
    height: '100%',
  },
});

export default VideoView;
