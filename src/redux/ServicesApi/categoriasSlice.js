// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchCategorias = createAsyncThunk('categorias/fetchCategorias', async () => {
    const response = await Axios.get(`${URL}/user/get-categorias`)
    return response.data;
});

// Crear una acción asíncrona para obtener los años
export const fetchCategoriasByEdicion = createAsyncThunk('categorias/fetchCategoriasByEdicion', async (id_edicion) => {
    const response = await Axios.get(`${URL}/user/get-categorias`, 
        {
            params: { id_edicion: id_edicion }
        }
    )
    return response.data;
});

const categoriasSlice = createSlice({
    name: 'categorias',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setCategorias: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategorias.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchCategorias.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCategorias.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCategoriasByEdicion.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchCategoriasByEdicion.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;  // ✅ Aquí se guardan las categorías filtradas
            })
            .addCase(fetchCategoriasByEdicion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setCategorias } = categoriasSlice.actions;

export default categoriasSlice.reducer;
