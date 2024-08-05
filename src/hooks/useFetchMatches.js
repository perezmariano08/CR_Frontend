import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartidos } from '../redux/ServicesApi/partidosSlice';
import { fetchEquipos } from '../redux/ServicesApi/equiposSlice';
import { fetchJugadores } from '../redux/ServicesApi/jugadoresSlice';
import { setMatches } from '../redux/Matches/matchesSlice';

const useFetchMatches = (filterCondition) => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    const jugadoresData = useSelector((state) => state.jugadores.data);

    // Función para comparar dos arreglos de partidos
    const areMatchesEqual = (matches1, matches2) => {
        if (matches1.length !== matches2.length) return false;
        return matches1.every((match, index) => match.ID === matches2[index].ID);
    };

    useEffect(() => {
        dispatch(fetchPartidos());
        dispatch(fetchEquipos());
        dispatch(fetchJugadores());
    }, [dispatch]);

    useEffect(() => {
        if (partidos.length > 0 && equipos.length > 0 && jugadoresData.length > 0) {
            const partidosFiltrados = partidos.filter(filterCondition);

            const matchesData = partidosFiltrados.map((partido) => {
                const localEquipo = equipos.find((equipo) => equipo.id_equipo === partido.id_equipoLocal);
                const visitanteEquipo = equipos.find((equipo) => equipo.id_equipo === partido.id_equipoVisita);

                const localJugadores = jugadoresData.filter(
                    (jugador) => jugador.id_equipo === localEquipo.id_equipo && jugador.eventual === 'N'
                );
                const visitanteJugadores = jugadoresData.filter(
                    (jugador) => jugador.id_equipo === visitanteEquipo.id_equipo && jugador.eventual === 'N'
                );

                return {
                    ID: partido.id_partido,
                    matchState: null,
                    descripcion: null,
                    jugador_destacado: null,
                    Local: {
                        id_equipo: localEquipo.id_equipo,
                        Nombre: localEquipo.nombre,
                        Player: localJugadores.map((jugador) => ({
                            ID: jugador.id_jugador,
                            Nombre: `${jugador.nombre} ${jugador.apellido}`,
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
                            Nombre: `${jugador.nombre} ${jugador.apellido}`,
                            DNI: jugador.dni,
                            Dorsal: '',
                            status: false,
                            sancionado: jugador.sancionado,
                            eventual: jugador.eventual,
                        })),
                    },
                };
            });

            const storedMatches = JSON.parse(localStorage.getItem('matches')) || [];

            if (!areMatchesEqual(matchesData, storedMatches)) {
                dispatch(setMatches(matchesData));
                localStorage.setItem('matches', JSON.stringify(matchesData));
            }
        }
    }, [partidos, equipos, jugadoresData, dispatch, filterCondition]);
};

export default useFetchMatches;
