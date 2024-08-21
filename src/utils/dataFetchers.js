import Axios from "axios";
import { URL } from "./utils";

Axios.defaults.withCredentials = true;

export const getPosicionesTemporada = async (id_zona) => {
    try {
        const res = await Axios.get(`${URL}/user/get-posiciones-zona?id_zona=${id_zona}`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

export const getZonas = async () => {
    try {
        const res = await Axios.get(`${URL}/user/get-zonas`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching temporadas:', error);
        throw error;
    }
};

export const getJugadoresEquipo = async (id_zona, equipoId) => {
    try {
        const res = await Axios.get(`${URL}/user/get-jugadores-equipo?id_zona=${id_zona}&id_equipo=${equipoId}`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error en la peticion', error);
    }
};

export const getEstadisticasTemporada = async (estadistica, id_categoria) => {
    try {
        const res = await Axios.get(`${URL}/user/get-estadistica-categoria`, {
            params: {
                estadistica,
                id_categoria
            },
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching estadisticas:', error);
        throw error;
    }
};

export const getFormaciones = async (partidoId) => {
    try {
        const res = await Axios.get(`${URL}/user/get-partidos-formaciones?id_partido=${partidoId}`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error en el front', error);
    }
};

export const getIndicencias = async (partidoId) => {
    try {
        const res = await Axios.get(`${URL}/user/get-partidos-incidencias?id_partido=${partidoId}`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error en el front', error);
    }
};

export const traerPartidosEventuales = async () => {
    try {
        const response = await Axios.get(`${URL}/user/get-partidos-eventuales`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error en la petición', error);
        return [];
    }
};

