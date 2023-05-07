import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { addAction, removeAction } from '../app/loader';
import { ApiError } from '../app/types';
import { Message, RequestParams } from './types';
import { setAuthTokenService } from '../app/services';

export const read = createAsyncThunk(
  'messages/read',
  async ({ userType, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('messageRead'));

      const res = await axios.get<Message[]>(`/messages?userType=${userType}${queries ? '&' + queries : ''}`);

      //console.log('message read: ', res.data);
      return res.data;
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('messageRead'));
    }
  }
);

export const receive = createAsyncThunk(
  'messages/receive',
  ({ message }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addAction('messageReceive'));
      return <Message[]>[message];
    } catch (_error) {
      const error = _error as ApiError;
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    } finally {
      dispatch(removeAction('messageReceive'));
    }
  }
);

export const readMore = createAsyncThunk(
  'messages/readMore',
  async ({ userType, queries }: RequestParams, { rejectWithValue, dispatch }) => {
    try {
      setAuthTokenService(await AsyncStorage.getItem(`${userType}Token`));

      dispatch(addAction('messageReadMore'));

      const res = await axios.get<Message[]>(`/chats?userType=${userType}${queries ? '&' + queries : ''}`);

      //console.log('chat readMore: ', res.data);
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
