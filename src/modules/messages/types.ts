import { UserType } from '../app/types';
import { Chat } from '../chats/types';

export type Message = {
  _id: string;
  sender: { _id?: string; firstName?: string; lastName?: string };
  receiver: { _id?: string; firstName?: string; lastName?: string };
  chat: string;
  receiverQrCode: string;
  senderQrCode: string;
  body: string;
  status: string;
  isCaptured?: boolean;
  isLive?: boolean;
  file?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  side: string;
  createdAt: string;
  updatedAt: string;
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
