// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

export const fetchPlanteles = createAsyncThunk(
    'planteles/fetchPlanteles',
    async ({ id_equipo, id_categoria }) => {
        const response = await Axios.get(`${URL}/user/get-planteles`, {
            params: { id_equipo, id_categoria }
        });
        return response.data;
    }
);

const plantelesSlice = createSlice({
    name: 'planteles',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setPlanteles: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlanteles.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchPlanteles.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPlanteles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setPlanteles } = plantelesSlice.actions;

export default plantelesSlice.reducer;
