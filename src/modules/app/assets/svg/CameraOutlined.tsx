import * as React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

type CameraOutlinedProps = SvgProps;

const CameraOutlined = (props: CameraOutlinedProps) => {
  const { width, height, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox='0 0 24 24' fill='none' {...rest}>
      <Path d='M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z' stroke='#fff' />
      <Circle cx={12} cy={13} r={4} stroke='#fff' />
    </Svg>
  );
};

export default CameraOutlined;
