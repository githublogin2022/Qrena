import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { addAction, removeAction } from '../app/loader';
import { ApiError } from '../app/types';
import { RequestParams, Notification } from './types';
import { setAuthTokenService } from '../app/services';

const requestConfig = { headers: { 'Content-Type': 'application/json' } };

export const create = createAsyncThunk(
  'notifications/create',
  async ({ userType, notification }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('notificationCreate'));

      const body = JSON.stringify(notification);

      const res = await axios.post<Notification>(`/notifications?userType=${userType}`, body, requestConfig);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('notificationCreate'));
    }
  }
);

export const read = createAsyncThunk(
  'notifications/read',
  async ({ userType, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('notificationRead'));

      const res = await axios.get<Notification[]>(`/notifications?userType=${userType}${queries ? '&' + queries : ''}`);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('notificationRead'));
    }
  }
);

export const readById = createAsyncThunk(
  'notifications/readById',
  async ({ userType, id, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('notificationReadById'));

      const res = await axios.get<Notification>(
        `/notifications/${id}?userType=${userType}${queries ? '&' + queries : ''}`
      );

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('notificationReadById'));
    }
  }
);

export const getCount = createAsyncThunk(
  'notifications/count',
  async ({ userType, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('notificationCount'));

      const res = await axios.get<number>(
        `/notifications/stats/count?userType=${userType}${queries ? '&' + queries : ''}`
      );

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('notificationCount'));
    }
  }
);
