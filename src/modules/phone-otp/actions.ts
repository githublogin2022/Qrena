import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { addAction, removeAction } from '../app/loader';
import { ApiError } from '../app/types';
import { RequestParams, PhoneOtp } from './types';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const create = createAsyncThunk(
  'phone-otp/create',
  async ({ userType, phoneOtp }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addAction('phoneOtpCreate'));

      const body = JSON.stringify(phoneOtp);

      const res = await axios.post<{ phoneOtp: PhoneOtp }>(`/phone-otps?userType=${userType}`, body, requestConfig);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('phoneOtpCreate'));
    }
  }
);

export const resend = createAsyncThunk(
  'phone-otp/resend',
  async ({ userType, phoneOtp }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addAction('phoneOtpResend'));

      const body = JSON.stringify(phoneOtp);

      const res = await axios.post<{ phoneOtp: PhoneOtp }>(
        `/phone-otps/resend?userType=${userType}`,
        body,
        requestConfig
      );

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('phoneOtpResend'));
    }
  }
);
