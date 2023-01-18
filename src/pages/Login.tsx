import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Country } from 'react-native-country-picker-modal';
import { Snackbar, Text } from 'react-native-paper';
import { Formik, Field, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { isValidNumber } from 'react-native-phone-number-input';

import { create } from '../modules/phone-otp/actions';
import { useTypedDispatch, useTypedSelector } from '../modules/app/hooks';
import { PhoneField, Button } from '../modules/common/components';
import { useTypedNavigation } from '../modules/app/hooks';

type Data = { phoneNumber: string };

const Login = () => {
  const dispatch = useTypedDispatch();
  const navigation = useTypedNavigation();
  const [country, setCountry] = useState<Country>({
    callingCode: ['20'],
    cca2: 'EG',
    currency: ['EGP'],
    flag: 'flag-eg',
    name: 'Egypt',
    region: 'Africa',
    subregion: 'Northern Africa',
  });
  const { t } = useTranslation();
  const {
    loader: { actions },
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
    let errorFlag = false;
    await dispatch(
      create({
        userType: 'guest',
        phoneOtp: { phoneNumber: `+${country.callingCode[0]} ${data.phoneNumber}` },
      })
    )
      .unwrap()
      .catch((error) => {
        errorFlag = true;
        setSubmitting(false);
        if (error.errors) {
          return setErrors(error.errors);
        }
        error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
      });
    if (!errorFlag) {
      navigation.navigate('VerifyOtp');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor='transparent' />
      <View style={styles.contentContainer}>
        <Text variant='titleLarge' style={[styles.title, { color: theme.colors.contrastText }]}>
          {t('phone_number_login_title_text')}
        </Text>
        <Text variant='bodyLarge' style={[styles.body, { color: theme.colors.contrastText }]}>
          {t('phone_number_login_body_text')}
        </Text>
        <Formik
          initialValues={__DEV__ ? { phoneNumber: '1234567891' } : { phoneNumber: '' }}
          validationSchema={yup.object({
            phoneNumber: yup
              .string()
              .required("Phone number can't be blank.")
              .test('phone Number', "The phone number you've entered is invalid.", (phoneNumber: string | undefined) =>
                phoneNumber ? isValidNumber(phoneNumber, country.cca2) : false
              ),
          })}
          onSubmit={(data, helpers) => handleOnSubmit(data, helpers)}>
          {({ submitForm }) => (
            <>
              <Field
                component={PhoneField}
                name='phoneNumber'
                containerStyle={styles.phoneFieldContainerStyle}
                defaultCode='EG'
                autoFocus
                setCountry={setCountry}
              />
              <Button
                mode='contained'
                loading={actions.includes('phoneOtpCreate')}
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
                {t('phone_number_login_login_button')}
              </Button>
            </>
          )}
        </Formik>
      </View>
      <Snackbar style={{ backgroundColor: theme.colors.tertiary }} visible={visible} onDismiss={onDismissSnackBar}>
        <Text style={[styles.snackbarText, { color: theme.colors.white }]}> {snackbarMessage} </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { marginTop: 150, paddingHorizontal: 40 },
  title: { textAlign: 'center', marginBottom: 15 },
  body: { textAlign: 'center', marginBottom: 35 },
  phoneFieldContainerStyle: { marginBottom: 25 },
  buttonContainer: { height: 52 },
  button: { width: 350, backgroundColor: 'transparent' },
  buttonLabel: { color: 'white', fontWeight: 'bold' },
  snackbarText: { textAlign: 'center' },
});

export default Login;
