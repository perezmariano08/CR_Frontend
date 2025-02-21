import React, { useEffect, useState } from 'react';
import {
    Fila,
    Jugador,
    LogoJugador,
    NombreJugador,
    DreamTeamCardWrapper,
    SvgBackground
} from './DreamTeamCardStyles';
import { URLImages } from '../../utils/utils';
import { useJugadores } from '../../hooks/useJugadores.js';
import { useEquipos } from '../../hooks/useEquipos.js';
import { getDreamTeamFecha } from '../../utils/dataFetchers.js';

const DreamTeamCard = ({ jornada, id_categoria }) => {
    
    const { fotosJugadores } = useJugadores();
    const { escudosEquipos } = useEquipos();
    const [dreamTeam, setDreamTeam] = useState([]);

    useEffect(() => {
        const fetchDreamTeam = async () => {
            const dreamTeam = await getDreamTeamFecha(id_categoria, jornada);
            setDreamTeam(dreamTeam || []);
        };

        fetchDreamTeam();
    }, [id_categoria, jornada]);
    
    // Define la formación predeterminada
    const formacion = [1, 2, 2, 1, 1];

    // Agrupa jugadores según la formación
    const jugadoresPorFila = [];
    let startIndex = 0;

    formacion.forEach((cantidad) => {
        jugadoresPorFila.push(dreamTeam.slice(startIndex, startIndex + cantidad));
        startIndex += cantidad;
    });

    const filasInvertidas = jugadoresPorFila.reverse();

    return (
        <DreamTeamCardWrapper className='home'>
            {dreamTeam.length > 0 ? (
                filasInvertidas.map((fila, filaIndex) => (
                    <Fila key={filaIndex}>
                        {fila.map((jugador, jugadorIndex) => (
                            <Jugador key={jugadorIndex}>
                                <LogoJugador>
                                    <img
                                        className='logo-jugador'
                                        src={`${URLImages}/${fotosJugadores(jugador.id_jugador)}`}
                                        alt='Jugador'
                                    />
                                    <img
                                        className='logo-equipo'
                                        src={`${URLImages}/${escudosEquipos(jugador.id_equipo)}`}
                                        alt='Equipo'
                                    />
                                </LogoJugador>
                                <NombreJugador>{jugador.nombre} {jugador.apellido}</NombreJugador>
                            </Jugador>
                        ))}
                    </Fila>
                ))
            ) : (
                // Renderiza solo los logos sin jugadores cuando no hay DreamTeam
                formacion.reverse().map((cantidad, filaIndex) => (
                    <Fila key={filaIndex}>
                        {Array.from({ length: cantidad }).map((_, jugadorIndex) => (
                            <Jugador key={jugadorIndex}>
                                <LogoJugador>
                                    <img
                                        className='logo-jugador'
                                        src={`${URLImages}/${fotosJugadores(1)}`}
                                        alt='Jugador'
                                    />
                                </LogoJugador>
                            </Jugador>
                        ))}
                    </Fila>
                ))
            )}

            {/* SVG en el fondo de la caja */}
            <SvgBackground>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 316 174">
                    <g id="Group_4486" data-name="Group 4486" transform="translate(84.168)">
                        <path
                            id="Path_2174"
                            d="M57 0h5.907v50.136a5.92 5.92 0 0 0 5.907 5.9H192.85a5.92 5.92 0 0 0 5.907-5.9V0h5.907v50.136a11.84 11.84 0 0 1-11.813 11.8H68.813A11.84 11.84 0 0 1 57 50.136z"
                            data-name="Path 2174"
                            transform="translate(-57)"
                        ></path>
                    </g>
                    <path
                        id="Path_2175"
                        d="M11.813 150.407h90.813a76.778 76.778 0 0 0 110.748 0h90.813A11.839 11.839 0 0 0 316 138.61V0h-5.906v138.61a5.92 5.92 0 0 1-5.907 5.9H11.813a5.92 5.92 0 0 1-5.907-5.9V0H0v138.61a11.84 11.84 0 0 0 11.813 11.797zm193 0a70.761 70.761 0 0 1-93.619 0z"
                        data-name="Path 2175"
                    ></path>
                </svg>
            </SvgBackground>
        </DreamTeamCardWrapper>
    );
};

export default DreamTeamCard;
