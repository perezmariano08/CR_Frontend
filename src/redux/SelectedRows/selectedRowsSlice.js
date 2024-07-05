// src/redux/selectedRowsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedRows: []
};

const selectedRowsSlice = createSlice({
    name: 'selectedRows',
    initialState,
    reducers: {
        setSelectedRows: (state, action) => {
            state.selectedRows = action.payload;
        },
        clearSelectedRows: (state) => {
            state.selectedRows = [];
        }
    }
});

export const { setSelectedRows, clearSelectedRows } = selectedRowsSlice.actions;

export default selectedRowsSlice.reducer;
