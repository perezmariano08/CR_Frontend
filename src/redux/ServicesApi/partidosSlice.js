// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchPartidos = createAsyncThunk('partidos/fetchPartidos', async () => {
    const response = await Axios.get(`${URL}/user/get-partidos`);
    return response.data;
});

const partidosSlice = createSlice({
    name: 'partidos',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setPartidos: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartidos.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchPartidos.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPartidos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setPartidos } = partidosSlice.actions;

export default partidosSlice.reducer;
