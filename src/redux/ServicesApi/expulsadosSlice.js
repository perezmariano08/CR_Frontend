// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchExpulsados = createAsyncThunk('expulsados/fetchExpulsados', async () => {
    const response = await Axios.get(`${URL}/user/get-expulsados`);
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
            });
    }
});

export const { setExpulsados } = expulsadosSlice.actions;

export default expulsadosSlice.reducer;