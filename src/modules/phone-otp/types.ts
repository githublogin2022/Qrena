import { UserType } from '../app/types';

export type PhoneOtp = {
  _id?: string;
  phoneNumber: string;
  otp?: string;
  status?: string;
  token?: string;
};
export type RequestParams = {
  userType: UserType;
  phoneOtp?: PhoneOtp;
};
