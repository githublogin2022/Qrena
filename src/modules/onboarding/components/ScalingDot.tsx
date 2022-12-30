import React from 'react';
import { View, Dimensions, Animated, StyleSheet, ViewStyle } from 'react-native';

export type ScalingDotProps = {
  data: Array<Object>;
  scrollX: Animated.Value;
  containerStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  inActiveDotOpacity?: number;
  inActiveDotColor?: string;
  activeDotScale?: number;
};

const ScalingDot = (props: ScalingDotProps) => {
  const { scrollX, data, dotStyle, containerStyle, inActiveDotColor, inActiveDotOpacity, activeDotScale } = props;
  const { width } = Dimensions.get('screen');

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      {data.map((item, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const activeDotBackgroundColor =
          dotStyle && dotStyle.backgroundColor
            ? dotStyle.backgroundColor.toString()
            : styles.dotStyle.backgroundColor.toString();
        const color = scrollX.interpolate({
          inputRange,
          outputRange: [
            inActiveDotColor || activeDotBackgroundColor,
            activeDotBackgroundColor,
            inActiveDotColor || activeDotBackgroundColor,
          ],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [inActiveDotOpacity || 0.4, 1, inActiveDotOpacity || 0.4],
          extrapolate: 'clamp',
        });

        const scale = scrollX.interpolate({
          inputRange: inputRange,
          outputRange: [1, activeDotScale || 1.4, 1],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dotStyle, { opacity }, { transform: [{ scale }] }, dotStyle, { backgroundColor: color }]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: { flexDirection: 'row', alignSelf: 'center' },
  dotStyle: {
    width: 11,
    height: 11,
    backgroundColor: '#347af0',
    borderRadius: 6,
    marginHorizontal: 5,
  },
});

export default ScalingDot;
