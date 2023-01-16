import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = { isVisible: null } as { isVisible: string | null };

export const read = createAsyncThunk('onBoardingVisibility/read', async () => {
  return await AsyncStorage.getItem('isOnBoardingVisible');
});

const {
  reducer,
  actions: { update },
} = createSlice({
  name: 'onBoardingVisibility',
  initialState,
  reducers: {
    update: (state) => {
      AsyncStorage.setItem('isOnBoardingVisible', 'false');
      state.isVisible = 'false';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(read.fulfilled, (state, { payload }) => {
      state.isVisible = payload;
    });
  },
});

export { update };
export default reducer;
