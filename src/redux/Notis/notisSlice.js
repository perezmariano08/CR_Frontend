import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    hidden: true
}

const notisSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE,
    reducers: {
        toggleHiddenNotis: (state) => {
            return {
                ...state,
                hidden: !state.hidden
            }
        }
    }
})

export const {
    toggleHiddenNotis
} = notisSlice.actions;

export default notisSlice.reducer;