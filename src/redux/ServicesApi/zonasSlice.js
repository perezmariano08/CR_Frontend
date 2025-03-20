// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchZonas = createAsyncThunk('zonas/fetchZonas', async () => {
    const response = await Axios.get(`${URL}/user/get-zonas`);
    return response.data;
});

export const fetchZonasByCategoria = createAsyncThunk('zonas/fetchZonasByCategoria', async (id_categoria) => {
    const response = await Axios.get(`${URL}/user/get-zonas`, {
        params: { id_categoria: id_categoria }
    });
    return response.data;
});

const zonasSlice = createSlice({
    name: 'zonas',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setZonas: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchZonas.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchZonas.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchZonas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchZonasByCategoria.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            });
    }
});

export const { setZonas } = zonasSlice.actions;

export default zonasSlice.reducer;
