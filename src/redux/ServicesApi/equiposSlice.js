// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchEquipos = createAsyncThunk('equipos/fetchEquipos', async () => {
    // Obtener el token desde localStorage (ajusta esto según tu implementación)
    const token = localStorage.getItem('token'); // Ajusta 'token' al nombre que usas

    // Realizar la solicitud con el token en los encabezados
    const response = await Axios.get(`${URL}/user/get-equipos`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    console.log('Response data:', response.data);

    return response.data;
});
const equiposSlice = createSlice({
    name: 'equipos',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setEquipos: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEquipos.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchEquipos.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchEquipos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setEquipos } = equiposSlice.actions;

export default equiposSlice.reducer;