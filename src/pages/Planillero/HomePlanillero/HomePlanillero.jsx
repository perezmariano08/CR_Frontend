import React, { useEffect } from 'react';
import { HomeWrapper } from '../../Home/HomeStyles';
import Section from '../../../components/Section/Section';
import { HomePlanilleroContainer } from './HomePlanilleroStyles';
import CardPartido from '../../../components/Stats/CardPartido/CardPartido';
import { useAuth } from '../../../Auth/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setMatches } from '../../../redux/Matches/matchesSlice';

const HomePlanillero = () => {
    const dispatch = useDispatch();
    const { userId, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    const jugadoresData = useSelector((state) => state.jugadores.data);
    const loadingPartidos = useSelector((state) => state.partidos.loading);
    const matches = useSelector((state) => state.match)

    useEffect(() => {
        if (userName && showWelcomeToast) {
            toast(`Bienvenid@, ${userName}`, {
                icon: '👋',
                style: {
                    borderRadius: '10px',
                    background: 'var(--gray-500)',
                    color: 'var(--white)',
                },
                duration: 4000,
                position: "top-center"
            });
            setShowWelcomeToast(false);
        }
    }, [userName, showWelcomeToast, setShowWelcomeToast]);

    useEffect(() => {
            dispatch(fetchPartidos());
            dispatch(fetchEquipos());
            dispatch(fetchJugadores());
    }, [dispatch]);

    //CARGA PRINCIPAL DE OBJETO CONSUMIENDO BASE DE DATOS
    useEffect(() => {
        if (partidos.length > 0 && equipos.length > 0 && jugadoresData.length > 0 && matches.length === 0) {
            const partidosFiltrados = partidos.filter((partido) => partido.id_planillero === userId);

            const matches = partidosFiltrados.map((partido) => {
                const localEquipo = equipos.find(equipo => equipo.id_equipo === partido.id_equipoLocal);
                const visitanteEquipo = equipos.find(equipo => equipo.id_equipo === partido.id_equipoVisita);

                const localJugadores = jugadoresData.filter(jugador => jugador.id_equipo === localEquipo.id_equipo);
                const visitanteJugadores = jugadoresData.filter(jugador => jugador.id_equipo === visitanteEquipo.id_equipo);

                return {
                    ID: partido.id_partido,
                    matchState: null,
                    descripcion: null,
                    jugador_destacado: null,
                    Local: {
                        id_equipo: localEquipo.id_equipo,
                        Nombre: localEquipo.nombre,
                        Player: localJugadores.map(jugador => ({
                            ID: jugador.id_jugador,
                            Nombre: `${jugador.nombre} ${jugador.apellido}`,
                            DNI: jugador.dni,
                            Dorsal: '',
                            status: false,
                            sancionado: jugador.sancionado,
                            eventual: jugador.eventual
                        }))
                    },
                    Visitante: {
                        id_equipo: visitanteEquipo.id_equipo,
                        Nombre: visitanteEquipo.nombre,
                        Player: visitanteJugadores.map(jugador => ({
                            ID: jugador.id_jugador,
                            Nombre: `${jugador.nombre} ${jugador.apellido}`,
                            DNI: jugador.dni,
                            Dorsal: '',
                            status: false,
                            sancionado: jugador.sancionado,
                            eventual: jugador.eventual
                        }))
                    }
                };
            });
            dispatch(setMatches(matches));
        }
    }, [partidos, equipos, jugadoresData, userId, dispatch]);

    const partidosFiltrados = partidos.filter((partido) => partido.id_planillero === userId);

    return (
        <HomePlanilleroContainer>
            <HomeWrapper>
                <Section>
                    {
                        partidosFiltrados && partidosFiltrados.length > 0 ?(
                            <h2>Mis Partidos</h2>
                        ) : (
                            <h2>No tienes partidos cargados</h2>
                    )}
                    {loadingPartidos ? (
                        <p>Cargando partidos...</p>
                    ) : (
                        partidosFiltrados.map((partido) => (
                            <CardPartido key={partido.id_partido} observer partido={partido}/>
                        ))
                    )}
                </Section>
            </HomeWrapper>
            <Toaster />
        </HomePlanilleroContainer>
    );
}

export default HomePlanillero;
