import { Platform } from '../redux/types';

export type UserType = 'guest' | 'user';
export interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  token?: string;
  platform?: Platform;
}
export interface RequestParams {
  /**
   * The type of user needs to login or register.
   */
  userType: UserType;
  /**
   * The user object
   */
  user?: User;
}
