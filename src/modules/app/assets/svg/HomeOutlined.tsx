import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

type HomeFilledProps = SvgProps;

const HomeFilled = (props: HomeFilledProps) => {
  const { width, height, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox='0 0 64 64' {...rest}>
      <Path
        d='M53.09 30.82a1.5 1.5 0 00-.09-2.09l-4.3-3.85-15.7-14a1.5 1.5 0 00-2 0l-15.66 14L11 28.73a1.59 1.59 0 00-.49 1 1.52 1.52 0 001.19 1.59c0 .05 3 0 3.1 0V52a1.5 1.5 0 001.5 1.5h10.15A1.5 1.5 0 0028 52V39.56h8.1V52a1.5 1.5 0 001.5 1.5h10.06a1.5 1.5 0 001.5-1.5V31.35H52a1.48 1.48 0 001.09-.53zm-14 19.68V38.06a1.5 1.5 0 00-1.5-1.5H26.45a1.5 1.5 0 00-1.5 1.5V50.5h-7.11V29.85a1.57 1.57 0 00-1.84-1.5l1.38-1.23L32 14l14.66 13.12L48 28.35a1.58 1.58 0 00-1.88 1.51V50.5z'
        data-name='Layer 38'
        fill='#fff'
      />
    </Svg>
  );
};

export default HomeFilled;
