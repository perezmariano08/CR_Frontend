import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

export const fetchEquipos = createAsyncThunk('equipos/fetchEquipos', async () => {
    const response = await Axios.get(`${URL}/user/get-equipos`);
    return response.data;
});

export const fetchEquiposByCategoria = createAsyncThunk('equipos/fetchEquiposByCategoria', async (id_categoria) => {
    const response = await Axios.get(`${URL}/user/get-equipos`, {
        params: { id_categoria: id_categoria}
    });
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
            // fetchEquipos
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
            })

            // fetchEquiposByCategoria
            .addCase(fetchEquiposByCategoria.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchEquiposByCategoria.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Guardamos los equipos filtrados por id_categoria
            })
            .addCase(fetchEquiposByCategoria.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setEquipos } = equiposSlice.actions;

export default equiposSlice.reducer;
