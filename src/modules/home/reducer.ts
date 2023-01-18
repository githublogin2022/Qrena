import { createSlice } from '@reduxjs/toolkit';

import { create, read, readById } from './actions';
import { QrCode } from './types';

const initialState = { qrCodes: [], qrCode: null } as { qrCodes: QrCode[]; qrCode: QrCode | null };

const slice = createSlice({
  name: 'qr-code',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(read.fulfilled, (state, { payload }) => {
      state.qrCodes = payload;
    });
    builder.addCase(create.fulfilled, (state, { payload }) => {
      state.qrCode = payload;
      state.qrCodes = [payload, ...state.qrCodes];
    });
    builder.addCase(readById.fulfilled, (state, { payload }) => {
      state.qrCode = payload;
    });
  },
});

export default slice.reducer;
