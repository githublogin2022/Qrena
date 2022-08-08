import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { addAction, removeAction } from '../redux/loader';
import setAuthTokenService from './setAuthTokenService';
import { ValidationErrors } from '../redux/types';
import { RequestParams, User } from '../auth/types';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const create = createAsyncThunk(
  'user/create',
  async ({ userType, user }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addAction('create'));

      const body = JSON.stringify(user);

      const res = await axios.post<{ user: User; token: string }>(`/users?userType=${userType}`, body, requestConfig);

      return res.data;
    } catch (_error) {
      const error = _error as ValidationErrors;
      if (!error.response) {
        return rejectWithValue(error);
      }
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(removeAction('create'));
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ userType, user }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addAction('login'));

      const body = JSON.stringify(user);

      const res = await axios.post<{ user: User; token: string }>(
        `/users/login?userType=${userType}`,
        body,
        requestConfig
      );

      return res.data;
    } catch (_error) {
      const error = _error as ValidationErrors;
      if (!error.response) {
        return rejectWithValue(error);
      }
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(removeAction('login'));
    }
  }
);

export const readMe = createAsyncThunk(
  'user/me',
  async ({ userType }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem('userToken'));

      dispatch(addAction('login'));

      const res = await axios.get<User>(`/users/me?userType=${userType}`);

      return res.data;
    } catch (_error) {
      const error = _error as ValidationErrors;
      if (!error.response) {
        return rejectWithValue(error);
      }
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(removeAction('login'));
    }
  }
);
