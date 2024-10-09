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

export const traerPartidosEventuales = async (id_categoria) => {
    try {
        const response = await Axios.get(`${URL}/user/get-partidos-eventuales?id_categoria=${id_categoria}`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error en la petición', error);
        return [];
    }
};

export const traerPlantelesPartido = async (id_partido) => {
    try {
        const response = await Axios.get(`${URL}/user/get-planteles-partido?id_partido=${id_partido}`)
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error en la petición', error);
        return [];
    }
}

export const verificarJugadorEventual = async (dni, id_categoria) => {
    try {
        const response = await Axios.get(`${URL}/user/verificar-jugador?dni=${dni}&id_categoria=${id_categoria}`)
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error en la petición', error);
        return [];
    }
}

export const getSanciones = async () => {
    try {
        const response = await Axios.get(`${URL}/user/get-expulsados`)
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error en la petición', error);
        return [];
    }
}

export const verificarCategoriaJugadorEventual = async (dni, id_categoria, id_equipo, id_partido) => {
    try {
        const response = await Axios.get(`${URL}/user/get-jugador-eventual-categoria?dni=${dni}&id_categoria=${id_categoria}&id_equipo=${id_equipo}&id_partido=${id_partido}`);
        return response.data;
    } catch (error) {
        console.error('Error en la petición', error);
        return false;
    }
};

export const traerNovedades = async (id_rol) => {
    try {
        const response = await Axios.get(`${URL}/user/get-novedades?id_rol=${id_rol}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const traerJugadoresDestacados = async (id_categoria, jornada) => {
    try {
        const response = await Axios.get(`${URL}/user/get-jugadores-destacados?id_categoria=${id_categoria}&jornada=${jornada}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const actualizarJugadoresDestacados = async (data) => {
    try {
        const response = await Axios.put(`${URL}/user/actualizar-jugadores-destacados`, data)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const limpiarJugadoresDescatados = async (jornada) => {
    try {
        const response = await Axios.put(`${URL}/user/resetear-jugadores-destacados?jornada=${jornada}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const traerJugadoresPorCategoria = async (id_categoria, jornada) => {
    try {
        const response = await Axios.get(`${URL}/user/get-jugadores-categoria?id_categoria=${id_categoria}&jornada=${jornada}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const verificarJugadores = async (id_partido) => {
    try {
        const response = await Axios.get(`${URL}/user/verificar-comienzo-partido?id_partido=${id_partido}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const insertarJugadorDestacado = async (id_categoria, id_partido, jugador) => {
    try {
        const response = await Axios.post(`${URL}/user/insertar-jugador-destacado?id_partido=${id_partido}&id_categoria=${id_categoria}`, jugador)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const eliminarJugadorDestacado = async (id_categoria, id_partido, id_jugador) => {
    try {
        const response = await Axios.delete(`${URL}/user/eliminar-jugador-destacado?id_partido=${id_partido}&id_categoria=${id_categoria}&id_jugador=${id_jugador}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const insertarMvp = async (id_partido, id_jugador) => {
    try {
        const response = await Axios.put(`${URL}/user/insertar-mvp-partido?id_partido=${id_partido}&id_jugador=${id_jugador}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const insertarJugadorEventual = async (jugador_eventual) => {
    try {
        const response = await Axios.post(`${URL}/user/insertar-jugador-eventual`, jugador_eventual)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}