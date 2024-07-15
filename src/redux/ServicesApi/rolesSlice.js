// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los años
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
    const response = await Axios.get(`${URL}/admin/get-roles`);
    return response.data;
});

const rolesSlice = createSlice({
    name: 'roles',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setRoles: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setRoles } = rolesSlice.actions;

export default rolesSlice.reducer;
