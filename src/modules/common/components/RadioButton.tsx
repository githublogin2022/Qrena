import React from 'react';
import { TouchableOpacity, View, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { useTypedSelector } from '../../../modules/app/hooks';

type RadioButtonProps = {
  onPress: ((event: GestureResponderEvent) => void) | ((event: GestureResponderEvent) => Promise<void>) | undefined;
  selected: boolean;
  label: string;
  containerStyle?: ViewStyle;
};

const RadioButton = (props: RadioButtonProps) => {
  const { selected, label, onPress, containerStyle } = props;
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <View style={[styles.Container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.RadioContainer,
          { backgroundColor: theme.colors.grey['100'], borderColor: theme.colors.grey['300'] },
        ]}
        onPress={onPress}>
        {selected ? <View style={[styles.RadioIconContainer, { backgroundColor: theme.colors.tertiary }]} /> : null}
      </TouchableOpacity>
      <Text variant='titleMedium' style={{ color: theme.colors.contrastText }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  RadioContainer: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  RadioIconContainer: { height: 14, width: 14, borderRadius: 7 },
});

export default RadioButton;
