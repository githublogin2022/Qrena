import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../app/types';

import { StyleSheet, Text as TextTag, TouchableOpacity, View } from 'react-native';
import { Attachment as DocumentType } from '../types';
import { getBaseUrl } from '../../app/utils/getUrl';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
//import { toast } from '@backpackapp-io/react-native-toast';

type DocumentProps = DocumentType;

const Document = (props: DocumentProps) => {
  const baseUrl = getBaseUrl();
  const {
    params: { chatId },
  } = useRoute<RouteProp<RootStackParams, 'Messages'>>();
  const { side, fileName } = props;
  const url = `${baseUrl}/${chatId}/document/${fileName}`;
  const extension = fileName?.trim().split('.').pop()?.toLocaleLowerCase();
  const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;

  const options = {
    fromUrl: url,
    toFile: localFile,
  };

  const downloadAndOpenDoc = () => {
    //toast('Downloading', { duration: 2500 });
    console.log('file name: ', localFile);
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile.trim(), { showOpenWithDialog: true }))
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
        console.log(error);
      });
  };

  return (
    <View style={[styles.container, side === 'left' ? styles.containerLeft : styles.containerRight]}>
      <TouchableOpacity onPress={() => downloadAndOpenDoc()}>
        <View style={[styles.textContainer, side === 'left' ? styles.textContainerLeft : styles.textContainerRight]}>
          <TextTag style={[styles.text, side === 'left' ? styles.blackText : styles.whiteText]}>{fileName}</TextTag>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    maxWidth: '75%',
    marginHorizontal: 8,
  },
  containerLeft: {
    backgroundColor: 'grey',
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  containerRight: {
    backgroundColor: '#79D44E',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  textContainerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textContainerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  text: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
  whiteText: {
    color: 'white',
  },
  blackText: {
    color: 'black',
  },
});

export default Document;
