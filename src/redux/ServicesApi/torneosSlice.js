// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchTorneos = createAsyncThunk('torneos/fetchTorneos', async () => {
    const response = await Axios.get(`${URL}/admin/get-torneos`);
    return response.data;
});

const torneosSlice = createSlice({
    name: 'torneos',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setTorneos: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTorneos.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchTorneos.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTorneos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setTorneos } = torneosSlice.actions;

export default torneosSlice.reducer;
