import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//import Sound from 'react-native-sound';
//import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HStack } from 'react-native-flex-layout';
import Sound from 'react-native-sound';

type Props = {
  url: string;
};

const AudioPlayer = (props: Props) => {
  const { url } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  //var _onFinishedPlayingSubscription: null | EmitterSubscription = null;
  const sound = useRef<Sound>(
    new Sound(url, undefined, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else {
        setDuration(sound.current.getDuration());
      }
    })
  );

  useEffect(() => {
    console.log(url);
    //SoundPlayer.loadUrl(url);
    loadDuration();
    const interval = setInterval(async () => {
      sound.current.getCurrentTime((time) => {
        setCurrentTime(time);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [url]);

  const loadDuration = async () => {
    setDuration(sound.current.getDuration());
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // console.log(url);
    // if (_onFinishedPlayingSubscription === null) {
    //   SoundPlayer.play();
    //   _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
    //     console.log('finished playing', success);
    //     _onFinishedPlayingSubscription?.remove();
    //     _onFinishedPlayingSubscription = null;
    //     setIsPlaying(false);
    //   });
    // } else {
    //   SoundPlayer.resume();
    // }
    sound.current.play((success) => {
      if (success) {
        console.log('successfully finished playing');
        setIsPlaying(false);
      } else {
        console.log('playback failed due to audio decoding errors');
        setIsPlaying(false);
      }
    });
  };

  const handlePause = () => {
    //SoundPlayer.pause();
    sound.current.pause();
    setIsPlaying(false);
  };

  // const handleStop = () => {
  //   sound.current.stop();
  //   setIsPlaying(false);
  // };

  const handleSliderChange = (value: number) => {
    setCurrentTime(value);
    //SoundPlayer.seek(value);
    sound.current.setCurrentTime(value);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${paddedSeconds}`;
  };

  return (
    <View style={styles.container}>
      <HStack>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            isPlaying ? handlePause() : handlePlay();
          }}>
          <Icon color='#000' size={28} name={isPlaying ? 'pause' : 'play-arrow'} />
        </TouchableOpacity>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor='#000'
          maximumTrackTintColor='#000'
          thumbTintColor='#000'
        />
        <Text style={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 2,
  },
  slider: {
    marginVertical: 10,
    width: 100,
  },
  time: {
    textAlign: 'center',
    marginTop: 10,
    color: '#000',
  },
  icon: {
    paddingVertical: 6,
  },
});

export default AudioPlayer;
