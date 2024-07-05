// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchDivisiones = createAsyncThunk('divisiones/fetchDivisiones', async () => {
    const response = await Axios.get(`${URL}/admin/get-divisiones`);
    return response.data;
});

const divisionesSlice = createSlice({
    name: 'divisiones',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setDivisiones: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDivisiones.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchDivisiones.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDivisiones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setDivisiones } = divisionesSlice.actions;

export default divisionesSlice.reducer;
