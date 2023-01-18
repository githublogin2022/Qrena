import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { addAction, removeAction } from '../app/loader';
import { setAuthTokenService } from '../app/services';
import { ApiError } from '../app/types';
import { RequestParams, QrCode } from './types';

const requestConfig = { headers: { 'Content-Type': 'application/json' } };

export const create = createAsyncThunk(
  'qr-code/create',
  async ({ userType, maximumQrCode }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('qrCodeCreate'));

      const body = JSON.stringify(maximumQrCode);

      const res = await axios.post<QrCode>(`/qr-codes?userType=${userType}`, body, requestConfig);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('qrCodeCreate'));
    }
  }
);

export const read = createAsyncThunk(
  'qr-code/read',
  async ({ userType, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('qrCodeRead'));

      const res = await axios.get<QrCode[]>(
        `/qr-codes?userType=${userType}${queries ? '&' + queries : ''}`,
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
      dispatch(removeAction('qrCodeRead'));
    }
  }
);

export const readById = createAsyncThunk(
  'qr-code/readById',
  async ({ userType, queries, id }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('qrCodeReadById'));

      const res = await axios.get<QrCode>(
        `/qr-codes/${id}?userType=${userType}${queries ? '&' + queries : ''}`,
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
      dispatch(removeAction('qrCodeReadById'));
    }
  }
);
