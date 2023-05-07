import React from 'react';
import { FooterProps } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, View } from 'react-native';

const Attachment: React.FunctionComponent<FooterProps> = (props) => {
  const { attachmentClick, attachmentIcon } = props;

  return (
    <View>
      <TouchableOpacity onPress={() => attachmentClick()}>
        <Icon size={26} color='#79D44E' name={attachmentIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default Attachment;
