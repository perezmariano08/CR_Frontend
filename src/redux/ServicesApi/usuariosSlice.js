// redux/añosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

// Crear una acción asíncrona para obtener los usuarios
export const fetchUsuarios = createAsyncThunk('usuarios/fetchUsuarios', async () => {
    const token = localStorage.getItem('token'); // O donde guardes el token
    const response = await Axios.get(`${URL}/admin/get-usuarios`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
});

const usuariosSlice = createSlice({
    name: 'usuarios',
    initialState: {
        loading: false,
        data: [],
        error: '',
    },
    reducers: {
        setUsuarios: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsuarios.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUsuarios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setUsuarios } = usuariosSlice.actions;

export default usuariosSlice.reducer;
