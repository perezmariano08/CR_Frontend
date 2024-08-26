import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartidos } from '../redux/ServicesApi/partidosSlice';
import { fetchEquipos } from '../redux/ServicesApi/equiposSlice';
import { setMatches } from '../redux/Matches/matchesSlice';
import { traerPlantelesPartido } from '../utils/dataFetchers';

const useFetchMatches = (filterCondition) => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    
    // Función para comparar dos arreglos de partidos
    const areMatchesEqual = (matches1, matches2) => {
        if (matches1.length !== matches2.length) return false;
        return matches1.every((match, index) => match.ID === matches2[index].ID);
    };

    useEffect(() => {
        dispatch(fetchPartidos());
        dispatch(fetchEquipos());
    }, [dispatch]);

    useEffect(() => {
        const fetchPlanteles = async (id_partido) => {
            try {
                const data = await traerPlantelesPartido(id_partido);
                return data;
            } catch (error) {
                console.error('Error al obtener planteles:', error);
                return [];
            }
        };

        const fetchMatchesData = async () => {
            if (partidos.length > 0 && equipos.length > 0) {
                const partidosFiltrados = partidos.filter(filterCondition);

                const matchesData = await Promise.all(partidosFiltrados.map(async (partido) => {
                    const plantelesData = await fetchPlanteles(partido.id_partido);
                    
                    const localEquipo = equipos.find((equipo) => equipo.id_equipo === partido.id_equipoLocal);
                    const visitanteEquipo = equipos.find((equipo) => equipo.id_equipo === partido.id_equipoVisita);

                    // Filtra los jugadores locales y visitantes de acuerdo a los datos obtenidos de planteles
                    const localJugadores = plantelesData.filter(
                        (jugador) => jugador.id_equipo === localEquipo.id_equipo
                    );
                    const visitanteJugadores = plantelesData.filter(
                        (jugador) => jugador.id_equipo === visitanteEquipo.id_equipo
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
                            id_equipo: localEquipo.id_equipo,
                            Nombre: localEquipo.nombre,
                            Player: localJugadores.map((jugador) => ({
                                ID: jugador.id_jugador,
                                Nombre: `${jugador.nombre_jugador}`,
                                DNI: jugador.dni,
                                Dorsal: '',
                                status: false,
                                sancionado: jugador.sancionado,
                                eventual: jugador.eventual,
                            })),
                        },
                        Visitante: {
                            id_equipo: visitanteEquipo.id_equipo,
                            Nombre: visitanteEquipo.nombre,
                            Player: visitanteJugadores.map((jugador) => ({
                                ID: jugador.id_jugador,
                                Nombre: `${jugador.nombre_jugador}`,
                                DNI: jugador.dni,
                                Dorsal: '',
                                status: false,
                                sancionado: jugador.sancionado,
                                eventual: jugador.eventual,
                            })),
                        },
                    };
                }));

                const storedMatches = JSON.parse(localStorage.getItem('matches')) || [];

                if (!areMatchesEqual(matchesData, storedMatches)) {
                    dispatch(setMatches(matchesData));
                    localStorage.setItem('matches', JSON.stringify(matchesData));
                }
            }
        };

        fetchMatchesData();
    }, [partidos, equipos, dispatch, filterCondition]);
};

export default useFetchMatches;
