// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchJugadores = createAsyncThunk('jugadores/fetchJugadores', async () => {
    const response = await Axios.get(`${URL}/user/get-jugadores`);
    return response.data;
});

const jugadoresSlice = createSlice({
    name: 'jugadores',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setJugadores: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJugadores.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchJugadores.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchJugadores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setJugadores } = jugadoresSlice.actions;

export default jugadoresSlice.reducer;
