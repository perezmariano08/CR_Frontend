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

export const verificarCategoriaJugadorEventual = async (dni, id_categoria, id_equipo) => {
    try {
        const response = await Axios.get(`${URL}/user/get-jugador-eventual-categoria?dni=${dni}&id_categoria=${id_categoria}&id_equipo=${id_equipo}`);
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

export const traerJugadoresDestacados = async (id_partido) => {
    try {
        const response = await Axios.get(`${URL}/planilla/get-jugadores-destacados?id_partido=${id_partido}`)
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

export const insertarMvp = async (id_partido, id_jugador) => {
    try {
        const response = await Axios.put(`${URL}/planilla/insertar-mvp-partido?id_partido=${id_partido}&id_jugador=${id_jugador}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const insertarJugadorEventual = async (jugador_eventual) => {
    try {
        const response = await Axios.post(`${URL}/planilla/insertar-jugador-eventual`, jugador_eventual)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const armarDreamteam = async (id_categoria, fecha) => {
    try {
        const response = await Axios.post(`${URL}/user/armar-dreamteam`, { id_categoria, fecha })
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    } 
}

export const actualizarPartidoVacante = async (id_partido) => {
    try {
        const response = await Axios.post(`${URL}/user/actualizar-partido-vacante`, { id_partido })
        return response.data;
    } catch (error) {   
        console.error('Error en la peticion', error);
        return false
    }
}

export const determinarVentaja = async (id_zona, vacante) => {
    try {
        const response = await Axios.get(`${URL}/user/determinar-ventaja`, { id_zona, vacante } )
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const getPartidosCategoria = async (id_categoria) => {
    try {
        // Cambia a GET y envía los parámetros como query
        const response = await Axios.get(`${URL}/admin/get-partidos-categoria`, {
            params: { id_categoria } // Pasar los parámetros aquí
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los partidos de la zona:", error);
    }
};

export const getPartidosZona = async (id_zona, vacante) => {
    try {
        // Cambia a GET y envía los parámetros como query
        const response = await Axios.get(`${URL}/admin/get-partido-zona`, {
            params: { id_zona, vacante } // Pasar los parámetros aquí
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los partidos de la zona:", error);
    }
};

export const insertarFase = async (data) => {
    try {
        const response = await Axios.post(`${URL}/admin/create-fases`, data);
    } catch (error) {
        console.error("Error al insertar la fase:", error);
    }
};

export const getIdPartidosZona = async (id_zona) => {
    try {
        const response = await Axios.get(`${URL}/admin/get-partidos-zona`, {
            params: { id_zona }
        });
        return response.data;
    } catch (error) {
        return []; // Retorna un array vacío en caso de error
    }
};

export const getEtapas = async () => {
    try {
        const response = await Axios.get(`${URL}/admin/get-etapas`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las etapas:", error);
    }
};

export const checkEquipoPlantel = async (idEquipo, idEdicion) => {
    try {
        const response = await Axios.get(`${URL}/admin/check-equipo-plantel`, {
            params: {
                id_equipo: idEquipo,
                id_edicion: idEdicion
            }
        });
        return response.data
    } catch (error) {
        console.error("Error al consultar el plantel del equipo:", error);
    }
}

export const getIncidenciasPlanilla = async (id_partido) => {
    try {
        const res = await Axios.get(`${URL}/planilla/get-partidos-incidencias?id_partido=${id_partido}`);
        return res.data[0];
    } catch (error) {
        console.error("Error al consultar las incidencias del partido", error);
    }
}

export const getFormaciones = async (partidoId) => {
    try {
        const res = await Axios.get(`${URL}/planilla/get-partido-formaciones?id_partido=${partidoId}`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error en el front', error);
    }
};

export const firmaJugador = async (id_partido, id_jugador, dorsal) => {
    try {
        const res = await Axios.post(`${URL}/planilla/firma-jugador`, { id_partido, id_jugador, dorsal });
        return res.data;
    } catch (error) {
        console.error('Error en el front', error);
    }
};

export const insertarJugadorDestacado = async (id_categoria, id_partido, id_equipo, id_jugador) => {
    try {
        const response = await Axios.post(`${URL}/planilla/insertar-jugador-destacado`, { id_categoria, id_partido, id_equipo, id_jugador })
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const eliminarJugadorDestacado = async (id_categoria, id_partido, id_jugador) => {
    try {
        const response = await Axios.delete(`${URL}/planilla/eliminar-jugador-destacado`, {
            params: { id_categoria, id_partido, id_jugador }
        });
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false;
    }
};

export const borrarFirmaJugador = async (id_partido, id_jugador) => {
    try {
        const response = await Axios.delete(`${URL}/planilla/delete-firma-jugador`, {
            params: { id_partido, id_jugador }
        });
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false;
    }
};

export const borrarIncidencia = async (tipo, id_partido, id_accion, id_equipo, id_jugador) => { 
    try {
        const response = await Axios.delete(`${URL}/planilla/eliminar-${tipo}`, {
            params: { id_partido, id_accion, id_equipo, id_jugador }
        });
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false;
    }
}

export const getEdicion = async (id_edicion) => {
    try {
        const response = await Axios.get(`${URL}/planilla/get-edicion`, {
            params: { id_edicion }
        });
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false;
    }
};

export const checkPartidosEventual = async (id_partido, dni) => {
    try {
        const response = await Axios.get(`${URL}/planilla/check-partidos-eventual`, { params: { id_partido, dni } });
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false;
    }
};

export const verificarJugadores = async (id_partido) => {
    try {
        const response = await Axios.get(`${URL}/planilla/verificar-comienzo-partido?id_partido=${id_partido}`)
        return response.data;
    } catch (error) {
        console.error('Error en la peticion', error);
        return false
    }
}

export const actualizarEstadoPartido = async (id_partido) => {
    try {
        const response = await Axios.put(`${URL}/planilla/actualizar-estado-partido`, { id_partido });
        return response.data;
    } catch (error) {
        console.error('Error en la petición', error);
        return { mensaje: "Error al actualizar el estado del partido" }
    }
};

export const actualizarPartido = async (data) => {
    try {
        const response = await Axios.put(`${URL}/planilla/actualizar-partido`, { data });
        return response.data;
    } catch (error) {
        console.error('Error en la petición', error);
        return { mensaje: "Error al actualizar el estado del partido" }
    }
}

export const suspenderPartido = async (token, data) => {
    try {
        const response = await Axios.put(`${URL}/planilla/suspender-partido`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error en la petición', error);
        return { mensaje: "Error al suspender el partido" }
    }
}

export const updateSancionados = async (token) => {
    try {
        await Axios.post(`${URL}/planilla/calcular-expulsiones`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        toast.error('Error al actualizar las sanciones.');
        console.error('Error al actualizar las sanciones:', error);
    }
};