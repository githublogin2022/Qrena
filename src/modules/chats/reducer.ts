import { createSlice } from '@reduxjs/toolkit';

import { read, readMore } from './actions';
import { Chat } from './types';

const initialState = { chats: [], chat: null, loadMore: false } as {
  chats: Chat[];
  chat: Chat | null;
  loadMore: boolean;
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(read.fulfilled, (state, { payload }) => {
      state.chats = payload;
      state.loadMore = payload.length > 0 ? true : false;
    });
    builder.addCase(readMore.fulfilled, (state, { payload }) => {
      state.chats = [...state.chats, ...payload];
      state.loadMore = payload.length > 0 ? true : false;
    });
  },
});

export default slice.reducer;