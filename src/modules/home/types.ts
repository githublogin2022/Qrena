import { UserType } from '../app/types';

export type QrCode = { _id?: string; combination?: string; status?: string };
export type RequestParams = {
  userType: UserType;
  queries?: string;
  maximumQrCode?: { maximumQrCode: number };
  id?: string;
  qrCode?: QrCode;
};
