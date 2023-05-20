import React, { useState, useRef, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';

import { useTypedDispatch, useTypedNavigation, useTypedSelector } from '../modules/app/hooks';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthTokenService } from '../modules/app/services';
import { receive } from '../modules/messages/actions';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../modules/app/types';

import io from 'socket.io-client';

import { ContactExamples } from '../modules/messages/data/contact_sample_data';
import { Contact, ContactProps, Message as MessageType } from '../modules/messages/types';
import ContactItem from '../modules/messages/components/ContactItem';

type ContactData = {
  contact: Contact;
  checked: boolean;
};

const SelectContact = () => {
  const {
    theme: { theme },
  } = useTypedSelector((state) => state);
  const {
    params: { receiver, chatId, sender, receiverQrCode, senderQrCode },
  } = useRoute<RouteProp<RootStackParams, 'SelectContact'>>();
  const dispatch = useTypedDispatch();
  const navigation = useTypedNavigation();
  const contacts: Contact[] = ContactExamples;
  const [contactData, setContactData] = useState<ContactData[]>([]);
  const selectedContactData = useRef<Contact[]>([]);
  const socket = useRef(io('13.232.69.252:5001'));

  useEffect(() => {
    socket.current.emit('client-connect', { sender: sender, receiver: receiver?._id, chat: chatId });

    const newSocket = socket.current;

    contacts.map((contact) => {
      const tempContactData: ContactData = {
        contact,
        checked: false,
      };
      const findContactData = contactData.find((ch) => ch.contact.id === contact.id);

      if (findContactData === undefined) {
        setContactData([...contactData, tempContactData]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [chatId, contactData, contacts, receiver?._id, sender]);

  socket.current.off('receive-message').on('receive-message', (message) => {
    dispatch(receive({ userType: 'user', message: message }));
  });

  // send the selected attachments
  const sendContacts = async () => {
    //toast('Sending...', { duration: 2000 });
    const token = await AsyncStorage.getItem('userToken');

    setAuthTokenService(token);

    var data = new FormData();
    data.append('type', 'contact');
    data.append('body', selectedContactData.current[selectedContactData.current.length - 1].name);
    data.append('chat', chatId);
    data.append('receiver', receiver?._id);
    data.append('receiverQrCode', receiverQrCode?._id);
    data.append('senderQrCode', senderQrCode?._id);
    data.append('contacts', JSON.stringify(selectedContactData.current));

    let header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    console.log(data);
    console.log('contacts: ', JSON.stringify(selectedContactData.current));

    await axios
      .post('/messages/attachment?userType=user', data, header)
      .then((res) => {
        console.log(res.data);
        res.data.forEach((element: MessageType) => {
          socket.current.emit('send-message', { message: element });
          dispatch(receive({ userType: 'user', message: element }));
        });
        navigation.pop();
        //refreshMessages('sendAttachment()');
      })
      .catch((error) => {
        //toast("Couldn't send", { duration: 2500 });
        console.warn(error);
      });
  };

  const selectContact = (contact: Contact, index: number) => {
    const newArr = [...contactData];
    const newEle: ContactData = newArr[index];
    newEle.checked = !newEle.checked;
    newArr[index] = newEle;
    setContactData(newArr);
    if (newEle.checked) {
      if (!selectedContactData.current.includes(contact)) {
        selectedContactData.current.push(contact);
      }
    } else {
      if (selectedContactData.current.includes(contact)) {
        selectedContactData.current = selectedContactData.current.filter((ch) => ch.id !== contact.id);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { backgroundColor: theme.colors.background }]}>
        <FlatList
          data={contactData}
          renderItem={({ item: contact, index }) => {
            const contactProps: ContactProps = {
              contact: contact.contact,
              checked: contact.checked,
              selectContact: () => selectContact(contact.contact, index),
            };
            return (
              <TouchableOpacity>
                <ContactItem {...contactProps} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.contact.id.toString()}
          ListEmptyComponent={
            contacts.length === 0 ? (
              <View>
                <Text style={{ color: theme.colors.contrastText }}>No messages</Text>
              </View>
            ) : undefined
          }
        />
        <View style={styles.button}>
          <Button
            color='#79D44E'
            onPress={() => {
              if (selectedContactData.current.length !== 0) {
                sendContacts();
              }
            }}
            title='Send'
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
  innerContainer: { flex: 1 },
  button: { height: 60 },
});

export default SelectContact;
