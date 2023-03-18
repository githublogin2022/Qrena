import { createSlice } from '@reduxjs/toolkit';

import { read, readMore, updateById } from './actions';
import { Chat } from './types';

const initialState = { chats: [], chat: null, loadMore: false } as {
  chats: Chat[];
  chat: Chat | null;
  loadMore: boolean;
};

const {
  reducer,
  actions: { update },
} = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    update: (state, { payload }) => {
      state.chats = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(read.fulfilled, (state, { payload }) => {
      state.chats = payload;
      state.loadMore = payload.length > 0 ? true : false;
    });
    builder.addCase(readMore.fulfilled, (state, { payload }) => {
      state.chats = [...state.chats, ...payload];
      state.loadMore = payload.length > 0 ? true : false;
    });
    builder.addCase(updateById.fulfilled, (state, { payload }) => {
      state.chats[state.chats.findIndex((chat) => chat._id === payload?._id?.toString())] = payload;
      state.chat = payload;
    });
  },
});

export { update };
export default reducer;
