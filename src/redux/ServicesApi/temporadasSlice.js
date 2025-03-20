// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchTemporadas = createAsyncThunk('temporadas/fetchTemporadas', async () => {
    const response = await Axios.get(`${URL}/user/get-temporadas`);
    return response.data;
});

export const fetchTemporadasByCategorias = createAsyncThunk(
    'temporadas/fetchTemporadasByCategorias',
    async (categorias) => {
        const idsCategorias = categorias.map(cat => cat.id_categoria);
        const response = await Axios.get(`${URL}/user/get-temporadas`, {
            params: { idsCategorias: idsCategorias.join(',') }
        });
        return response.data;
    }
);

const temporadasSlice = createSlice({
    name: 'temporadas',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setTemporadas: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchTemporadas
            .addCase(fetchTemporadas.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchTemporadas.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTemporadas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // fetchTemporadasByCategorias
            .addCase(fetchTemporadasByCategorias.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchTemporadasByCategorias.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Guardamos los datos de temporadas filtradas por categorías
            })
            .addCase(fetchTemporadasByCategorias.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setTemporadas } = temporadasSlice.actions;

export default temporadasSlice.reducer;
