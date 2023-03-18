import { UserType } from '../app/types';

export type Chat = {
  _id: string;
  sender?: string;
  receiver: { _id?: string; displayName: string; profilePictureUrl?: string };
  qrCode: { _id?: string; combination: string };
  status: string;
  lastMessage?: { body: string; date: string };
  notifications?: number;
  muteDuration?: number;
};

export type RequestParams = {
  userType: UserType;
  queries?: string;
  id?: string;
  chat?: { status: string; muteDuration?: number | string };
};
