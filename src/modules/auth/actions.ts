import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { addAction, removeAction } from '../app/loader';
import { setAuthTokenService } from '../app/services';
import { ApiError } from '../app/types';
import { RequestParams, User } from './types';
import { PhoneOtp, RequestParams as phoneOtpRequestParams } from '../phone-otp/types';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const create = createAsyncThunk(
  'user/create',
  async ({ userType, user }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('userCreate'));

      const body = JSON.stringify(user);

      const res = await axios.post<{ user: User; token: string }>(`/users?userType=${userType}`, body, requestConfig);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('userCreate'));
    }
  }
);

export const userLogin = createAsyncThunk(
  'user/login',
  async ({ userType, user }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addAction('userLogin'));

      const body = JSON.stringify(user);

      const res = await axios.post<{ user: User; token: string }>(
        `/users/login?userType=${userType}`,
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
      dispatch(removeAction('userLogin'));
    }
  }
);

export const phoneOtpLogin = createAsyncThunk(
  'phone-otp/login',
  async ({ userType, phoneOtp }: phoneOtpRequestParams, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addAction('phoneOtpLogin'));

      const body = JSON.stringify(phoneOtp);

      const res = await axios.post<{ phoneOtp: PhoneOtp; token: string }>(
        `/phone-otps/login?userType=${userType}`,
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
      dispatch(removeAction('phoneOtpLogin'));
    }
  }
);

export const logout = createAsyncThunk('logOut', async ({ userType }: RequestParams, { rejectWithValue, dispatch }) => {
  try {
    setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

    dispatch(addAction('logout'));

    await messaging().deleteToken();

    await axios.post(`/users/logout?userType=${userType}`, {
      platform: Platform.OS.charAt(0).toUpperCase() + Platform.OS.slice(1),
    });
  } catch (_error) {
    const error = _error as ApiError;
    if (error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message);
  } finally {
    dispatch(removeAction('logout'));
  }
});

export const readMe = createAsyncThunk(
  'user/me',
  async ({ userType }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('userMe'));

      const res = await axios.get<User>(`/users/me?userType=${userType}`);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('userMe'));
    }
  }
);

export const updateMe = createAsyncThunk(
  'user/updateMe',
  async ({ userType, user, id }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction(`userUpdateMe${id ? id : ''}`));

      const body = JSON.stringify(user);

      const res = await axios.patch<User>(`/users/me?userType=${userType}`, body, requestConfig);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction(`userUpdateMe${id ? id : ''}`));
    }
  }
);
