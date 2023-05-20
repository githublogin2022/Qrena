import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Message as MessageType } from '../types';
import { useTypedSelector } from '../../app/hooks';
import Text from './Text';
import Image from './Image';
import Video from './Video';
import { Text as TextType } from '../types';
import { Attachment as AttachmentType } from '../types';
import Document from './Document';
import AudioView from './Audio';
import Contact from './Contact';

type MessageProps = MessageType;

const Message = (props: MessageProps) => {
  const { _id, receiver, body, file, type, createdAt, updatedAt, contact } = props;
  const {
    auth: { me },
  } = useTypedSelector((state) => state);
  var side: 'left' | 'right' = receiver?._id === me?._id ? 'left' : 'right';

  const renderElement = () => {
    switch (type) {
      case 'Text':
        const text: TextType = { _id: _id, text: body, side: side, createdAt: createdAt, updatedAt: updatedAt };
        return <Text {...text} />;
      case 'contact':
        const contactAttachment: AttachmentType = {
          _id: _id,
          contact: contact,
          side: side,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
        return <Contact {...contactAttachment} />;
      case 'image':
        const image: AttachmentType = {
          _id: _id,
          fileName: file,
          side: side,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
        return <Image {...image} />;
      case 'video':
        const video: AttachmentType = {
          _id: _id,
          fileName: file,
          side: side,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
        return <Video {...video} />;
      case 'audio':
        let audio: AttachmentType = {
          _id: _id,
          fileName: file,
          side: side,
          createdAt: createdAt,
          updatedAt: updatedAt,
          type: 'audio',
        };
        return <AudioView {...audio} />;
      case 'recording':
        let recording: AttachmentType = {
          _id: _id,
          fileName: file,
          side: side,
          createdAt: createdAt,
          updatedAt: updatedAt,
          type: 'recording',
        };
        return <AudioView {...recording} />;
      case 'document':
        const document: AttachmentType = {
          _id: _id,
          fileName: file,
          side: side,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
        return <Document {...document} />;
      default:
    }
  };

  return (
    <>
      <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
        {renderElement()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  containerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default Message;
