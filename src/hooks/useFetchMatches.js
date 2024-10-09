import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartidos } from '../redux/ServicesApi/partidosSlice';
import { fetchEquipos } from '../redux/ServicesApi/equiposSlice';
import { setMatches } from '../redux/Matches/matchesSlice';
import { traerPlantelesPartido } from '../utils/dataFetchers';
import { useWebSocket } from '../Auth/WebSocketContext.jsx';

const useFetchMatches = (filterCondition) => {
    const socket = useWebSocket();
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);

    const plantelesCache = useRef(new Map()); // Cache para las planteles de cada partido

    // Función optimizada para traer planteles, utilizando cache
    const fetchPlanteles = useCallback(async (id_partido) => {
        if (plantelesCache.current.has(id_partido)) {
            return plantelesCache.current.get(id_partido);
        }
        try {
            const data = await traerPlantelesPartido(id_partido);
            plantelesCache.current.set(id_partido, data); // Almacenar en cache
            return data;
        } catch (error) {
            console.error('Error al obtener planteles:', error);
            return [];
        }
    }, []);

    // Fetch partidos y equipos siempre que se monta el componente
    useEffect(() => {
        dispatch(fetchPartidos());
        dispatch(fetchEquipos());
    }, [dispatch]);

    // Actualizar partidos cuando se recibe un evento del socket relacionado con el estado o las acciones
    useEffect(() => {
        const handleEstadoPartidoActualizado = (data) => {
            if (data) {
                dispatch(fetchPartidos())
                    .then((partidos) => {
                        console.log('Partido actualizado:', data.idPartido);
                    })
                    .catch(error => console.error('Error actualizando el partido:', error));
            }
        };
    
        const handleNewIncidence = () => {
            dispatch(fetchPartidos()); // Actualizar partidos cuando hay una nueva acción
        };
    
        const handleIncidenciaEliminada = () => {
            dispatch(fetchPartidos()); // Actualizar partidos cuando se elimina una acción
        };
    
        // Suscripción a los eventos de socket
        socket.on('estadoPartidoActualizado', handleEstadoPartidoActualizado);
        socket.on('nuevaAccion', handleNewIncidence);
        socket.on('eliminarAccion', handleIncidenciaEliminada);
    
        return () => {
            // Limpiar suscripciones
            socket.off('estadoPartidoActualizado', handleEstadoPartidoActualizado);
            socket.off('nuevaAccion', handleNewIncidence);
            socket.off('eliminarAccion', handleIncidenciaEliminada);
        };
    }, [socket, dispatch]);

    // Fetch planteles solo cuando partidos o equipos cambien
    useEffect(() => {
        const fetchMatchesData = async () => {
            if (partidos.length > 0 && equipos.length > 0) {
                const partidosFiltrados = partidos.filter(filterCondition);

                const matchesData = await Promise.all(partidosFiltrados.map(async (partido) => {
                    const plantelesData = await fetchPlanteles(partido.id_partido);
                    const localEquipo = equipos.find(equipo => equipo.id_equipo === partido.id_equipoLocal);
                    const visitanteEquipo = equipos.find(equipo => equipo.id_equipo === partido.id_equipoVisita);

                    const localJugadores = plantelesData.filter(
                        jugador => jugador.id_equipo === localEquipo?.id_equipo
                    );
                    const visitanteJugadores = plantelesData.filter(
                        jugador => jugador.id_equipo === visitanteEquipo?.id_equipo
                    );

                    return {
                        ID: partido.id_partido,
                        matchState: null,
                        descripcion: null,
                        jugador_destacado: null,
                        id_edicion: partido.id_edicion,
                        id_categoria: partido.id_categoria,
                        id_zona: partido.id_zona,
                        Local: {
                            id_equipo: localEquipo?.id_equipo,
                            Nombre: localEquipo?.nombre,
                            Player: localJugadores.map(jugador => ({
                                ID: jugador.id_jugador,
                                Nombre: jugador.nombre_jugador,
                                DNI: jugador.dni,
                                Dorsal: '',
                                status: false,
                                sancionado: jugador.sancionado,
                                eventual: jugador.eventual,
                            })) || [],
                        },
                        Visitante: {
                            id_equipo: visitanteEquipo?.id_equipo,
                            Nombre: visitanteEquipo?.nombre,
                            Player: visitanteJugadores.map(jugador => ({
                                ID: jugador.id_jugador,
                                Nombre: jugador.nombre_jugador,
                                DNI: jugador.dni,
                                Dorsal: '',
                                status: false,
                                sancionado: jugador.sancionado,
                                eventual: jugador.eventual,
                            })) || [],
                        },
                    };
                }));

                dispatch(setMatches(matchesData));
            }
        };

        fetchMatchesData();
    }, [partidos, equipos, fetchPlanteles, filterCondition, dispatch]);
};

export default useFetchMatches;
