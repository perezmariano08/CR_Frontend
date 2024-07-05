// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchTemporadas = createAsyncThunk('temporadas/fetchTemporadas', async () => {
    const response = await Axios.get(`${URL}/admin/get-temporadas`);
    return response.data;
});

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
            });
    }
});

export const { setTemporadas } = temporadasSlice.actions;

export default temporadasSlice.reducer;
