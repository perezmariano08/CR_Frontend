// redux/partidosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { URL } from '../../utils/utils';

export const fetchPartidos = createAsyncThunk('partidos/fetchPartidos', async () => {
    try {
        const response = await Axios.get(`${URL}/user/get-partidos`,
        );
        return response.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response : error);
        throw error;
    }
});

export const fetchPartidosPlanillero = createAsyncThunk(
    'partidos/fetchPartidosPlanillero',
    async ({ id_planillero, token }) => {
        const response = await Axios.get(`${URL}/planilla/get-partidos-planillero`, {
            params: { id_planillero },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
);

export const fetchPartidosPlanillados = createAsyncThunk(
    'partidos/fetchPartidosPlanillados',
    async ({ id_planillero, limite, token }) => {
        const response = await Axios.get(`${URL}/planilla/get-partidos-planillados`, {
            params: { id_planillero, limite },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
);

export const fetchPartidosbByCategoria = createAsyncThunk('partidos/fetchPartidosByCategoria', async (id_categoria) => {
    try {
        const response = await Axios.get(`${URL}/user/get-partidos`, {
            params: { id_categoria: id_categoria }
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response : error);
        throw error;
    }
});

export const fetchPartidosByEdiciones = createAsyncThunk(
    'partidos/fetchPartidosByEdiciones',
    async (ediciones) => {
        try {
            const idsEdiciones = ediciones.map(ed => ed.id_edicion);
            const response = await Axios.get(`${URL}/user/get-partidos`, {
                params: { idsEdiciones: idsEdiciones.join(',') }
            });
            return response.data;
        } catch (error) {
            console.error("Error:", error.response ? error.response : error);
            throw error;
        }
    }
);

const partidosSlice = createSlice({
    name: 'partidos',
    initialState: {
        loading: false,
        data: [],
        data_planillero: [],
        error: '',
    },
    reducers: {
        setPartidos: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchPartidos
            .addCase(fetchPartidos.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchPartidos.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPartidos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // fetchPartidosPlanillero
            .addCase(fetchPartidosPlanillero.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchPartidosPlanillero.fulfilled, (state, action) => {
                state.loading = false;
                state.data_planillero = action.payload; // Guardar los datos específicos
            })
            .addCase(fetchPartidosPlanillero.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // fetchPartidosbByCategoria
            .addCase(fetchPartidosbByCategoria.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchPartidosbByCategoria.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;  // Aquí guardamos los partidos filtrados por categoría
            })
            .addCase(fetchPartidosbByCategoria.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setPartidos } = partidosSlice.actions;

export default partidosSlice.reducer;
