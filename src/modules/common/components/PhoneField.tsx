import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FieldProps, getIn } from 'formik';
import { Country } from 'react-native-country-picker-modal';
import PhoneInput, { PhoneInputProps } from 'react-native-phone-number-input';

import { useTypedSelector } from '../../app/hooks';

export type TextInputProps = FieldProps & PhoneInputProps & { setCountry: (countryCode: Country) => void };

const PhoneField = (props: TextInputProps) => {
  const {
    containerStyle,
    setCountry,
    field: { name, onChange, ...field },
    form: { errors },
    ...otherProps
  } = props;
  const theme = useTypedSelector((state) => state.theme.theme);

  const helperText = getIn(errors, name);

  return (
    <View style={containerStyle}>
      <PhoneInput
        containerStyle={[
          styles.PhoneInputContainer,
          {
            backgroundColor: theme.dark ? theme.colors.grey['50'] : theme.colors.grey['300'],
          },
        ]}
        textContainerStyle={[
          styles.textContainer,
          { backgroundColor: theme.dark ? theme.colors.grey['50'] : theme.colors.grey['300'] },
        ]}
        textInputStyle={[
          styles.textInput,
          { backgroundColor: theme.dark ? theme.colors.grey['50'] : theme.colors.grey['300'] },
        ]}
        onChangeCountry={(country) => setCountry(country)}
        onChangeText={(text) => onChange(name)(text)}
        {...field}
        {...otherProps}
      />
      {helperText && <Text style={[styles.helperText, { color: theme.colors.error }]}>{helperText} </Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  PhoneInputContainer: { height: 55, borderRadius: 12 },
  textContainer: { borderRadius: 12 },
  textInput: { height: 55 },
  helperText: { marginTop: 10, textAlign: 'center' },
});

export default PhoneField;
