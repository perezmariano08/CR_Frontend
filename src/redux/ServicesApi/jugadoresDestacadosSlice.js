// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchJugadoresDestacados = createAsyncThunk('jugadoresDestacados/fetchJugadores', async () => {
    const response = await Axios.get(`${URL}/user/get-jugadores-destacados`);
    return response.data;
});

const jugadoresDestacadosSlice = createSlice({
    name: 'jugadores-destacados',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setJugadoresDestacados: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJugadoresDestacados.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchJugadoresDestacados.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchJugadoresDestacados.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setJugadoresDestacados } = jugadoresDestacadosSlice.actions;

export default jugadoresDestacadosSlice.reducer;
