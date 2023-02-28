import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { Button } from '../../common/components';
import { useTypedSelector, useTypedDispatch } from '../../app/hooks';
import { updateMe } from '../../auth/actions';

type User = { _id?: string; displayName?: string; onToggleSnackBar: (message: string) => void };

const PrivacyList = (props: User) => {
  const { _id, displayName, onToggleSnackBar } = props;
  const {
    theme: { theme },
    auth: { me },
    loader: { actions },
  } = useTypedSelector((state) => state);
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();

  const handleUnBlock = async (id?: string) => {
    if (me?.blockedList) {
      await dispatch(
        updateMe({
          userType: 'user',
          user: { blockedList: me.blockedList.filter((_user) => _user.user._id !== id) },
          id,
        })
      )
        .unwrap()
        .catch((error) => {
          error.message ? onToggleSnackBar(error.message) : onToggleSnackBar(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={2}
        ellipsizeMode='tail'
        variant='titleLarge'
        style={[styles.title, { color: theme.colors.contrastText }]}>
        {displayName}
      </Text>
      <Button
        mode='contained'
        disabled={actions.find((action) => action.includes('userUpdateMe')) ? true : false}
        loading={actions.includes(`userUpdateMe${_id}`)}
        LinearGradientProps={{
          style: { borderRadius: 30, width: 150, alignSelf: 'center' },
          colors: ['#1897D3', '#79D44E'],
          useAngle: true,
          angle: 170,
          locations: [0, 1],
        }}
        contentStyle={styles.buttonContainer}
        style={styles.button}
        labelStyle={[styles.buttonLabel, { ...theme.typescale.titleMedium, color: theme.colors.white }]}
        onPress={() => handleUnBlock(_id)}>
        {t('privacy_unblock_button_title_text')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    padding: 20,
  },
  title: { flexShrink: 1 },
  buttonContainer: { height: 45 },
  button: { width: 150, backgroundColor: 'transparent' },
  buttonLabel: { fontWeight: 'bold' },
});

export default PrivacyList;
