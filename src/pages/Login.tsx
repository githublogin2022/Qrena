import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { Card, Button, Snackbar } from 'react-native-paper';
import { Formik, Field, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { login } from '../modules/auth/authActions';
import { hooks } from '../modules/redux';
import { Checkbox, TextInput } from '../modules/common/components';
import { i18n } from '../modules/I18n';
import { firebase } from '../modules/common/services';

interface Data {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: () => JSX.Element = () => {
  const dispatch = hooks.useTypedDispatch();
  const {
    loader: { actions },
  } = hooks.useTypedSelector((state) => state);
  const [notificationToken, setNotificationToken] = useState<string | undefined>('');
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await firebase.requestUserPermission();

        setNotificationToken(token);
      } catch (_error) {
        const error = _error as { name: string; message: string };
        console.log(error);
      }
    })();
  }, []);

  const handleLogin = (data: Data, { setErrors, setSubmitting }: FormikHelpers<Data>) => {
    dispatch(
      login({
        userType: 'guest',
        user: {
          email: data.email,
          password: data.password,
          token: notificationToken,
          platform: Platform.OS === 'ios' ? 'Ios' : 'Android',
        },
      })
    )
      .unwrap()
      .catch((error) => {
        setSubmitting(false);
        if (error.errors) {
          return setErrors(error.errors);
        }
        error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
      });
  };

  return (
    <>
      <Card>
        <Card.Content>
          <Formik
            initialValues={
              __DEV__
                ? { email: 'user1@qrena.com', password: 'qrenaapp', rememberMe: true }
                : { email: '', password: '', rememberMe: false }
            }
            validationSchema={yup.object({
              email: yup
                .string()
                .required("Email address can't be blank.")
                .email("The email address you've entered is invalid."),
              password: yup
                .string()
                .required("Password can't be blank.")
                .min(8, 'Your password must be at least 8 characters long.'),
            })}
            onSubmit={(data, helpers) => handleLogin(data, helpers)}>
            {({ submitForm }) => (
              <>
                <Field component={TextInput} name='email' i18nKey='login_email' />
                <Field component={TextInput} name='password' i18nKey='login_password' secureTextEntry />
                <Field component={Checkbox} name='rememberMe' />
                <Button loading={actions.includes('login')} onPress={submitForm}>
                  {i18n.t('login_login_button')}
                </Button>
              </>
            )}
          </Formik>
        </Card.Content>
      </Card>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={styles.snackbarText}> {snackbarMessage} </Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  snackbarText: {
    textAlign: 'center',
  },
});

export default Login;
