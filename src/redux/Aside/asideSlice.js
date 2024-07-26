import { createSlice } from '@reduxjs/toolkit';

export const asideSlice = createSlice({
  name: 'aside',
  initialState: {
    isOpen: true,
  },
  reducers: {
    toggleAside: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleAside } = asideSlice.actions;

export default asideSlice.reducer;
