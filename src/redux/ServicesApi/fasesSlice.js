// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchFases = createAsyncThunk('zonas/fetchFases', async (id_categoria) => {
    const response = await Axios.get(`${URL}/admin/get-fases`, {
        params: { id_categoria }
    });
    return response.data;
});

const fasesSlice = createSlice({
    name: 'fases',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setFases: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFases.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchFases.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchFases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setFases } = fasesSlice.actions;

export default fasesSlice.reducer;
