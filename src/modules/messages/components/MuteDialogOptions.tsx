import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { RadioButton, Button } from '../../common/components';
import { useTypedSelector, useTypedDispatch, useTypedNavigation } from '../../app/hooks';
import { updateById } from '../../chats/actions';

type DialogOption = { value: number | string; name: string; isSelected: boolean };
type MuteDialogOptionsProps = { visible: boolean; handleDialogClose: () => void; chatId?: string };

const MuteDialogOptions = (props: MuteDialogOptionsProps) => {
  const { visible, handleDialogClose, chatId } = props;
  const {
    theme: { theme },
    loader: { actions },
  } = useTypedSelector((state) => state);
  const dispatch = useTypedDispatch();
  const navigation = useTypedNavigation();
  const { t } = useTranslation();
  const [dialogOptions, setDialogOptions] = useState<DialogOption[]>([
    { value: 28800000, name: t('header_dialog_first_title_text'), isSelected: false },
    { value: 604800000, name: t('header_dialog_second_title_text'), isSelected: false },
    { value: 'always', name: t('header_dialog_third_title_text'), isSelected: false },
  ]);

  const onSelectDialogOption = (dialogOption: DialogOption) => {
    setDialogOptions(
      dialogOptions.map((option) =>
        option.value === dialogOption.value ? { ...option, isSelected: true } : { ...option, isSelected: false }
      )
    );
  };

  const handleOnSubmit = async () => {
    const duration = dialogOptions.find((option) => option.isSelected);

    await dispatch(
      updateById({ userType: 'user', id: chatId, chat: { status: 'Muted', muteDuration: duration?.value } })
    )
      .unwrap()
      .catch(() => {});

    handleDialogClose();

    navigation.navigate('Chats');
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDialogClose} style={{ backgroundColor: theme.colors.background }}>
        <Dialog.Content>
          {dialogOptions.map((option) => (
            <RadioButton
              key={option.value}
              isSelected={option.isSelected}
              onPress={() => onSelectDialogOption(option)}
              label={option.name}
            />
          ))}
        </Dialog.Content>
        <View style={styles.dialogActionsContainer}>
          <Button
            mode='contained'
            LinearGradientProps={{
              style: { borderRadius: 30, width: 100, alignSelf: 'center' },
              colors: ['#1897D3', '#79D44E'],
              useAngle: true,
              angle: 170,
              locations: [0, 1],
            }}
            contentStyle={styles.buttonContainer}
            style={styles.button}
            labelStyle={[styles.buttonLabel, { ...theme.typescale.titleMedium, color: theme.colors.white }]}
            onPress={handleDialogClose}>
            {t('dialog_cancel_title_text')}
          </Button>
          <Button
            mode='contained'
            LinearGradientProps={{
              style: { borderRadius: 30, width: 100, alignSelf: 'center', marginLeft: 20 },
              colors: ['#1897D3', '#79D44E'],
              useAngle: true,
              angle: 180,
              locations: [0, 1],
            }}
            contentStyle={styles.buttonContainer}
            style={styles.button}
            labelStyle={[styles.buttonLabel, { ...theme.typescale.titleMedium, color: theme.colors.white }]}
            onPress={handleOnSubmit}
            disabled={actions.includes('chatUpdateById')}
            loading={actions.includes('chatUpdateById')}>
            {t('dialog_ok_title_text')}
          </Button>
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialogActionsContainer: { flexDirection: 'row', justifyContent: 'center' },
  buttonContainer: { height: 45 },
  button: { width: 100, backgroundColor: 'transparent' },
  buttonLabel: { fontWeight: 'bold' },
});

export default MuteDialogOptions;
