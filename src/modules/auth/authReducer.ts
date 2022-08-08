import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { create, login, readMe } from './authActions';
import { User } from './types';

const initialState = {
  me: null,
  isAuthenticated: false,
  withSplash: true,
} as {
  me: User | null;
  isAuthenticated: boolean;
  withSplash: boolean;
};

const { reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.me = payload.user;
      state.isAuthenticated = true;
      AsyncStorage.setItem('userToken', payload.token);
    });

    builder.addCase(create.fulfilled, (state, { payload }) => {
      state.me = payload.user;
      state.isAuthenticated = true;
      AsyncStorage.setItem('userToken', payload.token);
    });

    builder.addCase(readMe.fulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.withSplash = false;
      state.me = payload;
    });

    builder.addCase(readMe.rejected, (state) => {
      AsyncStorage.removeItem('userToken');
      state.isAuthenticated = false;
      state.withSplash = false;
    });
  },
});

export default reducer;
