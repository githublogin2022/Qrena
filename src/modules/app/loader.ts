import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  actions: [],
} as {
  actions: string[];
};

const {
  reducer,
  actions: { addAction, removeAction },
} = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    addAction: (state, { payload }: PayloadAction<string>) => {
      state.actions = [...state.actions, payload];
    },
    removeAction: (state, { payload }: PayloadAction<string>) => {
      state.actions = state.actions.filter((action) => action !== payload);
    },
  },
});

export { addAction, removeAction };
export default reducer;
