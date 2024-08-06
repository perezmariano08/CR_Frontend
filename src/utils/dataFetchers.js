import Axios from "axios";
import { URL } from "./utils";

Axios.defaults.withCredentials = true;

export const getPosicionesTemporada = async (id_temporada) => {
    try {
        const res = await Axios.get(`${URL}/user/get-posiciones-temporada?id_temporada=${id_temporada}`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

export const getTemporadas = async () => {
    try {
        const res = await Axios.get(`${URL}/user/get-temporadas`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching temporadas:', error);
        throw error;
    }
};

export const getJugadoresEquipo = async (id_temporada, equipoId) => {
    try {
        const res = await Axios.get(`${URL}/user/get-jugadores-equipo?id_temporada=${id_temporada}&id_equipo=${equipoId}`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error en la peticion', error);
    }
};

export const getEstadisticasTemporada = async (estadistica, id_temporada) => {
    try {
        const res = await Axios.get(`${URL}/user/get-estadistica-temporada`, {
            params: {
                estadistica,
                id_temporada
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
