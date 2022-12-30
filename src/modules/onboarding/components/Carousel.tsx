import React, { useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  StyleSheet,
  FlatList,
  Image,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
  TextStyle,
} from 'react-native';

import ScalingDot from './ScalingDot';
import { useTypedSelector } from '../../app/hooks';

export type CarouselProps = {
  data: { imageUrl: ImageSourcePropType; text?: string | null; imageStyle?: ImageStyle }[];
  disableIndicator?: boolean;
  flatListStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  textStyle?: TextStyle;
  scalingDotContainerStyle?: ViewStyle;
};

const Carousel = (props: CarouselProps) => {
  const { data, disableIndicator, flatListStyle, contentContainerStyle, textStyle, scalingDotContainerStyle } = props;
  const theme = useTypedSelector((state) => state.theme.theme);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('screen');

  return (
    <>
      <FlatList
        style={[styles.flatList, flatListStyle]}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        data={data}
        renderItem={({ item }) => (
          <View style={[{ width }, contentContainerStyle]}>
            <Image source={item.imageUrl} resizeMode='contain' style={[styles.image, item.imageStyle]} />
            {item.text && (
              <Text
                style={[styles.text, { ...theme.typescale.titleLarge, color: theme.colors.contrastText }, textStyle]}>
                {item.text}
              </Text>
            )}
          </View>
        )}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
      />
      {!disableIndicator && (
        <ScalingDot
          data={data}
          scrollX={scrollX}
          containerStyle={{ ...styles.scalingDotContainer, ...scalingDotContainerStyle }}
          dotStyle={styles.dotStyle}
          inActiveDotColor={theme.dark ? theme.colors.grey['100'] : theme.colors.grey['700']}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: { overflow: 'visible', width: '100%', height: 300 },
  text: { textAlign: 'center', marginHorizontal: 10 },
  flatList: { flexGrow: 0, marginBottom: 30 },
  scalingDotContainer: { marginBottom: 20 },
  dotStyle: { backgroundColor: '#FFFFFF', borderWidth: 0.9, borderColor: 'rgba(97, 97, 97, 1)' },
});

export default Carousel;
