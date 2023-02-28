import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { Formik, Field, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { userLogin, phoneOtpLogin } from '../modules/auth/actions';
import { resend } from '../modules/phone-otp/actions';
import { useTypedDispatch, useTypedSelector } from '../modules/app/hooks';
import { TextField, Button } from '../modules/common/components';
import { useTypedNavigation } from '../modules/app/hooks';
import { firebase } from '../modules/notifications/services';
import { getCount } from '../modules/notifications/actions';

type Data = { otp: string };

const VerifyOtp = () => {
  const dispatch = useTypedDispatch();
  const navigation = useTypedNavigation();
  const { t } = useTranslation();
  const {
    loader: { actions },
    phoneOtp: { phoneOtp },
    theme: { theme },
  } = useTypedSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');
  const [notificationToken, setNotificationToken] = useState<string | undefined>('');
  const loading =
    actions.includes('userLogin') || actions.includes('phoneOtpLogin') || actions.includes('phoneOtpResend');

  useEffect(() => {
    (async () => {
      try {
        const token = await firebase.requestUserPermission();

        setNotificationToken(token);
      } catch (_error) {}
    })();
  }, []);

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  const handleOnSubmit = async (data: Data, { setErrors, setSubmitting }: FormikHelpers<Data>) => {
    let errorFlag = false;

    try {
      if (phoneOtp?.status === 'New') {
        await dispatch(
          phoneOtpLogin({
            userType: 'guest',
            phoneOtp: { ...data, phoneNumber: phoneOtp.phoneNumber },
          })
        ).unwrap();
      } else {
        await dispatch(
          userLogin({
            userType: 'guest',
            user: {
              ...data,
              phoneNumber: phoneOtp?.phoneNumber,
              token: notificationToken,
              platform: Platform.OS === 'ios' ? 'Ios' : 'Android',
            },
          })
        ).unwrap();
        await dispatch(getCount({ userType: 'user', queries: 'status=unread' })).unwrap();
      }
    } catch (error: any) {
      errorFlag = true;
      setSubmitting(false);
      if (error.errors) {
        return setErrors(error.errors);
      }

      error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
    }

    if (!errorFlag && phoneOtp?.status === 'New') {
      navigation.navigate('Register', {
        token: notificationToken,
        platform: Platform.OS === 'ios' ? 'Ios' : 'Android',
      });
    }
  };

  const handleResend = async () => {
    if (phoneOtp && phoneOtp.phoneNumber) {
      await dispatch(
        resend({
          userType: 'guest',
          phoneOtp: { phoneNumber: phoneOtp.phoneNumber },
        })
      )
        .unwrap()
        .catch((error) => {
          error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
        });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor='transparent' />
      <View style={styles.contentContainer}>
        <Text variant='titleLarge' style={[styles.title, { color: theme.colors.contrastText }]}>
          {t('verify_otp_title_text')}
        </Text>
        <Text variant='bodyLarge' style={[styles.body, { color: theme.colors.contrastText }]}>
          {t('verify_otp_body_text')}
        </Text>
        <Formik
          initialValues={{ otp: '' }}
          validationSchema={yup.object({
            otp: yup.string().required("OTP can't be blank.").length(4, 'Your OTP must be 4 characters long.'),
          })}
          onSubmit={(data, helpers) => handleOnSubmit(data, helpers)}>
          {({ submitForm }) => (
            <>
              <View style={styles.textFieldContainer}>
                <Field
                  component={TextField}
                  name='otp'
                  autoFocus
                  style={styles.textField}
                  theme={{ roundness: 12 }}
                  keyboardType='number-pad'
                />
              </View>

              <Button
                mode='contained'
                loading={loading}
                disabled={loading}
                LinearGradientProps={{
                  style: { borderRadius: 30, width: 350, alignSelf: 'center' },
                  colors: ['#1897D3', '#79D44E'],
                  useAngle: true,
                  angle: 170,
                  locations: [0, 1],
                }}
                contentStyle={styles.buttonContainer}
                style={styles.button}
                labelStyle={[styles.buttonLabel, { ...theme.typescale.titleMedium, color: theme.colors.white }]}
                onPress={submitForm}>
                {t('verify_otp_verify_button_text_button')}
              </Button>
            </>
          )}
        </Formik>

        <TouchableOpacity onPress={handleResend}>
          <Text variant='bodyLarge' style={[styles.titleBottom, { color: theme.colors.contrastText }]}>
            {t('verify_otp_resend_title_text')}
          </Text>
        </TouchableOpacity>
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
  textFieldContainer: { marginBottom: 10 },
  textField: { backgroundColor: 'rgba(255, 255, 255, 1)' },
  buttonContainer: { height: 52 },
  button: { width: 350, backgroundColor: 'transparent' },
  buttonLabel: { fontWeight: 'bold' },
  titleBottom: { textAlign: 'center', textDecorationLine: 'underline', marginTop: 10 },
  snackbarText: { textAlign: 'center' },
});

export default VerifyOtp;
