import React, { createRef, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { VStack, HStack } from 'react-native-flex-layout';

import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthTokenService } from '../modules/app/services';
import { read, readMore, receive } from '../modules/messages/actions';

import { useTypedDispatch, useTypedNavigation, useTypedSelector } from '../modules/app/hooks';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../modules/app/types';

import io from 'socket.io-client';

import Message from '../modules/messages/components/Message';
import Footer from '../modules/messages/components/Footer';
import ForwardChat from '../modules/messages/components/ForwardChat';
import { FooterProps, ForwardChatProps, Message as MessageType } from '../modules/messages/types';
import { Chat } from '../modules/chats/types';

// import { Toasts } from '@backpackapp-io/react-native-toast';
// import { toast } from '@backpackapp-io/react-native-toast';

type ForwardChatList = {
  chat: Chat;
  checked: boolean;
};

const Messages = () => {
  const flatListRef = createRef<FlatList>();
  const {
    theme: { theme },
    message: { messages },
    auth: { me },
    chat: { chats },
  } = useTypedSelector((state) => state);
  const {
    params: { receiver, chatId, sender, receiverQrCode, senderQrCode },
  } = useRoute<RouteProp<RootStackParams, 'Messages'>>();
  const dispatch = useTypedDispatch();
  const navigation = useTypedNavigation();
  var side: 'left' | 'right' = receiver?._id === me?._id ? 'left' : 'right';
  const [loading, setLoading] = useState(false);
  const offset = useRef(0);
  const socket = useRef(io('13.232.69.252:5001'));
  const [showEle, setShowEle] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [showForwardOptions, setShowForwardOptions] = useState(false);
  const messageToPerform = useRef<MessageType | null>(null);
  const [forwardChats, setForwardChats] = useState<ForwardChatList[]>([]);
  const forwardSelectedChats = useRef<Chat[]>([]);
  const footerProps: FooterProps = {
    chatId: chatId,
    sender: sender,
    receiver: receiver,
    receiverQrCode: receiverQrCode,
    senderQrCode: senderQrCode,
    attachmentIcon: showEle ? 'close' : 'attach-file',
    attachmentClick: () => {
      setShowEle(!showEle);
    },
  };

  // function to execute when user scrolls to the top of the chat
  const onTopReached = async () => {
    if (messages.length >= 20) {
      setLoading(true);

      await dispatch(
        readMore({
          userType: 'user',
          queries: `limit=10&skip=${offset.current * 10}&receiver=${receiver?._id}&senderQrCode=${
            senderQrCode?._id
          }&receiverQrCode=${receiverQrCode?._id}`,
        })
      )
        .unwrap()
        .then(() => (offset.current = offset.current + 1))
        .catch((error: any) => {
          console.warn(error);
        });

      setLoading(false);
    }
  };

  useEffect(() => {
    socket.current.emit('client-connect', { sender: sender, receiver: receiver?._id, chat: chatId });

    const newSocket = socket.current;

    // load all the messages in the chat
    const loadMessages = async () => {
      setLoading(true);
      // load messages
      await dispatch(
        read({
          userType: 'user',
          queries: `limit=10&receiver=${receiver?._id}&senderQrCode=${senderQrCode?._id}&receiverQrCode=${receiverQrCode?._id}`,
        })
      )
        .unwrap()
        .then(() => {
          offset.current = 1;
        })
        .catch((error: any) => {
          console.warn(error);
        });

      setLoading(false);
    };

    loadMessages();
    return () => {
      newSocket.disconnect();
    };
  }, [chatId, dispatch, receiver?._id, receiverQrCode?._id, sender, senderQrCode?._id]);

  socket.current.off('receive-message').on('receive-message', (message) => {
    dispatch(receive({ userType: 'user', message: message }));
  });

  // refresh the messages
  const refreshMessages = async (body: string) => {
    // load messages
    console.log('function: ', body);
    await dispatch(
      read({
        userType: 'user',
        queries: `limit=10&receiver=${receiver?._id}&senderQrCode=${senderQrCode?._id}&receiverQrCode=${receiverQrCode?._id}`,
      })
    )
      .unwrap()

      .catch((error: any) => {
        console.warn(error);
      });
  };

  // send the selected attachments
  const sendAttachment = async (files: DocumentPickerResponse[], type: string) => {
    //toast('Sending...', { duration: 2000 });
    const token = await AsyncStorage.getItem('userToken');

    setAuthTokenService(token);

    var data = new FormData();
    data.append('type', type);
    data.append('body', type);
    data.append('chat', chatId);
    data.append('receiver', receiver?._id);
    data.append('receiverQrCode', receiverQrCode?._id);
    data.append('senderQrCode', senderQrCode?._id);
    files.map((file) => data.append('files', file));

    let header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    axios
      .post('/messages/attachment?userType=user', data, header)
      .then((res) => {
        console.log(res);
        res.data.forEach((element: MessageType) => {
          socket.current.emit('send-message', { message: element });
          dispatch(receive({ userType: 'user', message: element }));
        });
        //refreshMessages('sendAttachment()');
      })
      .catch((error) => {
        //toast("Couldn't send", { duration: 2500 });
        console.warn(error);
      });
  };

  // forward the selected message to the selected chats
  const forward = async () => {
    if (forwardSelectedChats.current.length > 0) {
      setAuthTokenService(await AsyncStorage.getItem('userToken'));
      let chatIds: string[] = [];
      forwardSelectedChats.current.map((ch) => {
        chatIds.push(ch._id);
      });
      let data = JSON.stringify({
        chatIds: chatIds,
        messageId: messageToPerform.current?._id,
        senderQrCode: senderQrCode?._id,
      });

      let header = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      axios.post('/messages/forward?userType=user', data, header).then(() => {
        refreshMessages('forward()');
      });
    } else {
    }
  };

  // delete the selected message only for me
  const deleteForMe = async () => {
    setAuthTokenService(await AsyncStorage.getItem('userToken'));

    await axios.delete(`/messages/deleteForMe/${messageToPerform.current?._id}?userType=user`);
    refreshMessages('deleteForMe()');
  };

  // delete the selected message for everyone
  const deleteForEveryone = async () => {
    setAuthTokenService(await AsyncStorage.getItem('userToken'));

    await axios.delete(`/messages/deleteForAll/${messageToPerform.current?._id}?userType=user`);
    refreshMessages('deleteForEveryone()');
  };

  // select images from the phone to send
  const pickImages = async () => {
    try {
      const response = await DocumentPicker?.pick({
        allowMultiSelection: true,
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.images],
      });
      // setFileResponse(response);

      sendAttachment(response, 'image');
    } catch (error) {
      if (typeof error === 'string') {
      } else if (error instanceof Error) {
        let message = error.message;

        if (message.toLowerCase() === 'User canceled document picker'.toLowerCase()) {
        }
      } else {
        console.warn(error);
      }
    }
  };

  // select videos from the phone to send
  const pickVideos = async () => {
    try {
      const response = await DocumentPicker?.pick({
        allowMultiSelection: true,
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.video],
      });

      sendAttachment(response, 'video');
    } catch (error) {
      if (typeof error === 'string') {
      } else if (error instanceof Error) {
        let message = error.message;

        if (message.toLowerCase() === 'User canceled document picker'.toLowerCase()) {
        }
      } else {
        console.warn(error);
      }
    }
  };

  // select any file as document from the phone to send
  const pickDocuments = async () => {
    try {
      const response = await DocumentPicker?.pick({
        allowMultiSelection: true,
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles],
      });
      sendAttachment(response, 'document');
    } catch (error) {
      if (typeof error === 'string') {
      } else if (error instanceof Error) {
        let message = error.message;

        if (message.toLowerCase() === 'User canceled document picker'.toLowerCase()) {
        }
      } else {
        console.warn(error);
      }
    }
  };

  // select any file as document from the phone to send
  const pickAudio = async () => {
    try {
      const response = await DocumentPicker?.pick({
        allowMultiSelection: true,
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.audio],
      });
      sendAttachment(response, 'audio');
    } catch (error) {
      if (typeof error === 'string') {
      } else if (error instanceof Error) {
        let message = error.message;

        if (message.toLowerCase() === 'User canceled document picker'.toLowerCase()) {
        }
      } else {
        console.warn(error);
      }
    }
  };

  // popup menu for forwarding a message
  const ForwardChats = () => (
    <LinearGradient
      style={styles.messageOptions}
      colors={['#1897D3', '#79D44E']}
      useAngle={true}
      angle={170}
      locations={[0, 1]}>
      <VStack style={styles.stack}>
        <View style={[styles.deleteOptionsButton, styles.forwardFlatList]}>
          <FlatList
            style={styles.flatlist}
            data={forwardChats}
            renderItem={({ item: chat, index }) => {
              if (forwardChats.length === 1) {
                return (
                  <View>
                    <Text style={{ color: '#fff' }}>No chats</Text>
                  </View>
                );
              }
              if (chat.chat._id === chatId) {
                return null;
              }
              const forwardChatProps: ForwardChatProps = {
                chat: chat.chat,
                checked: chat.checked,
                onPress: () => selectForwardChat(chat.chat, index),
              };
              return <ForwardChat {...forwardChatProps} />;
            }}
            keyExtractor={(item) => item.chat._id}
            ListEmptyComponent={() => {
              return forwardChats.length === 1 ? (
                <View>
                  {console.log('length: ', forwardChats.length)}
                  <Text style={{ color: '#fff' }}>No chats</Text>
                </View>
              ) : null;
            }}
          />
        </View>
        <View style={styles.deleteOptionsButton}>
          <Button
            color='#79D44E'
            onPress={() => {
              setShowForwardOptions(false);
              forward();
            }}
            title='Send'
          />
        </View>
        <View style={styles.deleteOptionsButton}>
          <Button
            color='#f00'
            onPress={() => {
              setShowForwardOptions(false);
            }}
            title='Cancel'
          />
        </View>
      </VStack>
    </LinearGradient>
  );

  // popup menu for attachments
  const Options = () => (
    <LinearGradient
      style={styles.options}
      colors={['#1897D3', '#79D44E']}
      useAngle={true}
      angle={170}
      locations={[0, 1]}>
      <VStack style={styles.stack}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setShowEle(false);

            pickImages();
          }}>
          <Icon color='#fff' size={35} name='image' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setShowEle(false);

            pickVideos();
          }}>
          <Icon color='#fff' size={35} name='ondemand-video' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setShowEle(false);

            navigation.push('Camera', {
              receiverId: receiver?._id,
              receiverQrCode: receiverQrCode?._id,
              senderQrCode: senderQrCode?._id,
              chatId,
            });
          }}>
          <Icon color='#fff' size={35} name='camera' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setShowEle(false);

            navigation.push('SelectContact', {
              receiver,
              sender,
              chatId,
              receiverQrCode,
              senderQrCode,
            });
          }}>
          <Icon color='#fff' size={35} name='person' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setShowEle(false);

            pickAudio();
          }}>
          <Icon color='#fff' size={35} name='music-note' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            setShowEle(false);

            pickDocuments();
          }}>
          <Icon color='#fff' size={35} name='text-snippet' />
        </TouchableOpacity>
      </VStack>
    </LinearGradient>
  );

  // select a chat to forward the selected message
  const selectForwardChat = (chat: Chat, index: number) => {
    const newArr = [...forwardChats];
    const newEle: ForwardChatList = newArr[index];
    newEle.checked = !newEle.checked;
    newArr[index] = newEle;
    setForwardChats(newArr);
    if (newEle.checked) {
      if (!forwardSelectedChats.current.includes(chat)) {
        forwardSelectedChats.current.push(chat);
      }
    } else {
      if (forwardSelectedChats.current.includes(chat)) {
        forwardSelectedChats.current = forwardSelectedChats.current.filter((ch) => ch._id !== chat._id);
      }
    }
  };

  // popup menu for selecting a message
  const MessageOptions = () => (
    <LinearGradient
      style={styles.messageOptions}
      colors={['#1897D3', '#79D44E']}
      useAngle={true}
      angle={170}
      locations={[0, 1]}>
      <HStack style={styles.stack}>
        <TouchableOpacity
          style={styles.messageIcon}
          onPress={async () => {
            setShowMessageOptions(false);

            setForwardChats([]);

            chats.map((chat) => {
              const forwardChat: ForwardChatList = {
                chat,
                checked: false,
              };
              const findForwardChat = forwardChats.find((ch) => ch.chat._id === chat._id);

              if (findForwardChat === undefined) {
                setForwardChats([...forwardChats, forwardChat]);
              }
            });

            setShowForwardOptions(true);
            //await forward();
          }}>
          <Icon color='#fff' size={35} name='arrow-forward' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.messageIcon}
          onPress={() => {
            setShowMessageOptions(false);

            setShowDeleteOptions(true);
          }}>
          <Icon color='#fff' size={35} name='delete' />
        </TouchableOpacity>
      </HStack>
    </LinearGradient>
  );

  // popup menu for deleting a message
  const DeleteOptions = () => (
    <LinearGradient
      style={styles.messageOptions}
      colors={['#1897D3', '#79D44E']}
      useAngle={true}
      angle={170}
      locations={[0, 1]}>
      <VStack style={styles.stack}>
        <View style={styles.deleteOptionsButton}>
          <Button
            color='#00f'
            title='Delete for me'
            onPress={async () => {
              setShowDeleteOptions(false);

              await deleteForMe();
            }}
          />
        </View>
        <View style={styles.deleteOptionsButton}>
          <Button
            color='#00f'
            title='Delete for everyone'
            onPress={async () => {
              setShowDeleteOptions(false);

              await deleteForEveryone();
            }}
          />
        </View>
        <View style={styles.deleteOptionsButton}>
          <Button
            color='#f00'
            title='Cancel'
            onPress={() => {
              setShowDeleteOptions(false);
            }}
          />
        </View>
      </VStack>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { backgroundColor: theme.colors.background }]}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item: message }) => (
            <View>
              <View style={[styles.messageMore, side === 'left' ? styles.messageMoreLeft : styles.messageMoreRight]}>
                <TouchableOpacity
                  style={styles.messageMoreIcon}
                  onPress={() => {
                    messageToPerform.current = message;
                    //setMessageToPerform(message);
                    setShowMessageOptions(true);
                    //setMessageToPerform(message);
                  }}>
                  <Icon color='#fff' size={35} name='more-horiz' />
                </TouchableOpacity>
              </View>
              <Message key={message._id} {...message} />
            </View>
          )}
          refreshing={loading}
          //onRefresh={() => refreshMessages('onRefresh()')}
          keyExtractor={(item: MessageType) => item._id}
          onScroll={(e) => {
            let y = e.nativeEvent.contentOffset.y;
            if (y === 0) {
              onTopReached();
            }
          }}
          ListEmptyComponent={
            messages.length === 0 ? (
              <View>
                <Text style={{ color: theme.colors.contrastText }}>No messages</Text>
              </View>
            ) : undefined
          }
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd();
            }
          }}
        />
        <Footer {...footerProps} />
      </View>
      {showEle ? (
        <View style={styles.optionsContainer}>
          <Options />
        </View>
      ) : null}
      {showMessageOptions ? (
        <View style={styles.messageOptionsContainer}>
          <MessageOptions />
        </View>
      ) : null}
      {showDeleteOptions ? (
        <View style={styles.messageOptionsContainer}>
          <DeleteOptions />
        </View>
      ) : null}
      {showForwardOptions ? (
        <View style={styles.messageOptionsContainer}>
          <ForwardChats />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
  innerContainer: { flex: 1 },
  optionsContainer: {
    width: '15%',
    zIndex: 1000,
    position: 'absolute',
    bottom: 65,
  },
  messageOptionsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    position: 'absolute',
    zIndex: 1000,
    alignSelf: 'center',
    top: '30%',
  },
  options: {
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 30,
  },
  messageOptions: {
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 10,
  },
  stack: {
    alignItems: 'center',
  },
  icon: {
    paddingVertical: 6,
  },
  messageIcon: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  messageMoreIcon: {
    paddingHorizontal: 8,
  },
  messageMore: {
    position: 'absolute',
    zIndex: 50,
  },
  messageMoreLeft: {
    left: 4,
  },
  messageMoreRight: {
    right: 4,
  },
  deleteOptionsButton: {
    marginVertical: 12,
    marginHorizontal: 48,
  },
  forwardFlatList: {
    backgroundColor: 'white',
  },
  flatlist: {
    flex: 1,
    flexGrow: 0,
    minHeight: 0,
  },
});

export default Messages;
