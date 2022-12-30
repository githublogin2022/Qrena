import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

type HomeFilledProps = SvgProps;

const HomeFilled = (props: HomeFilledProps) => {
  const { width, height, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox='0 0 64 64' {...rest}>
      <Path
        d='M53.45 29.79a1.51 1.51 0 00-.45-1.06l-4.3-3.85-15.7-14a1.5 1.5 0 00-2 0l-15.66 14L11 28.73a1.54 1.54 0 00-.49 1 1.52 1.52 0 001.19 1.59c0 .05 3 0 3.1 0V52a1.5 1.5 0 001.5 1.5h10.15A1.5 1.5 0 0028 52V39.56h8.1V52a1.5 1.5 0 001.5 1.5h10.06a1.5 1.5 0 001.5-1.5V31.35h3.1a1.51 1.51 0 001.19-1.56z'
        data-name='Layer 38'
        fill='#fff'
      />
    </Svg>
  );
};

export default HomeFilled;
