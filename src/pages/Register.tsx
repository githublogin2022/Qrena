import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { Formik, Field, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { create } from '../modules/auth/actions';
import { TextField, Button } from '../modules/common/components';
import { useTypedDispatch, useTypedSelector } from '../modules/app/hooks';
import { RootStackParams } from '../modules/app/types';

type Data = {
  firstName: string;
  lastName: string;
};

const Register = () => {
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootStackParams, 'Register'>>();
  const {
    loader: { actions },
    phoneOtp: { phoneOtp },
    theme: { theme },
  } = useTypedSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  const handleOnSubmit = async (data: Data, { setErrors, setSubmitting }: FormikHelpers<Data>) => {
    await dispatch(
      create({
        userType: 'phoneOtp',
        user: {
          ...data,
          phoneNumber: phoneOtp?.phoneNumber,
          displayName: `${data.firstName} ${data.lastName}`,
          token: route.params.token,
          platform: route.params.platform,
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor='transparent' />
      <View style={styles.contentContainer}>
        <Text variant='titleLarge' style={[styles.title, { color: theme.colors.contrastText }]}>
          {t('register_title_text')}
        </Text>
        <Formik
          initialValues={
            __DEV__
              ? {
                  firstName: 'Mohamed',
                  lastName: 'Hollander',
                }
              : {
                  firstName: '',
                  lastName: '',
                }
          }
          validationSchema={yup.object({
            firstName: yup.string().required("First name can't be blank."),
            lastName: yup.string().required("Last name can't be blank."),
          })}
          onSubmit={(data, helpers) => handleOnSubmit(data, helpers)}>
          {({ submitForm }) => (
            <>
              <View style={styles.fieldsContainer}>
                <Field
                  component={TextField}
                  name='firstName'
                  autoFocus
                  style={styles.textField}
                  theme={{ roundness: 12 }}
                />
                <Field component={TextField} name='lastName' style={styles.textField} theme={{ roundness: 12 }} />
              </View>

              <Button
                mode='contained'
                loading={actions.includes('userCreate')}
                LinearGradientProps={{
                  style: { borderRadius: 30, width: 350, alignSelf: 'center' },
                  colors: ['#1897D3', '#79D44E'],
                  useAngle: true,
                  angle: 170,
                  locations: [0, 1],
                }}
                contentStyle={styles.buttonContainer}
                style={styles.button}
                labelStyle={[styles.buttonLabel, { ...theme.typescale.titleMedium }]}
                onPress={submitForm}>
                {t('register_register_button_text_button')}
              </Button>
            </>
          )}
        </Formik>
      </View>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={styles.snackbarText}> {snackbarMessage} </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { marginTop: 150, paddingHorizontal: 40 },
  title: { textAlign: 'center', marginBottom: 15 },
  fieldsContainer: { marginBottom: 15 },
  textField: { backgroundColor: 'rgba(255, 255, 255, 1)' },
  buttonContainer: { height: 52 },
  button: { width: 350, backgroundColor: 'transparent' },
  buttonLabel: { color: 'white', fontWeight: 'bold' },
  snackbarText: { textAlign: 'center' },
});

export default Register;
