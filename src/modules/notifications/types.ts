import { UserType } from '../app/types';

export type Notification = {
  title?: string;
  body?: string;
  redirectionURL?: string;
  _id?: string;
  sender?: string;
  receiver?: string;
  status?: 'Read' | 'UnRead';
};

export type RequestParams = {
  userType: UserType;
  notification?: Notification;
  queries?: string;
  id?: string;
};
