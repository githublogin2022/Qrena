import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { create, userLogin, readMe, phoneOtpLogin, updateMe } from './actions';
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

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(phoneOtpLogin.fulfilled, (state, { payload }) => {
      AsyncStorage.setItem('phoneOtpToken', payload.token);
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
    builder.addCase(updateMe.fulfilled, (state, { payload }) => {
      state.me = payload;
    });
    builder
      .addMatcher(isAnyOf(userLogin.fulfilled, create.fulfilled), (state, { payload }) => {
        state.me = payload.user;
        state.isAuthenticated = true;
        AsyncStorage.setItem('userToken', payload.token);
      })
      .addMatcher(isAnyOf(userLogin.rejected, create.rejected), (state) => {
        state.isAuthenticated = false;
      });
  },
});

export default slice.reducer;
