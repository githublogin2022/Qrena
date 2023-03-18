import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { addAction, removeAction } from '../app/loader';
import { ApiError } from '../app/types';
import { RequestParams, Chat } from './types';
import { setAuthTokenService } from '../app/services';

const requestConfig = { headers: { 'Content-Type': 'application/json' } };

export const read = createAsyncThunk(
  'chats/read',
  async ({ userType, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('chatRead'));

      const res = await axios.get<Chat[]>(`/chats?userType=${userType}${queries ? '&' + queries : ''}`);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('chatRead'));
    }
  }
);

export const readMore = createAsyncThunk(
  'chats/readMore',
  async ({ userType, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('chatReadMore'));

      const res = await axios.get<Chat[]>(`/chats?userType=${userType}${queries ? '&' + queries : ''}`);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('chatReadMore'));
    }
  }
);

export const updateById = createAsyncThunk(
  'chats/updateById',
  async ({ userType, id, chat }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('chatUpdateById'));

      const body = JSON.stringify(chat);

      const res = await axios.patch<Chat>(`/chats/${id}?userType=${userType}`, body, requestConfig);

      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('chatUpdateById'));
    }
  }
);
