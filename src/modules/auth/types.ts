import { UserType } from '../app/types';

export type User = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  token?: string;
  blockedList?: { _id?: string; user: { _id?: string; displayName?: string } }[];
  platform?: 'Ios' | 'Android';
};
export type RequestParams = {
  userType: UserType;
  user?: User;
  id?: string;
};
