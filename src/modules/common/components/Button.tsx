import React from 'react';
import {
  Button as ReactNativePaperButton,
  ButtonProps as ReactNativePaperButtonProps,
  Theme,
} from 'react-native-paper';
import LinearGradient, { LinearGradientProps as ReactNativeLinearGradientProps } from 'react-native-linear-gradient';

type ButtonProps = Omit<ReactNativePaperButtonProps, 'theme'> & {
  LinearGradientProps?: ReactNativeLinearGradientProps;
  theme?: Theme;
};

const Button = ({ LinearGradientProps, children, ...rest }: ButtonProps) => {
  if (LinearGradientProps?.colors) {
    return (
      <LinearGradient {...LinearGradientProps}>
        <ReactNativePaperButton {...rest}>{children}</ReactNativePaperButton>
      </LinearGradient>
    );
  }

  return <ReactNativePaperButton {...rest}>{children}</ReactNativePaperButton>;
};

export default Button;
