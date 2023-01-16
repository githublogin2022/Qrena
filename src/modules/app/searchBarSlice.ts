import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = { isVisible: false, searchText: '' } as { isVisible: boolean; searchText: string };

const {
  reducer,
  actions: { updateVisibility, updateSearchText },
} = createSlice({
  name: 'searchVisibility',
  initialState,
  reducers: {
    updateVisibility: (state, { payload }: PayloadAction<boolean>) => {
      state.isVisible = payload;
    },
    updateSearchText: (state, { payload }: PayloadAction<string>) => {
      state.searchText = payload;
    },
  },
});

export { updateVisibility, updateSearchText };
export default reducer;
