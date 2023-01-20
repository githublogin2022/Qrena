import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet, ImageSourcePropType, GestureResponderEvent } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../../../modules/app/hooks';

type SettingProps = {
  title: string;
  icon: ImageSourcePropType;
  onPress: (event: GestureResponderEvent) => void | undefined;
};

const Setting = (props: SettingProps) => {
  const { title, icon, onPress } = props;
  const { i18n } = useTranslation();
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container]}>
      <View style={styles.titleContainer}>
        <Image source={icon} style={styles.leftIcon} />
        <Text variant='titleMedium' style={{ color: theme.colors.contrastText }}>
          {title}
        </Text>
      </View>
      <Image
        source={
          theme.dark ? require('../assets/png/arrow-filled-white.png') : require('../assets/png/arrow-filled-black.png')
        }
        style={[styles.iconRight, i18n.language === 'ar' && { transform: [{ rotate: '180deg' }] }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 5,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  leftIcon: { width: 26, height: 26, marginRight: 8 },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  iconRight: { width: 16, height: 16 },
});

export default Setting;
