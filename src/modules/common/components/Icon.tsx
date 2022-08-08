import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  name: string;
  focused: boolean;
  size?: number;
}

const Icon: React.FC<IconProps> = (props) => {
  const { name, size, focused, ...rest } = props;

  MaterialCommunityIcons.loadFont();

  return (
    <MaterialCommunityIcons
      name={name}
      size={size || 30}
      style={focused ? styles.primary : styles.secondary}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  primary: {
    color: 'blue',
  },
  secondary: {
    color: 'black',
  },
});

export default Icon;
