import React, { useState } from 'react';
import { FieldProps, getIn } from 'formik';
import {
  TextInput as PaperTextInput,
  HelperText as PaperHelperText,
  TextInputProps as PaperTextInputProps,
} from 'react-native-paper';

import { i18n } from '../../I18n';

export interface TextInputProps extends FieldProps, PaperTextInputProps {
  i18nKey: string;
}

const TextField: React.FC<TextInputProps> = (props) => {
  const {
    i18nKey,
    disabled,
    field: { name, onBlur, onChange, ...field },
    form: { isSubmitting, setFieldTouched, touched, errors },

    secureTextEntry,
    right,
    children,
    ...otherProps
  } = props;
  const fieldError = getIn(errors, name);
  const showError = getIn(touched, name) && !!fieldError;
  const [toggleSecure, setToggleSecure] = useState(false);

  const renderRightComponent = () => {
    if (secureTextEntry) {
      return (
        <PaperTextInput.Icon name={!toggleSecure ? 'eye' : 'eye-off'} onPress={() => setToggleSecure(!toggleSecure)} />
      );
    }

    return right ? right : null;
  };

  return (
    <>
      <PaperTextInput
        mode='outlined'
        label={i18n.t(i18nKey)}
        error={showError}
        disabled={disabled ?? isSubmitting}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name);
          onBlur(name);
        }}
        secureTextEntry={toggleSecure ? false : secureTextEntry}
        right={renderRightComponent()}
        {...field}
        {...otherProps}>
        {children}
      </PaperTextInput>

      <PaperHelperText type='error' visible={showError}>
        {fieldError}
      </PaperHelperText>
    </>
  );
};

export default TextField;
