import { createSlice } from '@reduxjs/toolkit';

import { create, resend } from './actions';
import { PhoneOtp } from './types';

const initialState = {
  phoneOtp: null,
} as {
  phoneOtp: PhoneOtp | null;
};

const slice = createSlice({
  name: 'phone-otp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(create.fulfilled, (state, { payload }) => {
      state.phoneOtp = payload.phoneOtp;
    });
    builder.addCase(resend.fulfilled, (state, { payload }) => {
      state.phoneOtp = payload.phoneOtp;
    });
  },
});

export default slice.reducer;
