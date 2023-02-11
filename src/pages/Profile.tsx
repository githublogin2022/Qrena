import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { useTypedDispatch, useTypedSelector } from '../modules/app/hooks';
import { TextField, Button } from '../modules/common/components';
import { updateMe } from '../modules/auth/actions';

type Data = { firstName: string; lastName: string; displayName: string };

const Profile = () => {
  const { t } = useTranslation();
  const {
    loader: { actions },
    theme: { theme },
    auth: { me },
  } = useTypedSelector((state) => state);
  const dispatch = useTypedDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, SetSnackbarMessage] = useState('');

  const onToggleSnackBar = (message: string) => {
    SetSnackbarMessage(message);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  const handleOnSubmit = async (data: Data, { setErrors, setSubmitting }: FormikHelpers<Data>) => {
    await dispatch(updateMe({ userType: 'user', user: data }))
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
    <View style={[styles.Container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentContainer}>
        <Formik
          initialValues={{
            firstName: me?.firstName || '',
            lastName: me?.lastName || '',
            displayName: me?.displayName || '',
          }}
          validationSchema={yup.object({
            firstName: yup.string().required("First name can't be blank."),
            lastName: yup.string().required("Last name can't be blank."),
            displayName: yup.string().required("Last name can't be blank."),
          })}
          onSubmit={(data, helpers) => handleOnSubmit(data, helpers)}>
          {({ submitForm }) => (
            <>
              <View style={styles.textFieldContainer}>
                <Field
                  component={TextField}
                  name='firstName'
                  style={styles.textField}
                  autoFocus
                  theme={{ roundness: 12 }}
                />
              </View>

              <View style={styles.textFieldContainer}>
                <Field component={TextField} name='lastName' style={styles.textField} theme={{ roundness: 12 }} />
              </View>

              <View style={styles.textFieldContainer}>
                <Field component={TextField} name='displayName' style={styles.textField} theme={{ roundness: 12 }} />
              </View>

              <Button
                mode='contained'
                loading={actions.includes('userUpdateMe')}
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
                {t('profile_save_button_title_text')}
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
  Container: { flex: 1 },
  contentContainer: { marginTop: 20, paddingHorizontal: 30 },
  textFieldContainer: { marginBottom: 10 },
  textField: { backgroundColor: 'rgba(255, 255, 255, 1)' },
  buttonContainer: { height: 52 },
  button: { width: 350, backgroundColor: 'transparent' },
  buttonLabel: { fontWeight: 'bold' },
  snackbarText: { textAlign: 'center' },
});

export default Profile;
