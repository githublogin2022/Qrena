import { createSlice } from '@reduxjs/toolkit';

import { create, read, readById, getCount } from './actions';
import { Notification } from './types';

const initialState = { notifications: [], notification: null, count: 0 } as {
  notifications: Notification[];
  notification: Notification | null;
  count: number;
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(create.fulfilled, (state, { payload }) => {
      state.notification = payload;
      state.notifications = [payload, ...state.notifications];
      state.count = state.count += 1;
    });
    builder.addCase(read.fulfilled, (state, { payload }) => {
      state.notifications = payload;
      state.count = payload.filter((notification) => notification.status === 'UnRead').length;
    });
    builder.addCase(readById.fulfilled, (state, { payload }) => {
      state.notification = payload;
    });
    builder.addCase(getCount.fulfilled, (state, { payload }) => {
      state.count = payload;
    });
  },
});

export default slice.reducer;
