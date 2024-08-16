// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchEdiciones = createAsyncThunk('ediciones/fetchEdiciones', async () => {
    const response = await Axios.get(`${URL}/user/get-ediciones`);
    return response.data;
});

const edicionesSlice = createSlice({
    name: 'ediciones',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setEdiciones: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEdiciones.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchEdiciones.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchEdiciones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setEdiciones } = edicionesSlice.actions;

export default edicionesSlice.reducer;
