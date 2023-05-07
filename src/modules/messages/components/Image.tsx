import React from 'react';

import { StyleSheet, View, Image as ImageTag } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../app/types';

import { Attachment as ImageType } from '../types';
import { TouchableRipple } from 'react-native-paper';
import { useTypedNavigation } from '../../app/hooks';

type ImageProps = ImageType;

const Image = (props: ImageProps) => {
  const baseUrl = 'http://13.232.69.252:5001';
  const {
    params: { chatId },
  } = useRoute<RouteProp<RootStackParams, 'Messages'>>();
  const { side, fileName } = props;
  const url = `${baseUrl}/${chatId}/image/${fileName}`;
  const navigation = useTypedNavigation();

  return (
    <>
      <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
        <TouchableRipple
          onPress={() => {
            console.log('pressed: ', url);
            navigation.navigate('Image', { url: url, fileName: fileName });
          }}>
          <ImageTag style={styles.image} source={{ uri: url }} />
        </TouchableRipple>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
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
  image: {
    width: 200,
    height: 200,
  },
});

export default Image;
