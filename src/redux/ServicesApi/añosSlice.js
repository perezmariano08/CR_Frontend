// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchAños = createAsyncThunk('años/fetchAños', async () => {
    const response = await Axios.get(`${URL}/admin/get-anios`);
    return response.data;
});

const añosSlice = createSlice({
    name: 'años',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setAños: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAños.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchAños.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchAños.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setAños } = añosSlice.actions;

export default añosSlice.reducer;
