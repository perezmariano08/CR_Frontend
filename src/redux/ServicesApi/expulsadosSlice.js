// redux/expulsadosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los expulsados
export const fetchExpulsados = createAsyncThunk('expulsados/fetchExpulsados', async () => {
    const response = await Axios.get(`${URL}/user/get-expulsados`);
    return response.data;
});

// Crear una acción asíncrona para obtener los expulsados filtrados por categoría
export const fetchExpulsadosByCategoria = createAsyncThunk('expulsados/fetchExpulsadosByCategoria', async (id_categoria) => {
    const response = await Axios.get(`${URL}/user/get-expulsados`, {
        params: { id_categoria: id_categoria }
    });
    return response.data;
});

const expulsadosSlice = createSlice({
    name: 'expulsados',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setExpulsados: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchExpulsados
            .addCase(fetchExpulsados.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchExpulsados.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchExpulsados.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // fetchExpulsadosByCategoria
            .addCase(fetchExpulsadosByCategoria.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchExpulsadosByCategoria.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Guardamos los expulsados filtrados por id_categoria
            })
            .addCase(fetchExpulsadosByCategoria.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setExpulsados } = expulsadosSlice.actions;

export default expulsadosSlice.reducer;
