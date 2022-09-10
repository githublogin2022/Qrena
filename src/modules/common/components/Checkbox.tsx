import React from 'react';
import { FieldProps } from 'formik';
import { Checkbox as PaperCheckbox, CheckboxProps as PaperCheckboxProps } from 'react-native-paper';

export interface CheckboxProps extends FieldProps, PaperCheckboxProps {
  i18nKey: string;
}
const Checkbox: React.FC<CheckboxProps> = (props) => {
  const {
    disabled,
    field: { name, value, ...field },
    form: { isSubmitting, setFieldValue },
    ...otherProps
  } = props;

  return (
    <PaperCheckbox
      {...field}
      {...otherProps}
      disabled={disabled ?? isSubmitting}
      onPress={() => setFieldValue(name, !value)}
      color='red'
      status={value ? 'checked' : 'unchecked'}
    />
  );
};

export default Checkbox;
