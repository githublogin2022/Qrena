import React from 'react';

import { Image, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../modules/app/types';

const ImageView = () => {
  const {
    params: { url, fileName },
  } = useRoute<RouteProp<RootStackParams, 'Image'>>();

  return (
    <>
      {console.log(fileName)}
      <Image style={styles.image} source={{ uri: url }} />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageView;
