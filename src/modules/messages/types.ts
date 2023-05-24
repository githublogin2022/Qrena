import { UserType } from '../app/types';
import { Chat } from '../chats/types';

export type Message = {
  _id: string;
  sender?: { _id?: string; firstName?: string; lastName?: string };
  receiver?: { _id?: string; firstName?: string; lastName?: string };
  chat: string;
  receiverQrCode: string;
  senderQrCode: string;
  body: string;
  status: string;
  isCaptured?: boolean;
  isDeleted?: boolean;
  isForwarded?: boolean;
  isLive?: boolean;
  file?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  contact?: Contact;
  deletedBy?: [];
};

export type Text = {
  _id: string;
  text: string;
  side: string;
  createdAt: string;
  updatedAt: string;
};

export type Attachment = {
  _id: string;
  fileName?: string;
  contact?: Contact;
  side: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
  chat: string;
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type ContactProps = {
  contact: Contact;
  selectContact: Function;
  checked?: boolean;
};

export type FooterProps = {
  sender?: string;
  receiver?: { _id?: string; profilePictureUrl?: string; displayName: string };
  chatId?: string;
  receiverQrCode?: { _id?: string; combination: string; name: string };
  senderQrCode?: { _id?: string; combination: string; name: string };
  attachmentClick: Function;
  attachmentIcon: string;
};

export type ForwardChatProps = {
  chat: Chat;
  checked: boolean;
  onPress: Function;
};

export type RequestParams = {
  userType: UserType;
  queries?: string;
  id?: string;
  message?: Message;
};
