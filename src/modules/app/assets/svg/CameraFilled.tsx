import * as React from 'react';
import Svg, { Path, G, SvgProps } from 'react-native-svg';

type CameraFilledProps = SvgProps;

const CameraFilled = (props: CameraFilledProps) => {
  const { width, height, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox='0 0 20 18' {...rest}>
      <G transform='translate(-238 -2770) translate(100 2626) translate(136 142)'>
        <Path d='M0 0L24 0 24 24 0 24z' />
        <Path
          d='M12 15a3 3 0 110-6 3 3 0 010 6zm8-11c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h3.17L8.4 2.65c.38-.41.92-.65 1.48-.65h4.24c.56 0 1.1.24 1.47.65L16.83 4H20zm-8 13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z'
          fill='#fff'
        />
      </G>
    </Svg>
  );
};

export default CameraFilled;
