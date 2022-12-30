import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { images } from '../modules/onboarding/assets';
import { Button, Checkbox } from '../modules/common/components';
import { useTypedDispatch, useTypedSelector } from '../modules/app/hooks';
import { update } from '../modules/onboarding/visibility';
import { addAction, removeAction } from '../modules/app/loader';
import { Carousel } from '../modules/onboarding/components';

const OnBoarding = () => {
  const dispatch = useTypedDispatch();
  const {
    loader: { actions },
    theme: { theme },
  } = useTypedSelector((state) => state);
  const { t } = useTranslation();

  const handleOnSubmit = () => {
    dispatch(addAction('onBoardingVisibilityUpdate'));
    setTimeout(() => {
      dispatch(update());
      dispatch(removeAction('onBoardingVisibilityUpdate'));
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor='transparent' />
      <Carousel
        data={[
          {
            imageUrl: images.illustration1,
            text: t('onboarding_carousal_child1_text'),
          },
          {
            imageUrl: images.illustration2,
            text: t('onboarding_carousal_child2_text'),
          },
        ]}
      />
      <Formik
        initialValues={__DEV__ ? { terms: true } : { terms: false }}
        validationSchema={yup.object({
          terms: yup.boolean().oneOf([true], t('onboarding_terms_error_validation_text') || undefined),
        })}
        onSubmit={handleOnSubmit}>
        {({ submitForm }) => (
          <>
            <Field
              component={Checkbox}
              name='terms'
              label={t('onboarding_terms_title_link')}
              labelStyle={styles.labelStyle}
              style={{ transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [] }}
            />
            <Button
              mode='contained'
              loading={actions.includes('onBoardingVisibilityUpdate')}
              LinearGradientProps={{
                style: { borderRadius: 30 },
                colors: ['#1897D3', '#79D44E'],
                useAngle: true,
                angle: 170,
                locations: [0, 1],
              }}
              contentStyle={styles.buttonContainer}
              style={styles.button}
              labelStyle={[styles.buttonLabel, { ...theme.typescale.titleMedium }]}
              onPress={submitForm}>
              {t('onboarding_button_title_button')}
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  labelStyle: { textDecorationLine: 'underline' },
  buttonContainer: { height: 52 },
  button: { width: 327, backgroundColor: 'transparent' },
  buttonLabel: { color: 'white', fontWeight: 'bold' },
});

export default OnBoarding;
