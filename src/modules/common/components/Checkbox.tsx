import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  Dimensions,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { FieldProps, getIn } from 'formik';
import CommunityCheckBox, { CheckBoxProps } from '@react-native-community/checkbox';

import { useTypedSelector } from '../../app/hooks';

export type CheckboxProps = FieldProps &
  CheckBoxProps & {
    color?: 'primary';
    label?: string;
    containerStyle?: ViewStyle;
    labelProps?: TouchableOpacityProps;
    labelStyle?: TextStyle;
    helperTextStyle?: TextStyle;
  };

const Checkbox = (props: CheckboxProps) => {
  const {
    label,
    disabled,
    containerStyle,
    labelStyle,
    helperTextStyle,
    labelProps,
    field: { name, value },
    form: { isSubmitting, setFieldValue, errors },
    ...rest
  } = props;
  const helperText = getIn(errors, name);
  const { width } = Dimensions.get('screen');
  const theme = useTypedSelector((state) => state.theme.theme);

  return (
    <>
      <View style={[styles.container, ...[{ marginBottom: helperText ? 8 : 26, width: width / 2 }], containerStyle]}>
        <CommunityCheckBox
          disabled={disabled ?? isSubmitting}
          onValueChange={(nextValue) => setFieldValue(name, nextValue)}
          value={value}
          onAnimationType='bounce'
          offAnimationType='bounce'
          animationDuration={0}
          boxType='square'
          onCheckColor={theme.colors.background}
          onFillColor={theme.dark ? theme.colors.contrastText : theme.colors.grey['600']}
          onTintColor={theme.dark ? theme.colors.grey['300'] : theme.colors.grey['600']}
          tintColors={{
            true: theme.dark ? theme.colors.grey['300'] : theme.colors.grey['600'],
            false: theme.dark ? theme.colors.grey['300'] : theme.colors.grey['600'],
          }}
          {...rest}
        />
        {label && (
          <TouchableOpacity disabled={labelProps?.onPress ? false : true} {...labelProps}>
            <Text style={[{ color: theme.colors.contrastText }, labelStyle]}>{label}</Text>
          </TouchableOpacity>
        )}
      </View>
      {helperText && (
        <Text style={[styles.helperText, { color: theme.colors.error }, helperTextStyle]}>{helperText} </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  helperText: { marginTop: 3, marginBottom: 23, marginLeft: 12 },
});

export default Checkbox;
