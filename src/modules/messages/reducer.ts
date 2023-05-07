import { createSlice } from '@reduxjs/toolkit';

import { read, readMore, receive } from './actions';
import { Message } from './types';

const initialState = { messages: [], message: null, loadMore: false } as {
  messages: Message[];
  message: Message | null;
  loadMore: boolean;
};

const {
  reducer,
  actions: { update },
} = createSlice({
  name: 'message',
  initialState,
  reducers: {
    update: (state, { payload }) => {
      //console.log('payload messages: ', payload);
      state.messages = payload;
      //state.messages = state.messages.reverse();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(read.fulfilled, (state, { payload }) => {
      //console.log('payload messages: ', payload);
      state.messages = payload.reverse();
      state.loadMore = payload.length > 0 ? true : false;
    });
    builder.addCase(readMore.fulfilled, (state, { payload }) => {
      //console.log('payload messages: ', payload);
      state.messages = [...payload.reverse(), ...state.messages];
      state.loadMore = payload.length > 0 ? true : false;
    });
    builder.addCase(receive.fulfilled, (state, { payload }) => {
      //console.log('payload messages: ', payload);
      state.messages = [...state.messages, ...payload.reverse()];
      state.loadMore = payload.length > 0 ? true : false;
    });
    // builder.addCase(updateById.fulfilled, (state, { payload }) => {
    //   state.messages[state.messages.findIndex((message) => message._id === payload?._id?.toString())] = payload;
    //   state.message = payload;
    // });
  },
});

export { update };
export default reducer;
