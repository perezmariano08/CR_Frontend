// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchSedes = createAsyncThunk('sedes/fetchSedes', async () => {
    const response = await Axios.get(`${URL}/admin/get-sedes`);
    return response.data;
});

const sedesSlice = createSlice({
    name: 'sedes',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setSedes: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSedes.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchSedes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSedes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setSedes } = sedesSlice.actions;

export default sedesSlice.reducer;
